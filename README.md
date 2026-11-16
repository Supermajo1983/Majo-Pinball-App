# Majo Pinball Turnier-Coach

PWA (Browser + auf Android installierbar) mit Flipper-Tipps, Turnierstrategie und Matchplay-Anbindung. Aktualisiert sich bei geöffneter App alle 10 s.

```
MATCHPLAY_TOKEN=<dein API-Token> npm start   # http://localhost:3000
npm test
```

- Matchplay-API-Token: https://app.matchplay.events/account/tokens – nur serverseitig genutzt (Proxy `/api/mp/*`, 8 s Cache).
- Android: über HTTPS hosten, in Chrome „App installieren“.
- Flipper-Daten: `public/data/games.js` (Aliase für den Abgleich mit Matchplay-Gerätenamen). Unbekannte Geräte zeigen allgemeine Tipps.