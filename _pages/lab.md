---
layout: page
permalink: /lab/
title: Lab
---

<p class="lab-lede">Half notebook, half playground: small things I build to understand ideas by making them move — a puzzle that changes daily, algorithms you can watch think, and a few games worth five idle minutes. More to come. <em>Psst:</em> type <code>life</code> or <code>ant</code> anywhere on the site, or try the Konami code.</p>

<div class="lab">

  <section class="lab-card lab-card--wide">
    <div class="lab-head">
      <h3>Puzzle of the day</h3>
      <div class="lab-controls"><span class="lab-stat" id="daily-date"></span></div>
    </div>
    <div class="lab-stage lab-stage--text" id="lab-daily">
      <div class="daily">
        <p class="daily-q" id="daily-q">Loading today's puzzle…</p>
        <div class="daily-actions">
          <input class="daily-input" id="daily-input" type="text" inputmode="decimal" placeholder="your answer" aria-label="Your answer">
          <button id="daily-reveal">Reveal</button>
        </div>
        <p class="daily-a" id="daily-a" hidden></p>
      </div>
    </div>
    <p class="lab-note">A fresh probability puzzle every day, the same for everyone. Type a guess, then Reveal to check. Come back tomorrow for a new one.</p>
  </section>

  <section class="lab-card lab-card--wide">
    <div class="lab-head">
      <h3>Sorting visualizer</h3>
      <div class="lab-controls" id="sort-controls">
        <button data-algo="bubble">Bubble</button>
        <button data-algo="quick" class="on">Quick</button>
        <button data-algo="merge">Merge</button>
        <button data-act="shuffle">Shuffle</button>
      </div>
    </div>
    <div class="lab-stage" id="lab-sort"><canvas></canvas></div>
    <p class="lab-note" id="sort-note">Quicksort · watching it think — comparing <span class="dot y"></span> swapping <span class="dot r"></span></p>
  </section>

  <section class="lab-card lab-card--wide">
    <div class="lab-head">
      <h3>Pathfinding</h3>
      <div class="lab-controls" id="path-controls">
        <button data-algo="bfs">BFS</button>
        <button data-algo="dijkstra">Dijkstra</button>
        <button data-algo="astar" class="on">A*</button>
        <button data-act="run">Run</button>
        <button data-act="clear">Clear</button>
      </div>
    </div>
    <div class="lab-stage" id="lab-path"><canvas></canvas></div>
    <p class="lab-note">Drag on the grid to draw walls, then Run. Blue = explored · red = shortest path.</p>
  </section>

  <section class="lab-card">
    <div class="lab-head">
      <h3>k-means clustering</h3>
      <div class="lab-controls" id="kmeans-controls">
        <button data-act="new">New points</button>
        <button data-act="step">Step</button>
        <button data-act="run" class="on">Run</button>
      </div>
    </div>
    <div class="lab-stage" id="lab-kmeans"><canvas></canvas></div>
    <p class="lab-note">Points snap to the nearest centroid; centroids drift to the mean. Watch it settle.</p>
  </section>

  <section class="lab-card">
    <div class="lab-head">
      <h3>Tic-tac-toe</h3>
      <div class="lab-controls">
        <span class="lab-stat" id="ttt-status">Your move (X)</span>
        <button data-act="reset" id="ttt-reset">New game</button>
      </div>
    </div>
    <div class="lab-stage" id="lab-ttt"></div>
    <p class="lab-note">You're X. The AI plays perfect minimax — the best you'll manage is a draw.</p>
  </section>

  <section class="lab-card">
    <div class="lab-head">
      <h3>Minesweeper</h3>
      <div class="lab-controls">
        <span class="lab-stat" id="mines-stat">13 mines</span>
        <button data-act="reset" id="mines-reset">New game</button>
      </div>
    </div>
    <div class="lab-stage" id="lab-mines"></div>
    <p class="lab-note">Left-click to dig · right-click to flag. The numbers count the mines touching that cell.</p>
  </section>

  <section class="lab-card">
    <div class="lab-head">
      <h3>Snake</h3>
      <div class="lab-controls">
        <span class="lab-stat" id="snake-score">0</span>
        <button data-act="start" id="snake-start">Start</button>
      </div>
    </div>
    <div class="lab-stage" id="lab-snake"><canvas></canvas></div>
    <p class="lab-note">Arrow keys or WASD. No walls — slip off one edge and you'll come back on the other.</p>
  </section>

  <section class="lab-card lab-card--wide">
    <div class="lab-head">
      <h3>Reaction–diffusion</h3>
      <div class="lab-controls" id="rd-controls">
        <button data-feed="0.0545" data-kill="0.062" class="on">Coral</button>
        <button data-feed="0.0367" data-kill="0.0649">Mitosis</button>
        <button data-feed="0.030" data-kill="0.062">Spots</button>
        <button data-act="reseed">Reseed</button>
      </div>
    </div>
    <div class="lab-stage" id="lab-rd"><canvas class="pixelated"></canvas></div>
    <p class="lab-note">Two chemicals, diffusing and reacting — Turing's idea of how a leopard gets its spots.</p>
  </section>

</div>

<script src="{{ '/assets/js/lab.js' | relative_url }}" defer></script>
