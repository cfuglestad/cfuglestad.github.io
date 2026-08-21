---
title: "Clinical Guideline Q&A"
description: "A RAG system that answers clinical questions using published practice guidelines. Retrieves relevant sections via semantic search, generates cited answers with a LangGraph agent, and abstains when evidence is insufficient."
category: "case-study"
tags: ["Python", "RAG", "LangGraph", "ChromaDB", "NLP", "Healthcare", "Evaluation"]
status: "complete"
featured: true
github: "https://github.com/cfuglestad/clinical-guideline-qanda"
demo: "https://clinical-guideline-qanda.streamlit.app/"
date: 2026-08-01
---

## What it does

Given a clinical question, the system retrieves the most relevant sections from ingested practice guidelines, assesses retrieval confidence, and either generates a cited answer or explicitly abstains. The target use case is quick reference against published recommendations (screening intervals, treatment thresholds, risk factors) without replacing clinical judgment.

The system currently runs against a USPSTF hypertension screening guideline. Adding more guidelines is a matter of dropping PDFs or text files into the data directory.

## Architecture

The pipeline is a LangGraph state machine with four nodes:

1. **Retrieve** queries the ChromaDB vector store for the top-k most similar chunks.
2. **Assess** computes retrieval confidence from the top similarity score.
3. **Generate** (conditional) builds a context window from retrieved chunks and prompts gpt-4o-mini to answer with [N] citation notation.
4. **Abstain** (conditional) returns an explicit refusal when confidence falls below threshold.

Conditional routing between Generate and Abstain is declared in the graph definition. The agent never hallucinates an answer when retrieval quality is poor.

## Ingestion pipeline

Documents (PDF or plain text) go through a section-aware chunker that detects headings via regex patterns (ALL CAPS lines, numbered sections, clinical keywords). The chunker splits on section boundaries first, then applies sentence-level splitting with configurable overlap for sections that exceed the token budget. Chunks carry metadata (heading, source file, page numbers) that flows through to citations.

ChromaDB handles embedding internally using its built-in ONNX model (all-MiniLM-L6-v2). No PyTorch or GPU required.

## Evaluation

A labeled dataset of 12 question-answer pairs (4 easy, 4 medium, 4 hard) with annotated relevant sections measures retrieval quality:

| Retrieval method | Precision@5 | Recall@5 | MRR |
| --- | ---: | ---: | ---: |
| Keyword baseline | 0.233 | 1.000 | 0.875 |
| Semantic (ONNX) | TBD | TBD | TBD |

The evaluation framework reports metrics stratified by difficulty level and identifies which questions miss their target sections.

## Engineering decisions

- Zero-cost deployment. ChromaDB ONNX embeddings run locally. Generation uses gpt-4o-mini (fractions of a cent per question). No GPU, no paid embedding API.
- Explicit abstention over hallucination. The agent refuses to answer rather than guess. Confidence threshold is configurable.
- Auto-ingest on startup. The Streamlit app detects an empty vector store and ingests from `data/sample/` automatically. No CLI step needed for deployment.
- Strict typing throughout. MyPy strict mode, frozen dataclasses, Protocol-based DI in the retrieval layer.

## Tech stack

Python 3.11+, LangGraph, LangChain, ChromaDB (ONNX embeddings), OpenAI (gpt-4o-mini), Streamlit, pypdf, pytest, Ruff, MyPy, GitHub Actions CI.

## What I learned

The most useful part of this project was building the evaluation framework before the generation layer. Having labeled Q&A pairs with section annotations meant I could measure whether retrieval improvements actually helped before paying for LLM calls. The abstention mechanism was straightforward to implement but required careful threshold calibration: too aggressive and useful questions get refused, too permissive and low-confidence answers slip through.

The chunker's heading detection taught me how messy real clinical documents are. USPSTF guidelines follow a predictable structure, but the numbered subsection regex needed to capture the full heading line (not just the prefix) to produce usable chunk metadata.
