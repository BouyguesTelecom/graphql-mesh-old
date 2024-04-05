import { GraphQLSchema } from 'graphql'
import { MeshTransform } from '@graphql-mesh/types'
import { DelegationContext, SubschemaConfig, Transform } from '@graphql-tools/delegate'
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils'
import {
  applyRequestTransforms,
  applyResultTransforms,
  applySchemaTransforms
} from '@graphql-mesh/utils'
import * as pathModule from 'path'

/**
 * Import module from path
 * @param path {string}
 * @returns module {typeof InjectAdditionalTransforms | null}
 */
function importModule(path: string): Transform | null {
  try {
    return require(path)
  } catch (error) {
    console.error(`Can't import module located at ${path}`, error)
  }
  return null
}

export default class InjectAdditionalTransforms implements MeshTransform {
  noWrap = true
  private baseDir: string
  private transforms: Transform[] = []

  constructor({ config, baseDir }: { config: any; baseDir: string }) {
    this.baseDir = baseDir
    const additionalTransforms: Transform[] = Array.isArray(config)
      ? config
      : config.additionalTransforms ?? []
    additionalTransforms.forEach((transform) => {
      const [path, config] = Object.entries(transform)?.[0] as [string, unknown]
      try {
        if (path) {
          const absotutePath = pathModule.join(this.baseDir, path)
          const module: any = importModule(absotutePath)
          if (module) {
            this.transforms.push(new module.default(config ?? {}))
          }
        }
      } catch (error) {
        console.error(`Could not instanciate additionnalTransformer located at ${path}`, error)
      }
    })
  }

  transformSchema(
    originalWrappingSchema: GraphQLSchema,
    subschemaConfig: SubschemaConfig,
    transformedSchema?: GraphQLSchema
  ) {
    if (!transformedSchema) {
      transformedSchema = originalWrappingSchema
    }
    return applySchemaTransforms(
      originalWrappingSchema,
      subschemaConfig,
      transformedSchema,
      this.transforms
    )
  }

  transformRequest(
    originalRequest: ExecutionRequest,
    delegationContext: DelegationContext,
    transformationContext: Record<string, any>
  ) {
    return applyRequestTransforms(
      originalRequest,
      delegationContext,
      transformationContext,
      this.transforms
    )
  }

  transformResult(
    originalResult: ExecutionResult,
    delegationContext: DelegationContext,
    transformationContext: any
  ) {
    return applyResultTransforms(
      originalResult,
      delegationContext,
      transformationContext,
      this.transforms
    )
  }
}
