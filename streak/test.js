"use strict";

const assert = require("node:assert/strict");
const { streak, toggleDay, lastNDays, validateName, addDays } = require("./logic.js");

const today = "2026-10-26";

assert.equal(streak([addDays(today, -2), addDays(today, -1), today], today), 3);
assert.equal(streak([addDays(today, -3), addDays(today, -2), addDays(today, -1)], today), 3);
assert.equal(streak([addDays(today, -2), today], today), 1);
assert.equal(streak([], today), 0);

assert.deepEqual(toggleDay([], today), [today]);
assert.deepEqual(toggleDay([today], today), []);

const days = lastNDays(today, 28);
assert.equal(days.length, 28);
assert.equal(days[days.length - 1], today);

assert.equal(validateName("   ").ok, false);
assert.equal(validateName("a".repeat(41)).ok, false);

console.log("test.js: all assertions passed");
