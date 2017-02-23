/* eslint-env mocha */

const assert = require('assert')
const requestsSortedByLatencySaved = require('./requests-sorted-by-latency-saved')

describe('requestsSortedByLatencySaved', function () {
  it('requestsSortedByLatencySaveds', function () {
    assert.deepEqual(
      requestsSortedByLatencySaved({
        endpoints: [
          {
            index: 0,
            datacenterLatency: 1000,
            cacheServers: [
              {id: 0, latency: 100},
              {id: 2, latency: 200},
              {id: 1, latency: 300}
            ]
          },
          {
            index: 1,
            datacenterLatency: 500,
            cacheServers: [
              {id: 2, latency: 800}
            ]
          }
        ],
        requests: [
          {index: 0, video: 3, endpoint: 0, popularity: 1500},
          {index: 0, video: 3, endpoint: 1, popularity: 500},
          {index: 1, video: 0, endpoint: 1, popularity: 1000},
          {index: 2, video: 4, endpoint: 0, popularity: 500},
          {index: 3, video: 1, endpoint: 0, popularity: 1000}
        ]
      }),
      [
        {video: 3, endpoint: 0, cache: 0, latency: 150000, savedLatency: 1350000},
        {video: 3, endpoint: 0, cache: 2, latency: 300000, savedLatency: 1200000},
        {video: 3, endpoint: 0, cache: 1, latency: 450000, savedLatency: 1050000},
        {video: 3, endpoint: 1, cache: 2, latency: 400000, savedLatency: -150000},
        {video: 0, endpoint: 1, cache: 2, latency: 800000, savedLatency: -300000},
        {video: 4, endpoint: 0, cache: 0, latency: 50000, savedLatency: 450000},
        {video: 4, endpoint: 0, cache: 2, latency: 100000, savedLatency: 400000},
        {video: 4, endpoint: 0, cache: 1, latency: 150000, savedLatency: 350000},
        {video: 1, endpoint: 0, cache: 0, latency: 100000, savedLatency: 900000},
        {video: 1, endpoint: 0, cache: 2, latency: 200000, savedLatency: 800000},
        {video: 1, endpoint: 0, cache: 1, latency: 300000, savedLatency: 700000}
      ])
  })
})
