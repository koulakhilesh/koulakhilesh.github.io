---
title: "The geometry of London's blue plaques: Voronoi, clustering, and a travelling-salesman tour"
date: 2026-07-11 09:00:00
last_modified_at: 2026-08-15 09:00:00
thumbnail: /assets/thumbs/geometry.png
glyph: geometry
image: /assets/social/the-geometry-of-londons-blue-plaques.png
series: "London's blue plaques"
series_part: 2
tags: [Data Science, Geospatial, Optimization, Plotly, London]
excerpt: "A companion piece that treats 1,036 blue plaques as a spatial point pattern and an optimisation problem: proving the clustering with statistics, carving London into nearest-plaque territories, and hand-rolling a travelling-salesman tour of every borough."
toc: true
---

<div style="text-align:center;margin:2rem 0 2.4rem;">
<svg width="188" height="188" viewBox="0 0 200 200" role="img" aria-label="A stylised blue plaque reading 1,036 points, the geometry of memory, 2026">
  <defs>
    <path id="arcTop2" d="M 36 100 A 64 64 0 0 1 164 100" fill="none"/>
    <path id="arcBot2" d="M 46 100 A 54 54 0 0 0 154 100" fill="none"/>
  </defs>
  <circle cx="100" cy="100" r="94" fill="#1c5fb0"/>
  <circle cx="100" cy="100" r="94" fill="none" stroke="#0e3f80" stroke-width="4"/>
  <circle cx="100" cy="100" r="78" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85"/>
  <text fill="#fff" font-family="Georgia, serif" font-size="10" letter-spacing="0.8" text-anchor="middle">
    <textPath href="#arcTop2" startOffset="50%">THE GEOMETRY OF MEMORY</textPath>
  </text>
  <text fill="#fff" font-family="Georgia, serif" font-size="12.5" letter-spacing="3" text-anchor="middle">
    <textPath href="#arcBot2" startOffset="50%">2026</textPath>
  </text>
  <text x="100" y="90" fill="#fff" font-family="Georgia, serif" font-size="30" font-weight="700" text-anchor="middle">1,036</text>
  <text x="100" y="113" fill="#fff" font-family="Georgia, serif" font-size="14" letter-spacing="3.5" text-anchor="middle">POINTS</text>
  <text x="100" y="131" fill="#fff" font-family="Georgia, serif" font-size="14" letter-spacing="3.5" text-anchor="middle">ON A MAP</text>
</svg>
</div>

In [the first half of this]({{ '/writing/london-blue-plaques/' | relative_url }}) I scraped every English Heritage blue plaque in London and asked *who* gets remembered. The headline was that London's memory is astonishingly concentrated: you could see it just by dropping the dots on a map.

But "you can see it" is not the same as "it's true." This post is the data scientist's follow-up: take the same 1,036 geolocated plaques and treat them as a **spatial point pattern** and an **optimisation problem**. Can I *prove* the clustering? What territory does each plaque own? Where are the hotspots, found by an algorithm, not my eyeballs? And, for fun, what's the shortest walking tour of the whole city?

> **Method note.** The 1,036 plaque locations were scraped in August 2026 from the [English Heritage blue plaques](https://www.english-heritage.org.uk/visit/blue-plaques/) site, as a personal, non-commercial analysis with attribution (the full licence note is in [part one]({{ '/writing/london-blue-plaques/' | relative_url }})). Everything below works in the **British National Grid (EPSG:27700)**, so distances and areas are in real metres, not degrees. Code lives in the [geospatial notebook](https://github.com/koulakhilesh/CodePlayground/blob/main/london-blue-plaques/blue_plaques_geospatial.ipynb).

## Is it clustered? Prove it.

Before any picture, a statistic. The eye is easily fooled, so the honest first move is a test. The **Clark-Evans index** compares the average distance from each plaque to its *nearest* neighbour against what you'd expect if the same number of plaques were scattered at random across the same area. Below 1 means clustered; above 1 means spread out; a big *z*-score means it's not luck.

<div class="stats">
  <div class="stat">
    <div class="stat-value">0.54</div>
    <div class="stat-label">Clark-Evans R (1 = random)</div>
  </div>
  <div class="stat">
    <div class="stat-value">-28</div>
    <div class="stat-label">z-score (|z|&gt;2 is significant)</div>
  </div>
  <div class="stat">
    <div class="stat-value">100<span class="stat-unit"> m</span></div>
    <div class="stat-label">median nearest neighbour</div>
  </div>
</div>

The index comes out at **R = 0.54**, with a *z*-score of about **-28**. In plain terms: plaques sit roughly *half* as far from their nearest neighbour as random scattering would predict, and the chance of that happening by luck is essentially nil. The median plaque has another plaque just **100 metres** away. Here's the distribution behind the number:

{% include chart.html src="/assets/plaques/nn-distances.html" title="Distribution of nearest-neighbour distances between plaques" height=400 caption="Distance from each plaque to its nearest neighbour. The spike near zero is the signature of clustering." %}

## Your nearest plaque: a Voronoi map

Statistics proven, now the pretty part. A **Voronoi diagram** carves the plane into one cell per plaque, where every point in a cell is closer to *that* plaque than to any other, the plaque's "catchment area." Colour each cell by its size and the density story becomes visceral.

{% include chart.html src="/assets/plaques/voronoi.html" title="Voronoi diagram of London's blue plaques, coloured by cell area" height=640 caption="Each cell is the territory of one plaque; darker means smaller. The centre is a mosaic of tiny tiles; the edges are single plaques owning whole boroughs." %}

In the West End the cells are so small they blur into a mosaic, a plaque every hundred metres, each owning a scrap of pavement. Out toward Bromley or Croydon a lone plaque can own kilometres in every direction. The *area* of your nearest-plaque territory is, in effect, an inverse density map, and it screams the same thing the dots did, now with an area attached to it.

*Try it: [break the clustering yourself in the Lab's Voronoi playground →]({{ '/lab/#plaque-voronoi' | relative_url }})*

## The heat of memory

The same information, smoothed into a continuous surface: a kernel-style density heatmap. No borough lines, no cells, just where memory glows hottest.

{% include chart.html src="/assets/plaques/density.html" title="Density heatmap of London's blue plaques" height=620 bg="dark" caption="A density surface over the plaques. One bright ridge runs from Bloomsbury through Mayfair to Chelsea." %}

## Hotspots, found by algorithm

I don't want to *decide* where the clusters are: that's cheating. So I handed the job to **DBSCAN**, a density-based clustering algorithm: any group of at least six plaques all within 350 metres of one another becomes a cluster; everything else is "scattered." Told only the coordinates, it recovers the hotspots on its own.

<div class="stats">
  <div class="stat">
    <div class="stat-value">14</div>
    <div class="stat-label">hotspots discovered</div>
  </div>
  <div class="stat">
    <div class="stat-value">287</div>
    <div class="stat-label">plaques in the biggest (Westminster)</div>
  </div>
  <div class="stat">
    <div class="stat-value">232</div>
    <div class="stat-label">in the second (Kensington)</div>
  </div>
</div>

{% include chart.html src="/assets/plaques/hotspots.html" title="DBSCAN clustering of blue plaques into hotspots" height=640 caption="Blue dots belong to a hotspot; grey dots are scattered. DBSCAN found 14 clusters knowing only the coordinates." %}

It lands exactly where you'd expect: one giant blob over Westminster, another over Kensington & Chelsea, satellites in Bloomsbury and Hampstead, but the point is that it *found* them. Half of all London's plaques fall into just the two largest clusters.

## The memory network

A different lens from graph theory: what's the shortest possible set of links that connects *every* plaque into one network, with no loops? That's a **minimum spanning tree**, and drawn on the map it looks like the nervous system of London's memory.

{% include chart.html src="/assets/plaques/memory-network.html" title="Minimum spanning tree connecting all blue plaques" height=640 caption="The minimum spanning tree over all 1,036 plaques: 371 km of shortest-possible links." %}

The whole tree is **371 km** long, but look at how the "wire" is spent. It's dense and short in the centre, where neighbours are 100 m apart, and it throws long lonely spans out to the isolated plaques on the fringe.

## The Grand Tour: a travelling salesman in London

Finally, the classic. Pick one representative plaque per borough (the one nearest each borough's centroid) and ask: what's the shortest loop that visits all of them and returns home? That's the **Travelling Salesman Problem**, and I solved it from scratch rather than calling a solver, because the *method* is half the fun.

The recipe is two moves. First, a **nearest-neighbour** heuristic: start somewhere, always walk to the closest unvisited borough. It's greedy and it leaves ugly crossings. Then **2-opt**: repeatedly find two edges that cross, snip them, and reconnect the other way, which always shortens the tour, until no swap helps.

<div class="stats">
  <div class="stat">
    <div class="stat-value stat-value--alt">219<span class="stat-unit"> km</span></div>
    <div class="stat-label">greedy nearest-neighbour tour</div>
  </div>
  <div class="stat">
    <div class="stat-value">180<span class="stat-unit"> km</span></div>
    <div class="stat-label">after 2-opt</div>
  </div>
  <div class="stat">
    <div class="stat-value">18%</div>
    <div class="stat-label">shorter, for a few lines of code</div>
  </div>
</div>

{% include chart.html src="/assets/plaques/grand-tour.html" title="Optimised travelling-salesman tour through all 31 boroughs" height=640 caption="The optimised loop through one plaque per borough: 180 km, no crossings. Hover a node for its borough." %}

Nearest-neighbour alone gives a **219 km** tour with tell-tale crossings. A pass of 2-opt untangles it down to **180 km**, an 18% saving for a couple of dozen lines of Python, and the visual proof is that the crossings are gone. That is the whole point of local search: a dumb first guess, plus a simple "is this knot removable?" rule, gets you most of the way to optimal.

## What the geometry taught me

- The clustering isn't a trick of the eye: **Clark-Evans R = 0.54, z of about -28** makes it statistically undeniable.
- **Voronoi territories** turn density into area: tiny tiles downtown, whole boroughs at the edge.
- **DBSCAN** rediscovers the hotspots from coordinates alone, a nice reminder that the structure is *in the data*, not in my assumptions.
- A hand-rolled **nearest-neighbour + 2-opt** TSP shaves ~18% off the naive route, which is the whole value proposition of local-search optimisation in miniature.

If the [first post]({{ '/writing/london-blue-plaques/' | relative_url }}) was about *who* London remembers, this one was about the *shape* of that memory, and the shape, it turns out, is provably, beautifully lopsided. The [notebook is here](https://github.com/koulakhilesh/CodePlayground/blob/main/london-blue-plaques/blue_plaques_geospatial.ipynb) if you want to run the tour yourself.
