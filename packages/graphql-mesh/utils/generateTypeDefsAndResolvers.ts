import { Spec, ConfigExtension, Resolvers, Catalog, XLink, CatalogContent } from '../types'
import { getSourceName } from './parseYamlConfig'
import {
  trimLinks,
  anonymizePathAndGetParams,
  sortSwaggersByVersionDesc,
  getActionsItems,
  isSpecialKey,
  getHighestVersionAvailable
} from './helpers'

/**
 * This function creates, for one Swagger file, the additional typeDefs and resolvers required to handle
 * HATEOAS links and the prefixation of some schemas.
 *
 * @param spec - A Swagger file
 * @param availableTypes - An exhaustive list of the types available across the entire config
 * @param interfacesWithChildren - An exhaustive list of all the interfaces, with their children
 * @param catalog - An object, where the keys are operation paths and the values are: {the corresponding operationIds, the type returned by the operation, the list of swaggers containing this path}
 * @param config - The default config
 * @returns {ConfigExtension} An object with two elements: the additional typeDefs and the additional resolvers
 */
export const generateTypeDefsAndResolversFromSwagger = (
  spec: Spec,
  availableTypes: string[],
  interfacesWithChildren: { [key: string]: string[] },
  catalog: Catalog,
  config: any
): ConfigExtension => {
  // If there are no schemas in the components section, log a warning and return empty typeDefs and resolvers
  if (!spec.components?.schemas) {
    console.warn('No components found in the swagger file')
    return { typeDefs: '', resolvers: {} }
  }

  const { schemas } = spec.components

  let typeDefs = ''
  const resolvers: Resolvers = {}

  // Iterate over each schema in the Swagger file
  Object.entries(schemas).forEach(([schemaKey, schemaValue]) => {
    Object.entries(schemaValue)
      // Filter for special keys such as 'x-links' and 'x-graphql-prefix-schema-with'
      .filter(isSpecialKey)
      .forEach(([key, value]) => {

        // HANDLE SCHEMA PREFIXATION
        if (key === 'x-graphql-prefix-schema-with') {
          const schemaType = Object.keys(interfacesWithChildren).includes(schemaKey)
            ? 'interface'
            : 'type'

          // Add a prefixSchema directive to the type definition
          typeDefs += `extend ${schemaType} ${schemaKey} @prefixSchema(prefix: "${value}") { dummy: String }\n`

          // If it's an interface, prefix each of its children too
          if (schemaType === 'interface') {
            interfacesWithChildren[schemaKey].forEach((children) => {
              const parentVersion = schemaKey.split('_')[schemaKey.split('_').length - 1]
              if (parentVersion !== schemaKey) {
                children += `_${parentVersion}`
              }
              if (!Object.keys(interfacesWithChildren).includes(children)) {
                typeDefs += `extend type ${children} { dummy: String }\n`
              }
            })
          }
        }

        // HANDLE HATEOAS LINKS PROCESSING
        if (key === 'x-links') {
          const trimedSchemaKey = trimLinks(schemaKey)
          const schemaType = Object.keys(interfacesWithChildren).includes(trimedSchemaKey)
            ? 'interface'
            : 'type'

          let _linksItems = ''
          const _actionsItems = getActionsItems(schemas)

          let subTypeDefs = `extend ${schemaType} ${trimedSchemaKey} {\n`
          const subResolver = {}

          const xLinkList: XLink[] = value
          let matchedLinkItems: CatalogContent = {
            operationIds: undefined,
            type: undefined,
            swaggers: undefined
          }

          // Process each HATEOAS link in the x-links array
          for (const xLink of xLinkList) {
            // Replace illegal characters in the link name
            const xLinkName = xLink.rel.replaceAll('-', '_').replaceAll(' ', '')
            const xLinkPath = xLink.hrefPattern

            // Find the corresponding path in the catalog
            const matchedPath = Object.keys(catalog).filter(
              (key) =>
                anonymizePathAndGetParams(key).anonymizedPath ===
                anonymizePathAndGetParams(xLinkPath).anonymizedPath
            )[0]

            if (matchedPath) {
              matchedLinkItems = catalog[matchedPath]
            } else {
              matchedLinkItems = {
                operationIds: undefined,
                type: undefined,
                swaggers: undefined
              }
            }

            const paramsToSend = anonymizePathAndGetParams(matchedPath).params
            const operationIds = matchedLinkItems.operationIds
            const sourceSwaggers = matchedLinkItems.swaggers

            const highestVersion = getHighestVersionAvailable(availableTypes, matchedLinkItems.type)
            // If the matched type is suffixed/versioned
            if (matchedLinkItems.type && highestVersion >= 0) {
              _linksItems += /* GraphQL */ `
                ${xLinkName}
                {
                  href
                }
              `
              // Add a new link for the highest version available and all the smaller versions available too
              for (let currentVersion = highestVersion; currentVersion >= 0; currentVersion--) {
                if (availableTypes.includes(`${matchedLinkItems.type}_v${currentVersion}`)) {
                  const currentLink = `${xLinkName}_v${currentVersion}`

                  subTypeDefs += `${currentLink}: ${matchedLinkItems.type}_v${currentVersion}\n`

                  subResolver[currentLink] = {
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
                          args[param] = '0'
                        })
                      }

                      const availableSwaggers = sourceSwaggers
                        .filter((swagger) => swagger.includes(`@${currentVersion}`))
                        .sort(sortSwaggersByVersionDesc)

                      const versionedSource = getSourceName(availableSwaggers[0], config)
                      const versionedQueryName = `${Object.keys(context[versionedSource]).find(
                        (key) => key.includes('Query')
                      )}`

                      const operationId = operationIds[sourceSwaggers.indexOf(availableSwaggers[0])]
                      const versionedOperationId = `${operationId}_v${currentVersion}`

                      return context[versionedSource][versionedQueryName][versionedOperationId]({
                        root,
                        args,
                        context,
                        info
                      })
                    }
                  }
                }
              }
            }
            // If the matched type is not suffixed/not versioned
            else if (
              matchedLinkItems.type &&
              availableTypes.includes(matchedLinkItems.type) &&
              highestVersion === -1
            ) {
              _linksItems += /* GraphQL */ `
                ${xLinkName}
                {
                  href
                }
              `

              subTypeDefs += `${xLinkName}: ${matchedLinkItems.type}\n`

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
                      args[param] = '0'
                    })
                  }

                  return context[sourceSwaggers[0]]
                    ? context[sourceSwaggers[0]].Query[operationIds[0]]({
                        root,
                        args,
                        context,
                        info
                      })
                    : context[
                        sourceSwaggers[0]
                          .split('/')
                          [sourceSwaggers[0].split('/').length - 1].split('.')[0]
                          .substring(2)
                      ].Query[operationIds[0]]({ root, args, context, info })
                }
              }
            }
          }

          // Resolvers for _linksList and _actionsList
          if (Object.keys(subResolver).length) {
            subTypeDefs += /* GraphQL */ `_linksList: [LinkItem]\n`
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
              subTypeDefs += /* GraphQL */ `_actionsList: [ActionItem]\n`
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

          subTypeDefs += '}\n'

          // Delete the additional typeDefs section if no new fields have been added
          subTypeDefs = subTypeDefs.replace(`extend ${schemaType} ${trimedSchemaKey} {\n}\n`, '')

          if (matchedLinkItems.swaggers) {
            typeDefs += subTypeDefs
            resolvers[trimedSchemaKey] = subResolver
          }

          // Special handling for interfaces
          if (
            schemaType === 'interface' &&
            typeDefs !== '' &&
            resolvers[trimedSchemaKey] !== undefined
          ) {
            let currentKey = trimedSchemaKey
            const parentVersion = trimedSchemaKey.split('_')[trimedSchemaKey.split('_').length - 1]

            // If an interface has new typeDefs, its children need to have these new typeDefs too
            interfacesWithChildren[trimedSchemaKey].forEach((childKey) => {
              if (parentVersion !== trimedSchemaKey) {
                childKey += `_${parentVersion}`
              }
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

            // Interfaces need to have the additional '__resolveType' property
            resolvers[trimedSchemaKey].__resolveType = (res, _, schema) => {
              if (res.__typename) {
                return res.__typename
              }
              const returnTypeName = schema.returnType.name
              const parentVersion = returnTypeName.split('_')[returnTypeName.split('_').length - 1]
              return parentVersion !== trimedSchemaKey
                ? `${interfacesWithChildren[schema.returnType.name][1]}_${parentVersion}`
                : `${interfacesWithChildren[schema.returnType.name][1]}`
            }
          }
        }
      })
  })

  return { typeDefs, resolvers }
}
