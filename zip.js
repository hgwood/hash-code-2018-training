const _ = require('lodash')
const fs = require('fs')
const archiver = require('archiver')
const glob = require('glob')
const path = require('path')
const exec = require('child_process').execSync

try {
  exec("git add *.js && git commit -m 'tayo!'", {encoding: 'utf8'})
} catch (err) {}
const sha1 = exec('git rev-parse HEAD', {encoding: 'utf8'}).trim()
const date = new Date().toISOString().replace(/:/g, '-')
const dest = `./.builds/submission-sources-${date}-${sha1}.zip`

try {
  fs.mkdirSync(path.dirname(dest))
} catch (err) {
  if (err.code !== 'EEXIST') throw err
}

const files = glob.sync('!(node_modules)', {})
const archive = archiver('zip')
_.each(files, file => archive.file(file, {name: path.basename(file)}))
archive.finalize().pipe(fs.createWriteStream(dest))

console.log(`wrote ${files.length} files to ${dest}`)
