"use strict";

const assert = require("node:assert/strict");
const logic = require("./logic.js");

assert.equal(logic.todayISO(new Date(2026, 0, 9)), "2026-01-09");
assert.equal(logic.addDays("2026-01-30", 3), "2026-02-02");

assert.equal(logic.effectiveDate("2026-02-01", "2026-01-10", 10), "2026-01-20");
assert.equal(logic.effectiveDate("2026-02-01", "2026-01-31", 10), "2026-02-01");
assert.equal(logic.effectiveDate("2026-01-20", "2026-01-10", 10), "2026-01-20");

assert.equal(logic.effectiveDate("2026-02-01", "2026-01-01", null), "2026-02-01");
assert.equal(logic.effectiveDate("2026-02-01", "2026-01-01", undefined), "2026-02-01");
assert.equal(logic.effectiveDate("2026-02-01", "", 5), "2026-02-01");
assert.equal(logic.effectiveDate("2026-06-01", "2026-05-01", 0), "2026-06-01");

assert.equal(logic.daysLeft("2026-01-31", "2026-02-03"), 3);
assert.equal(logic.daysLeft("2026-03-01", "2026-02-27"), -2);
assert.equal(logic.daysLeft("2024-02-28", "2024-03-01"), 2);

assert.equal(logic.status(-1), "expired");
assert.equal(logic.status(0), "soon");
assert.equal(logic.status(7), "soon");
assert.equal(logic.status(8), "fresh");

function reject(input) {
  const result = logic.validateItem(input);
  assert.equal(result.ok, false);
  assert.equal(typeof result.error, "string");
  assert.ok(result.error.length > 0);
}

reject({ name: "   ", expiry: "2026-04-01", opened: "", daysAfterOpen: null });
reject({ name: "Milk", expiry: "2026-04-01", opened: "", daysAfterOpen: 5 });
reject({ name: "Milk", expiry: "2026-04-01", opened: "2026-04-01", daysAfterOpen: null });
reject({ name: "Milk", expiry: "2026-04-01", opened: "2026-04-01", daysAfterOpen: 0 });
assert.deepEqual(
  logic.validateItem({ name: " Milk ", expiry: "2026-04-01", opened: "", daysAfterOpen: "" }),
  { ok: true }
);
assert.deepEqual(
  logic.validateItem({ name: "Milk", expiry: "2026-04-01", opened: "2026-03-28", daysAfterOpen: 4 }),
  { ok: true }
);

function item(id, expiry, state, opened, days) {
  return {
    id: id,
    name: id,
    category: "food",
    expiry: expiry,
    opened: opened == null ? null : opened,
    daysAfterOpen: days == null ? null : days,
    state: state
  };
}

const today = "2026-03-10";
const items = [
  item("f", "2026-03-18", "active"),
  item("w", "2026-03-12", "wasted"),
  item("e", "2026-03-09", "active"),
  item("u", "2026-03-01", "used"),
  item("s7", "2026-03-17", "active"),
  item("o", "2026-04-01", "active", "2026-03-01", 5),
  item("s0", "2026-03-10", "active")
];

assert.deepEqual(logic.summarize(items, today), {
  active: 5,
  expired: 2,
  soon: 2,
  used: 1,
  wasted: 1
});

const sorted = logic.sortItems(items, today);
assert.deepEqual(sorted.map(function (entry) { return entry.id; }), ["u", "o", "e", "s0", "w", "s7", "f"]);
assert.equal(items[0].id, "f");
assert.notEqual(sorted, items);

console.log("all tests passed");
