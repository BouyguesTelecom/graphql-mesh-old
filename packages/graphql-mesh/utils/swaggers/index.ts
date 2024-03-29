import { Spec, ConfigExtension, Resolvers } from '../../types'
import { trimLinks, anonymizePathAndGetParams } from '../helpers'
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
  catalog: { [key: string]: [string, string, string] }
): ConfigExtension => {
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

export const getAvailableTypes = (specs: Spec[]) =>
  specs.flatMap((spec) => Object.keys(spec.components?.schemas ?? {}))
