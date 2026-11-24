/* ---------- Tab „Kalorien“ ---------- */
const PROFILE_KEY = "makro.profile", TARGET_KEY = "makro.targets";
let profile = loadJSON(PROFILE_KEY, { sex: "m", age: "", height: "", weight: "", act: 1.55, goal: "halten" });
let targets = loadJSON(TARGET_KEY, null);
let viewDay = null; // null = heute

const ACTIVITIES = [
  { v: 1.2,   t: "Kaum Bewegung" },
  { v: 1.375, t: "1–3× Training pro Woche" },
  { v: 1.55,  t: "3–5× Training pro Woche" },
  { v: 1.725, t: "6–7× Training pro Woche" },
  { v: 1.9,   t: "Leistungssport, oft 2× täglich" }
];
const GOALS = {
  aufbau:  { t: "Muskelaufbau (+300 kcal)",    d: 300,  p: 2.0 },
  halten:  { t: "Gewicht halten",              d: 0,    p: 1.8 },
  diaet:   { t: "Leicht abnehmen (−300 kcal)", d: -300, p: 2.2 },
  gewicht: { t: "Gewicht machen (−500 kcal)",  d: -500, p: 2.4 }
};

function calcNeeds(pf) {
  const a = num(pf.age), h = num(pf.height), w = num(pf.weight);
  if (!(a > 0 && h > 0 && w > 0)) return null;
  const bmr = 10 * w + 6.25 * h - 5 * a + (pf.sex === "w" ? -161 : 5);   // Mifflin-St Jeor
  const tdee = bmr * Number(pf.act);
  const g = GOALS[pf.goal] || GOALS.halten;
  const kcal = Math.round((tdee + g.d) / 10) * 10;
  const p = Math.round(w * g.p);
  const f = Math.round(w * 0.9);
  const c = Math.max(0, Math.round((kcal - p * 4 - f * 9) / 4));
  return { bmr, tdee, kcal, p, c, f };
}

const dayShift = (day, n) => { const d = new Date(day + "T12:00"); d.setDate(d.getDate() + n); return d.toLocaleDateString("sv-SE"); };
const dayLabel = day => {
  const t = todayKey();
  if (day === t) return "Heute";
  if (day === dayShift(t, -1)) return "Gestern";
  return new Date(day + "T12:00").toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
};

function barHTML(label, val, goal, color) {
  const pct = goal ? Math.min(100, val / goal * 100) : 0;
  return `<div class="bar-row">
    <div class="bar-head"><span><b>${label}</b></span><span>${Math.round(val)} / ${Math.round(goal)} g</span></div>
    <div class="bar"><i style="width:${pct}%;background:${color}"></i></div>
  </div>`;
}

function amountText(e) {
  if (e.kind === "product") return `${fmt(e.amount)} g`;
  if (e.kind === "recipe") return "1 Portion (Rezept)";
  if (e.kind === "dish") return `${e.amount === 1 ? "1 Portion" : `${String(e.amount).replace(".", ",")} Portionen`} · Ø-Wert`;
  if (e.kind === "meal") return e.amount === 1 ? "1 Portion" : `${String(e.amount).replace(".", ",")} Portionen`;
  return "";
}

/* ---------- Körpergewicht ---------- */
const WEIGHT_KEY = "makro.weights", WGOAL_KEY = "makro.weightGoal", WVIEW_KEY = "makro.weightView";
let weights = loadJSON(WEIGHT_KEY, {});            // { "2026-11-03": 77.4 }
let weightGoal = loadJSON(WGOAL_KEY, null);
let weightView = loadJSON(WVIEW_KEY, "tage");
const kg1 = v => (Math.round(v * 10) / 10).toFixed(1).replace(".", ",");
const sortedWeightDays = () => Object.keys(weights).filter(d => weights[d] > 0).sort();
const dateOf = d => new Date(d + "T12:00");
function weekStart(day) { const d = dateOf(day), wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return d.toLocaleDateString("sv-SE"); }
function isoWeekNo(day) { const d = dateOf(day); d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7); const y = new Date(d.getFullYear(), 0, 4); return 1 + Math.round(((d - y) / 864e5 - 3 + (y.getDay() + 6) % 7) / 7); }
const avg = a => a.reduce((x, y) => x + y, 0) / a.length;

/* Punkte je nach Ansicht: Tage (30), Wochen (12), Monate (12), Gesamt */
function weightSeries(view) {
  const days = sortedWeightDays();
  if (!days.length) return [];
  const today = todayKey();
  if (view === "tage") {
    const from = dayShift(today, -29);
    return days.filter(d => d >= from).map(d => ({ t: dateOf(d).getTime(), v: weights[d], lab: dateOf(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }) }));
  }
  const groups = {};
  for (const d of days) {
    const k = view === "monate" ? d.slice(0, 7) : weekStart(d);
    (groups[k] = groups[k] || []).push(weights[d]);
  }
  let keys = Object.keys(groups).sort();
  if (view === "wochen") keys = keys.filter(k => k >= weekStart(dayShift(today, -7 * 11)));
  if (view === "monate") { const lim = new Date(); lim.setMonth(lim.getMonth() - 11); keys = keys.filter(k => k >= lim.toLocaleDateString("sv-SE").slice(0, 7)); }
  return keys.map(k => {
    const t = view === "monate" ? dateOf(k + "-15").getTime() : dateOf(k).getTime() + 3 * 864e5;
    const lab = view === "monate" ? dateOf(k + "-15").toLocaleDateString("de-DE", { month: "short", year: "2-digit" }) : (view === "wochen" ? `KW ${isoWeekNo(k)}` : dateOf(k).toLocaleDateString("de-DE", { month: "short", year: "2-digit" }));
    return { t, v: avg(groups[k]), lab, n: groups[k].length };
  });
}

function weightChart(pts, view) {
  const W = 330, H = 120, pl = 34, pr = 10, pt = 14, pb = 20;
  if (!pts.length) return `<div class="w-empty">Noch keine Einträge – trag oben dein Gewicht ein.</div>`;
  const vals = pts.map(p => p.v).concat(weightGoal ? [weightGoal] : []);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = Math.max(.4, (hi - lo) * .18); lo -= pad; hi += pad;
  const t0 = pts[0].t, t1 = pts[pts.length - 1].t;
  const X = t => t1 === t0 ? (pl + W - pr) / 2 : pl + (t - t0) / (t1 - t0) * (W - pl - pr);
  const Y = v => pt + (1 - (v - lo) / (hi - lo)) * (H - pt - pb);
  const f = n => n.toFixed(1);
  /* weiche Linie */
  const P = pts.map(p => [X(p.t), Y(p.v)]);
  let line = `M${f(P[0][0])} ${f(P[0][1])}`;
  for (let i = 1; i < P.length; i++) { const [x0, y0] = P[i - 1], [x1, y1] = P[i], cx = (x0 + x1) / 2; line += `C${f(cx)} ${f(y0)} ${f(cx)} ${f(y1)} ${f(x1)} ${f(y1)}`; }
  const area = `${line}L${f(P[P.length - 1][0])} ${H - pb}L${f(P[0][0])} ${H - pb}Z`;
  /* Gitter */
  const step = (hi - lo) / 3;
  let g = [0, 2].map(i => { const v = lo + step * i + step / 2; return v < hi ? `<path d="M${pl} ${f(Y(v))}H${W - pr}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${pl - 6}" y="${f(Y(v) + 3.5)}" text-anchor="end" font-size="10" fill="var(--muted)">${kg1(v)}</text>` : ""; }).join("");
  /* 7-Tage-Schnitt als Trend (nur Tagesansicht) */
  let trend = "";
  if (view === "tage" && pts.length >= 4) {
    const tp = pts.map((p, i) => { const win = pts.filter(q => q.t <= p.t && q.t > p.t - 7 * 864e5); return [X(p.t), Y(avg(win.map(q => q.v)))]; });
    trend = `<path d="${tp.map((q, i) => `${i ? "L" : "M"}${f(q[0])} ${f(q[1])}`).join("")}" fill="none" stroke="var(--t2)" stroke-width="2" stroke-dasharray="1 4" stroke-linecap="round" opacity=".9"/>`;
  }
  const goal = weightGoal ? `<path d="M${pl} ${f(Y(weightGoal))}H${W - pr}" stroke="#16a34a" stroke-width="1.6" stroke-dasharray="6 4"/><text x="${W - pr}" y="${f(Y(weightGoal) - 4)}" text-anchor="end" font-size="10" font-weight="700" fill="#16a34a">Ziel ${kg1(weightGoal)}</text>` : "";
  const dotsR = pts.length > 20 ? 2.4 : 3.6;
  const dotsS = pts.map((p, i) => `<circle cx="${f(P[i][0])}" cy="${f(P[i][1])}" r="${i === pts.length - 1 ? 5 : dotsR}" fill="var(--card)" stroke="var(--accent)" stroke-width="2.2"/>`).join("");
  /* Beschriftung x-Achse: Anfang, Mitte, Ende */
  const idx = [...new Set([0, Math.floor((pts.length - 1) / 2), pts.length - 1])];
  const xl = idx.map((i, k) => `<text x="${f(P[i][0])}" y="${H - 7}" font-size="10" fill="var(--muted)" text-anchor="${pts.length === 1 ? "middle" : k === 0 ? "start" : k === idx.length - 1 ? "end" : "middle"}">${pts[i].lab}</text>`).join("");
  const last = P[P.length - 1];
  const tip = `<g transform="translate(${f(Math.min(Math.max(last[0], pl + 22), W - pr - 22))} ${f(Math.max(last[1] - 14, 10))})"><rect x="-22" y="-9" width="44" height="16" rx="8" fill="var(--accent)"/><text x="0" y="3" text-anchor="middle" font-size="10.5" font-weight="700" fill="#fff">${kg1(pts[pts.length - 1].v)}</text></g>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="chart w-chart"><defs><linearGradient id="wG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--accent);stop-opacity:.30"/><stop offset="1" style="stop-color:var(--accent);stop-opacity:0"/></linearGradient></defs>
    ${g}${goal}<path d="${area}" fill="url(#wG)"/>${trend}<path d="${line}" fill="none" stroke="var(--accent)" stroke-width="2.6" stroke-linecap="round"/>${dotsS}${tip}${xl}</svg>`;
}

function weightStats() {
  const days = sortedWeightDays(); if (!days.length) return "";
  const today = todayKey(), wk = weekStart(today), prevWk = weekStart(dayShift(today, -7));
  const inRange = (a, b) => days.filter(d => d >= a && d < b).map(d => weights[d]);
  const cur = inRange(wk, dayShift(wk, 7)), prev = inRange(prevWk, wk);
  const lastV = weights[days[days.length - 1]], firstV = weights[days[0]];
  const diff = (a, b) => { const d = a - b; return `<span class="${d > 0.05 ? "up" : d < -0.05 ? "down" : ""}">${d > 0 ? "+" : d < 0 ? "−" : "±"}${kg1(Math.abs(d))} kg</span>`; };
  const cells = [];
  cells.push(`<div><small>Ø diese Woche</small><b>${cur.length ? kg1(avg(cur)) + " kg" : "–"}</b></div>`);
  cells.push(`<div><small>vs. Vorwoche</small><b>${cur.length && prev.length ? diff(avg(cur), avg(prev)) : "–"}</b></div>`);
  if (weightGoal) cells.push(`<div><small>bis zum Ziel</small><b>${Math.abs(lastV - weightGoal) < .05 ? "erreicht ✓" : kg1(Math.abs(lastV - weightGoal)) + " kg"}</b></div>`);
  else cells.push(`<div><small>seit Beginn</small><b>${days.length > 1 ? diff(lastV, firstV) : "–"}</b></div>`);
  return `<div class="w-stats">${cells.join("")}</div>`;
}

function weightCardHTML(day) {
  const v = weights[day], days = sortedWeightDays();
  const prevDay = days.filter(d => d < day).pop();
  const ph = prevDay ? kg1(weights[prevDay]) : "z. B. 77,0";
  const change = v && prevDay ? (() => { const d = v - weights[prevDay]; return `<span class="w-chg ${d > 0.05 ? "up" : d < -0.05 ? "down" : ""}">${d > 0 ? "▲ +" : d < 0 ? "▼ −" : "± "}${kg1(Math.abs(d))} kg</span>`; })() : "";
  const tabs = [["tage", "Tage"], ["wochen", "Wochen"], ["monate", "Monate"], ["gesamt", "Gesamt"]];
  const series = weightSeries(weightView === "gesamt" ? (days.length > 120 ? "monate" : "wochen") : weightView);
  const pts = weightView === "gesamt" ? (() => { const all = sortedWeightDays(); if (all.length <= 60) return all.map(d => ({ t: dateOf(d).getTime(), v: weights[d], lab: dateOf(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" }) })); return series; })() : series;
  return `<div class="card w-card">
    <div class="w-top">
      <b>${ic("scale")} Gewicht</b>
      <div class="w-in"><input id="wIn" inputmode="decimal" type="text" placeholder="${ph}" value="${v ? kg1(v) : ""}"><span>kg</span></div>
      <button class="btn sm" id="wSave">${v ? "Ändern" : "Eintragen"}</button>
    </div>
    <div class="w-done ${v ? "" : "muted"}">${v ? `${change || "✓ eingetragen"} · <button class="undo" id="wDel">löschen</button>` : "Morgens nach dem Aufstehen wiegen."}</div>
    <div class="seg w-seg">${tabs.map(([k, n]) => `<button data-wv="${k}" class="${weightView === k ? "on" : ""}">${n}</button>`).join("")}</div>
    ${weightChart(pts, weightView === "gesamt" && sortedWeightDays().length <= 60 ? "tage" : weightView)}

    ${weightStats()}
    <details class="w-goal"><summary>${ic("target")} ${weightGoal ? `Ziel ${kg1(weightGoal)} kg` : "Zielgewicht festlegen"}</summary>
      <div class="w-entry"><div class="w-in"><input id="wGoal" inputmode="decimal" type="text" placeholder="z. B. 75,0" value="${weightGoal ? kg1(weightGoal) : ""}"><span>kg</span></div><button class="btn ghost" id="wGoalSave">Speichern</button></div>
    </details>
  </div>`;
}

function bindWeight(day) {
  const save = () => {
    const raw = $("wIn").value.trim();
    if (!raw) { toast("Bitte Gewicht eingeben"); return; }
    const v = num(raw);
    if (!(v > 25 && v < 300)) { toast("Das sieht nicht nach einem Gewicht aus"); return; }
    weights[day] = Math.round(v * 10) / 10; saveJSON(WEIGHT_KEY, weights);
    if (day === sortedWeightDays().pop()) { profile.weight = weights[day]; saveJSON(PROFILE_KEY, profile); }
    renderToday(); toast(`${kg1(weights[day])} kg eingetragen ✓`);
  };
  $("wSave").onclick = save;
  $("wIn").onkeydown = e => { if (e.key === "Enter") save(); };
  if ($("wDel")) $("wDel").onclick = () => { delete weights[day]; saveJSON(WEIGHT_KEY, weights); renderToday(); toast("Eintrag gelöscht"); };
  document.querySelectorAll("[data-wv]").forEach(b => b.onclick = () => { weightView = b.dataset.wv; saveJSON(WVIEW_KEY, weightView); renderToday(); });
  $("wGoalSave").onclick = () => {
    const raw = $("wGoal").value.trim();
    weightGoal = raw ? Math.round(num(raw) * 10) / 10 : null;
    saveJSON(WGOAL_KEY, weightGoal); renderToday(); toast(weightGoal ? `Ziel ${kg1(weightGoal)} kg gespeichert` : "Ziel entfernt");
  };
}

function renderToday() {
  const view = $("view");
  const day = viewDay || todayKey();
  const isToday = day === todayKey();
  const entries = log.filter(e => e.day === day);
  const m = sumMacros(entries.map(e => e.totals));

  let html = `<div class="daynav">
    <button class="navbtn" id="dPrev">‹</button>
    <b>${dayLabel(day)}</b>
    <button class="navbtn" id="dNext" ${isToday ? "disabled" : ""}>›</button>
  </div>`;

  if (targets) {
    const r = 56, C = 2 * Math.PI * r;
    const goal = targets.kcal + (profile.addBurn ? burnedOn(day) : 0);
    const share = goal ? m.kcal / goal : 0;
    const over = share > 1.02, rest = goal - m.kcal;
    html += `<div class="card">
      <div class="ring-wrap">
        <div class="ring">
          <svg viewBox="0 0 132 132">
            <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--t1)"/><stop offset="1" style="stop-color:var(--t2)"/></linearGradient></defs>
            <circle cx="66" cy="66" r="${r}" fill="none" stroke="var(--line)" stroke-width="13"/>
            <circle cx="66" cy="66" r="${r}" fill="none" stroke="${over ? "var(--danger)" : "url(#ringGrad)"}" stroke-width="13"
              stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - Math.min(1, share))}" style="--c0:${C}"/>
          </svg>
          <div class="ring-center"><b>${fmt(m.kcal)}</b><small>von ${fmt(goal)} kcal</small></div>
        </div>
        <div class="ring-side">
          <div class="rem" style="color:${over ? "var(--danger)" : "inherit"}">${rest >= 0 ? `Noch ${fmt(rest)} kcal` : `${fmt(-rest)} kcal drüber`}</div>
          <button class="undo" id="calcOpen" style="padding:4px 0;color:var(--accent);font-size:15px;font-weight:600">${ic("calc")} Kalorienrechner ›</button>
        </div>
      </div>
      ${barHTML("Eiweiß", m.p, targets.p, "var(--p)")}
      ${barHTML("Kohlenhydrate", m.c, targets.c, "var(--c)")}
      ${barHTML("Fett", m.f, targets.f, "var(--f)")}
      ${sportLineHTML(day)}
    </div>`;
  } else {
    html += `<div class="card">
      <div class="card-title">${dayLabel(day)} gegessen</div>
      ${totalsHTML(m)}
      <p class="hint" style="margin:12px 0 10px">Berechne dein Tagesziel, dann siehst du hier, wie viel noch geht.</p>
      <button class="btn" id="calcOpen" style="width:100%">Kalorienrechner öffnen</button>
    </div>`;
  }

  html += weightCardHTML(day);

  for (const slot of SLOTS) {
    const se = entries.filter(e => e.slot === slot.id);
    const sk = sumMacros(se.map(e => e.totals)).kcal;
    html += `<div class="card slot" style="--sc:${slot.color}">
      <div class="slot-head"><span><span class="slot-ic">${ic(slot.icon)}</span><b>${slot.name}</b></span><span class="slot-kcal">${se.length ? `${Math.round(sk)} kcal` : ""}</span></div>
      ${se.map(e => `<div class="entry">
        <div class="item-main">
          <div class="item-name">${esc(e.name)}</div>
          <div class="item-sub">${[amountText(e), `${Math.round(e.totals.p)} E · ${Math.round(e.totals.c)} K · ${Math.round(e.totals.f)} F`].filter(Boolean).join(" · ")}</div>
        </div>
        <span class="k">${Math.round(e.totals.kcal)} kcal</span>
        <button class="rm" data-del="${e.id}">✕</button>
      </div>`).join("")}
      <button class="add-slot" data-slot="${slot.id}">＋ Hinzufügen</button>
    </div>`;
  }
  html += `<div class="app-version">Version ${APP_VERSION}</div>`;
  view.innerHTML = html;

  $("dPrev").onclick = () => { viewDay = dayShift(day, -1); renderToday(); };
  $("dNext").onclick = () => { const n = dayShift(day, 1); viewDay = n >= todayKey() ? null : n; renderToday(); };
  $("calcOpen").onclick = openCalc;
  bindWeight(day);
  view.querySelectorAll("[data-slot]").forEach(b => b.onclick = () => openAdd(b.dataset.slot));
  view.querySelectorAll("[data-del]").forEach(b => b.onclick = () => removeEntry(b.dataset.del));
}

function removeEntry(id) {
  const e = log.find(x => x.id === id);
  if (!e || !confirm(e.items && e.items.length ? `„${e.name}“ entfernen? Die Zutaten kommen zurück in den Bestand.` : `„${e.name}“ entfernen?`)) return;
  for (const i of e.items || []) if (prod(i.id) && i.deducted > 0) stock[i.id] = (stock[i.id] || 0) + i.deducted;
  log = log.filter(x => x.id !== id);
  saveJSON(LOG_KEY, log); saveStock(); renderToday();
  toast("Entfernt");
}

/* Hinzufügen zu einem Slot */
let addSlot = null, addMode = "produkte", addSel = null;

function openAdd(slotId) {
  addSlot = slotId;
  const slot = SLOTS.find(x => x.id === slotId);
  $("addTitle").innerHTML = `${ic(slot.icon)} ${slot.name}`;
  $("addSearch").value = "";
  showAddList();
  $("addSheet").classList.add("open");
}
function showAddList() {
  $("addListView").style.display = "block";
  $("addAmountView").style.display = "none";
  $("addSeg").querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.v === addMode));
  renderAddList();
}
function renderAddList() {
  const term = $("addSearch").value.toLowerCase();
  const list = $("addList");
  if (addMode === "gerichte") {
    const hits = DISHES.filter(d => dishMatch(d, term));
    list.innerHTML = hits.length ? DISH_CATS.map(([c, n, icn]) => { const g = hits.filter(d => d.cat === c); return g.length ? `<div class="cat-title">${ic(icn)} ${n}</div>${dishRowsHTML(g)}` : ""; }).join("")
      : `<div class="empty" style="padding:30px 10px">Nichts gefunden.<br>Leg es als eigenes Produkt oder als Mahlzeit an.</div>`;
    list.querySelectorAll("[data-dish]").forEach(r => r.onclick = () => showDish(r.dataset.dish));
    return;
  }
  if (addMode === "produkte") {
    const items = products.filter(p => p.name.toLowerCase().includes(term))
      .sort((a, b) => (inStock(b) - inStock(a)) || a.name.localeCompare(b.name, "de"));
    list.innerHTML = items.length ? `<div class="shop-list">${items.map(p => `
      <div class="shop-item" data-sel="${p.id}" style="cursor:pointer">${thumbHTML(p)}
        <div class="item-main"><div class="item-name">${esc(p.name)}</div>
          <div class="item-sub">${inStock(p) ? `Noch ${fmt(stock[p.id])} g da` : `<span class="warn">Nicht im Bestand</span>`}</div></div>
        <span class="item-sub">${Math.round(p.kcal)} kcal/100 g</span></div>`).join("")}</div>`
      : (term.length >= 2 && DISHES.some(d => dishMatch(d, term)) ? "" : `<div class="empty" style="padding:30px 10px">${products.length ? "Nichts gefunden." : "Noch keine Produkte angelegt."}</div>`);
    const dh = term.length >= 2 ? DISHES.filter(d => dishMatch(d, term)).slice(0, 6) : [];
    if (dh.length) list.innerHTML += `<div class="cat-title">Unterwegs · Durchschnittswerte</div>${dishRowsHTML(dh)}`;
    list.querySelectorAll("[data-dish]").forEach(r => r.onclick = () => showDish(r.dataset.dish));
  } else {
    const items = templates.filter(t => t.name.toLowerCase().includes(term)).sort((a, b) => a.name.localeCompare(b.name, "de"));
    const rests = leftovers.filter(l => l.name.toLowerCase().includes(term));
    const restHTML = rests.length ? `<div class="cat-title">${ic("bowl")} Reste im Kühlschrank</div><div class="shop-list">${rests.map(l => `<div class="shop-item" data-rest="${l.id}" style="cursor:pointer">
        <div class="thumb">${ic("bowl")}</div><div class="item-main"><div class="item-name">${esc(l.name)}</div><div class="item-sub">${plural(l.portions, "Portion", "Portionen")} übrig · ${Math.round(l.per.p)} g Eiweiß</div></div>
        <span class="item-sub">${Math.round(l.per.kcal)} kcal</span></div>`).join("")}</div><div class="cat-title">${ic("utensils")} Meine Mahlzeiten</div>` : "";
    list.innerHTML = restHTML + (items.length ? `<div class="shop-list">${items.map(t => {
      const m = itemsMacros(t.items);
      return `<div class="shop-item" data-sel="${t.id}" style="cursor:pointer">
        <div class="thumb">${ic("utensils")}</div>
        <div class="item-main"><div class="item-name">${esc(t.name)}</div>
          <div class="item-sub">${Math.round(m.p)} g Eiweiß${missingSomething(t.items) ? ` · <span class="warn">fehlt was</span>` : ""}</div></div>
        <span class="item-sub">${Math.round(m.kcal)} kcal</span></div>`;
    }).join("")}</div>`
      : `<div class="empty" style="padding:30px 10px">${templates.length ? "Nichts gefunden." : "Noch keine Mahlzeiten.<br>Leg sie im Tab „Produkte“ › „Mahlzeiten“ an."}</div>`);
    list.querySelectorAll("[data-rest]").forEach(r => r.onclick = () => { $("addSheet").classList.remove("open"); eatLeftover(r.dataset.rest, addSlot); renderToday(); });
  }
  list.querySelectorAll("[data-sel]").forEach(r => r.onclick = () => showAmount(r.dataset.sel));
}
$("addSeg").querySelectorAll("button").forEach(b => b.onclick = () => { addMode = b.dataset.v; showAddList(); });
$("addSearch").oninput = renderAddList;
// Scannen im Tracker: erst in deinen gespeicherten Produkten suchen (klappt offline)
$("addScan").onclick = () => Cam.open("single", code => {
  const p = products.find(x => sameCode(x.barcode, code));
  if (p) { Cam.close(); addMode = "produkte"; showAmount(p.id); if (navigator.vibrate) navigator.vibrate(40); return; }
  Cam.close();
  if (!navigator.onLine) { toast("Dieses Produkt hast du noch nicht gespeichert – zum Nachschlagen brauchst du Internet"); return; }
  $("addSheet").classList.remove("open");
  openSheet(); $("fBarcode").value = code; lookup(code);
  toast("Neues Produkt – einmal speichern, dann kannst du es eintragen");
}, "Produkt scannen");
$("addBack").onclick = showAddList;

/* ---------- Gerichte mit Durchschnittswerten (pro Portion: kcal, Eiweiß, Kohlenhydrate, Fett) ---------- */
const DISH_CATS = [["imbiss", "Imbiss & Fast Food", "burger"], ["pizza", "Pizza & Pasta", "pizza"], ["asia", "Asiatisch & Bowls", "bowl"], ["deftig", "Restaurant & Mensa", "utensils"], ["baecker", "Bäcker & Snacks", "wheat"], ["suess", "Süßes", "candy"], ["drinks", "Getränke", "glass"]];
const DISHES = [
  ["doener", "imbiss", "Döner Kebab", "1 Döner im Fladenbrot (~400 g)", [700, 35, 70, 30], ["doner", "kebab"]],
  ["duerum", "imbiss", "Dürüm / Yufka", "1 Dürüm (~400 g)", [750, 37, 72, 34], ["durum", "yufka", "doener", "wrap"]],
  ["doenerteller", "imbiss", "Dönerteller mit Pommes", "1 Teller (~600 g)", [1100, 50, 95, 55], ["doener", "teller"]],
  ["doenerbox", "imbiss", "Dönerbox", "1 Box mit Pommes (~400 g)", [800, 30, 65, 45], ["doener", "box"]],
  ["lahmacun", "imbiss", "Lahmacun mit Salat", "1 Stück gerollt (~300 g)", [450, 18, 60, 14], ["türkische pizza"]],
  ["falafel", "imbiss", "Falafel im Brot", "1 Stück (~350 g)", [650, 18, 85, 26], ["falafel"]],
  ["currywurst", "imbiss", "Currywurst", "1 Portion ohne Pommes (~200 g)", [450, 15, 20, 34], ["wurst"]],
  ["curryp", "imbiss", "Currywurst mit Pommes", "1 Portion (~400 g)", [900, 22, 85, 52], ["wurst", "pommes"]],
  ["pommes", "imbiss", "Pommes", "mittlere Portion (~150 g)", [450, 5, 55, 22], ["fritten", "fries"], [["Klein", .65], ["Mittel", 1], ["Groß", 1.45]]],
  ["bratwurst", "imbiss", "Bratwurst im Brötchen", "1 Stück", [480, 18, 30, 31], ["wurst", "rostbratwurst"]],
  ["cheeseburger", "imbiss", "Cheeseburger (Fast Food)", "1 kleiner Burger (~120 g)", [300, 15, 32, 12], ["burger"]],
  ["bigburger", "imbiss", "Großer Burger (Fast Food)", "1 Doppel-Burger (~220 g)", [550, 27, 45, 29], ["burger"]],
  ["restburger", "imbiss", "Burger mit Pommes (Restaurant)", "1 Teller", [1200, 50, 100, 65], ["burger", "pommes"]],
  ["nuggets", "imbiss", "Chicken Nuggets", "6 Stück", [270, 15, 16, 16], ["nuggets", "chicken"], [["6 Stück", 1], ["9 Stück", 1.5], ["20 Stück", 3.33]]],
  ["hotdog", "imbiss", "Hot Dog", "1 Stück", [400, 13, 38, 22], ["hotdog"]],
  ["wrap", "imbiss", "Wrap mit Hähnchen", "1 Stück (~300 g)", [550, 30, 55, 22], ["wrap", "chicken"]],
  ["margherita", "pizza", "Pizza Margherita", "ganze Pizza (~30 cm)", [850, 35, 110, 28], ["pizza"], [["1 Stück (⅛)", .125], ["Halbe", .5], ["Ganze", 1]]],
  ["salami", "pizza", "Pizza Salami", "ganze Pizza (~30 cm)", [1000, 42, 108, 44], ["pizza"], [["1 Stück (⅛)", .125], ["Halbe", .5], ["Ganze", 1]]],
  ["tonno", "pizza", "Pizza Tonno", "ganze Pizza (~30 cm)", [950, 50, 105, 36], ["pizza", "thunfisch"], [["1 Stück (⅛)", .125], ["Halbe", .5], ["Ganze", 1]]],
  ["funghi", "pizza", "Pizza Funghi", "ganze Pizza (~30 cm)", [880, 37, 110, 30], ["pizza", "pilze"], [["1 Stück (⅛)", .125], ["Halbe", .5], ["Ganze", 1]]],
  ["hawaii", "pizza", "Pizza Hawaii", "ganze Pizza (~30 cm)", [920, 40, 118, 30], ["pizza"], [["1 Stück (⅛)", .125], ["Halbe", .5], ["Ganze", 1]]],
  ["tkpizza", "pizza", "Tiefkühlpizza", "ganze Pizza (~350 g)", [850, 32, 95, 36], ["pizza", "tk"], [["Halbe", .5], ["Ganze", 1]]],
  ["bolo", "pizza", "Spaghetti Bolognese", "1 Teller (Restaurant)", [750, 32, 95, 24], ["pasta", "nudeln"]],
  ["carbonara", "pizza", "Pasta Carbonara", "1 Teller (Restaurant)", [900, 33, 95, 42], ["pasta", "nudeln"]],
  ["lasagne_r", "pizza", "Lasagne", "1 Portion (Restaurant)", [700, 35, 50, 38], ["pasta"]],
  ["sushi", "asia", "Sushi (Maki & Nigiri)", "8 Stück", [350, 14, 62, 4], ["sushi"], [["8 Stück", 1], ["12 Stück", 1.5], ["16 Stück", 2]]],
  ["bratnudeln", "asia", "Gebratene Nudeln mit Hähnchen", "1 Box / Teller", [750, 32, 95, 25], ["nudeln", "asia", "wok"]],
  ["bratreis", "asia", "Gebratener Reis mit Hähnchen", "1 Box / Teller", [750, 30, 100, 24], ["reis", "asia", "wok"]],
  ["ente", "asia", "Ente kross mit Reis", "1 Teller", [1100, 45, 100, 55], ["ente", "asia"]],
  ["curry", "asia", "Curry mit Reis", "1 Teller (Hähnchen, Kokos)", [850, 38, 95, 33], ["curry", "thai", "indisch"]],
  ["pho", "asia", "Pho / Nudelsuppe", "1 Schüssel", [450, 28, 60, 8], ["suppe", "pho"]],
  ["ramen", "asia", "Ramen", "1 Schüssel", [600, 25, 70, 22], ["suppe", "ramen"]],
  ["poke", "asia", "Poke Bowl", "1 Bowl", [600, 30, 75, 18], ["bowl", "poke"]],
  ["schnitzel", "deftig", "Schnitzel mit Pommes", "1 Teller", [1100, 45, 90, 60], ["schnitzel"]],
  ["mensa", "deftig", "Mensa-Essen (Hauptgericht)", "1 Portion, Durchschnitt", [750, 30, 80, 32], ["mensa", "kantine"]],
  ["mensaveg", "deftig", "Mensa-Essen vegetarisch", "1 Portion, Durchschnitt", [650, 20, 85, 24], ["mensa", "kantine", "vegetarisch"]],
  ["salathaehnchen", "deftig", "Salat mit Hähnchen", "1 große Schüssel mit Dressing", [450, 35, 15, 27], ["salat"]],
  ["kartoffelsalat", "deftig", "Würstchen mit Kartoffelsalat", "1 Teller", [750, 22, 50, 50], ["wurst", "kartoffel"]],
  ["broetchen", "baecker", "Belegtes Brötchen", "1 Stück (Käse/Schinken)", [350, 16, 40, 13], ["brötchen", "semmel", "sandwich"]],
  ["brezel", "baecker", "Butterbrezel", "1 Stück", [330, 8, 45, 13], ["brezel", "breze"]],
  ["croissant", "baecker", "Croissant", "1 Stück", [230, 5, 25, 12], ["croissant"]],
  ["laugen", "baecker", "Laugenstange mit Käse", "1 Stück", [380, 14, 45, 15], ["laugen"]],
  ["kuchen", "baecker", "Stück Kuchen", "1 Stück", [350, 5, 45, 17], ["kuchen", "torte"]],
  ["berliner", "baecker", "Berliner / Krapfen", "1 Stück", [300, 5, 40, 13], ["pfannkuchen", "krapfen"]],
  ["muffin", "baecker", "Muffin", "1 Stück", [400, 5, 50, 20], ["muffin"]],
  ["eis", "suess", "Eis", "2 Kugeln", [220, 4, 28, 10], ["eis", "eiscreme"], [["1 Kugel", .5], ["2 Kugeln", 1], ["3 Kugeln", 1.5]]],
  ["riegel", "suess", "Schokoriegel", "1 Riegel (~50 g)", [250, 3, 32, 12], ["schoko", "riegel"]],
  ["waffel", "suess", "Waffel mit Puderzucker", "1 Stück", [300, 6, 38, 14], ["waffel"]],
  ["crepe", "suess", "Crêpe mit Nutella", "1 Stück", [450, 8, 60, 20], ["crepe"]],
  ["bier", "drinks", "Bier", "0,5 l", [210, 2, 16, 0], ["bier", "pils"], [["0,33 l", .66], ["0,5 l", 1], ["1 l", 2]]],
  ["wein", "drinks", "Wein", "0,2 l", [160, 0, 5, 0], ["wein"]],
  ["longdrink", "drinks", "Longdrink / Mischgetränk", "1 Glas (0,3 l)", [220, 0, 30, 0], ["vodka", "cocktail", "mische"]],
  ["cola", "drinks", "Cola / Limo", "0,5 l", [210, 0, 53, 0], ["cola", "limo", "fanta", "sprite"], [["0,33 l", .66], ["0,5 l", 1], ["1 l", 2]]],
  ["energy", "drinks", "Energy Drink", "0,25 l", [115, 0, 27, 0], ["energy"], [["0,25 l", 1], ["0,5 l", 2]]],
  ["cappu", "drinks", "Cappuccino / Latte", "1 großer Becher (~300 ml)", [130, 7, 10, 7], ["kaffee", "latte", "cappuccino"]],
  ["smoothie", "drinks", "Smoothie", "0,25 l", [130, 1, 30, 0], ["smoothie", "saft"]]
].map(([id, cat, name, por, r, k, sizes]) => ({ id, cat, name, por, r, k: k || [], sizes: sizes || null }));
const dishById = id => DISHES.find(d => d.id === id);
const norm = t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const dishMatch = (d, term) => !term || norm(d.name + " " + d.k.join(" ")).includes(norm(term));
const dishIcon = d => (DISH_CATS.find(c => c[0] === d.cat) || DISH_CATS[0])[2];
const dishFactor = () => { const d = dishById(addSel.id); return d.sizes ? d.sizes[addSel.size][1] : 1; };
function dishRowsHTML(list) {
  return `<div class="shop-list">${list.map(d => `<div class="shop-item" data-dish="${d.id}" style="cursor:pointer">
    <div class="thumb dish">${ic(dishIcon(d))}</div>
    <div class="item-main"><div class="item-name">${esc(d.name)}</div><div class="item-sub">${esc(d.por)} · ${d.r[1]} g Eiweiß</div></div>
    <span class="item-sub">≈ ${d.r[0]} kcal</span></div>`).join("")}</div>`;
}
function showDish(id) {
  const d = dishById(id);
  addSel = { kind: "dish", id, size: d.sizes ? Math.max(0, d.sizes.findIndex(x => x[1] === 1)) : 0 };
  $("addListView").style.display = "none";
  $("addAmountView").style.display = "block";
  $("aPreview").style.display = "none";
  $("aName").innerHTML = `${esc(d.name)}<span class="avg-tag">Ø-Wert</span>`;
  $("aLabel").textContent = "Portionen";
  $("aAmount").value = 1;
  renderDishOpts();
  updateAmount();
}
function renderDishOpts() {
  const d = dishById(addSel.id);
  $("aIngs").innerHTML = (d.sizes ? `<label style="margin-top:12px">Größe</label><div class="chips">${d.sizes.map((x, i) => `<button data-dsz="${i}" class="${i === addSel.size ? "on" : ""}">${x[0]}</button>`).join("")}</div>` : "") +
    `<div class="dish-note">${ic("sparkles")}<span>Durchschnittswerte, Basis: ${esc(d.por)}. Je nach Laden und Portion kann es deutlich abweichen.</span></div>`;
  $("aIngs").querySelectorAll("[data-dsz]").forEach(b => b.onclick = () => { addSel.size = +b.dataset.dsz; renderDishOpts(); updateAmount(); });
}
function dishTotals() {
  const d = dishById(addSel.id), k = dishFactor() * Math.max(0, num($("aAmount").value));
  return { kcal: d.r[0] * k, p: d.r[1] * k, c: d.r[2] * k, f: d.r[3] * k };
}

function showAmount(id) {
  addSel = { kind: addMode === "produkte" ? "product" : "meal", id };
  $("addListView").style.display = "none";
  $("addAmountView").style.display = "block";
  if (addSel.kind === "product") {
    const p = prod(id);
    $("aPreview").innerHTML = p.image ? `<img src="${esc(p.image)}" alt="">` : "";
    $("aPreview").style.display = p.image ? "flex" : "none";
    $("aName").textContent = p.name;
    $("aLabel").textContent = "Menge (g)";
    $("aAmount").value = defaultGrams(p);
    $("aIngs").innerHTML = "";
  } else {
    const t = templates.find(x => x.id === id);
    $("aPreview").style.display = "none";
    $("aName").textContent = t.name;
    $("aLabel").textContent = "Portionen";
    $("aAmount").value = 1;
    addIngs = validItems(t.items).map(i => ({ id: i.id, g: i.g, base: i.g }));
    renderAddIngs();
  }
  updateAmount();
}
/* Zutaten einer Mahlzeit beim Eintragen anpassen (nur für dieses Mal oder als neue Standardmengen) */
let addIngs = [];
function renderAddIngs() {
  $("aIngs").innerHTML = `<div class="a-ings-cap">Zutaten – heute anpassen</div><div class="meal-list a-ings">${addIngs.map((i, k) => {
    const p = prod(i.id), changed = Math.abs(i.g - i.base) > .01;
    return `<div class="meal-item${changed ? " chg" : ""}">${thumbHTML(p)}
      <div class="item-main"><div class="item-name">${esc(p.name)}</div><div class="item-sub">${changed ? `sonst ${fmt(i.base)} g` : `${Math.round(p.kcal)} kcal/100 g`}</div></div>
      <div class="gwrap"><div class="gbox"><input class="gin" data-ai="${k}" type="text" inputmode="decimal" value="${dec(i.g)}">g</div></div>
    </div>`;
  }).join("")}</div>
  <label class="a-keep${addIngs.some(i => Math.abs(i.g - i.base) > .01) ? "" : " hidden"}"><input type="checkbox" id="aKeep"> Als neue Standardmengen speichern</label>`;
  $("aIngs").querySelectorAll("[data-ai]").forEach(inp => {
    inp.oninput = () => { addIngs[inp.dataset.ai].g = Math.max(0, num(inp.value)); updateAmount(); const row = inp.closest(".meal-item"), i = addIngs[inp.dataset.ai], ch = Math.abs(i.g - i.base) > .01; row.classList.toggle("chg", ch); row.querySelector(".item-sub").textContent = ch ? `sonst ${fmt(i.base)} g` : `${Math.round(prod(i.id).kcal)} kcal/100 g`; document.querySelector(".a-keep").classList.toggle("hidden", !addIngs.some(x => Math.abs(x.g - x.base) > .01)); };
    inp.onfocus = () => inp.select();
  });
}

function selectedItems() {
  const a = Math.max(0, num($("aAmount").value));
  if (addSel.kind === "product") return [{ id: addSel.id, g: a }];
  return addIngs.map(i => ({ id: i.id, g: i.g * a }));
}

function updateAmount() {
  if (addSel.kind === "dish") { $("aTotals").innerHTML = totalsHTML(dishTotals()); $("aStock").innerHTML = ""; return; }
  const items = selectedItems();
  $("aTotals").innerHTML = totalsHTML(itemsMacros(items));
  $("aStock").innerHTML = addSel.kind === "product"
    ? stockNote(addSel.id, items[0].g)
    : (missingSomething(items) ? `<span class="warn">Nicht alle Zutaten sind im Bestand</span>` : "Alle Zutaten sind da ✓");
}
const amountStep = () => addSel.kind === "product" ? 10 : 0.5;
$("aAmount").oninput = updateAmount;
$("aMinus").onclick = () => { $("aAmount").value = Math.max(amountStep(), num($("aAmount").value) - amountStep()); updateAmount(); };
$("aPlus").onclick = () => { $("aAmount").value = num($("aAmount").value) + amountStep(); updateAmount(); };

$("aAdd").onclick = () => {
  const amount = num($("aAmount").value);
  if (!(amount > 0)) { toast("Bitte eine Menge eingeben"); return; }
  if (addSel.kind === "dish") {
    const d = dishById(addSel.id), totals = dishTotals(), now = new Date();
    const name = d.name + (d.sizes && d.sizes[addSel.size][1] !== 1 ? ` (${d.sizes[addSel.size][0]})` : "");
    log.push({ id: now.getTime().toString(36), day: viewDay || todayKey(), slot: addSlot, time: now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      kind: "dish", refId: d.id, name, amount, items: [], totals });
    saveJSON(LOG_KEY, log);
    $("addSheet").classList.remove("open");
    renderToday();
    toast(`≈ ${Math.round(totals.kcal)} kcal eingetragen ✓`);
    return;
  }
  let short = false;
  const logged = selectedItems().filter(i => i.g > 0).map(i => {
    const p = prod(i.id), have = stock[i.id] || 0, deducted = Math.min(have, i.g);
    if (i.g > have + 0.5) short = true;
    stock[i.id] = have - deducted;
    if (stock[i.id] < 0.5) delete stock[i.id];
    return { id: i.id, name: p.name, g: i.g, deducted, ...macrosFor(p, i.g) };
  });
  const totals = sumMacros(logged);
  const now = new Date();
  const tpl = addSel.kind === "meal" ? templates.find(x => x.id === addSel.id) : null;
  const changed = tpl && addIngs.some(i => Math.abs(i.g - i.base) > .01);
  if (changed && $("aKeep") && $("aKeep").checked) {
    tpl.items = addIngs.filter(i => i.g > 0).map(i => ({ id: i.id, g: i.g }));
    saveJSON(TPL_KEY, templates);
  }
  const name = tpl ? tpl.name + (changed && !($("aKeep") && $("aKeep").checked) ? " (angepasst)" : "") : prod(addSel.id).name;
  log.push({
    id: now.getTime().toString(36), day: viewDay || todayKey(), slot: addSlot,
    time: now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
    kind: addSel.kind, refId: addSel.id, name, amount, items: logged, totals
  });
  saveJSON(LOG_KEY, log);
  saveStock();
  $("addSheet").classList.remove("open");
  renderToday();
  toast(short ? "Eingetragen ✓ – nicht alles war im Bestand" : `${Math.round(totals.kcal)} kcal eingetragen ✓`);
};

