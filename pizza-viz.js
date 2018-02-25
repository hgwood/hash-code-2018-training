// import { readFileSync } from "fs";
// import * as _ from "lodash/fp";
const { readFileSync } = require("fs");
const _ = require("lodash/fp");
const gridUtils = require("./grid-utils");

const processIn = _.flow(
  _.split("\n"),
  _.tail,
  _.map(_.trim),
  _.filter(_.identity)
  // _.map(_.flow(_.split(""), _.join(" "), row => ` ${row} `)),
);

const processOut = _.flow(
  _.split("\n"),
  _.tail,
  _.flatMap(
    _.flow(
      _.split(" "),
      _.map(parseInt),
      _.over([_.at([0, 2]), _.at([1, 3])]),
      _.map(_.spread(_.over([Math.min, Math.max]))),
      _.map(_.spread((start, end) => _.range(start, end + 1))),
      _.over([
        ([rowIndices, columnIndices]) =>
          _.map(
            rowIndex => [
              [rowIndex, _.first(columnIndices)],
              [false, false, false, true]
            ],
            rowIndices
          ),
        ([rowIndices, columnIndices]) =>
          _.map(
            rowIndex => [
              [rowIndex, _.last(columnIndices)],
              [false, true, false, false]
            ],
            rowIndices
          ),
        ([rowIndices, columnIndices]) =>
          _.map(
            columnIndex => [
              [_.first(rowIndices), columnIndex],
              [true, false, false, false]
            ],
            columnIndices
          ),
        ([rowIndices, columnIndices]) =>
          _.map(
            columnIndex => [
              [_.last(rowIndices), columnIndex],
              [false, false, true, false]
            ],
            columnIndices
          )
      ]),
      _.flatten
    )
  ),
  _.reduce(
    (matrix, [coords, bounds]) =>
      _.update(
        coords,
        (oldBounds = [false, false, false, false]) =>
          _.zipWith((a, b) => a || b, oldBounds, bounds),
        matrix
      ),
    []
  )
);

const buildViz = (pizza, slices) => {
  let viz = [];
  gridUtils.forEach(slices, (bounds, x, y) => {
    viz = _.set([2 * y + 1, 2 * x + 1], pizza[y][x], viz);

    viz = _.update([2 * y + 0, 2 * x + 0], c => bounds[0] ? "#" : c || " ", viz);
    viz = _.update([2 * y + 0, 2 * x + 1], c => bounds[0] ? "#" : c || " ", viz);
    viz = _.update([2 * y + 0, 2 * x + 2], c => bounds[0] ? "#" : c || " ", viz);

    viz = _.update([2 * y + 0, 2 * x + 2], c => bounds[1] ? "#" : c || " ", viz);
    viz = _.update([2 * y + 1, 2 * x + 2], c => bounds[1] ? "#" : c || " ", viz);
    viz = _.update([2 * y + 2, 2 * x + 2], c => bounds[1] ? "#" : c || " ", viz);

    viz = _.update([2 * y + 2, 2 * x + 0], c => bounds[2] ? "#" : c || " ", viz);
    viz = _.update([2 * y + 2, 2 * x + 1], c => bounds[2] ? "#" : c || " ", viz);
    viz = _.update([2 * y + 2, 2 * x + 2], c => bounds[2] ? "#" : c || " ", viz);

    viz = _.update([2 * y + 0, 2 * x + 0], c => bounds[3] ? "#" : c || " ", viz);
    viz = _.update([2 * y + 1, 2 * x + 0], c => bounds[3] ? "#" : c || " ", viz);
    viz = _.update([2 * y + 2, 2 * x + 0], c => bounds[3] ? "#" : c || " ", viz);
  });
  console.log(viz.map(v=>v.map(z=>z||' ').join('')).join('\n'));
};

const buildVizFromArgv = _.flow(
  _.slice(2, 4),
  _.map(readFileSync),
  _.spread(_.overArgs(buildViz, [processIn, processOut]))
);

buildVizFromArgv(process.argv);
