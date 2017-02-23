/* eslint-env mocha */

const assert = require('assert')
const unparse = require('./write').unparse

describe('unparse', function () {
  it('unparses correctly', function () {
    assert.deepEqual(
      unparse([
        {
          id: 1,
          videos: [1, 2, 3, 4]
        },
        {
          id: 2,
          videos: []
        },
        {
          id: 3,
          videos: [9, 8]
        }
      ]), [
        '2',
        '1 1 2 3 4',
        '3 9 8'
      ])
  })
})
