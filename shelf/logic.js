(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AppLogic = api;
})(typeof window !== "undefined" ? window : null, function () {
  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function ymd(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function parseLocal(iso) {
    var parts = iso.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function isISODate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    return ymd(parseLocal(value)) === value;
  }

  function todayISO(d = new Date()) {
    return ymd(d);
  }

  function addDays(iso, n) {
    var date = parseLocal(iso);
    date.setDate(date.getDate() + n);
    return ymd(date);
  }

  function effectiveDate(expiryISO, openedISO, daysAfterOpen) {
    if (openedISO && Number.isInteger(daysAfterOpen) && daysAfterOpen > 0) {
      var afterOpen = addDays(openedISO, daysAfterOpen);
      return afterOpen < expiryISO ? afterOpen : expiryISO;
    }
    return expiryISO;
  }

  function daysLeft(today, target) {
    var a = today.split("-");
    var b = target.split("-");
    var ms = Date.UTC(Number(b[0]), Number(b[1]) - 1, Number(b[2])) -
      Date.UTC(Number(a[0]), Number(a[1]) - 1, Number(a[2]));
    return Math.round(ms / 86400000);
  }

  function status(days) {
    if (days < 0) return "expired";
    if (days <= 7) return "soon";
    return "fresh";
  }

  function sortItems(items, today) {
    return items.slice().sort(function (a, b) {
      var da = daysLeft(today, effectiveDate(a.expiry, a.opened, a.daysAfterOpen));
      var db = daysLeft(today, effectiveDate(b.expiry, b.opened, b.daysAfterOpen));
      return da - db;
    });
  }

  function summarize(items, today) {
    var counts = { active: 0, expired: 0, soon: 0, used: 0, wasted: 0 };
    items.forEach(function (item) {
      if (item.state === "used") counts.used += 1;
      else if (item.state === "wasted") counts.wasted += 1;
      else if (item.state === "active") {
        counts.active += 1;
        var kind = status(daysLeft(today, effectiveDate(item.expiry, item.opened, item.daysAfterOpen)));
        if (kind === "expired" || kind === "soon") counts[kind] += 1;
      }
    });
    return counts;
  }

  function isBlank(value) {
    return value == null || value === "";
  }

  function validateItem(input) {
    if (!String(input.name == null ? "" : input.name).trim()) {
      return { ok: false, error: "Name is required." };
    }
    if (!isISODate(input.expiry)) {
      return { ok: false, error: "Expiry must be YYYY-MM-DD." };
    }
    if (!isBlank(input.opened) && !isISODate(input.opened)) {
      return { ok: false, error: "Opened must be empty or YYYY-MM-DD." };
    }
    var days = input.daysAfterOpen;
    if (!isBlank(days) && !(Number.isInteger(days) && days >= 1)) {
      return { ok: false, error: "Days after open must be an integer of 1 or more." };
    }
    var hasOpened = !isBlank(input.opened);
    var hasDays = !isBlank(days);
    if (hasDays && !hasOpened) {
      return { ok: false, error: "Opened date is required when days after open is set." };
    }
    if (hasOpened && !hasDays) {
      return { ok: false, error: "Days after open is required when an opened date is set." };
    }
    return { ok: true };
  }

  return {
    todayISO: todayISO,
    addDays: addDays,
    effectiveDate: effectiveDate,
    daysLeft: daysLeft,
    status: status,
    sortItems: sortItems,
    summarize: summarize,
    validateItem: validateItem
  };
});
