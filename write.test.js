/* eslint-env mocha */

const assert = require("assert");
const unparse = require("./write").unparse;

describe("unparse", function() {
  it("unparses correctly", function() {
    assert.deepEqual(
      unparse([
        { r1: 3, c1: 6, r2: 9, c2: 14 },
        { r1: 31, c1: 62, r2: 9, c2: 14 }
      ]),
      ["2", "3 6 9 14", "31 62 9 14"]
    );
  });
});
