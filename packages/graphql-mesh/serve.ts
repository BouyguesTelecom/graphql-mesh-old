import { createServer } from 'node:http'
//import { createBuiltMeshHTTPHandler } from './var/.mesh'
import { getConfig } from './utils/parseYamlConfig'
import { Logger } from './utils/logger'
const mesh = process.env['MESH_ARTIFACTS_DIRNAME'] || ".mesh"
import(mesh)
	.then(obj => {
		const config = getConfig()
		const PORT = config.serve?.port ?? 4000
		const HOSTNAME = config.serve?.hostname ?? 'http://0.0.0.0'
		const server = createServer(obj.createBuiltMeshHTTPHandler())
		Logger.info('STARTUP', 'main', `🚀 Server ready at ${HOSTNAME}:${PORT}/graphql`)
		server.listen(PORT)
	})
