import { YamlConfig } from '@graphql-mesh/types'
import { DefaultLogger } from '@graphql-mesh/utils'
import { load } from 'js-yaml'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Logger } from '../utils/logger'

const logger = new DefaultLogger()

// Load the config.yaml file
export const getConfig = (): YamlConfig.Config => {
	Logger.debug('CONFIG', 'getConfig', 'Loading config file')
	let config: YamlConfig.Config

	try {
		const configPath = resolve('./config.yaml')
		config = load(readFileSync(configPath, { encoding: 'utf-8' }))
	} catch (e) {
		Logger.error('CONFIG', 'getConfig', "Failed loading config ", e)
		throw new Error('FAiles laoding config file ./config.yaml', e)
	}

	if (!config) {
		Logger.error('CONFIG', 'getConfig', "No config loaded")
		throw new Error('No configuration')
	}
	if (config.sources) {
		Logger.info('CONFIG', 'getConfig', 'Config file loaded successfully with ' + config.sources.length + " sources")
	} else {
		Logger.warn('CONFIG', 'getConfig', 'Config file loaded successfully but without sources')
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
