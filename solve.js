const debug = require('debug')('solve')
const _ = require('lodash')
const gridUtils = require('./grid-utils')
const getCacheServersByEndpoint = require('./get-cache-servers-by-endpoint')

module.exports = function solve (problem) {
  const requestByPopularity = _.orderBy(problem.requests, ['popularity'], ['desc'])
  const usedServers = []
  let requestsWithCacheServer = _.map(requestByPopularity, request => {
    let cacheServers = getCacheServersByEndpoint(problem, request.endpoint)
    cacheServers = _.sortBy(cacheServers, 'latency')
    cacheServers = _.filter(cacheServers, cacheServer => !_.includes(usedServers, cacheServer.id))
    const cacheServer = _.first(cacheServers)
    if (cacheServer) {
      usedServers.push(cacheServer.id)
      return {
        request,
        cacheServer
      }
    }
  })
  requestsWithCacheServer = _.compact(requestsWithCacheServer)
  const solution = _.map(requestsWithCacheServer, ({cacheServer, request}) => ({
    id: cacheServer.id,
    videos: [request.video]
  }))
  return solution
}
