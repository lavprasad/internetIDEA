(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AppLogic = api;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  function toCents(amount) {
    if (typeof amount !== "number" || !Number.isFinite(amount)) {
      return { ok: false, error: "Subtotal must be a number." };
    }
    if (amount < 0) {
      return { ok: false, error: "Subtotal cannot be negative." };
    }
    return { ok: true, cents: Math.round(amount * 100) };
  }

  function totalCents(subtotalCents, taxPercent, tipPercent) {
    const taxed = Math.round(subtotalCents * (1 + taxPercent / 100));
    return Math.round(taxed * (1 + tipPercent / 100));
  }

  function split(total, weights) {
    const sumW = weights.reduce((sum, w) => sum + w, 0);
    const base = weights.map((w) => Math.floor((total * w) / sumW));
    const remainder = total - base.reduce((sum, cents) => sum + cents, 0);
    return base.map((cents, index) => cents + (index < remainder ? 1 : 0));
  }

  function formatMoney(cents) {
    const sign = cents < 0 ? "-" : "";
    const abs = Math.abs(cents);
    const frac = String(abs % 100).padStart(2, "0");
    return sign + "$" + Math.floor(abs / 100) + "." + frac;
  }

  function readPercent(text, label) {
    if (text == null) return { ok: false, error: label + " must be a number." };
    const raw = String(text);
    if (raw.trim() === "") return { ok: true, percent: 0 };
    const n = Number(raw.trim());
    if (!Number.isFinite(n)) return { ok: false, error: label + " must be a number." };
    if (n < 0) return { ok: false, error: label + " cannot be negative." };
    return { ok: true, percent: n };
  }

  function readShares(shares) {
    if (typeof shares === "boolean" || shares == null) return null;
    if (typeof shares === "string" && shares.trim() === "") return null;
    const n = typeof shares === "number" ? shares : Number(String(shares).trim());
    if (!Number.isInteger(n) || n < 1) return null;
    return n;
  }

  function validate(subtotalText, taxText, tipText, people) {
    const subText = subtotalText == null ? "" : String(subtotalText);
    if (subText.trim() === "") return { ok: false, error: "Enter a subtotal." };

    const sub = toCents(Number(subText.trim()));
    if (!sub.ok) return { ok: false, error: sub.error };

    const tax = readPercent(taxText, "Tax");
    if (!tax.ok) return tax;
    const tip = readPercent(tipText, "Tip");
    if (!tip.ok) return tip;

    if (!Array.isArray(people) || people.length === 0) {
      return { ok: false, error: "Add at least one person." };
    }

    const cleaned = [];
    for (let i = 0; i < people.length; i++) {
      const person = people[i] || {};
      const name = person.name == null ? "" : String(person.name).trim();
      if (name === "") return { ok: false, error: "Every person needs a name." };
      const shares = readShares(person.shares);
      if (shares == null) {
        return { ok: false, error: "Shares must be a whole number of at least 1." };
      }
      cleaned.push({ name: name, shares: shares });
    }

    return {
      ok: true,
      subtotalCents: sub.cents,
      taxPercent: tax.percent,
      tipPercent: tip.percent,
      people: cleaned
    };
  }

  return {
    toCents: toCents,
    totalCents: totalCents,
    split: split,
    formatMoney: formatMoney,
    validate: validate
  };
});
