/* ---------- Barcode-Scan & Open Food Facts ---------- */
const sameCode = (a, b) => !!a && !!b && (a === b || a === "0" + b || "0" + a === b);

function validBarcode(c) {
  if (!/^(\d{8}|\d{12}|\d{13})$/.test(c)) return false;
  const d = c.split("").map(Number), check = d.pop();
  let sum = 0;
  d.reverse().forEach((n, i) => { sum += n * (i % 2 === 0 ? 3 : 1); });
  return (10 - sum % 10) % 10 === check;
}

/* Erkennung: ZXing-C++ (WebAssembly) über die BarcodeDetector-Schnittstelle –
   deutlich treffsicherer bei Strichcodes als die alte JS-Erkennung.
   Klappt das Laden nicht, springt automatisch der alte Scanner ein. */
const SCAN_LIBS = ["barcode-detector@2.3.1", "barcode-detector@2.2.11", "barcode-detector@2.2.2"].map(v => `https://cdn.jsdelivr.net/npm/${v}/+esm`);
const SCAN_FORMATS = ["ean_13", "ean_8", "upc_a", "upc_e"];
const sleep = ms => new Promise(r => setTimeout(r, ms));
let detPromise = null;
function getDetector() {
  if (!detPromise) detPromise = (async () => {
    try {
      if ("BarcodeDetector" in window) {
        const sup = await window.BarcodeDetector.getSupportedFormats();
        if (SCAN_FORMATS.every(f => sup.includes(f))) return new window.BarcodeDetector({ formats: SCAN_FORMATS });
      }
    } catch (e) {}
    let BD = null;
    for (const url of SCAN_LIBS) {
      try { const m = await import(url); BD = m.BarcodeDetector || (m.default && m.default.BarcodeDetector); if (BD) break; } catch (e) {}
    }
    if (!BD) throw new Error("nolib");
    const det = new BD({ formats: SCAN_FORMATS });
    const c = document.createElement("canvas"); c.width = c.height = 16;
    await det.detect(c.getContext("2d").getImageData(0, 0, 16, 16));   // lädt die Erkennung vorab – schlägt das fehl, nimmt der Scanner den alten Weg
    return det;
  })().catch(e => { detPromise = null; throw e; });
  return detPromise;
}
/* im Leerlauf vorladen, damit der erste Scan sofort klappt */
setTimeout(() => { if (navigator.onLine !== false) getDetector().catch(() => {}); }, 2500);

/* Ein gemeinsamer Scanner. Die Kamera bleibt zwischen zwei Scans offen,
   damit das iPhone sie nicht jedes Mal neu freigeben muss. */
const Cam = {
  inst: null, queue: Promise.resolve(), mode: null, onCode: null, title: "",
  seen: {}, streak: {}, done: {}, idleTimer: null, savedCb: null,
  stream: null, video: null, det: null, loopOn: false, looping: false, n: 0, canvas: null, torch: false, zoomed: false,
  live() { return !!(this.stream && this.stream.getVideoTracks().some(t => t.readyState === "live")); },
  track() { return this.stream ? this.stream.getVideoTracks()[0] : null; },

  run(fn) { const p = this.queue.catch(() => {}).then(fn); this.queue = p; return p; },
  state() { try { return this.inst ? this.inst.getState() : 0; } catch (e) { return 0; } },
  isOpen() { return $("scanOverlay").classList.contains("open"); },

  open(mode, onCode, title) {
    clearTimeout(this.idleTimer);
    this.mode = mode; this.onCode = onCode; this.savedCb = onCode; this.title = title;
    this.seen = {}; this.streak = {}; this.done = {};
    $("camTitle").textContent = title;
    $("camManual").style.display = mode === "single" ? "" : "none";
    $("camRetry").style.display = "none";
    this.status(mode === "single"
      ? "Barcode in den Rahmen halten – ca. 20–30 cm Abstand. Wird es nicht scharf: etwas weiter weg oder „2×“."
      : "Scanne Produkt für Produkt. Für ein zweites gleiches Produkt kurz wegziehen und nochmal scannen.");
    $("scanOverlay").classList.add("open");
    return this.run(async () => {
      if (this.live()) { this.startLoop(); return; }   // Kamera läuft noch -> sofort weiter
      const st = this.state();
      if (st === 3) { this.inst.resume(); return; }   // pausiert -> sofort weiter
      if (st === 2) return;                             // läuft schon
      await this.hardStop();
      await this.boot();
    }).catch(err => this.fail(err));
  },

  async boot() {
    let det = null;
    try { this.status("Scanner wird geladen …"); det = await getDetector(); } catch (e) {}
    this.status(this.mode === "single"
      ? "Barcode in den Rahmen halten – ca. 20–30 cm Abstand. Wird es nicht scharf: etwas weiter weg oder „2×“."
      : "Scanne Produkt für Produkt. Für ein zweites gleiches Produkt kurz wegziehen und nochmal scannen.");
    if (!det) return this.bootLegacy();
    this.det = det;
    const tries = [
      { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      { facingMode: { ideal: "environment" } },
      true
    ];
    let stream = null, lastErr;
    for (const v of tries) {
      try { stream = await navigator.mediaDevices.getUserMedia({ video: v, audio: false }); break; }
      catch (e) { lastErr = e; if (/NotAllowed|Permission|denied/i.test(String(e && (e.name || e)))) break; }
    }
    if (!stream) throw lastErr || new Error("nocam");
    this.stream = stream;
    if (!this.video) {
      const v = document.createElement("video");
      v.muted = true; v.playsInline = true; v.autoplay = true;
      v.setAttribute("playsinline", ""); v.setAttribute("muted", ""); v.setAttribute("autoplay", "");
      this.video = v;
    }
    const box = document.createElement("div"); box.className = "cam-box";
    box.innerHTML = `<div class="cam-aim" id="camAim"></div><div class="cam-tools"><button id="camZoom" hidden>2×</button><button id="camTorch" hidden aria-label="Licht">${ic("bolt")}</button></div>`;
    box.prepend(this.video);
    $("camReader").innerHTML = ""; $("camReader").append(box);
    this.video.srcObject = stream;
    await this.video.play().catch(() => {});
    await new Promise(r => { if (this.video.videoWidth) r(); else { this.video.onloadedmetadata = () => r(); setTimeout(r, 1500); } });
    this.placeAim();
    await this.tune();
    this.startLoop();
  },
  /* Rahmen = Bereich, der zuerst ausgewertet wird */
  roi(W, H) { const sw = W * 0.92, sh = Math.min(H * 0.6, sw * 0.62); return [(W - sw) / 2, (H - sh) / 2, sw, sh]; },
  placeAim() {
    const v = this.video, a = $("camAim"); if (!a || !v.videoWidth) return;
    const [, , sw, sh] = this.roi(v.videoWidth, v.videoHeight);
    a.style.width = (sw / v.videoWidth * 100) + "%"; a.style.height = (sh / v.videoHeight * 100) + "%";
  },
  async tune() {
    const t = this.track(); if (!t) return;
    let caps = {}; try { caps = t.getCapabilities ? t.getCapabilities() : {}; } catch (e) {}
    try { if (caps.focusMode && caps.focusMode.includes("continuous")) await t.applyConstraints({ advanced: [{ focusMode: "continuous" }] }); } catch (e) {}
    const zb = $("camZoom"), tb = $("camTorch");
    if (caps.zoom && caps.zoom.max >= 1.8) {
      zb.hidden = false;
      const setZoom = async on => { this.zoomed = on; zb.classList.toggle("on", on); zb.textContent = on ? "1×" : "2×"; try { await t.applyConstraints({ advanced: [{ zoom: on ? Math.min(2, caps.zoom.max) : Math.max(1, caps.zoom.min || 1) }] }); } catch (e) {} };
      zb.onclick = () => setZoom(!this.zoomed);
      if (this.zoomed) setZoom(true);
    }
    if (caps.torch) {
      tb.hidden = false;
      tb.onclick = async () => { this.torch = !this.torch; tb.classList.toggle("on", this.torch); try { await t.applyConstraints({ advanced: [{ torch: this.torch }] }); } catch (e) {} };
    }
  },
  startLoop() { this.loopOn = true; if (!this.looping) this.loop(); },
  async loop() {
    this.looping = true;
    try {
      while (this.loopOn && this.live()) {
        const v = this.video;
        if (!(v.readyState >= 2 && v.videoWidth)) { await sleep(80); continue; }
        const t0 = performance.now();
        let code = null;
        try { code = await this.scanFrame(v); } catch (e) {}
        if (code && this.loopOn) this.hit(code);
        await sleep(Math.max(25, 70 - (performance.now() - t0)));
      }
    } finally { this.looping = false; }
  },
  /* abwechselnd: Rahmen in voller Auflösung, Rahmen verkleinert, ganzes Bild */
  async scanFrame(v) {
    const W = v.videoWidth, H = v.videoHeight, k = this.n++ % 3;
    let [sx, sy, sw, sh] = k === 2 ? [0, 0, W, H] : this.roi(W, H);
    const max = k === 0 ? 1600 : 900, sc = Math.min(1, max / Math.max(sw, sh));
    const c = this.canvas || (this.canvas = document.createElement("canvas"));
    c.width = Math.round(sw * sc); c.height = Math.round(sh * sc);
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(v, sx, sy, sw, sh, 0, 0, c.width, c.height);
    const res = await this.det.detect(g.getImageData(0, 0, c.width, c.height));
    for (const r of res || []) { const code = String(r.rawValue || "").trim(); if (validBarcode(code) || (r.format === "upc_e" && /^\d{6,8}$/.test(code))) return code; }
    return null;
  },

  async bootLegacy() {
    if (typeof Html5Qrcode === "undefined") throw new Error("nolib");
    const formats = [
      Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.UPC_A, Html5QrcodeSupportedFormats.UPC_E
    ];
    const base = {
      fps: 12, disableFlip: true,
      qrbox: (w, h) => ({ width: Math.max(150, Math.floor(w * 0.84)), height: Math.max(90, Math.floor(Math.min(w, h) * 0.42)) })
    };
    const attempts = [
      { ...base, videoConstraints: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } },
      base
    ];
    let lastErr;
    for (const cfg of attempts) {
      const inst = new Html5Qrcode("camReader", { formatsToSupport: formats, verbose: false, experimentalFeatures: { useBarCodeDetectorIfSupported: true } });
      try {
        await inst.start({ facingMode: "environment" }, cfg, code => this.hit(code), () => {});
        this.inst = inst;
        /* Neuere iPhones fokussieren nah schlecht – leichter Zoom hilft */
        try {
          const caps = inst.getRunningTrackCapabilities();
          if (caps && caps.zoom && caps.zoom.max >= 1.4) await inst.applyVideoConstraints({ advanced: [{ zoom: 1.4 }] });
          if (caps && caps.focusMode && caps.focusMode.includes("continuous")) await inst.applyVideoConstraints({ advanced: [{ focusMode: "continuous" }] });
        } catch (e) {}
        return;
      } catch (e) {
        lastErr = e;
        try { inst.clear(); } catch (_) {}
        if (/NotAllowed|Permission|denied/i.test(String(e))) break;
      }
    }
    throw lastErr;
  },

  hit(code) {
    if (!this.onCode) return;
    code = String(code).trim();
    if (!validBarcode(code)) return;
    /* Die Prüfziffer sichert den Code ab – ein Treffer reicht.
       Dasselbe Produkt zählt erst wieder, wenn es kurz aus dem Bild war. */
    const now = Date.now(), prev = this.seen[code] || 0;
    this.seen[code] = now;
    if (this.done[code] && now - prev < 1500) return;
    this.done[code] = true;
    this.flash();
    const cb = this.onCode;
    if (this.mode === "single") this.close();
    cb(code);
  },

  close() {
    $("scanOverlay").classList.remove("open");
    this.onCode = null;
    this.loopOn = false;
    this.run(async () => { if (this.state() === 2) { try { this.inst.pause(true); } catch (e) {} } });
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this.run(() => this.hardStop()), 25000);   // nach 25 s Kamera ganz aus
  },

  async hardStop() {
    this.loopOn = false;
    if (this.stream) { this.stream.getTracks().forEach(t => { try { t.stop(); } catch (e) {} }); this.stream = null; this.torch = false; }
    if (this.video) { try { this.video.srcObject = null; } catch (e) {} }
    const inst = this.inst; this.inst = null;
    if (!inst) return;
    try { const st = inst.getState(); if (st === 2 || st === 3) await inst.stop(); } catch (e) {}
    try { inst.clear(); } catch (e) {}
  },

  fail(err) {
    const msg = String(err && (err.message || err) || "");
    const perm = /NotAllowed|Permission|denied/i.test(msg);
    this.status(msg === "nolib"
      ? "Scanner nicht geladen – prüf dein Internet und öffne die App neu."
      : perm
        ? "Kein Kamerazugriff. Tippe auf „Nochmal versuchen“ und dann auf „Erlauben“. Kommt keine Frage: Einstellungen › Apps › Safari › Kamera › Fragen."
        : "Die Kamera startet gerade nicht. Tippe auf „Nochmal versuchen“ – sonst die App einmal ganz schließen.", "bad");
    $("camRetry").style.display = "";
  },

  status(text, cls = "") { const el = $("camStatus"); el.textContent = text; el.className = "scan-status " + cls; },
  flash() { const w = $("camWrap"); w.classList.add("hit"); setTimeout(() => w.classList.remove("hit"), 350); }
};

$("camDone").onclick = () => { Cam.close(); if (Cam.mode === "multi") renderShopList(); };
$("camRetry").onclick = () => { const cb = Cam.savedCb; Cam.run(() => Cam.hardStop()); Cam.open(Cam.mode, cb, Cam.title); };
/* Plan B: Foto vom Barcode – das iPhone stellt dabei richtig scharf */
const BAR_FORMATS = () => [Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8, Html5QrcodeSupportedFormats.UPC_A, Html5QrcodeSupportedFormats.UPC_E];
function shrinkImage(file, max) {
  return new Promise(res => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob(b => res(b ? new File([b], "barcode.jpg", { type: "image/jpeg" }) : file), "image/jpeg", .92);
    };
    img.onerror = () => { URL.revokeObjectURL(url); res(file); };
    img.src = url;
  });
}
async function decodePhoto(file) {
  let det = null; try { det = await getDetector(); } catch (e) {}
  if (det) {
    try {
      const bmp = await createImageBitmap(file);
      for (const size of [1600, 2600, 1000]) {
        const k = Math.min(1, size / Math.max(bmp.width, bmp.height)), c = document.createElement("canvas");
        c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
        const g = c.getContext("2d"); g.drawImage(bmp, 0, 0, c.width, c.height);
        const res = await det.detect(g.getImageData(0, 0, c.width, c.height));
        const hit = (res || []).map(r => String(r.rawValue || "").trim()).find(validBarcode);
        if (hit) return hit;
      }
    } catch (e) {}
  }
  if (typeof Html5Qrcode === "undefined") return null;
  for (const size of [1600, 1000, 2400]) {
    const f = await shrinkImage(file, size), r = new Html5Qrcode("camFileReader", { formatsToSupport: BAR_FORMATS(), verbose: false });
    try { const c = String(await r.scanFile(f, false)).trim(); if (validBarcode(c)) return c; } catch (e) {} finally { try { r.clear(); } catch (e) {} }
  }
  return null;
}
$("camPhoto").onclick = () => { $("camFile").value = ""; $("camFile").click(); };
$("camFile").onchange = async () => {
  const file = $("camFile").files[0], cb = Cam.savedCb, mode = Cam.mode, title = Cam.title;
  if (!file || !cb) return;
  if (!Cam.isOpen()) $("scanOverlay").classList.add("open");
  Cam.status("Foto wird gelesen …");
  const code = await decodePhoto(file);
  if (!code) { Cam.status("Im Foto wurde kein Barcode erkannt. Fotografiere ihn groß, gerade und scharf – oder tippe die Nummer ein.", "bad"); return; }
  Cam.flash();
  if (mode === "single") { Cam.close(); cb(code); }
  else { cb(code); Cam.open(mode, cb, title); }
};
$("camManual").onclick = () => { Cam.close(); setTimeout(() => $("fBarcode").focus(), 100); };
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) return;
  if (Cam.isOpen()) Cam.close();
  clearTimeout(Cam.idleTimer);
  Cam.run(() => Cam.hardStop());
});

$("scanBtn").onclick = () => Cam.open("single", code => { $("fBarcode").value = code; lookup(code); }, "Produkt scannen");
$("lookupBtn").onclick = () => lookup($("fBarcode").value.trim());

let lookupSeq = 0;
async function fetchOFF(code, fields) {
  const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=${fields}`, { signal: ctrl.signal });
    return await res.json();
  } finally { clearTimeout(t); }
}

async function lookup(code) {
  if (!code) { toast("Bitte Barcode eingeben"); return; }
  const my = ++lookupSeq;
  const known = products.find(x => sameCode(x.barcode, code) && x.id !== editingId);
  if (known) { $("scanStatus").textContent = `Hast du schon gespeichert: ${known.name}`; return; }
  if (!navigator.onLine) { $("scanStatus").textContent = "Offline – trag die Nährwerte selbst ein oder scanne später nochmal."; return; }
  $("scanStatus").textContent = "Suche Produkt …";
  try {
    const fields = "product_name,product_name_de,brands,image_front_small_url,image_front_url,nutriments,product_quantity,quantity,categories_tags";
    let data = await fetchOFF(code, fields);
    if ((data.status !== 1 || !data.product) && code.length === 12) data = await fetchOFF("0" + code, fields);
    if (my !== lookupSeq) return;   // Fenster inzwischen zu oder neuer Scan
    if (data.status !== 1 || !data.product) {
      $("scanStatus").textContent = "Nicht gefunden. Trag die Nährwerte bitte selbst ein.";
      return;
    }
    const p = data.product, n = p.nutriments || {};
    const name = p.product_name_de || p.product_name || "";
    const brand = (p.brands || "").split(",")[0].trim();
    $("fName").value = brand && name && !name.toLowerCase().includes(brand.toLowerCase()) ? `${name} (${brand})` : (name || brand);
    const kcal = n["energy-kcal_100g"] ?? (n["energy_100g"] ? n["energy_100g"] / 4.184 : "");
    $("fKcal").value = kcal !== "" ? Math.round(kcal) : "";
    $("fP").value = n["proteins_100g"] != null ? r1(n["proteins_100g"]) : "";
    $("fC").value = n["carbohydrates_100g"] != null ? r1(n["carbohydrates_100g"]) : "";
    $("fF").value = n["fat_100g"] != null ? r1(n["fat_100g"]) : "";
    if (p.product_quantity) $("fPack").value = Math.round(num(p.product_quantity));
    $("fCat").value = guessCategory(p.categories_tags || [], name);
    currentTags = (p.categories_tags || []).slice(-6);
    updateIcoRow();
    setImage(p.image_front_small_url || p.image_front_url || "");
    const missing = [$("fKcal"), $("fP"), $("fC"), $("fF")].some(i => i.value === "");
    $("scanStatus").textContent = missing
      ? "Gefunden ✓ – einige Werte fehlen, bitte ergänzen."
      : "Gefunden ✓ – prüf kurz die Werte und tippe auf Sichern.";
  } catch (e) {
    if (my !== lookupSeq) return;
    $("scanStatus").textContent = "Keine Verbindung. Tippe nochmal auf „Suchen“ oder trag die Werte selbst ein.";
  }
}

function guessCategory(tags, name) {
  const t = (tags.join(" ") + " " + name).toLowerCase();
  const has = (...w) => w.some(x => t.includes(x));
  if (has("frozen", "tiefkühl", "tiefgekühlt", "surgel")) return "tiefkuehl";
  if (has("chocolate", "schokolade", "sweets", "süßwaren", "candy", "gummi", "biscuit", "kekse", "confectioner", "snacks-sucres")) return "suess";
  if (has("meat", "fleisch", "fish", "fisch", "hack", "chicken", "hähnchen", "pute", "lachs", "thunfisch", "wurst", "sausage", "seafood")) return "fleisch";
  if (has("dairy", "milch", "quark", "joghurt", "yogurt", "käse", "cheese", "skyr", "sahne", "butter", "eggs", "eier")) return "milch";
  if (has("fruit", "obst", "banane", "apfel", "beere", "berries", "orange")) return "obst";
  if (has("vegetable", "gemüse", "paprika", "tomate", "gurke", "salat", "zwiebel", "möhre", "karotte")) return "gemuese";
  if (has("pasta", "nudel", "rice", "reis", "kartoffel", "potato", "bread", "brot", "haferflocken", "oats", "cereal")) return "kohlenhydrate";
  if (has("vegetable-oils", "olive-oil", "oils", "öl ", "olivenöl", "rapsöl", "sonnenblumenöl")) return "oel";
  if (has("flour", "mehl", "sugar", "zucker", "baking", "backpulver", "hefe", "vanill")) return "backen";
  if (has("spice", "gewürz", "salz", "salt", "pfeffer", "pepper", "herbs", "kräuter", "paprikapulver")) return "gewuerze";
  return "sonstiges";
}

