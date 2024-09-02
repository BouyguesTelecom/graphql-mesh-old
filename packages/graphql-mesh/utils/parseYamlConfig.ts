import { YamlConfig } from '@graphql-mesh/types'
//import { DefaultLogger } from '@graphql-mesh/utils'
import { load } from 'js-yaml'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Logger } from '../utils/logger'


//const logger = new DefaultLogger()

// Load the config.yaml file
export const getConfig = (): YamlConfig.Config => {
	const configFile = process.env['ConfigFile'] || 'config.yaml'
	Logger.info('CONFIG', 'getConfig', 'Loading config file ' + configFile)
	let config: YamlConfig.Config

	try {
		const configPath = resolve(configFile)
		config = load(readFileSync(configPath, { encoding: 'utf-8' }))
	} catch (e) {
		Logger.error('CONFIG', 'getConfig', "Failed loading config " + configFile, e)
		throw new Error('FAiles laoding config file ' + configFile, e)
	}

	if (!config) {
		Logger.error('CONFIG', 'getConfig', "No config loaded from " + configFile)
		throw new Error('No configuration loaded from ' + configFile)
	}

	// if sources config is on a separate file define by SourcesConfigFile env var
	const sourcesConfigFile = process.env['SourcesConfigFile']
	if (sourcesConfigFile) {
		let sourcesConfig: YamlConfig.Config
		Logger.info('CONFIG', 'getConfig', 'Loading sources config file ' + sourcesConfigFile)

		try {
			const sourcesConfigPath = resolve(sourcesConfigFile)
			let file = readFileSync(sourcesConfigPath, { encoding: 'utf-8' })
			sourcesConfig = load(readFileSync(sourcesConfigPath, { encoding: 'utf-8' }))
			Logger.debug('CONFIG', 'getConfig', 'sources loading from ' + sourcesConfigPath , null, file)
		} catch (e) {
			Logger.error('CONFIG', 'getConfig', "Failed loading sources Config " + sourcesConfigFile, null, null, e)
			throw new Error('FAiles laoding sources config file ' + sourcesConfigFile, e)
		}
		if (sourcesConfig.sources) {
			config['sources'] = sourcesConfig.sources
			Logger.info('CONFIG', 'getConfig', 'sources Config file loaded successfully with ' + sourcesConfig.sources.length + " sources")
		} else {
			Logger.error('CONFIG', 'getConfig', 'sources Config file loaded successfully but without sources')
		}
		

	} else {
		if (!config.sources) {
			Logger.error('CONFIG', 'getConfig', "No source defined in configuration file " + configFile)
			throw new Error('No source defioned in configuration file ' + configFile)
		}
	}
	return config
}

// Get the endpoint of a specific openapi source
export const getSourceOpenapiEnpoint = (
	source: string,
	config: YamlConfig.Config
): string | undefined => {
	const data = config.sources?.find((item) => source.includes(item.name))
	return data?.handler.openapi?.endpoint
}

// Get the name of a specific source
export const getSourceName = (source: string, config: YamlConfig.Config): string => {
	const data = config.sources?.find((item) => source.includes(item.name))
	return data?.name
}

// Get the list of transforms of a specific source
export const getSourceTransforms = (source: string, config: YamlConfig.Config) => {
	const data = config.sources?.find((item) => source.includes(item.name))
	return data?.transforms
}
