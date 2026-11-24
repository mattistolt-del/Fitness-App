/* ---------- Gemeinsame Helfer ---------- */
const LOG_KEY = "makro.log", TPL_KEY = "makro.templates";
function loadJSON(k, def) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch (e) { return def; } }
function saveJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { toast("Speichern fehlgeschlagen"); } }

let log = loadJSON(LOG_KEY, []);           // Einträge im Kalorien-Tab
let templates = loadJSON(TPL_KEY, []);     // gespeicherte Mahlzeiten

const SLOTS = [
  { id: "fruehstueck", name: "Frühstück",   icon: "sunrise", color: "#f59e0b" },
  { id: "snack1",      name: "Snack",       icon: "apple", color: "#22c55e" },
  { id: "mittag",      name: "Mittagessen", icon: "utensils", color: "#f97316" },
  { id: "snack2",      name: "Snack",       icon: "cookie", color: "#ec4899" },
  { id: "abend",       name: "Abendbrot",   icon: "moon", color: "#6366f1" }
];
/* Einträge aus Version 4 einem Slot zuordnen */
log.forEach(e => {
  if (e.slot) return;
  const h = parseInt(String(e.time || "12").split(":")[0], 10);
  e.slot = h < 10 ? "fruehstueck" : h < 12 ? "snack1" : h < 15 ? "mittag" : h < 18 ? "snack2" : "abend";
});

const todayKey = () => new Date().toLocaleDateString("sv-SE");
const prod = id => products.find(x => x.id === id);
const macrosFor = (p, g) => { const k = g / 100; return { kcal: p.kcal * k, p: p.p * k, c: p.c * k, f: p.f * k }; };
const sumMacros = list => list.reduce((a, m) => ({ kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f }), { kcal: 0, p: 0, c: 0, f: 0 });
const validItems = items => items.filter(i => prod(i.id));
const itemsMacros = items => sumMacros(validItems(items).map(i => macrosFor(prod(i.id), i.g)));
const defaultGrams = p => p.pack > 0 && p.pack < 100 ? p.pack : 100;
const thumbHTML = p => p.image ? `<img class="thumb" src="${esc(p.image)}" alt="" loading="lazy">` : `<div class="thumb fi-thumb">${foodSVG(foodIconKey(p), 1, 1)}</div>`;

function macroLine(m) {
  return `<div class="macro-row">
    <span><i class="dot" style="background:var(--p)"></i><b>${Math.round(m.p)} g</b> Eiweiß</span>
    <span><i class="dot" style="background:var(--c)"></i><b>${Math.round(m.c)} g</b> Kohlenh.</span>
    <span><i class="dot" style="background:var(--f)"></i><b>${Math.round(m.f)} g</b> Fett</span>
  </div>`;
}
const totalsHTML = m => `<div class="big-kcal">${Math.round(m.kcal)} <small>kcal</small></div>${macroLine(m)}`;
function stockNote(id, g) {
  const have = stock[id] || 0;
  return g > have + 0.5
    ? `<span class="warn">${have > 0.5 ? `Nur ${fmt(have)} g da` : "Nicht im Bestand"}</span>`
    : `Noch ${fmt(have)} g da`;
}
const missingSomething = items => validItems(items).some(i => i.g > (stock[i.id] || 0) + 0.5);

/* ---------- Produkt-Auswahl (für Mahlzeiten) ---------- */
let pickCallback = null;
function openPick(cb) {
  if (!products.length) { toast("Leg zuerst Produkte an"); return; }
  pickCallback = cb;
  $("pickSearch").value = "";
  renderPick();
  $("pickSheet").classList.add("open");
}
function renderPick() {
  const term = $("pickSearch").value.toLowerCase();
  const list = products.filter(p => p.name.toLowerCase().includes(term)).sort((a, b) => a.name.localeCompare(b.name, "de"));
  $("pickList").innerHTML = list.length ? `<div class="shop-list">${list.map(p => `
    <div class="shop-item" data-pick="${p.id}" style="cursor:pointer">${thumbHTML(p)}
      <div class="item-main"><div class="item-name">${esc(p.name)}</div><div class="item-sub">${catOf(p.cat).name}</div></div>
      <span class="item-sub">${Math.round(p.kcal)} kcal/100 g</span></div>`).join("")}</div>`
    : `<div class="empty" style="padding:30px 10px">Nichts gefunden.</div>`;
  $("pickList").querySelectorAll("[data-pick]").forEach(r => r.onclick = () => {
    $("pickSheet").classList.remove("open");
    if (pickCallback) pickCallback(r.dataset.pick);
  });
}
$("pickSearch").oninput = renderPick;

/* ---------- Tab „Mahlzeiten“: feste Mahlzeiten anlegen ---------- */
const mealArtCache = new Map();
function mealImgURL(t, items) {
  const list = items.map(i => ({ k: foodIconKey(prod(i.id)), g: i.g }));
  const sig = t.id + "|" + list.map(i => i.k + ":" + Math.round(i.g / 25)).join(",");
  if (!mealArtCache.has(sig)) {
    let svg = ""; try { svg = RA4.meal(t.id, list); } catch (e) {}
    mealArtCache.set(sig, svg ? "data:image/svg+xml;charset=utf-8," + svg.replace(/"/g, "'").replace(/[\r\n%#<>{}]/g, encodeURIComponent) : "");
  }
  return mealArtCache.get(sig);
}
function renderMeals(view = $("colMeal") || $("view")) {
  if (!templates.length) {
    view.innerHTML = `<div class="empty"><div class="big">${ic("utensils")}</div>Noch keine Mahlzeiten gespeichert.<br>
      Tippe auf <b>+ Mahlzeit</b> und stell eine Mahlzeit zusammen, die du öfter isst, z. B. deine Quark-Bowl.</div>`;
    return;
  }
  view.innerHTML = [...templates].sort((a, b) => a.name.localeCompare(b.name, "de")).map(t => {
    const items = validItems(t.items), m = itemsMacros(items);
    const img = mealImgURL(t, items);
    return `<div class="card meal-card${img ? " has-img" : ""}" data-edit="${t.id}">
      ${img ? `<div class="mc-img"><img src="${img}" alt="" loading="lazy"></div>` : ""}
      <div class="mc-head"><b>${esc(t.name)}</b><span class="mc-kcal">${Math.round(m.kcal)} kcal</span></div>
      ${macroLine(m)}
      <div class="mc-ing">${items.map(i => `${esc(prod(i.id).name)} ${fmt(i.g)} g`).join(" · ")}</div>
    </div>`;
  }).join("");
  view.querySelectorAll("[data-edit]").forEach(c => c.onclick = () => openMealEditor(c.dataset.edit));
}

let editing = null;
function openMealEditor(id) {
  const t = id ? templates.find(x => x.id === id) : null;
  editing = t ? { id: t.id, name: t.name, items: validItems(t.items).map(i => ({ id: i.id, g: i.g })) } : { id: null, name: "", items: [] };
  $("meTitle").textContent = t ? "Mahlzeit bearbeiten" : "Neue Mahlzeit";
  $("meName").value = editing.name;
  $("meDelete").style.display = t ? "block" : "none";
  renderEditor();
  $("mealSheet").classList.add("open");
}

function renderEditor() {
  const items = editing.items;
  $("meList").innerHTML = items.length ? `<div class="meal-list">${items.map((i, idx) => {
    const p = prod(i.id);
    return `<div class="meal-item" data-row="${idx}">
      ${thumbHTML(p)}
      <div class="item-main"><div class="item-name">${esc(p.name)}</div><div class="item-sub">${Math.round(p.kcal)} kcal/100 g</div></div>
      <div class="gwrap">
        <div class="gbox"><input class="gin" data-idx="${idx}" type="number" inputmode="decimal" value="${i.g}">g</div>
        <span class="ik">${Math.round(macrosFor(p, i.g).kcal)} kcal</span>
      </div>
      <button class="rm" data-rm="${idx}">✕</button>
    </div>`;
  }).join("")}</div>` : `<p class="hint" style="margin:6px 4px 12px">Noch keine Zutaten.</p>`;
  $("meTotals").innerHTML = totalsHTML(itemsMacros(items));
  $("meList").querySelectorAll(".gin").forEach(inp => inp.oninput = () => {
    const it = items[Number(inp.dataset.idx)];
    it.g = Math.max(0, num(inp.value));
    inp.closest(".meal-item").querySelector(".ik").textContent = `${Math.round(macrosFor(prod(it.id), it.g).kcal)} kcal`;
    $("meTotals").innerHTML = totalsHTML(itemsMacros(items));
  });
  $("meList").querySelectorAll("[data-rm]").forEach(b => b.onclick = () => { items.splice(Number(b.dataset.rm), 1); renderEditor(); });
}

$("meName").oninput = () => { editing.name = $("meName").value; };
$("meAdd").onclick = () => openPick(id => {
  if (editing.items.some(i => i.id === id)) { toast("Ist schon drin – Gramm einfach anpassen"); return; }
  editing.items.push({ id, g: defaultGrams(prod(id)) });
  renderEditor();
});
$("meSave").onclick = () => {
  const name = $("meName").value.trim();
  const items = editing.items.filter(i => i.g > 0);
  if (!name) { toast("Gib der Mahlzeit einen Namen"); return; }
  if (!items.length) { toast("Füg mindestens eine Zutat hinzu"); return; }
  const clash = templates.find(t => t.name.toLowerCase() === name.toLowerCase() && t.id !== editing.id);
  if (clash) { toast("Diesen Namen gibt es schon"); return; }
  const tpl = { id: editing.id || Date.now().toString(36), name, items: items.map(({ id, g }) => ({ id, g })) };
  templates = editing.id ? templates.map(t => t.id === editing.id ? tpl : t) : [...templates, tpl];
  saveJSON(TPL_KEY, templates);
  $("mealSheet").classList.remove("open");
  TABS[currentTab].render();
  toast("Mahlzeit gespeichert ✓");
};
$("meDelete").onclick = () => {
  if (!confirm(`„${editing.name}“ löschen?`)) return;
  templates = templates.filter(t => t.id !== editing.id);
  saveJSON(TPL_KEY, templates);
  $("mealSheet").classList.remove("open");
  TABS[currentTab].render();
  toast("Gelöscht");
};

