import { YamlConfig } from '@graphql-mesh/types'
import { DefaultLogger } from '@graphql-mesh/utils'
import { load } from 'js-yaml'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const logger = new DefaultLogger()

// Load the config.yaml file
export const getConfig = (): YamlConfig.Config => {
  logger.info('Loading config file')
  let config: YamlConfig.Config

  try {
    const configPath = resolve('./config.yaml')
    config = load(readFileSync(configPath, { encoding: 'utf-8' }))
  } catch (e) {}

  if (!config) {
    throw new Error('No config file found')
  }

  logger.info('Config file loaded successfully')
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
