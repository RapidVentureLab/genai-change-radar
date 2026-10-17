# History audit, 17 October 2026

This audit checks the 26 milestones that make up the radar's history. It asks three questions: is each one true, is each one a real milestone, and what is missing.

## Summary

- **24 of 26 dates are correct.** I opened every source. 22 source pages state the event date directly. For GPT-6 Astra and GPT-6 Sol and Luna, the OpenAI pages show no date, so I confirmed the date through news coverage. The other 2 items are trends with no real event date (see "Remove").
- **1 source needs fixing.** The GPT-4 item claims image input, but its source page does not mention it. OpenAI's research page does.
- **3 items are not milestones** and should be removed from the history. Two are trends with made-up dates, and one is internal progress that nobody outside OpenAI can use or verify.
- **6 items are real but too small for the history.** They should stay on the radar as normal items (signals) and leave the timeline.
- **There is a 10-month hole.** Nothing is recorded between May 2025 and April 2026. I found 14 candidate milestones to add, 5 of them in that window.
- **After these changes**, the history goes from 26 to 31 items and is spread more evenly across years and layers. Some gaps remain, listed at the end.

Rules used for every decision: [MILESTONE_RULES.md](MILESTONE_RULES.md).

## How I checked

For each milestone I opened the source page and checked two things: the publication date, and whether the page supports the claim in the title. Where the page had no date, I checked news coverage. For candidate additions, I used primary sources where I could reach them and marked the rest as "to confirm".

## Results for the 26 existing milestones

### Keep (17)

| Date | Milestone | Result | Note |
|---|---|---|---|
| 2022-11-30 | ChatGPT put conversational AI in a public product | Confirmed | |
| 2023-03-14 | GPT-4 raised the capability ceiling and added image input | Confirmed, **fix source** | Current source does not mention image input. Use openai.com/index/gpt-4-research/, which does. |
| 2023-06-13 | Function calling made model-to-tool connections more structured | Confirmed | |
| 2024-02-15 | Gemini 1.5 pushed long context to one million tokens | Confirmed | Add "in private preview" to the text. |
| 2024-05-13 | GPT-4o integrated text, vision and audio | Confirmed | |
| 2024-07-23 | Llama 3.1 expanded the open-model option | Confirmed | |
| 2024-09-12 | o1 made test-time reasoning a design choice | Confirmed | |
| 2024-10-22 | Computer use let a model operate graphical software | Confirmed | |
| 2024-11-25 | MCP introduced an open standard for tools and data | Confirmed | |
| 2025-01-20 | DeepSeek-R1 put pressure on reasoning cost and open access | Confirmed | MIT license and API prices stated on the page. |
| 2025-03-11 | Agent building blocks moved into managed platforms | Confirmed | Responses API, built-in tools, Agents SDK. |
| 2025-04-09 | A2A set a direction for agent-to-agent interoperability | Confirmed | |
| 2025-05-21 | Managed agent runtimes added remote MCP and long-running execution | Confirmed | |
| 2026-05-19 | Persistent agents moved into workplace software | Confirmed, **borderline** | The post covers several updates. Only Gemini Spark is a persistent agent. Keep if you see it as the start of always-on agents at work. |
| 2026-06-09 | Claude Fable 5 raised the bar for long, complex work | Confirmed | |
| 2026-07-20 | Safety evaluation moved from actions to trajectories | Confirmed, **borderline** | One vendor's paper. Keep only if other vendors or standards bodies follow. Recheck in January. |
| 2026-09-03 | GPT-6 Astra pushed into computer use, science, cyber and professional work | Confirmed | Date confirmed through news coverage. The OpenAI page shows only a 29 September update. |

### Remove from the history (3)

| Date | Item | Why |
|---|---|---|
| 2023-05-01 | LLMOps emerged as a production discipline | No event happened on this date. The source is a Microsoft guidance page last updated in April 2025. This is a trend. Move the idea into the Production layer description. |
| 2024-04-01 | GenAIOps expanded production monitoring | Same problem. The source is a guidance page with conflicting dates (2024-11-01, 2024-11-18, 2026-04-01). This is a trend. |
| 2026-09-06 | Automated research became an internal milestone at OpenAI | Internal progress. OpenAI says its measurements are preliminary, and outsiders cannot use or verify it. Fails test 3 and the "not a milestone" list. |

### Move to normal radar items (6)

These are real and dated, but they repeat a pattern that already exists or change cost by less than the 5x threshold.

| Date | Item | Why |
|---|---|---|
| 2026-04-24 | Google Cloud Next 26: one platform to build, govern and scale agents | Managed agent platforms became the norm in 2025. This is Google's version. |
| 2026-09-10 | OpenAI Data agent: business data, analysis and dashboards in one workflow | A product launch in an existing pattern. |
| 2026-09-10 | ChatGPT for financial services | A vertical product launch. |
| 2026-09-22 | GPT-6 Sol and Luna bring newer capability to cheaper tiers | Prices cut by 50%, below the 5x threshold. The page also does not call the improvement "reasoning", so the title overstates it. |
| 2026-09-22 | Claude Opus 5.5 lowers the cost of long-running agent work | About 40% cheaper overall and 60% cheaper cache reads. Below the threshold. The "long-running agent" framing is ours, not the source's. Reword when moved. |
| 2026-10-08 | Google's identity-aware Gemini agent for the workplace | Strong signal for agent identity, but one vendor's product. Promote later if agent identity becomes standard. |

## Candidate milestones to add (14)

"Confirmed" means I checked the date in a primary or official source today. "To confirm" means the date is from my own knowledge and I will check the primary source before adding it.

| Date | Layer | Candidate | Why it qualifies | Status |
|---|---|---|---|---|
| 2023-05-11 | Data & Knowledge | Anthropic expands Claude's context window to 100K tokens | First large jump in usable context for documents | To confirm |
| 2023-07-18 | Model | Meta releases Llama 2 with a commercial license | First strong open-weight model companies could use commercially | To confirm |
| 2023-11-06 | Agent & Infrastructure | OpenAI DevDay: Assistants API, GPT-4 Turbo with 128K context, JSON mode | First managed runtime for assistants with tools, threads and retrieval | To confirm |
| 2024-07-18 | Model | OpenAI releases GPT-4o mini | Large price drop for a capable small model | To confirm |
| 2024-08-01 | Production & Business | EU AI Act enters into force | First broad AI law with rules for GenAI providers and users | To confirm |
| 2024-08-06 | Data & Knowledge | OpenAI Structured Outputs guarantee JSON schema adherence | Made reliable machine-readable output a platform feature | To confirm |
| 2024-08-14 | Data & Knowledge | Anthropic introduces prompt caching | Cut the cost of reusing long context, which changed RAG and agent design | To confirm |
| 2025-02-24 | Application & Workflow | Anthropic launches Claude Code in research preview | Start of terminal-based coding agents | To confirm |
| 2025-05-16 | Application & Workflow | OpenAI launches Codex as a cloud coding agent | Coding agents that work in the cloud on many tasks at once | To confirm |
| 2025-08-02 | Production & Business | EU AI Act obligations for general-purpose AI models apply | Providers of GPAI models must meet transparency and copyright duties | Confirmed (European Commission) |
| 2025-08-05 | Model | OpenAI releases gpt-oss open-weight models | First OpenAI open-weight models since 2019 | Release confirmed, exact date to confirm |
| 2025-08-07 | Model | OpenAI releases GPT-5 | New frontier tier and default model in ChatGPT | To confirm |
| 2025-12-09 | Agent & Infrastructure | Linux Foundation forms the Agentic AI Foundation with MCP, goose and AGENTS.md | Agent standards moved to neutral governance | Confirmed (Linux Foundation) |
| 2025-12-18 | Agent & Infrastructure | Anthropic publishes Agent Skills as an open standard | A shared format for packaging agent know-how | Date from news coverage, to confirm |

## Coverage after these changes

Number of milestones per layer per half year, if you approve all removals, moves and additions.

| Layer | 23 H1 | 23 H2 | 24 H1 | 24 H2 | 25 H1 | 25 H2 | 26 H1 | 26 H2 |
|---|---|---|---|---|---|---|---|---|
| Model | 1 | 1 | 1 | 3 | 1 | 2 | 1 | 1 |
| Data & Knowledge | 1 | 0 | 1 | 2 | 0 | 0 | 0 | 0 |
| Agent & Infrastructure | 1 | 1 | 0 | 2 | 3 | 2 | 0 | 0 |
| Application & Workflow | 0 | 0 | 0 | 0 | 2 | 0 | 1 | 0 |
| Production & Business | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 1 |

### Gaps still to research

- **January to April 2026, all layers.** Search results for this period are mostly low-quality roundup sites. I need to go through vendor release notes month by month.
- **Data & Knowledge after 2024.** Likely candidates: memory features, retrieval and connector standards, context management in agent platforms.
- **Application & Workflow in 2023 and 2024.** Likely candidates: Microsoft 365 Copilot general availability (November 2023), GitHub Copilot Chat, custom GPTs.
- **Production & Business in 2023.** May be a true gap, since few dated production changes happened that early.

Some cells will stay at zero if nothing passes the rules. That is a valid result.

## Decisions for you

1. **Approve the 3 removals and 6 moves?** The moved items stay on the radar as normal items.
2. **Keep or move the 2 borderline items** (persistent workplace agents, trajectory-level safety evaluation)?
3. **Approve the 14 candidates in principle?** I will confirm every "to confirm" date against the primary source before adding it.
4. **Should I research the remaining gaps** before we build the history view, or build with what we have and fill gaps later?

## Outcome (applied 17 October 2026)

Haris approved all changes, kept both borderline items, and asked to fill the gaps before building the history view.

- Removed the 2 trend items. Their idea now sits in the Production layer description.
- Moved 7 items to normal radar items: the 6 above plus OpenAI's automated research post. That post stays as a signal because the Direction section cites it.
- Fixed the GPT-4 source.
- Confirmed every candidate against a primary source. **GPT-4o mini was dropped**: its own page says it was about 60% cheaper than GPT-3.5 Turbo, below the 5x rule.
- Merged two context-management candidates into one milestone (context editing and memory, September 2025, followed by compaction at OpenAI and Anthropic).
- Gap research added 4 more: OWASP Top 10 for LLM Applications (2 August 2023), Microsoft 365 Copilot general availability (1 November 2023), context management (29 September 2025) and the EU AI Act transparency rules (2 August 2026). January to April 2026 was checked against the Anthropic and OpenAI release notes. Nothing in that window passed the rules.
- Every milestone now has a `verified` date. Two carry a `verificationNote` where the date came from news coverage.
- All 34 milestones and every item that failed the style check were rewritten to STYLE.md. Wording only: a script confirmed no id, date, source or rating changed.
- A monthly workflow now reopens every milestone source and fails, with an email, if a link breaks.

**Result: 34 milestones.**

| Layer | 23 H1 | 23 H2 | 24 H1 | 24 H2 | 25 H1 | 25 H2 | 26 H1 | 26 H2 |
|---|---|---|---|---|---|---|---|---|
| Data & Knowledge | 1 | 0 | 1 | 2 | 0 | 1 | 0 | 0 |
| Model | 1 | 1 | 1 | 2 | 1 | 2 | 1 | 1 |
| Agent & Infrastructure | 1 | 1 | 0 | 2 | 3 | 2 | 0 | 0 |
| Application & Workflow | 0 | 1 | 0 | 0 | 2 | 0 | 1 | 0 |
| Production & Business | 0 | 1 | 0 | 1 | 0 | 1 | 0 | 2 |

Plus ChatGPT in November 2022. January to April 2026 was checked in detail. Other empty cells, such as Application & Workflow in 2024, had a lighter check and could still gain items in a later review.

## Follow-ups noted in the original plan

- Add a `verified` date and confirmed source to every milestone.
- Rewrite all milestones and the 20 failing items to the new style guide.
- Add a monthly check to the daily workflow that reopens every milestone source and flags broken links or changed pages.
