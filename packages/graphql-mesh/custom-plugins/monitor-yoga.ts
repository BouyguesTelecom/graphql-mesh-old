import { Plugin } from 'graphql-yoga'
import { Logger } from '../utils/logger'
import { GraphQLError } from 'graphql'
import { v4 as uuidv4 } from 'uuid'
/**
 * Monitor plugin to get event contextual logs and add some security rules.
 * Used to:
 * - log new incoming request events
 * - add request timestamps in headers to get duration time
 * - monitor introspection requests
 * - mask errors in the result if required (e.g., in production)
 * - log response summary events
 * - remove potentially not allowed introspection data in the result
 */

export function useYogaMonitoring({ options }): Plugin {
  const isMaskErrors = options?.maskError?.enabled || process.env['MASK_ERRORS'] || false
  // Filter errors in production anyway
  const isFilterError =
    options?.filterError?.enabled ||
    process.env['FILTER_ERRORS'] == 'true' ||
    process.env['IS_PRODUCTION_ENV'] == 'true' ||
    false
  const errorMaskMessage = options?.maskError?.message
    ? options.maskError.message
    : 'Something went wrong'
  const responseLogInfoLevel = options?.responseLogInfoLevel
    ? options.responseLogInfoLevel
    : 'medium'
  const resultLogInfoLevel = options?.resultLogInfoLevel ? options.resultLogInfoLevel : 'medium'

  return {
    onRequest({ request /*, fetchAPI, endResponse */ }) {
      if (options.LogOnRequest) {
        // Log only GraphQL requests, avoid logging other requests like metric requests
        if (request.url.includes('/graphql')) {
          Logger.onRequest(request)
        }
      }

      // Add requestTimestamp in headers
      const timestamp = new Date().getTime()
      request.headers.append('requestTimestamp', String(timestamp))

      // Add x-request-id in header if not present
      if (!request.headers.get('x-request-id')) {
        request.headers.append('x-request-id', uuidv4())
      }
    },
    onRequestParse(args) {
      const beforeTimestamp = new Date().getTime()
      let requestHeaders = args.request.headers
      return {
        onRequestParseDone(nRequestParseDoneEventPayload) {
          const timestamp = new Date().getTime()
          if (options.logOnRequestParseDone) {
            Logger.onRequestParseDone(
              requestHeaders,
              nRequestParseDoneEventPayload.requestParserResult['query'],
              nRequestParseDoneEventPayload.requestParserResult['operationName'],
              nRequestParseDoneEventPayload.requestParserResult['variables'],
              timestamp - beforeTimestamp
            )
          }
          if (nRequestParseDoneEventPayload.requestParserResult['query'].includes('__schema')) {
            Logger.introspection(
              requestHeaders,
              nRequestParseDoneEventPayload.requestParserResult['query']
            )
          }
        }
      }
    },
    onResultProcess(args) {
      if (options.logOnResultProcess) {
        // Calculate duration from request timestamp
        let requestTimestamp: number = 0
        if (args.request['headers']) {
          const requestTimestampString = args.request['headers'].get('requesttimestamp')
          if (requestTimestampString) {
            requestTimestamp = parseInt(requestTimestampString)
          }
        }
        const responseTimestamp = new Date().getTime()
        Logger.onResultProcess(
          args.request,
          args.result,
          requestTimestamp > 0 ? responseTimestamp - requestTimestamp : 0,
          resultLogInfoLevel
        )
      }
      // If we want to replace all messages with a generic message
      if (isMaskErrors) {
        if (args.result['errors']) {
          let errors = args.result['errors']
          for (let i = 0; i < errors.length; i++) {
            errors[i] = errorMaskMessage
          }
        }
      } else {
        // If we want to filter errors to only return the message, don't return extended information like stack traces
        if (args.result['errors']) {
          if (isFilterError) {
            let errors = args.result['errors']
            for (let i = 0; i < errors.length; i++) {
              // Return only message and path
              errors[i] = new GraphQLError(filterErrorMessage(errors[i]['message']), {
                path: errors[i]['path']
              })
            }
          }
        }
      }
    },

    onResponse({ request, response }) {
      // Don't log OPTIONS HTTP method
      if (request.method != 'OPTIONS') {
        if (options.logOnResponse) {
          // Only log GraphQL requests, don't log metrics or other requests
          if (request.url.includes('/graphql')) {
            Logger.onResponse(request, response, responseLogInfoLevel)
          }
        }
      }
    }
  }
}

/** filterErrorMessage
 * Used to filter error messages:
 * - Removes disabled introspection messages
 * TODO: Add other filter rules to remove unexpected messages
 */
function filterErrorMessage(message: string) {
  if (message.includes('introspection has been disabled')) {
    return 'forbidden'
  }
  return message
}
