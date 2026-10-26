"use strict";

var assert = require("assert");
var logic = require("./logic.js");

assert.strictEqual(logic.lineCents(2, 1050), 2100);
assert.strictEqual(logic.lineCents(1.5, 1000), 1500);

var bill = logic.compute(
  [
    { desc: "Design", qty: 2, rateCents: 2500 },
    { desc: "Hosting", qty: 1, rateCents: 5000 }
  ],
  10
);
assert.strictEqual(bill.subtotal, 10000);
assert.strictEqual(bill.tax, 1000);
assert.strictEqual(bill.total, 11000);
assert.strictEqual(bill.lines[0].lineTotal, 5000);
assert.strictEqual(bill.lines[1].lineTotal, 5000);

var rounded = logic.compute([{ desc: "Odd", qty: 1, rateCents: 1001 }], 10);
assert.strictEqual(rounded.subtotal, 1001);
assert.strictEqual(rounded.tax, 100);
assert.strictEqual(rounded.total, 1101);

var emptyFrom = logic.validateDraft({
  from: "   ",
  to: "Client",
  number: "100",
  date: "2026-10-26",
  taxPercent: 0,
  lines: [{ desc: "Work", qty: 1, rate: 10 }]
});
assert.strictEqual(emptyFrom.ok, false);

var emptyDesc = logic.validateDraft({
  from: "Studio",
  to: "Client",
  number: "100",
  date: "2026-10-26",
  taxPercent: 0,
  lines: [{ desc: "  ", qty: 1, rate: 10 }]
});
assert.strictEqual(emptyDesc.ok, false);

var saved = logic.validateDraft({
  from: " Studio ",
  to: " Client ",
  number: " 100 ",
  date: "2026-10-26",
  taxPercent: 10,
  lines: [{ desc: " Work ", qty: 1.5, rate: 10 }]
});
assert.strictEqual(saved.ok, true);
assert.strictEqual(saved.draft.lines[0].rateCents, 1000);
assert.strictEqual(saved.draft.from, "Studio");

assert.strictEqual(logic.formatMoney(1101), "$11.01");
assert.throws(function () { logic.lineCents(0, 100); }, Error);
assert.throws(function () { logic.lineCents(1, 1.5); }, Error);
assert.throws(function () { logic.lineCents(-2, 100); }, Error);

console.log("pass lineCents(2, 1050) === 2100");
console.log("pass lineCents(1.5, 1000) === 1500");
console.log("pass compute subtotal 10000 tax 1000 total 11000");
console.log("pass compute subtotal 1001 tax 100 total 1101");
console.log("pass validateDraft rejects empty from and empty line desc");
console.log("pass formatMoney(1101) === $11.01");
console.log("pass lineCents throws on invalid qty and rateCents");
