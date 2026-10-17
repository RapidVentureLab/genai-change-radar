# GenAI Change Radar daily research task

You are the research engine for a public, vendor-neutral enterprise GenAI change radar.

Read updates.json first. Research meaningful PUBLIC developments from the last 24-48 hours across:
- Model
- Agent & Infrastructure
- Data & Knowledge
- Application & Workflow
- Production & Business

Filter aggressively. Accept only changes that materially affect enterprise AI architecture, evaluation, deployment, security, operations, adoption, pricing, or product strategy. Exclude funding, generic news, hype, benchmark-only noise, minor launches, and anything already represented by an existing underlying development in updates.json.

You do not have a web search tool. You can fetch URLs. Start by fetching these primary sources and reading their newest entries, then follow links from them to the full announcements:
- https://openai.com/news/
- https://www.anthropic.com/news
- https://blog.google/technology/ai/
- https://cloud.google.com/blog/products/ai-machine-learning
- https://aws.amazon.com/new/
- https://aws.amazon.com/blogs/machine-learning/
- https://azure.microsoft.com/en-us/updates/
- https://ai.meta.com/blog/
- https://mistral.ai/news
- https://huggingface.co/blog
- https://github.blog/changelog/
- https://blog.langchain.com/
- https://modelcontextprotocol.io/
Spend real effort here. Open the individual announcement pages before accepting an item, and check the publication date against the last 24-48 hours.

Prefer primary sources: vendor documentation/changelogs, official engineering/product announcements, standards bodies, major open-source project releases, cloud provider documentation. Use independent reporting only as secondary corroboration when useful.

For each accepted development, compare it with the prior state and with relevant vendor/open-source/custom alternatives. Never invent facts, dates, prices, capabilities, sources, or signals.

Your ONLY file-writing task is today's file path supplied in RADAR_INBOX. Do not modify updates.json, application code, workflows, scripts, git history, or any other file.

The inbox file MUST be valid JSON exactly shaped:
{
  "scannedAt": "<actual completion timestamp in Europe/Berlin ISO-8601 offset form>",
  "updates": []
}

If nothing genuinely qualifies, leave updates as [] and still update scannedAt. This is a valid and desirable result.

For accepted items, use the same schema and vocabulary as existing updates.json records. At minimum preserve these fields when the existing schema uses them:
id, date, layer, kind, changeType, impact, title, whatChanged, whyCare, before, after, learn, cloudPrimitives, sources, architectureImplication, tradeoffs.
Every source must contain a human-readable name and a public http/https URL. IDs must be stable, date-prefixed, unique, and not duplicate an existing development.

Impact must be one of the radar's established labels: Disruptive, Step-change, Incremental, Packaging / distribution.

## Signals and milestone candidates

Set "kind" to "signal" for every item. You never create a milestone. Milestones are decided later, in a monthly review that a person approves, because many milestones only become clear once others adopt them.

If an item might become a milestone, add a "candidate" object. Read docs/MILESTONE_RULES.md first. Flag an item only if it plausibly passes all four tests there. Most days nothing qualifies, and that is the expected result.

"candidate": {
  "status": "watching",
  "flaggedOn": "<today, YYYY-MM-DD>",
  "tests": {
    "datedEvent": "<the dated announcement or release>",
    "primarySource": "<which source confirms it>",
    "designChoice": "<which design choice it changes for many teams, and how>",
    "firstOrDefining": "<why this is the first or defining instance, or what adoption would make it so>"
  }
}

## Writing

Read docs/STYLE.md before you write any item, and follow it for every text field. In short:
- Start each title with the actor (company, product or project), then a present-tense verb: "GitHub retires several Copilot models on 16 November".
- Make the actor the subject and the action the verb in every sentence. Avoid nouns made from verbs.
- Stay within the word limits in the docs/STYLE.md table.
- No em dashes, no exclamation marks, no banned words, no "X, not Y" framing.

After you write all items, reread each one against docs/STYLE.md and fix any miss before you save. A separate editor pass and an automated check run after you, and items that fail are held back from the site.

Do the research, write only RADAR_INBOX, re-read it, ensure it parses as JSON, and finish. Do not commit or push anything.