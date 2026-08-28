---
title: The Gita Project
summary: A verse-by-verse digital study of the Bhagavad Gita, mapped with a knowledge graph.
category: Study
year: 2026
role: Solo build
status: Complete
stack: [Markdown, Python, Neo4j, spaCy, Plotly]
metrics:
  - { value: "18", label: "chapters" }
  - { value: "700", label: "shlokas" }
  - { value: "3", label: "writeups" }
featured: false
---

The Gita Project is a verse-by-verse digital study of the Bhagavad Gita. All 18 chapters and 700 shlokas (verses) are in place, each with the Sanskrit, a transliteration, a word-by-word gloss, and a translation.

From that edition I built a knowledge graph: every verse, speaker, theme, Sanskrit-grounded concept, and character loaded into Neo4j, with semantic-similarity links between verses that mean the same thing. Three writeups so far:

- **[The shape of the Gita: mapping 700 verses with a knowledge graph]({{ '/writing/the-shape-of-the-gita/' | relative_url }})** looks at where the text's regions are, which verses sit at its centre, and how its three voices each speak a measurably different language.
- **[Building a knowledge graph of the Bhagavad Gita]({{ '/writing/building-a-knowledge-graph-of-the-gita/' | relative_url }})** is the companion on how the graph is made: parsing the verses, wiring in both the English and Sanskrit vocabularies, and keeping every fact traceable to a verse.
- **[The words the Gita repeats: counting its Sanskrit vocabulary]({{ '/writing/the-words-the-gita-repeats/' | relative_url }})** counts the 3,340 Sanskrit terms: where they follow Zipf's law, why most appear only once, and how the count quietly names what the text is about.

The code, the graph ontology, and the analysis notebooks live in the [gita-knowledge-graph folder](https://github.com/koulakhilesh/CodePlayground/tree/main/gita-knowledge-graph) on GitHub.

The edition, the graph, and these three writeups complete the project.
