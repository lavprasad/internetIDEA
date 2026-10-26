(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AppLogic = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  var CATEGORIES = ["food", "transport", "home", "health", "other"];
  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

  function monthKey(isoDate) {
    if (typeof isoDate !== "string" || !DATE_RE.test(isoDate)) {
      throw new Error("Date must be YYYY-MM-DD");
    }
    return isoDate.slice(0, 7);
  }

  function currentMonth(d) {
    var date = d || new Date();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    return date.getFullYear() + "-" + month;
  }

  function parseAmount(text) {
    var raw = String(text == null ? "" : text).trim();
    if (!raw) return { ok: false, error: "Enter an amount." };
    if (!/^\d+(\.\d{1,2})?$/.test(raw)) {
      return { ok: false, error: "Enter a positive amount with at most 2 decimal places." };
    }
    var n = Number(raw);
    if (!isFinite(n) || n <= 0) {
      return { ok: false, error: "Enter an amount greater than 0." };
    }
    return { ok: true, cents: Math.round(n * 100) };
  }

  function filterMonth(items, yyyyMm) {
    return items.filter(function (item) {
      return String(item.date).indexOf(yyyyMm) === 0;
    });
  }

  function totalCents(items) {
    var sum = 0;
    for (var i = 0; i < items.length; i++) sum += items[i].cents;
    return sum;
  }

  function byCategory(items) {
    var out = {};
    for (var i = 0; i < items.length; i++) {
      var cat = items[i].category;
      out[cat] = (out[cat] || 0) + items[i].cents;
    }
    return out;
  }

  function csvField(value) {
    var s = String(value == null ? "" : value);
    if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  function toCSV(items) {
    var lines = ["date,category,note,amount"];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var dollars = (item.cents / 100).toFixed(2);
      lines.push([item.date, item.category, csvField(item.note), dollars].join(","));
    }
    return lines.join("\n") + "\n";
  }

  function realDate(isoDate) {
    if (typeof isoDate !== "string" || !DATE_RE.test(isoDate)) return false;
    var parts = isoDate.split("-");
    var y = Number(parts[0]);
    var m = Number(parts[1]);
    var d = Number(parts[2]);
    var dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
  }

  function validate(amountText, category, dateISO, note) {
    var amount = parseAmount(amountText);
    if (!amount.ok) return amount;
    if (CATEGORIES.indexOf(category) === -1) {
      return { ok: false, error: "Choose food, transport, home, health, or other." };
    }
    if (!realDate(dateISO)) return { ok: false, error: "Use a real date as YYYY-MM-DD." };
    if (typeof note !== "string") return { ok: false, error: "Note must be text." };
    if (note.length > 80) return { ok: false, error: "Note must be 80 characters or fewer." };
    return { ok: true, cents: amount.cents };
  }

  return {
    monthKey: monthKey,
    currentMonth: currentMonth,
    parseAmount: parseAmount,
    filterMonth: filterMonth,
    totalCents: totalCents,
    byCategory: byCategory,
    toCSV: toCSV,
    validate: validate
  };
});
