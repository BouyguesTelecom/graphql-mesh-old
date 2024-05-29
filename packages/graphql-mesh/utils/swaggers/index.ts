import { Spec, ConfigExtension, Resolvers } from '../../types'
import { getSourceName } from '../config'
import { trimLinks, anonymizePathAndGetParams } from '../helpers'
import type { OpenAPIV3 } from 'openapi-types'

/**
 * This function creates, for a Swagger file, the additional typeDefs for each schema having at least one x-link, and one resolver for each x-link
 * @param swagger, one unique Swagger file
 * @param availableTypes, a list of the types that can be extended via additionalTypeDefs
 * @returns an object with two elements: the additional typeDefs and resolvers of the Swagger file
 */
export const generateTypeDefsAndResolversFromSwagger = (
  spec: Spec,
  availableTypes: string[],
  interfacesWithChildren: { [key: string]: string[] },
  catalog: { [key: string]: [string, string, string] },
  config: any
): ConfigExtension => {
  if (!spec.components) {
    console.warn('No components found in the swagger file')
    return { typeDefs: '', resolvers: {} }
  }

  const { schemas } = spec.components
  if (!schemas) {
    console.warn('No schemas found in the swagger file')
    return { typeDefs: '', resolvers: {} }
  }

  let typeDefs = ''
  const resolvers: Resolvers = {}
  const _actionsItems = getActionsItems(schemas)

  const isSpecialKey = ([key, _value]) =>
    key === 'x-links' || key === 'x-graphql-prefix-schema-with'

  Object.entries(schemas).forEach(([schemaKey, schemaValue]) => {
    Object.entries(schemaValue)
      .filter(isSpecialKey)
      .forEach(([, value]) => {
        const trimedSchemaKey = trimLinks(schemaKey)
        const schemaType = Object.keys(interfacesWithChildren).includes(trimedSchemaKey)
          ? 'interface'
          : 'type'

        // "x-graphql-prefix-schema-with" extension
        if (typeof value === 'string') {
          typeDefs += `extend ${schemaType} ${schemaKey} @prefixSchema(prefix: "${value}") { dummy: String }\n`
          if (schemaType === 'interface') {
            interfacesWithChildren[schemaKey].forEach((children) => {
              typeDefs += `extend type ${children} { dummy: String }\n`
            })
          }
        }

        // "x-links" extension
        if (typeof value === 'object') {
          typeDefs += `extend ${schemaType} ${trimedSchemaKey} {\n`

          const xLinksList: {
            rel: string
            type: string
            hrefPattern: string
          }[] = value

          let matchedSwagger = 'NOT_FOUND'

          const subResolver: object = {}
          let _linksItems = ''

          for (const xLink of xLinksList) {
            const xLinkName = xLink.rel.replaceAll('-', '_').replaceAll(' ', '')
            const xLinkPath = xLink.hrefPattern

            let matchedName = 'NOT_FOUND'
            let matchedType = 'NOT_FOUND'

            const { params: _, anonymizedPath: anonymizedPathFromLink } =
              anonymizePathAndGetParams(xLinkPath)

            const matchedPath = Object.keys(catalog).filter(
              (key) => anonymizePathAndGetParams(key).anonymizedPath === anonymizedPathFromLink
            )[0]

            if (matchedPath) {
              ;[matchedName, matchedType, matchedSwagger] = catalog[matchedPath]
              if (!availableTypes.includes(matchedType)) {
                matchedType = 'NOT_FOUND'
              }
            }

            const paramsToSend = anonymizePathAndGetParams(matchedPath).params
            const query = matchedName
            const source = getSourceName(matchedSwagger, config)

            if (
              matchedType !== 'NOT_FOUND' &&
              !(trimedSchemaKey !== matchedType && xLinkName === 'self')
            ) {
              typeDefs += `${xLinkName}: ${matchedType}\n`

              _linksItems += /* GraphQL */ `
                ${xLinkName}
                {
                  href
                }
              `

              subResolver[xLinkName] = {
                selectionSet:
                  _actionsItems !== ''
                    ? /* GraphQL */ `
                {
                  _links {
                    ${_linksItems}
                  }
                  _actions {
                    ${_actionsItems}
                  }
                }`
                    : /* GraphQL */ `
                {
                  _links {
                    ${_linksItems}
                  }
                }`,

                resolve: (root: any, args: any, context: any, info: any) => {
                  const hateoasLink: any = Object.entries(root._links).find(
                    (item) => item[0] === xLinkName
                  )?.[1]

                  if (hateoasLink?.href) {
                    root = { ...root, followLink: hateoasLink.href }
                  }

                  if (paramsToSend.length) {
                    paramsToSend.forEach((param) => {
                      args[param] = ''
                    })
                  }

                  return context[source].Query[query]({ root, args, context, info })
                }
              }
            }
          }

          // Resolvers for _linksList and _actionsList
          if (Object.keys(subResolver).length) {
            typeDefs += /* GraphQL */ `_linksList: [LinkItem]\n`
            subResolver['_linksList'] = {
              selectionSet: /* GraphQL */ `
              {
                _links {
                  ${_linksItems}
                }
              }`,
              resolve: (root: any) => {
                return Object.keys(root?._links || {})
                  .filter((key) => root._links[key]?.href)
                  .map((key) => ({
                    rel: key,
                    href: root._links[key]?.href
                  }))
              }
            }
            if (_actionsItems !== '') {
              typeDefs += /* GraphQL */ `_actionsList: [ActionItem]\n`
              subResolver['_actionsList'] = {
                selectionSet: /* GraphQL */ `
                {
                  _actions {
                    ${_actionsItems}
                  }
                }`,
                resolve: (root: any) => {
                  return (
                    Object.keys(root?._actions || {})
                      .filter((key) => root._actions[key]?.action)
                      .map((key) => ({
                        rel: key,
                        action: root._actions[key]?.action
                      })) || []
                  )
                }
              }
            }
          }

          typeDefs += '}\n'

          // Delete the typedefs section if no new fields have been added
          typeDefs = typeDefs.replace(`extend ${schemaType} ${trimedSchemaKey} {\n}\n`, '')

          if (matchedSwagger !== 'NOT_FOUND') {
            resolvers[trimedSchemaKey] = subResolver
          }

          // If an interface has new links, its children need to have these links too
          if (
            schemaType === 'interface' &&
            typeDefs !== '' &&
            resolvers[trimedSchemaKey] !== undefined
          ) {
            let currentKey = trimedSchemaKey

            interfacesWithChildren[trimedSchemaKey].forEach((childKey) => {
              if (!Object.keys(interfacesWithChildren).includes(childKey)) {
                typeDefs += typeDefs
                  .match(/[\s\S]*(^[\s\S]*{[\s\S]*)/m)![1]
                  .replace('interface', 'type')
                  .replace(new RegExp(` ${currentKey} `, 'g'), ` ${childKey} `)

                resolvers[childKey] ??= {}
                for (const prop in resolvers[trimedSchemaKey]) {
                  resolvers[childKey][prop] = resolvers[trimedSchemaKey][prop]
                }

                currentKey = childKey
              }
            })

            resolvers[trimedSchemaKey].__resolveType = (res, _, schema) => {
              if (res.__typename) {
                return res.__typename
              }
              return interfacesWithChildren[schema.returnType.name][1]
            }
          }
        }
      })
  })

  return { typeDefs, resolvers }
}

export const getActionsItems = (schemas: OpenAPIV3.ComponentsObject) => {
  let _actionsItems = ''
  Object.entries(schemas).forEach(([, schemaValue]) => {
    const actions = schemaValue['x-actions'] || []
    if (actions.length) {
      _actionsItems += actions.reduce((acc, item) => {
        return (
          acc +
          /* GraphQL */ `
            ${item.rel}
            {
              action
            }
          `
        )
      }, '')
    }
  })

  return _actionsItems
}

export const getAvailableTypes = (specs: Spec[]) =>
  specs.flatMap((spec) => Object.keys(spec.components?.schemas ?? {}))
