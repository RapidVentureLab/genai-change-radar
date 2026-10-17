// Milestone candidates: list them for the monthly review, then apply the review's decisions.
//
// Usage:
//   node scripts/candidates.mjs list <out.json>
//       Writes the candidates still being watched, for the review agent to read.
//       Prints the number of candidates. Exit 0 either way.
//
//   node scripts/candidates.mjs apply <review.json> [--summary <summary.md>] [--today YYYY-MM-DD]
//       Applies the review's decisions to updates.json.
//       promote: becomes a milestone, but only if all four tests pass with evidence.
//       watch:   stays a candidate.
//       drop:    stops being a candidate and stays a normal item.
//       Candidates flagged more than 90 days ago that are not promoted are dropped as expired.
//
// The review file looks like this:
// {
//   "reviewedOn": "2026-11-01",
//   "decisions": [
//     {
//       "id": "2026-10-08-google-gemini-work-agent",
//       "decision": "promote" | "watch" | "drop",
//       "tests": {
//         "datedEvent":      { "pass": true, "evidence": "..." },
//         "primarySource":   { "pass": true, "evidence": "..." },
//         "designChoice":    { "pass": true, "evidence": "..." },
//         "firstOrDefining": { "pass": true, "evidence": "..." }
//       },
//       "evidenceUrls": ["https://..."],
//       "summary": "One or two sentences for the pull request."
//     }
//   ]
// }
import fs from "node:fs";

const DATA = "updates.json";
const TESTS = ["datedEvent", "primarySource", "designChoice", "firstOrDefining"];
const EXPIRY_DAYS = 90;

const [cmd, file, ...rest] = process.argv.slice(2);
const opt = (name) => {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] : null;
};

const db = JSON.parse(fs.readFileSync(DATA, "utf8"));
const watching = () => db.updates.filter((x) => x.candidate && x.candidate.status === "watching");

if (cmd === "list") {
  if (!file) throw new Error("Usage: candidates.mjs list <out.json>");
  const list = watching().map((x) => ({
    id: x.id,
    date: x.date,
    layer: x.layer,
    title: x.title,
    whatChanged: x.whatChanged,
    sources: x.sources,
    candidate: x.candidate,
  }));
  fs.writeFileSync(file, JSON.stringify({ candidates: list }, null, 2) + "\n");
  console.log(list.length);
  process.exit(0);
}

if (cmd !== "apply" || !file) {
  console.error("Usage: candidates.mjs list <out.json> | apply <review.json> [--summary <file>] [--today YYYY-MM-DD]");
  process.exit(2);
}

const review = JSON.parse(fs.readFileSync(file, "utf8"));
const today = opt("--today") || review.reviewedOn || new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) throw new Error(`Bad review date: ${today}`);
const byId = new Map(db.updates.map((x) => [x.id, x]));

const promoted = [];
const dropped = [];
const kept = [];
const refused = [];
const ignored = [];

for (const d of review.decisions || []) {
  const item = byId.get(d.id);
  if (!item || !item.candidate || item.candidate.status !== "watching") {
    ignored.push(d.id);
    continue;
  }
  item.candidate.lastReviewed = today;

  if (d.decision === "promote") {
    const failing = TESTS.filter((t) => !(d.tests && d.tests[t] && d.tests[t].pass === true && String(d.tests[t].evidence || "").trim()));
    const urls = (d.evidenceUrls || []).filter((u) => /^https?:\/\//.test(u));
    if (failing.length || !urls.length) {
      refused.push({ id: d.id, title: item.title, why: failing.length ? `tests not shown to pass: ${failing.join(", ")}` : "no evidence links" });
      kept.push(item);
      continue;
    }
    item.kind = "milestone";
    item.verified = today;
    item.short = String(d.short || item.short || item.title.split(" ").slice(0, 3).join(" ")).trim();
    item.candidate.status = "promoted";
    item.candidate.decidedOn = today;
    item.candidate.review = { tests: d.tests, evidenceUrls: urls, summary: d.summary || "" };
    promoted.push({ item, d });
  } else if (d.decision === "drop") {
    item.candidate.status = "dropped";
    item.candidate.decidedOn = today;
    item.candidate.review = { summary: d.summary || "" };
    dropped.push({ item, why: d.summary || "Review found it does not pass the rules." });
  } else {
    kept.push(item);
  }
}

// Expire candidates that have been watched too long without promotion.
const ageDays = (from) => (new Date(today) - new Date(from)) / 86400000;
for (const item of watching()) {
  if (ageDays(item.candidate.flaggedOn) > EXPIRY_DAYS) {
    item.candidate.status = "dropped";
    item.candidate.decidedOn = today;
    item.candidate.review = { summary: `Expired: watched for more than ${EXPIRY_DAYS} days without meeting the rules.` };
    dropped.push({ item, why: "expired after 90 days" });
  }
}

fs.writeFileSync(DATA, JSON.stringify(db, null, 2) + "\n");

const still = watching();
const lines = [];
lines.push(`## Milestone review, ${today}`);
lines.push("");
lines.push(`${promoted.length} promoted, ${dropped.length} dropped, ${still.length} still watching.`);
if (promoted.length) {
  lines.push("", "### Proposed new milestones", "", "Merging this pull request adds these to the history.", "");
  for (const { item, d } of promoted) {
    lines.push(`**${item.title}** (${item.date}, ${item.layer})`);
    if (d.summary) lines.push("", d.summary);
    lines.push("");
    for (const t of TESTS) lines.push(`- ${t}: ${d.tests[t].evidence}`);
    lines.push(`- Evidence: ${(d.evidenceUrls || []).join(" , ")}`, "");
  }
}
if (refused.length) {
  lines.push("", "### Promotions refused by the script", "");
  for (const r of refused) lines.push(`- ${r.title}: ${r.why}. Still watching.`);
}
if (dropped.length) {
  lines.push("", "### Dropped", "");
  for (const { item, why } of dropped) lines.push(`- ${item.title}: ${why}`);
}
if (still.length) {
  lines.push("", "### Still watching", "");
  for (const item of still) lines.push(`- ${item.title} (flagged ${item.candidate.flaggedOn})`);
}
if (ignored.length) lines.push("", `Ignored decisions for unknown or closed ids: ${ignored.join(", ")}`);
const summary = lines.join("\n") + "\n";
console.log(summary);

const summaryPath = opt("--summary");
if (summaryPath) fs.writeFileSync(summaryPath, summary);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${promoted.length + dropped.length > 0}\npromoted=${promoted.length}\n`);
