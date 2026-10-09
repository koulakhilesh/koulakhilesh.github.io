/* ============================================================
   Which Wren church? (loaded only by the Wren series post)
   Tree: /assets/wren/chooser.json, exported by
   CodePlayground/london-wren-churches/chooser_wren.py.
   Dependency-free; builds DOM nodes, never parses HTML.
   ============================================================ */
(function () {
  "use strict";
  var root = document.getElementById("wc"); if (!root) return;
  var T = null, trail = [];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function button(cls, label, onClick) {
    var b = el("button", cls, label); b.type = "button"; b.addEventListener("click", onClick); return b;
  }
  function safeUrl(u) { return /^https:\/\//.test(u || "") ? u : null; }
  function focusHead() { var h = root.querySelector(".wc-ask"); if (h) h.focus(); }

  function render() {
    root.textContent = "";
    var node = trail.length ? trail[trail.length - 1].to : T.start;
    if (trail.length) {
      root.appendChild(el("p", "wc-trail", trail.map(function (s) { return T.questions[s.from].text + " " + s.answer; }).join(" · ")));
    }
    var actions = el("div", "wc-actions");
    if (T.questions[node]) {
      var q = T.questions[node];
      root.appendChild(el("p", "wc-step", "Question " + (trail.length + 1)));
      var h = el("h3", "wc-ask", q.text); h.tabIndex = -1; root.appendChild(h);
      actions.appendChild(button("wc-yes-btn", "Yes", function () { trail.push({ from: node, answer: "yes", to: q.yes }); render(); focusHead(); }));
      actions.appendChild(button("wc-no-btn", "No", function () { trail.push({ from: node, answer: "no", to: q.no }); render(); focusHead(); }));
    } else {
      var leaf = T.leaves[node];
      root.appendChild(el("p", "wc-step", "Try"));
      var t = el("h3", "wc-ask", leaf.title); t.tabIndex = -1; root.appendChild(t);
      var list = el("ul", "wc-sites");
      leaf.sites.forEach(function (s) {
        var li = el("li"), url = safeUrl(s.url);
        if (url) { var a = el("a", null, s.name); a.href = url; a.rel = "noopener"; li.appendChild(a); }
        else li.appendChild(el("strong", null, s.name));
        li.appendChild(el("span", "wc-why", s.why));
        list.appendChild(li);
      });
      root.appendChild(list);
      if (leaf.note) root.appendChild(el("p", "wc-note", leaf.note));
      root.appendChild(el("p", "wc-note", "As published when checked on " + T.checked_at + ". Check the church's own page before you go."));
    }
    if (trail.length) {
      actions.appendChild(button("", "Back", function () { trail.pop(); render(); focusHead(); }));
      actions.appendChild(button("", "Start again", function () { trail = []; render(); focusHead(); }));
    }
    root.appendChild(actions);
  }

  fetch(root.getAttribute("data-src"))
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) { T = data; render(); })
    .catch(function () { root.textContent = "The chooser could not load. The chart above has the same answers."; });
})();
