---
title: "Who can get to a parkrun? London's 5k map"
date: 2026-10-02 10:00:00
last_modified_at: 2026-10-02
thumbnail: /assets/thumbs/parkrun.png
glyph: parkrun-reach
image: /assets/social/london-parkrun-access.png
series: "London parkrun"
series_part: 1
ink: red
kicker: "London · Running"
dek: "About 4.7 million of London's 8.8 million people live within 2 km, in a straight line, of one of its 65 Saturday 5k parkruns."
pull:
  value: "53.4%"
  label: "of Londoners live within 2 km (straight line) of a Saturday 5k parkrun"
tags: [Data Science, London, Open Data, Plotly, Running]
excerpt: "About 4.7 million of London's 8.8 million people live within 2 km, in a straight line, of one of its 65 Saturday 5k parkruns. Central London was the surprise: Westminster has no parkrun at all, but of the 1.49 million people who live over 2 km from one in a low-car neighbourhood, only 207,000 also have poor public transport."
toc: true
---

parkrun is a free, timed 5k that happens on Saturday mornings in parks, run by volunteers. Most events start at 9am. You turn up, run or walk, and that's it. I had a vague sense that London was full of them, and no idea whether that was true, or true for whom.

So I asked a plain question: for a Londoner picked at random, how far is the nearest parkrun, and does that distance look the same across the city? I used public data only, with no results or attendance numbers, and I looked at the numbers before deciding what the story was.

> **Data & licence.** parkrun events from the public events feed (`images.parkrun.com/events.json`), fetched on 2 October 2026: 65 London 5k events (the junior 2k events are left out). Borough and neighbourhood boundaries from the London Datastore and ONS: Contains National Statistics data © Crown copyright and database right 2015; Contains OS data © Crown copyright and database right 2015. Population (TS007A) and household car ownership (TS045) from the 2021 Census via Nomis, [Open Government Licence](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/). Stations from the DfT's NaPTAN (OGL). Public transport access (PTAL, 2015 edition) from TfL via the London Datastore (OGL), matched to 2021 neighbourhoods by their centres. **Distances are straight lines from the geometric centre of each 2021 LSOA (a small census area, 4,994 in London) to the nearest event. Walking distance is longer.** No results or attendance data are used. Notebook: [parkrun_access.ipynb](https://github.com/koulakhilesh/CodePlayground/blob/main/london-parkrun/parkrun_access.ipynb).

## Where London runs

Start with the events themselves: 65 of them inside Greater London, spread over 29 of its 33 boroughs (32 boroughs plus the City of London). Greenwich, Bromley and Hounslow have five each; Wandsworth, Southwark and Croydon have four. The four boroughs with none are the City of London, Kensington and Chelsea, Westminster and Sutton.

{% include chart.html src="/assets/parkrun/events-map.html" title="Map of London's 5k parkruns coloured by distance to the nearest station" height=620 caption="Each dot is one of the 65 London 5k events. Red dots are within 1 km (straight line) of a rail, Tube, DLR or tram station; blue dots are further away. Hover for the nearest station and its distance." %}

I also checked how many of them you can reach from a station. 44 of the 65 are within 1 km of some rail, Tube, DLR or tram station, but only 22 are within 1 km of a Tube station. The furthest from any station is Wimbledon Common, 1,811 m from Southfields, then Crane Park (1,681 m from Whitton) and Burgess (1,620 m from Elephant & Castle). Parkruns are in parks, and parks tend not to sit on top of stations, so none of this is odd. It does mean "near the Tube" and "near a parkrun" are different things.

## How far is your nearest one?

Next, a distance for every neighbourhood: the straight line from its centre to the closest event.

{% include chart.html src="/assets/parkrun/distance-map.html" title="Map of London neighbourhoods coloured by straight-line distance to the nearest parkrun" height=620 caption="Each dot is the centre of a neighbourhood (LSOA), coloured by straight-line distance to its nearest parkrun. The colour scale stops at 4 km, so a few outer areas, up to about 10.7 km away, show the same top colour." %}

The median Londoner is **1,916 m** from the nearest parkrun. That sits close to the threshold I picked as "near", 2 km, which is roughly a 25-minute walk if the streets were straight (they aren't). The totals:

{% include chart.html src="/assets/parkrun/coverage.html" title="Share of Londoners living within 1, 2 and 5 km of a parkrun" height=420 caption="Share of London's 8.8 million residents within 1, 2 and 5 km of a parkrun, in a straight line." %}

**14.3%** of Londoners (1,257,977 people) live within 1 km, **53.4%** (4,698,845) within 2 km, and **97.9%** (8,617,916) within 5 km. So almost everyone has a parkrun within a bike ride, about half have one within a short walk, and about one in seven has one within 1 km. "Is London well covered?" depends on which of those you care about.

## The gaps

Flip it round. **1,519,439** people, **17.3%** of London, live more than 3 km from the nearest event. By borough, the biggest counts are Hillingdon (150,538), Brent (134,731), Westminster (119,401) and Enfield (115,652). The worst-placed neighbourhoods are in Hillingdon: the farthest, Hillingdon 003A, is 10.7 km from its nearest event, at Harrow.

Borough medians (population-weighted) tell a slightly different story:

{% include chart.html src="/assets/parkrun/boroughs.html" title="Median distance to a parkrun, by borough" height=900 caption="Median straight-line distance to the nearest parkrun for each borough, weighted by population. Hover for the borough's population." %}

Kingston upon Thames has the longest median distance, **3,369 m**, followed by Westminster (3,236 m), the City of London (3,235 m), Sutton (2,964 m) and Hillingdon (2,925 m). Kingston is the surprise: it does have an event, yet only 14.8% of its residents live within 2 km of any parkrun. At the other end, Southwark has the shortest median, **1,174 m**, with 92.8% of residents within 2 km, then Islington (1,311 m) and Haringey (1,354 m).

One thing I should flag. Everything above counts only the 65 events *inside* Greater London, and London doesn't stop where a parkrun does. So I repeated the headline numbers with every UK 5k event within 10 km of the boundary, which adds 28 events outside London (93 in total).

| | London events only (65) | Plus 28 just outside (93) |
|---|---|---|
| Within 2 km | 53.4% | 54.0% |
| Within 5 km | 97.9% | 99.3% |
| Beyond 3 km | 17.3% | 16.0% |
| Median distance | 1,916 m | 1,905 m |

For London as a whole it barely moves. For Sutton it matters: its median distance falls by about 570 m, because Nonsuch, just over the border, is the nearest event for about 107,000 Londoners. Enfield's median falls by 123 m, and Kingston, Bexley and Hillingdon by less than 40 m each. So Sutton's "no parkrun" is partly a border effect, and the borough figures above are slightly pessimistic at the edges.

## Saturday 9am without a car

A 3 km trip is easy with a car and harder without one. The census records car ownership: **42.1%** of London households have no car.

I defined a "gap" neighbourhood as one that is more than 2 km from a parkrun *and* where the share of households without a car is at or above that London average. Note that this describes neighbourhoods, not individuals. 4,100,786 people live more than 2 km away; **1,491,938** of them live in a neighbourhood that is at or above the car-free average.

{% include chart.html src="/assets/parkrun/car-free-gap.html" title="Map of neighbourhoods more than 2 km from a parkrun with at-or-above-average car-free households" height=620 caption="Each dot is a neighbourhood more than 2 km from a parkrun where the share of households without a car is at or above the London average (42.1%). Red dots also have low public-transport access (PTAL 0 to 2); amber dots have PTAL 3 or better." %}

By borough, the most people in that position are in **Westminster** (176,764), then Hackney (147,469), Newham (144,374), Camden (110,660) and Brent (96,648). Kensington and Chelsea is seventh at 76,353. Westminster's number is most of the borough: it has 204,235 residents.

That looked like a clear equity story until I added public transport. TfL's PTAL score rates how well a place is served by public transport, and I counted 0 to 2 as low. Of those 1.49 million people, only **207,381**, about 14%, also live somewhere with a low score. Central London is a long way from a parkrun but very well connected, so for most of these people the problem is distance more than transport. The red dots are the harder cases.

Two caveats. PTAL is a general measure of service, not what's running at 8.30 on a Saturday morning, and my station distances above ignore buses. And straight-line distance understates the real walk, so these are minimum distances, not exact ones.

## Whose parkrun is it?

Last, assign each Londoner to their nearest event and count. This isn't turnout, because I have no attendance data. It's the number of people for whom each event is the closest.

{% include chart.html src="/assets/parkrun/catchments.html" title="Residents whose nearest parkrun is each event" height=1120 caption="Residents whose nearest parkrun this is, for all 65 events. Hover for the number of neighbourhoods in each catchment." %}

The range is wide. **Highbury Fields** has the biggest catchment at **332,737** people (195 neighbourhoods), ahead of Wormwood Scrubs (300,301) and Morden (288,723). At the bottom, Bedfont Lakes has 20,415 (10 neighbourhoods), then Richmond Park (30,950) and Dulwich (35,526). The median event has **126,297** people closest to it.

Highbury Fields sits in Islington, whose whole population is 216,656. So more than a third of its catchment must live in neighbouring boroughs. Borough lines don't mean much when you're choosing where to run on a Saturday.

## What I'd do next

The big gap in this analysis is that I know who lives near an event, not who goes. Attendance would change the picture, but parkrun's terms don't allow me to collect it. A better distance measure (walking routes, or bus times at 8.30am) would be the other obvious step.

For now, the picture is that about half of London is within a short walk of a parkrun and almost everyone is within 5 km, with the weak spots on the outer edges and, less expectedly, in the middle: Westminster and the City. [A second post]({% post_url 2026-10-02-london-parkrun-shape %}) looks at the lighter side: event names, the alphabet, and where a new one might go.

The [notebook is here](https://github.com/koulakhilesh/CodePlayground/blob/main/london-parkrun/parkrun_access.ipynb) if you want to check my numbers.
