import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { MeshTransform } from '@graphql-mesh/types'
import { MapperKind, mapSchema } from '@graphql-tools/utils'
import { splListFilterer } from './main'

export default class DirectivesTransform implements MeshTransform {
  noWrap = true

  transformSchema(schema: GraphQLSchema) {
    return mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const originalResolver =
          fieldConfig.resolve != null ? fieldConfig.resolve : defaultFieldResolver

        const resolver = async (next: any , _source: any, _args: any, context: any, info: any) => {
          const { directives } = info.fieldNodes[0]
          const upperDirective = directives.find((directive: { name: { value: string } }) => directive.name.value === 'upper')
          const splDirective = directives.find((directive: { name: { value: string } }) => directive.name.value === 'SPL')
          const noAuthDirective = directives.find((directive: { name: { value: string } }) => directive.name.value === 'noAuth')
          const headersDirective = directives.find(
            (directive: { name: { value: string } }) => directive.name.value === 'headers'
          )

          if (noAuthDirective) {
            context = { ...context, headers: { ...context.headers, authorization: '' } }
          }

          if (headersDirective) {
            const { value } = headersDirective.arguments[0]

            value?.values?.forEach((item: { fields: [any, any] }) => {
              const [headerName, headerValue] = item.fields
              context = {
                ...context,
                headers: {
                  ...context.headers,
                  [headerName.value.value.toLowerCase()]: headerValue.value.value
                }
              }
            })
          }

          /**
           * In order to set headers for the request, we need override authorization headers
           * an pass it to execute function
           */
          let result = await next(context)

          if (splDirective) {
            const { value } = splDirective.arguments[0]

            let data = splListFilterer.filter(
              value.value,
              splListFilterer.formatInput(result),
              splListFilterer.formatVariables(context.params.variables || {})
            )
            result = splListFilterer.formatOutput(data)
          }

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
