---
title: "Doc Drift Analyzer"
description: "A document comparison tool that aligns sections between document versions, classifies changes by severity, and renders word-level inline diffs. Supports lexical, semantic (local embeddings), and hybrid similarity backends with reproducible evaluation."
category: "case-study"
tags: ["Python", "NLP", "Streamlit", "Semantic Similarity", "sentence-transformers", "Evaluation"]
status: "complete"
featured: true
github: "https://github.com/cfuglestad/doc-drift-analyzer"
date: 2026-06-01
---

## What it does

Doc Drift Analyzer compares two versions of a document (TXT, PDF, or DOCX) and surfaces meaningful structural and textual changes. Rather than noisy line-by-line diffs, it aligns sections by similarity, classifies each change, and renders word-level highlighting in an interactive Streamlit interface.

The target use case is reviewing policies, procedures, contracts, and clinical guidelines where the meaning and location of changes matter more than raw line edits.

## How it works

1. Extract text from uploaded files (PDF via pypdf, DOCX via python-docx)
2. Split each document into titled sections using rule-based heading detection
3. Align sections between old and new versions using a configurable similarity backend
4. Classify each pair as added, removed, unchanged, minor edit, or major edit
5. Render word-level insertion/deletion/replacement highlighting
6. Summarize aggregate change metrics and generate bullet-point key changes

## Similarity backends

The architecture uses Protocol-based dependency injection to swap similarity scoring without changing alignment or presentation logic:

- **Lexical** (default): `difflib` sequence matching. Deterministic, fast, no model needed.
- **Semantic**: Local sentence embeddings via `all-MiniLM-L6-v2`. Better recall on rewrite-heavy documents where wording changes but meaning stays.
- **Hybrid**: 50/50 blend of both. Tested but didn't outperform pure semantic.

All inference runs locally. Document text is never sent to an external API.

## Evaluation

A labeled dataset of 5 document pairs with explicit alignment annotations (matched, added, removed, ambiguous, split, merged) supports reproducible benchmarking:

| Backend | Precision | Recall | F1 |
| --- | ---: | ---: | ---: |
| Lexical | 1.000 | 0.571 | 0.727 |
| Semantic | 0.875 | 1.000 | 0.933 |
| Hybrid | 0.875 | 1.000 | 0.933 |

These results are directional (small dataset), but they demonstrate the evaluation methodology and show where semantic similarity outperforms lexical matching.

## Engineering decisions

- **Protocol-based DI over inheritance.** SimilarityBackend is a Protocol; backends are swappable without subclassing. This keeps alignment logic testable regardless of which scorer is active.
- **Strict typing throughout.** MyPy strict mode, frozen dataclasses for domain models, no Any types in the core pipeline.
- **80% branch coverage floor** enforced in CI. 16 test modules covering extraction, sectioning, alignment, diffing, summarization, and the Streamlit app.
- **Observable fallback.** If semantic initialization fails, the system falls back to lexical with an explicit warning. Evaluation mode uses strict (no fallback) so failures are visible.

## Tech stack

Python 3.12, Streamlit, sentence-transformers (optional), pypdf, python-docx, pytest, Ruff, Black, MyPy, GitHub Actions CI.

## What I learned

This project taught me how to structure an NLP application with multiple backends behind a common interface, how to build a reproducible evaluation pipeline with labeled data, and how to balance engineering rigor (typing, testing, DI) with shipping something useful. The main technical challenge was aligning sections when headings change or content moves between sections.
