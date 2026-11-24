/* ---------- Tabs ---------- */
const TABS = {
  produkte:     { title: "Produkte",    render: renderLib, add: true },
  kuehlschrank: { title: "Kühlschrank", render: renderFridge, add: true },
  heute:        { title: "Kalorien",    render: renderToday },
  vorschlaege:  { title: "Rezepte",     render: renderIdeas },
  training:     { title: "Training",    render: renderTraining, add: true }
};
let currentTab = "produkte";

function showTab(tab) {
  currentTab = tab;
  document.body.dataset.tab = tab;
  document.querySelectorAll("nav button").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  $("title").textContent = TABS[tab].title;
  const ab = $("addBtn");
  ab.style.display = TABS[tab].add ? "" : "none";
  if (tab === "kuehlschrank") { ab.className = "btn pill"; ab.innerHTML = `${ic("cart")} Einkaufen`; }
  else if (tab === "training") { ab.className = "btn pill"; ab.innerHTML = activeWk ? `${ic("flame")} Weiter` : `${ic("play")} Starten`; }
  else { ab.className = "btn round"; ab.textContent = "+"; }
  const v = $("view"); v.classList.remove("anim");
  TABS[tab].render();
  if (lastTab !== tab) { void v.offsetWidth; v.classList.add("anim"); window.scrollTo({ top: 0 }); clearTimeout(v._at); v._at = setTimeout(() => v.classList.remove("anim"), 900); }
  lastTab = tab;
  if (typeof updateSub === "function") updateSub();
}
let lastTab = null;
document.querySelectorAll("nav button").forEach(b => b.onclick = () => showTab(b.dataset.tab));

function soon(icon, text) {
  $("view").innerHTML = `<div class="empty"><div class="big">${icon}</div>${text}<br>Kommt im nächsten Schritt.</div>`;
}

/* ---------- Lebensmittel: Produkte und Mahlzeiten als zwei Spalten ---------- */
let libSeg = (() => { try { return localStorage.getItem("makro.libSeg") || "produkte"; } catch (e) { return "produkte"; } })();
function renderLib() {
  const view = $("view");
  view.innerHTML = `
    <div class="seg lib-seg">
      <button data-seg="produkte" class="${libSeg === "produkte" ? "on" : ""}">${ic("leaf")} Lebensmittel <span>${products.length}</span></button>
      <button data-seg="mahlzeit" class="${libSeg === "mahlzeit" ? "on" : ""}">${ic("utensils")} Mahlzeiten <span>${templates.length}</span></button>
    </div>
    <div class="lib-cols" data-show="${libSeg}">
      <section class="lib-col" data-col="produkte">
        <div class="lib-head"><b>${ic("leaf")} Lebensmittel</b><button class="btn pill sm" id="libAddProd">+ Lebensmittel</button></div>
        <div id="colProd"></div>
      </section>
      <section class="lib-col" data-col="mahlzeit">
        <div class="lib-head"><b>${ic("utensils")} Mahlzeiten</b><button class="btn pill sm" id="libAddMeal">+ Mahlzeit</button></div>
        <div id="colMeal"></div>
      </section>
    </div>`;
  renderProducts($("colProd"));
  renderMeals($("colMeal"));
  $("libAddProd").onclick = () => openSheet();
  $("libAddMeal").onclick = () => openMealEditor();
  view.querySelectorAll("[data-seg]").forEach(b => b.onclick = () => {
    libSeg = b.dataset.seg; try { localStorage.setItem("makro.libSeg", libSeg); } catch (e) {}
    view.querySelectorAll("[data-seg]").forEach(x => x.classList.toggle("on", x === b));
    view.querySelector(".lib-cols").dataset.show = libSeg;
    if (typeof updateSub === "function") updateSub();
  });
}

/* ---------- Produktliste ---------- */
function renderProducts(view = $("colProd") || $("view")) {
  if (!products.length) {
    view.innerHTML = `<div class="empty"><div class="big">${ic("box")}</div>
      Noch keine Lebensmittel.<br>Tippe oben auf <b>+</b> und scanne den Barcode deines ersten Lebensmittels.</div>`;
    return;
  }
  const term = searchTerm.toLowerCase();
  let html = `<input class="search" id="search" placeholder="Lebensmittel suchen" value="${esc(searchTerm)}">`;
  let found = 0;
  for (const cat of CATEGORIES) {
    const items = products
      .filter(p => p.cat === cat.id && p.name.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name, "de"));
    if (!items.length) continue;
    found += items.length;
    html += `<div class="cat-title">${ic(cat.icon)} ${cat.name}</div><div class="list">`;
    for (const p of items) {
      const img = p.image
        ? `<img class="thumb" src="${esc(p.image)}" alt="" loading="lazy">`
        : `<div class="thumb fi-thumb">${foodSVG(foodIconKey(p), 1, 1)}</div>`;
      html += `<div class="item" data-id="${p.id}">
        ${img}
        <div class="item-main">
          <div class="item-name">${esc(p.name)}</div>
          <div class="macros">
            <span><i class="dot" style="background:var(--p)"></i><b>${r1(p.p)}</b> E</span>
            <span><i class="dot" style="background:var(--c)"></i><b>${r1(p.c)}</b> K</span>
            <span><i class="dot" style="background:var(--f)"></i><b>${r1(p.f)}</b> F</span>
          </div>
        </div>
        <div class="kcal">${Math.round(p.kcal)}<small>kcal/100 g</small></div>
      </div>`;
    }
    html += `</div>`;
  }
  if (!found) html += `<div class="empty">Nichts gefunden.</div>`;
  view.innerHTML = html;

  const s = $("search");
  s.oninput = () => { searchTerm = s.value; renderProducts(view); const n = $("search"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); };
  view.querySelectorAll(".item").forEach(el => el.onclick = () => openSheet(el.dataset.id));
}

/* ---------- Formular ---------- */
$("fCat").innerHTML = CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join("");

function setImage(url) {
  currentImage = url || "";
  if (typeof updateIcoRow === "function" && $("fIcoCur")) try { updateIcoRow(); } catch (e) {}
  $("preview").style.display = currentImage ? "flex" : "none";
  $("fImgPreview").src = currentImage;
}

function openSheet(id = null) {
  editingId = id;
  const p = products.find(x => x.id === id) || {};
  $("sheetTitle").textContent = id ? "Produkt bearbeiten" : "Neues Produkt";
  $("fName").value = p.name || "";
  $("fCat").value = p.cat || "sonstiges";
  $("fPack").value = p.pack || "";
  $("fKcal").value = p.kcal ?? "";
  $("fP").value = p.p ?? "";
  $("fC").value = p.c ?? "";
  $("fF").value = p.f ?? "";
  $("fBarcode").value = p.barcode || "";
  setImage(p.image);
  $("scanStatus").textContent = "";
  $("deleteBtn").style.display = id ? "block" : "none";
  currentIcon = p.icon || ""; currentTags = p.tags || [];
  updateIcoRow();
  $("productSheet").classList.add("open");
}

/* ---------- Symbol-Auswahl ---------- */
const draftProduct = () => ({ name: $("fName").value, cat: $("fCat").value, icon: currentIcon, tags: currentTags });
function updateIcoRow() {
  const k = foodIconKey(draftProduct());
  if (currentImage && !currentIcon && usePhotos()) {
    $("fIcoCur").innerHTML = `<img src="${esc(currentImage)}" alt="" style="max-width:44px;max-height:44px;object-fit:contain">`;
    $("fIcoName").textContent = "Produktfoto vom Scan";
    $("fIcoMode").textContent = "so steht es im Kühlschrank – tippen, um ein Symbol zu nehmen";
    return;
  }
  $("fIcoCur").innerHTML = foodSVG(k, 1, 1.5);
  $("fIcoName").textContent = (ICON_NAMES[k] || ["Packung"])[0];
  $("fIcoMode").textContent = currentIcon ? "selbst gewählt" : "automatisch erkannt – tippen zum Ändern";
}
$("fName").addEventListener("input", () => { if (!currentIcon) updateIcoRow(); });
$("fCat").addEventListener("change", () => { if (!currentIcon) updateIcoRow(); });
$("fIcoBtn").onclick = () => { $("icoSearch").value = ""; renderIcoGrid(); $("icoSheet").classList.add("open"); };
$("icoBack").onclick = () => $("icoSheet").classList.remove("open");
$("icoSheet").onclick = e => { if (e.target.id === "icoSheet") $("icoSheet").classList.remove("open"); };
$("icoAuto").onclick = () => { currentIcon = ""; updateIcoRow(); $("icoSheet").classList.remove("open"); };
$("icoAuto").innerHTML = "<b>Automatisch</b>";
$("icoSearch").oninput = renderIcoGrid;
function renderIcoGrid() {
  const term = normName($("icoSearch").value), cur = foodIconKey(draftProduct());
  const keys = Object.keys(ICON_NAMES).filter(k => FI[k] && (!term || normName(ICON_NAMES[k][0]).includes(term) || iconFromText(term) === k));
  $("icoGrid").innerHTML = ICON_GROUPS.map(([g, label]) => {
    const ks = keys.filter(k => ICON_NAMES[k][1] === g);
    return ks.length ? `<div class="cat-title">${label}</div><div class="ico-grid">${ks.map(k => `<button class="ico-opt${k === cur ? " on" : ""}" data-ico="${k}">${foodSVG(k, 1, 1.7)}<span>${ICON_NAMES[k][0]}</span></button>`).join("")}</div>` : "";
  }).join("") || `<div class="empty" style="padding:30px 10px">Kein passendes Symbol – nimm am besten „Packung“, „Tüte“ oder „Glas“ unter Sonstiges.</div>`;
  $("icoGrid").querySelectorAll("[data-ico]").forEach(b => b.onclick = () => { currentIcon = b.dataset.ico; updateIcoRow(); $("icoSheet").classList.remove("open"); });
}

function closeSheet() {
  const resume = resumeShopScan && $("shopSheet").classList.contains("open");
  resumeShopScan = false;
  returnToShop = false;
  lookupSeq++;
  $("productSheet").classList.remove("open");
  if (resume) setTimeout(startShopScan, 250);
}

$("addBtn").onclick = () => currentTab === "kuehlschrank" ? openShop() : (currentTab === "produkte" && libSeg === "mahlzeit") ? openMealEditor() : currentTab === "training" ? openStart() : openSheet();
$("cancelBtn").onclick = closeSheet;
$("productSheet").onclick = e => { if (e.target.id === "productSheet") closeSheet(); };

$("saveBtn").onclick = () => {
  const name = $("fName").value.trim();
  if (!name) { toast("Bitte einen Namen eingeben"); return; }
  const data = {
    name,
    cat: $("fCat").value,
    pack: num($("fPack").value),
    kcal: num($("fKcal").value),
    p: num($("fP").value),
    c: num($("fC").value),
    f: num($("fF").value),
    barcode: $("fBarcode").value.trim(),
    image: currentImage,
    icon: currentIcon || undefined,
    tags: currentTags.length ? currentTags.slice(-6) : undefined
  };
  if (editingId) {
    Object.assign(products.find(x => x.id === editingId), data);
  } else {
    if (data.barcode && products.some(x => sameCode(x.barcode, data.barcode))) {
      toast("Dieses Produkt hast du schon"); return;
    }
    const np = { id: Date.now().toString(36), ...data };
    products.push(np);
    if (returnToShop) cart[np.id] = (cart[np.id] || 0) + 1;
  }
  const backToShop = returnToShop;
  saveProducts();
  closeSheet();
  TABS[currentTab].render();
  if (backToShop) { renderShopList(); toast("Neu angelegt und im Wagen ✓"); }
  else toast("Gespeichert ✓");
};

$("deleteBtn").onclick = () => {
  if (!confirm("Produkt wirklich löschen?")) return;
  products = products.filter(x => x.id !== editingId);
  delete stock[editingId];
  saveProducts();
  saveStock();
  closeSheet();
  TABS[currentTab].render();
  toast("Gelöscht");
};

