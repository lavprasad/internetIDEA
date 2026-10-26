"use strict";

var assert = require("node:assert/strict");
var logic = require("./logic.js");

assert.deepEqual(logic.units("length"), ["m", "km", "cm", "mm", "in", "ft", "mi"]);
assert.deepEqual(logic.units("mass"), ["kg", "g", "lb", "oz"]);
assert.deepEqual(logic.units("volume"), ["L", "mL", "gal", "cup"]);
assert.deepEqual(logic.units("temp"), ["C", "F", "K"]);

assert.equal(logic.convert("length", 1, "km", "m"), 1000);
assert.equal(logic.convert("length", 1, "in", "m"), 0.0254);
assert.equal(logic.convert("mass", 1, "lb", "kg"), 0.45359237);
assert.equal(logic.convert("volume", 1, "gal", "L"), 3.785411784);
assert.equal(logic.convert("temp", 0, "C", "F"), 32);
assert.equal(logic.convert("temp", 100, "C", "F"), 212);
assert.equal(logic.convert("temp", 0, "C", "K"), 273.15);
assert.ok(Math.abs(logic.convert("temp", 32, "F", "C") - 0) < 1e-9);

assert.equal(typeof logic.absoluteZeroError("temp", -1, "K"), "string");
assert.equal(logic.absoluteZeroError("temp", -273.15, "C"), null);
assert.equal(logic.absoluteZeroError("temp", -459.67, "F"), null);
assert.equal(logic.absoluteZeroError("length", -1, "m"), null);

assert.equal(logic.formatResult(0.0254), "0.0254");
assert.equal(logic.formatResult(1000), "1000");
assert.equal(logic.formatResult(1 / 3), "0.333333");
assert.equal(logic.formatResult(32), "32");
assert.equal(logic.formatResult(NaN), "");
assert.equal(logic.formatResult(1e10), "1.00000e+10");

assert.throws(function () { logic.convert("nope", 1, "m", "km"); });
assert.throws(function () { logic.convert("length", 1, "nope", "m"); });
assert.throws(function () { logic.convert("length", Infinity, "m", "km"); });

console.log("all tests passed");
