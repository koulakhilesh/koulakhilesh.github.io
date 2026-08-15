---
title: "A record-hot summer arrives: how London's reservoirs are taking it"
date: 2026-08-15
last_modified_at: 2026-08-15
thumbnail: /assets/thumbs/reservoirs.png
tags: [Data Science, London, Open Data, Plotly, Water]
excerpt: "Six weeks after the first reservoir post I added June and July 2026 — the start of what the Met Office says may be the UK's warmest summer on record. The Lower Thames is now at its lowest level for the date in 37 years; but the drawdown that got it there wasn't the fastest on record. A short, data-first follow-up."
toc: true
---

[The first reservoir post]({{ '/writing/london-reservoirs/' | relative_url }}) stopped on **31 May 2026**, with both of London's big storage groups brimming — the Lower Lee at 95% of capacity, the Lower Thames at 90%. A comfortable place to end a story about water.

Then the summer came. The Met Office now says a [record-warm UK summer is increasingly likely](https://www.metoffice.gov.uk/blog/2026/warmest-uk-summer-on-record-increasingly-likely-as-temperatures-stay-well-above-average), with temperatures staying well above average. So I did the obvious thing: grabbed the June and July readings, added them to the same 37-year daily series, and looked. I want to resist the tidy headline ("record heat drains the reservoirs!") and instead let the readings talk first — because, as usual, they say something more interesting than the slogan.

> **Data & licence.** London reservoir levels via the [London Datastore](https://data.london.gov.uk/dataset/london-reservoir-levels-24ry5), sourced from the Environment Agency's [water situation reports](https://www.gov.uk/government/collections/water-situation-reports-for-england). Public sector information licensed under the [Open Government Licence v2.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/2/). Data now runs **1 Jan 1989 – 31 Jul 2026**. The "warmest summer" framing is context from the Met Office (link above); this analysis works only with reservoir *levels*, not temperature. Notebook: [reservoir_analysis_2026-07.ipynb](https://github.com/koulakhilesh/CodePlayground/blob/main/london-reservoir-levels/reservoir_analysis_2026-07.ipynb).

## First, just add the days

No cleverness — extend the sawtooth by two months and shade 2026 so the newest readings are easy to find against four decades.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/reservoirs/daily-2026.html' | relative_url }}"
          title="London reservoir levels, 1989 to 2026, with 2026 highlighted"
          loading="lazy"
          style="width:100%;height:470px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Every daily reading, 1989–2026; the 2026 window is shaded. Drag to zoom into the tail.
  </figcaption>
</figure>

Zoom into the right-hand edge and the shape is unmistakable: after peaking in spring, both lines fall through June and July — and the orange Lower Thames line keeps going, sliding down to **72%** by 31 July (the Lower Lee ends at **82%**). That's a real drop. But "a real drop" isn't a finding. The daily view can't tell me whether 72% is alarming or ordinary for late July. For that I need to compare 2026 against its own history.

## How unusual is it? Draw the normal band

The honest test is the same one that unmasked 2022 in the first post: plot 2026 on top of the **normal band** — the grey envelope is the full day-by-day min-to-max of every *other* year (1989–2025), and the dashed line is the typical year. If 2026 sits inside the band, it's within normal. If it rides the edge, it isn't.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/reservoirs/normal-band-2026.html' | relative_url }}"
          title="2026 reservoir levels against the 37-year normal band, both groups"
          loading="lazy"
          style="width:100%;height:640px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    2026 (coloured) against the 1989–2025 daily range (grey) and the typical year (dashed), for each group.
  </figcaption>
</figure>

Here the two groups part ways, and this is the actual story.

The **Lower Thames** (bottom panel) starts the year mid-band, tracks the typical line into spring, then peels away and rides down the **bottom edge of the grey band** all summer. Its 72% on 31 July isn't just low — it *matches the lowest level ever recorded for that date* across the whole 37-year record. For late July, the Thames group has never been emptier. It is, quite literally, on the floor.

The **Lower Lee** (top panel) tells a softer version: it fell too, but it's sitting comfortably *inside* the band — around the 24th percentile for the date, low-ish but nowhere near a record. Same city, same summer, two different responses. The structural gap between these systems, flagged in the first post, is doing real work here.

So the headline the slogan wanted — "record heat empties the reservoirs" — is half right and half wrong, and the interesting bit is the half that's wrong. One group is at a record low for the date; the other is merely a bit dry. Which raises the obvious next question: *did the Thames get there because this summer drained it uniquely fast?*

## Was the drawdown actually the fastest?

A hot, dry summer should show up as **speed** — how far the reservoirs fall between late spring and mid-summer. So for every year I measured the June–July drawdown (average level in the last week of May minus the last week of July) and ranked them.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/reservoirs/summer-drawdown.html' | relative_url }}"
          title="Steepest May-to-July reservoir drawdowns by year, Lower Thames"
          loading="lazy"
          style="width:100%;height:470px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Lower Thames: the size of the late-May-to-late-July fall, by year. 2026 is in red.
  </figcaption>
</figure>

And here the data quietly refuses the neat narrative. The Lower Thames fell about **17 points** this summer — steep, the **5th-fastest** of 38 summers — but it is *not* the record. **2022** fell faster (about 24 points), and so did several other years. The Lower Lee's 13-point fall ranks 7th; its record belongs to **2018** (about 22 points). A summer the Met Office thinks may be the warmest on record did **not** produce the fastest drawdown on record.

So how is the Thames at a record low for the date if the fall wasn't record-breaking? Because of where it *started*. The Lee refilled to a brimming 100% over winter; the Thames only reached about 93%. A slightly lower starting line, plus a steep-but-not-unprecedented fall, is enough to land it on the floor. The record isn't about how hard this summer pulled — it's about the summer arriving on top of a spring that never quite topped the Thames up.

## What the data actually says

Letting the readings lead, rather than the headline:

- **The Lower Thames is at a record low *for the date*** — 72% on 31 July, matching the emptiest late-July in 37 years. That part of the scary story is true.
- **But the drawdown wasn't the fastest.** 2022 and 2018 both drained faster. Record heat ≠ record-speed emptying.
- **Starting height mattered as much as the heat.** The Thames began summer a touch lower than the Lee and ended on the floor; the Lee started full and stayed inside its normal band.
- **The real test is still ahead.** July isn't the seasonal trough — that's September–October. If the Thames keeps hugging the bottom edge, *that* minimum is the number to watch, against the deep droughts of 1996–97 the first post dug up.

None of this downplays the summer — a record-low-for-the-date reservoir is worth watching. But the point I'd have *guessed* ("hottest summer, fastest drain") isn't the one the data supports. The reservoirs are spending a full winter's savings quickly, not running on empty, and the number that will actually matter hasn't happened yet. I'll come back in October. The [notebook is here](https://github.com/koulakhilesh/CodePlayground/blob/main/london-reservoir-levels/reservoir_analysis_2026-07.ipynb) if you want to watch the floor with me.
