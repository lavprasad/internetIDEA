"use strict";

var assert = require("assert");
var logic = require("./logic.js");

function check(name, fn) {
  fn();
  console.log("pass " + name);
}

check("remaining 90 seconds", function () {
  var now = 1000000000000;
  var parts = logic.remaining(now, now + 90 * 1000);
  assert.strictEqual(parts.days, 0);
  assert.strictEqual(parts.hours, 0);
  assert.strictEqual(parts.minutes, 1);
  assert.strictEqual(parts.seconds, 30);
  assert.strictEqual(parts.past, false);
});

check("remaining -90 seconds", function () {
  var now = 1000000000000;
  var parts = logic.remaining(now, now - 90 * 1000);
  assert.strictEqual(parts.past, true);
  assert.strictEqual(parts.minutes, 1);
  assert.strictEqual(parts.seconds, 30);
});

check("remaining 2 days + 3 seconds", function () {
  var now = 0;
  var parts = logic.remaining(now, 2 * 86400 * 1000 + 3 * 1000);
  assert.strictEqual(parts.days, 2);
  assert.strictEqual(parts.seconds, 3);
});

check("formatRemaining past includes ago", function () {
  var text = logic.formatRemaining({ past: true, days: 1, hours: 2, minutes: 3, seconds: 4 });
  assert.ok(text.indexOf("ago") !== -1);
  assert.strictEqual(text, "1d 2h 3m 4s ago");
});

check("sortEvents future then past", function () {
  var now = 1000;
  var events = [
    { id: "later", title: "Later", targetMs: 5000 },
    { id: "past", title: "Past", targetMs: 100 },
    { id: "soon", title: "Soon", targetMs: 2000 }
  ];
  var sorted = logic.sortEvents(events, now);
  assert.deepStrictEqual(sorted.map(function (e) { return e.id; }), ["soon", "later", "past"]);
  assert.notStrictEqual(sorted, events);
});

check("validate rejects blank title and bad datetime", function () {
  var blank = logic.validate("   ", "2026-01-02T03:04", Date.now());
  assert.strictEqual(blank.ok, false);
  var bad = logic.validate("Hello", "not-a-date", Date.now());
  assert.strictEqual(bad.ok, false);
});

check("validate local datetime", function () {
  var result = logic.validate("  Birthday  ", "2026-01-02T03:04", Date.now());
  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.title, "Birthday");
  assert.strictEqual(result.targetMs, new Date(2026, 0, 2, 3, 4, 0, 0).getTime());
});

console.log("all tests passed");
