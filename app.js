/* The Daily Model: newspaper front page.
   Reads updates.json, docs/taxonomy.json and status.json. No build step, no dependencies. */
"use strict";

const CONFIG = {
  name: "The Daily Model",
  // Link to the reader survey (for example a Google Form). Leave empty to hide the survey box.
  surveyUrl: "",
  weekDays: 7,
  decisionDays: 30,
};

const LAYERS = [
  { id: "Model", short: "Models", lane: "Model", desc: "The model itself" },
  { id: "Data & Knowledge", short: "Data", lane: "Data", desc: "What it knows and remembers" },
  { id: "Agent & Infrastructure", short: "Agents", lane: "Agents", desc: "Tools, runtimes, protocols" },
  { id: "Application & Workflow", short: "Applications", lane: "Applications", desc: "Products people use" },
  { id: "Production & Business", short: "Production", lane: "Production", desc: "Rules, safety, operations" },
];
const LAYER = Object.fromEntries(LAYERS.map((l, i) => [l.id, { ...l, index: i }]));
const IMPACT_RANK = { Disruptive: 0, "Step-change": 1, Incremental: 2, "Packaging / distribution": 3 };
const TOPIC_VENDORS = new Set(["Open models", "Open standards", "Other"]);

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = {
  get(k, fallback) { try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

let DB, TAX, STATUS;
let byId = new Map();
const state = { section: "all", stack: new Set(), action: false, q: "", decision: null, showAll: false, sel: null };
let newIds = new Set();

/* ---------- dates ---------- */
const fmtLong = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const fmtShort = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const berlinDay = (date = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(date);
const addDays = (day, n) => { const t = new Date(day + "T12:00:00Z"); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
const daysBetween = (a, b) => Math.round((new Date(b + "T12:00:00Z") - new Date(a + "T12:00:00Z")) / 86400000);

/* ---------- helpers ---------- */
const layerShort = (x) => (LAYER[x.layer] || {}).short || x.layer;
const leadVendor = (x) => (x.vendors || []).find((v) => !TOPIC_VENDORS.has(v)) || (x.vendors || [])[0] || "";
const actionLabel = (x) => (x.action ? ((TAX.actionTypes.find((a) => a.id === x.action.type) || {}).label || "Action") : "");
const decisionLabel = (id) => ((TAX.decisions.find((d) => d.id === id) || {}).label || id);
const isWatching = (x) => x.candidate && x.candidate.status === "watching";
function kicker(x, withNew = true) {
  const parts = [layerShort(x), leadVendor(x)].filter(Boolean).map(esc);
  let html = parts.join(" · ");
  if (x.action) html += ` · <span class="red">${esc(actionLabel(x))}</span>`;
  if (withNew && newIds.has(x.id)) html = `<span class="newtag">New ·</span> ${html}`;
  return html;
}
const sortFront = (a, b) => (IMPACT_RANK[a.impact] ?? 9) - (IMPACT_RANK[b.impact] ?? 9) || b.date.localeCompare(a.date);

/* ---------- filters ---------- */
function matches(x, ignoreSection = false) {
  if (!ignoreSection && state.section !== "all" && x.layer !== state.section) return false;
  if (state.stack.size && !(x.vendors || []).some((v) => state.stack.has(v))) return false;
  if (state.action && !x.action) return false;
  if (state.decision && !(x.decisions || []).includes(state.decision)) return false;
  if (state.q) {
    const hay = [x.title, x.whatChanged, x.whyCare, x.layer, ...(x.vendors || [])].join(" ").toLowerCase();
    if (!state.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
  }
  return true;
}
let scanDay, weekItems;

function readUrl() {
  const p = new URLSearchParams(location.search);
  if (p.has("section")) { const s = p.get("section"); state.section = LAYERS.some((l) => l.short.toLowerCase() === s) ? LAYERS.find((l) => l.short.toLowerCase() === s).id : "all"; }
  const stack = p.has("stack") ? p.get("stack").split(",").filter(Boolean) : store.get("radar.stack", []);
  state.stack = new Set(stack.filter((v) => TAX.vendors.some((t) => t.id === v)));
  state.action = p.get("action") === "1";
  state.q = p.get("q") || "";
  state.decision = TAX.decisions.some((d) => d.id === p.get("decision")) ? p.get("decision") : null;
}
function writeUrl() {
  const p = new URLSearchParams();
  if (state.section !== "all") p.set("section", LAYER[state.section].short.toLowerCase());
  if (state.stack.size) p.set("stack", [...state.stack].join(","));
  if (state.action) p.set("action", "1");
  if (state.q) p.set("q", state.q);
  if (state.decision) p.set("decision", state.decision);
  const qs = p.toString();
  history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
  store.set("radar.stack", [...state.stack]);
}

/* ---------- render: top ---------- */
function renderTop() {
  $("siteName").textContent = CONFIG.name;
  document.querySelector(".mini-mast").textContent = CONFIG.name;
  $("today").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin" });
  const last = (STATUS && STATUS.lastScan) || DB.updatedAt;
  const when = last ? new Date(last).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" }) : "unknown";
  const pub = STATUS ? ` · ${STATUS.publishedLastScan} new · ${STATUS.heldLastScan} held` : "";
  $("scanStatus").textContent = `Last scan ${when}${pub}`;
  const ms = DB.updates.filter((x) => x.kind === "milestone").length;
  $("guideHistory").textContent = `${ms} milestones since 2022, clickable`;
  $("histIntro").textContent = `${ms} milestones since ChatGPT, each checked against its primary source. A milestone changed what architects can build, or how they build it.`;
  if (CONFIG.surveyUrl) { $("survey").hidden = false; $("surveyLink").href = CONFIG.surveyUrl; }
}

function renderTabs() {
  const base = weekItems.filter((x) => matches(x, true));
  const tabs = [{ id: "all", label: "All", n: base.length }, ...LAYERS.map((l) => ({ id: l.id, label: l.short, n: base.filter((x) => x.layer === l.id).length }))];
  tabs.sort((a, b) => (a.id === "all" ? -1 : b.id === "all" ? 1 : b.n - a.n));
  $("tabs").innerHTML = tabs.map((t) => `<button type="button" class="tab" data-section="${esc(t.id)}" aria-pressed="${state.section === t.id}" data-empty="${t.n === 0}">${esc(t.label)} ${t.n}</button>`).join("");
  $("guideWeek").textContent = `${base.length} changes${state.stack.size ? ", filtered to your stack" : " this week"}`;
  const pill = $("newPill");
  pill.hidden = newIds.size === 0;
  pill.textContent = `${newIds.size} new since your last visit`;
}

function renderStack() {
  const groups = [...new Set(TAX.vendors.map((v) => v.group))];
  $("stackPanel").innerHTML = groups.map((g) => `<fieldset><legend>${esc(g)}</legend>${TAX.vendors.filter((v) => v.group === g).map((v) => `<label><input type="checkbox" value="${esc(v.id)}" ${state.stack.has(v.id) ? "checked" : ""}>${esc(v.id)}</label>`).join("")}</fieldset>`).join("") +
    `<div class="stack-actions"><button type="button" class="linkbtn" data-stack="clear">Show all vendors</button><button type="button" class="linkbtn" data-stack="done">Done</button></div>`;
  $("stackSummary").textContent = state.stack.size ? [...state.stack].slice(0, 3).join(", ") + (state.stack.size > 3 ? ` +${state.stack.size - 3}` : "") : "all vendors";
  updateFilterCount();
}
function updateFilterCount() {
  const n = (state.stack.size ? 1 : 0) + (state.action ? 1 : 0) + (state.q ? 1 : 0);
  const c = $("filterCount");
  c.hidden = n === 0;
  c.textContent = n;
}

/* ---------- render: front page ---------- */
function briefHtml(x, withMore = true, cls = "") {
  return `<button type="button" class="brief${cls ? " " + cls : ""}" data-open="${esc(x.id)}">
<div class="kicker">${kicker(x)}</div>
<h3>${esc(x.title)}</h3>
<p>${esc(x.whyCare)}</p>${withMore ? `<div class="more">Read: what to do →</div>` : ""}</button>`;
}

function renderFront() {
  const items = weekItems.filter((x) => matches(x)).sort(sortFront);
  const lead = items[0];
  const notes = [];
  if (state.section !== "all") notes.push(`section ${LAYER[state.section].short}`);
  if (state.stack.size) notes.push(`your stack (${[...state.stack].join(", ")})`);
  if (state.action) notes.push("items that need action");
  if (state.decision) notes.push(`the decision "${decisionLabel(state.decision)}"`);
  if (state.q) notes.push(`"${state.q}"`);
  const note = $("filterNote");
  if (notes.length) {
    note.hidden = false;
    note.innerHTML = `Showing ${items.length} of ${weekItems.length} stories this week for ${esc(notes.join(", "))}. <button type="button" class="linkbtn" id="clearFilters">Clear all filters</button>`;
  } else note.hidden = true;

  if (!lead) {
    $("lead").innerHTML = `<div class="label">Lead story</div><p class="empty">No stories this week match your filters. Try another section, or <button type="button" class="linkbtn" id="clearFilters2">clear all filters</button>.</p>`;
    $("briefs").innerHTML = "";
    $("row4").innerHTML = "";
  } else {
    const src = (lead.sources || [])[0];
    $("lead").innerHTML = `<div class="label">Lead story · ${kicker(lead)} · <span class="impact-badge">${esc(lead.impact)}</span></div>
<h2><button type="button" data-open="${esc(lead.id)}">${esc(lead.title)}</button></h2>
<p class="deck">${esc(lead.whyCare)}</p>
<div class="byline"><span>${esc(fmtLong(lead.date))}</span><span>${esc(lead.layer)}</span><span class="checked">✓ Checked against ${(lead.sources || []).length === 1 ? "its source" : `${lead.sources.length} sources`}</span></div>
<div class="lead-body">
<div class="lb-changed"><div class="label" style="margin-bottom: 4px">What changed</div><p>${esc(lead.whatChanged)}</p></div>
<div><div class="lb-design"><div class="label" style="margin-bottom: 4px">What it means for your design</div><p>${esc(lead.architectureImplication)}</p></div>
<div class="todo"><div class="label">What to do</div><p>${esc(lead.learn)}</p></div></div>
</div>
<div class="linkrow"><button type="button" class="btn-solid read-btn" data-open="${esc(lead.id)}">Read the full story</button>${src ? `<a href="${esc(src.url)}" rel="noopener" target="_blank">Read the source</a>` : ""}${shareLinks(lead)}</div>`;
    const more = items.length > 8 ? `All ${items.length} stories this week` : "All stories and earlier editions";
    $("briefs").innerHTML = (items.slice(1, 4).map((x) => briefHtml(x)).join("") + items.slice(4, 8).map((x) => briefHtml(x, false, "phone-only")).join("")) || `<p class="empty">Nothing else this week.</p>`;
    if (items.length > 1) $("briefs").insertAdjacentHTML("beforeend", `<button type="button" class="btn-outline phone-only more-btn" data-all="1">${esc(more)}</button>`);
    $("row4").innerHTML = items.slice(4, 8).map((x) => briefHtml(x, false)).join("");
  }
  const rest = items.length > 8 ? items.length - 8 : 0;
  $("allBtn").textContent = state.showAll ? "Hide the full list" : rest ? `All ${items.length} stories this week · Earlier editions` : "Earlier editions";
  renderArchive();
}

function shareLinks(x) {
  const url = location.origin + location.pathname + "#item-" + encodeURIComponent(x.id);
  return `<span class="push"><button type="button" class="linkbtn share-native" data-share="${esc(x.id)}">Share</button><a class="share-wide" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener">Share on LinkedIn</a><button type="button" class="linkbtn share-wide" data-copy="${esc(url)}">Copy link</button></span>`;
}

function renderArchive() {
  const box = $("archive");
  box.hidden = !state.showAll;
  if (!state.showAll) return;
  const items = DB.updates.filter((x) => matches(x)).sort((a, b) => b.date.localeCompare(a.date));
  box.innerHTML = `<div class="label" style="padding: 12px 0 4px">${items.length} stories in the archive, newest first</div>` +
    items.map((x) => `<button type="button" class="brief" data-open="${esc(x.id)}"><span class="date">${esc(fmtShort(x.date))}<br>${x.kind === "milestone" ? "Milestone" : ""}</span><span><span class="kicker">${kicker(x)}</span><h3>${esc(x.title)}</h3></span></button>`).join("");
}

/* ---------- render: right column ---------- */
function renderNotices() {
  const today = berlinDay();
  const pool = DB.updates.filter((x) => x.action && (!state.stack.size || (x.vendors || []).some((v) => state.stack.has(v))));
  const dated = pool.filter((x) => x.action.by && x.action.by >= today).sort((a, b) => a.action.by.localeCompare(b.action.by));
  const undated = pool.filter((x) => !x.action.by && daysBetween(x.date, today) <= 60).sort((a, b) => b.date.localeCompare(a.date));
  const list = [...dated, ...undated].slice(0, 4);
  const dn = $("dockDeadlines");
  dn.hidden = dated.length === 0;
  dn.textContent = dated.length;
  $("noticeList").innerHTML = list.length ? list.map((x) => {
    const when = x.action.by
      ? `<div class="when">${esc(fmtShort(x.action.by).toUpperCase())} · ${daysBetween(today, x.action.by)} DAYS LEFT</div>`
      : `<div class="when nodate">${esc(actionLabel(x).toUpperCase())} · NO DATE GIVEN</div>`;
    return `<div class="notice">${when}<button type="button" data-open="${esc(x.id)}">${esc(x.title)}. ${esc(x.action.what)}</button></div>`;
  }).join("") : `<p class="empty">No deadlines${state.stack.size ? " in your stack" : ""} right now.</p>`;
}

function renderDecisions() {
  const from = addDays(scanDay, -CONFIG.decisionDays + 1);
  const recent = DB.updates.filter((x) => x.date >= from && x.date <= scanDay);
  const counts = new Map();
  for (const x of recent) for (const d of x.decisions || []) counts.set(d, [...(counts.get(d) || []), x]);
  const top = [...counts.entries()].sort((a, b) => b[1].length - a[1].length || b[1][0].date.localeCompare(a[1][0].date)).slice(0, 4);
  $("decisionList").innerHTML = top.map(([id, xs]) => {
    const latest = [...xs].sort((a, b) => b.date.localeCompare(a.date))[0];
    return `<button type="button" class="decision" data-decision="${esc(id)}" aria-pressed="${state.decision === id}"><strong>${esc(decisionLabel(id))}</strong><span>Latest: ${esc(latest.title)}. ${xs.length} ${xs.length === 1 ? "story" : "stories"} in ${CONFIG.decisionDays} days →</span></button>`;
  }).join("") || `<p class="empty">No new evidence in the last ${CONFIG.decisionDays} days.</p>`;
}

function renderCorrections() {
  const held = (STATUS && STATUS.held) || [];
  $("corrections").innerHTML = held.length
    ? `<p>These items failed our checks and are held for review:</p><ul>${held.slice(0, 5).map((h) => `<li>${esc(h.title)} <span class="ui" style="font-size: 14px">(${esc((h.reasons || [])[0] || "check failed")})</span></li>`).join("")}</ul>`
    : `<p>None in the latest scan. Items that fail our checks are held for review and listed here.</p>`;
}

/* ---------- history ---------- */
const PLOT_W = 990, ROW_H = 60, TOP0 = 36, START = 2022 * 12 + 10, PX = 19.5;
let historyItems = [];

function xFor(date) {
  const y = +date.slice(0, 4), m = +date.slice(5, 7), d = +date.slice(8, 10);
  return ((y * 12 + m - 1) - START + (d - 1) / 31) * PX;
}

function renderHistory() {
  historyItems = DB.updates.filter((x) => x.kind === "milestone" || isWatching(x)).sort((a, b) => a.date.localeCompare(b.date));
  if (state.sel === null) state.sel = historyItems.filter((x) => x.kind === "milestone").at(-1).id;

  $("lanes").innerHTML = LAYERS.map((l) => `<div class="lane"><b>${esc(l.lane)}</b><span>${esc(l.desc)}</span></div>`).join("");

  const parts = [];
  const lastYear = +(historyItems.at(-1) || { date: "2026" }).date.slice(0, 4);
  for (let y = 2022; y <= lastYear; y++) {
    const x = y === 2022 ? 0 : xFor(`${y}-01-01`);
    if (y > 2022) parts.push(`<span class="year" style="left: ${x + 6}px">${y}</span>`);
    if (y > 2022) parts.push(`<span class="vline" style="left: ${x}px"></span>`);
  }
  for (let r = 0; r < LAYERS.length; r++) parts.push(`<span class="hline" style="top: ${TOP0 + r * ROW_H}px"></span>`);

  // Place dots, nudging any that would overlap, then labels where they fit.
  const lastX = {};
  const ends = {};
  for (const x of historyItems) {
    const row = (LAYER[x.layer] || { index: 0 }).index;
    let cx = xFor(x.date);
    if (lastX[row] !== undefined && cx - lastX[row] < 9) cx = lastX[row] + 9;
    lastX[row] = cx;
    const light = x.impact === "Incremental" || x.impact === "Packaging / distribution";
    const watch = isWatching(x);
    const size = x.impact === "Disruptive" ? 18 : light ? 12 : 14;
    const cy = TOP0 + row * ROW_H + 30;
    const cls = watch ? "dot watch" : light ? "dot light" : "dot";
    const sel = state.sel === x.id;
    const label = watch ? "Watching" : x.short || "";
    parts.push(`<button type="button" class="${cls}" data-mile="${esc(x.id)}" aria-pressed="${sel}" title="${esc(x.title)}" aria-label="${esc(fmtShort(x.date) + ": " + x.title)}" style="left: ${cx - size / 2}px; top: ${cy - size / 2}px; width: ${size}px; height: ${size}px"></button>`);
    if (!label) continue;
    const w = label.length * 7.8 + 6;
    const e = (ends[row] = ends[row] || { a: -99, b: -99 });
    const rightAnchor = cx - 6 + w > PLOT_W;
    const start = rightAnchor ? cx + 6 - w : cx - 6;
    let pos = null;
    if (start >= e.a + 10) pos = "a";
    else if (start >= e.b + 10) pos = "b";
    if (!pos && !sel) continue;
    pos = pos || "b";
    e[pos] = start + w;
    const top = pos === "a" ? cy - 31 : cy + 10;
    const horiz = rightAnchor ? `right: ${PLOT_W - cx - 6}px` : `left: ${cx - 6}px`;
    parts.push(`<span class="dlabel${sel ? " on" : ""}" style="${horiz}; top: ${top}px">${esc(label)}</span>`);
  }
  $("plot").innerHTML = parts.join("");

  // Phone: list by year.
  const years = [...new Set(historyItems.map((x) => x.date.slice(0, 4)))].sort().reverse();
  $("historyList").innerHTML = years.map((y, i) => {
    const xs = historyItems.filter((x) => x.date.startsWith(y)).reverse();
    return `<details ${i === 0 ? "open" : ""}><summary class="ui" style="font-weight: 800; font-size: 18px; padding: 10px 0; cursor: pointer">${y} · ${xs.length} ${xs.length === 1 ? "entry" : "entries"}</summary>` +
      xs.map((x) => `<button type="button" data-mile="${esc(x.id)}"><span class="mk${isWatching(x) ? " watch" : ""}"></span><span><small>${esc(fmtShort(x.date))} · ${esc(layerShort(x))}${isWatching(x) ? " · Watching" : ""}</small>${esc(x.title)}</span></button>`).join("") + `</details>`;
  }).join("");

  renderSelected();
  renderNumbers();
  reveal();
}

function renderSelected() {
  const x = byId.get(state.sel);
  if (!x) return;
  const ms = historyItems.filter((m) => m.kind === "milestone");
  const n = ms.findIndex((m) => m.id === x.id);
  const watch = isWatching(x);
  const src = (x.sources || [])[0];
  $("selected").innerHTML = `<div class="label red">Selected · ${esc(layerShort(x))} · ${esc(fmtShort(x.date))} · ${watch ? "Candidate" : esc(x.impact)}</div>
<h3>${esc(x.title)}</h3>
<p>${esc(x.whyCare)}</p>
<p class="meta">${watch ? "Being watched. The monthly review decides if it becomes a milestone." : `✓ Verified ${esc(fmtLong(x.verified || x.date))} · Milestone ${n + 1} of ${ms.length}`}${src ? ` · <a href="${esc(src.url)}" target="_blank" rel="noopener">Primary source</a>` : ""} · <button type="button" class="linkbtn" data-open="${esc(x.id)}">Full story</button></p>`;
}

function renderNumbers() {
  const ms = DB.updates.filter((x) => x.kind === "milestone");
  const halves = new Map();
  for (const x of ms) { const k = x.date.slice(0, 4) + (+x.date.slice(5, 7) <= 6 ? " H1" : " H2"); halves.set(k, (halves.get(k) || 0) + 1); }
  const [bestHalf, bestN] = [...halves.entries()].sort((a, b) => b[1] - a[1])[0] || ["", 0];
  const halfName = bestHalf ? `the ${bestHalf.endsWith("H1") ? "first" : "second"} half of ${bestHalf.slice(0, 4)}` : "";
  const fullYear = String(+scanDay.slice(0, 4) - 1);
  const inYear = ms.filter((x) => x.date.startsWith(fullYear));
  const layerCounts = LAYERS.map((l) => ({ l, n: inYear.filter((x) => x.layer === l.id).length })).sort((a, b) => b.n - a.n)[0];
  const watching = DB.updates.filter(isWatching).length;
  $("numbers").innerHTML = [
    [ms.length, "verified milestones since November 2022"],
    [bestN, `in ${halfName}, the busiest six months`],
    inYear.length ? [layerCounts.n, `of ${fullYear}'s ${inYear.length} milestones were about ${layerCounts.l.short.toLowerCase()}`] : null,
    [watching, `${watching === 1 ? "candidate is" : "candidates are"} being watched now`],
  ].filter(Boolean).map(([n, t]) => `<b>${esc(n)}</b><span>${esc(t)}</span>`).join("");
}

/* ---------- reader ---------- */
function openReader(id, push = true) {
  const x = byId.get(id);
  if (!x) return;
  const list = (arr) => (arr || []).map((s) => `<span>${esc(s)}</span>`).join("");
  $("readerWhere").innerHTML = kicker(x, false);
  $("readerShare").dataset.share = x.id;
  $("readerBody").innerHTML = `<div class="label">${kicker(x, false)} · ${x.kind === "milestone" ? "Milestone" : isWatching(x) ? "Milestone candidate" : "Signal"}</div>
<h2 id="readerTitle">${esc(x.title)}</h2>
<p class="deck">${esc(x.whyCare)}</p>
<div class="byline"><span>${esc(fmtLong(x.date))}</span><span>${esc(x.layer)}</span><span>${esc(x.impact)}</span><span class="checked">✓ Checked against ${(x.sources || []).length === 1 ? "its source" : `${(x.sources || []).length} sources`}</span></div>
${x.action ? `<div class="todo" style="margin-top: 14px; border-color: var(--red)"><div class="label red">${esc(actionLabel(x))}${x.action.by ? ` · by ${esc(fmtLong(x.action.by))}` : ""}</div><p>${esc(x.action.what)}</p></div>` : ""}
<h4>What changed</h4><p>${esc(x.whatChanged)}</p>
<div class="ba"><div><h4>Before</h4><p>${esc(x.before)}</p></div><div><h4>After</h4><p>${esc(x.after)}</p></div></div>
<h4>What it means for your design</h4><p>${esc(x.architectureImplication)}</p>
<div class="todo" style="margin-top: 14px"><div class="label">What to do</div><p>${esc(x.learn)}</p></div>
${(x.decisions || []).length ? `<h4>Decisions this affects</h4><div class="chips">${list(x.decisions.map(decisionLabel))}</div>` : ""}
<h4>Trade-offs</h4><div class="chips">${list(x.tradeoffs)}</div>
<h4>Vendors and topics</h4><div class="chips">${list(x.vendors)}</div>
<h4>Sources</h4><ul>${(x.sources || []).map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a></li>`).join("")}</ul>
<div class="linkrow">${shareLinks(x)}</div>`;
  const dlg = $("reader");
  if (!dlg.open) { dlg.showModal(); document.documentElement.classList.add("reading"); }
  dlg.scrollTop = 0;
  document.querySelector(".reader-bar").classList.remove("scrolled");
  $("readerProgress").style.transform = "scaleX(0)";
  if (push) history.replaceState(null, "", location.pathname + location.search + "#item-" + encodeURIComponent(x.id));
}
function closeReader() {
  const dlg = $("reader");
  if (dlg.open) dlg.close();
}

/* ---------- sharing ---------- */
function itemUrl(id) { return location.origin + location.pathname + "#item-" + encodeURIComponent(id); }
async function share(id, btn) {
  const x = byId.get(id);
  if (!x) return;
  const url = itemUrl(id);
  if (navigator.share) {
    try { await navigator.share({ title: x.title, text: x.whyCare, url }); } catch { /* cancelled */ }
    return;
  }
  try { await navigator.clipboard.writeText(url); } catch { return; }
  const old = btn.textContent;
  btn.textContent = "Link copied";
  setTimeout(() => (btn.textContent = old), 1800);
}

/* ---------- phone filter sheet ---------- */
const isPhone = () => window.matchMedia("(max-width: 760px)").matches;
function setSheet(open) {
  document.body.classList.toggle("sheet-open", open);
  $("sheetShade").hidden = !open;
  $("filterBtn").setAttribute("aria-expanded", String(open));
  $("stack").open = open && isPhone();
  if (open) $("sheetDone").focus();
}

/* ---------- scroll behaviour ---------- */
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let revealer = null;
function reveal() {
  if (calm || !("IntersectionObserver" in window)) return;
  revealer = revealer || new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); revealer.unobserve(e.target); }
  }, { rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".brief, .notice, .decision, .history-list details, .history-foot, .numbers b").forEach((el) => {
    if (el.classList.contains("rv")) return;
    el.classList.add("rv");
    revealer.observe(el);
  });
}
function scrollBehaviour() {
  const bar = $("front");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => bar.classList.toggle("stuck", !e.isIntersecting && e.boundingClientRect.top < 0)).observe(document.querySelector(".masthead"));
    const dockLinks = [...document.querySelectorAll("[data-dock]")];
    const seen = new Map();
    const spy = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target.id, e.isIntersecting);
      const order = ["history", "decisions", "notices", "front"];
      const on = order.find((id) => seen.get(id)) || "front";
      dockLinks.forEach((a) => a.classList.toggle("on", a.dataset.dock === on));
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["front", "notices", "decisions", "history"].forEach((id) => spy.observe(id === "front" ? document.querySelector(".front") : $(id)));
  }
  let lastY = window.scrollY;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (isPhone() && !document.body.classList.contains("sheet-open")) {
        if (y > lastY + 6 && y > 500) document.body.classList.add("tuck");
        else if (y < lastY - 6 || y < 500) document.body.classList.remove("tuck");
      }
      lastY = y;
      ticking = false;
    });
  }, { passive: true });
  const dlg = $("reader");
  dlg.addEventListener("scroll", () => {
    const max = dlg.scrollHeight - dlg.clientHeight;
    $("readerProgress").style.transform = `scaleX(${max > 0 ? Math.min(1, dlg.scrollTop / max) : 1})`;
    document.querySelector(".reader-bar").classList.toggle("scrolled", dlg.scrollTop > 160);
  }, { passive: true });
}

/* ---------- events ---------- */
function rerender() {
  writeUrl();
  renderTabs();
  renderStack();
  renderFront();
  renderNotices();
  renderDecisions();
  reveal();
}

function wire() {
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-section],[data-open],[data-mile],[data-decision],[data-copy],[data-share],[data-stack],[data-all],#clearFilters,#clearFilters2,#allBtn,#readerClose,#filterBtn,#sheetDone,#sheetShade");
    if (!t) return;
    if (t.dataset.section) { state.section = t.dataset.section; rerender(); }
    else if (t.dataset.open) openReader(t.dataset.open);
    else if (t.dataset.mile) { state.sel = t.dataset.mile; renderHistory(); if (window.matchMedia("(max-width: 760px)").matches) openReader(t.dataset.mile); }
    else if (t.dataset.decision) { state.decision = state.decision === t.dataset.decision ? null : t.dataset.decision; rerender(); $("front").scrollIntoView({ behavior: "smooth" }); }
    else if (t.dataset.share) share(t.dataset.share, t);
    else if (t.id === "filterBtn") setSheet(!document.body.classList.contains("sheet-open"));
    else if (t.id === "sheetDone" || t.id === "sheetShade") setSheet(false);
    else if (t.dataset.copy) { navigator.clipboard?.writeText(t.dataset.copy).then(() => { t.textContent = "Link copied"; setTimeout(() => (t.textContent = "Copy link"), 1800); }); }
    else if (t.dataset.stack === "clear") { state.stack.clear(); rerender(); }
    else if (t.dataset.stack === "done") { if (document.body.classList.contains("sheet-open")) setSheet(false); else $("stack").open = false; }
    else if (t.id === "clearFilters" || t.id === "clearFilters2") { Object.assign(state, { section: "all", action: false, q: "", decision: null }); state.stack.clear(); $("search").value = ""; $("needsAction").checked = false; rerender(); }
    else if (t.id === "allBtn" || t.dataset.all) { state.showAll = !state.showAll; renderFront(); if (state.showAll) $("archive").scrollIntoView({ behavior: "smooth" }); }
    else if (t.id === "readerClose") closeReader();
  });
  $("stackPanel").addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    if (e.target.checked) state.stack.add(e.target.value); else state.stack.delete(e.target.value);
    writeUrl(); renderTabs(); renderFront(); renderNotices();
    $("stackSummary").textContent = state.stack.size ? [...state.stack].slice(0, 3).join(", ") + (state.stack.size > 3 ? ` +${state.stack.size - 3}` : "") : "all vendors";
    updateFilterCount();
  });
  document.addEventListener("click", (e) => { const s = $("stack"); if (s.open && !s.contains(e.target) && !document.body.classList.contains("sheet-open")) s.open = false; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("sheet-open")) setSheet(false); });
  $("needsAction").addEventListener("change", (e) => { state.action = e.target.checked; rerender(); });
  let timer;
  $("search").addEventListener("input", (e) => { clearTimeout(timer); timer = setTimeout(() => { state.q = e.target.value.trim(); rerender(); }, 200); });
  $("reader").addEventListener("click", (e) => { if (e.target === $("reader")) closeReader(); });
  $("reader").addEventListener("close", () => {
    document.documentElement.classList.remove("reading");
    if (location.hash.startsWith("#item-")) history.replaceState(null, "", location.pathname + location.search);
  });
  window.addEventListener("hashchange", openFromHash);
}
function openFromHash() {
  const m = location.hash.match(/^#item-(.+)$/);
  if (m) openReader(decodeURIComponent(m[1]), false);
}

/* ---------- start ---------- */
async function start() {
  const get = (u) => fetch(u, { cache: "no-cache" }).then((r) => { if (!r.ok) throw new Error(u + " " + r.status); return r.json(); });
  try {
    [DB, TAX] = await Promise.all([get("updates.json"), get("docs/taxonomy.json")]);
  } catch (err) {
    $("lead").innerHTML = `<p class="empty">Today's edition could not be loaded. Please try again in a minute.</p>`;
    console.error(err);
    return;
  }
  STATUS = await get("status.json").catch(() => null);
  byId = new Map(DB.updates.map((x) => [x.id, x]));
  scanDay = ((STATUS && STATUS.lastScan) || DB.updatedAt || new Date().toISOString()).slice(0, 10);
  const from = addDays(scanDay, -(CONFIG.weekDays - 1));
  weekItems = DB.updates.filter((x) => x.kind !== "milestone" && x.date >= from && x.date <= scanDay);

  // New since your last visit: ids this browser has not seen before.
  const seen = store.get("radar.seen", null);
  if (Array.isArray(seen)) { const s = new Set(seen); newIds = new Set(weekItems.filter((x) => !s.has(x.id)).map((x) => x.id)); }
  store.set("radar.seen", DB.updates.map((x) => x.id));

  document.documentElement.classList.toggle("can-share", !!navigator.share);
  readUrl();
  $("search").value = state.q;
  $("needsAction").checked = state.action;
  renderTop();
  rerender();
  renderCorrections();
  renderHistory();
  wire();
  scrollBehaviour();
  openFromHash();
}
start();
