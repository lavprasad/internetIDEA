'use strict';

const assert = require('node:assert/strict');
const logic = require('./logic.js');

assert.equal(logic.format(0), '00:00');
assert.equal(logic.format(5), '00:05');
assert.equal(logic.format(90), '01:30');
assert.equal(logic.format(1500), '25:00');

function rejected(value) {
  const result = logic.parseMinutes(value);
  assert.equal(result.ok, false);
  assert.equal(typeof result.error, 'string');
  assert.ok(result.error.length > 0);
}

rejected(0);
rejected(121);
rejected('x');
rejected(1.5);
assert.deepEqual(logic.parseMinutes(1), { ok: true, seconds: 60 });
assert.deepEqual(logic.parseMinutes(120), { ok: true, seconds: 7200 });

const reduced = logic.tick({ remainingSec: 10, running: true, completed: 2 });
assert.deepEqual(reduced, {
  remainingSec: 9,
  running: true,
  completed: 2,
  finished: false
});

const finished = logic.tick({ remainingSec: 1, running: true, completed: 3 });
assert.deepEqual(finished, {
  remainingSec: 0,
  running: false,
  completed: 4,
  finished: true
});

const pausedInput = { remainingSec: 40, running: false, completed: 7 };
const paused = logic.tick(pausedInput);
assert.deepEqual(paused, { remainingSec: 40, running: false, completed: 7 });
assert.notEqual(paused, pausedInput);

assert.equal(logic.suggestNext('focus', 1), 'short');
assert.equal(logic.suggestNext('focus', 2), 'short');
assert.equal(logic.suggestNext('focus', 3), 'short');
assert.equal(logic.suggestNext('focus', 4), 'long');
assert.equal(logic.suggestNext('focus', 8), 'long');
assert.equal(logic.suggestNext('short', 3), 'focus');

console.log('format 0 => 00:00');
console.log('format 5 => 00:05');
console.log('format 90 => 01:30');
console.log('format 1500 => 25:00');
console.log('parseMinutes rejects 0, 121, x, 1.5');
console.log('parseMinutes accepts 1 => 60s, 120 => 7200s');
console.log('tick 10 running => 9');
console.log('tick 1 running => finished, completed 4, stopped');
console.log('tick paused => remaining unchanged');
console.log('suggestNext focus 1,2,3 => short; 4,8 => long; short => focus');
console.log('all passed');
