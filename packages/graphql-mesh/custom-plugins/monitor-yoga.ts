import { Plugin } from 'graphql-yoga'
import { Logger } from '../utils/logger'
import { GraphQLError } from 'graphql'

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
	const isMaskErrors = options.maskError?.enabled || process.env['MASK_ERRORS'] || false
	// filter in production anyway
	const isFilterError = options.filterError?.enabled || process.env['FILTER_ERRORS'] == 'true' || process.env['IS_PROUCTION_ENV'] == 'true' || false

	const errorMaskMessage = options.maskError?.message ? options.maskError.message : "something goes wrong"
	const reponseLogInfoLevel = options.reponseLogInfoLevel ? options.reponseLogInfoLevel : "low"
	const resultLogInfoLevel = options.resultLogInfoLevel ? options.resultLogInfoLevel : "low"


	return {
		onRequest({ request/*, fetchAPI, endResponse */ }) {
			Logger.onRequest(request)

			// add resuestTimestamp in headers
			const timestamp = new Date().getTime();
			request.headers.append("requestTimestamp", String(timestamp))
		},
		onRequestParse(args) {
			const beforeTimestamp = new Date().getTime();
			let requestHeaders = args.request.headers
			return {
				onRequestParseDone(nRequestParseDoneEventPayload) {
					const timestamp = new Date().getTime();
					Logger.onRequestParseDone(requestHeaders, nRequestParseDoneEventPayload.requestParserResult['query'], nRequestParseDoneEventPayload.requestParserResult['operationName'], nRequestParseDoneEventPayload.requestParserResult['variables'], timestamp - beforeTimestamp)
					if (nRequestParseDoneEventPayload.requestParserResult['query'].includes('__schema')) {
						Logger.info("IntrospectionQuery", "onRequestParseDone", "introspection detected", nRequestParseDoneEventPayload.requestParserResult['query'])
					}
				}
			}
		},
		onResultProcess(args) {
			Logger.onResultProcess(args.request, args.result, resultLogInfoLevel)
			if (isMaskErrors) {
				if (args.result['errors']) {
					let errors = args.result['errors']
					for (let i = 0; i < errors.length; i++) {
						errors[i] = errorMaskMessage
					}
				}
			} else {
				if (isFilterError) {
					if (args.result['errors']) {
						let errors = args.result['errors']
						
						for (let i = 0; i < errors.length; i++) {
							errors[i]= new GraphQLError(filter(errors[i]['message']))
						}

					}

				}
			}
		},

		onResponse({ request, response }) {
			if (request.method != 'OPTION') {
				Logger.onResponse(request, response, reponseLogInfoLevel)
			}
		}
	}
}

function filter(message: string) {
	if (message.includes("introspection has been disabled")) {
		return "forbidden"
	}
	return message
}
