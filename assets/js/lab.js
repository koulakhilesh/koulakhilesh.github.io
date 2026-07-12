/* ============================================================
   Lab — interactive toys (loaded only on /lab/)
   • Sorting visualizer (bubble / quick / merge) in Riso inks
   • Minesweeper on the Swiss grid
   • Snake in Bauhaus tiles
   Dependency-free.
   ============================================================ */
(function () {
  "use strict";
  function ink(v, f) { var c = getComputedStyle(document.documentElement).getPropertyValue(v).trim(); return c || f; }

  /* run a callback once, the first time an element scrolls into view */
  function onceSeen(el, cb) {
    if (!("IntersectionObserver" in window)) { cb(); return; }
    var io = new IntersectionObserver(function (es) { for (var i = 0; i < es.length; i++) if (es[i].isIntersecting) { io.disconnect(); cb(); } }, { threshold: 0.2 });
    io.observe(el);
  }
  /* toggle a callback as an element enters / leaves the viewport */
  function whenSeen(el, enter, leave) {
    if (!("IntersectionObserver" in window)) { if (enter) enter(); return; }
    var io = new IntersectionObserver(function (es) { for (var i = 0; i < es.length; i++) { if (es[i].isIntersecting) { if (enter) enter(); } else if (leave) leave(); } }, { threshold: 0.12 });
    io.observe(el);
  }

  /* ---------------- Sorting visualizer ---------------- */
  function initSort() {
    var stage = document.getElementById("lab-sort"); if (!stage) return;
    var canvas = stage.querySelector("canvas"), ctx = canvas.getContext("2d");
    var controls = document.getElementById("sort-controls"), note = document.getElementById("sort-note");
    var dpr = Math.min(window.devicePixelRatio || 1, 2), N = 40, H = 240;
    var base = [], frames = [], fi = 0, timer = null, algo = "quick";
    var C = { blue: ink("--blue", "#5B90F5"), red: ink("--red", "#F24333"), yellow: ink("--yellow", "#FFC21A") };

    function fit() { var w = stage.clientWidth; canvas.style.width = w + "px"; canvas.style.height = H + "px"; canvas.width = w * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function shuffle() { stop(); base = []; for (var i = 1; i <= N; i++) base.push(i); for (var j = N - 1; j > 0; j--) { var k = Math.random() * (j + 1) | 0, t = base[j]; base[j] = base[k]; base[k] = t; } drawArr(base, [], null); }
    function drawArr(a, hi, type) {
      var w = stage.clientWidth; ctx.clearRect(0, 0, w, H); var bw = w / a.length;
      for (var i = 0; i < a.length; i++) {
        var h = (a[i] / N) * (H - 8) + 4, color = C.blue;
        if (hi && hi.indexOf(i) >= 0) color = (type === "cmp") ? C.yellow : C.red;
        ctx.fillStyle = color; ctx.fillRect(i * bw + 1, H - h, Math.max(1, bw - 2), h);
      }
    }
    function genBubble(a) { a = a.slice(); var f = []; for (var i = 0; i < a.length; i++) for (var j = 0; j < a.length - 1 - i; j++) { f.push({ a: a.slice(), hi: [j, j + 1], t: "cmp" }); if (a[j] > a[j + 1]) { var x = a[j]; a[j] = a[j + 1]; a[j + 1] = x; f.push({ a: a.slice(), hi: [j, j + 1], t: "swap" }); } } f.push({ a: a.slice(), hi: [], t: null }); return f; }
    function genQuick(a) { a = a.slice(); var f = []; (function qs(lo, hi) { if (lo >= hi) return; var p = a[hi], i = lo; for (var j = lo; j < hi; j++) { f.push({ a: a.slice(), hi: [j, hi], t: "cmp" }); if (a[j] < p) { var t = a[i]; a[i] = a[j]; a[j] = t; f.push({ a: a.slice(), hi: [i, j], t: "swap" }); i++; } } var t2 = a[i]; a[i] = a[hi]; a[hi] = t2; f.push({ a: a.slice(), hi: [i, hi], t: "swap" }); qs(lo, i - 1); qs(i + 1, hi); })(0, a.length - 1); f.push({ a: a.slice(), hi: [], t: null }); return f; }
    function genMerge(a) { a = a.slice(); var f = [], tmp = a.slice(); (function ms(lo, hi) { if (hi - lo < 1) return; var mid = (lo + hi) >> 1; ms(lo, mid); ms(mid + 1, hi); var i = lo, j = mid + 1, k = lo; while (i <= mid && j <= hi) { f.push({ a: a.slice(), hi: [i, j], t: "cmp" }); tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++]; } while (i <= mid) tmp[k++] = a[i++]; while (j <= hi) tmp[k++] = a[j++]; for (var x = lo; x <= hi; x++) { a[x] = tmp[x]; f.push({ a: a.slice(), hi: [x], t: "swap" }); } })(0, a.length - 1); f.push({ a: a.slice(), hi: [], t: null }); return f; }
    function run() {
      stop();
      var g = algo === "bubble" ? genBubble : algo === "merge" ? genMerge : genQuick;
      frames = g(base); fi = 0;
      var delay = Math.max(6, Math.min(40, 6000 / frames.length));
      timer = setInterval(function () { if (fi >= frames.length) { stop(); return; } var fr = frames[fi++]; drawArr(fr.a, fr.hi, fr.t); }, delay);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    if (controls) controls.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.act === "shuffle") { shuffle(); return; }
      if (b.dataset.algo) {
        algo = b.dataset.algo;
        [].forEach.call(controls.querySelectorAll("[data-algo]"), function (x) { x.classList.toggle("on", x === b); });
        if (note) note.firstChild.nodeValue = b.textContent + "sort · watching it think — comparing ";
        run();
      }
    });
    window.addEventListener("resize", function () { fit(); drawArr(base, [], null); });
    fit(); shuffle(); onceSeen(stage, run);
  }

  /* ---------------- Minesweeper ---------------- */
  function initMines() {
    var stage = document.getElementById("lab-mines"); if (!stage) return;
    var stat = document.getElementById("mines-stat"), reset = document.getElementById("mines-reset");
    var W = 10, H = 10, M = 13, grid, over, revealed, flags;
    var nc = ["", ink("--blue", "#5B90F5"), ink("--red", "#F24333"), ink("--yellow", "#FFC21A"), ink("--blue", "#5B90F5"), ink("--red", "#F24333"), ink("--yellow", "#FFC21A"), ink("--ink", "#000"), ink("--muted", "#888")];

    function neighbors(x, y, fn) { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; var nx = x + dx, ny = y + dy; if (nx >= 0 && nx < W && ny >= 0 && ny < H) fn(nx, ny); } }
    function build() {
      stage.innerHTML = ""; over = false; revealed = 0; flags = 0; grid = [];
      var g = document.createElement("div"); g.className = "mines-grid"; g.style.setProperty("--w", W);
      for (var y = 0; y < H; y++) { grid[y] = []; for (var x = 0; x < W; x++) { var el = document.createElement("button"); el.type = "button"; el.className = "mine-cell"; el.dataset.x = x; el.dataset.y = y; grid[y][x] = { x: x, y: y, mine: false, rev: false, flag: false, n: 0, el: el }; g.appendChild(el); } }
      var placed = 0; while (placed < M) { var rx = Math.random() * W | 0, ry = Math.random() * H | 0; if (!grid[ry][rx].mine) { grid[ry][rx].mine = true; placed++; } }
      for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++) { if (grid[yy][xx].mine) continue; var c = 0; neighbors(xx, yy, function (nx, ny) { if (grid[ny][nx].mine) c++; }); grid[yy][xx].n = c; }
      stage.appendChild(g); setStat();
    }
    function reveal(c) {
      if (c.rev || c.flag || over) return;
      c.rev = true; revealed++; c.el.classList.add("rev");
      if (c.mine) { c.el.classList.add("mine-hit"); c.el.textContent = "●"; lose(); return; }
      if (c.n) { c.el.textContent = c.n; c.el.style.color = nc[c.n]; }
      else neighbors(c.x, c.y, function (nx, ny) { reveal(grid[ny][nx]); });
      if (revealed === W * H - M) { over = true; stat.textContent = "Cleared ✓"; }
    }
    function lose() { over = true; for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) { var c = grid[y][x]; if (c.mine && !c.rev) { c.el.classList.add("rev"); c.el.textContent = "●"; } } stat.textContent = "Boom 💥"; }
    function setStat() { stat.textContent = (M - flags) + " mines"; }
    var suppressClick = false, lpTimer = null;
    function cellOf(e) { var el = e.target.closest(".mine-cell"); return el ? grid[+el.dataset.y][+el.dataset.x] : null; }
    function toggleFlag(c) { if (!c || c.rev || over) return; c.flag = !c.flag; c.el.classList.toggle("flag", c.flag); c.el.textContent = c.flag ? "⚑" : ""; flags += c.flag ? 1 : -1; setStat(); }

    stage.addEventListener("click", function (e) { if (suppressClick) { suppressClick = false; return; } var c = cellOf(e); if (c) reveal(c); });
    stage.addEventListener("contextmenu", function (e) { var c = cellOf(e); if (!c) return; e.preventDefault(); toggleFlag(c); });
    stage.addEventListener("touchstart", function (e) { var c = cellOf(e); if (!c) return; lpTimer = setTimeout(function () { lpTimer = null; suppressClick = true; toggleFlag(c); if (navigator.vibrate) navigator.vibrate(15); }, 450); }, { passive: true });
    stage.addEventListener("touchend", function () { if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; } });
    stage.addEventListener("touchmove", function () { if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; } });
    if (reset) reset.addEventListener("click", build);
    build();
  }

  /* ---------------- Snake ---------------- */
  function initSnake() {
    var stage = document.getElementById("lab-snake"); if (!stage) return;
    var canvas = stage.querySelector("canvas"), ctx = canvas.getContext("2d");
    var startBtn = document.getElementById("snake-start"), scoreEl = document.getElementById("snake-score");
    var dpr = Math.min(window.devicePixelRatio || 1, 2), N = 22, cell, snake, dir, ndir, food, score, timer = null, running = false, dead = false;
    var C = { blue: ink("--blue", "#5B90F5"), red: ink("--red", "#F24333"), yellow: ink("--yellow", "#FFC21A") };

    function fit() { var w = Math.min(stage.clientWidth, 420); cell = Math.floor(w / N); var s = cell * N; canvas.style.width = s + "px"; canvas.style.height = s + "px"; canvas.width = s * dpr; canvas.height = s * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function hit(x, y) { return snake.some(function (s) { return s.x === x && s.y === y; }); }
    function place() { do { food = { x: Math.random() * N | 0, y: Math.random() * N | 0 }; } while (hit(food.x, food.y)); }
    function reset() { snake = [{ x: 8, y: 11 }, { x: 7, y: 11 }, { x: 6, y: 11 }]; dir = { x: 1, y: 0 }; ndir = dir; score = 0; place(); scoreEl.textContent = score; draw(); }
    function tick() {
      dir = ndir; var head = { x: (snake[0].x + dir.x + N) % N, y: (snake[0].y + dir.y + N) % N };
      if (hit(head.x, head.y)) { over(); return; }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) { score++; scoreEl.textContent = score; place(); } else snake.pop();
      draw();
    }
    function draw() {
      var w = cell * N; ctx.clearRect(0, 0, w, w);
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell / 2 - 2, 0, 7); ctx.fill();
      for (var i = 0; i < snake.length; i++) { ctx.fillStyle = i === 0 ? C.yellow : C.blue; ctx.fillRect(snake[i].x * cell + 1, snake[i].y * cell + 1, cell - 2, cell - 2); }
    }
    function start() { if (running) { pause(); return; } running = true; startBtn.textContent = "Pause"; timer = setInterval(tick, 110); }
    function pause() { running = false; startBtn.textContent = "Resume"; clearInterval(timer); }
    function over() { running = false; dead = true; clearInterval(timer); startBtn.textContent = "Start"; scoreEl.textContent = score + " · game over"; }

    startBtn.addEventListener("click", function () { if (dead) { dead = false; reset(); } start(); });
    document.addEventListener("keydown", function (e) {
      if (!running) return;
      var k = e.key.toLowerCase(), nd = null;
      if (k === "arrowup" || k === "w") nd = { x: 0, y: -1 };
      else if (k === "arrowdown" || k === "s") nd = { x: 0, y: 1 };
      else if (k === "arrowleft" || k === "a") nd = { x: -1, y: 0 };
      else if (k === "arrowright" || k === "d") nd = { x: 1, y: 0 };
      if (nd) { e.preventDefault(); if (nd.x !== -dir.x && nd.y !== -dir.y) ndir = nd; }
    });
    window.addEventListener("resize", function () { fit(); draw(); });
    var tsx = 0, tsy = 0;
    canvas.addEventListener("touchstart", function (e) { var t = e.touches[0]; tsx = t.clientX; tsy = t.clientY; }, { passive: true });
    canvas.addEventListener("touchmove", function (e) { if (!running) return; var t = e.touches[0], dx = t.clientX - tsx, dy = t.clientY - tsy; if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return; e.preventDefault(); var nd = Math.abs(dx) > Math.abs(dy) ? { x: dx > 0 ? 1 : -1, y: 0 } : { x: 0, y: dy > 0 ? 1 : -1 }; if (nd.x !== -dir.x && nd.y !== -dir.y) ndir = nd; tsx = t.clientX; tsy = t.clientY; }, { passive: false });
    fit(); reset();
  }

  /* ---------------- Pathfinding (BFS / Dijkstra / A*) ---------------- */
  function initPath() {
    var stage = document.getElementById("lab-path"); if (!stage) return;
    var canvas = stage.querySelector("canvas"), ctx = canvas.getContext("2d");
    var controls = document.getElementById("path-controls");
    var dpr = Math.min(window.devicePixelRatio || 1, 2), cols = 30, rows = 16, cell, walls, algo = "astar", timer = null, drawing = false, mode = 1;
    var C = { visited: ink("--blue", "#5B90F5"), path: ink("--red", "#F24333"), wall: ink("--ink", "#F1EEE7"), goal: ink("--yellow", "#FFC21A") };
    var start = { x: 3, y: 8 }, goal = { x: cols - 4, y: 8 };
    function idx(x, y) { return y * cols + x; }
    function fit() { var w = stage.clientWidth; cell = Math.floor(w / cols); var W = cell * cols, H = cell * rows; canvas.style.width = W + "px"; canvas.style.height = H + "px"; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function cellAt(e) { var r = canvas.getBoundingClientRect(), x = Math.floor((e.clientX - r.left) / cell), y = Math.floor((e.clientY - r.top) / cell); if (x < 0 || y < 0 || x >= cols || y >= rows) return null; return { x: x, y: y }; }
    function draw(state, path) {
      var W = cell * cols, H = cell * rows; ctx.clearRect(0, 0, W, H);
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        var i = idx(x, y), a = 0, col;
        if (walls[i]) { col = C.wall; a = 0.85; }
        else if (state && state[i]) { col = C.visited; a = 0.32; }
        if (a) { ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2); }
      }
      if (path) { ctx.globalAlpha = 0.9; ctx.fillStyle = C.path; for (var p = 0; p < path.length; p++) ctx.fillRect(path[p].x * cell + 1, path[p].y * cell + 1, cell - 2, cell - 2); }
      ctx.globalAlpha = 1; ctx.lineWidth = 2;
      ctx.strokeStyle = C.visited; ctx.strokeRect(start.x * cell + 2, start.y * cell + 2, cell - 4, cell - 4);
      ctx.strokeStyle = C.goal; ctx.strokeRect(goal.x * cell + 2, goal.y * cell + 2, cell - 4, cell - 4);
    }
    function search() {
      var came = {}, g = {}, seen = new Uint8Array(cols * rows), order = [];
      var sI = idx(start.x, start.y), gI = idx(goal.x, goal.y), frontier = [sI]; g[sI] = 0; seen[sI] = 1;
      function h(i) { return Math.abs((i % cols) - goal.x) + Math.abs(((i / cols) | 0) - goal.y); }
      var found = false;
      while (frontier.length) {
        var ci;
        if (algo === "bfs") ci = frontier.shift();
        else { var best = 0; for (var k = 1; k < frontier.length; k++) { var fk = g[frontier[k]] + (algo === "astar" ? h(frontier[k]) : 0), fb = g[frontier[best]] + (algo === "astar" ? h(frontier[best]) : 0); if (fk < fb) best = k; } ci = frontier.splice(best, 1)[0]; }
        order.push(ci); if (ci === gI) { found = true; break; }
        var cx = ci % cols, cy = (ci / cols) | 0, nb = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (var n = 0; n < 4; n++) { var nx = cx + nb[n][0], ny = cy + nb[n][1]; if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue; var ni = idx(nx, ny); if (walls[ni]) continue; var ng = g[ci] + 1; if (!(ni in g) || ng < g[ni]) { g[ni] = ng; came[ni] = ci; if (!seen[ni]) { seen[ni] = 1; frontier.push(ni); } } }
      }
      var path = null;
      if (found) { path = []; var cur = gI; while (cur !== sI) { path.push({ x: cur % cols, y: (cur / cols) | 0 }); cur = came[cur]; } path.push({ x: start.x, y: start.y }); }
      return { order: order, path: path };
    }
    function run() { stop(); var res = search(), state = new Uint8Array(cols * rows), i = 0; timer = setInterval(function () { for (var b = 0; b < 3 && i < res.order.length; b++) state[res.order[i++]] = 1; if (i >= res.order.length) { clearInterval(timer); timer = null; draw(state, res.path); return; } draw(state, null); }, 16); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function clearAll() { stop(); walls = new Uint8Array(cols * rows); draw(null, null); }
    canvas.addEventListener("pointerdown", function (e) { var c = cellAt(e); if (!c) return; if ((c.x === start.x && c.y === start.y) || (c.x === goal.x && c.y === goal.y)) return; drawing = true; mode = walls[idx(c.x, c.y)] ? 0 : 1; walls[idx(c.x, c.y)] = mode; draw(null, null); });
    canvas.addEventListener("pointermove", function (e) { if (!drawing) return; var c = cellAt(e); if (!c) return; if ((c.x === start.x && c.y === start.y) || (c.x === goal.x && c.y === goal.y)) return; walls[idx(c.x, c.y)] = mode; draw(null, null); });
    window.addEventListener("pointerup", function () { drawing = false; });
    if (controls) controls.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; if (b.dataset.act === "run") { run(); return; } if (b.dataset.act === "clear") { clearAll(); return; } if (b.dataset.algo) { algo = b.dataset.algo; [].forEach.call(controls.querySelectorAll("[data-algo]"), function (x) { x.classList.toggle("on", x === b); }); run(); } });
    window.addEventListener("resize", function () { fit(); draw(null, null); });
    walls = new Uint8Array(cols * rows); fit(); draw(null, null); onceSeen(stage, run);
  }

  /* ---------------- k-means clustering ---------------- */
  function initKmeans() {
    var stage = document.getElementById("lab-kmeans"); if (!stage) return;
    var canvas = stage.querySelector("canvas"), ctx = canvas.getContext("2d");
    var controls = document.getElementById("kmeans-controls");
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W, H = 260, K = 3, pts = [], cents = [], timer = null;
    var inks = [ink("--blue", "#5B90F5"), ink("--red", "#F24333"), ink("--yellow", "#FFC21A")];
    function fit() { W = stage.clientWidth; canvas.style.width = W + "px"; canvas.style.height = H + "px"; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function seed() { stop(); pts = []; for (var c = 0; c < K; c++) { var cx = Math.random() * W * 0.7 + W * 0.15, cy = Math.random() * H * 0.7 + H * 0.15; for (var i = 0; i < 36; i++) pts.push({ x: cx + (Math.random() - 0.5) * 90, y: cy + (Math.random() - 0.5) * 90, c: -1 }); } cents = []; for (var k = 0; k < K; k++) cents.push({ x: Math.random() * W, y: Math.random() * H }); draw(); }
    function step() { var changed = false, i, k; for (i = 0; i < pts.length; i++) { var best = 0, bd = 1e9; for (k = 0; k < K; k++) { var dx = pts[i].x - cents[k].x, dy = pts[i].y - cents[k].y, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = k; } } if (pts[i].c !== best) { changed = true; pts[i].c = best; } } for (k = 0; k < K; k++) { var sx = 0, sy = 0, n = 0; for (i = 0; i < pts.length; i++) if (pts[i].c === k) { sx += pts[i].x; sy += pts[i].y; n++; } if (n) { cents[k].x = sx / n; cents[k].y = sy / n; } } draw(); return changed; }
    function run() { stop(); timer = setInterval(function () { if (!step()) { clearInterval(timer); timer = null; } }, 550); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function draw() { ctx.clearRect(0, 0, W, H); var i, k; for (i = 0; i < pts.length; i++) { ctx.fillStyle = pts[i].c < 0 ? ink("--muted", "#888") : inks[pts[i].c % 3]; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 3.4, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; for (k = 0; k < K; k++) { ctx.fillStyle = inks[k % 3]; ctx.strokeStyle = ink("--ink", "#fff"); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cents[k].x, cents[k].y, 8, 0, 7); ctx.fill(); ctx.stroke(); } }
    if (controls) controls.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; if (b.dataset.act === "new") seed(); else if (b.dataset.act === "step") step(); else if (b.dataset.act === "run") run(); });
    window.addEventListener("resize", function () { fit(); draw(); });
    fit(); seed();
  }

  /* ---------------- Reaction–diffusion (Gray–Scott) ---------------- */
  function initRD() {
    var stage = document.getElementById("lab-rd"); if (!stage) return;
    var canvas = stage.querySelector("canvas"), ctx = canvas.getContext("2d");
    var controls = document.getElementById("rd-controls");
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var scale = 5, W, H, cols, rows, A, B, A2, B2, img, feed = 0.0545, kill = 0.062, dA = 1, dB = 0.5;
    var bgc = hexRgb(ink("--bg", "#14120E")), fgc = hexRgb(ink("--blue", "#5B90F5"));
    function fit() { W = Math.min(stage.clientWidth, 620); H = Math.round(W * 0.5); cols = Math.floor(W / scale); rows = Math.floor(H / scale); canvas.style.width = W + "px"; canvas.style.height = H + "px"; canvas.width = cols; canvas.height = rows; A = new Float32Array(cols * rows); B = new Float32Array(cols * rows); A2 = new Float32Array(cols * rows); B2 = new Float32Array(cols * rows); img = ctx.createImageData(cols, rows); seed(); }
    function seed() { for (var i = 0; i < A.length; i++) { A[i] = 1; B[i] = 0; } var cx = cols >> 1, cy = rows >> 1; for (var y = -6; y <= 6; y++) for (var x = -6; x <= 6; x++) { var gx = (cx + x + cols) % cols, gy = (cy + y + rows) % rows; if (Math.random() < 0.9) B[gy * cols + gx] = 1; } if (reduce) { for (var s = 0; s < 320; s++) step(); } render(); }
    function step() {
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        var i = y * cols + x, xm = (x - 1 + cols) % cols, xp = (x + 1) % cols, ym = (y - 1 + rows) % rows, yp = (y + 1) % rows;
        var la = A[y * cols + xm] * 0.2 + A[y * cols + xp] * 0.2 + A[ym * cols + x] * 0.2 + A[yp * cols + x] * 0.2 + (A[ym * cols + xm] + A[ym * cols + xp] + A[yp * cols + xm] + A[yp * cols + xp]) * 0.05 - A[i];
        var lb = B[y * cols + xm] * 0.2 + B[y * cols + xp] * 0.2 + B[ym * cols + x] * 0.2 + B[yp * cols + x] * 0.2 + (B[ym * cols + xm] + B[ym * cols + xp] + B[yp * cols + xm] + B[yp * cols + xp]) * 0.05 - B[i];
        var a = A[i], bb = B[i], abb = a * bb * bb;
        var na = a + (dA * la - abb + feed * (1 - a)); var nb = bb + (dB * lb + abb - (kill + feed) * bb);
        A2[i] = na < 0 ? 0 : na > 1 ? 1 : na; B2[i] = nb < 0 ? 0 : nb > 1 ? 1 : nb;
      }
      var t = A; A = A2; A2 = t; t = B; B = B2; B2 = t;
    }
    function render() { var d = img.data; for (var i = 0; i < B.length; i++) { var v = B[i] * 4; if (v > 1) v = 1; var j = i * 4; d[j] = bgc[0] + (fgc[0] - bgc[0]) * v; d[j + 1] = bgc[1] + (fgc[1] - bgc[1]) * v; d[j + 2] = bgc[2] + (fgc[2] - bgc[2]) * v; d[j + 3] = 255; } ctx.putImageData(img, 0, 0); }
    var running = false;
    function frame() { if (!running) return; for (var s = 0; s < 6; s++) step(); render(); requestAnimationFrame(frame); }
    if (controls) controls.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; if (b.dataset.feed) { feed = +b.dataset.feed; kill = +b.dataset.kill; [].forEach.call(controls.querySelectorAll("[data-feed]"), function (x) { x.classList.toggle("on", x === b); }); } seed(); });
    window.addEventListener("resize", function () { fit(); });
    fit();
    if (!reduce) whenSeen(stage, function () { if (!running) { running = true; requestAnimationFrame(frame); } }, function () { running = false; });
  }

  /* ---------------- Tic-tac-toe vs minimax ---------------- */
  function initTTT() {
    var stage = document.getElementById("lab-ttt"); if (!stage) return;
    var status = document.getElementById("ttt-status"), reset = document.getElementById("ttt-reset");
    var board, over;
    var LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    function build() { stage.innerHTML = ""; board = ["", "", "", "", "", "", "", "", ""]; over = false; var g = document.createElement("div"); g.className = "ttt-grid"; for (var i = 0; i < 9; i++) { var el = document.createElement("button"); el.type = "button"; el.className = "ttt-cell"; el.dataset.i = i; g.appendChild(el); } stage.appendChild(g); status.textContent = "Your move (X)"; }
    function winner(b) { for (var i = 0; i < LINES.length; i++) { var l = LINES[i]; if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return b[l[0]]; } return b.indexOf("") < 0 ? "draw" : null; }
    function minimax(b, player) { var w = winner(b); if (w === "O") return { score: 10 }; if (w === "X") return { score: -10 }; if (w === "draw") return { score: 0 }; var best = { score: player === "O" ? -999 : 999, i: -1 }; for (var i = 0; i < 9; i++) { if (b[i]) continue; b[i] = player; var r = minimax(b, player === "O" ? "X" : "O"); b[i] = ""; if (player === "O" ? r.score > best.score : r.score < best.score) { best = { score: r.score, i: i }; } } return best; }
    function render() { var cells = stage.querySelectorAll(".ttt-cell"); for (var i = 0; i < 9; i++) { cells[i].textContent = board[i]; cells[i].classList.toggle("x", board[i] === "X"); cells[i].classList.toggle("o", board[i] === "O"); } var w = winner(board); if (w) { over = true; status.textContent = w === "draw" ? "Draw." : (w === "X" ? "You win?!" : "AI wins"); } }
    stage.addEventListener("click", function (e) { var el = e.target.closest(".ttt-cell"); if (!el || over) return; var i = +el.dataset.i; if (board[i]) return; board[i] = "X"; render(); if (over) return; status.textContent = "Thinking…"; setTimeout(function () { var m = minimax(board.slice(), "O"); if (m.i >= 0) board[m.i] = "O"; render(); if (!over) status.textContent = "Your move (X)"; }, 160); });
    if (reset) reset.addEventListener("click", build);
    build();
  }

  function hexRgb(h) { h = (h || "").replace("#", ""); if (h.length === 3) h = h.replace(/./g, "$&$&"); var n = parseInt(h, 16); if (isNaN(n) || h.length !== 6) return [20, 18, 14]; return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

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
      function () { var n = ri(18, 40), p = 1; for (var i = 0; i < n; i++) p *= (365 - i) / 365; return { q: "In a room of " + n + " people, what's the probability that at least two share a birthday?", kind: "pct", val: (1 - p) * 100, why: "1 − (365·364·…) / 365^" + n + ". The birthday paradox — it already passes 50% at just 23 people." }; },
      function () { var n = ri(3, 12); return { q: "You roll a fair die " + n + " times. What's the probability of at least one six?", kind: "pct", val: (1 - Math.pow(5 / 6, n)) * 100, why: "1 − (5/6)^" + n + " — compute the chance of *no* six, then subtract from 1." }; },
      function () { var n = ri(6, 12), k = ri(2, n - 2); return { q: "Flip a fair coin " + n + " times. What's the probability of exactly " + k + " heads?", kind: "pct", val: C(n, k) / Math.pow(2, n) * 100, why: "C(" + n + "," + k + ") / 2^" + n + " = " + C(n, k) + "/" + Math.pow(2, n) + "." }; },
      function () { var r = ri(3, 8), b = ri(3, 8); return { q: "A bag holds " + r + " red and " + b + " blue balls. You draw two without replacement — probability both are red?", kind: "pct", val: (r / (r + b)) * ((r - 1) / (r + b - 1)) * 100, why: "(" + r + "/" + (r + b) + ") × (" + (r - 1) + "/" + (r + b - 1) + ")." }; },
      function () { var n = ri(6, 14), k = ri(2, 5); return { q: "How many ways can you choose " + k + " items from " + n + ", if order doesn't matter?", kind: "int", val: C(n, k), why: "C(" + n + "," + k + ") = " + n + "! / (" + k + "! · " + (n - k) + "!)." }; },
      function () { var n = ri(4, 7); return { q: "How many ways can you arrange " + n + " distinct books on a shelf?", kind: "int", val: fact(n), why: n + "! = " + n + " × " + (n - 1) + " × … × 1." }; },
      function () { var n = ri(5, 12); return { q: n + " people each shake hands once with everyone else. How many handshakes happen?", kind: "int", val: C(n, 2), why: "C(" + n + ",2) = " + n + "·" + (n - 1) + "/2 — one shake per pair." }; }
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

  initSort(); initMines(); initSnake(); initPath(); initKmeans(); initRD(); initTTT(); initDaily();
})();
