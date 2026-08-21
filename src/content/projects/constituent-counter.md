---
title: "Constituent Counter"
description: "A recursive descent parser that counts syntactic constituent types in Penn Treebank annotated corpora."
category: "coursework"
course: "LING473 - Computational Linguistics I"
tags: ["Python", "Parsing", "Syntax", "Penn Treebank", "Recursion"]
status: "complete"
featured: false
github: "https://github.com/cfuglestad/computational-linguistics-coursework"
date: 2026-07-01
---

## What it does

This program counts syntactic constituent types (sentences, noun phrases, verb phrases, intransitive VPs, ditransitive VPs) in an annotated corpus. It takes a directory of Penn Treebank files as input and reports how often each constituent type appears across all files.

## Results

| Constituent Type          | Count |
| ------------------------- | ----- |
| Sentences                 | 2,747  |
| Noun Phrases              | 13,141 |
| Verb Phrases              | 7,920  |
| Ditransitive Verb Phrases | 48    |
| Intransitive Verb Phrases | 5,474  |

## Approach

I broke this into three steps:

1. **Tokenize.** A regular expression splits the raw file text into meaningful pieces: open parens, close parens, and words.

2. **Parse.** A recursive function rebuilds the tree structure from the token list. It reads a label after each open paren, collects children until the matching close paren, and recurses for any nested subtrees. The output is nested Python tuples.

3. **Count.** Another recursive function walks the parsed tree, checking labels and incrementing counters. For verb phrases, it inspects immediate children to classify as intransitive (zero NP children) or ditransitive (two NP children).

I chose recursion because trees are inherently recursive data structures. My first attempt used regex to search for strings like `(NP `, but that fell apart when classifying ditransitive and intransitive VPs where you need to inspect the structure around a node, not just match a pattern.

## Design decisions

- **No external libraries.** I found NLTK's `Tree.fromstring()` early in my research and it would have parsed Penn Treebank notation in one line. I chose not to use it because I didn't want to mask the logic behind a library call. The point was to understand how parsing works.
- **Exact label matching.** Tags like `NP-SBJ` are excluded by design. The assignment specified ignoring function tags, so I used exact string equality rather than substring matching.
- **Nested constituents counted at every level.** An NP inside another NP both increment the counter. This follows naturally from recursion and matches the assignment instructions.

## Limitations

- Written specifically for Penn Treebank format. Anything else would error.
- Processes every file in the given directory without filtering by extension, which could cause unexpected behavior on mixed directories.

## What I learned

This was my first time implementing a recursive descent parser from scratch. The key insight was that recursion maps naturally onto tree-structured data: once I stopped trying to use regex to find patterns in flat text and instead rebuilt the tree, the counting logic became straightforward.
