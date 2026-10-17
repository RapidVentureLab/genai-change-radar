# RVL Editorial System: Swiss Newsroom Edition

Status: v1.1  
Owner: Rapid Venture Lab  
Purpose: reading-first intelligence products, research radars, market and technology briefings, reports, editorial archives, and public knowledge products.

## 1. Design intent

RVL Editorial combines three disciplines:

1. Swiss and International Typographic structure: grid discipline, asymmetry, flush-left type, restrained colour, precision, and minimal ornament.
2. Newsroom information architecture: strong story hierarchy, vertical reading flow, visible metadata, modular grids, rules, and repeatable story anatomy.
3. Digital reading and accessibility practice: controlled line length, readable body size, generous leading, high contrast, keyboard focus, and responsive reflow.

The result should feel like a serious digital newspaper or research journal, not a SaaS dashboard.

## 2. Non-negotiable principles

### Reading before dashboard density
- Primary unit is a story, not a card.
- Main content reads top to bottom.
- Analytics, filters, maps, and metrics support the reading flow.
- Essential story text stays visible by default.

### Grid is structural
- Desktop: 12 columns.
- Tablet: 8 columns.
- Mobile: 4-column underlying grid with one reading column.
- Major text blocks, rules, metadata rails, and modules align to the grid.
- Grid lines are usually invisible. Alignment reveals the system.

### Flush-left, ragged-right
- Running text is left aligned.
- Do not fully justify web body text.
- Headings default left aligned.

### Restrained colour
- Near-white paper and dark ink dominate.
- RVL green is the signal colour for active states, links, selected filters, live indicators, and charts.
- Bright green is not body text.
- No gradients on reading surfaces.

### Rules before boxes
- Separate stories with whitespace and thin rules.
- Do not wrap every story in a card.
- Boxed components are reserved for tools, controls, matrices, or explicit callouts.

### Two-font system
- Newsreader: editorial headlines, decks, body copy, before and after text.
- Instrument Sans: navigation, metadata, tags, dates, filters, buttons, section headings, data labels.
- Do not add a third font unless a future product requirement proves it is necessary.

## 3. Typography

### Type roles

| Token | Family | Desktop size | Leading | Weight | Use |
|---|---|---:|---:|---:|---|
| display | Newsreader | 56 to 70px | 0.98 to 1.02 | 500 | page lead |
| h1 story | Newsreader | 42 to 52px | 1.04 | 500 | lead story |
| h2 story | Newsreader | 30 to 34px | 1.09 | 500 | archive story |
| deck | Newsreader | 19 to 21px | 1.47 to 1.50 | 400 | why it matters |
| body large | Newsreader | 19px | 1.64 | 400 | lead story |
| body | Newsreader | 18px | 1.62 | 400 | archive story |
| section heading | Instrument Sans | 24 to 30px | 1.15 | 600 | editorial sections |
| interface | Instrument Sans | 13 to 16px | 1.4 to 1.55 | 400 to 650 | controls and support |
| metadata | Instrument Sans | 12px | 1.3 | 700 | dates, layers, impact |

Use rem and clamp where possible so user scaling works.

### Reading measure
- Main story body: 58 to 68ch, target 64 to 66ch.
- Deck: 48 to 58ch.
- Secondary narrow columns: 38 to 50ch.
- Avoid running prose wider than roughly 80 characters.

### Paragraph rhythm
- Paragraph bottom: about 1.15em.
- Semantic story blocks: 2 to 2.5rem.
- Headline to deck: 0.5 to 0.75rem.
- Deck to body: 1.5 to 2rem.

## 4. Layout

### Shell
- Max width: 1280px.
- Desktop gutter: 32px.
- Tablet gutter: 24px.
- Mobile gutter: 16px.
- Grid gap: 20px desktop, 16px tablet and mobile.

### Desktop story anatomy
- Columns 1 to 2: date and metadata rail.
- Columns 3 to 9: story.
- Columns 10 to 12: impact, cloud, and source rail.
- Story prose remains capped near 66ch.

### Tablet
- 8-column behavior.
- Metadata rail: 2 columns.
- Story: 6 columns.
- Right rail moves below story.

### Mobile
- One reading flow.
- Metadata becomes an inline row above headline.
- Before and after stacks.
- No prose horizontal scrolling.
- Dense matrices may scroll independently.

## 5. Spacing

Use a 4px base rhythm:

4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.

Rules:
- Story to story: 48 to 64px plus one rule.
- Major sections: 72 to 96px.
- Controls: 8 to 12px gaps.
- Avoid arbitrary one-off spacing.

## 6. Colour

```
paper        #FCFCF9
surface      #FFFFFF
soft         #F5F5F0
ink          #171A1F
ink-soft     #44484F
muted        #62676F
faint        #858A91
rule         #DEDFDA
rule-strong  #AEB1AC

green        #39B54A
green-dark   #1E7230
green-soft   #EAF7ED
```

Rules:
- html, body, masthead, and page shell use the same paper token.
- Force light colour scheme for consistent desktop and mobile rendering.
- Body copy uses ink.
- Secondary copy uses muted.
- Links use dark green and visible underlines.
- Bright green is for dots, progress, bars, and other non-text signal marks.
- Colour never carries meaning alone.

## 7. Corners, borders, shadows

### Radius
- Editorial surfaces: 0px.
- Controls: 4px.
- Small status: 3px.
- Pills only for compact data when justified.

### Borders
- Default rule: 1px solid rule.
- Major section rule: 2px solid ink.
- Accent rule: 3px solid green, sparingly.

### Shadows
- Default: none.
- Floating overlays only.
- No persistent card shadows.

## 8. Story anatomy

Every tracked change uses this order:

1. Type: Current signal or Historical milestone
2. Date
3. Primary AI layer
4. Change type
5. Impact
6. Headline
7. Why it matters
8. What changed
9. Before
10. After
11. What to learn
12. Cloud primitives
13. Sources

### Lead story
- Latest meaningful update.
- Largest story headline.
- Full story visible.
- Green appears as a signal, not a hero background.

### Archive story
- Metadata rail plus story plus analytical rail.
- Visible by default.
- Separated by whitespace and rules.
- No accordion required.

## 9. Mental model

### Five AI layers

**Data & Knowledge**  
The information the AI can use: documents, databases, retrieval, context, memory, and the systems that keep information current.

**Model**  
The model that performs language, reasoning, coding, vision, or audio tasks.

**Agent & Infrastructure**  
The runtime around the model: tools, state, memory, orchestration, permissions, sandboxes, and the ability to take actions.

**Application & Workflow**  
The user experience and business process where AI is used, from copilots to end-to-end task flows.

**Production & Business**  
Everything needed to run AI responsibly at scale: evals, monitoring, governance, cost, risk, reliability, and measurable business value.

### Four cloud primitives

**Compute**  
Where it runs: inference, agents, application code, indexing, evals, and processing.

**Networking**  
How it connects: traffic between users, models, tools, data sources, APIs, and enterprise systems.

**Storage**  
Where data and state live: documents, databases, vectors, memory, logs, traces, and application state.

**Security**  
Who or what is allowed access: identity, permissions, secrets, isolation, approvals, and audit controls.

### Impact labels

**Disruptive**  
Changes what is practical to build or reshapes the market enough that old assumptions need to be reconsidered.

**Step-change**  
A clear jump in capability, cost, reliability, or usability that changes architecture decisions, but does not reset the whole market.

**Incremental**  
A meaningful improvement to an existing approach. It matters, but the basic architecture and workflow stay mostly the same.

**Packaging / distribution**  
The underlying capability mostly existed already, but it becomes easier, cheaper, more integrated, or available to more teams.

## 10. Direction and velocity

The radar must show history and trajectory, not only latest news.

### Historical baseline
- Start with the public ChatGPT launch on 30 November 2022 as the practical beginning of this archive.
- Add only milestones that changed architectural capability, cost, integration, deployment, workflow, or production practice.
- Vendor launches are not milestones merely because they are new.

### Direction
For each AI layer show:
- Past
- Now
- Direction hypothesis

Direction is explicitly an editorial hypothesis, not a guaranteed end state.

### Velocity proxy
Velocity is not market growth and must never be presented as a scientific measure.

Recommended proxy:
- Use curated archive events from the trailing 36 months.
- Weight impact:
  - Disruptive: 4
  - Step-change: 3
  - Incremental: 1
  - Packaging / distribution: 0.5
- Apply recency:
  - <=12 months: 1.0
  - 13 to 24 months: 0.65
  - 25 to 36 months: 0.35
- Normalize layer scores against the highest layer in the archive.
- Label as High, Medium, Low, or No recent signal.
- Always display the note that this is a relative proxy based on the curated archive.

## 11. Live cues

The product updates daily, so the interface should communicate freshness without looking like a trading terminal.

Required:
- Small live green dot beside Updated daily.
- Exact latest data update date.
- Tracked-change count.
- Thin green scroll-progress rule at the very top.
- Newest story visibly presented first.

Motion:
- One restrained pulse on the live dot.
- Scroll progress reacts to reading position.
- Respect prefers-reduced-motion.
- No ticker, bouncing, parallax, or constant animation.

## 12. Navigation and filters

### Masthead
- Full Rapid Venture Lab horizontal wordmark.
- Product name as secondary descriptor.
- Navigation: Latest, Direction, Archive, Mental model.

### Search form
Required:
- Search input.
- AI layer.
- Impact.
- Type: Current signal or Historical milestone.
- Primary button: Search.
- Secondary button: Reset.

Rules:
- Primary action never says Clear.
- Enter submits the search form.
- Reset restores the full archive.

## 13. Visualization

Use simple editorial visualizations first:
- Impact-weighted velocity bars by AI layer.
- Past to Now to Direction trajectory rows.
- Year-based milestone timeline.
- Thin rules, dots, and bars instead of decorative charts.

Do not add a visualization unless it improves understanding of direction, density, comparison, or timing.

## 14. Architecture atlas

Do not use a tiny spreadsheet-like table.

For each AI layer:
- Layer heading and plain-language description.
- Four larger primitive columns: Compute, Networking, Storage, Security.
- Each primitive contains a full plain-language explanation.
- Clicking a primitive filters the archive.
- On mobile use a two-column primitive layout or stack.

## 15. Contact and ownership

The footer should include:
- Rapid Venture Lab website.
- Rapid Venture Lab LinkedIn.
- GitHub repository.
- Clear statement that sources are public and impact/direction labels are editorial assessments.

A sponsor link is optional and should remain secondary until a GitHub Sponsors profile is configured.

## 16. Accessibility target

Minimum: WCAG 2.2 AA.
- Normal text contrast at least 4.5:1.
- Large text at least 3:1.
- Relevant UI and focus graphics at least 3:1.
- Body at least 16px; 17 to 19px preferred.
- Long prose leading at least 1.5.
- Resize to 200% without loss of content or function.
- Do not disable pinch zoom.
- Visible keyboard focus.
- Sticky masthead must not obscure anchors.
- Semantic heading order.
- Native form controls and buttons where possible.

## 17. Responsive breakpoints

### >= 1200px
12-column story: metadata, story, rail.

### 768 to 1199px
8-column behavior with analysis rail below story.

### < 768px
Single reading flow, 16px gutters, 16 to 17px body, stacked filter form. Only dense analytical components may scroll horizontally.

## 18. Commit and release hygiene

- Do not create one commit per user prompt.
- Group a coherent feature or design pass into one release commit.
- Current working tree contains only active files. Old implementations remain in Git history, not as duplicate live files.
- Do not squash published history merely to make it prettier unless there is a specific maintenance reason.
- Before release: validate syntax, data schema, labels, links, and responsive behavior.

## 19. Research basis

- Swiss National Library: International Style, precision, grid, rational composition, restrained colour, readability.  
  https://www.nb.admin.ch/en/the-international-style-1950-1970
- Swiss Federal Department of Foreign Affairs: Swiss Style, reduction, asymmetry, grids, restrained colour.  
  https://www.aboutswitzerland.eda.admin.ch/en/swiss-style-forever-the-story-of-a-graphic-design-tradition
- Cooper Hewitt: Armin Hofmann and Swiss Style, typography, asymmetry and grid-based design.  
  https://www.cooperhewitt.org/2018/08/05/aharmonyofcontrasts/
- Poynter: newsroom grids as invisible structure, whitespace, multi-column flexibility and readability.  
  https://www.poynter.org/reporting-editing/2003/the-grid-the-structure-of-design/
- The Guardian Design System: editorial grid, typography roles, spacing and colour.  
  https://design.theguardian.com/
- Production Type: Newsreader, designed for on-screen long-form news and publishing.  
  https://productiontype.com/font/newsreader
- Baymard: line length and readability, 50 to 75 character guidance.  
  https://baymard.com/research-articles/line-length-readability
- web.dev: 45 to 75 characters per line and around 66 as a useful target.  
  https://web.dev/learn/design/typography
- U.S. Web Design System: 16px+ body, flush-left, about 66-character target, 1.5+ leading.  
  https://designsystem.digital.gov/components/typography/
- W3C WCAG 2.2: contrast, text spacing, resizing, non-text contrast and focus.  
  https://www.w3.org/TR/WCAG22/
