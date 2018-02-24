const debug = require("debug")("solve");
const _ = require("lodash");
const gridUtils = require("./grid-utils");

/**
 * @typedef {object} ProblemInput
 * @property {number} nrows
 * @property {number} ncolumns
 * @property {number} minIngredients
 * @property {number} maxCells
 * @property {string[][]} pizza
 *
 * @typedef {object} Slice
 * @property {number} r1
 * @property {number} c1
 * @property {number} r2
 * @property {number} c2
 *
 * @param {ProblemInput} problem
 * @returns {Slice[]}
 */
function solve(problem) {
  return [];
}

module.exports = solve;
