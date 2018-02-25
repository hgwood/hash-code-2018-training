const _ = require("lodash");

/**
 * @typedef {Array.<Array>} Grid
 */

/**
 * @typedef {Object} Cell
 * @property value
 * @property {number} x
 * @property {number} y
 */

/**
 * @callback GridIteratee
 * @param value
 * @param {number} x
 * @param {number} y
 * @param {Grid} grid
 * @param {Array} row
 */

module.exports = {
  /**
   * @param {Grid} grid
   * @returns {Array.<Cell>}
   */
  cells: lift(_.flatMap, _.map, (value, x, y) => ({ value, x, y })),

  /**
   * Runs a function on each cell.
   * @param {Grid} grid
   * @param {GridIteratee} f
   * @returns {undefined}
   */
  forEach: lift(_.each, _.each, (value, x, y, grid, row, f) =>
    f(value, x, y, grid, row)
  ),

  /**
   * Maps values of the cells.
   * @param {Grid} grid
   * @param {GridIteratee} f
   * @returns {Grid}
   */
  map: lift(_.map, _.map, (value, x, y, grid, row, f) =>
    f(value, x, y, grid, row)
  ),

  /**
   * Matrix transposition from maths. Inverts columns and rows. https://en.wikipedia.org/wiki/Transpose
   * @param {Grid} grid
   * @returns {Grid}
   */
  transpose
};

function lift(fgrid, frow, fvalue) {
  return (grid, ...args) => {
    return fgrid(grid, (row, y) => {
      return frow(row, (value, x) => {
        return fvalue(value, x, y, grid, row, ...args);
      });
    });
  };
}

function transpose(grid) {
  return _.times(grid[0].length, x => grid.map(row => row[x]));
}
