/* ============================================================
   Lab (loaded only on /lab/)
   • Your station's day: Tube flow for any station (tube-day.json)
   • Voronoi playground: London's blue plaques (plaques.json)
   • k-means clustering you can run or step through
   • Puzzle of the day: a date-seeded probability question
   Dependency-free. With reduced motion, k-means jumps to the result.
   ============================================================ */
(function () {
  "use strict";
  function ink(v, f) { var c = getComputedStyle(document.documentElement).getPropertyValue(v).trim(); return c || f; }
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function hexRgb(h, f) {
    h = (h || "").replace("#", "");
    if (h.length === 3) h = h.replace(/./g, "$&$&");
    var n = parseInt(h, 16);
    return (h.length !== 6 || isNaN(n)) ? f : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function sizeCanvas(canvas, w, h) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), ctx = canvas.getContext("2d");
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }
  function fmtInt(n) { return Math.round(n).toLocaleString("en-GB"); }
  function ordinal(n) { var s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
  function whenNear(el, fn) {
    if (!("IntersectionObserver" in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) if (entries[i].isIntersecting) { io.disconnect(); fn(); return; }
    }, { rootMargin: "300px" });
    io.observe(el);
  }
  function loadJSON(stage, cb) {
    fetch(stage.getAttribute("data-src"))
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(cb, function () {
        var p = document.createElement("p");
        p.className = "lab-error"; p.textContent = "Couldn't load the data for this card.";
        stage.insertBefore(p, stage.firstChild);
        var c = stage.querySelector("canvas"); if (c) c.setAttribute("aria-label", p.textContent);
      });
  }
  function onTheme(fn) {
    new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ---------------- Your station's day (Tube) ---------------- */
  function initTube() {
    var stage = document.getElementById("lab-tube"); if (!stage) return;
    var canvas = stage.querySelector("canvas"), input = document.getElementById("tube-station");
    var list = document.getElementById("tube-stations"), rnd = document.getElementById("tube-random");
    var readout = document.getElementById("tube-readout"), hover = document.getElementById("tube-hover");
    var D = null, byName = {}, network = [], cur = null, cross = -1, ctx, W, H = 280;
    var PAD = { l: 52, r: 12, t: 22, b: 26 }, QUIET = 5000;
    var LINE_NAMES = { "hammersmith-city": "Hammersmith & City", "waterloo-city": "Waterloo & City" };

    function lineName(id) { return LINE_NAMES[id] || id.charAt(0).toUpperCase() + id.slice(1); }
    function hourOf(label) { return +label.slice(0, 2) + (+label.slice(3)) / 60; }
    // Busiest slice starting in [a, b) hours; the notebook's windows are 5-11 and 15-20.
    function peakIn(v, a, b) {
      var best = -1;
      for (var i = 0; i < v.length; i++) {
        var h = hourOf(D.slices[i]);
        if (h >= a && h < b && (best < 0 || v[i] > v[best])) best = i;
      }
      return best;
    }
    function xAt(i) { return PAD.l + (W - PAD.l - PAD.r) * i / (D.slices.length - 1); }
    function idxAt(px) {
      var i = Math.round((px - PAD.l) / (W - PAD.l - PAD.r) * (D.slices.length - 1));
      return Math.max(0, Math.min(D.slices.length - 1, i));
    }
    function fit() { W = stage.clientWidth; ctx = sizeCanvas(canvas, W, H); }

    function setup(data) {
      D = data;
      network = D.slices.map(function () { return 0; });
      D.stations.forEach(function (s) {
        s.total = 0;
        s.v.forEach(function (x, i) { s.total += x; network[i] += x; });
        byName[s.n.toLowerCase()] = s;
      });
      D.stations.slice().sort(function (a, b) { return b.total - a.total; })
        .forEach(function (s, i) { s.rank = i + 1; });
      D.stations.forEach(function (s) { var o = document.createElement("option"); o.value = s.n; list.appendChild(o); });
      fit();
      if (!pick(input.value)) pick("Oxford Circus");
    }

    function pick(name) {
      var s = D && byName[(name || "").trim().toLowerCase()];
      if (!s) return false;
      cur = s; cross = -1; input.value = s.n;
      draw(); describe();
      return true;
    }

    function draw() {
      if (!cur) return;
      var v = cur.v, max = Math.max.apply(null, v) || 1, nmax = Math.max.apply(null, network) || 1;
      var y = function (val) { return PAD.t + (H - PAD.t - PAD.b) * (1 - val / max); };
      var inkC = ink("--ink", "#171410"), muted = ink("--muted", "#686157");
      ctx.clearRect(0, 0, W, H);
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.strokeStyle = ink("--line2", "#999"); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PAD.l, H - PAD.b + 0.5); ctx.lineTo(W - PAD.r, H - PAD.b + 0.5); ctx.stroke();
      ctx.fillStyle = muted; ctx.textAlign = "center";
      var every = W < 420 ? 6 : 3;
      D.slices.forEach(function (lab, i) {
        if (lab.slice(3) === "00" && (+lab.slice(0, 2) - 5 + 24) % every === 0) ctx.fillText(lab, xAt(i), H - 8);
      });
      ctx.textAlign = "right";
      ctx.fillText(fmtInt(max), PAD.l - 6, PAD.t + 4);
      ctx.fillText("0", PAD.l - 6, H - PAD.b + 4);
      ctx.strokeStyle = muted; ctx.setLineDash([3, 3]);
      ctx.beginPath();
      network.forEach(function (n, i) { var yy = y(n / nmax * max); if (i) ctx.lineTo(xAt(i), yy); else ctx.moveTo(xAt(i), yy); });
      ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = ink("--blue", "#1c5fb0"); ctx.lineWidth = 2;
      ctx.beginPath();
      v.forEach(function (val, i) { if (i) ctx.lineTo(xAt(i), y(val)); else ctx.moveTo(xAt(i), y(val)); });
      ctx.stroke();
      ctx.fillStyle = inkC; ctx.textAlign = "center";
      [peakIn(v, 5, 11), peakIn(v, 15, 20)].forEach(function (i) {
        if (i < 0) return;
        ctx.beginPath(); ctx.arc(xAt(i), y(v[i]), 3.5, 0, 7); ctx.fill();
        ctx.fillText(D.slices[i], xAt(i), Math.max(y(v[i]) - 8, 11));
      });
      if (cross >= 0) {
        ctx.strokeStyle = inkC; ctx.globalAlpha = 0.35; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(xAt(cross) + 0.5, PAD.t); ctx.lineTo(xAt(cross) + 0.5, H - PAD.b); ctx.stroke();
        ctx.globalAlpha = 1;
        hover.textContent = D.slices[cross] + " · " + fmtInt(v[cross]) + " per 15 minutes";
      } else {
        hover.textContent = "\u00a0";
      }
    }

    function describe() {
      var v = cur.v, am = peakIn(v, 5, 11), pm = peakIn(v, 15, 20);
      var ratio = v[am] ? v[pm] / v[am] : null;
      var lean = ratio === null ? "" : ratio < 1 ? " · leans home (morning busier)" : ratio > 1 ? " · leans work (evening busier)" : " · balanced";
      var rows = [
        ["Daily flow", fmtInt(cur.total) + " · " + ordinal(cur.rank) + " of " + D.stations.length],
        ["Lines", cur.l.map(lineName).join(", ")],
        ["From Charing Cross", cur.km.toFixed(1) + " km"],
        ["Morning peak", D.slices[am] + " · " + fmtInt(v[am])],
        ["Evening peak", D.slices[pm] + " · " + fmtInt(v[pm])],
        ["Evening ÷ morning", ratio === null ? "n/a" : ratio.toFixed(2) + lean]
      ];
      if (cur.total < QUIET) rows.push(["Note", "Quiet station (under 5,000 a day), so the ratio is noisy."]);
      readout.textContent = "";
      rows.forEach(function (r) {
        var dt = document.createElement("dt"), dd = document.createElement("dd");
        dt.textContent = r[0]; dd.textContent = r[1];
        readout.appendChild(dt); readout.appendChild(dd);
      });
      canvas.setAttribute("aria-label", cur.n + ": Tube flow through a typical day, peaking at " +
        D.slices[am] + " in the morning and " + D.slices[pm] + " in the evening.");
    }

    input.addEventListener("input", function () { if (D && byName[input.value.trim().toLowerCase()]) pick(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") pick(input.value); });
    rnd.addEventListener("click", function () { if (D) pick(D.stations[Math.floor(Math.random() * D.stations.length)].n); });
    canvas.addEventListener("pointermove", function (e) {
      if (!cur) return;
      hover.setAttribute("aria-live", "off");
      cross = idxAt(e.clientX - canvas.getBoundingClientRect().left); draw();
    });
    canvas.addEventListener("pointerleave", function () { if (cur) { cross = -1; draw(); } });
    canvas.addEventListener("keydown", function (e) {
      if (!cur || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
      e.preventDefault();
      hover.setAttribute("aria-live", "polite");
      cross = cross < 0 ? peakIn(cur.v, 5, 11) : Math.max(0, Math.min(D.slices.length - 1, cross + (e.key === "ArrowRight" ? 1 : -1)));
      draw();
    });
    window.addEventListener("resize", function () { if (cur && stage.clientWidth !== W) { fit(); draw(); } });
    onTheme(function () { if (cur) draw(); });
    whenNear(stage, function () { loadJSON(stage, setup); });
  }

  /* ---------------- Voronoi playground (blue plaques) ---------------- */
  function initVoronoi() {
    var stage = document.getElementById("lab-voronoi"); if (!stage) return;
    var canvas = stage.querySelector("canvas"), controls = document.getElementById("voronoi-controls");
    var readout = document.getElementById("voronoi-readout"), hover = document.getElementById("voronoi-hover");
    // British National Grid metres: about 7 x 4.5 km around Charing Cross.
    var CENTRAL = { x0: 526550, y0: 178180, x1: 533550, y1: 182680 }, GCELL = 250, S = 2;
    var TONES = [[50, 215], [100, 150], [250, 95], [Infinity, 45]];
    var REAL = null, realHull = null, px = [], py = [], kind = [], names = [], nn = [], grid = null;
    var view = "central", source = "real", ctx, W, H, box, scale, resizeT;

    function key(gx, gy) { return gx * 100000 + gy; }
    function addToGrid(i) {
      var k = key(Math.floor(px[i] / GCELL), Math.floor(py[i] / GCELL)), a = grid.get(k);
      if (a) a.push(i); else grid.set(k, [i]);
    }
    function buildGrid() { grid = new Map(); for (var i = 0; i < px.length; i++) addToGrid(i); }

    // Exact nearest point, scanning grid rings outward until no closer point can exist.
    function nearest(x, y, skip) {
      var gx = Math.floor(x / GCELL), gy = Math.floor(y / GCELL), best = -1, bd = Infinity;
      for (var r = 0; r < 400; r++) {
        for (var dx = -r; dx <= r; dx++) {
          var step = (dx === -r || dx === r) ? 1 : 2 * r;
          for (var dy = -r; dy <= r; dy += step) {
            var a = grid.get(key(gx + dx, gy + dy)); if (!a) continue;
            for (var j = 0; j < a.length; j++) {
              var i = a[j]; if (i === skip) continue;
              var ex = px[i] - x, ey = py[i] - y, d = ex * ex + ey * ey;
              if (d < bd) { bd = d; best = i; }
            }
          }
        }
        if (best >= 0 && r * GCELL * r * GCELL >= bd) break;
      }
      return best < 0 ? null : { i: best, d: Math.sqrt(bd) };
    }

    // Monotone chain; returns the hull counter-clockwise (BNG y points north).
    function convexHull(xs, ys) {
      var idx = xs.map(function (_, i) { return i; }).sort(function (a, b) { return xs[a] - xs[b] || ys[a] - ys[b]; });
      function cross(o, a, b) { return (xs[a] - xs[o]) * (ys[b] - ys[o]) - (ys[a] - ys[o]) * (xs[b] - xs[o]); }
      var lower = [], upper = [], i;
      for (i = 0; i < idx.length; i++) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], idx[i]) <= 0) lower.pop();
        lower.push(idx[i]);
      }
      for (i = idx.length - 1; i >= 0; i--) {
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], idx[i]) <= 0) upper.pop();
        upper.push(idx[i]);
      }
      lower.pop(); upper.pop();
      return lower.concat(upper).map(function (k) { return [xs[k], ys[k]]; });
    }
    function polyArea(p) {
      var a = 0;
      for (var i = 0; i < p.length; i++) { var j = (i + 1) % p.length; a += p[i][0] * p[j][1] - p[j][0] * p[i][1]; }
      return Math.abs(a) / 2;
    }
    function inHull(p, x, y) {
      for (var i = 0; i < p.length; i++) {
        var j = (i + 1) % p.length;
        if ((p[j][0] - p[i][0]) * (y - p[i][1]) - (p[j][1] - p[i][1]) * (x - p[i][0]) < 0) return false;
      }
      return true;
    }

    // Clark-Evans over the convex hull, as in blue_plaques_geospatial.ipynb.
    function stats() {
      var n = px.length, sum = 0, d = [];
      nn = new Array(n);
      for (var i = 0; i < n; i++) { var r = nearest(px[i], py[i], i); nn[i] = r ? r.d : 0; sum += nn[i]; d.push(nn[i]); }
      d.sort(function (a, b) { return a - b; });
      var median = n % 2 ? d[(n - 1) / 2] : (d[n / 2 - 1] + d[n / 2]) / 2;
      var density = n / polyArea(convexHull(px, py)), rexp = 0.5 / Math.sqrt(density), mean = sum / n;
      return { n: n, median: median, R: mean / rexp, z: (mean - rexp) / (0.26136 / Math.sqrt(n * density)) };
    }

    function describe(s) {
      var user = 0;
      for (var i = 0; i < kind.length; i++) if (kind[i] === 2) user++;
      var base = fmtInt(s.n - user) + (source === "random" ? " random points" : " plaques");
      var rows = [
        ["Points", base + (user ? ", plus " + user + " of yours" : "")],
        ["Median nearest neighbour", fmtInt(s.median) + " m"],
        ["Clark–Evans R", s.R.toFixed(2) + " (1 = random, below 1 = clustered)"],
        ["z-score", s.z.toFixed(1).replace("-", "\u2212")]
      ];
      readout.textContent = "";
      rows.forEach(function (r) {
        var dt = document.createElement("dt"), dd = document.createElement("dd");
        dt.textContent = r[0]; dd.textContent = r[1];
        readout.appendChild(dt); readout.appendChild(dd);
      });
      canvas.setAttribute("aria-label", "Voronoi diagram of " + s.n + " points. Clark–Evans R " + s.R.toFixed(2) +
        ", median nearest neighbour " + Math.round(s.median) + " metres.");
    }

    function allBox() {
      var M = 1000;
      return { x0: Math.min.apply(null, REAL.x) - M, x1: Math.max.apply(null, REAL.x) + M,
               y0: Math.min.apply(null, REAL.y) - M, y1: Math.max.apply(null, REAL.y) + M };
    }
    function fit() {
      var b = view === "central" ? CENTRAL : allBox();
      W = stage.clientWidth;
      var bw = b.x1 - b.x0, bh = b.y1 - b.y0;
      H = Math.max(260, Math.min(620, Math.round(W * bh / bw)));
      var wantW = Math.max(bw, bh * W / H), wantH = wantW * H / W, cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
      box = { x0: cx - wantW / 2, x1: cx + wantW / 2, y0: cy - wantH / 2, y1: cy + wantH / 2 };
      scale = W / wantW;
      ctx = sizeCanvas(canvas, W, H);
    }

    // Raster Voronoi by jump flooding at S CSS px per sample; points off-screen seed the nearest edge sample.
    function render() {
      var cols = Math.ceil(W / S), rows = Math.ceil(H / S), N = cols * rows, m = S / scale;
      var own = new Int32Array(N).fill(-1), best = new Float64Array(N).fill(Infinity), i, c, r, k;
      function sx(col) { return box.x0 + (col + 0.5) * m; }
      function sy(row) { return box.y1 - (row + 0.5) * m; }
      for (i = 0; i < px.length; i++) {
        c = Math.min(cols - 1, Math.max(0, Math.floor((px[i] - box.x0) / m)));
        r = Math.min(rows - 1, Math.max(0, Math.floor((box.y1 - py[i]) / m)));
        k = r * cols + c;
        var ex = px[i] - sx(c), ey = py[i] - sy(r), d0 = ex * ex + ey * ey;
        if (d0 < best[k]) { best[k] = d0; own[k] = i; }
      }
      for (var step = 1 << Math.max(0, Math.ceil(Math.log2(Math.max(cols, rows))) - 1); step >= 1; step >>= 1) {
        var next = new Int32Array(own);
        for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
          k = r * cols + c;
          var bo = own[k], bd = Infinity, x = sx(c), y = sy(r);
          if (bo >= 0) bd = (px[bo] - x) * (px[bo] - x) + (py[bo] - y) * (py[bo] - y);
          for (var oy = -step; oy <= step; oy += step) {
            var rr = r + oy; if (rr < 0 || rr >= rows) continue;
            for (var ox = -step; ox <= step; ox += step) {
              var cc = c + ox; if (cc < 0 || cc >= cols || (ox === 0 && oy === 0)) continue;
              var o = own[rr * cols + cc]; if (o < 0 || o === bo) continue;
              var d2 = (px[o] - x) * (px[o] - x) + (py[o] - y) * (py[o] - y);
              if (d2 < bd) { bd = d2; bo = o; }
            }
          }
          next[k] = bo;
        }
        own = next;
      }
      var off = document.createElement("canvas"); off.width = cols; off.height = rows;
      var octx = off.getContext("2d"), img = octx.createImageData(cols, rows), px4 = img.data;
      var blue = hexRgb(ink("--blue", ""), [28, 95, 176]), line = hexRgb(ink("--ink", ""), [23, 20, 16]);
      for (k = 0; k < N; k++) {
        var ow = own[k], j = k * 4;
        c = k % cols; r = (k - c) / cols;
        if ((c + 1 < cols && own[k + 1] !== ow) || (r + 1 < rows && own[k + cols] !== ow)) {
          px4[j] = line[0]; px4[j + 1] = line[1]; px4[j + 2] = line[2]; px4[j + 3] = 120;
          continue;
        }
        var dist = nn[ow], a = 45;
        for (var t = 0; t < TONES.length; t++) if (dist < TONES[t][0]) { a = TONES[t][1]; break; }
        px4[j] = blue[0]; px4[j + 1] = blue[1]; px4[j + 2] = blue[2]; px4[j + 3] = a;
      }
      octx.putImageData(img, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, cols * S, rows * S);
      var dot = ink("--ink", "#171410"), red = ink("--red", "#F24333"), rad = view === "central" ? 2.4 : 1.4;
      for (i = 0; i < px.length; i++) {
        var X = (px[i] - box.x0) * scale, Y = (box.y1 - py[i]) * scale;
        if (X < -5 || Y < -5 || X > W + 5 || Y > H + 5) continue;
        if (kind[i] === 2) { ctx.fillStyle = red; ctx.fillRect(X - 4, Y - 4, 8, 8); }
        else { ctx.fillStyle = dot; ctx.beginPath(); ctx.arc(X, Y, rad, 0, 7); ctx.fill(); }
      }
      var len = view === "central" ? 1000 : 5000;
      ctx.fillStyle = ink("--card", "#fbf9f4"); ctx.fillRect(6, H - 34, len * scale + 12, 28);
      ctx.fillStyle = dot; ctx.fillRect(12, H - 14, len * scale, 2);
      ctx.font = "11px 'JetBrains Mono', monospace"; ctx.textAlign = "left";
      ctx.fillText(len / 1000 + " km", 12, H - 20);
    }

    function refresh() { buildGrid(); describe(stats()); render(); }
    function useReal() {
      px = REAL.x.slice(); py = REAL.y.slice(); names = REAL.n.slice();
      kind = px.map(function () { return 0; });
      refresh();
    }
    function useRandom() {
      var h = realHull, n = REAL.x.length;
      var xs = h.map(function (p) { return p[0]; }), ys = h.map(function (p) { return p[1]; });
      var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
      px = []; py = []; names = []; kind = [];
      while (px.length < n) {
        var x = x0 + Math.random() * (x1 - x0), y = y0 + Math.random() * (y1 - y0);
        if (inHull(h, x, y)) { px.push(x); py.push(y); names.push(""); kind.push(1); }
      }
      refresh();
    }
    function press(group, on) {
      group.forEach(function (act) {
        var b = controls.querySelector('[data-act="' + act + '"]');
        b.classList.toggle("on", act === on); b.setAttribute("aria-pressed", act === on ? "true" : "false");
      });
    }
    function toWorld(e) {
      var rc = canvas.getBoundingClientRect();
      return [box.x0 + (e.clientX - rc.left) / scale, box.y1 - (e.clientY - rc.top) / scale];
    }

    function setup(data) {
      REAL = data;
      realHull = convexHull(REAL.x, REAL.y);
      fit();
      useReal();
    }

    controls.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || !REAL) return;
      var act = b.getAttribute("data-act");
      if (act === "central" || act === "all") { view = act; press(["central", "all"], act); fit(); render(); }
      else if (act === "random") { source = "random"; press(["real", "random"], "random"); useRandom(); }
      else if (act === "real" || act === "reset") { source = "real"; press(["real", "random"], "real"); useReal(); }
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!REAL) return;
      var w = toWorld(e), hit = nearest(w[0], w[1], -1); if (!hit) return;
      var who = kind[hit.i] === 0 ? names[hit.i] : kind[hit.i] === 1 ? "a random point" : "your plaque";
      hover.textContent = "Nearest: " + who + " · " + fmtInt(hit.d) + " m away";
    });
    canvas.addEventListener("pointerleave", function () { hover.textContent = "\u00a0"; });
    canvas.addEventListener("click", function (e) {
      if (!REAL) return;
      var w = toWorld(e);
      addPoint(w[0], w[1]);
    });
    canvas.addEventListener("keydown", function (e) {
      if (!REAL || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      addPoint(box.x0 + Math.random() * (box.x1 - box.x0), box.y0 + Math.random() * (box.y1 - box.y0));
    });
    function addPoint(x, y) {
      px.push(Math.round(x)); py.push(Math.round(y)); kind.push(2); names.push("");
      addToGrid(px.length - 1);
      describe(stats()); render();
    }
    window.addEventListener("resize", function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () { if (REAL && stage.clientWidth !== W) { fit(); render(); } }, 150);
    });
    onTheme(function () { if (REAL) render(); });
    whenNear(stage, function () { loadJSON(stage, setup); });
  }

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

  initTube(); initVoronoi(); initKmeans(); initDaily();
})();
