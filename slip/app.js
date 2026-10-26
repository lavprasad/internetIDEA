(function () {
  "use strict";

  var KEY = "slip-v1";
  var L = window.AppLogic;
  var DASH = "\u2014";
  var linesEl = document.getElementById("lines");
  var errorEl = document.getElementById("error");

  function $(id) { return document.getElementById(id); }

  function today() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function cell(label, node) {
    var td = document.createElement("td");
    td.setAttribute("data-label", label);
    if (label !== "Description") td.className = "num";
    td.appendChild(node);
    return td;
  }

  function addLine(line) {
    var tr = document.createElement("tr");
    var desc = document.createElement("input");
    desc.type = "text";
    desc.setAttribute("data-desc", "");
    desc.setAttribute("aria-label", "Description");
    desc.autocomplete = "off";
    var qty = document.createElement("input");
    qty.type = "number";
    qty.min = "0";
    qty.step = "any";
    qty.inputMode = "decimal";
    qty.setAttribute("data-qty", "");
    qty.setAttribute("aria-label", "Quantity");
    var rate = document.createElement("input");
    rate.type = "number";
    rate.min = "0";
    rate.step = "0.01";
    rate.inputMode = "decimal";
    rate.setAttribute("data-rate", "");
    rate.setAttribute("aria-label", "Rate");
    var amount = document.createElement("td");
    amount.className = "num";
    amount.setAttribute("data-amount", "");
    amount.setAttribute("data-label", "Amount");
    amount.textContent = DASH;
    var removeTd = document.createElement("td");
    removeTd.className = "no-print";
    removeTd.setAttribute("data-label", "Remove");
    var remove = document.createElement("button");
    remove.type = "button";
    remove.setAttribute("data-remove", "");
    remove.textContent = "Remove";
    removeTd.appendChild(remove);
    if (line) {
      desc.value = line.desc || "";
      if (line.qty != null) qty.value = String(line.qty);
      if (line.rate != null && line.rate !== "") rate.value = String(line.rate);
    }
    tr.appendChild(cell("Description", desc));
    tr.appendChild(cell("Qty", qty));
    tr.appendChild(cell("Rate", rate));
    tr.appendChild(amount);
    tr.appendChild(removeTd);
    linesEl.appendChild(tr);
    syncRemove();
  }

  function syncRemove() {
    var buttons = linesEl.querySelectorAll("[data-remove]");
    var only = buttons.length <= 1;
    for (var i = 0; i < buttons.length; i++) buttons[i].disabled = only;
  }

  function readForm() {
    var rows = linesEl.querySelectorAll("tr");
    var lines = [];
    for (var i = 0; i < rows.length; i++) {
      lines.push({
        desc: rows[i].querySelector("[data-desc]").value,
        qty: rows[i].querySelector("[data-qty]").value,
        rate: rows[i].querySelector("[data-rate]").value
      });
    }
    return {
      from: $("from").value,
      to: $("to").value,
      number: $("number").value,
      date: $("date").value,
      taxPercent: $("tax").value,
      lines: lines
    };
  }

  function showMoney(id, cents) {
    $(id).textContent = cents == null ? DASH : L.formatMoney(cents);
  }

  function dashTotals() {
    var amounts = linesEl.querySelectorAll("[data-amount]");
    for (var i = 0; i < amounts.length; i++) amounts[i].textContent = DASH;
    showMoney("subtotal", null);
    showMoney("tax-amt", null);
    showMoney("total", null);
  }

  function renderTotals() {
    var result = L.validateDraft(readForm());
    if (!result.ok) {
      errorEl.textContent = result.error;
      dashTotals();
      return result;
    }
    errorEl.textContent = "";
    var priced = L.compute(result.draft.lines, result.draft.taxPercent);
    var amounts = linesEl.querySelectorAll("[data-amount]");
    for (var i = 0; i < priced.lines.length; i++) {
      amounts[i].textContent = L.formatMoney(priced.lines[i].lineTotal);
    }
    showMoney("subtotal", priced.subtotal);
    showMoney("tax-amt", priced.tax);
    showMoney("total", priced.total);
    return result;
  }

  function restore() {
    var data = null;
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) data = JSON.parse(raw);
    } catch (e) {
      data = null;
    }
    if (!data || typeof data !== "object") {
      $("date").value = today();
      $("tax").value = "0";
      addLine();
      return;
    }
    $("from").value = data.from || "";
    $("to").value = data.to || "";
    $("number").value = data.number || "";
    $("date").value = data.date || "";
    $("tax").value = data.taxPercent == null ? "" : String(data.taxPercent);
    var stored = Array.isArray(data.lines) && data.lines.length ? data.lines : [null];
    for (var i = 0; i < stored.length; i++) {
      var line = stored[i];
      addLine(line ? {
        desc: line.desc || "",
        qty: line.qty,
        rate: line.rateCents == null ? "" : (line.rateCents / 100).toFixed(2)
      } : null);
    }
  }

  document.getElementById("app").addEventListener("input", renderTotals);
  document.getElementById("app").addEventListener("change", renderTotals);
  document.getElementById("app").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-remove]");
    if (!btn || linesEl.children.length <= 1) return;
    btn.closest("tr").remove();
    syncRemove();
    renderTotals();
  });
  $("add").addEventListener("click", function () {
    addLine();
    renderTotals();
  });
  $("save").addEventListener("click", function () {
    var result = renderTotals();
    if (!result.ok) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(result.draft));
    } catch (e) {
      errorEl.textContent = "Could not save on this device.";
    }
  });
  $("print").addEventListener("click", function () {
    window.print();
  });

  restore();
  renderTotals();
})();
