"use strict";

(function () {
  var KEY = "streak-v1";
  var logic = window.AppLogic;
  var form = document.getElementById("add-form");
  var input = document.getElementById("habit-name");
  var errorEl = document.getElementById("error");
  var emptyEl = document.getElementById("empty");
  var listEl = document.getElementById("habits");

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (!Array.isArray(data)) return [];
      var seen = {};
      return data.filter(function (h) {
        if (!h || typeof h.id !== "string" || typeof h.name !== "string" || !Array.isArray(h.dates)) return false;
        if (seen[h.id]) return false;
        seen[h.id] = true;
        return true;
      });
    } catch (e) {
      return [];
    }
  }

  function save(habits) {
    try {
      localStorage.setItem(KEY, JSON.stringify(habits));
      return true;
    } catch (e) {
      showError("Could not save. Storage is unavailable.");
      return false;
    }
  }

  function newId(habits) {
    var used = {};
    habits.forEach(function (h) { used[h.id] = true; });
    var id;
    do {
      id = String(Date.now()) + Math.random().toString(36).slice(2);
    } while (used[id]);
    return id;
  }

  function showError(msg) {
    errorEl.textContent = msg || "";
  }

  function updateDates(id, iso) {
    var habits = load().map(function (h) {
      if (h.id !== id) return h;
      return { id: h.id, name: h.name, dates: logic.toggleDay(h.dates, iso) };
    });
    if (save(habits)) render();
  }

  function render() {
    var habits = load();
    var today = logic.todayISO();
    emptyEl.hidden = habits.length > 0;
    listEl.replaceChildren();

    habits.forEach(function (habit) {
      var count = logic.streak(habit.dates, today);
      var item = document.createElement("li");
      item.className = "card";

      var name = document.createElement("h2");
      name.textContent = habit.name;

      var streakEl = document.createElement("p");
      streakEl.className = "streak";
      var num = document.createElement("span");
      num.textContent = String(count);
      streakEl.append(num, document.createTextNode(" day streak"));

      var actions = document.createElement("div");
      actions.className = "actions";

      var done = document.createElement("button");
      done.type = "button";
      done.textContent = "Done today";
      done.setAttribute("aria-pressed", habit.dates.indexOf(today) !== -1 ? "true" : "false");
      done.addEventListener("click", function () { updateDates(habit.id, today); });

      var del = document.createElement("button");
      del.type = "button";
      del.textContent = "Delete";
      del.addEventListener("click", function () {
        if (save(load().filter(function (h) { return h.id !== habit.id; }))) render();
      });

      actions.append(done, del);

      var days = document.createElement("div");
      days.className = "days";
      logic.lastNDays(today, 28).forEach(function (iso) {
        var filled = habit.dates.indexOf(iso) !== -1;
        var cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell" + (filled ? " filled" : "") + (iso === today ? " today" : "");
        cell.dataset.date = iso;
        cell.setAttribute("aria-pressed", filled ? "true" : "false");
        cell.setAttribute("aria-label", iso);
        cell.addEventListener("click", function () { updateDates(habit.id, cell.dataset.date); });
        days.append(cell);
      });

      item.append(name, streakEl, actions, days);
      listEl.append(item);
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var result = logic.validateName(input.value);
    if (!result.ok) {
      showError(result.error);
      input.focus();
      return;
    }
    showError("");
    var habits = load();
    habits.push({ id: newId(habits), name: input.value.trim(), dates: [] });
    if (!save(habits)) return;
    input.value = "";
    render();
  });

  render();
})();
