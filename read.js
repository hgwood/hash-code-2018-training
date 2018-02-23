const fs = require("fs");
const assert = require("assert");
const debug = require("debug")("read");
const jolicitron = require("jolicitron");

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

function parse(textFromInputFile) {
  const parse = jolicitron((save, n) => [
    // TODO: insert parser config here
  ]);
  const { parsedValue, remaining } = parse(textFromInputFile);
  assert.equal(
    remaining.trim(),
    "",
    "input has not been entirely consumed by the parser; parser might be incorrect"
  );
  debug("end");
  return parsedValue;
}

module.exports.parse = parse;
