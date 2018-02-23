/* eslint-env mocha */

const assert = require("assert");
const { parse } = require("./read");

describe("parse", function() {
  it("parses correctly", function() {
    const textFromInputFile = `3 5 1 6
    TTTTT
    TMMMT
    TTTTT
    `;
    assert.deepEqual(parse(textFromInputFile), {
      nrows: 3,
      ncolumns: 5,
      minIngredients: 1,
      maxCells: 6,
      pizza: [
        ["T", "T", "T", "T", "T"],
        ["T", "M", "M", "M", "T"],
        ["T", "T", "T", "T", "T"]
      ]
    });
  });
});
