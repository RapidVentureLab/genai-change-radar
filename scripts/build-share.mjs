// Builds a share page and a share image for every story.
//
//   node scripts/build-share.mjs [--force] [--no-images]
//
// For each item in updates.json it writes:
//   s/<id>.html      a small page with its own LinkedIn preview (title, summary, image).
//                    Readers who open it are sent on to the story on the front page.
//   s/img/<id>.png   a 1200 x 627 newspaper-style card, used as that page's preview image.
//
// Images are only drawn for stories that do not have one yet, unless --force is given.
// Drawing needs Chrome or Chromium. Set CHROME to its path, or have google-chrome,
// chromium or chromium-browser on the PATH. GitHub's Ubuntu runners include Chrome.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://rapidventurelab.github.io/genai-change-radar/";
const NAME = "The Daily Model";
const args = new Set(process.argv.slice(2));

const db = JSON.parse(fs.readFileSync(path.join(ROOT, "updates.json"), "utf8"));
const tax = JSON.parse(fs.readFileSync(path.join(ROOT, "docs/taxonomy.json"), "utf8"));
const LAYER_SHORT = { Model: "Models", "Data & Knowledge": "Data", "Agent & Infrastructure": "Agents", "Application & Workflow": "Applications", "Production & Business": "Production" };
const TOPICS = new Set(["Open models", "Open standards", "Other"]);

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const actionLabel = (x) => (x.action ? (tax.actionTypes.find((a) => a.id === x.action.type) || {}).label || "Action" : "");
const vendor = (x) => (x.vendors || []).find((v) => !TOPICS.has(v)) || (x.vendors || []).find((v) => v !== "Other") || "";
const todo = (x) => (x.action && x.action.what) || x.learn || "";
const storyUrl = (x) => `${BASE}#item-${encodeURIComponent(x.id)}`;

const MARK = `<svg viewBox="0 0 206.35 218.6" aria-hidden="true"><polygon fill="#111111" points="0 41.26 0 79.62 51.49 131.11 0 182.59 0 218.6 2.35 218.6 89.85 131.11 0 41.26"/><polygon fill="#39B54A" points="206.35 1.3 206.35 0 169.29 0 102.99 66.3 36.68 0 0 0 0 1.68 102.99 104.66 206.35 1.3"/><polygon fill="#111111" points="154.86 126.83 206.35 75.33 206.35 36.98 116.5 126.83 206.35 216.67 206.35 178.31 154.86 126.83"/></svg>`;

function kicker(x) {
  const parts = [x.kind === "milestone" ? "Milestone" : LAYER_SHORT[x.layer] || x.layer, vendor(x)].filter(Boolean).map(esc);
  let html = parts.join(" · ");
  if (x.action) html += ` · <span class="red">${esc(actionLabel(x))}</span>`;
  return html;
}

/* ---------- the image ---------- */
function cardHtml(x) {
  const t = x.title || "";
  const size = t.length <= 48 ? 60 : t.length <= 72 ? 52 : t.length <= 95 ? 44 : 40;
  const fonts = "file://" + path.join(ROOT, "assets/fonts/fonts.css");
  const by = x.action && x.action.by ? `<span class="stamp">Act by ${esc(fmt(x.action.by))}</span>` : "";
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${fonts}">
<style>
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:627px;overflow:hidden}
body{background:#F3EFE4;color:#161616;padding:40px 60px 34px;display:flex;flex-direction:column;font-family:"Source Serif 4",Georgia,serif}
.top{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:10px}
.mast{font:900 38px/1 "Playfair Display",Georgia,serif;letter-spacing:-.01em}
.date{font:700 16px/1 "Libre Franklin",Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}
.rule{border-top:4px solid #161616;border-bottom:1px solid #161616;height:4px}
.kicker{margin-top:26px;font:800 17px/1 "Libre Franklin",Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}
.red{color:#9E1B1B}
h1{margin:12px 0 0;padding-bottom:4px;font:900 ${size}px/1.12 "Playfair Display",Georgia,serif;letter-spacing:-.01em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.deck{margin:10px 0 0;font:italic 24px/1.35 "Playfair Display",Georgia,serif;color:#4F4A40;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.bottom{margin-top:auto;display:flex;gap:22px;align-items:stretch}
.todo{flex:1;border:2px solid #161616;background:#FBF9F3;padding:14px 18px}
.todo b{display:block;font:800 14px/1 "Libre Franklin",Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}
.todo p{margin:8px 0 0;font:400 22px/1.35 "Source Serif 4",Georgia,serif;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.stamp{align-self:center;flex:none;font:800 18px/1.2 "Libre Franklin",Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#9E1B1B;border:3px solid #9E1B1B;padding:10px 14px;transform:rotate(-3deg);max-width:220px;text-align:center}
.foot{display:flex;justify-content:space-between;align-items:center;margin-top:18px;font:600 17px/1 "Libre Franklin",Arial,sans-serif}
.checked{color:#1F6B33}
.lockup{display:inline-flex;align-items:center;gap:10px;font:600 18px/1 "Archivo",Arial,sans-serif}
.lockup svg{width:20px;height:21px}
</style></head><body>
<div class="top"><span class="mast">${NAME}</span><span class="date">${esc(fmt(x.date))}</span></div>
<div class="rule"></div>
<div class="kicker">${kicker(x)}</div>
<h1>${esc(t)}</h1>
<p class="deck">${esc(x.whyCare)}</p>
<div class="bottom"><div class="todo"><b>What to do</b><p>${esc(todo(x))}</p></div>${by}</div>
<div class="foot"><span class="checked">✓ Checked against ${(x.sources || []).length === 1 ? "its primary source" : "its primary sources"}</span><span class="lockup">${MARK}Rapid Venture Lab</span></div>
</body></html>`;
}

function findChrome() {
  const names = [process.env.CHROME, "google-chrome", "google-chrome-stable", "chromium", "chromium-browser"].filter(Boolean);
  for (const n of names) {
    const r = spawnSync(n, ["--version"], { encoding: "utf8" });
    if (r.status === 0) return n;
  }
  return null;
}

/* ---------- the share page ---------- */
function pageHtml(x, hasImage) {
  const img = hasImage ? `${BASE}s/img/${encodeURIComponent(x.id)}.png` : `${BASE}assets/social/og.png`;
  const src = (x.sources || [])[0];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(x.title)} | ${NAME}</title>
<meta name="description" content="${esc(x.whyCare)}">
<link rel="canonical" href="${BASE}s/${encodeURIComponent(x.id)}.html">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${NAME}">
<meta property="og:title" content="${esc(x.title)}">
<meta property="og:description" content="${esc(x.whyCare)}">
<meta property="og:url" content="${BASE}s/${encodeURIComponent(x.id)}.html">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="627">
<meta property="article:published_time" content="${esc(x.date)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="../assets/fonts/fonts.css">
<style>
body{margin:0;background:#F3EFE4;color:#161616;font:18px/1.55 "Source Serif 4",Georgia,serif}
main{max-width:720px;margin:0 auto;padding:28px 18px 48px}
.mast{font:900 30px/1 "Playfair Display",Georgia,serif;text-decoration:none;color:#161616;display:block;border-bottom:4px double #161616;padding-bottom:12px}
.kicker{margin-top:22px;font:800 14px/1.3 "Libre Franklin",Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}
.red{color:#9E1B1B}
h1{margin:10px 0 0;font:900 38px/1.1 "Playfair Display",Georgia,serif}
.deck{font:italic 21px/1.4 "Playfair Display",Georgia,serif;margin:12px 0 0}
.todo{border:2px solid #161616;background:#FBF9F3;padding:12px 14px;margin-top:18px}
.todo b{font:800 13px/1 "Libre Franklin",Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}
.todo p{margin:6px 0 0}
.go{display:inline-block;margin-top:22px;background:#161616;color:#F3EFE4;padding:13px 20px;font:800 15px/1 "Libre Franklin",Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;text-decoration:none}
.src{margin-top:16px;font:600 15px/1.4 "Libre Franklin",Arial,sans-serif}
</style>
<script>location.replace(${JSON.stringify("../#item-" + encodeURIComponent(x.id))});</script>
</head>
<body>
<main>
<a class="mast" href="../">${NAME}</a>
<div class="kicker">${kicker(x)} · ${esc(fmt(x.date))}</div>
<h1>${esc(x.title)}</h1>
<p class="deck">${esc(x.whyCare)}</p>
<div class="todo"><b>What to do</b><p>${esc(todo(x))}</p></div>
<a class="go" href="../#item-${encodeURIComponent(x.id)}">Read the full story</a>
${src ? `<p class="src">Primary source: <a href="${esc(src.url)}" rel="noopener">${esc(src.name)}</a></p>` : ""}
</main>
</body>
</html>
`;
}

/* ---------- drawing with Chrome over its debugging protocol (no packages needed) ---------- */
async function openChrome(bin) {
  const { spawn } = await import("node:child_process");
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "share-profile-"));
  const proc = spawn(bin, ["--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = "";
    const t = setTimeout(() => reject(new Error("Chrome did not start")), 20000);
    proc.stderr.on("data", (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); resolve(m[1]); } });
    proc.on("exit", () => reject(new Error("Chrome exited")));
  });
  const port = new URL(wsUrl).port;
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const waiting = new Map();
  const events = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && waiting.has(msg.id)) { const { resolve, reject } = waiting.get(msg.id); waiting.delete(msg.id); msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result); }
    else if (msg.method) events.push(msg);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; waiting.set(n, { resolve, reject }); ws.send(JSON.stringify({ id: n, method, params })); });
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 627, deviceScaleFactor: 1, mobile: false });
  return {
    async shoot(fileUrl, outPng) {
      events.length = 0;
      await send("Page.navigate", { url: fileUrl });
      for (let i = 0; i < 100 && !events.some((e) => e.method === "Page.loadEventFired"); i++) await new Promise((r) => setTimeout(r, 50));
      await send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => true)", awaitPromise: true });
      const { data } = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 1200, height: 627, scale: 1 } });
      fs.writeFileSync(outPng, Buffer.from(data, "base64"));
    },
    async close() {
      try { ws.close(); } catch {}
      const exited = new Promise((r) => proc.once("exit", r));
      proc.kill();
      await Promise.race([exited, new Promise((r) => setTimeout(r, 3000))]);
      try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* Chrome may still hold files; the OS cleans temp */ }
    },
  };
}

/* ---------- run ---------- */
const outDir = path.join(ROOT, "s");
const imgDir = path.join(outDir, "img");
fs.mkdirSync(imgDir, { recursive: true });

const ids = new Set(db.updates.map((x) => x.id));
let removed = 0;
for (const f of fs.readdirSync(outDir)) if (f.endsWith(".html") && !ids.has(f.slice(0, -5))) { fs.unlinkSync(path.join(outDir, f)); removed++; }
for (const f of fs.readdirSync(imgDir)) if (f.endsWith(".png") && !ids.has(f.slice(0, -4))) { fs.unlinkSync(path.join(imgDir, f)); removed++; }

// A card is redrawn when anything shown on it changes. manifest.json keeps a hash per story.
const manifestFile = path.join(imgDir, "manifest.json");
const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, "utf8")) : {};
// Bump CARD_VERSION when the card design changes, so every card is redrawn once.
const CARD_VERSION = 2;
const cardHash = (x) => createHash("sha1").update(JSON.stringify([CARD_VERSION, x.title, x.whyCare, todo(x), x.date, x.kind, x.layer, x.vendors, x.action, (x.sources || []).length, NAME])).digest("hex").slice(0, 12);
for (const id of Object.keys(manifest)) if (!ids.has(id)) delete manifest[id];
let drawn = 0, failed = 0;
const bin = args.has("--no-images") ? null : findChrome();
if (!bin && !args.has("--no-images")) console.warn("No Chrome found. Share pages will use the general preview image.");
const browser = bin ? await openChrome(bin) : null;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "share-"));
try {
  for (const x of db.updates) {
    const png = path.join(imgDir, `${x.id}.png`);
    const h = cardHash(x);
    if (browser && (args.has("--force") || !fs.existsSync(png) || manifest[x.id] !== h)) {
      const html = path.join(tmp, `${x.id}.html`);
      fs.writeFileSync(html, cardHtml(x));
      try { await browser.shoot("file://" + html, png); manifest[x.id] = h; drawn++; }
      catch (err) { failed++; console.warn(`Could not draw ${x.id}: ${err.message}`); }
    }
    fs.writeFileSync(path.join(outDir, `${x.id}.html`), pageHtml(x, fs.existsSync(png)));
  }
} finally {
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
  if (browser) await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}
console.log(JSON.stringify({ pages: db.updates.length, imagesDrawn: drawn, imagesFailed: failed, removed }));
