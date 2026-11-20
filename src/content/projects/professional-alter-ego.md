---
title: Professional Alter Ego — an agentic RAG career assistant
slug: professional-alter-ego
summary: A RAG-powered digital twin that answers recruiter questions about my background and pings me about real leads.
industry: personal project (recruiting)
category: AI/LLM
year: 2025
role: Designer & engineer
problem: Static resumes can't answer follow-up questions, and generic chatbots hallucinate dates, degrees, and project roles. I wanted recruiters to get accurate answers instantly and for me to hear about serious interest right away.
solution: A retrieval-augmented agent grounded in my career documents (chunked and embedded into ChromaDB), with a custom GitHub GraphQL tool for live repository data and a Pushover integration that notifies my phone when someone wants to connect. An early live-scraping design was replaced with a persistent vector store after hitting anti-scraping limits.
stack: [Python, LangChain, OpenAI GPT-4o-mini, ChromaDB, Gradio, GitHub GraphQL API, Pushover API]
outcome: Answers stay grounded in retrieved context, with no invented dates or roles in testing, and recruiter interest reaches my phone in seconds.
featured: true
order: 3
links:
  repo: https://github.com/siri-dhillon/professional_you
confidential: false
resumeBullets:
  - "Built a RAG digital twin grounded in my career documents (LangChain, ChromaDB, GPT-4o-mini) that answers recruiter questions accurately, served through a Gradio web app."
  - "Added a GitHub GraphQL tool for live repository data and a Pushover integration that sends recruiter leads to my phone in seconds."
---

## Architecture

**Ingestion.** Career documents are loaded with `PyPDFLoader` and split with
`RecursiveCharacterTextSplitter` (`chunk_size=1000`, `chunk_overlap=150`) so chunks keep
their technical meaning. Embeddings live in a persistent ChromaDB store.

**Grounded answers.** The LLM must answer from retrieved context, which removed the usual
hallucinations about dates, degree details, and project roles.

**Tool use.** A custom GitHub tool calls the GraphQL API to fetch pinned repositories and recent
commits, so questions about current work get live answers.

**Closing the loop.** When a visitor expresses interest, the agent sends a POST to the Pushover
API and I get a push notification for immediate follow-up.

![Phone screenshot of a Pushover notification triggered by the agent](/images/pushover-proof.jpeg)
