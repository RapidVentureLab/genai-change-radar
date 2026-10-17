# GenAI Radar writing guide

Every item on the radar follows these rules. The research agent reads this file before it writes, a second model checks each item against it, and `scripts/style-check.mjs` tests the rules that code can test. Items that fail are held for review.

The rules follow Joseph M. Williams, *Style: Lessons in Clarity and Grace*.

## Who we write for

Solution architects and engineering leads who read this between meetings. They know the field. They want to know what changed, whether it affects them, and what to do.

## The core rules

### 1. Make the actor the subject

Start with who did something: a company, a product, a project.

- Before: "Short-term agent memory moved to consumption-based pricing on AgentCore"
- After: "AWS AgentCore now charges for short-term memory by use"

### 2. Make the action the verb

Use a verb where you are tempted to use a noun made from a verb (words ending in -tion, -ment, -ance, -ity).

- Before: "GitHub scheduled Copilot model retirements for November 16"
- After: "GitHub retires several Copilot models on 16 November"
- Before: "provides enforcement of license policy"
- After: "enforces license policy"

### 3. Get to the subject and verb quickly

Put the subject and verb in the first few words of each sentence. Move long qualifiers to the end or into a second sentence.

- Before: "With managed deployment paths through SageMaker JumpStart and HyperPod, AWS now offers Beam."
- After: "AWS now offers Beam through SageMaker JumpStart and HyperPod."

### 4. Put familiar information first and new information last

Start a sentence with something the reader already knows. End with the new or important part, because the end of a sentence carries the stress.

- Before: "A 1M-token context window and an Apache 2.0 license come with Beam."
- After: "Beam comes with a 1M-token context window and an Apache 2.0 license."

### 5. Cut what adds nothing

Remove words that restate, hedge without reason, or announce what you are about to say.

- Cut: "It is worth noting that", "In order to", "basically", "very", "significant" (unless you give the number).
- Before: "This represents a meaningful step that gives teams an additional option"
- After: "Teams get another option"

### 6. Use plain words

Prefer the short, common word.

| Instead of | Write |
|---|---|
| utilize | use |
| leverage | use |
| facilitate | help |
| enable teams to | let teams |
| in the event that | if |
| a number of | several, or the number |

## House rules

These apply on top of Williams.

- No em dashes. Use a full stop, a comma or "and". En dashes are fine only in number and date ranges with no spaces ("12–17 Oct").
- No contrast framing of the form "it's X, not Y" or "X rather than Y" used for effect. Say what the thing is.
- No marketing or hype words. Banned: revolutionary, game-changing, game changer, groundbreaking, cutting-edge, unlock, unleash, supercharge, seamless, seamlessly, robust, transformative, paradigm, landscape, delve, empower, next-generation, best-in-class, world-class, powerful, exciting.
- No exclamation marks.
- Write dates as "16 November" or "16 Nov".
- Use the vendor's exact product name the first time.
- Never state a fact the sources do not support. Treat vendor benchmark claims as claims, and say so.

## Field by field

| Field | Purpose | Limit |
|---|---|---|
| title | Who did what. Starts with the actor, then a present-tense verb. | 14 words, 90 characters |
| whatChanged | The facts of the change, with names, versions, dates and regions. | 60 words |
| whyCare | Why an architect should care, in one or two sentences. Address the reader as "you" or "teams". | 45 words |
| before | How things worked before this change. | 35 words |
| after | How things work now. | 35 words |
| learn | What to do next. Start each sentence with a verb: "Test", "Check", "Plan", "Compare". | 45 words |
| architectureImplication | What this changes in a system design. | 45 words |
| changeType | A short label, lower case. | 5 words |

## Examples

**Title**

- Before: "Beam adds an Apache-licensed long-context coding model with managed AWS deployment paths"
- After: "Reflection releases Beam, an open coding model you can run on AWS"

**whyCare**

- Before: "This gives teams another route to run and customize an open-weight model for coding agents and long-horizon tasks inside their own infrastructure."
- After: "You can now run a coding model for agents inside your own AWS account, under a license that allows commercial use."

**learn**

- Before: "Teams should consider evaluating Beam against alternatives and sizing for total weight memory."
- After: "Test Beam on your own agent tasks before you trust its benchmarks. Plan memory for all 501B parameters. Check which regions offer it."

## Adding to this guide

When a reviewer corrects an item by hand, add the before and after here as a new example. The guide improves each time someone fixes a miss.
