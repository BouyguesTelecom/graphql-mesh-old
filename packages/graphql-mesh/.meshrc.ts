import type { Config } from '@graphql-mesh/types/typings/config'
import { sources, additionalTypeDefs, resolvers } from './config'

export default <Config>{
  sources,
  additionalTypeDefs: [additionalTypeDefs],
  additionalResolvers: [resolvers],
  transforms: [
    { "spl-ts": {} }
  ],
  serve: {
    cors: {
      origin: process.env.CORS_ORIGIN ?? '*'
    },
    fork: 1,
    playground: true,
    playgroundTitle: 'Console GraphQL',
    browser: false
  }
}
