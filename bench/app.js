(function () {
  "use strict";

  var logic = window.AppLogic;
  var categoryEl = document.getElementById("category");
  var fromEl = document.getElementById("from");
  var toEl = document.getElementById("to");
  var valueEl = document.getElementById("value");
  var outputEl = document.getElementById("output");
  var errorEl = document.getElementById("error");
  var lastResult = null;

  function fillSelect(select, unitNames) {
    select.replaceChildren();
    for (var i = 0; i < unitNames.length; i++) {
      var option = document.createElement("option");
      option.value = unitNames[i];
      option.textContent = unitNames[i];
      select.appendChild(option);
    }
  }

  function fillUnits() {
    var unitNames = logic.units(categoryEl.value);
    fillSelect(fromEl, unitNames);
    fillSelect(toEl, unitNames);
    fromEl.value = unitNames[0];
    toEl.value = unitNames[1] || unitNames[0];
  }

  function show(text, error) {
    outputEl.textContent = text;
    errorEl.textContent = error;
  }

  function render() {
    if (valueEl.validity && valueEl.validity.badInput) {
      lastResult = null;
      show("", "Enter a valid number");
      return;
    }
    var raw = valueEl.value.trim();
    if (raw === "") {
      lastResult = null;
      show("", "");
      return;
    }
    var value = Number(raw);
    if (!Number.isFinite(value)) {
      lastResult = null;
      show("", "Enter a valid number");
      return;
    }
    var below = logic.absoluteZeroError(categoryEl.value, value, fromEl.value);
    if (below) {
      lastResult = null;
      show("", below);
      return;
    }
    var result = logic.convert(categoryEl.value, value, fromEl.value, toEl.value);
    lastResult = result;
    show(logic.formatResult(result), "");
  }

  function swap() {
    var from = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value = from;
    if (Number.isFinite(lastResult)) valueEl.value = logic.formatResult(lastResult);
    render();
  }

  categoryEl.addEventListener("change", function () {
    fillUnits();
    render();
  });
  fromEl.addEventListener("change", render);
  toEl.addEventListener("change", render);
  valueEl.addEventListener("input", render);
  document.getElementById("swap").addEventListener("click", swap);

  fillUnits();
  render();
})();
