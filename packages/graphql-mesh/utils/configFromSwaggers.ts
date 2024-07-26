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
    /**
     * The following code builds a comprehensive catalog of all operations defined in a list of Swagger specifications.
     * The resulting catalog is an object where:
     * - Keys are operation paths (e.g. "foo/bar/endpoint").
     * - Values are objects with details about each operation, including:
     *   - operationIds: a list of operation IDs corresponding to this path.
     *   - type: the type returned by the 200 response of this path.
     *   - swaggers: a list of Swagger definitions where this path is present.
     */
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

  /**
   * Extracts and returns all available schema types from the Swagger specifications.
   *
   * @returns {string[]} An array of schema type names.
   */
  getAvailableTypes(areSchemasSuffixed: boolean): string[] {
    const availableTypes = []
    this.specs.forEach((spec) => {
      // Extract the major version from the Swagger specification
      const xVersion = spec.info.version.split('.')[0]
      // Check if the specification contains paths
      if (spec.paths) {
        // Iterate over each method in the paths of the specification
        Object.values(spec.paths).forEach((methods) => {
          Object.values(methods).forEach((method) => {
            // Retrieve the response with the 200 status code (success)
            const response200 = method['responses']?.['200']
            // Check if the 200 response has content
            if (response200?.content) {
              // Iterate over each content type in the 200 response
              Object.values(response200.content).forEach((content) => {
                // Retrieve the schema reference
                const ref = content['schema']?.$ref
                // If the reference exists, extract the type of object from the referenced schema
                if (ref) {
                  const match = ref.match(/#\/components\/schemas\/(.+)/)
                  // If a match is found, add the type to availableTypes (with its version)
                  if (match) {
                    if (areSchemasSuffixed) {
                      availableTypes.push(`${match[1]}_v${xVersion}`)
                    } else {
                      availableTypes.push(`${match[1]}`)
                    }
                  }
                }
              })
            }
          })
        })
      }
    })
    return availableTypes
  }

  /**
   * Identifies and returns a map of interface along with their child types.
   *
   * @returns {Record<string, string[]>} An object where keys are interface names
   * and values are arrays of child schema names.
   *
   * This function iterates through all Swagger specifications to find schemas that
   * use discriminators. For each schema with a discriminator, it collects the mapping
   * of the discriminator and associates child schemas to the parent schema.
   */
  getInterfacesWithChildren(): Record<string, string[]> {
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

  /**
   * Creates and returns GraphQL type definitions and resolvers based on the Swagger specifications.
   * The function processes each Swagger specification and extracts or generates GraphQL types and resolvers.
   *
   * @returns {ConfigExtension} An object containing the type definitions and resolvers.
   *
   * This function supports configurations that allow for schema renaming based on the Swagger version.
   */
  createTypeDefsAndResolvers() {
    let areSchemasSuffixed = false
    if (this.config.sources) {
      this.specs.forEach((spec, index) => {
        // Apply naming transformations if specified in the configuration
        if (
          spec.components &&
          this.config.sources[index]?.transforms?.find(
            (transform) => transform.rename !== undefined
          )
        ) {
          // Extract the major version from the Swagger specification
          const xVersion = spec.info.version.split('.')[0]
          // Create a new object to store schemas with version suffixes
          const schemasWithSuffix = {}
          // Suffix each schema name with the major version number
          Object.entries(spec.components.schemas).forEach(([key, schema]) => {
            schemasWithSuffix[`${key}_v${xVersion}`] = schema
          })
          // Replace the original schemas with the suffixed schemas
          spec.components.schemas = schemasWithSuffix
          areSchemasSuffixed = true
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

    const availableTypes = this.getAvailableTypes(areSchemasSuffixed)
    const interfacesWithChildren = this.getInterfacesWithChildren()
    const catalog = this.catalog
    const config = this.config

    // Reduce over the specifications to generate and accumulate type definitions and resolvers
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

  /**
   * Generates and returns an array of OpenAPI sources configured for the project.
   * Each source includes a name, handler configurations, and possible transformations.
   *
   * @returns {OpenApiSource[]} An array of configured OpenAPI sources.
   *
   * This function maps over the `this.swaggers` array and constructs an object for each source,
   * incorporating relevant configurations such as endpoint and headers.
   */
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

  /**
   * Filters and returns an array of sources that are not OpenAPI sources from the configuration.
   *
   * @returns {OtherSource[]} An array of sources that do not use OpenAPI handlers.
   *
   * This function checks the `this.config.sources` array and filters out any source
   * that has an OpenAPI handler configuration.
   */
  getOtherSources() {
    return (
      this.config.sources?.filter(
        (source: { handler: { openapi: any } }) => !source?.handler?.openapi
      ) || []
    )
  }

  /**
   * Constructs and returns a complete Mesh configuration object based on the Swagger specifications and custom sources.
   *
   * @returns {MeshConfig} An object containing the default configuration, additional type definitions, resolvers, and sources.
   *
   * This function integrates type definitions and resolvers generated from the Swagger specifications
   * and combines OpenAPI sources with other custom sources from the configuration.
   */
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
