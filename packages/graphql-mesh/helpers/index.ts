import { Config } from '@graphql-mesh/types/typings/config'
import { DefaultLogger } from '@graphql-mesh/utils'
import { load } from 'js-yaml'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Spec } from '../types'

const logger = new DefaultLogger()

export const mergeObjects = (obj1: any, obj2: any) => {
  for (const key in obj2) {
    if (key in obj1 && typeof obj1[key] === 'object') {
      obj1[key] = mergeObjects(obj1[key], obj2[key])
    } else {
      obj1[key] = obj2[key]
    }
  }
  return obj1
}

export const trimLinks = (str: string) => str.replace(/Links$/, '')

/**
 * Anonymize path and get params
 * @param path {string}
 * @returns
 */
export const anonymizePathAndGetParams = (path: string) => {
  const params: string[] = path.match(/\{(.*?)\}/g) ?? []

  return {
    anonymizedPath: path.replace(/\/(\{[^}]+\})/g, '/{}'),
    params: params.map((param) => param.replace(/[{}]/g, ''))
  }
}


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
      config = require('../config').default
    }
  } catch (e) {}

  if (!config) {
    throw new Error('No config file found')
  }

  logger.info('Config file loaded successfully')
  return config
}


export const getAvailableTypes = (specs: Spec[]) =>
  specs.flatMap((spec) => Object.keys(spec.components?.schemas ?? {}))

/**
 * Get endpoint from openapi source in config
 * @param source {string}
 * @param config
 * @returns
 */
export const getOpenapiEnpoint = (source: string, config: Config): string | undefined => {
  const data = config.sources?.find((item) =>
    item?.handler?.openapi?.source?.includes(source.split('/').pop())
  )
  return data?.handler.openapi?.endpoint
}
