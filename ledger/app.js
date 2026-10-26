(function () {
  var L = window.AppLogic;
  var KEY = "ledger-v1";
  var LABELS = { food: "Food", transport: "Transport", home: "Home", health: "Health", other: "Other" };

  var form = document.getElementById("entry-form");
  var amountInput = document.getElementById("amount");
  var categoryInput = document.getElementById("category");
  var dateInput = document.getElementById("date");
  var noteInput = document.getElementById("note");
  var errorEl = document.getElementById("form-error");
  var monthInput = document.getElementById("month");
  var totalEl = document.getElementById("total");
  var breakdownEl = document.getElementById("breakdown");
  var listEl = document.getElementById("list");
  var exportBtn = document.getElementById("export");

  function todayISO() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function money(cents) {
    return "$" + (cents / 100).toFixed(2);
  }

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
  }

  function rowsFor(items, month) {
    if (!/^\d{4}-\d{2}$/.test(month)) return [];
    return L.filterMonth(items, month)
      .map(function (item, index) { return { item: item, index: index }; })
      .sort(function (a, b) {
        if (a.item.date === b.item.date) return a.index - b.index;
        return a.item.date < b.item.date ? 1 : -1;
      })
      .map(function (entry) { return entry.item; });
  }

  function render() {
    var rows = rowsFor(load(), monthInput.value);
    var groups = L.byCategory(rows);
    totalEl.textContent = money(L.totalCents(rows));
    breakdownEl.textContent = "";
    Object.keys(groups).forEach(function (cat) {
      var li = document.createElement("li");
      li.textContent = (LABELS[cat] || cat) + " " + money(groups[cat]);
      breakdownEl.appendChild(li);
    });
    listEl.textContent = "";
    if (!rows.length) {
      var empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No expenses this month.";
      listEl.appendChild(empty);
      return;
    }
    rows.forEach(function (item) {
      var row = document.createElement("article");
      row.className = "row";
      var body = document.createElement("div");
      var title = document.createElement("strong");
      title.textContent = money(item.cents);
      var meta = document.createElement("span");
      meta.textContent = item.date + " · " + (LABELS[item.category] || item.category) + (item.note ? " · " + item.note : "");
      body.appendChild(title);
      body.appendChild(meta);
      var del = document.createElement("button");
      del.type = "button";
      del.textContent = "Delete";
      del.addEventListener("click", function () {
        save(load().filter(function (x) { return x.id !== item.id; }));
        render();
      });
      row.appendChild(body);
      row.appendChild(del);
      listEl.appendChild(row);
    });
  }

  dateInput.value = todayISO();
  monthInput.value = L.currentMonth();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var note = noteInput.value;
    var result = L.validate(amountInput.value, categoryInput.value, dateInput.value, note);
    if (!result.ok) {
      errorEl.textContent = result.error;
      return;
    }
    errorEl.textContent = "";
    var items = load();
    items.push({
      id: Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10),
      date: dateInput.value,
      category: categoryInput.value,
      note: note,
      cents: result.cents
    });
    try {
      save(items);
    } catch (err) {
      errorEl.textContent = "Could not save on this device.";
      return;
    }
    amountInput.value = "";
    noteInput.value = "";
    monthInput.value = L.monthKey(dateInput.value);
    render();
  });

  monthInput.addEventListener("change", function () {
    errorEl.textContent = "";
    render();
  });

  exportBtn.addEventListener("click", function () {
    var month = monthInput.value;
    var csv = L.toCSV(rowsFor(load(), month));
    var blob = new Blob([csv], { type: "text/csv" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "expenses-" + month + ".csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  render();
})();
