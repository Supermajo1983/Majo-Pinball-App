const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (s) => String(s || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').replace(/\bthe\b/g, '').replace(/\s+/g, ' ').trim();

function findGame(name) {
  const n = norm(name);
  if (!n) return null;
  return window.GAMES.find((g) => [g.name, ...g.aliases].some((a) => norm(a) === n))
    || window.GAMES.find((g) => [g.name, ...g.aliases].some((a) => { const x = norm(a); return x.length > 3 && (n.includes(x) || x.includes(n)); }))
    || null;
}

function showGame(name, info) {
  const g = findGame(name);
  const t = g ? g.tips : window.GENERIC.tips;
  const s = g ? g.strategy : window.GENERIC.strategy;
  const list = (a) => '<ul>' + a.map((x) => `<li>${esc(x)}</li>`).join('') + '</ul>';
  $('#detail').innerHTML = `<h2>${esc(g ? g.name : name)}</h2>
    <div class="muted">${g ? esc(g.maker + ' · ' + g.year) : esc(info || '')}</div>
    ${g ? '' : '<p class="warn">Für dieses Gerät gibt es noch keine eigenen Tipps – allgemeine Hinweise.</p>'}
    <h3>Tipps</h3>${list(t)}<h3>Turnierstrategie</h3>${list(s)}
    ${g && g.sources.length ? '<p class="muted">Quellen: ' + g.sources.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener" style="color:#facc15">${esc(new URL(u).hostname)}</a>`).join(' · ') + '</p>' : ''}`;
  $('#modal').hidden = false;
}

// --- Flipper-Liste ---
function renderGames() {
  const q = norm($('#search').value);
  const items = window.GAMES.filter((g) => !q || norm(g.name + ' ' + g.aliases.join(' ')).includes(q));
  $('#gList').innerHTML = items.map((g) => `<div class="item click" data-g="${esc(g.name)}"><b>${esc(g.name)}</b> <span class="muted">${esc(g.maker)} · ${g.year}</span></div>`).join('')
    || '<p class="muted">Nichts gefunden.</p>';
}

// --- Matchplay ---
let selected = JSON.parse(localStorage.getItem('playerSel') || 'null');
let tournaments = [];
let completedLimit = 10;
let busy = false;
const detailCache = new Map(); // abgeschlossene Turniere aendern sich nicht mehr

const mpGet = async (p) => {
  const r = await fetch('/api/mp/' + p, { cache: 'no-store' });
  if (!r.ok) {
    const hint = r.status === 401 ? ' (Token ungueltig oder fehlt: MATCHPLAY_TOKEN am Server pruefen)' : '';
    throw new Error('Matchplay-Fehler ' + r.status + hint);
  }
  const j = await r.json();
  return j.data ?? j;
};

async function loadDetail(t) {
  const hit = detailCache.get(t.tournamentId);
  if (hit) return hit;
  try {
    const [d, st] = await Promise.all([
      mpGet(`tournaments/${t.tournamentId}?includePlayers=true&includeArenas=true`),
      t._s === 'soon' ? null : mpGet(`tournaments/${t.tournamentId}/standings`).catch(() => null),
    ]);
    const full = { ...t, ...d, _s: t._s, _place: window.MPU.placement(st, d && d.players, selected.userId) };
    if (t._s === 'done') detailCache.set(t.tournamentId, full);
    return full;
  } catch { return t; }
}

const byStart = (dir) => (a, b) => dir * (new Date(a.startUtc || 0) - new Date(b.startUtc || 0));

async function loadTournaments() {
  if (!selected) { tournaments = []; return; }
  const q = (s) => mpGet(`tournaments?played=${selected.userId}&status=${s}`);
  const [live, soon, done] = await Promise.all([q('started'), q('upcoming'), q('completed')]);
  const tag = (a, s) => (a || []).map((t) => ({ ...t, _s: s }));
  const list = [
    ...tag(live, 'live').sort(byStart(-1)).slice(0, 15),
    ...tag(soon, 'soon').sort(byStart(1)).slice(0, 15),
    ...tag(done, 'done').sort(byStart(-1)).slice(0, completedLimit),
  ];
  const detailed = await Promise.all(list.map(loadDetail));
  tournaments = detailed.filter((t) => !t.players || t.players.some((x) => String(x.userId) === String(selected.userId)));
}

const LABEL = { live: ['LIVE', 'live'], soon: ['geplant', ''], done: ['abgeschlossen', ''] };

function renderTournaments() {
  const el = $('#tList');
  if (!selected) { el.innerHTML = '<p class="muted">Namen oder IFPA-Nummer eintippen und einen Vorschlag auswählen.</p>'; return; }
  if (!tournaments.length) { el.innerHTML = `<p class="muted">Keine Turniere für ${esc(selected.name)} gefunden.</p>`; return; }
  const doneCount = tournaments.filter((t) => t._s === 'done').length;
  el.innerHTML = `<p class="muted">Spieler: <b>${esc(selected.name)}</b></p>` + tournaments.map((t) => {
    const [txt, cls] = LABEL[t._s];
    const place = t._place ? `<div><b>${t._s === 'live' ? 'Aktuell ' : ''}Platz ${t._place.position}</b> <span class="muted">von ${t._place.total}</span></div>` : '';
    return `<div class="item"><b>${esc(t.name)}</b> <span class="tag ${cls}">${txt}</span>
    <div class="muted">${esc(t.startUtc ? new Date(t.startUtc).toLocaleString('de-DE') : '')}</div>${place}
    <div>${(t.arenas || []).map((a) => `<span class="tag click" data-g="${esc(a.name)}" style="cursor:pointer">${esc(a.name)}</span>`).join(' ') || '<span class="muted">Keine Geräte hinterlegt</span>'}</div></div>`;
  }).join('') + (doneCount >= completedLimit ? '<button id="more">Mehr abgeschlossene Turniere</button>' : '');
}

async function refresh() {
  if (document.hidden || busy) return;
  busy = true;
  try {
    await loadTournaments();
    renderTournaments();
    $('#status').textContent = 'Aktualisiert ' + new Date().toLocaleTimeString('de-DE');
  } catch (e) {
    $('#status').textContent = '⚠ ' + e.message;
  } finally { busy = false; }
}

// --- Spielersuche mit Vorschlaegen ---
let sugSeq = 0;
let sugTimer;
let suggestions = [];

async function fetchUsers(q) {
  const calls = [mpGet('users?query=' + encodeURIComponent(q))];
  if (/^\d+$/.test(q)) calls.push(mpGet('users?ifpa=' + encodeURIComponent(q)).catch(() => []));
  const res = await Promise.all(calls);
  return res.flat().filter(Boolean);
}

function showSuggestions(list, msg) {
  const ul = $('#suggest');
  suggestions = list;
  ul.innerHTML = list.map((u) => `<li data-uid="${esc(u.userId)}">${esc(u.name)}${u.ifpaId ? ` <span class="muted">IFPA ${esc(u.ifpaId)}</span>` : ''}</li>`).join('')
    || (msg ? `<li class="muted">${esc(msg)}</li>` : '');
  ul.hidden = !ul.innerHTML;
}

function onType() {
  clearTimeout(sugTimer);
  const q = $('#playerName').value.trim();
  if (!q) { showSuggestions([]); return; }
  sugTimer = setTimeout(async () => {
    const seq = ++sugSeq;
    try {
      const users = window.MPU.matchUsers(await fetchUsers(q), q, 5);
      if (seq === sugSeq) showSuggestions(users, 'Kein Spieler gefunden');
    } catch (e) {
      if (seq === sugSeq) showSuggestions([], e.message);
    }
  }, 200);
}

function selectUser(u) {
  selected = { userId: u.userId, name: u.name };
  localStorage.setItem('playerSel', JSON.stringify(selected));
  detailCache.clear();
  completedLimit = 10;
  $('#playerName').value = u.name;
  showSuggestions([]);
  tournaments = [];
  $('#tList').innerHTML = '<p class="muted">Lade Turniere …</p>';
  refresh();
}

document.addEventListener('click', (e) => {
  const sug = e.target.closest('#suggest li[data-uid]');
  if (sug) return selectUser(suggestions.find((u) => String(u.userId) === sug.dataset.uid));
  if (!e.target.closest('.ac')) showSuggestions([]);
  if (e.target.id === 'more') { completedLimit += 10; return refresh(); }
  const g = e.target.closest('[data-g]');
  if (g) return showGame(g.dataset.g);
  const tab = e.target.closest('[data-tab]');
  if (tab) {
    document.querySelectorAll('nav button').forEach((b) => b.classList.toggle('active', b === tab));
    $('#tournaments').hidden = tab.dataset.tab !== 'tournaments';
    $('#games').hidden = tab.dataset.tab !== 'games';
  }
});
$('#close').onclick = () => { $('#modal').hidden = true; };
$('#search').oninput = renderGames;
$('#playerName').oninput = onType;
$('#playerForm').onsubmit = async (e) => {
  e.preventDefault();
  if (suggestions.length) return selectUser(suggestions[0]);
  const q = $('#playerName').value.trim();
  if (/^\d+$/.test(q)) {
    try { const u = await mpGet('users/' + q); if (u && u.userId) return selectUser(u); } catch { /* kein Treffer */ }
  }
  showSuggestions([], 'Kein Spieler gefunden');
};
if (selected) $('#playerName').value = selected.name;

renderGames();
renderTournaments();
refresh();
setInterval(refresh, 10000); // Auto-Refresh alle 10 s, solange die App sichtbar ist
document.addEventListener('visibilitychange', refresh);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
