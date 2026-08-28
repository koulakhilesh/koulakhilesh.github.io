---
title: "The shape of the Gita: mapping 700 verses with a knowledge graph"
date: 2026-08-28
last_modified_at: 2026-08-28
thumbnail: /assets/thumbs/gita.svg
glyph: gita-map
tags: [Data Science, NLP, Knowledge Graph, Neo4j, Plotly]
excerpt: "I turned all 700 verses of the Bhagavad Gita into a knowledge graph and a set of embeddings, then asked what the text looks like when you map it: where its regions are, which verses sit at the centre, and how its three voices each speak a measurably different language."
toc: true
---

<div class="glyph-hero">{% include glyph.html name="gita-map" %}</div>

The Bhagavad Gita is a conversation of about 700 verses, 18 chapters, one battlefield. I have been building a verse-by-verse digital edition of it as [The Gita Project]({{ '/projects/the-gita-project/' | relative_url }}), and once every verse had its Sanskrit, a transliteration, a word-by-word gloss, and an English translation, a different question started nagging at me. Not *what does it say*, which people have argued about for two thousand years, but a smaller and more answerable one: **what does the text look like when you map it?**

So I loaded all of it into a graph database, gave every verse a numeric fingerprint, and let a few standard algorithms draw the picture. This post is what came back. None of it settles a single theological argument. But the data does say some concrete things, and one of them, about how the three speakers talk, surprised me.

> **Method note.** The source is my own digital edition of the Gita: 701 verse records (the text is traditionally counted as 700; this edition also carries Arjuna's opening question in Chapter 13, which some recensions omit, so it runs to 701), each with its English translation and its Sanskrit Word Meanings. I loaded them into a local **Neo4j** graph, then layered themes, Sanskrit-grounded concepts, the character cast, and semantic similarity on top. Every verse also gets a 768-dimensional embedding of its **English translation only**, from a pinned `sentence-transformers/all-mpnet-base-v2` model, and verse-to-verse similarity edges are kept above a calibrated cosine threshold of 0.55 (2,260 pairs). The graph analytics use the **Neo4j Graph Data Science** library. The whole thing is deterministic and rebuildable; code and the full ontology live in the [gita-knowledge-graph folder](https://github.com/koulakhilesh/CodePlayground/tree/main/gita-knowledge-graph) on GitHub. How the graph itself is built is a companion post, [Building a knowledge graph of the Bhagavad Gita]({{ '/writing/building-a-knowledge-graph-of-the-gita/' | relative_url }}). Numbers in this post come straight from those notebooks.

## A map of 700 verses

Every verse is a point in 768-dimensional space. That is impossible to look at, so I squashed it down to two dimensions with t-SNE, where verses that mean similar things end up near each other. Then I coloured each point by the community a graph algorithm (Louvain) finds in the similarity network, and labelled each region by the theme that is most distinctive to it.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/gita/map_verse_annotated.html' | relative_url }}"
          title="A t-SNE map of all 701 Gita verses, coloured by semantic community and labelled by each region's most distinctive theme"
          loading="lazy"
          style="width:100%;height:700px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Every dot is a verse. Nearby dots mean similar things. Colours are the semantic communities; labels name each region's most distinctive theme. Hover a point for its verse number and text.
  </figcaption>
</figure>

The algorithm splits the text into **47 communities**, and it is a genuinely tight partition: **77%** of all similarity links fall inside a community rather than between communities, and the modularity score is **0.69**. A second, independent algorithm (Leiden) recovers a closely matching split of 49 groups, so this is not an artefact of one method.

The communities also do not respect the chapter numbers, which is the part I keep returning to. Colour the exact same map by chapter instead, and the colours smear across the whole plane rather than forming 18 neat blocks:

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/gita/map_verse_chapters.html' | relative_url }}"
          title="The same verse map coloured by chapter number, showing that chapters do not form tidy clusters"
          loading="lazy"
          style="width:100%;height:700px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    The same 701 verses, now coloured 1 to 18 by chapter. If chapters were self-contained topics, you would see 18 blocks. You do not.
  </figcaption>
</figure>

The largest semantic communities each span ten to sixteen different chapters. The Gita returns to its core ideas again and again, in different chapters, in language similar enough that a machine groups them without ever being told what a chapter is. The chapter divisions organise the reading; the topics ignore them.

## What each region is about

Naming a cluster is harder than finding it, because the obvious method fails. If you just ask which theme is heaviest in each community, almost every region comes back "karma", because action is discussed nearly everywhere. So instead I measured **lift**: how much more a theme appears in a community than in the text overall. That surfaces what makes a region distinctive rather than what is simply common.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/gita/map_community_theme_signature.html' | relative_url }}"
          title="Heatmap of theme share for each of the largest verse communities"
          loading="lazy"
          style="width:100%;height:560px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    The theme signature of each of the eight largest communities. Read a column top to bottom to see what that region dwells on.
  </figcaption>
</figure>

Pick the verse nearest each community's centre and the regions come into focus. The biggest community, 90 verses, is a **devotion** cluster; its centre is 12.6, *"But to those who worship Me, renouncing all actions in Me…"*. A second region of 73 verses is pure **karma-yoga**; its centre is 3.30, *"Renouncing all actions in Me, with the mind centered on the Self…"*. A third, 44 verses, is about the **senses and the mind**, centred on 2.55, *"When a man completely casts off, O Arjuna, all the desires of the mind…"*.

One honest caveat before anyone reads too much into it: these are *semantic* clusters, grouped by how the English translations read, not a doctrinal map. They line up loosely with the tradition's sense that the Gita moves through action, knowledge, and devotion, but I did not build them to prove that, and I would not lean on them to.

## The centre of gravity

If verses are a network, some sit closer to the middle than others. PageRank, the algorithm that made Google, scores a verse highly when many other well-connected verses resemble it. Run it on the similarity network and the single most central verse in the whole Gita is **12.6**, followed by **12.7**, both from Chapter 12, the *Bhakti Yoga* chapter on devotion.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/gita/analysis_pagerank_top_verses.html' | relative_url }}"
          title="The fifteen verses with the highest PageRank in the Gita similarity network"
          loading="lazy"
          style="width:100%;height:560px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    The verses most central to the semantic web. Chapter 12's devotional summations sit at the top.
  </figcaption>
</figure>

I want to be careful about what this means. PageRank rewards a verse for echoing many others, so the "centre" is really the text's most *representative* language, the lines that restate its recurring promise most plainly. That does not make them the most important verses. It only means that if you had to pick the ones the rest of the book most sounds like, the machine points at Chapter 12's devotional summations.

## Three voices, three vocabularies

The Gita is a dialogue, and the graph knows who speaks each verse. Four voices carry it, but the floor is not shared evenly at all.

<div style="display:flex;gap:1rem;flex-wrap:wrap;margin:1.6rem 0;">
  <div style="flex:1;min-width:120px;text-align:center;padding:1.1rem .6rem;border:1px solid var(--line);border-radius:12px;">
    <div style="font-size:2.1rem;font-weight:700;color:#1c5fb0;line-height:1;">82<span style="font-size:1.1rem;">%</span></div>
    <div style="font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-top:.4rem;">spoken by Krishna (574 verses)</div>
  </div>
  <div style="flex:1;min-width:120px;text-align:center;padding:1.1rem .6rem;border:1px solid var(--line);border-radius:12px;">
    <div style="font-size:2.1rem;font-weight:700;color:#1c5fb0;line-height:1;">12<span style="font-size:1.1rem;">%</span></div>
    <div style="font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-top:.4rem;">Arjuna (86 verses)</div>
  </div>
  <div style="flex:1;min-width:120px;text-align:center;padding:1.1rem .6rem;border:1px solid var(--line);border-radius:12px;">
    <div style="font-size:2.1rem;font-weight:700;color:#1c5fb0;line-height:1;">6<span style="font-size:1.1rem;">%</span></div>
    <div style="font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-top:.4rem;">Sanjaya, the narrator (40 verses)</div>
  </div>
</div>

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/gita/speaker_share.html' | relative_url }}"
          title="Verses spoken by each voice in the Gita"
          loading="lazy"
          style="width:100%;height:340px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
</figure>

The interesting question is not who talks most, it is whether they talk *differently*. To test that I used **keyness**, the standard corpus-linguistics measure: for each speaker, a log-likelihood test flags the words they use far more often than the other voices do. It is the same idea behind "signature words". The result splits the three main speakers cleanly, and it reads like the story itself.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/gita/speaker_keyness.html' | relative_url }}"
          title="Signature words for each speaker, ranked by Dunning log-likelihood keyness"
          loading="lazy"
          style="width:100%;height:560px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Content words each voice over-uses relative to the others, by log-likelihood.
  </figcaption>
</figure>

**Krishna** speaks the language of the teacher: his signature words are *action, self, sacrifice, knowledge, attachment, intellect*. **Arjuna**, the warrior having a breakdown at the edge of a war he does not want to fight, over-uses *kill, family, battle, destruction*, and, tellingly, *mouth* and *tooth*, the vocabulary of his terrifying vision of the divine in Chapter 11. **Sanjaya**, the narrator relaying the scene to a blind king, deals in *son, conch, archer, army, king*, the furniture of the battlefield he is describing. Nobody labelled these voices by role; a frequency test pulled the teacher, the panicking student, and the war reporter apart on its own.

There is a quieter signal in the same data. Arjuna leans into the theme of *dharma*, duty, nearly three times as heavily as the text does on average (a lift of about 2.9), which is exactly the knot he is tied in. The machine found his crisis by counting words.

## The honest limits

A few things this cannot do, stated plainly so the pictures above are not oversold. The embeddings are built from the **English translation only**, so the map reflects one translator's choices as much as the Sanskrit; a different translation would move the dots. The keyness test runs over content words (nouns and verbs), so it captures *what* each voice talks about better than *how* they phrase it. The community detection is semantic, not doctrinal, and the second algorithm agrees with the first on only about 60% of the exact assignments (adjusted Rand index around 0.58), so treat the fine boundaries as soft. And a t-SNE map distorts distance to fit everything on a page; read it for neighbourhoods, not for precise gaps.

What survives all of that is small but real. The Gita's topics run across its chapters rather than staying inside them, its most representative language is devotional, and its three voices use measurably different words that match the roles they play. None of it needed me to interpret a single verse.
