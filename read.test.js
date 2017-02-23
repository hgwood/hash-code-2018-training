/* eslint-env mocha */

const assert = require('assert')
const {parse} = require('./read')

describe('parse', function () {
  it('parses correctly', function () {
    const textFromInputFile = `
      5 2 4 3 100
      50 50 80 30 110
      1000 3
      0 100
      2 200
      1 300
      500 0
      3 0 1500
      0 1 1000
      4 0 500
      1 0 1000
      `
    assert.deepEqual(parse(textFromInputFile), {
      cacheServerCapacity: 100,
      videos: [
        {index: 0, size: 50},
        {index: 1, size: 50},
        {index: 2, size: 80},
        {index: 3, size: 30},
        {index: 4, size: 110}
      ],
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
          cacheServers: []
        }
      ],
      requests: [
        {index: 0, video: 3, endpoint: 0, popularity: 1500},
        {index: 1, video: 0, endpoint: 1, popularity: 1000},
        {index: 2, video: 4, endpoint: 0, popularity: 500},
        {index: 3, video: 1, endpoint: 0, popularity: 1000}
      ]
    })
  })
})
