// Opens a URL and classifies the result.
//   ok       the page loaded (2xx, or a redirect that ends in 2xx)
//   blocked  the site refused an automated request (401, 403, 429). Many vendor sites
//            block bots, so this does not prove the page is gone.
//   broken   404, 410, a 5xx error, a timeout, or the domain did not answer.
export async function checkUrl(url) {
  const opts = {
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
    headers: { "user-agent": "TheDailyModel-source-check (+https://github.com/RapidVentureLab/genai-change-radar)" },
  };
  try {
    let res = await fetch(url, { ...opts, method: "HEAD" });
    // Some servers reject HEAD. Retry those with GET.
    if ([400, 403, 405, 501].includes(res.status)) res = await fetch(url, { ...opts, method: "GET" });
    if (res.ok) return { result: "ok", status: res.status };
    if ([401, 403, 429].includes(res.status)) return { result: "blocked", status: res.status };
    return { result: "broken", status: res.status };
  } catch (e) {
    return { result: "broken", status: e.name === "TimeoutError" ? "timeout" : e.cause?.code || e.message };
  }
}

// Checks many URLs, six at a time, each once.
export async function checkAll(urls) {
  const results = {};
  const queue = [...new Set(urls)];
  const worker = async () => { while (queue.length) { const u = queue.shift(); results[u] = await checkUrl(u); } };
  await Promise.all(Array.from({ length: 6 }, worker));
  return results;
}
