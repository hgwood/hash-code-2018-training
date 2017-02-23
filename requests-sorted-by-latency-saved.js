const assert = require('assert')
const debug = require('debug')('requestsSortedByLatencySaved')
const _ = require('lodash')

module.exports = function requestsSortedByLatencySaved (problem, latencies) {
  return _.orderBy(_.reduce(problem.requests, (links, request) => {
    const endpoint = problem.endpoints[request.endpoint]
    const latency = _.get(latencies, [endpoint.index, request.video], endpoint.datacenterLatency)
    return links.concat(_(endpoint.cacheServers.map(cache => ({
      video: request.video,
      endpoint: endpoint.index,
      cache: cache.id,
      latency: request.popularity * cache.latency,
      savedLatency: request.popularity * (latency - cache.latency)
    })).filter(link => link.savedLatency > 0)).value())
  }, []), ['savedLatency'], ['desc'])
}
