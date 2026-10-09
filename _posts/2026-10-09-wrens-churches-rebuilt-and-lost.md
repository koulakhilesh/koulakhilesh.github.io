---
title: "Wren's City churches: thirty years to rebuild, two centuries of losses"
date: 2026-10-09 08:00:00 +0100
last_modified_at: 2026-10-09
thumbnail: /assets/thumbs/wren.png
glyph: wren-steeples
image: /assets/social/wrens-churches-rebuilt-and-lost.png
series: "Wren's City churches"
series_part: 1
ink: yellow
kicker: "London · History"
dek: "Most of the churches rebuilt after the Great Fire were started in the 1670s. Of the 45 full replacements, 20 still stand, and most of the ones lost were pulled down long before the Blitz."
pull:
  value: "20 of 45"
  label: "replacement churches are gone; another 5 survive only as a tower"
tags: [Data Science, History, London, Open Data, Plotly]
excerpt: "Of the 45 City churches rebuilt from scratch after the Great Fire, 30 were started in the 1670s, and the 19 I could verify took a median of five years. Today 20 stand, 5 survive as towers and 20 are gone, half of them demolished between 1868 and 1897 while the City's population fell by about 70%."
toc: true
---

The Great Fire of 1666 burned most of the City of London, including most of its parish churches and old St Paul's. Christopher Wren's office rebuilt about fifty of the churches over the next thirty years. Wren had overall control of the programme, but historians credit some of the designs to others in his office, such as Robert Hooke. I knew the famous survivors (St Stephen Walbrook, St Mary-le-Bow, St Bride's) and had a vague idea that the Blitz took the rest.

I wanted to check that idea against the record. How quickly were the churches rebuilt? How many are left? What happened to the rest? I built a register of the churches and labelled every date with how well it is supported before deciding what it meant.

> **Data & licence.** The starting list is Wikipedia's [List of Christopher Wren churches in London](https://en.wikipedia.org/wiki/List_of_Christopher_Wren_churches_in_London) and the article for each church (text CC BY-SA 4.0), all fetched on 8 October 2026. These were checked against Historic England's National Heritage List entries ([Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)), church and museum websites (quoted briefly), Wikipedia's list of churches destroyed in the fire and not rebuilt, and the City of London census table on Wikipedia (which cites the City of London Corporation and ONS). I also used the catalogue of churches in *Parentalia* (1750), compiled by Wren's son, from a public-domain scan on the Internet Archive. One Historic England page blocked my downloader, so I used the same Open Government Licence text as republished by British Listed Buildings. For historical context I used Wikipedia's articles on Wren, the Rebuilding of London Act 1670 and the Union of Benefices Act 1860, which draw on T. F. Reddaway's *The Rebuilding of London after the Great Fire* (1940) and histories of the City churches. **Every date carries an evidence label:** *verified* means I read a passage that states it and recorded why; *two sources agree* means the list and the listing match, though one may copy the other; *disputed* means the sources differ and I kept every version; *one list only* is unchecked. Many verified dates rest on encyclopedia articles rather than original records. Code, review files and the full method: [london-wren-churches](https://github.com/koulakhilesh/CodePlayground/tree/main/london-wren-churches) ([METHODS.md](https://github.com/koulakhilesh/CodePlayground/blob/main/london-wren-churches/METHODS.md)). Every source is linked in [Sources](#sources) at the end.

## What is left

The register has 56 entries: 45 churches that were fully rebuilt after the fire, 3 that were repaired, St Paul's, St Michael Cornhill (where Wren's part is disputed), St Andrew Holborn (which did not burn), Temple Church (an interior refit) and four churches outside the City. Each is on the map below, coloured by what stands today.

{% include chart.html src="/assets/wren/fate-map.html" title="Map of Wren-associated churches coloured by whether they stand, survive as a tower, or are gone" height=640 caption="Each dot is a church site as given by the source list, not a verified entrance. Blue: standing. Yellow: only the tower survives. Red: gone. Grey: the Monument, which stands where St Margaret, New Fish Street did. Hover for the list's classification and, where the register has them, the building years with their evidence label; click the legend to hide a group. The sites west of the City, such as St James's Piccadilly and the Chelsea chapel, start off the edge: drag or zoom out to see them." %}

For the 45 full replacements, the count comes out like this:

- 20 stand. 11 survived in their original form, 8 were substantially rebuilt after Second World War bombing, and 1 was altered before it.
- 5 survive only as a tower.
- 20 are gone. 10 were demolished under the Union of Benefices Act, 5 for other reasons, 3 were destroyed in the Blitz and not rebuilt, and 2 had their stone moved elsewhere.

So 20 of 45 are gone, exactly as many as still stand.

"Standing" covers a range. For six of the eight churches rebuilt after the war, the Historic England listing says the interior was destroyed or burnt and then "reconstructed in near facsimile": St Andrew-by-the-Wardrobe, St Bride's, St Lawrence Jewry, St Mary-le-Bow, St Nicholas Cole Abbey and St Vedast. In those six, the interior you see is a post-war reconstruction of the original.

## How long they took

The 1670 Rebuilding Act raised a tax on coal to pay for the churches, and work began that year. Private houses were a different story: most of those were rebuilt by 1671. Taking each church's best-supported range, 30 of the 45 were started in the 1670s: 15 in 1670 to 1674 and 15 in 1675 to 1679. Then 9 more began in 1680 to 1684 and 6 in 1685 to 1689. The finish years spread more evenly, from 1673 to 1695.

{% include chart.html src="/assets/wren/rebuilding.html" title="Rebuilding interval for each of the 45 replacement churches, coloured by evidence" height=1100 caption="One bar per church, from start to finish of its best-supported range. Blue: verified. Light blue: two sources agree. Red: disputed (other ranges in the hover). Grey: one list only. The black tick is the rebuilding year given in Parentalia (1750), where I could read it. Hover for the other ranges." %}

For **19** churches I could verify a start and an end for the main building. Their spans run from 3 to 10 years, with a median of **5**. That is elapsed time, including pauses: work at St Michael Paternoster Royal stopped in 1688 amid the financial uncertainty of the Glorious Revolution and restarted the next year, and St Mary Somerset had a similar break. Towers and steeples often came much later. St Mary-le-Bow's body was finished by 1673, but its tower took until 1680. St Vedast's main body was finished in 1673 and its spire about 1712.

The other 26 are less certain: 15 disputed, 3 where two sources agree, and 8 that rest on the list alone (seven of those have a single verified year, such as a completion or reopening, but no verified start). The disputes follow a pattern. Where sources disagree about a church, they usually agree on when it started and disagree on when it finished. Walbrook, for example, is 1672 to 1679 in its Wikipedia article and 1672 to 1687 in its Historic England listing.

*Parentalia* gives a third opinion. For nine disputed churches it gives a readable year, and the sources disagree on when they were finished. In 7 of those 9 the catalogue matches the **earlier** finishing year, in 2 it matches neither, and it never matches the later Historic England year. My guess is that the later listing dates include towers or fittings. But the catalogue and the articles may come from the same tradition, so I haven't used it to settle anything. It appears on the chart as a tick.

## What they cost

Wikipedia articles quote a building cost for 28 of the replacement churches. In money of the time, the median is **£5,329**. The cheapest is St Vedast at £1,854, for the main body only (its later spire cost another £2,958). The most expensive is St Mary-le-Bow at **£15,421**, ahead of Christ Church Greyfriars and St Magnus-the-Martyr.

{% include chart.html src="/assets/wren/costs.html" title="Reported building cost of 28 replacement churches in nominal pounds" height=840 caption="Cost as stated in each church's article, in pounds of the time, not adjusted for inflation. Colour shows what the figure covers: grey where the source does not say, blue for the church alone, yellow for church and tower, red for church and steeple." %}

These figures are not quite like-for-like, because some include a tower and some do not. Together the 28 come to £167,576. The same Wikipedia articles put St Paul's at £1,095,556 by 1716, about six and a half times as much.

## How they were lost

The loss events tell a different story from the one I had in mind, though not from the standard account. The Wikipedia list itself says many of Wren's churches "were demolished as the population of the City of London declined in the 19th century and more were destroyed or damaged during the Blitz". Across the whole register there are **32** loss events at 30 churches. Two churches appear twice: St Swithin was bombed in 1940 and its ruins were cleared in 1961 to 1962, and St Anne's, Soho, was bombed and its ruins cleared later. Every loss has a stated cause. For 25 the cause is the heading of the section the list puts the church in; for the other 7 it comes from a passage in the church's article that I read. The years are weaker than the causes: only one is marked verified, and the rest are the years the list gives.

- 12 under the Union of Benefices Act, an 1860 law that allowed City churches to be demolished and their land sold to pay for churches in the suburbs.
- 11 wartime destructions. These include St James's Piccadilly and St Clement Danes, which were later restored. The list gives a year for only five of them.
- 4 for street works or other buildings: the Bank of England (1782), the approaches to the new London Bridge (1831), the widening of Threadneedle Street (1840) and the Royal Exchange (1841).
- 3 found unsafe: St Michael Bassishaw (1900), St George Botolph Lane (1904) and All Hallows Lombard Street (1937 in its article, 1939 in the list).
- 2 sets of bombed ruins cleared later: St Swithin and St Anne's, Soho.

{% include chart.html src="/assets/wren/losses.html" title="Dated loss events by cause, with the City's resident population" height=540 caption="Each marker is a dated loss, at the first year the source gives. Seven undated losses (six wartime destructions and the clearing of St Anne's ruins) are left off the chart but counted in the text. Grey line, right axis: the City's resident population at each census to 1971 (1941 had no census)." %}

The Union of Benefices demolitions are tightly bunched, all twelve falling between 1868 and 1897. Over the same period the City emptied. Its census population was 130,117 in 1801 and still 132,734 in 1851. It then fell to 108,078 in 1861 and **32,649** in 1901, a drop of about 70% in forty years, and was 7,568 by 1951. The earlier street-works demolitions came while the population was still roughly level.

The two series line up, and historians draw the same link. Wikipedia's article on the Act says it was chiefly used in the City "as its residential population declined in favour of commercial land use". My data shows the timing, not the cause, but the timing fits that account. The St Mary Somerset article gives the church's side: City congregations had shrunk while the new suburbs had no churches.

## How many were there?

Wren's churches are usually counted as 51, and my list didn't reconcile with that number. *Parentalia* explained it. Its catalogue is headed "Fifty-one parochial Churches ... erected according to the Designs, and under the Care and Conduct, of Sir Christopher Wren", and it lists 54 churches "together with other Churches built, and repair'd". It includes two churches in Westminster and St Andrew Holborn, which the fire didn't reach. Without those three, it leaves the 49 churches in this register that stood in the burned area, plus St Mary Woolnoth and St Sepulchre, which the catalogue lists but my register leaves out. That makes exactly 51. (Wikipedia credits Woolnoth's post-fire repair to Wren, and Sepulchre's rebuilding to the mason Joshua Marshall.) So the traditional figure counts repaired churches as well as new ones.

St Michael Cornhill is in that 51, but whether Wren designed it is still argued. Its Historic England listing says "1670 to 77, by Wren", and *Parentalia* includes it. The *Buildings of England* volume cited by its Wikipedia article says the parish dealt with the builders directly and Wren's office had no part in the body. Both "for" sources come from the tradition the modern view questions, so I have left the church unresolved.

Not every burned church came back. Wikipedia's list of churches destroyed in the fire and not rebuilt has **34** parishes. Thirty-three of them were joined to a church in this register, spread over 27 churches; St Mary-le-Bow took in three. Those absorbed parishes, and the stone that moved away, are the subject of [the second post]({% post_url 2026-10-09-wrens-churches-travelled-and-open %}). It ends with a yes/no flow chart for picking a church to visit.

## What I'd do next

The weak point is the dates. Nineteen verified intervals is enough to see the rough shape of the rebuilding, but most of them rest on encyclopedia articles. The building accounts printed by the Wren Society would settle many of the disputes, including St Michael Cornhill, but I couldn't find them freely available online. Better dates for the wartime losses would come next.

The review files record a decision, a source and a reason for every date and cause above. [The code and review files are here](https://github.com/koulakhilesh/CodePlayground/tree/main/london-wren-churches) if you want to check my numbers.

## Sources

Accessed 8 and 9 October 2026. Wikipedia text is CC BY-SA 4.0; Historic England list entries are under the Open Government Licence v3.0.

- Wikipedia, [List of Christopher Wren churches in London](https://en.wikipedia.org/wiki/List_of_Christopher_Wren_churches_in_London), and the article for each church it links. Those quoted or cited here: [St Mary-le-Bow](https://en.wikipedia.org/wiki/St_Mary-le-Bow), [St Vedast Foster Lane](https://en.wikipedia.org/wiki/St_Vedast_Foster_Lane), [St Stephen Walbrook](https://en.wikipedia.org/wiki/St_Stephen_Walbrook), [St Michael Paternoster Royal](https://en.wikipedia.org/wiki/St_Michael_Paternoster_Royal), [St Mary Somerset](https://en.wikipedia.org/wiki/St_Mary_Somerset), [St Michael, Cornhill](https://en.wikipedia.org/wiki/St_Michael,_Cornhill), [St Swithin, London Stone](https://en.wikipedia.org/wiki/St_Swithin,_London_Stone), [St Mary Woolnoth](https://en.wikipedia.org/wiki/St_Mary_Woolnoth) and [St Sepulchre-without-Newgate](https://en.wikipedia.org/wiki/St_Sepulchre-without-Newgate).
- Historic England, [National Heritage List for England](https://historicengland.org.uk/listing/the-list/), the list entries cited by those articles. Entry 1079145 (St Mary Aldermary) was read through the [British Listed Buildings copy](https://britishlistedbuildings.co.uk/101079145-church-of-st-mary-aldermary-cordwainer-ward).
- Wikipedia, [List of churches destroyed in the Great Fire of London and not rebuilt](https://en.wikipedia.org/wiki/List_of_churches_destroyed_in_the_Great_Fire_of_London_and_not_rebuilt).
- Wikipedia, [City of London](https://en.wikipedia.org/wiki/City_of_London), census population table, which cites the City of London Corporation and the Office for National Statistics.
- Christopher Wren (the younger), *Parentalia, or Memoirs of the Family of the Wrens* (1750), catalogue of churches, [Internet Archive scan](https://archive.org/details/gri_33125011157357). Public domain.
- For historical context: Wikipedia, [Christopher Wren](https://en.wikipedia.org/wiki/Christopher_Wren), [Great Fire of London](https://en.wikipedia.org/wiki/Great_Fire_of_London), [Rebuilding of London Act 1670](https://en.wikipedia.org/wiki/Rebuilding_of_London_Act_1670) and [Union of Benefices Act 1860](https://en.wikipedia.org/wiki/Union_of_Benefices_Act_1860). These draw on T. F. Reddaway, *The Rebuilding of London after the Great Fire* (1940), Jacob Field, *London, Londoners and the Great Fire of 1666* (2017), and G. Huelin, *Vanished Churches of the City of London* (1996), which I have not read directly.
- Map tiles: © [CARTO](https://carto.com/attributions), © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.

The [project README](https://github.com/koulakhilesh/CodePlayground/tree/main/london-wren-churches#data-sources) lists the same sources against the code that collects each one, and every chart carries its own source line.
