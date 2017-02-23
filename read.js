const fs = require('fs')
const assert = require('assert')
const debug = require('debug')('read')
const jolicitron = require('jolicitron')

module.exports = function read (filePath) {
  try {
    fs.accessSync(`${filePath}.json`)
    return require(`${filePath}.json`)
  } catch (err) {
    const textFromInputFile = fs.readFileSync(filePath, 'utf8')
    debug(`read ${textFromInputFile.length} chars from ${filePath}`)
    const result = module.exports.parse(textFromInputFile)
    fs.writeFileSync(`${filePath}.json`, JSON.stringify(result, null, 2))
    return result
  }
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
