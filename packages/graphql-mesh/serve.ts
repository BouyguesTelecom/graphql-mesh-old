import { createServer } from 'node:http'
import { createBuiltMeshHTTPHandler } from './.mesh'

const PORT = process.env.PORT ?? 4000

const server = createServer(createBuiltMeshHTTPHandler())
console.log(`🚀 Server ready at http://0.0.0.0:${PORT}/graphql`)
server.listen(PORT)
