import { type Plugin } from '@envelop/core'
import { Logger } from '../utils/logger'
import { NoSchemaIntrospectionCustomRule } from 'graphql'
import { GraphQLError } from 'graphql'
/**
 * Monitor plugin to get event contextual logs and add some security rules.
 * Used to:
 * - log the GraphQL Query event
 * - add a disabled introspection validation rule
 * - remove suggestion messages
 * - log the execute result summary with execution duration
 * - remove not allowed introspection in the result
 */

const formatter = (error: GraphQLError, mask: string): GraphQLError => {
  if (error instanceof GraphQLError) {
    error.message = error.message.replace(/Did you mean ".+"/g, mask)
  }
  return error as GraphQLError
}

export default ({ options }): Plugin => {
  // Not allowed by default
  const allowIntrospection =
    options?.introspection?.allow || process.env['ENABLED_INTROSPECTION'] || false
  // Low info in log by default
  const resultLogInfoLevel = options?.resultLogInfoLevel ? options.resultLogInfoLevel : 'low'
  const denyIntrospectionHeaderName = options?.introspection?.denyHeaderName || null
  const denyIntrospectionHeaderValue = options?.introspection?.denyHeaderValue || null
  const allowIntrospectionHeaderName = options?.introspection?.allowHeaderName || null
  const allowIntrospectionHeaderValue = options?.introspection?.allowHeaderValue || null
  const isMaskSuggestion = options?.maskSuggestion?.enabled || false
  const maskSuggestionMessage = options?.maskSuggestion?.message || ''

  return {
    onParse({ context }) {
      if (options.logOnParse) {
        Logger.graphqlQuery(context['request']['headers'], context['params'])
      }
    },

    onValidate: ({ addValidationRule, context }) => {
      const headers = context['request'].headers
      let deny = true
      /*
        allowIntrospection = false: introspection denied for all
        denyIntrospectionHeaderName: name of the header to check to deny introspection, e.g., public proxy header
        allowIntrospectionHeaderName: name of the header to allow if this header and value are present
      */
      if (allowIntrospection) {
        // Introspection may be allowed
        deny = false
        // If there exists a header to deny introspection
        if (denyIntrospectionHeaderName) {
          if (headers.get(denyIntrospectionHeaderName)) {
            if (headers.get(denyIntrospectionHeaderName).includes(denyIntrospectionHeaderValue)) {
              Logger.denyIntrospection(
                'onValidate',
                'Denied by headers ' +
                  denyIntrospectionHeaderName +
                  ': ' +
                  headers.get(denyIntrospectionHeaderName),
                headers
              )
              deny = true
            }
          }
        }
        // If there exists a mandatory header to allow introspection
        if (allowIntrospectionHeaderName) {
          deny = true
          if (headers.get(allowIntrospectionHeaderName)) {
            if (headers.get(allowIntrospectionHeaderName).includes(allowIntrospectionHeaderValue)) {
              Logger.allowIntrospection(
                'onValidate',
                'Allowed by headers ' +
                  allowIntrospectionHeaderName +
                  ': ' +
                  headers.get(allowIntrospectionHeaderName).substring(0, 4) +
                  '...',
                headers
              )
              deny = false
            } else {
              Logger.denyIntrospection(
                'onValidate',
                'Denied by bad header value ' +
                  allowIntrospectionHeaderName +
                  ': ' +
                  headers.get(allowIntrospectionHeaderName).substring(0, 4) +
                  '...',
                headers
              )
            }
          } else {
            Logger.denyIntrospection(
              'onValidate',
              'Denied by missing header ' + allowIntrospectionHeaderName,
              headers
            )
          }
        }
      }
      if (deny) {
        addValidationRule(NoSchemaIntrospectionCustomRule)
      }

      return function onValidateEnd({ valid, result, setResult }) {
        if (isMaskSuggestion && !valid) {
          setResult(result.map((error: GraphQLError) => formatter(error, maskSuggestionMessage)))
        }
      }
    },

    onExecute(/* { args, extendContext } */) {
      let timestampStart = new Date().getTime()
      return {
        before() {
          timestampStart = new Date().getTime()
        },
        onExecuteDone({ result, args }) {
          const timestampEnd = new Date().getTime()
          // Shortcut to disable introspection response in case of bad configuration rule
          if (!allowIntrospection && args.contextValue['params'].query.includes('__schema')) {
            result['data'] = {}
            result['errors'] = [{ message: 'Forbidden' }]
            Logger.error(
              'SECU',
              'onExecute',
              'Introspection query detected and not allowed',
              args.contextValue['params']
            )
          }
          if (options.logOnExecuteDone) {
            Logger.endExec(
              args.contextValue['request']['headers'],
              result,
              timestampEnd - timestampStart,
              resultLogInfoLevel
            )
          }
        }
      }
    }
  }
}
