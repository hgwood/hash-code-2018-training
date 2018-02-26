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
  let slices = [];

  let pizza = gridUtils.transpose(problem.pizza);

  pizza.forEach((line, index) => {
    _.range(0, line.length, problem.maxCells).forEach(x => {
      let ingredients = _.slice(line, x, x + problem.maxCells).reduce(
        (acc, item) => {
          acc[item]++;
          return acc;
        },
        { T: 0, M: 0 }
      );

      if (
        ingredients["T"] >= problem.minIngredients &&
        ingredients["M"] >= problem.minIngredients
      ) {
        slices.push({
          r1: x,
          c1: index,
          r2: x + Math.min(line.length - x, problem.maxCells) - 1,
          c2: index
        });
      }
    });
  });

  return slices;
}

module.exports = solve;
