import type { Config } from '@graphql-mesh/types/typings/config'
import {
  openapiSources,
  additionalTypeDefs,
  resolvers,
  defaultConfig,
  othersSources
} from './setup'

const config = <Config>{
  ...defaultConfig,
  transforms: [
    { 'spl-directive': {} },
    { 'headers-directive': {} },
    { 'no-auth-directive': {} },
    ...(defaultConfig.transforms || [])
  ],
  sources: [...openapiSources, ...othersSources],
  additionalTypeDefs: [...(defaultConfig.additionalTypeDefs || []), additionalTypeDefs],
  additionalResolvers: [...(defaultConfig.additionalResolvers || []), resolvers]
}

export default config
