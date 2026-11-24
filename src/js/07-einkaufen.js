/* ---------- Einkaufen ---------- */
let cart = {};          // Produkt-ID -> Anzahl Packungen
let pendingPack = {};   // Packungsgröße für Produkte ohne Angabe
let shopSearch = "";
let resumeShopScan = false;
let returnToShop = false;

const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);

function openShop() {
  cart = {}; pendingPack = {}; shopSearch = "";
  $("shopSearch").value = "";
  const fromList = shoplist.filter(x => x.pid && products.some(p => p.id === x.pid));
  $("shopFromList").style.display = fromList.length ? "" : "none";
  $("shopFromList").innerHTML = `${ic("clipboard")} Von der Einkaufsliste übernehmen (${fromList.length})`;
  $("shopFromList").onclick = () => { for (const x of fromList) cart[x.pid] = Math.max(cart[x.pid] || 0, x.qty || 1); $("shopFromList").style.display = "none"; renderShopList(); toast(`${fromList.length} von der Liste im Wagen`); };
  renderShopList();
  $("shopSheet").classList.add("open");
}

function closeShop(force) {
  if (!force && cartCount() && !confirm("Einkauf verwerfen?")) return;
  stopShopScan();
  $("shopSheet").classList.remove("open");
}

function renderShopList() {
  const n = cartCount();
  $("shopSaveBtn").innerHTML = `<b>Einräumen${n ? ` (${n})` : ""}</b>`;
  const list = $("shopList");
  if (!products.length) {
    list.innerHTML = `<div class="empty" style="padding:30px 10px">Noch keine Produkte.<br>Scanne dein erstes Produkt oder leg es neu an.</div>`;
    return;
  }
  const term = shopSearch.toLowerCase();
  let html = "", found = 0;
  for (const cat of CATEGORIES) {
    const items = products.filter(p => p.cat === cat.id && p.name.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name, "de"));
    if (!items.length) continue;
    found += items.length;
    html += `<div class="cat-title">${ic(cat.icon)} ${cat.name}</div><div class="shop-list">`;
    for (const p of items) {
      const c = cart[p.id] || 0;
      const img = p.image ? `<img class="thumb" src="${esc(p.image)}" alt="" loading="lazy">` : `<div class="thumb fi-thumb">${foodSVG(foodIconKey(p), 1, 1)}</div>`;
      const sub = p.pack > 0
        ? `<div class="item-sub">${fmt(p.pack)} g pro Packung</div>`
        : (c ? `<input class="packIn" data-id="${p.id}" type="number" inputmode="decimal" placeholder="g pro Packung" value="${pendingPack[p.id] || ""}">`
             : `<div class="item-sub">Packungsgröße fehlt</div>`);
      html += `<div class="shop-item ${c ? "on" : ""}">
        ${img}
        <div class="item-main"><div class="item-name">${esc(p.name)}</div>${sub}</div>
        <div class="mini">
          ${c ? `<button data-id="${p.id}" data-d="-1">−</button><span>${c}</span>` : ""}
          <button data-id="${p.id}" data-d="1">+</button>
        </div>
      </div>`;
    }
    html += `</div>`;
  }
  if (!found) html += `<div class="empty" style="padding:30px 10px">Nichts gefunden.</div>`;
  list.innerHTML = html;
  list.querySelectorAll(".mini button").forEach(b => b.onclick = () => {
    const id = b.dataset.id;
    cart[id] = Math.max(0, (cart[id] || 0) + Number(b.dataset.d));
    if (!cart[id]) delete cart[id];
    renderShopList();
  });
  list.querySelectorAll(".packIn").forEach(i => i.oninput = () => { pendingPack[i.dataset.id] = num(i.value); });
}

$("shopSearch").oninput = () => { shopSearch = $("shopSearch").value; renderShopList(); };
$("shopCancel").onclick = () => closeShop(false);
$("shopNewBtn").onclick = () => { stopShopScan(); returnToShop = true; openSheet(); };

$("shopSaveBtn").onclick = () => {
  const ids = Object.keys(cart);
  if (!ids.length) { toast("Dein Wagen ist noch leer"); return; }
  for (const id of ids) {
    const p = products.find(x => x.id === id);
    if (p && !(p.pack > 0) && !(pendingPack[id] > 0)) { toast(`Packungsgröße für ${p.name} fehlt`); return; }
  }
  let total = 0;
  for (const id of ids) {
    const p = products.find(x => x.id === id);
    if (!p) continue;
    if (!(p.pack > 0)) p.pack = pendingPack[id];
    setExpiryOnAdd(p, inStock(p));
    stock[id] = (stock[id] || 0) + cart[id] * p.pack;
    p.bought = true;
    total += cart[id];
  }
  shoplist = shoplist.filter(x => !(x.pid && cart[x.pid])); saveList();
  saveProducts();
  saveStock();
  closeShop(true);
  renderFridge();
  toast(`${total} ${total === 1 ? "Packung" : "Packungen"} eingeräumt ✓`);
};

/* Scannen beim Einkaufen */
$("shopScanBtn").onclick = startShopScan;

function startShopScan() {
  Cam.open("multi", onShopScan, "Einkauf scannen");
  updateCamCount();
}
function stopShopScan() { if (Cam.isOpen() && Cam.mode === "multi") Cam.close(); }
function updateCamCount() { const n = cartCount(); $("camCount").textContent = n ? `${n} im Wagen` : ""; }

function onShopScan(code) {
  const p = products.find(x => sameCode(x.barcode, code));
  if (p) {
    cart[p.id] = (cart[p.id] || 0) + 1;
    if (navigator.vibrate) navigator.vibrate(40);
    renderShopList();
    updateCamCount();
    Cam.status(`✓ ${p.name} – ${cart[p.id]}× im Wagen`, "ok");
  } else {
    Cam.close();
    resumeShopScan = true;
    returnToShop = true;
    openSheet();
    $("fBarcode").value = code;
    lookup(code);
  }
}

/* Bestand eines Produkts */
let stockId = null;
function openStock(id) {
  stockId = id;
  const p = products.find(x => x.id === id);
  if (!p) return;
  $("sName").textContent = p.name;
  $("sPreview").innerHTML = p.image ? `<img src="${esc(p.image)}" alt="">` : "";
  $("sPreview").style.display = p.image ? "flex" : "none";
  refreshStockSheet();
  $("stockSheet").classList.add("open");
}
function refreshStockSheet() {
  const p = products.find(x => x.id === stockId);
  const t = stockText(p);
  $("sStock").textContent = t.main;
  $("sStockSub").textContent = `${t.sub} · 1 Packung = ${fmt(packOf(p))} g`;
  $("sGrams").value = Math.round(stock[p.id] || 0);
  const d = daysLeft(p.id), has = inStock(p);
  $("sExp").value = expiry[p.id] || "";
  $("sExp").disabled = !has;
  $("sExpHint").textContent = !has ? "Nicht im Bestand" : d === null ? "Kein Datum" : expText(d);
  $("sExpHint").className = "hint " + (d !== null && d <= 0 ? "bad" : d !== null && d <= 2 ? "soon" : "");
  $("sExpQuick").innerHTML = has ? [["Standard", defaultExpDays(p)], ["+3 Tage", 3], ["+1 Woche", 7], ["+1 Monat", 30]].map(([t, n]) => `<button data-xd="${n}">${t}</button>`).join("") : "";
  $("sExpQuick").querySelectorAll("[data-xd]").forEach(b => b.onclick = () => { expiry[p.id] = addDays(+b.dataset.xd); saveStock(); refreshStockSheet(); renderFridge(); });
  const onList = shoplist.some(x => x.pid === p.id && !x.done);
  $("sToList").innerHTML = `${ic("clipboard")} ${onList ? "Steht auf der Liste ✓" : "Auf die Einkaufsliste"}`;
  $("sToList").disabled = onList;
}
$("sExp").onchange = () => { if ($("sExp").value) expiry[stockId] = $("sExp").value; else delete expiry[stockId]; saveStock(); refreshStockSheet(); renderFridge(); };
$("sToList").onclick = () => { const p = products.find(x => x.id === stockId); addToList({ pid: p.id, name: p.name, qty: 1 }); refreshStockSheet(); renderFridge(); toast("Auf die Einkaufsliste gesetzt ✓"); };
function changeStock(delta) {
  const p = products.find(x => x.id === stockId);
  if (delta > 0) setExpiryOnAdd(p, inStock(p));
  stock[p.id] = Math.max(0, (stock[p.id] || 0) + delta);
  if (stock[p.id] < 0.5) delete stock[p.id];
  saveStock();
  refreshStockSheet();
  renderFridge();
}
$("sPlus").onclick = () => changeStock(packOf(products.find(x => x.id === stockId)));
$("sMinus").onclick = () => changeStock(-packOf(products.find(x => x.id === stockId)));
$("sSet").onclick = () => { const v = Math.max(0, num($("sGrams").value)); changeStock(v - (stock[stockId] || 0)); toast("Bestand aktualisiert"); };
$("sEmpty").onclick = () => {
  delete stock[stockId]; saveStock(); renderFridge();
  $("stockSheet").classList.remove("open"); toast("Aufgebraucht");
};

