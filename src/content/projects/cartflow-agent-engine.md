---
title: CartFlow, a multi-agent commerce concierge
slug: cartflow-agent-engine
summary: A multi-agent shopping assistant using Gemini, MCP servers, and Shopify checkout, with human approval for risky discounts.
industry: e-commerce (hackathon project)
category: AI/LLM
year: 2026
role: Engineer, agent architecture & integrations
problem: Conversational shopping assistants either can't act (no real cart or checkout) or act without limits, for example by offering discounts that erode margin. The goal was an agent that completes real purchases while keeping a human in control of risky decisions.
solution: Four cooperating agents talk over an agent-to-agent (A2A) protocol with Pydantic message schemas. A Gemini 2.5 Flash concierge handles intent and coordination. A discovery agent searches the catalog through a Bloomreach Loomi MCP server. A retention agent prices loyalty-aware offers from profile and click-stream signals. A checkout agent builds live Shopify Storefront carts through GraphQL. Discounts above 20%, and bundles, pause for approval in a Streamlit manager console.
stack: [Python, Google Gemini (Vertex AI), Model Context Protocol, A2A, Shopify Storefront GraphQL, Bloomreach Loomi, Streamlit, SQLite, Pydantic, pytest]
outcome: The full loop works against a live Shopify dev store, from click-stream signal to agent reasoning to a one-click checkout link. Margin guardrails are enforced, every approval is audited, and conversation memory carries over between sessions. End-to-end tests cover the multi-agent flow.
featured: true
order: 2
confidential: false
resumeBullets:
  - "Built a multi-agent commerce concierge: Gemini-powered agents coordinate over an agent-to-agent (A2A) protocol and reach the catalog, storefront, and customer data through MCP servers."
  - "Generated live Shopify checkout links through the Storefront GraphQL API, with human-in-the-loop approval in a Streamlit console for discounts above 20% and for bundles."
  - "Closed the loop with click-stream signals and persistent memory, and covered the multi-agent flow with end-to-end tests."
---

## Closed-loop architecture

1. **Signal detection.** Click-stream telemetry captures product views, dwell time, cart adds, and price hesitation.
2. **Multi-agent reasoning.** The concierge coordinates the discovery agent (catalog via MCP) and the retention agent (margin rules and loyalty tiers).
3. **Action.** Discounts up to 20% generate a one-click Shopify checkout link. Anything larger, or any bundle, creates a `PENDING` request in the human-in-the-loop queue.
4. **Learning.** Purchases, approvals, and chat turns write back to persistent memory to personalize the next session.

Each external system is wrapped as its own MCP server (catalog, storefront, profile/margin
store), so any of them can be swapped without touching agent logic.
