# What counts as a milestone

A milestone is a past event that changed what architects can build with GenAI, or how they build it. The history view and the "how fast is this moving" trends rest on these items, so each one must pass all four tests below.

## The four tests

1. **It happened on a date.** A public announcement, release or specification with a day you can point to. A gradual trend ("LLMOps emerged") is not a milestone. Trends go in the layer descriptions instead.
2. **A primary source confirms it.** The vendor's own announcement, release notes, paper or specification. News coverage can support it but cannot be the only source.
3. **It changed a design choice for many teams.** At least one of:
   - a new capability that was not available before (for example image input, tool calling, computer use)
   - a new interface or standard that others adopted (for example function calling, MCP)
   - a large shift in cost, speed or access (roughly 5x or more, or a move from closed to open weights at the frontier tier)
   - a pattern becoming the default way most vendors ship (for example managed agent runtimes)
4. **It is the first or the defining instance.** When several vendors ship the same thing, the milestone is the first credible release, or the one that set the pattern others followed. The others can be mentioned in the same item.

## What is not a milestone

- Benchmark gains on their own
- Funding, hiring or partnership news
- A product launch that copies an existing capability without changing cost or access
- Internal company progress that outsiders cannot use or verify

## Layers and examples

| Layer | Typical milestones |
|---|---|
| Model | New capability tier, new modality, reasoning models, open weights reaching the frontier tier, large price drops |
| Data & Knowledge | Long context, retrieval and memory features, structured output, prompt caching |
| Agent & Infrastructure | Tool calling, computer use, agent protocols (MCP, A2A), managed agent runtimes, sandboxes |
| Application & Workflow | Products that changed how people work with AI at scale (chat, coding agents, workplace agents) |
| Production & Business | Evaluation, safety, governance and pricing changes that changed how teams run AI in production |

## Coverage target

The archive should have at least one milestone per layer per half year from 2023 onward, unless nothing in that layer passes the tests above. Any half year with no milestone in a layer is listed in the audit as a gap to check.

## Each milestone records

- the date and the primary source used to confirm it
- `verified`: the date the claim and source were last checked
- the layer it changed most
