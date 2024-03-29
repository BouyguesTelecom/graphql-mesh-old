import fs from 'fs'
import path from 'path'

const buildDir = './_build'
function createModulePackageJson() {
  fs.readdir(buildDir, function (err, dirs) {
    if (err) {
      throw err
    }
    dirs.forEach(function (dir) {
      if (dir === 'cjs') {
        var packageJsonFile = path.join(buildDir, dir, '/package.json')
        if (!fs.existsSync(packageJsonFile)) {
          fs.writeFile(
            packageJsonFile,
            new Uint8Array(Buffer.from('{"type": "commonjs"}')),
            function (err) {
              if (err) {
                throw err
              }
            }
          )
        }
      }
    })
  })
}

createModulePackageJson()
