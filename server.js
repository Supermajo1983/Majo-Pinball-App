// Zero-dependency server: serves the PWA and proxies Matchplay (token stays server-side).
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.MATCHPLAY_TOKEN || '';
const PUBLIC = path.join(__dirname, 'public');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.svg': 'image/svg+xml',
};
const MP_ALLOWED = /^(search|tournaments|tournaments\/\d+|tournaments\/\d+\/standings|users\/\d+)$/;
const cache = new Map();
const TTL = 4000;
const STANDINGS_TTL = 15000; // Matchplay: Standings max. alle 15 s abfragen

// Matchplay verlangt api.matchplay.events; der Pfad-Praefix ist per MATCHPLAY_BASE ueberschreibbar.
const BASES = process.env.MATCHPLAY_BASE
  ? [process.env.MATCHPLAY_BASE]
  : ['https://api.matchplay.events/api/', 'https://api.matchplay.events/'];
let baseIdx = 0;

async function mp(pathAndQuery) {
  const hit = cache.get(pathAndQuery);
  if (hit && Date.now() - hit.t < (pathAndQuery.includes('/standings') ? STANDINGS_TTL : TTL)) return hit;
  let entry;
  for (let i = 0; i < BASES.length; i++) {
    const b = (baseIdx + i) % BASES.length;
    const res = await fetch(BASES[b] + pathAndQuery, {
      headers: { Accept: 'application/json', ...(TOKEN && { Authorization: 'Bearer ' + TOKEN }) },
    });
    entry = { t: Date.now(), status: res.status, body: await res.text() };
    if (res.status !== 404) { baseIdx = b; break; }
  }
  if (entry.status >= 200 && entry.status < 300) {
    if (cache.size >= 500) cache.delete(cache.keys().next().value); // aeltesten Eintrag verwerfen
    cache.set(pathAndQuery, entry);
  }
  return entry;
}

// --- Gemeinsame Notizen (Rulesheet/Strategie) ---
// Dauerhaft: JSON-Datei im GitHub-Branch NOTES_BRANCH (Render-Free hat kein persistentes Dateisystem).
// Ohne GITHUB_TOKEN faellt es auf eine lokale Datei zurueck (geht bei Neustart verloren).
const EDIT_KEY = process.env.EDIT_KEY || '';
const GH_TOKEN = process.env.GITHUB_TOKEN || '';
const GH_REPO = process.env.GITHUB_REPO || 'Supermajo1983/Majo-Pinball-App';
const GH_BRANCH = process.env.NOTES_BRANCH || 'data';
const GH_URL = `https://api.github.com/repos/${GH_REPO}/contents/notes.json`;
const LOCAL_NOTES = path.join(__dirname, 'notes.local.json');
let notesCache = null; // { t, notes, sha }
let writeChain = Promise.resolve();

const ghFetch = (url, opt = {}) => fetch(url, {
  ...opt,
  headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + GH_TOKEN, 'User-Agent': 'majo-pinball', ...(opt.headers || {}) },
});

async function loadNotes(force) {
  if (!force && notesCache && Date.now() - notesCache.t < 5000) return notesCache;
  if (!GH_TOKEN) {
    let notes = {};
    try { notes = JSON.parse(fs.readFileSync(LOCAL_NOTES, 'utf8')); } catch { /* leer */ }
    return (notesCache = { t: Date.now(), notes, sha: null });
  }
  const r = await ghFetch(`${GH_URL}?ref=${GH_BRANCH}`);
  if (r.status === 404) return (notesCache = { t: Date.now(), notes: {}, sha: null });
  if (!r.ok) throw new Error('GitHub ' + r.status);
  const j = await r.json();
  return (notesCache = { t: Date.now(), notes: JSON.parse(Buffer.from(j.content, 'base64').toString('utf8') || '{}'), sha: j.sha });
}

async function ensureBranch() {
  const base = `https://api.github.com/repos/${GH_REPO}`;
  const ref = await ghFetch(`${base}/git/ref/heads/${GH_BRANCH}`);
  if (ref.ok) return;
  const main = await ghFetch(`${base}/git/ref/heads/main`);
  if (!main.ok) throw new Error('GitHub main-Branch nicht lesbar: ' + main.status);
  const sha = (await main.json()).object.sha;
  const mk = await ghFetch(`${base}/git/refs`, { method: 'POST', body: JSON.stringify({ ref: 'refs/heads/' + GH_BRANCH, sha }) });
  if (!mk.ok && mk.status !== 422) throw new Error('GitHub Branch anlegen: ' + mk.status);
}

async function saveNotes(key, note) {
  if (GH_TOKEN) await ensureBranch();
  for (let attempt = 0; attempt < 2; attempt++) {
    const cur = await loadNotes(attempt > 0);
    const notes = { ...cur.notes, [key]: note };
    if (!GH_TOKEN) {
      fs.writeFileSync(LOCAL_NOTES, JSON.stringify(notes, null, 1));
      return (notesCache = { t: Date.now(), notes, sha: null });
    }
    const r = await ghFetch(GH_URL, {
      method: 'PUT',
      body: JSON.stringify({
        message: 'Notiz aktualisiert: ' + key, branch: GH_BRANCH, sha: cur.sha || undefined,
        content: Buffer.from(JSON.stringify(notes, null, 1)).toString('base64'),
      }),
    });
    if (r.ok) { const j = await r.json(); return (notesCache = { t: Date.now(), notes, sha: j.content.sha }); }
    if (r.status !== 409 && r.status !== 422) throw new Error('GitHub ' + r.status + ' ' + (await r.text()).slice(0, 200));
  }
  throw new Error('Speichern fehlgeschlagen (Konflikt)');
}

const readBody = (req) => new Promise((ok, fail) => {
  let b = '';
  req.on('data', (c) => { b += c; if (b.length > 100000) { fail(new Error('zu gross')); req.destroy(); } });
  req.on('end', () => ok(b));
  req.on('error', fail);
});
// Bremse gegen Durchprobieren des Passworts: max. 10 Fehlversuche je 15 Minuten.
// shortcut: global statt pro Nutzer (IP hinter Render-Proxy nicht verlaesslich), ein Angreifer kann so das Bearbeiten 15 min sperren.
let fails = [];
const FAIL_WINDOW = 15 * 60 * 1000;
const keyOk = (k) => {
  const a = Buffer.from(String(k || '')), b = Buffer.from(EDIT_KEY);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
const json = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };

async function handleNotes(req, res, url) {
  try {
    if (req.method === 'GET') return json(res, 200, { notes: (await loadNotes()).notes, persistent: !!GH_TOKEN, editable: !!EDIT_KEY });
    if (req.method === 'POST') {
      if (!EDIT_KEY) return json(res, 403, { error: 'EDIT_KEY ist am Server nicht gesetzt' });
      fails = fails.filter((t) => Date.now() - t < FAIL_WINDOW);
      if (fails.length >= 10) return json(res, 429, { error: 'Zu viele Fehlversuche, bitte in 15 Minuten erneut versuchen' });
      if (!keyOk(req.headers['x-edit-key'])) { fails.push(Date.now()); return json(res, 403, { error: 'Falsches Bearbeitungs-Passwort' }); }
      const key = decodeURIComponent(url.pathname.slice('/api/notes/'.length));
      if (!key || key.length > 120) return json(res, 400, { error: 'Ungueltiger Schluessel' });
      const body = JSON.parse(await readBody(req) || '{}');
      const note = { rules: String(body.rules || '').slice(0, 5000), strategy: String(body.strategy || '').slice(0, 10000), updated: new Date().toISOString() };
      const out = await (writeChain = writeChain.catch(() => {}).then(() => saveNotes(key, note)));
      return json(res, 200, { notes: out.notes });
    }
    json(res, 405, { error: 'Methode nicht erlaubt' });
  } catch (e) { json(res, 502, { error: String(e.message || e) }); }
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/notes' || url.pathname.startsWith('/api/notes/')) return handleNotes(req, res, url);
  if (url.pathname.startsWith('/api/mp/')) {
    // Nur die Abfragen durchlassen, die die App braucht (der Token gehoert dem Betreiber).
    if (!MP_ALLOWED.test(url.pathname.slice(8))) return json(res, 403, { error: 'Abfrage nicht erlaubt' });
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
