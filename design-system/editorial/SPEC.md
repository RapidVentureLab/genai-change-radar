# RVL Editorial System — Swiss Newsroom Edition

Status: v1.0  
Owner: Rapid Venture Lab  
Purpose: reading-first intelligence products, research radars, market/technology briefings, reports, editorial dashboards, and public knowledge products.

## 1. Design intent

RVL Editorial is not a generic “Swiss-looking” theme. It combines three traditions:

1. **Swiss / International Typographic structure**: grid discipline, asymmetry, flush-left/ragged-right type, restrained colour, precision, and minimal ornament.
2. **Newsroom information architecture**: strong story hierarchy, vertical reading flow, visible metadata, modular grids, rules, and repeatable story anatomy.
3. **Digital reading/accessibility practice**: controlled line length, readable body size, generous leading, high contrast, relative units, keyboard focus, and responsive reflow.

The intended result is a serious digital newspaper/research journal for technology and enterprise-AI intelligence.

## 2. Non-negotiable principles

### Reading before dashboard density
- Primary unit = **story**, not card.
- Main content reads continuously top-to-bottom.
- Analytics, filters, maps, and metrics support the reading flow.
- Essential story content is visible by default, not hidden in accordions.

### Grid is structural
- Desktop: 12 columns.
- Tablet: 8 columns.
- Mobile: 4-column underlying grid / one reading column.
- Major text blocks, rules, metadata rails, and modules align to grid.
- Grid lines are usually invisible; alignment exposes the system.

### Flush-left, ragged-right
- Running text is left aligned.
- Do not fully justify web body text.
- Headings default left aligned.

### Restrained colour
- Paper + ink dominate.
- RVL green is the editorial signal: active filters, links, selected states, section marks, high-value data marks.
- Bright green is not used for normal body text.
- No gradients on reading surfaces.

### Rules before boxes
- Separate stories with whitespace and 1px rules.
- Do not wrap every story in a rounded card.
- Cards only for tools, architecture matrices, compact data modules, or explicit callouts.

### Explicit font roles
- Serif = story reading/editorial voice.
- Sans = navigation, labels, interface, supporting summaries.
- Mono = dates, impact labels, taxonomy, compact data.
- Maximum three font families.

## 3. Typography

### Families
**Newsreader**
- Article headlines, decks, body copy, quotations, before/after narrative.
- Use `font-optical-sizing:auto`.

**Instrument Sans**
- Navigation, filters, section headings, buttons, UI, supporting summaries.

**JetBrains Mono**
- Dates, timestamps, impact/status labels, taxonomy, counts, source labels.
- Never for long paragraphs.

### Type scale

| Token | Family | Size | Leading | Weight | Use |
|---|---|---:|---:|---:|---|
| masthead | Instrument Sans | 14px | 1.2 | 600 | product/nav |
| kicker | JetBrains Mono | 11px | 1.35 | 600 | meta/section labels |
| display | Newsreader | 56px | 1.00 | 500 | page lead |
| h1 | Newsreader | 42px | 1.05 | 500 | major story |
| h2 | Newsreader | 32px | 1.10 | 500 | archive story |
| h3 | Instrument Sans | 22px | 1.20 | 600 | analytical sections |
| deck | Newsreader | 21px | 1.42 | 400 | why-care/deck |
| body-lg | Newsreader | 19px | 1.62 | 400 | lead story |
| body | Newsreader | 18px | 1.62 | 400 | archive story |
| body-sm | Instrument Sans | 14px | 1.55 | 400 | UI/support |
| caption | Instrument Sans | 12px | 1.45 | 400 | caption/helper |
| meta | JetBrains Mono | 10px | 1.4 | 600 | labels |

Implement with rem/clamp where possible so user scaling works.

### Reading measure
- Main story body: 58–68ch, target 64–66ch.
- Deck: 48–58ch.
- Secondary narrow columns: 38–50ch.
- Avoid >80 characters for running prose.

### Paragraph rhythm
- Paragraph bottom: 1.15em.
- Semantic story blocks: 2–2.5rem.
- Headline → deck: 0.5–0.75rem.
- Deck → body: 1.5–2rem.

## 4. Layout

### Shell
- Max width: 1280px.
- Desktop gutter: 32px.
- Tablet gutter: 24px.
- Mobile gutter: 16px.
- Grid gap: 20px desktop, 16px tablet/mobile.

### Desktop story anatomy
- Columns 1–2: date/metadata rail.
- Columns 3–9: story.
- Columns 10–12: impact/cloud/source rail.
- Story prose itself remains capped near 66ch.

### Tablet
- 8 columns.
- Metadata rail 2 columns.
- Story 6 columns.
- Right rail moves below story.

### Mobile
- One reading flow.
- Metadata becomes inline row above headline.
- Before/after stacks.
- No prose horizontal scrolling.
- Architecture/data matrices may scroll independently.

## 5. Spacing tokens

4px base rhythm:

```
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
```

Rules:
- Story-to-story: 48–64px + 1px rule.
- Major sections: 72–96px.
- Controls: 8–12px gaps.
- Avoid arbitrary one-off spacing values.

## 6. Colour

```
paper        #F6F3EC
paper-deep   #EEEAE1
surface      #FFFEFB
ink          #16181D
ink-soft     #3F4450
muted        #62615C
faint        #8B8A84
rule         #D8D5CD
rule-strong  #A8A59D

green        #39B54A  // graphic accent
green-dark   #1E7230  // links/active text
green-soft   #E9F7EC

warning      #9A6610
danger       #B53131
info         #365FB7
```

Rules:
- Body = ink.
- Secondary = muted.
- Links = dark green and visibly underlined.
- Bright green = bars, dots, accent rules, non-text marks.
- Colour never carries meaning alone.

## 7. Corners, borders, shadows

### Radius
```
editorial surface 0px
control           4px
small label       3px
pill              999px only for compact status
```

### Borders
- Default rule: 1px solid rule.
- Major section: 2px solid ink.
- Accent rule: 3px solid green, sparingly.

### Shadows
- Default: none.
- Floating overlays only: restrained shadow.
- No persistent card shadows.

## 8. Story anatomy

Every update is ordered:

1. Date / layer / change type / impact
2. Headline
3. Deck = why it matters
4. What changed
5. Before → After
6. What to learn
7. Cloud primitives
8. Sources

### Lead story
- Latest meaningful update.
- Largest headline.
- Full body visible.
- Green appears as rule/marker, not green hero card.

### Archive story
- Metadata rail + story + analytical rail.
- Visible by default.
- Top/bottom rules and generous space.
- No accordion required.

### Before → After
Desktop:
- two equal columns
- thin dividing rule
- labels in mono
- narrative in Newsreader 16–17px

Mobile:
- stack vertically
- divider becomes horizontal

## 9. Navigation and filters

### Masthead
- Full Rapid Venture Lab horizontal wordmark.
- Product name as secondary descriptor.
- Nav: Latest / Archive / Architecture.
- Updated timestamp on right where space allows.

### Search form
Required:
- Search input
- AI layer
- Impact
- Cloud primitive
- primary button **Search**
- secondary action **Reset**

Rules:
- Primary action must never say Clear.
- Reset is visually secondary.
- Enter in the search input submits.
- Architecture cells may apply filters and scroll/focus Archive.

## 10. Metrics
- Use one compact horizontal issue index.
- Prefer columns + rules over cards.
- Metrics are context, not hero.
- Do not claim rate/velocity until enough baseline exists; use **Building baseline** until then.

## 11. Architecture matrix
The map may behave more like a tool:
- strict square grid
- no shadows
- paper-deep header cells
- green-soft hover/active
- clicking cell filters Archive by layer + primitive
- strong visible keyboard focus

## 12. Accessibility target

Minimum: WCAG 2.2 AA.
- Normal text contrast >= 4.5:1.
- Large text >= 3:1.
- Relevant UI/focus graphics >= 3:1.
- Body >= 16px, 17–19px preferred.
- Long prose leading >= 1.5.
- Survive user text-spacing overrides.
- Resize to 200% without loss of content/function.
- Do not disable pinch zoom.
- Visible keyboard focus.
- Sticky masthead must not obscure targets: use scroll-padding-top.
- Semantic heading order.
- Native form controls and buttons/links.

## 13. Motion

Allowed:
- 120–180ms hover/focus/underline transitions.
- optional subtle result fade.
- smooth scroll unless reduced-motion requested.

Banned:
- staggered card entrance
- pulsing live dots in reading flow
- card lifts
- spring/bounce/parallax

## 14. Core components

### Masthead
Square/quiet, rule-bottom, full RVL lockup.

### Section rule
2px ink top rule + 10px mono kicker + 24–32px heading.

### Story
No card; top/bottom rule and vertical rhythm.

### Status
Mono 10px uppercase; square or 3px radius.

### Source
Underlined text link, never hidden in decorative chip.

### Search/filter
One row desktop, stacked responsive. Search primary, Reset secondary.

### Metric strip
Four columns separated by vertical rules.

### Architecture matrix
Dense boxed component permitted.

## 15. Content rules
- Headlines factual, not clickbait.
- Deck answers “why should I care?”
- What changed describes the actual change.
- Before → After is concrete.
- What to learn names a concept/skill.
- Impact is editorial assessment, visually distinct from vendor claim.
- Sources always visible/clickable.

## 16. Responsive breakpoints

### >= 1200px
12-column story: metadata / story / rail.

### 768–1199px
8-column behavior; analysis rail below story.

### < 768px
Single reading flow; 16px gutters; body 16–17px / 1.6; filter form stacks; only architecture matrix may scroll horizontally.

## 17. Mandatory pre-publish QA

### Readability
- body 58–68ch desktop
- body >=16px, leading >=1.5
- no full justification
- essential story text visible
- sources visible/clickable

### Interaction
- Search button says Search
- Reset says Reset and is secondary
- Enter submits
- each filter works
- combined filters work
- architecture intersections filter correctly
- source links open correctly
- logical Tab order
- visible focus

### Responsive
- test 1440 desktop
- test 1024 tablet
- test 390 mobile
- no prose horizontal overflow
- architecture-only horizontal scroll acceptable

### Technical
- no JS console errors
- updates.json loads
- result count matches
- current CSS/JS cache version
- no unexpected 404s
- valid heading/form labeling

## 18. Research basis

This system uses documented principles instead of treating “Swiss” as a visual mood:

- Swiss National Library, International Style: precision, typographic grid, sans-serif type, rational composition, restrained colour, readability.  
  https://www.nb.admin.ch/en/the-international-style-1950-1970
- Swiss Federal Department of Foreign Affairs, Swiss Style: reduction to essentials, restrained colour, sans serif, asymmetry and Zurich grid tradition.  
  https://www.aboutswitzerland.eda.admin.ch/en/swiss-style-forever-the-story-of-a-graphic-design-tradition
- Cooper Hewitt, Armin Hofmann / Swiss Style: typography, asymmetrical layout, grid-based design.  
  https://www.cooperhewitt.org/2018/08/05/aharmonyofcontrasts/
- Poynter, The Grid: news grids as invisible structure; multi-column flexibility, baseline/horizontal grids, whitespace and readability.  
  https://www.poynter.org/reporting-editing/2003/the-grid-the-structure-of-design/
- The Guardian Design System: editorial grid, typography roles, spacing and colour as navigation.  
  https://design.theguardian.com/
- Production Type, Newsreader: serif designed for on-screen long-form news/publishing reading.  
  https://productiontype.com/font/newsreader
- Baymard, Optimal Line Length: 50–75 characters; cites Emil Ruder’s 50–60 CPL recommendation.  
  https://baymard.com/research-articles/line-length-readability
- web.dev Typography: 45–75 CPL single-column; ~66 target; relative ch measure.  
  https://web.dev/learn/design/typography
- U.S. Web Design System typography: 16px+ body, flush-left, ~66-character target, 1.5+ leading for long text.  
  https://designsystem.digital.gov/components/typography/
- W3C WCAG 2.2: contrast, resizing, text spacing, non-text contrast and focus.  
  https://www.w3.org/TR/WCAG22/
