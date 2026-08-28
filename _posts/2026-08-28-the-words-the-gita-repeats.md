---
title: "The words the Gita repeats: counting its Sanskrit vocabulary"
date: 2026-08-28
last_modified_at: 2026-08-28
thumbnail: /assets/thumbs/gita.svg
glyph: gita-words
tags: [Data Science, NLP, Linguistics, Sanskrit, Plotly]
excerpt: "The first two posts leaned on the English translation. This one counts the Sanskrit: 3,340 words from the word-by-word glosses, where they follow the same frequency laws as any language, and where the count quietly tells you what the text is actually about."
toc: true
---

<div class="glyph-hero">{% include glyph.html name="gita-words" %}</div>

The [map]({{ '/writing/the-shape-of-the-gita/' | relative_url }}) and the [build]({{ '/writing/building-a-knowledge-graph-of-the-gita/' | relative_url }}) both leaned on the English translation, because that is what the embeddings are made from. But the graph also carries the other half of every verse: the word-by-word Sanskrit gloss, normalized into **3,340 Sanskrit terms**. This post does the least glamorous thing you can do to a vocabulary, which is count it, and finds that the counting says more than I expected.

> **Method note.** The Sanskrit terms come from the per-verse Word Meanings tables, with particles and pronouns dropped and inflected forms normalized toward their roots. The graph records that a term appears in a verse, but not how many times, so throughout this post **frequency means document frequency**: how many of the 701 verses a term shows up in. A "hapax" is therefore a term that appears in exactly one verse. Two honest caveats up front: the normalization is imperfect (you will see a stray inflected form or pronoun below), and document-frequency counting slightly inflates how rich the vocabulary looks. Code lives in the [gita-knowledge-graph folder](https://github.com/koulakhilesh/CodePlayground/tree/main/gita-knowledge-graph) on GitHub; numbers come straight from the notebook.

## The most repeated words are the ideas

Rank the Sanskrit terms by how many verses contain them, and the top of the list is not incidental vocabulary. It is the philosophy itself.

| Sanskrit term | Gloss | Verses |
|---|---|---:|
| karma | action | 92 |
| jnana | knowledge | 60 |
| atman | the self | 55 |
| yoga | discipline | 48 |
| manas | mind | 42 |
| brahma | the absolute | 38 |
| indriya | the senses | 26 |
| kama | desire | 23 |
| tapah | austerity | 22 |

*Karma* appears in **92** of the 701 verses, more than one verse in eight. Under it sit *jnana*, *atman*, *yoga*, *manas*, *brahman*: exactly the concepts the tradition says the Gita is about. You could have guessed the list. What I did not expect was that a blind word-count would recover it with no idea of meaning at all.

I am keeping this honest, so: the raw list also has a couple of passengers. The pronoun *mayi* ("unto me") slips past the stoplist, the name *Arjuna* is frequent for obvious reasons, and you can spot *buddhih* sitting separately from *buddhi*, an inflected form the normaliser missed. None of that changes the shape of the top of the list, but it is the kind of thing that would, if I swept it under the rug, quietly make the numbers a lie.

## It behaves like a language

Word frequencies in natural language follow Zipf's law: the *n*-th most common word appears about proportionally to 1/*n*, so a log-log plot of frequency against rank falls on roughly a straight line. Does a 700-verse Sanskrit text, counted by document frequency, do the same?

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/gita/sanskrit_zipf.html' | relative_url }}"
          title="Log-log plot of Sanskrit term frequency against frequency rank, with a fitted line"
          loading="lazy"
          style="width:100%;height:520px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Every dot is a Sanskrit term. The straight-ish line in log-log space is Zipf's law showing up. Hover for the word and its gloss.
  </figcaption>
</figure>

It does, with a fitted slope of about **-0.69**. That is shallower than the textbook -1, which is expected: document frequency flattens the very top (a word can only be counted once per verse, no matter how often it is chanted inside that verse), and the text is short. But the law is unmistakably there. The Gita's Sanskrit is not a special code; it distributes its words the way language does.

## Most words appear once

The flip side of a Zipf curve is a long, thin tail, and here it is dramatic. **56%** of all Sanskrit terms, 1,865 of the 3,340, appear in exactly one verse. Three quarters appear in two verses or fewer. The vocabulary is a small hard core of repeated concepts sitting on top of a huge scatter of words used once and never again.

You can watch that happen by reading the text in order and counting how many *new* words each verse brings in:

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/gita/sanskrit_growth.html' | relative_url }}"
          title="Cumulative count of distinct Sanskrit terms as the text is read in order"
          loading="lazy"
          style="width:100%;height:460px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Distinct Sanskrit terms seen so far, verse by verse. The curve barely bends: the Gita keeps minting new words to the end.
  </figcaption>
</figure>

The curve hardly flattens. By the halfway point of the book only about **1,970** of the 3,340 terms have appeared, so the second half is still introducing more than a thousand new ones. In quantitative-linguistics terms the vocabulary-growth (Heaps') exponent is about **0.88**, high for a text this size.

Here is where I have to be careful, because it is tempting to read that as "the Gita is extraordinarily rich" and stop. Part of the richness is real: it ranges over metaphysics, ethics, devotion, and a battlefield. But part of it is Sanskrit's morphology, a single root throws off many inflected surface forms, and my normalization only pulls them *toward* their roots, not perfectly onto them (remember *buddhih* and *buddhi*). So the type count is inflated, and the honest reading is: the Gita has a genuinely broad vocabulary, made to look even broader by the language's grammar and my imperfect tidying of it.

## Which chapters are densest

Finally, not every chapter carries the same weight of vocabulary per verse.

<figure class="chart-embed" style="margin:1.8rem 0;">
  <iframe src="{{ '/assets/gita/sanskrit_richness_by_chapter.html' | relative_url }}"
          title="Sanskrit terms per verse for each of the 18 chapters"
          loading="lazy"
          style="width:100%;height:460px;border:1px solid var(--line);border-radius:12px;background:#fff;"></iframe>
  <figcaption style="font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.6rem;text-align:center;">
    Distinct Sanskrit terms per verse, by chapter. Colour is the chapter's total distinct-term count.
  </figcaption>
</figure>

The densest chapter is **16** (*Daivasura Sampada Vibhaga*, the divine and demoniac natures) at about **17 terms per verse**, a chapter that works by piling up lists of qualities. Chapter **1**, Arjuna's despair on the field, is close behind at nearly 14, thick with the names of warriors and weapons rather than concepts. The leanest is Chapter **7** at about 9, where Krishna settles into steady, repetitive teaching and reuses the same core words. That is enumeration, not depth: chapter 16 lists where chapter 7 repeats.

None of this interprets a single verse; it only counts them. But the count lands on something real: the words the Gita says most often are its core ideas, the frequencies follow the same law as any language, and it keeps reaching for new words right to the last chapter.
