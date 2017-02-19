/* eslint-env mocha */

const assert = require('assert')
const _ = require('lodash')
const gridUtils = require('./grid-utils')

describe('grid utils', function () {
  describe('cells', function () {
    it('returns all cells of the grid, with coordinates', function () {
      const cells = gridUtils.cells([
        [1, 2, 3],
        [4, 5, 6]
      ])
      assert.deepEqual(cells, [
        {x: 0, y: 0, value: 1},
        {x: 1, y: 0, value: 2},
        {x: 2, y: 0, value: 3},
        {x: 0, y: 1, value: 4},
        {x: 1, y: 1, value: 5},
        {x: 2, y: 1, value: 6}
      ])
    })
  })

  describe('each', function () {
    it('iterates', function () {
      const iterated = []
      gridUtils.each([
        [1, 2],
        [3, 4]
      ], (value, x, y) => iterated.push({x, y, value}))
      assert.deepEqual(iterated, [
        {x: 0, y: 0, value: 1},
        {x: 1, y: 0, value: 2},
        {x: 0, y: 1, value: 3},
        {x: 1, y: 1, value: 4}
      ])
    })
  })

  describe('map', function () {
    it('produces a new grid', function () {
      const grid = []
      assert.notStrictEqual(gridUtils.map(grid, _.identity), grid)
    })

    it('transforms every value in the grid using f', function () {
      const grid = [
        [1, 2],
        [3, 4]
      ]
      const newGrid = gridUtils.map(grid, i => i + 1)
      assert.deepEqual(newGrid, [
        [2, 3],
        [4, 5]
      ])
    })
  })

  describe('transpose', function () {
    it('transposes a square', function () {
      assert.deepEqual(
        gridUtils.transpose([[1, 2], [3, 4]]),
        [[1, 3], [2, 4]])
    })

    it('transposes a rectangle', function () {
      assert.deepEqual(
        gridUtils.transpose([[1, 2, 3], [4, 5, 6]]),
        [[1, 4], [2, 5], [3, 6]])
    })
  })
})
