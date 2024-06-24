import { type OpenAPIV3 } from 'openapi-types'
import { YamlConfig } from '@graphql-mesh/types'

type Spec = OpenAPIV3.Document
type Path = keyof Spec['paths']
type Resolvers = YamlConfig.Config['additionalResolvers'] | {}
type CatalogContent = { operationIds: string[]; type: string; swaggers: string[] }
type Catalog = Record<Path, CatalogContent>
type XLink = {
  rel: string
  type: string
  hrefPattern: string
}
type ConfigExtension = {
  // Additional type definitions
  typeDefs: string
  // Additional resolvers
  resolvers: Resolvers
}
