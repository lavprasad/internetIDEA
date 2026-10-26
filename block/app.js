(function () {
  'use strict';

  var L = window.AppLogic;
  var KEY = 'block-v1';
  var NEXT = { focus: 'focus', short: 'short break', long: 'long break' };

  var mode = 'focus';
  var selectedSec = L.PRESETS.focus;
  var state = { remainingSec: selectedSec, running: false, completed: 0 };
  var intervalId = null;
  var log = loadLog();

  var elTime = document.getElementById('time');
  var elStart = document.getElementById('start');
  var elReset = document.getElementById('reset');
  var elMinutes = document.getElementById('minutes');
  var elApply = document.getElementById('apply');
  var elError = document.getElementById('error');
  var elSuggestion = document.getElementById('suggestion');
  var elClear = document.getElementById('clear');
  var elForm = document.getElementById('custom-form');
  var elMode = {
    focus: document.getElementById('mode-focus'),
    short: document.getElementById('mode-short'),
    long: document.getElementById('mode-long')
  };
  var elCount = {
    focus: document.getElementById('count-focus'),
    short: document.getElementById('count-short'),
    long: document.getElementById('count-long')
  };

  function loadLog() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY));
      if (data && typeof data.focus === 'number' && typeof data.short === 'number' && typeof data.long === 'number') {
        return { focus: data.focus, short: data.short, long: data.long };
      }
    } catch (e) {
      /* keep zeros */
    }
    return { focus: 0, short: 0, long: 0 };
  }

  function saveLog() {
    localStorage.setItem(KEY, JSON.stringify({
      focus: log.focus,
      short: log.short,
      long: log.long
    }));
  }

  function stopInterval() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function startInterval() {
    stopInterval();
    intervalId = setInterval(onTick, 1000);
  }

  function render() {
    elTime.textContent = L.format(state.remainingSec);
    elStart.textContent = state.running ? 'Pause' : 'Start';
    elStart.setAttribute('aria-pressed', state.running ? 'true' : 'false');
    elCount.focus.textContent = String(log.focus);
    elCount.short.textContent = String(log.short);
    elCount.long.textContent = String(log.long);
    elMode.focus.setAttribute('aria-pressed', mode === 'focus' ? 'true' : 'false');
    elMode.short.setAttribute('aria-pressed', mode === 'short' ? 'true' : 'false');
    elMode.long.setAttribute('aria-pressed', mode === 'long' ? 'true' : 'false');
  }

  function clearSuggestion() {
    elSuggestion.textContent = '';
  }

  function onTick() {
    state = L.tick(state);
    if (state.finished) {
      stopInterval();
      log[mode] += 1;
      saveLog();
      elSuggestion.textContent = 'Suggested next: ' + NEXT[L.suggestNext(mode, log.focus)];
    }
    render();
  }

  function pause() {
    stopInterval();
    state = {
      remainingSec: state.remainingSec,
      running: false,
      completed: state.completed
    };
    render();
  }

  function start() {
    var remaining = state.remainingSec <= 0 ? selectedSec : state.remainingSec;
    state = { remainingSec: remaining, running: true, completed: state.completed };
    clearSuggestion();
    startInterval();
    render();
  }

  function selectMode(next) {
    stopInterval();
    mode = next;
    selectedSec = L.PRESETS[next];
    state = {
      remainingSec: selectedSec,
      running: false,
      completed: state.completed
    };
    elError.textContent = '';
    clearSuggestion();
    render();
  }

  function applyCustom() {
    var parsed = L.parseMinutes(elMinutes.value);
    if (!parsed.ok) {
      elError.textContent = parsed.error;
      return;
    }
    stopInterval();
    selectedSec = parsed.seconds;
    state = {
      remainingSec: selectedSec,
      running: false,
      completed: state.completed
    };
    elError.textContent = '';
    clearSuggestion();
    render();
  }

  elStart.addEventListener('click', function () {
    if (state.running) pause();
    else start();
  });

  elReset.addEventListener('click', function () {
    stopInterval();
    state = {
      remainingSec: selectedSec,
      running: false,
      completed: state.completed
    };
    clearSuggestion();
    render();
  });

  elMode.focus.addEventListener('click', function () { selectMode('focus'); });
  elMode.short.addEventListener('click', function () { selectMode('short'); });
  elMode.long.addEventListener('click', function () { selectMode('long'); });

  elApply.addEventListener('click', applyCustom);
  elForm.addEventListener('submit', function (event) {
    event.preventDefault();
    applyCustom();
  });

  elClear.addEventListener('click', function () {
    log = { focus: 0, short: 0, long: 0 };
    saveLog();
    render();
  });

  render();
})();
