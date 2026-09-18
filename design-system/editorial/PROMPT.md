# Prompt: Apply RVL Editorial System v1.1

Use the RVL Editorial System: Swiss Newsroom Edition. Do not improvise a generic Swiss or newspaper look.

## Objective
Create a reading-first digital intelligence product for Rapid Venture Lab. It should feel like a serious modern newspaper or research journal, not a SaaS dashboard.

## Brand
- Full Rapid Venture Lab horizontal wordmark in the masthead.
- Product name appears as a secondary descriptor.
- RVL green #39B54A is a signal colour, not a large background.
- Dark green #1E7230 is used for accessible links and active text.

## Two-font rule
- Newsreader: headlines, decks, long-form body, before and after narrative.
- Instrument Sans: navigation, tags, dates, metadata, filters, buttons, section headings, data labels.
- Do not add a third font.

## Reading
- Body: 18px desktop, 16 to 17px mobile, line-height at least 1.6.
- Reading measure: 58 to 68ch, target 64 to 66ch.
- Flush-left, ragged-right.
- Never justify long web prose.
- Essential story text stays visible.

## Layout
- Max shell 1280px.
- Desktop: 12-column grid, 20px gap, 32px gutters.
- Story: metadata 2 columns, story 7, analytical rail 3.
- Tablet: 8-column behavior.
- Mobile: one reading flow with 16px gutters.
- Use rules and whitespace instead of card walls.

## Surface
- Paper #FCFCF9 on html, body, masthead and page shell.
- Surface #FFFFFF.
- Ink #171A1F.
- Rule #DEDFDA.
- No gradients on reading surfaces.
- Editorial surfaces: 0px radius.
- Controls: 4px radius.
- No persistent shadows.
- Force light color-scheme for consistent desktop and mobile rendering.

## Live cues
- Small restrained green live dot.
- Text: Updated daily.
- Exact latest update date.
- Tracked-change count.
- 2px green scroll progress line.
- Respect reduced motion.
- No ticker, bounce, parallax or noisy animation.

## Story anatomy
Type, date, layer, change type, impact, headline, why it matters, what changed, before, after, what to learn, cloud primitives, sources.

## Historical baseline
- Archive begins with ChatGPT public launch on 30 November 2022.
- Add only architecture-changing milestones, not every vendor launch.
- Historical milestones and current signals are visibly distinguished.

## Direction and velocity
For each AI layer show:
- Past
- Now
- Direction hypothesis
- Change velocity proxy

Velocity proxy:
- Curated events from trailing 36 months.
- Impact weights: Disruptive 4, Step-change 3, Incremental 1, Packaging / distribution 0.5.
- Recency weights: <=12m 1.0, 13 to 24m 0.65, 25 to 36m 0.35.
- Normalize against the highest layer.
- Always state that this is a relative proxy based on the archive, not a market-growth statistic.

## Mental model
Explain all labels in plain language.

Five AI layers:
- Data & Knowledge: information AI can use.
- Model: raw language, reasoning, coding, vision and audio capability.
- Agent & Infrastructure: tools, state, memory, orchestration, permissions and action runtime.
- Application & Workflow: user experience and business process.
- Production & Business: evals, monitoring, governance, cost, risk, reliability and value.

Cloud primitives:
- Compute: where it runs.
- Networking: how it connects.
- Storage: where data and state live.
- Security: who or what is allowed access.

Impact:
- Disruptive: changes what is practical to build or resets major assumptions.
- Step-change: clear jump that changes architecture decisions without resetting the whole market.
- Incremental: meaningful improvement to the same basic approach.
- Packaging / distribution: existing capability becomes easier, cheaper, more integrated or more available.

## Architecture atlas
Do not use a tiny table. For each AI layer show its description and four readable primitive columns with plain-language explanations. Cells may filter the archive.

## Filters
Use a semantic form:
- Search
- AI layer
- Impact
- Type
- Primary button: Search
- Secondary button: Reset
- Enter submits.

## Footer
Include:
- Rapid Venture Lab website
- LinkedIn
- GitHub
- public-source/editorial-assessment disclaimer

Do not show a Sponsor CTA unless GitHub Sponsors has been intentionally configured.

## Accessibility
- WCAG 2.2 AA target.
- 4.5:1 normal text contrast.
- Visible keyboard focus.
- 200% resize without loss.
- Body 16px minimum.
- Long prose leading 1.5 minimum.
- Native buttons and form controls.
- Sticky masthead must not cover anchors.

## QA before publish
Test:
- syntax and data validation
- no em dashes in user-facing copy
- only two font families
- desktop 1440, tablet 1024, mobile 390
- same paper background desktop and mobile
- Search, Enter, Reset
- all filters
- milestone timeline navigation
- architecture filtering
- source links
- focus states
- result count
- no console errors
- no page-wide horizontal overflow
- current CSS and JS cache versions

Publish a coherent feature pass as one release commit where possible.