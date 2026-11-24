/* ---------- Version & Update-Prüfung ---------- */
const APP_VERSION = "59";
/* Läuft die Seite in der iOS-/Android-App (Capacitor)? Dort kommen Updates über den App Store,
   nicht über die Webseite – Update-Hinweis und Service Worker bleiben dann aus. */
const IS_NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
async function checkUpdate() {
  if (IS_NATIVE || !/^https?:/.test(location.protocol)) return;
  try {
    const res = await fetch(location.pathname + "?check=" + Date.now(), { cache: "no-store" });
    const m = (await res.text()).match(/const APP_VERSION = "(\d+)"/);
    if (m && Number(m[1]) > Number(APP_VERSION)) {
      const bar = $("updateBar");
      bar.classList.add("show");
      bar.onclick = () => location.replace(location.pathname + "?v=" + m[1]);
    }
  } catch (e) {}
}
document.addEventListener("visibilitychange", () => { if (!document.hidden) checkUpdate(); });
checkUpdate();


/* ---------- Einkaufsliste ---------- */
const LIST_KEY = "makro.shoplist", LEFT_KEY = "makro.leftovers";
let shoplist = loadJSON(LIST_KEY, []);        // [{ id, pid, name, qty, done }]
let leftovers = loadJSON(LEFT_KEY, []);       // [{ id, rid, name, portions, per, items, day, exp }]
const saveList = () => saveJSON(LIST_KEY, shoplist);
function addToList({ pid = null, name, qty = 1 }) {
  const ex = shoplist.find(x => (pid && x.pid === pid) || (!pid && !x.pid && x.name.toLowerCase() === name.toLowerCase()));
  if (ex) { ex.done = false; ex.qty = Math.max(ex.qty || 1, qty); } else shoplist.push({ id: uid(), pid, name, qty, done: false });
  saveList();
}
/* Vorschläge: war schon mal gekauft und ist leer oder fast leer */
function lowStock() {
  return products.filter(p => (p.bought || inStock(p)) && (stock[p.id] || 0) < packOf(p) * .35 && !shoplist.some(x => x.pid === p.id && !x.done))
    .sort((a, b) => (stock[a.id] || 0) - (stock[b.id] || 0)).slice(0, 10);
}
function openList() { $("slIn").value = ""; $("slMatch").innerHTML = ""; renderList(); $("listSheet").classList.add("open"); }
function renderList() {
  const groups = {};
  for (const x of shoplist) { const p = x.pid && products.find(q => q.id === x.pid), c = p ? p.cat : "sonstiges"; (groups[c] = groups[c] || []).push({ x, p }); }
  const low = lowStock();
  let html = low.length ? `<div class="sl-cap">Wird knapp</div><div class="sl-sugg">${low.map(p => `<button data-sg="${p.id}">＋ ${esc(p.name)}${inStock(p) ? ` <small>${fmt(stock[p.id])} g</small>` : ""}</button>`).join("")}</div>` : "";
  if (!shoplist.length) html += `<div class="empty" style="padding:26px 10px"><div class="big">${ic("clipboard")}</div>Noch nichts auf der Liste.<br>Tipp oben etwas ein oder setz fehlende Zutaten aus einem Rezept drauf.</div>`;
  for (const cat of CATEGORIES) {
    const g = groups[cat.id]; if (!g) continue;
    g.sort((a, b) => a.x.done - b.x.done || a.x.name.localeCompare(b.x.name, "de"));
    html += `<div class="cat-title">${ic(cat.icon)} ${cat.name}</div><div class="shop-list">${g.map(({ x, p }) => `<div class="sl-item${x.done ? " done" : ""}">
      <button class="sl-chk" data-tg="${x.id}">${x.done ? ic("check") : ""}</button>
      ${p ? thumbHTML(p) : `<div class="thumb">${ic("box")}</div>`}
      <div class="item-main"><div class="item-name">${esc(x.name)}</div>${p ? `<div class="item-sub">${p.pack > 0 ? fmt(p.pack) + " g pro Packung" : "Packungsgröße fehlt"}</div>` : `<div class="item-sub">eigener Eintrag</div>`}</div>
      ${p ? `<div class="mini"><button data-q="${x.id}" data-d="-1">−</button><span>${x.qty || 1}</span><button data-q="${x.id}" data-d="1">+</button></div>` : ""}
      <button class="rm" data-rmL="${x.id}">✕</button></div>`).join("")}</div>`;
  }
  const done = shoplist.filter(x => x.done), doneProd = done.filter(x => x.pid);
  if (shoplist.length) html += `<div class="sl-actions">
    <button class="btn" id="slStore" ${doneProd.length ? "" : "disabled"}>${ic("fridge")} Abgehakte einräumen${doneProd.length ? ` (${doneProd.length})` : ""}</button>
    <button class="btn ghost" id="slClear" ${done.length ? "" : "disabled"}>Erledigte entfernen</button></div>
    <p class="hint" style="text-align:center">Abhaken im Laden – „Einräumen“ legt alles direkt in den Kühlschrank.</p>`;
  $("slBody").innerHTML = html;
  const B = $("slBody");
  B.querySelectorAll("[data-sg]").forEach(b => b.onclick = () => { const p = products.find(q => q.id === b.dataset.sg); addToList({ pid: p.id, name: p.name }); renderList(); });
  B.querySelectorAll("[data-tg]").forEach(b => b.onclick = () => { const x = shoplist.find(q => q.id === b.dataset.tg); x.done = !x.done; saveList(); renderList(); });
  B.querySelectorAll("[data-q]").forEach(b => b.onclick = () => { const x = shoplist.find(q => q.id === b.dataset.q); x.qty = Math.max(1, (x.qty || 1) + Number(b.dataset.d)); saveList(); renderList(); });
  B.querySelectorAll("[data-rml]").forEach(b => b.onclick = () => { shoplist = shoplist.filter(q => q.id !== b.dataset.rml); saveList(); renderList(); });
  if ($("slStore")) $("slStore").onclick = () => {
    let n = 0, skip = [];
    for (const x of doneProd) {
      const p = products.find(q => q.id === x.pid); if (!p) continue;
      if (!(p.pack > 0)) { skip.push(p.name); continue; }
      setExpiryOnAdd(p, inStock(p)); stock[p.id] = (stock[p.id] || 0) + (x.qty || 1) * p.pack; p.bought = true; n += x.qty || 1;
      shoplist = shoplist.filter(q => q !== x);
    }
    saveList(); saveProducts(); saveStock(); renderList(); if (currentTab === "kuehlschrank") renderFridge();
    toast(skip.length ? `Packungsgröße fehlt: ${skip.join(", ")}` : `${plural(n, "Packung", "Packungen")} eingeräumt ✓`);
  };
  if ($("slClear")) $("slClear").onclick = () => { shoplist = shoplist.filter(x => !x.done); saveList(); renderList(); };
}
function slAdd() {
  const t = $("slIn").value.trim(); if (!t) return;
  const p = products.find(q => q.name.toLowerCase() === t.toLowerCase());
  addToList(p ? { pid: p.id, name: p.name } : { name: t });
  $("slIn").value = ""; $("slMatch").innerHTML = ""; renderList();
}
$("slAddBtn").onclick = slAdd;
$("slIn").onkeydown = e => { if (e.key === "Enter") slAdd(); };
$("slIn").oninput = () => {
  const t = $("slIn").value.trim().toLowerCase();
  const m = t ? products.filter(p => p.name.toLowerCase().includes(t)).slice(0, 6) : [];
  $("slMatch").innerHTML = m.length ? `<div class="sl-sugg">${m.map(p => `<button data-mp="${p.id}">＋ ${esc(p.name)}</button>`).join("")}</div>` : "";
  $("slMatch").querySelectorAll("[data-mp]").forEach(b => b.onclick = () => { const p = products.find(q => q.id === b.dataset.mp); addToList({ pid: p.id, name: p.name }); $("slIn").value = ""; $("slMatch").innerHTML = ""; renderList(); });
};

/* ---------- Reste ---------- */
function eatLeftover(id, slot) {
  const l = leftovers.find(x => x.id === id); if (!l) return;
  const now = new Date();
  log.push({ id: now.getTime().toString(36), day: viewDay || todayKey(), slot, time: now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
    kind: "rest", refId: l.rid, name: l.name + " (Reste)", amount: 1, items: (l.items || []).map(i => ({ ...i, deducted: 0 })), totals: { ...l.per } });
  l.portions--; if (l.portions <= 0) leftovers = leftovers.filter(x => x !== l);
  saveJSON(LOG_KEY, log); saveJSON(LEFT_KEY, leftovers);
  toast(`${Math.round(l.per.kcal)} kcal eingetragen ✓`);
  if (currentTab === "kuehlschrank") renderFridge(); else if (currentTab === "heute") renderToday();
}

/* ---------- Einführung beim ersten Start ---------- */
const ONB_KEY = "makro.onboarded";
let onbStep = 0, onbData = {}, onbShown = -1;
const LOGO_SVG = (document.querySelector(".sp-logo") || { outerHTML: "" }).outerHTML;
const ONB_STEPS = 4;
function shouldOnboard() { return !localStorage.getItem(ONB_KEY) && !targets && !products.length && !log.length && !workouts.length; }
function openOnboarding() {
  onbStep = 0; onbShown = -1;
  onbData = { goal: profile.goal || "halten", diet: profile.diet || "alle", sex: profile.sex || "m", age: profile.age || "", height: profile.height || "", weight: profile.weight || "", act: profile.act || 1.55 };
  $("onb").classList.add("open"); renderOnb();
}
function closeOnboarding() { localStorage.setItem(ONB_KEY, "1"); $("onb").classList.remove("open"); TABS[currentTab].render(); if (typeof updateSub === "function") updateSub(); }
function renderOnb() {
  const d = onbData, B = $("onbBody");
  $("onbDots").innerHTML = Array.from({ length: ONB_STEPS }, (_, i) => `<i class="${i === onbStep ? "on" : i < onbStep ? "done" : ""}"></i>`).join("");
  $("onbBack").style.visibility = onbStep ? "visible" : "hidden";
  $("onbSkip").style.visibility = onbStep < ONB_STEPS - 1 ? "visible" : "hidden";
  const opt = (name, val, title, sub, icon) => `<button class="onb-opt${d[name] == val ? " on" : ""}" data-o="${name}" data-v="${val}">${icon ? `<span class="oi">${ic(icon)}</span>` : ""}<span><b>${title}</b>${sub ? `<small>${sub}</small>` : ""}</span><span class="ock">${ic("check")}</span></button>`;
  if (onbStep === 0) {
    B.innerHTML = `<div class="onb-hero">${LOGO_SVG.replace('class="sp-logo"', 'class="onb-logo"').replace(/id="sp/g, 'id="ob').replace(/url\(#sp/g, "url(#ob").replace(' class="sp-ring"', "")}</div>
      <h1>Willkommen bei Makro</h1>
      <p class="onb-lead">Deine Ernährung, dein Vorrat und dein Training – in einer App.</p>
      <div class="onb-feats">
        <div>${ic("flame")}<span><b>Kalorien & Makros</b><small>Barcode scannen, Mahlzeiten speichern, Ziel im Blick</small></span></div>
        <div>${ic("fridge")}<span><b>Kühlschrank</b><small>Weiß, was du hast – und was bald abläuft</small></span></div>
        <div>${ic("pot")}<span><b>Rezepte</b><small>Fitness-Gerichte aus dem, was da ist</small></span></div>
        <div>${ic("dumbbell")}<span><b>Training</b><small>Pläne, Sätze, Rekorde</small></span></div>
      </div>`;
    $("onbNext").textContent = "Los geht's";
  } else if (onbStep === 1) {
    B.innerHTML = `<h2>Was ist dein Ziel?</h2>
      ${opt("goal", "diaet", "Abnehmen", "Leichtes Kaloriendefizit, viel Eiweiß", "trend")}
      ${opt("goal", "halten", "Gewicht halten", "Fit bleiben, gesund essen", "scale")}
      ${opt("goal", "aufbau", "Muskeln aufbauen", "Leichter Überschuss, viel Eiweiß", "dumbbell")}
      <h2 style="margin-top:22px">Wie isst du?</h2>
      <div class="onb-chips">${DIETS.map(([k, t]) => `<button class="${d.diet === k ? "on" : ""}" data-diet="${k}">${k === "alle" ? "Alles" : t}</button>`).join("")}</div>
      <p class="onb-note">Danach richten sich die Rezeptvorschläge. Änderbar jederzeit in den Rezepten.</p>`;
    $("onbNext").textContent = "Weiter";
  } else if (onbStep === 2) {
    B.innerHTML = `<h2>Ein paar Daten für dein Tagesziel</h2>
      <p class="onb-note" style="margin-top:-6px">Damit berechnen wir Kalorien und Makros. Bleibt alles auf deinem Gerät.</p>
      <div class="seg" id="oSex"><button data-v="m" class="${d.sex === "m" ? "on" : ""}">Männlich</button><button data-v="w" class="${d.sex === "w" ? "on" : ""}">Weiblich</button></div>
      <div class="grid2" style="grid-template-columns:1fr 1fr 1fr;margin-top:12px">
        <div><label>Alter</label><input id="oAge" inputmode="numeric" type="text" placeholder="25" value="${d.age}"></div>
        <div><label>Größe (cm)</label><input id="oH" inputmode="numeric" type="text" placeholder="178" value="${d.height}"></div>
        <div><label>Gewicht (kg)</label><input id="oW" inputmode="decimal" type="text" placeholder="75" value="${d.weight}"></div>
      </div>
      <label>Wie aktiv bist du?</label>
      <select id="oAct">${ACTIVITIES.map(a => `<option value="${a.v}" ${String(a.v) === String(d.act) ? "selected" : ""}>${a.t}</option>`).join("")}</select>
      <div class="onb-result" id="oRes"></div>`;
    const upd = () => {
      d.age = $("oAge").value; d.height = $("oH").value; d.weight = $("oW").value.replace(",", "."); d.act = $("oAct").value;
      const r = calcNeeds({ sex: d.sex, age: d.age, height: d.height, weight: d.weight, act: d.act, goal: d.goal });
      $("oRes").innerHTML = r ? `<div><b>${fmt(r.kcal)}</b><small>kcal am Tag</small></div><div><b>${r.p} g</b><small>Eiweiß</small></div><div><b>${r.c} g</b><small>Kohlenh.</small></div><div><b>${r.f} g</b><small>Fett</small></div>` : `<span class="onb-note">Trag Alter, Größe und Gewicht ein.</span>`;
      d.calc = r;
    };
    ["oAge", "oH", "oW"].forEach(i => $(i).oninput = upd); $("oAct").onchange = upd;
    $("oSex").querySelectorAll("button").forEach(b => b.onclick = () => { d.sex = b.dataset.v; $("oSex").querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b)); upd(); });
    upd();
    $("onbNext").textContent = "Weiter";
  } else {
    B.innerHTML = `<div class="onb-hero big">${ic("check")}</div><h1>Alles bereit!</h1>
      <p class="onb-lead">${d.calc ? `Dein Tagesziel: <b>${fmt(d.calc.kcal)} kcal</b> und <b>${d.calc.p} g Eiweiß</b>.` : "Dein Tagesziel kannst du jederzeit im Kalorien-Tab berechnen."}</p>
      <div class="onb-feats">
        <div>${ic("camera")}<span><b>1. Erstes Lebensmittel scannen</b><small>Produkte › + › Barcode scannen</small></span></div>
        <div>${ic("cart")}<span><b>2. Einkauf einräumen</b><small>Kühlschrank › Einkaufen</small></span></div>
        <div>${ic("shield")}<span><b>3. Ab und zu ein Backup</b><small>Zahnrad oben rechts</small></span></div>
      </div>`;
    $("onbNext").textContent = "App starten";
  }
  B.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { d[b.dataset.o] = b.dataset.v; renderOnb(); });
  B.querySelectorAll("[data-diet]").forEach(b => b.onclick = () => { d.diet = b.dataset.diet; renderOnb(); });
  if (onbShown !== onbStep) { B.classList.remove("anim"); void B.offsetWidth; B.classList.add("anim"); B.scrollTop = 0; onbShown = onbStep; }
}
$("onbNext").onclick = () => {
  if (onbStep === 2 && onbData.calc) {
    profile = { ...profile, sex: onbData.sex, age: onbData.age, height: onbData.height, weight: onbData.weight, act: Number(onbData.act), goal: onbData.goal };
    targets = { kcal: onbData.calc.kcal, p: onbData.calc.p, c: onbData.calc.c, f: onbData.calc.f };
    saveJSON(TARGET_KEY, targets);
    const w = num(onbData.weight); if (w > 25 && w < 300 && !Object.keys(weights).length) { weights[todayKey()] = Math.round(w * 10) / 10; saveJSON(WEIGHT_KEY, weights); }
  }
  profile.diet = onbData.diet; profile.goal = onbData.goal; saveJSON(PROFILE_KEY, profile);
  if (onbStep < ONB_STEPS - 1) { onbStep++; renderOnb(); } else closeOnboarding();
};
$("onbBack").onclick = () => { if (onbStep) { onbStep--; renderOnb(); } };
$("onbSkip").onclick = () => { profile.diet = onbData.diet; profile.goal = onbData.goal; saveJSON(PROFILE_KEY, profile); closeOnboarding(); };

/* ---------- Einstellungen & Backup ---------- */
const BACKUP_KEY = "makro.lastBackup";
const allKeys = () => { const k = []; for (let i = 0; i < localStorage.length; i++) { const n = localStorage.key(i); if (n && n.startsWith("makro.") && n !== BACKUP_KEY) k.push(n); } return k.sort(); };
const fmtDate = t => new Date(t).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
function backupData() {
  const data = {}; for (const k of allKeys()) data[k] = localStorage.getItem(k);
  return { app: "Makro", format: 1, version: APP_VERSION, created: new Date().toISOString(), data };
}
async function saveBackup() {
  const json = JSON.stringify(backupData());
  const name = `Makro-Backup-${todayKey()}.json`;
  const file = new File([json], name, { type: "application/json" });
  let ok = false;
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "Makro-Backup" }); ok = true; }
  } catch (e) { if (e && e.name === "AbortError") return; }
  if (!ok) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(file); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  try { localStorage.setItem(BACKUP_KEY, String(Date.now())); } catch (e) {}
  renderSettings(); updateBackupNudge(); toast("Backup gespeichert ✓");
}
function restoreBackup(file) {
  const r = new FileReader();
  r.onload = () => {
    let b; try { b = JSON.parse(r.result); } catch (e) { toast("Das ist keine Backup-Datei"); return; }
    if (!b || b.app !== "Makro" || !b.data || typeof b.data !== "object") { toast("Das ist keine Makro-Backup-Datei"); return; }
    const n = Object.keys(b.data).length;
    if (!confirm(`Backup vom ${fmtDate(b.created)} laden?\n\nAlle aktuellen Daten in der App werden durch das Backup ersetzt (${n} Bereiche).`)) return;
    for (const k of allKeys()) localStorage.removeItem(k);
    for (const [k, v] of Object.entries(b.data)) if (k.startsWith("makro.") && typeof v === "string") localStorage.setItem(k, v);
    try { localStorage.setItem(BACKUP_KEY, String(Date.now())); } catch (e) {}
    toast("Backup geladen – App startet neu …");
    setTimeout(() => location.reload(), 900);
  };
  r.readAsText(file);
}
function storageSize() { let n = 0; for (const k of allKeys()) n += (localStorage.getItem(k) || "").length + k.length; return n * 2; }
function renderSettings() {
  const last = +(localStorage.getItem(BACKUP_KEY) || 0);
  const days = last ? Math.floor((Date.now() - last) / 864e5) : null;
  const kb = Math.max(1, Math.round(storageSize() / 1024));
  const row = (icon, title, sub, id, cls = "") => `<button class="set-row ${cls}" id="${id}"><span class="set-ic">${ic(icon)}</span><span class="set-main"><b>${title}</b><small>${sub}</small></span><span class="set-ch">›</span></button>`;
  $("setBody").innerHTML = `
    <div class="set-status ${days === null || days > 7 ? "warn" : "ok"}">${ic("shield")}<div><b>${days === null ? "Noch kein Backup" : days === 0 ? "Backup heute gespeichert" : `Letztes Backup vor ${days} ${days === 1 ? "Tag" : "Tagen"}`}</b>
      <small>${days === null || days > 7 ? "Deine Daten liegen nur in Safari auf diesem Gerät. Speichere ein Backup, z. B. in iCloud Drive." : "Gut so – am besten ca. einmal pro Woche."}</small></div></div>
    <div class="set-group">
      ${row("download", "Backup speichern", "Als Datei sichern – z. B. „In Dateien sichern“ › iCloud Drive", "setSave")}
      ${row("upload", "Backup laden", "Daten aus einer Backup-Datei wiederherstellen", "setLoad")}
    </div>
    <div class="set-cap">Deine Daten</div>
    <div class="set-group set-stats">
      <div><b>${products.length}</b><small>Lebensmittel</small></div><div><b>${templates.length}</b><small>Mahlzeiten</small></div>
      <div><b>${log.length}</b><small>Einträge</small></div><div><b>${Object.keys(weights).length}</b><small>Gewichte</small></div>
      <div><b>${workouts.length}</b><small>Trainings</small></div><div><b>${kb} KB</b><small>Speicher</small></div>
    </div>
    <div class="set-group">
      ${row("user", "Profil & Kalorienziel", targets ? `${fmt(targets.kcal)} kcal · ${Math.round(targets.p)} g Eiweiß` : "Noch nicht berechnet", "setProfile")}
      ${row("leaf", "Ernährungsweise", (DIETS.find(x => x[0] === (profile.diet || "alle")) || DIETS[0])[1], "setDiet")}
      ${row("run", "Sport-Kalorien zum Tagesziel", profile.addBurn ? "An – verbrannte kcal kommen dazu" : "Aus – dein Ziel enthält schon deine Aktivität", "setBurn")}
      ${row("box", "Kühlschrank-Bilder", usePhotos() ? "Produktfotos (ohne Foto: Symbol)" : "Gezeichnete Symbole", "setPhotos")}
      ${row("moon", "Erscheinungsbild", THEMES.find(x => x[0] === curTheme())[1], "setTheme")}
      ${row("sparkles", "Einführung ansehen", "Die kurze Tour vom ersten Start", "setOnb")}
    </div>
    <div class="set-group">${row("trash", "Alle Daten löschen", "Setzt die App komplett zurück", "setWipe", "danger")}</div>
    <p class="set-foot">Makro · Version ${APP_VERSION}<br>Alle Daten bleiben auf deinem Gerät – nichts wird hochgeladen.</p>`;
  $("setSave").onclick = saveBackup;
  $("setLoad").onclick = () => { $("restoreIn").value = ""; $("restoreIn").click(); };
  $("setProfile").onclick = () => { $("setSheet").classList.remove("open"); openCalc(); };
  $("setDiet").onclick = () => { const i = DIETS.findIndex(x => x[0] === (profile.diet || "alle")); profile.diet = DIETS[(i + 1) % DIETS.length][0]; dietFilter = null; saveJSON(PROFILE_KEY, profile); renderSettings(); if (currentTab === "vorschlaege") renderIdeas(); };
  $("setBurn").onclick = () => { profile.addBurn = !profile.addBurn; saveJSON(PROFILE_KEY, profile); renderSettings(); if (currentTab === "heute") renderToday(); };
  $("setPhotos").onclick = () => { profile.fridgePhotos = !usePhotos(); saveJSON(PROFILE_KEY, profile); renderSettings(); };
  $("setTheme").onclick = () => { const i = THEMES.findIndex(x => x[0] === curTheme()); const t = THEMES[(i + 1) % THEMES.length][0]; localStorage.setItem("makro.theme", t); applyTheme(t); renderSettings(); };
  $("setOnb").onclick = () => { $("setSheet").classList.remove("open"); openOnboarding(); };
  $("setWipe").onclick = () => {
    if (!confirm("Wirklich ALLE Daten löschen? Produkte, Kühlschrank, Mahlzeiten, Einträge, Gewicht und Trainings sind dann weg.")) return;
    if (!confirm("Letzte Sicherheitsabfrage: Hast du ein Backup? Löschen kann nicht rückgängig gemacht werden.")) return;
    for (const k of allKeys()) localStorage.removeItem(k);
    localStorage.removeItem(BACKUP_KEY);
    toast("Alle Daten gelöscht"); setTimeout(() => location.reload(), 700);
  };
}
function openSettings() { renderSettings(); $("setSheet").classList.add("open"); document.querySelector("#setSheet .sheet").scrollTop = 0; }
const THEMES = [["light", "Hell"], ["dark", "Dunkel"], ["auto", "Wie das Gerät"]];
const curTheme = () => { const t = localStorage.getItem("makro.theme"); return THEMES.some(x => x[0] === t) ? t : "light"; };
$("setBtn").onclick = openSettings;
$("setClose").onclick = () => $("setSheet").classList.remove("open");
$("setSheet").addEventListener("click", e => { if (e.target.id === "setSheet") $("setSheet").classList.remove("open"); });
$("restoreIn").onchange = () => { const f = $("restoreIn").files[0]; if (f) restoreBackup(f); };
/* Hinweis, wenn lange kein Backup gemacht wurde (nur wenn es schon Daten gibt) */
function updateBackupNudge() {
  const el = $("backupNudge"), last = +(localStorage.getItem(BACKUP_KEY) || 0);
  const hasData = products.length + log.length + workouts.length + Object.keys(weights).length >= 5;
  const due = hasData && (!last || Date.now() - last > 14 * 864e5);
  const snoozed = +(localStorage.getItem("makro.nudgeSnooze") || 0) > Date.now();
  el.classList.toggle("show", due && !snoozed);
  el.innerHTML = `${ic("shield")}<span>${last ? "Dein letztes Backup ist über 2 Wochen alt." : "Sichere deine Daten mit einem Backup."}</span><button id="nudgeGo">Jetzt</button><button id="nudgeX" aria-label="Später">✕</button>`;
  $("nudgeGo").onclick = () => { openSettings(); };
  $("nudgeX").onclick = () => { localStorage.setItem("makro.nudgeSnooze", String(Date.now() + 3 * 864e5)); el.classList.remove("show"); };
}
/* Offline: Service Worker (Datei sw.js liegt neben index.html) */
if (!IS_NATIVE && "serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
window.addEventListener("offline", () => toast("Offline – deine Daten funktionieren weiter, nur die Produktsuche braucht Internet"));
/* Safari bitten, die Daten nicht automatisch zu löschen */
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

/* ---------- Start ---------- */
fillIcons();
updateBackupNudge();
showTab("heute");
if (shouldOnboard()) openOnboarding();
setTimeout(() => { const sp = $("splash"); if (!sp) return; sp.classList.add("hide"); setTimeout(() => sp.remove(), 500); }, 1100);
