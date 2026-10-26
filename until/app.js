(function () {
  var KEY = "until-v1";
  var logic = window.AppLogic;
  var form = document.getElementById("add-form");
  var titleInput = document.getElementById("title");
  var whenInput = document.getElementById("when");
  var errorEl = document.getElementById("error");
  var listEl = document.getElementById("list");
  var emptyEl = document.getElementById("empty");
  var events = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter(function (e) {
        return e && typeof e.id === "string" && typeof e.title === "string" && typeof e.targetMs === "number" && isFinite(e.targetMs);
      });
    } catch (err) {
      return [];
    }
  }

  function save(next) {
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function showError(message) {
    if (!message) {
      errorEl.textContent = "";
      errorEl.hidden = true;
      return;
    }
    errorEl.hidden = false;
    errorEl.textContent = message;
  }

  function timeText(now, targetMs) {
    return logic.formatRemaining(logic.remaining(now, targetMs));
  }

  function renderList() {
    var now = Date.now();
    var sorted = logic.sortEvents(events, now);
    var key = sorted.map(function (e) { return e.id; }).join("|");
    emptyEl.hidden = sorted.length > 0;

    if (listEl.dataset.order === key && listEl.children.length === sorted.length) {
      var nodes = listEl.querySelectorAll(".time");
      for (var i = 0; i < sorted.length; i++) nodes[i].textContent = timeText(now, sorted[i].targetMs);
      return;
    }

    listEl.dataset.order = key;
    listEl.replaceChildren();
    for (var j = 0; j < sorted.length; j++) {
      var ev = sorted[j];
      var li = document.createElement("li");
      li.dataset.id = ev.id;

      var title = document.createElement("p");
      title.className = "title";
      title.textContent = ev.title;

      var time = document.createElement("p");
      time.className = "time";
      time.textContent = timeText(now, ev.targetMs);

      var del = document.createElement("button");
      del.type = "button";
      del.textContent = "Delete";
      del.setAttribute("aria-label", "Delete " + ev.title);

      li.append(title, time, del);
      listEl.append(li);
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var result = logic.validate(titleInput.value, whenInput.value, Date.now());
    if (!result.ok) {
      showError(result.error);
      return;
    }
    var next = events.concat([{
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      title: result.title,
      targetMs: result.targetMs
    }]);
    try {
      save(next);
    } catch (err) {
      showError("Could not save in this browser.");
      return;
    }
    events = next;
    showError("");
    form.reset();
    renderList();
  });

  listEl.addEventListener("click", function (event) {
    var btn = event.target.closest("button");
    if (!btn || !listEl.contains(btn)) return;
    var id = btn.closest("li").dataset.id;
    var next = events.filter(function (e) { return e.id !== id; });
    try {
      save(next);
    } catch (err) {
      showError("Could not save in this browser.");
      return;
    }
    events = next;
    renderList();
  });

  renderList();
  setInterval(renderList, 1000);
})();
