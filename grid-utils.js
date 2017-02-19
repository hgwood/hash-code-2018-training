const _ = require('lodash')

module.exports = {
  /**
   * @returns a flatten array of all cells in the grid (cell is object with props x, y, value).
   */
  cells: lift(_.flatMap, _.map, (value, x, y) => ({value, x, y})),
  /**
   * Runs a function on each cell. Function takes params value, x, y, grid, row.
   */
  each: lift(_.each, _.each, (value, x, y, grid, row, f) => f(value, x, y, grid, row)),
  /**
   * Maps values of the cells. Function takes same params as `each`.
   */
  map: lift(_.map, _.map, (value, x, y, grid, row, f) => f(value, x, y, grid, row)),
  /**
   * Matrix transposition from maths. Inverts columns and rows. https://en.wikipedia.org/wiki/Transpose
   */
  transpose
}

function lift (fgrid, frow, fvalue) {
  return (grid, ...args) => {
    return fgrid(grid, (row, y) => {
      return frow(row, (value, x) => {
        return fvalue(value, x, y, grid, row, ...args)
      })
    })
  }
}

function transpose (grid) {
  return _.times(grid[0].length, x => grid.map(row => row[x]))
}
