(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (typeof root !== "undefined") root.AptitudeLogic = api;
})(typeof window !== "undefined" ? window : this, function () {
  function emptyProgress() {
    return { attempts: [] };
  }

  function record(progress, attempt) {
    var prev = progress && Array.isArray(progress.attempts) ? progress.attempts : [];
    return {
      attempts: prev.concat([{
        id: attempt.id,
        chapter: attempt.chapter,
        skill: attempt.skill,
        correct: !!attempt.correct
      }])
    };
  }

  function skillStats(attempts) {
    var map = {};
    (attempts || []).forEach(function (a) {
      if (!map[a.skill]) map[a.skill] = { skill: a.skill, chapter: a.chapter, attempts: 0, correct: 0, wrong: 0 };
      var row = map[a.skill];
      row.attempts += 1;
      if (a.correct) row.correct += 1;
      else row.wrong += 1;
      row.failRate = row.wrong / row.attempts;
    });
    return map;
  }

  function weakSkills(attempts) {
    return Object.keys(skillStats(attempts)).map(function (key) {
      return skillStats(attempts)[key];
    }).filter(function (row) {
      return row.wrong > 0;
    }).sort(function (a, b) {
      if (b.wrong !== a.wrong) return b.wrong - a.wrong;
      if (b.failRate !== a.failRate) return b.failRate - a.failRate;
      return a.skill < b.skill ? -1 : 1;
    });
  }

  function chapterReport(questions, attempts, chapterId) {
    var qs = (questions || []).filter(function (q) { return q.chapter === chapterId; });
    var att = (attempts || []).filter(function (a) { return a.chapter === chapterId; });
    var tried = {};
    att.forEach(function (a) { tried[a.id] = true; });
    var correct = att.filter(function (a) { return a.correct; }).length;
    return {
      total: qs.length,
      tried: Object.keys(tried).length,
      attempts: att.length,
      correct: correct,
      accuracy: att.length ? correct / att.length : null
    };
  }

  function weights(questions, attempts, opts) {
    var mode = opts && opts.mode ? opts.mode : "weak";
    var chapter = opts && opts.chapter;
    var lastId = opts && opts.lastId;
    var stats = skillStats(attempts);
    var weak = {};
    weakSkills(attempts).slice(0, 3).forEach(function (row) { weak[row.skill] = true; });
    return (questions || []).filter(function (q) {
      return mode !== "chapter" || q.chapter === chapter;
    }).map(function (q) {
      var mine = (attempts || []).filter(function (a) { return a.id === q.id; });
      var lastMine = mine[mine.length - 1];
      var skill = stats[q.skill];
      var w = 1;
      if (!mine.length) w += 1;
      if (lastMine && !lastMine.correct) w += 6;
      if (skill) w += skill.wrong * 2;
      if (mode === "weak" && weak[q.skill]) w += 4;
      if (q.id === lastId) w *= 0.05;
      return { id: q.id, skill: q.skill, w: w };
    });
  }

  function pickQuestion(questions, attempts, opts) {
    var rows = weights(questions, attempts, opts);
    if (!rows.length) return null;
    var rng = opts && opts.rng ? opts.rng : Math.random;
    var sum = rows.reduce(function (total, row) { return total + row.w; }, 0);
    if (sum <= 0) return findQuestion(questions, rows[0].id);
    var mark = rng() * sum;
    var acc = 0;
    for (var i = 0; i < rows.length; i++) {
      acc += rows[i].w;
      if (mark < acc) return findQuestion(questions, rows[i].id);
    }
    return findQuestion(questions, rows[rows.length - 1].id);
  }

  function findQuestion(questions, id) {
    for (var i = 0; i < questions.length; i++) {
      if (questions[i].id === id) return questions[i];
    }
    return null;
  }

  return {
    emptyProgress: emptyProgress,
    record: record,
    skillStats: skillStats,
    weakSkills: weakSkills,
    chapterReport: chapterReport,
    weights: weights,
    pickQuestion: pickQuestion
  };
});
