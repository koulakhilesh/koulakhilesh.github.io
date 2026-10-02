---
title: "Which parkrun came first, and can you run the alphabet?"
date: 2026-10-02
last_modified_at: 2026-10-02
thumbnail: /assets/thumbs/parkrun.png
glyph: parkrun-alphabet
image: /assets/social/london-parkrun-shape.png
series: "London parkrun"
series_part: 2
ink: red
kicker: "London · Running"
dek: "Five side questions about London's 65 parkruns: which came first, what they're called, which is the loneliest, whether one per letter makes a route, and where five new ones would reach the most people."
pull:
  value: "594,406"
  label: "more Londoners within 2 km of a parkrun if five well-placed new events opened"
lab:
  url: /lab/#parkrun-drop
  label: "Drop your own parkrun in the Lab"
tags: [Data Science, London, Open Data, Plotly, Running]
excerpt: "In the 10 London parkruns I could date, event IDs follow launch order. 29 of the 65 have one-word names, Stockley Country is 6.2 km from its nearest neighbour, one parkrun per letter makes an 88.3 km route, and five well-placed new events would bring 594,406 more people within 2 km of one."
toc: true
---

[The first post]({% post_url 2026-10-02-london-parkrun-access %}) asked who can get to a parkrun. While the maps were open I kept asking smaller questions that have nothing to do with access: which parkrun came first, what are they all called, which one is on its own, could you visit one for every letter of the alphabet, and where would a new one go? This post is those questions. Same 65 events, same rule as before: look at the numbers first and decide what they mean afterwards.

> **Data & licence.** Events, boundaries, population and stations are the same as in [the first post]({% post_url 2026-10-02-london-parkrun-access %}): the public parkrun events feed (`images.parkrun.com/events.json`, fetched 2 October 2026, 65 London 5k events), London Datastore and ONS boundaries, and the 2021 Census via Nomis ([Open Government Licence](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)). New here: park outlines from OS Open Greenspace (Contains OS data © Crown copyright and database right 2026), and a short table of first-event dates, [known_start_dates.csv](https://github.com/koulakhilesh/CodePlayground/blob/main/london-parkrun/known_start_dates.csv). I found those dates for 10 events on parkrun's own pages, local news and club sites, never on results pages: [Bushy Park](https://blog.parkrun.com/uk/2026/09/30/celebrate-22together-22-years-of-parkrun/), [Wimbledon Common](https://www.parkrun.org.uk/wimbledon/news/2018/04/06/were-you-at-the-first-wimbledon-common-parkrun/), [Peckham Rye](https://www.parkrun.org.uk/peckhamrye/news/2025/02/24/peckham-ryes-500th-parkrun-22nd-february-2025/), [Tooting Common](https://www.parkrun.org.uk/tootingcommon/news/2025/04/05/tooting-common-parkrun-399-29-march-2025/), [Clapham Common](https://www.parkrun.org.uk/claphamcommon/news/2024/11/10/clapham-common-parkrun-250-a-milestone-of-community-fun-and-running/), [Charlton](https://charltonchampion.co.uk/2021/10/02/charlton-parkrun-is-here-331-people-take-part-in-first-event/), [Southall](https://hounslowherald.com/successful-start-for-southall-parkrun-p15092-313.htm), [Morden](https://www.parkrun.org.uk/morden/news/2024/06/18/morden-parkrun-inaugural-event-15th-june-2024/), [Battersea](http://runabc.co.uk/launch-of-battersea-parkrun-2024) and [Ingrebourne Hill](https://ilfordathleticclub.co.uk/ingrebourne-park/). Two of those are weaker than the rest. The Battersea source is a running-news site, and its 12 October 2024 date is a "soft launch" (a full launch followed a week later). The Ingrebourne Hill source is a club's announcement the day before the first event. **Distances are straight lines between event locations.** The "next parkrun" ranking counts people and nothing else: it ignores landowners, whether a 5k course fits, terrain and volunteers. No results or attendance data are used. Notebook: [parkrun_shape.ipynb](https://github.com/koulakhilesh/CodePlayground/blob/main/london-parkrun/parkrun_shape.ipynb).

## Which came first?

Every event in the feed has an ID number. If the IDs were handed out in order, they would show which parkruns are oldest without my needing a date for each one. So I went looking for dates, and found 10:

| Event | ID | First event |
|---|---|---|
| Bushy Park | 1 | 2 Oct 2004 |
| Wimbledon Common | 2 | 6 Jan 2007 |
| Peckham Rye | 882 | 21 Jun 2014 |
| Tooting Common | 1395 | 30 Jan 2016 |
| Clapham Common | 1882 | 24 Mar 2018 |
| Charlton | 2907 | 2 Oct 2021 |
| Southall | 2968 | 8 Jan 2022 |
| Morden | 3481 | 15 Jun 2024 |
| Battersea | 3557 | 12 Oct 2024 |
| Ingrebourne Hill | 3590 | 14 Dec 2024 |

Sort by ID or by date and you get the same list. The rank correlation between the two (Spearman) is 1.0, so no pair is out of order. That is only 10 of 65, so what I can say is that in this sample of 10, IDs follow launch order. I can't say it holds for the other 55.

The top of the table is the story of parkrun itself. Bushy Park is ID 1: its first event, on Saturday 2 October 2004, had 13 runners and five volunteers. Wimbledon Common is ID 2, in January 2007. The next event I could date, Peckham Rye, didn't start until June 2014. The highest ID in London is Greenwich Peninsula at 3,801, so if the order holds it is the newest. I couldn't find a first-event date for it that I trusted.

Three of the later starts are in big, long-established south London parks: Tooting Common (2016), Clapham Common (2018) and Battersea (2024).

{% include chart.html src="/assets/parkrun/id-map.html" title="Map of London parkruns coloured by event ID rank" height=620 caption="Each dot is one of the 65 events, coloured by its rank in ID order: purple is the lowest ID, yellow the highest. Hover for the event and its ID." %}

I also looked for a pattern on the map, the kind you'd get if parkrun had spread outwards from the middle. There isn't one. Splitting the 65 events by ID into the oldest 22, the middle 21 and the newest 22, the average distance from central London (I used Charing Cross) is 13.4, 13.3 and 13.4 km. Old and new events are mixed all over the map. The 2024 launches show it: Battersea (ID 3557) is 3.9 km from Charing Cross, and Ingrebourne Hill (ID 3590), which started two months later, is 22.4 km out.

## What's in a name?

Next, what they're called. I took the last word of each event's short name ("Hampstead Heath" becomes "Heath", "Richmond Park" becomes "Park") and counted. The method is crude, and I'll show where it breaks.

{% include chart.html src="/assets/parkrun/names.html" title="Bar chart of the last word in each London parkrun's name" height=560 caption="The last word of each of the 65 short names. Single-word names such as Bromley or Dulwich are grouped as (place name only). Every term is shown, including the awkward ones." %}

**29 of the 65** have a one-word name. Some are plain place names (Bromley, Dulwich, Kingston, Orpington), but several are really park names with the "Park" left off: Gladstone, Burgess, Raphael, Lloyd, Pymmes and Valentines among them. Among the longer names, "Park" leads with **6** (Bushy, Richmond, Finsbury, Old Deer, Canons, Crane), then "Hill" with **4**, and "Fields" and "Common" with **3** each. "Palace" has 2 (Crystal Palace and Fulham Palace), and the other 18 terms appear once each.

Several of those single terms are artefacts. Ally Pally is counted under "Pally", Mile End under "End", Peckham Rye under "Rye", Beckenham Place under "Place", Harrow Lodge under "Lodge", and South Norwood and Stockley Country under "Norwood" and "Country". I left them in the chart instead of tidying them by hand, because every fix would be a judgement call. The findings I'd trust are the big ones: nearly half of London's parkruns go by a single word, and among the names that describe the space, "Park" is the commonest. It would lead by more if the one-word park names kept it.

## The loneliest parkrun

For each event I measured the straight line to its nearest neighbour. The median is **2.8 km** (2,815 m).

{% include chart.html src="/assets/parkrun/extremes.html" title="Map of London parkruns highlighting the most isolated event and the closest pair" height=620 caption="Red: the parkrun furthest from any other. Blue: the two closest to each other. Grey: the rest." %}

The most isolated is **Stockley Country**, **6.2 km** (6,216 m) from its nearest neighbour, which is Southall. It is in Hillingdon, the borough that had the most people more than 3 km from any event in the first post. Morden is next at 5.7 km, with Wimbledon Common as its nearest.

The closest pair is **Crane Park and Hanworth**, **1.39 km** apart (1,392 m). Both are in Hounslow.

## A parkrun alphabet

This is the frivolous one. If every event has a name, can you visit one parkrun for every letter of the alphabet?

London can cover **19 of the 26** letters. Nothing starts with E, J, Q, U, X, Y or Z. For the other 19 I asked for the shortest route that makes one stop per letter. It doesn't go A to Z. The order is whatever keeps the distance down, and the route also gets to choose which event stands for a letter that has several. Eleven London events start with B, so the route picks Brockwell.

{% include chart.html src="/assets/parkrun/alphabet-route.html" title="Map of the shortest route found that visits one London parkrun per letter" height=620 caption="One stop per letter, joined by straight lines in the order the route visits them. Each label is the stop's first letter. Where two labels would overlap, one may be hidden." %}

The shortest route I found is **88.3 km** in straight lines: Ingrebourne Hill (I), Valentines (V), Lordship Recreation Ground (L), Ally Pally (A), Mile End (M), Peckham Rye (P), Dulwich (D), Brockwell (B), Tooting Common (T), Clapham Common (C), Fulham Palace (F), Wimbledon Common (W), Kingston (K), Richmond Park (R), Old Deer Park (O), Gunnersbury (G), Southall (S), Northala Fields (N) and Harrow (H). It runs from Ingrebourne Hill in the east to Harrow in the north-west.

It is a heuristic, not a proof. I start from each of the 65 events, always go to the nearest event with an unused letter, then try reversing stretches of the route and swapping which event stands for a letter until nothing improves. That doesn't show 88.3 km is the best possible, only that no better route turned up, so read it as an upper bound on the true shortest. Five letters have only one event to choose from (Dulwich, Ingrebourne Hill, Kingston, Northala Fields and Valentines), so those five are on every route.

## Where should the next one go?

Last, a practical one: where would new parkruns reach the most people? I used the same measure as the first post, people more than 2 km from the nearest event, and looked for parks that would reach the most of them.

The candidates are green spaces inside London of at least 10 hectares, labelled in OS Open Greenspace as a public park or garden or a playing field, with no existing parkrun within 1 km. That leaves **193** sites. Each park counts as a single point inside it, the same way an existing event is one point. Then a greedy search: pick the site that brings the most people not yet within 2 km into range, update the map, and pick again. Five rounds gave these:

{% include chart.html src="/assets/parkrun/next-parkrun.html" title="Map of five suggested new parkrun sites, existing parkruns and neighbourhoods more than 2 km from one" height=620 caption="Orange dots are neighbourhoods more than 2 km from a parkrun today, blue dots the 65 existing events, and numbered red dots the five suggested sites in the order they were picked. Hover for the people each would add." %}

| | Site | Borough | Area (ha) | People newly within 2 km |
|---|---|---|---|---|
| 1 | Paddington Recreation Ground | Westminster | 10.7 | 169,366 |
| 2 | West Ham Park | Newham | 26.5 | 112,177 |
| 3 | London Fields | Hackney | 12.8 | 109,479 |
| 4 | Holland Park | Kensington and Chelsea | 21.0 | 101,960 |
| 5 | King Edward VII Park | Brent | 10.5 | 101,424 |

Together that is **594,406** people, or 14.5% of the 4,100,786 who live more than 2 km from a parkrun today. Each figure counts only people not already reached by an earlier pick, so they add up without double counting.

The boroughs connect back to the first post. Westminster and Kensington and Chelsea have no parkrun at all, and Newham, Hackney and Brent have one each. All five also appeared in the first post's list of boroughs with the most people in low-car neighbourhoods more than 2 km away: Westminster, Hackney, Newham and Brent in the top five, Kensington and Chelsea seventh. That's less of a coincidence than it sounds. A ranking by people reached tends to favour dense inner boroughs, and the same density is what made those boroughs show up before.

I wouldn't read this as a list of where parkruns should open. It counts heads and nothing else. Paddington Recreation Ground is a sports ground with a running track and pitches, and parkrun can't just be dropped into one of those. A 5k in a 10-hectare park means several laps. Every one of these sites has a landowner who would have to agree, and parkrun needs a team of volunteers every Saturday. The map shows where the gaps are widest. Whether a course fits is a question for people who know the parks.

*Try it: [drop your own parkrun on the map in the Lab →]({{ '/lab/#parkrun-drop' | relative_url }})*

## What I'd do next

I only dated 10 events, so the ID-order result is thin. Dating the rest, from sources that aren't results pages, would show whether the order holds for all 65.

The [notebook is here](https://github.com/koulakhilesh/CodePlayground/blob/main/london-parkrun/parkrun_shape.ipynb) if you want to check my numbers.
