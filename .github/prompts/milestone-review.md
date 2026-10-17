# The Daily Model monthly milestone review

You review milestone candidates for The Daily Model. A milestone is a past event that changed what architects can build with GenAI, or how they build it. Your decisions go into a pull request that a person approves, so be strict and show your evidence.

1. Read docs/MILESTONE_RULES.md in full. It defines the four tests every milestone must pass.
2. Read the file named in the REVIEW_INPUT environment variable. It lists every candidate still being watched, with its sources and the reasons it was flagged.
3. For each candidate:
   - Open its sources and confirm the date and the claim.
   - Look for evidence that only appears after the event: other vendors shipping the same thing, a standard being adopted, real price changes, the pattern becoming the default. Fetch vendor blogs, changelogs and documentation directly. You have no search tool.
   - Compare it with the existing milestones in updates.json (items with "kind": "milestone"). If an existing milestone already covers the same development, the answer is "drop".
   - Decide:
     - "promote" only if all four tests pass and you can point to evidence for each.
     - "watch" if it could still qualify but the evidence is not there yet.
     - "drop" if it clearly does not pass, or another milestone already covers it.
   - When in doubt, choose "watch".
4. Write your decisions as valid JSON to the file named in the REVIEW_OUTPUT environment variable, in exactly this shape:

{
  "reviewedOn": "<today, YYYY-MM-DD>",
  "decisions": [
    {
      "id": "<candidate id>",
      "decision": "promote",
      "tests": {
        "datedEvent":      { "pass": true, "evidence": "<one sentence>" },
        "primarySource":   { "pass": true, "evidence": "<one sentence>" },
        "designChoice":    { "pass": true, "evidence": "<one sentence>" },
        "firstOrDefining": { "pass": true, "evidence": "<one sentence>" }
      },
      "evidenceUrls": ["<every URL you used as evidence>"],
      "short": "<for promote only: a timeline label of one to three words, such as MCP or Claude Code>",
      "summary": "<one or two sentences a reviewer can read in the pull request>"
    }
  ]
}

Include one decision for every candidate. Write the evidence and summary in plain language following docs/STYLE.md: actor as subject, action as verb, no em dashes, no hype words.

Never invent a fact, date or URL. Only list URLs you opened. Do not modify any file except REVIEW_OUTPUT. Do not commit or push.
