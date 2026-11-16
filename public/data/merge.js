// Fuehrt part-*.js zusammen (Duplikate nach Name entfernt) und sortiert alphabetisch.
(function () {
  const seen = new Set();
  const key = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '');
  // Recherchierte Teile haben Vorrang; die alten Eintraege aus games.js sind nur Fallback.
  window.GAMES = (window.GAMES_PARTS || []).concat(window.GAMES || [])
    .filter((g) => { const k = key(g.name); if (seen.has(k)) return false; seen.add(k); return true; })
    .map((g) => ({ aliases: [], sources: [], ...g }))
    .sort((a, b) => a.name.localeCompare(b.name));
})();
