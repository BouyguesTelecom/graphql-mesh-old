import { type Plugin } from '@envelop/core'

import { Logger } from '../utils/logger'

/**
 *  Monitor fetch source
 *  Used to:
 *  - add log events for each fetch such as URL, response status, and duration
 */

export default ({ options }) => {
	return <Plugin>{
		onFetch({ context, info }) {
			if (!info) {
				Logger.warn('noFetchInfo', 'onFetch', 'No info in on fetch')
				return
			}
			const start = Date.now()
			let rawSource = context[info.sourceName]
			let description = info.parentType._fields[info.path.key].description

			return (fetch: any) => {
				if (options.logOnFetch) {
					const duration = Date.now() - start
					let fetchInfo = {}
					let httpStatus = null
					let url = null
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
							endpoint: rawSource.rawSource.handler.config.endpoint
						}
					}
					if (fetch.response) {
						httpStatus = fetch.response.status
						url = fetch.response.url
						const responseOptions = fetch.response.options
						if (responseOptions) {
							fetchInfo['options'] = {
								requestId: responseOptions.headers['x-request-id'],
								server: responseOptions.headers['server']
							}
						}
						if (options.logFullResponse && fetch.response.bodyInit._readableState.buffer[0]) {
							fetchInfo['response'] = fetch.response.bodyInit._readableState.buffer[0].toString()
						}
					}
					Logger.onFetch(context.request, url, httpStatus, duration, fetchInfo)
				}
			}
		}
	}
}
