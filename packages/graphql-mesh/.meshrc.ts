import { YamlConfig } from '@graphql-mesh/types'
import ConfigFromSwaggers from './utils/ConfigFromSwaggers'

const configFromSwaggers = new ConfigFromSwaggers()
const { defaultConfig, additionalTypeDefs, sources } =
  configFromSwaggers.getMeshConfigFromSwaggers()

const config = <YamlConfig.Config>{
  ...defaultConfig,
  transforms: [
    { 'directive-spl': {} },
    { 'directive-headers': {} },
    { 'directive-no-auth': {} },
    {
      'inject-additional-transforms': {
        additionalTransforms: defaultConfig.additionalTransforms || []
      }
    },
    ...(defaultConfig.transforms || [])
  ],
  sources: [...sources],
  additionalTypeDefs: [defaultConfig.additionalTypeDefs || '', ...additionalTypeDefs],
  additionalResolvers: [
    ...(defaultConfig.additionalResolvers || []),
    './utils/additionalResolvers.ts'
  ]
}

export default config
