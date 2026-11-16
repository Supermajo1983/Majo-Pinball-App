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
