import { globSync } from 'glob'
import { readFileSync } from 'node:fs'
import { Catalog, Spec, SwaggerName, ConfigExtension } from '../types'
import { getConfig, getSourceName, getSourceOpenapiEnpoint } from './config'
import { getAvailableTypes } from './swaggers'
import { mergeObjects } from './helpers'
import { generateTypeDefsAndResolversFromSwagger } from './swaggers'
import { directiveTypeDefs } from './directive-typedefs'

export default class ConfigFromSwaggers {
  swaggers: SwaggerName[] = []
  specs: Spec[] = []
  catalog: Catalog = {}
  interfacesWithChildren: { [key: string]: string[] } = {}
  config: any = {}

  constructor() {
    this.config = getConfig()
    this.swaggers = globSync('././sources/**/*.json').sort((a, b) => a.localeCompare(b))
    this.specs = this.swaggers.map(
      (swagger) => <Spec>JSON.parse(readFileSync(swagger, { encoding: 'utf-8' }))
    )
    this.catalog = this.specs.reduce((acc, spec, i) => {
      Object.keys(spec.paths).forEach((path) => {
        const query = spec.paths[path]?.get
        const content = query?.responses['200']?.['content']
        const ref =
          content?.['application/json']?.schema['$ref'] ?? content?.['*/*']?.schema['$ref']
        const schema = ref?.replace('#/components/schemas/', '')
        if (schema) {
          acc[path] = [query?.operationId || '', schema, this.swaggers[i]]
        }
      })
      return acc
    }, {} as Catalog)
  }

  getInterfacesWithChildren() {
    this.specs.forEach((s) => {
      const { schemas } = s.components || {}
      const entries = Object.entries(schemas || {}).filter(([_, value]) =>
        Object.keys(value).includes('discriminator')
      )
      for (const [schemaKey, schemaValue] of entries) {
        const mapping: { [key: string]: string } = schemaValue['discriminator']['mapping'] ?? {}
        const mappingTypes: string[] = []
        if (Object.keys(mapping).length > 0) {
          mappingTypes.push(
            ...Object.keys(mapping)
              .filter((k) => k !== schemaKey)
              .map((k) => mapping[k].replace('#/components/schemas/', ''))
          )
        }
        if (this.interfacesWithChildren[schemaKey] === undefined) {
          this.interfacesWithChildren[schemaKey] = mappingTypes
        } else {
          mappingTypes.forEach((type) => {
            if (!this.interfacesWithChildren[schemaKey].includes(type)) {
              this.interfacesWithChildren[schemaKey].push(type)
            }
          })
        }
      }
    })
    return this.interfacesWithChildren
  }

  createTypeDefsAndResolvers() {
    const availableTypes = getAvailableTypes(this.specs)
    return this.specs.reduce(
      (acc, spec) => {
        const { typeDefs, resolvers } = generateTypeDefsAndResolversFromSwagger(
          spec,
          availableTypes,
          this.getInterfacesWithChildren(),
          this.catalog
        )
        acc.typeDefs += typeDefs
        acc.resolvers = mergeObjects(acc.resolvers, resolvers)
        return acc
      },
      { typeDefs: '', resolvers: {} } as ConfigExtension
    )
  }

  getOpenApiSources() {
    return (
      this.swaggers.map((source) => ({
        name: getSourceName(source, this.config),
        handler: {
          openapi: {
            source,
            endpoint: getSourceOpenapiEnpoint(source, this.config) || '{env.ENDPOINT}',
            ignoreErrorResponses: true,
            operationHeaders: {
              Authorization: `{context.headers["authorization"]}`,
              ...(this.config.sources.find((item) => source.includes(item.name))?.handler?.openapi
                ?.operationHeaders || {})
            }
          }
        }
      })) || []
    )
  }

  /*
   * Get sources that are not openapi
   */
  getOtherSources() {
    return (
      this.config.sources?.filter(
        (source: { handler: { openapi: any } }) => !source?.handler?.openapi
      ) || []
    )
  }

  /**
   * Get additional type definitions, resolvers, sources from swaggers and default config
   *
   * @returns {ConfigExtension} - defaultConfig, additionalTypeDefs, additionalResolvers, sources
   */

  getMeshConfigFromSwaggers(): {
    defaultConfig: any
    additionalTypeDefs: string[]
    additionalResolvers: any
    sources: any[]
  } {
    const { typeDefs, resolvers } = this.createTypeDefsAndResolvers()

    return {
      defaultConfig: this.config,
      additionalTypeDefs: [typeDefs, directiveTypeDefs].filter(Boolean),
      additionalResolvers: resolvers,
      sources: [...this.getOpenApiSources(), ...this.getOtherSources()]
    }
  }
}
