window.GAMES_PARTS = (window.GAMES_PARTS || []).concat([
 { name: 'Xenon', aliases: [], maker: 'Bally', year: 1980,
  tips: [
   'Skill shot: Ball in die obere Saucer plungen; notfalls so nudgen, dass der Kickout vom oberen Bumper zurueck in die Saucer prallt.',
   'Die oberen Rollover-Buttons schlagen jeweils ein Drop Target unten um - die Saucer ist aber wichtiger als maximale Rollover-Zahl.',
   'Die linke Saucer (ueber die rechte Rampe) startet bei 5K und steigt in 5K-Schritten bis 90K; ueber 50K zeigen zwei Kreis-Lichter den Wert an (z.B. 15 + 50 = 65K).',
   'Komplette Sequenz bringt fast 1 Mio, danach sind es 90K pro Saucer-Shot.',
   'Multiball: obere Saucer 3x treffen, Lock leuchtet; Ball ueber die Rampe in die linke Saucer locken; dann obere Saucer 3x fuer Multiball.'
  ],
  strategy: [
   'Plunge auf die obere Saucer, Rollover mitnehmen, Saucer sichern.',
   'Rechte Rampe zur linken Saucer wiederholen, bis der 90K-Wert erreicht ist - das ist die Hauptpunktequelle.',
   'Lock-Zyklus (3x obere Saucer, Rampe-Lock, 3x obere Saucer) fuer Multiball einplanen.'
  ],
  sources: ['https://www.kineticist.com/games/pinball/xenon'] },
 { name: 'F-14 Tomcat', aliases: ['F14 Tomcat'], maker: 'Williams', year: 1987,
  tips: [
   'T-O-M (links) und C-A-T (rechts) Standups buchstabieren leuchtet den Lock; Lock per rechter VUK (Release/Ripoff). Blinkend rot = Lock bereit, dauerhaft rot = Ball gelockt.',
   '3 Baelle locken, TOMCAT ein weiteres Mal buchstabieren, dann rechte VUK (Release) = 4-Ball-Multiball. TOMCAT komplett im Multiball leuchtet Special an beiden Outlanes.',
   'Nummerierte Targets 1-6 leuchten der Reihe nach (1 bis 6 und zurueck); Treffer leuchtet Bonus im Flyby-Orbit und hebt den Multiplier bis max. 8X, danach Extra Ball am linken Kickback. Dazu leuchtet der 1.000-Punkte-Spinner im Flyby.',
   'Mittlere Kill/Rescue-Targets (ueber Inlanes beleuchtet) = Yagov Kill; 8 Kills (Alpha bis Golf) = Extra Ball. Nach dem ersten Kill leuchten die Inlanes die Mitte nicht mehr.',
   'Linke Inlane -> rechte VUK Combo: Launch Bonus ab 50.000, +50.000 je Award bis 250.000, plus Lock.',
   'Linker Ripoff/Yagov-Kickback schiesst den Ball sehr schnell zurueck; Flight Insurance gibt Grace-Period nach Kickback-Drain.'
  ],
  strategy: [
   'Ball cradlen, Dead Bounces vermeiden; obere TOMCAT-Targets mit den oberen Flippern, dann rechte VUK zum Locken.',
   'Im Multiball rechte VUK fuer Landings; 3 Landings = Jackpot (ca. 703.850 laut Plan).',
   'Kickback aktiv halten (Rescue-Target) und Bonus-X ueber Flyby aufbauen; Yagov nur schiessen, wenn Extra Ball naeher ist.'
  ],
  sources: ['https://pinballarchive.com/machines/f-14-tomcat', 'https://sbeckeriv.github.io/collective_plans/pinball/f14-tomcat/'] },
 { name: 'Paragon', aliases: [], maker: 'Bally', year: 1979,
  tips: [
   'Valley of Demons (ganz links) ist der wichtigste Shot: beste Bonus-Advances und hebt den Bonus-Multiplier bis 5X. Hinterhand mit dem linken Flipper moeglich, aber sehr schwer.',
   'Super Bonus bei 20K, 30K und 40K Bonus: wird fuer den Rest des Spiels ab Ball-Start behalten. Ein Advance von 19K auf 20K in Ball 1 ist effektiv ca. 41.000 Punkte wert.',
   'Golden Cliffs (obere linke Saucer): 2K, +2K pro Treffer bis 20K, Wert bleibt ueber alle Baelle. Gibt nur bei 20K einen Bonus-Advance.',
   'Obere Saucer zum 5X-Bonus: 1. Treffer 5X, 2. Treffer Extra Ball. Ein Plastikteil weist harte Shots ab - sanft lobben. Extra Balls sind in Turnieren selten deaktiviert.',
   'Scissor-Flipper unten rechts: nicht trappen, Drop Catches statt Live Catches, Flipper unten lassen, Spin beachten. Spinner nur von rechts gut machbar.',
   'Mittleres Standup nicht fuer Bonus-Advances anvisieren.'
  ],
  strategy: [
   'Bonus-Advances haben Prioritaet, Super Bonus (20K) frueh sichern - wer ihn hat, schlaegt fast sicher Spieler ohne.',
   'Plunge auf Golden Cliffs; ab Wert 20K wird es zur Top-Punktequelle.',
   'Valley of Demons und Spinner von beiden Flippern ueben, da viele Shots on the fly entstehen.'
  ],
  sources: ['https://www.kineticist.com/news/paragon-pinball-tutorial', 'https://www.kineticist.com/games/pinball/paragon'] },
 { name: 'Playboy', aliases: ['Playboy (Bally)'], maker: 'Bally', year: 1978,
  tips: [
   'Bonus-Basis ab 20K wird als Super Bonus fuer folgende Baelle gehalten; Basis geht bis 39.000. Super Bonus ist schwerer erreichbar als bei anderen Bally-Spielen der Zeit - in Ball 1 geschafft, gewinnt man oft das Spiel.',
   'Multiplier ueber alle fuenf Keys (vier obere Lanes + mittleres Key-Standup): 1. Mal 2X, 2. Mal 3X, 3. Mal 5X, danach Special (50K bei Punkte-Einstellung). Multiplier bleiben; max. Gesamtbonus 195.000 pro Ball, bis zu 100K werden gehalten.',
   'Keys komplett pro Ball: leuchtet den Grotto-Chute (unter dem oberen linken Gate) fuer 25.000; Grotto wirft den Ball nach oben zu neuen Key-Lanes und gibt Bonus-Advance je Lane.',
   'Playmate-Standups komplett leuchtet Extra-Ball-Star-Rollover oberhalb des obersten Playmate; weitere Sets leuchten Special (50K).',
   'Drop-Target- und Standup-Bank bringen je 50K, haben aber Drainrisiko und brauchen viele Shots.'
  ],
  strategy: [
   'Hauptroute UTAD: rechter Orbit vom linken Flipper, enges Gate links vom linken Bumper vom rechten Flipper; Grotto und Keys wiederholen.',
   'Nach jeder vollen Key-Serie kurz pausieren und das mittlere Key-Standup gezielt schiessen.',
   'Targets nur gezielt, wenn nur noch eines (oder zwei benachbarte) fehlt oder das letzte fuer den 20K-Super-Bonus.'
  ],
  sources: ['https://rules.silverballmania.com/rules/GrkOB-MJVvl'] },
 { name: 'Dolly Parton', aliases: [], maker: 'Bally', year: 1979,
  tips: [
   'Skill Shot: obere Saucer gibt einen PARTON-Buchstaben und Bonus-Advance; schwer, da ueber die Haelfte der Plunges daneben gehen.',
   'Erstes Inline-Drop-Target leuchtet den Spinner - sofort machen! Zweites Target 2X, drittes 3X, letztes 5X Bonus-Multiplier.',
   'Standup hinter den Inline-Drops gibt 20K, ist aber eng und Fehlschuesse drainen; dann lieber Spinner mit dem linken Flipper. Drops oft per Backhand vom rechten Flipper moeglich.',
   'Base Bonus 2K pro Buchstabe in DOLLY PARTON; PARTON-Buchstaben von Saucer und Inline-Drops, DOLLY-Buchstaben von den Standups oben links.',
   'Alle Buchstaben = Super Bonus 22K fuer den Rest des Spiels; zweiter Satz sperrt 44K. Danach gibt es ein Special - nicht abschliessen, ausser Specials geben Punkte. Max. Bonus (44K + 10x2K) x 5 = 320.000.'
  ],
  strategy: [
   'Spinner-Qualitaet pruefen: bei 10-15+ (ideal 20+) Spins pro Shot den leuchtenden Spinner dauerhaft schiessen.',
   'Sonst Inline-Drops fuer 5X Multiplier abschliessen, moeglichst frueh.',
   'Extra Ball gibt es nur ueber die Drop-Target-Completion (laut Plan in Ball 1/2 holen).'
  ],
  sources: ['https://rules.silverballmania.com/rules/G43Yq-MJ7o4', 'https://sbeckeriv.github.io/collective_plans/pinball/dolly-parton/'] },
 { name: 'Strikes and Spares', aliases: [], maker: 'Bally', year: 1978,
  tips: [
   'Skill Shot: mittlere obere Lane, besonders wenn sie fuer den Saucer-Wert leuchtet; sie leuchtet auch den Spinner.',
   'Obere drei Lanes komplettieren: Sets von drei erhoehen den Bonus-X; die mittlere Lane (wenn leuchtend, wechselt per Switches) erhoeht den Saucer-Wert.',
   'Mittlere Rollover und Standup-Targets ignorieren.',
   'Bei aktivierten Extra Balls: rechte Standup-Targets einmal komplettieren leuchtet die EB-Lane.',
   'Key Feed ist der Kickout aus der Saucer: Kontrolle holen, teils nudgen, damit kein SDTM-Drain oder Slingshot-Fall entsteht.'
  ],
  strategy: [
   'UTAD: ueber den Spinner, wenn er leuchtet, sonst ueber den rechten Orbit.',
   'Immer wieder nach oben schiessen, Lanes fuer Bonus-X abschliessen und auf einigen Shots in die Saucer fallen lassen.'
  ],
  sources: ['https://rules.silverballmania.com/rules/GrleW-MYeod', 'https://www.kineticist.com/games/pinball/strikes-and-spares'] },
 { name: 'Lethal Weapon 3', aliases: ['Lethal Weapon III'], maker: 'Data East', year: 1992,
  tips: [
   'Skill Shot: beim Ausloesen das leuchtende Leo-Target treffen = 2M.',
   'Super Lethal Weapon (6 Orbits): Verbrecher im Display per Plunger-Trigger abschiessen; 100K/200K/300K je Schuss, je laenger man wartet desto mehr - maximal, wenn die Augen blinken und "Now" angesagt wird. Zu langes Warten = nichts. 6 Treffer geben zusaetzlich 2/4/6M.',
   'Crime Simulator (Videomode): startet ueber die leuchtende Lethal-Weapon-2-Sinkhole (nicht im Multiball). Kriminelle 100K, 200K usw., Kuh 1M, 10 Treffer = 10M extra; Zivilist getroffen = Ende.',
   'Looping: Freeway (linke Rampe) startet den Timer; jede weitere linke Rampe vor Ablauf = 10M. Victory Laps: nach einem Special (nur aus Super Leo Getz) die Freeway vor Ablauf des Timers = 25M.',
   'Bonus-Multiplier bis 8X via alle drei Rollover-Lanes oder Leo-Award; danach 1M. Basis (10K + Switches x 7,5K) x Multiplier, max. 1M; gehaltener Bonus im letzten Ball zaehlt doppelt.',
   'Getaway: linke Inlane, dann rechter Orbit. Multiball-Ballsaver 3 Sekunden.'
  ],
  strategy: [
   'Leo-Skill-Shot jeden Ball versuchen (2M).',
   'Freeway-Looping sofort nutzen: 10M pro Rampe schlaegt fast alles andere.',
   'Videomode und Super Lethal Weapon mit Timing spielen, nicht hastig schiessen.'
  ],
  sources: ['https://gamefaqs.gamespot.com/pinball/916498-lethal-weapon-3/faqs/1418', 'https://gamefaqs.gamespot.com/pinball/916498-lethal-weapon-3/faqs/1417'] },
 { name: "The Who's Tommy Pinball Wizard", aliases: ['Tommy', 'Tommy Pinball Wizard'], maker: 'Data East', year: 1994,
  tips: [
   'TOMMY-Buchstaben durch Mirror-Treffer vom oberen Flipper. Vor dem ersten Multiball werden Buchstaben automatisch gespottet (1 vor Ball 1, 3 vor Ball 2, 1 vor Ball 3): In Ball 1 den Mirror einmal treffen, damit Multiball zu Beginn von Ball 2 leuchtet.',
   'TOMMY komplett leuchtet Multiball am Loch hinter dem Mirror (4 Baelle) oder an der linken Scoop (3 Baelle). Smash the Mirror = 2-Ball-Quick-Multiball mit Mirror-Jackpots 5/10/15/20/25M, dann Tommy-Loch 50M; endet bei erstem Drain.',
   'Tommy Scoring (3-Ball): jeder Switch 500K, aber Blinder verdeckt die Flipper. Im Pinball Wizard (6-Ball, nach allen 12 Union-Jack-Modes) jeder Switch 1M; W nach 25 Hits = 20M, weitere Buchstaben +25 Hits und +10M.',
   'GENIUS-Woerter: 5M, 10M, 15M, 20M, 25M, danach 25M je Wiederholung; Outlanes leuchten Special nach GENIUS oder Mystery.',
   'Mystery-Awards: Max Skill Shot (alle Skill Shots 50M), Super Pops (1M je Bumper), Million Spinners (1M pro Spin); Double Scoring verhindert Tommy-Multiball und UJ - nutzlos.',
   'Inlanes verdoppeln kurz den Spin-Wert des gegenueberliegenden Spinners, wenn sofort geschossen. Kein Kickback, kein Center Post, kein Magna Save.'
  ],
  strategy: [
   'Mirror frueh und oft vom oberen Flipper treffen; Multiball-Sequenz (Rampen + Mirror-Loch) sauber durcharbeiten.',
   'Fuer Wizard die Union-Jack-Modes durchspielen; Modes laufen im Multiball weiter (ausser Quick-Multiballs).',
   'Bei Blinder: Baelle so lange wie moeglich im Spiel halten.'
  ],
  sources: ['https://gamefaqs.gamespot.com/pinball/915960-tommy/faqs/1483', 'https://www.freeplaypinballarcade.com/rs_tommy.html'] },
 { name: 'Buck Rogers', aliases: [], maker: 'Gottlieb', year: 1980,
  tips: [
   'Das obere mittlere Captive Ball hart treffen, bis Return To Base leuchtet - erst dann sind die gelben Drop Targets links aktiv.',
   'Gelbe Drop-Target-Bank links: 5000 bei Komplettierung, Multiplier 2X bis 5X; bei 5X nur noch 5000.',
   'Ab 20K Basis-Bonus leuchtet die Collect-Saucer oben rechts; schiessen, dann weiter links UTAD.',
   'B-U-C-K: C und U Lanes werden oft nicht getroffen; B und K kommen ueber die Return Lanes, dafuer keinen Plunge verschwenden. Komplettes BUCK leuchtet rote Drop Targets fuer Special.',
   'Captive Ball ist bei schwachen Flippern oder falscher Neigung schwer - Technik anpassen.'
  ],
  strategy: [
   'Reihenfolge: Captive Ball bis Return To Base, gelbe Drops bis 5X, links UTAD bis Collect-Saucer leuchtet, Saucer, dann wieder links UTAD.',
   'Rote Drop Targets (10.000 + Bonus) nach BUCK als Special-Option mitnehmen.'
  ],
  sources: ['https://www.kineticist.com/games/pinball/buck-rogers', 'https://gamefaqs.gamespot.com/pinball/915654-buck-rogers'] },
 { name: 'Street Fighter II', aliases: ['Street Fighter 2'], maker: 'Gottlieb', year: 1993,
  tips: [
   'Gegner besiegt man, indem man den passenden Shot trifft, waehrend das weisse Licht mit seinem Namen an ist; danach Preis-Auswahl per Flipper.',
   'Nach jedem zweiten besiegten Gegner (ausser dem 12.) ist Multiball waehlbar - meist die empfohlene Wahl. Alternativ: alle 4 Barrels ueber unlit Sagat kicken oder Random Award von unlit Vega.',
   'Multiball: 8 Jackpots, einer je Shot; Rampen sind oben, also Underpass. Immer zwei blinkende Jackpot-Shots gleichzeitig.',
   'Sagat-Shot nimmt den Ball kurz vom Spielfeld und laeuft ueber 3 Switches fuer 9M pro Schuss (E.Honda/Dhalsim nur 1-2 Switches). Unlit gibt der Shot 4M und kickt 1 Barrel (nur bei angehobener linker Rampe aktiv).',
   'Vega-Shot speist den oberen Pop Bumper; mit den gruenen Targets oft mindestens 5 Target-Hits (ca. 15M) pro Schuss, wiederholtes Schiessen kann Extra Ball leuchten.',
   'Champion Challenge: alle 8 Shots leuchten; unteres rechtes Loch besiegt M.Bison und Balrog, Spirale Ken und Ryu; Zangief hebt die Rampe (Sagat), Chun-Li hebt sie (Vega) - 12 Gegner mit 10 Shots. Car Crunch: erste Runde 5M (3M Turnier-Einstellung), ca. 8 Sekunden.'
  ],
  strategy: [
   'Zwei feste Shots waehlen (rechts und links), z.B. Sagat und Vega, und wiederholen.',
   'Multiball bei jeder Gelegenheit waehlen und beide blinkenden Jackpots abarbeiten.',
   'Specials leuchten auf In-/Outlanes nach FIGHTER; Lane per Flipper rotieren.'
  ],
  sources: ['https://gamefaqs.gamespot.com/pinball/916416-street-fighter-ii/faqs/1353', 'https://freeplaypinballarcade.com/rs_streetfighter2.html'] },
 { name: "Rack 'Em Up", aliases: ['Rack Em Up'], maker: 'Gottlieb', year: 1983,
  tips: [
   'Blinkende nummerierte Pool-Ball-Targets treffen: 10.000 Punkte und +3.000 Bonus je Treffer.',
   'Der rechte Flipper wechselt, welche Baelle blinken, nur vor dem Plunge und nach dem Corner Pocket (8-Ball).',
   'Corner Pocket leuchtet das untere linke Standup fuer ein Random Award und oeffnet mehr Targets.',
   'Standup-Award wechselt mit Slingshot-Treffern: Extra Ball 150.000 oder leuchtender Spinner fuer einen Schuss (10.000 pro Spin) - vor dem Schuss pruefen.',
   'Drop-Target-Banks erhoehen den Bonus-Multiplier; er wird nicht uebertragen, Ball 3 startet aber bei 3X.'
  ],
  strategy: [
   'Vor dem Plunge per rechtem Flipper die blinkenden Baelle waehlen.',
   'Slingshots beeinflussen den Standup-Award: auf Extra Ball (150K) warten, dann Standup schiessen.',
   'In Ball 3 den 3X-Start fuer Bonus ausnutzen, Drop-Banks weiter abarbeiten.'
  ],
  sources: ['https://pinballarchive.com/machines/rack-em-up', 'https://pinball.miraheze.org/wiki/Rack_%27Em_Up'] },
 { name: 'Torch', aliases: [], maker: 'Gottlieb', year: 1980,
  tips: [
   'Roto-Target: links = A, Mitte = B, rechts = C; Symbole 1/2/3. Das Tic-Tac-Toe-Grid in der Mitte zeigt den Multiplier: gleiche Zahl in allen drei Positionen 3X, drei verschiedene Zahlen in einer Position 4X, Diagonale 2X, vier Ecken 5X, volles Grid (9) 10X. B2 wird zu Beginn gespottet.',
   'Roto dreht durch jede der 6 Lanes, das obere rechte Gate oder das Bullseye-Standup darunter; jede Outlane spottet ein Roto-Target (links aktuelle A-Zahl, rechts aktuelle C-Zahl).',
   'Obere Lanes: 5K beim ersten Mal (wenn leuchtend); beide einer Seite leuchten die Drop-Bank dieser Seite. Lanes resetten jeden Ball.',
   'Drop Targets starten bei 1K plus 1K je leuchtender Zahl: mit vollem Grid 10K pro Target.',
   'Plunge auf die linke obere Lane (hinter der Gummischeibe versteckt); Gate-Shots landen eher rechts.'
  ],
  strategy: [
   'Roto-Target vom rechten Flipper, oberes Gate von links, bis das Tic-Tac-Toe-Grid komplett (10X) ist.',
   'Danach Drop-Target-Banks abraeumen (10K je Target bei vollem Grid).',
   'Outlane-Spots fuer fehlende A-/C-Positionen mitnehmen.'
  ],
  sources: ['https://rules.silverballmania.com/rules/G4JbV-M5Rqn', 'https://www.kineticist.com/games/pinball/torch'] },
 { name: 'Harlem Globetrotters', aliases: ['Harlem Globetrotters On Tour'], maker: 'Bally', year: 1979,
  tips: [
   'Rechtes Standup oeffnet das Gate; dann die vier rechten Inline-Drops (je 5K): Multiplier 2X-3X-5X, Spinner-Wert 100-200-1000-2000 und je ein GLOBE-Buchstabe. Hoechste Prioritaet bis zur ersten Komplettierung.',
   'Obere Saucer gibt einen GLOBE-Buchstaben; GLOBE komplett = 50K je Mal und leuchtet die linke Outlane fuer 25K. Buchstaben koennen sequenziell oder zufaellig vergeben werden (Setting).',
   'Bei Sequential-Setting alle Baelle vom rechten Flipper durch den Spinner nach oben schicken statt Tap Pass zu den Inline-Targets.',
   'Extra Ball (falls an): linke Standups komplettieren, dann das versenkte Gate-Target rechts.',
   'Setting pruefen: ob die Inline-Drops nach Komplettierung wieder hochkommen. Bleiben sie unten, ist die Saucer dahinter (25K, 50K wenn Special leuchtet) ein leichter Shot.',
   'Alle fuenf Globetrotters-Standups erhoehen den Slam Dunk Shot = 50K Special. Key Feeds: Rebounds der vier Inline-Drops (manche gehen SDTM).'
  ],
  strategy: [
   'Gate oeffnen, Inline-Drops komplettieren, dann "Spinner all day".',
   'Obere Saucer fuer GLOBE und Fast Break ueber die linke Seite mitnehmen.',
   'Settings (Letter-Modus, Extra Balls, Drop-Reset) vor dem Spiel klaeren und Plan anpassen.'
  ],
  sources: ['https://www.kineticist.com/games/pinball/harlem-globetrotters-on-tour', 'https://sbeckeriv.github.io/collective_plans/pinball/harlem-globetrotters-on-tour/'] },
 { name: 'Flash Gordon', aliases: [], maker: 'Bally', year: 1981,
  tips: [
   'Skill Shot: das leuchtende Target in der oberen 3er-Bank treffen; das Licht wandert beim Plunge staendig, also Genauigkeit und Timing.',
   'Multiplier-Pfad: rechte Inline-Drops fuer 2X und 3X (plus Extra Ball, falls an), obere Drop-Bank 4X, dann linke Drop-Bank unten 5X.',
   'Das Spielfeld ist in zwei kleine Bereiche geteilt: Rebounds bleiben auf engem Raum, schnelle Nudges sind Pflicht.',
   'Drainrisiko: hoch bei Targets, mittel oben; Baelle durch den rechten Spinner oder die linke Rampe koennen mittig drainen.',
   'Gutes Spiel zum Ueben von Dead Bounce, Tap Pass, Post Pass und Alley Pass.'
  ],
  strategy: [
   'Einfachster Plan: rechte Inline-Drops, obere Bank, linke Bank bis 5X, danach UTAD.',
   'Skill Shot jeden Ball versuchen, Nudges frueh einsetzen.'
  ],
  sources: ['https://www.kineticist.com/games/pinball/flash-gordon'] },
 { name: 'Eight Ball', aliases: ['Eight Ball (Bally)'], maker: 'Bally', year: 1977,
  tips: [
   'Bonus: 3000 pro komplettiertem Ball; Baelle 1-4 ueber die oberen Lanes, 5 und 6 ueber linkes/rechtes Standup, 7 nur ueber die rechte Return Lane - nicht erzwingbar, man muss auf den Drop hoffen.',
   'Spieler 1/3 schiessen Solids (1-7), Spieler 2/4 Stripes (9-15); Ball-Fortschritt wird von Ball zu Ball gespeichert.',
   'Sind alle 7 Baelle komplett, leuchtet das 8-Ball-Target; Treffer leuchtet die rechte Outlane fuer Special und qualifiziert Super Bonus im naechsten Ball.',
   'Das 8-Ball-Pad nur schiessen, wenn der Kickback nicht leuchtet oder die 8 der letzte fehlende Ball im Rack ist.',
   'Hauptpunkte: Bonus und Spinner, dazu Candy-Cane-Shot oben rechts.'
  ],
  strategy: [
   'Links spielen bis 5X Bonus und Kickback leuchten, dann rechts Spinner-Shots.',
   'Spinner all day von rechts, Candy Cane all day von links.',
   'Super Bonus-Qualifikation im Folgeball einkalkulieren.'
  ],
  sources: ['https://www.kineticist.com/games/pinball/eight-ball', 'https://sbeckeriv.github.io/collective_plans/pinball/eight-ball/'] },
]);
