"use strict";

const logic = require("./logic.js");

function assert(cond, message) {
  if (!cond) {
    console.error("FAIL " + message);
    process.exit(1);
  }
  console.log("PASS " + message);
}

assert(logic.totalCents(10000, 10, 0) === 11000, "totalCents(10000, 10, 0) === 11000");
assert(logic.totalCents(10000, 10, 20) === 13200, "totalCents(10000, 10, 20) === 13200");

const thirds = logic.split(100, [1, 1, 1]);
assert(thirds.reduce((sum, n) => sum + n, 0) === 100, "split(100, [1,1,1]) sums to 100");
assert(JSON.stringify(thirds) === JSON.stringify([34, 33, 33]), "split(100, [1,1,1]) is [34,33,33]");

assert(
  JSON.stringify(logic.split(100, [1, 1])) === JSON.stringify([50, 50]),
  "split(100, [1,1]) is [50,50]"
);

const weighted = logic.split(5, [1, 2]);
assert(JSON.stringify(weighted) === JSON.stringify([2, 3]), "split(5, [1,2]) is [2,3]");
assert(weighted.reduce((sum, n) => sum + n, 0) === 5, "split(5, [1,2]) sums to 5");

assert(logic.formatMoney(5) === "$0.05", "formatMoney(5) === $0.05");
assert(logic.formatMoney(100) === "$1.00", "formatMoney(100) === $1.00");

const blankName = logic.validate("10", "0", "0", [{ name: " ", shares: 1 }]);
assert(blankName.ok === false, "validate rejects blank name");

const zeroShares = logic.validate("10", "0", "0", [{ name: "You", shares: 0 }]);
assert(zeroShares.ok === false, "validate rejects shares 0");

console.log("all passed");
