"use strict";

var logic = require("./logic.js");
var failed = 0;

function check(cond, msg) {
  if (cond) {
    console.log("PASS " + msg);
    return;
  }
  failed += 1;
  console.error("FAIL " + msg);
}

check(logic.pickIndex(4, 0) === 0, "pickIndex(4, 0) === 0");
check(logic.pickIndex(4, 0.99) === 3, "pickIndex(4, 0.99) === 3");
check(logic.pickIndex(2, 0.5) === 1, "pickIndex(2, 0.5) === 1");
check(logic.pickIndex(2, 0.999) === 1, "pickIndex(2, 0.999) === 1");

check(logic.rotationFor(0, 4, 0) === 360 - 45, "rotationFor(0, 4, 0) === 315");
check(logic.rotationFor(1, 4, 0) === 360 - 1.5 * 90, "rotationFor(1, 4, 0) === 225");
check(logic.rotationFor(0, 4, 5) === 315 + 1800, "rotationFor(0, 4, 5) === 315 + 1800");

var blank = logic.validateOption("   ", []);
check(blank.ok === false && typeof blank.error === "string", "validateOption rejects blank");

var empty = logic.validateOption("", ["Yes"]);
check(empty.ok === false, "validateOption rejects empty string");

var dup = logic.validateOption("yes", ["Yes"]);
check(dup.ok === false && typeof dup.error === "string", "validateOption rejects yes vs Yes");

var spaced = logic.validateOption("  Go  ", ["Yes"]);
check(spaced.ok === true && spaced.name === "Go", "validateOption accepts trimmed Go");

var tooLong = logic.validateOption(new Array(42).join("a"), []);
check(tooLong.ok === false, "validateOption rejects more than 40 characters");

var prior = ["old"];
var newest = logic.pushHistory(prior, "new");
check(prior.length === 1 && prior[0] === "old", "pushHistory leaves the previous list alone");
check(newest[0] === "new" && newest[1] === "old", "pushHistory puts the newest name first");

var history = [];
for (var i = 1; i <= 12; i++) {
  history = logic.pushHistory(history, "n" + i);
}
check(history.length === 10, "pushHistory caps at 10");
check(history[0] === "n12" && history[9] === "n3", "pushHistory keeps the ten newest, newest first");

var capped = logic.pushHistory(["a", "b"], "c", 2);
check(capped.length === 2 && capped[0] === "c" && capped[1] === "a", "pushHistory honors a custom limit");

var inRange = true;
for (var n = 0; n < 1000; n++) {
  var index = logic.pickIndex(7, n / 1000);
  if (index < 0 || index >= 7) inRange = false;
}
check(inRange, "pickIndex stays inside 0..count-1");

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}

console.log("All tests passed");
