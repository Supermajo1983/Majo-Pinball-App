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
let tournaments = [];
const mpGet = async (p) => {
  const r = await fetch('/api/mp/' + p);
  if (!r.ok) throw new Error(r.status === 401 || r.status === 403 ? 'Matchplay-Token fehlt (MATCHPLAY_TOKEN am Server setzen).' : 'Matchplay-Fehler ' + r.status);
  return (await r.json()).data;
};

async function loadTournaments() {
  const player = $('#playerName').value.trim();
  localStorage.setItem('player', player);
  const [live, soon] = await Promise.all([mpGet('tournaments?status=started'), mpGet('tournaments?status=upcoming')]);
  const all = [...(live || []).map((t) => ({ ...t, _live: true })), ...(soon || [])].slice(0, 40);
  const detailed = await Promise.all(all.map(async (t) => {
    try {
      const d = await mpGet(`tournaments/${t.tournamentId}?includePlayers=true&includeArenas=true`);
      return { ...t, ...d };
    } catch { return t; }
  }));
  const p = norm(player);
  tournaments = !p ? detailed : detailed.filter((t) => (t.players || []).some((x) => norm(x.name) === p || String(x.userId) === player));
}

function renderTournaments() {
  const el = $('#tList');
  if (!localStorage.getItem('player')) { el.innerHTML = '<p class="muted">Spielernamen eingeben, um deine Turniere zu sehen.</p>'; return; }
  if (!tournaments.length) { el.innerHTML = '<p class="muted">Keine laufenden/geplanten Turniere für diesen Spieler gefunden.</p>'; return; }
  el.innerHTML = tournaments.map((t) => `<div class="item"><b>${esc(t.name)}</b>
    <span class="tag ${t._live ? 'live' : ''}">${t._live ? 'LIVE' : 'geplant'}</span>
    <div class="muted">${esc(t.startUtc ? new Date(t.startUtc).toLocaleString('de-DE') : '')}</div>
    <div>${(t.arenas || []).map((a) => `<span class="tag click" data-g="${esc(a.name)}" style="cursor:pointer">${esc(a.name)}</span>`).join(' ') || '<span class="muted">Keine Geräte hinterlegt</span>'}</div></div>`).join('');
}

async function refresh() {
  if (document.hidden) return;
  try {
    if (localStorage.getItem('player')) await loadTournaments();
    renderTournaments();
    $('#status').textContent = 'Aktualisiert ' + new Date().toLocaleTimeString('de-DE');
  } catch (e) {
    $('#status').textContent = '⚠ ' + e.message;
  }
}

document.addEventListener('click', (e) => {
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
$('#playerForm').onsubmit = (e) => { e.preventDefault(); localStorage.setItem('player', $('#playerName').value.trim()); refresh(); };
$('#playerName').value = localStorage.getItem('player') || '';

renderGames();
renderTournaments();
refresh();
setInterval(refresh, 10000); // Auto-Refresh alle 10 s, solange die App sichtbar ist
document.addEventListener('visibilitychange', refresh);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
