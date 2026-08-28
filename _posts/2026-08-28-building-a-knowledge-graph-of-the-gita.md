---
title: "Building a knowledge graph of the Bhagavad Gita"
date: 2026-08-28
last_modified_at: 2026-08-28
thumbnail: /assets/thumbs/gita.svg
tags: [Data Science, NLP, Knowledge Graph, Neo4j, spaCy]
excerpt: "The companion to the map: how 700 markdown verse files became a graph of 5,314 nodes and nearly 22,000 relationships, deterministically and rebuildably, with the English translation and the Sanskrit word meanings both wired in."
toc: true
---

<div style="text-align:center;margin:2rem 0 2.4rem;">
  <img src="{{ '/assets/thumbs/gita.svg' | relative_url }}" width="184" height="184"
       alt="A minimal emblem: Krishna's peacock feather crossed with Arjuna's arrow" loading="lazy">
</div>

[The shape of the Gita]({{ '/writing/the-shape-of-the-gita/' | relative_url }}) showed the pictures: a map of 700 verses, the regions the text falls into, the way its three voices each use different words. This post is the plumbing underneath those pictures. Before you can ask a text a statistical question you have to turn it into something a machine can hold, and I wanted that step to be honest: nothing appearing from nowhere, and the whole thing rebuildable from the source with one command.

What comes out is a graph of **5,314 nodes** and **21,947 relationships**, and every single one of them can be traced back to a verse file.

> **Method note.** The source is my digital edition of the Gita: 701 verse records, each a markdown file with the chapter and verse number, the Sanskrit, a transliteration, a word-by-word gloss, and an English translation. Everything below is deterministic and idempotent (re-running rebuilds the same graph with no duplicates), and the pure parsing and graph-building logic is covered by 89 unit tests that touch neither the database nor the network. Code and the full ontology live in the [gita-knowledge-graph folder](https://github.com/koulakhilesh/CodePlayground/tree/main/gita-knowledge-graph) on GitHub.

## The verse is the unit

Everything hangs off the verse. Parsing one is deliberately boring, exact string and regular-expression work rather than anything clever: pull the chapter and verse number from the front matter, take the text under the `## Translation` heading, and read the word-by-word table under `## Word Meanings`. That gives the spine of the graph: one **Text**, its **18 chapters**, and **701 verses**, chained in reading order so you can walk the book verse by verse.

Two facts about each verse are worth a little care. The first is who speaks it. The Gita marks a change of speaker with a prefix, *"The Blessed Lord said,"* or *"Arjuna said,"*, but most verses carry no prefix at all because the speaker has not changed. So the parser reads the prefix when it is there and otherwise inherits the previous speaker, which is exactly how a human reads it. That resolves all 701 verses to one of **four voices** and, from the speaker, an addressee.

The second is the honorifics. The Gita almost never uses plain names; it calls Arjuna *Partha* and *Dhananjaya*, and Krishna *Hrishikesha* and *Madhava*. I tag those with a rule-based matcher seeded from a fixed list of **22 epithets**, not a statistical name-finder. That is a deliberate choice: the list is small and known, so a rule is both more accurate and more honest than a model that might hallucinate a name.

## Two vocabularies

A verse has two texts, and I did not want to throw either away. So the graph carries two parallel vocabularies.

The **English layer** comes from the translation. A standard NLP pipeline (spaCy) lemmatises it and keeps the nouns and verbs, which become **1,171 distinct terms** joined to their verses by **6,156** weighted links. This is the statistical layer, the one that later feeds themes.

The **Sanskrit layer** comes from the word-by-word gloss. This one needed more care, because a word-by-word table is full of grammatical noise: pronouns, particles, and speaker markers that carry no meaning. So the parser drops those with a stoplist and normalises inflected surface forms back toward their root, so that *karmani*, *karmana*, and *karma-phala* all land on *karma*. That leaves **3,340 Sanskrit terms** linked to their verses **7,995 times**. The design rule I held to: English drives the embeddings later, because it is reproducible, but Sanskrit drives *meaning*, because it is the source language.

## From words to ideas

Two vocabularies are still just words. The next layer turns them into ideas, and it does so deterministically, with no model guessing.

**Themes** are 13 broad topics (karma, dharma, bhakti, jnana, yoga, and so on), each defined as a set of English lemmas. A verse links to a theme when it uses those lemmas, and the strength of the link is just how often. **Concepts** are 22 philosophical categories grounded the other way, in the Sanskrit terms: a verse expresses *atman* when it contains Sanskrit words rooted in *atman*. The two layers meet on the nine names they share (karma, dharma, yoga, bhakti, jnana, moksha, atman, brahman, guna), bridged so a query can cross from the English index into the Sanskrit ontology.

Because every verse now carries themes, you can ask which ideas keep company. This is node similarity over the shared verses: two themes score highly when they tend to appear in the same verses.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/gita/analysis_theme_correlation.html' | relative_url }}"
          title="Heatmap of which Gita themes co-occur, measured by Jaccard similarity over shared verses"
          loading="lazy"
          style="width:100%;height:620px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Which themes travel together, by how many verses they share. Brighter means more overlap.
  </figcaption>
</figure>

## The cast, the conches, and the glories

The nicest part to build was the narrative layer, because it is pulled straight out of the glosses rather than curated by hand. Scan the word meanings for known names and you recover the **cast**: 18 characters, from Arjuna and Krishna down to minor warriors, joined to the verses that name them by **310** links.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/gita/analysis_character_network.html' | relative_url }}"
          title="Co-occurrence network of characters named in the Gita"
          loading="lazy"
          style="width:100%;height:640px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Two characters are linked when a verse names them together. Node size is centrality in that network.
  </figcaption>
</figure>

Two smaller entity layers come from the same glosses. Chapter 1 names six war-conches, and the graph knows which warrior blows each one:

| Conch | Sounded by |
|---|---|
| Panchajanya | Krishna |
| Devadatta | Arjuna |
| Paundra | Bhima |
| Anantavijaya | Yudhishthira |
| Sughosha | Nakula |
| Manipushpa | Sahadeva |

And Chapter 10, where Krishna lists his divine glories, is captured as the 13 verses that explicitly declare *"I am…"* (in Sanskrit, *asmi*). I kept that layer strict on purpose: it records *that* Krishna declares a glory, but it does not try to pair each "I am" with its object, because the Sanskrit word order there is inconsistent and any automatic pairing would be guessing. I would rather record less and have all of it be right.

## Meaning by number

The last layer is the one the map is built on. Every verse gets a 768-dimensional embedding of its **English translation only**, from a pinned `all-mpnet-base-v2` model, and I compare every pair by cosine similarity. Rather than keep every faint resemblance, I calibrated a threshold: the notebook tries several cutoffs, checks how much of the text stays connected and how many cross-chapter theme links survive, and settles on 0.55, which keeps **2,260** verse-to-verse similarity links.

One deliberate piece of friction here: those similarity edges are the only part of the build that is not written automatically. The notebook stops and makes me eyeball a sample of the pairs and approve them before it loads them. It is the one place where the graph makes a judgement about meaning, so it is the one place I kept a human in the loop.

## The whole thing, and why it is built this way

Stack all of that up and you get the graph. Here is its backbone, everything except the two dense word layers, which would otherwise drown the picture:

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/gita/gita_graph_backbone.html' | relative_url }}"
          title="The structural backbone of the Gita knowledge graph"
          loading="lazy"
          style="width:100%;height:680px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Text, chapters, verses, speakers, themes, concepts, characters, conches, and the similarity web between verses. The word layers are hidden here.
  </figcaption>
</figure>

The one principle that kept the whole thing honest is that every node and edge has a **provenance**, and it is always one of four kinds. It is a *seed* (a hand-curated constant, like the chapter names or the theme definitions), something *extracted* directly from a verse (the speaker, the epithets, the Sanskrit terms, the conches), something *derived* deterministically from what was extracted (the themes and concepts), or something *computed* by the pinned model (the embeddings and the similarity). Nothing in the graph is a guess dressed as a fact, and if you disagree with a link you can always trace it back to the verse it came from.

That discipline is the actual point. The pictures in [the shape of the Gita]({{ '/writing/the-shape-of-the-gita/' | relative_url }}) are only worth looking at because the thing underneath them is dull, checkable, and rebuilds from the text with one command. The analysis was the fun half; this is the half that makes it trustworthy.
