const debug = require('debug')('solve')
const _ = require('lodash')
const gridUtils = require('./grid-utils')
const requestsSortedByLatencySaved = require('./requests-sorted-by-latency-saved')

module.exports = function solve (problem) {
  const requestByPopularity = requestsSortedByLatencySaved(problem) // _.orderBy(problem.requests, ['popularity'], ['desc'])
  const cacheServers = _.uniqBy(_.map(_.flatMap(problem.endpoints, endpoint => endpoint.cacheServers), ({id}) => ({id, capacity: problem.cacheServerCapacity})), 'id')

  const videosLatencyByEnpoint = _.mapValues(
    _.groupBy(problem.requests, 'endpoint'),
    requests => _.mapValues(
      _.keyBy(requests, 'video'),
      request => _.find(problem.endpoints, { index: request.endpoint }).datacenterLatency
    )
  )

  let requestsWithCacheServer = _.map(requestByPopularity, request => {
    const video = _.find(problem.videos, {index: request.video})

    let cacheServersByEndPoint = [request.cache] // getCacheServersByEndpoint(problem, request.endpoint)
    cacheServersByEndPoint = _.filter(cacheServersByEndPoint, (id) => {
      const cacheServer = _.find(cacheServers, {id})
      return cacheServer && cacheServer.capacity >= video.size
    })
    // cacheServersByEndPoint = _.sortBy(cacheServersByEndPoint, 'latency')

    const cacheServer = _.first(cacheServersByEndPoint)
    if (cacheServer !== undefined) {
      _.find(cacheServers, {id: cacheServer}).capacity -= video.size
      return {
        request,
        cacheServer: {id: cacheServer}
      }
    }
  })
  requestsWithCacheServer = _.compact(requestsWithCacheServer)
  const requestsByCacheServer = _.groupBy(requestsWithCacheServer, 'cacheServer.id')
  const solution = _.map(requestsByCacheServer, (requests, id) => ({
    id,
    videos: _.uniq(_.map(requests, request => request.request.video))
  }))
  return solution
}
