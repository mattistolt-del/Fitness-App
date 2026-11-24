/* ---------- Satz-Typen (wie bei Hevy) ---------- */
const SET_NAMES = { n: "Normaler Satz", w: "Aufwärmsatz (W)", d: "Dropsatz (D)", f: "Bis zum Versagen (F)" };
function setLabels(sets) {
  let k = 0;
  return sets.map(s => {
    const t = s.type || "n";
    if (t === "w") return "W";
    k++;
    return t === "d" ? "D" : t === "f" ? "F" : String(k);
  });
}
const REST_OPTIONS = [0, 30, 45, 60, 75, 90, 120, 150, 180, 240, 300];
const restLabel = s => s === 0 ? "Aus" : s < 60 ? `${s} s` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} min`;
const restSelect = (val, attr) => `<select ${attr}>${REST_OPTIONS.map(o => `<option value="${o}"${o === val ? " selected" : ""}>${restLabel(o)}</option>`).join("")}</select>`;
const dec = v => v === "" || v == null ? "" : String(v).replace(".", ",");
const canWeight = ex => isBW(ex) && !isTime(ex);
function fmtPrev(ex, s) {
  if (!s) return "–";
  if (isTime(ex)) return `${de(num(s.r))} s`;
  if (num(s.w) > 0) return `${isBW(ex) ? "+" : ""}${de(num(s.w))} kg × ${de(num(s.r))}`;
  return `${de(num(s.r))} Wdh`;
}

/* alte Pläne (Version 15/16) ins neue Format bringen */
plans = plans.map(p => ({
  ...p,
  items: p.items.map(it => Array.isArray(it.sets) ? it : { exId: it.exId, rest: 90, sets: Array.from({ length: it.sets || 3 }, () => ({ w: "", r: it.reps ?? "", type: "n" })) })
}));
saveJSON(PLAN_KEY, plans);

/* ---------- Tab ---------- */
function renderTraining() {
  const view = $("view");
  const week = weekDays(), wkWeek = workouts.filter(w => week.includes(w.day));
  let html = "";
  if (activeWk) {
    html += `<div class="card wk-live" id="wkResume">
      <div class="item-main"><b>${ic("flame")} Training läuft</b><div class="item-sub">${esc(activeWk.name)} · ${plural(doneSetsOf(activeWk), "Satz", "Sätze")} erledigt</div></div>
      <button class="btn">Weiter</button></div>`;
  }

  const names = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  html += `<div class="card"><div class="card-title">Diese Woche</div><div class="week">${week.map((d, i) => {
    const on = workouts.some(w => w.day === d) || (activeWk && activeWk.day === d);
    return `<div class="wd${on ? " on" : ""}${d === todayKey() ? " today" : ""}"><span>${names[i]}</span><i>${on ? "✓" : ""}</i></div>`;
  }).join("")}</div>
    <div class="week-stats four"><div><b>${wkWeek.length}</b><span>Einheiten</span></div><div><b>${wkWeek.reduce((a, w) => a + setsOf(w), 0)}</b><span>Sätze</span></div><div><b>${de(Math.round(wkWeek.reduce((a, w) => a + volumeOf(w), 0) / 100) / 10)} t</b><span>Volumen</span></div><div><b>${hm(wkWeek.reduce((a, w) => a + (isSport(w) ? w.min : 0), 0))}</b><span>Sport</span></div></div></div>`;

  html += `<div class="sec-head"><div class="cat-title">Meine Trainingspläne</div>${plans.length ? `<button class="link" id="newPlan2">＋ Neuer Plan</button>` : ""}</div>`;
  if (!plans.length) html += `<div class="card plan-empty"><div class="big">${ic("clipboard")}</div><b>Noch keine Trainingspläne</b>
    <div class="item-sub">Leg deinen ersten Plan an, z. B. „Push“, „Pull“ und „Beine“ – mit Übungen, Sätzen und Zielgewichten.</div>
    <button class="btn" id="newPlan" style="width:100%;margin-top:14px">＋ Ersten Plan erstellen</button></div>`;
  html += plans.map(p => `<div class="card plan-card2">
      <div class="pc-head" data-plan="${p.id}"><b>${esc(p.name)}</b><span class="pc-more">⋯</span></div>
      <div class="pc-thumbs" data-plan="${p.id}">${p.items.slice(0, 5).map(i => exThumb(exById(i.exId), "ex-thumb sm")).join("")}${p.items.length > 5 ? `<span class="pc-more-n">+${p.items.length - 5}</span>` : ""}</div>
      <div class="item-sub pc-sub" data-plan="${p.id}">${p.items.map(i => esc(exById(i.exId).name)).join(", ") || "Keine Übungen"}</div>
      <button class="btn" data-go="${p.id}" style="width:100%;margin-top:12px">Plan starten</button></div>`).join("");

  html += `<div class="cat-title">Schnellstart</div>
    <div class="quick-row"><button class="btn ghost quick" id="quickStart">＋ Krafttraining</button><button class="btn ghost quick" id="quickSport">${ic("run")} Sport</button></div>`;
  const recent = sortedWorkouts().reverse().slice(0, 8);
  html += `<div class="cat-title">Letzte Einheiten</div>`;
  html += recent.length ? `<div class="list">${recent.map(w => {
    if (isSport(w)) { const sp = sportById(w.sport); return `<div class="item" data-spw="${w.id}"><div class="thumb sport">${ic(sp.icon)}</div><div class="item-main">
      <div class="item-name">${esc(w.name)}</div><div class="item-sub">${dayLabel(w.day)} · ${hm(w.min)} · ${INTENS[w.int][1]}${w.kcal ? ` · ≈ ${fmt(w.kcal)} kcal` : ""}</div></div></div>`; }
    const prs = w.prs || 0, min = Math.max(1, Math.round((w.end - w.start) / 60000));
    return `<div class="item" data-wk="${w.id}"><div class="thumb">${ic("dumbbell")}</div><div class="item-main">
      <div class="item-name">${esc(w.name)}${prs ? ` <span class="pr-badge">${ic("trophy")} ${prs}</span>` : ""}</div>
      <div class="item-sub">${dayLabel(w.day)} · ${min} min · ${plural(setsOf(w), "Satz", "Sätze")}${volumeOf(w) ? ` · ${de(Math.round(volumeOf(w)))} kg` : ""}</div></div></div>`;
  }).join("")}</div>` : `<p class="hint" style="margin:0 4px 8px">Noch keine Einheit gespeichert.</p>`;

  const recentPRs = sortedWorkouts().reverse().flatMap(w => (w.prList || []).map(r => ({ ...r, day: w.day }))).slice(0, 5);
  if (recentPRs.length) html += `<div class="cat-title">Neue Rekorde</div><div class="list pr-list">${recentPRs.map(r => {
    const ex = exById(r.exId);
    return `<div class="item" data-ex="${r.exId}"><div class="pr-ic">${ic("trophy")}</div><div class="item-main"><div class="item-name">${esc(ex.name)}</div><div class="item-sub">${esc(r.label)} · ${dayLabel(r.day)}</div></div><div class="kcal">${esc(r.val)}</div></div>`;
  }).join("")}</div>`;
  const doneEx = [...new Set(sortedWorkouts().reverse().flatMap(w => w.items.map(i => i.exId)))];
  html += `<div class="cat-title">Fortschritt</div>`;
  html += doneEx.length ? `<div class="list">${doneEx.slice(0, 12).map(id => {
    const ex = exById(id), best = bestSetOf(id);
    return `<div class="item" data-ex="${id}">${exThumb(ex)}<div class="item-main"><div class="item-name">${esc(ex.name)}</div><div class="item-sub">${ex.group}${ex.equip ? " · " + ex.equip : ""}</div></div>
      <div class="kcal">${best ? fmtSet(ex, best) : "–"}<small>Bestleistung</small></div></div>`;
  }).join("")}</div>` : `<p class="hint" style="margin:0 4px 8px">Hier siehst du nach dem ersten Training deine Entwicklung pro Übung.</p>`;
  html += `<button class="btn ghost" id="allEx" style="width:100%;margin-top:10px">Alle Übungen ansehen</button>`;
  view.innerHTML = html;

  if ($("wkResume")) $("wkResume").onclick = () => openWk(activeWk, "live");
  $("quickStart").onclick = () => startWorkout(null);
  $("quickSport").onclick = () => openSport(null);
  view.querySelectorAll("[data-spw]").forEach(c => c.onclick = () => openSport(c.dataset.spw));
  view.querySelectorAll("[data-go]").forEach(b => b.onclick = () => startWorkout(plans.find(p => p.id === b.dataset.go)));
  view.querySelectorAll("[data-plan]").forEach(c => c.onclick = () => openPlan(c.dataset.plan));
  view.querySelectorAll("[data-wk]").forEach(c => c.onclick = () => { const w = workouts.find(x => x.id === c.dataset.wk); openWk(JSON.parse(JSON.stringify(w)), "edit"); });
  view.querySelectorAll("[data-ex]").forEach(c => c.onclick = () => openExDetail(c.dataset.ex));
  if ($("newPlan")) $("newPlan").onclick = () => openPlan(null);
  if ($("newPlan2")) $("newPlan2").onclick = () => openPlan(null);
  $("allEx").onclick = () => openExPick(null, "Übungen");
}
/* ---------- Sporteinheiten ---------- */
const SPORTS = [
  { id: "ringen", name: "Ringen", icon: "wrestle", met: [4.5, 6, 8.5] },
  { id: "laufen", name: "Laufen", icon: "run", met: [7, 9.8, 11.5] },
  { id: "rad", name: "Radfahren", icon: "bike", met: [5.5, 7.5, 10] },
  { id: "schwimmen", name: "Schwimmen", icon: "swim", met: [6, 8, 10] },
  { id: "kampf", name: "Boxen / MMA", icon: "glove", met: [5.5, 7.8, 10.3] },
  { id: "ball", name: "Ballsport", icon: "ball", met: [6, 7, 9] },
  { id: "hiit", name: "HIIT / Zirkel", icon: "bolt", met: [6, 8, 10] },
  { id: "racket", name: "Tennis & Co.", icon: "racket", met: [5, 7, 8] },
  { id: "wandern", name: "Wandern", icon: "mountain", met: [4, 5.3, 6.5] },
  { id: "yoga", name: "Yoga / Mobility", icon: "yoga", met: [2.5, 3, 4] },
  { id: "cardio", name: "Cardio-Gerät", icon: "trend", met: [5, 7, 9] },
  { id: "sonst", name: "Sonstiges", icon: "flame", met: [4, 6, 8] }
];
const INTENS = [["leicht", "Locker"], ["mittel", "Mittel"], ["hart", "Hart"]].map((x, i) => [i, x[1]]);
const sportById = id => SPORTS.find(x => x.id === id) || SPORTS[SPORTS.length - 1];
const isSport = w => w.kind === "sport";
const hm = min => { min = Math.round(min || 0); return min < 60 ? `${min} min` : `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")} h`; };
const bodyKg = () => num(profile.weight) || 75;
const sportKcal = (sid, int, min) => Math.round((sportById(sid).met[int] - 1) * bodyKg() * (min / 60) / 5) * 5;
const burnedOn = day => workouts.filter(w => isSport(w) && w.day === day).reduce((a, w) => a + (w.kcal || 0), 0);
function sportLineHTML(day) {
  const list = workouts.filter(w => isSport(w) && w.day === day);
  if (!list.length) return "";
  const kc = list.reduce((a, w) => a + (w.kcal || 0), 0);
  return `<div class="sport-line">${ic(sportById(list[0].sport).icon)}<span><b>${list.map(w => `${esc(w.name)} ${hm(w.min)}`).join(", ")}</b> · ≈ ${fmt(kc)} kcal verbrannt${profile.addBurn ? " (im Ziel)" : ""}</span></div>`;
}
let spEd = null;
function openSport(id) {
  const old = id && workouts.find(w => w.id === id);
  spEd = old ? { ...old, manual: old.manual || false } : { id: null, kind: "sport", sport: profile.lastSport || "ringen", min: 90, int: 1, day: todayKey(), note: "", kcal: 0, manual: false };
  $("spTitle").textContent = old ? "Sporteinheit" : "Sport eintragen";
  renderSport();
  $("sportSheet").classList.add("open");
  document.querySelector("#sportSheet .sheet").scrollTop = 0;
}
function renderSport() {
  const e = spEd, auto = sportKcal(e.sport, e.int, e.min);
  if (!e.manual) e.kcal = auto;
  const days = [[todayKey(), "Heute"], [dayShift(todayKey(), -1), "Gestern"], [dayShift(todayKey(), -2), "Vorgestern"]];
  $("spBody").innerHTML = `<label>Sportart</label>
    <div class="sp-grid">${SPORTS.map(x => `<button class="sp-opt${x.id === e.sport ? " on" : ""}" data-sp="${x.id}">${ic(x.icon)}${x.name}</button>`).join("")}</div>
    <label>Dauer (Minuten)</label>
    <div class="stepper"><button id="spMinus">−</button><input id="spMin" type="number" inputmode="numeric" value="${e.min}"><button id="spPlus">+</button></div>
    <div class="chips">${[30, 45, 60, 90, 120].map(m => `<button data-min="${m}" class="${e.min === m ? "on" : ""}">${hm(m)}</button>`).join("")}</div>
    <label style="margin-top:12px">Intensität</label>
    <div class="seg" id="spInt">${INTENS.map(([i, n]) => `<button data-int="${i}" class="${e.int === i ? "on" : ""}">${n}</button>`).join("")}</div>
    <label style="margin-top:12px">Wann?</label>
    <div class="chips">${days.map(([d, n]) => `<button data-day="${d}" class="${e.day === d ? "on" : ""}">${n}</button>`).join("")}${days.some(([d]) => d === e.day) ? "" : `<button class="on">${dayLabel(e.day)}</button>`}</div>
    <label style="margin-top:12px">Notiz</label>
    <input id="spNote" value="${esc(e.note || "")}" placeholder="z. B. Sparring, 5 × 6 min">
    <div class="sp-burn"><div><small>Geschätzt verbrannt</small><b>≈ ${fmt(e.kcal)} kcal</b><small>${e.manual ? "selbst eingetragen" : `bei ${de(bodyKg())} kg Körpergewicht`}</small></div>
      <input id="spKcal" type="number" inputmode="numeric" value="${e.kcal}" aria-label="Kalorien anpassen"></div>
    ${e.id ? `<button class="btn danger" id="spDel" style="width:100%;margin-top:16px">Einheit löschen</button>` : ""}`;
  const b = $("spBody");
  b.querySelectorAll("[data-sp]").forEach(x => x.onclick = () => { e.sport = x.dataset.sp; renderSport(); });
  b.querySelectorAll("[data-min]").forEach(x => x.onclick = () => { e.min = +x.dataset.min; renderSport(); });
  b.querySelectorAll("[data-int]").forEach(x => x.onclick = () => { e.int = +x.dataset.int; renderSport(); });
  b.querySelectorAll("[data-day]").forEach(x => x.onclick = () => { e.day = x.dataset.day; renderSport(); });
  $("spMinus").onclick = () => { e.min = Math.max(5, e.min - 5); renderSport(); };
  $("spPlus").onclick = () => { e.min = e.min + 5; renderSport(); };
  $("spMin").onchange = () => { e.min = Math.max(1, Math.round(num($("spMin").value)) || e.min); renderSport(); };
  $("spNote").oninput = () => { e.note = $("spNote").value; };
  $("spKcal").onchange = () => { const v = Math.round(num($("spKcal").value)); e.manual = v > 0 && v !== auto; e.kcal = v > 0 ? v : auto; renderSport(); };
  if ($("spDel")) $("spDel").onclick = () => {
    if (!confirm("Sporteinheit löschen?")) return;
    workouts = workouts.filter(w => w.id !== e.id); saveJSON(WK_KEY, workouts);
    $("sportSheet").classList.remove("open"); afterSport("Gelöscht");
  };
}
$("spSave").onclick = () => {
  const e = spEd; e.note = $("spNote").value.trim();
  const sp = sportById(e.sport), t = new Date(e.day + "T12:00").getTime();
  const rec = { id: e.id || uid(), kind: "sport", sport: e.sport, name: sp.name, day: e.day, min: e.min, int: e.int, kcal: e.kcal, manual: e.manual, note: e.note,
    start: e.start && e.day === (workouts.find(w => w.id === e.id) || {}).day ? e.start : (e.day === todayKey() ? Date.now() - e.min * 60000 : t), items: [] };
  rec.end = rec.start + rec.min * 60000;
  if (e.id) workouts = workouts.map(w => w.id === e.id ? rec : w); else workouts.push(rec);
  profile.lastSport = e.sport; saveJSON(PROFILE_KEY, profile);
  saveJSON(WK_KEY, workouts);
  $("sportSheet").classList.remove("open");
  afterSport(`${sp.name} gespeichert · ≈ ${fmt(rec.kcal)} kcal`);
};
$("sportSheet").addEventListener("click", ev => { if (ev.target.id === "sportSheet") $("sportSheet").classList.remove("open"); });
function afterSport(msg) {
  if (currentTab === "training") renderTraining();
  if (currentTab === "heute") renderToday();
  if (typeof updateSub === "function") updateSub();
  toast(msg);
}

/* ---------- Persönliche Rekorde ---------- */
const e1rm = s => num(s.w) > 0 && num(s.r) > 0 ? num(s.w) * (1 + Math.min(num(s.r), 15) / 30) : 0;
function prMetrics(ex) {
  if (isTime(ex)) return [{ key: "time", label: "Längste Zeit", of: s => num(s.r), fmt: v => `${de(v)} s` }];
  const m = [];
  m.push({ key: "w", label: isBW(ex) ? "Meistes Zusatzgewicht" : "Schwerstes Gewicht", of: s => num(s.w), fmt: v => `${de(v)} kg` });
  m.push({ key: "1rm", label: "Bestes 1RM", of: s => Math.round(e1rm(s) * 2) / 2, fmt: v => `${de(v)} kg` });
  m.push({ key: "reps", label: isBW(ex) ? "Meiste Wiederholungen" : "Meiste Wdh.", of: s => (isBW(ex) || num(s.w) > 0) ? num(s.r) : 0, fmt: v => `${de(v)} Wdh`, onlyBW: !isBW(ex) });
  m.push({ key: "vol", label: "Bestes Satzvolumen", of: s => num(s.w) * num(s.r), fmt: v => `${de(Math.round(v))} kg` });
  return m;
}
function prevBest(exId, metric, excludeId) {
  let best = 0, day = null, cnt = 0;
  for (const w of sortedWorkouts()) {
    if (w.id === excludeId) continue;
    for (const it of w.items) if (it.exId === exId) for (const s of it.sets) if (s.type !== "w") { cnt++; const v = metric.of(s); if (v > best) { best = v; day = w.day; } }
  }
  return { best, day, cnt };
}
/* Welche Rekorde schlägt dieser Satz? (Erstes Mal = kein Rekord; "Meiste Wdh." bei Gewichtsübungen nur, wenn das Gewicht nicht leichter ist) */
function prHits(exId, s, excludeId) {
  const ex = exById(exId), out = [];
  for (const m of prMetrics(ex)) {
    if (m.onlyBW) continue;
    const v = m.of(s); if (!(v > 0)) continue;
    const pb = prevBest(exId, m, excludeId);
    if (pb.cnt && pb.best > 0 && v > pb.best + 1e-9) out.push({ key: m.key, label: m.label, v, val: m.fmt(v), of: m.of, prev: m.fmt(pb.best) });
  }
  const order = ["1rm", "w", "time", "reps", "vol"];
  return out.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
}
function exRecords(exId) {
  const ex = exById(exId);
  return prMetrics(ex).filter(m => !m.onlyBW).map(m => { const pb = prevBest(exId, m, null); return pb.best > 0 ? { label: m.label, val: m.fmt(pb.best), day: pb.day } : null; }).filter(Boolean);
}
let prT = null;
function showPR(name, h) {
  const el = $("prToast");
  el.innerHTML = `${ic("trophy")}<div><b>Neuer Rekord!</b><span>${esc(name)} · ${esc(h.label)}: ${esc(h.val)} <span style="opacity:.7;white-space:nowrap">(vorher ${esc(h.prev)})</span></span></div>`;
  el.classList.add("show");
  if (navigator.vibrate) navigator.vibrate([60, 40, 90]);
  clearTimeout(prT); prT = setTimeout(() => el.classList.remove("show"), 3200);
}
function bestSetOf(exId) {
  const ex = exById(exId); let best = null, sc = 0;
  for (const w of workouts) for (const it of w.items) if (it.exId === exId) for (const s of it.sets) { if (s.type === "w") continue; const v = setScore(ex, s); if (v > sc) { sc = v; best = s; } }
  return best;
}

/* ---------- Training starten ---------- */
function openStart() {
  if (activeWk) { openWk(activeWk, "live"); return; }
  $("startList").innerHTML = `<button class="start-item free" data-sp=""><b>＋ Leeres Training</b><span>Übungen selbst wählen</span></button>` +
    plans.map(p => `<button class="start-item" data-sp="${p.id}"><b>${esc(p.name)}</b><span>${plural(p.items.length, "Übung", "Übungen")}</span></button>`).join("") +
    `<button class="start-item" data-newplan="1"><b>＋ Neuen Plan erstellen</b><span></span></button>` +
    `<button class="start-item" data-sport="1"><b>${ic("run")} Sport eintragen</b><span>Ringen, Laufen, Rad …</span></button>`;
  $("startList").querySelector("[data-sport]").onclick = () => { $("startSheet").classList.remove("open"); openSport(null); };
  $("startList").querySelectorAll("[data-sp]").forEach(b => b.onclick = () => { $("startSheet").classList.remove("open"); startWorkout(plans.find(p => p.id === b.dataset.sp) || null); });
  $("startList").querySelector("[data-newplan]").onclick = () => { $("startSheet").classList.remove("open"); openPlan(null); };
  $("startSheet").classList.add("open");
}
/* Sätze für eine Übung: Ziele aus dem Plan, sonst die letzte Einheit als Vorlage */
function makeItem(exId, planItem) {
  const prev = lastSetsFor(exId) || [];
  const src = planItem ? planItem.sets : (prev.length ? prev.map(p => ({ type: p.type || "n" })) : [{}, {}, {}]);
  const weighted = canWeight(exById(exId)) && (planItem ? !!planItem.weighted : prev.some(p => num(p.w) > 0));
  return {
    exId, note: "", rest: planItem ? (planItem.rest ?? restDefault) : restDefault, weighted,
    sets: src.map(t => ({ w: weighted ? "" : (canWeight(exById(exId)) ? 0 : ""), r: "", done: false, type: t.type || "n", tw: t.w ?? "", tr: t.r ?? "" }))
  };
}
function startWorkout(plan) {
  if (activeWk) { openWk(activeWk, "live"); toast("Es läuft schon ein Training"); return; }
  activeWk = {
    id: uid(), day: todayKey(), start: Date.now(), name: plan ? plan.name : "Training", planId: plan ? plan.id : null,
    items: plan ? plan.items.map(pi => makeItem(pi.exId, pi)) : []
  };
  saveJSON(ACT_KEY, activeWk);
  openWk(activeWk, "live");
  if (!plan) setTimeout(() => $("wkAddEx").click(), 250);
}

/* ---------- Laufende / gespeicherte Einheit ---------- */
let wk = null, wkMode = "live", wkTick = null;
function openWk(w, mode) {
  wk = w; wkMode = mode;
  $("wkTitleTop").textContent = mode === "live" ? "Training" : "Einheit bearbeiten";
  $("wkFinish").textContent = mode === "live" ? "Beenden" : "Speichern";
  $("wkDiscard").textContent = mode === "live" ? "Training verwerfen" : "Einheit löschen";
  renderWk();
  $("workoutSheet").classList.add("open");
  clearInterval(wkTick);
  const upd = () => { $("wkDur").textContent = wkMode === "live" ? mmss(Math.floor((Date.now() - wk.start) / 1000)) : `${Math.max(1, Math.round(((wk.end || wk.start) - wk.start) / 60000))} min`; };
  upd(); wkTick = setInterval(upd, 1000);
}
function closeWk() {
  $("workoutSheet").classList.remove("open");
  clearInterval(wkTick); stopRest();
  if (currentTab === "training") showTab("training");
}
const saveWk = () => { if (wkMode === "live") { activeWk = wk; saveJSON(ACT_KEY, wk); } };
function liveStats() {
  let vol = 0, n = 0;
  for (const it of wk.items) { const ex = exById(it.exId); for (const s of it.sets) if (s.done) { n++; if (!isTime(ex)) vol += num(s.w) * num(s.r); } }
  $("wkVol").textContent = `${de(Math.round(vol))} kg`;
  $("wkSets").textContent = n;
}
/* Platzhalter: letzter Wert (wie bei Hevy), sonst Ziel aus dem Plan – leicht grau hinterlegt */
function hint(it, j, field) {
  const s = it.sets[j], prev = lastSetsFor(it.exId, wk.id) || [];
  const p = prev[j];
  if (p && p[field] !== "" && p[field] != null && !(field === "w" && num(p.w) === 0 && (s.tw !== "" && s.tw != null))) return p[field];
  const t = field === "w" ? s.tw : s.tr;
  return t !== "" && t != null ? t : "";
}

function renderWk() {
  $("wkName").value = wk.name;
  $("wkDate").textContent = `${dayLabel(wk.day)} · ${new Date(wk.start).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr`;
  $("wkList").innerHTML = wk.items.length ? wk.items.map((it, i) => {
    const ex = exById(it.exId), prev = lastSetsFor(it.exId, wk.id) || [], best = bestScore(it.exId, wk.id), t = isTime(ex), labels = setLabels(it.sets);
    const cw = canWeight(ex), wtd = cw && !!it.weighted;
    const rows = it.sets.map((s, j) => {
      const pr = s.done && s.type !== "w" && best > 0 && setScore(ex, s) > best + 1e-9;
      const hw = hint(it, j, "w"), hr = hint(it, j, "r");
      return `<div class="set-row${s.done ? " done" : ""}" data-i="${i}" data-j="${j}">
        <button class="sn st-${s.type || "n"}" data-st="${i}:${j}">${labels[j]}</button>
        <span class="prev">${fmtPrev(ex, prev[j])}</span>
        ${t ? `<input class="in-r span2" inputmode="numeric" type="text" value="${dec(s.r)}" placeholder="${dec(hr) || "Sek."}">`
            : `${cw && !wtd ? `<span class="bw-cell">–</span>` : `<input class="in-w" inputmode="decimal" type="text" value="${dec(s.w === 0 && cw ? "" : s.w)}" placeholder="${(cw && !(num(hw) > 0) ? "" : dec(hw)) || (cw ? "+kg" : "kg")}">`}<input class="in-r" inputmode="numeric" type="text" value="${dec(s.r)}" placeholder="${dec(hr) || "Wdh"}">`}
        <button class="chk${pr ? " pr" : ""}">${pr ? ic("trophy") : ic("check")}</button></div>`;
    }).join("");
    return `<div class="ex-block">
      <div class="ex-head">${exThumb(ex, "ex-thumb", wtd)}<button class="ex-name" data-exd="${it.exId}">${esc(ex.name)}${ex.equip ? ` <span>(${ex.equip})</span>` : ""}</button><button class="ex-more" data-exm="${i}">⋯</button></div>
      <input class="ex-note" data-note="${i}" value="${esc(it.note || "")}" placeholder="Notiz hinzufügen …">
      <div class="ex-opts"><label class="ex-rest">${ic("timer")} Pause: ${restSelect(it.rest ?? restDefault, `data-rest="${i}"`)}</label>${cw ? `<button class="wt-toggle${wtd ? " on" : ""}" data-wt="${i}">${wtd ? "✓ Mit Zusatzgewicht" : "＋ Zusatzgewicht"}</button>` : ""}</div>
      <div class="set-row head"><span>Satz</span><span>Vorher</span>${t ? `<span class="span2">Sek.</span>` : `<span>${cw ? (wtd ? "+kg" : "") : "kg"}</span><span>Wdh</span>`}<span>✓</span></div>
      ${rows}
      <button class="add-set" data-addset="${i}">＋ Satz hinzufügen</button></div>`;
  }).join("") : `<div class="empty" style="padding:30px 10px"><div class="big">${ic("dumbbell")}</div>Füg deine erste Übung hinzu.</div>`;
  liveStats();

  const list = $("wkList");
  list.querySelectorAll(".set-row[data-i]").forEach(row => {
    const it = wk.items[row.dataset.i], j = +row.dataset.j, s = it.sets[j];
    const w = row.querySelector(".in-w"), r = row.querySelector(".in-r");
    if (w) w.oninput = () => { s.w = w.value.trim() === "" ? "" : num(w.value); saveWk(); if (s.done) liveStats(); };
    r.oninput = () => { s.r = r.value.trim() === "" ? "" : num(r.value); saveWk(); if (s.done) liveStats(); };
    row.querySelector(".chk").onclick = () => {
      if (!s.done) {
        if (w && s.w === "") { const h = hint(it, j, "w"); s.w = h === "" ? 0 : num(h); }
        if (!w && canWeight(exById(it.exId))) s.w = 0;
        if (s.r === "") { const h = hint(it, j, "r"); if (h !== "") s.r = num(h); }
        if (s.r === "" || num(s.r) <= 0) { s.w = w && w.value.trim() === "" ? "" : s.w; toast(isTime(exById(it.exId)) ? "Bitte Sekunden eintragen" : "Bitte Wiederholungen eintragen"); return; }
        s.done = true;
        if (wkMode === "live" && (it.rest ?? restDefault) > 0) startRest(it.rest ?? restDefault);
        if (s.type !== "w") {
          const others = it.sets.filter((x, k) => k !== j && x.done && x.type !== "w");
          const hits = prHits(it.exId, s, wk.id).filter(h => others.every(o => h.of(o) < h.v - 1e-9));
          if (hits.length) showPR(exById(it.exId).name, hits[0]);
        }
      } else s.done = false;
      saveWk(); renderWk();
      const nb = $("wkList").querySelector(`.set-row[data-i="${row.dataset.i}"][data-j="${j}"] .chk`); if (nb && s.done) nb.classList.add("pop");
    };
  });
  list.querySelectorAll("[data-st]").forEach(b => b.onclick = () => {
    const [i, j] = b.dataset.st.split(":").map(Number), it = wk.items[i];
    openActions(`Satz ${setLabels(it.sets)[j]}`, [
      ...Object.entries(SET_NAMES).map(([k, label]) => ({ label: (it.sets[j].type || "n") === k ? `✓ ${label}` : label, fn: () => { it.sets[j].type = k; saveWk(); renderWk(); } })),
      { label: "Satz löschen", cls: "danger", fn: () => { it.sets.splice(j, 1); if (!it.sets.length) wk.items.splice(i, 1); saveWk(); renderWk(); } }
    ]);
  });
  list.querySelectorAll("[data-addset]").forEach(b => b.onclick = () => {
    const it = wk.items[b.dataset.addset], last = it.sets[it.sets.length - 1];
    it.sets.push({ w: "", r: "", done: wkMode === "edit" && false, type: "n", tw: last ? (last.w !== "" ? last.w : last.tw) : "", tr: last ? (last.r !== "" ? last.r : last.tr) : "" });
    saveWk(); renderWk();
  });
  list.querySelectorAll("[data-note]").forEach(inp => inp.oninput = () => { wk.items[inp.dataset.note].note = inp.value; saveWk(); });
  list.querySelectorAll("[data-wt]").forEach(b => b.onclick = () => {
    const it = wk.items[b.dataset.wt];
    it.weighted = !it.weighted;
    it.sets.forEach(st => { if (!it.weighted) st.w = 0; else if (!st.done) st.w = ""; });
    saveWk(); renderWk();
    toast(it.weighted ? "Zusatzgewicht an – trag die kg pro Satz ein" : "Nur Körpergewicht");
  });
  list.querySelectorAll("[data-rest]").forEach(sel => sel.onchange = () => { wk.items[sel.dataset.rest].rest = +sel.value; saveWk(); });
  list.querySelectorAll("[data-exm]").forEach(b => b.onclick = () => {
    const i = +b.dataset.exm;
    openActions(exById(wk.items[i].exId).name, [
      { label: "↑ Nach oben", fn: () => { if (i > 0) { [wk.items[i - 1], wk.items[i]] = [wk.items[i], wk.items[i - 1]]; saveWk(); renderWk(); } } },
      { label: "↓ Nach unten", fn: () => { if (i < wk.items.length - 1) { [wk.items[i + 1], wk.items[i]] = [wk.items[i], wk.items[i + 1]]; saveWk(); renderWk(); } } },
      { label: "Übung ersetzen", fn: () => openExPick(id => { const old = wk.items[i]; wk.items[i] = { ...makeItem(id), sets: old.sets.map(s => ({ ...s, done: false, w: "", r: "", tw: "", tr: "" })) }; saveWk(); renderWk(); }, "Übung ersetzen") },
      { label: "Übung entfernen", cls: "danger", fn: () => { wk.items.splice(i, 1); saveWk(); renderWk(); } }
    ]);
  });
  list.querySelectorAll("[data-exd]").forEach(b => b.onclick = () => openExDetail(b.dataset.exd));
}

$("wkName").oninput = () => { wk.name = $("wkName").value; saveWk(); };
$("wkMin").onclick = closeWk;
$("wkAddEx").onclick = () => openExPick(id => {
  wk.items.push(makeItem(id));
  saveWk(); renderWk();
  setTimeout(() => { const sc = document.querySelector("#workoutSheet .wk-scroll"); sc.scrollTop = sc.scrollHeight; }, 50);
}, "Übung hinzufügen");
function discardWk(ask) {
  if (wkMode === "live") {
    if (ask && !confirm("Training verwerfen? Nichts wird gespeichert.")) return;
    activeWk = null; try { localStorage.removeItem(ACT_KEY); } catch (e) {}
  } else {
    if (ask && !confirm("Diese Einheit endgültig löschen?")) return;
    workouts = workouts.filter(w => w.id !== wk.id); saveJSON(WK_KEY, workouts);
  }
  $("finishSheet").classList.remove("open");
  closeWk(); toast(wkMode === "live" ? "Training verworfen" : "Einheit gelöscht");
}
$("wkDiscard").onclick = () => discardWk(true);

function buildRecord() {
  const items = wk.items.map(it => ({ exId: it.exId, note: it.note || "", rest: it.rest, weighted: !!it.weighted, sets: it.sets.filter(s => s.done).map(s => ({ w: s.w === "" ? 0 : num(s.w), r: num(s.r), done: true, type: s.type || "n" })) })).filter(it => it.sets.length);
  const prList = [];
  for (const it of items) {
    const seen = new Set();
    for (const st of it.sets) if (st.type !== "w") for (const h of prHits(it.exId, st, wk.id)) {
      const better = it.sets.some(o => o !== st && o.type !== "w" && h.of(o) > h.v + 1e-9);
      if (!better && !seen.has(h.key)) { seen.add(h.key); prList.push({ exId: it.exId, key: h.key, label: h.label, val: h.val }); }
    }
  }
  const prs = new Set(prList.map(r => r.exId)).size;
  const rec = { id: wk.id, day: wk.day, start: wk.start, end: wkMode === "live" ? Date.now() : (wk.end || Date.now()), name: (wk.name || "").trim() || "Training", planId: wk.planId || null, items, prs, prList };
  return rec;
}
$("wkFinish").onclick = () => {
  const rec = buildRecord();
  if (!rec.items.length) {
    if (confirm(wkMode === "live" ? "Noch kein Satz abgehakt. Training verwerfen?" : "Keine Sätze mehr übrig. Einheit löschen?")) discardWk(false);
    return;
  }
  if (wkMode === "edit") { saveRecord(rec); return; }
  const open = wk.items.reduce((a, it) => a + it.sets.filter(s => !s.done).length, 0);
  $("fsName").value = rec.name;
  $("fsStats").innerHTML = `<div class="stat"><b>${mmss(Math.floor((rec.end - rec.start) / 1000))}</b><span>Dauer</span></div>
    <div class="stat"><b>${de(Math.round(volumeOf(rec)))} kg</b><span>Volumen</span></div>
    <div class="stat"><b>${setsOf(rec)}</b><span>Sätze</span></div>
    <div class="stat"><b>${rec.prs ? ic("trophy") + " " + rec.prs : "–"}</b><span>Rekorde</span></div>`;
  $("fsPRs").innerHTML = rec.prList.length ? rec.prList.map(r => `<div>${ic("trophy")}<span><b>${esc(exById(r.exId).name)}</b> · ${esc(r.label)}: ${esc(r.val)}</span></div>`).join("") : "";
  $("fsHint").textContent = open ? `${plural(open, "Satz ist", "Sätze sind")} nicht abgehakt und ${open === 1 ? "wird" : "werden"} nicht gespeichert.` : "";
  $("finishSheet").classList.add("open");
};
function saveRecord(rec) {
  if (wkMode === "live") { workouts.push(rec); activeWk = null; try { localStorage.removeItem(ACT_KEY); } catch (e) {} }
  else workouts = workouts.map(w => w.id === rec.id ? rec : w);
  saveJSON(WK_KEY, workouts);
  $("finishSheet").classList.remove("open");
  const live = wkMode === "live";
  closeWk();
  toast(live ? `Stark! ${plural(setsOf(rec), "Satz", "Sätze")} gespeichert${rec.prs ? ` · ${rec.prs} ${rec.prs === 1 ? "neuer Rekord" : "neue Rekorde"}` : ""}` : "Gespeichert ✓");
}
$("fsSave").onclick = () => { wk.name = $("fsName").value; const rec = buildRecord(); saveRecord(rec); };
$("fsResume").onclick = () => $("finishSheet").classList.remove("open");

/* ---------- Auswahl-Menü (Aktionen) ---------- */
function openActions(title, items) {
  $("actTitle").textContent = title;
  $("actList").innerHTML = items.map((it, k) => `<button class="act-btn ${it.cls || ""}" data-act="${k}">${esc(it.label)}</button>`).join("");
  $("actList").querySelectorAll("[data-act]").forEach(b => b.onclick = () => { $("actSheet").classList.remove("open"); items[+b.dataset.act].fn(); });
  $("actSheet").classList.add("open");
}

/* ---------- Pausen-Timer ---------- */
let restEnd = 0, restIv = null;
function startRest(sec) {
  restEnd = Date.now() + sec * 1000;
  $("restBar").classList.add("show"); $("restBar").classList.remove("over");
  clearInterval(restIv); tickRest(); restIv = setInterval(tickRest, 250);
}
function tickRest() {
  const left = Math.ceil((restEnd - Date.now()) / 1000);
  if (left <= 0) {
    $("restTime").textContent = "Los geht's!";
    if (!$("restBar").classList.contains("over")) {
      $("restBar").classList.add("over");
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
    if (left < -20) stopRest();
    return;
  }
  $("restTime").textContent = mmss(left);
}
function stopRest() { clearInterval(restIv); $("restBar").classList.remove("show", "over"); }
$("restMinus").onclick = () => { restEnd -= 15000; tickRest(); };
$("restPlus").onclick = () => { restEnd += 15000; tickRest(); };
$("restStop").onclick = stopRest;

/* ---------- Trainingsplan erstellen / bearbeiten ---------- */
let planEdit = null;
function openPlan(id) {
  const p = plans.find(x => x.id === id);
  planEdit = p ? JSON.parse(JSON.stringify(p)) : { id: null, name: "", items: [] };
  $("plTitle").textContent = p ? "Plan bearbeiten" : "Neuer Trainingsplan";
  $("plName").value = planEdit.name;
  $("plDelete").style.display = p ? "block" : "none";
  $("plStart").style.display = p ? "block" : "none";
  renderPlan();
  $("planSheet").classList.add("open");
  document.querySelector("#planSheet .sheet").scrollTop = 0;
}
function renderPlan() {
  $("plList").innerHTML = planEdit.items.length ? planEdit.items.map((it, i) => {
    const ex = exById(it.exId), t = isTime(ex), prev = lastSetsFor(it.exId) || [], labels = setLabels(it.sets), cw = canWeight(ex), wtd = cw && !!it.weighted;
    return `<div class="ex-block plan-ex">
      <div class="ex-head">${exThumb(ex, "ex-thumb", wtd)}<span class="ex-name">${esc(ex.name)}${ex.equip ? ` <span>(${ex.equip})</span>` : ""}</span><button class="ex-more" data-pm="${i}">⋯</button></div>
      <div class="ex-opts"><label class="ex-rest">${ic("timer")} Pause: ${restSelect(it.rest ?? restDefault, `data-prest="${i}"`)}</label>${cw ? `<button class="wt-toggle${wtd ? " on" : ""}" data-pwt="${i}">${wtd ? "✓ Mit Zusatzgewicht" : "＋ Zusatzgewicht"}</button>` : ""}</div>
      <div class="set-row head plan-row"><span>Satz</span>${t ? `<span class="span2">Sek. (Ziel)</span>` : `<span>${cw ? (wtd ? "+kg (Ziel)" : "") : "kg (Ziel)"}</span><span>Wdh</span>`}<span></span></div>
      ${it.sets.map((s, j) => `<div class="set-row plan-row" data-pi="${i}" data-pj="${j}">
        <button class="sn st-${s.type || "n"}" data-pst="${i}:${j}">${labels[j]}</button>
        ${t ? `<input class="p-r span2" inputmode="numeric" type="text" value="${dec(s.r)}" placeholder="${prev[j] ? dec(prev[j].r) : "Sek."}">`
            : `${cw && !wtd ? `<span class="bw-cell">–</span>` : `<input class="p-w" inputmode="decimal" type="text" value="${dec(s.w)}" placeholder="${prev[j] && num(prev[j].w) > 0 ? dec(prev[j].w) : (cw ? "+kg" : "kg")}">`}<input class="p-r" inputmode="numeric" type="text" value="${dec(s.r)}" placeholder="${prev[j] ? dec(prev[j].r) : "Wdh"}">`}
        <button class="rm" data-pdel="${i}:${j}">✕</button></div>`).join("")}
      <button class="add-set" data-padd="${i}">＋ Satz hinzufügen</button></div>`;
  }).join("") : `<p class="hint" style="margin:10px 4px 14px">Noch keine Übungen. Füg unten deine erste hinzu.</p>`;
  const L = $("plList");
  L.querySelectorAll(".set-row[data-pi]").forEach(row => {
    const s = planEdit.items[row.dataset.pi].sets[row.dataset.pj];
    const w = row.querySelector(".p-w"), r = row.querySelector(".p-r");
    if (w) w.oninput = () => { s.w = w.value.trim() === "" ? "" : num(w.value); };
    r.oninput = () => { s.r = r.value.trim() === "" ? "" : num(r.value); };
  });
  L.querySelectorAll("[data-pdel]").forEach(b => b.onclick = () => { const [i, j] = b.dataset.pdel.split(":").map(Number); planEdit.items[i].sets.splice(j, 1); if (!planEdit.items[i].sets.length) planEdit.items.splice(i, 1); renderPlan(); });
  L.querySelectorAll("[data-padd]").forEach(b => b.onclick = () => { const it = planEdit.items[b.dataset.padd], last = it.sets[it.sets.length - 1]; it.sets.push({ w: last ? last.w : "", r: last ? last.r : "", type: "n" }); renderPlan(); });
  L.querySelectorAll("[data-prest]").forEach(sel => sel.onchange = () => { planEdit.items[sel.dataset.prest].rest = +sel.value; });
  L.querySelectorAll("[data-pwt]").forEach(b => b.onclick = () => { const it = planEdit.items[b.dataset.pwt]; it.weighted = !it.weighted; if (!it.weighted) it.sets.forEach(st => st.w = ""); renderPlan(); });
  L.querySelectorAll("[data-pst]").forEach(b => b.onclick = () => {
    const [i, j] = b.dataset.pst.split(":").map(Number), it = planEdit.items[i];
    openActions(`Satz ${setLabels(it.sets)[j]}`, Object.entries(SET_NAMES).map(([k, label]) => ({ label: (it.sets[j].type || "n") === k ? `✓ ${label}` : label, fn: () => { it.sets[j].type = k; renderPlan(); } })));
  });
  L.querySelectorAll("[data-pm]").forEach(b => b.onclick = () => {
    const i = +b.dataset.pm;
    openActions(exById(planEdit.items[i].exId).name, [
      { label: "↑ Nach oben", fn: () => { if (i > 0) { [planEdit.items[i - 1], planEdit.items[i]] = [planEdit.items[i], planEdit.items[i - 1]]; renderPlan(); } } },
      { label: "↓ Nach unten", fn: () => { if (i < planEdit.items.length - 1) { [planEdit.items[i + 1], planEdit.items[i]] = [planEdit.items[i], planEdit.items[i + 1]]; renderPlan(); } } },
      { label: "Übung ersetzen", fn: () => openExPick(id => { planEdit.items[i].exId = id; renderPlan(); }, "Übung ersetzen") },
      { label: "Übung entfernen", cls: "danger", fn: () => { planEdit.items.splice(i, 1); renderPlan(); } }
    ]);
  });
}
$("plName").oninput = () => { planEdit.name = $("plName").value; };
$("plAdd").onclick = () => openExPick(id => {
  const t = isTime(exById(id));
  planEdit.items.push({ exId: id, rest: restDefault, sets: [0, 1, 2].map(() => ({ w: "", r: t ? 45 : "", type: "n" })) });
  renderPlan();
  setTimeout(() => { const sh = document.querySelector("#planSheet .sheet"); sh.scrollTop = sh.scrollHeight; }, 50);
}, "Übung hinzufügen");
$("plSave").onclick = () => {
  const name = $("plName").value.trim();
  if (!name) { toast("Gib dem Plan einen Namen"); $("plName").focus(); return; }
  if (!planEdit.items.length) { toast("Füg mindestens eine Übung hinzu"); return; }
  const p = { ...planEdit, name, id: planEdit.id || uid() };
  plans = planEdit.id ? plans.map(x => x.id === p.id ? p : x) : [...plans, p];
  saveJSON(PLAN_KEY, plans);
  $("planSheet").classList.remove("open"); renderTraining(); toast("Plan gespeichert ✓");
};
$("plDelete").onclick = () => {
  if (!confirm(`Plan „${planEdit.name}“ löschen?`)) return;
  plans = plans.filter(p => p.id !== planEdit.id); saveJSON(PLAN_KEY, plans);
  $("planSheet").classList.remove("open"); renderTraining(); toast("Plan gelöscht");
};
$("plStart").onclick = () => { $("planSheet").classList.remove("open"); startWorkout(plans.find(p => p.id === planEdit.id)); };

/* ---------- Übung wählen / anlegen ---------- */
let exPickCb = null;
function openExPick(cb, title) {
  exPickCb = cb;
  $("epTitle").textContent = title;
  $("epSearch").value = "";
  $("epNew").open = false;
  $("epGroup").innerHTML = EX_GROUPS.map(g => `<option>${g}</option>`).join("");
  $("epEquipSel").innerHTML = EQUIP.map(g => `<option>${g}</option>`).join("");
  epGrp = "Alle";
  renderExPick();
  $("exPickSheet").classList.add("open");
  document.querySelector("#exPickSheet .sheet").scrollTop = 0;
}
let epGrp = "Alle";
function renderExPick() {
  $("epEquipF").innerHTML = ["Alle", ...EX_GROUPS].map(g => `<button data-grp="${g}" class="${epGrp === g ? "on" : ""}">${g}</button>`).join("");
  $("epEquipF").querySelectorAll("[data-grp]").forEach(b => b.onclick = () => { epGrp = b.dataset.grp; renderExPick(); });
  const words = $("epSearch").value.toLowerCase().split(/\s+/).filter(Boolean);
  const match = e => words.every(w => (e.name + " " + e.equip + " " + e.group).toLowerCase().includes(w));
  /* alphabetisch, bei gleichem Namen nach Equipment */
  const list = exercises.filter(e => (epGrp === "Alle" || e.group === epGrp) && match(e))
    .sort((a, b) => a.name.localeCompare(b.name, "de") || (a.equip || "").localeCompare(b.equip || "", "de"));
  let html = "", letter = "", rows = [];
  const flush = () => { if (rows.length) html += `<div class="cat-title">${letter}</div><div class="shop-list">${rows.join("")}</div>`; rows = []; };
  for (const e of list) {
    const L = e.name.charAt(0).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (L !== letter) { flush(); letter = L; }
    const b = bestSetOf(e.id);
    rows.push(`<div class="shop-item" data-ep="${e.id}" style="cursor:pointer">${exThumb(e)}<div class="item-main"><div class="item-name">${esc(e.name)}</div><div class="item-sub">${e.equip ? `<span class="eq-tag">${e.equip}</span> ` : ""}${e.group}${isTime(e) ? " · Zeit" : ""}${b ? ` · Best: ${fmtSet(e, b)}` : ""}${e.custom ? " · eigene" : ""}</div></div><span class="item-sub">›</span></div>`);
  }
  flush();
  $("epList").innerHTML = html || `<div class="empty" style="padding:30px 10px">Nichts gefunden – leg die Übung oben als eigene Übung an.</div>`;
  $("epList").querySelectorAll("[data-ep]").forEach(r => r.onclick = () => pickEx(r.dataset.ep));
}
function pickEx(id) {
  if (exPickCb) { $("exPickSheet").classList.remove("open"); exPickCb(id); }
  else openExDetail(id);
}
$("epSearch").oninput = () => { renderExPick(); if (!$("epNew").open) $("epName").value = $("epSearch").value; };
$("epCreate").onclick = () => {
  const name = $("epName").value.trim();
  if (!name) { toast("Bitte einen Namen eingeben"); return; }
  const ex = { id: "ex_" + uid(), name, group: $("epGroup").value, equip: $("epEquipSel").value, type: $("epType").value, custom: true };
  if (exercises.some(e => e.name.toLowerCase() === name.toLowerCase() && e.equip === ex.equip)) { toast("Diese Übung gibt es schon"); return; }
  customEx.push(ex); saveJSON(CUSTOM_KEY, customEx); rebuildEx();
  $("epName").value = ""; $("epNew").open = false;
  toast("Übung angelegt ✓");
  pickEx(ex.id);
};

/* ---------- Fortschritt einer Übung ---------- */
let exDetailId = null;
function openExDetail(id) {
  exDetailId = id;
  const ex = exById(id), t = isTime(ex);
  const hist = sortedWorkouts().map(w => ({ w, it: w.items.find(i => i.exId === id) })).filter(x => x.it && x.it.sets.length);
  $("exTitle").textContent = ex.name;
  $("exEquip").textContent = [ex.group, ex.equip].filter(Boolean).join(" · ");
  $("exHero").innerHTML = exThumb(ex, "ex-hero");
  let html = "";
  if (!hist.length) html += `<div class="empty" style="padding:30px 10px"><div class="big">${ic("trend")}</div>Noch keine Einträge.<br>Sobald du die Übung trainierst, siehst du hier deine Kurve.</div>`;
  else {
    const pts = hist.map(({ w, it }) => ({ day: w.day, v: t ? Math.max(...it.sets.map(s => num(s.r))) : Math.max(...it.sets.map(s => num(s.w) || 0)), e: Math.max(...it.sets.map(s => setScore(ex, s))) }));
    const useReps = !t && pts.every(p => p.v === 0);
    if (useReps) pts.forEach((p, k) => { p.v = Math.max(...hist[k].it.sets.map(s => num(s.r))); });
    const best = bestSetOf(id), bestE = Math.max(...pts.map(p => p.e));
    html += `<div class="stat-row">
      <div class="stat"><b>${best ? fmtSet(ex, best) : "–"}</b><span>Bester Satz</span></div>
      ${!t && !useReps ? `<div class="stat"><b>${de(Math.round(bestE * 2) / 2)} kg</b><span>1RM geschätzt</span></div>` : ""}
      <div class="stat"><b>${hist.length}</b><span>Einheiten</span></div></div>`;
    const recs = exRecords(id);
    if (recs.length) html += `<div class="card-title" style="margin:16px 4px 0">${ic("trophy")} Persönliche Rekorde</div><div class="rec-grid">${recs.map(r => `<div><span>${r.label}</span><b>${r.val}</b><small>${dayLabel(r.day)}</small></div>`).join("")}</div>`;
    html += `<div class="card" style="margin-top:12px"><div class="card-title">${t ? "Längste Zeit (s)" : useReps ? "Meiste Wiederholungen" : "Höchstes Gewicht (kg)"} pro Einheit</div>${chartSVG(pts.slice(-20))}</div>`;
    html += `<div class="card-title" style="margin:16px 4px 8px">Verlauf</div><div class="list">${hist.slice().reverse().map(({ w, it }) => `<div class="item" style="cursor:default"><div class="item-main"><div class="item-name">${dayLabel(w.day)}</div><div class="item-sub">${it.sets.map(s => (s.type === "w" ? "W " : "") + fmtSet(ex, s)).join(" · ")}</div></div></div>`).join("")}</div>`;
  }
  html += `<button class="btn danger" id="exDel" style="width:100%;margin-top:16px">Übung löschen</button>`;
  $("exBody").innerHTML = html;
  $("exDel").onclick = () => {
    const used = workouts.some(w => w.items.some(i => i.exId === id)) || plans.some(p => p.items.some(i => i.exId === id));
    if (!confirm(used ? "Die Übung wird in Plänen oder im Verlauf benutzt. Trotzdem löschen? Der Verlauf bleibt erhalten." : "Übung löschen?")) return;
    if (BUILTIN_IDS.has(id)) { hiddenEx.push(id); saveJSON(HIDDEN_KEY, hiddenEx); }
    else { customEx = customEx.filter(e => e.id !== id); saveJSON(CUSTOM_KEY, customEx); }
    rebuildEx();
    $("exSheet").classList.remove("open");
    if ($("exPickSheet").classList.contains("open")) renderExPick();
    if (currentTab === "training") renderTraining();
  };
  $("exSheet").classList.add("open");
  document.querySelector("#exSheet .sheet").scrollTop = 0;
}
function chartSVG(pts) {
  const W = 320, H = 150, pl = 34, pr = 12, pt = 14, pb = 26;
  const vals = pts.map(p => p.v), min = Math.min(...vals), max = Math.max(...vals);
  const lo = min === max ? min - 1 : min - (max - min) * .15, hi = min === max ? max + 1 : max + (max - min) * .15;
  const X = i => pts.length === 1 ? (pl + W - pr) / 2 : pl + i * (W - pl - pr) / (pts.length - 1);
  const Y = v => pt + (1 - (v - lo) / (hi - lo)) * (H - pt - pb);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(p.v).toFixed(1)}`).join("");
  const area = `${line}L${X(pts.length - 1).toFixed(1)} ${H - pb}L${X(0).toFixed(1)} ${H - pb}Z`;
  const short = d => new Date(d + "T12:00").toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
  const grid = [lo + (hi - lo) * .2, lo + (hi - lo) * .5, lo + (hi - lo) * .8].map(v => `<path d="M${pl} ${Y(v).toFixed(1)}H${W - pr}" stroke="var(--line)" stroke-dasharray="3 3"/><text x="${pl - 5}" y="${(Y(v) + 3.5).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--muted)">${de(Math.round(v * 10) / 10)}</text>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" class="chart"><defs><linearGradient id="chG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--accent);stop-opacity:.28"/><stop offset="1" style="stop-color:var(--accent);stop-opacity:0"/></linearGradient></defs>
    ${grid}<path d="${area}" fill="url(#chG)"/><path d="${line}" fill="none" stroke="var(--accent)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
    ${pts.map((p, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="${i === pts.length - 1 ? 4.5 : 3}" fill="var(--card)" stroke="var(--accent)" stroke-width="2"/>`).join("")}
    <text x="${X(0).toFixed(1)}" y="${H - 8}" font-size="10" fill="var(--muted)" text-anchor="${pts.length === 1 ? "middle" : "start"}">${short(pts[0].day)}</text>
    ${pts.length > 1 ? `<text x="${X(pts.length - 1).toFixed(1)}" y="${H - 8}" font-size="10" fill="var(--muted)" text-anchor="end">${short(pts[pts.length - 1].day)}</text>` : ""}</svg>`;
}

["startSheet", "planSheet", "exPickSheet", "exSheet", "finishSheet", "actSheet"].forEach(id => $(id).addEventListener("click", e => { if (e.target.id === id) $(id).classList.remove("open"); }));

/* ---------- Untertitel in der Kopfzeile ---------- */
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
function updateSub() {
  let t = "";
  if (currentTab === "heute") t = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
  else if (currentTab === "kuehlschrank") t = plural(products.filter(inStock).length, "Produkt vorrätig", "Produkte vorrätig");
  else if (currentTab === "produkte") t = `${plural(products.length, "Lebensmittel", "Lebensmittel")} · ${plural(templates.length, "Mahlzeit", "Mahlzeiten")}`;
  else if (currentTab === "training") {
    const wkN = workouts.filter(w => weekDays().includes(w.day)).length;
    t = activeWk ? "Training läuft – weiter geht's" : `${plural(wkN, "Einheit", "Einheiten")} diese Woche`;
  }
  else if (currentTab === "vorschlaege") {
    const k = RECIPES.filter(r => (curDiet() === "alle" || recipeDiet(r)[curDiet()]) && analyzeRecipe(r).missing.length === 0).length;
    t = k ? `${plural(k, "Rezept", "Rezepte")} kannst du jetzt kochen` : "Fitness-Rezepte für deinen Kühlschrank";
  }
  $("subtitle").textContent = t;
}
new MutationObserver(updateSub).observe($("view"), { childList: true });

