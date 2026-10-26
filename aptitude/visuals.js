(function () {
  var jobs = [];

  function mount(chapterId, host) {
    stop();
    host.replaceChildren();
    var build = scenes[chapterId] || scenes.percent;
    build(host);
    return stop;
  }

  function stop() {
    jobs.forEach(function (job) { job(); });
    jobs = [];
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function slider(label, min, max, value, step) {
    var wrap = el("label", "slider");
    var name = el("span", "", label);
    var input = document.createElement("input");
    input.type = "range";
    input.min = String(min);
    input.max = String(max);
    input.step = String(step || 1);
    input.value = String(value);
    var out = el("b", "slider-value", input.value);
    wrap.append(name, input, out);
    input.addEventListener("input", function () { out.textContent = input.value; });
    return { wrap: wrap, input: input, out: out };
  }

  function reduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function everyFrame(fn) {
    if (reduced()) {
      fn(performance.now());
      return;
    }
    var alive = true;
    var id = 0;
    function loop(ts) {
      if (!alive) return;
      fn(ts);
      id = requestAnimationFrame(loop);
    }
    id = requestAnimationFrame(loop);
    jobs.push(function () {
      alive = false;
      cancelAnimationFrame(id);
    });
  }

  var scenes = {
    percent: function (host) {
      var pct = slider("Percent", 1, 100, 20);
      var base = slider("Of this number", 10, 200, 80);
      var read = el("p", "readout");
      var bars = el("div", "bars");
      var a = bar("x% of y");
      var b = bar("y% of x");
      bars.append(a.row, b.row);
      host.append(pct.wrap, base.wrap, read, bars);
      function draw() {
        var x = Number(pct.input.value);
        var y = Number(base.input.value);
        var left = x / 100 * y;
        var right = y / 100 * x;
        read.textContent = x + "% of " + y + " = " + trim(left) + "    and    " + y + "% of " + x + " = " + trim(right);
        a.fill.style.width = Math.min(100, left / 2) + "%";
        b.fill.style.width = Math.min(100, right / 2) + "%";
      }
      pct.input.addEventListener("input", draw);
      base.input.addEventListener("input", draw);
      draw();
    },

    ratio: function (host) {
      var a = slider("Parts A", 1, 9, 2);
      var b = slider("Parts B", 1, 9, 3);
      var total = slider("Total", 90, 900, 450, 10);
      var read = el("p", "readout");
      var split = el("div", "split");
      var left = el("div", "split-a");
      var right = el("div", "split-b");
      split.append(left, right);
      host.append(a.wrap, b.wrap, total.wrap, read, split);
      function draw() {
        var pa = Number(a.input.value);
        var pb = Number(b.input.value);
        var t = Number(total.input.value);
        var shareA = t * pa / (pa + pb);
        left.style.flexGrow = String(pa);
        right.style.flexGrow = String(pb);
        left.textContent = "A " + trim(shareA);
        right.textContent = "B " + trim(t - shareA);
        read.textContent = pa + ":" + pb + " of " + t + " is " + trim(shareA) + " and " + trim(t - shareA);
      }
      [a, b, total].forEach(function (s) { s.input.addEventListener("input", draw); });
      draw();
    },

    profit: function (host) {
      var cp = slider("Cost", 100, 800, 400, 10);
      var up = slider("Markup %", 0, 80, 25);
      var off = slider("Discount %", 0, 50, 20);
      var read = el("p", "readout");
      var tag = el("div", "price-tag");
      var cost = el("div", "tag-row", "");
      var mark = el("div", "tag-row mark", "");
      var sale = el("div", "tag-row sale", "");
      tag.append(cost, mark, sale);
      host.append(cp.wrap, up.wrap, off.wrap, tag, read);
      function draw() {
        var c = Number(cp.input.value);
        var m = c * (1 + Number(up.input.value) / 100);
        var s = m * (1 - Number(off.input.value) / 100);
        cost.textContent = "Cost  " + trim(c);
        mark.textContent = "Tag   " + trim(m);
        sale.textContent = "Sale  " + trim(s);
        var profit = (s - c) / c * 100;
        read.textContent = profit === 0 ? "Sale equals cost. Profit 0%." : (profit > 0 ? "Profit " : "Loss ") + trim(Math.abs(profit)) + "% on cost.";
      }
      [cp, up, off].forEach(function (s) { s.input.addEventListener("input", draw); });
      draw();
    },

    interest: function (host) {
      var p = slider("Principal", 1000, 10000, 5000, 100);
      var r = slider("Rate %", 1, 20, 10);
      var t = slider("Years", 1, 6, 2);
      var read = el("p", "readout");
      var cols = el("div", "cols");
      var si = column("Simple");
      var ci = column("Compound");
      cols.append(si.col, ci.col);
      host.append(p.wrap, r.wrap, t.wrap, cols, read);
      function draw() {
        var principal = Number(p.input.value);
        var rate = Number(r.input.value);
        var years = Number(t.input.value);
        var simple = principal * rate * years / 100;
        var amount = principal * Math.pow(1 + rate / 100, years);
        var compound = amount - principal;
        var max = Math.max(simple, compound, 1);
        si.fill.style.height = (simple / max * 100) + "%";
        ci.fill.style.height = (compound / max * 100) + "%";
        si.cap.textContent = trim(simple);
        ci.cap.textContent = trim(compound);
        read.textContent = "After " + years + " years the compound stack is " + trim(compound - simple) + " taller.";
      }
      [p, r, t].forEach(function (s) { s.input.addEventListener("input", draw); });
      draw();
    },

    speed: function (host) {
      var going = slider("Going km/h", 20, 100, 30);
      var back = slider("Return km/h", 20, 100, 60);
      var read = el("p", "readout");
      var track = el("div", "track");
      var runnerA = el("div", "runner a");
      var runnerB = el("div", "runner b");
      track.append(runnerA, runnerB);
      host.append(going.wrap, back.wrap, track, read);
      var posA = 0;
      var posB = 0;
      var last = 0;
      everyFrame(function (ts) {
        if (!last) last = ts;
        var dt = Math.min(0.05, (ts - last) / 1000);
        last = ts;
        posA = (posA + Number(going.input.value) * dt * 0.35) % 100;
        posB = (posB + Number(back.input.value) * dt * 0.35) % 100;
        runnerA.style.left = posA + "%";
        runnerB.style.left = posB + "%";
        var a = Number(going.input.value);
        var b = Number(back.input.value);
        var avg = 2 * a * b / (a + b);
        read.textContent = "Same road both ways averages " + trim(avg) + " km/h, not " + trim((a + b) / 2) + ".";
      });
    },

    work: function (host) {
      var fill = slider("Tap fills in hours", 2, 12, 4);
      var leak = slider("Leak empties in hours", 0, 16, 6);
      var read = el("p", "readout");
      var tank = el("div", "tank");
      var water = el("div", "water");
      tank.append(water);
      host.append(fill.wrap, leak.wrap, tank, read);
      var level = 0.15;
      var last = 0;
      everyFrame(function (ts) {
        if (!last) last = ts;
        var dt = Math.min(0.05, (ts - last) / 1000);
        last = ts;
        var inn = 1 / Number(fill.input.value);
        var out = Number(leak.input.value) === 0 ? 0 : 1 / Number(leak.input.value);
        var net = inn - out;
        level = Math.max(0, Math.min(1, level + net * dt * 0.45));
        water.style.height = (level * 100) + "%";
        if (Math.abs(net) < 0.0001) read.textContent = "The tap and the leak cancel. The water stays put.";
        else if (net > 0) read.textContent = "Net fill time from empty: " + trim(1 / net) + " hours.";
        else read.textContent = "The leak wins. From full it empties in " + trim(1 / -net) + " hours.";
      });
    },

    average: function (host) {
      var cheap = slider("Cheaper price", 10, 80, 60);
      var dear = slider("Dearer price", 40, 140, 90);
      var mean = slider("Wanted mean", 20, 120, 70);
      var read = el("p", "readout");
      var see = el("div", "seesaw");
      var arm = el("div", "arm");
      var fulcrum = el("div", "fulcrum");
      see.append(arm, fulcrum);
      host.append(cheap.wrap, dear.wrap, mean.wrap, see, read);
      function draw() {
        var c = Number(cheap.input.value);
        var d = Number(dear.input.value);
        var m = Number(mean.input.value);
        if (m <= c || m >= d) {
          read.textContent = "Put the mean strictly between the two prices.";
          arm.style.transform = "rotate(0deg)";
          return;
        }
        var left = d - m;
        var right = m - c;
        var tilt = Math.max(-18, Math.min(18, (right - left) * 0.6));
        arm.style.transform = "rotate(" + tilt + "deg)";
        read.textContent = "Cheaper : dearer = " + left + " : " + right + ".";
      }
      [cheap, dear, mean].forEach(function (s) { s.input.addEventListener("input", draw); });
      draw();
    },

    numbers: function (host) {
      var n = slider("Look at this number's powers of 2", 1, 20, 15);
      var read = el("p", "readout");
      var cycle = el("div", "cycle");
      var digits = [2, 4, 8, 6];
      var cells = digits.map(function (digit) {
        var cell = el("div", "cycle-cell", String(digit));
        cycle.append(cell);
        return cell;
      });
      host.append(n.wrap, cycle, read);
      function draw() {
        var exp = Number(n.input.value);
        var index = (exp - 1) % 4;
        cells.forEach(function (cell, i) { cell.classList.toggle("on", i === index); });
        read.textContent = "2^" + exp + " ends in " + digits[index] + ". Position " + (index + 1) + " of the loop 2, 4, 8, 6.";
      }
      n.input.addEventListener("input", draw);
      draw();
    },

    chance: function (host) {
      var sum = slider("Dice sum to shade", 2, 12, 9);
      var read = el("p", "readout");
      var grid = el("div", "dice-grid");
      var cells = [];
      for (var r = 1; r <= 6; r++) {
        for (var c = 1; c <= 6; c++) {
          var cell = el("div", "die", String(r + c));
          cell.dataset.sum = String(r + c);
          grid.append(cell);
          cells.push(cell);
        }
      }
      host.append(sum.wrap, grid, read);
      function draw() {
        var want = Number(sum.input.value);
        var hits = 0;
        cells.forEach(function (cell) {
          var on = Number(cell.dataset.sum) === want;
          cell.classList.toggle("on", on);
          if (on) hits += 1;
        });
        read.textContent = hits + " shaded squares out of 36. Probability " + hits + "/36.";
      }
      sum.input.addEventListener("input", draw);
      draw();
    },

    series: function (host) {
      var read = el("p", "readout");
      var row = el("div", "series-row");
      var play = el("button", "play", "Play the jumps");
      play.type = "button";
      var terms = [6, 11, 21, 36, 56, 81];
      var jumps = [5, 10, 15, 20, 25];
      host.append(play, row, read);
      function showAll() {
        row.replaceChildren();
        terms.forEach(function (term, i) {
          row.append(el("span", "term", String(term)));
          if (i < jumps.length) row.append(el("span", "jump", "+" + jumps[i]));
        });
        read.textContent = "The jumps grow by 5. The last jump must be 25, so 56 + 25 = 81.";
      }
      var timer = 0;
      play.addEventListener("click", function () {
        clearTimeout(timer);
        row.replaceChildren();
        var i = 0;
        function step() {
          row.append(el("span", "term", String(terms[i])));
          if (i < jumps.length) row.append(el("span", "jump", "+" + jumps[i]));
          i += 1;
          if (i < terms.length && !reduced()) timer = setTimeout(step, 450);
          else read.textContent = "The jumps grow by 5. The last jump must be 25, so 56 + 25 = 81.";
        }
        read.textContent = "Watch the gaps, not only the terms.";
        step();
      });
      jobs.push(function () { clearTimeout(timer); });
      showAll();
    }
  };

  function bar(label) {
    var row = el("div", "bar-row");
    row.append(el("span", "bar-label", label));
    var track = el("div", "bar-track");
    var fill = el("div", "bar-fill");
    track.append(fill);
    row.append(track);
    return { row: row, fill: fill };
  }

  function column(label) {
    var col = el("div", "col");
    var cap = el("div", "col-cap", "");
    var shaft = el("div", "shaft");
    var fill = el("div", "shaft-fill");
    shaft.append(fill);
    col.append(cap, shaft, el("div", "col-name", label));
    return { col: col, fill: fill, cap: cap };
  }

  function trim(n) {
    return String(Math.round(n * 100) / 100);
  }

  window.AptitudeVisuals = { mount: mount, stop: stop };
})();
