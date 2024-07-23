/**
 * Logger : Class static
 *
 */



export class Logger {

	private static level: string = process.env["LogLevel"] || "INFO"
	private static format: string = process.env["LogFormat"] || "HUMAN" // set JSON_STRING to have one line json string by log
	private static bodyMaxLogSize = process.env["LogBodyMaxSize"] ? parseInt(process.env["LogBodyMaxSize"]) : 100
	private static maxSkackLogSize = process.env["LogStackTraceMaxSize"] ? parseInt(process.env["LogStackTraceMaxSize"]) : 100
	private static trackerOnly: boolean = process.env["LogTrackerHeadersOnly"] ? process.env["LogTrackerHeadersOnly"] == 'true' : false
	private static envLog: string = process.env["LogEnvFieldToAdd"] // use to add env extra field in json log ex "app=graphql,env.name=production,env.site=Paris"
	private static localDateCountry: string = process.env["LogLocalDateCountry"] || "fr-FR"
	private static logHeaders = process.env["LogHeaders"] || "x-request-id,host,origin,user-agent,content-length,authorization"
	private static logTrackerHeaders = process.env["LogTrackerHeaders"] || "x-request-id"
	constructor() {

	}
	/**
	 * Core logger with Human format or machine one line json string format
	 */
	private static log(level: string, typeEv: string, message: string, data: any = null, err = null) {

		const date = new Date();
		const timestamp = date.getTime();

		// if machine friendly json string is required
		if (Logger.format == 'JSON_STRING') {
			const log = {
				level: level,
				typeEv: typeEv,
				timestamp: timestamp,
				date: date.toLocaleString(this.localDateCountry),
				message: message
			}
			if (data) {
				log['data'] = data
			}
			if (err) {
				log['exeception'] = {}
				for (const key in Object.keys(err)) {
					log['exeception'][key] = err[key]

				}
			}
			// if define add extra env field
			if (this.envLog) {
				addEnvFieldLog(this.envLog, log)
			}
			console.log(JSON.stringify(log))
		} else {
			console.log(date.toLocaleString(this.localDateCountry), level, typeEv, message, data, err)
		}
	}

	public static error(typeEv: string, source: string, message: string, data: any = null, e = null) {
		if (Logger.level == 'ERROR' || Logger.level == 'WARN' || Logger.level == 'INFO' || Logger.level == 'DEBUG') {
			Logger.log('ERROR', typeEv, source + ":" + message, data, e)
		}
	}
	public static warn(typeEv: string, source: string, message: string, data: any = null, e = null) {
		if (Logger.level == 'WARN' || Logger.level == 'INFO' || Logger.level == 'DEBUG') {
			Logger.log('INFO', typeEv, source + ":" + message, data, e)
		}
	}

	public static info(typeEv: string, source: string, message: string, data: any = null, e = null) {
		if (Logger.level == 'INFO' || Logger.level == 'DEBUG') {
			Logger.log('INFO', typeEv, source + ":" + message, data, e)
		}
	}
	public static debug(typeEv: string, source: string, message: string, data: any = null, e = null) {
		if (Logger.level == 'DEBUG') {
			Logger.log('DEBUG', typeEv, source + ":" + message, data, e)
		}
	}
	public static onParse(headers: any) {
		try {



			Logger.log('INFO', "ON-PARSE", "Request", headersToLog(headers, this.logTrackerHeaders, this.logHeaders, this.trackerOnly))
		} catch (e) {
			Logger.error('LOGGER_ERROR', 'endExec logger', 'error during log generation', null, e)

		}
	}
	public static endExec(headers: any, result: any, duration: number, resultLogInfoLevel) {
		try {

			const toLog = {
				headers: headersToLog(headers, this.logTrackerHeaders, this.logHeaders, this.trackerOnly),
				result: {
					hasErrors: (result['errors'] != undefined),
					hasData: (result['data'] != undefined),
					resultSummayInfo: info(result, this.maxSkackLogSize, resultLogInfoLevel)
				},
				duration: duration,
			}
			Logger.log('INFO', "endExecDone", "Request", toLog)
		} catch (e) {
			Logger.error('LOGGER_ERROR', 'endExec logger', 'error during log generation', null, e)

		}
	}

	public static onResultProcess(request: any, result: any, resultLogInfo) {
		try {
			const headerMap = request['headers']

			const toLog = {
				headers: headersToLog(headerMap, this.logTrackerHeaders, this.logHeaders, this.trackerOnly),

				hasErrors: (result['errors'] != undefined),
				hasData: (result['data'] != undefined),
				responseInfo: info(result, this.maxSkackLogSize, resultLogInfo)
			}


			Logger.log('INFO', "onResultProcess", "Result", toLog)
		} catch (e) {
			Logger.error('LOGGER_ERROR', 'onResponse logger', 'error during log generation', null, e)
		}
	}

	public static onRequestParseDone(headers: any, query: any, operation: string, variables: any, duration: number) {
		const toLog = {
			headers: headersToLog(headers, this.logTrackerHeaders, this.logHeaders, this.trackerOnly),
			operation: operation,
			query: query,
			variables: variables,
			parsingDuration: duration
		}
		Logger.log('INFO', "requestParseDone", "requestParse", toLog)
	}

	public static onResponse(request: any, response: any, logResponseLevellevel: string) {
		try {
			const headers = request['headers']

			// calculate duration from request timestamp
			const requestTimestampString: string = headers.get('requesttimestamp')
			let requestTimestamp;
			if (requestTimestampString) {
				requestTimestamp = parseInt(requestTimestampString)
			}

			const responseTimestamp = new Date().getTime();

			const toLog = {
				request: {
					headers: headersToLog(headers, this.logTrackerHeaders, this.logHeaders, this.trackerOnly),
					url: request.url,
					method: request.method
				},
				response: {
					status: response.status,
					contentLength: response.contentLength,
				},

				duration: responseTimestamp - requestTimestamp
			}
			if (logResponseLevellevel != 'low') {
				toLog.response['bodyInfo'] = extractBody(response.bodyInit, this.bodyMaxLogSize)
			}
			Logger.log('INFO', "onResponse", "response", toLog)
		}
		catch (e) {
			Logger.error('LOGGER_ERROR', 'onResponse logger', 'error during log generation', null, e)
		}
	}

	public static onRequest(request: any) {
		try {
			const headers = request['headers']
			const toLog = {
				request: {
					headers: headersToLog(headers, this.logTrackerHeaders, this.logHeaders, false),
					url: request.url,
					method: request.method,
					body: request.body

				}
			}
			Logger.log('INFO', "onRequest", "request", toLog)

		}
		catch (e) {
			Logger.error('LOGGER_ERROR', 'onRequest logger', 'error during log generation', null, e)
		}
	}

	public static onFetch(request: any, fetchInfo: any, fetchResponseInfo: any, duration: number) {
		try {
			const headers = request['headers']

			const toLog = {
				requestHeaders: headersToLog(headers, this.logTrackerHeaders, this.logHeaders, this.trackerOnly),
				fetchInfo: fetchInfo,
				fetch: fetchResponseInfo,
				duration: duration
			}
			Logger.log('INFO', "onFetch", "fetch", toLog)
		} catch (e) {
			Logger.error('LOGGER_ERROR', 'onFetch logger', 'error during log generation', null, e)
		}
	}

	public static graphqlQuery(headers: any, params: any) {
		try {
			const regex = /  /gi;
			const queryTolog = {
				headers: headersToLog(headers, this.logTrackerHeaders, this.logHeaders, this.trackerOnly),
				query: params['query'].replace(regex, ""),
				operationName: params['operationName'],
				variables: params['variables']
			}
			Logger.log('INFO', "graphqlQuery", "GraphQL Query", queryTolog)
		} catch (e) {
			Logger.error('LOGGER_ERROR', 'graphql query logger', 'error during log generation', null, e)
		}
	}
}

function mask(stringToMask: string) {
	if (stringToMask) {
		return "*******************" + stringToMask.substring(22)
	}
	return null;
}

function info(result: any, maxStackLogSize: number, resultLogInfoLevel: string) {
	let responseInfo = {}
	let keys = null
	let nbKeys = 0
	let maxKeys = 20
	if (result['errors']) {
		responseInfo['errors'] = []
		responseInfo['nbErrors'] = result['errors'].length

		for (const errorKey in result['errors']) {
			const error = result['errors'][errorKey]
			let logError = {}
			if (error['message']) {
				logError['message'] = error['message']
			}
			if (error['path']) {
				logError['path'] = error['path']
			}
			// no stack trace and extension in low trace level
			if (resultLogInfoLevel != 'low') {
				if (error['stack']) {
					logError['stack'] = error['stack'].substring(0, maxStackLogSize)
				}
				if (error['extensions']) {
					logError['extensions'] = error['extensions']
				}
			}
			responseInfo['errors'].push(logError)
		}

	} else {
		responseInfo['nbErrors'] = 0
	}
	if (result['data']) {
		if (resultLogInfoLevel != 'low') {
			for (const key in result['data']) {
				if (result['data'].hasOwnProperty(key)) {
					if (keys == null) {
						keys = key
					} else {
						if (nbKeys < maxKeys) {
							keys = keys + ',' + key
						}
					}
					nbKeys = nbKeys + 1
				}
			}
			responseInfo['nbData'] = nbKeys
			responseInfo['dataFields'] = keys
		} else {
			responseInfo['nbData'] = 0
		}
	}
	return responseInfo
}
function extractBody(body: String, bodyMaxLogSize: number) {
	if (body != null) {
		return body.substring(0, bodyMaxLogSize)
	} else {
		return ""
	}
}
function headersToLog(headers: any, trackerHeaders: string, customHeaders: string, trackerOnly: boolean) {
	const headersToLog = {}
	try {
		const headerMap = headers["_map"]
		if (headerMap) {
			if (trackerOnly == false) {
				if (customHeaders) {
					const cHeaders = customHeaders.split(',')

					for (const headerKey in cHeaders) {
						const header = cHeaders[headerKey].trim()
						if (headerMap.get(header)) {
							if (header.toLowerCase() == "authorization") {
								headersToLog[header] = mask(headerMap.get('authorization'))
							} else {
								headersToLog[header] = headerMap.get(header)
							}
						}
					}
				}
				return headersToLog
			} else {
				if (trackerHeaders) {
					const tHeaders = trackerHeaders.split(',')
					for (const headerKey in tHeaders) {
						const header = tHeaders[headerKey]
						if (headerMap.get(header)) {
							if (header.toLowerCase() == "authorization") {
								headersToLog[header] = mask(headerMap.get('authorization'))
							} else {
								headersToLog[header] = headerMap.get(header)
							}
						}
					}
				}
			}
		}
	} catch (e) {
		Logger.error('LOGGER_ERROR', 'onheadersToLog', 'error during headers log generation', null, e)
	}
	return headersToLog
}
/**
 * Use to add some environment fields to log, like env.name, app.name ...
 * ex : logEnvInfoField : string = "app=graphql,env.name=production,env.site=Paris"
 * -> log={
 *          app: "graphql",
 *          env:
 *             name: "production",
 *             site: "Paris",
 *          ...      // logs field
 */
function addEnvFieldLog(logEnvInfoField: string, log: any) {

	// split fields list witth dot serator
	const fields: string[] = logEnvInfoField.split(",")
	for (let idxField = 0; idxField < fields.length; idxField++) {
		// split key, value
		const kvField: string[] = fields[idxField].trim().split("=")
		// split key in objects tree hierarchy
		const levelField = kvField[0].trim().split(".")
		let current = log
		// create new object if does not exist for each level and set value for leaf level
		for (let idxLevel = 0; idxLevel < levelField.length; idxLevel++) {
			if (current[levelField[idxLevel]]) {
				current = current[levelField[idxLevel]]
			} else {
				if (idxLevel < levelField.length - 1) {
					current = current[levelField[idxLevel]] = {}
				} else {
					current[levelField[idxLevel]] = kvField[1]
				}
			}
		}
	}
}







