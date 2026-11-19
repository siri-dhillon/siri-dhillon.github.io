---
# PLACEHOLDER project — replace every field with a real engagement, or delete this file.
title: RAG knowledge assistant for internal policies
slug: rag-knowledge-assistant
summary: "PLACEHOLDER — An LLM assistant that answers staff questions from 10k+ internal documents, with citations."
industry: professional services firm
category: AI/LLM
year: 2025
role: Lead engineer (solo)
problem: "PLACEHOLDER — Consultants spent hours searching scattered policy PDFs, wikis, and past proposals. Answers were inconsistent and slow, and new hires had no single source of truth."
solution: "PLACEHOLDER — Built a retrieval-augmented assistant: document ingestion and chunking, hybrid vector + keyword search, citation-grounded answers, role-based access, and an evaluation harness to track answer quality before each release."
stack: [Python, FastAPI, LangChain, OpenAI API, pgvector, React, AWS]
outcome: "PLACEHOLDER — Cut average lookup time from ~20 minutes to under 1 minute; 80% weekly active usage within two months."
featured: true
order: 1
confidential: true
---

## Approach

PLACEHOLDER — Optional long-form case study. Anything you write below the front matter
appears on this project's page under "Deep dive". Use normal Markdown: headings, lists,
code blocks, images (`![alt](/images/projects/your-image.png)`).

- Discovery workshops with stakeholders to map the top 50 questions
- Ingestion pipeline with document versioning and permission tags
- Offline evaluation set of 200 real questions, scored on every change
