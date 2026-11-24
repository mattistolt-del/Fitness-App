#!/usr/bin/env node
/* Makro – Build ohne Zusatzpakete.
   Setzt src/index.html mit allen Teildateien (CSS, HTML, JS) wieder zu EINER Datei zusammen
   und legt sie mit Service Worker und Icons nach dist/.
   dist/ ist das, was auf GitHub Pages läuft UND was Capacitor in die iOS-/Android-App packt.

   Aufruf:  node scripts/build.mjs          (oder: npm run build)
            node scripts/build.mjs --watch  (baut bei jeder Änderung in src/ neu) */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, watch } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "src"), DIST = join(root, "dist"), PUBLIC = join(root, "public");

function build() {
  const t0 = Date.now();
  let html = readFileSync(join(SRC, "index.html"), "utf8");

  // Zeilen der Form  <!-- @include ordner/datei -->  durch den Dateiinhalt ersetzen
  html = html.replace(/^<!-- @include (\S+) -->$/gm, (_, file) => {
    const p = join(SRC, file);
    if (!existsSync(p)) throw new Error("Fehlt: src/" + file);
    return readFileSync(p, "utf8").replace(/\n$/, "");
  });

  // App-Icon als data-URL einbetten (so wie bisher in Version 57)
  const icon = readFileSync(join(SRC, "assets/icon-180.png")).toString("base64");
  html = html.replaceAll("@@ICON_180@@", "data:image/png;base64," + icon);

  if (/@@[A-Z0-9_]+@@|<!-- @include/.test(html)) throw new Error("Nicht ersetzter Platzhalter im Build");

  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(DIST, { recursive: true });
  writeFileSync(join(DIST, "index.html"), html);
  if (existsSync(PUBLIC)) cpSync(PUBLIC, DIST, { recursive: true });

  const v = (html.match(/const APP_VERSION = "(\d+)"/) || [])[1];
  console.log(`✓ dist/ gebaut – Version ${v}, ${(html.length / 1024).toFixed(0)} KB, ${Date.now() - t0} ms`);
}

build();

if (process.argv.includes("--watch")) {
  let timer;
  watch(SRC, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => { try { build(); } catch (e) { console.error("✗", e.message); } }, 80);
  });
  console.log("… beobachte src/ (Strg+C zum Beenden)");
}
