(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (typeof root !== "undefined") root.AppLogic = api;
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this, function () {
  function remaining(nowMs, targetMs) {
    var delta = targetMs - nowMs;
    var past = delta < 0;
    var abs = Math.abs(delta);
    var totalSec = Math.floor(abs / 1000);
    var days = Math.floor(totalSec / 86400);
    var hours = Math.floor((totalSec % 86400) / 3600);
    var minutes = Math.floor((totalSec % 3600) / 60);
    var seconds = totalSec % 60;
    return { past: past, days: days, hours: hours, minutes: minutes, seconds: seconds };
  }

  function formatRemaining(parts) {
    var text = parts.days + "d " + parts.hours + "h " + parts.minutes + "m " + parts.seconds + "s";
    if (!parts.past) return text;
    return text + " ago";
  }

  function sortEvents(events, nowMs) {
    var future = [];
    var past = [];
    for (var i = 0; i < events.length; i++) {
      if (events[i].targetMs >= nowMs) future.push(events[i]);
      else past.push(events[i]);
    }
    future.sort(function (a, b) { return a.targetMs - b.targetMs; });
    past.sort(function (a, b) { return b.targetMs - a.targetMs; });
    return future.concat(past);
  }

  function validate(title, localValue, nowMs) {
    var clean = String(title == null ? "" : title).trim();
    if (!clean) return { ok: false, error: "Enter a title." };
    if (clean.length > 60) return { ok: false, error: "Title must be 60 characters or fewer." };
    void nowMs;
    var match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(localValue);
    if (!match) return { ok: false, error: "Enter a valid date and time." };
    var year = +match[1];
    var month = +match[2];
    var day = +match[3];
    var hour = +match[4];
    var minute = +match[5];
    var date = new Date(year, month - 1, day, hour, minute, 0, 0);
    if (
      month < 1 || month > 12 || hour > 23 || minute > 59 ||
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day ||
      date.getHours() !== hour ||
      date.getMinutes() !== minute
    ) {
      return { ok: false, error: "Enter a valid date and time." };
    }
    return { ok: true, title: clean, targetMs: date.getTime() };
  }

  return {
    remaining: remaining,
    formatRemaining: formatRemaining,
    sortEvents: sortEvents,
    validate: validate
  };
});
