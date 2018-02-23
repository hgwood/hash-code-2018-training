const _ = require("lodash");
const fs = require("fs");
const debug = require("debug")("write");

module.exports = function write(path, solution) {
  writeLines(path, unparse(solution));
};

function writeLines(path, lines) {
  fs.writeFileSync(path, lines.join("\n"));
  debug(`wrote ${lines.length} lines to ${path}`);
}
function unparse(solution) {
  // TODO: insert write logic here
  // must return an array of lines to write to the output file
  return [];
}

module.exports.unparse = unparse;
