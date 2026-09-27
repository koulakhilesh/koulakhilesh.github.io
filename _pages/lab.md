---
layout: page
permalink: /lab/
title: Lab
---

<p class="lab-lede">Half notebook, half playground: small things I build to understand an idea by making it move. For now, a puzzle that changes daily and a clustering algorithm you can watch settle; interactive companions to the posts are on the way. <em>Psst:</em> type <code>life</code>, <code>langton</code> or <code>turing</code> anywhere on the site, or try the Konami code.</p>

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
      <h3>k-means clustering</h3>
      <div class="lab-controls" id="kmeans-controls">
        <button data-act="new">New points</button>
        <button data-act="step">Step</button>
        <button data-act="run">Run</button>
      </div>
    </div>
    <div class="lab-stage" id="lab-kmeans"><canvas></canvas></div>
    <p class="lab-note">Points snap to the nearest centroid; centroids drift to the mean. Watch it settle.</p>
    <p class="lab-related"><a href="{{ '/writing/the-geometry-of-londons-blue-plaques/' | relative_url }}">Related: The geometry of London's blue plaques →</a></p>
  </section>

</div>

<script src="{{ '/assets/js/lab.js' | relative_url }}" defer></script>
