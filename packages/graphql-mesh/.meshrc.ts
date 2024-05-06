import { YamlConfig } from '@graphql-mesh/types'
import ConfigFromSwaggers from './utils/ConfigFromSwaggers'
import { splDirectiveTypeDef } from 'directive-spl'
import { headersDirectiveTypeDef } from './directives/headers'
import { noAuthDirectiveTypeDef } from './directives/no-auth'

const configFromSwaggers = new ConfigFromSwaggers()
const { defaultConfig, additionalTypeDefs, sources } =
  configFromSwaggers.getMeshConfigFromSwaggers()

const config = <YamlConfig.Config>{
  ...defaultConfig,
  transforms: [
    { 'directive-spl': {} },
    {
      'inject-additional-transforms': {
        additionalTransforms:
          [
            { './directives/headers.ts': {} },
            { './directives/no-auth.ts': {} },
            ...(defaultConfig.additionalTransforms || [])
          ] || []
      }
    },
    ...(defaultConfig.transforms || [])
  ].filter(Boolean),
  sources: [...sources],
  additionalTypeDefs: [
    splDirectiveTypeDef,
    headersDirectiveTypeDef,
    noAuthDirectiveTypeDef,
    additionalTypeDefs,
    defaultConfig.additionalTypeDefs || ''
  ].filter(Boolean),
  additionalResolvers: [
    ...(defaultConfig.additionalResolvers || []),
    './utils/additionalResolvers.ts'
  ].filter(Boolean)
}

export default config
