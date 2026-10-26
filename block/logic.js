(function (factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.AppLogic = api;
  }
})(function () {
  'use strict';

  var PRESETS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };

  function format(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function parseMinutes(text) {
    var raw = String(text).trim();
    if (!/^\d+$/.test(raw)) {
      return { ok: false, error: 'Enter a whole number of minutes from 1 to 120.' };
    }
    var minutes = Number(raw);
    if (minutes < 1 || minutes > 120) {
      return { ok: false, error: 'Enter a whole number of minutes from 1 to 120.' };
    }
    return { ok: true, seconds: minutes * 60 };
  }

  function tick(state) {
    if (!state.running) {
      return {
        remainingSec: state.remainingSec,
        running: state.running,
        completed: state.completed
      };
    }
    if (state.remainingSec <= 1) {
      return {
        remainingSec: 0,
        running: false,
        completed: state.completed + 1,
        finished: true
      };
    }
    return {
      remainingSec: state.remainingSec - 1,
      running: true,
      completed: state.completed,
      finished: false
    };
  }

  function suggestNext(mode, focusCompleted) {
    if (mode === 'focus') {
      return focusCompleted % 4 === 0 ? 'long' : 'short';
    }
    return 'focus';
  }

  return {
    PRESETS: PRESETS,
    format: format,
    parseMinutes: parseMinutes,
    tick: tick,
    suggestNext: suggestNext
  };
});
