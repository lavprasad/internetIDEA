(function () {
  var L = window.AptitudeLogic;
  var course = window.AptitudeCourse;
  var visuals = window.AptitudeVisuals;
  var KEY = "aptitude-v1";
  var root = document.getElementById("app");
  var session = null;

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || "");
      if (data && Array.isArray(data.attempts)) return data;
    } catch (err) { /* start fresh */ }
    return L.emptyProgress();
  }

  function save(progress) {
    localStorage.setItem(KEY, JSON.stringify(progress));
  }

  function chapterById(id) {
    for (var i = 0; i < course.chapters.length; i++) {
      if (course.chapters[i].id === id) return course.chapters[i];
    }
    return null;
  }

  function trick(chapter, skill) {
    if (!chapter) return null;
    for (var i = 0; i < chapter.tricks.length; i++) {
      if (chapter.tricks[i].skill === skill) return chapter.tricks[i];
    }
    return null;
  }

  function percent(value) {
    if (value == null) return "not started";
    return Math.round(value * 100) + "%";
  }

  function h(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function route() {
    visuals.stop();
    var hash = location.hash || "#/";
    var parts = hash.replace(/^#\/?/, "").split("/");
    var page = parts[0] || "home";
    if (page === "lesson") renderLesson(parts[1]);
    else if (page === "practice") renderPractice(parts[1] || "weak");
    else if (page === "missed") renderMissed();
    else renderHome();
  }

  function renderHome() {
    var progress = load();
    root.replaceChildren();
    root.append(h("h1", "", "Clear the paper"));
    root.append(h("p", "lede", "Ten chapters. Every lesson and every question has a picture. The shortcuts below are identities: they hold for every question of that kind."));

    var rules = h("section", "card");
    rules.append(h("h2", "", "Shortcuts that always hold"));
    var list = document.createElement("ul");
    course.always.forEach(function (line) {
      list.append(h("li", "", line));
    });
    rules.append(list);
    root.append(rules);

    var weak = L.weakSkills(progress.attempts);
    var band = h("section", "weak");
    if (!weak.length) {
      band.append(h("h2", "", "No weak spot yet"));
      band.append(h("p", "", "Answer a few questions. The skills you miss will collect here, and practice will prefer them."));
    } else {
      var top = weak[0];
      var chapter = chapterById(top.chapter);
      var tip = trick(chapter, top.skill);
      band.append(h("h2", "", "Needs the most work"));
      band.append(h("p", "", (tip ? tip.name : top.skill) + " in " + (chapter ? chapter.title : top.chapter) + ". Missed " + top.wrong + " of " + top.attempts + "."));
      if (tip) band.append(h("p", "", tip.body));
    }
    var actions = h("div", "row-actions");
    var drill = h("button", "", "Practice weak spots");
    drill.type = "button";
    drill.addEventListener("click", function () { location.hash = "#/practice/weak"; });
    var missed = h("button", "", "Review misses");
    missed.type = "button";
    missed.addEventListener("click", function () { location.hash = "#/missed"; });
    actions.append(drill, missed);
    band.append(actions);
    root.append(band);

    var grid = h("div", "grid");
    course.chapters.forEach(function (chapter) {
      var report = L.chapterReport(course.questions, progress.attempts, chapter.id);
      var card = h("article", "card");
      var thumb = h("div", "thumb");
      window.AptitudeVisuals.thumb(chapter.id, thumb);
      card.append(thumb);
      card.append(h("h2", "", chapter.title));
      card.append(h("p", "", chapter.blurb));
      var meter = h("div", "meter");
      var fill = h("span");
      fill.style.width = report.accuracy == null ? "0%" : Math.round(report.accuracy * 100) + "%";
      meter.append(fill);
      card.append(meter);
      card.append(h("p", "", report.tried + " of " + report.total + " tried · " + percent(report.accuracy)));
      var links = h("div", "links");
      var lesson = h("a", "", "Lesson");
      lesson.href = "#/lesson/" + chapter.id;
      var practice = h("a", "", "Practice");
      practice.href = "#/practice/" + chapter.id;
      links.append(lesson, practice);
      card.append(links);
      grid.append(card);
    });
    root.append(grid);
  }

  function renderLesson(id) {
    var chapter = chapterById(id);
    root.replaceChildren();
    if (!chapter) {
      root.append(h("p", "", "That chapter is not on the list."));
      return;
    }
    root.append(h("h1", "", chapter.title));
    root.append(h("p", "lede", chapter.idea));
    var stage = h("div", "stage");
    root.append(stage);
    visuals.mount(chapter.id, stage);

    root.append(h("h2", "", "Notes"));
    var notes = h("div", "notes");
    chapter.notes.forEach(function (note) { notes.append(h("p", "note", note)); });
    root.append(notes);

    root.append(h("h2", "", "Tricks"));
    chapter.tricks.forEach(function (item) {
      var box = h("article", "trick");
      box.append(h("strong", "", item.name));
      box.append(h("p", "", item.body));
      root.append(box);
    });

    var memory = h("article", "memory");
    memory.append(h("strong", "", "Keep this picture"));
    memory.append(h("p", "", chapter.memory));
    root.append(memory);

    var go = h("button", "primary", "Practice this chapter");
    go.type = "button";
    go.addEventListener("click", function () { location.hash = "#/practice/" + chapter.id; });
    root.append(go);
  }

  function renderPractice(mode) {
    var chapter = mode === "weak" ? null : chapterById(mode);
    if (mode !== "weak" && !chapter) {
      root.replaceChildren(h("p", "", "That chapter is not on the list."));
      return;
    }
    if (!session || session.mode !== mode) {
      session = { mode: mode, correct: 0, total: 0, current: null, locked: false };
    }
    drawQuestion();
  }

  function drawQuestion() {
    var progress = load();
    var next = L.pickQuestion(course.questions, progress.attempts, {
      mode: session.mode === "weak" ? "weak" : "chapter",
      chapter: session.mode,
      lastId: session.current ? session.current.id : null
    });
    session.current = next;
    session.locked = false;
    root.replaceChildren();
    var title = session.mode === "weak" ? "Weak-spot practice" : chapterById(session.mode).title;
    root.append(h("h1", "", title));
    root.append(h("p", "score", "This sitting: " + session.correct + " of " + session.total));
    if (!next) {
      root.append(h("p", "", "No questions in this set."));
      return;
    }
    var card = h("article", "q-card");
    var chapter = chapterById(next.chapter);
    card.append(h("p", "score", chapter.title));
    var stage = h("div", "stage");
    card.append(stage);
    window.AptitudeVisuals.mount(next.chapter, stage);
    card.append(h("h2", "", next.prompt));
    var choices = h("div", "choices");
    next.choices.forEach(function (choice) {
      var button = h("button", "choice", choice);
      button.type = "button";
      button.addEventListener("click", function () { answer(choice, button, choices); });
      choices.append(button);
    });
    card.append(choices);
    var feedback = h("div", "feedback");
    feedback.setAttribute("role", "status");
    card.append(feedback);
    root.append(card);
  }

  function answer(choice, button, choices) {
    if (session.locked) return;
    session.locked = true;
    var q = session.current;
    var ok = choice === q.answer;
    session.total += 1;
    if (ok) session.correct += 1;
    var progress = L.record(load(), { id: q.id, chapter: q.chapter, skill: q.skill, correct: ok });
    save(progress);
    Array.prototype.forEach.call(choices.children, function (node) {
      node.disabled = true;
      if (node.textContent === q.answer) node.classList.add("good");
    });
    if (!ok) button.classList.add("bad");
    var feedback = choices.parentNode.querySelector(".feedback");
    var chapter = chapterById(q.chapter);
    var tip = trick(chapter, q.skill);
    feedback.append(h("p", "", ok ? "Correct." : "Not this one. The answer is " + q.answer + "."));
    if (tip) feedback.append(h("p", "", tip.name + ": " + tip.body));
    var steps = document.createElement("ol");
    q.steps.forEach(function (step) { steps.append(h("li", "", step)); });
    feedback.append(steps);
    var again = h("button", "primary", "Next question");
    again.type = "button";
    again.addEventListener("click", drawQuestion);
    feedback.append(again);
    document.querySelector(".score").textContent = "This sitting: " + session.correct + " of " + session.total;
  }

  function renderMissed() {
    var progress = load();
    root.replaceChildren();
    root.append(h("h1", "", "Questions you missed"));
    var latest = {};
    progress.attempts.forEach(function (attempt) { latest[attempt.id] = attempt; });
    var ids = Object.keys(latest).filter(function (id) { return !latest[id].correct; });
    if (!ids.length) {
      root.append(h("p", "", "Nothing sitting in the miss pile. A later correct answer clears a question."));
      return;
    }
    ids.forEach(function (id) {
      var question = null;
      for (var i = 0; i < course.questions.length; i++) {
        if (course.questions[i].id === id) question = course.questions[i];
      }
      if (!question) return;
      var card = h("article", "q-card");
      var chapter = chapterById(question.chapter);
      card.append(h("p", "score", chapter ? chapter.title : ""));
      card.append(h("h2", "", question.prompt));
      card.append(h("p", "", "Answer: " + question.answer));
      var tip = trick(chapter, question.skill);
      if (tip) card.append(h("p", "", tip.body));
      root.append(card);
    });
  }

  window.addEventListener("hashchange", route);
  route();
})();
