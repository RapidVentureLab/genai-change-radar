// Checks radar items against STYLE.md.
//
// Usage:
//   node scripts/style-check.mjs <file.json>          report errors and warnings
//   node scripts/style-check.mjs <file.json> --strict exit 1 if any item has errors
//   node scripts/style-check.mjs <inbox.json> --hold  move items with errors to inbox/held/<name>
//
// <file.json> is an inbox file or updates.json (any JSON with an "updates" array).
// Banned words and field limits are read from STYLE.md, so the guide stays the
// single source of truth. Errors hold an item back. Warnings are reported only.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const style = fs.readFileSync(path.join(root, "STYLE.md"), "utf8");

// Banned words: the "Banned:" line in STYLE.md.
const bannedLine = style.split("\n").find((l) => /Banned:/.test(l));
if (!bannedLine) throw new Error("STYLE.md has no 'Banned:' line");
const banned = bannedLine
  .split("Banned:")[1]
  .replace(/\.\s*$/, "")
  .split(",")
  .map((w) => w.trim().toLowerCase())
  .filter(Boolean);

// Field limits: rows of the "Field by field" table, e.g. "| title | ... | 14 words, 90 characters |".
const limits = {};
for (const line of style.split("\n")) {
  const cells = line.split("|").map((c) => c.trim());
  if (cells.length < 5) continue;
  const [, field, , limit] = cells;
  const words = limit.match(/(\d+)\s*words?/);
  const chars = limit.match(/(\d+)\s*characters?/);
  if (/^[a-zA-Z]+$/.test(field) && (words || chars)) {
    limits[field] = { words: words ? +words[1] : null, chars: chars ? +chars[1] : null };
  }
}
if (!limits.title) throw new Error("Could not read field limits from STYLE.md");

const TEXT_FIELDS = ["title", "whatChanged", "whyCare", "before", "after", "learn", "architectureImplication", "changeType"];

// Words that suggest a title starts with a topic instead of an actor.
const GENERIC_STARTS = new Set(["a", "an", "the", "this", "new", "agent", "agents", "enterprise", "managed", "frontier", "production", "persistent", "long-running", "automated", "vertical", "business", "inference-aware", "ai", "genai", "llms", "models", "model"]);

const words = (s) => s.split(/\s+/).filter(Boolean);
const sentences = (s) => s.split(/(?<=[.?])\s+/).filter((x) => x.trim());

function checkItem(item) {
  const errors = [];
  const warnings = [];

  for (const field of TEXT_FIELDS) {
    const text = item[field];
    if (typeof text !== "string" || !text.trim()) continue;
    const lower = text.toLowerCase();

    if (/—/.test(text) || / – /.test(text) || /\s--\s/.test(text)) errors.push(`${field}: uses a dash as punctuation`);
    if (/!/.test(text)) errors.push(`${field}: uses an exclamation mark`);
    for (const b of banned) {
      const re = new RegExp(`(^|[^a-z])${b.replace(/[-]/g, "[- ]?")}([^a-z]|$)`, "i");
      if (re.test(lower)) errors.push(`${field}: uses banned word "${b}"`);
    }
    if (/\b(it'?s|is|are|was|were)\s+not\s+[^.;]{1,60},\s*(it'?s|but|it is)\b/i.test(text)) errors.push(`${field}: uses "it's not X, it's Y" framing`);
    if (/,\s*not\s+(just\s+|only\s+)?[a-z]/i.test(text)) errors.push(`${field}: uses ", not ..." contrast framing`);
    if (/\bnot (just|only|merely)\b[^.]*\bbut\b/i.test(text)) errors.push(`${field}: uses "not just X but Y" framing`);
    if (/\brather than\b/i.test(text)) warnings.push(`${field}: "rather than" may be contrast framing`);

    const lim = limits[field];
    if (lim) {
      const wc = words(text).length;
      if (lim.words && wc > lim.words) errors.push(`${field}: ${wc} words, limit ${lim.words}`);
      if (lim.chars && text.length > lim.chars) errors.push(`${field}: ${text.length} characters, limit ${lim.chars}`);
    }

    if (field !== "title" && field !== "changeType") {
      for (const s of sentences(text)) {
        const n = words(s).length;
        if (n > 30) warnings.push(`${field}: a sentence has ${n} words`);
        const nouns = words(s).filter((w) => w.replace(/[^a-z]/gi, "").length > 6 && /(tion|tions|ment|ments|ance|ances|ence|ences|ity|ities)[^a-z]*$/i.test(w));
        if (nouns.length >= 3) warnings.push(`${field}: many noun forms (${nouns.slice(0, 4).join(", ")})`);
      }
    }
  }

  if (typeof item.title === "string") {
    const t = words(item.title);
    const first = (t[0] || "").toLowerCase().replace(/[^a-z-]/g, "");
    if (GENERIC_STARTS.has(first)) warnings.push(`title: starts with "${t[0]}". Start with the actor`);
    const early = t.slice(1, 6).map((w) => w.toLowerCase().replace(/[^a-z]/g, ""));
    const hasVerb = early.some((w) => w === "now" || (/^[a-z]{3,}s$/.test(w) && !/(ss|us|is|ics)$/.test(w)));
    if (!hasVerb) warnings.push("title: no present-tense verb near the start");
  }

  return { errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
}

// ---- main ----
const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
if (!file) {
  console.error("Usage: node scripts/style-check.mjs <file.json> [--strict|--hold]");
  process.exit(2);
}
const strict = args.includes("--strict");
const hold = args.includes("--hold");

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const items = data.updates || [];
const results = items.map((item) => ({ item, ...checkItem(item) }));
const failed = results.filter((r) => r.errors.length);
const warned = results.filter((r) => !r.errors.length && r.warnings.length);

const lines = [];
lines.push(`Style check: ${items.length} items, ${items.length - failed.length} pass, ${failed.length} with errors, ${warned.length} with warnings only`);
for (const r of results) {
  if (!r.errors.length && !r.warnings.length) continue;
  lines.push(`\n${r.errors.length ? "FAIL" : "WARN"} ${r.item.id}`);
  lines.push(`  "${r.item.title}"`);
  for (const e of r.errors) lines.push(`  error: ${e}`);
  for (const w of r.warnings) lines.push(`  warning: ${w}`);
}
const report = lines.join("\n");
console.log(report);

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, "### Style check\n\n```\n" + report + "\n```\n");
}

if (hold && failed.length) {
  const heldDir = path.join(path.dirname(file), "held");
  fs.mkdirSync(heldDir, { recursive: true });
  const heldFile = path.join(heldDir, path.basename(file));
  const existing = fs.existsSync(heldFile) ? JSON.parse(fs.readFileSync(heldFile, "utf8")) : { updates: [] };
  for (const r of failed) existing.updates.push({ ...r.item, heldReasons: r.errors });
  fs.writeFileSync(heldFile, JSON.stringify(existing, null, 2) + "\n");
  data.updates = results.filter((r) => !r.errors.length).map((r) => r.item);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`\nHeld ${failed.length} item(s) in ${heldFile}. They will not go live until reviewed.`);
}

if (strict && failed.length) process.exit(1);
