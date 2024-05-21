import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { MeshTransform } from '@graphql-mesh/types'
import { MapperKind, mapSchema } from '@graphql-tools/utils'

export default class CatchHTTPErrorDirectiveTransform implements MeshTransform {
  transformSchema(schema: GraphQLSchema) {
    return mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const originalResolver = fieldConfig.resolve ?? defaultFieldResolver

        const resolver = async (next: any, _source: any, _args: any, context: any, info: any) => {
          const { directives } = info.fieldNodes[0]
          const catchHTTPErrorDirective = directives.find(
            (directive: { name: { value: string } }) => directive.name.value === 'catch'
          )
          const result = await next(context)

          if (catchHTTPErrorDirective) {
              if(result.message?.includes("HTTP Error")) {
                return null
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

export const catchHTTPErrorDirectiveTypeDef: string = /* GraphQL */ `
  """
  This directive is used to catch functional errors and prevent them from stacking in the errors root context.
  """
  directive @catch on FIELD
`
