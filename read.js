const fs = require('fs')
const assert = require('assert')
const debug = require('debug')('read')
const jolicitron = require('jolicitron')

module.exports = function read (filePath) {
  const textFromInputFile = fs.readFileSync(filePath, 'utf8')
  debug(`read ${textFromInputFile.length} chars from ${filePath}`)
  return module.exports.parse(textFromInputFile)
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
  return parsedValue
}

module.exports.parse = parse
