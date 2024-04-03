import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { MeshTransform } from '@graphql-mesh/types'
import { MapperKind, mapSchema } from '@graphql-tools/utils'

export default class NoAuthDirectiveTransform implements MeshTransform {
  noWrap = true

  transformSchema(schema: GraphQLSchema) {
    return mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const originalResolver =
          fieldConfig.resolve != null ? fieldConfig.resolve : defaultFieldResolver

        const resolver = async (next: any , _source: any, _args: any, context: any, info: any) => {
          const { directives } = info.fieldNodes[0]
          const upperDirective = directives.find((directive: { name: { value: string } }) => directive.name.value === 'upper')
          const noAuthDirective = directives.find((directive: { name: { value: string } }) => directive.name.value === 'noAuth')

          /**
           * In order to set headers for the request, we need override authorization headers
           * an pass it to execute function
           */
          if (noAuthDirective) {
            context = { ...context, headers: { ...context.headers, authorization: '' } }
          }
          let result = await next(context)


          if (upperDirective) {
            if (typeof result === 'string') {
              result = result.toUpperCase()
            }
          }

          return result
        }

        fieldConfig.resolve = (source, originalArgs, context, info) => {
          return resolver(
            (context: unknown) =>
              new Promise((resolve, reject) => {
                const result = originalResolver(source, originalArgs, context, info)
                if (result instanceof Error) {
                  reject(result)
                }
                resolve(result)
              }),
            source,
            originalArgs,
            context,
            info
          )
        }
        return fieldConfig
      }
    })
  }
}
