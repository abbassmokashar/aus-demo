const workerBase = (process.env.AUS_ASSISTANT_WORKER_URL ||
  'https://aus-ai-assistant.a-mokashar.workers.dev').replace(/\/$/, '');

async function readJson(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'AUS-Knowledge-Refresh/1.0' }
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${body}`);
  return JSON.parse(body);
}

async function refresh() {
  const before = await readJson(`${workerBase}/status`);
  const total = Number(before?.info?.sitemapUrls || before?.indexed || 0);
  let start = 0;
  let indexed = 0;

  do {
    const result = await readJson(`${workerBase}/index-site?start=${start}&limit=25`);
    indexed += Number(result.indexed || 0);
    console.log(`Refreshed ${result.processed} pages from position ${result.start}.`);
    start = result.nextStart;
  } while (start !== null);

  const after = await readJson(`${workerBase}/status`);
  console.log(`Assistant refresh complete: ${indexed}/${total || after.indexed} sitemap pages updated.`);
  console.log(`Index timestamp: ${after?.info?.updatedAt || 'unavailable'}`);
}

refresh().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
