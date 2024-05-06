import { type Plugin, ObjMap } from '@envelop/core'

/**
 * This plugin filters out null values from the response.
 */
export default ({ filter }): Plugin => {
  return {
    onExecute() {
      return {
        onExecuteDone({ result, setResult }) {
          if (filter && (result as ObjMap<{ data: Object }>).data != null) {
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
