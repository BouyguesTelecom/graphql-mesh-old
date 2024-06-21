import type { OpenAPIV3 } from 'openapi-types'

export const mergeObjects = (obj1: any, obj2: any) => {
  for (const key in obj2) {
    obj1[key] =
      key in obj1 && typeof obj1[key] === 'object' ? mergeObjects(obj1[key], obj2[key]) : obj2[key]
  }
  return obj1
}

export const isSpecialKey = ([key, _value]) =>
  key === 'x-links' || key === 'x-graphql-prefix-schema-with'

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

/**
 * Remove "Links" from a string
 * Ex: trimLinks(VehicleLinks) = Vehicle ; trimLinks(ProductsLinks_v1) = Products_v1
 * @param schemaName - A string
 * @returns the input string without "Links"
 */
export const trimLinks = (schemaName: string) =>
  schemaName.substring(schemaName.length - 2, schemaName.length - 1) === '_v'
    ? schemaName.replace(/Links_/, '_')
    : schemaName.replace(/Links/, '')

/**
 * Remove the parameters from an URL path and store them in a variable
 * @param path - An URL path
 * @returns an object with 2 elements: the anonymized URL path and its parameters
 */
export const anonymizePathAndGetParams = (path: string) => {
  const params: string[] = path?.match(/\{(.*?)\}/g) ?? []

  return {
    anonymizedPath: path?.replace(/\/(\{[^}]+\})/g, '/{}'),
    params: params.map((param) => param.replace(/[{}]/g, ''))
  }
}

// Compare 2 swaggers with the same major version
export const sortSwaggersByVersionDesc = (swaggerNameA: string, swaggerNameB: string) => {
  return getVersionY(swaggerNameB) !== getVersionY(swaggerNameA)
    ? getVersionY(swaggerNameB) - getVersionY(swaggerNameA)
    : getVersionZ(swaggerNameB) - getVersionZ(swaggerNameA)
}
function getVersionY(swaggerName: string) {
  return parseInt(swaggerName.split('@')[1].split('.')[1])
}
function getVersionZ(swaggerName: string) {
  return parseInt(swaggerName.split('@')[1].split('.')[2].split('_')[0])
}

/**
 * For one spcific type, get its highest available version
 * @param availableTypes - An exhaustive list of every available types
 * @param type - The name of a specific type (not versioned)
 * @returns a positive integer representing the highest available version of the type || -1 if no versions of the type exist
 */
export const getHighestVersionAvailable = (availableTypes: string[], type: string) => {
  if (!availableTypes.some((t) => t.startsWith(`${type}_v`))) {
    return -1
  } else {
    const sortedTypeVersions = availableTypes
      .filter((t) => t.startsWith(`${type}_v`))
      .sort((a, b) => b.localeCompare(a))
    return parseInt(
      sortedTypeVersions[0].substring(
        sortedTypeVersions[0].length - 1,
        sortedTypeVersions[0].length
      )
    )
  }
}
