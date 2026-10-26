(function () {
  var logic = window.AppLogic;
  var storageKey = "shelf-v1";
  var categoryLabels = {
    food: "Food",
    medicine: "Medicine",
    document: "Document",
    household: "Household",
    other: "Other"
  };

  var form = document.getElementById("add-form");
  var errorEl = document.getElementById("form-error");
  var countsEl = document.getElementById("counts");
  var activeEl = document.getElementById("active-list");
  var emptyEl = document.getElementById("empty");
  var historyEl = document.getElementById("history-list");

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(storageKey, JSON.stringify(items));
    render(items);
  }

  function field(className, text) {
    var span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    return span;
  }

  function actionButton(label, id, action, name) {
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("data-id", id);
    button.setAttribute("data-action", action);
    button.setAttribute("aria-label", label + " " + name);
    return button;
  }

  function renderItem(item, today, withActions) {
    var li = document.createElement("li");
    li.className = "item";
    var effective = logic.effectiveDate(item.expiry, item.opened, item.daysAfterOpen);
    var left = logic.daysLeft(today, effective);
    var word = item.state === "active" ? logic.status(left) : item.state;
    var unit = left === 1 || left === -1 ? "day" : "days";

    li.appendChild(field("item-name", item.name));
    li.appendChild(field("item-category", categoryLabels[item.category] || item.category));
    li.appendChild(field("item-date", effective));
    li.appendChild(field("item-days", left + " " + unit + " left"));
    var statusEl = field("item-status status-" + word, word);
    li.appendChild(statusEl);

    if (withActions) {
      var actions = document.createElement("div");
      actions.className = "actions";
      actions.appendChild(actionButton("Used", item.id, "used", item.name));
      actions.appendChild(actionButton("Wasted", item.id, "wasted", item.name));
      actions.appendChild(actionButton("Delete", item.id, "delete", item.name));
      li.appendChild(actions);
    }
    return li;
  }

  function render(items) {
    var today = logic.todayISO();
    var summary = logic.summarize(items, today);
    countsEl.textContent = "";
    ["active", "expired", "soon", "used", "wasted"].forEach(function (key) {
      var li = document.createElement("li");
      li.textContent = key + " " + summary[key];
      countsEl.appendChild(li);
    });

    var active = logic.sortItems(items.filter(function (item) {
      return item.state === "active";
    }), today);
    activeEl.textContent = "";
    emptyEl.hidden = active.length > 0;
    active.forEach(function (item) {
      activeEl.appendChild(renderItem(item, today, true));
    });

    historyEl.textContent = "";
    items.forEach(function (item) {
      if (item.state === "used" || item.state === "wasted") {
        historyEl.appendChild(renderItem(item, today, false));
      }
    });
  }

  function change(id, action) {
    var items = load();
    if (action === "delete") {
      save(items.filter(function (item) { return item.id !== id; }));
      return;
    }
    items.forEach(function (item) {
      if (item.id === id) item.state = action;
    });
    save(items);
  }

  activeEl.addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button) return;
    change(button.getAttribute("data-id"), button.getAttribute("data-action"));
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = document.getElementById("name").value;
    var category = document.getElementById("category").value;
    var expiry = document.getElementById("expiry").value;
    var opened = document.getElementById("opened").value;
    var daysRaw = document.getElementById("days-after-open").value.trim();
    var daysAfterOpen = daysRaw === "" ? null : Number(daysRaw);
    var result = logic.validateItem({
      name: name,
      expiry: expiry,
      opened: opened,
      daysAfterOpen: daysAfterOpen
    });
    if (!result.ok) {
      errorEl.textContent = result.error;
      return;
    }
    errorEl.textContent = "";
    var items = load();
    items.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      name: name.trim(),
      category: category,
      expiry: expiry,
      opened: opened === "" ? null : opened,
      daysAfterOpen: daysAfterOpen,
      state: "active"
    });
    save(items);
    form.reset();
    document.getElementById("name").focus();
  });

  render(load());
})();
