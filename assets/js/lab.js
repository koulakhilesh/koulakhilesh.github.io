/* ============================================================
   Lab (loaded only on /lab/)
   • Puzzle of the day: a date-seeded probability question
   • k-means clustering you can run or step through
   Dependency-free. With reduced motion, k-means jumps to the result.
   ============================================================ */
(function () {
  "use strict";
  function ink(v, f) { var c = getComputedStyle(document.documentElement).getPropertyValue(v).trim(); return c || f; }
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- k-means clustering ---------------- */
  function initKmeans() {
    var stage = document.getElementById("lab-kmeans"); if (!stage) return;
    var canvas = stage.querySelector("canvas"), ctx = canvas.getContext("2d");
    var controls = document.getElementById("kmeans-controls");
    var runBtn = controls && controls.querySelector('[data-act="run"]');
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W, H = 260, K = 3, pts = [], cents = [], timer = null;
    var inks = [ink("--blue", "#5B90F5"), ink("--red", "#F24333"), ink("--yellow", "#FFC21A")];
    function fit() { W = stage.clientWidth; canvas.style.width = W + "px"; canvas.style.height = H + "px"; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function seed() { stop(); pts = []; for (var c = 0; c < K; c++) { var cx = Math.random() * W * 0.7 + W * 0.15, cy = Math.random() * H * 0.7 + H * 0.15; for (var i = 0; i < 36; i++) pts.push({ x: cx + (Math.random() - 0.5) * 90, y: cy + (Math.random() - 0.5) * 90, c: -1 }); } cents = []; for (var k = 0; k < K; k++) cents.push({ x: Math.random() * W, y: Math.random() * H }); draw(); }
    function step() { var changed = false, i, k; for (i = 0; i < pts.length; i++) { var best = 0, bd = 1e9; for (k = 0; k < K; k++) { var dx = pts[i].x - cents[k].x, dy = pts[i].y - cents[k].y, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = k; } } if (pts[i].c !== best) { changed = true; pts[i].c = best; } } for (k = 0; k < K; k++) { var sx = 0, sy = 0, n = 0; for (i = 0; i < pts.length; i++) if (pts[i].c === k) { sx += pts[i].x; sy += pts[i].y; n++; } if (n) { cents[k].x = sx / n; cents[k].y = sy / n; } } draw(); return changed; }
    function run() {
      stop();
      if (reduce) { for (var n = 0; n < 100 && step(); n++) {} return; }
      timer = setInterval(function () { if (!step()) stop(); }, 550);
      if (runBtn) runBtn.classList.add("on");
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } if (runBtn) runBtn.classList.remove("on"); }
    function draw() { ctx.clearRect(0, 0, W, H); var i, k; for (i = 0; i < pts.length; i++) { ctx.fillStyle = pts[i].c < 0 ? ink("--muted", "#888") : inks[pts[i].c % 3]; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 3.4, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; for (k = 0; k < K; k++) { ctx.fillStyle = inks[k % 3]; ctx.strokeStyle = ink("--ink", "#fff"); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cents[k].x, cents[k].y, 8, 0, 7); ctx.fill(); ctx.stroke(); } }
    if (controls) controls.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; if (b.dataset.act === "new") seed(); else if (b.dataset.act === "step") step(); else if (b.dataset.act === "run") run(); });
    window.addEventListener("resize", function () { fit(); draw(); });
    fit(); seed();
    if (reduce) run();
  }

  /* ---------------- Puzzle of the day (date-seeded) ---------------- */
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function initDaily() {
    var host = document.getElementById("lab-daily"); if (!host) return;
    var qEl = document.getElementById("daily-q"), aEl = document.getElementById("daily-a"), dEl = document.getElementById("daily-date");
    var input = document.getElementById("daily-input"), btn = document.getElementById("daily-reveal");
    var now = new Date(), seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    var rng = mulberry32(seed);
    function ri(lo, hi) { return lo + Math.floor(rng() * (hi - lo + 1)); }
    function fact(n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
    function C(n, k) { if (k < 0 || k > n) return 0; k = Math.min(k, n - k); var r = 1; for (var i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); }
    function disp(x) { return x.kind === "pct" ? ("≈ " + (Math.round(x.val * 10) / 10) + "%") : ("" + x.val); }
    var templates = [
      function () { var n = ri(18, 40), p = 1; for (var i = 0; i < n; i++) p *= (365 - i) / 365; return { q: "In a room of " + n + " people, what's the probability that at least two share a birthday?", kind: "pct", val: (1 - p) * 100, why: "1 − (365·364·…) / 365^" + n + ". The birthday paradox: it already passes 50% at just 23 people." }; },
      function () { var n = ri(3, 12); return { q: "You roll a fair die " + n + " times. What's the probability of at least one six?", kind: "pct", val: (1 - Math.pow(5 / 6, n)) * 100, why: "1 − (5/6)^" + n + ". Compute the chance of *no* six, then subtract from 1." }; },
      function () { var n = ri(6, 12), k = ri(2, n - 2); return { q: "Flip a fair coin " + n + " times. What's the probability of exactly " + k + " heads?", kind: "pct", val: C(n, k) / Math.pow(2, n) * 100, why: "C(" + n + "," + k + ") / 2^" + n + " = " + C(n, k) + "/" + Math.pow(2, n) + "." }; },
      function () { var r = ri(3, 8), b = ri(3, 8); return { q: "A bag holds " + r + " red and " + b + " blue balls. You draw two without replacement: probability both are red?", kind: "pct", val: (r / (r + b)) * ((r - 1) / (r + b - 1)) * 100, why: "(" + r + "/" + (r + b) + ") × (" + (r - 1) + "/" + (r + b - 1) + ")." }; },
      function () { var n = ri(6, 14), k = ri(2, 5); return { q: "How many ways can you choose " + k + " items from " + n + ", if order doesn't matter?", kind: "int", val: C(n, k), why: "C(" + n + "," + k + ") = " + n + "! / (" + k + "! · " + (n - k) + "!)." }; },
      function () { var n = ri(4, 7); return { q: "How many ways can you arrange " + n + " distinct books on a shelf?", kind: "int", val: fact(n), why: n + "! = " + n + " × " + (n - 1) + " × … × 1." }; },
      function () { var n = ri(5, 12); return { q: n + " people each shake hands once with everyone else. How many handshakes happen?", kind: "int", val: C(n, 2), why: "C(" + n + ",2) = " + n + "·" + (n - 1) + "/2, one shake per pair." }; }
    ];
    var t = templates[Math.floor(rng() * templates.length)]();
    qEl.textContent = t.q;
    dEl.textContent = now.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    function parseNum(s) {
      s = s.replace(/[%\s,]/g, ""); if (s === "") return null;
      if (s.indexOf("/") > 0) { var p = s.split("/"), a = parseFloat(p[0]), b = parseFloat(p[1]); return (isNaN(a) || isNaN(b) || b === 0) ? null : a / b; }
      var v = parseFloat(s); return isNaN(v) ? null : v;
    }
    function reveal() {
      var g = parseNum((input.value || "").replace(/[<>]/g, "").trim());
      var verdict = null;
      if (g !== null) {
        if (t.kind === "int") verdict = Math.round(g) === Math.round(t.val) ? "ok" : "no";
        else { var gp = g <= 1 ? g * 100 : g, d = Math.abs(gp - t.val); verdict = d <= 0.6 ? "ok" : d <= 2.5 ? "meh" : "no"; }
      }
      var lead = verdict === "ok" ? '<span class="daily-verdict ok">✓ Nailed it.</span> '
        : verdict === "meh" ? '<span class="daily-verdict meh">So close.</span> '
        : verdict === "no" ? '<span class="daily-verdict no">Not quite.</span> ' : "";
      aEl.innerHTML = lead + "<strong>Answer:</strong> " + disp(t) + ". " + t.why;
      aEl.hidden = false;
    }
    btn.addEventListener("click", reveal);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") reveal(); });
  }

  initKmeans(); initDaily();
})();
