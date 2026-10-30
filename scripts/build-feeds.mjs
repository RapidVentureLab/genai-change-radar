// Builds the files the website and readers subscribe to:
//   feed.xml       RSS feed of the latest items
//   deadlines.ics  calendar feed of items with an action deadline
//   status.json    last scan time, today's counts and held items, for the site's status line
//
// Usage: node scripts/build-feeds.mjs [--site https://example.com/path/]
// Runs in the daily workflow after the merge. No dependencies.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2);
const siteArg = args.indexOf("--site");
const SITE = (siteArg >= 0 ? args[siteArg + 1] : "https://thedailymodel.rapidventurelab.com/").replace(/\/?$/, "/");
const NAME = "The Daily Model";

const db = JSON.parse(fs.readFileSync(path.join(root, "updates.json"), "utf8"));
const items = [...db.updates].sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const link = (x) => `${SITE}#item-${encodeURIComponent(x.id)}`;

// ---- RSS ----
const rssItems = items.slice(0, 50).map((x) => {
  const desc = [x.whyCare, x.learn ? `What to do: ${x.learn}` : ""].filter(Boolean).join(" ");
  const cats = [x.layer, ...(x.vendors || [])].map((c) => `      <category>${esc(c)}</category>`).join("\n");
  return `    <item>
      <title>${esc(x.title)}</title>
      <link>${esc(link(x))}</link>
      <guid isPermaLink="false">${esc(x.id)}</guid>
      <pubDate>${new Date(x.date + "T06:00:00Z").toUTCString()}</pubDate>
      <description>${esc(desc)}</description>
${cats}
    </item>`;
});
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${NAME}</title>
    <link>${SITE}</link>
    <description>What changed in GenAI, and what it means for the systems you design.</description>
    <language>en</language>
    <copyright>Stories licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Credit The Daily Model with a link.</copyright>
    <lastBuildDate>${new Date(db.updatedAt || Date.now()).toUTCString()}</lastBuildDate>
${rssItems.join("\n")}
  </channel>
</rss>
`;
fs.writeFileSync(path.join(root, "feed.xml"), rss);

// ---- Calendar ----
const icsText = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const fold = (line) => {
  const out = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = " " + rest.slice(74);
  }
  out.push(rest);
  return out.join("\r\n");
};
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
const deadlines = items.filter((x) => x.action && /^\d{4}-\d{2}-\d{2}$/.test(x.action.by || ""));
const nextDay = (d) => {
  const t = new Date(d + "T00:00:00Z");
  t.setUTCDate(t.getUTCDate() + 1);
  return t.toISOString().slice(0, 10).replace(/-/g, "");
};
const events = deadlines.map((x) =>
  [
    "BEGIN:VEVENT",
    `UID:${x.id}@genai-radar`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${x.action.by.replace(/-/g, "")}`,
    `DTEND;VALUE=DATE:${nextDay(x.action.by)}`,
    `SUMMARY:${icsText("Deadline: " + x.title)}`,
    `DESCRIPTION:${icsText(x.action.what + "\n\n" + link(x))}`,
    `URL:${link(x)}`,
    "END:VEVENT",
  ].map(fold).join("\r\n")
);
const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Rapid Venture Lab//The Daily Model//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", `X-WR-CALNAME:${NAME} deadlines`, ...events, "END:VCALENDAR", ""].join("\r\n");
fs.writeFileSync(path.join(root, "deadlines.ics"), ics);

// ---- Status ----
const heldDir = path.join(root, "inbox", "held");
const held = [];
if (fs.existsSync(heldDir)) {
  for (const f of fs.readdirSync(heldDir).filter((f) => f.endsWith(".json")).sort().reverse()) {
    const batch = JSON.parse(fs.readFileSync(path.join(heldDir, f), "utf8"));
    for (const x of batch.updates || []) held.push({ day: f.replace(/\.json$/, ""), title: x.title, reasons: x.heldReasons || [] });
  }
}
const lastScanDay = (db.updatedAt || "").slice(0, 10);
const inboxToday = path.join(root, "inbox", `${lastScanDay}.json`);
const publishedToday = fs.existsSync(inboxToday) ? (JSON.parse(fs.readFileSync(inboxToday, "utf8")).updates || []).length : 0;
const heldToday = held.filter((h) => h.day === lastScanDay).length;
const fcFile = path.join(root, "inbox", "factcheck", `${lastScanDay}.json`);
let factCheck = null;
if (fs.existsSync(fcFile)) {
  const fc = JSON.parse(fs.readFileSync(fcFile, "utf8"));
  const n = (k) => (fc.items || []).filter((i) => i.verdict === k).length;
  factCheck = { ran: !!fc.ran, checked: (fc.items || []).length, supported: n("supported"), unsupported: n("unsupported"), unverifiable: n("unverifiable") };
}
const status = { lastScan: db.updatedAt, publishedLastScan: publishedToday, heldLastScan: heldToday, factCheck, held: held.slice(0, 10) };
fs.writeFileSync(path.join(root, "status.json"), JSON.stringify(status, null, 2) + "\n");

console.log(JSON.stringify({ rssItems: rssItems.length, deadlines: deadlines.length, held: held.length, publishedLastScan: publishedToday }));
