import { Plugin } from 'graphql-yoga'
import { Logger } from '../utils/logger'
import { GraphQLError } from 'graphql'
import { v4 as uuidv4 } from 'uuid'
/**
 * monitor plugin in order to get event contextual log and add some security rules
 * useful to :
 * - log new request comming event
 * - add request timestamp in headers to get duration time
 * - monitor instropection request
 * - mask error in result is required ( ex in production )
 * - log response sumary event
 * - remove a eventualy not allowed instropection data in result
 */

export function useYagaMonitoring({ options }): Plugin {
	const isMaskErrors = options?.maskError?.enabled || process.env['MASK_ERRORS'] || false
	// filter error in production anyway
	const isFilterError = options?.filterError?.enabled || process.env['FILTER_ERRORS'] == 'true' || process.env['IS_PROUCTION_ENV'] == 'true' || false
	const errorMaskMessage = options?.maskError?.message ? options.maskError.message : "something goes wrong"
	const responseLogInfoLevel = options?.responseLogInfoLevel ? options.responseLogInfoLevel : "low"
	const resultLogInfoLevel = options?.resultLogInfoLevel ? options.resultLogInfoLevel : "medium"

	return {
		onRequest({ request/*, fetchAPI, endResponse */ }) {
			if (options.LogOnRequest) {
				// log only graphql request, avoid log other request like metric requests
				if (request.url.includes("/graphql")) {
					Logger.onRequest(request)
				}
			}

			// add resuestTimestamp in headers
			const timestamp = new Date().getTime();
			request.headers.append("requestTimestamp", String(timestamp))

			// add x-request-id in header if not present
			if (!request.headers.get('x-request-id')) {
				request.headers.append("x-request-id", uuidv4())
			}

		},
		onRequestParse(args) {
			const beforeTimestamp = new Date().getTime();
			let requestHeaders = args.request.headers
			return {
				onRequestParseDone(nRequestParseDoneEventPayload) {
					const timestamp = new Date().getTime();
					if (options.logOnRequestParseDone) {
						Logger.onRequestParseDone(requestHeaders, nRequestParseDoneEventPayload.requestParserResult['query'], nRequestParseDoneEventPayload.requestParserResult['operationName'], nRequestParseDoneEventPayload.requestParserResult['variables'], timestamp - beforeTimestamp)
					}
					if (nRequestParseDoneEventPayload.requestParserResult['query'].includes('__schema')) {
						Logger.introspection( requestHeaders, nRequestParseDoneEventPayload.requestParserResult['query'])
					}
				}
			}
		},
		onResultProcess(args) {
			if (options.logOnResultProcess) {
				// calculate duration from request timestamp
				let requestTimestamp: number = 0
				if (args.request['headers']) {
					const requestTimestampString = args.request['headers'].get('requesttimestamp')
					if (requestTimestampString) {
						requestTimestamp = parseInt(requestTimestampString)
					}
				}
				const responseTimestamp = new Date().getTime();
				Logger.onResultProcess(args.request, args.result, requestTimestamp > 0 ? responseTimestamp - requestTimestamp : 0, resultLogInfoLevel)
			}
			// if we want to replace all message with a generic message
			if (isMaskErrors) {
				if (args.result['errors']) {
					let errors = args.result['errors']
					for (let i = 0; i < errors.length; i++) {
						errors[i] = errorMaskMessage
					}
				}
			} else {
				// if we want to filter error to only return the message, don't return extend information like stacktrace
				if (isFilterError) {
					if (args.result['errors']) {
						let errors = args.result['errors']
						for (let i = 0; i < errors.length; i++) {
							errors[i] = new GraphQLError(filterErrorMessage(errors[i]['message']))
						}

					}

				}
			}
		},

		onResponse({ request, response }) {
			// dont log options http
			if (request.method != 'OPTIONS') {
				if (options.logOnResponse) {
					// only log graphql request don't log metrics or other requests
					if (request.url.includes("/graphql")) {
						Logger.onResponse(request, response, responseLogInfoLevel)
					}
				}
			}
		}
	}
}

/** filterErrorMessage
 * use to filter error message :
 * - remove disabled introspection
 * todo: add other filter rules to remove non expecting message
*/
function filterErrorMessage(message: string) {
	if (message.includes("introspection has been disabled")) {
		return "forbidden"
	}
	return message
}
