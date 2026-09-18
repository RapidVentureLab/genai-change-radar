# Prompt — Apply RVL Editorial System

Use **RVL Editorial System — Swiss Newsroom Edition**. Do not improvise a generic “Swiss” or “newspaper” look.

## Objective
Create a reading-first digital intelligence/publication interface for Rapid Venture Lab. It should feel like a serious modern newspaper/research journal, not a SaaS dashboard.

## Brand
- Full Rapid Venture Lab horizontal wordmark in masthead.
- RVL green #39B54A is an accent thread, not a background colour.
- Dark green #1E7230 for accessible green text/links.

## Typography
- Editorial serif: Newsreader with optical sizing.
- UI sans: Instrument Sans.
- Metadata mono: JetBrains Mono.
- Body: 18px desktop, 16–17px mobile, line-height 1.62.
- Reading measure: 58–68ch, target 64–66ch.
- Long prose flush-left/ragged-right, never justified.

## Layout
- Max shell 1280px.
- 12-column desktop grid, 20px gaps, 32px gutters.
- Story anatomy: metadata 2 columns / story 7 / analysis rail 3.
- Tablet 8 columns; right rail drops below.
- Mobile single reading flow with 16px gutters.
- Use rules + whitespace to separate stories. Do not card every story.

## Surface
- Paper #F6F3EC; surface #FFFEFB; ink #16181D; secondary #62615C.
- Rule #D8D5CD; bright green graphics only; dark green links.
- Editorial radius 0. Controls max 4px.
- No persistent shadows. No gradients.

## Story anatomy
Date/layer/change type/impact → headline → deck/why-care → what changed → before/after → what to learn → cloud primitives → sources.
Essential story text stays visible by default.

## Filters
Use a semantic form:
- Search input
- AI layer
- Impact
- Cloud primitive
- primary button **Search**
- secondary action **Reset**
Enter submits. Reset clears. Never use Clear as the primary action.

## Interaction and accessibility
- Architecture cells filter the archive.
- Links visibly look like links.
- Visible keyboard focus.
- WCAG 2.2 AA target.
- 4.5:1 normal text contrast; 3:1 large text/relevant non-text.
- 16px minimum body; 1.5+ leading.
- 200% resize without loss.
- Respect reduced motion.

## QA before publish
Test 1440 / 1024 / 390 widths; Search + Enter + Reset; every filter; architecture-to-archive filtering; source links; Tab/focus; console errors; JSON loading; result count; horizontal overflow. Publish only after all pass.