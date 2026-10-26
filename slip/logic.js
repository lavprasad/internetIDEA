(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AppLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function lineCents(qty, rateCents) {
    if (typeof qty !== "number" || !Number.isFinite(qty) || qty <= 0) {
      throw new Error("qty must be a number > 0");
    }
    if (!Number.isInteger(rateCents) || rateCents < 0) {
      throw new Error("rateCents must be an integer >= 0");
    }
    return Math.round(qty * rateCents);
  }

  function compute(lines, taxPercent) {
    if (!Array.isArray(lines)) throw new Error("lines must be an array");
    if (typeof taxPercent !== "number" || !Number.isFinite(taxPercent) || taxPercent < 0) {
      throw new Error("taxPercent must be a finite number >= 0");
    }
    var priced = lines.map(function (line) {
      return {
        desc: line.desc,
        qty: line.qty,
        rateCents: line.rateCents,
        lineTotal: lineCents(line.qty, line.rateCents)
      };
    });
    var subtotal = priced.reduce(function (sum, line) {
      return sum + line.lineTotal;
    }, 0);
    var tax = Math.round(subtotal * taxPercent / 100);
    return { subtotal: subtotal, tax: tax, total: subtotal + tax, lines: priced };
  }

  function formatMoney(cents) {
    var n = Math.round(cents);
    var sign = n < 0 ? "-" : "";
    var abs = Math.abs(n);
    var dollars = Math.floor(abs / 100);
    var frac = String(abs % 100).padStart(2, "0");
    return sign + "$" + dollars + "." + frac;
  }

  function asNum(value) {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") return Number(value);
    return NaN;
  }

  function fail(error) {
    return { ok: false, error: error };
  }

  function validateDraft(input) {
    var src = input || {};
    var from = String(src.from == null ? "" : src.from).trim();
    var to = String(src.to == null ? "" : src.to).trim();
    var number = String(src.number == null ? "" : src.number).trim();
    var date = String(src.date == null ? "" : src.date).trim();
    if (!from) return fail("From is required.");
    if (!to) return fail("Bill to is required.");
    if (!number) return fail("Invoice number is required.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail("Date must be YYYY-MM-DD.");
    var taxPercent = asNum(src.taxPercent);
    if (!Number.isFinite(taxPercent) || taxPercent < 0) return fail("Tax % must be 0 or more.");
    if (!Array.isArray(src.lines) || src.lines.length < 1) return fail("Add at least one line.");
    var lines = [];
    for (var i = 0; i < src.lines.length; i++) {
      var line = src.lines[i] || {};
      var desc = String(line.desc == null ? "" : line.desc).trim();
      var qty = asNum(line.qty);
      var rate = asNum(line.rate);
      if (!desc) return fail("Each line needs a description.");
      if (!Number.isFinite(qty) || qty <= 0) return fail("Quantity must be greater than 0.");
      if (!Number.isFinite(rate) || rate < 0) return fail("Rate must be 0 or more.");
      // ponytail: Math.round(rate * 100); parse a cents string if x.xx5 pennies matter
      lines.push({ desc: desc, qty: qty, rateCents: Math.round(rate * 100) });
    }
    return {
      ok: true,
      draft: { from: from, to: to, number: number, date: date, taxPercent: taxPercent, lines: lines }
    };
  }

  return {
    lineCents: lineCents,
    compute: compute,
    formatMoney: formatMoney,
    validateDraft: validateDraft
  };
});
