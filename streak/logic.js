"use strict";

(function (factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (typeof window !== "undefined") {
    window.AppLogic = api;
  }
})(function () {
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function todayISO(d) {
    var date = d || new Date();
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function addDays(iso, n) {
    var parts = iso.split("-");
    var y = Number(parts[0]);
    var m = Number(parts[1]);
    var day = Number(parts[2]);
    return todayISO(new Date(y, m - 1, day + n));
  }

  function toggleDay(dates, iso) {
    var next = dates.filter(function (d) { return d !== iso; });
    if (next.length === dates.length) next.push(iso);
    next.sort();
    return next;
  }

  function streak(dates, today) {
    var set = {};
    dates.forEach(function (d) { set[d] = true; });
    var cursor = set[today] ? today : addDays(today, -1);
    var count = 0;
    while (set[cursor]) {
      count += 1;
      cursor = addDays(cursor, -1);
    }
    return count;
  }

  function lastNDays(today, n) {
    var out = [];
    for (var i = n - 1; i >= 0; i--) out.push(addDays(today, -i));
    return out;
  }

  function validateName(name) {
    var trimmed = String(name == null ? "" : name).trim();
    if (!trimmed) return { ok: false, error: "Enter a habit name." };
    if (trimmed.length > 40) return { ok: false, error: "Name must be 40 characters or fewer." };
    return { ok: true };
  }

  return {
    todayISO: todayISO,
    addDays: addDays,
    toggleDay: toggleDay,
    streak: streak,
    lastNDays: lastNDays,
    validateName: validateName
  };
});
