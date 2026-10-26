(function () {
  "use strict";

  var KEY = "wheel-v1";
  var logic = window.AppLogic;
  var options = ["Yes", "No", "Maybe"];
  var history = [];
  var rotation = 0;
  var spinning = false;
  var pendingName = "";

  var canvas = document.getElementById("wheel");
  var ctx = canvas.getContext("2d");
  var resultEl = document.getElementById("result");
  var errorEl = document.getElementById("error");
  var listEl = document.getElementById("option-list");
  var historyEl = document.getElementById("history");
  var emptyEl = document.getElementById("history-empty");
  var form = document.getElementById("add-form");
  var input = document.getElementById("option-name");
  var spinBtn = document.getElementById("spin");

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (!data || !Array.isArray(data.options) || !Array.isArray(data.history)) return;
      options = data.options.filter(function (name) { return typeof name === "string"; });
      history = data.history.filter(function (name) { return typeof name === "string"; }).slice(0, 10);
    } catch (err) {
      options = ["Yes", "No", "Maybe"];
      history = [];
    }
  }

  function persist() {
    localStorage.setItem(KEY, JSON.stringify({ options: options, history: history }));
  }

  function setError(message) {
    errorEl.textContent = message || "";
  }

  function draw() {
    var count = options.length;
    var w = canvas.width;
    var h = canvas.height;
    var cx = w / 2;
    var cy = h / 2;
    var radius = Math.min(cx, cy) - 2;
    var colors = ["#ffb703", "#8ecae6"];

    ctx.clearRect(0, 0, w, h);
    if (!count) return;

    for (var i = 0; i < count; i++) {
      // Start at the top (−π/2) and go clockwise, so rotationFor puts the slice center under the pointer.
      var start = (i / count) * Math.PI * 2 - Math.PI / 2;
      var end = ((i + 1) / count) * Math.PI * 2 - Math.PI / 2;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = colors[i % 2];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#1b1030";
      ctx.stroke();

      var mid = start + (end - start) / 2;
      ctx.save();
      ctx.translate(cx, cy);
      // Tangent labels: extra quarter-turn so the name is upright once this slice sits under the pointer.
      ctx.rotate(mid + Math.PI / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#1b1030";
      var size = 22;
      ctx.font = "700 " + size + "px system-ui, Segoe UI, sans-serif";
      var label = options[i];
      var maxWidth = radius * 0.5;
      while (size > 12 && ctx.measureText(label).width > maxWidth) {
        size -= 1;
        ctx.font = "700 " + size + "px system-ui, Segoe UI, sans-serif";
      }
      ctx.fillText(label, 0, -radius * 0.64);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(14, radius * 0.07), 0, Math.PI * 2);
    ctx.fillStyle = "#1b1030";
    ctx.fill();
  }

  function renderOptions() {
    listEl.replaceChildren();
    options.forEach(function (name, index) {
      var li = document.createElement("li");
      var span = document.createElement("span");
      span.textContent = name;
      var button = document.createElement("button");
      button.type = "button";
      button.className = "remove";
      button.textContent = "Remove";
      button.setAttribute("aria-label", "Remove " + name);
      button.addEventListener("click", function () {
        removeAt(index);
      });
      li.appendChild(span);
      li.appendChild(button);
      listEl.appendChild(li);
    });
  }

  function renderHistory() {
    historyEl.replaceChildren();
    if (!history.length) {
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    history.forEach(function (name) {
      var li = document.createElement("li");
      li.textContent = name;
      historyEl.appendChild(li);
    });
  }

  function removeAt(index) {
    if (spinning) {
      setError("Wait until the wheel stops.");
      return;
    }
    options.splice(index, 1);
    setError("");
    persist();
    renderOptions();
    draw();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (spinning) {
      setError("Wait until the wheel stops.");
      return;
    }
    var result = logic.validateOption(input.value, options);
    if (!result.ok) {
      setError(result.error);
      input.focus();
      return;
    }
    options.push(result.name);
    input.value = "";
    setError("");
    persist();
    renderOptions();
    draw();
  });

  function spin() {
    if (spinning) return;
    if (options.length < 2) {
      setError("Add at least 2 options before spinning.");
      return;
    }
    setError("");
    var buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    var unit = buf[0] / 4294967296;
    var index = logic.pickIndex(options.length, unit);
    var absolute = logic.rotationFor(index, options.length, 5);
    pendingName = options[index];
    spinning = true;

    var normalized = ((rotation % 360) + 360) % 360;
    canvas.style.transition = "none";
    canvas.style.transform = "rotate(" + normalized + "deg)";
    void canvas.offsetWidth;
    canvas.style.transition = "transform 3s ease-out";
    canvas.style.transform = "rotate(" + absolute + "deg)";
    rotation = absolute;
  }

  canvas.addEventListener("transitionend", function (event) {
    if (event.propertyName !== "transform" || !spinning) return;
    spinning = false;
    canvas.style.transform = "rotate(" + rotation + "deg)";
    resultEl.textContent = "Result: " + pendingName;
    history = logic.pushHistory(history, pendingName);
    persist();
    renderHistory();
  });

  spinBtn.addEventListener("click", spin);

  load();
  renderOptions();
  renderHistory();
  draw();
})();
