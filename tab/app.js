(function () {
  "use strict";

  const L = window.AppLogic;
  const KEY = "tab-v1";
  const bill = document.getElementById("bill");
  const peopleEl = document.getElementById("people");
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const tipEl = document.getElementById("tip");
  const errorEl = document.getElementById("error");
  const resultEl = document.getElementById("result");
  const breakdownEl = document.getElementById("breakdown");
  const eachEl = document.getElementById("each");

  const defaults = {
    subtotal: "",
    tax: "0",
    tip: "0",
    people: [
      { name: "You", shares: "1" },
      { name: "Friend", shares: "1" }
    ]
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.people) || data.people.length < 1) return null;
      return {
        subtotal: data.subtotal == null ? "" : String(data.subtotal),
        tax: data.tax == null ? "0" : String(data.tax),
        tip: data.tip == null ? "0" : String(data.tip),
        people: data.people.map((person) => ({
          name: person && person.name != null ? String(person.name) : "",
          shares: person && person.shares != null ? String(person.shares) : "1"
        }))
      };
    } catch (err) {
      return null;
    }
  }

  function readForm() {
    const people = [];
    const rows = peopleEl.querySelectorAll(".person");
    for (let i = 0; i < rows.length; i++) {
      people.push({
        name: rows[i].querySelector(".name").value,
        shares: rows[i].querySelector(".shares").value
      });
    }
    return {
      subtotal: subtotalEl.value,
      tax: taxEl.value,
      tip: tipEl.value,
      people: people
    };
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(readForm()));
    } catch (err) {
      /* storage unavailable; the calculator still works */
    }
  }

  function addPerson(person) {
    const row = document.createElement("div");
    row.className = "person";

    const nameLabel = document.createElement("label");
    const nameSpan = document.createElement("span");
    nameSpan.textContent = "Name";
    const nameInput = document.createElement("input");
    nameInput.className = "name";
    nameInput.type = "text";
    nameInput.autocomplete = "off";
    nameInput.value = person.name;
    nameLabel.append(nameSpan, nameInput);

    const sharesLabel = document.createElement("label");
    const sharesSpan = document.createElement("span");
    sharesSpan.textContent = "Shares";
    const sharesInput = document.createElement("input");
    sharesInput.className = "shares";
    sharesInput.type = "text";
    sharesInput.inputMode = "numeric";
    sharesInput.autocomplete = "off";
    sharesInput.value = person.shares;
    sharesLabel.append(sharesSpan, sharesInput);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.textContent = "Remove";

    row.append(nameLabel, sharesLabel, remove);
    peopleEl.append(row);
  }

  function syncRemove() {
    const buttons = peopleEl.querySelectorAll(".remove");
    const only = buttons.length < 2;
    for (let i = 0; i < buttons.length; i++) buttons[i].disabled = only;
  }

  function show(state) {
    subtotalEl.value = state.subtotal;
    taxEl.value = state.tax;
    tipEl.value = state.tip;
    peopleEl.replaceChildren();
    state.people.forEach(addPerson);
    syncRemove();
  }

  function line(label, cents, total) {
    const row = document.createElement("div");
    row.className = total ? "line total" : "line";
    const name = document.createElement("span");
    name.textContent = label;
    const money = document.createElement("span");
    money.textContent = L.formatMoney(cents);
    row.append(name, money);
    return row;
  }

  function renderResult(data) {
    const taxed = Math.round(data.subtotalCents * (1 + data.taxPercent / 100));
    const total = L.totalCents(data.subtotalCents, data.taxPercent, data.tipPercent);
    const parts = L.split(total, data.people.map((person) => person.shares));

    breakdownEl.replaceChildren(
      line("Subtotal", data.subtotalCents),
      line("Tax", taxed - data.subtotalCents),
      line("Tip", total - taxed),
      line("Total", total, true)
    );
    eachEl.replaceChildren();
    data.people.forEach((person, index) => {
      eachEl.append(line(person.name, parts[index]));
    });
    resultEl.hidden = false;
  }

  document.getElementById("add").addEventListener("click", () => {
    addPerson({ name: "", shares: "1" });
    syncRemove();
    save();
    const names = peopleEl.querySelectorAll(".name");
    names[names.length - 1].focus();
  });

  peopleEl.addEventListener("click", (event) => {
    const button = event.target.closest(".remove");
    if (!button || peopleEl.querySelectorAll(".person").length < 2) return;
    button.closest(".person").remove();
    syncRemove();
    save();
  });

  bill.addEventListener("input", save);

  bill.addEventListener("submit", (event) => {
    event.preventDefault();
    save();
    const form = readForm();
    const checked = L.validate(form.subtotal, form.tax, form.tip, form.people);
    if (!checked.ok) {
      errorEl.textContent = checked.error;
      errorEl.hidden = false;
      return;
    }
    errorEl.textContent = "";
    errorEl.hidden = true;
    renderResult(checked);
  });

  show(loadState() || defaults);
})();
