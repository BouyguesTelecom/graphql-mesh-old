import { type Plugin } from '@envelop/core';

import { Logger } from '../utils/logger'

/**@
 *  monitor fetch source
 *  use to :
 *  - add log event for each fetch like, url, response status, duration
 */

export default ({ options }) => {
	return <Plugin>{
		onFetch({ context, info }) {

			if (!info) {
				Logger.warn("noFeychInfo","onFetch","no info in on fetch")
				return;
			}
			const start = Date.now();
			let rawSource = context[info.sourceName]
			let description = info.parentType._fields[info.path.key].description

			return (fetch: any) => {
				const duration = Date.now() - start;
				let fetchInfo = {}
				let httpStatus=null
				let url=null
				if (options.fullFetchInfo) {
					fetchInfo = {
						fieldName: info.fieldName,
						sourceName: info.sourceName,
						pathKey: info.path.key,
						operation: info.operation.name,
						variables: info.variables,
						endpoint: rawSource.rawSource.handler.config.endpoint,
						description: description
					}
				} else {
					fetchInfo = {
						fieldName: info.fieldName,
						pathKey: info.path.key,
						operation: info.operation.name,
						variables: info.variableValues,
						endpoint: rawSource.rawSource.handler.config.endpoint,
					}
				}
				//const fetchResponseInfo = {}
				if (fetch.response) {

					httpStatus=fetch.response.status
					url=fetch.response.url
					const options = fetch.response.options
					if (options) {
						fetchInfo['options'] = {
							requestId: options.headers['x-request-id'],
							server: options.headers['server']
						}
					}
				}
				Logger.onFetch(context.request, url, httpStatus,duration,fetchInfo)
			};
		},

		onExecute() {
			return {
				onExecuteDone({ args }) {
					// @ts-ignore
					const { timings } = args.contextValue;
					if (!timings) {
						return;
					}

					// @ts-ignore
					args.contextValue.res.setHeader?.(
						'Server-Timing',
						timings.join(', ')
					);
				},
			};
		},

	};
};
