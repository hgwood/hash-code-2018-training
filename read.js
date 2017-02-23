const fs = require('fs')
const assert = require('assert')
const debug = require('debug')('read')
const jolicitron = require('jolicitron')

module.exports = function read (filePath) {
  const cachedFile = `${filePath}.json`
  try {
    fs.accessSync(cachedFile)
    debug(`using cached ${cachedFile}`)
  } catch (err) {
    debug(`not using cached input file because:`, err)
    const textFromInputFile = fs.readFileSync(filePath, 'utf8')
    debug(`read ${textFromInputFile.length} chars from ${filePath}`)
    const result = module.exports.parse(textFromInputFile)
    fs.writeFileSync(`${filePath}.json`, JSON.stringify(result))
    return result
  }
  return require(`./${cachedFile}`)
}

function parse (textFromInputFile) {
  const parse = jolicitron((save, n) => [
    save('nvideos'),
    save('nendpoints'),
    save('nrequestDescriptions'),
    save('ncacheServers'),
    'cacheServerCapacity',
    n('videos', {length: 'nvideos', indices: true}, 'size'),
    n('endpoints', {length: 'nendpoints', indices: true}, 'datacenterLatency', save('navailableCaches'),
      n('cacheServers', {length: 'navailableCaches'}, 'id', 'latency')),
    n('requests', {length: 'nrequestDescriptions', indices: true}, 'video', 'endpoint', 'popularity')
  ])
  const {parsedValue, remaining} = parse(textFromInputFile)
  assert.equal(remaining.trim(), '')
  debug('end')
  return parsedValue
}

module.exports.parse = parse
