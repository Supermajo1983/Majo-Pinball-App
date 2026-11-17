# Majo Pinball Turnier-Coach

PWA (Browser + auf Android installierbar) mit Flipper-Tipps, Turnierstrategie und Matchplay-Anbindung. Aktualisiert sich bei geöffneter App alle 10 s.

```
MATCHPLAY_TOKEN=<dein API-Token> npm start   # http://localhost:3000
npm test
```

- Matchplay-API-Token: https://app.matchplay.events/account/tokens – nur serverseitig genutzt (Proxy `/api/mp/*`, 8 s Cache).
- Android: über HTTPS hosten, in Chrome „App installieren“.
- Flipper-Daten: `public/data/games.js` (Aliase für den Abgleich mit Matchplay-Gerätenamen). Unbekannte Geräte zeigen allgemeine Tipps.
## Majo Strategie: gemeinsame, dauerhafte Notizen

Rulesheet- und Strategie-Notizen sind für alle sichtbar, bearbeiten kann nur, wer das Passwort kennt.
Umgebungsvariablen (Render → Environment):

- `EDIT_KEY`: Bearbeitungs-Passwort (ohne dieses ist Schreiben gesperrt)
- `GITHUB_TOKEN`: Fine-grained Token mit *Contents: Read and write* für dieses Repo. Die Notizen liegen als `notes.json` im Branch `data` (wird automatisch angelegt). Ohne Token werden sie nur lokal gespeichert und gehen bei Neustart verloren (Render Free).
- optional `GITHUB_REPO` (Standard `Supermajo1983/Majo-Pinball-App`), `NOTES_BRANCH` (Standard `data`)
