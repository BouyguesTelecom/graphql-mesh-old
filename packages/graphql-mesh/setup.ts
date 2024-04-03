import { globSync } from 'glob'
import { readFileSync } from 'node:fs'
import type { Catalog, Spec, SwaggerName, Resolvers, ConfigExtension } from './types'
import {
  getConfig,
  mergeObjects,
  trimLinks,
  anonymizePathAndGetParams,
  getOpenapiEnpoint,
  getAvailableTypes
} from './helpers'

// Load the config file
const config = getConfig()

const SWAGGERS: SwaggerName[] = globSync('./sources/**/*.json').sort((a, b) => a.localeCompare(b))

const specsRaw = SWAGGERS.map(
  (swagger) => <Spec>JSON.parse(readFileSync(swagger, { encoding: 'utf-8' }))
)

const catalog = specsRaw.reduce((acc, spec, i) => {
  Object.keys(spec.paths).forEach((path) => {
    const query = spec.paths[path]?.get
    const content = query?.responses['200']?.['content']
    const ref = content?.['application/json']?.schema['$ref'] ?? content?.['*/*']?.schema['$ref']
    const schema = ref?.replace('#/components/schemas/', '')
    if (schema) {
      acc[path] = [query?.operationId, schema, SWAGGERS[i]]
    }
  })
  return acc
}, {} as Catalog)

let interfacesWithChildren = {}
specsRaw.forEach((s) => {
  const { schemas } = s.components
  const entries = Object.entries(schemas).filter(([_, value]) =>
    Object.keys(value).includes('discriminator')
  )
  for (const [schemaKey, schemaValue] of entries) {
    const mapping = schemaValue['discriminator']['mapping'] ?? {}
    const mappingTypes = []
    mappingTypes.push(
      ...Object.keys(mapping)
        .filter((k) => k !== schemaKey)
        .map((k) => mapping[k].replace('#/components/schemas/', ''))
    )
    if (interfacesWithChildren[schemaKey] === undefined) {
      interfacesWithChildren[schemaKey] = mappingTypes
    } else {
      mappingTypes.forEach((type) => {
        if (!interfacesWithChildren[schemaKey].includes(type)) {
          interfacesWithChildren[schemaKey].push(type)
        }
      })
    }
  }
})

export const openapiSources =
  SWAGGERS.map((source) => ({
    name: source,
    handler: {
      openapi: {
        source,
        endpoint: getOpenapiEnpoint(source, config) || '{env.ENDPOINT}',
        ignoreErrorResponses: true,
        operationHeaders: {
          Authorization: `{context.headers["authorization"]}`
        }
      }
    }
  })) || []

/**
 * This function creates, for a Swagger file, the additional typeDefs for each schema having at least one x-link, and one resolver for each x-link
 * @param swagger, one unique Swagger file
 * @param availableTypes, a list of the types that can be extended via additionalTypeDefs
 * @returns an object with two elements: the additional typeDefs and resolvers of the Swagger file
 */
function createTypeDefsAndResolversFromOneSwagger(
  spec: Spec,
  availableTypes: string[]
): ConfigExtension {
  if (!spec.components) {
    return {
      typeDefs: '',
      resolvers: {}
    }
  }

  const { schemas } = spec.components

  if (!schemas) {
    console.warn('No schemas found in the swagger files')

    return {
      typeDefs: '',
      resolvers: {}
    }
  }

  let typeDefs = ''

  const resolvers: Resolvers = {}

  const isKeyXlink = ([key, _value]) => key === 'x-links'

  Object.entries(schemas).forEach(([schemaKey, schemaValue]) => {
    Object.entries(schemaValue)
      .filter(isKeyXlink)
      .forEach(([, schema]) => {
        const trimedSchemaKey = trimLinks(schemaKey)
        const objToExtend = Object.keys(interfacesWithChildren).includes(trimedSchemaKey)
          ? 'interface'
          : 'type'

        typeDefs += `extend ${objToExtend} ${trimedSchemaKey} {\n`

        const xLinksList: {
          rel: string
          type: string
          hrefPattern: string
        }[] = schema
        let targetedSwaggerName = 'SWAGGER_NOT_FOUND'

        let objResolver: object = {}
        let _linksItems = ''
        for (let x = 0; x < xLinksList.length; x++) {
          const xLink = xLinksList[x]
          const xLinkName = xLink.rel.replaceAll('-', '_').replaceAll(' ', '')
          const xLinkPath = xLink.hrefPattern
          let targetedOperationName = 'NAME_NOT_FOUND'
          let targetedOperationType = 'TYPE_NOT_FOUND'

          const { params: paramsFromLink, anonymizedPath: anonymizedPathFromLink } =
            anonymizePathAndGetParams(xLinkPath)

          const matchedPathsForLinks = Object.keys(catalog).filter(
            (key) => anonymizePathAndGetParams(key).anonymizedPath === anonymizedPathFromLink
          )

          if (matchedPathsForLinks.length) {
            ;[targetedOperationName, targetedOperationType, targetedSwaggerName] =
              catalog[matchedPathsForLinks[0]]
            if (!availableTypes.includes(targetedOperationType)) {
              targetedOperationType = 'TYPE_NOT_FOUND'
            }
          }

          const paramsToSend: string[] = []
          matchedPathsForLinks.forEach((key) =>
            paramsToSend.push(...anonymizePathAndGetParams(key).params)
          )

          const query = targetedOperationName
          const type = targetedOperationType
          const source = targetedSwaggerName

          if (
            targetedOperationType !== 'TYPE_NOT_FOUND' &&
            !(trimedSchemaKey !== targetedOperationType && xLinkName === 'self')
          ) {
            typeDefs += `${xLinkName}: ${targetedOperationType}\n`

            _linksItems += /* GraphQL */ `
              ${xLinkName}
              {
                href
              }
            `
            objResolver[xLinkName] = {
              selectionSet: /* GraphQL */ `
                {
                  _links {
                    ${_linksItems}
                  }
                }
              `,
              resolve: (root: any, args: any, context: any, info: any) => {
                const hateoasLink: any = Object.entries(root._links).find(
                  (item) => item[0] === xLinkName
                )?.[1]

                if (hateoasLink?.href) {
                  root = { ...root, followLink: hateoasLink.href }
                }

                if (paramsToSend.length) {
                  paramsToSend.forEach((param, i) => {
                    args[param] = root[param] || root[paramsFromLink[i]] || ''
                  })
                }

                return context[source].Query[query]({
                  root,
                  args,
                  context,
                  info
                })
              }
            }
          }
        }

        /** Resolver for _linksList */
        if (Object.keys(objResolver).length) {
          typeDefs += /* GraphQL */ `_linksList: [LinkItem]\n`
          objResolver['_linksList'] = {
            selectionSet: /* GraphQL */ `
              {
                _links {
                  ${_linksItems}
                }
              }
            `,
            resolve: (root: any) => {
              return Object.keys(root._links)
                .filter((key) => root._links[key]?.href)
                .map((key) => ({
                  rel: key,
                  href: root._links[key]?.href
                }))
            }
          }
        }

        typeDefs += '}\n'
        typeDefs = typeDefs.replace(`extend ${objToExtend} ${trimedSchemaKey} {\n}\n`, '')

        if (targetedSwaggerName !== 'SWAGGER_NOT_FOUND') {
          resolvers[trimedSchemaKey] = objResolver
        }

        if (
          objToExtend === 'interface' &&
          typeDefs !== '' &&
          resolvers[trimedSchemaKey] !== undefined
        ) {
          let varToCompare = trimedSchemaKey
          interfacesWithChildren[trimedSchemaKey].forEach((type) => {
            const regex = new RegExp(` ${varToCompare} `, 'g')
            if (Object.keys(interfacesWithChildren).includes(type)) {
              typeDefs += typeDefs
                .match(/[\s\S]*(^[\s\S]*{[\s\S]*)/m)![1]
                .replace('type', 'interface')
                .replace(regex, ` ${type} `)
              varToCompare = type
              resolvers[type] ??= {}
              for (const key in resolvers[trimedSchemaKey]) {
                resolvers[type][key] = resolvers[trimedSchemaKey][key]
              }

              interfacesWithChildren[type].forEach((t) => {
                const regex2 = new RegExp(` ${varToCompare} `, 'g')
                typeDefs += typeDefs
                  .match(/[\s\S]*(^[\s\S]*{[\s\S]*)/m)![1]
                  .replace('interface', 'type')
                  .replace(regex2, ` ${t} `)
                varToCompare = t

                resolvers[t] ??= {}
                for (const key in resolvers[type]) {
                  resolvers[t][key] = resolvers[type][key]
                }
              })
            } else {
              typeDefs += typeDefs
                .match(/[\s\S]*(^[\s\S]*{[\s\S]*)/m)![1]
                .replace('interface', 'type')
                .replace(regex, ` ${type} `)
              varToCompare = type

              resolvers[type] ??= {}
              for (const key in resolvers[trimedSchemaKey]) {
                resolvers[type][key] = resolvers[trimedSchemaKey][key]
              }
            }
          })

          resolvers[trimedSchemaKey].__resolveType = (res, _, schema) => {
            if (res.__typename !== undefined) {
              return res.__typename
            } else {
              if (schema.parentType._fields[schema.fieldName] !== undefined) {
                //TODO:
                return interfacesWithChildren[
                  schema.parentType._fields[schema.fieldName].type.name
                ][
                  interfacesWithChildren[schema.parentType._fields[schema.fieldName].type.name]
                    .length - 1
                ]
              } else {
                return interfacesWithChildren[schema.fieldName][0]
              }
            }
          }
        }
      })
  })

  return { typeDefs, resolvers }
}

/**
 * This function merges the additional typeDefs and resolvers of each Swagger file into one
 * @param specsList, a list of Swagger files
 * @returns an object with two elements: the merged typeDefs and the merged resolvers
 */
function createTypeDefsAndResolvers(specs: Spec[]) {
  const availableTypes = getAvailableTypes(specs)
  return specs.reduce(
    (acc, spec) => {
      const { typeDefs, resolvers } = createTypeDefsAndResolversFromOneSwagger(spec, availableTypes)
      acc.typeDefs += typeDefs
      acc.resolvers = mergeObjects(acc.resolvers, resolvers)
      return acc
    },
    { typeDefs: '', resolvers: {} } as ConfigExtension
  )
}

const typeDefsAndResolvers = createTypeDefsAndResolvers(specsRaw)

typeDefsAndResolvers.typeDefs += /* GraphQL */ `
  directive @SPL(query: String) on FIELD
`

typeDefsAndResolvers.typeDefs += /* GraphQL */ `
  directive @noAuth on FIELD
`

typeDefsAndResolvers.typeDefs += /* GraphQL */ `
  directive @upper on FIELD
`

typeDefsAndResolvers.typeDefs += /* GraphQL */ `
  type LinkItem {
    rel: String
    href: String
  }
`
typeDefsAndResolvers.typeDefs += /* GraphQL */ `
  input Header {
    key: String
    value: String
  }

  directive @headers(input: [Header]) on FIELD
`

export const additionalTypeDefs = typeDefsAndResolvers.typeDefs
export const resolvers = typeDefsAndResolvers.resolvers
export const defaultConfig = config
export const othersSources =
  config.sources?.filter((source: { handler: { openapi: any } }) => !source?.handler?.openapi) || []
