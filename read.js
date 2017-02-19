const fs = require('fs')
const debug = require('debug')('read')
const jolicitron = require('jolicitron')

module.exports = function read (filePath) {
  const textFromInputFile = fs.readFileSync(filePath, 'utf8')
  debug(`read ${textFromInputFile.length} chars from ${filePath}`)
  return module.exports.parse(textFromInputFile)
}

function parse (textFromInputFile) {
  const parse = jolicitron((save, n) => [
    // TODO: insert parser config here
  ])
  const {parsedValue, remaining} = parse(textFromInputFile)
  return parsedValue
}

module.exports.parse = parse
