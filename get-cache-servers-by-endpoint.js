const assert = require('assert')
const debug = require('debug')('getCacheServersByEndpoint')
const _ = require('lodash')

module.exports = function getCacheServersByEndpoint (problem, index) {
  return _.find(problem.endpoints, { index }).cacheServers
}
