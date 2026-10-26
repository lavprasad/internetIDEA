var assert = require("assert");
var L = require("./logic.js");

function check(name, fn) {
  fn();
  console.log("pass " + name);
}

check("parseAmount 12.5", function () {
  var got = L.parseAmount("12.5");
  assert.strictEqual(got.ok, true);
  assert.strictEqual(got.cents, 1250);
});

check("parseAmount rejects 0, -1, abc, 1.234", function () {
  ["0", "-1", "abc", "1.234"].forEach(function (text) {
    var got = L.parseAmount(text);
    assert.strictEqual(got.ok, false, text);
    assert.strictEqual(typeof got.error, "string", text);
  });
});

check("filterMonth", function () {
  var items = [
    { date: "2026-01-02", category: "food", note: "a", cents: 100 },
    { date: "2026-02-01", category: "home", note: "b", cents: 250 },
    { date: "2026-01-15", category: "transport", note: "c", cents: 40 }
  ];
  var jan = L.filterMonth(items, "2026-01");
  assert.deepStrictEqual(jan.map(function (item) { return item.date; }), ["2026-01-02", "2026-01-15"]);
});

check("totalCents", function () {
  assert.strictEqual(L.totalCents([{ cents: 100 }, { cents: 250 }]), 350);
  assert.strictEqual(L.totalCents([]), 0);
});

check("byCategory", function () {
  var groups = L.byCategory([
    { category: "food", cents: 100 },
    { category: "home", cents: 250 },
    { category: "food", cents: 40 }
  ]);
  assert.deepStrictEqual(groups, { food: 140, home: 250 });
  assert.strictEqual(Object.prototype.hasOwnProperty.call(groups, "transport"), false);
});

check("toCSV escapes note", function () {
  var csv = L.toCSV([
    { date: "2026-03-04", category: "food", note: 'hello, "a"', cents: 1250 }
  ]);
  var lines = csv.split(/\r?\n/).filter(Boolean);
  assert.strictEqual(lines[0], "date,category,note,amount");
  assert.strictEqual(lines[1], '2026-03-04,food,"hello, ""a""",12.50');
  assert.strictEqual(csv.indexOf("<"), -1);
});

check("validate rejects unknown category", function () {
  var got = L.validate("12.5", "rent", "2026-03-04", "lunch");
  assert.strictEqual(got.ok, false);
  var good = L.validate("12.5", "food", "2026-03-04", "lunch");
  assert.strictEqual(good.ok, true);
  assert.strictEqual(good.cents, 1250);
});

check("monthKey and currentMonth", function () {
  assert.strictEqual(L.monthKey("2026-10-26"), "2026-10");
  assert.throws(function () { L.monthKey("2026-10-2"); });
  assert.strictEqual(L.currentMonth(new Date(2026, 0, 2)), "2026-01");
});

console.log("all tests passed");
