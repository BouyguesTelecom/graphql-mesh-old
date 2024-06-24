import { GraphQLSchema } from 'graphql'
import { mapSchema } from '@graphql-tools/utils'
import { MapperKind } from '@graphql-tools/utils'
import { getDirective } from '@graphql-tools/utils'
import { GraphQLObjectType, GraphQLInterfaceType } from 'graphql'
import { MeshTransform } from '@graphql-mesh/types'

export default class PrefixSchemaDirectiveTransform implements MeshTransform {
  transformSchema(schema: GraphQLSchema) {
    return mapSchema(schema, {
        [MapperKind.OBJECT_TYPE]: type => {
          const prefixDirective = getDirective(schema, type, 'prefixSchema')?.[0]
          if (prefixDirective) {
            type.name = prefixDirective.prefix + type.name
            const config = type.toConfig()
            return new GraphQLObjectType(config)
          }
        },
        [MapperKind.INTERFACE_TYPE]: type => {
          const prefixDirective = getDirective(schema, type, 'prefixSchema')?.[0]
          if (prefixDirective) {
            type.name = prefixDirective.prefix + type.name
            const config = type.toConfig()
            return new GraphQLInterfaceType(config)
          }
        }
      })
  }
}

export const prefixSchemaDirectiveTypeDef: string = /* GraphQL */ `
  """
  This directive is used to prefix a schema name using the custom field "x-graphql-prefix-schema-with"
  """
  directive @prefixSchema(prefix: String) on OBJECT | INTERFACE
`
