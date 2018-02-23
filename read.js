const fs = require("fs");
const assert = require("assert");
const debug = require("debug")("read");
const _ = require("lodash/fp");

module.exports = function read(filePath) {
  const cachedFile = `${filePath}.json`;
  try {
    fs.accessSync(cachedFile);
    debug(`using cached ${cachedFile}`);
  } catch (err) {
    debug(`not using cached input file because:`, err);
    const textFromInputFile = fs.readFileSync(filePath, "utf8");
    debug(`read ${textFromInputFile.length} chars from ${filePath}`);
    const result = module.exports.parse(textFromInputFile);
    fs.writeFileSync(`${filePath}.json`, JSON.stringify(result));
    return result;
  }
  return require(`./${cachedFile}`);
};

const splitHeaderFromPizza = _.flow(
  _.split("\n"),
  _.map(_.trim),
  _.filter(_.identity),
  _.over([_.first, _.tail])
);

const parseHeader = _.flow(
  _.split(" "),
  _.map(Number),
  _.zipObject(["nrows", "ncolumns", "minIngredients", "maxCells"])
);

const parsePizza = _.map(_.toArray);

const parseHeaderAndPizza = _.overArgs(
  (header, pizza) => Object.assign({}, header, { pizza }),
  [parseHeader, parsePizza]
);

const assertValid = _.tap(({ nrows, ncolumns, pizza }) => {
  assert.equal(pizza.length, nrows, "number of rows is not consistent");
  pizza.forEach(row => {
    assert.equal(row.length, ncolumns, "number of columns is not consistent");
    row.forEach(cell => {
      assert(cell.match(/[MT]/), "neither mushroom not tomatoe??");
    });
  });
});

const parse = _.flow(
  splitHeaderFromPizza,
  _.spread(parseHeaderAndPizza),
  assertValid,
  _.tap(() => debug("end"))
);

module.exports.parse = parse;
