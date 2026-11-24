# Makro

Kalorien & Makros tracken, Kühlschrank-Vorrat, Rezepte aus dem Bestand, Training.
Läuft als **Web-App** (GitHub Pages) und wird mit **Capacitor** zur **iOS-/Android-App**.

## Aufbau

```
src/
  index.html        Gerüst – bindet alle Teile über <!-- @include … --> ein
  head/theme.js     Hell/Dunkel, läuft vor dem ersten Zeichnen
  styles/           CSS, nach Bereichen (Reihenfolge = Nummer, wichtig für die Kaskade)
  html/             Startbildschirm & Tabs, Fenster, Training
  js/               App-Code, nach Bereichen (01-icons … 15-app-start)
  assets/           App-Icon
public/sw.js        Service Worker (nur Web, in der App aus)
public/vendor/      Scanner-Bibliothek html5-qrcode 2.3.8 (lokal statt unpkg)
assets/            Quellbilder für App-Icons & Splash (1024 px / 2732 px)
scripts/build.mjs   Build ohne Zusatzpakete → dist/
capacitor.config.json
```

Alle `js/`-Teile werden beim Build in **ein** Skript zusammengesetzt – sie teilen sich also
weiterhin denselben Gültigkeitsbereich wie vorher. Das Aufteilen hat am Verhalten nichts geändert
(Build-Ausgabe war byte-gleich mit Version 57).

## Befehle

| Befehl | Was passiert |
|---|---|
| `npm run build` | baut `dist/` (geht auch ohne `npm install`: `node scripts/build.mjs`) |
| `npm run dev` | baut bei jeder Änderung neu |
| `npm run serve` | zeigt `dist/` lokal unter http://localhost:5173 |
| `npm run ios` | baut, kopiert in das iOS-Projekt und öffnet Xcode |
| `npm run android` | dasselbe für Android Studio |
| `npm run assets` | erzeugt alle App-Icons & Splash-Größen aus `assets/` (nach `cap add ios/android`) |

## Version erhöhen

`APP_VERSION` in `src/js/15-app-start.js` hochzählen – die Web-App zeigt dann den Update-Hinweis.

## Web-Version (GitHub Pages)

Wird bei jedem Push auf `main` automatisch gebaut und veröffentlicht (`.github/workflows/pages.yml`).
Einmalig: Settings → Pages → Source: **GitHub Actions**.

## App auf dem Mac einrichten (einmalig)

1. Xcode aus dem App Store, Node.js 22 (nodejs.org), dann im Projektordner:
2. `npm install`
3. `npx cap add ios` (und später `npx cap add android`)
4. `npm run assets` (Icons & Splash in alle Größen)
5. `npm run ios` → in Xcode Team (Apple Developer Account) wählen → auf dem iPhone starten

## Scanner
- Erst die eingebaute `BarcodeDetector`-Schnittstelle, dann ZXing-WebAssembly (noch von jsdelivr),
  sonst html5-qrcode – das liegt jetzt **lokal** in `public/vendor/`, der Scanner geht also auch ohne CDN.
- In der App soll später ein nativer Scanner (ML Kit) dazukommen.
