import type { Config } from '@graphql-mesh/types/typings/config'
import { directiveTypeDefs } from './utils/directives-typedefs'

import SetupSwagger from './utils/generate-typedefs-resolvers'
const setupSwagger = new SetupSwagger()

const { typeDefs, resolvers } = setupSwagger.createTypeDefsAndResolvers()
const openapiSources = setupSwagger.getOpenApiSources()
const othersSources = setupSwagger.getOtherSources()
const defaultConfig = setupSwagger.config

const config = <Config>{
  ...defaultConfig,
  transforms: [
    { 'directive-spl': {} },
    { 'directive-headers': {} },
    { 'directive-no-auth': {} },
    ...(defaultConfig.transforms || [])
  ],
  sources: [...openapiSources, ...othersSources],
  additionalTypeDefs: [...(defaultConfig.additionalTypeDefs || []), typeDefs, directiveTypeDefs],
  additionalResolvers: [...(defaultConfig.additionalResolvers || []), resolvers]
}

export default config
