const debug = require("debug")("solve");
const _ = require("lodash");
const gridUtils = require("./grid-utils");

function partValide(pizza, slice, minIngredients) {
  let t = 0;
  let m = 0;

  _.range(slice.r1, slice.r2 + 1).forEach(y => {
    _.range(slice.c1, slice.c2 + 1).forEach(x => {
      if (pizza[y][x] == "T") t++;
      if (pizza[y][x] == "M") m++;
    });
  });

  return t >= minIngredients && m >= minIngredients;
}

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

  const transposed = false;

  if (transposed) {
    problem.pizza = gridUtils.transpose(problem.pizza);
  }

  const pizzaCopy = _.map(problem.pizza, line => _.map(line, x => x));

  // Step 1: prendre les lines

  problem.pizza.forEach((line, index) => {
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
        if (transposed) {
          slice = {
            r1: x,
            c1: index,
            r2: x + Math.min(line.length - x, problem.maxCells) - 1,
            c2: index
          };
        } else {
          slice = {
            r1: index,
            c1: x,
            r2: index,
            c2: x + Math.min(line.length - x, problem.maxCells) - 1
          };
        }

        slices.push(slice);

        const { r1, r2, c1, c2 } = slice;

        _.range(r1, r2 + 1).forEach(y => {
          _.range(c1, c2 + 1).forEach(x => {
            pizzaCopy[y][x] = " ";
          });
        });
      }
    });
  });

  // Step 2: prendre 2 colonnes
  pizzaCopy.forEach((line, y) => {
    _.range(0, line.length, problem.maxCells).forEach(x => {
      if (line[x] != " ") {
        if (y < pizzaCopy.length - 1 && pizzaCopy[y + 1][x] != " ") {
          let finDeLigne = Math.min(
            x + Math.floor(problem.maxCells / 2),
            line.length
          );

          let slice1 = {
            r1: y,
            r2: y + 1,
            c1: x,
            c2: finDeLigne
          };

          if (partValide(pizzaCopy, slice1, problem.minIngredients)) {
            slices.push(slice1);
          }

          if (finDeLigne != line.length) {
            let slice2 = {
              r1: y,
              r2: y + 1,
              c1: finDeLigne + 1,
              c2: Math.min(x + problem.maxCells, line.length)
            };

            if (partValide(pizzaCopy, slice2, problem.minIngredients)) {
              slices.push(slice2);
            }
          }
        }
      }
    });
  });

  return slices;
}

module.exports = solve;
