import { type Plugin, ObjMap } from '@envelop/core'

/**
 * This plugin filters out null values from the response.
 */
export default ({ filter }): Plugin => {
  return {
    onExecute() {
      return {
        onExecuteDone({ result, setResult }) {
          if (filter && (result as ObjMap<{ data: Object }>).data !== null) {
            if (isDataEmpty((result as ObjMap<{ data: Object }>).data)) {
              delete (result as ObjMap<{ data: Object }>).data
              setResult({
                ...result
              })
            } else {
              setResult({
                ...result,
                data: filterNullValues((result as ObjMap<{ data: Object }>).data)
              })
            }
          }
        }
      }
    }
  }
}

const filterNullValues = (obj: { data: Object | string[] }) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') {
      filterNullValues(obj[key])
    } else if (obj[key] == null) {
      delete obj[key]
    }
  })
  return obj
}

const isDataEmpty = (obj: { data: Object | string[] }) => {
  const checkProperties = (value: any): boolean => {
    if (value === null || value === undefined) {
      return true
    }
    if (typeof value !== 'object') {
      return false
    }
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        if (!checkProperties(value[key])) {
          return false
        }
      }
    }
    return true
  }
  return checkProperties(obj)
}
