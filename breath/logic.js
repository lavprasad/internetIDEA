(function (factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (typeof window !== "undefined") {
    window.AppLogic = api;
  }
})(function () {
  function phasesFrom(inhale, hold1, exhale, hold2) {
    var steps = [
      ["Inhale", inhale],
      ["Hold", hold1],
      ["Exhale", exhale],
      ["Hold", hold2]
    ];
    var phases = [];
    for (var i = 0; i < steps.length; i++) {
      if (steps[i][1] > 0) {
        phases.push({ name: steps[i][0], seconds: steps[i][1] });
      }
    }
    return phases;
  }

  function advance(phaseIndex, secondsLeft, phases) {
    if (!phases || phases.length === 0) {
      throw new Error("No phases");
    }
    if (secondsLeft > 1) {
      return {
        phaseIndex: phaseIndex,
        secondsLeft: secondsLeft - 1,
        cycleDone: false
      };
    }
    var next = (phaseIndex + 1) % phases.length;
    return {
      phaseIndex: next,
      secondsLeft: phases[next].seconds,
      cycleDone: next === 0
    };
  }

  function validatePhase(text) {
    var raw = text == null ? "" : String(text).trim();
    if (!/^(?:0|[1-9]\d?)$/.test(raw) || Number(raw) > 30) {
      return { ok: false, error: "Enter a whole number from 0 to 30." };
    }
    return { ok: true, value: Number(raw) };
  }

  return {
    phasesFrom: phasesFrom,
    advance: advance,
    validatePhase: validatePhase
  };
});
