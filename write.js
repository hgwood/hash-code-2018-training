const _ = require("lodash/fp");
const fs = require("fs");
const debug = require("debug")("write");

module.exports = function write(path, solution) {
  writeLines(path, unparse(solution));
};

function writeLines(path, lines) {
  fs.writeFileSync(path, lines.join("\n"));
  debug(`wrote ${lines.length} lines to ${path}`);
}

const unparse = _.flow(
  _.over([
    _.flow(_.property("length"), _.toString),
    _.map(({ r1, c1, r2, c2 }) => `${r1} ${c1} ${r2} ${c2}`)
  ]),
  _.flatten
);

module.exports.unparse = unparse;
