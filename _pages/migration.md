---
layout: page
permalink: /lab/migration/
title: When did we get here?
image: /assets/social/lab-migration.png
description: A game on Buckminster Fuller's world map. Follow Homo sapiens out of Africa, guess when people first reached each place, then see what the evidence says.
---

<p class="lab-lede">Our species evolved in Africa, then walked and later sailed to almost every part of the world. This is that journey on Buckminster Fuller's world map, which keeps the land together as one island in one ocean. At each of eight stops, guess when people first arrived, then see what the evidence says.</p>

<div class="mig" id="mig">
  <div class="mig-stage" id="mig-stage" data-world="{{ '/assets/lab/fuller-world.json' | relative_url }}" data-stops="{{ '/assets/lab/migration.json' | relative_url }}">
    <canvas role="img" aria-label="Loading the map"></canvas>
  </div>

  <div class="mig-panel">
    <div class="mig-ask">
      <p class="mig-step mono" id="mig-step">&nbsp;</p>
      <ol class="mig-dots" id="mig-dots" aria-hidden="true"></ol>
      <h2 class="mig-q" id="mig-q">Loading the map…</h2>
      <form class="mig-form" id="mig-form" hidden>
        <label class="sr-only" for="mig-guess">Your guess, in years ago</label>
        <input type="range" id="mig-guess" min="0" max="1000" step="1" value="500">
        <div class="mig-scale mono" aria-hidden="true"><span>300,000 years ago</span><span>500 years ago</span></div>
        <p class="mig-value" id="mig-value" aria-hidden="true">&nbsp;</p>
        <button type="submit" class="mig-go" id="mig-go">Lock in</button>
      </form>
    </div>

    <div class="mig-answer" id="mig-answer">
      <p class="mig-wait" id="mig-wait">Make a guess to see the evidence.</p>
      <div id="mig-result" hidden>
        <dl class="lab-readout mig-readout" id="mig-readout"></dl>
        <p class="mig-site" id="mig-site"></p>
        <p class="mig-note" id="mig-note"></p>
        <p class="mig-cite" id="mig-cite"></p>
        <button type="button" class="mig-next" id="mig-next">Next stop</button>
      </div>
      <div id="mig-end" hidden>
        <p class="mig-total" id="mig-total"></p>
        <ol class="mig-scores" id="mig-scores"></ol>
        <p class="mig-best mono" id="mig-best"></p>
        <div class="lab-controls">
          <button type="button" id="mig-share">Copy result</button>
          <button type="button" id="mig-again">Play again</button>
        </div>
        <p class="mig-shared mono" id="mig-shared" aria-live="polite"></p>
      </div>
    </div>
    <p class="sr-only" id="mig-status" aria-live="polite"></p>
  </div>
</div>

<noscript><p class="lab-error">This game needs JavaScript to draw the map.</p></noscript>

<p class="lab-source">Map: Natural Earth land outlines (public domain) on Buckminster Fuller's projection, using Robert W. Gray's equations. Dates: the papers linked at each stop. A guess anywhere inside the evidence range scores 100; debated routes are dashed. Fuller's map cuts the oceans open, so a route can leave one edge and come back at another.</p>
<p class="lab-related"><a href="{{ '/lab/' | relative_url }}">← Back to the Lab</a></p>

<script src="{{ '/assets/js/migration.js' | relative_url }}" defer></script>
