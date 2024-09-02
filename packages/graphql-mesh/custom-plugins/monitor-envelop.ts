import { type Plugin } from '@envelop/core'
import { Logger } from '../utils/logger'
import { NoSchemaIntrospectionCustomRule } from 'graphql';
import { GraphQLError } from 'graphql';
/**
 * monitor plugin in order to get event contextual log and add some security rules
 * useful to
 * - log the graphql Query event
 * - add desabled introspection validation rule
 * - remove suggestion message
 * - log the execute result summary with executes duration
 * - remove not allowed introspection in result
 */

const formatter = (error: GraphQLError, mask: string): GraphQLError => {
	if (error instanceof GraphQLError) {
		error.message = error.message.replace(/Did you mean ".+"/g, mask);
	}
	return error as GraphQLError;
};
export default ({ options }): Plugin => {
	// not allow by default
	// do not enabled allowIntrospection in production
	const allowIntrospection = process.env['IS_PROUCTION_ENV'] != 'true' && (options?.introspection?.allow || process.env['ENABLED_INTROSPECTION'] || false)
	// low info in log by default
	const resultLogInfoLevel = options?.resultLogInfoLevel ? options.resultLogInfoLevel : "low"
	const denyIntrospectionHeaderName = options?.introspection?.denyHeaderName || null
	const denyIntrospectionHeaderValue = options?.introspection?.denyHeaderValue || null
	const allowIntrospectionHeaderName = options?.introspection?.allowHeaderName || null
	const allowIntrospectionHeaderValue = options?.introspection?.allowHeaderValue || null
	const isMaskSuggestion = options?.maskSuggestion?.enabled || false
	const maskSuggestionMessage = options?.maskSuggestion?.message || ""
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
			   allowIntrospection=false : intropection deny for all
			   denyIntrospectionHeaderName : name of the header to check to deny introspection is deny ex plublic proxy header
			   allowIntrospectionHeaderName : name of the header allow if this header and value is presents
			 */
			// if introspection not allow
			if (allowIntrospection) {
				// intropection may be allow
				deny = false
				// is existed a header to deny introspection
				if (denyIntrospectionHeaderName) {
					if (headers.get(denyIntrospectionHeaderName)) {
						if (headers.get(denyIntrospectionHeaderName).includes(denyIntrospectionHeaderValue)) {
							Logger.denyIntrospection("onValidate", "deny by headers " + denyIntrospectionHeaderName + ": " + headers.get(denyIntrospectionHeaderName), headers)
							deny = true
						}
					}
				}
				// is existed a header mandatory to allow introspection
				if (allowIntrospectionHeaderName) {
					deny = true
					if (headers.get(allowIntrospectionHeaderName)) {
						if (headers.get(allowIntrospectionHeaderName).includes(allowIntrospectionHeaderValue)) {
							Logger.allowIntrospection("onValidate", "allow by headers " + allowIntrospectionHeaderName + ": " + headers.get(allowIntrospectionHeaderName).substring(0, 4) + "...", headers)
							deny = false
						} else {
							Logger.denyIntrospection("onValidate", "deny by bad header value " + allowIntrospectionHeaderName + ": " + headers.get(allowIntrospectionHeaderName).substring(0, 4) + "...", headers)
						}
					} else {
						Logger.denyIntrospection("onValidate", "deny by no header " + allowIntrospectionHeaderName, headers)
					}
				}
			}
			if (deny) {
				addValidationRule(NoSchemaIntrospectionCustomRule)
			}

			return function onValidateEnd({ valid, result, setResult }) {
				if (isMaskSuggestion && !valid) {
					setResult(result.map((error: GraphQLError) => formatter(error, maskSuggestionMessage)));
				}
			};
		},

		onExecute(/*{ args, extendContext }*/) {
			let timestampDebut = new Date().getTime()
			return {
				before() {

					timestampDebut = new Date().getTime()
				},
				onExecuteDone({ result, args }) {
					const timestampDone = new Date().getTime();
					// short cut to desabled introspection response in case of bad configuration rule
					if (!allowIntrospection && args.contextValue['params'].query.includes('__schema')) {
						result['data'] = {}
						result['errors'] = [{ message: "Fordidden" }]
						Logger.error('SECU', 'onExecute', 'Introspection query deteted not allowed', args.contextValue['params'])
					}
					if (options.loOnExecuteDone) {
						Logger.endExec(args.contextValue['request']['headers'], result, timestampDone - timestampDebut, resultLogInfoLevel)
					}
				}
			}
		}
	}
}


