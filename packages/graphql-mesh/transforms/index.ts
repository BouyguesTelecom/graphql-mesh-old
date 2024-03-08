import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { MeshTransform } from '@graphql-mesh/types'
import { MapperKind, mapSchema } from '@graphql-tools/utils'
import { splListFilterer } from '@bytel/spl-ts'

export default class DirectivesTransform implements MeshTransform {
  noWrap = true

  transformSchema(schema: GraphQLSchema) {
    return mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const originalResolver =
          fieldConfig.resolve != null ? fieldConfig.resolve : defaultFieldResolver

        const resolver = async (next, source, args, context, info) => {
          const { directives } = info.fieldNodes[0]
          const upperDirective = directives.find((directive) => directive.name.value === 'upper')
          const splDirective = directives.find((directive) => directive.name.value === 'SPL')

          const result = await next()

          if (splDirective) {
            const { value } = splDirective.arguments[0]

            let data = splListFilterer.filter_no_variables(
              value.value,
              splListFilterer.formatInput(result)
            )
            return splListFilterer.formatOutput(data)
          }

          if (upperDirective) {
            if (typeof result === 'string') {
              return result.toUpperCase()
            }
            return result
          }

          return result
        }

        fieldConfig.resolve = (source, originalArgs, context, info) => {
          return resolver(
            () =>
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
