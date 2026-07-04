---
title: "London's reservoirs have a heartbeat (and the drought you remember isn't the one that ran them driest)"
date: 2026-07-04
tags: [Data Science, London, Open Data, Plotly, Water]
excerpt: "37 years of daily reservoir readings, one chart at a time, and a small surprise hiding in the numbers everyone thinks they remember."
toc: true
---

I went looking for the summer of 2022, a summer I never saw.

I landed in London that November, a few months too late for it. You don't have to have been here to have heard about it, though. The grass had gone the colour of straw, the hosepipe bans had come and gone, and "drought" was a headline word all summer. It was one of the first pieces of local weather-lore I picked up. So when I found a dataset with **daily** reservoir levels for London going back to 1989, the first thing I did was hunt for 2022, the drought everyone had told me about. I expected a cliff. The worst dip in the whole record.

It wasn't. And that little wrongness, a memory I'd inherited rather than lived, is what turned a quick afternoon poke into this post.

## What the data is

The [London Datastore](https://data.london.gov.uk/dataset/london-reservoir-levels-24ry5) publishes the level of two big reservoir groups that supply the city:

- the **Lower Lee** group, and
- the **Lower Thames** group.

One row per day, one number per group, all the way from **1 January 1989** to **31 May 2026**. Each number is just *percent of capacity*: how full the reservoirs were that day. That's the entire dataset. No fancy features, no engineered columns. Just ~13,665 days of "how much water is in the tank."

The part that delighted me, before I plotted anything, was how *complete* it is. 37 years, one reading every single day, and when I checked for gaps in the calendar there were **none**. 16 missing values in total, out of about 27,000. Public datasets tend to be messier than that. This one is a quiet feat of record-keeping.

> **Data & licence.** London reservoir levels via the [London Datastore](https://data.london.gov.uk/dataset/london-reservoir-levels-24ry5), sourced from the Environment Agency's [water situation reports for England](https://www.gov.uk/government/collections/water-situation-reports-for-england). Contains public sector information licensed under the [Open Government Licence v2.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/2/). The full analysis notebook lives in my [CodePlayground repo](https://github.com/koulakhilesh/CodePlayground/blob/main/london-reservoir-levels/reservoir_analysis.ipynb).

## Where these two groups sit

The dataset never says *where* these reservoirs are; "Lower Lee" and "Lower Thames" are just two column names. They're real bodies of water, sitting in two very different corners of London. The **Lower Lee** group is the Lee Valley chain up in the north-east, above Tottenham and Walthamstow. The **Lower Thames** group is the cluster of big reservoirs out west, towards Staines and Heathrow. Two systems, one city, fed by separate rivers.

To draw them, I pulled the reservoir outlines straight from OpenStreetMap and coloured each polygon by its group. There are no coordinates in the levels CSV, so this is a separate open-data layer stitched on top.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/reservoirs/reservoir-map.html' | relative_url }}"
          title="Map of the Lower Lee and Lower Thames reservoir groups"
          loading="lazy"
          style="width:100%;height:520px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    The two groups sit in opposite corners of London: the Lower Lee (green) in the north-east, the Lower Thames (orange) out to the south-west. Hover any reservoir for its name.
  </figcaption>
</figure>

> **Map data.** Reservoir outlines and basemap © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, licensed under the Open Database Licence (ODbL). Fetched via the Overpass API in the analysis notebook.

## First, just plot everything

Before slicing or summarising anything, it pays to be a little dumb and just plot *every single day*. No aggregation, no smoothing. Just drop all 13,665 points on a chart and see what the shape tells you.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/reservoirs/daily-levels.html' | relative_url }}"
          title="London reservoir levels, daily, 1989 to 2026"
          loading="lazy"
          style="width:100%;height:470px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Every daily reading, 1989–2026. Drag to zoom into a year, double-click to reset.
  </figcaption>
</figure>

There it is: a **sawtooth**. Up through the winter, down through the summer, over and over for close to four decades. Your eye catches the deep dips: the mid-1990s, a rough patch around 2005–06, and yes, 2022. Those are the droughts. But hold that thought about 2022, because the daily view is too noisy to rank them. For that we need to fold time.

## The heartbeat: what an average year looks like

If every year follows near enough the same fill-and-drain rhythm, then I should be able to squash all 37 years onto a single 12-month clock and see the underlying pulse. Statisticians call this a *climatology*. I like to think of it as taking the reservoir's resting heart rate.

So I averaged every January together, every February together, and so on. The shaded bands show the full range each month has ever spanned; the solid lines are the averages:

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/reservoirs/average-year.html' | relative_url }}"
          title="The average London water year, by month"
          loading="lazy"
          style="width:100%;height:460px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    All 37 years folded onto one 12-month clock. Hover any month to compare the two groups.
  </figcaption>
</figure>

The Lower Thames peaks in **late winter** (think February, when it's been raining for months and nobody's watering a garden) and bottoms out around **September to October**, right before the autumn rains kick in and start the refill. The Lower Lee does the same dance but sits a few points lower the whole way round. That gap between the two groups isn't random jitter; it's there in almost every year. Two reservoir systems, same city, different personalities.

## Which years ran driest?

Here's where I went back for 2022. The fairest single number for "how bad was that year" is the **annual minimum**: the lowest the reservoirs fell at the worst moment of that year. Short bars are the scary years.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/reservoirs/annual-minimum.html' | relative_url }}"
          title="Lowest reservoir level reached each year"
          loading="lazy"
          style="width:100%;height:460px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    The lowest point each year. Hover for exact values; 2026 is a partial year (to May).
  </figcaption>
</figure>

This is the bit that made me sit up. I'd arrived to the *story* of 2022 rather than the summer itself, so I had no yardstick of my own to check it against. The numbers were my only witness. For the **Lower Thames**, the driest years on record are:

| Year     | Lowest level |
|----------|-------------:|
| **1996** |          42% |
| **1997** |          44% |
| 2003     |          46% |
| 1990     |          48% |
| 2022     |          50% |

2022, the drought I'd been assured was the worst, comes in **fifth**. The brutal squeeze was **1996–97**, a slow two-year drawdown that pulled the Thames group down to 42%. For the Lower Lee, the deepest year was **1991** (48%), with 1992 close behind. The droughts that ran London's reservoirs driest happened in the *early-to-mid nineties*, and most of us have forgotten them.

Memory is a headline. The data is a diary. When they disagree, I know which one I trust.

## Putting 2022 under the microscope

None of this means 2022 wasn't a real drought. It was. "Real drought" and "worst on record" are two different claims, though, and the honest way to tell them apart is to draw the year against its own history. Here's 2022 for the Lower Thames, plotted on top of the **normal band**: the grey envelope is the full min-to-max range every *other* year has ever traced, day by day, and the dashed line is the typical year.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/reservoirs/drought-2022-band.html' | relative_url }}"
          title="2022 reservoir levels versus the 37-year normal band"
          loading="lazy"
          style="width:100%;height:470px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    2022 (orange) against the 1989–2026 daily range (grey band) and the typical year (dashed).
  </figcaption>
</figure>

You can watch the story unfold across the year. 2022 starts out ordinary, then peels away from the typical line through that hot, dry summer and rides along the **bottom edge** of the band by autumn, low for the time of year, hugging the record floor without breaking it. That's what a bad year looks like when it isn't the record. The normal band is, to me, the single most honest chart in the whole notebook, because it answers the one question that matters: *how unusual was this?*

## What I took away

- **Water has a heartbeat.** Fill in winter, draw down to an autumn low, then do it again the next year. Once you see the rhythm, it shows up everywhere.
- **The Lower Thames runs fuller than the Lower Lee.** Same pattern, year after year. It's baked into how the two systems work.
- **The drought you remember isn't the worst one.** 2022 made the news. 1996–97 set the record. The loud year sticks; the deep years fade.
- **Complete data is a gift.** The cleaning step was dull, so every surprise waited in the findings instead.

If you want to poke at it yourself (different reservoir, different year, your own definition of "drought"), the whole thing is a single [Jupyter notebook](https://github.com/koulakhilesh/CodePlayground/blob/main/london-reservoir-levels/reservoir_analysis.ipynb) with pandas and Plotly. Grab the CSV from the London Datastore, drop it in, and go looking for your own wrong memory. That's the fun part.
