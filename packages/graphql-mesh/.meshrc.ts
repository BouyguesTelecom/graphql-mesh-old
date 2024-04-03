import type { Config } from '@graphql-mesh/types/typings/config'
import ConfigFromSwaggers from './utils/ConfigFromSwaggers'

const configFromSwaggers = new ConfigFromSwaggers()
const { defaultConfig, additionalResolvers, additionalTypeDefs, sources } =
  configFromSwaggers.getMeshConfigFromSwaggers()

const config = <Config>{
  ...defaultConfig,
  transforms: [
    { 'directive-spl': {} },
    { 'directive-headers': {} },
    { 'directive-no-auth': {} },
    ...(defaultConfig.transforms || [])
  ],
  sources: [...sources],
  additionalTypeDefs: [...(defaultConfig.additionalTypeDefs || []), ...additionalTypeDefs],
  additionalResolvers: [...(defaultConfig.additionalResolvers || []), additionalResolvers]
}

export default config
