---
title: "ATS Resume Optimization Pipeline"
description: "A multi-agent resume tailoring system using LangGraph for stateful orchestration, DSPy for prompt optimization, and QLoRA fine-tuning for domain-specific skill extraction. Covers training on free GPUs, remote experiment tracking, and model serving on Databricks."
category: "case-study"
tags: ["Python", "LangGraph", "DSPy", "QLoRA", "MLflow", "LangChain", "Fine-tuning"]
status: "in-progress"
featured: true
github: "https://github.com/cfuglestad/resume-optimization"
date: 2026-07-01
---

## What it does

Given a resume and a target job description, the pipeline extracts skills from both, scores alignment, and iteratively rewrites resume content to improve ATS match rate. The system uses a conditional loop: if the alignment score is below threshold, it tailors and re-scores until convergence or a maximum iteration count.

## Architecture

The pipeline is a LangGraph state machine with three nodes:

1. **Extract** calls a fine-tuned LLM (served via Databricks Model Serving) to pull structured skills from both documents.
2. **Grade** uses a DSPy-compiled scorer to compute alignment between extracted skill sets. DSPy optimizes the scoring prompt algorithmically rather than through manual iteration.
3. **Tailor** rewrites resume sections to close skill gaps identified by the grader. Loops back to Grade until the score exceeds the threshold.

Conditional routing is handled declaratively in the graph definition. Each node is independently testable with no shared mutable state.

## Training pipeline

The skill extraction model is fine-tuned with QLoRA (4-bit quantized LoRA adapters) on a synthetic dataset of 80 resume/job description pairs across 8 professional archetypes. Training runs on a free Colab T4 GPU with experiment tracking streamed to a remote MLflow instance on Databricks.

QLoRA trains only 0.06% of the model's parameters, so the whole thing fits on a free Colab T4. Training data comes from a GPT-4o generator that produces realistic resume/JD pairs with labeled skill extractions (80 examples across 8 archetypes). Experiment metrics stream to a remote MLflow instance on Databricks, so training location and tracking infrastructure are decoupled.

## Tech stack

| Layer | Technology | Role |
| --- | --- | --- |
| Training | PyTorch + QLoRA (PEFT) | Fine-tune open-source LLM for skill extraction |
| MLOps | MLflow + Databricks | Experiment tracking, model registry, serving |
| Prompt optimization | DSPy | Algorithmic prompt compilation |
| Orchestration | LangGraph | Stateful graph execution with conditional routing |
| API abstraction | LangChain | Standardized model interface |
| Demo | Streamlit | Interactive portfolio demo |

## What I learned

This project forced me to understand LangGraph's state machine model at a level deeper than the quickstart tutorials. The conditional loop (grade, check threshold, maybe tailor, loop back) required careful state schema design to avoid stale data between iterations. DSPy's compile-time optimization was the biggest conceptual shift: treating prompts as programs that can be automatically tuned against a metric, rather than manually iterated strings.

The MLOps integration (Colab training with remote MLflow tracking on Databricks) taught me how to separate compute from tracking infrastructure, which matters in production where training and serving live on different systems.
