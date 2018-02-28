/**
 * node ./pizza-viz <problem-input-file> <solution-file>
 */

const { readFileSync, writeFileSync } = require("fs");
const _ = require("lodash/fp");
const gridUtils = require("./grid-utils");

const processIn = _.flow(
  _.split("\n"),
  _.tail,
  _.map(_.trim),
  _.filter(_.identity)
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

const saveAsImage = (pizza, slices) => {
  const Jimp = require("jimp");
  const width = 2 * pizza[0].length + 1;
  const height = 2 * pizza.length + 1;
  const image = new Jimp(width, height, 0xffffffff, function(err, image) {
    const tomato = 0xff0000ff;
    const mushroom = 0x00ff00ff;
    const border = 0x000000ff;
    const empty = 0xffffffff;
    const setColor = (y, x, hex) => {
      if (image.getPixelColor(x, y) === 0xffffffff) {
        image.setPixelColor(hex, x, y);
      }
    };
    gridUtils.forEach(pizza, (ingredient, x, y) => {
      const bounds = _.getOr([], [y, x], slices);
      setColor(2 * y + 1, 2 * x + 1, pizza[y][x] === "T" ? tomato : mushroom);

      setColor(2 * y + 0, 2 * x + 0, bounds[0] ? border : empty);
      setColor(2 * y + 0, 2 * x + 1, bounds[0] ? border : empty);
      setColor(2 * y + 0, 2 * x + 2, bounds[0] ? border : empty);

      setColor(2 * y + 0, 2 * x + 2, bounds[1] ? border : empty);
      setColor(2 * y + 1, 2 * x + 2, bounds[1] ? border : empty);
      setColor(2 * y + 2, 2 * x + 2, bounds[1] ? border : empty);

      setColor(2 * y + 2, 2 * x + 0, bounds[2] ? border : empty);
      setColor(2 * y + 2, 2 * x + 1, bounds[2] ? border : empty);
      setColor(2 * y + 2, 2 * x + 2, bounds[2] ? border : empty);

      setColor(2 * y + 0, 2 * x + 0, bounds[3] ? border : empty);
      setColor(2 * y + 1, 2 * x + 0, bounds[3] ? border : empty);
      setColor(2 * y + 2, 2 * x + 0, bounds[3] ? border : empty);
    });
  });
  image.write("viz.bmp");
};

const saveAsAsciiArt = (pizza, slices) => {
  let viz = [];
  gridUtils.forEach(slices, (bounds, x, y) => {
    viz = _.set([2 * y + 1, 2 * x + 1], pizza[y][x], viz);

    const updateViz = (y, x, boundIndex) =>
      _.update([y, x], c => (bounds[boundIndex] ? "+" : c || " "), viz);

    viz = updateViz(2 * y + 0, 2 * x + 0, 0);
    viz = updateViz(2 * y + 0, 2 * x + 1, 0);
    viz = updateViz(2 * y + 0, 2 * x + 2, 0);
    viz = updateViz(2 * y + 0, 2 * x + 2, 1);
    viz = updateViz(2 * y + 1, 2 * x + 2, 1);
    viz = updateViz(2 * y + 2, 2 * x + 2, 1);
    viz = updateViz(2 * y + 2, 2 * x + 0, 2);
    viz = updateViz(2 * y + 2, 2 * x + 1, 2);
    viz = updateViz(2 * y + 2, 2 * x + 2, 2);
    viz = updateViz(2 * y + 0, 2 * x + 0, 3);
    viz = updateViz(2 * y + 1, 2 * x + 0, 3);
    viz = updateViz(2 * y + 2, 2 * x + 0, 3);
  });
  const asciiViz = viz.map(v => v.map(z => z || " ").join("")).join("\n");
  writeFileSync("viz.txt", asciiViz);
};

const buildViz = (pizza, slices) => {
  // saveAsAsciiArt(pizza, slices);
  saveAsImage(pizza, slices);
};

const buildVizFromArgv = _.flow(
  _.slice(2, 4),
  _.map(readFileSync),
  _.spread(_.overArgs(buildViz, [processIn, processOut]))
);

buildVizFromArgv(process.argv);
