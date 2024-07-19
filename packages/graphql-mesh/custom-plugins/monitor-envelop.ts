import { type Plugin } from '@envelop/core'
import { Logger } from '../utils/logger'
import { NoSchemaIntrospectionCustomRule } from 'graphql';
import { GraphQLError } from 'graphql';
/**
 * monitor plugin in order to get event contextual log and add some security rules  
 * useful to 
 * - log the graphql Query event
 * - add desabled instropection alidation rule
 * - remove suggestion  
 * - log the execute result summary with executes duration
 * - remove not allowed instropection in result
 */

const formatter = (error: GraphQLError, mask: string): GraphQLError => {
	if (error instanceof GraphQLError) {
		error.message = error.message.replace(/Did you mean ".+"/g, mask);
	}
	return error as GraphQLError;
};
export default ({ options }): Plugin => {
	// not allow by default
	// do not enabled enabledIntrospection in production 
	const enabledIntrospection =  process.env['IS_PROUCTION_ENV'] != 'true' && ( options.enabledIntrospection || process.env['ENABLED_INTROSPECTION'] || false )
	// low info in log by default
	const resultLogInfoLevel= options.resultLogInfoLevel ? options.resultLogInfoLevel : "low"

	return {
		onParse({ params, context }) {
			Logger.graphqlQuery(context['request']['headers'], context['params'])
			/*return ({ result, context, replaceParseResult }) => {
				Logger.info('LOG', 'onParse', 'result', result)
			}*/
		},

		onValidate: ({ addValidationRule, context }) => {
			if (!enabledIntrospection) {
				addValidationRule(NoSchemaIntrospectionCustomRule)
			}
			return function onValidateEnd({ valid, result, setResult }) {
				if (options.maskSuggestion.enabled && !valid) {
					setResult(result.map((error) => formatter(error, options.maskSuggestion.message)));
				}
			};
		},

		onExecute({ args, extendContext }) {
			
			let timestampDebut = new Date().getTime()
			return {
				before() {
					
					timestampDebut = new Date().getTime()
				},
				onExecuteDone({ result, args }) {
					const timestampDone = new Date().getTime();

					// short cut to desabled introspection response in case of bad configuration rule
					if (!enabledIntrospection && args.contextValue['params'].query.includes('__schema')) {
						result['data'] = {}
						result['errors'] = [{ message: "Fordidden" }]
						Logger.error('SECU', 'onExecute', 'Intropection query deteted not allowed', args.contextValue['params'])
					}
					Logger.endExec(args.contextValue['request']['headers'], result, timestampDone - timestampDebut, resultLogInfoLevel)
				}
			}
		}
	}
}


