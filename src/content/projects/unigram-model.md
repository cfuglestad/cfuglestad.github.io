---
title: "Unigram Language Model"
description: "A corpus processing pipeline that strips SGML markup, tokenizes text, and builds a word frequency model."
category: "coursework"
course: "LING473 - Computational Linguistics I"
tags: ["Python", "Language Modeling", "Tokenization", "Corpus Processing", "Regex"]
status: "complete"
featured: false
github: "https://github.com/cfuglestad/computational-linguistics-coursework"
date: 2026-07-15
---

## What it does

This program reads a corpus directory, strips SGML tags from every file, extracts valid words, and outputs a frequency table sorted by descending count then alphabetically. The output is a unigram language model: the simplest possible probability distribution over words in a corpus.

## Approach

The pipeline has a clear sequence:

1. **Read** all files in the given corpus path.
2. **Strip SGML.** A regex removes everything between (and including) `<` and `>` characters.
3. **Split** by whitespace to produce raw tokens.
4. **Filter.** Keep only tokens composed entirely of ASCII letters and the straight apostrophe. Discard any token that starts or ends with an apostrophe.
5. **Normalize.** Lowercase all surviving tokens.
6. **Count and sort.** Build a frequency dictionary, sort alphabetically first, then by descending count (the alphabetic order persists as a tiebreaker through Python's stable sort).

## Design decisions

- **Standard library only.** Like Project 1, no external dependencies. The regex, file I/O, and sorting are all built-in.
- **Explicit ASCII apostrophe handling.** The assignment specified the straight apostrophe (`\x27`) specifically. I used the hex literal to be unambiguous about which character I was matching, since curly quotes and straight apostrophes look identical in some editors.
- **Two-pass sorting.** I sort alphabetically first, then by frequency. Python's `sorted()` is stable, so alphabetical order is preserved among ties. This avoids writing a complex key function.

## Limitations

- Assumes UTF-8 encoding (Python's default for `open()`). Files in other encodings would error.
- Trusts that SGML tags are well-formed. A malformed `<` without a matching `>` could consume the rest of the file.

## What I learned

This was foundational work in corpus preprocessing: the boring-but-critical pipeline that sits underneath any language model. The main takeaway was how many decisions go into "just tokenize the text": what counts as a word boundary, how to handle punctuation attached to words, whether to preserve case, how to define the vocabulary. Every choice changes the resulting probability distribution.
