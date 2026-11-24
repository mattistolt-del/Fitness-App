/* Eigenes Foto: verkleinert und lokal gespeichert */
$("rPhotoBtn").onclick = () => $("rPhotoIn").click();
$("rPhotoDel").onclick = () => {
  delete recipePhotos[openRecipeId]; saveJSON(PHOTO_KEY, recipePhotos);
  openRecipe(openRecipeId); renderIdeas(); toast("Foto entfernt");
};
$("rPhotoIn").onchange = () => {
  const file = $("rPhotoIn").files[0];
  $("rPhotoIn").value = "";
  if (!file) return;
  const url = URL.createObjectURL(file), img = new Image();
  img.onload = () => {
    const W = 640, H = 480, c = document.createElement("canvas");
    c.width = W; c.height = H;
    const sc = Math.max(W / img.width, H / img.height);
    const w = img.width * sc, h = img.height * sc;
    c.getContext("2d").drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    URL.revokeObjectURL(url);
    recipePhotos[openRecipeId] = c.toDataURL("image/jpeg", 0.72);
    saveJSON(PHOTO_KEY, recipePhotos);
    openRecipe(openRecipeId); renderIdeas(); toast("Foto gespeichert ✓");
  };
  img.onerror = () => toast("Foto konnte nicht geladen werden");
  img.src = url;
};
const RTYPES = { frueh: "Frühstück", haupt: "Hauptgericht", snack: "Snack", dessert: "Dessert" };
/* Ernährungsweise aus den Zutaten ableiten (optionale Zutaten kann man weglassen) */
const DIET_ING = {
  meat: ["haehnchen", "pute", "hack", "rind"], fish: ["lachs", "thunfisch", "garnelen", "fisch"],
  dairy: ["quark", "skyr", "huettenkaese", "whey", "milch", "mozzarella", "parmesan"], egg: ["eier", "eiklar", "lasagne"], honey: ["honig"]
};
function recipeDiet(r) {
  const keys = r.ing.filter(i => i[2] !== "o").map(i => i[0]), has = t => keys.some(k => DIET_ING[t].includes(k));
  const veg = !has("meat") && !has("fish");
  return { veg, vegan: veg && !has("dairy") && !has("egg") && !has("honey"), lf: !has("dairy"), nofish: !has("fish") };
}
const DIETS = [["alle", "Alles"], ["veg", "Vegetarisch"], ["vegan", "Vegan"], ["lf", "Laktosefrei"], ["nofish", "Ohne Fisch"]];
let dietFilter = null;
const curDiet = () => dietFilter ?? (profile.diet || "alle");
let ideaFilter = "alle";
let openRecipeId = null;

function matchProduct(key) {
  const d = ING[key];
  const hits = products.filter(p => {
    const n = p.name.toLowerCase();
    return d.k.some(w => n.includes(w)) && !(d.x || []).some(w => n.includes(w));
  });
  if (!hits.length) return null;
  return hits.sort((a, b) => (stock[b.id] || 0) - (stock[a.id] || 0))[0];
}

function analyzeRecipe(r) {
  const rows = r.ing.map(([key, g, opt]) => {
    const d = ING[key], p = matchProduct(key);
    const have = p ? (stock[p.id] || 0) : 0;
    const ok = !!p && have + 0.5 >= g;
    const m = p ? macrosFor(p, g) : { kcal: d.r[0] * g / 100, p: d.r[1] * g / 100, c: d.r[2] * g / 100, f: d.r[3] * g / 100 };
    return { key, name: d.n, g, opt: opt === "o", p, have, ok, m };
  });
  const missing = rows.filter(x => !x.opt && !x.ok);
  const urgent = rows.filter(x => x.p && x.have > 0.5 && daysLeft(x.p.id) !== null && daysLeft(x.p.id) <= 2).map(x => x.p.name);
  return { rows, missing, urgent, totals: sumMacros(rows.map(x => x.m)) };
}

function renderIdeas() {
  const view = $("view");
  const dF = curDiet();
  const list = RECIPES.map(r => ({ r, a: analyzeRecipe(r) }))
    .filter(({ r }) => dF === "alle" || recipeDiet(r)[dF])
    .filter(({ r, a }) =>
      ideaFilter === "alle" ? true :
      ideaFilter === "kochbar" ? a.missing.length === 0 :
      r.type === ideaFilter)
    .sort((x, y) => (x.a.missing.length - y.a.missing.length) || (y.a.urgent.length - x.a.urgent.length) || (y.a.totals.p / y.a.totals.kcal - x.a.totals.p / x.a.totals.kcal));

  const filters = [["alle", "Alle"], ["kochbar", "✓ Kann ich kochen"], ["frueh", "Frühstück"], ["haupt", "Hauptgericht"], ["dessert", "Dessert"], ["snack", "Snack"]];
  let html = `<div class="filters">${filters.map(([k, t]) => `<button data-f="${k}" class="${ideaFilter === k ? "on" : ""}">${t}</button>`).join("")}</div>
    <div class="filters diet">${ic("leaf")}${DIETS.map(([k, t]) => `<button data-df="${k}" class="${dF === k ? "on" : ""}">${t}</button>`).join("")}</div>`;
  html += list.length ? list.map(({ r, a }) => `<div class="card recipe rc" data-r="${r.id}">
      <div class="rimg">${recipeImg(r)}</div>
      <div class="rmain">
      <div class="mc-head"><b>${r.name}</b><span class="mc-kcal">${Math.round(a.totals.kcal)} kcal</span></div>
      <div class="tags">
        <span class="tag">${ic("bolt")} ${Math.round(a.totals.p)} g Eiweiß</span>
        <span class="tag grey">${Math.round(a.totals.c)} g K · ${Math.round(a.totals.f)} g F</span>
        <span class="tag grey">${RTYPES[r.type]}</span>${(d => d.vegan ? `<span class="tag veg">vegan</span>` : d.veg ? `<span class="tag veg">vegetarisch</span>` : "")(recipeDiet(r))}${a.urgent.length ? `<span class="tag exp">${ic("timer")} verbraucht ${esc(a.urgent.join(", "))}</span>` : ""}
      </div>
      ${a.missing.length ? `<div class="miss">Fehlt: ${a.missing.map(x => x.name).join(", ")}</div>` : `<div class="have">✓ Alles da</div>`}
      </div>
    </div>`).join("")
    : `<div class="empty"><div class="big">${ic("bowl")}</div>${ideaFilter === "kochbar" ? "Gerade reicht dein Bestand für kein Rezept komplett.<br>Schau unter „Alle“, was dir noch fehlt." : "Keine Rezepte gefunden."}</div>`;
  html += `<p class="hint" style="text-align:center;margin:4px 0 10px">Werte pro Portion – mit deinen Produkten berechnet, sonst mit Richtwerten.</p>`;
  view.innerHTML = html;
  view.querySelectorAll("[data-f]").forEach(b => b.onclick = () => { ideaFilter = b.dataset.f; renderIdeas(); });
  view.querySelectorAll("[data-df]").forEach(b => b.onclick = () => { dietFilter = b.dataset.df; renderIdeas(); if (typeof updateSub === "function") updateSub(); });
  view.querySelectorAll("[data-r]").forEach(c => c.onclick = () => openRecipe(c.dataset.r));
}

const slotByTime = () => { const h = new Date().getHours(); return h < 10 ? "fruehstueck" : h < 12 ? "snack1" : h < 15 ? "mittag" : h < 18 ? "snack2" : "abend"; };
$("rSlot").innerHTML = SLOTS.map(sl => `<option value="${sl.id}">${sl.name}${sl.id === "snack1" ? " (vormittags)" : sl.id === "snack2" ? " (nachmittags)" : ""}</option>`).join("");

function openRecipe(id) {
  openRecipeId = id;
  const r = RECIPES.find(x => x.id === id), a = analyzeRecipe(r);
  $("rTitle").textContent = r.name;
  $("rHero").innerHTML = recipeImg(r);
  $("rPhotoBtn").innerHTML = `${ic("camera")} ${recipePhotos[id] ? "Foto ändern" : "Eigenes Foto"}`;
  $("rPhotoDel").style.display = recipePhotos[id] ? "inline-block" : "none";
  $("rBody").innerHTML = `
    ${totalsHTML(a.totals)}
    <div class="card-title" style="margin-top:18px">Zutaten für 1 Portion</div>
    <div class="card" style="padding:4px 14px;margin-bottom:0">${a.rows.map(x => `<div class="ing">
      <div class="item-main">
        <div>${x.name}${x.opt ? ` <span class="item-sub">(optional)</span>` : ""}</div>
        <div class="item-sub">${x.p ? (x.ok ? `Dein Produkt: ${esc(x.p.name)}` : `<span class="warn">${esc(x.p.name)}: nur ${fmt(x.have)} g da</span>`) : (x.opt ? "Nicht im Bestand" : `<span class="warn">Nicht im Bestand</span>`)}</div>
      </div>
      <span class="g">${fmt(x.g)} g</span>
    </div>`).join("")}</div>
    <div class="card-title" style="margin-top:18px">So geht's</div>
    <ol class="steps">${r.steps.map(st => `<li>${st}</li>`).join("")}</ol>`;
  $("rSlot").value = r.type === "frueh" ? "fruehstueck" : slotByTime();
  cooked = 1; eaten = 1; updateCook();
  const miss = a.rows.filter(x => !x.opt && !x.ok);
  $("rToList").style.display = miss.length ? "" : "none";
  $("rToList").innerHTML = `${ic("clipboard")} Fehlendes auf die Einkaufsliste (${miss.length})`;
  $("rToList").onclick = () => { for (const x of miss) addToList(x.p ? { pid: x.p.id, name: x.p.name } : { name: x.name }); $("rToList").innerHTML = `${ic("check")} Auf der Liste`; toast(`${plural(miss.length, "Zutat", "Zutaten")} auf der Einkaufsliste ✓`); };
  $("recipeSheet").classList.add("open");
}

let cooked = 1, eaten = 1;
function updateCook() {
  eaten = Math.min(eaten, cooked);
  $("rCooked").textContent = cooked; $("rEaten").textContent = eaten;
  const rest = cooked - eaten;
  $("rRestHint").textContent = rest ? `${plural(rest, "Portion kommt", "Portionen kommen")} als Reste in den Kühlschrank` : "Keine Reste";
  $("rAdd").textContent = eaten ? "Gekocht & eintragen ✓" : "Gekocht ✓";
}
document.querySelectorAll("[data-ck]").forEach(b => b.onclick = () => { cooked = Math.max(1, Math.min(10, cooked + Number(b.dataset.ck))); if (Number(b.dataset.ck) > 0 && eaten === cooked - 1 && cooked === 2) {} updateCook(); });
document.querySelectorAll("[data-ce]").forEach(b => b.onclick = () => { eaten = Math.max(0, Math.min(cooked, eaten + Number(b.dataset.ce))); updateCook(); });
$("rAdd").onclick = () => {
  const r = RECIPES.find(x => x.id === openRecipeId), a = analyzeRecipe(r);
  let short = false;
  /* Zutaten für alle gekochten Portionen abziehen */
  const per = a.rows.filter(x => !x.opt || x.p).map(x => {
    if (!x.p) { short = true; return { id: null, name: x.name, g: x.g, deducted: 0, ...x.m }; }
    const need = x.g * cooked, have = stock[x.p.id] || 0, deducted = Math.min(have, need);
    if (need > have + 0.5) short = true;
    stock[x.p.id] = have - deducted;
    if (stock[x.p.id] < 0.5) delete stock[x.p.id];
    return { id: x.p.id, name: x.p.name, g: x.g, deducted: deducted / cooked, ...x.m };
  });
  const perTotals = sumMacros(per), now = new Date();
  if (eaten > 0) {
    log.push({
      id: now.getTime().toString(36), day: todayKey(), slot: $("rSlot").value,
      time: now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      kind: "recipe", refId: r.id, name: r.name + (eaten > 1 ? ` (${eaten} Portionen)` : ""), amount: eaten,
      items: per.map(i => ({ ...i, g: i.g * eaten, deducted: i.deducted * eaten, kcal: i.kcal * eaten, p: i.p * eaten, c: i.c * eaten, f: i.f * eaten })),
      totals: { kcal: perTotals.kcal * eaten, p: perTotals.p * eaten, c: perTotals.c * eaten, f: perTotals.f * eaten }
    });
  }
  const rest = cooked - eaten;
  if (rest > 0) {
    const ex = leftovers.find(l => l.rid === r.id && l.day === todayKey());
    if (ex) ex.portions += rest;
    else leftovers.push({ id: uid(), rid: r.id, name: r.name, portions: rest, per: perTotals, items: per.map(i => ({ id: null, name: i.name, g: i.g, kcal: i.kcal, p: i.p, c: i.c, f: i.f })), day: todayKey(), exp: addDays(3) });
  }
  saveJSON(LOG_KEY, log); saveJSON(LEFT_KEY, leftovers); saveStock();
  $("recipeSheet").classList.remove("open");
  renderIdeas();
  const msg = [eaten ? `${Math.round(perTotals.kcal * eaten)} kcal eingetragen` : "Gekocht", rest ? `${plural(rest, "Portion", "Portionen")} als Reste im Kühlschrank` : ""].filter(Boolean).join(" · ");
  toast(short ? msg + " – es fehlte etwas" : msg + " ✓");
};

$("rSave").onclick = () => {
  const r = RECIPES.find(x => x.id === openRecipeId), a = analyzeRecipe(r);
  const unknown = a.rows.filter(x => !x.opt && !x.p);
  if (unknown.length) { toast(`Leg zuerst als Produkt an: ${unknown.map(x => x.name).join(", ")}`); return; }
  if (templates.some(t => t.name.toLowerCase() === r.name.toLowerCase())) { toast("Diese Mahlzeit hast du schon gespeichert"); return; }
  templates.push({ id: Date.now().toString(36), name: r.name, items: a.rows.filter(x => x.p).map(x => ({ id: x.p.id, g: x.g })) });
  saveJSON(TPL_KEY, templates);
  toast("Unter „Mahlzeiten“ gespeichert ✓");
};

/* Rechner */
$("cAct").innerHTML = ACTIVITIES.map(a => `<option value="${a.v}">${a.t}</option>`).join("");
$("cGoal").innerHTML = Object.entries(GOALS).map(([k, g]) => `<option value="${k}">${g.t}</option>`).join("");

function readCalcForm() {
  return {
    sex: $("cSex").querySelector(".on")?.dataset.v || "m",
    age: $("cAge").value, height: $("cHeight").value, weight: $("cWeight").value,
    act: Number($("cAct").value), goal: $("cGoal").value
  };
}

function refreshCalc(fillTargets) {
  const r = calcNeeds(readCalcForm());
  if (!r) {
    $("cResult").innerHTML = "Trag Alter, Größe und Gewicht ein.";
  } else {
    $("cResult").innerHTML = `Grundumsatz: <b>${fmt(r.bmr)} kcal</b><br>
      Bedarf mit Training: <b>${fmt(r.tdee)} kcal</b><br>
      Empfehlung für dein Ziel: <b>${fmt(r.kcal)} kcal</b>`;
    if (fillTargets) { $("tKcal").value = r.kcal; $("tP").value = r.p; $("tC").value = r.c; $("tF").value = r.f; }
  }
  updateTargetHint();
}

function updateTargetHint() {
  const k = num($("tKcal").value), p = num($("tP").value), c = num($("tC").value), f = num($("tF").value);
  const sum = p * 4 + c * 4 + f * 9;
  $("tHint").innerHTML = k ? `Deine Makros ergeben ${fmt(sum)} kcal${Math.abs(sum - k) > 50 ? ` – <span class="warn">passt nicht ganz zu ${fmt(k)} kcal</span>` : " ✓"}.<br>
    Für schnelles Gewichtmachen vor Wettkämpfen plan das lieber mit deinem Trainer.` : "";
}

function openCalc() {
  $("cSex").querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.v === (profile.sex || "m")));
  $("cAge").value = profile.age || ""; $("cHeight").value = profile.height || ""; $("cWeight").value = profile.weight || "";
  $("cAct").value = String(profile.act || 1.55); $("cGoal").value = profile.goal || "halten";
  if (targets) { $("tKcal").value = targets.kcal; $("tP").value = targets.p; $("tC").value = targets.c; $("tF").value = targets.f; refreshCalc(false); }
  else refreshCalc(true);
  $("calcSheet").classList.add("open");
}

$("cSex").querySelectorAll("button").forEach(b => b.onclick = () => {
  $("cSex").querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
  refreshCalc(true);
});
["cAge", "cHeight", "cWeight"].forEach(id => $(id).oninput = () => refreshCalc(true));
["cAct", "cGoal"].forEach(id => $(id).onchange = () => refreshCalc(true));
["tKcal", "tP", "tC", "tF"].forEach(id => $(id).oninput = updateTargetHint);

$("calcSave").onclick = () => {
  const t = { kcal: Math.round(num($("tKcal").value)), p: Math.round(num($("tP").value)), c: Math.round(num($("tC").value)), f: Math.round(num($("tF").value)) };
  if (!t.kcal) { toast("Trag zuerst deine Daten ein"); return; }
  profile = readCalcForm();
  targets = t;
  saveJSON(PROFILE_KEY, profile);
  saveJSON(TARGET_KEY, targets);
  $("calcSheet").classList.remove("open");
  TABS[currentTab].render();
  toast("Tagesziel gespeichert ✓");
};

/* Fenster schließen */
document.querySelectorAll("[data-close]").forEach(b => b.onclick = () => $(b.dataset.close).classList.remove("open"));
["stockSheet", "pickSheet", "calcSheet", "mealSheet", "addSheet", "recipeSheet"].forEach(id => $(id).addEventListener("click", e => { if (e.target.id === id) $(id).classList.remove("open"); }));

