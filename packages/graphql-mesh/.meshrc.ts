import { YamlConfig } from '@graphql-mesh/types'
import ConfigFromSwaggers from './utils/ConfigFromSwaggers'
import { splDirectiveTypeDef } from 'directive-spl'
import { headersDirectiveTypeDef } from './directives/headers'
import { noAuthDirectiveTypeDef } from './directives/no-auth'
import { prefixSchemaDirectiveTypeDef } from './directives/prefixSchema'

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
            { './directives/prefixSchema.ts': {} },
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
    prefixSchemaDirectiveTypeDef,
    additionalTypeDefs,
    defaultConfig.additionalTypeDefs || ''
  ].filter(Boolean),
  additionalResolvers: [
    ...(defaultConfig.additionalResolvers || []),
    './utils/additionalResolvers.ts'
  ].filter(Boolean),
  plugins: [
    { 'filter-null-plugin': { filter: defaultConfig.filterNull ?? false } },
    ...(defaultConfig.plugins || [])
  ]
}

export default config
