export const mergeObjects = (obj1: any, obj2: any) => {
  for (const key in obj2) {
    if (key in obj1 && typeof obj1[key] === 'object') {
      obj1[key] = mergeObjects(obj1[key], obj2[key])
    } else {
      obj1[key] = obj2[key]
    }
  }
  return obj1
}

export const trimLinks = (str: string) => str.replace(/Links$/, '')

/**
 * Anonymize path and get params
 * @param path {string}
 * @returns
 */
export const anonymizePathAndGetParams = (path: string) => {
  const params: string[] = path.match(/\{(.*?)\}/g) ?? []

  return {
    anonymizedPath: path.replace(/\/(\{[^}]+\})/g, '/{}'),
    params: params.map((param) => param.replace(/[{}]/g, ''))
  }
}