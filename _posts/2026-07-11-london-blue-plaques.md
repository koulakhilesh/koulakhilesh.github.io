---
title: "Who London remembers: 1,036 blue plaques and the very small city inside the city"
date: 2026-07-11
tags: [Data Science, London, History, Plotly, Web Scraping]
excerpt: "I scraped every English Heritage blue plaque in London to ask who gets remembered and where. The answer is a surprisingly tiny, surprisingly male, surprisingly literary corner of the map, and the shape of it says something uncomfortable."
toc: true
---

<div style="text-align:center;margin:2rem 0 2.4rem;">
<svg width="188" height="188" viewBox="0 0 200 200" role="img" aria-label="A stylised blue plaque reading 1,036 blue plaques, analysed here, 2026">
  <defs>
    <path id="arcTop" d="M 42 100 A 58 58 0 0 1 158 100" fill="none"/>
    <path id="arcBot" d="M 46 100 A 54 54 0 0 0 154 100" fill="none"/>
  </defs>
  <circle cx="100" cy="100" r="94" fill="#1c5fb0"/>
  <circle cx="100" cy="100" r="94" fill="none" stroke="#0e3f80" stroke-width="4"/>
  <circle cx="100" cy="100" r="78" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85"/>
  <text fill="#fff" font-family="Georgia, serif" font-size="12.5" letter-spacing="2.5" text-anchor="middle">
    <textPath href="#arcTop" startOffset="50%">ANALYSED HERE</textPath>
  </text>
  <text fill="#fff" font-family="Georgia, serif" font-size="12.5" letter-spacing="3" text-anchor="middle">
    <textPath href="#arcBot" startOffset="50%">2026</textPath>
  </text>
  <text x="100" y="90" fill="#fff" font-family="Georgia, serif" font-size="30" font-weight="700" text-anchor="middle">1,036</text>
  <text x="100" y="113" fill="#fff" font-family="Georgia, serif" font-size="14" letter-spacing="3.5" text-anchor="middle">BLUE</text>
  <text x="100" y="131" fill="#fff" font-family="Georgia, serif" font-size="14" letter-spacing="3.5" text-anchor="middle">PLAQUES</text>
</svg>
</div>

There's a game I play on walks. Spot a blue plaque, cover the name with my thumb, and guess who lived there. I'm almost always wrong, and that's the point: a blue plaque is a tiny act of civic memory, a decision that *this* person, in *this* building, is worth stopping a stranger in the street for. I'd walked past dozens before it occurred to me to ask the obvious question: who makes that list, and what does the whole list look like at once?

English Heritage runs the scheme, and their website will show you the plaques twelve at a time. I wanted all of them on one screen. So I scraped the lot, all **1,036 plaques**, and went looking for the shape of London's memory. What I found is that the shape itself is the story.

## What the data is

Every plaque has a page: a name, an address, a category, the exact words on the ceramic, and a pin on a map. The listing is served by a quiet little search API, and each plaque's coordinates are tucked into the map code on its own page. Two passes (one for the list, one to open all 1,036 detail pages) and it folds into a single tidy table.

> **Data & licence.** Plaque data scraped in July 2026 from the [English Heritage blue plaques](https://www.english-heritage.org.uk/visit/blue-plaques/) site (listing API + individual plaque pages). The content belongs to English Heritage; this is a personal, non-commercial analysis of publicly visible information, with attribution. The full scraper and analysis notebook live in my [CodePlayground repo](https://github.com/koulakhilesh/CodePlayground/blob/main/london-blue-plaques/blue_plaques_analysis.ipynb).

Before trusting any of it, I checked how complete each field was. Names, boroughs, coordinates, inscriptions and categories all came back at basically 100%. Birth and death years covered 96% of entries: 990 of the plaques commemorate a specific *person* (the rest mark buildings and events). One thing I *couldn't* get: the date each plaque went up. It isn't published anywhere on the site, which quietly kills the question I most wanted to ask: how long after death does recognition arrive? Some questions the data just won't answer, and it's more honest to say so than to fudge it.

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

You don't need statistics to see it. There's a dense, glowing core in the centre and west, and then the rest of London, enormous, populous, historic London, thins out to scattered dots. My first thought was that I'd made a mistake. I hadn't. London's official memory really is packed into a small footprint. *(Just how tightly packed, statistically, is the subject of [the sequel to this post](#a-companion-piece), where the same points become a geometry problem.)*

## Three boroughs hold two-thirds of it

I counted, and the concentration is even starker than the map suggests.

<div style="display:flex;gap:1rem;flex-wrap:wrap;margin:1.6rem 0;">
  <div style="flex:1;min-width:120px;text-align:center;padding:1.1rem .6rem;border:1px solid var(--line);border-radius:12px;">
    <div style="font-size:2.1rem;font-weight:700;color:#1c5fb0;line-height:1;">69%</div>
    <div style="font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-top:.4rem;">in just 3 boroughs</div>
  </div>
  <div style="flex:1;min-width:120px;text-align:center;padding:1.1rem .6rem;border:1px solid var(--line);border-radius:12px;">
    <div style="font-size:2.1rem;font-weight:700;color:#1c5fb0;line-height:1;">31<span style="font-size:1.1rem;">/33</span></div>
    <div style="font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-top:.4rem;">boroughs with any plaque</div>
  </div>
  <div style="flex:1;min-width:120px;text-align:center;padding:1.1rem .6rem;border:1px solid var(--line);border-radius:12px;">
    <div style="font-size:2.1rem;font-weight:700;color:#1c5fb0;line-height:1;">10</div>
    <div style="font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-top:.4rem;">on Cheyne Walk alone</div>
  </div>
</div>

**Just three boroughs, Westminster, Kensington & Chelsea, and Camden, hold 69% of every blue plaque in London.** Westminster alone has 334, nearly a third of the whole scheme. Meanwhile Barking & Dagenham, Sutton and the City of London manage one apiece.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/plaques/by-borough.html' | relative_url }}"
          title="Blue plaques by London borough"
          loading="lazy"
          style="width:100%;height:520px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Plaques per borough (top 15). The top three dwarf everything else.
  </figcaption>
</figure>

Zoom in past the borough line and the clustering gets almost comically specific. The single most-plaqued street in London is **Cheyne Walk** in Chelsea, with ten; the densest postcode district is **NW3, Hampstead**, with sixty-nine.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/plaques/top-streets.html' | relative_url }}"
          title="London's most-plaqued streets"
          loading="lazy"
          style="width:100%;height:520px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    The most-plaqued streets. Bedford Square, Gower Street and Queen Anne's Gate follow Chelsea's riverside.
  </figcaption>
</figure>

And each borough remembers a *different kind* of person. Westminster's plaques lean towards **politicians**; Kensington & Chelsea and Camden lean towards **writers and artists**. Westminster remembers power; Chelsea remembers art. That's not a coincidence: it's the first hint of the feedback loop I'll come back to.

Some of this is honest history: the West End and Bloomsbury *were* where the writers, scientists and statesmen of a certain era clustered, near the salons and institutions and each other. But some of it is self-fulfilling. Plaques mark the grand, surviving townhouses of central London, and grand surviving townhouses are exactly where well-documented, well-connected, plaque-worthy lives happened. The map isn't just showing where remarkable people lived. It's showing where the *kind* of person the scheme was built to remember lived.

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

Literature comes first, then politics and administration, then the fine arts and music. It's a portrait of what a culture chooses to enshrine: the people who left *documents* (books, laws, paintings, scores), the kind of legacy that keeps a name legible a century later.

## The gap isn't flat

Here's the number the scheme itself is quietly self-conscious about. There's no gender field in the data, so I inferred it from first names (with an offline name-to-gender library) and honorifics like *Sir* and *Dame*. It's imperfect: 122 names it couldn't resolve, and it will misfire on some, so I only report the share among names it *could* resolve. Even so, the result is stark: **fewer than one in five commemorated people are women.**

But the single figure hides the interesting part. Split the women's share by *field* and it swings wildly, from near-parity in one category to an absolute, unbroken zero in others.

<div style="display:flex;gap:1rem;flex-wrap:wrap;margin:1.6rem 0;">
  <div style="flex:1;min-width:120px;text-align:center;padding:1.1rem .6rem;border:1px solid var(--line);border-radius:12px;">
    <div style="font-size:2.1rem;font-weight:700;color:#c2185b;line-height:1;">17.5%</div>
    <div style="font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-top:.4rem;">women overall</div>
  </div>
  <div style="flex:1;min-width:120px;text-align:center;padding:1.1rem .6rem;border:1px solid var(--line);border-radius:12px;">
    <div style="font-size:2.1rem;font-weight:700;color:#c2185b;line-height:1;">0%</div>
    <div style="font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-top:.4rem;">women in engineering, industry &amp; invention</div>
  </div>
  <div style="flex:1;min-width:120px;text-align:center;padding:1.1rem .6rem;border:1px solid var(--line);border-radius:12px;">
    <div style="font-size:2.1rem;font-weight:700;color:#1c5fb0;line-height:1;">174<span style="font-size:1.1rem;">:25</span></div>
    <div style="font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-top:.4rem;">Sirs to Dames</div>
  </div>
</div>

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/plaques/female-by-field.html' | relative_url }}"
          title="Share of women commemorated, by field"
          loading="lazy"
          style="width:100%;height:540px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Female share by category (fields with at least 15 plaques). The dashed line is the 17.5% overall average.
  </figcaption>
</figure>

Women appear most in **philanthropy and reform** (close to half) and on the **stage**: theatre, film, dance. They all but vanish from **politics** (3%) and hit a flat **zero** in engineering, industry and invention. The pattern isn't really about the plaques; it's about which doors were open to women in the first place, preserved in ceramic. The honorifics say the same thing more bluntly: 174 knighted *Sirs* to 25 *Dames*.

There is one hopeful thread. Stack the commemorated people by their birth decade and the pink band, however thin, grows as you move toward the present.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/plaques/gender-by-decade.html' | relative_url }}"
          title="Commemorated people by birth decade and inferred gender"
          loading="lazy"
          style="width:100%;height:460px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    People commemorated, stacked by birth decade and inferred gender. Watch the recent decades.
  </figcaption>
</figure>

Among people born in the mid-1700s the female share was under 5%; among those born around 1900 it's up past 30%. The scheme is trying to correct, and English Heritage has said as much publicly. You can watch that intention arrive, one decade at a time, but you're watching it climb out of a very deep hole.

## What the walls actually say

The inscriptions are their own small corpus. Throw all 1,036 into a pile and count the words, and the most common ones read like a poem about the dataset in miniature: *poet, writer, painter, novelist, artist*, and, sitting right among them, *Sir*.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/plaques/inscription-words.html' | relative_url }}"
          title="Most common words in blue plaque inscriptions"
          loading="lazy"
          style="width:100%;height:560px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    The most common words across all 1,036 inscriptions, filler words removed.
  </figcaption>
</figure>

There's also a quiet grammar to how each plaque relates its person to its building. Nearly every one states a verb, and one verb runs away with it.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/plaques/inscription-verbs.html' | relative_url }}"
          title="What the plaques say the person did at the address"
          loading="lazy"
          style="width:100%;height:430px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Relationship to the address, counted across all inscriptions. "Lived here" appears on 724 of them.
  </figcaption>
</figure>

**724 plaques, seven in ten, simply say "lived here."** Not born, not died, not worked. Lived. The blue plaque is fundamentally a marker of *domesticity made historic*: this ordinary front door held an extraordinary ordinary life. And almost all of them say it on the same object: 88% of the plaques are the familiar ceramic roundel, with a stubborn handful in bronze, stone or slate.

## How long did they live?

A small, humane detour. For the 990 people, birth and death years give a distribution of lifespans.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/plaques/lifespans.html' | relative_url }}"
          title="Age at death of the commemorated"
          loading="lazy"
          style="width:100%;height:430px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Age at death, filtered to plausible values. The median is 72.
  </figcaption>
</figure>

The median is **72**, with a long tail into the nineties: Sir Robert Mayer made it to 106. Which makes a certain grim sense: the surest route onto a wall of long-term public memory is to do enough, for long enough, to be remembered. But the left tail is where the heartbreak lives: a cluster who died in their twenties and got a plaque anyway: John Keats at 26, the sculptor Gaudier-Brzeska at 24, the SOE agent Violette Szabo at 24. Fame usually rewards patience. Just occasionally it rewards a comet.

## Memory isn't merit

Put the threads together and they all point the same way. The geography (a tiny central core), the gender (fewer than one in five, and zero in whole professions), the categories (writers and statesmen), the honorifics (Sirs outnumbering Dames seven to one), these aren't four separate findings. They're four views of a single filter.

Blue plaques don't really mark where *remarkable* people lived. They mark where the **documented, connected, establishment** class lived, and that class was central, male, literary and titled. The filter is self-reinforcing: grand surviving houses in Zone 1 are both where those lives happened and where a plaque can be hung today, so the memory keeps pooling in the same square mile.

None of this is a knock on the plaques. I still play the guessing game, and I still lose. But a wall of memory is also a mirror, and it's worth occasionally asking who's reflected in it and who isn't: the outer boroughs, the women who never got the door opened, the engineers who built the city and got nothing.

### A companion piece

That's the *human* story. There's also a purely *mathematical* one hiding in the same 1,035 dots: how clustered London's memory is (provably), what territory each plaque owns, and the shortest possible walking tour of the whole city. I pulled that apart in a second post: **[The geometry of memory →]({{ '/writing/the-geometry-of-londons-blue-plaques/' | relative_url }})**. If you'd rather poke at the data yourself, the [scraper and notebook](https://github.com/koulakhilesh/CodePlayground/blob/main/london-blue-plaques/blue_plaques_analysis.ipynb) are one afternoon of pandas and Plotly. Go find the plaque nobody put up.
