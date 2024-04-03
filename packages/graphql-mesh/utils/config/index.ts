import { Config } from '@graphql-mesh/types/typings/config'
import { DefaultLogger } from '@graphql-mesh/utils'
import { load } from 'js-yaml'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const logger = new DefaultLogger()

/**
 * Load config file from yaml or ts
 * @returns Config
 */
export const getConfig = (): Config => {
  logger.info('Loading config file')
  let config: Config
  // Load yaml config file
  try {
    const configPath = resolve('./config.yaml')
    config = load(readFileSync(configPath, { encoding: 'utf-8' }))
  } catch (e) {}

  // Load ts config file
  try {
    if (!config) {
      config = require('../../config').default
    }
  } catch (e) {}

  if (!config) {
    throw new Error('No config file found')
  }

  logger.info('Config file loaded successfully')
  return config
}

/**
 * Get endpoint from openapi source in config
 * @param source {string}
 * @param config
 * @returns
 */
export const getSourceOpenapiEnpoint = (source: string, config: Config): string | undefined => {
  const data = config.sources?.find((item) =>
    item?.handler?.openapi?.source?.includes(source.split('/').pop())
  )
  return data?.handler.openapi?.endpoint
}
