/* =========================================================
   Training
   ========================================================= */
const EX_KEY = "makro.exercises", PLAN_KEY = "makro.plans", WK_KEY = "makro.workouts", ACT_KEY = "makro.activeWorkout", REST_KEY = "makro.restSec";
const EX_GROUPS = ["Brust", "Rücken", "Schultern", "Bizeps", "Trizeps", "Beine", "Po", "Waden", "Bauch"];
const EQUIP = ["Langhantel", "Kurzhantel", "SZ-Stange", "Maschine", "Smith-Maschine", "Kabelzug", "Körpergewicht", "Kettlebell"];
const LH = "Langhantel", KH = "Kurzhantel", SZ = "SZ-Stange", MA = "Maschine", SM = "Smith-Maschine", KZ = "Kabelzug", KG = "Körpergewicht", KB = "Kettlebell";
const BUILTIN_EX = [
  /* Brust */
  ["bank", "Bankdrücken", "Brust", LH], ["bank_kh", "Bankdrücken", "Brust", KH], ["bank_sm", "Bankdrücken", "Brust", SM],
  ["schraeg_lh", "Schrägbankdrücken", "Brust", LH], ["schraeg", "Schrägbankdrücken", "Brust", KH], ["schraeg_sm", "Schrägbankdrücken", "Brust", SM],
  ["negativ", "Negativbankdrücken", "Brust", LH], ["brustpresse", "Brustpresse", "Brust", MA], ["brustpresse_s", "Schräge Brustpresse", "Brust", MA],
  ["butterfly", "Butterfly", "Brust", MA], ["fliegende", "Fliegende", "Brust", KH], ["crossover", "Cable Crossover", "Brust", KZ],
  ["lowhigh", "Fliegende von unten (Low-to-High)", "Brust", KZ], ["pullover", "Pullover", "Brust", KH], ["dips", "Dips (Brust)", "Brust", KG], ["liegest", "Liegestütze", "Brust", KG],
  /* Rücken */
  ["klimm", "Klimmzüge (Obergriff)", "Rücken", KG], ["chinup", "Klimmzüge (Untergriff)", "Rücken", KG], ["klimm_ass", "Klimmzüge assistiert", "Rücken", MA],
  ["latzug", "Latzug breit", "Rücken", KZ], ["latzug_eng", "Latzug eng (V-Griff)", "Rücken", KZ], ["latzug_ug", "Latzug Untergriff", "Rücken", KZ], ["latzug_ma", "Latzug", "Rücken", MA],
  ["kreuz", "Kreuzheben", "Rücken", LH], ["sumo", "Sumo-Kreuzheben", "Rücken", LH],
  ["rudern", "Rudern vorgebeugt", "Rücken", LH], ["rudern_kh", "Rudern einarmig", "Rücken", KH], ["tbar", "T-Bar-Rudern", "Rücken", MA],
  ["kabelrud", "Rudern sitzend", "Rücken", KZ], ["rudermaschine", "Rudermaschine (brustgestützt)", "Rücken", MA],
  ["straightarm", "Straight-Arm Pulldown", "Rücken", KZ], ["invrow", "Inverted Rows", "Rücken", KG],
  ["hyper", "Rückenstrecker (Hyperextensions)", "Rücken", KG], ["shrug_kh", "Shrugs", "Rücken", KH], ["shrug_lh", "Shrugs", "Rücken", LH],
  /* Schultern */
  ["ohp", "Schulterdrücken stehend", "Schultern", LH], ["khschulter", "Schulterdrücken", "Schultern", KH], ["arnold", "Arnold Press", "Schultern", KH],
  ["schulterpresse", "Schulterpresse", "Schultern", MA], ["ohp_sm", "Schulterdrücken", "Schultern", SM],
  ["seitheben", "Seitheben", "Schultern", KH], ["seitheben_kz", "Seitheben", "Schultern", KZ], ["seitheben_ma", "Seitheben", "Schultern", MA],
  ["frontheben", "Frontheben", "Schultern", KH], ["revfly", "Reverse Butterfly", "Schultern", MA], ["revfly_kh", "Vorgebeugtes Seitheben", "Schultern", KH],
  ["facepull", "Face Pulls", "Schultern", KZ], ["uprow", "Aufrechtes Rudern", "Schultern", SZ], ["pike", "Pike Push-ups", "Schultern", KG],
  /* Bizeps */
  ["curl_lh", "Bizepscurls", "Bizeps", LH], ["curl_sz", "Bizepscurls", "Bizeps", SZ], ["curls", "Bizepscurls", "Bizeps", KH],
  ["hammer", "Hammercurls", "Bizeps", KH], ["curl_schraeg", "Schrägbank-Curls", "Bizeps", KH], ["konz", "Konzentrationscurls", "Bizeps", KH],
  ["preacher", "Scottcurls (Preacher Curls)", "Bizeps", SZ], ["curl_ma", "Bizepsmaschine", "Bizeps", MA], ["curl_kz", "Bizepscurls", "Bizeps", KZ], ["hammer_kz", "Hammercurls am Seil", "Bizeps", KZ],
  /* Trizeps */
  ["trizeps", "Trizepsdrücken (Seil)", "Trizeps", KZ], ["trizeps_st", "Trizepsdrücken (Stange)", "Trizeps", KZ], ["trizeps_oh", "Überkopf-Trizepsdrücken", "Trizeps", KZ],
  ["trizeps_kh", "Überkopf-Trizepsdrücken", "Trizeps", KH], ["french", "French Press", "Trizeps", SZ], ["engbank", "Enges Bankdrücken", "Trizeps", LH],
  ["kickback", "Trizeps-Kickbacks", "Trizeps", KH], ["dips_tri", "Dips (Trizeps)", "Trizeps", KG], ["bankdips", "Bankdips", "Trizeps", KG],
  ["dips_ma", "Dip-Maschine", "Trizeps", MA], ["engliegest", "Enge Liegestütze", "Trizeps", KG],
  /* Beine */
  ["kniebeuge", "Kniebeuge", "Beine", LH], ["frontkb", "Frontkniebeuge", "Beine", LH], ["kniebeuge_sm", "Kniebeuge", "Beine", SM],
  ["goblet", "Goblet Squat", "Beine", KH], ["hack", "Hackenschmidt (Hack Squat)", "Beine", MA], ["beinpresse", "Beinpresse", "Beine", MA],
  ["beinstrecker", "Beinstrecker", "Beine", MA], ["beinbeuger_l", "Beinbeuger liegend", "Beine", MA], ["beinbeuger_s", "Beinbeuger sitzend", "Beine", MA],
  ["rdl", "Rumänisches Kreuzheben", "Beine", LH], ["rdl_kh", "Rumänisches Kreuzheben", "Beine", KH],
  ["ausfall", "Ausfallschritte", "Beine", KH], ["ausfall_geh", "Ausfallschritte gehend", "Beine", KH], ["ausfall_lh", "Ausfallschritte", "Beine", LH],
  ["bulgarian", "Bulgarian Split Squats", "Beine", KH], ["stepup", "Step-ups", "Beine", KH], ["adduktoren", "Adduktoren-Maschine", "Beine", MA],
  ["squat_kg", "Kniebeuge", "Beine", KG], ["pistol", "Pistol Squats", "Beine", KG],
  /* Po */
  ["hipthrust", "Hip Thrust", "Po", LH], ["hipthrust_ma", "Hip Thrust", "Po", MA], ["bridge", "Glute Bridge", "Po", KG],
  ["kickback_kz", "Glute Kickbacks", "Po", KZ], ["abduktoren", "Abduktoren-Maschine", "Po", MA], ["goodmorning", "Good Mornings", "Po", LH], ["kbswing", "Kettlebell Swings", "Po", KB],
  /* Waden */
  ["waden", "Wadenheben stehend", "Waden", MA], ["waden_s", "Wadenheben sitzend", "Waden", MA], ["waden_bp", "Wadenheben an der Beinpresse", "Waden", MA], ["waden_kg", "Wadenheben", "Waden", KG],
  /* Bauch */
  ["plank", "Plank", "Bauch", KG, "zeit"], ["seitstuetz", "Seitstütz", "Bauch", KG, "zeit"], ["legraise", "Hanging Leg Raises", "Bauch", KG], ["kneeraise", "Knieheben (Dip-Station)", "Bauch", KG],
  ["crunch", "Crunches", "Bauch", KG], ["crunch_kz", "Kabel-Crunches", "Bauch", KZ], ["crunch_ma", "Bauchmaschine", "Bauch", MA],
  ["twist", "Russian Twists", "Bauch", KH], ["abwheel", "Ab-Wheel", "Bauch", KG], ["beinheben", "Beinheben liegend", "Bauch", KG], ["woodchop", "Woodchopper", "Bauch", KZ]
].map(([id, name, group, equip, type]) => ({ id: "ex_" + id, name, group, equip, type: type || "kraft" }));
const BUILTIN_IDS = new Set(BUILTIN_EX.map(e => e.id));
/* Übungen aus Version 15, die es nicht mehr gibt – nur noch für alte Einträge */
const LEGACY_EX = [["seil", "Seilspringen", "zeit"], ["burpees", "Burpees", "kraft"], ["bruecke", "Ringerbrücke", "zeit"], ["sprints", "Sprints", "zeit"]]
  .map(([id, name, type]) => ({ id: "ex_" + id, name, group: "Bauch", equip: KG, type, legacy: true }));
const OLD_DEFAULT_IDS = new Set(["bank", "schraeg", "dips", "liegest", "butterfly", "klimm", "kreuz", "rudern", "latzug", "kabelrud", "facepull", "kniebeuge", "frontkb", "beinpresse", "rdl", "ausfall", "hipthrust", "waden", "ohp", "khschulter", "seitheben", "curls", "hammer", "trizeps", "french", "plank", "legraise", "twist", "abwheel", "seil", "burpees", "kbswing", "bruecke", "sprints"].map(i => "ex_" + i));
const OLD_GROUP = { Arme: "Bizeps", Core: "Bauch", Kondition: "Bauch" };
const CUSTOM_KEY = "makro.customExercises", HIDDEN_KEY = "makro.hiddenExercises", TRAIN_MIG = "makro.trainMig16";

let customEx = loadJSON(CUSTOM_KEY, null);
if (!Array.isArray(customEx)) {
  const old = loadJSON(EX_KEY, []);
  customEx = (Array.isArray(old) ? old : []).filter(e => !OLD_DEFAULT_IDS.has(e.id) && !BUILTIN_IDS.has(e.id))
    .map(e => ({ ...e, group: OLD_GROUP[e.group] || e.group, equip: e.equip || "", custom: true }));
  saveJSON(CUSTOM_KEY, customEx);
}
let hiddenEx = loadJSON(HIDDEN_KEY, []);
let exercises = [];
function rebuildEx() { exercises = [...BUILTIN_EX.filter(e => !hiddenEx.includes(e.id)), ...customEx]; }
rebuildEx();

let plans = loadJSON(PLAN_KEY, []);
if (!Array.isArray(plans)) plans = [];
if (!loadJSON(TRAIN_MIG, false)) {   /* vorgegebene Beispielpläne aus Version 15 entfernen */
  plans = plans.filter(p => !["pl_a", "pl_b", "pl_r"].includes(p.id));
  saveJSON(PLAN_KEY, plans); saveJSON(TRAIN_MIG, true);
}
let workouts = loadJSON(WK_KEY, []);
let activeWk = loadJSON(ACT_KEY, null);
let restDefault = loadJSON(REST_KEY, 90);

const uid = () => Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
const exById = id => exercises.find(e => e.id === id) || BUILTIN_EX.find(e => e.id === id) || customEx.find(e => e.id === id) || LEGACY_EX.find(e => e.id === id) || { id, name: "Gelöschte Übung", group: "", equip: "", type: "kraft" };
const isBW = ex => ex.equip === "Körpergewicht";
const exLabel = ex => ex.equip && !ex.legacy ? `${ex.name} (${ex.equip})` : ex.name;
const isTime = ex => ex.type === "zeit";
const de = n => String(Math.round(n * 100) / 100).replace(".", ",");
const mmss = s => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, "0")}`;
const setScore = (ex, s) => isTime(ex) ? num(s.r) : (num(s.w) > 0 ? num(s.w) * (1 + num(s.r) / 30) : num(s.r) * .01);
function fmtSet(ex, s) {
  if (isTime(ex)) return `${de(num(s.r))} s`;
  if (isBW(ex)) return num(s.w) > 0 ? `+${de(num(s.w))} kg × ${de(num(s.r))}` : `${de(num(s.r))} Wdh`;
  return num(s.w) > 0 ? `${de(num(s.w))} × ${de(num(s.r))}` : `${de(num(s.r))} Wdh`;
}
const sortedWorkouts = () => [...workouts].sort((a, b) => a.start - b.start);
function lastSetsFor(exId, excludeId) {
  const list = sortedWorkouts();
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i].id === excludeId) continue;
    const it = list[i].items.find(x => x.exId === exId);
    if (it && it.sets.length) return it.sets;
  }
  return null;
}
function bestScore(exId, excludeId) {
  const ex = exById(exId);
  let best = 0;
  for (const w of workouts) {
    if (w.id === excludeId) continue;
    for (const it of w.items) if (it.exId === exId) for (const s of it.sets) if (s.type !== "w") best = Math.max(best, setScore(ex, s));
  }
  return best;
}
const volumeOf = w => w.items.reduce((sum, it) => isTime(exById(it.exId)) ? sum : sum + it.sets.reduce((a, s) => a + num(s.w) * num(s.r), 0), 0);
const setsOf = w => w.items.reduce((a, it) => a + it.sets.length, 0);
const doneSetsOf = w => w.items.reduce((a, it) => a + it.sets.filter(s => s.done).length, 0);
function weekDays() {
  const dow = (new Date().getDay() + 6) % 7, mon = dayShift(todayKey(), -dow);
  return Array.from({ length: 7 }, (_, i) => dayShift(mon, i));
}

/* ---------- Übungsbilder: Figur in Bewegung ---------- */
/* Gelenke im 100×100-Feld: H Kopf, N Schulter, P Hüfte, E/W Ellbogen/Hand, K/F Knie/Fuß (1 = vorne, 2 = hinten) */
const POSES = {
  stand:     { j: { H: [50, 17], N: [50, 27], P: [50, 53], E1: [52, 40], W1: [53, 52], E2: [48, 40], W2: [47, 52], K1: [51, 71], F1: [52, 89], K2: [48, 71], F2: [47, 89] } },
  curl:      { j: { H: [46, 17], N: [46, 27], P: [46, 53], E1: [48, 41], W1: [59, 34], E2: [44, 41], W2: [55, 34], K1: [47, 71], F1: [48, 89], K2: [44, 71], F2: [43, 89] }, bar: [59, 34], pulley: [70, 88], arrow: [64, 48, 62, 34] },
  preacher:  { j: { H: [36, 26], N: [39, 36], P: [36, 62], E1: [54, 50], W1: [62, 36], E2: [52, 50], W2: [60, 36], K1: [56, 64], F1: [57, 89], K2: [54, 64], F2: [54, 89] }, bar: [62, 36],
               props: [["rect", 26, 62, 26, 5, 2, "bench"], ["line", 38, 67, 38, 89, 3, "frame"], ["line", 47, 44, 63, 58, 7, "pad"], ["line", 60, 58, 60, 89, 3, "frame"]], arrow: [70, 50, 66, 36] },
  concentration: { j: { H: [44, 34], N: [46, 42], P: [36, 62], E1: [56, 62], W1: [60, 50], E2: [44, 54], W2: [52, 60], K1: [60, 62], F1: [62, 89], K2: [56, 64], F2: [56, 89] }, props: [["rect", 22, 62, 30, 5, 2, "bench"], ["line", 37, 67, 37, 89, 3, "frame"]], arrow: [68, 62, 66, 50] },
  inclineCurl: { j: { H: [28, 30], N: [34, 38], P: [52, 62], E1: [38, 54], W1: [46, 46], E2: [36, 54], W2: [44, 46], K1: [66, 64], F1: [70, 89], K2: [64, 64], F2: [66, 89] }, props: [["line", 26, 32, 54, 64, 6, "bench"], ["rect", 46, 62, 22, 5, 2, "bench"], ["line", 56, 67, 56, 89, 3, "frame"]], arrow: [52, 58, 50, 46] },
  pushdown:  { j: { H: [46, 17], N: [46, 27], P: [46, 53], E1: [48, 41], W1: [58, 54], E2: [45, 41], W2: [55, 54], K1: [47, 71], F1: [48, 89], K2: [44, 71], F2: [43, 89] }, pulley: [72, 6], bar: [58, 54], arrow: [64, 42, 64, 56] },
  ohExt:     { j: { H: [46, 22], N: [47, 31], P: [47, 57], E1: [52, 13], W1: [40, 18], E2: [50, 13], W2: [38, 18], K1: [48, 73], F1: [49, 89], K2: [45, 73], F2: [44, 89] }, bar: [40, 16], pulley: [16, 84], arrow: [56, 24, 56, 8] },
  frenchPress: { j: { H: [22, 54], N: [30, 55], P: [56, 56], E1: [33, 38], W1: [24, 42], E2: [31, 38], W2: [22, 42], K1: [70, 58], F1: [72, 89], K2: [68, 58], F2: [69, 89] }, bar: [24, 42], props: "bench", arrow: [22, 34, 32, 28] },
  kickback:  { j: { H: [26, 36], N: [33, 41], P: [58, 46], E1: [46, 44], W1: [60, 42], E2: [32, 52], W2: [30, 62], K1: [60, 67], F1: [62, 89], K2: [54, 63], F2: [42, 63] }, props: [["rect", 18, 62, 34, 5, 2, "bench"], ["line", 22, 67, 22, 89, 3, "frame"], ["line", 48, 67, 48, 89, 3, "frame"]], db: [[60, 42]], arrow: [52, 52, 64, 48] },
  dips:      { j: { H: [50, 16], N: [50, 26], P: [49, 52], E1: [41, 33], W1: [44, 45], E2: [43, 33], W2: [46, 45], K1: [54, 67], F1: [44, 76], K2: [52, 68], F2: [42, 77] }, props: [["line", 30, 46, 72, 46, 3, "dark"], ["line", 34, 46, 34, 89, 3, "frame"], ["line", 68, 46, 68, 89, 3, "frame"]], arrow: [62, 30, 62, 18] },
  bankDips:  { j: { H: [40, 22], N: [41, 32], P: [44, 56], E1: [33, 42], W1: [30, 52], E2: [35, 42], W2: [32, 52], K1: [62, 54], F1: [76, 87], K2: [60, 55], F2: [72, 88] }, props: [["rect", 14, 52, 26, 5, 2, "bench"], ["line", 18, 57, 18, 89, 3, "frame"], ["line", 36, 57, 36, 89, 3, "frame"]], arrow: [52, 44, 52, 30] },
  pushup:    { ground: 84, j: { H: [19, 56], N: [27, 60], P: [55, 65], E1: [28, 72], W1: [28, 83], E2: [26, 72], W2: [26, 83], K1: [70, 69], F1: [86, 76], K2: [70, 70], F2: [86, 77] }, arrow: [40, 50, 40, 40] },
  pike:      { ground: 84, j: { H: [27, 58], N: [33, 60], P: [52, 36], E1: [30, 71], W1: [28, 83], E2: [32, 71], W2: [30, 83], K1: [62, 58], F1: [72, 83], K2: [61, 59], F2: [70, 83] }, arrow: [18, 46, 18, 34] },
  bench:     { j: { H: [22, 53], N: [30, 55], P: [56, 56], E1: [31, 44], W1: [32, 31], E2: [29, 44], W2: [30, 31], K1: [70, 58], F1: [72, 89], K2: [68, 58], F2: [69, 89] }, bar: [32, 30], props: "bench", arrow: [44, 40, 44, 26] },
  incline:   { j: { H: [26, 37], N: [32, 44], P: [54, 62], E1: [36, 32], W1: [38, 19], E2: [34, 32], W2: [36, 19], K1: [68, 62], F1: [70, 89], K2: [66, 62], F2: [67, 89] }, bar: [38, 18], props: [["line", 24, 40, 56, 66, 6, "bench"], ["rect", 48, 63, 22, 5, 2, "bench"], ["line", 58, 68, 58, 89, 3, "frame"]], arrow: [50, 30, 52, 16] },
  decline:   { j: { H: [22, 66], N: [30, 63], P: [54, 55], E1: [30, 51], W1: [31, 39], E2: [28, 51], W2: [29, 39], K1: [66, 47], F1: [74, 58], K2: [64, 48], F2: [72, 59] }, bar: [31, 38], props: [["line", 18, 70, 60, 56, 6, "bench"], ["line", 40, 64, 40, 89, 3, "frame"], ["rect", 70, 56, 6, 6, 2, "pad"]], arrow: [42, 48, 42, 34] },
  fly:       { j: { H: [22, 53], N: [30, 55], P: [56, 56], E1: [40, 46], W1: [46, 37], E2: [20, 46], W2: [14, 37], K1: [70, 58], F1: [72, 89], K2: [68, 58], F2: [69, 89] }, props: "bench", arrow: [50, 30, 38, 26] },
  pullover:  { j: { H: [22, 53], N: [30, 55], P: [56, 56], E1: [20, 46], W1: [10, 52], E2: [19, 47], W2: [9, 53], K1: [70, 58], F1: [72, 89], K2: [68, 58], F2: [69, 89] }, bar: [9, 52], props: "bench", arrow: [12, 40, 26, 30] },
  chestPress:{ j: { H: [32, 20], N: [33, 30], P: [34, 62], E1: [44, 41], W1: [56, 38], E2: [42, 41], W2: [54, 38], K1: [52, 64], F1: [54, 89], K2: [50, 64], F2: [50, 89] }, props: "seat", machine: [["rect", 55, 33, 6, 10, 2, "pad"], ["line", 62, 38, 80, 38, 3, "frame"], ["line", 80, 10, 80, 89, 4, "frame"]], arrow: [62, 26, 74, 26] },
  butterfly: { j: { H: [50, 18], N: [50, 28], P: [50, 58], E1: [64, 34], W1: [55, 38], E2: [36, 34], W2: [45, 38], K1: [58, 72], F1: [58, 89], K2: [42, 72], F2: [42, 89] }, front: true, props: [["rect", 38, 58, 24, 5, 2, "bench"], ["rect", 46, 16, 8, 42, 3, "pad"]], machine: [["rect", 62, 28, 5, 14, 2, "pad"], ["rect", 33, 28, 5, 14, 2, "pad"]], arrow: [76, 34, 66, 34] },
  crossover: { j: { H: [50, 15], N: [50, 25], P: [50, 52], E1: [62, 37], W1: [54, 48], E2: [38, 37], W2: [46, 48], K1: [56, 70], F1: [58, 89], K2: [44, 70], F2: [42, 89] }, front: true, cables: [[90, 6], [10, 6]], arrow: [72, 40, 60, 48] },
  lowHigh:   { j: { H: [50, 15], N: [50, 25], P: [50, 52], E1: [62, 40], W1: [55, 30], E2: [38, 40], W2: [45, 30], K1: [56, 70], F1: [58, 89], K2: [44, 70], F2: [42, 89] }, front: true, cables: [[90, 88], [10, 88]], arrow: [70, 52, 60, 32] },
  pullup:    { j: { H: [50, 18], N: [50, 28], P: [50, 54], E1: [62, 22], W1: [57, 9], E2: [38, 22], W2: [43, 9], K1: [53, 69], F1: [50, 83], K2: [47, 69], F2: [50, 83] }, front: true, props: [["line", 26, 9, 74, 9, 3, "dark"], ["line", 28, 9, 28, 2, 3, "frame"], ["line", 72, 9, 72, 2, 3, "frame"]], arrow: [80, 46, 80, 30] },
  latPull:   { j: { H: [50, 26], N: [50, 35], P: [50, 62], E1: [65, 33], W1: [69, 21], E2: [35, 33], W2: [31, 21], K1: [60, 72], F1: [60, 89], K2: [40, 72], F2: [40, 89] }, front: true, props: [["line", 24, 21, 76, 21, 3, "dark"], ["line", 50, 4, 50, 21, 1.5, "frame"], ["rect", 36, 62, 28, 5, 2, "bench"], ["rect", 38, 57, 24, 4, 2, "pad"], ["line", 50, 67, 50, 89, 3, "frame"]], arrow: [84, 14, 84, 30] },
  straightArm: { j: { H: [40, 20], N: [42, 30], P: [48, 55], E1: [52, 40], W1: [60, 50], E2: [50, 40], W2: [58, 50], K1: [50, 72], F1: [50, 89], K2: [46, 72], F2: [44, 89] }, pulley: [78, 6], arrow: [70, 28, 64, 50] },
  row:       { j: { H: [30, 36], N: [36, 40], P: [60, 51], E1: [52, 50], W1: [46, 62], E2: [50, 50], W2: [44, 62], K1: [58, 70], F1: [60, 89], K2: [55, 70], F2: [55, 89] }, bar: [46, 62], arrow: [34, 70, 34, 56] },
  rowOne:    { j: { H: [24, 38], N: [30, 42], P: [54, 46], E1: [42, 36], W1: [40, 49], E2: [29, 51], W2: [28, 60], K1: [58, 68], F1: [60, 89], K2: [48, 58], F2: [36, 60] }, props: [["rect", 16, 60, 36, 5, 2, "bench"], ["line", 20, 65, 20, 89, 3, "frame"], ["line", 48, 65, 48, 89, 3, "frame"]], db: [[40, 50]], arrow: [36, 60, 36, 44] },
  tbar:      { j: { H: [30, 36], N: [36, 40], P: [60, 51], E1: [50, 50], W1: [46, 60], E2: [48, 50], W2: [44, 60], K1: [58, 70], F1: [60, 89], K2: [55, 70], F2: [55, 89] }, props: [["line", 12, 88, 46, 60, 3, "dark"], ["circle", 40, 66, 8, "plate"]], arrow: [34, 74, 34, 60] },
  cableRow:  { j: { H: [34, 22], N: [36, 32], P: [36, 64], E1: [46, 44], W1: [58, 44], E2: [44, 44], W2: [56, 44], K1: [56, 58], F1: [74, 66], K2: [54, 60], F2: [72, 68] }, props: [["rect", 24, 64, 24, 5, 2, "bench"], ["line", 36, 69, 36, 89, 3, "frame"], ["rect", 76, 58, 4, 14, 1, "pad"]], pulley: [92, 46], fixedCable: true, arrow: [62, 36, 48, 36] },
  chestRow:  { j: { H: [44, 24], N: [44, 34], P: [36, 62], E1: [42, 46], W1: [60, 46], E2: [40, 46], W2: [58, 46], K1: [54, 64], F1: [56, 89], K2: [52, 64], F2: [52, 89] }, props: [["rect", 24, 62, 24, 5, 2, "bench"], ["rect", 50, 30, 6, 22, 3, "pad"], ["line", 36, 67, 36, 89, 3, "frame"]], machine: [["rect", 60, 42, 6, 8, 2, "pad"], ["line", 66, 46, 82, 46, 3, "frame"], ["line", 82, 10, 82, 89, 4, "frame"]], arrow: [70, 34, 56, 34] },
  invRow:    { ground: 88, j: { H: [62, 50], N: [56, 54], P: [36, 68], E1: [64, 46], W1: [70, 40], E2: [62, 47], W2: [68, 41], K1: [24, 76], F1: [12, 86], K2: [24, 77], F2: [12, 87] }, props: [["line", 60, 40, 84, 40, 3, "dark"], ["line", 80, 40, 80, 89, 3, "frame"]], arrow: [46, 70, 52, 58] },
  hyper:     { j: { H: [22, 32], N: [30, 37], P: [50, 50], E1: [36, 44], W1: [32, 42], E2: [34, 44], W2: [30, 42], K1: [64, 62], F1: [78, 74], K2: [63, 63], F2: [76, 75] }, props: [["rect", 46, 48, 12, 7, 3, "pad"], ["line", 52, 55, 60, 89, 3, "frame"], ["rect", 76, 72, 8, 5, 2, "pad"], ["line", 80, 77, 82, 89, 3, "frame"]], arrow: [16, 52, 18, 34] },
  shrug:     { j: { H: [50, 17], N: [50, 27], P: [50, 53], E1: [52, 41], W1: [53, 55], E2: [48, 41], W2: [47, 55], K1: [51, 71], F1: [52, 89], K2: [48, 71], F2: [47, 89] }, bar: [53, 56], arrow: [66, 34, 66, 20] },
  deadlift:  { j: { H: [36, 33], N: [42, 38], P: [62, 50], E1: [45, 56], W1: [47, 72], E2: [43, 56], W2: [45, 72], K1: [52, 66], F1: [56, 89], K2: [50, 67], F2: [52, 89] }, bar: [47, 79], plateR: 10, arrow: [74, 74, 74, 54] },
  rdl:       { j: { H: [32, 38], N: [39, 41], P: [62, 48], E1: [44, 54], W1: [46, 66], E2: [42, 54], W2: [44, 66], K1: [60, 68], F1: [60, 89], K2: [57, 69], F2: [56, 89] }, bar: [46, 66], arrow: [24, 52, 32, 34] },
  goodMorning: { j: { H: [30, 36], N: [38, 40], P: [60, 50], E1: [44, 46], W1: [40, 38], E2: [42, 46], W2: [38, 38], K1: [60, 69], F1: [60, 89], K2: [57, 69], F2: [56, 89] }, bar: [39, 36], arrow: [22, 50, 26, 30] },
  kbSwing:   { j: { H: [48, 17], N: [48, 27], P: [48, 53], E1: [60, 35], W1: [71, 40], E2: [58, 35], W2: [69, 40], K1: [50, 71], F1: [50, 89], K2: [46, 71], F2: [45, 89] }, bar: [72, 44], arrow: [70, 70, 78, 50] },
  squat:     { j: { H: [53, 31], N: [47, 40], P: [40, 62], E1: [38, 46], W1: [44, 39], E2: [36, 46], W2: [42, 39], K1: [60, 66], F1: [54, 89], K2: [57, 67], F2: [51, 89] }, bar: [43, 38], arrow: [76, 74, 76, 52] },
  frontSquat:{ j: { H: [44, 30], N: [46, 38], P: [38, 62], E1: [58, 44], W1: [54, 38], E2: [56, 44], W2: [52, 38], K1: [58, 66], F1: [52, 89], K2: [55, 67], F2: [49, 89] }, bar: [54, 36], arrow: [76, 74, 76, 52] },
  goblet:    { j: { H: [44, 30], N: [46, 38], P: [38, 62], E1: [52, 50], W1: [54, 42], E2: [50, 50], W2: [52, 42], K1: [58, 66], F1: [52, 89], K2: [55, 67], F2: [49, 89] }, db: [[55, 44]], dbVertical: true, arrow: [76, 74, 76, 52] },
  bwSquat:   { j: { H: [44, 30], N: [46, 38], P: [38, 62], E1: [58, 40], W1: [70, 40], E2: [56, 40], W2: [68, 40], K1: [58, 66], F1: [52, 89], K2: [55, 67], F2: [49, 89] }, arrow: [80, 74, 80, 52] },
  pistol:    { j: { H: [44, 32], N: [46, 40], P: [40, 64], E1: [58, 42], W1: [70, 42], E2: [56, 42], W2: [68, 42], K1: [56, 68], F1: [50, 89], K2: [58, 66], F2: [78, 64] }, arrow: [84, 80, 84, 58] },
  hack:      { j: { H: [36, 24], N: [40, 32], P: [46, 62], E1: [36, 40], W1: [42, 32], E2: [34, 40], W2: [40, 32], K1: [64, 60], F1: [62, 84], K2: [61, 61], F2: [59, 84] }, props: [["line", 30, 18, 50, 66, 6, "pad"], ["line", 54, 88, 76, 80, 4, "dark"], ["line", 28, 10, 54, 72, 2, "frame"]], arrow: [80, 70, 76, 48] },
  legPress:  { j: { H: [18, 36], N: [23, 44], P: [42, 66], E1: [30, 56], W1: [36, 66], E2: [28, 56], W2: [34, 66], K1: [52, 42], F1: [68, 46], K2: [50, 44], F2: [66, 48] }, props: [["line", 14, 40, 26, 66, 6, "pad"], ["line", 26, 68, 48, 70, 6, "bench"], ["line", 70, 30, 76, 58, 5, "dark"], ["line", 56, 70, 92, 20, 2, "frame"], ["line", 38, 72, 38, 89, 3, "frame"]], arrow: [82, 52, 92, 38] },
  calfPress: { j: { H: [18, 36], N: [23, 44], P: [42, 66], E1: [30, 56], W1: [36, 66], E2: [28, 56], W2: [34, 66], K1: [56, 50], F1: [72, 52], K2: [54, 52], F2: [70, 54] }, props: [["line", 14, 40, 26, 66, 6, "pad"], ["line", 26, 68, 48, 70, 6, "bench"], ["line", 74, 34, 78, 62, 5, "dark"], ["line", 56, 70, 92, 20, 2, "frame"], ["line", 38, 72, 38, 89, 3, "frame"]], arrow: [86, 62, 90, 50] },
  legExt:    { j: { H: [32, 20], N: [33, 30], P: [36, 60], E1: [38, 46], W1: [44, 60], E2: [36, 46], W2: [42, 60], K1: [54, 61], F1: [74, 55], K2: [52, 62], F2: [72, 56] }, props: "seat", machine: [["circle", 75, 58, 3.6, "pad"], ["line", 75, 58, 56, 66, 2, "frame"]], arrow: [80, 72, 82, 56] },
  legCurlLying: { j: { H: [17, 50], N: [25, 54], P: [50, 55], E1: [20, 60], W1: [13, 58], E2: [19, 61], W2: [12, 59], K1: [66, 55], F1: [70, 36], K2: [65, 56], F2: [69, 37] }, props: [["rect", 12, 58, 64, 5, 2, "bench"], ["line", 20, 63, 20, 89, 3, "frame"], ["line", 66, 63, 66, 89, 3, "frame"]], machine: [["circle", 72, 38, 3.6, "pad"]], arrow: [84, 54, 80, 36] },
  legCurlSeat: { j: { H: [32, 20], N: [33, 30], P: [36, 60], E1: [38, 46], W1: [44, 60], E2: [36, 46], W2: [42, 60], K1: [54, 61], F1: [56, 80], K2: [52, 62], F2: [54, 81] }, props: "seat", machine: [["circle", 58, 80, 3.6, "pad"], ["rect", 48, 54, 14, 4, 2, "pad"]], arrow: [72, 64, 64, 82] },
  lunge:     { j: { H: [48, 18], N: [48, 28], P: [48, 54], E1: [49, 42], W1: [50, 56], E2: [47, 42], W2: [47, 56], K1: [62, 64], F1: [64, 89], K2: [40, 76], F2: [28, 86] }, db: "hands", bar: [49, 26], barOnBack: true, arrow: [80, 60, 80, 76] },
  bulgarian: { j: { H: [50, 20], N: [50, 30], P: [48, 56], E1: [51, 44], W1: [52, 58], E2: [49, 44], W2: [49, 58], K1: [62, 66], F1: [64, 89], K2: [38, 76], F2: [24, 62] }, props: [["rect", 12, 62, 22, 5, 2, "bench"], ["line", 16, 67, 16, 89, 3, "frame"], ["line", 30, 67, 30, 89, 3, "frame"]], db: "hands", arrow: [80, 60, 80, 76] },
  stepup:    { j: { H: [48, 14], N: [48, 24], P: [48, 50], E1: [49, 38], W1: [50, 52], E2: [47, 38], W2: [47, 52], K1: [62, 54], F1: [66, 70], K2: [46, 70], F2: [44, 89] }, props: [["rect", 54, 70, 28, 19, 3, "bench"]], db: "hands", arrow: [32, 64, 32, 48] },
  adductor:  { j: { H: [50, 18], N: [50, 28], P: [50, 58], E1: [60, 42], W1: [62, 56], E2: [40, 42], W2: [38, 56], K1: [64, 70], F1: [66, 89], K2: [36, 70], F2: [34, 89] }, front: true, props: [["rect", 38, 58, 24, 5, 2, "bench"], ["rect", 46, 16, 8, 42, 3, "pad"], ["rect", 67, 64, 5, 14, 2, "pad"], ["rect", 28, 64, 5, 14, 2, "pad"]], arrow: [80, 72, 70, 72] },
  abductor:  { j: { H: [50, 18], N: [50, 28], P: [50, 58], E1: [60, 42], W1: [62, 56], E2: [40, 42], W2: [38, 56], K1: [60, 70], F1: [62, 89], K2: [40, 70], F2: [38, 89] }, front: true, props: [["rect", 38, 58, 24, 5, 2, "bench"], ["rect", 46, 16, 8, 42, 3, "pad"], ["rect", 63, 64, 5, 14, 2, "pad"], ["rect", 32, 64, 5, 14, 2, "pad"]], arrow: [72, 72, 82, 72] },
  hipThrust: { j: { H: [20, 44], N: [28, 50], P: [52, 50], E1: [44, 46], W1: [52, 46], E2: [42, 47], W2: [50, 47], K1: [66, 52], F1: [70, 89], K2: [64, 53], F2: [67, 89] }, bar: [52, 45], props: [["rect", 10, 52, 22, 5, 2, "bench"], ["line", 14, 57, 14, 89, 3, "frame"], ["line", 28, 57, 28, 89, 3, "frame"]], machine: [["rect", 46, 42, 14, 5, 2, "pad"]], arrow: [52, 72, 52, 56] },
  bridge:    { ground: 86, j: { H: [14, 80], N: [22, 81], P: [48, 66], E1: [34, 84], W1: [44, 85], E2: [33, 85], W2: [43, 86], K1: [62, 58], F1: [68, 85], K2: [60, 59], F2: [66, 86] }, arrow: [48, 84, 48, 72] },
  gluteKick: { j: { H: [34, 22], N: [39, 31], P: [52, 52], E1: [34, 40], W1: [28, 46], E2: [36, 40], W2: [30, 46], K1: [66, 62], F1: [82, 70], K2: [52, 70], F2: [52, 89] }, props: [["line", 24, 20, 24, 89, 4, "frame"]], pulley: [94, 86], cableFoot: true, arrow: [70, 80, 86, 74] },
  calf:      { j: { H: [50, 13], N: [50, 23], P: [50, 49], E1: [52, 36], W1: [53, 48], E2: [48, 36], W2: [47, 48], K1: [51, 67], F1: [53, 84], K2: [48, 67], F2: [48, 84] }, props: [["rect", 46, 84, 16, 5, 1, "bench"]], toe: true, machine: [["rect", 40, 20, 20, 5, 2, "pad"], ["line", 60, 22, 76, 22, 3, "frame"], ["line", 76, 10, 76, 89, 4, "frame"]], arrow: [70, 64, 70, 50] },
  calfSeated:{ j: { H: [32, 20], N: [33, 30], P: [36, 60], E1: [44, 50], W1: [52, 56], E2: [42, 50], W2: [50, 56], K1: [56, 60], F1: [58, 82], K2: [54, 61], F2: [56, 83] }, props: "seat", toe: true, machine: [["rect", 48, 54, 18, 5, 2, "pad"], ["rect", 54, 84, 14, 4, 1, "bench"]], arrow: [74, 74, 74, 60] },
  ohp:       { j: { H: [44, 20], N: [45, 30], P: [45, 56], E1: [55, 20], W1: [58, 9], E2: [53, 20], W2: [56, 9], K1: [46, 73], F1: [47, 89], K2: [43, 73], F2: [42, 89] }, bar: [58, 9], arrow: [70, 26, 70, 10] },
  ohpSeated: { j: { H: [40, 24], N: [41, 34], P: [40, 62], E1: [51, 24], W1: [53, 12], E2: [49, 24], W2: [51, 12], K1: [58, 64], F1: [60, 89], K2: [56, 64], F2: [56, 89] }, bar: [53, 11], props: "seatHigh", machine: [["rect", 50, 8, 8, 6, 2, "pad"], ["line", 58, 11, 74, 11, 3, "frame"], ["line", 74, 4, 74, 89, 4, "frame"]], arrow: [64, 28, 64, 12] },
  lateral:   { j: { H: [50, 17], N: [50, 27], P: [50, 53], E1: [63, 31], W1: [76, 33], E2: [37, 31], W2: [24, 33], K1: [54, 71], F1: [55, 89], K2: [46, 71], F2: [45, 89] }, front: true, cables: [[14, 88]], machine: [["rect", 58, 26, 10, 6, 2, "pad"], ["rect", 32, 26, 10, 6, 2, "pad"], ["rect", 38, 53, 24, 5, 2, "bench"]], arrow: [84, 48, 84, 32] },
  frontRaise:{ j: { H: [46, 17], N: [46, 27], P: [46, 53], E1: [58, 28], W1: [70, 28], E2: [56, 29], W2: [68, 29], K1: [47, 71], F1: [48, 89], K2: [44, 71], F2: [43, 89] }, arrow: [80, 46, 80, 30] },
  revFly:    { j: { H: [30, 36], N: [36, 40], P: [60, 51], E1: [40, 50], W1: [36, 60], E2: [32, 48], W2: [26, 54], K1: [58, 70], F1: [60, 89], K2: [55, 70], F2: [55, 89] }, arrow: [22, 64, 22, 46] },
  revFlyMa:  { j: { H: [50, 18], N: [50, 28], P: [50, 58], E1: [64, 30], W1: [76, 30], E2: [36, 30], W2: [24, 30], K1: [58, 72], F1: [58, 89], K2: [42, 72], F2: [42, 89] }, front: true, props: [["rect", 38, 58, 24, 5, 2, "bench"]], machine: [["rect", 76, 26, 4, 10, 2, "pad"], ["rect", 20, 26, 4, 10, 2, "pad"]], arrow: [66, 40, 80, 40] },
  facePull:  { j: { H: [44, 17], N: [44, 27], P: [44, 53], E1: [42, 20], W1: [54, 18], E2: [40, 21], W2: [52, 19], K1: [45, 71], F1: [46, 89], K2: [42, 71], F2: [41, 89] }, pulley: [90, 18], arrow: [76, 10, 62, 10] },
  uprow:     { j: { H: [48, 17], N: [48, 27], P: [48, 53], E1: [44, 24], W1: [54, 34], E2: [42, 25], W2: [52, 35], K1: [49, 71], F1: [50, 89], K2: [46, 71], F2: [45, 89] }, bar: [54, 35], arrow: [66, 50, 66, 34] },
  arnold:    { j: { H: [40, 24], N: [40, 34], P: [40, 62], E1: [48, 26], W1: [44, 12], E2: [46, 27], W2: [42, 13], K1: [58, 64], F1: [60, 89], K2: [56, 64], F2: [56, 89] }, props: "seatHigh", arrow: [60, 30, 60, 12] },
  plank:     { ground: 86, j: { H: [20, 69], N: [28, 73], P: [55, 75], E1: [28, 85], W1: [38, 85], E2: [27, 86], W2: [37, 86], K1: [70, 78], F1: [86, 84], K2: [70, 79], F2: [86, 85] }, arrow: [40, 58, 64, 58] },
  sidePlank: { ground: 86, j: { H: [22, 58], N: [28, 64], P: [54, 72], E1: [27, 76], W1: [36, 85], E2: [34, 56], W2: [38, 46], K1: [70, 78], F1: [86, 84], K2: [70, 77], F2: [86, 82] }, arrow: [54, 56, 54, 64] },
  hangLeg:   { j: { H: [55, 19], N: [50, 27], P: [50, 52], E1: [50, 18], W1: [50, 8], E2: [48, 18], W2: [48, 8], K1: [66, 52], F1: [82, 52], K2: [65, 53], F2: [81, 54] }, props: [["line", 36, 8, 66, 8, 3, "dark"]], arrow: [74, 74, 82, 58] },
  kneeRaise: { j: { H: [50, 16], N: [50, 26], P: [50, 52], E1: [42, 34], W1: [56, 36], E2: [41, 35], W2: [55, 37], K1: [64, 46], F1: [62, 64], K2: [62, 48], F2: [60, 66] }, props: [["rect", 38, 33, 22, 4, 2, "pad"], ["line", 40, 37, 40, 89, 3, "frame"]], arrow: [76, 70, 76, 50] },
  crunch:    { ground: 86, j: { H: [24, 66], N: [30, 72], P: [50, 82], E1: [22, 62], W1: [26, 66], E2: [21, 63], W2: [25, 67], K1: [62, 66], F1: [72, 85], K2: [61, 67], F2: [70, 86] }, arrow: [24, 50, 34, 58] },
  cableCrunch: { ground: 88, j: { H: [36, 66], N: [42, 60], P: [58, 66], E1: [36, 58], W1: [38, 64], E2: [35, 59], W2: [37, 65], K1: [60, 87], F1: [78, 87], K2: [58, 87], F2: [76, 88] }, pulley: [38, 4], arrow: [24, 48, 28, 64] },
  crunchMa:  { j: { H: [40, 34], N: [40, 42], P: [36, 62], E1: [46, 36], W1: [48, 44], E2: [44, 37], W2: [46, 45], K1: [54, 64], F1: [56, 89], K2: [52, 64], F2: [52, 89] }, props: [["rect", 24, 62, 24, 5, 2, "bench"], ["line", 36, 67, 36, 89, 3, "frame"], ["rect", 42, 30, 12, 6, 2, "pad"], ["line", 54, 33, 72, 20, 3, "frame"]], arrow: [62, 40, 56, 52] },
  twist:     { ground: 86, j: { H: [33, 51], N: [38, 58], P: [50, 78], E1: [46, 64], W1: [54, 62], E2: [44, 65], W2: [52, 63], K1: [64, 66], F1: [76, 72], K2: [62, 67], F2: [74, 73] }, db: [[55, 61]], arrow: [46, 44, 62, 48] },
  abWheel:   { ground: 86, j: { H: [24, 64], N: [31, 68], P: [52, 72], E1: [24, 75], W1: [19, 81], E2: [23, 76], W2: [18, 82], K1: [66, 85], F1: [82, 85], K2: [65, 86], F2: [80, 86] }, props: [["circle", 17, 81, 5, "dark"], ["circle", 17, 81, 1.6, "frame"]], arrow: [40, 58, 22, 58] },
  legRaise:  { ground: 86, j: { H: [14, 82], N: [22, 83], P: [48, 83], E1: [34, 85], W1: [44, 86], E2: [33, 86], W2: [43, 86], K1: [52, 64], F1: [55, 45], K2: [51, 65], F2: [54, 46] }, arrow: [72, 76, 64, 50] },
  woodchop:  { j: { H: [50, 17], N: [50, 27], P: [50, 53], E1: [42, 44], W1: [34, 58], E2: [44, 44], W2: [36, 60], K1: [56, 71], F1: [58, 89], K2: [44, 71], F2: [42, 89] }, front: true, cables: [[88, 6]], arrow: [70, 22, 40, 66] }
};

const EX_POSE = {
  bank: "bench", bank_kh: "bench", bank_sm: "bench", schraeg_lh: "incline", schraeg: "incline", schraeg_sm: "incline", negativ: "decline",
  brustpresse: "chestPress", brustpresse_s: "chestPress", butterfly: "butterfly", fliegende: "fly", crossover: "crossover", lowhigh: "lowHigh",
  pullover: "pullover", dips: "dips", liegest: "pushup",
  klimm: "pullup", chinup: "pullup", klimm_ass: "pullup", latzug: "latPull", latzug_eng: "latPull", latzug_ug: "latPull", latzug_ma: "latPull",
  kreuz: "deadlift", sumo: "deadlift", rudern: "row", rudern_kh: "rowOne", tbar: "tbar", kabelrud: "cableRow", rudermaschine: "chestRow",
  straightarm: "straightArm", invrow: "invRow", hyper: "hyper", shrug_kh: "shrug", shrug_lh: "shrug",
  ohp: "ohp", khschulter: "ohpSeated", arnold: "arnold", schulterpresse: "ohpSeated", ohp_sm: "ohpSeated",
  seitheben: "lateral", seitheben_kz: "lateral", seitheben_ma: "lateral", frontheben: "frontRaise", revfly: "revFlyMa", revfly_kh: "revFly",
  facepull: "facePull", uprow: "uprow", pike: "pike",
  curl_lh: "curl", curl_sz: "curl", curls: "curl", hammer: "curl", curl_schraeg: "inclineCurl", konz: "concentration", preacher: "preacher",
  curl_ma: "preacher", curl_kz: "curl", hammer_kz: "curl",
  trizeps: "pushdown", trizeps_st: "pushdown", trizeps_oh: "ohExt", trizeps_kh: "ohExt", french: "frenchPress", engbank: "bench",
  kickback: "kickback", dips_tri: "dips", bankdips: "bankDips", dips_ma: "dips", engliegest: "pushup",
  kniebeuge: "squat", frontkb: "frontSquat", kniebeuge_sm: "squat", goblet: "goblet", hack: "hack", beinpresse: "legPress",
  beinstrecker: "legExt", beinbeuger_l: "legCurlLying", beinbeuger_s: "legCurlSeat", rdl: "rdl", rdl_kh: "rdl",
  ausfall: "lunge", ausfall_geh: "lunge", ausfall_lh: "lunge", bulgarian: "bulgarian", stepup: "stepup", adduktoren: "adductor",
  squat_kg: "bwSquat", pistol: "pistol",
  hipthrust: "hipThrust", hipthrust_ma: "hipThrust", bridge: "bridge", kickback_kz: "gluteKick", abduktoren: "abductor", goodmorning: "goodMorning", kbswing: "kbSwing",
  waden: "calf", waden_s: "calfSeated", waden_bp: "calfPress", waden_kg: "calf",
  plank: "plank", seitstuetz: "sidePlank", legraise: "hangLeg", kneeraise: "kneeRaise", crunch: "crunch", crunch_kz: "cableCrunch", crunch_ma: "crunchMa",
  twist: "twist", abwheel: "abWheel", beinheben: "legRaise", woodchop: "woodchop"
};
/* Was leuchtet orange: Muskelgruppe → Körperteile */
const HILITE = { Brust: ["chest"], Rücken: ["back"], Schultern: ["shoulder"], Bizeps: ["upperArm"], Trizeps: ["upperArm"], Beine: ["thigh"], Po: ["glute", "thigh"], Waden: ["shin"], Bauch: ["abs"] };
const GUESS_POSE = { Brust: "bench", Rücken: "row", Schultern: "ohp", Bizeps: "curl", Trizeps: "pushdown", Beine: "squat", Po: "hipThrust", Waden: "calf", Bauch: "crunch" };

/* Zusatzgewicht bei Körpergewichtsübungen: Gürtel, Rücken oder Weste */
const WEIGHT_STYLE = { pullup: "belt", dips: "belt", hangLeg: "belt", kneeRaise: "belt", pushup: "back", pike: "vest", invRow: "chest", hyper: "hold", plank: "back", bankDips: "lap", bridge: "lap", bwSquat: "vest", pistol: "vest", calf: "vest", crunch: "hold", legRaise: "feet", abWheel: "vest", sidePlank: "vest", lunge: "vest", bulgarian: "vest", stepup: "vest" };

const SHOW_MUSCLES = false, SHOW_ARROWS = false;
function exerciseArt(ex, weighted) {
  const key = EX_POSE[(ex.id || "").replace(/^ex_/, "")] || GUESS_POSE[ex.group] || "stand";
  const P = POSES[key], J = P.j, f = n => +n.toFixed(2);
  const g = P.ground || 90;
  const hl = HILITE[ex.group] || [];
  const eq = ex.equip;
  const W2 = J.W2 || J.W1, E2 = J.E2 || J.E1, K2 = J.K2 || J.K1, F2 = J.F2 || J.F1;
  const mid = (a, b, t = .5) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const pt = p => `${f(p[0])} ${f(p[1])}`;

  /* Form mit zwei Radien (Glied mit Volumen) */
  function capsule(a, b, r1, r2) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || .001, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const p1 = [a[0] + nx * r1, a[1] + ny * r1], p2 = [b[0] + nx * r2, b[1] + ny * r2], p3 = [b[0] - nx * r2, b[1] - ny * r2], p4 = [a[0] - nx * r1, a[1] - ny * r1];
    return `M${pt(p1)}L${pt(p2)}A${f(r2)} ${f(r2)} 0 0 0 ${pt(p3)}L${pt(p4)}A${f(r1)} ${f(r1)} 0 0 0 ${pt(p1)}Z`;
  }
  const limb = (a, b, r1, r2, fill, shade = true) => `<path d="${capsule(a, b, r1, r2)}" fill="${fill}"/>` +
    (shade ? `<path d="${capsule([a[0] - r1 * .28, a[1] - r1 * .32], [b[0] - r2 * .28, b[1] - r2 * .32], r1 * .38, r2 * .38)}" fill="#fff" opacity=".18"/>` : "");

  /* Farben */
  const SK = { n: "url(#skN)", f: "url(#skF)" }, SHIRT = { n: "url(#shN)", f: "#1d2430" }, SHORTS = { n: "url(#soN)", f: "#3b4656" };
  const HOT = "#ff7a1a";
  const defs = `<defs>
    <radialGradient id="bg" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".8" stop-color="#ffffff"/><stop offset="1" stop-color="#f4f5f7"/></radialGradient>
    <linearGradient id="skN" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6d2b2"/><stop offset="1" stop-color="#d9a47c"/></linearGradient>
    <linearGradient id="skF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9a780"/><stop offset="1" stop-color="#b9815b"/></linearGradient>
    <linearGradient id="shN" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b4658"/><stop offset="1" stop-color="#1f2733"/></linearGradient>
    <linearGradient id="soN" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6b7a90"/><stop offset="1" stop-color="#46536a"/></linearGradient>
    <linearGradient id="pad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6372"/><stop offset="1" stop-color="#2c323b"/></linearGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9d0d8"/><stop offset=".5" stop-color="#f3f5f7"/><stop offset="1" stop-color="#a7b0bb"/></linearGradient>
    <radialGradient id="plate" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#4a505a"/><stop offset=".75" stop-color="#22262c"/><stop offset="1" stop-color="#0d0f12"/></radialGradient>
    <radialGradient id="hot" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="${HOT}" stop-opacity=".9"/><stop offset="1" stop-color="${HOT}" stop-opacity=".45"/></radialGradient>
    <filter id="soft" x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation="1.3"/></filter>
  </defs>`;

  /* Ausrüstung */
  const shapeC = { bench: "url(#pad)", pad: "url(#pad)", frame: "url(#steel)", dark: "#2f3540", plate: "url(#plate)" };
  const shape = sh => {
    const [t, ...a] = sh;
    if (t === "rect") {
      const isPad = a[5] === "bench" || a[5] === "pad";
      return `<rect x="${a[0]}" y="${a[1]}" width="${a[2]}" height="${a[3]}" rx="${Math.max(a[4], isPad ? 1.6 : 0)}" fill="${shapeC[a[5]]}"/>` +
        (isPad ? `<rect x="${a[0] + .8}" y="${a[1] + .5}" width="${Math.max(0, a[2] - 1.6)}" height="${Math.min(1.2, a[3] / 3)}" rx=".6" fill="#fff" opacity=".18"/>` : "");
    }
    if (t === "line") {
      const isPad = a[5] === "bench" || a[5] === "pad";
      if (isPad) return `<path d="${capsule([a[0], a[1]], [a[2], a[3]], a[4] / 2, a[4] / 2)}" fill="url(#pad)"/>`;
      const col = a[5] === "frame" ? "#aab3be" : shapeC[a[5]];
      return `<line x1="${a[0]}" y1="${a[1]}" x2="${a[2]}" y2="${a[3]}" stroke="${col}" stroke-width="${a[4] * .85}" stroke-linecap="round"/>` +
        (a[5] === "frame" ? `<line x1="${a[0] - .5}" y1="${a[1]}" x2="${a[2] - .5}" y2="${a[3]}" stroke="#fff" stroke-width="${a[4] * .25}" stroke-linecap="round" opacity=".5"/>` : "");
    }
    if (t === "circle") return `<circle cx="${a[0]}" cy="${a[1]}" r="${a[2]}" fill="${shapeC[a[3]]}"/>`;
    return "";
  };
  const plate = (p, r) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}" fill="url(#plate)"/><circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r * .82)}" fill="none" stroke="#5b626c" stroke-width=".5"/>` +
    `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r * .32)}" fill="#3b414a"/><circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(Math.max(1.3, r * .16))}" fill="url(#steel)"/>` +
    `<path d="M${f(p[0] - r * .6)} ${f(p[1] - r * .55)}A${f(r * .8)} ${f(r * .8)} 0 0 1 ${f(p[0] + r * .2)} ${f(p[1] - r * .8)}" stroke="#fff" stroke-width=".6" fill="none" opacity=".35"/>`;
  const barbell = (p, r = P.plateR || 8) => {
    if (P.front) return `<rect x="16" y="${f(p[1] - 1)}" width="68" height="2" rx="1" fill="url(#steel)"/>` +
      [[10, 15], [79, 84]].map(([x1, x2]) => `<rect x="${x1}" y="${f(p[1] - 8)}" width="5" height="16" rx="1.4" fill="url(#plate)"/><rect x="${x1 + (x1 < 50 ? 4 : -2)}" y="${f(p[1] - 5.5)}" width="3" height="11" rx="1" fill="url(#plate)"/>`).join("");
    return plate(p, eq === "SZ-Stange" ? r * .72 : r);
  };
  const dumbbell = (p, vertical) => {
    const h = (x, y, w, hh) => `<rect x="${f(x)}" y="${f(y)}" width="${w}" height="${hh}" rx="1.1" fill="url(#plate)"/><rect x="${f(x + .4)}" y="${f(y + .4)}" width="${w - .8}" height="${Math.min(1, hh / 4)}" rx=".4" fill="#fff" opacity=".2"/>`;
    return vertical
      ? `<rect x="${f(p[0] - 1)}" y="${f(p[1] - 6)}" width="2" height="12" fill="url(#steel)"/>` + h(p[0] - 4.2, p[1] - 9, 8.4, 4.4) + h(p[0] - 4.2, p[1] + 4.6, 8.4, 4.4)
      : `<rect x="${f(p[0] - 6)}" y="${f(p[1] - 1)}" width="12" height="2" fill="url(#steel)"/>` + h(p[0] - 9, p[1] - 4.4, 4.4, 8.8) + h(p[0] + 4.6, p[1] - 4.4, 4.4, 8.8);
  };
  const kettlebell = p => `<circle cx="${f(p[0])}" cy="${f(p[1] + 2.5)}" r="5.4" fill="url(#plate)"/><path d="M${f(p[0] - 3.4)} ${f(p[1] - .4)}q3.4 -7 6.8 0" stroke="#22262c" stroke-width="2" fill="none"/><ellipse cx="${f(p[0] - 1.8)}" cy="${f(p[1] + .8)}" rx="1.6" ry=".9" fill="#fff" opacity=".25"/>`;
  const column = x => `<rect x="${f(x - 2.5)}" y="2" width="5" height="${g - 2}" rx="1" fill="url(#steel)"/>` +
    `<rect x="${f(x - 4)}" y="${g - 22}" width="8" height="20" rx="1" fill="#2f3540"/>` + [0, 1, 2, 3, 4].map(k => `<line x1="${f(x - 4)}" y1="${g - 18 + k * 4}" x2="${f(x + 4)}" y2="${g - 18 + k * 4}" stroke="#4b5360" stroke-width=".6"/>`).join("");
  const cable = (from, to) => `<line x1="${from[0]}" y1="${from[1]}" x2="${f(to[0])}" y2="${f(to[1])}" stroke="#1f2937" stroke-width=".9"/><circle cx="${from[0]}" cy="${from[1]}" r="2.8" fill="#2f3540"/><circle cx="${from[0]}" cy="${from[1]}" r="1" fill="url(#steel)"/>` +
    `<rect x="${f(to[0] - 1.8)}" y="${f(to[1] - 1.8)}" width="3.6" height="3.6" rx="1" fill="#2f3540"/>`;

  let back = `<rect x="0" y="0" width="100" height="100" fill="url(#bg)"/>` +
"";
  let front = "";

  const props = P.props === "bench" ? [["rect", 14, 58, 56, 5, 2, "bench"], ["line", 20, 63, 20, 89, 3, "frame"], ["line", 62, 63, 62, 89, 3, "frame"]]
    : P.props === "seat" ? [["rect", 26, 60, 24, 5, 2, "bench"], ["rect", 25, 26, 5, 36, 2, "bench"], ["line", 36, 65, 36, 89, 3, "frame"]]
    : P.props === "seatHigh" ? [["rect", 30, 62, 22, 5, 2, "bench"], ["rect", 30, 18, 5, 46, 2, "bench"], ["line", 40, 67, 40, 89, 3, "frame"]]
    : (P.props || []);
  back += props.map(shape).join("");

  if (eq === "Kabelzug" || P.fixedCable) {
    const hand = P.cableFoot ? J.F1 : J.W1;
    if (P.cables) P.cables.forEach((c, i) => { back += column(c[0] < 50 ? 6 : 94) + cable(c, i === 0 ? J.W1 : W2); });
    else if (P.pulley) back += column(P.pulley[0] > 50 ? Math.min(95, P.pulley[0] + 3) : Math.max(5, P.pulley[0] - 3)) + cable(P.pulley, hand);
  }
  if (eq === "Smith-Maschine" && P.bar) back += `<rect x="${f(P.bar[0] - 5.5)}" y="2" width="2.4" height="${g - 2}" fill="url(#steel)"/><rect x="${f(P.bar[0] + 3.1)}" y="2" width="2.4" height="${g - 2}" fill="url(#steel)"/>`;
  if (eq === "Maschine" && P.machine) back += P.machine.filter(m => m[0] !== "circle").map(shape).join("");
  if (key === "pullup" && eq === "Maschine") back += `<rect x="38" y="66" width="24" height="5" rx="2" fill="url(#pad)"/><rect x="48.5" y="71" width="3" height="18" fill="url(#steel)"/>`;

  /* ===== Figur v5: scharfe Schattierung ohne Filter (Safari-tauglich), realistische Anatomie ===== */
  const V = {
    add: (a, b) => [a[0] + b[0], a[1] + b[1]], sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
    mul: (a, k) => [a[0] * k, a[1] * k], dot: (a, b) => a[0] * b[0] + a[1] * b[1],
    len: a => Math.hypot(a[0], a[1]), norm: a => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; },
    lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], perp: a => [-a[1], a[0]]
  };
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const toHex = c => "#" + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  const tone = (h, k) => toHex(hex(h).map(c => k > 0 ? c + (255 - c) * k : c * (1 + k)));
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
  const LX = -.55, LY = -.83;                           /* Richtung zum Licht (oben links) */
  let gid = 0, gdefs = "";

  /* Schattierung einer Fläche: Kernschatten-Stufen + Glanzkante, alles scharf (nur Formen, Clip, Masken) */
  const shade = (els, base, t, o = {}) => {
    const id = "q" + (gid++), inner = els.join("");
    gdefs += `<g id="${id}">${inner}</g><clipPath id="${id}c">${inner}</clipPath>`;
    const dk = tone(base, o.dark ?? -.4), n = o.steps || 7;
    let s = `<g clip-path="url(#${id}c)"><use href="#${id}" fill="${dk}"/>`;
    for (let i = 1; i <= n; i++) {
      const k = i / n, sh = t * Math.pow(k, 1.35);
      s += `<use href="#${id}" fill="${mix(dk, base, Math.pow(k, .8))}" transform="translate(${f(LX * sh)} ${f(LY * sh)})"/>`;
    }
    /* Reflexlicht am Schattenrand */
    /* Glanzkante zur Lichtseite */
    const lt = tone(base, o.gloss ?? .42), hs = o.hs || 3;
    for (let j = 1; j <= hs; j++) {
      const h = t * (o.hw ?? .5) * j / hs, mid = id + "m" + j;
      gdefs += `<mask id="${mid}" maskUnits="userSpaceOnUse" x="-10" y="-10" width="120" height="120"><rect x="-10" y="-10" width="120" height="120" fill="#fff"/><use href="#${id}" fill="#000" transform="translate(${f(-LX * h)} ${f(-LY * h)})"/></mask>`;
      s += `<rect x="-10" y="-10" width="120" height="120" fill="${lt}" opacity="${o.ga ?? .16}" mask="url(#${mid})"/>`;
    }
    return { id, s: s + "</g>", clip: x => `<g clip-path="url(#${id}c)">${x}</g>` };
  };
  /* weicher Schlagschatten der Gliedmaße auf den Körper dahinter */
  const cast = ids => ids.map(id => [[.3, .45, .045], [.6, .9, .04], [.9, 1.35, .035], [1.2, 1.8, .03], [1.5, 2.25, .025]].map(([x, y, a]) => `<use href="#${id}" fill="#1b1f27" opacity="${a}" transform="translate(${x} ${y})"/>`).join("")).join("");

  const pv = (pr, t) => {
    if (typeof pr === "number") return pr;
    for (let i = 1; i < pr.length; i++) if (t <= pr[i][0]) {
      const [t0, r0] = pr[i - 1], [t1, r1] = pr[i], k = (t - t0) / (t1 - t0 || 1), s = k * k * (3 - 2 * k);
      return r0 + (r1 - r0) * s;
    }
    return pr[pr.length - 1][1];
  };
  const smooth = (pts, closed = true) => {
    const n = pts.length; let d = `M${pt(pts[0])}`;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = pts[closed ? (i - 1 + n) % n : Math.max(0, i - 1)], p1 = pts[i], p2 = pts[closed ? (i + 1) % n : i + 1], p3 = pts[closed ? (i + 2) % n : Math.min(n - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
    }
    return d + (closed ? "Z" : "");
  };
  const organic = (a, b, pf, pb, sg) => {
    const L = V.len(V.sub(b, a)) || .01, u = V.norm(V.sub(b, a)), n = V.mul(V.perp(u), sg), A = [], B = [], N = 14;
    for (let i = 0; i <= N; i++) {
      const t = i / N, c = V.add(a, V.mul(u, L * t));
      A.push(V.add(c, V.mul(n, pv(pf, t)))); B.push(V.sub(c, V.mul(n, pv(pb, t))));
    }
    const cap = (c, rf, rb, dir) => {
      const r = (rf + rb) / 2, cc = V.add(c, V.mul(n, (rf - rb) / 2 * dir)), out = [];
      for (let k = 1; k <= 4; k++) { const an = k / 5 * Math.PI; out.push(V.add(cc, V.add(V.mul(n, Math.cos(an) * r * dir), V.mul(u, Math.sin(an) * r * dir)))); }
      return out;
    };
    return smooth([...A, ...cap(b, pv(pf, 1), pv(pb, 1), 1), ...B.reverse(), ...cap(a, pv(pb, 0), pv(pf, 0), -1)]);
  };
  const onShape = (a, b, pf, pb, sg, t, k) => {
    const u = V.norm(V.sub(b, a)), n = V.mul(V.perp(u), sg), c = V.lerp(a, b, t);
    return V.add(c, V.mul(n, k >= 0 ? pv(pf, t) * k : pv(pb, t) * k));
  };
  /* Muskelkante: dunkle Furche + helle Kante daneben (wirkt plastisch, bleibt scharf) */
  const crease = (pts, col, w = .34, op = .5) => {
    const d = smooth(pts, false), lo = `translate(${f(LX * w * 2.2)} ${f(LY * w * 2.2)})`;
    const st = (c, ww, o, tr = "") => `<path d="${d}" stroke="${c}" stroke-width="${f(ww)}" fill="none" stroke-linecap="round" opacity="${f(o)}"${tr ? ` transform="${tr}"` : ""}/>`;
    return st("#fff", w * 3, op * .1, lo) + st("#fff", w * 1.6, op * .12, lo) +
      st(col, w * 4.2, op * .1) + st(col, w * 2.6, op * .16) + st(col, w * 1.4, op * .26) + st(col, w * .6, op * .3);
  };
  const line = (pts, col, w, op) => `<path d="${smooth(pts, false)}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity="${op}"/>`;
  const Pth = d => `<path d="${d}"/>`;
  const blush = (c, r, col, a) => { a *= .35; const id = "b" + (gid++); gdefs += `<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${a}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`; return `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${r}" fill="url(#${id})"/>`; };

  const FACE_LEFT = ["kickback", "pushup", "pike", "row", "rowOne", "tbar", "invRow", "hyper", "deadlift", "rdl", "goodMorning", "legCurlLying", "gluteKick", "revFly", "plank", "sidePlank", "cableCrunch", "abWheel"];
  const FRONT = !!P.front;
  const U = V.norm(V.sub(J.N, J.P)), side = FACE_LEFT.includes(key) ? -1 : 1;
  const FV = V.mul(V.perp(U), side), RT = V.perp(U), D = V.len(V.sub(J.N, J.P));
  const SKIN = "#dcd8d4", SKIN_F = "#c3beb9", SHORTS_C = "#2c3038", SHORTS_F = "#23262d", HAIR = "#2c2b2d", RED_SK = "#b9a39b", RED = "#e2452c", RED_F = "#c23a25";
  const grp = ex.group, BACKVIEW = FRONT && (grp === "Rücken" || key === "revFlyMa");
  const sideOf = (a, b, ref, fb) => { const n = V.perp(V.norm(V.sub(b, a))), d = V.dot(n, ref); return Math.abs(d) > .8 ? Math.sign(d) : (Math.sign(V.dot(n, fb)) || 1); };

  /* ---------- Trainierte Muskeln (rot) ---------- */
  const hamKeys = ["rdl", "legCurlLying", "legCurlSeat", "goodMorning"];
  const M = {
    chest: grp === "Brust", lats: grp === "Rücken" && !["shrug", "hyper", "deadlift"].includes(key), traps: key === "shrug" || key === "facePull" || key === "uprow",
    lowBack: ["hyper", "goodMorning", "deadlift"].includes(key), delt: grp === "Schultern" || ["incline", "ohp", "dips"].includes(key),
    biceps: grp === "Bizeps" || (grp === "Rücken" && ["pullup", "latPull", "row", "rowOne"].includes(key)), triceps: grp === "Trizeps" || ["dips", "bankDips", "pushup"].includes(key),
    quads: grp === "Beine" && !hamKeys.includes(key) && key !== "adductor", hams: hamKeys.includes(key) || (grp === "Po" && key !== "abductor"),
    adduct: key === "adductor", glutes: grp === "Po" || ["squat", "lunge", "bulgarian", "deadlift", "hipThrust"].includes(key), calves: grp === "Waden", abs: grp === "Bauch"
  };
  const region = (a, b, pr, sg, t0, t1, outK, inK) => {
    const L = V.len(V.sub(b, a)) || .01, u = V.norm(V.sub(b, a)), n = V.mul(V.perp(u), sg), A = [], B = [], N = 10;
    for (let i = 0; i <= N; i++) {
      const t = t0 + (t1 - t0) * i / N, c = V.add(a, V.mul(u, L * t)), r = pv(pr, t), e = Math.pow(Math.sin(Math.PI * i / N), .55);
      const inn = r * inK, out = r * outK;
      A.push(V.add(c, V.mul(n, inn + (out - inn) * e))); B.push(V.add(c, V.mul(n, inn - r * .06 * e)));
    }
    return smooth([...A, ...B.reverse()]);
  };
  /* rote Muskelfläche: eigene Schattierung + feine Faserlinien */
  const muscle = (paths, far, t = 1.1, fib = []) => {
    if (!paths.length) return "";
    const m = shade(paths.map(Pth), far ? RED_F : RED, t, { dark: -.38, gloss: .5, ga: .2 });
    const fl = fib.map(p => line(p, "#ffd2c4", .18, .35)).join("");
    return m.s + m.clip(fl);
  };
  const fibers = (a, b, pr, sg, t0, t1, k0, k1, n = 3) => {
    const out = [];
    for (let i = 1; i <= n; i++) { const k = k0 + (k1 - k0) * i / (n + 1); out.push([onShape(a, b, pr, pr, sg, t0 + .08, k * .9), onShape(a, b, pr, pr, sg, (t0 + t1) / 2, k), onShape(a, b, pr, pr, sg, t1 - .08, k * .9)]); }
    return out;
  };

  /* ---------- Arm ---------- */
  const armRoot = E => FRONT ? V.add(V.add(J.N, V.mul(U, -1.4)), V.mul(RT, (Math.sign(V.dot(RT, V.sub(E, J.N))) || 1) * 6.2)) : J.N;
  const arm = (E, W, far) => {
    const S = armRoot(E), base = far ? SKIN_F : SKIN, lc = tone(base, -.5);
    const Lu = V.len(V.sub(E, S)), ua = V.norm(V.sub(E, S)), uf = V.norm(V.sub(W, E));
    const sg = FRONT ? (Math.sign(V.dot(V.perp(ua), RT)) || 1) : sideOf(S, E, V.sub(W, E), FV);
    const UF = FRONT ? [[0, 2.85], [.3, 3.05], [.58, 3.0], [.84, 2.35], [1, 2.05]] : [[0, 2.6], [.28, 2.8], [.56, 3.1], [.8, 2.5], [1, 2.0]];
    const UB = FRONT ? UF : [[0, 3.0], [.3, 3.3], [.55, 3.0], [.85, 2.25], [1, 2.05]];
    const FF = FRONT ? [[0, 2.2], [.24, 2.55], [.6, 1.95], [1, 1.3]] : [[0, 2.1], [.22, 2.75], [.55, 2.1], [1, 1.28]];
    const FB = FRONT ? FF : [[0, 2.25], [.2, 2.45], [.6, 1.8], [1, 1.22]];
    const up = FRONT && V.dot(ua, U) > .3;
    const DF = up ? [[0, 2.3], [.32, 2.95], [.7, 2.8], [1, 1.5]] : [[0, 2.7], [.32, 3.55], [.7, 3.25], [1, 1.6]];
    const DB = up ? [[0, 2.4], [.3, 3.0], [.7, 2.8], [1, 1.4]] : [[0, 2.9], [.3, 3.6], [.7, 3.2], [1, 1.5]];
    const d1 = V.sub(S, V.mul(ua, up ? .4 : FRONT ? 1.3 : 1.7)), d2 = V.add(S, V.mul(ua, Lu * (FRONT ? .44 : .5)));
    const ol = V.add(E, V.mul(V.perp(ua), -1.15 * sg));
    const h1 = V.sub(W, V.mul(uf, .5)), h2 = V.add(W, V.mul(uf, 2.9)), nf = V.mul(V.perp(uf), sg);
    const th = V.add(V.add(W, V.mul(uf, 1.15)), V.mul(nf, 1.35)), tha = Math.atan2(uf[1], uf[0]) * 180 / Math.PI;
    const els = [
      Pth(organic(E, W, FF, FB, sg)),
      `<circle cx="${f(ol[0])}" cy="${f(ol[1])}" r="1.75"/>`,
      Pth(organic(S, E, UF, UB, sg)),
      Pth(organic(d1, d2, DF, DB, sg)),
      Pth(organic(h1, h2, [[0, 1.3], [.35, 1.7], [.8, 1.78], [1, 1.38]], [[0, 1.3], [.35, 1.55], [.8, 1.62], [1, 1.32]], sg)),
      `<ellipse cx="${f(th[0])}" cy="${f(th[1])}" rx=".78" ry="1.3" transform="rotate(${f(tha)} ${f(th[0])} ${f(th[1])})"/>`
    ];
    const sk = shade(els, base, 1.35);
    let mu = "";
    if (M.delt) mu += muscle([organic(d1, d2, DF, DB, sg)], far, 1.2, fibers(d1, d2, DF, sg, .1, .9, -.5, .5));
    if (M.biceps && !BACKVIEW) mu += FRONT ? muscle([region(S, E, UF, 1, .25, .9, .7, -.7)], far, 1, fibers(S, E, UF, 1, .25, .9, -.4, .4))
      : muscle([region(S, E, UF, sg, .2, .92, .98, -.15)], far, 1, fibers(S, E, UF, sg, .2, .92, .1, .8));
    if (M.triceps) mu += FRONT ? (BACKVIEW ? muscle([region(S, E, UF, 1, .15, .85, .75, -.75)], far, 1, fibers(S, E, UF, 1, .15, .85, -.45, .45)) : "")
      : muscle([region(S, E, UB, -sg, .1, .86, .98, -.2)], far, 1, fibers(S, E, UB, -sg, .1, .86, .1, .8));
    let st = "";
    const dB = (t, k) => onShape(d1, d2, DF, DB, sg, t, k), uS = (t, k) => onShape(S, E, UF, UB, sg, t, k), fS = (t, k) => onShape(E, W, FF, FB, sg, t, k);
    st += crease([dB(.48, .95), dB(.78, .55), dB(.98, 0), dB(.8, -.55), dB(.52, -.95)], lc, .34, .4);           /* Deltamuskel */
    st += crease([dB(.2, .2), dB(.45, .05), dB(.62, -.1)], lc, .26, .25);                                       /* vorderer/seitlicher Delta */
    if (!FRONT) {
      st += crease([uS(.52, -.28), uS(.7, -.22), uS(.9, -.1)], lc, .32, .45);                                     /* Bizeps | Trizeps */
      st += crease([uS(.4, -.7), uS(.6, -.62), uS(.78, -.45)], lc, .26, .3);                                      /* Trizeps-Kopf */
      st += crease([fS(.06, .6), fS(.28, .42), fS(.62, .1)], lc, .3, .42);                                        /* Unterarm-Muskel */
      st += line([fS(.3, -.1), fS(.5, .05), fS(.75, -.05)], "#7d8fb0", .22, .22);                                 /* Vene */
    } else {
      st += crease([uS(.5, .5), uS(.72, .45), uS(.92, .3)], lc, .3, .4);
      st += crease([fS(.08, -.5), fS(.3, -.35), fS(.6, -.1)], lc, .28, .35);
    }
    st += blush(E, 1.6, RED_SK, .1);
    /* Finger der Faust */
    const kn = j => V.add(V.add(W, V.mul(uf, 2.35 + j * .05)), V.mul(nf, -1.2 + j * .8));
    st += crease([kn(0), kn(1), kn(2), kn(3)], lc, .26, .45);
    [0.5, 1.5, 2.5].forEach(j => { const a = kn(j), b = V.add(a, V.mul(uf, .55)); st += line([a, b], lc, .18, .35); });
    return (far ? "" : cast([sk.id])) + sk.s + sk.clip(mu + st);
  };

  /* ---------- Bein ---------- */
  const legRoot = K => FRONT ? V.add(J.P, V.mul(RT, (Math.sign(V.dot(RT, V.sub(K, J.P))) || 1) * 3.4)) : J.P;
  const shoe = (K, F, far) => {
    const u = V.norm(V.sub(F, K)); let n = V.perp(u);
    const col = far ? "#d6dbe1" : "#f4f6f8", sole = "#3a4250", acc = "#9aa3ae";
    if (FRONT) {
      const a = [F[0], F[1] - .8], b = [F[0], F[1] + 1.2];
      const sh = shade([Pth(organic(a, b, 2.3, 2.3, 1))], col, .9, { gloss: .6 });
      return sh.s + `<rect x="${f(F[0] - 2.45)}" y="${f(F[1] + 2)}" width="4.9" height="1.15" rx=".55" fill="${sole}"/>` + line([[F[0] - 1.1, F[1] - .2], [F[0] + 1.1, F[1] - .2]], acc, .25, .8) + line([[F[0] - 1, F[1] + .5], [F[0] + 1, F[1] + .5]], acc, .25, .8);
    }
    if (V.dot(n, FV) < 0) n = V.mul(n, -1);
    const lift = P.toe ? -1.6 : 0;
    const heel = V.sub(V.add(F, V.mul(u, .5)), V.mul(n, 1.9)), tip = V.add(V.add(F, V.mul(u, 1.2 + lift)), V.mul(n, 5.6));
    const soleP = Pth(organic(V.add(heel, V.mul(u, .6)), V.add(tip, V.mul(u, .5)), [[0, 1.9], [.5, 1.6], [1, 1.15]], [[0, 1.95], [.5, 1.95], [1, 1.2]], 1));
    const upper = shade([Pth(organic(heel, tip, [[0, 2.1], [.4, 1.85], [1, 1.2]], [[0, 1.75], [.5, 1.6], [1, 1.1]], 1))], col, .9, { gloss: .6 });
    const lace = [.42, .55, .68].map(t => { const c = V.add(V.lerp(heel, tip, t), V.mul(u, -1.25 + t * .9)); return line([V.add(c, V.mul(n, -.35)), V.add(c, V.mul(n, .35))], acc, .25, .9); }).join("");
    return `<g fill="${sole}">${soleP}</g>` + upper.s + line([V.add(V.lerp(heel, tip, .1), V.mul(u, .9)), V.add(V.lerp(heel, tip, .9), V.mul(u, .75))], "#cfd5dc", .3, .9) + lace;
  };
  const leg = (K, F, far) => {
    const H0 = legRoot(K), base = far ? SKIN_F : SKIN, so = far ? SHORTS_F : SHORTS_C, lc = tone(base, -.5);
    const sgT = FRONT ? 1 : -sideOf(H0, K, V.sub(F, K), V.mul(FV, -1));
    const sgS = FRONT ? 1 : -sideOf(K, F, V.sub(H0, K), V.mul(FV, -1));
    const TF = FRONT ? [[0, 4.4], [.3, 4.6], [.62, 4.0], [.88, 3.0], [1, 2.75]] : [[0, 4.4], [.28, 4.8], [.6, 4.3], [.86, 3.3], [1, 2.8]];
    const TB = FRONT ? TF : [[0, 4.6], [.3, 4.45], [.7, 3.6], [1, 2.8]];
    const SF = FRONT ? [[0, 2.8], [.25, 3.0], [.6, 2.3], [1, 1.5]] : [[0, 2.75], [.2, 2.55], [.7, 1.9], [1, 1.5]];
    const SB = FRONT ? SF : [[0, 2.8], [.24, 3.65], [.5, 3.05], [.78, 2.0], [1, 1.55]];
    const tn = V.perp(V.norm(V.sub(K, H0)));
    const kp = FRONT ? V.add(K, V.mul(U, .4)) : V.add(K, V.mul(tn, 1.9 * sgT));
    const sk = shade([Pth(organic(K, F, SF, SB, sgS)), Pth(organic(H0, K, TF, TB, sgT)), `<circle cx="${f(kp[0])}" cy="${f(kp[1])}" r="1.55"/>`], base, 1.8);
    let mu = "";
    if (FRONT) {
      if (M.quads && !BACKVIEW) mu += muscle([region(H0, K, TF, 1, .12, .95, .82, -.82)], far, 1.4, fibers(H0, K, TF, 1, .12, .95, -.55, .55));
      if (M.hams && BACKVIEW) mu += muscle([region(H0, K, TF, 1, .3, .95, .8, -.8)], far, 1.4, fibers(H0, K, TF, 1, .3, .95, -.5, .5));
      if (M.calves) mu += muscle([region(K, F, SF, 1, .08, .62, .8, -.8)], far, 1.1);
      if (M.adduct) { const ins = -(Math.sign(V.dot(RT, V.sub(K, J.P))) || 1), sgi = ins * (Math.sign(V.dot(tn, RT)) || 1); mu += muscle([region(H0, K, TF, sgi, .05, .78, .98, .05)], far, 1.2); }
    } else {
      if (M.quads) mu += muscle([region(H0, K, TF, sgT, .14, .97, .98, -.22)], far, 1.5, fibers(H0, K, TF, sgT, .14, .97, .1, .85));
      if (M.hams) mu += muscle([region(H0, K, TB, -sgT, .22, .97, .98, -.2)], far, 1.4, fibers(H0, K, TB, -sgT, .22, .97, .1, .85));
      if (M.calves) mu += muscle([region(K, F, SB, -sgS, .05, .64, .98, -.18)], far, 1.1, fibers(K, F, SB, -sgS, .05, .64, .1, .8));
    }
    let st = "";
    const tS = (sg, t, k) => onShape(H0, K, TF, TB, sg, t, k), sS = (sg, t, k) => onShape(K, F, SF, SB, sg, t, k);
    if (!FRONT) {
      st += crease([tS(sgT, .58, .5), tS(sgT, .78, .64), tS(sgT, .93, .45)], lc, .36, .5);       /* innerer Quad-Tropfen */
      st += crease([tS(sgT, .45, .2), tS(sgT, .7, .15), tS(sgT, .88, .3)], lc, .28, .3);         /* Quad-Trennung */
      st += crease([sS(sgS, .1, -.78), sS(sgS, .3, -.35), sS(sgS, .58, -.18)], lc, .34, .48);    /* Wade */
      st += crease([V.add(kp, V.mul(V.norm(V.sub(K, H0)), -1.4)), V.add(kp, V.mul(tn, -.9 * sgT)), V.add(kp, V.mul(V.norm(V.sub(F, K)), 1.4))], lc, .26, .35);
    } else {
      const ins = -(Math.sign(V.dot(RT, V.sub(K, J.P))) || 1), sgi = ins * (Math.sign(V.dot(tn, RT)) || 1);
      st += crease([tS(sgi, .6, .2), tS(sgi, .8, .5), tS(sgi, .95, .35)], lc, .34, .45);
      st += crease([tS(-sgi, .55, .55), tS(-sgi, .8, .45)], lc, .3, .35);
      st += crease([sS(sgi, .15, .7), sS(sgi, .35, .55), sS(sgi, .6, .3)], lc, .3, .4);
      st += crease([V.add(kp, V.mul(RT, -1.2)), V.add(kp, V.mul(U, -1.3)), V.add(kp, V.mul(RT, 1.2))], lc, .26, .35);
    }
    st += blush(kp, 1.8, RED_SK, .09);
    /* Shorts */
    const k2 = V.lerp(H0, K, .34), h0s = FRONT ? V.add(H0, V.mul(U, .9)) : H0;
    const shp = pr => [[0, pv(pr, 0) + (FRONT ? .1 : .3)], [.5, pv(pr, .17) + (FRONT ? .1 : .3)], [1, pv(pr, .34) + .3]];
    const shEl = Pth(organic(h0s, k2, shp(TF), shp(TB), sgT));
    const oS = (t, k) => onShape(h0s, k2, shp(TF), shp(TB), sgT, t, k);
    let sd = crease([oS(.9, 1), oS(.94, 0), oS(.9, -1)], "#0e1218", .45, .55);
    sd += crease([oS(.35, .7), oS(.55, .35), oS(.7, .45)], "#0e1218", .28, .45) + crease([oS(.5, -.6), oS(.68, -.3)], "#0e1218", .25, .4);
    sd += line([oS(.25, -.95), oS(.6, -.97), oS(.86, -.96)], "#566175", .22, .5);
    let out = (far ? "" : cast([sk.id])) + sk.s + sk.clip(mu + st) + shoe(K, F, far);
    if (far && !FRONT) { const sh = shade([shEl], so, 1.8, { gloss: .3, ga: .14 }); out += sh.s + sh.clip(sd); }
    else { SH.els.push(shEl); SH.deco += sd; }
    return out;
  };

  /* Hals gehört zum Rumpf (sitzt hinter dem Kopf) */
  const neckEl = () => {
    const nb = V.add(J.N, V.mul(U, FRONT ? -.5 : .2)), nt = V.add(J.H, V.mul(U, -1.5));
    return FRONT ? Pth(organic(nb, nt, [[0, 3.0], [.5, 2.3], [1, 2.2]], [[0, 3.0], [.5, 2.3], [1, 2.2]], 1))
      : Pth(organic(nb, nt, [[0, 3.0], [1, 2.3]], [[0, 3.3], [1, 2.6]], Math.sign(V.dot(V.perp(V.norm(V.sub(nt, nb))), FV)) || 1));
  };
  /* ---------- Rumpf ---------- */
  const torso = () => {
    const lc = tone(SKIN, -.5);
    if (FRONT) {
      const at = (x, y) => V.add(V.add(J.N, V.mul(RT, x)), V.mul(U, y * D));
      const R = [[2.5, .14], [4.6, .085], [6.6, .03], [6.9, -.1], [7.1, -.24], [6.5, -.4], [5.4, -.6], [5.7, -.78], [6.2, -.92], [4.2, -1.06], [1.2, -1.1]];
      const pts = [...R.map(([x, y]) => at(x, y)), ...R.slice().reverse().map(([x, y]) => at(-x, y))];
      const sk = shade([neckEl(), Pth(smooth(pts))], SKIN, 3.4, { hw: .5, ga: .2 });
      const sym = (P2) => { const q = [...P2.map(([x, y]) => at(x, y))]; return smooth(q); };
      const mir = P2 => P2.map(([x, y]) => [-x, y]);
      let mu = "", st = "";
      if (BACKVIEW) {
        const LAT = [[6.7, -.08], [7.0, -.24], [6.3, -.42], [4.6, -.6], [2.2, -.66], [1.2, -.52], [2.6, -.36], [4.4, -.22], [5.5, -.1]];
        const TRAP = [[0, .2], [2.4, .15], [4.8, .06], [5.6, .02], [3.2, -.06], [1.6, -.2], [0, -.42], [-1.6, -.2], [-3.2, -.06], [-5.6, .02], [-4.8, .06], [-2.4, .15]];
        const LOW = [[.3, -.5], [1.9, -.55], [2.1, -.78], [.4, -.86]];
        if (M.lats) mu += muscle([sym(LAT), sym(mir(LAT))], false, 2, [[at(6.3, -.15), at(4.4, -.38), at(2.0, -.58)], [at(6.0, -.28), at(4.2, -.48), at(2.2, -.62)], [at(6.5, -.06), at(4.6, -.28), at(2.4, -.46)]]);
        if (M.traps || M.lats) mu += muscle([sym(TRAP)], false, 1.6, [[at(.4, .1), at(2.6, .06), at(4.6, .03)], [at(-.4, .1), at(-2.6, .06), at(-4.6, .03)]]);
        if (M.lowBack) mu += muscle([sym(LOW), sym(mir(LOW))], false, 1.2);
        [1, -1].forEach(k => {
          st += crease([at(1.0 * k, .0), at(3.4 * k, -.03), at(4.7 * k, -.18), at(3.6 * k, -.36), at(1.5 * k, -.3)], lc, .4, .55);   /* Schulterblatt */
          st += crease([at(6.6 * k, -.3), at(4.6 * k, -.56), at(1.6 * k, -.7)], lc, .36, .45);                                      /* Lat-Unterkante */
          st += crease([at(1.4 * k, -.48), at(1.7 * k, -.66), at(1.5 * k, -.84)], lc, .32, .4);                                      /* Rückenstrecker */
          st += crease([at(.6 * k, .12), at(3.0 * k, .03), at(5.0 * k, .05)], lc, .26, .3);
        });
        st += crease([at(0, .05), at(0, -.3), at(0, -.6), at(0, -.86)], lc, .42, .55);                                                /* Wirbelsäule */
      } else {
        const PEC = [[.4, -.02], [2.6, .04], [4.8, .0], [6.3, -.06], [6.2, -.15], [4.8, -.21], [3.0, -.27], [1.0, -.24], [.35, -.15]];
        const ABS = [[0, -.3], [2.6, -.31], [3.2, -.42], [3.3, -.56], [2.9, -.7], [1.5, -.84], [0, -.86], [-1.5, -.84], [-2.9, -.7], [-3.3, -.56], [-3.2, -.42], [-2.6, -.31]];
        const OBL = [[3.6, -.38], [5.6, -.45], [5.4, -.62], [4.2, -.76], [3.2, -.7], [3.5, -.55]];
        const LATF = [[6.9, -.12], [7.05, -.26], [6.4, -.42], [5.6, -.4], [6.2, -.26]];
        if (M.chest) mu += muscle([sym(PEC), sym(mir(PEC))], false, 2, [[at(.8, -.06), at(3.2, -.06), at(5.8, -.08)], [at(.8, -.14), at(3.2, -.17), at(5.8, -.12)], [at(-.8, -.06), at(-3.2, -.06), at(-5.8, -.08)], [at(-.8, -.14), at(-3.2, -.17), at(-5.8, -.12)]]);
        if (M.abs) mu += muscle([sym(ABS), sym(OBL), sym(mir(OBL))], false, 1.8);
        if (M.lats) mu += muscle([sym(LATF), sym(mir(LATF))], false, 1.4);
      }
      if (!BACKVIEW) [1, -1].forEach(k => {
        st += crease([at(1.2 * k, .07), at(3.4 * k, .095), at(5.6 * k, .06)], lc, .32, .45);
        st += crease([at(.3 * k, -.04), at(.6 * k, -.21), at(3.2 * k, -.275), at(5.6 * k, -.19), at(6.6 * k, -.1)], lc, .46, .62);
        st += crease([at(2.2 * k, .0), at(4.2 * k, -.06), at(5.6 * k, -.12)], lc, .24, .22);
        [-.33, -.4, -.47].forEach(y => { st += crease([at(6.2 * k, y), at(5.1 * k, y - .035)], lc, .28, .35); });
        st += crease([at(3.4 * k, -.31), at(3.65 * k, -.5), at(3.15 * k, -.7), at(1.6 * k, -.87)], lc, .38, .48);
        st += crease([at(5.5 * k, -.62), at(4.6 * k, -.78), at(3.0 * k, -.9)], lc, .3, .35);  /* Leistenlinie */
        st += blush(at(2.2 * k, -.12), 2.4, RED_SK, .12);
      });
      if (!BACKVIEW) {
        st += crease([at(0, -.06), at(0, -.3), at(0, -.55), at(0, -.76)], lc, .38, .5);
        [-.38, -.485, -.6].forEach(y => { st += crease([at(-3.15, y + .012), at(0, y - .008), at(3.15, y + .012)], lc, .32, .42); });
        st += `<ellipse cx="${f(at(0, -.72)[0])}" cy="${f(at(0, -.72)[1])}" rx=".42" ry=".62" fill="${lc}" opacity=".55"/>`;
      }
      const W = [[5.75, -.76], [6.3, -.92], [5.0, -1.06], [2.5, -1.12]];
      const spts = [...W.map(([x, y]) => at(x, y)), ...W.slice().reverse().map(([x, y]) => at(-x, y))];
      SH.els.push(Pth(smooth(spts)));
      SH.deco += crease([at(-5.7, -.77), at(0, -.79), at(5.7, -.77)], "#0e1218", .5, .55) + line([at(-5.6, -.8), at(0, -.82), at(5.6, -.8)], "#566175", .25, .5);
      if (BACKVIEW) SH.deco += crease([at(0, -.8), at(0, -.95), at(0, -1.1)], "#0e1218", .3, .5);
      if (M.glutes) SH.glute = [sym([[1.0, -.84], [4.6, -.82], [6.0, -.92], [5.2, -1.06], [2.4, -1.1], [.8, -1.0]]), sym(mir([[1.0, -.84], [4.6, -.82], [6.0, -.92], [5.2, -1.06], [2.4, -1.1], [.8, -1.0]]))];
      if (M.glutes && !BACKVIEW) SH.glute = [sym([[5.0, -.8], [6.2, -.86], [6.1, -1.0], [5.2, -.98]]), sym(mir([[5.0, -.8], [6.2, -.86], [6.1, -1.0], [5.2, -.98]]))];
      return sk.s + sk.clip(mu + st);
    }
    const a = V.add(J.N, V.mul(U, 2.6)), b = V.sub(J.P, V.mul(U, 2.4));
    const u = V.norm(V.sub(b, a)), sg = Math.sign(V.dot(V.perp(u), FV)) || 1;
    const TF = [[0, 2.9], [.12, 5.0], [.26, 6.2], [.4, 5.6], [.58, 5.0], [.78, 5.1], [1, 4.6]];
    const TB = [[0, 4.2], [.14, 5.2], [.26, 5.6], [.46, 4.8], [.66, 4.1], [.84, 5.5], [1, 4.6]];
    const sk = shade([neckEl(), Pth(organic(a, b, TF, TB, sg))], SKIN, 3.4, { hw: .5, ga: .2 });
    const o = (t, k) => onShape(a, b, TF, TB, sg, t, k);
    let mu = "";
    if (M.chest) mu += muscle([region(a, b, TF, sg, .1, .44, .99, -.05)], false, 2, fibers(a, b, TF, sg, .1, .44, .2, .85));
    if (M.abs) mu += muscle([region(a, b, TF, sg, .42, .8, .99, .2)], false, 1.6);
    if (M.lats) mu += muscle([region(a, b, TB, -sg, .14, .66, .99, -.12)], false, 1.8, fibers(a, b, TB, -sg, .14, .66, .15, .85));
    if (M.lowBack) mu += muscle([region(a, b, TB, -sg, .52, .8, .99, .25)], false, 1.4);
    if (M.traps) mu += muscle([region(a, b, TB, -sg, -.02, .28, .99, -.4)], false, 1.4);
    if (M.glutes) SH.glute = [region(a, b, TB, -sg, .78, 1.08, 1.04, -.15)];
    let st = "";
    st += crease([o(.27, .5), o(.38, .7), o(.41, .98)], lc, .46, .62);
    st += crease([o(.1, .9), o(.2, .55), o(.27, .45)], lc, .26, .25);
    [[.44, .5], [.5, .56], [.56, .62]].forEach(([t1, t2]) => { st += crease([o(t1, .84), o(t2, .74)], lc, .3, .4); });
    st += crease([o(.46, .92), o(.62, .82), o(.76, .62)], lc, .34, .42);
    st += crease([o(.62, .97), o(.7, .9)], lc, .26, .3) + crease([o(.52, .98), o(.58, .92)], lc, .26, .3);
    st += crease([o(.17, -.8), o(.29, -.55), o(.38, -.2)], lc, .34, .42);
    st += crease([o(.33, -.86), o(.5, -.7), o(.62, -.48)], lc, .3, .36);
    st += crease([o(.6, -.6), o(.7, -.75), o(.78, -.88)], lc, .26, .3);
    st += blush(o(.3, .7), 2.6, RED_SK, .1);
    const w0 = .77, wb = V.add(b, V.mul(u, .3));
    SH.els.push(Pth(organic(V.lerp(a, b, w0), wb, [[0, pv(TF, w0) + .3], [1, pv(TF, 1) + .3]], [[0, pv(TB, w0) + .3], [.5, pv(TB, .9) + .3], [1, pv(TB, 1) + .3]], sg)));
    SH.deco = crease([o(w0 + .02, 1.05), o(w0 + .03, 0), o(w0 + .02, -1.05)], "#0e1218", .5, .55) + line([o(w0 + .045, 1.0), o(w0 + .05, 0), o(w0 + .045, -1.0)], "#566175", .25, .5) + SH.deco;
    return sk.s + sk.clip(mu + st);
  };

  /* ---------- Kopf ---------- */
  const head = () => {
    const c = J.H, lc = tone(SKIN, -.5), ang = Math.atan2(U[1], U[0]) * 180 / Math.PI + 90;
    const nb = V.add(J.N, V.mul(U, FRONT ? .6 : 1.2)), nt = V.add(c, V.mul(U, -2.2));
    const at = (fx, uy) => V.add(V.add(c, V.mul(FV, fx)), V.mul(U, uy));
    const F2 = (x, y) => V.add(V.add(c, V.mul(RT, x)), V.mul(U, y));
    const els = []; let st = "", hairEls = [], hairLines = "";
    let headPath;
    if (BACKVIEW) {
      const R = [[0, 5.3], [2.7, 4.8], [4.0, 3.0], [4.3, .8], [4.0, -1.6], [3.2, -3.4], [1.8, -4.4], [0, -4.6]];
      headPath = smooth([...R.map(([x, y]) => F2(x, y)), ...R.slice(1, -1).reverse().map(([x, y]) => F2(-x, y))]);
      els.push(Pth(headPath));
      [1, -1].forEach(k => { const e = F2(4.15 * k, -.4); els.push(`<ellipse cx="${f(e[0])}" cy="${f(e[1])}" rx=".9" ry="1.5" transform="rotate(${f(ang)} ${f(e[0])} ${f(e[1])})"/>`); });
      const HR = [[0, 5.8], [3.4, 5.0], [4.6, 2.4], [4.3, .6], [3.9, -.6], [3.6, -2.4], [2.4, -3.1], [0, -3.3]];
      hairEls.push(Pth(smooth([...HR.map(([x, y]) => F2(x, y)), ...HR.slice(1, -1).reverse().map(([x, y]) => F2(-x, y))])));
      for (let i = -3; i <= 3; i++) hairLines += line([F2(i * .4, 5.2), F2(i * 1.0, 2.0), F2(i * 1.1, -2.6)], "#4a494c", .2, .5);
      st += crease([F2(-1.1, -3.6), F2(-1.3, -5.6)], lc, .3, .35) + crease([F2(1.1, -3.6), F2(1.3, -5.6)], lc, .3, .35);
    } else if (FRONT) {
      const R = [[0, 5.3], [2.6, 4.8], [3.9, 3.2], [4.25, 1.0], [4.0, -1.4], [3.4, -3.1], [2.2, -4.5], [0, -5.2]];
      headPath = smooth([...R.map(([x, y]) => F2(x, y)), ...R.slice(1, -1).reverse().map(([x, y]) => F2(-x, y))]);
      els.push(Pth(headPath));
      [1, -1].forEach(k => { const e = F2(4.15 * k, -.2); els.push(`<ellipse cx="${f(e[0])}" cy="${f(e[1])}" rx=".85" ry="1.45" transform="rotate(${f(ang)} ${f(e[0])} ${f(e[1])})"/>`); });
      const HR = [[0, 5.6], [3.2, 5.0], [4.5, 2.6], [4.3, 1.2], [3.7, 2.2], [2.0, 2.9], [0, 3.0]];
      hairEls.push(Pth(smooth([...HR.map(([x, y]) => F2(x, y)), ...HR.slice(1, -1).reverse().map(([x, y]) => F2(-x, y))])));
      for (let i = -3; i <= 3; i++) hairLines += line([F2(i * 1.0, 3.1), F2(i * 1.15, 4.2), F2(i * 1.25, 5.1)], "#4a494c", .2, .5);
      [1, -1].forEach(k => {
        st += line([F2(.8 * k, 1.35), F2(1.8 * k, 1.62), F2(2.8 * k, 1.38)], HAIR, .5, 1);
        const e = F2(1.8 * k, .55);
        st += `<path d="${smooth([F2(1.05 * k, .55), F2(1.8 * k, .85), F2(2.55 * k, .55), F2(1.8 * k, .3)])}" fill="#fbf8f4"/><circle cx="${f(e[0])}" cy="${f(e[1])}" r=".34" fill="#3d2a1e"/><circle cx="${f(e[0])}" cy="${f(e[1])}" r=".15" fill="#000"/>`;
        st += line([F2(1.05 * k, .6), F2(1.8 * k, .9), F2(2.55 * k, .6)], lc, .2, .7);
        st += crease([F2(1.3 * k, -.05), F2(2.2 * k, -.2)], lc, .2, .25);
        st += blush(F2(2.4 * k, -1.6), 1.5, RED_SK, .16);
      });
      st += crease([F2(-.25, .5), F2(-.5, -1.3), F2(-.9, -1.9), F2(0, -2.2), F2(.9, -1.9)], lc, .3, .55);
      st += `<path d="${smooth([F2(-1.35, -3.2), F2(-.5, -3.0), F2(0, -3.1), F2(.5, -3.0), F2(1.35, -3.2), F2(0, -3.75)])}" fill="#b4948c"/>` + line([F2(-1.3, -3.22), F2(0, -3.25), F2(1.3, -3.22)], "#7d6560", .2, .8);
      st += crease([F2(-3.6, -2.8), F2(-2.2, -4.3), F2(0, -4.95), F2(2.2, -4.3), F2(3.6, -2.8)], lc, .26, .25);
      st += crease([F2(-2.2, -6.8), F2(-1.6, -5.2)], lc, .32, .35) + crease([F2(2.2, -6.8), F2(1.6, -5.2)], lc, .32, .35);
    } else {
      const R = [[-.4, 5.1], [1.8, 4.9], [3.5, 3.4], [4.2, 1.8], [4.15, 1.05], [4.55, .35], [5.15, -.75], [4.4, -1.3], [4.55, -2.0], [4.4, -2.65], [4.05, -3.4], [3.6, -4.15], [2.4, -4.55], [.6, -4.2], [-1.3, -3.0], [-3.2, -2.1], [-4.4, -.4], [-4.5, 1.6], [-3.4, 3.9]];
      headPath = smooth(R.map(([x, y]) => at(x, y)));
      els.push(Pth(headPath));
      const ear = at(-.7, -.3);
      els.push(`<ellipse cx="${f(ear[0])}" cy="${f(ear[1])}" rx=".95" ry="1.5" transform="rotate(${f(ang)} ${f(ear[0])} ${f(ear[1])})"/>`);
      const HR = [[-5, 6], [2.4, 6.2], [4.4, 3.4], [3.6, 3.2], [2.2, 3.9], [.6, 3.4], [-.6, 2.6], [-1.5, .9], [-2.4, -.9], [-3.4, -2.1], [-5.2, -2.4]];
      hairEls.push(Pth(smooth(HR.map(([x, y]) => at(x, y)))));
      for (let i = 0; i < 6; i++) hairLines += line([at(3.2 - i * 1.2, 3.6 - i * .1), at(1.6 - i * 1.25, 4.6 - i * .5), at(-.6 - i * 1.0, 4.8 - i * 1.2)], "#4a494c", .2, .5);
      st += crease([at(-.35, .6), at(-1.05, .2), at(-1.0, -.8), at(-.5, -1.1)], lc, .28, .55);
      st += line([at(2.6, 1.65), at(3.4, 1.88), at(4.1, 1.55)], HAIR, .5, 1);
      const e = at(3.4, .75);
      st += `<path d="${smooth([at(2.95, .8), at(3.45, 1.0), at(3.9, .75), at(3.45, .55)])}" fill="#fbf8f4"/><circle cx="${f(e[0])}" cy="${f(e[1])}" r=".3" fill="#3d2a1e"/>` + line([at(2.95, .85), at(3.45, 1.05), at(3.95, .78)], lc, .2, .7);
      st += crease([at(4.0, -1.05), at(4.55, -1.15)], lc, .28, .5);
      st += `<path d="${smooth([at(3.9, -2.0), at(4.4, -2.1), at(4.35, -2.45), at(3.9, -2.4)])}" fill="#b4948c"/>`;
      st += crease([at(3.3, -3.5), at(1.6, -3.9), at(-.9, -2.7)], lc, .28, .3);
      st += crease([at(-.5, -3.6), at(1.2, -5.6), at(2.0, -6.6)], lc, .32, .32);
      st += crease([at(3.2, -.3), at(2.6, -1.4)], lc, .22, .25);
      st += blush(at(2.6, -1.4), 1.5, RED_SK, .16);
    }
    const sk = shade(els, SKIN, 1.9, { hw: .45 });
    const hid = "hc" + (gid++);
    gdefs += `<clipPath id="${hid}"><path d="${headPath}"/></clipPath>`;
    const hr = shade(hairEls, HAIR, 1.4, { gloss: .35, ga: .18 });
    return sk.s + `<g clip-path="url(#${hid})">${hr.s}${hairLines}</g>` + st;
  };

  /* Bodenschatten (Verlauf statt Filter) */
  gdefs += `<radialGradient id="fl"><stop offset="0" stop-color="#1f2937" stop-opacity=".22"/><stop offset="1" stop-color="#1f2937" stop-opacity="0"/></radialGradient>`;
  back += `<ellipse cx="${f((J.P[0] + J.F1[0]) / 2)}" cy="${g + 1.2}" rx="23" ry="2.6" fill="url(#fl)"/>`;

  const SH = { els: [], deco: "", glute: null };
  const shortsNow = () => { const sh = shade(SH.els, SHORTS_C, 2.2, { gloss: .3, ga: .14 }); return sh.s + sh.clip(SH.deco + (SH.glute ? `<g opacity=".92">${muscle(SH.glute, false, 1.6)}</g>` : "")); };
  let fig = "";
  if (FRONT) {
    fig += torso() + leg(K2, F2, true) + leg(J.K1, J.F1, false) + shortsNow() + head();
    fig += arm(E2, W2, true) + arm(J.E1, J.W1, false);
  } else {
    fig += arm(E2, W2, true) + leg(K2, F2, true) + torso() + head();
    fig += leg(J.K1, J.F1, false) + shortsNow() + arm(J.E1, J.W1, false);
  }

  /* Zusatzgewicht bei Körpergewicht */
  if (weighted) {
    const st = WEIGHT_STYLE[key] || "vest";
    if (st === "belt") { const hang = [J.P[0] + 1, J.P[1] + 13]; front += `<path d="M${pt(mid(J.N, J.P, .9))}Q${f(J.P[0] + 4)} ${f(J.P[1] + 6)} ${pt([hang[0], hang[1] - 5])}" stroke="#9aa3ae" stroke-width=".9" fill="none" stroke-dasharray="1.2 .8"/>` + plate(hang, 5.5); }
    else if (st === "back") { const c = mid(J.N, J.P, .5); front += `<ellipse cx="${f(c[0])}" cy="${f(c[1] - 6.5)}" rx="9" ry="2.6" fill="url(#plate)"/><ellipse cx="${f(c[0])}" cy="${f(c[1] - 7.2)}" rx="7" ry="1.4" fill="#4a505a"/>`; }
    else if (st === "lap" || st === "hold" || st === "chest") { const c = st === "lap" ? J.P : st === "chest" ? mid(J.N, J.P, .35) : mid(J.W1, J.N, .3); front += plate([c[0] + 1, c[1] - 3], 5); }
    else if (st === "feet") front += dumbbell([J.F1[0], J.F1[1] - 3], true);
    else front += `<path d="${capsule(mid(J.N, J.P, .12), mid(J.N, J.P, .62), 6.3, 5.6)}" fill="#2a3039" opacity=".95"/>` +
      [.2, .38, .56].map(t => { const c = mid(J.N, J.P, t); return `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="1.2" fill="#3b414a"/>`; }).join("");
  }

  /* Gewichte vorne */
  if (["Langhantel", "SZ-Stange", "Smith-Maschine"].includes(eq) && P.bar) front += barbell(P.bar);
  if (eq === "Kurzhantel") front += (Array.isArray(P.db) ? P.db : [J.W1, W2]).map(p => dumbbell(p, P.dbVertical)).join("");
  if (eq === "Kettlebell") front += kettlebell(P.bar || J.W1);
  if (eq === "Maschine" && P.machine) front += P.machine.filter(m => m[0] === "circle").map(shape).join("");
  if (eq === "Maschine" && !P.machine && !["pullup", "dips", "latPull", "legPress", "hack", "butterfly", "adductor", "abductor", "calfPress"].includes(key)) front += `<rect x="${f(J.W1[0] - 3)}" y="${f(J.W1[1] - 3)}" width="6" height="6" rx="1.5" fill="url(#pad)"/>`;

  /* Bewegungspfeil */
  let arr = "";
  if (P.arrow && SHOW_ARROWS) {
    const [x1, y1, x2, y2] = P.arrow, ang = Math.atan2(y2 - y1, x2 - x1), h = 3.6;
    arr = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${HOT}" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="2.4 2.6"/>` +
      `<path d="M${f(x2)} ${f(y2)}L${f(x2 - h * Math.cos(ang - .5))} ${f(y2 - h * Math.sin(ang - .5))}L${f(x2 - h * Math.cos(ang + .5))} ${f(y2 - h * Math.sin(ang + .5))}Z" fill="${HOT}"/>`;
  }
  /* Ausschnitt eng um die Figur (wie bei Hevy) */
  const pts = Object.values(J).concat(P.bar ? [P.bar] : []);
  let x0 = Math.min(...pts.map(p => p[0])) - 8, x1 = Math.max(...pts.map(p => p[0])) + 8, y0 = Math.min(...pts.map(p => p[1])) - 11, y1 = Math.max(...pts.map(p => p[1])) + 6;
  let sz = Math.max(62, x1 - x0, y1 - y0); const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  sz = Math.min(sz, 100);
  const vx = Math.max(0, Math.min(100 - sz, cx - sz / 2)), vy = Math.max(0, Math.min(100 - sz, cy - sz / 2));
  return `<svg viewBox="${f(vx)} ${f(vy)} ${f(sz)} ${f(sz)}" xmlns="http://www.w3.org/2000/svg" width="200" height="200">${defs}<defs>${gdefs}</defs>${back}${fig}${front}${arr}</svg>`;
}
const exArtCache = new Map();
function exArtURL(ex, weighted) {
  const k = ex.id + (weighted ? "+w" : "");
  if (!exArtCache.has(k)) exArtCache.set(k, "data:image/svg+xml;charset=utf-8," + exerciseArt(ex, weighted).replace(/"/g, "'").replace(/[\r\n%#<>{}]/g, encodeURIComponent));
  return exArtCache.get(k);
}
const exThumb = (ex, cls = "ex-thumb", weighted = false) => `<img class="${cls}" src="${exArtURL(ex, weighted)}" alt="" loading="lazy">`;

