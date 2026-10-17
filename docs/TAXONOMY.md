# Item fields for filtering

Every item carries three fields that drive the site's filters, deadlines and decisions. The allowed values live in [taxonomy.json](taxonomy.json). The research agent must use them, and the schema check holds any item that does not.

## vendors (required, at least one)

Who the change comes from, or which topic it belongs to. Used by the "My stack" filter.

- Use the company whose product changed. Add a second vendor when the change runs on another company's platform (Meta's model on AWS: `["AWS", "Meta"]`).
- Add `Open models` when the item is about open-weight models.
- Add `Open standards` for protocols and shared standards (MCP, A2A, OWASP).
- Add `EU regulation` for EU AI Act dates.
- Use `Other` only when no listed vendor fits. If the same vendor needs `Other` often, add it to the list.

## decisions (optional, up to three)

Which design choices the change gives new evidence on. Used by the "Decisions to revisit" section. Leave it empty when the item does not change a design choice.

## action (optional)

Set it only when readers need to do something because of the change.

```json
"action": { "type": "retirement", "by": "2026-11-16", "what": "Test the replacement models and update model policies." }
```

- `type`: one of the action types in taxonomy.json.
- `by`: the deadline as YYYY-MM-DD, only when a source states it. Never estimate a date.
- `what`: one sentence starting with a verb.

Items with a future `by` date appear in the Deadlines box and the calendar feed.

## short (milestones only)

A timeline label of one to four words, such as `MCP` or `Claude Code`. The monthly review sets it when it promotes a candidate.
