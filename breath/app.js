(function () {
  var logic = window.AppLogic;
  var inhale = document.getElementById("inhale");
  var hold1 = document.getElementById("hold1");
  var exhale = document.getElementById("exhale");
  var hold2 = document.getElementById("hold2");
  var phaseEl = document.getElementById("phase");
  var secondsEl = document.getElementById("seconds");
  var cyclesEl = document.getElementById("cycles");
  var errorEl = document.getElementById("error");
  var inputs = [inhale, hold1, exhale, hold2];
  var timer = null;
  var running = false;
  var phases = [];
  var phaseIndex = 0;
  var secondsLeft = 0;
  var cycles = 0;

  function showReady() {
    phaseEl.textContent = "Ready";
    secondsEl.textContent = "\u2013";
  }

  function showPhase() {
    phaseEl.textContent = phases[phaseIndex].name;
    secondsEl.textContent = String(secondsLeft);
    cyclesEl.textContent = String(cycles);
  }

  function stop() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    running = false;
    phases = [];
    cycles = 0;
    cyclesEl.textContent = "0";
    showReady();
  }

  function start() {
    var labels = ["Inhale", "Hold after inhale", "Exhale", "Hold after exhale"];
    var values = [];
    for (var i = 0; i < inputs.length; i++) {
      var parsed = logic.validatePhase(inputs[i].value);
      if (!parsed.ok) {
        errorEl.textContent = labels[i] + ": " + parsed.error;
        return;
      }
      values.push(parsed.value);
    }
    var nextPhases = logic.phasesFrom(values[0], values[1], values[2], values[3]);
    if (nextPhases.length === 0) {
      errorEl.textContent = "Set at least one phase above 0 seconds.";
      return;
    }
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    errorEl.textContent = "";
    phases = nextPhases;
    phaseIndex = 0;
    secondsLeft = phases[0].seconds;
    cycles = 0;
    running = true;
    showPhase();
    timer = setInterval(function () {
      var next = logic.advance(phaseIndex, secondsLeft, phases);
      phaseIndex = next.phaseIndex;
      secondsLeft = next.secondsLeft;
      if (next.cycleDone) cycles += 1;
      showPhase();
    }, 1000);
  }

  function onInput() {
    if (running) stop();
  }

  function applyPreset(a, b, c, d) {
    if (running) stop();
    inhale.value = String(a);
    hold1.value = String(b);
    exhale.value = String(c);
    hold2.value = String(d);
    errorEl.textContent = "";
  }

  document.getElementById("start").addEventListener("click", start);
  document.getElementById("stop").addEventListener("click", stop);
  document.getElementById("box").addEventListener("click", function () {
    applyPreset(4, 4, 4, 4);
  });
  document.getElementById("relax").addEventListener("click", function () {
    applyPreset(4, 7, 8, 0);
  });
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", onInput);
  }
})();
