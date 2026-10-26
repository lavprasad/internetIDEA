"use strict";

var logic = require("./logic.js");
var failed = 0;

function check(name, fn) {
  try {
    fn();
    console.log("PASS " + name);
  } catch (err) {
    failed += 1;
    console.error("FAIL " + name);
    console.error(err && err.message ? err.message : err);
  }
}

function eq(actual, expected, label) {
  if (actual !== expected) {
    throw new Error((label || "value") + ": expected " + JSON.stringify(expected) + " got " + JSON.stringify(actual));
  }
}

check("phasesFrom(4,0,4,0) is Inhale 4, Exhale 4 only", function () {
  var phases = logic.phasesFrom(4, 0, 4, 0);
  eq(phases.length, 2, "length");
  eq(phases[0].name, "Inhale", "name");
  eq(phases[0].seconds, 4, "seconds");
  eq(phases[1].name, "Exhale", "name");
  eq(phases[1].seconds, 4, "seconds");
});

check("advance within a phase decrements", function () {
  var phases = logic.phasesFrom(4, 4, 4, 4);
  var next = logic.advance(0, 4, phases);
  eq(next.phaseIndex, 0, "phaseIndex");
  eq(next.secondsLeft, 3, "secondsLeft");
  eq(next.cycleDone, false, "cycleDone");
});

check("advance at 1 second left wraps to next phase with that phase's full seconds", function () {
  var phases = logic.phasesFrom(4, 7, 8, 0);
  var next = logic.advance(0, 1, phases);
  eq(next.phaseIndex, 1, "phaseIndex");
  eq(next.secondsLeft, 7, "secondsLeft");
  eq(phases[1].seconds, 7, "phase seconds");
});

check("advance from last phase sets cycleDone true and index 0", function () {
  var phases = logic.phasesFrom(4, 4, 4, 4);
  var next = logic.advance(3, 1, phases);
  eq(next.cycleDone, true, "cycleDone");
  eq(next.phaseIndex, 0, "phaseIndex");
  eq(next.secondsLeft, phases[0].seconds, "secondsLeft");
});

check("advance from a non-last phase sets cycleDone false", function () {
  var phases = logic.phasesFrom(4, 4, 4, 4);
  var next = logic.advance(1, 1, phases);
  eq(next.cycleDone, false, "cycleDone");
  eq(next.phaseIndex, 2, "phaseIndex");
});

check("validatePhase accepts 0 and 30, rejects blank, 31, -1, 1.2", function () {
  var zero = logic.validatePhase("0");
  var thirty = logic.validatePhase("30");
  eq(zero.ok, true, "0 ok");
  eq(zero.value, 0, "0 value");
  eq(thirty.ok, true, "30 ok");
  eq(thirty.value, 30, "30 value");
  eq(logic.validatePhase("").ok, false, "blank");
  eq(logic.validatePhase("31").ok, false, "31");
  eq(logic.validatePhase("-1").ok, false, "-1");
  eq(logic.validatePhase("1.2").ok, false, "1.2");
  eq(typeof logic.validatePhase("").error, "string", "blank error");
  eq(logic.validatePhase("1.5").ok, false, "1.5");
});

if (failed > 0) {
  console.error(failed + " failed");
  process.exit(1);
}

console.log("All tests passed");
