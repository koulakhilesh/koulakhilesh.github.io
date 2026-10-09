---
title: "Where Wren's churches went, and which you can still walk into"
date: 2026-10-09 08:30:00 +0100
last_modified_at: 2026-10-09
thumbnail: /assets/thumbs/wren.png
glyph: wren-travelled
image: /assets/social/wrens-churches-travelled-and-open.png
series: "Wren's City churches"
series_part: 2
ink: yellow
kicker: "London · History"
dek: "A spire in Sydenham, a tower in Twickenham, a whole church in Missouri, and 33 lost parishes folded into Wren's churches. Then what the 36 surviving sites publish about visiting, turned into a yes/no flow chart for picking one."
pull:
  value: "33 of 34"
  label: "parishes whose churches burned in 1666 and were never rebuilt were merged into a church in my Wren register"
tags: [Data Science, History, London, Open Data, Plotly]
excerpt: "Three pieces of Wren's City churches now stand somewhere else: a spire top 8.8 km away in Sydenham, a tower 18.4 km away in Twickenham, and a whole church in Fulton, Missouri. Of the 36 surviving sites, 23 church interiors publish visiting hours, five interiors are closed or restricted, and eight are towers, gardens or remains."
toc: true
---

[The first post]({% post_url 2026-10-09-wrens-churches-rebuilt-and-lost %}) counted what was rebuilt after 1666 and what was lost afterwards. While building that register I kept finding things that hadn't so much been lost as moved: a spire top among modern houses in Sydenham, a tower beside a main road in Twickenham, bells hung in one church and then another. This post follows them, then asks a practical question: of the churches still standing, which can you actually visit?

> **Data & licence.** This post uses the same register and evidence labels as [the first post]({% post_url 2026-10-09-wrens-churches-rebuilt-and-lost %}). Sources for relocations: America's National Churchill Museum's history of St Mary Aldermanbury, and Historic England list entries 1080836 and 1079973 ([Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)), which also give the grid references I used for the map. Parish mergers come from Wikipedia's list of churches destroyed in the fire and not rebuilt (CC BY-SA 4.0). Visiting information comes from the [Friends of the City Churches](https://www.fotcc.org.uk/) church pages and from the official sites of St Paul's, St Clement Danes, St James's Piccadilly and the Royal Hospital Chelsea, all checked on 8 October 2026 and quoted briefly. **These are what each site published that day, not a guarantee of opening.** Walking distances come from the [FOSSGIS routing server](https://routing.openstreetmap.de/about.html) (foot profile) on OpenStreetMap data © OpenStreetMap contributors ([ODbL](https://www.openstreetmap.org/copyright)). Code and review files: [london-wren-churches](https://github.com/koulakhilesh/CodePlayground/tree/main/london-wren-churches). Every source is linked in [Sources](#sources) at the end.

## Stone that moved

Three pieces of Wren's City churches now stand somewhere else. I counted a move only when the place that now holds the fabric, or the official listing for it, says where it came from.

- **St Antholin, Budge Row.** In 1829 the top of the spire was replaced, and the old one was sold for £5 to a printer, Robert Harrild, who put it up at his house, Round Hill House in Sydenham. It still stands there, now among modern houses, about **8.8 km** in a straight line from the church site, and is Grade II listed. Historic England's entry says it was "brought from demolished Church by Sir Christopher Wren in City of London", and the 1829 date comes from the Wikipedia article. The church itself was demolished in the 1870s.
- **All Hallows Lombard Street.** The church was found unsafe and pulled down in 1937 (the list says 1939). Its tower was "re-erected 1940 as tower of new Church" at All Hallows, Twickenham, according to Historic England. That is about **18.4 km** away, on Chertsey Road.
- **St Mary Aldermanbury.** The church was bombed in December 1940, and in the 1960s its shell was taken down stone by stone. According to the National Churchill Museum, "In 1965 the removal process began", about 7,000 stones were shipped to Fulton, Missouri (by boat to Virginia, then by rail), and a new foundation stone was laid there in October 1966. The source list says 1964; I kept both dates and used the museum's.

{% include chart.html src="/assets/wren/relocations.html" title="Map of two Wren church components moved within London" height=560 caption="Lines join each church's City site to where the moved piece stands now, located from the grid reference in its Historic England listing. Red: All Hallows Lombard Street's tower, re-erected at Twickenham in 1940. Blue: St Antholin's spire top, moved to Sydenham in 1829. The Aldermanbury stones in Missouri are beyond the map." %}

Bells moved too. When St Dionis Backchurch was demolished in 1878, its ten bells went to All Hallows Lombard Street. When that church was demolished in turn, its tower and bells went to Twickenham, where six of the St Dionis bells are reported to survive. Neither City church is left.

## Parishes that were folded in

The fire destroyed more churches than were rebuilt. Wikipedia lists **34** whose churches were never rebuilt. Each one's parish was merged with another: 33 of 34 went to churches in my register, spread over **27** churches. The remaining one, St Mary Woolchurch Haw, was joined to St Mary Woolnoth, which isn't in my register (Hawksmoor rebuilt it).

{% include chart.html src="/assets/wren/parish-unions.html" title="Number of never-rebuilt parishes merged into each Wren church" height=780 caption="One bar per church in the register that took in at least one parish whose own church was never rebuilt after 1666. Hover for the parish names. The source list gives no dates for the mergers." %}

St Mary-le-Bow took in three parishes: All Hallows Honey Lane, St John the Evangelist and St Pancras, Soper Lane. Four more took two each: St Alban Wood Street, St Magnus-the-Martyr, St Michael Paternoster Royal and St Nicholas Cole Abbey. Several sites of those lost churches are small public gardens now. The Friends of the City Churches list gardens at St Pancras Soper Lane, St Peter Cheap, St Olave Silver Street, St Mary Staining, St John Zachary and St Ann Blackfriars.

The best-known site is the Monument. Wikipedia says it was built between 1671 and 1677 on the site of St Margaret, New Fish Street, which it calls "the first church to be destroyed by the Great Fire". That parish was merged into St Magnus-the-Martyr. Sources differ on who designed the Monument. Its own article says Robert Hooke developed the design and that the extent of Wren's part can't be known, while the articles on Wren and the Great Fire credit both men, with Wren in control of the final design. Either way it isn't a church, so I have marked it as a related site.

## Which you can walk into

The register has 36 sites with something left to see: 28 church interiors and 8 towers, gardens or remains. For each, I took what the Friends of the City Churches or the church's own site published on 8 October 2026, and sorted it into a few categories without turning it into opening times.

{% include chart.html src="/assets/wren/visiting-map.html" title="Map of surviving Wren church sites coloured by what they publish about visiting" height=640 caption="Blue: an interior with published visiting hours. Red: an interior that is closed, closing, open by arrangement, open for services only, or without regular hours. Yellow: a tower, garden or remains. As published on the date shown in the hover; check the church's own page before you go. Drag or zoom out for the sites west of the City." %}

- 23 interiors publish regular visiting hours, mostly on weekdays. Only five list regular weekend hours: St Andrew Holborn (daily), St Bride's, St Clement Danes, St James's Piccadilly and St Paul's (Saturdays). Three of those five are outside the burned City. St Mary Aldermary opens every third Saturday and St Mary-le-Bow has occasional weekend opening. Three open on only one day: St Anne and St Agnes on the first Wednesday of each month, St Peter upon Cornhill on Tuesday afternoons and St Benet Paul's Wharf on Thursdays.
- 5 interiors are restricted. St Mary Abchurch is closing for refurbishment; the Friends' page says from August 2026, while the church's own page says from about 12 October 2026. St Michael Paternoster Royal is "currently not open to the public". St Edmund the King is by arrangement only, St Clement Eastcheap has "no regular opening times at present", and the Chelsea chapel publishes Sunday services but no casual visiting hours.
- 8 are towers, gardens or remains. Only St Dunstan-in-the-East, where the tower and garden remain, publishes hours. The others have no hours listed.

Only a few churches say anything about step-free access. I found statements on five official sites: St Bride's, St James's Piccadilly, St Margaret Pattens, St Mary Aldermary and St Paul's. For example, St Mary Aldermary says it has "step-free access via the West door, off Bow Lane". For the others, the sources I checked don't say either way. That means unknown, not inaccessible. On fees, only two sources mention them: St Paul's charges £27 per adult for sightseeing (worship is free), and the Friends' Temple Church page notes an entrance fee.

## Which one should you visit?

Matt Brown drew [a flow chart of London's museums](https://commons.wikimedia.org/wiki/File:A_flow_chart_of_London_museums_by_Matt_Brown.jpg) (CC BY 2.0) that answers "where should I go?" with a run of yes/no questions. This is the same idea for Wren's churches, with one rule added: every answer has to come from the data. Before the chart is drawn, each church on it is checked against the register, so it can only send you somewhere for weekend hours, a café or a step-free entrance if a source published one. The questions are mine; the answers are the register's.

<figure class="wc-figure">
{% include wren-chooser.svg %}
</figure>

On a phone the chart gets small, so here it is one question at a time. It also lives in the [Lab]({{ '/lab/#wren-chooser' | relative_url }}).

<div class="wc" id="wc" data-src="{{ '/assets/wren/chooser.json' | relative_url }}" aria-live="polite">
  <p class="wc-note">Loading the chooser…</p>
</div>
<noscript><p class="wc-note">The step-by-step chooser needs JavaScript. The chart above has the same answers.</p></noscript>
<script src="{{ '/assets/js/wren-chooser.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>

The lunch-hour branch is the one walk I tested. From St Stephen Walbrook to St Mary Aldermary is **293 m**, about **4 minutes** on foot by OpenStreetMap's walking routes, and about 49 minutes with rough visit times of 25 and 20 minutes. The distance runs between the coordinates in the source list, not measured doorways, and it doesn't check for steps.

Short as it is, that walk goes from Wren's dome at Walbrook to a church his office rebuilt in Gothic style at Aldermary. Walbrook's own history also links it to other churches. It compares Walbrook's steeple with those of St James Garlickhythe and St Michael Paternoster Royal. Abchurch's history names the same master mason, Christopher Kempster, at Abchurch, Walbrook and St James Garlickhythe. That is enough for a longer route, once the hours line up.

## What I'd do next

The visiting information will go out of date first, which is why I've given categories and dates rather than timetables. A proper walking guide would need checked entrance locations and step-free routes, which none of my sources provide. On the history side, the 1670 Rebuilding Act's full title includes "uniting of Parishes", and the St Anne and St Agnes article says its merger was made under that Act. That points to the mergers being settled together in 1670 rather than one by one; the next step is to check each of the 33 against the Act's text.

[The code and review files are here](https://github.com/koulakhilesh/CodePlayground/tree/main/london-wren-churches) if you want to check my numbers.

## Sources

Accessed 8 and 9 October 2026. Wikipedia text is CC BY-SA 4.0; Historic England list entries are under the Open Government Licence v3.0. Church and museum pages are quoted briefly and remain their owners' copyright.

- Historic England list entries [1079973](https://historicengland.org.uk/listing/the-list/list-entry/1079973) (spire from the former church of St Antholin, Sydenham) and [1080836](https://historicengland.org.uk/listing/the-list/list-entry/1080836) (Church of All Hallows, Twickenham), including the grid references used on the map.
- America's National Churchill Museum, [history of the Church of St Mary the Virgin, Aldermanbury](https://www.nationalchurchillmuseum.org/history-church-of-st-mary.html).
- Wikipedia, [St Antholin, Budge Row](https://en.wikipedia.org/wiki/St_Antholin,_Budge_Row), [St Mary Aldermanbury](https://en.wikipedia.org/wiki/St_Mary_Aldermanbury), [St Dionis Backchurch](https://en.wikipedia.org/wiki/St_Dionis_Backchurch) (the bells) and [St Anne and St Agnes](https://en.wikipedia.org/wiki/St_Anne_and_St_Agnes).
- Wikipedia, [List of churches destroyed in the Great Fire of London and not rebuilt](https://en.wikipedia.org/wiki/List_of_churches_destroyed_in_the_Great_Fire_of_London_and_not_rebuilt), for the parish mergers.
- Wikipedia, [Monument to the Great Fire of London](https://en.wikipedia.org/wiki/Monument_to_the_Great_Fire_of_London), [Christopher Wren](https://en.wikipedia.org/wiki/Christopher_Wren), [Great Fire of London](https://en.wikipedia.org/wiki/Great_Fire_of_London) and [Rebuilding of London Act 1670](https://en.wikipedia.org/wiki/Rebuilding_of_London_Act_1670), for the Monument and the 1670 Act.
- [Friends of the City Churches](https://www.fotcc.org.uk/) church pages, for visiting status and the garden sites.
- Official sites: [St Paul's Cathedral](https://www.stpauls.co.uk/planning-your-visit), [St Clement Danes](https://stclementdanesraf.org/), [St James's Piccadilly](https://www.sjp.org.uk/visit-us/), [Royal Hospital Chelsea](https://chelsea-pensioners.co.uk/visit/wren-chapel-services), [St Bride's](https://www.stbrides.com/visit-us/), [St Margaret Pattens](https://stmargaretpattens.org/map), [St Mary Aldermary](https://www.stmaryaldermary.com/visit-us) and [Host Cafe](https://www.hostcafelondon.com/), [St Stephen Walbrook](https://www.ststephenwalbrook.net/history) ([visiting](https://www.ststephenwalbrook.net/contact-2)) and [St Mary Abchurch](https://www.stmaryabchurch.org.uk/) ([history](https://www.stmaryabchurch.org.uk/history-and-gallery)).
- Walking distances: [FOSSGIS routing server](https://routing.openstreetmap.de/about.html), foot profile, on OpenStreetMap data © OpenStreetMap contributors ([ODbL](https://www.openstreetmap.org/copyright)).
- Map tiles: © [CARTO](https://carto.com/attributions), © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.

The [project README](https://github.com/koulakhilesh/CodePlayground/tree/main/london-wren-churches#data-sources) lists the same sources against the code that collects each one, and every chart carries its own source line.
