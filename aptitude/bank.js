(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (typeof root !== "undefined") root.AptitudeBank = api;
})(typeof window !== "undefined" ? window : this, function () {
  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      var t = a % b;
      a = b;
      b = t;
    }
    return a || 1;
  }

  function fmt(n) {
    var r = Math.round(n * 100) / 100;
    if (Math.abs(r - Math.round(r)) < 1e-6) return String(Math.round(r));
    return r.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  }

  function frac(n, d) {
    var g = gcd(n, d);
    return (n / g) + "/" + (d / g);
  }

  function ratio(a, b) {
    var g = gcd(Math.round(a), Math.round(b));
    return (Math.round(a) / g) + ":" + (Math.round(b) / g);
  }

  function shuffle(list, seed) {
    var arr = list.slice();
    var s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    for (var i = arr.length - 1; i > 0; i--) {
      s = (s * 48271) % 2147483647;
      var j = s % (i + 1);
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function item(chapter, skill, prompt, answer, wrongs, steps, ok) {
    var correct = String(answer);
    var seen = {};
    seen[correct] = true;
    var extra = [];
    wrongs.forEach(function (w) {
      var s = String(w);
      if (extra.length >= 3 || seen[s]) return;
      seen[s] = true;
      extra.push(s);
    });
    var bump = 1;
    while (extra.length < 3) {
      var filler = "none of " + bump;
      bump += 1;
      if (!seen[filler]) {
        seen[filler] = true;
        extra.push(filler);
      }
    }
    return {
      chapter: chapter,
      skill: skill,
      prompt: prompt,
      choices: shuffle([correct].concat(extra), prompt.length + extra.length),
      answer: correct,
      steps: steps,
      _ok: ok
    };
  }

  function near(n, suffix) {
    return [n + 1, n - 1, n + 2, n - 2, n + 5, n - 5, n * 2, n + 10].map(function (v) {
      return fmt(v) + (suffix || "");
    });
  }

  function take(out, seen, chapter, skill, factory, n) {
    var i = 0;
    var got = 0;
    while (got < n) {
      if (i > n * 8) throw new Error("short " + chapter + " " + skill + " " + got);
      var made = factory(i);
      i += 1;
      if (!made || seen[made.prompt]) continue;
      if (made.choices.indexOf(made.answer) < 0) throw new Error("missing choice " + made.prompt);
      var uniq = {};
      made.choices.forEach(function (c) { uniq[c] = true; });
      if (Object.keys(uniq).length !== 4) throw new Error("choices " + made.prompt);
      if (!made._ok()) throw new Error("math " + made.prompt + " -> " + made.answer);
      delete made._ok;
      made.id = "g-" + chapter + "-" + skill + "-" + got;
      seen[made.prompt] = true;
      out.push(made);
      got += 1;
    }
  }

  function generate() {
    var out = [];
    var seen = {};
    percent(out, seen);
    ratioChapter(out, seen);
    profit(out, seen);
    interest(out, seen);
    speed(out, seen);
    work(out, seen);
    average(out, seen);
    numbers(out, seen);
    chance(out, seen);
    series(out, seen);
    return out;
  }

  function percent(out, seen) {
    var fracs = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6], [1, 8], [3, 8], [5, 8], [7, 8], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20]];
    take(out, seen, "percent", "fraction-percent", function (i) {
      var f = fracs[i];
      var pct = f[0] / f[1] * 100;
      var ans = fmt(pct) + "%";
      return item("percent", "fraction-percent", "What is " + f[0] + "/" + f[1] + " as a percent?", ans, near(pct, "%"), [
        f[0] + "/" + f[1] + " × 100 = " + fmt(pct) + ".",
        "So the percent is " + ans + "."
      ], function () { return Math.abs(parseFloat(ans) - pct) < 0.02; });
    }, 20);

    take(out, seen, "percent", "of-swap", function (i) {
      var x = 5 * (i + 1);
      var y = 20 * ((i % 5) + 2);
      var value = x * y / 100;
      var ans = fmt(value);
      return item("percent", "of-swap", "What is " + x + "% of " + y + "?", ans, near(value), [
        x + "% of " + y + " = " + x + " × " + y + " / 100.",
        "That equals " + ans + ". It is the same as " + y + "% of " + x + "."
      ], function () { return Number(ans) === value; });
    }, 20);

    var pairs = [[10, 10], [10, 20], [20, 10], [20, 20], [25, 20], [20, 25], [10, 40], [40, 10], [50, 10], [10, 50], [25, 4], [4, 25], [50, 20], [20, 50], [10, 30], [30, 10], [40, 20], [20, 40], [25, 40], [40, 25]];
    take(out, seen, "percent", "successive", function (i) {
      var a = pairs[i][0];
      var b = pairs[i][1];
      var net = a + b + a * b / 100;
      var ans = fmt(net) + "%";
      return item("percent", "successive", "A value rises " + a + "% and then rises " + b + "%. What is the net percent increase?", ans, [fmt(a + b) + "%", fmt(net + 2) + "%", fmt(Math.abs(net - a)) + "%"], [
        "Net = a + b + ab/100.",
        a + " + " + b + " + " + (a * b / 100) + " = " + fmt(net) + "."
      ], function () { return Number(fmt(net)) === net; });
    }, 20);

    var bases = [40, 50, 60, 80, 100, 120, 150, 160, 200, 240, 250, 300, 400, 500, 80, 100, 120, 200, 250, 400];
    var rates = [25, 20, 25, 25, 20, 20, 20, 25, 25, 25, 20, 20, 25, 20, 10, 10, 25, 10, 10, 10];
    take(out, seen, "percent", "reverse-percent", function (i) {
      var base = bases[i];
      var r = rates[i];
      var now = base * (100 + r) / 100;
      return item("percent", "reverse-percent", "A number increased by " + r + "% becomes " + fmt(now) + ". What was it?", fmt(base), near(base), [
        "Original = new ÷ (1 + r/100).",
        fmt(now) + " ÷ " + fmt(1 + r / 100) + " = " + fmt(base) + "."
      ], function () { return Math.abs(base * (100 + r) / 100 - now) < 1e-6; });
    }, 20);

    take(out, seen, "percent", "compare", function (i) {
      var x = 5 * (i + 1);
      var less = 100 * x / (100 + x);
      var ans = fmt(less) + "%";
      var wrong = [fmt(x) + "%", fmt(less + 5) + "%", fmt(less - 3) + "%"];
      if (x < 100) wrong.push(fmt(100 * x / (100 - x)) + "%");
      return item("percent", "compare", "A is " + x + "% more than B. B is what percent less than A?", ans, wrong, [
        "Let B = 100. Then A = " + (100 + x) + ".",
        "The gap is " + x + " on " + (100 + x) + ", which is " + ans + "."
      ], function () { return Math.abs(parseFloat(ans) - less) < 0.02; });
    }, 20);
  }

  function ratioChapter(out, seen) {
    take(out, seen, "ratio", "split", function (i) {
      var a = 1 + (i % 4);
      var b = 2 + (i % 3);
      var c = 3 + (i % 2);
      var unit = 4 + i;
      var second = b * unit;
      var total = (a + b + c) * unit;
      return item("ratio", "split", "Divide " + total + " in the ratio " + a + ":" + b + ":" + c + ". What does the second part get?", fmt(second), near(second), [
        "Parts add to " + (a + b + c) + ". One part is " + unit + ".",
        "The second part is " + b + " × " + unit + " = " + second + "."
      ], function () { return second === b * unit; });
    }, 20);

    take(out, seen, "ratio", "chain", function (i) {
      var A = 1 + (i % 5);
      var B = 2 + (i % 4);
      var C = 1 + (i % 3);
      var D = 2 + (i % 5);
      var left = A * C;
      var right = B * D;
      var ans = ratio(left, right);
      return item("ratio", "chain", "a:b = " + A + ":" + B + " and b:c = " + C + ":" + D + ". What is a:c?", ans, [ratio(A, D), ratio(left + 1, right), ratio(A * D, B * C)], [
        "a/c = (a/b) × (b/c) = (" + A + "/" + B + ") × (" + C + "/" + D + ").",
        "That is " + left + ":" + right + ", which reduces to " + ans + "."
      ], function () { return ans === ratio(A * C, B * D); });
    }, 20);

    take(out, seen, "ratio", "mean", function (i) {
      var k = 2 + (i % 5);
      var p = 3 + (i % 4);
      var left = k * k;
      var right = p * p;
      var mid = k * p;
      return item("ratio", "mean", "What is the mean proportional of " + left + " and " + right + "?", fmt(mid), near(mid), [
        "If left:x = x:right, then x² = left × right.",
        "x = " + k + " × " + p + " = " + mid + "."
      ], function () { return mid * mid === left * right; });
    }, 20);

    take(out, seen, "ratio", "ages", function (i) {
      var p = 2 + (i % 5);
      var q = 1 + (i % 4);
      if (p === q) p += 1;
      var k = 3 + i;
      var younger = Math.min(p, q) * k;
      var sum = (p + q) * k;
      return item("ratio", "ages", "Two ages are in the ratio " + p + ":" + q + " and sum to " + sum + ". What is the younger age?", fmt(younger), near(younger), [
        "The parts add to " + (p + q) + ", so one part is " + k + ".",
        "The younger is " + Math.min(p, q) + " parts, which is " + younger + "."
      ], function () { return younger + Math.max(p, q) * k === sum; });
    }, 20);

    take(out, seen, "ratio", "partnership", function (i) {
      var am = (i + 2) * 1000;
      var at = (i % 6) + 1;
      var bm = ((i % 5) + 1) * 1000;
      var bt = (i % 4) + 2;
      var ans = ratio(am * at, bm * bt);
      return item("ratio", "partnership", "A invests " + am + " for " + at + " months. B invests " + bm + " for " + bt + " months. What is the profit ratio A:B?", ans, [ratio(am, bm), ratio(at, bt), ratio(am * at + 1000, bm * bt)], [
        "Share = capital × months.",
        "A:B = " + (am * at) + ":" + (bm * bt) + " = " + ans + "."
      ], function () { return ans === ratio(am * at, bm * bt); });
    }, 20);
  }

  function profit(out, seen) {
    take(out, seen, "profit", "gain-sp", function (i) {
      var cp = (i + 2) * 20;
      var r = [10, 20, 25, 50][i % 4];
      var sp = cp * (100 + r) / 100;
      return item("profit", "gain-sp", "Cost price is " + cp + " and the gain is " + r + "%. What is the selling price?", fmt(sp), near(sp), [
        "Selling price = cost × (100 + gain) / 100.",
        cp + " × " + (100 + r) + " / 100 = " + fmt(sp) + "."
      ], function () { return sp === cp * (100 + r) / 100; });
    }, 20);

    take(out, seen, "profit", "discount", function (i) {
      var mp = (i + 4) * 20;
      var d = [10, 20, 25, 50][i % 4];
      var sp = mp * (100 - d) / 100;
      return item("profit", "discount", "Marked price is " + mp + ". The discount is " + d + "%. What is the selling price?", fmt(sp), near(sp), [
        "Discount is taken on the marked price.",
        mp + " × " + (100 - d) + " / 100 = " + fmt(sp) + "."
      ], function () { return sp === mp * (100 - d) / 100; });
    }, 20);

    take(out, seen, "profit", "markup", function (i) {
      var cp = (i + 2) * 40;
      var m = [10, 20, 25, 50][i % 4];
      var d = [10, 20][i % 2];
      var sp = cp * (100 + m) / 100 * (100 - d) / 100;
      var profit = (sp - cp) / cp * 100;
      var ans = fmt(profit) + "%";
      return item("profit", "markup", "Cost is " + cp + ". It is marked " + m + "% up, then discounted " + d + "%. What is the profit percent?", ans, [fmt(m - d) + "%", fmt(profit + 5) + "%", "0%"], [
        "Multiply the factors: ×" + fmt(1 + m / 100) + " then ×" + fmt(1 - d / 100) + ".",
        "Profit on cost is " + ans + "."
      ], function () { return Math.abs(parseFloat(ans) - profit) < 0.02; });
    }, 20);

    take(out, seen, "profit", "false-weight", function (i) {
      var g = 500 + i * 20;
      var profit = (1000 - g) / g * 100;
      var ans = fmt(profit) + "%";
      return item("profit", "false-weight", "A seller gives " + g + " g for a kilogram and charges the cost price. What is the profit percent?", ans, near(profit, "%"), [
        "Profit% = (1000 − " + g + ") / " + g + " × 100.",
        "That is " + ans + "."
      ], function () { return Math.abs(parseFloat(ans) - profit) < 0.02; });
    }, 20);

    take(out, seen, "profit", "same-sp", function (i) {
      var r = 5 * (i + 1);
      var loss = r * r / 100;
      var ans = fmt(loss) + "% loss";
      return item("profit", "same-sp", "Two items sell at the same price. One gains " + r + "% and the other loses " + r + "%. What is the net result?", ans, [fmt(loss) + "% gain", "no change", fmt(r) + "% loss"], [
        "Same selling price with +r% and −r% loses r²/100 %.",
        r + "² / 100 = " + fmt(loss) + ", so the net result is a loss."
      ], function () { return Math.abs(parseFloat(ans) - loss) < 0.02; });
    }, 20);
  }

  function interest(out, seen) {
    take(out, seen, "interest", "si", function (i) {
      var p = (i + 1) * 500;
      var r = [4, 5, 8, 10, 12][i % 5];
      var t = [2, 3, 4][i % 3];
      var si = p * r * t / 100;
      return item("interest", "si", "Simple interest on " + p + " at " + r + "% for " + t + " years is:", fmt(si), near(si), [
        "SI = P × R × T / 100.",
        p + " × " + r + " × " + t + " / 100 = " + fmt(si) + "."
      ], function () { return si === p * r * t / 100; });
    }, 20);

    take(out, seen, "interest", "ci", function (i) {
      var yearly = i % 2 === 0;
      var r = yearly ? 10 : 20;
      var p = yearly ? (i + 2) * 100 : (i + 2) * 25;
      var factor = r === 10 ? 0.21 : 0.44;
      var ci = p * factor;
      return item("interest", "ci", "Compound interest on " + p + " at " + r + "% for 2 years, compounded yearly, is:", fmt(ci), near(ci), [
        "Two-year factor is (1 + r/100)² − 1.",
        "Interest = " + p + " × " + factor + " = " + fmt(ci) + "."
      ], function () { return Math.abs(ci - p * (Math.pow(1 + r / 100, 2) - 1)) < 1e-6; });
    }, 20);

    take(out, seen, "interest", "ci-si", function (i) {
      var p = (i + 1) * 1000;
      var gap = p * 0.01;
      return item("interest", "ci-si", "On " + p + " at 10% for 2 years, how much more is compound interest than simple interest?", fmt(gap), near(gap), [
        "For two yearly compounds, CI − SI = P × (R/100)².",
        p + " × 0.01 = " + fmt(gap) + "."
      ], function () { return gap === p * 0.01; });
    }, 20);

    take(out, seen, "interest", "double", function (i) {
      var t = i + 4;
      var rate = 100 / t;
      var ans = fmt(rate) + "%";
      return item("interest", "double", "A sum doubles in " + t + " years at simple interest. What is the yearly rate?", ans, near(rate, "%"), [
        "Doubling needs R × T = 100.",
        "R = 100 / " + t + " = " + ans + "."
      ], function () { return Math.abs(parseFloat(ans) - rate) < 0.011; });
    }, 20);

    take(out, seen, "interest", "half-year", function (i) {
      var p = (i + 1) * 1000;
      var ci = p * 0.21;
      return item("interest", "half-year", p + " is lent at 20% compounded half-yearly for 1 year. What is the compound interest?", fmt(ci), near(ci), [
        "Half-yearly turns 20% into two steps of 10%.",
        "Factor 1.21, so interest = " + p + " × 0.21 = " + fmt(ci) + "."
      ], function () { return Math.abs(ci - p * (1.1 * 1.1 - 1)) < 1e-6; });
    }, 20);
  }

  function speed(out, seen) {
    take(out, seen, "speed", "dst", function (i) {
      var v = 10 * (i + 2);
      var minutes = [15, 30, 45, 60, 90][i % 5];
      var dist = v * minutes / 60;
      var ans = fmt(dist) + " km";
      return item("speed", "dst", "A vehicle travels at " + v + " km/h for " + minutes + " minutes. How far does it go?", ans, near(dist, " km"), [
        minutes + " minutes = " + fmt(minutes / 60) + " hour.",
        v + " × " + fmt(minutes / 60) + " = " + fmt(dist) + " km."
      ], function () { return Math.abs(dist - v * minutes / 60) < 1e-6; });
    }, 20);

    take(out, seen, "speed", "convert", function (i) {
      var kmh = 18 * (i + 1);
      var ms = kmh * 5 / 18;
      return item("speed", "convert", kmh + " km/h is how many metres per second?", fmt(ms), near(ms), [
        "Multiply km/h by 5/18.",
        kmh + " × 5/18 = " + fmt(ms) + "."
      ], function () { return ms === kmh * 5 / 18; });
    }, 20);

    take(out, seen, "speed", "average-speed", function (i) {
      var a = 10 * (i + 2);
      var b = 10 * (i + 4);
      var avg = 2 * a * b / (a + b);
      var ans = fmt(avg) + " km/h";
      return item("speed", "average-speed", "Equal distances are covered at " + a + " km/h and " + b + " km/h. What is the average speed?", ans, [fmt((a + b) / 2) + " km/h"].concat(near(avg, " km/h")), [
        "Equal distances use 2ab/(a+b), not the ordinary mean.",
        "2 × " + a + " × " + b + " / " + (a + b) + " = " + fmt(avg) + "."
      ], function () { return Math.abs(parseFloat(ans) - avg) < 0.02; });
    }, 15);

    take(out, seen, "speed", "train", function (i) {
      var ms = 5 * (i + 2);
      var seconds = 4 + (i % 6);
      var length = ms * seconds;
      var kmh = ms * 18 / 5;
      return item("speed", "train", "A " + length + " m train runs at " + kmh + " km/h. How long does it take to pass a pole?", seconds + " s", near(seconds, " s"), [
        kmh + " km/h = " + ms + " m/s.",
        "A pole uses only the train length: " + length + " / " + ms + " = " + seconds + " s."
      ], function () { return length / ms === seconds; });
    }, 15);

    take(out, seen, "speed", "boats", function (i) {
      var up = 2 * (i + 4);
      var down = up + 2 * (2 + (i % 4));
      var stream = (down - up) / 2;
      var ans = fmt(stream) + " km/h";
      return item("speed", "boats", "Downstream speed is " + down + " km/h and upstream is " + up + " km/h. What is the speed of the stream?", ans, near(stream, " km/h"), [
        "Stream = (down − up) / 2.",
        "(" + down + " − " + up + ") / 2 = " + fmt(stream) + "."
      ], function () { return stream === (down - up) / 2; });
    }, 15);

    take(out, seen, "speed", "meet", function (i) {
      var s1 = 10 + i;
      var s2 = 12 + (i % 7);
      var hours = 1 + (i % 4);
      var dist = (s1 + s2) * hours;
      var ans = hours + " h";
      return item("speed", "meet", "Two riders are " + dist + " km apart and ride toward each other at " + s1 + " and " + s2 + " km/h. When do they meet?", ans, near(hours, " h"), [
        "Closing speed = " + s1 + " + " + s2 + " = " + (s1 + s2) + " km/h.",
        dist + " / " + (s1 + s2) + " = " + hours + " h."
      ], function () { return dist / (s1 + s2) === hours; });
    }, 15);
  }

  function work(out, seen) {
    take(out, seen, "work", "together", function (i) {
      var a = 6 + i;
      var b = a + 2 + (i % 5);
      var days = a * b / (a + b);
      var ans = fmt(days) + " days";
      return item("work", "together", "A finishes a job in " + a + " days and B in " + b + " days. How long do they take together?", ans, near(days, " days"), [
        "Together = ab/(a+b).",
        a + " × " + b + " / " + (a + b) + " = " + fmt(days) + " days."
      ], function () { return Math.abs(parseFloat(ans) - days) < 0.02; });
    }, 20);

    take(out, seen, "work", "one-left", function (i) {
      var a = 12 + i;
      var t = 6 + (i % 5);
      if (a <= t) a = t + 4 + i;
      var b = a * t / (a - t);
      var ans = fmt(b) + " days";
      return item("work", "one-left", "A and B together finish in " + t + " days. A alone finishes in " + a + " days. How long does B alone take?", ans, near(b, " days"), [
        "1/B = 1/" + t + " − 1/" + a + ".",
        "B takes " + fmt(b) + " days."
      ], function () { return Math.abs(1 / t - 1 / a - 1 / b) < 1e-8; });
    }, 20);

    take(out, seen, "work", "pipes", function (i) {
      var a = 2 + (i % 6);
      var b = a + 2 + (i % 5);
      var hours = a * b / (b - a);
      var ans = fmt(hours) + " h";
      return item("work", "pipes", "A tap fills a tank in " + a + " hours. A leak empties it in " + b + " hours. With both open, how long to fill?", ans, near(hours, " h"), [
        "Time = ab/(b−a).",
        a + " × " + b + " / " + (b - a) + " = " + fmt(hours) + " h."
      ], function () { return Math.abs(parseFloat(ans) - a * b / (b - a)) < 0.02; });
    }, 15);

    take(out, seen, "work", "men-days", function (i) {
      var m1 = 6 + (i % 5);
      var m2 = 3 + (i % 6);
      var d1 = m2;
      var d2 = m1;
      return item("work", "men-days", m1 + " people finish a job in " + d1 + " days. How many days do " + m2 + " people need for the same job?", fmt(d2), near(d2), [
        "People × days stays constant.",
        m1 + " × " + d1 + " = " + m2 + " × " + d2 + "."
      ], function () { return m1 * d1 === m2 * d2; });
    }, 15);

    take(out, seen, "work", "efficiency", function (i) {
      var a = i + 4;
      var b = a * 2;
      return item("work", "efficiency", "A is twice as efficient as B. B finishes in " + b + " days. How long does A take?", a + " days", near(a, " days"), [
        "Twice the efficiency means half the time.",
        "A takes " + a + " days."
      ], function () { return b === a * 2; });
    }, 15);

    take(out, seen, "work", "partial", function (i) {
      var a = 10 + i;
      var worked = 2;
      var restDays = a - worked;
      return item("work", "partial", "A can finish in " + a + " days and works for " + worked + " days. B finishes the rest in " + restDays + " days. How long would B take alone?", a + " days", near(a, " days"), [
        "A left " + restDays + "/" + a + " of the job.",
        "B did that in " + restDays + " days, so a whole job takes " + a + " days."
      ], function () {
        var left = (a - worked) / a;
        return Math.abs(restDays / left - a) < 1e-6;
      });
    }, 15);
  }

  function average(out, seen) {
    take(out, seen, "average", "plain-avg", function (i) {
      var start = i + 2;
      var nums = [start, start + 3, start + 6, start + 9];
      var avg = (nums[0] + nums[1] + nums[2] + nums[3]) / 4;
      return item("average", "plain-avg", "What is the average of " + nums.join(", ") + "?", fmt(avg), near(avg), [
        "Sum = " + (avg * 4) + ".",
        "Average = " + (avg * 4) + " / 4 = " + fmt(avg) + "."
      ], function () { return avg * 4 === nums[0] + nums[1] + nums[2] + nums[3]; });
    }, 20);

    take(out, seen, "average", "remove", function (i) {
      var oldAvg = 12 + i;
      var removed = 20 + i * 2;
      var newAvg = (6 * oldAvg - removed) / 5;
      return item("average", "remove", "Six numbers average " + oldAvg + ". After one is removed, the average of the rest is " + fmt(newAvg) + ". What was removed?", fmt(removed), near(removed), [
        "Old sum = " + (6 * oldAvg) + ". New sum = " + fmt(5 * newAvg) + ".",
        "Removed = " + fmt(removed) + "."
      ], function () { return Math.abs(6 * oldAvg - removed - 5 * newAvg) < 1e-6; });
    }, 15);

    take(out, seen, "average", "join", function (i) {
      var n = 10 + i;
      var oldAvg = 15;
      var newAvg = 16;
      var person = (n + 1) * newAvg - n * oldAvg;
      return item("average", "join", n + " people average " + oldAvg + ". One more joins and the average becomes " + newAvg + ". What is the newcomer's value?", fmt(person), near(person), [
        "New sum − old sum = the newcomer.",
        (n + 1) + " × " + newAvg + " − " + n + " × " + oldAvg + " = " + person + "."
      ], function () { return person === (n + 1) * newAvg - n * oldAvg; });
    }, 15);

    take(out, seen, "average", "alligation", function (i) {
      var cheap = 10 + i * 2;
      var gap = 10 + (i % 3) * 10;
      var dear = cheap + 40;
      var mean = cheap + gap;
      var ans = ratio(dear - mean, mean - cheap);
      return item("average", "alligation", "Prices " + cheap + " and " + dear + " are mixed to a mean of " + mean + ". What is cheaper:dearer?", ans, [ratio(mean - cheap, dear - mean), "1:1", ratio(cheap, dear)], [
        "Cheaper:dearer = (dearer − mean):(mean − cheaper).",
        "(" + (dear - mean) + "):(" + (mean - cheap) + ") = " + ans + "."
      ], function () { return cheap < mean && mean < dear && ans === ratio(dear - mean, mean - cheap); });
    }, 20);

    take(out, seen, "average", "innings", function (i) {
      var n = 5 + i;
      var oldAvg = 20;
      var neu = 22;
      var score = (n + 1) * neu - n * oldAvg;
      return item("average", "innings", "After " + n + " innings the average is " + oldAvg + ". After the next innings it is " + neu + ". What was scored in that innings?", fmt(score), near(score), [
        "Next score = new sum − old sum.",
        (n + 1) + " × " + neu + " − " + n + " × " + oldAvg + " = " + score + "."
      ], function () { return score === (n + 1) * neu - n * oldAvg; });
    }, 15);

    take(out, seen, "average", "weighted", function (i) {
      var w1 = (i % 4) + 1;
      var w2 = (i % 5) + 2;
      var p1 = 10 + i;
      var p2 = 30 + i;
      var mean = (w1 * p1 + w2 * p2) / (w1 + w2);
      var ans = fmt(mean);
      return item("average", "weighted", w1 + " kg at " + p1 + " per kg is mixed with " + w2 + " kg at " + p2 + " per kg. What is the mean price?", ans, near(mean), [
        "Mean = total value / total weight.",
        "(" + (w1 * p1) + " + " + (w2 * p2) + ") / " + (w1 + w2) + " = " + ans + "."
      ], function () { return Math.abs(parseFloat(ans) - mean) < 0.02; });
    }, 15);
  }

  function numbers(out, seen) {
    take(out, seen, "numbers", "div9", function (i) {
      var n = 1008 + 9 * i;
      var opts = [String(n - 1), String(n), String(n + 1), String(n + 2)];
      return item("numbers", "div9", "Which of these is divisible by 9: " + opts.join(", ") + "?", String(n), opts.filter(function (x) { return x !== String(n); }), [
        "Add the digits of " + n + ".",
        "The sum is a multiple of 9, so " + n + " is divisible by 9."
      ], function () { return n % 9 === 0 && (n - 1) % 9 !== 0; });
    }, 20);

    var cycles = { 2: [2, 4, 8, 6], 3: [3, 9, 7, 1], 4: [4, 6], 7: [7, 9, 3, 1], 8: [8, 4, 2, 6], 9: [9, 1] };
    var bases = [2, 3, 4, 7, 8, 9];
    take(out, seen, "numbers", "unit", function (i) {
      var base = bases[i % bases.length];
      var exp = i + 2;
      var cycle = cycles[base];
      var digit = cycle[(exp - 1) % cycle.length];
      return item("numbers", "unit", "What is the unit digit of " + base + "^" + exp + "?", String(digit), ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], [
        "The unit digits of powers of " + base + " cycle " + cycle.join(", ") + ".",
        "Exponent " + exp + " lands on " + digit + "."
      ], function () { return digit === cycle[(exp - 1) % cycle.length]; });
    }, 20);

    take(out, seen, "numbers", "lcm", function (i) {
      var a = i + 4;
      var b = i + 7;
      var l = a * b / gcd(a, b);
      return item("numbers", "lcm", "What is the LCM of " + a + " and " + b + "?", fmt(l), near(l), [
        "LCM = product / HCF.",
        a + " × " + b + " / " + gcd(a, b) + " = " + fmt(l) + "."
      ], function () { return l === a * b / gcd(a, b); });
    }, 15);

    take(out, seen, "numbers", "hcf", function (i) {
      var k = i + 2;
      var a = k * 4;
      var b = k * 6;
      var h = k * 2;
      return item("numbers", "hcf", "What is the HCF of " + a + " and " + b + "?", fmt(h), near(h), [
        a + " = " + k + " × 4 and " + b + " = " + k + " × 6.",
        "The highest common factor is " + h + "."
      ], function () { return gcd(a, b) === h; });
    }, 15);

    take(out, seen, "numbers", "remainder", function (i) {
      var a = i + 4;
      var b = i + 6;
      var m = a * b / gcd(a, b);
      var answer = m + 1;
      return item("numbers", "remainder", "What is the smallest number that leaves remainder 1 when divided by both " + a + " and " + b + "?", fmt(answer), near(answer), [
        "The number is a multiple of the LCM, plus 1.",
        "LCM of " + a + " and " + b + " is " + m + ", so the smallest is " + answer + "."
      ], function () { return answer % a === 1 && answer % b === 1; });
    }, 15);

    take(out, seen, "numbers", "square", function (i) {
      var a = i + 1;
      var n = 10 * a + 5;
      var square = n * n;
      return item("numbers", "square", "What is " + n + "²?", fmt(square), near(square), [
        "For a number ending in 5, write a×(a+1) and then 25.",
        a + " × " + (a + 1) + " followed by 25 is " + square + "."
      ], function () { return square === n * n; });
    }, 15);
  }

  function chance(out, seen) {
    var coins = [
      ["A fair coin is tossed twice. What is the probability of two heads?", 1, 4],
      ["A fair coin is tossed twice. What is the probability of two tails?", 1, 4],
      ["A fair coin is tossed twice. What is the probability of exactly one head?", 1, 2],
      ["A fair coin is tossed twice. What is the probability of at least one head?", 3, 4],
      ["A fair coin is tossed twice. What is the probability both tosses match?", 1, 2],
      ["A fair coin is tossed three times. What is the probability of three heads?", 1, 8],
      ["A fair coin is tossed three times. What is the probability of exactly two heads?", 3, 8],
      ["A fair coin is tossed three times. What is the probability of exactly one head?", 3, 8],
      ["A fair coin is tossed three times. What is the probability of no heads?", 1, 8],
      ["A fair coin is tossed three times. What is the probability of at least two heads?", 1, 2],
      ["A fair coin is tossed three times. What is the probability of at least one head?", 7, 8],
      ["A fair coin is tossed twice. What is the probability of no heads?", 1, 4],
      ["A fair coin is tossed twice. What is the probability of at least one tail?", 3, 4],
      ["A fair coin is tossed three times. What is the probability of exactly three tails?", 1, 8],
      ["A fair coin is tossed three times. What is the probability of more heads than tails?", 1, 2]
    ];
    take(out, seen, "chance", "coins", function (i) {
      var row = coins[i];
      return item("chance", "coins", row[0], frac(row[1], row[2]), ["1/2", "1/3", "1/4", "1/8", "3/4", "3/8", "7/8"], [
        "Count the favourable outcomes and divide by all equally likely outcomes.",
        "The probability is " + frac(row[1], row[2]) + "."
      ], function () { return true; });
    }, 15);

    var dice = [
      [1, 5, 6, "greater than 1"],
      [2, 4, 6, "greater than 2"],
      [3, 3, 6, "greater than 3"],
      [4, 2, 6, "greater than 4"],
      [5, 1, 6, "greater than 5"],
      [2, 1, 6, "less than 2"],
      [3, 2, 6, "less than 3"],
      [4, 3, 6, "less than 4"],
      [5, 4, 6, "less than 5"],
      [0, 3, 6, "even"],
      [0, 3, 6, "odd"],
      [0, 3, 6, "prime"],
      [0, 2, 6, "a multiple of 3"],
      [0, 2, 6, "at least 5"],
      [0, 2, 6, "at most 2"],
      [0, 1, 6, "a 6"]
    ];
    take(out, seen, "chance", "die", function (i) {
      var row = dice[i];
      var ans = frac(row[1], row[2]);
      var label = row[3];
      return item("chance", "die", "A fair die is rolled. What is the probability of " + label + "?", ans, ["1/6", "1/3", "1/2", "2/3", "5/6"], [
        "There are 6 faces.",
        label.charAt(0).toUpperCase() + label.slice(1) + " covers " + row[1] + " of them, so " + ans + "."
      ], function () { return ans === frac(row[1], row[2]); });
    }, 16);

    take(out, seen, "chance", "bag", function (i) {
      var red = i + 1;
      var blue = 12 + (i % 5);
      var ans = frac(red, red + blue);
      return item("chance", "bag", "A bag has " + red + " red and " + blue + " blue marbles. What is the probability of drawing red?", ans, [frac(blue, red + blue), frac(red, blue), "1/2"], [
        "Red out of the total.",
        red + " / " + (red + blue) + " = " + ans + "."
      ], function () { return ans === frac(red, red + blue); });
    }, 20);

    var ways = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1 };
    var diceExtra = [
      ["at least 10", 6],
      ["at most 4", 6],
      ["a double", 6],
      ["an even sum", 18],
      ["an odd sum", 18]
    ];
    take(out, seen, "chance", "dice-sum", function (i) {
      if (i < 11) {
        var sum = i + 2;
        var ans = frac(ways[sum], 36);
        return item("chance", "dice-sum", "Two fair dice are rolled. What is the probability that the sum is " + sum + "?", ans, ["1/6", "1/9", "1/12", "1/18", "1/36", "5/36"], [
          "Two dice have 36 outcomes.",
          "Sum " + sum + " happens in " + ways[sum] + " ways, so " + ans + "."
        ], function () { return ans === frac(ways[sum], 36); });
      }
      var extra = diceExtra[i - 11];
      var ansExtra = frac(extra[1], 36);
      return item("chance", "dice-sum", "Two fair dice are rolled. What is the probability of " + extra[0] + "?", ansExtra, ["1/6", "1/9", "1/4", "1/2", "1/12", "1/18"], [
        "Two dice have 36 outcomes.",
        extra[0].charAt(0).toUpperCase() + extra[0].slice(1) + " covers " + extra[1] + " of them, so " + ansExtra + "."
      ], function () { return ansExtra === frac(extra[1], 36); });
    }, 16);

    var cards = [
      ["it is a king", 4, 52],
      ["it is a heart", 13, 52],
      ["it is red", 26, 52],
      ["it is a face card", 12, 52],
      ["it is an ace", 4, 52],
      ["it is a black king", 2, 52],
      ["it is an ace or a king", 8, 52],
      ["it is not a heart", 39, 52],
      ["it is a queen", 4, 52],
      ["it is a diamond", 13, 52],
      ["it is a club", 13, 52],
      ["it is a black card", 26, 52],
      ["it is a jack", 4, 52],
      ["it is a red ace", 2, 52],
      ["it is not an ace", 48, 52],
      ["it is a spade", 13, 52],
      ["it is a ten", 4, 52]
    ];
    take(out, seen, "chance", "cards", function (i) {
      var row = cards[i];
      var ans = frac(row[1], row[2]);
      return item("chance", "cards", "One card is drawn from a 52-card deck. What is the probability " + row[0] + "?", ans, ["1/13", "1/4", "1/2", "1/26", "2/13", "3/13", "3/4"], [
        row[1] + " favourable cards out of 52.",
        "The probability is " + ans + "."
      ], function () { return ans === frac(row[1], 52); });
    }, 17);

    take(out, seen, "chance", "both", function (i) {
      var a = (i % 5) + 1;
      var b = (Math.floor(i / 5) % 4) + 1;
      var ans = frac(a * b, 30);
      return item("chance", "both", "P(A) = " + a + "/6 and P(B) = " + b + "/5. The events are independent. What is P(both)?", ans, [frac(a, 6), frac(b, 5), frac(a + b, 30)], [
        "Independent events multiply.",
        "(" + a + "/6) × (" + b + "/5) = " + ans + "."
      ], function () { return ans === frac(a * b, 30); });
    }, 16);
  }

  function series(out, seen) {
    take(out, seen, "series", "product", function (i) {
      var n = i + 1;
      var terms = [n * (n + 1), (n + 1) * (n + 2), (n + 2) * (n + 3), (n + 3) * (n + 4)];
      var next = (n + 4) * (n + 5);
      return item("series", "product", terms.join(", ") + ", ?", fmt(next), near(next), [
        "Each term is k(k+1), and k increases by 1.",
        "The next term is " + (n + 4) + " × " + (n + 5) + " = " + next + "."
      ], function () { return next === (n + 4) * (n + 5); });
    }, 20);

    take(out, seen, "series", "times", function (i) {
      var start = 2 + i;
      var mult = 2 + (i % 3);
      var a = start;
      var b = a * mult;
      var c = b * mult;
      var d = c * mult;
      var next = d * mult;
      return item("series", "times", [a, b, c, d].join(", ") + ", ?", fmt(next), near(next), [
        "Each term is multiplied by " + mult + ".",
        d + " × " + mult + " = " + next + "."
      ], function () { return next === start * Math.pow(mult, 4); });
    }, 16);

    take(out, seen, "series", "cubes", function (i) {
      var n = i + 1;
      var terms = [n, n + 1, n + 2, n + 3].map(function (k) { return k * k * k; });
      var next = (n + 4) * (n + 4) * (n + 4);
      return item("series", "cubes", terms.join(", ") + ", ?", fmt(next), near(next), [
        "These are consecutive cubes.",
        "Next is " + (n + 4) + "³ = " + next + "."
      ], function () { return next === Math.pow(n + 4, 3); });
    }, 16);

    take(out, seen, "series", "second-diff", function (i) {
      var a = i + 2;
      var jumps = [2, 4, 6, 8];
      var terms = [a];
      jumps.forEach(function (j) { terms.push(terms[terms.length - 1] + j); });
      var next = terms[terms.length - 1] + 10;
      return item("series", "second-diff", terms.join(", ") + ", ?", fmt(next), near(next), [
        "The jumps are 2, 4, 6, 8.",
        "The next jump is 10, so the next term is " + next + "."
      ], function () { return next === a + 2 + 4 + 6 + 8 + 10; });
    }, 16);

    take(out, seen, "series", "alternate", function (i) {
      var start = 3 + i;
      var d = 2 + (i % 4);
      var terms = [start];
      var x = start;
      var k;
      for (k = 0; k < 4; k++) {
        if (k % 2 === 0) x = x * 2;
        else x = x - d;
        terms.push(x);
      }
      var next = terms[terms.length - 1] * 2;
      return item("series", "alternate", terms.join(", ") + ", ?", fmt(next), near(next), [
        "The steps alternate ×2 and −" + d + ".",
        "The next step is ×2, so " + next + "."
      ], function () {
        var y = start;
        var t;
        for (t = 0; t < 5; t++) {
          if (t % 2 === 0) y = y * 2;
          else y = y - d;
        }
        return y === next;
      });
    }, 16);

    var squares = [36, 49, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484];
    take(out, seen, "series", "odd-one", function (i) {
      var stranger = squares[i];
      var list = [8, 27, 125, 343, stranger];
      return item("series", "odd-one", "Which number does not belong: " + list.join(", ") + "?", String(stranger), ["8", "27", "125", "343"], [
        "8, 27, 125 and 343 are cubes.",
        stranger + " is not a cube."
      ], function () {
        return stranger !== 8 && stranger !== 27 && stranger !== 125 && stranger !== 343;
      });
    }, 16);
  }

  return { generate: generate };
});
