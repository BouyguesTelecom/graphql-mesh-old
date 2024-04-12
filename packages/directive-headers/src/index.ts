import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { MeshTransform } from '@graphql-mesh/types'
import { MapperKind, mapSchema } from '@graphql-tools/utils'

export default class HeadersDirectiveTransform implements MeshTransform {
  noWrap = true

  transformSchema(schema: GraphQLSchema) {
    return mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const originalResolver =
          fieldConfig.resolve != null ? fieldConfig.resolve : defaultFieldResolver

        const resolver = async (next: any, _source: any, _args: any, context: any, info: any) => {
          const { directives } = info.fieldNodes[0]
          const headersDirective = directives.find(
            (directive: { name: { value: string } }) => directive.name.value === 'headers'
          )

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

          return await next(context)
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

export const headersDirectiveTypeDef: string = /* GraphQL */ `
  input Header {
    key: String
    value: String
  }

  """
  This directive is used to add headers to the request.
  """
  directive @headers(input: [Header]) on FIELD
`
