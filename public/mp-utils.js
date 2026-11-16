// Reine Hilfsfunktionen fuer die Matchplay-Anbindung (im Browser und in Node testbar).
(function (root) {
  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // Filtert Spieler nach Namensteil oder IFPA-Nummer und liefert maximal `max` Vorschlaege.
  function matchUsers(users, query, max = 5) {
    const q = norm(query);
    if (!q) return [];
    const digits = /^\d+$/.test(q);
    const seen = new Set();
    const hits = [];
    for (const u of users || []) {
      if (!u || u.userId == null || seen.has(u.userId)) continue;
      const name = norm(u.name);
      const ifpa = String(u.ifpaId ?? '');
      const ok = name.includes(q) || (digits && (ifpa.startsWith(q) || String(u.userId) === q));
      if (!ok) continue;
      seen.add(u.userId);
      hits.push({ u, rank: name.startsWith(q) || (digits && ifpa.startsWith(q)) ? 0 : 1 });
    }
    return hits.sort((a, b) => a.rank - b.rank || norm(a.u.name).localeCompare(norm(b.u.name))).slice(0, max).map((h) => h.u);
  }

  // In Turnier-Spielern steht die Matchplay-Konto-ID in claimedBy (oder userId).
  const uid = (p) => (p.claimedBy ?? p.userId);

  // true, wenn der Spieler dabei ist; ohne Konto-Angaben in der Liste wird nicht gefiltert.
  function isPlayer(players, userId) {
    if (!Array.isArray(players) || !players.some((p) => uid(p) != null)) return true;
    return players.some((p) => String(uid(p)) === String(userId));
  }

  // Platzierung eines Spielers aus Standings (playerId, position) und Spielerliste des Turniers.
  function placement(standings, players, userId) {
    if (!Array.isArray(standings) || !Array.isArray(players)) return null;
    const me = players.find((p) => String(uid(p)) === String(userId));
    if (!me) return null;
    const row = standings.find((s) => String(s.playerId) === String(me.playerId));
    if (!row || row.position == null) return null;
    return { position: row.position, total: standings.length };
  }

  const api = { matchUsers, placement, isPlayer };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MPU = api;
})(typeof window !== 'undefined' ? window : globalThis);
