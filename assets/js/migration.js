/* ============================================================
   When did we get here? (loaded only on /lab/migration/)
   Map: fuller-world.json · stops: migration.json, both exported by
   CodePlayground/human-migration/migration_export.py.
   Dependency-free. With reduced motion, routes appear without drawing.
   ============================================================ */
(function () {
  "use strict";
  var stage = document.getElementById("mig-stage"); if (!stage) return;
  var canvas = stage.querySelector("canvas");
  var $ = function (id) { return document.getElementById(id); };
  var form = $("mig-form"), slider = $("mig-guess"), go = $("mig-go"), next = $("mig-next");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)");
  var MAX = 300000, MIN = 500, KEY = "migration-best", PORTRAIT_BELOW = 600;
  // Which side of its site each date label sits on, so neighbouring labels don't collide.
  var SIDE = { levant: "sw", americas: "se" }, SIDE_PORTRAIT = { europe: "nw" };
  var W = null, M = null, cur = 0, done = 0, phase = "load", guesses = [], scores = [], anim = 1, animId = 0;
  var ctx, base, cw = 0, ch = 0, k = 1, portrait = false;

  function ink(v, f) { var c = getComputedStyle(document.documentElement).getPropertyValue(v).trim(); return c || f; }
  function fmt(n) { return Math.round(n).toLocaleString("en-GB"); }
  function yearsAt(v) { return MAX * Math.pow(MIN / MAX, v / 1000); }
  function round2(y) { var p = Math.pow(10, Math.floor(Math.log(y) / Math.LN10) - 1); return Math.round(y / p) * p; }
  function guessNow() { return round2(yearsAt(+slider.value)); }
  function range(s) { return fmt(s.lo) + "–" + fmt(s.hi) + " years ago" + (s.ce ? " (about " + s.ce[0] + "–" + s.ce[1] + " CE)" : ""); }
  function shortRange(s) {
    if (s.ce) return s.ce[0] + "–" + s.ce[1] + " CE";
    return s.hi >= 10000 ? s.lo / 1000 + "–" + s.hi / 1000 + "k" : fmt(s.lo) + "–" + fmt(s.hi);
  }
  function score(g, s) {
    if (g >= s.lo && g <= s.hi) return 100;
    var d = Math.abs(Math.log(g / (g > s.hi ? s.hi : s.lo))) / Math.log(5);
    return Math.max(0, Math.round(100 * (1 - d)));
  }
  function verdict(g, s) {
    if (g >= s.lo && g <= s.hi) return "Inside the evidence range";
    var r = g > s.hi ? g / s.hi : s.lo / g;
    return r.toFixed(r < 1.1 ? 2 : 1) + (g > s.hi ? "× too early" : "× too late");
  }
  function store(v) {
    try {
      if (v === undefined) return Math.min(100, Math.max(0, +localStorage.getItem(KEY) || 0));
      localStorage.setItem(KEY, v);
    } catch (e) { return 0; }
  }

  /* ---------------- drawing ---------------- */
  function pt(x, y) { return portrait ? [y * k, (W.w - x) * k] : [x * k, y * k]; }
  function trace(c, a, closed) {
    var p = pt(a[0], a[1]); c.moveTo(p[0], p[1]);
    for (var j = 2; j < a.length; j += 2) { p = pt(a[j], a[j + 1]); c.lineTo(p[0], p[1]); }
    if (closed) c.closePath();
  }
  function fit() {
    cw = stage.clientWidth;
    portrait = cw < PORTRAIT_BELOW;
    k = cw / (portrait ? W.h : W.w);
    ch = Math.round((portrait ? W.w : W.h) * k);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.width = cw + "px"; canvas.style.height = ch + "px";
    canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
    ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    base = document.createElement("canvas");
    base.width = canvas.width; base.height = canvas.height;
    paintBase(base.getContext("2d"), dpr);
  }
  function paintBase(c, dpr) {
    var i, light = document.documentElement.getAttribute("data-theme") === "light";
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = ink("--bg", "#F4F1E9"); c.fillRect(0, 0, cw, ch);
    // Riso: the ocean is a flat tint of the blue ink, overprinted on the paper.
    c.globalCompositeOperation = ink("--blend", "multiply");
    c.fillStyle = ink("--blue", "#1961E0"); c.globalAlpha = light ? 0.2 : 0.24; c.fillRect(0, 0, cw, ch);
    c.strokeStyle = ink("--blue", "#1961E0"); c.globalAlpha = light ? 0.35 : 0.3; c.lineWidth = 0.6;
    c.beginPath(); for (i = 0; i < W.grat.length; i++) trace(c, W.grat[i]); c.stroke();
    c.globalCompositeOperation = "source-over"; c.globalAlpha = 1;
    c.beginPath(); for (i = 0; i < W.land.length; i++) trace(c, W.land[i], true);
    for (i = 0; i < (W.lakes || []).length; i++) trace(c, W.lakes[i], true);
    c.fillStyle = ink("--card", "#FBFAF5"); c.fill("evenodd");
    c.strokeStyle = ink("--line2", "rgba(23,20,16,.3)"); c.lineWidth = 0.5; c.stroke();
    c.font = "600 11px 'Libre Franklin', system-ui, sans-serif";
    if ("letterSpacing" in c) c.letterSpacing = "1.5px";
    c.fillStyle = ink("--muted", "#686157"); c.textAlign = "center"; c.textBaseline = "middle";
    for (i = 0; i < W.labels.length; i++) {
      var p = pt(W.labels[i].xy[0], W.labels[i].xy[1]), t = W.labels[i].t.toUpperCase();
      var half = c.measureText(t).width / 2 + 6;
      c.fillText(t, Math.max(half, Math.min(cw - half, p[0])), p[1]);
    }
  }
  function pathLength(path) {
    var L = 0;
    path.forEach(function (a) { for (var j = 2; j < a.length; j += 2) L += Math.hypot(a[j] - a[j - 2], a[j + 1] - a[j - 1]); });
    return L;
  }
  function drawRoute(s, t, colour, width) {
    var left = pathLength(s.path) * t;
    ctx.strokeStyle = colour; ctx.lineWidth = width; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.setLineDash(s.contested ? [5, 4] : []);
    var cuts = [];
    for (var n = 0; n < s.path.length && left > 0; n++) {
      var a = s.path[n], p = pt(a[0], a[1]);
      if (n > 0) cuts.push(p);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]);
      for (var j = 2; j < a.length && left > 0; j += 2) {
        var seg = Math.hypot(a[j] - a[j - 2], a[j + 1] - a[j - 1]), f = Math.min(1, left / seg);
        p = pt(a[j - 2] + (a[j] - a[j - 2]) * f, a[j - 1] + (a[j + 1] - a[j - 1]) * f);
        ctx.lineTo(p[0], p[1]); left -= seg;
      }
      ctx.stroke();
      if (n < s.path.length - 1 && left > 0) cuts.push(p);
    }
    ctx.setLineDash([]);
    // Open circles mark where a route leaves one edge of Fuller's map and comes back at another.
    cuts.forEach(function (c) { dot(c, 3, ink("--card", "#fff"), colour, 1.2); });
  }
  function dot(p, r, fill, stroke, lw) {
    ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  }
  function tag(p, text, colour, id) {
    var side = (portrait && SIDE_PORTRAIT[id]) || SIDE[id];
    var left = side === "sw" || side === "nw", below = side === "sw" || side === "se";
    ctx.font = "500 11px 'JetBrains Mono', monospace";
    var w = ctx.measureText(text).width;
    if (!left && p[0] + 6 + w > cw - 2) left = true;
    else if (left && p[0] - 6 - w < 2) left = false;
    if (below && p[1] + 18 > ch) below = false;
    else if (!below && p[1] - 18 < 0) below = true;
    ctx.textAlign = left ? "right" : "left"; ctx.textBaseline = below ? "top" : "bottom";
    var x = p[0] + (left ? -6 : 6), y = p[1] + (below ? 4 : -4);
    ctx.lineWidth = 3; ctx.strokeStyle = ink("--card", "#fff"); ctx.lineJoin = "round";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = colour; ctx.fillText(text, x, y);
  }
  function draw() {
    if (!W || !M) return;
    var inkC = ink("--ink", "#171410"), red = ink("--red", "#F24333"), redText = ink("--red-ink", "#BF2D1E"), i, s, p;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(base, 0, 0, cw, ch);
    for (i = 0; i < done; i++) drawRoute(M.stops[i], 1, inkC, 1.4);
    s = M.stops[cur];
    if (phase === "reveal") drawRoute(s, anim, red, 2.2);
    dot(pt(M.origin.xy[0], M.origin.xy[1]), 6, null, inkC, 1.5);
    for (i = 0; i < done; i++) {
      p = pt(M.stops[i].xy[0], M.stops[i].xy[1]);
      dot(p, 2.6, inkC); tag(p, shortRange(M.stops[i]), inkC, M.stops[i].id);
    }
    if (phase === "ask" || phase === "reveal") {
      p = pt(s.xy[0], s.xy[1]);
      dot(p, phase === "ask" ? 9 : 4, phase === "ask" ? null : red, red, 1.8);
      if (phase === "reveal" && anim >= 1) tag(p, shortRange(s), redText, s.id);
    }
  }
  function play() {
    var id = ++animId, t0 = null;
    if (reduce.matches) { anim = 1; draw(); return; }
    anim = 0;
    requestAnimationFrame(function step(now) {
      if (id !== animId || phase !== "reveal") return;
      if (t0 === null) t0 = now;
      var t = Math.min(1, (now - t0) / 1100);
      anim = 1 - Math.pow(1 - t, 3);
      draw();
      if (t < 1) requestAnimationFrame(step);
    });
  }

  /* ---------------- game ---------------- */
  function say(text) { $("mig-status").textContent = text; }
  function describe() {
    var names = M.stops.slice(0, done).map(function (s) { return s.name + " " + range(s); });
    canvas.setAttribute("aria-label", "Buckminster Fuller's world map with Africa at the " +
      (portrait ? "bottom" : "top") + " left. " +
      (names.length ? "Routes drawn so far: " + names.join("; ") + ". " : "") +
      (phase === "end" ? "All eight routes are drawn." : "Now asking about " + M.stops[cur].name + "."));
  }
  function dots() {
    var ol = $("mig-dots"); ol.textContent = "";
    M.stops.forEach(function (s, i) {
      var li = document.createElement("li");
      li.className = i < done ? "done" : i === cur && phase !== "end" ? "now" : "";
      ol.appendChild(li);
    });
  }
  function showValue() {
    var text = "about " + fmt(guessNow()) + " years ago";
    $("mig-value").textContent = text;
    slider.setAttribute("aria-valuetext", text);
  }
  function links(el, cites) {
    el.textContent = "Sources: ";
    cites.forEach(function (c, i) {
      var a = document.createElement("a");
      a.href = "https://doi.org/" + c.doi; a.rel = "noopener"; a.textContent = c.t;
      if (i) el.appendChild(document.createTextNode("; "));
      el.appendChild(a);
    });
  }
  function ask() {
    var s = M.stops[cur];
    phase = "ask";
    $("mig-step").textContent = "Stop " + (cur + 1) + " of " + M.stops.length + " · " + s.name;
    $("mig-q").textContent = s.q;
    form.hidden = false; slider.disabled = false; go.disabled = false; go.hidden = false;
    slider.value = 500; showValue();
    $("mig-result").hidden = true; $("mig-end").hidden = true;
    var wait = $("mig-wait"); wait.hidden = false;
    if (cur === 0) { wait.textContent = M.origin.text + " "; var src = document.createElement("span"); links(src, M.origin.cite); wait.appendChild(src); }
    else wait.textContent = "Make a guess to see the evidence.";
    say("Stop " + (cur + 1) + " of " + M.stops.length + ". " + s.q);
    dots(); describe(); draw();
  }
  function reveal(e) {
    if (e) e.preventDefault();
    if (phase !== "ask") return;
    var s = M.stops[cur], g = guessNow(), sc = score(g, s);
    guesses[cur] = g; scores[cur] = sc;
    phase = "reveal"; slider.disabled = true; go.disabled = true; go.hidden = true;
    var rows = [["Your guess", "about " + fmt(g) + " years ago"],
                ["Evidence", range(s) + (s.contested ? " (debated)" : "")],
                ["Score", sc + " / 100"], ["Verdict", verdict(g, s)]];
    var dl = $("mig-readout"); dl.textContent = "";
    rows.forEach(function (r) {
      var dt = document.createElement("dt"), dd = document.createElement("dd");
      dt.textContent = r[0]; dd.textContent = r[1]; dl.appendChild(dt); dl.appendChild(dd);
    });
    $("mig-site").textContent = s.site;
    $("mig-note").textContent = s.note + (s.path.length > 1
      ? " Fuller's map cuts the Pacific open, so this route leaves one edge of the map and comes back at another." : "");
    links($("mig-cite"), s.cite);
    next.textContent = cur < M.stops.length - 1 ? "Next stop" : "See your score";
    $("mig-wait").hidden = true; $("mig-result").hidden = false;
    say(s.name + ": " + sc + " out of 100, " + verdict(g, s).toLowerCase() + ". The evidence says " + range(s) + ".");
    play(); next.focus({ preventScroll: true });
  }
  function advance() {
    if (phase !== "reveal") return;
    done = cur + 1;
    if (cur < M.stops.length - 1) { cur++; ask(); slider.focus(); }
    else finish();
  }
  function finish() {
    phase = "end";
    var total = Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length);
    var best = Math.max(total, store());
    store(best);
    $("mig-step").textContent = "Finished";
    $("mig-q").textContent = "You've drawn the map.";
    form.hidden = true; $("mig-result").hidden = true; $("mig-wait").hidden = true; $("mig-end").hidden = false;
    $("mig-total").textContent = "You scored " + total + " / 100 across " + scores.length + " stops.";
    var ol = $("mig-scores"); ol.textContent = "";
    M.stops.forEach(function (s, i) {
      var li = document.createElement("li");
      li.textContent = s.name + " · " + scores[i];
      ol.appendChild(li);
    });
    $("mig-best").textContent = "Your best: " + best + " / 100";
    $("mig-shared").textContent = "";
    $("mig-share").setAttribute("data-text", "When did we get here? " + total +
      "/100 on Fuller's map. " + location.origin + location.pathname);
    dots(); describe(); draw();
    say("Finished. You scored " + total + " out of 100.");
    $("mig-share").focus();
  }
  function restart() { cur = 0; done = 0; guesses = []; scores = []; ask(); slider.focus(); }
  function share() {
    var text = $("mig-share").getAttribute("data-text"), out = $("mig-shared");
    var shown = function () { out.textContent = text; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { out.textContent = "Copied: " + text; }, shown);
    } else shown();
  }

  function load(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
  }
  var lastW = 0, timer;
  Promise.all([load(stage.getAttribute("data-world")), load(stage.getAttribute("data-stops"))]).then(function (d) {
    W = d[0]; M = d[1];
    var year = new Date().getFullYear();
    // Recent stops are dated in CE, so "years ago" is worked out from today's date.
    M.stops.forEach(function (s) { if (s.ce) { s.lo = year - s.ce[1]; s.hi = year - s.ce[0]; } });
    lastW = stage.clientWidth;
    fit(); ask();
  }).catch(function () {
    var p = document.createElement("p");
    p.className = "lab-error"; p.textContent = "Couldn't load the map data. Try reloading the page.";
    stage.parentNode.insertBefore(p, stage); canvas.setAttribute("aria-label", p.textContent);
    $("mig-step").textContent = ""; $("mig-q").textContent = ""; form.hidden = true;
    say(p.textContent);
  });

  form.addEventListener("submit", reveal);
  slider.addEventListener("input", showValue);
  slider.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (!e.repeat) reveal();
  });
  // A held Enter must not run on through Lock in, Next stop and the next question.
  [go, next].forEach(function (b) {
    b.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.repeat) e.preventDefault(); });
  });
  next.addEventListener("click", advance);
  $("mig-again").addEventListener("click", restart);
  $("mig-share").addEventListener("click", share);
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (!W || stage.clientWidth === lastW) return;
      lastW = stage.clientWidth; fit(); draw(); describe();
    }, 150);
  });
  new MutationObserver(function () { if (W) { fit(); draw(); } })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
