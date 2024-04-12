import { readFileOrUrl, DefaultLogger } from '@graphql-mesh/utils'
import { getConfig } from '../utils/config'
import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fetch } from '@whatwg-node/fetch'
const logger = new DefaultLogger()

// Load the config file and retrieve the sources with an OpenAPI handler
let config = getConfig()

const sources = config?.sources?.filter((source) => source?.handler?.openapi) || []
const swaggers = sources.map((source) => source?.handler?.openapi?.source) || []

/**
 * Get the name of generated from the source object
 * @param {Record<string, unknown>} source
 * @returns {string | undefined}
 */
const getFileName = (url: string): string | undefined => {
  return sources.find((source) => source?.handler?.openapi?.source === url)?.name
}

/**
 * Download the swagger from the given URL and save it to the sources folder
 * @param {string} url
 */
const downSwaggerFromUrl = async (url: string | undefined, index: string): Promise<void> => {
  if (!url) return Promise.resolve()
  try {
    const content: Record<string, unknown> = await readFileOrUrl(url, {
      allowUnknownExtensions: true,
      cwd: '.',
      fetch: fetch,
      importFn: (mod) => import(mod),
      logger: logger
    })
    let fileName = getFileName(url) || `${index}-${url.split('/').pop()}`
    if (!fileName.endsWith('.json')) {
      fileName += '.json'
    }

    if (fileName) {
      const filePath = `./sources/${fileName}`
      writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8')
    }
  } catch (error) {
    logger.error(`Failed to load ${url}`, error)
  }
}

/**
 * Download all the swaggers from the given URLs
 * @param {string[]} swaggers
 */
const downloadSwaggers = (swaggers: (string | undefined)[]) => {
  logger.info(`Downloading ${swaggers.length} swaggers sources...`)

  // Create the sources folder if it doesn't exist
  if (!existsSync('./sources')) {
    mkdirSync('./sources')
  }

  if (swaggers.length) {
    swaggers.forEach((file, index) => downSwaggerFromUrl(file, index.toString()))
  }
}

downloadSwaggers(swaggers)
