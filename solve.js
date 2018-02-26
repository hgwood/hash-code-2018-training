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

  pizza.map((line, index) => {
    let ingredients = _.take(line, problem.maxCells).reduce(
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
        r1: index,
        c1: 0,
        r2: index,
        c2: Math.min(line.length, problem.maxCells) - 1
      });
    }
  });

  return slices;
}

module.exports = solve;
