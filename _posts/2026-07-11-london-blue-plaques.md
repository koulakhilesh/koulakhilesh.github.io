---
title: "Who London remembers: 1,036 blue plaques, and the very small city inside the city"
date: 2026-07-11
tags: [Data Science, London, History, Plotly, Web Scraping]
excerpt: "I scraped every English Heritage blue plaque in London to find out who gets remembered and where. The answer turned out to be a surprisingly tiny, surprisingly male, surprisingly literary corner of the map."
toc: true
---

There's a game I play on walks. Spot a blue plaque, cover the name with my thumb, and guess who lived there. I'm almost always wrong, and that's the point — a blue plaque is a tiny act of civic memory, a decision that *this* person, in *this* building, is worth stopping a stranger in the street for. I'd walked past dozens before it occurred to me to ask the obvious question: who makes that list, and what does the whole list look like at once?

English Heritage runs the scheme, and their website will show you the plaques twelve at a time. I wanted all of them on one screen. So I scraped the lot — **1,036 plaques** — and went looking for the shape of London's memory.

## What the data is

Every plaque has a page: a name, an address, a category, the exact words on the ceramic, and a pin on a map. The listing is served by a quiet little search API, and each plaque's coordinates are tucked into the map code on its own page. Two passes — one for the list, one to open all 1,036 detail pages — and it all folds into a single tidy table.

> **Data & licence.** Plaque data scraped in July 2026 from the [English Heritage blue plaques](https://www.english-heritage.org.uk/visit/blue-plaques/) site (listing API + individual plaque pages). The content belongs to English Heritage; this is a personal, non-commercial analysis of publicly visible information, with attribution. The full scraper and analysis notebook live in my [CodePlayground repo](https://github.com/koulakhilesh/CodePlayground/blob/main/london-blue-plaques/blue_plaques_analysis.ipynb).

Before trusting any of it, I checked how complete each field was. Names, boroughs, coordinates, inscriptions and categories all came back at basically 100%. Birth and death years covered 96% of entries — 990 of the plaques commemorate a specific *person* (the rest mark buildings and events). One thing I *couldn't* get: the date each plaque went up. It simply isn't published anywhere on the site, which quietly kills the question I most wanted to ask — how long after death does recognition arrive? Some questions the data just won't answer, and it's more honest to say so than to fudge it.

## First, put them all on the map

No aggregation, no cleverness. Just drop all 1,035 plaques-with-coordinates onto London and colour them by category.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/plaques/plaque-map.html' | relative_url }}"
          title="Every London blue plaque, mapped and coloured by category"
          loading="lazy"
          style="width:100%;height:640px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    All 1,035 plaques with coordinates. Hover any dot for the name, borough and category; drag to pan, scroll to zoom.
  </figcaption>
</figure>

You don't need statistics to see it. There's a dense, glowing core in the centre and west, and then the rest of London — enormous, populous, historic London — thins out to scattered dots. My first thought was that I'd made a mistake. I hadn't. London's official memory really is packed into a small footprint.

## Three boroughs hold two-thirds of it

I counted, and the concentration is even starker than the map suggests. **Just three boroughs — Westminster, Kensington & Chelsea, and Camden — hold 69% of every blue plaque in London.**

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/plaques/by-borough.html' | relative_url }}"
          title="Blue plaques by London borough"
          loading="lazy"
          style="width:100%;height:520px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Plaques per borough (top 15). Westminster alone has 334 — nearly a third of the entire scheme.
  </figcaption>
</figure>

Some of this is honest history: the West End and Bloomsbury *were* where the writers, scientists and statesmen of a certain era clustered, near the salons and the institutions and each other. But some of it is a feedback loop. Plaques mark the grand, surviving townhouses of central London, and grand surviving townhouses are where the well-documented, well-connected, plaque-worthy lives happened. The map isn't just showing where remarkable people lived. It's showing where the *kind* of person the scheme was built to remember lived.

## Who gets remembered

Sort the plaques by what the person is remembered *for*, and London reveals itself as, above all, a city of writers.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/plaques/by-category.html' | relative_url }}"
          title="Blue plaques by primary category"
          loading="lazy"
          style="width:100%;height:520px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Primary category per plaque (top 15). Literature leads, ahead of politics, fine arts and music.
  </figcaption>
</figure>

Literature comes first, then politics and administration, then the fine arts and music. It's a portrait of what a culture chooses to enshrine: the people who left *documents* — books, laws, paintings, scores — the kind of legacy that keeps a name legible a century later.

## The wall is overwhelmingly male

Here's the number the scheme itself is quietly self-conscious about. There's no gender field in the data, so I inferred it from first names (with an offline name-to-gender library) and honorifics like *Sir* and *Dame*. It's imperfect — 122 names it couldn't resolve, and it will misfire on some — so I only report the share among names it *could* resolve. Even being generous about the uncertainty, the result is stark: **fewer than one in five commemorated people are women (about 17.5%).**

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/plaques/gender-by-decade.html' | relative_url }}"
          title="Commemorated people by birth decade and inferred gender"
          loading="lazy"
          style="width:100%;height:460px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    People commemorated, stacked by birth decade and inferred gender. The blue dominates — but watch the most recent decades.
  </figcaption>
</figure>

The blue wall is hard to unsee. But look to the right of the chart: for people born in the twentieth century the pink band grows, slowly. The scheme is trying to correct, and English Heritage has said as much publicly. You can watch that intention arrive, one decade at a time — but you're watching it climb out of a very deep hole.

## How long did they live?

A small, humane detour. For the 990 people, I took birth and death years and looked at how long they lived.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/plaques/lifespans.html' | relative_url }}"
          title="Age at death of the commemorated"
          loading="lazy"
          style="width:100%;height:430px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Age at death, filtered to plausible values. The median is 72.
  </figcaption>
</figure>

The median is **72**, with a long, heavy tail into the eighties and nineties. Which makes a certain grim sense: the surest route onto a wall of long-term public memory is to do enough, for long enough, to be remembered. Fame is patient. It tends to reward people who stuck around.

## What the plaques actually say

Finally, I threw all 1,036 inscriptions into one pile and counted the words.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/plaques/inscription-words.html' | relative_url }}"
          title="Most common words in blue plaque inscriptions"
          loading="lazy"
          style="width:100%;height:560px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    The most common words across all 1,036 inscriptions, once the filler words are stripped out.
  </figcaption>
</figure>

The top words are a poem about the dataset in miniature: *poet, writer, painter, novelist, artist.* The city of writers, confirmed by its own ceramic. And sitting right up there among them, **Sir** — a small, telling residue of an honours-era establishment of knighted men that the whole scheme grew out of. The words on the plaques tell you who they were for.

## What I took away

- **London's official memory is tiny.** Sixty-nine percent of it fits inside three central boroughs. The other thirty-two boroughs share what's left.
- **It skews heavily male** — under one in five — though the newest plaques are slowly nudging that back toward balance.
- **It's a city of writers**, in its categories and in the very words on the walls.
- **Some questions have no answer here.** No erection dates means no story about how fast recognition comes. Knowing what you *can't* ask is part of reading a dataset honestly.

None of this is a knock on the plaques — I still play the guessing game, and I still lose. But a wall of memory is also a mirror, and it's worth occasionally asking who's reflected in it and who isn't. If you want to go poke at your own corner of it, the [scraper and notebook](https://github.com/koulakhilesh/CodePlayground/blob/main/london-blue-plaques/blue_plaques_analysis.ipynb) are a single afternoon of pandas and Plotly. Go find the plaque nobody put up.
