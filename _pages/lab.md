---
layout: page
permalink: /lab/
title: Lab
---

<p class="lab-lede">Half notebook, half playground: small things I build to understand an idea by making it move. The first two cards are companions to posts, so you can ask the data your own question. Below them are a clustering algorithm you can watch settle and a puzzle that changes daily. <em>Psst:</em> type <code>life</code>, <code>langton</code> or <code>turing</code> anywhere on the site, or try the Konami code.</p>

<div class="lab-feature-wrap">
<a class="lab-feature" href="{{ '/lab/migration/' | relative_url }}">
  <span class="lab-feature-kicker mono">New · a game</span>
  <span class="lab-feature-title">When did we get here?</span>
  <span class="lab-feature-text">Follow our species out of Africa on Buckminster Fuller's world map, and guess when people first reached eight places.</span>
  <span class="lab-feature-go mono">Play →</span>
</a>
</div>

<div class="lab">

  <section class="lab-card lab-card--wide lab-card--companion" id="tube-day">
    <div class="lab-head">
      <h2>Your station's day</h2>
      <div class="lab-controls lab-picker">
        <label class="sr-only" for="tube-station">Station</label>
        <input id="tube-station" list="tube-stations" type="text" autocomplete="off" spellcheck="false" placeholder="station name" value="Oxford Circus">
        <datalist id="tube-stations"></datalist>
        <button type="button" id="tube-random">Random</button>
      </div>
    </div>
    <div class="lab-stage lab-stage--chart" id="lab-tube" data-src="{{ '/assets/lab/tube-day.json' | relative_url }}"><canvas tabindex="0" role="img" aria-label="Loading station data" aria-describedby="tube-note"></canvas></div>
    <p class="lab-hover" id="tube-hover" aria-live="off">&nbsp;</p>
    <dl class="lab-readout" id="tube-readout" aria-live="polite"></dl>
    <p class="lab-note" id="tube-note">Blue: the station's flow per 15 minutes. Dashed: the whole network, scaled to the same peak. Hover, or focus the chart and use the arrow keys.</p>
    <p class="lab-source">Powered by TfL Open Data. One modelled typical day; nothing between 02:00 and 05:00. Paddington's two Tube stations are combined here, so the list has 267 names for 269 stations.</p>
    <p class="lab-related"><a href="{{ '/writing/london-tube-crowding/' | relative_url }}">Related: How the crowd moves →</a></p>
  </section>

  <section class="lab-card lab-card--wide lab-card--companion" id="plaque-voronoi">
    <div class="lab-head">
      <h2>Voronoi playground</h2>
      <div class="lab-controls" id="voronoi-controls">
        <div class="lab-controls" role="group" aria-label="View">
          <button type="button" data-act="central" class="on" aria-pressed="true">Central</button>
          <button type="button" data-act="all" aria-pressed="false">All London</button>
        </div>
        <div class="lab-controls" role="group" aria-label="Data">
          <button type="button" data-act="real" class="on" aria-pressed="true">Real plaques</button>
          <button type="button" data-act="random" aria-pressed="false">Random scatter</button>
        </div>
        <button type="button" data-act="reset">Reset</button>
      </div>
    </div>
    <div class="lab-stage lab-stage--chart" id="lab-voronoi" data-src="{{ '/assets/lab/plaques.json' | relative_url }}"><canvas tabindex="0" role="img" aria-label="Loading plaque data" aria-describedby="voronoi-note"></canvas></div>
    <p class="lab-hover" id="voronoi-hover">&nbsp;</p>
    <dl class="lab-readout" id="voronoi-readout" aria-live="polite"></dl>
    <p class="lab-note" id="voronoi-note">Each cell is the patch of London closer to one plaque than to any other. Darker cells belong to plaques with a close neighbour. Click the map (or focus it and press Enter) to add a plaque, or try Random scatter to see what no clustering looks like.</p>
    <p class="lab-source">Plaque locations from English Heritage, scraped August 2026 for personal, non-commercial use.</p>
    <p class="lab-related"><a href="{{ '/writing/the-geometry-of-londons-blue-plaques/' | relative_url }}">Related: The geometry of London's blue plaques →</a></p>
  </section>

  <section class="lab-card lab-card--wide">
    <div class="lab-head">
      <h2>k-means clustering</h2>
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

  <section class="lab-card lab-card--wide">
    <div class="lab-head">
      <h2>Puzzle of the day</h2>
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

</div>

<script src="{{ '/assets/js/lab.js' | relative_url }}" defer></script>
