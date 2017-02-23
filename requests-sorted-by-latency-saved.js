const assert = require('assert')
const debug = require('debug')('requestsSortedByLatencySaved')
const _ = require('lodash')

module.exports = function requestsSortedByLatencySaved (problem, latencies) {
  return _(problem.requests)
    .orderBy('popularity')
    // .take(100)
    .map(request => {
      const endpoint = problem.endpoints[request.endpoint]
      const latency = _.get(latencies, [endpoint.index, request.video], endpoint.datacenterLatency)
      const cache = _(endpoint.cacheServers)
        .filter(cache => cache.latency < latency)
        .min('latency')
      return {
        video: request.video,
        endpoint: endpoint.index,
        cache: cache.id,
        latency: cache.latency,
        savedLatency: request.popularity * (latency - cache.latency)
      }
    })
    .orderBy(['savedLatency'], ['desc'])
    .value()
}
