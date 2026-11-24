/* ---------- Produktfotos im Kühlschrank: freigestellt, gespeichert in IndexedDB ---------- */
const IMGDB = (() => {
  let dbp;
  const open = () => dbp || (dbp = new Promise((res, rej) => { const r = indexedDB.open("makro-img", 1); r.onupgradeneeded = () => r.result.createObjectStore("cut"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  return {
    get: k => open().then(db => new Promise(res => { const t = db.transaction("cut").objectStore("cut").get(k); t.onsuccess = () => res(t.result || null); t.onerror = () => res(null); })).catch(() => null),
    set: (k, v) => open().then(db => new Promise(res => { const t = db.transaction("cut", "readwrite"); t.objectStore("cut").put(v, k); t.oncomplete = res; t.onerror = res; })).catch(() => {})
  };
})();
const CUT = new Map();          // Bild-URL -> { src, cut } | "busy"
const usePhotos = () => profile.fridgePhotos !== false;
function loadImg(url, cors) {
  return new Promise((res, rej) => { const im = new Image(); if (cors) im.crossOrigin = "anonymous"; im.onload = () => res(im); im.onerror = rej; im.src = url; });
}
/* Hintergrund vom Rand her wegnehmen (heller/einfarbiger Hintergrund), dann auf das Produkt zuschneiden */
function cutout(im) {
  const H = Math.min(260, im.naturalHeight || im.height), k = H / (im.naturalHeight || im.height), W = Math.max(1, Math.round((im.naturalWidth || im.width) * k));
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0, W, H);
  const id = g.getImageData(0, 0, W, H), d = id.data, N = W * H;
  const border = []; for (let x = 0; x < W; x++) border.push(x, (H - 1) * W + x); for (let y = 0; y < H; y++) border.push(y * W, y * W + W - 1);
  let br = 0, bg = 0, bb = 0; border.forEach(i => { br += d[i * 4]; bg += d[i * 4 + 1]; bb += d[i * 4 + 2]; }); br /= border.length; bg /= border.length; bb /= border.length;
  const dist = (i, r, gg, b) => Math.abs(d[i * 4] - r) + Math.abs(d[i * 4 + 1] - gg) + Math.abs(d[i * 4 + 2] - b);
  const mark = new Uint8Array(N), q = new Int32Array(N); let qh = 0, qt = 0;
  for (const i of border) if (!mark[i] && dist(i, br, bg, bb) < 60) { mark[i] = 1; q[qt++] = i; }
  while (qh < qt) {
    const i = q[qh++], x = i % W, y = (i - x) / W;
    for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
      if (j < 0 || mark[j]) continue;
      if (dist(j, d[i * 4], d[i * 4 + 1], d[i * 4 + 2]) < 16 && dist(j, br, bg, bb) < 60) { mark[j] = 1; q[qt++] = j; }
    }
  }
  const frac = qt / N;
  if (frac < .06 || frac > .9) return null;                 // kein klarer Hintergrund -> Foto so lassen
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let i = 0; i < N; i++) {
    if (mark[i]) { d[i * 4 + 3] = 0; continue; }
    const x = i % W, y = (i - x) / W;
    if ((x > 0 && mark[i - 1]) || (x < W - 1 && mark[i + 1]) || (y > 0 && mark[i - W]) || (y < H - 1 && mark[i + W])) d[i * 4 + 3] = 150;   // weiche Kante
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  if (x1 - x0 < 8 || y1 - y0 < 8) return null;
  g.putImageData(id, 0, 0);
  const o = document.createElement("canvas"); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1;
  o.getContext("2d").drawImage(c, x0, y0, o.width, o.height, 0, 0, o.width, o.height);
  return o.toDataURL("image/png");
}
async function prepCutout(url) {
  if (!url || CUT.has(url)) return;
  CUT.set(url, "busy");
  let v = await IMGDB.get("v2|" + url);
  if (!v) {
    try { const im = await loadImg(url, true); const src = cutout(im); v = src ? { src, cut: true } : { src: url, cut: false }; }
    catch (e) { v = { src: url, cut: false, nocors: true }; }
    if (!v.nocors) IMGDB.set("v2|" + url, v);
  }
  CUT.set(url, v);
  document.querySelectorAll(`[data-cut="${CSS.escape(url)}"]`).forEach(el => { if (el.tagName.toLowerCase() === "image") el.setAttribute("href", v.src); else { el.src = v.src; el.classList.toggle("cut", !!v.cut); el.classList.toggle("raw", !v.cut); } });
}
function photoHTML(p, copies, unit) {
  const it = FI[foodIconKey({ ...p, image: "" })] || FI.boxGeneric;
  const n = Math.max(1, Math.min(3, copies)), h = Math.round(Math.max(22, it.h * unit * 1.05));
  const v = CUT.get(p.image); if (!v) prepCutout(p.image);
  const src = v && v !== "busy" ? v.src : p.image, cls = v && v !== "busy" ? (v.cut ? "cut" : "raw") : "raw";
  const img = (i) => `<img class="pimg ${cls}${i ? " back" : ""}" data-cut="${esc(p.image)}" src="${esc(src)}" alt="" style="height:${h}px${i ? `;--i:${i}` : ""}" loading="lazy" decoding="async">`;
  let g = ""; for (let i = n - 1; i >= 0; i--) g += img(i);
  return `<span class="pstack" style="height:${h}px;margin-right:${Math.round((n - 1) * h * it.w / it.h * .34)}px">${g}</span>`;
}

/* ================= Kühlschrank als 3D-Szene =================
   Ein SVG pro Einheit: Rückwand, schräge Seitenwände, Glasböden mit Kante,
   Produkte in zwei Tiefenreihen (hinten kleiner und etwas dunkler, vorne groß),
   flache Sachen werden gestapelt, Flaschen stehen nebeneinander, weiche Kontaktschatten. */
const SC = { U: 1.02, BACK: .84 };
const isStackable = it => it.h < it.w * .85;
function pieceList(list, cap = 4, noStack = false) {
  const out = [];
  for (const p of list) {
    const { full, partial } = packageInfo(p), total = Math.max(1, full + (partial ? 1 : 0));
    const key = foodIconKey(p), it = FI[key] || FI.boxGeneric, photo = p.image && !p.icon && usePhotos();
    if (photo && !CUT.get(p.image)) prepCutout(p.image);
    const d = daysLeft(p.id), ex = d === null ? "" : d <= 0 ? "bad" : d <= 2 ? "soon" : "";
    if (isStackable(it) && !noStack) {
      const stacks = Math.min(2, Math.ceil(total / 3));
      let left = total;
      for (let s = 0; s < stacks; s++) { const n = Math.min(3, left); left -= n; out.push({ p, key, it, n, w: it.w, h: it.h * (1 + (n - 1) * .9), total, shownAll: total <= 6, first: s === 0, photo, ex, partial: !!partial && !full }); }
    } else {
      const n = Math.min(cap, total);
      for (let i = 0; i < n; i++) out.push({ p, key, it, n: 1, w: it.w * (i ? .78 : 1), h: it.h, total, shownAll: total <= cap, first: i === 0, photo, ex, partial: !!partial && !full, follow: i > 0 });
    }
  }
  return out;
}
/* ein Teil (Stapel oder einzelne Packung) an Position x (links), Grundlinie y, Maßstab s */
function pieceSVG(pc, x, y, s) {
  const { it, p } = pc, w = it.w * s, cx = x + (pc.follow ? -it.w * .22 * s : 0) + w / 2;
  let g = `<ellipse cx="${r1(cx + 1)}" cy="${r1(y + .6)}" rx="${r1(w * .56 + 1)}" ry="${r1(2.2 + s)}" fill="url(#scSh)"/>`;
  for (let i = 0; i < pc.n; i++) {
    const yy = y - i * it.h * .9 * s;
    if (pc.photo) {
      const v = CUT.get(p.image), src = v && v !== "busy" ? v.src : p.image;
      g += `<image class="pimg" data-cut="${esc(p.image)}" href="${esc(src)}" x="${r1(cx - w * .62)}" y="${r1(yy - it.h * s * 1.05)}" width="${r1(w * 1.24)}" height="${r1(it.h * s * 1.05)}" preserveAspectRatio="xMidYMax meet"${pc.partial ? ` opacity=".75"` : ""}/>`;
    } else g += `<g transform="translate(${r1(cx)} ${r1(yy)}) scale(${s})"${pc.partial ? ` opacity=".75"` : ""}>${it.svg}</g>`;
    if (i < pc.n - 1) g += `<ellipse cx="${r1(cx)}" cy="${r1(yy - it.h * .9 * s + .4)}" rx="${r1(w * .46)}" ry="1.3" fill="#000" opacity=".12"/>`;
  }
  const topY = y - pc.h * s;
  if (pc.first && pc.ex) g += `<circle cx="${r1(x + 2)}" cy="${r1(topY + 3)}" r="3" fill="${pc.ex === "bad" ? "#d9534f" : "#e6a23c"}" stroke="#fff" stroke-width="1.2"/>`;
  if (pc.first && pc.total > 1 && !pc.shownAll) g += `<g transform="translate(${r1(x + w - 2)} ${r1(y - 5)})"><rect x="-6" y="-5" width="13" height="9" rx="4.5" fill="#1f2937"/><text x=".5" y="1.9" font-size="6.4" font-weight="700" fill="#fff" text-anchor="middle" font-family="-apple-system,Helvetica,Arial">${pc.total}×</text></g>`;
  return g;
}
/* Teile auf Böden verteilen: hohe nach hinten, kleine nach vorne; passt alles vorne hin, bleibt hinten frei */
function layoutShelves(pieces, backW, frontW, sF, sB, gap = 1.2) {
  const sorted = [...pieces].sort((a, b) => (b.h - a.h) || String(a.p.id).localeCompare(String(b.p.id)) || (a.follow ? 1 : -1));
  const shelves = []; let i = 0;
  const width = (arr, s) => arr.reduce((a, pc) => a + pc.w * s + gap, 0);
  while (i < sorted.length) {
    const back = [], front = []; let bw = 0, fw = 0;
    while (i < sorted.length && bw + sorted[i].w * sB + gap <= backW) { back.push(sorted[i]); bw += sorted[i].w * sB + gap; i++; }
    while (i < sorted.length && fw + sorted[i].w * sF + gap <= frontW) { front.push(sorted[i]); fw += sorted[i].w * sF + gap; i++; }
    if (!back.length && !front.length) { front.push(sorted[i]); i++; }
    if (width(back, sF) + width(front, sF) <= frontW) { shelves.push({ back: [], front: [...back, ...front].sort((a, b) => String(a.p.name).localeCompare(String(b.p.name), "de")) }); continue; }
    shelves.push({ back: back.sort((a, b) => String(a.p.name).localeCompare(String(b.p.name), "de")), front: front.sort((a, b) => String(a.p.name).localeCompare(String(b.p.name), "de")) });
  }
  return shelves;
}
function rowSVG(arr, x0, x1, y, s, gap = 1.2) {
  const total = arr.reduce((a, pc) => a + pc.w * s + gap, 0) - gap, free = Math.max(0, (x1 - x0) - total);
  let x = x0 + Math.min(free * .5, 6), g = "";
  for (const pc of arr) { g += `<g class="group fgrp" data-id="${pc.p.id}"><title>${esc(pc.p.name)}</title>${pieceSVG(pc, x, y, s)}</g>`; x += pc.w * s + gap; }
  return g;
}
const SCENE_DEFS = `<defs>
<radialGradient id="scSh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1d2a38" stop-opacity=".34"/><stop offset=".6" stop-color="#1d2a38" stop-opacity=".12"/><stop offset="1" stop-color="#1d2a38" stop-opacity="0"/></radialGradient>
<linearGradient id="scBack" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f7fbff"/><stop offset=".5" stop-color="#e9f0f6"/><stop offset="1" stop-color="#dbe5ee"/></linearGradient>
<linearGradient id="scWallL" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#c9d6e2"/><stop offset="1" stop-color="#e4ecf3"/></linearGradient>
<linearGradient id="scWallR" x1="1" x2="0" y1="0" y2="0"><stop offset="0" stop-color="#bfcddb"/><stop offset="1" stop-color="#e0e9f1"/></linearGradient>
<linearGradient id="scGlass" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d9ebf7" stop-opacity=".55"/><stop offset="1" stop-color="#b9d6ea" stop-opacity=".75"/></linearGradient>
<linearGradient id="scEdge" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f4fbff"/><stop offset=".5" stop-color="#a9c9df"/><stop offset="1" stop-color="#7fa6c2"/></linearGradient>
<linearGradient id="scUnder" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a4560" stop-opacity=".16"/><stop offset="1" stop-color="#2a4560" stop-opacity="0"/></linearGradient>
<linearGradient id="scDeep" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#16283a" stop-opacity="0"/><stop offset=".7" stop-color="#16283a" stop-opacity=".07"/><stop offset="1" stop-color="#16283a" stop-opacity=".12"/></linearGradient>
<radialGradient id="scLamp" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="#fffdf2" stop-opacity=".95"/><stop offset=".5" stop-color="#fffdf2" stop-opacity=".25"/><stop offset="1" stop-color="#fffdf2" stop-opacity="0"/></radialGradient>
<linearGradient id="scWood" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#d9b57f"/><stop offset=".5" stop-color="#e6c592"/><stop offset="1" stop-color="#d4ad74"/></linearGradient>
<linearGradient id="scBoardTop" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#b98550"/><stop offset="1" stop-color="#d2a06a"/></linearGradient>
<linearGradient id="scBoardFront" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c48d55"/><stop offset="1" stop-color="#8f5e2e"/></linearGradient>
<linearGradient id="scBinFront" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".62"/><stop offset=".25" stop-color="#e9f2f9" stop-opacity=".42"/><stop offset="1" stop-color="#c9dcea" stop-opacity=".6"/></linearGradient>
<linearGradient id="scIceFront" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f4fbff" stop-opacity=".7"/><stop offset="1" stop-color="#bcd9ef" stop-opacity=".72"/></linearGradient>
<pattern id="scFrost" width="7" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".55" fill="#fff" opacity=".85"/><circle cx="5" cy="4.2" r=".4" fill="#fff" opacity=".7"/></pattern>
</defs>`;

/* Hauptfach mit Glasböden */
function fridgeShelvesSVG(groups, W = 240) {
  const sF = SC.U, sB = SC.U * SC.BACK, inset = 13, DEPTH = 11;
  let y = 8, body = "";
  const shelvesAll = [];
  for (const list of groups) { const sh = layoutShelves(pieceList(list), W - 2 * inset - 10, W - 14, sF, sB); shelvesAll.push(...sh); }
  while (shelvesAll.length < 3) shelvesAll.push({ back: [], front: [] });
  for (const sh of shelvesAll) {
    const hb = Math.max(0, ...sh.back.map(pc => pc.h * sB)), hf = Math.max(0, ...sh.front.map(pc => pc.h * sF));
    const yb = y + Math.max(26, hb + 6, hf - DEPTH + 6), yf = yb + DEPTH;
    /* Schatten des Bodens darüber auf der Rückwand */
    body += `<rect x="${inset}" y="${r1(y)}" width="${W - 2 * inset}" height="10" fill="url(#scUnder)"/>`;
    /* Glasboden: Oberseite (perspektivisch), Kante vorne */
    body += `<path d="M${inset} ${r1(yb + 1.5)}H${W - inset}L${W - 2} ${r1(yf + 2)}H2Z" fill="url(#scGlass)"/>`;
    body += rowSVG(sh.back, inset + 4, W - inset - 4, yb + 1.2, sB);
    if (sh.back.length) body += `<path d="M${inset} ${r1(yb - hb - 2)}H${W - inset}V${r1(yb + 1.6)}H${inset}Z" fill="url(#scDeep)" pointer-events="none"/>`;
    body += rowSVG(sh.front, 6, W - 6, yf + .8, sF);
    body += `<rect x="1" y="${r1(yf + 2)}" width="${W - 2}" height="3.2" rx="1" fill="url(#scEdge)"/><path d="M2 ${r1(yf + 2.3)}H${W - 2}" stroke="#fff" stroke-width=".7" opacity=".9"/>`;
    y = yf + 9;
  }
  const H = y + 2;
  const walls = `<rect width="${W}" height="${H}" fill="url(#scBack)"/><path d="M0 0L${inset} 6V${H}H0Z" fill="url(#scWallL)"/><path d="M${W} 0L${W - inset} 6V${H}H${W}Z" fill="url(#scWallR)"/>` +
    `<rect x="${W * .3}" y="0" width="${W * .4}" height="2.4" rx="1.2" fill="#fffef6"/><rect width="${W}" height="${Math.min(120, H * .5)}" fill="url(#scLamp)"/>`;
  return `<svg class="scene" viewBox="0 0 ${W} ${r1(H)}" preserveAspectRatio="xMidYMin meet">${SCENE_DEFS}${walls}${body}</svg>`;
}
/* Schublade (Gemüse/Obst) oder Gefrierfach: Kiste mit Glasfront, Sachen dicht in zwei Reihen */
function binSVG(list, W, ice) {
  const s = ice ? SC.U * .95 : SC.U * .92, sB = s * .86, pieces = pieceList(list, 3, !ice);
  const sh = layoutShelves(pieces, W - 14, W - 8, s, sB, .4);
  const layers = sh.length ? sh : [{ back: [], front: [] }];
  const heights = layers.map(l => Math.max(14, ...l.back.map(pc => pc.h * sB + 4), ...l.front.map(pc => pc.h * s - 6)));
  const H = Math.max(ice ? 64 : 58, heights.reduce((a, b) => a + b * .62, 0) + 26);
  const bases = []; let base = H - 9;
  layers.forEach((l, k) => { bases.push(base); base -= heights[k] * .62; });
  let inner = "";
  for (let k = layers.length - 1; k >= 0; k--) {          /* hintere Lagen zuerst malen */
    const l = layers[k], yf = bases[k], yb = yf - 8;
    inner += rowSVG(l.back, 7, W - 7, yb, sB, .4) + (l.back.length ? `<rect x="3" y="${r1(yb - 30)}" width="${W - 6}" height="31" fill="url(#scDeep)" pointer-events="none"/>` : "") + rowSVG(l.front, 4, W - 4, yf, s, .4);
  }
  const back = ice ? "#dceefa" : "#f1f6fa";
  return `<svg class="scene" viewBox="0 0 ${W} ${r1(H)}" preserveAspectRatio="xMidYMin meet">${SCENE_DEFS}
    <rect x="1" y="1" width="${W - 2}" height="${r1(H - 2)}" rx="7" fill="${back}" stroke="${ice ? "#a9cbe6" : "#c4d4e2"}" stroke-width="1.6"/>
    <path d="M4 ${r1(H - 18)}H${W - 4}L${W - 2} ${r1(H - 4)}H2Z" fill="${ice ? "#cfe6f6" : "#e3ecf3"}"/>
    ${ice ? `<rect x="3" y="3" width="${W - 6}" height="${r1(H - 6)}" rx="6" fill="url(#scFrost)" opacity=".5"/>` : ""}
    ${inner}
    <path d="M1.5 ${r1(H - 20)}H${W - 1.5}V${r1(H - 7)}Q${W - 1.5} ${r1(H - 1.5)} ${W - 8} ${r1(H - 1.5)}H8Q1.5 ${r1(H - 1.5)} 1.5 ${r1(H - 7)}Z" fill="url(#${ice ? "scIceFront" : "scBinFront"})" pointer-events="none"/>
    ${ice ? `<path d="M1.5 ${r1(H - 20)}H${W - 1.5}V${r1(H - 7)}Q${W - 1.5} ${r1(H - 1.5)} ${W - 8} ${r1(H - 1.5)}H8Q1.5 ${r1(H - 1.5)} 1.5 ${r1(H - 7)}Z" fill="url(#scFrost)" opacity=".6" pointer-events="none"/>` : ""}
    <path d="M2 ${r1(H - 20)}H${W - 2}" stroke="#fff" stroke-width="1" opacity=".95"/>
    <rect x="${r1(W * .34)}" y="${r1(H - 10)}" width="${r1(W * .32)}" height="3.4" rx="1.7" fill="#8fa6bb"/><rect x="${r1(W * .34)}" y="${r1(H - 10)}" width="${r1(W * .32)}" height="1.2" rx=".6" fill="#fff" opacity=".7"/>
  </svg>`;
}
/* Vorratsschrank aus Holz */
function cupboardSVG(groups, W = 112) {
  const sF = SC.U * .95, sB = sF * SC.BACK, DEPTH = 9;
  let y = 6, body = "";
  const all = [];
  for (const list of groups) all.push(...pieceList(list, 3));
  const shelves = layoutShelves(all, W - 18, W - 8, sF, sB, .8);
  while (shelves.length < 5) shelves.push({ back: [], front: [] });
  for (const sh of shelves) {
    const hb = Math.max(0, ...sh.back.map(pc => pc.h * sB)), hf = Math.max(0, ...sh.front.map(pc => pc.h * sF));
    const yb = y + Math.max(24, hb + 6, hf - DEPTH + 6), yf = yb + DEPTH;
    body += `<rect x="6" y="${r1(y)}" width="${W - 12}" height="9" fill="url(#scUnder)"/>`;
    body += `<path d="M7 ${r1(yb + 1.5)}H${W - 7}L${W - 1} ${r1(yf + 2)}H1Z" fill="url(#scBoardTop)"/>`;
    body += rowSVG(sh.back, 9, W - 9, yb + 1.2, sB, .8);
    if (sh.back.length) body += `<path d="M7 ${r1(yb - hb - 2)}H${W - 7}V${r1(yb + 1.6)}H7Z" fill="url(#scDeep)" pointer-events="none"/>`;
    body += rowSVG(sh.front, 3, W - 3, yf + .8, sF, .8);
    body += `<rect x="0" y="${r1(yf + 2)}" width="${W}" height="4.4" fill="url(#scBoardFront)"/><path d="M0 ${r1(yf + 2.3)}H${W}" stroke="#e8c08c" stroke-width=".7"/>`;
    y = yf + 10;
  }
  const H = y;
  const planks = Array.from({ length: 4 }, (_, i) => `<path d="M${r1(7 + (i + 1) * (W - 14) / 5)} 0V${H}" stroke="#c49a62" stroke-width=".6" opacity=".6"/>`).join("");
  const walls = `<rect width="${W}" height="${H}" fill="url(#scWood)"/>${planks}<path d="M0 0L7 5V${H}H0Z" fill="#b98550" opacity=".55"/><path d="M${W} 0L${W - 7} 5V${H}H${W}Z" fill="#a8743f" opacity=".55"/>`;
  return `<svg class="scene" viewBox="0 0 ${W} ${r1(H)}" preserveAspectRatio="xMidYMin meet">${SCENE_DEFS}${walls}${body}</svg>`;
}
const inStockOf = cat => products.filter(p => p.cat === cat && inStock(p));

/* ---------- Kühlschrank ---------- */
const FRIDGE_CATS = ["milch", "fleisch", "gemuese", "obst", "tiefkuehl"];
const CUPBOARD_CATS = ["kohlenhydrate", "oel", "backen", "gewuerze", "suess", "sonstiges"];
const MAX_ICONS = 12;
const catOf = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
const catIcon = id => ic(catOf(id).icon);
const packOf = p => p.pack > 0 ? p.pack : 100;
const fmt = n => Math.round(n).toLocaleString("de-DE");

function inStock(p) { return (stock[p.id] || 0) > 0.5; }

function packageInfo(p) {
  const g = stock[p.id] || 0, pack = packOf(p);
  const full = Math.floor((g + 0.5) / pack);
  const rest = g - full * pack;
  return { g, pack, full, partial: rest > 0.5 ? rest / pack : 0 };
}

function stockText(p) {
  const { g, full, partial } = packageInfo(p);
  let t = full ? `${full} ${full === 1 ? "Packung" : "Packungen"}` : "";
  if (partial) t += (t ? " + " : "") + "1 angebrochen";
  return { main: t || "Leer", sub: `${fmt(g)} g/ml insgesamt` };
}

function pkgHTML(p, fillShare) {
  const inner = p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy">` : `<span class="e">${catIcon(p.cat)}</span>`;
  if (fillShare == null) return `<div class="pkg">${inner}</div>`;
  return `<div class="pkg partial">${inner}<div class="fill" style="height:${Math.max(8, Math.round(fillShare * 100))}%"></div></div>`;
}

const MAX_STACK = 5;
function groupHTML(p) {
  const { full, partial } = packageInfo(p);
  const total = full + (partial ? 1 : 0);
  const unit = CUPBOARD_CATS.includes(p.cat) ? 1.0 : (p.cat === "gemuese" || p.cat === "obst") ? .95 : 1.2;
  const badge = total > 1 ? `<span class="fcnt">${total}×</span>` : (partial && !full ? `<span class="fcnt part">½</span>` : "");
  const d = daysLeft(p.id), ex = d === null ? "" : d <= 0 ? " exp-bad" : d <= 2 ? " exp-soon" : "";
  const pic = p.image && !p.icon && usePhotos() ? photoHTML(p, total, unit) : foodSVG(foodIconKey(p), total, unit);
  return `<div class="group fgrp${ex}" data-id="${p.id}" title="${esc(p.name)}" aria-label="${esc(p.name)}">${pic}${badge}${ex ? `<span class="xdot"></span>` : ""}</div>`;
}

function compHTML(catId, extraClass = "") {
  const items = products.filter(p => p.cat === catId && inStock(p))
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
  return `<div class="comp ${extraClass}"><div class="comp-label">${catOf(catId).short}</div>
    <div class="comp-items">${items.map(groupHTML).join("")}</div></div>`;
}

function renderFridge() {
  const view = $("view");
  const anything = products.some(inStock);
  const soon = products.filter(p => inStock(p) && daysLeft(p.id) !== null && daysLeft(p.id) <= 2).sort((a, b) => daysLeft(a.id) - daysLeft(b.id));
  const open = shoplist.filter(x => !x.done).length;
  view.innerHTML = `
    <div class="fr-bar">
      <button class="fr-list" id="frList">${ic("clipboard")}<span><b>Einkaufsliste</b><small>${open ? plural(open, "Sache", "Sachen") + " offen" : "Leer – tippen zum Planen"}</small></span>${open ? `<i>${open}</i>` : ""}</button>
    </div>
    ${leftovers.length ? `<div class="card rest-card"><div class="rc-head">${ic("bowl")} <b>Reste</b></div>${leftovers.map(l => `<div class="rest-row">
      <div class="item-main"><div class="item-name">${esc(l.name)}</div><div class="item-sub">${plural(l.portions, "Portion", "Portionen")} · ${Math.round(l.per.kcal)} kcal/Portion · ${expText(Math.round((new Date(l.exp + "T12:00") - new Date(todayKey() + "T12:00")) / 864e5))}</div></div>
      <button class="btn sm" data-eat="${l.id}">1 essen</button><button class="rm" data-toss="${l.id}" aria-label="Wegwerfen">✕</button></div>`).join("")}</div>` : ""}
    ${soon.length ? `<div class="card exp-card"><div class="rc-head">${ic("timer")} <b>Bald aufbrauchen</b></div><div class="exp-chips">${soon.map(p => { const d = daysLeft(p.id); return `<button class="exp-chip ${d <= 0 ? "bad" : "soon"}" data-sid="${p.id}">${esc(p.name)} <small>${expText(d)}</small></button>`; }).join("")}</div>
      <button class="link exp-go" id="expGo">Passende Rezepte ›</button></div>` : ""}
    <div class="kitchen flat">
      <div class="fridge scene-wrap">
        ${fridgeShelvesSVG([inStockOf("milch"), inStockOf("fleisch")])}
        <div class="drawers">${binSVG(inStockOf("gemuese"), 116)}${binSVG(inStockOf("obst"), 116)}</div>
        <div class="freezer-wrap">${binSVG(inStockOf("tiefkuehl"), 240, true)}</div>
      </div>
      <div class="cupboard scene-wrap">
        ${cupboardSVG(CUPBOARD_CATS.map(inStockOf))}
      </div>
    </div>
    ${anything ? "" : `<p class="fridge-hint">Noch leer. Tippe oben auf <b>Einkaufen</b> und trag deinen Einkauf ein.</p>`}
  `;
  view.querySelectorAll(".group").forEach(el => el.onclick = () => openStock(el.dataset.id));
  view.querySelectorAll("[data-sid]").forEach(el => el.onclick = () => openStock(el.dataset.sid));
  $("frList").onclick = openList;
  if ($("expGo")) $("expGo").onclick = () => { ideaFilter = "alle"; showTab("vorschlaege"); };
  view.querySelectorAll("[data-eat]").forEach(b => b.onclick = () => eatLeftover(b.dataset.eat, slotByTime()));
  view.querySelectorAll("[data-toss]").forEach(b => b.onclick = () => { const l = leftovers.find(x => x.id === b.dataset.toss); if (!l || !confirm(`Reste „${l.name}“ wegwerfen?`)) return; leftovers = leftovers.filter(x => x !== l); saveJSON(LEFT_KEY, leftovers); renderFridge(); });
}

