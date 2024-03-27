import { readFileOrUrl, DefaultLogger } from '@graphql-mesh/utils'
import { getConfig } from '../helpers'
import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fetch } from '@whatwg-node/fetch'
const logger = new DefaultLogger()

// Load the config file and retrieve the sources with an OpenAPI handler
let config = getConfig()

const sources = config?.sources?.filter((source) => source?.handler?.openapi) || []
const swaggers = sources.map((source) => source?.handler?.openapi?.source) || []

/**
 * Download the swagger from the given URL and save it to the sources folder
 * @param {string} url
 */
const downSwaggerFromUrl = async (url: string): Promise<void> => {
  try {
    const content: Record<string, unknown> = await readFileOrUrl(url, {
      allowUnknownExtensions: true,
      cwd: '.',
      fetch: fetch,
      importFn: null,
      logger: logger
    })
    const fileName = url.split('/').pop()
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
const downloadSwaggers = (swaggers: string[]) => {
  logger.info(`Downloading ${swaggers.length} swaggers sources...`)

  // Create the sources folder if it doesn't exist
  if (!existsSync('./sources')) {
    mkdirSync('./sources')
  }

  if (swaggers.length) {
    swaggers.forEach(downSwaggerFromUrl)
  }
}

downloadSwaggers(swaggers)
