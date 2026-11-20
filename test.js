const assert = require('assert');
const vm = require('vm');
const fs = require('fs');
const ctx = { window: {} };
const dir = __dirname + '/public/data/';
const files = ['games.js', ...fs.readdirSync(dir).filter((f) => /^part-\d+\.js$/.test(f)).sort(), 'merge.js'];
files.forEach((f) => vm.runInNewContext(fs.readFileSync(dir + f, 'utf8'), ctx));
const names = ctx.window.GAMES.map((g) => g.name);
assert.strictEqual(new Set(names).size, names.length, 'duplicate games');
ctx.window.GAMES.forEach((g) => assert(g.tips.length >= 5 && g.strategy.length >= 1, g.name));
console.log('ok', names.length, 'games');

const { matchUsers, placement, isPlayer } = require('./public/mp-utils.js');
const users = [
  { userId: 1, name: 'Marco Siemund', ifpaId: 12345 }, { userId: 2, name: 'Mara Meier', ifpaId: 999 },
  { userId: 3, name: 'Tom Marco', ifpaId: 12399 }, { userId: 1, name: 'Marco Siemund', ifpaId: 12345 },
  ...Array.from({ length: 8 }, (_, i) => ({ userId: 10 + i, name: 'Marcus ' + i, ifpaId: 500 + i })),
];
assert.strictEqual(matchUsers(users, 'mar').length, 5);
assert.strictEqual(matchUsers(users, 'marco')[0].userId, 1, 'Praefix-Treffer zuerst, keine Duplikate');
assert.deepStrictEqual(matchUsers(users, '123').map((u) => u.userId), [1, 3], 'IFPA-Praefix');
assert.deepStrictEqual(placement([{ playerId: 7, position: 3 }, { playerId: 8, position: 1 }], [{ playerId: 7, userId: 1 }], 1), { position: 3, total: 2 });
assert.strictEqual(placement(null, [], 1), null);
console.log('mp-utils ok');
assert.strictEqual(placement([{ playerId: 7, position: 2 }], [{ playerId: 7, claimedBy: 55 }], 55).position, 2, 'claimedBy');
assert(isPlayer([{ claimedBy: 1 }, { claimedBy: null }], 1) && !isPlayer([{ claimedBy: 2 }], 1) && isPlayer([{ playerId: 3 }], 1));
console.log('claimedBy ok');
const { placeClass } = require('./public/mp-utils.js');
assert.deepStrictEqual([placeClass(1, 5), placeClass(3, 100), placeClass(4, 100), placeClass(10, 100), placeClass(11, 100), placeClass(2, 8), placeClass(4, 8)], ['p-top3', 'p-top3', 'p-top10', 'p-top10', '', 'p-top3', '']);
console.log('placeClass ok');

{
  const vm = require('vm');
  const ctx = { window: {} };
  vm.runInNewContext(require('fs').readFileSync(__dirname + '/public/data/pinside.js', 'utf8'), ctx);
  const P = ctx.window.PINSIDE;
  if (P.length < 190 || P.some((p) => !p.name || !p.maker || !p.year || !p.rank)) throw new Error('pinside list invalid');
  console.log('pinside ok', P.length);
}

{
  const vm = require('vm');
  const ctx = { window: {} };
  const dir = __dirname + '/public/data/';
  ['games.js', ...require('fs').readdirSync(dir).filter((f) => /^part-\d+\.js$/.test(f)).sort(), 'merge.js']
    .forEach((f) => vm.runInNewContext(require('fs').readFileSync(dir + f, 'utf8'), ctx));
  const { matchGame } = require('./public/mp-utils.js');
  const m = (n) => (matchGame(ctx.window.GAMES, n) || {}).name || null;
  // Typische Matchplay-Geraetenamen: Varianten passen, fremde Geraete mit aehnlichem Namen nicht.
  assert.strictEqual(m('Godzilla (Premium)'), 'Godzilla');
  assert.strictEqual(m('Godzilla Pro'), 'Godzilla');
  assert.strictEqual(m('TZ'), 'Twilight Zone');
  assert.strictEqual(m('The Mandalorian (Premium/LE)'), 'The Mandalorian');
  assert.strictEqual(m('Pirates of the Caribbean (Jersey Jack)'), 'Pirates of the Caribbean (Jersey Jack)');
  ['Star Trek', 'Star Trek (Premium)', 'Indiana Jones (Stern)', 'Pirates of the Caribbean (Stern)', 'Bride of Pinbot', 'High Speed', 'Centaur II', '', null]
    .forEach((n) => assert.strictEqual(m(n), null, String(n)));
  console.log('matchGame ok');
}

// Server: Matchplay-Durchgang nur fuer erlaubte Abfragen, Bremse bei falschem Passwort.
(async () => {
  const { spawn } = require('child_process');
  const port = 3900 + Math.floor(Math.random() * 90);
  const srv = spawn(process.execPath, [__dirname + '/server.js'], { env: { ...process.env, PORT: port, EDIT_KEY: 'test-key', GITHUB_TOKEN: '', MATCHPLAY_TOKEN: '' } });
  try {
    await new Promise((ok) => srv.stdout.once('data', ok));
    const base = 'http://localhost:' + port;
    for (const p of ['users/me', 'tournaments/1/games', 'leagues', 'search/../users']) {
      assert.strictEqual((await fetch(base + '/api/mp/' + p)).status, 403, p);
    }
    const post = (key) => fetch(base + '/api/notes/x', { method: 'POST', headers: { 'x-edit-key': key }, body: '{}' }).then((r) => r.status);
    for (let i = 0; i < 10; i++) assert.strictEqual(await post('falsch' + i), 403);
    assert.strictEqual(await post('falsch'), 429, 'nach 10 Fehlversuchen gesperrt');
    assert.strictEqual(await post('test-key'), 429, 'auch richtiges Passwort waehrend der Sperre');
    console.log('server ok');
  } finally { srv.kill(); }
})().catch((e) => { console.error(e); process.exit(1); });

// Standort-Kuerzel und KI Recherche (FreePlay Herten: "K06 Indianapolis 500", "S - Medusa" ...)
{
  const { cleanName, matchGame } = require('./public/mp-utils.js');
  assert.deepStrictEqual(['K06 Indianapolis 500', 'S  Taxi', 'S - Medusa', 'K Strikes and Spares', 'E10 Centaur', 'Medusa', 'A Nightmare on Elm Street', 'F-14 Tomcat', 'X'].map(cleanName),
    ['Indianapolis 500', 'Taxi', 'Medusa', 'Strikes and Spares', 'Centaur', 'Medusa', 'A Nightmare on Elm Street', 'F-14 Tomcat', 'X']);
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(__dirname + '/public/data/ki-research.js', 'utf8'), ctx);
  const K = ctx.window.KI_RESEARCH;
  K.forEach((k) => assert(k.rules.length && k.strategy.length && /Stand \d/.test(k.source), k.name));
  assert.strictEqual(matchGame(K, 'E06 Black Knight: Swords of Rage').name, 'Black Knight: Sword of Rage');
  assert.strictEqual(matchGame(K, 'S Black Knight').year, 1980, 'alter Black Knight bekommt nicht die BKSoR-Recherche');
  assert.strictEqual(matchGame(K, 'K06 Indianapolis 500').name, 'Indianapolis 500');
  console.log('ki-research ok', K.length);
}
// Alle 49 Geraete des Freeplay Summer Cup 2026 (FreePlay Herten) haben eine KI Recherche.
{
  const { matchGame } = require('./public/mp-utils.js');
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(__dirname + '/public/data/ki-research.js', 'utf8'), ctx);
  const arenas = ['K06 Indianapolis 500', 'K10 Pin Bot', 'S Royal Rumble', 'S Deadpool', 'E10 Centaur', 'S Dolly Parton', 'S  Taxi', 'E01 Fish Tales', 'S Black Knight', 'S 6M Dollar Man', 'K16 Champion Pub', 'E05 Harlem Globetrotters', 'E11 Flash Gordon', 'K01 Eight Ball', 'K04 The Getaway', 'K02 NBA Fastbreak', 'K15 Spiderman', 'K14 Buck Rogers', 'K12 Iron Maiden', 'K03 Fun House', 'E04 Lethal Weapon 3', 'K09 Elvira Party Monsters', 'K08 The Addams Family', 'E09 Medieval Madness', 'E08 White Water', 'K05 Paragon', 'K20 Monster Bash', 'K11 Viking', 'K18 Swords of Fury', "E02 Rack 'Em Up", 'S Mandalorian', 'K17 Indiana Jones', 'E03 Whirlwind', 'E06 Black Knight: Swords of Rage', 'E07 Turtles', 'K13 Attack from Mars', 'S F-14 Tomcat', 'S Elvis', "S The Who's Tommy Pinball Wizard", 'S Torch', 'S World Cup Soccer', 'S Air Aces', "S Sharkey's Shootout", 'S Family Guy', 'S Earthshaker', 'S - Medusa', 'S Playboy', 'K Strikes and Spares', 'S Metallica (Pro)'];
  const missing = arenas.filter((a) => !matchGame(ctx.window.KI_RESEARCH, a));
  assert.deepStrictEqual(missing, [], 'ohne KI Recherche: ' + missing);
  assert.strictEqual(matchGame(ctx.window.KI_RESEARCH, 'K01 Eight Ball').year, 1977, 'Eight Ball ist nicht Eight Ball Deluxe');
  console.log('summer cup ok', arenas.length);
}
