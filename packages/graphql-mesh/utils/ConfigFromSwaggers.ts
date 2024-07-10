import { globSync } from 'glob'
import { readFileSync } from 'node:fs'
import { Catalog, Spec, ConfigExtension } from '../types'
import {
  getConfig,
  getSourceName,
  getSourceOpenapiEnpoint,
  getSourceTransforms
} from './parseYamlConfig'
import { mergeObjects } from './helpers'
import { generateTypeDefsAndResolversFromSwagger } from './generateTypeDefsAndResolvers'

export default class ConfigFromSwaggers {
  swaggers: string[] = []
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
          if (!acc[path]) {
            acc[path] = {
              operationIds: [query.operationId],
              type: schema,
              swaggers: [this.swaggers[i]]
            }
          } else {
            acc[path].operationIds.push(query.operationId)
            acc[path].swaggers.push(this.swaggers[i])
          }
        }
      })
      return acc
    }, {} as Catalog)
  }

  getAvailableTypes() {
    const res = this.specs.flatMap((spec) => Object.keys(spec.components?.schemas ?? {}))
    return res.filter((item, index) => res.indexOf(item) === index).sort((a, b) => a.localeCompare(b))
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
    if (this.config.sources) {
      this.specs.forEach((spec, index) => {
        // Suffix each schema name by the swagger version if there is a "rename" transform
        if (
          spec.components &&
          this.config.sources[index]?.transforms?.find(
            (transform) => transform.rename !== undefined
          )
        ) {
          const xVersion = spec.info.version.split('.')[0]
          const schemasWithSuffix = {}
          Object.entries(spec.components.schemas).forEach(([key, schema]) => {
            schemasWithSuffix[`${key}_v${xVersion}`] = schema
          })
          spec.components.schemas = schemasWithSuffix
        }
      })
    }
    const typeDefs = /* GraphQL */ `
      type LinkItem {
        rel: String
        href: String
      }
      type ActionItem {
        rel: String
        action: String
      }
    `

    const availableTypes = this.getAvailableTypes()
    const interfacesWithChildren = this.getInterfacesWithChildren()
    const catalog = this.catalog
    const config = this.config

    return this.specs.reduce(
      (acc, spec) => {
        const { typeDefs, resolvers } = generateTypeDefsAndResolversFromSwagger(
          spec,
          availableTypes,
          interfacesWithChildren,
          catalog,
          config
        )
        acc.typeDefs += typeDefs
        acc.resolvers = mergeObjects(acc.resolvers, resolvers)
        return acc
      },
      { typeDefs: typeDefs, resolvers: {} } as ConfigExtension
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
              ...(this.config.sources?.find((item) => source.includes(item.name))?.handler?.openapi
                ?.operationHeaders || {})
            }
          }
        },
        transforms: getSourceTransforms(source, this.config)
      })) || []
    )
  }

  // Get sources that are not openapi
  getOtherSources() {
    return (
      this.config.sources?.filter(
        (source: { handler: { openapi: any } }) => !source?.handler?.openapi
      ) || []
    )
  }

  // Create Mesh config
  getMeshConfigFromSwaggers(): {
    defaultConfig: any
    additionalTypeDefs: string
    additionalResolvers: any
    sources: any[]
  } {
    const { typeDefs, resolvers } = this.createTypeDefsAndResolvers()
    return {
      defaultConfig: this.config,
      additionalTypeDefs: typeDefs,
      additionalResolvers: resolvers,
      sources: [...this.getOpenApiSources(), ...this.getOtherSources()]
    }
  }
}
