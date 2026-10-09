---
title: "Is a step-free station enough?"
date: 2026-10-09 10:00:00 +0100
last_modified_at: 2026-10-09
thumbnail: /assets/thumbs/tube.png
glyph: tube-wave
image: /assets/social/london-tube-crowding.png
series: "The London Underground"
series_part: 2
ink: red
kicker: "London · Transport"
dek: "A station label covers only part of a journey. TfL's platform records and lift notices show what changes when the route to the train breaks."
pull:
  value: "10 stations"
  label: "had one or more lift records in TfL's 9 October snapshot"
tags: [Data Science, London, Open Data, Transport, Accessibility]
excerpt: "TfL's step-free data describes platforms, interchanges and lift outages, but a station-level label cannot tell you whether a whole journey will work."
toc: true
---

On 9 October, TfL's live lift feed carried a notice for Canada Water. A lift replacement meant there would be no step-free access between street and ticket hall until spring 2027. The notice then laid out the alternatives: buses to Bermondsey for the Jubilee line, buses to Surrey Quays for the Windrush line, or an 800-metre walk at street level.

The notice sends someone on a different journey.

I had just spent a few weeks looking at how TfL's model of a typical day describes passenger flow through the Underground. The crowding data tells me when and where the network is busy. The access data asks a different question: what does TfL mean when it says a station is step-free, and what happens when one of the links in that route is out of service?

I have not made this journey with a disabled passenger. The data shows what TfL publishes, but not whether the detours work at street level or how they feel to travel.

## A station is several connections

Getting from the street to a train involves more than reaching a station entrance. There is the route from street to ticket hall, the route to a platform, the transfer between platforms, and the gap between platform and train. A lift, ramp or level access point can matter at one of those links and not another.

TfL's detailed station topology feed reflects some of that complexity. It has separate tables for station areas, lifts, ramps, same-level paths, platforms, platform services and step-free interchange information. I joined its platform-service records to the station list used in [my Tube crowding analysis]({% post_url 2026-09-26-london-tube-crowding %}) using TfL's StopArea NaPTAN code.

The join covers 851 platform-service records across all 272 station records in the crowding master list. The source includes a `LevelAccessByManualRamp` flag: 157 records are marked true and 694 false. Those are platform-service flags, not verdicts on whether a whole station or journey is accessible.

The gap and step measurements are patchier. Of six fields for minimum, maximum and average platform-to-train gap and step, at least one has a value in 339 records. The other 512 have no value in those fields. A blank is not a zero, and it does not establish that a platform is inaccessible. It means this file gives no measurement there.

TfL also publishes 114 step-free interchange records. After joining both ends to Tube platform-service records, 86 rows remain. Some entries repeat the same platform pair in both directions. Removing repeated and reciprocal rows leaves 37 unique undirected platform pairs across 12 stations. These records describe selected transfers, not every route through a station. I could not match the other 28 records to two Tube service records, so they are not in that count.

## The live feed changes the picture

The topology archive is a snapshot of the network structure. Lift disruptions are different: they describe what TfL was reporting at a particular time. I saved the live feed on 9 October and matched station IDs and hub codes back to the Tube station list.

The response contained 22 lift records. Fourteen records matched Tube station identifiers, covering 10 distinct stations. That is not a count of wholly inaccessible stations. A notice can describe a problem with one entrance or platform while another step-free route remains open.

Wembley Park is a clear example. TfL's feed listed two records for the same lift. One said that the lift between Wembley Way or the car park and the ticket hall was out, while the Bridge Road entrance still provided a level route and lifts remained available to all platforms. Someone could still use that entrance to reach the platforms.

At Earl's Court, three records referred to the same lift. TfL said step-free access to the eastbound District line was unavailable from 28 September to 11 October, then listed different routes depending on where a passenger was starting. The alternative for someone coming from Wimbledon was not the same as for someone coming from Richmond. A single station label cannot carry that much route detail.

Canada Water's notice described a longer closure. Until spring 2027, the lift replacement blocks step-free access between street and ticket hall. TfL directs Jubilee line passengers to buses 47 or 188 to Bermondsey. For the Windrush line, it lists buses to Surrey Quays, or about 800 metres on foot along Deal Porters Way. Those are TfL's instructions in the snapshot I saved, not routes I have travelled and checked.

{% include chart.html src="/assets/tube/step-free-stations.html" title="Tube stations with lift-disruption records in TfL's 9 October 2026 snapshot" height=640 caption="Red: one or more lift records matched to this station. Grey: no matching record in this response, which does not confirm that lifts were working or that the station was step-free. Hover for the notice text and typical-day station-flow context." %}

## The crowding data adds context, not an answer

All ten stations with a matched lift notice also appear in the typical-day crowding data. Bank has the largest summed station flow among them, at **184,035** flow units; Canada Water has **75,234**. These are sums across the lines and 15-minute slices in TfL's model, not counts of people passing a lift or trying to board a train during the outage.

The flow number cannot tell me whether people queue at a lift, whether the alternative entrance is easy to find, or how long the detour takes for a particular passenger. I can map stations and count notices, but I cannot reconstruct the trip anyone actually takes.

## What the data cannot tell me

One station-level label cannot tell a passenger whether the whole trip will be step-free on the day they travel. The station, platform and lift records describe different parts of the route. The live feed can change what is usable that day. The crowding model shows where typical passenger flow is high, but says nothing about conditions beside a lift or along a step-free path.

I have not made the Canada Water to Surrey Quays trip with a passenger who needs step-free access. Nor have I checked the bus stops and entrances along TfL's alternative. The next reporting step is to travel that route together and compare the published directions with what happens on the ground. For now, the 800 metres between Canada Water and Surrey Quays is the unanswered part of TfL's notice.

> **Data & licence.** TfL's [detailed station topology archive](https://api.tfl.gov.uk/stationdata/tfl-stationdata-detailed.zip) and [step-free access and toilet data guide](https://tfl.gov.uk/cdn/static/cms/documents/step-free-access-and-toilet-data-guide.pdf), accessed 9 October 2026. The archive tables are dated 3 August 2026. Lift notices come from TfL's [live lift-disruption feed](https://api.tfl.gov.uk/Disruptions/Lifts/v2), captured on 9 October 2026. Typical-day passenger flow comes from the TfL Unified API data described in [the earlier Tube post]({% post_url 2026-09-26-london-tube-crowding %}), fetched on 26 September 2026. TfL open data is subject to its [transport data terms](https://tfl.gov.uk/corporate/terms-and-conditions/transport-data-service). The [analysis code and notebook](https://github.com/koulakhilesh/CodePlayground/tree/feature/tfl-step-free-access/london_tube_crowding) include the joins and checks; the downloaded source files are not committed.