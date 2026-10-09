/* ============================================================
   Puzzle of the day (loaded only on /lab/)
   • The day turns over at midnight London time, so everyone sees the same puzzle.
   • Puzzle types come from a deck shuffled once per cycle, so none repeats until
     every type has had a day; the numbers inside are seeded by the date.
   • Where a puzzle can be simulated, Reveal runs it thousands of times and draws
     the estimate settling on the exact answer.
   Dependency-free; builds DOM nodes, never parses HTML. Also loads in Node for checks.
   ============================================================ */
(function () {
  "use strict";

  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function fact(n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
  function C(n, k) { if (k < 0 || k > n) return 0; k = Math.min(k, n - k); var r = 1; for (var i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); }
  function rint(rand, n) { return Math.floor(rand() * n); }
  function shuffled(n, rand) { var a = []; for (var i = 0; i < n; i++) a.push(i); for (var j = n - 1; j > 0; j--) { var k = rint(rand, j + 1), t = a[j]; a[j] = a[k]; a[k] = t; } return a; }
  function derange(n) { var d = [1, 0]; for (var i = 2; i <= n; i++) d.push((i - 1) * (d[i - 1] + d[i - 2])); return d[n]; }
  function harmonic(m) { var h = 0; for (var i = 1; i <= m; i++) h += 1 / i; return h; }
  function round(x, p) { var f = Math.pow(10, p); return Math.round(x * f) / f; }

  // Each type: make(ri, pick) -> {q, kind: "pct" | "num" | "int", val, why, hint, sim?}.
  // pct values are percentages; sim(rand) returns 1/0 (pct), a number (num) or null to skip a trial.
  var TYPES = [
    { family: "Chance", make: function (ri) {
      var n = ri(18, 40), p = 1; for (var i = 0; i < n; i++) p *= (365 - i) / 365;
      return { q: "In a room of " + n + " people, what's the probability that at least two share a birthday?", kind: "pct", val: (1 - p) * 100,
        why: "1 − (365 × 364 × … × " + (366 - n) + ") / 365^" + n + ". It passes 50% at just 23 people.",
        hint: "Work out the chance that every birthday is different, then subtract from 1.",
        sim: function (r) { var seen = {}; for (var i = 0; i < n; i++) { var b = rint(r, 365); if (seen[b]) return 1; seen[b] = 1; } return 0; } };
    } },
    { family: "Chance", make: function (ri) {
      var n = ri(3, 12);
      return { q: "You roll a fair die " + n + " times. What's the probability of at least one six?", kind: "pct", val: (1 - Math.pow(5 / 6, n)) * 100,
        why: "1 − (5/6)^" + n + ".", hint: "What's the chance of no six at all?",
        sim: function (r) { for (var i = 0; i < n; i++) if (rint(r, 6) === 5) return 1; return 0; } };
    } },
    { family: "Chance", make: function (ri) {
      var n = ri(6, 12), k = ri(2, n - 2);
      return { q: "Flip a fair coin " + n + " times. What's the probability of exactly " + k + " heads?", kind: "pct", val: C(n, k) / Math.pow(2, n) * 100,
        why: "C(" + n + "," + k + ") / 2^" + n + " = " + C(n, k) + "/" + Math.pow(2, n) + ".",
        hint: "Count the sequences with exactly " + k + " heads, then divide by all 2^" + n + " sequences.",
        sim: function (r) { var h = 0; for (var i = 0; i < n; i++) h += r() < 0.5 ? 1 : 0; return h === k ? 1 : 0; } };
    } },
    { family: "Chance", make: function (ri) {
      var red = ri(3, 8), blue = ri(3, 8), t = red + blue;
      return { q: "A bag holds " + red + " red and " + blue + " blue balls. You draw two without putting the first back. What's the probability both are red?", kind: "pct",
        val: red / t * (red - 1) / (t - 1) * 100, why: "(" + red + "/" + t + ") × (" + (red - 1) + "/" + (t - 1) + ").",
        hint: "Multiply the chance the first is red by the chance the second is red, given the first was.",
        sim: function (r) { return rint(r, t) < red && rint(r, t - 1) < red - 1 ? 1 : 0; } };
    } },
    { family: "Counting", make: function (ri) {
      var n = ri(6, 14), k = ri(2, 5);
      return { q: "How many ways can you choose " + k + " items from " + n + ", if order doesn't matter?", kind: "int", val: C(n, k),
        why: "C(" + n + "," + k + ") = " + n + "! / (" + k + "! × " + (n - k) + "!).", hint: "Count ordered picks, then divide by the " + k + "! orders of each group." };
    } },
    { family: "Counting", make: function (ri) {
      var n = ri(4, 7);
      return { q: "How many ways can you arrange " + n + " different books on a shelf?", kind: "int", val: fact(n),
        why: n + "! = " + n + " × " + (n - 1) + " × … × 1.", hint: n + " choices for the first slot, " + (n - 1) + " for the next, and so on." };
    } },
    { family: "Counting", make: function (ri) {
      var n = ri(5, 12);
      return { q: n + " people each shake hands once with everyone else. How many handshakes happen?", kind: "int", val: C(n, 2),
        why: "C(" + n + ",2) = " + n + " × " + (n - 1) + " / 2.", hint: "Each handshake is a pair of people." };
    } },
    { family: "Chance", make: function (ri) {
      var n = ri(4, 8), d = derange(n);
      return { q: n + " people leave their hats at a party and each picks one up at random on the way out. What's the probability that nobody gets their own hat?", kind: "pct",
        val: d / fact(n) * 100, why: "Arrangements with nobody in their own place (derangements): " + d + " of " + fact(n) + ". As the group grows this tends to 1/e ≈ 36.8%.",
        hint: "Count the shuffles where no hat goes home, or guess: for big groups the answer barely changes.",
        sim: function (r) { var a = shuffled(n, r); for (var i = 0; i < n; i++) if (a[i] === i) return 0; return 1; } };
    } },
    { family: "Expected value", make: function (ri) {
      var m = ri(3, 10);
      return { q: "Each cereal box holds one of " + m + " different stickers, all equally likely. On average, how many boxes do you open to collect all " + m + "?", kind: "num",
        val: m * harmonic(m), why: m + " × (1 + 1/2 + … + 1/" + m + ") ≈ " + round(m * harmonic(m), 2) + ". The last sticker alone takes " + m + " boxes on average.",
        hint: "Once you have k stickers, the next new one takes " + m + "/(" + m + " − k) boxes on average. Add those up.",
        sim: function (r) { var got = {}, have = 0, boxes = 0; while (have < m) { boxes++; var s = rint(r, m); if (!got[s]) { got[s] = 1; have++; } } return boxes; } };
    } },
    { family: "Conditional", make: function (ri, pick) {
      var n = pick([50, 100, 200, 500, 1000]), sens = pick([90, 95, 99]), fpr = pick([1, 2, 5, 10]), p = 1 / n, s = sens / 100, f = fpr / 100;
      return { q: "A disease affects 1 in " + n + " people. A test catches " + sens + "% of cases but also flags " + fpr + "% of healthy people. You test positive. What's the probability you have the disease?", kind: "pct",
        val: s * p / (s * p + f * (1 - p)) * 100, why: "True positives / all positives = " + sens + "% × 1/" + n + " ÷ (" + sens + "% × 1/" + n + " + " + fpr + "% × " + (n - 1) + "/" + n + "). Rare diseases make most positives false.",
        hint: "Imagine " + (n * 100).toLocaleString("en-GB") + " people. How many are ill and test positive, and how many are well and test positive?",
        sim: function (r) { var ill = r() < p, pos = ill ? r() < s : r() < f; return pos ? (ill ? 1 : 0) : null; } };
    } },
    { family: "Conditional", make: function (ri) {
      var n = ri(3, 8);
      return { q: "A game show has " + n + " doors, one hiding a car. You pick a door; the host, who knows where the car is, opens one other door with nothing behind it. You switch to one of the other closed doors at random. What's the probability you win the car?", kind: "pct",
        val: (n - 1) / (n * (n - 2)) * 100, why: "Your first pick is wrong (" + (n - 1) + "/" + n + "), and then the car is behind one of the " + (n - 2) + " doors you could switch to: (" + (n - 1) + "/" + n + ") × (1/" + (n - 2) + ").",
        hint: "Switching wins only if your first pick was wrong. Then how many doors could you switch to?",
        sim: function (r) {
          var car = rint(r, n), shut = []; for (var i = 1; i < n; i++) if (i !== car) shut.push(i);
          var opened = shut[rint(r, shut.length)], options = [];
          for (var j = 1; j < n; j++) if (j !== opened) options.push(j);
          return options[rint(r, options.length)] === car ? 1 : 0;
        } };
    } },
    { family: "Waiting", make: function (ri, pick) {
      var p = pick([0.1, 0.15, 0.2, 0.25, 0.3]), k = ri(3, 10);
      return { q: "Each minute, a bus turns up with probability " + p + ", independently of other minutes. What's the probability you wait more than " + k + " minutes?", kind: "pct",
        val: Math.pow(1 - p, k) * 100, why: "(1 − " + p + ")^" + k + ": " + k + " empty minutes in a row.", hint: "Waiting more than " + k + " minutes means the first " + k + " minutes all go by with no bus.",
        sim: function (r) { for (var i = 0; i < k; i++) if (r() < p) return 0; return 1; } };
    } },
    { family: "Waiting", make: function (ri) {
      var lam = ri(4, 12), t = ri(1, 4) * 5;
      return { q: "Buses arrive at random, " + lam + " an hour on average. What's the probability that no bus comes in the next " + t + " minutes?", kind: "pct",
        val: Math.exp(-lam * t / 60) * 100, why: "e^(−" + lam + " × " + t + "/60) = e^(−" + round(lam * t / 60, 2) + "). You expect " + round(lam * t / 60, 2) + " buses in that time.",
        hint: "With random arrivals, the chance of none is e raised to minus the number you expect.",
        sim: function (r) { return -Math.log(1 - r()) / lam * 60 > t ? 1 : 0; } };
    } },
    { family: "Geometry", make: function (ri, pick) {
      var s = pick([0.5, 0.8, 1.2, 1.5]);
      return { q: "Pick two numbers at random between 0 and 1. What's the probability that their sum is less than " + s + "?", kind: "pct",
        val: (s <= 1 ? s * s / 2 : 1 - (2 - s) * (2 - s) / 2) * 100,
        why: s <= 1 ? "The region under x + y = " + s + " is a triangle of area " + s + "² / 2." : "Everything except the corner triangle above x + y = " + s + ", which has area (2 − " + s + ")² / 2.",
        hint: "Draw the unit square and shade where x + y < " + s + ". The answer is that area.",
        sim: function (r) { return r() + r() < s ? 1 : 0; } };
    } },
    { family: "Counting", make: function (ri) {
      var a = ri(3, 6), b = ri(2, 5);
      return { q: "You walk " + a + " blocks east and " + b + " blocks north through a grid of streets, only ever heading east or north. How many different routes are there?", kind: "int",
        val: C(a + b, a), why: "Every route is a string of " + a + " E's and " + b + " N's: C(" + (a + b) + "," + a + ").", hint: "Write a route as a sequence of E and N moves. How many such sequences are there?" };
    } },
    { family: "Counting", make: function (ri, pick) {
      var N = pick([100, 200, 300, 500]), pair = pick([[2, 3], [2, 5], [3, 5], [2, 7], [3, 7]]), a = pair[0], b = pair[1];
      var val = Math.floor(N / a) + Math.floor(N / b) - Math.floor(N / (a * b));
      return { q: "How many whole numbers from 1 to " + N + " are divisible by " + a + " or by " + b + "?", kind: "int", val: val,
        why: Math.floor(N / a) + " + " + Math.floor(N / b) + " − " + Math.floor(N / (a * b)) + " (the multiples of " + (a * b) + " were counted twice).",
        hint: "Count the multiples of each, then subtract the ones you counted twice." };
    } },
    { family: "Expected value", make: function (ri, pick) {
      var s = pick([4, 6, 8, 10, 12, 20]), e = 0; for (var k = 1; k <= s; k++) e += 1 - Math.pow((k - 1) / s, 2);
      return { q: "Roll two fair " + s + "-sided dice and keep the higher number. What's the average result?", kind: "num", val: e,
        why: "Add up P(higher ≥ k) for k = 1 to " + s + ", where P(higher ≥ k) = 1 − ((k − 1)/" + s + ")². That gives " + round(e, 3) + ".",
        hint: "An average of a whole number can be built as the sum of P(result ≥ k).",
        sim: function (r) { return Math.max(rint(r, s), rint(r, s)) + 1; } };
    } },
    { family: "Chance", make: function (ri) {
      var a = ri(2, 8), N = a + ri(2, 8);
      return { q: "You have £" + a + " and bet £1 at a time on fair coin flips. You stop when you reach £" + N + " or run out. What's the probability you reach £" + N + "?", kind: "pct",
        val: a / N * 100, why: "In a fair game your expected money stays at £" + a + ", so £" + N + " × P(win) = £" + a + ": P = " + a + "/" + N + ".",
        hint: "The game is fair, so on average you end with what you started with.",
        sim: function (r) { var x = a; while (x > 0 && x < N) x += r() < 0.5 ? 1 : -1; return x === N ? 1 : 0; } };
    } },
    { family: "Chance", make: function (ri) {
      var k = ri(2, 8);
      return { q: "You deal " + k + " cards from a shuffled 52-card deck. What's the probability of at least one ace?", kind: "pct",
        val: (1 - C(48, k) / C(52, k)) * 100, why: "1 − C(48," + k + ") / C(52," + k + "): one minus the chance that all " + k + " cards come from the 48 non-aces.",
        hint: "Find the chance of no ace at all, then subtract from 1.",
        sim: function (r) { var deck = shuffled(52, r); for (var i = 0; i < k; i++) if (deck[i] < 4) return 1; return 0; } };
    } },
    { family: "Chance", make: function (ri) {
      var red = ri(2, 8), blue = ri(2, 8), t = red + blue;
      return { q: "A drawer holds " + red + " red and " + blue + " blue socks. You pull out two in the dark. What's the probability they match?", kind: "pct",
        val: (red * (red - 1) + blue * (blue - 1)) / (t * (t - 1)) * 100,
        why: "P(both red) + P(both blue) = (" + red + "×" + (red - 1) + " + " + blue + "×" + (blue - 1) + ") / (" + t + "×" + (t - 1) + ").",
        hint: "Add the chance both are red to the chance both are blue.",
        sim: function (r) { var first = rint(r, t) < red, left = first ? red - 1 : red; return (rint(r, t - 1) < left) === first ? 1 : 0; } };
    } },
    { family: "Chance", make: function (ri) {
      var n = ri(2, 6), ways = fact(6) / fact(6 - n);
      return { q: "You roll " + n + " fair dice. What's the probability that they all show different numbers?", kind: "pct",
        val: ways / Math.pow(6, n) * 100, why: "6 × 5 × … (" + n + " factors) / 6^" + n + " = " + ways + "/" + Math.pow(6, n) + ".",
        hint: "The second die must avoid one face, the third two faces, and so on.",
        sim: function (r) { var seen = {}; for (var i = 0; i < n; i++) { var v = rint(r, 6); if (seen[v]) return 0; seen[v] = 1; } return 1; } };
    } },
    { family: "Waiting", make: function (ri, pick) {
      var p = pick([0.1, 0.2, 0.25, 0.4, 0.5]);
      return { q: "A biased coin lands heads with probability " + p + ". On average, how many flips does it take to get the first head?", kind: "num", val: 1 / p,
        why: "1/" + p + " = " + round(1 / p, 2) + ". Something with chance p per try takes 1/p tries on average.",
        hint: "After the first flip you're either done, or back where you started with one flip used. Write that as an equation for the average.",
        sim: function (r) { var n = 1; while (r() >= p) n++; return n; } };
    } }
  ];

  function londonDate(now) {
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(now);
    var get = function (t) { return +parts.filter(function (p) { return p.type === t; })[0].value; };
    return { y: get("year"), m: get("month"), d: get("day") };
  }

  function puzzleFor(date) {
    var doy = Math.round((Date.UTC(date.y, date.m - 1, date.d) - Date.UTC(date.y, 0, 1)) / 86400000);
    var n = TYPES.length, order = shuffled(n, mulberry32(date.y * 1000 + Math.floor(doy / n) + 17));
    var type = TYPES[order[doy % n]], rand = mulberry32(date.y * 10000 + date.m * 100 + date.d);
    var ri = function (lo, hi) { return lo + rint(rand, hi - lo + 1); };
    var pick = function (xs) { return xs[rint(rand, xs.length)]; };
    var p = type.make(ri, pick); p.family = type.family; p.type = order[doy % n]; p.slot = doy % n;
    return p;
  }

  function parseGuess(s, kind) {
    s = (s || "").replace(/[\s,£]/g, "");
    if (!s) return null;
    var pct = /%$/.test(s), v;
    s = s.replace(/%$/, "");
    if (/^-?\d*\.?\d+\/\d*\.?\d+$/.test(s)) { var ab = s.split("/"); v = +ab[1] ? +ab[0] / +ab[1] : NaN; if (kind === "pct") v *= 100; }
    else { v = parseFloat(s); if (kind === "pct" && !pct && v <= 1) v *= 100; }
    return isFinite(v) ? v : null;
  }

  function grade(guess, p) {
    if (guess === null) return null;
    if (p.kind === "int") return Math.round(guess) === p.val ? "ok" : "no";
    var d = Math.abs(guess - p.val);
    if (p.kind === "pct") return d <= Math.max(0.2, 0.03 * p.val) ? "ok" : d <= Math.max(1, 0.1 * p.val) ? "meh" : "no";
    return d <= 0.02 * p.val ? "ok" : d <= 0.08 * p.val ? "meh" : "no";
  }

  function show(val, kind) {
    if (kind === "int") return val.toLocaleString("en-GB");
    if (kind === "num") return "≈ " + round(val, 2);
    return "≈ " + (val < 1 ? round(val, 2) : round(val, 1)) + "%";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { TYPES: TYPES, puzzleFor: puzzleFor, londonDate: londonDate, parseGuess: parseGuess, grade: grade, mulberry32: mulberry32 };
  }
  if (typeof document === "undefined") return;

  var host = document.getElementById("lab-daily"); if (!host) return;
  var $ = function (id) { return document.getElementById(id); };
  var input = $("daily-input"), revealBtn = $("daily-reveal"), hintBtn = $("daily-hint"), answer = $("daily-a");
  var simBox = $("daily-sim"), simCap = $("daily-sim-cap"), canvas = simBox.querySelector("canvas");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var today = londonDate(new Date()), P = puzzleFor(today), revealed = false;

  $("daily-q").textContent = P.q;
  $("daily-kind").textContent = P.family + " · " + new Date(Date.UTC(today.y, today.m - 1, today.d)).toLocaleDateString("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" });
  $("daily-date").textContent = "No. " + (P.slot + 1) + " of " + TYPES.length;
  input.inputMode = P.kind === "int" ? "numeric" : "decimal";

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function ink(v, f) { var c = getComputedStyle(document.documentElement).getPropertyValue(v).trim(); return c || f; }

  function drawSim(points, exact, kind) {
    var w = canvas.parentNode.clientWidth || 300, h = 120, dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
    var ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    var lo = exact, hi = exact; points.forEach(function (p) { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]); });
    var pad = (hi - lo) * 0.15 || Math.max(exact * 0.1, 1); lo -= pad; hi += pad;
    var maxN = points.length ? points[points.length - 1][0] : 1;
    var X = function (n) { return 8 + (w - 16) * Math.log(n) / Math.log(Math.max(maxN, 2)); }, Y = function (v) { return h - 10 - (h - 20) * (v - lo) / (hi - lo); };
    ctx.setLineDash([4, 4]); ctx.strokeStyle = ink("--muted", "#999"); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(8, Y(exact)); ctx.lineTo(w - 8, Y(exact)); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = ink("--blue", "#5B90F5"); ctx.lineWidth = 2; ctx.beginPath();
    points.forEach(function (p, i) { if (i) ctx.lineTo(X(p[0]), Y(p[1])); else ctx.moveTo(X(p[0]), Y(p[1])); }); ctx.stroke();
    ctx.fillStyle = ink("--muted", "#999"); ctx.font = "11px " + ink("--mono", "monospace");
    ctx.fillText("exact " + show(exact, kind).replace("≈ ", ""), 10, Y(exact) - 4);
  }

  function simulate() {
    var TOTAL = 20000, STEP = reduce ? TOTAL : 500, done = 0, valid = 0, sum = 0, points = [];
    var scale = P.kind === "pct" ? 100 : 1;
    simBox.hidden = false;
    function batch() {
      for (var i = 0; i < STEP && done < TOTAL; i++, done++) {
        var x = P.sim(Math.random); if (x === null) continue;
        valid++; sum += x;
        if (valid >= 20 && (valid < 200 ? valid % 5 === 0 : valid % 50 === 0)) points.push([valid, sum / valid * scale]);
      }
      var est = valid ? sum / valid * scale : 0;
      drawSim(points, P.val, P.kind);
      simCap.textContent = "Simulated " + valid.toLocaleString("en-GB") + (P.kind === "num" ? " runs" : " tries") + ": " + show(est, P.kind).replace("≈ ", "") +
        " (exact " + show(P.val, P.kind).replace("≈ ", "") + ")" + (valid < done ? ", counting only the " + valid.toLocaleString("en-GB") + " positive tests" : "") + ".";
      if (done < TOTAL) (document.hidden ? setTimeout : requestAnimationFrame)(batch);
    }
    batch();
  }

  function reveal() {
    var verdict = grade(parseGuess(input.value, P.kind), P), words = { ok: "Nailed it.", meh: "So close.", no: "Not quite." };
    answer.textContent = "";
    if (verdict) answer.appendChild(el("span", "daily-verdict " + verdict, (verdict === "ok" ? "✓ " : "") + words[verdict] + " "));
    answer.appendChild(el("strong", null, "Answer: " + show(P.val, P.kind) + ". "));
    answer.appendChild(document.createTextNode(P.why));
    answer.hidden = false;
    if (P.sim && !revealed) simulate();
    revealed = true;
  }

  revealBtn.addEventListener("click", reveal);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") reveal(); });
  hintBtn.addEventListener("click", function () { var h = $("daily-hint-text"); h.textContent = P.hint; h.hidden = false; hintBtn.disabled = true; });
})();
