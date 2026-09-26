---
title: "How the crowd moves: a typical day on the London Underground"
date: 2026-09-26
last_modified_at: 2026-09-26
thumbnail: /assets/thumbs/tube.png
glyph: tube-wave
tags: [Data Science, London, Open Data, Plotly, Transport]
excerpt: "TfL publishes a 'typical day' of passenger flow for every Tube station, in 15-minute slices. I pulled it for 269 stations and asked whether you can watch the crowd move. You can: the morning rush reaches the centre last, stations split cleanly into home and work, and on the Central line you can see a train fill up across east London and empty out in the City."
toc: true
---

<div class="glyph-hero">{% include glyph.html name="tube-wave" %}</div>

TfL publishes something I didn't know existed until recently: a "typical day" of crowding for every Underground station, broken into 15-minute slices, for every line that stops there. It isn't live data, just a model of an ordinary day. It covers the whole network, though, and it comes with a second dataset that estimates how full each train is as it leaves each station.

Most crowding charts I've seen answer "where is it busy?" I wanted to know whether this data could show something that *moves*: whether the rush starts in one place and arrives in another, whether stations have different characters, and what happens inside a train between the platforms. So I pulled the data for 269 stations and looked before deciding what the story was.

> **Data & licence.** Crowding data from the [TfL Unified API](https://api.tfl.gov.uk) (`StopPoint/{id}/Crowding/{line}`), restricted to the 11 Underground lines and fetched on 26 September 2026. Powered by TfL Open Data. Contains OS data © Crown copyright and database rights 2016 and Geomni UK Map data © and database rights 2019. Used under the [TfL Open Data terms](https://tfl.gov.uk/info-for/open-data-users/open-data-policy). The data is one modelled typical day: no weekday/weekend split, and nothing between 02:00 and 05:00. Distances are straight-line kilometres from Charing Cross. Notebook: [eda_notebook.ipynb](https://github.com/koulakhilesh/CodePlayground/blob/main/london_tube_crowding/eda_notebook.ipynb).

## A typical day

First, the whole network added together. Every station, every line, 15 minutes at a time.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/tube/daily-flow.html' | relative_url }}"
          title="Total passenger flow across all Tube stations through a typical day"
          loading="lazy"
          style="width:100%;height:460px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Network flow per 15-minute slice. The gap between 02:00 and 05:00 is missing data, not an empty network.
  </figcaption>
</figure>

It's the familiar two-humped camel. The busiest slice of the day is **08:15** (210,474 flow units across the network); the evening peak at **17:45** is about 5% lower (200,336). The evening hump is wider, though, and holds slightly more of the day: **28.1%** of all flow falls between 16:00 and 19:00, against **26.3%** between 07:00 and 10:00. Those six rush hours carry **54.4%** of the flow in a dataset that covers 21 hours.

None of that is surprising. The interesting parts come from pulling this total apart.

## Where it's busy, and a ranking I got wrong first

Add up each station across all the lines that serve it and the ranking looks as you'd expect: **Oxford Circus** (316,602), **King's Cross St Pancras** (284,292), **Green Park**, **Victoria**, **Waterloo**. It's also very concentrated. The busiest 27 stations, 10% of the network, carry **53.5%** of all the flow.

My first version of this ranking had **Brixton in second place**. Brixton is busy, but not busier than King's Cross. It turned out that for most stations TfL returns several unlabeled flow series per time slice, in no particular order, and my first parser kept just one of them. Brixton, the end of the Victoria line, happens to have only one series, so it kept everything while the big interchanges lost most of theirs. The same bug made Moorgate look more than twelve times busier in the morning than in the evening. Summing all the series fixed both. The honest caveat is that I still don't know what each series *is* (TfL doesn't label them), so I treat the sum as "typical passenger flow" rather than a confirmed count of entries and exits.

## The rush reaches the centre last

Here's the network hour by hour. Press play.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/tube/hourly-map.html' | relative_url }}"
          title="Animated map of station flow across London, hour by hour"
          loading="lazy"
          style="width:100%;height:620px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Average flow per 15 minutes at each station, one frame per hour from 05:00 to 01:00. Bigger and brighter means busier.
  </figcaption>
</figure>

It's pretty, but by volume the centre dominates every frame, so the animation mostly shows the city breathing in and out. To see *movement* I needed timing rather than size. For each station I found its busiest 15-minute slice between 05:00 and 11:00, then coloured the map by that time.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/tube/morning-peak-map.html' | relative_url }}"
          title="Map of Tube stations coloured by the time of their busiest morning slice"
          loading="lazy"
          style="width:100%;height:620px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Stations with at least 5,000 flow units a day (203 of them), coloured by when their morning peak hits. Dot size is daily flow.
  </figcaption>
</figure>

Now the map shows a direction. The earliest stations are all a long way out: Dagenham Heathway, Kingsbury and Queensbury peak at 06:30, Barking and East Ham at 06:45. The centre is dark, peaking around 08:30. Plotted against distance, it's a clear slope:

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/tube/peak-vs-distance.html' | relative_url }}"
          title="Busiest morning slice against distance from Charing Cross"
          loading="lazy"
          style="width:100%;height:460px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Each dot is a station. Further out, the morning peaks earlier. Hover for names.
  </figcaption>
</figure>

| Distance from Charing Cross | Stations | Median morning peak | Median evening peak |
|---|---|---|---|
| 0–3 km | 47 | 08:30 | 17:45 |
| 3–8 km | 74 | 08:15 | 17:30 |
| 8–15 km | 54 | 08:00 | 17:15 |
| 15 km and beyond | 28 | 08:00 | 17:00 |

The correlation between morning peak time and distance is **−0.55**. It's what you'd expect if people leave home at roughly the same time relative to when they need to arrive: the further out you live, the earlier you get on.

I checked one way this could be an artefact. A few central work stations (Temple, Goodge Street, St Paul's and others) are so quiet in the morning that their "morning peak" is just the last slice of the window, 10:45, which would drag the centre later. Dropping those 7 stations makes the pattern *stronger*, not weaker: the correlation goes to **−0.63** and the medians in the table don't move. It isn't a smooth gradient line by line, either. On the Northern line south of the river, Clapham North peaks at 07:30, earlier than Morden at 08:00. The wave shows up in the aggregate, not neatly at every stop.

The evening column is the one I didn't expect. I assumed the wave would run in reverse after work, with the centre peaking first and the suburbs later as people got home. Instead the outer stations *still* peak earlier (17:00 against 17:45, correlation −0.52). I don't have a clean explanation. Because TfL doesn't say which flow series is entries and which is exits, I can't check whether that's people leaving the suburbs or arriving in them, so I'm leaving it as an open question rather than inventing a story.

## Home stations and work stations

The timing hints at something simpler: some stations are busiest in the morning and others in the evening. Dividing each station's evening peak by its morning peak splits the network almost cleanly.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/tube/home-work.html' | relative_url }}"
          title="Evening peak divided by morning peak for each station, against distance from the centre"
          loading="lazy"
          style="width:100%;height:480px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Above the dashed line, the evening is busier; below it, the morning. Log scale. Dot size is daily flow.
  </figcaption>
</figure>

At the bottom are the home stations. At **Elm Park**, 23 km out on the District line, the evening peak is a tenth of the morning peak. **Pinner** and **Queensbury** are close behind. At the top are the work stations: **Goodge Street**'s evening peak is 10.5 times its morning peak, with **Mansion House**, **Temple** and **Chancery Lane** not far off. Across all 203 stations the correlation between this ratio (on a log scale) and distance is **−0.6**.

The exceptions are the fun part. **Canary Wharf**, 7.5 km out, sits among the central stations at 5.1: a second business district doing exactly what the City does. And a handful of stations beyond 20 km are busier in the evening than the morning: **Heathrow** and **Uxbridge**, which are destinations in their own right rather than places people commute from.

That home/work split is also why I think the flow numbers lean towards people *entering* stations. If the sum counted entries and exits equally, a home station would be busy twice a day, not once. It's still an inference, though.

## Night-out stations and a station with no rush hour

Two more measures pick out different types of station: the share of a station's day that falls after 20:00, and the share inside the two rush windows.

The median station takes **8.3%** of its daily flow after 20:00. **Covent Garden** takes **32.3%**, **Leicester Square** 30.5%, **Piccadilly Circus** 25.9%. That's the West End, as you'd guess. At the other end, the median station does **56.3%** of its business in the rush hours, while **Heathrow Terminal 5** does 35.8% and **Terminals 2 & 3** 36.9%. Planes don't keep office hours.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/tube/station-types.html' | relative_url }}"
          title="Daily flow profiles of four station types, each scaled to its own peak"
          loading="lazy"
          style="width:100%;height:470px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Each line is scaled to that station's own busiest slice, so the shapes can be compared regardless of size.
  </figcaption>
</figure>

Four stations, four shapes. Elm Park spikes once in the morning. Goodge Street spikes once in the evening. Leicester Square builds slowly through the day and stays high late. Heathrow is roughly flat, a long plateau with no rush hour at all.

## Inside the train

Station flow shows where people get on and off. The second dataset shows what happens in between: for each station and direction, a band from 0 to 6 for how full the train is when it leaves. Higher is fuller. That makes it possible to follow a single line and watch a train fill.

Here is the westbound Central line in the morning, from Epping through east London, the City and into the West End.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/tube/central-line.html' | relative_url }}"
          title="Heatmap of train loading on the westbound Central line from Epping to Marble Arch, 06:00 to 10:30"
          loading="lazy"
          style="width:100%;height:640px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Rows run down the line from Epping to Marble Arch; columns are departure times. Darker means a fuller train.
  </figcaption>
</figure>

Read the 08:15 column from top to bottom. A train leaving Epping is at band 1. By Leytonstone it's at 4, by Stratford 5, and leaving **Bethnal Green** and **Liverpool Street** it hits **6**, the top of the scale. Then it empties: 5 leaving Bank, 4 at St Paul's and Chancery Lane, and by Holborn it's down to 2, where it stays all the way to Marble Arch. The crowd boards across east London and gets off in the City. On the West End stretch, from Tottenham Court Road to Marble Arch, the train never goes above band 2 all morning.

Across the whole network, **37 of 747** station-to-station stretches ever reach band 6. The ones that stay at band 4 or above the longest:

| From | To | Line | Hours at band 4+ |
|---|---|---|---|
| Bethnal Green | Liverpool Street | Central | 3.5 |
| King's Cross St Pancras | Euston Square | Hammersmith & City | 3.5 |
| Moorgate | Bank | Northern | 3.5 |
| Barbican | Farringdon | Hammersmith & City | 3.25 |
| Bermondsey | London Bridge | Jubilee | 3.25 |
| Southwark | Waterloo | Jubilee | 3.25 |

Does train fullness show the same inward wave as station flow? Partly. For each inbound stretch I took a weighted average of *when* in the morning it's full. That time does get later nearer the centre (correlation **−0.41**): about 08:00 for stretches 8–15 km out, 08:09 at 3–8 km, 08:22 in the centre. But the outermost stretches, beyond 15 km, come in at 08:08, *later* than the band inside them. A 0–6 scale is coarse, and trains near the ends of lines are fairly empty whenever you measure them, so I wouldn't read much into that last row. The wave is clearest in the station data.

## What the data says

- **The morning rush moves inward.** Across the network, outer stations peak around 08:00 and central ones around 08:30. The pattern holds in aggregate even though individual lines are bumpier.
- **Stations have characters.** Home stations spike in the morning, work stations in the evening, and the ratio between them tracks distance from the centre, with Canary Wharf, Heathrow and Uxbridge as the exceptions you'd hope a good measure would catch.
- **The West End and the airport break the pattern.** Covent Garden does a third of its business after 20:00; Heathrow barely has a rush hour.
- **You can watch a train fill up.** The morning Central line goes from band 1 at Epping to the top band at Bethnal Green and back down to band 2 by Holborn.
- **The evening doesn't run the wave in reverse.** Outer stations still peak first after work, and without labelled entries and exits I can't say why.

The part I'll remember is the bug. My first chart said Brixton was the second-busiest station on the Underground, and it looked plausible enough that I nearly kept it. The station-by-station timing held up once I summed the series properly, but the ranking only became believable after I stopped trusting the first number. The [notebook is here](https://github.com/koulakhilesh/CodePlayground/blob/main/london_tube_crowding/eda_notebook.ipynb) if you want to follow your own line.
