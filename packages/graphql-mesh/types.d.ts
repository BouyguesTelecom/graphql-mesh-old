import { type OpenAPIV3 } from 'openapi-types'
import { YamlConfig } from '@graphql-mesh/types'

type SwaggerName = string
type Spec = OpenAPIV3.Document
type Path = keyof Spec['paths']
type OperationId = string
type Resolvers = YamlConfig.Config['additionalResolvers'] | {}
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
