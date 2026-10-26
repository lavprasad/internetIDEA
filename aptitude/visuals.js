(function () {
  var NS = "http://www.w3.org/2000/svg";
  var jobs = [];

  function mount(chapterId, host) {
    stop();
    host.replaceChildren();
    (scenes[chapterId] || scenes.percent)(host, false);
  }

  function thumb(chapterId, host) {
    host.replaceChildren();
    (scenes[chapterId] || scenes.percent)(host, true);
  }

  function stop() {
    jobs.splice(0).forEach(function (job) { job(); });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function svg(w, h) {
    var node = document.createElementNS(NS, "svg");
    node.setAttribute("viewBox", "0 0 " + w + " " + h);
    node.setAttribute("class", "fig");
    node.setAttribute("role", "img");
    return node;
  }

  function shape(name, attrs) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    return node;
  }

  function slider(label, min, max, value, step) {
    var wrap = el("label", "slider");
    wrap.append(el("span", "", label));
    var input = document.createElement("input");
    input.type = "range";
    input.min = String(min);
    input.max = String(max);
    input.step = String(step || 1);
    input.value = String(value);
    var out = el("b", "slider-value", input.value);
    wrap.append(input, out);
    input.addEventListener("input", function () { out.textContent = input.value; });
    return { wrap: wrap, input: input };
  }

  function reduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function everyFrame(fn) {
    if (reduced()) {
      fn(0);
      return;
    }
    var alive = true;
    var id = 0;
    var last = 0;
    function loop(ts) {
      if (!alive) return;
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
      last = ts;
      fn(dt);
      id = requestAnimationFrame(loop);
    }
    id = requestAnimationFrame(loop);
    jobs.push(function () {
      alive = false;
      cancelAnimationFrame(id);
    });
  }

  function caption(picture, text) {
    picture.setAttribute("aria-label", text);
  }

  var scenes = {
    percent: function (host, still) {
      var pct = slider("Percent", 5, 100, 25, 5);
      var base = slider("Number", 20, 200, 80, 10);
      var read = el("p", "readout");
      var picture = svg(640, 250);
      var pieTrack = shape("circle", { cx: 90, cy: 115, r: 62, fill: "#0d2422", stroke: "#8fd0c6", "stroke-width": 16 });
      var pie = shape("circle", { cx: 90, cy: 115, r: 62, fill: "none", stroke: "#e2b15a", "stroke-width": 16, "stroke-linecap": "round", transform: "rotate(-90 90 115)" });
      var pieLabel = shape("text", { x: 90, y: 120, "text-anchor": "middle", fill: "#f2d48a", "font-size": 22, "font-family": "Segoe UI, sans-serif" });
      var barY = shape("rect", { x: 210, y: 48, width: 380, height: 42, rx: 8, fill: "#0d2422" });
      var fillY = shape("rect", { x: 210, y: 48, width: 80, height: 42, rx: 8, fill: "#e2b15a" });
      var barX = shape("rect", { x: 210, y: 128, width: 380, height: 42, rx: 8, fill: "#0d2422" });
      var fillX = shape("rect", { x: 210, y: 128, width: 80, height: 42, rx: 8, fill: "#8fd0c6" });
      var labY = shape("text", { x: 220, y: 36, fill: "#e7fff8", "font-size": 16, "font-family": "Segoe UI, sans-serif" });
      var labX = shape("text", { x: 220, y: 196, fill: "#e7fff8", "font-size": 16, "font-family": "Segoe UI, sans-serif" });
      picture.append(pieTrack, pie, pieLabel, barY, fillY, barX, fillX, labY, labX);
      host.append(picture);
      if (!still) host.append(pct.wrap, base.wrap);
      host.append(read);
      var circ = 2 * Math.PI * 62;
      function draw() {
        var x = Number(pct.input.value);
        var y = Number(base.input.value);
        var value = x / 100 * y;
        pie.setAttribute("stroke-dasharray", (circ * x / 100) + " " + circ);
        pieLabel.textContent = x + "%";
        fillY.setAttribute("width", String(380 * x / 100));
        fillX.setAttribute("width", String(380 * Math.min(100, y) / 100));
        labY.textContent = x + "% of " + y + "  =  " + trim(value);
        labX.textContent = y + "% of " + x + "  =  " + trim(y / 100 * x);
        read.textContent = "The gold slice and the two bars are the same product, x × y / 100.";
        caption(picture, read.textContent);
      }
      pct.input.addEventListener("input", draw);
      base.input.addEventListener("input", draw);
      draw();
    },

    ratio: function (host, still) {
      var a = slider("Parts A", 1, 8, 2);
      var b = slider("Parts B", 1, 8, 3);
      var read = el("p", "readout");
      var picture = svg(640, 230);
      var blocks = shape("g", {});
      picture.append(blocks);
      host.append(picture);
      if (!still) host.append(a.wrap, b.wrap);
      host.append(read);
      function draw() {
        var pa = Number(a.input.value);
        var pb = Number(b.input.value);
        blocks.replaceChildren();
        var size = 46;
        var i;
        for (i = 0; i < pa; i++) {
          blocks.append(shape("rect", { x: 30 + i * (size + 8), y: 36, width: size, height: size, rx: 6, fill: "#e2b15a" }));
        }
        for (i = 0; i < pb; i++) {
          blocks.append(shape("rect", { x: 30 + i * (size + 8), y: 120, width: size, height: size, rx: 6, fill: "#8fd0c6" }));
        }
        blocks.append(shape("text", { x: 30, y: 24, fill: "#f2d48a", "font-size": 16, "font-family": "Segoe UI, sans-serif" }));
        blocks.lastChild.textContent = "A  " + pa + " parts";
        blocks.append(shape("text", { x: 30, y: 196, fill: "#e7fff8", "font-size": 16, "font-family": "Segoe UI, sans-serif" }));
        blocks.lastChild.textContent = "B  " + pb + " parts    ·    one part = total / " + (pa + pb);
        read.textContent = pa + " : " + pb + " means " + (pa + pb) + " equal blocks. A's share is " + pa + "/" + (pa + pb) + " of the whole.";
        caption(picture, read.textContent);
      }
      a.input.addEventListener("input", draw);
      b.input.addEventListener("input", draw);
      draw();
    },

    profit: function (host, still) {
      var up = slider("Markup %", 0, 80, 25);
      var off = slider("Discount %", 0, 40, 20);
      var read = el("p", "readout");
      var picture = svg(640, 240);
      var floor = shape("line", { x1: 70, y1: 180, x2: 560, y2: 180, stroke: "#8fd0c6", "stroke-width": 4 });
      var tag = shape("rect", { x: 250, y: 40, width: 150, height: 90, rx: 8, fill: "#fffaf2", stroke: "#e2b15a", "stroke-width": 3 });
      var costT = shape("text", { x: 80, y: 204, fill: "#8fd0c6", "font-size": 16, "font-family": "Segoe UI, sans-serif" });
      var markT = shape("text", { x: 260, y: 78, fill: "#1c2430", "font-size": 18, "font-family": "Segoe UI, sans-serif" });
      var saleT = shape("text", { x: 260, y: 108, fill: "#9c2f2f", "font-size": 20, "font-family": "Segoe UI, sans-serif" });
      var arrow = shape("line", { x1: 325, y1: 140, x2: 325, y2: 176, stroke: "#e2b15a", "stroke-width": 3 });
      picture.append(floor, tag, costT, markT, saleT, arrow);
      host.append(picture);
      if (!still) host.append(up.wrap, off.wrap);
      host.append(read);
      function draw() {
        var c = 400;
        var m = c * (1 + Number(up.input.value) / 100);
        var s = m * (1 - Number(off.input.value) / 100);
        var top = 170 - Math.min(130, (m - c) / 4);
        tag.setAttribute("y", String(top));
        markT.setAttribute("y", String(top + 34));
        saleT.setAttribute("y", String(top + 64));
        arrow.setAttribute("y1", String(top + 96));
        costT.textContent = "Cost floor  " + c;
        markT.textContent = "Tag  " + trim(m);
        saleT.textContent = "Sale  " + trim(s);
        read.textContent = "Discount cuts the tag. Profit is measured from the cost floor. Here that is " + trim((s - c) / c * 100) + "%.";
        caption(picture, read.textContent);
      }
      up.input.addEventListener("input", draw);
      off.input.addEventListener("input", draw);
      draw();
    },

    interest: function (host, still) {
      var years = slider("Years", 1, 6, 3);
      var read = el("p", "readout");
      var picture = svg(640, 240);
      var si = shape("rect", { x: 160, y: 180, width: 90, height: 20, rx: 6, fill: "#e2b15a" });
      var ci = shape("rect", { x: 360, y: 180, width: 90, height: 20, rx: 6, fill: "#8fd0c6" });
      var siL = shape("text", { x: 150, y: 220, fill: "#f2d48a", "font-size": 16, "font-family": "Segoe UI, sans-serif" });
      var ciL = shape("text", { x: 340, y: 220, fill: "#e7fff8", "font-size": 16, "font-family": "Segoe UI, sans-serif" });
      picture.append(si, ci, siL, ciL);
      host.append(picture);
      if (!still) host.append(years.wrap);
      host.append(read);
      function draw() {
        var t = Number(years.input.value);
        var simple = 5000 * 0.1 * t;
        var compound = 5000 * Math.pow(1.1, t) - 5000;
        var max = 5000 * Math.pow(1.1, 6) - 5000;
        si.setAttribute("height", String(20 + 150 * simple / max));
        si.setAttribute("y", String(190 - Number(si.getAttribute("height"))));
        ci.setAttribute("height", String(20 + 150 * compound / max));
        ci.setAttribute("y", String(190 - Number(ci.getAttribute("height"))));
        siL.textContent = "Simple  " + trim(simple);
        ciL.textContent = "Compound  " + trim(compound);
        read.textContent = "₹5000 at 10%. The green stack grows on itself. After 2 years the gap is exactly P×(r/100)².";
        caption(picture, read.textContent);
      }
      years.input.addEventListener("input", draw);
      draw();
    },

    speed: function (host, still) {
      var going = slider("Going km/h", 20, 100, 30);
      var back = slider("Return km/h", 20, 100, 60);
      var read = el("p", "readout");
      var picture = svg(640, 220);
      var road = shape("rect", { x: 30, y: 70, width: 580, height: 70, rx: 12, fill: "#0d2422" });
      var dash = shape("line", { x1: 50, y1: 105, x2: 590, y2: 105, stroke: "#f2d48a", "stroke-width": 3, "stroke-dasharray": "16 12" });
      var carA = car("#e2b15a");
      var carB = car("#8fd0c6");
      var label = shape("text", { x: 30, y: 30, fill: "#f2d48a", "font-size": 18, "font-family": "Segoe UI, sans-serif" });
      picture.append(road, dash, carA, carB, label);
      host.append(picture);
      if (!still) host.append(going.wrap, back.wrap);
      host.append(read);
      var posA = 40;
      var posB = 180;
      function place() {
        carA.setAttribute("transform", "translate(" + posA + " 78)");
        carB.setAttribute("transform", "translate(" + posB + " 108)");
        var a = Number(going.input.value);
        var b = Number(back.input.value);
        var avg = 2 * a * b / (a + b);
        label.textContent = "Equal road: average " + trim(avg) + " km/h, not " + trim((a + b) / 2);
        read.textContent = "The slow car occupies the road for longer, so the ordinary mean is too high.";
        caption(picture, label.textContent);
      }
      going.input.addEventListener("input", place);
      back.input.addEventListener("input", place);
      place();
      if (still) return;
      everyFrame(function (dt) {
        posA = (posA + Number(going.input.value) * dt * 1.1) % 520;
        posB = (posB + Number(back.input.value) * dt * 1.1) % 520;
        place();
      });
    },

    work: function (host, still) {
      var fillHours = slider("Tap, hours to fill", 2, 12, 4);
      var leakHours = slider("Leak, hours to empty", 3, 16, 8);
      var read = el("p", "readout");
      var picture = svg(640, 250);
      var tank = shape("rect", { x: 250, y: 30, width: 140, height: 190, fill: "#0d2422", stroke: "#f2d48a", "stroke-width": 4 });
      var water = shape("rect", { x: 254, y: 160, width: 132, height: 56, fill: "#3aa7c9" });
      var tap = shape("rect", { x: 300, y: 8, width: 40, height: 22, rx: 4, fill: "#e2b15a" });
      var leak = shape("circle", { cx: 390, cy: 190, r: 8, fill: "#9c2f2f" });
      picture.append(tank, water, tap, leak);
      host.append(picture);
      if (!still) host.append(fillHours.wrap, leakHours.wrap);
      host.append(read);
      var level = 0.35;
      function place() {
        var inn = 1 / Number(fillHours.input.value);
        var out = 1 / Number(leakHours.input.value);
        var net = inn - out;
        var h = Math.max(8, Math.min(182, level * 182));
        water.setAttribute("height", String(h));
        water.setAttribute("y", String(216 - h));
        if (net > 0) read.textContent = "Tap minus leak fills an empty tank in " + trim(1 / net) + " hours. That is ab/(b−a).";
        else if (net < 0) read.textContent = "The leak is faster. A full tank empties in " + trim(1 / -net) + " hours.";
        else read.textContent = "The arrows cancel. The water line stays still.";
        caption(picture, read.textContent);
        return net;
      }
      fillHours.input.addEventListener("input", place);
      leakHours.input.addEventListener("input", place);
      place();
      if (still) return;
      everyFrame(function (dt) {
        level = Math.max(0, Math.min(1, level + place() * dt * 0.35));
      });
    },

    average: function (host, still) {
      var cheap = slider("Cheaper", 20, 80, 40);
      var dear = slider("Dearer", 60, 140, 100);
      var mean = slider("Mean", 30, 120, 60);
      var read = el("p", "readout");
      var picture = svg(640, 220);
      var beam = shape("line", { x1: 80, y1: 90, x2: 560, y2: 90, stroke: "#f2d48a", "stroke-width": 8, "stroke-linecap": "round" });
      var fulcrum = shape("polygon", { points: "320,98 296,160 344,160", fill: "#8fd0c6" });
      var leftW = shape("circle", { cx: 160, cy: 70, r: 28, fill: "#e2b15a" });
      var rightW = shape("circle", { cx: 480, cy: 70, r: 18, fill: "#8fd0c6" });
      picture.append(beam, fulcrum, leftW, rightW);
      host.append(picture);
      if (!still) host.append(cheap.wrap, dear.wrap, mean.wrap);
      host.append(read);
      function draw() {
        var c = Number(cheap.input.value);
        var d = Number(dear.input.value);
        var m = Number(mean.input.value);
        if (m <= c || m >= d) {
          read.textContent = "The mean has to sit strictly between the two prices. Otherwise alligation does not apply.";
          beam.setAttribute("transform", "");
          caption(picture, read.textContent);
          return;
        }
        var left = d - m;
        var right = m - c;
        leftW.setAttribute("r", String(16 + left));
        rightW.setAttribute("r", String(16 + right));
        read.textContent = "Cheaper : dearer = " + left + " : " + right + ". The side farther from the mean needs less weight.";
        caption(picture, read.textContent);
      }
      [cheap, dear, mean].forEach(function (s) { s.input.addEventListener("input", draw); });
      draw();
    },

    numbers: function (host, still) {
      var n = slider("Power of 2", 1, 16, 7);
      var read = el("p", "readout");
      var picture = svg(640, 180);
      var cells = [];
      var digits = [2, 4, 8, 6];
      digits.forEach(function (digit, i) {
        var box = shape("rect", { x: 70 + i * 140, y: 40, width: 100, height: 80, rx: 12, fill: "#0d2422", stroke: "#8fd0c6", "stroke-width": 3 });
        var label = shape("text", { x: 120 + i * 140, y: 92, "text-anchor": "middle", fill: "#f2d48a", "font-size": 36, "font-family": "Segoe UI, sans-serif" });
        label.textContent = String(digit);
        picture.append(box, label);
        cells.push(box);
      });
      host.append(picture);
      if (!still) host.append(n.wrap);
      host.append(read);
      function draw() {
        var exp = Number(n.input.value);
        var index = (exp - 1) % 4;
        cells.forEach(function (box, i) {
          box.setAttribute("fill", i === index ? "#e2b15a" : "#0d2422");
        });
        read.textContent = "2^" + exp + " ends in " + digits[index] + ". The loop 2, 4, 8, 6 always repeats. Count mod 4.";
        caption(picture, read.textContent);
      }
      n.input.addEventListener("input", draw);
      draw();
    },

    chance: function (host, still) {
      var sum = slider("Sum of two dice", 2, 12, 7);
      var read = el("p", "readout");
      var picture = svg(640, 250);
      var cells = [];
      var r;
      var c;
      for (r = 1; r <= 6; r++) {
        for (c = 1; c <= 6; c++) {
          var spot = shape("circle", { cx: 150 + c * 52, cy: 20 + r * 34, r: 13, fill: "#0d2422", stroke: "#8fd0c6", "stroke-width": 2 });
          spot.datasetSum = String(r + c);
          picture.append(spot);
          cells.push(spot);
        }
      }
      host.append(picture);
      if (!still) host.append(sum.wrap);
      host.append(read);
      function draw() {
        var want = Number(sum.input.value);
        var hits = 0;
        cells.forEach(function (spot) {
          var on = Number(spot.datasetSum) === want;
          spot.setAttribute("fill", on ? "#e2b15a" : "#0d2422");
          if (on) hits += 1;
        });
        read.textContent = hits + " gold dots out of 36 equally likely throws. Probability " + hits + "/36.";
        caption(picture, read.textContent);
      }
      sum.input.addEventListener("input", draw);
      draw();
    },

    series: function (host, still) {
      var read = el("p", "readout");
      var picture = svg(640, 200);
      var terms = [6, 11, 21, 36, 56, 81];
      var jumps = [5, 10, 15, 20, 25];
      var play = el("button", "play", "Show the jumps");
      play.type = "button";
      host.append(picture);
      if (!still) host.append(play);
      host.append(read);
      function draw(upto) {
        picture.replaceChildren();
        var i;
        for (i = 0; i <= upto && i < terms.length; i++) {
          picture.append(shape("circle", { cx: 50 + i * 100, cy: 80, r: 26, fill: "#e2b15a" }));
          var t = shape("text", { x: 50 + i * 100, y: 86, "text-anchor": "middle", fill: "#1c2430", "font-size": 16, "font-family": "Segoe UI, sans-serif" });
          t.textContent = String(terms[i]);
          picture.append(t);
          if (i < upto && i < jumps.length) {
            var j = shape("text", { x: 100 + i * 100, y: 140, "text-anchor": "middle", fill: "#8fd0c6", "font-size": 16, "font-family": "Segoe UI, sans-serif" });
            j.textContent = "+" + jumps[i];
            picture.append(j);
          }
        }
        read.textContent = upto >= terms.length - 1
          ? "The jumps rise by 5 each time. That rule fits every step shown, so the next jump is 25."
          : "A series rule is kept only when it fits every term, not just the last one.";
        caption(picture, read.textContent);
      }
      draw(still ? terms.length - 1 : 0);
      if (still) return;
      var step = 0;
      var timer = 0;
      play.addEventListener("click", function () {
        clearTimeout(timer);
        step = 0;
        draw(0);
        function next() {
          step += 1;
          draw(step);
          if (step < terms.length - 1 && !reduced()) timer = setTimeout(next, 500);
        }
        if (!reduced()) timer = setTimeout(next, 400);
        else draw(terms.length - 1);
      });
      jobs.push(function () { clearTimeout(timer); });
    }
  };

  function car(color) {
    var g = shape("g", {});
    g.append(shape("rect", { x: 0, y: 0, width: 54, height: 22, rx: 6, fill: color }));
    g.append(shape("circle", { cx: 12, cy: 22, r: 6, fill: "#1c2430" }));
    g.append(shape("circle", { cx: 40, cy: 22, r: 6, fill: "#1c2430" }));
    return g;
  }

  function trim(n) {
    return String(Math.round(n * 100) / 100);
  }

  window.AptitudeVisuals = { mount: mount, thumb: thumb, stop: stop };
})();
