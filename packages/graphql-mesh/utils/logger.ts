/**
 * Logger : Class static
 * use to log event with much useful context information and some useful data
 *
 * TODO : split into specifiques loggers and core logger
 */
import { v4 as uuidv4 } from 'uuid';


export class Logger {

	private static level: string = process.env["LogLevel"] || "INFO"
	private static format: string = process.env["LogFormat"] || "HUMAN" // set JSON_STRING to have one line json string by log
	private static bodyMaxLogSize = process.env["LogBodyMaxSize"] ? parseInt(process.env["LogBodyMaxSize"]) : 100
	private static maxSkackLogSize = process.env["LogStackTraceMaxSize"] ? parseInt(process.env["LogStackTraceMaxSize"]) : 100
	private static trackerOnly: boolean = process.env["LogTrackerHeadersOnly"] ? process.env["LogTrackerHeadersOnly"] == 'true' : false
	private static envLog: string = process.env["LogEnvFieldToAdd"] // use to add env extra field in json log ex "app=graphql,env.name=production,env.site=Paris"
	private static localDateCountry: string = process.env["LogLocalDateCountry"] || "fr-FR"
	private static logHeaders = defineLogHeaders(process.env["LogHeaders"] || "headers.host=host,headers.origin,headers.user-agent=user-agent,headers.content-length=content-length,headers.authorization=authorization")
	private static logContextHeaders = defineLogHeaders(process.env["LogContextHeaders"] || "ctx.requestId=x-request-id")
	private static skipHealthCheck = process.env["skipHealthCheck"] ? process.env["skipHealthCheck"] == "true" : true
	private static healthCheckHeaderName = process.env["healthCheckHeazder"] || "x-internal"
	private static HealthCheckHeaderValue = process.env["healthCheckHeaderValue"] || "health-check"
	private static MaxErrorStackSize = process.env["MaxErrorStackSize"] ? parseInt(process.env["MaxErrorStackSize"]) : 200
	constructor() {

	}
	/**
	 * Core logger with Human format or machine in one line json string format
	 */
	private static log(level: string, typeEv: string, message: string, headers = null, onlyContextHeader: boolean, info: any = null, err = null) {

		const date = new Date();
		const timestamp = date.getTime();

		// if machine friendly json string is required
		if (Logger.format == 'JSON_STRING') {
			const log = {
				events: [{
					idEv: uuidv4(),
					date: date.toLocaleString(this.localDateCountry),
					level: level,
					typeEv: typeEv,
					timestamp: timestamp,
					message: message
				}]
			}
			try {
				// add http headers
				if (headers) {
					this.addHeadersToContextLog(log, headers)
					if (!onlyContextHeader) {
						this.addHeadersToLog(log.events[0], headers)
					}
				}
				// add extra information to log event
				if (info) {
					for (const key in info) {
						log.events[0][key] = info[key]
					}
				}
				// if exception error add message and an extract of stack trace
				if (err) {
					log.events[0]['exeception'] = {}
					//console.log("Exception:", err)

					log.events[0]['exeception'] = {
						message: err.message,
						stack: err.stack?.substring(0, this.MaxErrorStackSize) + " ..."
					}

				}
				// if define add extra env field
				if (this.envLog) {
					addEnvFieldLog(this.envLog, log)
				}

			} catch (e) {
				log['error'] = "error whileg getting log event contextual info :" + e.message
			}
			console.log(JSON.stringify(log))
		} else {
			if (info) {
				if (err) {
					console.log(date.toLocaleString(this.localDateCountry), level, typeEv, message, info, err)
				} else
					console.log(date.toLocaleString(this.localDateCountry), level, typeEv, message, info)

			} else {
				if (err) {
					console.log(date.toLocaleString(this.localDateCountry), level, typeEv, message, err)
				} else
					console.log(date.toLocaleString(this.localDateCountry), level, typeEv, message)

			}
		}
	}

	public static error(typeEv: string, source: string, message: string, headers = null, info = null, e = null) {
		if (Logger.level == 'ERROR' || Logger.level == 'WARN' || Logger.level == 'INFO' || Logger.level == 'DEBUG') {
			Logger.log('ERROR', typeEv, source + ":" + message, headers, false, info, e)
		}
	}
	public static warn(typeEv: string, source: string, message: string, headers: any = null, info: any = null, e = null) {
		if (Logger.level == 'WARN' || Logger.level == 'INFO' || Logger.level == 'DEBUG') {
			Logger.log('INFO', typeEv, source + ":" + message, headers, false, info, e)
		}
	}

	public static info(typeEv: string, source: string, message: string, headers: any = null, info: any = null, e = null) {
		if (Logger.level == 'INFO' || Logger.level == 'DEBUG') {
			Logger.log('INFO', typeEv, source + ":" + message, headers, true, info, e)
		}
	}
	public static debug(typeEv: string, source: string, message: string, headers: any = null, info: any = null, e = null) {
		if (Logger.level == 'DEBUG') {
			Logger.log('DEBUG', typeEv, source + ":" + message, headers, true, info, e)
		}
	}


	/**
	 * log the on parse event
	 */
	public static onParse(headers: any) {
		try {
			if (this.isEventToLog(headers)) {
				Logger.log('INFO', "ON-PARSE", "Request", headers, true)
			}
		} catch (e) {
			Logger.error('LOGGER_ERROR', 'onParse logger', 'error during log generation', null, e)

		}
	}

	/**
	 * log the on end exec done event
	 */
	public static endExec(headers: any, result: any, duration: number, resultLogInfo: any) {
		try {
			if (this.isEventToLog(headers)) {
				const info = {
					result: InfoResult(result, this.maxSkackLogSize, resultLogInfo),
					duration: duration,
				}
				Logger.log('INFO', "endExecDone", "Request", headers, true, info)
			}
		} catch (e) {
			Logger.error('LOGGER_ERROR', 'endExec logger', 'error during log generation', headers, null, e)
		}
	}

	/**
	 * log the on result process event
	 */
	public static onResultProcess(request: any, result: any, duration: number, resultLogInfo: any) {
		const headers = request['headers']
		try {

			if (this.isEventToLog(headers)) {

				const info = {
					result: InfoResult(result, this.maxSkackLogSize, resultLogInfo),
					duration: duration
				}
				Logger.log('INFO', "onResultProcess", "Result", headers, true, info)
			}
		} catch (e) {
			Logger.error('LOGGER_ERROR', 'onResponse logger', 'error during log generation', headers, null, e)
		}
	}

	/**
	 * log the on request parse done event
	 */
	public static onRequestParseDone(headers: any, query: any, operation: string, variables: any, duration: number) {
		if (this.isEventToLog(headers)) {

			const info = {
				operation: operation,
				query: query,
				variables: variables,
				parsingDuration: duration
			}
			Logger.log('INFO', "requestParseDone", "requestParse", headers, true, info)
		}
	}
	/**
	 * log the on reponse event http respnse return
	 */
	public static onResponse(request: any, response: any, logResponseLevellevel: string) {
		const headers = request['headers']
		try {
			if (this.isEventToLog(headers)) {
				// calculate duration from request timestamp
				const requestTimestampString: string = headers.get('requesttimestamp')
				let requestTimestamp: number;
				if (requestTimestampString) {
					requestTimestamp = parseInt(requestTimestampString)
				}
				const responseTimestamp = new Date().getTime();
				const info = {
					request: {
						url: request.url,
						method: request.method
					},
					response: {
						status: response.status,
						contentLength: response.contentLength,
					},
					httpStatus: response.status,
					duration: responseTimestamp - requestTimestamp
				}
				if (logResponseLevellevel != 'low') {
					info.response['bodyExtract'] = extractBody(response.bodyInit, this.bodyMaxLogSize)
				}

				Logger.log('INFO', "onResponse", responseSummary(response.bodyInit), headers, true, info)
			}
		}
		catch (e) {
			Logger.error('LOGGER_ERROR', 'onResponse logger', 'error during log generation', headers, null, e)
		}
	}

	public static introspection(headers, query) {
		try {
			const info = {
				query: query
			}
			Logger.warn('WARN_INTROSPECTION', "introspection", "introspection query", headers, info)
		}
		catch (e) {
			Logger.error('LOGGER_ERROR', 'introspection logger', 'error during log generation', null, null, e)
		}
	}

	public static denyIntrospection(headers, info, message,) {
		try {
			Logger.warn('DENY_INTROSPECTION', info, message, headers)
		}
		catch (e) {
			Logger.error('LOGGER_ERROR', 'denyIntrospection logger', 'error during log generation', headers, null, e)
		}
	}

	public static allowIntrospection(headers, info, message,) {
		try {
			Logger.warn('ALLOW_INTROSPECTION', info, message, headers)
		}
		catch (e) {
			Logger.error('LOGGER_ERROR', 'denyIntrospection logger', 'error during log generation', headers, null, e)
		}
	}
	public static onRequest(request: any) {
		const headersInit = request['headers']['headersInit']
		const headers = new Map

		for (const header in headersInit) {
			headers.set(header, headersInit[header])
		}
		try {
			if (this.isEventToLog(headers)) {
				const info = {
					url: request.url,
					method: request.method,
					//body: request.body
				}
				Logger.log('INFO', "onRequest", "request incomming", headers, false, info)
			}
		}
		catch (e) {
			Logger.error('LOGGER_ERROR', 'onRequest logger', 'error during log generation', headers, null, e)
		}
	}

	public static onFetch(request: any, url: string, httpStatus: string, duration: number, fetchInfo: any) {
		try {
			const headers = request['headers']
			const info = {
				fetch: fetch,
				duration: duration,
				httpStatus: httpStatus,
				url: url
			}
			Logger.log('INFO', "onFetch", "fetch", headers, true, info)
		} catch (e) {
			Logger.error('LOGGER_ERROR', 'onFetch logger', 'error during log generation', null, e)
		}
	}

	public static graphqlQuery(headers: any, params: any) {
		try {
			if (this.isEventToLog(headers)) {
				const regex = /  /gi;
				const queryTolog = {
					query: params['query'].replace(regex, ""),
					operationName: params['operationName'],
					variables: params['variables']
				}
				Logger.log('INFO', "graphqlQuery", "GraphQL Query", headers, true, queryTolog)
			}
		} catch (e) {
			Logger.error('LOGGER_ERROR', 'graphql query logger', 'error during log generation', headers, null, e)
		}
	}
	private static isEventToLog(headers): boolean {
		if (this.skipHealthCheck && headers) {
			if (headers.get(this.healthCheckHeaderName) == this.HealthCheckHeaderValue) {
				return false
			}
		}
		return true
	}
	private static addHeadersToContextLog(log: any, headers: any) {

		try {
			let headerMap = null
			if (headers["_map"]) {
				headerMap = headers["_map"]
			} else {
				headerMap = headers
			}

			if (headerMap && headerMap.get) {
				if (this.logContextHeaders) {
					for (const contextKey in this.logContextHeaders) {
						const contextHeader = this.logContextHeaders[contextKey]
						if (headerMap.get(contextHeader.header)) {

							if (contextHeader.header.toLowerCase() == "authorization") {
								addLog(log, contextHeader.name, mask(headerMap.get('authorization')))
							} else {
								addLog(log, contextHeader.name, headerMap.get(contextHeader.header))
							}
						}
					}
				}
			}
		} catch (e) {
			Logger.error('LOGGER_ERROR', 'onheadersToLog', 'error during headers log generation', headers, null, e)
		}
		return log
	}

	private static addHeadersToLog(log: any, headers: any) {
		let headerMap = null
		if (headers["_map"]) {
			headerMap = headers["_map"]
		} else {
			headerMap = headers
		}
		try {
			if (headerMap) {
				if (this.logHeaders) {

					for (const logHeaderKey in this.logHeaders) {
						const logHeader = this.logHeaders[logHeaderKey]
						if (headerMap.get(logHeader.header)) {
							if (logHeader.header.toLowerCase() == "authorization") {
								addLog(log, logHeader.name, mask(headerMap.get('authorization')))
							} else {
								addLog(log, logHeader.name, headerMap.get(logHeader.header))
							}
						}
					}
				}
			}
		} catch (e) {
			Logger.error('LOGGER_ERROR', 'onheadersToLog', 'error during headers log generation', headers, null, e)
		}
		return log
	}
}

function mask(stringToMask: string) {
	if (stringToMask) {
		return "*******************" + stringToMask.substring(22)
	}
	return null;
}

function InfoResult(result: any, maxStackLogSize: number, resultLogInfoLevel: string) {
	let resultInfo = {}
	let keys = null
	let nbKeys = 0
	const maxKeys = 1
	const nbErrorsMaxToLog = 3
	if (result['errors']) {
		resultInfo['nbErrors'] = result['errors'].length
		if (resultLogInfoLevel != 'low') {
			let nbErrors = 0
			resultInfo['errors'] = []
			for (const errorKey in result['errors']) {
				const error = result['errors'][errorKey]
				let logError = {}
				if (error['message']) {
					if (nbErrorsMaxToLog > nbErrors) {
						logError['message'] = error['message']
					}
				}
				if (resultLogInfoLevel == 'hight') {
					if (error['path']) {
						logError['path'] = error['path']
					}
					// no stack trace and extension in low trace level
					if (error['stack']) {
						logError['stack'] = error['stack'].substring(0, maxStackLogSize)
					}
					if (error['extensions']) {
						logError['extensions'] = error['extensions']
					}
				}
				resultInfo['errors'].push(logError)
			}
		}
	} else {
		resultInfo['nbErrors'] = 0
	}
	if (result['data']) {
		let keys = null
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
		resultInfo['dataFields'] = keys
	}
	return resultInfo
}
function extractBody(body: String, bodyMaxLogSize: number) {
	if (body != null) {
		return body.substring(0, bodyMaxLogSize) + " ... "
	} else {
		return ""
	}
}
function responseSummary(body: String) {
	if (body != null) {
		return "response :" + body.substring(0, 100) + " ... "
	} else {
		return "response : empty"
	}
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
function addLog(log: any, key: string, value: any) {

	const levelField = key.split(".")
	let current = log
	// create new object if does not exist for each level and set value for leaf level
	for (let idxLevel = 0; idxLevel < levelField.length; idxLevel++) {
		if (current[levelField[idxLevel]]) {
			current = current[levelField[idxLevel]]
		} else {
			if (idxLevel < levelField.length - 1) {
				current = current[levelField[idxLevel]] = {}
			} else {
				current[levelField[idxLevel]] = value
			}
		}
	}
}
function defineLogHeaders(logHeaders: string) {
	const headersList = []
	if (logHeaders) {
		const headers = logHeaders.split(',')

		for (const headerKey in headers) {
			const header = headers[headerKey]
			const headerInfo = header.split('=')
			headersList.push({ name: headerInfo[0], header: headerInfo[1] ? headerInfo[1] : headerInfo[0] })
		}
	}
	return headersList
}






