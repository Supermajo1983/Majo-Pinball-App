// Zero-dependency server: serves the PWA and proxies Matchplay (token stays server-side).
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.MATCHPLAY_TOKEN || '';
const PUBLIC = path.join(__dirname, 'public');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.svg': 'image/svg+xml',
};
const cache = new Map();
const TTL = 8000;

// Matchplay verlangt api.matchplay.events; der Pfad-Praefix ist per MATCHPLAY_BASE ueberschreibbar.
const BASES = process.env.MATCHPLAY_BASE
  ? [process.env.MATCHPLAY_BASE]
  : ['https://api.matchplay.events/api/', 'https://api.matchplay.events/'];
let baseIdx = 0;

async function mp(pathAndQuery) {
  const hit = cache.get(pathAndQuery);
  if (hit && Date.now() - hit.t < TTL) return hit;
  let entry;
  for (let i = 0; i < BASES.length; i++) {
    const b = (baseIdx + i) % BASES.length;
    const res = await fetch(BASES[b] + pathAndQuery, {
      headers: { Accept: 'application/json', ...(TOKEN && { Authorization: 'Bearer ' + TOKEN }) },
    });
    entry = { t: Date.now(), status: res.status, body: await res.text() };
    if (res.status !== 404) { baseIdx = b; break; }
  }
  if (entry.status >= 200 && entry.status < 300) cache.set(pathAndQuery, entry);
  return entry;
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/api/mp/')) {
    try {
      const r = await mp(url.pathname.slice(8) + url.search);
      res.writeHead(r.status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      return res.end(r.body);
    } catch (e) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: String(e.message || e) }));
    }
  }
  if (url.pathname === '/api/config') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ matchplayToken: !!TOKEN }));
  }
  let file = path.normalize(path.join(PUBLIC, url.pathname === '/' ? 'index.html' : url.pathname));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log('Majo Pinball App on http://localhost:' + PORT));
