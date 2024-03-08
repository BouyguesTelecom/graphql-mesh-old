import { type OpenAPIV3 } from 'openapi-types'
// import { Resolvers as _Resolvers } from './.mesh'

import {
  AdditionalStitchingResolverObject,
  AdditionalStitchingBatchResolverObject,
  AdditionalSubscriptionObject
} from '@graphql-mesh/types/typings/config'

type Resolvers =
  | string
  | AdditionalStitchingResolverObject
  | AdditionalStitchingBatchResolverObject
  | AdditionalSubscriptionObject

type SwaggerName = string
type Spec = OpenAPIV3.Document
type Path = keyof Spec['paths']
type OperationId = string

/**
 * Catalog of all operations
 */
type Catalog = Record<Path, [OperationId, string, SwaggerName]>

type ConfigExtension = {
  /** Additional type definitions */
  typeDefs: string
  /** Resolvers */
  resolvers: Resolvers
}
