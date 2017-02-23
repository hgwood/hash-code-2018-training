/* eslint-env mocha */

const assert = require('assert')
const getCacheServersByEndpoint = require('./get-cache-servers-by-endpoint')

describe('getCacheServersByEndpoint', function () {
  it('getCacheServersByEndpoints', function () {
    assert.deepEqual(
      getCacheServersByEndpoint({
        endpoints: [
          {
            id: 0,
            datacenterLatency: 1000,
            cacheServers: [
            {id: 0, latency: 100},
            {id: 2, latency: 200},
            {id: 1, latency: 300}
            ]
          },
          {
            datacenterLatency: 500,
            cacheServers: []
          }
        ]
      },
  0),
      [
  {id: 0, latency: 100},
  {id: 2, latency: 200},
  {id: 1, latency: 300}
      ])
  })
})
