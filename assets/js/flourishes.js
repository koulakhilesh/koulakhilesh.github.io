/* ============================================================
   Flourishes — subtle, intelligent delights (loaded site-wide)
   • type "life"    → Conway's Game of Life
   • type "langton" → Langton's Ant
   • type "turing"  → Turing patterns (reaction-diffusion)
   • type "riso" → cycle the accent through the Riso inks
   • Konami code ↑↑↓↓←→←→ B A → Bauhaus shape confetti
   • a friendly devtools console greeting
   Dependency-free, reduced-motion aware. Games live on /lab/.
   ============================================================ */
(function () {
  "use strict";

  function ink(v, fallback) {
    var c = getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    return c || fallback;
  }

  /* ---- console greeting ---- */
  try {
    console.log("%cHi there 👋", "font:600 20px/1.4 sans-serif;color:" + ink("--blue", "#5B90F5"));
    console.log(
      "%cYou opened the console; you're my kind of visitor.\n" +
      "%cType \u201Clife\u201D, \u201Clangton\u201D or \u201Cturing\u201D anywhere, or hit the Konami code. More at /lab/.",
      "color:" + ink("--red", "#F24333") + ";font-weight:600",
      "color:" + ink("--muted", "#9C948A") + ";font-family:monospace"
    );
  } catch (e) { /* no-op */ }

  var KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  var kPos = 0, typed = "", open = false, inkIdx = 0;

  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if (!e.key || e.ctrlKey || e.metaKey || e.altKey) return;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;

    var key = e.key;
    // Konami → confetti
    kPos = (key.toLowerCase() === KONAMI[kPos].toLowerCase()) ? kPos + 1 : (key.toLowerCase() === KONAMI[0].toLowerCase() ? 1 : 0);
    if (kPos === KONAMI.length) { kPos = 0; confetti(); return; }

    // word triggers
    if (/^[a-z]$/i.test(key)) {
      typed = (typed + key.toLowerCase()).slice(-8);
      if (typed.slice(-4) === "life") { typed = ""; automaton("life"); }
      else if (typed.slice(-7) === "langton") { typed = ""; automaton("langton"); }
      else if (typed.slice(-6) === "turing") { typed = ""; automaton("turing"); }
      else if (typed.slice(-4) === "riso") { typed = ""; cycleInk(); }
    }
  });

  /* ---- accent ink shuffle ---- */
  function cycleInk() {
    var names = ["red", "blue", "yellow"];
    inkIdx = (inkIdx + 1) % names.length;
    document.documentElement.style.setProperty("--accent", "var(--" + names[inkIdx] + ")");
    toast("Accent → " + names[inkIdx]);
  }

  function toast(msg) {
    var el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText =
      "position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:9999;" +
      "background:" + ink("--card", "#1D1914") + ";color:" + ink("--ink", "#F1EEE7") +
      ";border:1px solid " + ink("--line2", "rgba(255,255,255,.3)") + ";border-radius:var(--r-1);" +
      "padding:8px 16px;font-family:'JetBrains Mono',monospace;font-size:var(--fs-xs);" +
      "letter-spacing:.08em;text-transform:uppercase;opacity:0;transition:opacity .2s";
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.style.opacity = "1"; });
    setTimeout(function () { el.style.opacity = "0"; setTimeout(function () { el.remove(); }, 250); }, 1200);
  }

  /* ---- Bauhaus shape confetti (Konami) ---- */
  function confetti() {
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var inks = [ink("--blue", "#5B90F5"), ink("--red", "#F24333"), ink("--yellow", "#FFC21A")];
    var c = document.createElement("canvas");
    c.style.cssText = "position:fixed;inset:0;z-index:9998;pointer-events:none";
    document.body.appendChild(c);
    var ctx = c.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() { c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size();
    var N = 90, bits = [];
    for (var i = 0; i < N; i++) {
      bits.push({
        x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.5,
        vx: (Math.random() - 0.5) * 1.4, vy: 2 + Math.random() * 3.2,
        r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.2,
        s: 10 + Math.random() * 16, shape: i % 3, color: inks[i % 3]
      });
    }
    function shape(b) {
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.fillStyle = b.color; ctx.globalAlpha = 0.92;
      if (b.shape === 0) { ctx.beginPath(); ctx.arc(0, 0, b.s / 2, 0, 7); ctx.fill(); }
      else if (b.shape === 1) { ctx.fillRect(-b.s / 2, -b.s / 2, b.s, b.s); }
      else { ctx.beginPath(); ctx.moveTo(0, -b.s / 2); ctx.lineTo(b.s / 2, b.s / 2); ctx.lineTo(-b.s / 2, b.s / 2); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    }
    var start = performance.now(), raf;
    function frame(now) {
      ctx.clearRect(0, 0, c.width, c.height);
      var alive = false;
      for (var i = 0; i < bits.length; i++) {
        var b = bits[i];
        if (!reduce) { b.x += b.vx; b.y += b.vy; b.r += b.vr; b.vy += 0.03; }
        if (b.y < innerHeight + 40) alive = true;
        shape(b);
      }
      if ((now - start < 3000) && (alive || reduce)) raf = requestAnimationFrame(frame);
      else { cancelAnimationFrame(raf); c.remove(); }
    }
    if (reduce) { for (var j = 0; j < bits.length; j++) { bits[j].y = Math.random() * innerHeight; shape(bits[j]); } setTimeout(function () { c.remove(); }, 1200); }
    else raf = requestAnimationFrame(frame);
    addEventListener("resize", size, { once: true });
  }

  /* ---- overlays: Game of Life, Langton's Ant, Turing patterns ---- */
  var OVERLAY = {
    life: { name: "Conway's Game of Life", every: 90,
      caption: "Conway's Game of Life: a zero-player game. Click to add a glider · Esc to close." },
    langton: { name: "Langton's Ant", every: 40,
      caption: "Langton's Ant: two rules, emergent order. Click to drop an ant · Esc to close." },
    turing: { name: "Turing patterns", every: 33,
      caption: "Turing patterns: two chemicals diffusing and reacting. Click to seed · Esc to close." }
  };

  function automaton(mode) {
    if (open) return; open = true;
    var cfg = OVERLAY[mode];
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var inks = [ink("--blue", "#5B90F5"), ink("--red", "#F24333"), ink("--yellow", "#FFC21A")];

    var wrap = document.createElement("div");
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", cfg.name);
    wrap.style.cssText = "position:fixed;inset:0;z-index:9999;background:" + hexA(ink("--bg", "#14120E"), 0.94) + ";backdrop-filter:blur(2px);cursor:crosshair";

    var canvas = document.createElement("canvas");
    canvas.style.cssText = "display:block;width:100%;height:100%";
    wrap.appendChild(canvas);

    var caption = document.createElement("p");
    caption.textContent = cfg.caption + (reduce ? " (Paused: reduced motion.)" : "");
    caption.style.cssText = "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);margin:0;font-family:'JetBrains Mono',monospace;font-size:var(--fs-xs);letter-spacing:.08em;text-transform:uppercase;color:" + ink("--muted", "#9C948A") + ";pointer-events:none;text-align:center;padding:0 16px";
    wrap.appendChild(caption);

    var close = document.createElement("button");
    close.type = "button"; close.setAttribute("aria-label", "Close"); close.textContent = "×";
    close.style.cssText = "position:fixed;top:16px;right:18px;width:40px;height:40px;line-height:1;background:none;border:1px solid " + ink("--line2", "rgba(255,255,255,.3)") + ";color:" + ink("--ink", "#F1EEE7") + ";font-size:var(--fs-lg);cursor:pointer;border-radius:var(--r-1)";
    wrap.appendChild(close);
    var opener = document.activeElement;
    document.body.appendChild(wrap);
    close.focus();

    var ctx = canvas.getContext("2d"), cell = 16, cols, rows, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cur, nxt, prevCols = 0, prevRows = 0, ant;

    function resize() {
      var w = wrap.clientWidth, h = wrap.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / cell); rows = Math.ceil(h / cell);
      var a = new Uint8Array(cols * rows), b = new Uint8Array(cols * rows);
      if (cur) for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) if (x < prevCols && y < prevRows) a[y * cols + x] = cur[y * prevCols + x];
      cur = a; nxt = b; prevCols = cols; prevRows = rows;
    }

    function seed() {
      if (mode === "turing") rdInit();
      else if (mode === "langton") {
        ant = { x: (cols / 2) | 0, y: (rows / 2) | 0, dir: 0 };
        if (reduce) for (var s = 0; s < 400; s++) antStep();
      }
      else for (var i = 0; i < cur.length; i++) cur[i] = Math.random() < 0.16 ? 1 : 0;
    }

    function stampGlider(cx, cy) {
      var g = [[0,1,0],[0,0,1],[1,1,1]];
      for (var y = 0; y < 3; y++) for (var x = 0; x < 3; x++) {
        var gx = cx + x - 1, gy = cy + y - 1;
        if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) cur[gy * cols + gx] = g[y][x];
      }
    }

    function lifeStep() {
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        var n = 0;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          n += cur[((y + dy + rows) % rows) * cols + ((x + dx + cols) % cols)];
        }
        var a = cur[y * cols + x];
        nxt[y * cols + x] = ((a && (n === 2 || n === 3)) || (!a && n === 3)) ? 1 : 0;
      }
      var tmp = cur; cur = nxt; nxt = tmp;
    }

    function antStep() {
      for (var k = 0; k < 8; k++) {
        var i = ant.y * cols + ant.x;
        if (cur[i]) { ant.dir = (ant.dir + 3) & 3; cur[i] = 0; } else { ant.dir = (ant.dir + 1) & 3; cur[i] = 1; }
        if (ant.dir === 0) ant.y = (ant.y - 1 + rows) % rows;
        else if (ant.dir === 1) ant.x = (ant.x + 1) % cols;
        else if (ant.dir === 2) ant.y = (ant.y + 1) % rows;
        else ant.x = (ant.x - 1 + cols) % cols;
      }
    }

    /* Gray-Scott reaction-diffusion on a coarse grid, drawn as blue ink with alpha */
    var RD = 5, rd = null;
    function rdInit() {
      var c = Math.ceil(wrap.clientWidth / RD), r = Math.ceil(wrap.clientHeight / RD), n = c * r;
      rd = { cols: c, rows: r, A: new Float32Array(n).fill(1), B: new Float32Array(n),
             A2: new Float32Array(n), B2: new Float32Array(n), off: document.createElement("canvas") };
      rd.off.width = c; rd.off.height = r; rd.octx = rd.off.getContext("2d"); rd.img = rd.octx.createImageData(c, r);
      for (var k = 0; k < 7; k++) rdSeed(Math.random() * c | 0, Math.random() * r | 0);
      if (reduce) for (var s = 0; s < 500; s++) rdStep();
    }
    function rdSeed(cx, cy) {
      for (var y = -4; y <= 4; y++) for (var x = -4; x <= 4; x++)
        rd.B[((cy + y + rd.rows) % rd.rows) * rd.cols + (cx + x + rd.cols) % rd.cols] = 1;
    }
    function rdStep() {
      var c = rd.cols, r = rd.rows, A = rd.A, B = rd.B, feed = 0.0545, kill = 0.062;
      for (var y = 0; y < r; y++) {
        var ym = ((y - 1 + r) % r) * c, y0 = y * c, yp = ((y + 1) % r) * c;
        for (var x = 0; x < c; x++) {
          var xm = (x - 1 + c) % c, xp = (x + 1) % c, i = y0 + x;
          var la = (A[y0 + xm] + A[y0 + xp] + A[ym + x] + A[yp + x]) * 0.2 + (A[ym + xm] + A[ym + xp] + A[yp + xm] + A[yp + xp]) * 0.05 - A[i];
          var lb = (B[y0 + xm] + B[y0 + xp] + B[ym + x] + B[yp + x]) * 0.2 + (B[ym + xm] + B[ym + xp] + B[yp + xm] + B[yp + xp]) * 0.05 - B[i];
          var a = A[i], b = B[i], abb = a * b * b;
          var na = a + la - abb + feed * (1 - a), nb = b + 0.5 * lb + abb - (kill + feed) * b;
          rd.A2[i] = na < 0 ? 0 : na > 1 ? 1 : na; rd.B2[i] = nb < 0 ? 0 : nb > 1 ? 1 : nb;
        }
      }
      var t = rd.A; rd.A = rd.A2; rd.A2 = t; t = rd.B; rd.B = rd.B2; rd.B2 = t;
    }
    function rdDraw() {
      var d = rd.img.data, rgb = hexRgb(inks[0]);
      for (var i = 0; i < rd.B.length; i++) {
        var v = rd.B[i] * 3; if (v > 1) v = 1;
        var j = i * 4; d[j] = rgb[0]; d[j + 1] = rgb[1]; d[j + 2] = rgb[2]; d[j + 3] = v * 235;
      }
      rd.octx.putImageData(rd.img, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(rd.off, 0, 0, rd.cols * RD, rd.rows * RD);
    }

    function draw() {
      if (mode === "turing") { rdDraw(); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.9;
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        if (!cur[y * cols + x]) continue;
        ctx.fillStyle = inks[(x + y) % 3];
        ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
      }
      if (mode === "langton" && ant) { ctx.globalAlpha = 1; ctx.fillStyle = ink("--ink", "#F1EEE7"); ctx.fillRect(ant.x * cell + 3, ant.y * cell + 3, cell - 6, cell - 6); }
      ctx.globalAlpha = 1;
    }

    function tick() {
      if (mode === "turing") { for (var s = 0; s < 12; s++) rdStep(); }
      else if (mode === "langton") antStep();
      else lifeStep();
      draw();
    }

    resize(); seed(); draw();
    var timer = reduce ? null : setInterval(tick, cfg.every);

    var resizeT;
    function onResize() {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () {
        var c = Math.ceil(wrap.clientWidth / cell), r = Math.ceil(wrap.clientHeight / cell);
        if (c === cols && r === rows) return;
        resize(); if (mode === "turing") rdInit(); draw();
      }, 200);
    }
    addEventListener("resize", onResize);
    canvas.addEventListener("pointerdown", function (e) {
      var r = canvas.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
      if (mode === "turing") rdSeed(Math.floor(px / RD), Math.floor(py / RD));
      else if (mode === "langton") ant = { x: Math.floor(px / cell), y: Math.floor(py / cell), dir: 0 };
      else stampGlider(Math.floor(px / cell), Math.floor(py / cell));
      draw();
    });

    function done() {
      if (timer) clearInterval(timer); clearTimeout(resizeT);
      removeEventListener("resize", onResize); document.removeEventListener("keydown", onKey, true);
      wrap.remove(); open = false;
      if (opener && opener.focus) opener.focus();
    }
    // The close button is the only focusable control, so Tab stays on it.
    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); done(); }
      else if (e.key === "Tab") { e.preventDefault(); close.focus(); }
    }
    document.addEventListener("keydown", onKey, true);
    close.addEventListener("click", done);
  }

  function hexRgb(h) {
    h = (h || "").replace("#", "");
    if (h.length === 3) h = h.replace(/./g, "$&$&");
    var n = parseInt(h, 16);
    if (isNaN(n) || h.length !== 6) return [91, 144, 245];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function hexA(hex, a) {
    hex = (hex || "").replace("#", "");
    if (hex.length === 3) hex = hex.replace(/./g, "$&$&");
    var n = parseInt(hex, 16);
    if (hex.length !== 6 || isNaN(n)) return "rgba(20,18,14," + a + ")";
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }
})();
