const assert = require('assert')
const debug = require('debug')('requestsSortedByLatencySaved')
const _ = require('lodash')

module.exports = function requestsSortedByLatencySaved (problem) {
  return _.orderBy(_.reduce(problem.requests, (links, request) => {
    const endpoint = problem.endpoints[request.endpoint]
    return links.concat(_.map(endpoint.cacheServers, cache => ({
      video: request.video,
      endpoint: endpoint.index,
      cache: cache.id,
      latency: request.popularity * cache.latency,
      savedLatency: request.popularity * endpoint.datacenterLatency - request.popularity * cache.latency
    })))
  }, []), ['savedLatency'], ['desc'])
}
