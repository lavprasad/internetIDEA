(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.AppLogic = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var FACTORS = {
    length: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      in: 0.0254,
      ft: 0.3048,
      mi: 1609.344
    },
    mass: {
      kg: 1,
      g: 0.001,
      lb: 0.45359237,
      oz: 0.028349523125
    },
    volume: {
      L: 1,
      mL: 0.001,
      gal: 3.785411784,
      cup: 0.2365882365
    }
  };

  var TEMP = ["C", "F", "K"];
  var ABSOLUTE_ZERO = { C: -273.15, F: -459.67, K: 0 };
  var EPS = 1e-9;

  function units(category) {
    if (category === "temp") return TEMP.slice();
    var table = FACTORS[category];
    if (!table) throw new Error("Unknown category");
    return Object.keys(table);
  }

  function toC(value, from) {
    if (from === "C") return value;
    if (from === "F") return (value - 32) * 5 / 9;
    if (from === "K") return value - 273.15;
    throw new Error("Unknown unit");
  }

  function fromC(celsius, to) {
    if (to === "C") return celsius;
    if (to === "F") return celsius * 9 / 5 + 32;
    if (to === "K") return celsius + 273.15;
    throw new Error("Unknown unit");
  }

  function convert(category, value, from, to) {
    if (!Number.isFinite(value)) throw new Error("Value must be finite");
    if (category === "temp") return fromC(toC(value, from), to);
    var table = FACTORS[category];
    if (!table) throw new Error("Unknown category");
    if (!Object.prototype.hasOwnProperty.call(table, from) ||
        !Object.prototype.hasOwnProperty.call(table, to)) {
      throw new Error("Unknown unit");
    }
    return value * table[from] / table[to];
  }

  function absoluteZeroError(category, value, from) {
    if (category !== "temp" || !Number.isFinite(value)) return null;
    if (!Object.prototype.hasOwnProperty.call(ABSOLUTE_ZERO, from)) return null;
    if (value < ABSOLUTE_ZERO[from] - EPS) return "Below absolute zero";
    return null;
  }

  function formatResult(n) {
    if (!Number.isFinite(n)) return "";
    var abs = Math.abs(n);
    if (abs >= 1e9 || (abs > 0 && abs < 1e-6)) return n.toExponential(5);
    return n.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  }

  return {
    units: units,
    convert: convert,
    absoluteZeroError: absoluteZeroError,
    formatResult: formatResult
  };
});
