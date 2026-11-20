---
title: Ask My Docs, production-style RAG with enforced citations
slug: ask-my-docs
summary: RAG over the Kubernetes docs where every sentence cites its source, citations are validated, and CI fails if quality drops.
industry: developer tools / documentation search
category: AI/LLM
year: 2026
role: Sole engineer
problem: Most RAG demos sound confident but can't prove where an answer came from, quietly hallucinate citations, and have no way to tell whether a change made retrieval better or worse. Documentation assistants need answers that are verifiable, honest about what they don't know, and measured on every change.
solution: "Structure-aware chunking (a chunk never crosses a heading) feeds a Qdrant collection that holds both dense (bge-small) and BM25 vectors. Queries run hybrid retrieval with Reciprocal Rank Fusion, then a cross-encoder reranker. A confidence gate refuses off-topic questions before any LLM call. Claude returns answers as structured output: claims, each tied to chunk IDs. A citation validator checks that every cited ID was retrieved and supports its claim, retries once with feedback, and otherwise answers \"I don't know\". The system is exposed through a FastAPI endpoint, a Streamlit UI, and an MCP server so coding agents can use it as a tool."
stack: [Python, Claude API, Qdrant, FastAPI, Streamlit, MCP, BM25 + dense retrieval, Cross-encoder reranking, Pydantic, Docker, GitHub Actions, uv]
outcome: "On a 51-question golden set: passage-level Recall@5 rose from 0.87 to 0.96 with reranking, and end-to-end scores were 1.00 faithfulness, 0.99 citation accuracy, 45/45 answerable questions answered, and 6/6 out-of-scope questions refused, at about $0.0003 per query. CI fails any pull request that drops a metric below its threshold, and authenticates with OIDC instead of a stored API key."
featured: true
order: 0
cover: /images/projects/ask-my-docs-ui.webp
coverAlt: "Ask My Docs interface showing a cited answer about Kubernetes Jobs, with validated citations, confidence score, latency, and the retrieved document chunks"
links:
  repo: https://github.com/siri-dhillon/ask-my-docs
confidential: false
resumeBullets:
  - "Built a production-style RAG system over the Kubernetes docs: structure-aware chunking, hybrid BM25 + dense retrieval in Qdrant fused with RRF, and cross-encoder reranking (Recall@5 0.87 → 0.96)."
  - "Enforced citations with Claude structured outputs and a validator that rejects unsupported or hallucinated chunk IDs, retries with feedback, then refuses; scored 1.00 faithfulness and 0.99 citation accuracy, at ~$0.0003 per query."
  - "Gated CI on a 51-question golden eval (passage-level recall, LLM-judge answer quality) with keyless OIDC auth, and exposed the system via FastAPI, Streamlit, and an MCP server."
---

## Retrieval results (passage level)

A hit only counts if the retrieved chunk contains the answer evidence, not just the right page.

| Mode | Recall@1 | Recall@5 | MRR@10 | p50 latency |
|---|---|---|---|---|
| Vector only (bge-small) | 0.533 | 0.844 | 0.692 | 3 ms |
| Hybrid (BM25 + dense, RRF) | 0.533 | 0.867 | 0.707 | 14 ms |
| **Hybrid + rerank (bge-reranker-base)** | **0.667** | **0.956** | **0.803** | 1.2 s (CPU) |

## Design decisions

- **Chunk along document structure.** Each chunk stays on one topic and carries its heading breadcrumb into the embedding, which works as free contextual retrieval.
- **One Qdrant collection, two named vectors.** Dense and BM25 live on the same point, so there's one write path and the indexes can't drift apart.
- **RRF instead of summed scores.** BM25 and cosine scores aren't on the same scale, and ranks are. Hybrid search mainly helps by putting more relevant passages in front of the reranker.
- **Citations as structured output, not regex.** The validator is a hard gate. A wrong answer with a citation is worse than "I don't know".
- **Two layers of refusal.** A retrieval-confidence gate costs no tokens, and the LLM's own `answerable` flag catches questions that look on-topic but aren't answered by the docs.
- **Pluggable LLM provider:** Anthropic, OpenAI, Ollama (offline), or a deterministic fake that lets CI run without secrets.

## Honest failure analysis

- The default lexical citation check is too lenient. Two claims cited the wrong (but related) chunk. An optional LLM check closes the gap at the cost of one extra call.
- The reranker wins on average but can demote the best passage for individual queries. Fusing the reranker score with the RRF rank is the next experiment.
- Haiku judging Haiku is probably optimistic, and the confidence threshold was tuned on the same eval set. A stronger judge and a held-out set come next.

*Project idea from Aishwarya Srinivasan's "5 AI Engineer Projects to Build in 2026". The implementation and the extensions (contextual retrieval, structured-output citations, MCP server, passage-level eval) are my own.*
