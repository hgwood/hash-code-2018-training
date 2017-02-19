const fs = require('fs')
const _ = require('lodash')

function scaffold (functionName) {
  fs.writeFileSync(`${_.kebabCase(functionName)}.js`, scaffoldProductionCode(functionName))
  fs.writeFileSync(`${_.kebabCase(functionName)}.test.js`, scaffoldTestCode(functionName))
}

function scaffoldProductionCode (functionName) {
  return `const _ = require('lodash')

module.exports = function ${functionName} () {

}
`
}

function scaffoldTestCode (functionName) {
  return `/* eslint-env mocha */

const assert = require('assert')
const ${functionName} = require('./${functionName}')

describe('${functionName}', function () {
  it('${functionName}s', function () {
    assert.deepEqual(
      ${functionName}(),
      undefined)
  })
})
`
}

module.exports = scaffold

if (require.main === module) {
  scaffold(...process.argv.slice(2))
}
