(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (typeof window !== "undefined") {
    window.AppLogic = api;
  } else if (root) {
    root.AppLogic = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function pickIndex(count, unit) {
    return Math.floor(unit * count);
  }

  function rotationFor(index, count, spins) {
    var sliceAngle = 360 / count;
    var target = 360 - (index + 0.5) * sliceAngle;
    return target + spins * 360;
  }

  function validateOption(name, existing) {
    var trimmed = String(name == null ? "" : name).trim();
    if (!trimmed) {
      return { ok: false, error: "Enter a name." };
    }
    if (trimmed.length > 40) {
      return { ok: false, error: "Use 40 characters or fewer." };
    }
    var lower = trimmed.toLowerCase();
    for (var i = 0; i < existing.length; i++) {
      if (String(existing[i]).toLowerCase() === lower) {
        return { ok: false, error: "That option is already on the wheel." };
      }
    }
    return { ok: true, name: trimmed };
  }

  function pushHistory(history, name, limit) {
    var cap = limit === undefined ? 10 : limit;
    return [name].concat(history).slice(0, cap);
  }

  return {
    pickIndex: pickIndex,
    rotationFor: rotationFor,
    validateOption: validateOption,
    pushHistory: pushHistory
  };
});
