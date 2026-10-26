"use strict";

var assert = require("assert").strict;
var L = require("./logic.js");

var questions = [
  { id: "a1", chapter: "percent", skill: "successive" },
  { id: "a2", chapter: "percent", skill: "successive" },
  { id: "b1", chapter: "speed", skill: "average-speed" }
];

var progress = L.emptyProgress();
assert.deepEqual(progress.attempts, []);
assert.deepEqual(L.weakSkills(progress.attempts), []);

progress = L.record(progress, { id: "a1", chapter: "percent", skill: "successive", correct: false });
progress = L.record(progress, { id: "a2", chapter: "percent", skill: "successive", correct: false });
progress = L.record(progress, { id: "b1", chapter: "speed", skill: "average-speed", correct: false });
progress = L.record(progress, { id: "b1", chapter: "speed", skill: "average-speed", correct: true });

var weak = L.weakSkills(progress.attempts);
assert.equal(weak[0].skill, "successive");
assert.equal(weak[0].wrong, 2);
assert.equal(weak[1].skill, "average-speed");
assert.equal(weak[1].failRate, 0.5);

var report = L.chapterReport(questions, progress.attempts, "percent");
assert.equal(report.total, 2);
assert.equal(report.tried, 2);
assert.equal(report.correct, 0);
assert.equal(report.accuracy, 0);

var rows = L.weights(questions, progress.attempts, { mode: "weak", lastId: "a2" });
var byId = {};
rows.forEach(function (row) { byId[row.id] = row.w; });
assert.ok(byId.a1 > byId.b1, "a missed successive question outweighs a mixed speed skill");
assert.ok(byId.a2 < byId.a1, "the question just seen is down-weighted");

var first = L.pickQuestion(questions, progress.attempts, { mode: "weak", rng: function () { return 0; } });
assert.equal(first.id, "a1");

var onlySpeed = L.pickQuestion(questions, [], {
  mode: "chapter",
  chapter: "speed",
  rng: function () { return 0.99; }
});
assert.equal(onlySpeed.id, "b1");

var none = L.pickQuestion(questions, [], { mode: "chapter", chapter: "missing", rng: function () { return 0; } });
assert.equal(none, null);

var fs = require("fs");
var vm = require("vm");
var sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(__dirname + "/content.js", "utf8"), sandbox);
var course = sandbox.window.AptitudeCourse;
var skills = {};
course.chapters.forEach(function (chapter) {
  chapter.tricks.forEach(function (item) { skills[chapter.id + ":" + item.skill] = true; });
});
assert.equal(course.chapters.length, 10);
assert.equal(course.questions.length, 60);
course.questions.forEach(function (question) {
  assert.ok(question.choices.indexOf(question.answer) !== -1, question.id + " answer not in choices");
  assert.ok(skills[question.chapter + ":" + question.skill], question.id + " missing trick");
  assert.ok(question.steps.length >= 2, question.id + " needs steps");
});

console.log("aptitude logic tests passed");
