"use strict";

const _ = require("lodash");
const glob = require("glob");
const read = require("./read");
const write = require("./write");
const path = require("path");
const solve = require("./solve");

const solutionDir =
  process.env.SOLUTION_DIR || process.env.npm_package_config_solutionDir || "";

const files = _(process.argv)
  .slice(2)
  .flatMap(filename => glob.sync(filename))
  .value();

if (_.isEmpty(files)) console.warn("No input files given.");

_.each(files, function(file) {
  const problem = read(file);
  const solution = solve(problem);
  write(path.join(solutionDir, `${file.split(".")[0]}.out.txt`), solution);
});
