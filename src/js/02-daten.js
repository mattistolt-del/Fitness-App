/* ---------- Grunddaten ---------- */
const CATEGORIES = [
  /* Kühlschrank */
  { id: "milch",         name: "Milchprodukte",             short: "Milch",           icon: "milk" },
  { id: "fleisch",       name: "Fleisch & Fisch",           short: "Fleisch & Fisch", icon: "meat" },
  { id: "gemuese",       name: "Gemüse",                    short: "Gemüse",          icon: "carrot" },
  { id: "obst",          name: "Obst",                      short: "Obst",            icon: "apple" },
  { id: "tiefkuehl",     name: "Tiefkühl",                  short: "Tiefkühl",       icon: "snow" },
  /* Schrank */
  { id: "kohlenhydrate", name: "Kartoffeln, Reis & Nudeln", short: "Kartoffeln, Reis, Nudeln", icon: "wheat" },
  { id: "oel",           name: "Öl & Fett",                 short: "Öl",              icon: "drop" },
  { id: "backen",        name: "Backzutaten",               short: "Backen",          icon: "cake" },
  { id: "gewuerze",      name: "Gewürze",                   short: "Gewürze",         icon: "salt" },
  { id: "suess",         name: "Süßigkeiten",               short: "Süßes",           icon: "candy" },
  { id: "sonstiges",     name: "Sonstiges",                 short: "Sonstiges",       icon: "box" }
];
/* Kategorien aus Version 1 umziehen */
const OLD_CATS = { protein: "sonstiges", konserven: "sonstiges", getraenke: "sonstiges" };

const STORE_KEY = "makro.products";

function loadProducts() {
  try {
    const list = JSON.parse(localStorage.getItem(STORE_KEY)) || [];
    list.forEach(p => { if (OLD_CATS[p.cat]) p.cat = OLD_CATS[p.cat]; });
    return list;
  }
  catch (e) { return []; }
}
function saveProducts() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(products)); }
  catch (e) { toast("Speichern fehlgeschlagen"); }
}

let products = loadProducts();

/* Bestand: Produkt-ID -> Menge in g/ml */
const STOCK_KEY = "makro.stock";
let stock = (() => { try { return JSON.parse(localStorage.getItem(STOCK_KEY)) || {}; } catch (e) { return {}; } })();
/* ---------- Haltbarkeit ---------- */
const EXP_KEY = "makro.expiry";
let expiry = (() => { try { return JSON.parse(localStorage.getItem(EXP_KEY)) || {}; } catch (e) { return {}; } })();
const EXP_DAYS = {
  chicken: 3, turkey: 3, mince: 1, steak: 4, salmon: 2, fish: 2, shrimp: 2, ham: 7, bacon: 10, sausage: 7, tuna: 730,
  milk: 7, oatmilk: 10, cream: 10, buttermilk: 10, juice: 7, quark: 14, skyr: 14, yogurt: 14, greek: 14, cottage: 10, creamcheese: 14,
  pudding: 14, butter: 30, cheese: 21, slices: 14, mozzarella: 10, feta: 21, eggs: 21, tofu: 10, hummus: 7,
  broccoli: 5, cauliflower: 6, pepper: 7, pepperY: 7, pepperG: 7, tomato: 6, cucumber: 7, zucchini: 7, carrot: 21, onion: 30, redonion: 30,
  garlic: 60, potato: 30, potatoes: 30, sweetpotato: 21, mushroom: 5, lettuce: 5, spinach: 4, avocado: 4,
  apple: 21, greenapple: 21, pear: 7, orange: 21, lemon: 21, lime: 14, kiwi: 10, banana: 5, grapes: 7, berries: 4, strawberry: 3,
  mango: 6, pineapple: 5, melon: 7, dates: 90, bread: 5, toast: 7, rolls: 2, wraps: 21
};
Object.assign(EXP_DAYS, { lfmilk: 10, soymilk: 10, almondmilk: 10, kefir: 14, proteinshake: 30, sourcream: 14, margarine: 60, parmesan: 60, salami: 14, chickenslices: 7,
  bratwurst: 3, schnitzel: 3, frozenchicken: 180, cherrytomato: 6, eggplant: 7, springonion: 7, leek: 10, ginger: 21, chili: 10, rucola: 4, lentils: 365, tomatopaste: 365,
  frozenspinach: 180, mandarin: 14, peach: 5, plum: 5, raspberry: 3, cherries: 5, pomegranate: 21, basmati: 730, ricecup: 730, fusilli: 730, noodles: 730, gnocchi: 30,
  couscous: 365, quinoa: 365, cornflakes: 180, granola: 180, wholegrain: 7, crispbread: 180, curry: 365, bagGeneric: 365 });
Object.assign(EXP_DAYS, { mascarpone: 14, ricotta: 7, halloumi: 30, camembert: 14, minicheese: 30, yogurtdrink: 14, ricepudding: 14, eggwhite: 14, ghee: 270, sprayCream: 21,
  drumsticks: 3, meatballs: 4, smokedsalmon: 10, sardines: 730, veggieburger: 14, chorizo: 30, greenbeans: 5, asparagus: 4, radish: 7, beetroot: 21, pumpkin: 60, kohlrabi: 10,
  cabbage: 21, brusselsprouts: 7, celery: 14, olives: 365, pickles: 365, sauerkraut: 365, coconutmilk: 730, watermelon: 10, coconut: 30, grapefruit: 21, apricot: 5, raisins: 365,
  applesauce: 365, fig: 5, edamame: 180, frozensalmon: 180, frozenshrimp: 180, frozenmango: 270, bakerolls: 180, icepop: 365, bagels: 7, pita: 5, baguette: 2, pretzel: 2, croissant: 3,
  chia: 365, linseed: 365, tortellini: 21, tahini: 365, hotsauce: 365, bbq: 365, salsa: 180, maple: 365, cocoa: 365, yeast: 180, vanilla: 365, mate: 270, icetea: 270, sparkling: 365,
  iso: 270, kombucha: 90, sekt: 730, popcorn: 180, muesli_bar: 180, bcaa: 365, ricecakechoc: 180 });
const EXP_CAT = { milch: 10, fleisch: 3, gemuese: 7, obst: 7, tiefkuehl: 180 };
function defaultExpDays(p) { const k = typeof foodIconKey === "function" ? foodIconKey(p) : ""; return EXP_DAYS[k] ?? EXP_CAT[p.cat] ?? 365; }
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toLocaleDateString("sv-SE"); };
function daysLeft(pid) { const e = expiry[pid]; if (!e) return null; return Math.round((new Date(e + "T12:00") - new Date(new Date().toLocaleDateString("sv-SE") + "T12:00")) / 864e5); }
function expText(d) { return d < 0 ? (d === -1 ? "seit gestern abgelaufen" : `seit ${-d} Tagen abgelaufen`) : d === 0 ? "läuft heute ab" : d === 1 ? "läuft morgen ab" : `noch ${d} Tage`; }
/* beim Einräumen: ältere Ware zählt (frühestes Datum bleibt), sonst Standard-Haltbarkeit */
function setExpiryOnAdd(p, hadStock) { if (!hadStock || !expiry[p.id]) expiry[p.id] = addDays(defaultExpDays(p)); }
function saveExpiry() { for (const id of Object.keys(expiry)) if (!(stock[id] > 0.5)) delete expiry[id]; try { localStorage.setItem(EXP_KEY, JSON.stringify(expiry)); } catch (e) {} }

function saveStock() {
  saveExpiry();
  try { localStorage.setItem(STOCK_KEY, JSON.stringify(stock)); }
  catch (e) { toast("Speichern fehlgeschlagen"); }
}
let editingId = null;
let currentImage = "", currentIcon = "", currentTags = [];
let searchTerm = "";

const $ = id => document.getElementById(id);
const num = v => { const n = parseFloat(String(v).replace(",", ".")); return isNaN(n) ? 0 : n; };
const r1 = n => Math.round(n * 10) / 10;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

function toast(msg) {
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2000);
}

