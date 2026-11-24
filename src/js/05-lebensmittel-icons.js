/* ---------- Lebensmittel-Icons (gezeichnet, flach, ohne Fotos) ----------
   Jedes Icon: Ursprung = Mitte unten (steht auf dem Regal), y nach oben negativ. */
/* ---------- Lebensmittel-Icons (realistisch, ohne SVG-Filter) ----------
   Gemeinsame Schattierungen liegen einmal im Dokument (FI_DEFS) und werden
   als halbtransparente Ebenen über die Grundfarbe gelegt – so wirken Becher,
   Dosen und Flaschen rund und Obst plastisch, egal welche Farbe. */
/* ---------- Lebensmittel-Icons (realistisch, ohne SVG-Filter) ----------
   Gemeinsame Schattierungen liegen einmal im Dokument (FI_DEFS) und werden
   als halbtransparente Ebenen über die Grundfarbe gelegt – so wirken Becher,
   Dosen und Flaschen rund und Obst plastisch, egal welche Farbe. */
/* ---------- Lebensmittel-Icons (realistisch, ohne SVG-Filter) ----------
   Gemeinsame Schattierungen liegen einmal im Dokument (FI_DEFS) und werden
   als halbtransparente Ebenen über die Grundfarbe gelegt – so wirken Becher,
   Dosen und Flaschen rund und Obst plastisch, egal welche Farbe. */
const FI_DEFS = `<svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>
<linearGradient id="fiCyl" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".1" stop-color="#000" stop-opacity=".1"/><stop offset=".26" stop-color="#fff" stop-opacity=".42"/><stop offset=".38" stop-color="#fff" stop-opacity=".08"/><stop offset=".7" stop-color="#000" stop-opacity=".04"/><stop offset=".9" stop-color="#000" stop-opacity=".2"/><stop offset="1" stop-color="#000" stop-opacity=".36"/></linearGradient>
<linearGradient id="fiFlat" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>
<linearGradient id="fiSide" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>
<linearGradient id="fiTop" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="fiDown" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
<linearGradient id="fiBag" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".08" stop-color="#fff" stop-opacity=".25"/><stop offset=".2" stop-color="#000" stop-opacity=".05"/><stop offset=".42" stop-color="#fff" stop-opacity=".3"/><stop offset=".55" stop-color="#000" stop-opacity=".03"/><stop offset=".8" stop-color="#fff" stop-opacity=".12"/><stop offset=".93" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
<radialGradient id="fiSph" cx=".36" cy=".3" r=".78"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".22" stop-color="#fff" stop-opacity=".12"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>
<radialGradient id="fiSoft" cx=".4" cy=".32" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient>
<linearGradient id="fiGlass" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".18" stop-color="#fff" stop-opacity=".75"/><stop offset=".26" stop-color="#fff" stop-opacity=".1"/><stop offset=".85" stop-color="#fff" stop-opacity=".05"/><stop offset=".92" stop-color="#fff" stop-opacity=".4"/><stop offset="1" stop-color="#fff" stop-opacity=".08"/></linearGradient>
<radialGradient id="fiShadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<pattern id="fiCurd" width="5" height="4" patternUnits="userSpaceOnUse"><circle cx="1.3" cy="1.2" r="1.15" fill="#fff"/><circle cx="3.8" cy="2.9" r="1.1" fill="#fff"/><circle cx="1.6" cy="1.5" r=".55" fill="#e7e2d6"/><circle cx="4.1" cy="3.2" r=".5" fill="#e7e2d6"/></pattern>
<pattern id="fiOats" width="6" height="4" patternUnits="userSpaceOnUse"><ellipse cx="1.6" cy="1.3" rx="1.4" ry=".9" fill="#e9d3a2"/><ellipse cx="4.4" cy="3" rx="1.3" ry=".85" fill="#dcbf86"/></pattern>
<pattern id="fiRice" width="5" height="3" patternUnits="userSpaceOnUse"><ellipse cx="1.3" cy="1" rx="1.1" ry=".45" fill="#fff"/><ellipse cx="3.8" cy="2.3" rx="1.1" ry=".45" fill="#fbf8f0"/></pattern>
<pattern id="fiCrumb" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".5" fill="#c9a777"/><circle cx="3" cy="2.8" r=".4" fill="#b98f5c"/></pattern>
<pattern id="fiMince" width="3.4" height="2.6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".9" fill="#d8686e"/><circle cx="2.6" cy="2" r=".7" fill="#9e2f37"/></pattern>
<pattern id="fiSeed" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M1 1.4l.5-.6.5.6z" fill="#f6e27a"/><path d="M3 3.4l.5-.6.5.6z" fill="#f6e27a"/></pattern>
</defs></svg>`;

const FI = (() => {
  const r2 = n => +(+n).toFixed(2);
  const sh = w => `<ellipse cx="0" cy="-.2" rx="${r2(w / 2 + 1)}" ry="${r2(Math.max(1.4, w * .09))}" fill="url(#fiShadow)"/>`;
  const P = (d, fill, extra = "") => `<path d="${d}" fill="${fill}"${extra}/>`;
  const S = (d, g, op = 1) => `<path d="${d}" fill="url(#${g})"${op !== 1 ? ` opacity="${op}"` : ""}/>`;
  const RR = (x, y, w, h, r = 0) => r ? `M${r2(x + r)} ${r2(y)}H${r2(x + w - r)}Q${r2(x + w)} ${r2(y)} ${r2(x + w)} ${r2(y + r)}V${r2(y + h - r)}Q${r2(x + w)} ${r2(y + h)} ${r2(x + w - r)} ${r2(y + h)}H${r2(x + r)}Q${r2(x)} ${r2(y + h)} ${r2(x)} ${r2(y + h - r)}V${r2(y + r)}Q${r2(x)} ${r2(y)} ${r2(x + r)} ${r2(y)}Z` : `M${r2(x)} ${r2(y)}H${r2(x + w)}V${r2(y + h)}H${r2(x)}Z`;
  const txt = (t, y, size, col = "#fff", w = 800, x = 0) => t ? `<text x="${r2(x)}" y="${r2(y)}" font-size="${r2(size)}" font-weight="${w}" fill="${col}" text-anchor="middle" font-family="-apple-system,Helvetica Neue,Segoe UI,Roboto,sans-serif" letter-spacing=".15">${t}</text>` : "";
  const fit = (t, w, max) => Math.min(max, w * 1.16 / Math.max(3, t.length));
  const I = (w, h, svg) => ({ w, h, svg });
  /* feine Druckzeilen, Nutri-Score-Leiste und Strichcode – lassen Packungen echt wirken */
  const fp = (x, y, w, n = 2, col = "#000", op = .28) => Array.from({ length: n }, (_, i) => `<rect x="${r2(x)}" y="${r2(y + i * 1.05)}" width="${r2(w * (i % 2 ? .62 : .86))}" height=".38" rx=".19" fill="${col}" opacity="${op}"/>`).join("");
  const ns = (x, y, k = 1, on = 1) => ["#038141", "#85bb2f", "#fecb02", "#ee8100", "#e63e11"].map((c, i) => `<rect x="${r2(x + i * 1.5 * k)}" y="${r2(y - (i === on ? .3 * k : 0))}" width="${r2(1.5 * k)}" height="${r2((i === on ? 2.3 : 1.7) * k)}" rx="${r2(.3 * k)}" fill="${c}"/>`).join("");
  const bc = (x, y, w = 4, h = 2.4) => `<rect x="${r2(x - .4)}" y="${r2(y - .4)}" width="${r2(w + .8)}" height="${r2(h + .8)}" fill="#fff"/>` + Array.from({ length: 9 }, (_, i) => `<rect x="${r2(x + i * w / 9)}" y="${r2(y)}" width="${r2(i % 3 ? w / 30 : w / 16)}" height="${r2(h)}" fill="#222"/>`).join("");
  const hl = (x, y, h, w = 1.4, op = .55) => `<rect x="${r2(x)}" y="${r2(y)}" width="${w}" height="${r2(h)}" rx="${w / 2}" fill="#fff" opacity="${op}"/>`;

  /* ===== Verpackungs-Bausteine ===== */
  /* Getränkekarton mit Giebel, Seitenfläche und Schraubdeckel */
  const carton = ({ c = "#2f7fe0", c2, t = "", sub = "", w = 22, h = 38, top = 9, body = "#f8fafc", cap = c, art = "" }) => {
    const x0 = -w / 2, sd = w * .26, x1 = w / 2 - sd;
    const front = `M${x0} 0V${-h}H${x1}V0Z`, side = `M${x1} 0V${-h}L${w / 2} ${-h + 1.6}V-1.2Z`;
    const roofF = `M${x0} ${-h}L${x0 + 2} ${-h - top}H${x1 - 2}L${x1} ${-h}Z`, roofS = `M${x1} ${-h}L${x1 - 2} ${-h - top}L${w / 2 - 1.5} ${-h - top + 1.2}L${w / 2} ${-h + 1.6}Z`;
    const fw = x1 - x0, cx = (x0 + x1) / 2;
    return I(w + 3, h + top + 5, sh(w) +
      P(front, body) + P(side, body) + S(side, "fiSide") + P(roofF, body) + S(roofF, "fiDown") + P(roofS, body) + S(roofS, "fiSide") +
      `<rect x="${x0}" y="${r2(-h - top - 1.4)}" width="${r2(fw - 2)}" height="1.6" rx=".6" fill="${body}"/><rect x="${x0}" y="${r2(-h - top - 1.4)}" width="${r2(fw - 2)}" height="1.6" fill="#000" opacity=".1"/>` +
      `<rect x="${r2(cx - 3.2)}" y="${r2(-h - top * .62 - 3)}" width="6.4" height="3.6" rx="1" fill="${cap}"/><rect x="${r2(cx - 3.2)}" y="${r2(-h - top * .62 - 3)}" width="6.4" height="1.2" rx=".6" fill="#fff" opacity=".35"/>` +
      `<rect x="${x0}" y="${r2(-h * .7)}" width="${r2(fw)}" height="${r2(h * .34)}" fill="${c}"/>` + (c2 ? `<path d="M${x0} ${r2(-h * .36)}Q${r2(cx)} ${r2(-h * .44)} ${x1} ${r2(-h * .34)}V${r2(-h * .27)}H${x0}Z" fill="${c2}"/>` : "") +
      `<rect x="${x1}" y="${r2(-h * .7 + .8)}" width="${r2(sd)}" height="${r2(h * .34)}" fill="${c}"/>` + S(`M${x1} ${r2(-h * .7 + .8)}h${r2(sd)}v${r2(h * .34)}h${r2(-sd)}z`, "fiSide") +
      txt(t, -h * .55, fit(t, fw, 5.2), "#fff", 800, cx) + txt(sub, -h * .46 + 1.4, Math.min(2.6, fw * 1.6 / Math.max(4, sub.length)), "#fff", 600, cx) + art +
      fp(x0 + 2, -h * .3, fw - 4, 2, "#000", .2) + ns(x0 + 2, -h * .14, .9, 1) + S(front, "fiFlat") + hl(x0 + 1.4, -h + 2, h - 4, 1.2, .5));
  };
  /* Becher (rund, nach unten schmaler) mit Deckel oder Folie */
  const tub = ({ c = "#e94b3c", lid, t = "", sub = "", w = 28, h = 18, body = "#fbfcfd", band = .46, taper = 2.6, clear, fillCol = "#fff", foil }) => {
    const d = `M${-w / 2} ${-h}L${-w / 2 + taper} -1Q${-w / 2 + taper} 0 ${-w / 2 + taper + 1} 0H${w / 2 - taper - 1}Q${w / 2 - taper} 0 ${w / 2 - taper} -1L${w / 2} ${-h}Z`;
    const by = -h * .78, bh = h * band, k = taper * (bh / h), k0 = taper * ((h + by) / h);
    const bandD = `M${r2(-w / 2 + k0)} ${r2(by)}L${r2(-w / 2 + k0 + k)} ${r2(by + bh)}H${r2(w / 2 - k0 - k)}L${r2(w / 2 - k0)} ${r2(by)}Z`;
    const lidC = lid || c;
    return I(w + 3, h + 6, sh(w - taper) + P(d, clear ? "#eef3f6" : body) +
      (clear ? `<path d="${d}" fill="${fillCol}" opacity=".95"/><path d="${d}" fill="url(#fiCurd)" opacity=".9"/>` : "") +
      P(bandD, c) + txt(t, by + bh * .62, fit(t, w - 6, 4.6), "#fff", 800) + txt(sub, by + bh * .62 + 3, 2.3, "#fff", 600) +
      S(d, "fiCyl") + (clear ? S(d, "fiGlass", .7) : "") +
      (foil ? `<ellipse cx="0" cy="${-h}" rx="${w / 2 + .3}" ry="2.6" fill="${foil}"/><ellipse cx="0" cy="${-h}" rx="${w / 2 + .3}" ry="2.6" fill="url(#fiSph)" opacity=".6"/>`
        : `<ellipse cx="0" cy="${r2(-h + .4)}" rx="${w / 2 + .9}" ry="3" fill="${lidC}"/><ellipse cx="0" cy="${r2(-h - .5)}" rx="${w / 2 + .5}" ry="2.6" fill="${lidC}"/><ellipse cx="0" cy="${r2(-h - .5)}" rx="${w / 2 + .5}" ry="2.6" fill="url(#fiTop)"/>` +
          (clear ? `<ellipse cx="0" cy="${r2(-h - .5)}" rx="${w / 2 - 1.5}" ry="1.9" fill="${fillCol}"/><ellipse cx="0" cy="${r2(-h - .5)}" rx="${w / 2 - 1.5}" ry="1.9" fill="url(#fiCurd)"/><ellipse cx="-3" cy="${r2(-h - 1)}" rx="${w / 4}" ry=".7" fill="#fff" opacity=".7"/>` : "")));
  };
  /* Beutel / Tüte (Kissenform) mit Sichtfenster */
  const bag = ({ c = "#fff8e4", band = "#1f5fae", t = "", w = 26, h = 34, win, top = "seal", fillPat, winBg = "#fff" }) => {
    const d = `M${-w / 2 + 1} 0Q${-w / 2 - 1} ${-h * .5} ${-w / 2 + 1} ${-h + 3}H${w / 2 - 1}Q${w / 2 + 1} ${-h * .5} ${w / 2 - 1} 0Q0 1.2 ${-w / 2 + 1} 0Z`;
    const seal = top === "crimp"
      ? `<path d="M${-w / 2 + 1} ${-h + 3}V${-h}` + Array.from({ length: Math.round(w / 2) }, (_, i) => `L${r2(-w / 2 + 1 + (i + .5) * (w - 2) / Math.round(w / 2))} ${i % 2 ? -h : -h + 1.4}`).join("") + `L${w / 2 - 1} ${-h}V${-h + 3}Z" fill="${band}"/>`
      : `<rect x="${-w / 2 + 1}" y="${-h}" width="${w - 2}" height="3.4" fill="${band}"/><rect x="${-w / 2 + 1}" y="${-h}" width="${w - 2}" height="3.4" fill="#000" opacity=".12"/>`;
    const wx = -w / 2 + 4, wy = -h + 12, ww = w - 8, wh = h - 17;
    return I(w + 3, h + 4, sh(w) + P(d, c) + seal +
      `<rect x="${-w / 2 + .6}" y="${-h + 3.4}" width="${w - 1.2}" height="6.8" fill="${band}"/>` + txt(t, -h + 8.6, fit(t, w - 4, 4.8)) +
      (win ? `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="3" fill="${winBg}" opacity="${fillPat ? 1 : .8}"/>` + (fillPat ? `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="3" fill="url(#${fillPat})"/>` : "") + win(ww, wh, wx, wy) +
        `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="3" fill="none" stroke="#000" stroke-opacity=".08" stroke-width=".6"/>` : "") +
      ns(w / 2 - 9.5, -4.2, .9, 2) + S(d, "fiBag") + `<path d="M${-w / 2 + 3} ${-h + 4}Q${-w / 2 + 2} ${-h * .5} ${-w / 2 + 3} -2" stroke="#fff" stroke-width="1.3" fill="none" opacity=".45" stroke-linecap="round"/>`);
  };
  /* Faltschachtel (Müsli, Haferflocken, Tee …) mit Seitenfläche */
  const box = ({ c = "#e6c181", top = "#3f7d3a", t = "", w = 22, h = 36, motif = "", sideW = 5 }) => {
    const x0 = -w / 2, x1 = w / 2 - sideW, front = RR(x0, -h, w - sideW, h), side = `M${x1} 0V${-h}L${w / 2} ${-h + 1.8}V-1.4Z`;
    return I(w + 3, h + 4, sh(w) + P(front, c) + `<rect x="${x0}" y="${-h}" width="${w - sideW}" height="7" fill="${top}"/>` + P(side, c) + S(side, "fiSide") +
      `<path d="M${x1} ${-h}L${w / 2} ${-h + 1.8}V${-h + 8.4}L${x1} ${-h + 7}Z" fill="${top}"/>` + S(`M${x1} ${-h}L${w / 2} ${-h + 1.8}V${-h + 8.4}L${x1} ${-h + 7}Z`, "fiSide") +
      txt(t, -h + 5.2, fit(t, w - sideW, 4.4), "#fff", 800, (x0 + x1) / 2) + motif + (h > 20 ? ns(x0 + 1.6, -4.2, .9, 2) + fp(x0 + 1.6, -h + 9, w - sideW - 4, 2, "#000", .22) : "") + `<g opacity=".9">${bc(w / 2 - sideW + .6, -h * .42, sideW - 1.6, 2.6)}</g>` + S(front, "fiFlat") + hl(x0 + 1.2, -h + 8.5, h - 11, 1.1, .45));
  };
  /* Schraubglas */
  const jar = ({ glass = "#f6e7b5", fill = "#e8a92b", lid = "#c0392b", t = "", w = 20, h = 24, fillTo = .88, label = "#fff", lc = "#555", fillPat }) => {
    const d = RR(-w / 2, -h, w, h, 4), fd = RR(-w / 2 + .9, -h * fillTo, w - 1.8, h * fillTo - .9, 3.4);
    return I(w + 3, h + 7, sh(w) + P(d, glass, ` opacity=".85"`) + P(fd, fill) + (fillPat ? S(fd, fillPat) : "") +
      (t ? `<rect x="${-w / 2}" y="${r2(-h * .66)}" width="${w}" height="${r2(h * .38)}" fill="${label}"/>` + txt(t, -h * .43, fit(t, w - 3, 4.4), lc) + fp(-w / 2 + 2.4, -h * .36, w - 4.8, 2, lc, .3) : "") +
      S(d, "fiCyl") + S(d, "fiGlass", .8) +
      `<rect x="${-w / 2 + .6}" y="${-h - 5.2}" width="${w - 1.2}" height="6" rx="1.6" fill="${lid}"/>` + S(RR(-w / 2 + .6, -h - 5.2, w - 1.2, 6, 1.6), "fiCyl") +
      Array.from({ length: Math.floor(w / 2.4) }, (_, i) => `<rect x="${r2(-w / 2 + 1.8 + i * 2.4)}" y="${-h - 4.4}" width=".6" height="4.4" fill="#000" opacity=".1"/>`).join(""));
  };
  /* Flasche (Glas oder PET) */
  const bottle = ({ c = "#a9951c", cap = "#2b5a2a", label = "#f4f0e2", t = "", w = 14, h = 46, neck = 10, alpha = .95, lc = "#555", pet }) => {
    const d = `M${-w / 2} -1.5Q${-w / 2} 0 ${-w / 2 + 1.5} 0H${w / 2 - 1.5}Q${w / 2} 0 ${w / 2} -1.5V${-h + neck + 6}Q${w / 2} ${-h + neck} 3 ${-h + neck - 4}V${-h}H-3V${-h + neck - 4}Q${-w / 2} ${-h + neck} ${-w / 2} ${-h + neck + 6}Z`;
    return I(w + 3, h + 7, sh(w) + P(d, c, ` opacity="${alpha}"`) +
      (pet ? [.3, .55, .8].map(f => `<rect x="${-w / 2}" y="${r2(-h * f)}" width="${w}" height=".7" fill="#000" opacity=".08"/>`).join("") : "") +
      `<rect x="-3.6" y="${-h - 5}" width="7.2" height="6" rx="1.2" fill="${cap}"/>` + S(RR(-3.6, -h - 5, 7.2, 6, 1.2), "fiCyl") +
      (label ? `<rect x="${-w / 2}" y="${r2(-h * .52)}" width="${w}" height="${r2(h * .28)}" fill="${label}"/>` + txt(t, -h * .35, fit(t, w - 2, 4), lc) + fp(-w / 2 + 2, -h * .3, w - 4, 2, lc, .3) : "") +
      S(d, "fiCyl") + S(d, "fiGlass", pet ? .9 : .6));
  };
  /* Konservendose */
  const can = ({ c = "#c0392b", t = "", w = 18, h = 26, band = "#fff", tc, metal = "#c9ced5", art = "" }) => {
    const d = RR(-w / 2, -h, w, h, 1.2);
    return I(w + 3, h + 4, sh(w) + P(d, c) +
      (t ? `<rect x="${-w / 2}" y="${r2(-h * .66)}" width="${w}" height="${r2(h * .36)}" fill="${band}"/>` + txt(t, -h * .44, fit(t, w - 2, 4.4), tc || c) + fp(-w / 2 + 2, -h * .38, w - 4, 2, tc || c, .3) : "") + art +
      [-h, -2.6].map(y => `<rect x="${-w / 2 - .3}" y="${r2(y)}" width="${w + .6}" height="2.6" rx=".8" fill="${metal}"/>`).join("") +
      `<rect x="${-w / 2}" y="${r2(-h + 3.4)}" width="${w}" height=".6" fill="#000" opacity=".12"/><rect x="${-w / 2}" y="-4" width="${w}" height=".6" fill="#000" opacity=".12"/>` +
      S(RR(-w / 2 - .3, -h, w + .6, h, 1.2), "fiCyl") + `<ellipse cx="0" cy="${-h}" rx="${w / 2}" ry="1.2" fill="#e6e9ee"/>`);
  };
  /* Kühlschale mit Klarsichtfolie */
  const tray = ({ base = "#2d3036", rim = "#4b4f57", w = 38, h = 9, food, label, lc = "#c0392b" }) => {
    const d = `M${-w / 2} ${-h}H${w / 2}L${w / 2 - 2.2} -1Q${w / 2 - 2.4} 0 ${w / 2 - 3.4} 0H${-w / 2 + 3.4}Q${-w / 2 + 2.4} 0 ${-w / 2 + 2.2} -1Z`;
    return I(w + 3, h + 11, sh(w) + food + P(d, base) + S(d, "fiDown") +
      `<path d="M${-w / 2 - .4} ${-h}H${w / 2 + .4}" stroke="${rim}" stroke-width="1.4" stroke-linecap="round"/>` +
      `<path d="M${-w / 2 + .5} ${-h}Q0 ${-h - 11} ${w / 2 - .5} ${-h}" fill="#fff" opacity=".1"/>` +
      `<path d="M${-w / 2 + 5} ${-h - 6.5}Q${-w / 4} ${-h - 9} ${-2} ${-h - 9.4}" stroke="#fff" stroke-width="1.3" opacity=".7" fill="none" stroke-linecap="round"/>` +
      (label ? `<rect x="${r2(w / 2 - 15)}" y="${r2(-h + 1.6)}" width="11" height="5" rx=".8" fill="#fff"/><rect x="${r2(w / 2 - 15)}" y="${r2(-h + 1.6)}" width="11" height="1.6" fill="${lc}"/>` +
        `<rect x="${r2(w / 2 - 13.6)}" y="${r2(-h + 4.2)}" width="8" height=".6" fill="#999"/><rect x="${r2(w / 2 - 13.6)}" y="${r2(-h + 5.3)}" width="5" height=".6" fill="#999"/>` : ""));
  };
  /* flache Kühlpackung mit Sichtfenster (Aufschnitt, Käsescheiben, Speck) */
  const pack = ({ w = 32, h = 11, frame = "#e9eef3", win, t = "", tc = "#c0392b" }) => {
    const d = RR(-w / 2, -h, w, h, 2);
    return I(w + 3, h + 4, sh(w) + P(d, frame) + win + S(d, "fiDown") +
      `<rect x="${-w / 2 + 2}" y="${-h + 1.6}" width="${w - 4}" height="${h - 3.2}" rx="1.5" fill="#fff" opacity=".14"/>` +
      `<path d="M${-w / 2 + 3} ${-h + 2.6}H${-w / 2 + 12}" stroke="#fff" stroke-width="1.1" opacity=".75" stroke-linecap="round"/>` +
      (t ? `<rect x="${-w / 2}" y="${-h}" width="${w}" height="3.2" rx="1.2" fill="${tc}"/>` + txt(t, -h + 2.5, 2.6) : ""));
  };

  /* ===== Obst & Gemüse (kugelig schattiert) ===== */
  const round = ({ c, d, r = 9, leaf = "#4c9a3f", stem = "#6b4426", shape = "apple", spot = "" }) => {
    let body;
    if (shape === "apple") body = `M0 ${-2 * r + 3}C${-r * .65} ${-2 * r - .5} ${-r * 1.2} ${-2 * r + 6} ${-r * 1.1} ${-r * .9}C${-r} -1 ${-r * .4} 1 0 -1C${r * .4} 1 ${r} -1 ${r * 1.1} ${-r * .9}C${r * 1.2} ${-2 * r + 6} ${r * .65} ${-2 * r - .5} 0 ${-2 * r + 3}Z`;
    else if (shape === "lemon") body = `M${-r * 1.42} ${-r * .8}Q${-r * 1.3} ${-r * 1.7} 0 ${-r * 1.62}Q${r * 1.3} ${-r * 1.7} ${r * 1.42} ${-r * .8}Q${r * 1.3} 0 0 0Q${-r * 1.3} 0 ${-r * 1.42} ${-r * .8}Z`;
    else if (shape === "pear") body = `M0 ${-2.4 * r}C${-r * .5} ${-2.4 * r} ${-r * .6} ${-1.6 * r} ${-r * .7} ${-1.3 * r}C${-r * 1.2} ${-r} ${-r * 1.1} 0 0 0C${r * 1.1} 0 ${r * 1.2} ${-r} ${r * .7} ${-1.3 * r}C${r * .6} ${-1.6 * r} ${r * .5} ${-2.4 * r} 0 ${-2.4 * r}Z`;
    else body = `M${-r} ${-r}A${r} ${r} 0 1 0 ${r} ${-r}A${r} ${r} 0 1 0 ${-r} ${-r}Z`;
    const topY = shape === "pear" ? -2.4 * r : shape === "lemon" ? -1.62 * r : shape === "apple" ? -2 * r + 2 : -2 * r;
    return I(shape === "lemon" ? r * 3 : r * 2.6, -topY + 6, sh(r * 1.9) + P(body, c) +
      (d ? `<path d="M${r * .35} ${r2(topY * .2)}Q${r * 1.05} ${r2(topY * .5)} ${r * .6} ${r2(topY * .86)}" stroke="${d}" stroke-width="${r2(r * .5)}" fill="none" opacity=".35" stroke-linecap="round"/>` : "") +
      spot + (shape === "apple" || shape === "pear" ? Array.from({ length: 9 }, (_, i) => `<circle cx="${r2(Math.cos(i * 2.3) * r * .62)}" cy="${r2(topY * .52 + Math.sin(i * 2.3) * r * .58)}" r=".32" fill="#fff6c8" opacity=".55"/>`).join("") : "") + S(body, "fiSph") +
      (stem ? `<path d="M0 ${r2(topY + 1.5)}Q${r * .05} ${r2(topY - 1.5)} ${r * .22} ${r2(topY - 3.2)}" stroke="${stem}" stroke-width="1.3" stroke-linecap="round" fill="none"/>` : "") +
      (leaf ? `<path d="M${r * .2} ${r2(topY - 2)}Q${r * .7} ${r2(topY - 5.6)} ${r * 1.05} ${r2(topY - 1.6)}Q${r * .5} ${r2(topY - .2)} ${r * .2} ${r2(topY - 2)}Z" fill="${leaf}"/><path d="M${r * .25} ${r2(topY - 2)}Q${r * .65} ${r2(topY - 3)} ${r} ${r2(topY - 1.7)}" stroke="#000" stroke-opacity=".2" stroke-width=".4" fill="none"/>` : ""));
  };
  const oblong = ({ c, d, len = 30, r = 4.5, curve = 0, extra = "" }) => {
    const p = `M${-len / 2} ${-r}Q0 ${-r - curve} ${len / 2} ${-r}`;
    return I(len + r + 4, r * 2 + 5, sh(len) + `<path d="${p}" stroke="${c}" stroke-width="${r * 2}" stroke-linecap="round" fill="none"/>` +
      `<path d="M${-len / 2 + 1} ${-r * .35}Q0 ${-r * .35 - curve} ${len / 2 - 1} ${-r * .35}" stroke="${d}" stroke-width="${r2(r * .8)}" stroke-linecap="round" fill="none" opacity=".55"/>` +
      `<path d="M${-len / 2 + 2} ${-r * 1.45}Q0 ${-r * 1.45 - curve} ${len / 2 - 4} ${-r * 1.45}" stroke="#fff" stroke-width="${r2(r * .38)}" stroke-linecap="round" fill="none" opacity=".4"/>` + extra);
  };

  const L = {};
  /* ===== Milch & Molkerei ===== */
  L.milk = carton({ t: "MILCH", sub: "frisch · 3,5 %", c: "#2f7fe0", c2: "#7fb6f2", cap: "#2f7fe0", art: `<path d="M-9 -24Q-6 -28 -2 -25Q1 -29 4 -24" stroke="#fff" stroke-width=".7" fill="none" opacity=".6"/>` });
  L.lfmilk = carton({ t: "LAKTOSEFREI", sub: "Milch 1,5 %", c: "#1aa29b", c2: "#7fd3cc", cap: "#1aa29b" });
  L.oatmilk = carton({ t: "HAFER", sub: "Drink", c: "#c9953f", c2: "#e8c78a", cap: "#8a5a1f", body: "#f6efe2" });
  L.soymilk = carton({ t: "SOJA", sub: "Drink", c: "#5d9a34", c2: "#a8d07a", cap: "#3d7a20", body: "#f4f7ee" });
  L.almondmilk = carton({ t: "MANDEL", sub: "Drink", c: "#9a6b47", c2: "#d6b394", cap: "#6b4426", body: "#f7f2ec" });
  L.cream = carton({ t: "SAHNE", sub: "30 % Fett", c: "#3b6fd1", w: 16, h: 22, top: 6 });
  L.buttermilk = carton({ t: "BUTTERMILCH", c: "#2a9d8f", c2: "#8fd0c6", w: 20, h: 32 });
  L.kefir = bottle({ c: "#f7f9fb", cap: "#2f7fe0", label: "#2f7fe0", t: "KEFIR", h: 34, w: 14, neck: 7, lc: "#fff", pet: true, alpha: 1 });
  L.proteinshake = bottle({ c: "#f4f6f8", cap: "#222b38", label: "#222b38", t: "PROTEIN", h: 32, w: 13, neck: 6, lc: "#f28c28", pet: true, alpha: 1 });
  L.juice = carton({ t: "SAFT", sub: "100 % Orange", c: "#f28c28", c2: "#f9c06b", cap: "#2f7d32", art: `<circle cx="-2.6" cy="-17" r="2.6" fill="#f7941d"/><circle cx="-2.6" cy="-17" r="1.6" fill="#fcd28a"/>` });
  L.quark = tub({ t: "QUARK", sub: "Magerstufe", c: "#e94b3c", foil: "#d9dee4", w: 26, h: 16 });
  L.skyr = tub({ t: "SKYR", sub: "isländisch", c: "#3d7be0", w: 22, h: 20, foil: "#e8eef4" });
  L.yogurt = tub({ t: "JOGHURT", sub: "Natur 3,5 %", c: "#7bb661", w: 22, h: 19, foil: "#eef1ea" });
  L.greek = tub({ t: "GREEK", sub: "Style 10 %", c: "#2b5fae", w: 28, h: 18, lid: "#2b5fae" });
  L.cottage = tub({ t: "KÖRNIGER", sub: "Frischkäse", c: "#2a9d8f", w: 26, h: 14, band: .42, clear: true, lid: "#e6edf1", taper: 2 });
  L.creamcheese = (() => { const w = 26, h = 10;
    return I(w + 3, h + 7, sh(w) + P(RR(-w / 2, -h, w, h, 3), "#fbfcfd") + `<rect x="${-w / 2}" y="${-h + 3}" width="${w}" height="4.6" fill="#9b59b6"/>` + txt("FRISCHKÄSE", -h + 6.4, 2.9) +
      S(RR(-w / 2, -h, w, h, 3), "fiCyl") + `<ellipse cx="0" cy="${-h}" rx="${w / 2}" ry="3" fill="#c39bd3"/><ellipse cx="0" cy="${-h - .4}" rx="${w / 2 - 1}" ry="2.4" fill="#d7b9e3"/><ellipse cx="0" cy="${-h - .4}" rx="${w / 2 - 1}" ry="2.4" fill="url(#fiTop)"/>`); })();
  L.sourcream = tub({ t: "SCHMAND", c: "#4a7fc8", w: 18, h: 14, foil: "#e8eef4", band: .5 });
  L.pudding = tub({ t: "PROTEIN", sub: "Pudding", c: "#6d4c41", w: 20, h: 20, foil: "#d8c3a5" });
  L.butter = (() => { const d = `M-15 0V-8L-12 -11H15V-3L12 0Z`;
    return I(32, 14, sh(30) + P(d, "#e9c54a") + `<path d="M-15 -8H12V0H-15Z" fill="#f2d35d"/><path d="M12 -8L15 -11V-3L12 0Z" fill="#c9a12e"/><path d="M-15 -8L-12 -11H15L12 -8Z" fill="#f8e48c"/>` +
      `<path d="M-15 -8H12" stroke="#fff" stroke-opacity=".5" stroke-width=".6"/><rect x="-11" y="-6.6" width="19" height="5" rx="2.5" fill="#2f6fbf"/>` + txt("BUTTER", -3, 3.4, "#fff") +
      `<path d="M-8 -9.5Q0 -10.6 9 -9.6" stroke="#fff" stroke-width=".8" opacity=".6" fill="none"/>` + S(`M-15 -8H12V0H-15Z`, "fiFlat")); })();
  L.margarine = (() => { const w = 26, h = 9, d = RR(-w / 2, -h, w, h, 2.4);
    return I(w + 3, h + 6, sh(w) + P(d, "#f6d35b") + txt("MARGARINE", -h + 5.6, 2.8, "#8a6d1d") + S(d, "fiCyl") +
      `<path d="M${-w / 2 - .4} ${-h}L${-w / 2 + 1.4} ${-h - 3}H${w / 2 - 1.4}L${w / 2 + .4} ${-h}Z" fill="#f2c12e"/><path d="M${-w / 2 + 2} ${-h - 2.4}H${w / 2 - 2}" stroke="#fff" stroke-width=".7" opacity=".6"/>`); })();
  L.cheese = (() => { const front = `M-16 0V-12L14 -20V0Z`, top = `M-16 -12L14 -20L17 -18.6L-13 -10.5Z`, side = `M14 -20L17 -18.6V0H14Z`;
    return I(36, 22, sh(32) + P(front, "#f2c341") + P(side, "#d9a52a") + P(top, "#f8da78") + S(front, "fiFlat") +
      [[-9, -5, 2.4], [-1, -8.6, 1.7], [7, -5, 2.6], [-4, -2, 1.3], [10, -12.6, 1.4], [2, -2.4, 1]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .9}" fill="#d9a52a"/><ellipse cx="${x + r * .25}" cy="${y + r * .25}" rx="${r * .7}" ry="${r * .6}" fill="#e7b63c"/>`).join("") +
      `<path d="M-16 0V-12" stroke="#b8862a" stroke-width="1.2"/>`); })();
  L.parmesan = (() => { const front = `M-13 0V-9L11 -17V0Z`;
    return I(30, 20, sh(26) + P(front, "#f3dfa4") + `<path d="M-13 0V-9L-10.6 -9.8V0Z" fill="#c99a45"/>` + P(`M-13 -9L11 -17L14 -15.8L-10 -8Z`, "#f8eac0") + P(`M11 -17L14 -15.8V0H11Z`, "#d8bf78") + S(front, "fiFlat") +
      Array.from({ length: 10 }, (_, i) => `<circle cx="${-6 + (i * 7) % 15}" cy="${-2 - (i * 3) % 9}" r=".45" fill="#d9bf7a"/>`).join("")); })();
  L.slices = pack({ w: 30, h: 11, frame: "#2f6fbf", t: "SCHEIBEN", tc: "#1d4f96", win: `<rect x="-13" y="-7.6" width="26" height="6.4" rx="1.2" fill="#f4c84a"/><path d="M-13 -5.8H13M-13 -3.8H13" stroke="#e0ad2c" stroke-width=".5"/><circle cx="-6" cy="-4.6" r=".9" fill="#e0ad2c"/><circle cx="5" cy="-5.6" r=".7" fill="#e0ad2c"/>` });
  L.mozzarella = (() => { const d = `M-12 0Q-14 -9 -10 -15Q-6 -18 0 -18Q6 -18 10 -15Q14 -9 12 0Q0 1.4 -12 0Z`;
    return I(28, 22, sh(24) + P(d, "#dfeef7", ` opacity=".85"`) + `<ellipse cx="0" cy="-7" rx="8.6" ry="7" fill="#fdfdfb"/><ellipse cx="0" cy="-7" rx="8.6" ry="7" fill="url(#fiSoft)"/>` +
      `<rect x="-12.5" y="-6" width="25" height="5" fill="#2f9e44"/><rect x="-12.5" y="-6" width="8.3" height="5" fill="#2f9e44"/><rect x="-4.2" y="-6" width="8.4" height="5" fill="#fff"/><rect x="4.2" y="-6" width="8.3" height="5" fill="#d62f2f"/>` + txt("MOZZARELLA", -2.4, 2.4, "#333", 800) +
      `<path d="M-6 -18L-3 -21L0 -18.4L3 -21L6 -18" stroke="#cfdde6" stroke-width="1.2" fill="none"/>` + S(d, "fiBag", .8)); })();
  L.feta = pack({ w: 28, h: 12, frame: "#f7f9fb", t: "FETA", tc: "#2f6fbf", win: `<rect x="-11" y="-8.4" width="22" height="7" rx="1" fill="#fbfaf4"/><path d="M-11 -6H11M-3 -8.4V-1.4" stroke="#e6e1d2" stroke-width=".5"/>` + Array.from({ length: 6 }, (_, i) => `<circle cx="${-8 + i * 3.2}" cy="${-4 + (i % 2)}" r=".5" fill="#e6e1d2"/>`).join("") });
  L.eggs = (() => { const base = `M-19 -8H19L17 0H-17Z`;
    return I(40, 19, sh(36) + [-13.5, -4.5, 4.5, 13.5].map(x => `<ellipse cx="${x}" cy="-11" rx="4.4" ry="5.6" fill="#e9c9a0"/><ellipse cx="${x}" cy="-11" rx="4.4" ry="5.6" fill="url(#fiSph)"/>`).join("") +
      P(base, "#b9ae9a") + `<path d="M-19 -8H19" stroke="#a39780" stroke-width="1"/>` + [-13.5, -4.5, 4.5, 13.5].map(x => `<path d="M${x - 4} -8Q${x} -3.4 ${x + 4} -8" fill="#a99d86"/>`).join("") + S(base, "fiDown") + S(base, "fiFlat")); })();

  /* ===== Fleisch, Fisch & Alternativen ===== */
  const fillet = (x, y, w, h, c, d) => `<path d="M${x - w / 2} ${y}C${x - w / 2} ${y - h} ${x + w / 2 - 2} ${y - h - 1} ${x + w / 2} ${y - h * .35}C${x + w / 2 - 1} ${y + .4} ${x} ${y + .6} ${x - w / 2} ${y}Z" fill="${c}"/><path d="M${x - w / 2} ${y}C${x - w / 2} ${y - h} ${x + w / 2 - 2} ${y - h - 1} ${x + w / 2} ${y - h * .35}C${x + w / 2 - 1} ${y + .4} ${x} ${y + .6} ${x - w / 2} ${y}Z" fill="url(#fiSoft)"/>` +
    `<path d="M${x - w / 2 + 2} ${y - h * .55}Q${x} ${y - h - .6} ${x + w / 2 - 3} ${y - h * .65}" stroke="${d}" stroke-width=".8" fill="none" opacity=".7"/>`;
  L.chicken = tray({ base: "#2f3238", rim: "#50555e", label: true, lc: "#e8a10f", food: fillet(-7, -8.6, 16, 7.6, "#f3b6a8", "#fbe0d8") + fillet(7.5, -8.6, 16, 8.2, "#efa898", "#fbe0d8") });
  L.turkey = tray({ base: "#345a3c", rim: "#557a5b", label: true, lc: "#2f7d32", food: fillet(-7, -8.6, 16, 6.6, "#f4c8bb", "#fde8e1") + fillet(7, -8.6, 16, 7, "#f0bcae", "#fde8e1") });
  L.mince = tray({ base: "#d4dae1", rim: "#bcc5cf", label: true, food: `<path d="M-16 -8.6C-15 -17 15 -17 16 -8.6Z" fill="#bf4a52"/><path d="M-16 -8.6C-15 -17 15 -17 16 -8.6Z" fill="url(#fiMince)"/><path d="M-16 -8.6C-15 -17 15 -17 16 -8.6Z" fill="url(#fiSoft)"/>` });
  L.steak = tray({ base: "#2f3238", rim: "#50555e", food: `<path d="M-14 -8.6C-16 -15 -4 -18.4 5 -16C13 -14.4 16 -11 13 -8.6Z" fill="#a72a35"/><path d="M-14 -8.6C-16 -15 -4 -18.4 5 -16C13 -14.4 16 -11 13 -8.6Z" fill="url(#fiSoft)"/>` +
    `<path d="M-10 -12Q-3 -14.4 4 -12.6M-6 -10Q1 -11 8 -10.4" stroke="#f1c8c6" stroke-width=".7" fill="none" opacity=".8"/><path d="M13 -8.6C15.4 -11 15 -13.6 10.6 -15" stroke="#f6e6cf" stroke-width="2.4" fill="none" stroke-linecap="round"/>` });
  L.schnitzel = tray({ base: "#2f3238", rim: "#50555e", label: true, food: [[-6, 0], [6, 1]].map(([x, s]) => `<path d="M${x - 9} -8.6C${x - 9} -15 ${x + 8} -16 ${x + 9} -9.6Z" fill="${s ? "#e9a0a0" : "#f0afae"}"/><path d="M${x - 9} -8.6C${x - 9} -15 ${x + 8} -16 ${x + 9} -9.6Z" fill="url(#fiSoft)"/>`).join("") });
  L.salmon = tray({ base: "#eef2f6", rim: "#c4ccd6", food: `<path d="M-15 -8.6C-14 -15.6 12 -17 16 -9.6Z" fill="#f2884a"/><path d="M-15 -8.6C-14 -15.6 12 -17 16 -9.6Z" fill="url(#fiSoft)"/>` + [-9, -4.5, 0, 4.5, 9].map(x => `<path d="M${x} -15.4Q${x + 2.4} -12 ${x + 1.2} -9" stroke="#fde3cf" stroke-width=".9" fill="none"/>`).join("") + `<path d="M-15 -8.6H16" stroke="#9aa0a8" stroke-width="1.2"/>` });
  L.fish = tray({ base: "#eef2f6", rim: "#c4ccd6", food: `<path d="M-15 -8.6C-12 -15 11 -15.4 15 -9Z" fill="#f6f1e8"/><path d="M-15 -8.6C-12 -15 11 -15.4 15 -9Z" fill="url(#fiSoft)"/><path d="M-9 -12Q0 -14 9 -12M-6 -10.4Q1 -11.6 8 -10.4" stroke="#e2d8c6" stroke-width=".7" fill="none"/>` });
  L.shrimp = tray({ base: "#eef2f6", rim: "#c4ccd6", food: [-10, -1, 8].map(x => `<path d="M${x - 4} -8.6C${x - 5.5} -14.6 ${x + 3.6} -16.6 ${x + 4.6} -11C${x + 2.6} -12.4 ${x - .6} -12.4 ${x - 1} -8.6Z" fill="#f59a7a"/><path d="M${x - 4} -8.6C${x - 5.5} -14.6 ${x + 3.6} -16.6 ${x + 4.6} -11C${x + 2.6} -12.4 ${x - .6} -12.4 ${x - 1} -8.6Z" fill="url(#fiSoft)"/><path d="M${x - 3} -12L${x - 1.6} -11M${x - 1} -14L${x} -12.4M${x + 1.6} -14.4L${x + 1.6} -12.6" stroke="#fdd3c2" stroke-width=".6"/>`).join("") });
  L.ham = pack({ w: 32, h: 11, frame: "#e9eef3", t: "KOCHSCHINKEN", tc: "#c0392b", win: `<ellipse cx="-2" cy="-4.4" rx="11.6" ry="3.6" fill="#f0a6a8"/><ellipse cx="2" cy="-5" rx="11.6" ry="3.6" fill="#f5b9ba"/><path d="M-9 -5Q2 -8 13 -5" stroke="#fde3e3" stroke-width=".9" fill="none"/>` });
  L.salami = pack({ w: 32, h: 11, frame: "#e9eef3", t: "SALAMI", tc: "#8e1b1b", win: [-9.5, -3.2, 3.2, 9.5].map(x => `<circle cx="${x}" cy="-4.6" r="3.7" fill="#b3283a"/>` + [[-1.2, -.8], [1, .6], [.3, -1.6], [-.6, 1.4], [1.6, -.9]].map(([a, b]) => `<circle cx="${x + a}" cy="${-4.6 + b}" r=".45" fill="#f6dbd5"/>`).join("") + `<circle cx="${x}" cy="-4.6" r="3.7" fill="none" stroke="#7a1626" stroke-width=".5"/>`).join("") });
  L.chickenslices = pack({ w: 32, h: 11, frame: "#e9eef3", t: "HÄHNCHENBRUST", tc: "#e8a10f", win: `<ellipse cx="-2" cy="-4.4" rx="11.6" ry="3.6" fill="#f2dcc7"/><ellipse cx="2" cy="-5" rx="11.6" ry="3.6" fill="#f7e8d8"/><path d="M-9 -5Q2 -8 13 -5" stroke="#fff" stroke-width=".8" fill="none" opacity=".7"/>` });
  L.sausage = pack({ w: 34, h: 12, frame: "#e9eef3", t: "WIENER", tc: "#c0392b", win: [-6.4, -3.6].map((y, i) => `<path d="M-13 ${y}Q0 ${y - 1.6} 13 ${y}" stroke="${["#c9774a", "#d6895a"][i]}" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M-12 ${y - .8}Q0 ${y - 2.2} 12 ${y - .8}" stroke="#fff" stroke-width=".6" fill="none" opacity=".45"/>`).join("") });
  L.bratwurst = tray({ base: "#2f3238", rim: "#50555e", food: [-12, -10.4].map((y, i) => `<path d="M-14 ${y}Q0 ${y - 3} 14 ${y}" stroke="${["#e7b9a7", "#f0c8b8"][i]}" stroke-width="3.6" stroke-linecap="round" fill="none"/>`).join("") });
  L.bacon = pack({ w: 32, h: 11, frame: "#e9eef3", t: "BACON", tc: "#8e1b1b", win: [-6.6, -4.4, -2.4].map((y, i) => `<path d="M-13 ${y}Q-6 ${y - 1.6} 0 ${y}T13 ${y}" stroke="${i % 2 ? "#f6dcd0" : "#c94b4b"}" stroke-width="2" fill="none"/>`).join("") });
  L.tuna = (() => { const w = 26, h = 10, d = RR(-w / 2, -h, w, h, 2);
    return I(w + 3, h + 5, sh(w) + P(d, "#2f6fbf") + `<rect x="${-w / 2}" y="${-h + 2.6}" width="${w}" height="5" fill="#fff"/>` + txt("THUNFISCH", -h + 6.4, 2.9, "#2f6fbf") +
      `<path d="M${w / 2 - 6} ${-h + 4}l2.4 1.2-2.4 1.2z" fill="#2f6fbf"/>` + S(d, "fiCyl") + `<ellipse cx="0" cy="${-h}" rx="${w / 2}" ry="2" fill="#d1d6dc"/><ellipse cx="0" cy="${-h}" rx="${w / 2 - 1.6}" ry="1.4" fill="#e6e9ee"/><ellipse cx="${w / 2 - 5}" cy="${-h}" rx="2.2" ry=".8" fill="#b9c0c8"/>`); })();
  L.fishsticks = box({ c: "#2f6fbf", top: "#f2c12e", t: "FISCHSTÄBCHEN", w: 32, h: 13, sideW: 3, motif: [-10, -3, 4].map(x => `<rect x="${x - 3}" y="-6" width="6" height="3" rx="1" fill="#e9a740"/><rect x="${x - 3}" y="-6" width="6" height="1" rx=".5" fill="#f5c76a"/>`).join("") });
  L.tofu = pack({ w: 28, h: 12, frame: "#e9eef3", t: "TOFU", tc: "#2f7d32", win: `<rect x="-11" y="-8.4" width="22" height="7" rx="1" fill="#f6f0dc"/><rect x="-11" y="-8.4" width="22" height="7" rx="1" fill="url(#fiSoft)"/>` });
  L.hummus = tub({ t: "HUMMUS", c: "#c28c2f", w: 24, h: 11, lid: "#e8c27a", band: .5 });

  /* ===== Gemüse ===== */
  L.broccoli = I(28, 34, sh(22) + `<path d="M-3.4 0L-2.6 -14H2.6L3.4 0Z" fill="#9cc56a"/><path d="M-3.4 0L-2.6 -14H2.6L3.4 0Z" fill="url(#fiCyl)"/><path d="M0 -12L-6 -18M0 -12L6 -18" stroke="#8bb85a" stroke-width="2.4" stroke-linecap="round"/>` +
    [[-9, -15, 5], [9, -16, 5], [-6, -22, 6.5], [5, -23, 7], [0, -29, 6.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#3a8a35"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#fiSph)"/>` +
      [[-.35, -.3], [.3, -.1], [-.1, .35], [.35, .4]].map(([a, b]) => `<circle cx="${r2(x + a * r)}" cy="${r2(y + b * r)}" r="${r2(r * .28)}" fill="#4fa046" opacity=".8"/>`).join("")).join(""));
  L.cauliflower = I(30, 28, sh(28) + `<path d="M-15 -6Q-17 -1 -10 0H10Q17 -1 15 -6Q8 -3 0 -4Q-8 -3 -15 -6Z" fill="#6f9e4c"/>` + [[-10, -7, 4], [10, -7, 4], [-7, -12, 6.5], [6, -12, 6.5], [0, -18, 7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f3ead2"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#fiSph)" opacity=".7"/>`).join(""));
  L.pepper = (() => { const d = `M-10 -16C-11 -6 -6 0 -2 0C0 -2 2 -2 3 0C7 0 11 -7 10 -16C9 -21 -9 -21 -10 -16Z`;
    return I(24, 30, sh(20) + P(d, "#d9261a") + `<path d="M0 -17Q-1 -8 0 -1" stroke="#000" stroke-opacity=".14" stroke-width="1.6" fill="none"/>` + S(d, "fiSph") +
      `<path d="M-6.5 -15Q-7.6 -9 -5.6 -5" stroke="#fff" stroke-width="1.6" opacity=".55" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-19" rx="4.2" ry="1.7" fill="#3f8f3a"/><path d="M-.5 -19.6C-1 -23 1 -25 4 -26" stroke="#3f8f3a" stroke-width="2.2" fill="none" stroke-linecap="round"/>`); })();
  L.pepperY = { ...L.pepper, svg: L.pepper.svg.replace("#d9261a", "#f2c12e") };
  L.pepperG = { ...L.pepper, svg: L.pepper.svg.replace("#d9261a", "#4c9a3f") };
  L.tomato = round({ c: "#e2382a", d: "", r: 8, shape: "round", stem: "", leaf: "", spot: `<path d="M-4.6 -16.2L0 -14L4.6 -16.2L2 -13.4L5.4 -12L0 -12.8L-5.4 -12L-2 -13.4Z" fill="#3f8f3a"/>` });
  L.cherrytomato = I(26, 12, sh(24) + [[-7, -4], [0, -5], [7, -4], [-3.5, -8.5], [3.5, -8.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#e2382a"/><circle cx="${x}" cy="${y}" r="3.6" fill="url(#fiSph)"/><path d="M${x - 1.2} ${y - 3.4}L${x} ${y - 2.6}L${x + 1.2} ${y - 3.4}" stroke="#3f8f3a" stroke-width=".7" fill="none"/>`).join(""));
  L.cucumber = oblong({ c: "#3e8a3a", d: "#2a6a27", len: 32, r: 4, extra: [-9, -2, 5, 11].map(x => `<circle cx="${x}" cy="-5.6" r=".55" fill="#a9d18e"/>`).join("") });
  L.zucchini = oblong({ c: "#2f6e2a", d: "#1f4f1c", len: 32, r: 4.4, extra: `<rect x="15" y="-6.4" width="4" height="3" rx="1" fill="#9cc56a"/><path d="M-12 -6.4H10" stroke="#5f9c49" stroke-width=".5" opacity=".7"/>` });
  L.eggplant = I(34, 14, sh(30) + `<path d="M-14 -6C-14 -12 -4 -12 4 -10C12 -9 15 -6 13 -3C10 0 -14 1 -14 -6Z" fill="#4b2a5c"/><path d="M-14 -6C-14 -12 -4 -12 4 -10C12 -9 15 -6 13 -3C10 0 -14 1 -14 -6Z" fill="url(#fiSph)"/><path d="M11 -9L15 -11L16 -7L13 -5Z" fill="#4c7a2a"/><path d="M15.4 -9.4L18 -10.6" stroke="#4c7a2a" stroke-width="1.6" stroke-linecap="round"/>`);
  L.carrot = I(36, 12, sh(30) + `<path d="M-12 -9Q4 -8.4 17 -4.4Q4 -.4 -12 -1Z" fill="#ef8524"/><path d="M-12 -9Q4 -8.4 17 -4.4Q4 -.4 -12 -1Z" fill="url(#fiSoft)"/><path d="M-8 -7.6L-6.6 -4.4M-2 -7.4L-.8 -4.6M4 -6.8L4.8 -4.6M9 -5.8L9.6 -4.4" stroke="#c96614" stroke-width=".6"/>` +
    `<path d="M-12 -6L-17 -10.4M-12 -5L-18.4 -6.4M-12 -5L-16.4 -1.6" stroke="#4c9a3f" stroke-width="1.6" stroke-linecap="round"/>`);
  L.onion = round({ c: "#d39448", d: "", r: 8, shape: "round", leaf: "", stem: "#a8692a", spot: `<path d="M-5 -14Q0 -1 5 -14M-2 -15.6Q0 -4 2 -15.6" stroke="#a8692a" stroke-width=".55" fill="none" opacity=".7"/><path d="M-2 .2L-3 2.2M0 .3V2.6M2 .2L3 2.2" stroke="#8a5a2a" stroke-width=".6"/>` });
  L.redonion = round({ c: "#8e3b6e", d: "", r: 8, shape: "round", leaf: "", stem: "#5e2247", spot: `<path d="M-5 -14Q0 -1 5 -14" stroke="#5e2247" stroke-width=".55" fill="none" opacity=".6"/>` });
  L.springonion = I(36, 8, sh(30) + [-3, -1.4].map((y, i) => `<path d="M-15 ${y - 1}H2" stroke="${["#f4f1e6", "#ece7d6"][i]}" stroke-width="2.2" stroke-linecap="round"/><path d="M2 ${y - 1}H17" stroke="${["#4c9a3f", "#5fae4c"][i]}" stroke-width="2.2" stroke-linecap="round"/>`).join("") + `<path d="M-16 -3.6L-18 -4.6M-16 -2.6L-18.4 -2.2" stroke="#d8cfc0" stroke-width=".5"/>`);
  L.leek = I(38, 10, sh(32) + `<path d="M-16 -5H2" stroke="#f1eedf" stroke-width="5" stroke-linecap="round"/><path d="M2 -5L18 -7M2 -5L18 -3" stroke="#3f7d3a" stroke-width="3" stroke-linecap="round"/><path d="M-16 -5H2" stroke="url(#fiCyl)" stroke-width="5"/>`);
  L.garlic = I(18, 18, sh(16) + `<path d="M0 -15C-8.6 -12 -9.6 -2 -4 0H4C9.6 -2 8.6 -12 0 -15Z" fill="#f4efe6"/><path d="M0 -15C-8.6 -12 -9.6 -2 -4 0H4C9.6 -2 8.6 -12 0 -15Z" fill="url(#fiSph)" opacity=".6"/><path d="M0 -15V-18.4M-3 -12Q-4.4 -5 -2 0M3 -12Q4.4 -5 2 0" stroke="#d8cfc0" stroke-width=".8" fill="none"/><path d="M-3 -12Q-4.4 -5 -2 0" stroke="#e8c8d4" stroke-width=".6" fill="none" opacity=".6"/>`);
  L.ginger = I(24, 12, sh(22) + `<path d="M-11 -4C-12 -8 -6 -9 -3 -7C-2 -11 3 -11 3 -7C6 -9 11 -7 10 -3C9 0 -10 0 -11 -4Z" fill="#d9b27a"/><path d="M-11 -4C-12 -8 -6 -9 -3 -7C-2 -11 3 -11 3 -7C6 -9 11 -7 10 -3C9 0 -10 0 -11 -4Z" fill="url(#fiSoft)"/><path d="M-6 -4.4H-3M2 -4H5" stroke="#b98d55" stroke-width=".6"/>`);
  L.chili = I(26, 8, sh(22) + `<path d="M-10 -4Q0 -7 11 -2Q0 -1 -10 -3Z" fill="#d9261a"/><path d="M-10 -4Q0 -7 11 -2Q0 -1 -10 -3Z" fill="url(#fiSoft)"/><path d="M-10 -3.6L-13 -5.6" stroke="#3f8f3a" stroke-width="1.4" stroke-linecap="round"/>`);
  L.potato = I(24, 16, sh(22) + `<path d="M-11 -6C-12 -12 -2 -14 6 -12C12 -10 12 -2 6 -1C0 0 -10 0 -11 -6Z" fill="#caa36a"/><path d="M-11 -6C-12 -12 -2 -14 6 -12C12 -10 12 -2 6 -1C0 0 -10 0 -11 -6Z" fill="url(#fiSph)"/><circle cx="-4" cy="-8" r=".8" fill="#9c7a48"/><circle cx="4" cy="-6" r=".7" fill="#9c7a48"/><circle cx="1" cy="-10" r=".6" fill="#9c7a48"/>`);
  L.sweetpotato = I(30, 14, sh(28) + `<path d="M-14 -6C-10 -12 8 -12 14 -6C8 -1 -10 -1 -14 -6Z" fill="#b5553a"/><path d="M-14 -6C-10 -12 8 -12 14 -6C8 -1 -10 -1 -14 -6Z" fill="url(#fiSph)"/><path d="M-8 -8Q0 -9 8 -8" stroke="#d47a5c" stroke-width=".7" fill="none"/>`);
  L.potatoes = I(36, 24, sh(34) + `<path d="M-16 0V-15Q0 -23 16 -15V0Z" fill="#c9a26b" opacity=".3"/>` + [[-8, -5], [4, -5], [-3, -12.4], [8, -12]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6.2" ry="4.8" fill="#caa36a"/><ellipse cx="${x}" cy="${y}" rx="6.2" ry="4.8" fill="url(#fiSph)"/><circle cx="${x - 1.5}" cy="${y - 1}" r=".6" fill="#9c7a48"/>`).join("") +
    `<path d="M-16 0V-15Q0 -23 16 -15V0" fill="none" stroke="#d24b3a" stroke-width=".8" stroke-dasharray="1.6 1.2"/><path d="M-16 -15Q0 -23 16 -15" fill="none" stroke="#d24b3a" stroke-width=".5" stroke-dasharray="1.6 1.2" transform="translate(0 6)"/><rect x="-6" y="-22.4" width="12" height="4.4" rx="1" fill="#d24b3a"/>` + txt("KARTOFFELN", -19.2, 2.2));
  L.mushroom = I(30, 18, sh(28) + [[-7, 0], [6, 1]].map(([x, s]) => `<rect x="${x - 2}" y="-7" width="4" height="7" rx="1.5" fill="#efe6da"/><path d="M${x - 7.4} -6C${x - 7.4} -14.6 ${x + 7.4} -14.6 ${x + 7.4} -6Q${x} -4.6 ${x - 7.4} -6Z" fill="${s ? "#c8a98a" : "#d9bfa3"}"/><path d="M${x - 7.4} -6C${x - 7.4} -14.6 ${x + 7.4} -14.6 ${x + 7.4} -6Q${x} -4.6 ${x - 7.4} -6Z" fill="url(#fiSph)"/>`).join(""));
  L.lettuce = I(30, 24, sh(28) + [[-7, -9, 8, "#79b84a"], [7, -9, 8, "#6aa83d"], [0, -14, 9, "#92cf5c"], [0, -7, 8, "#5d9a34"]].map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#fiSph)" opacity=".7"/>`).join("") + `<path d="M0 -21V-2M-6 -14L0 -8L6 -14M-4 -18L0 -13L4 -18" stroke="#d8eeb6" stroke-width=".8" fill="none"/>`);
  L.spinach = bag({ c: "#eef6e6", band: "#3f8f3a", t: "SPINAT", w: 26, h: 30, win: (w, h, x, y) => [0, 1, 2, 3, 4, 5].map(i => { const cx = x + 4 + (i % 3) * 7, cy = y + 4 + Math.floor(i / 3) * 6; return `<ellipse cx="${cx}" cy="${cy}" rx="3.6" ry="2.2" fill="${i % 2 ? "#2f7d32" : "#3f8f3a"}" transform="rotate(${i * 35 - 40} ${cx} ${cy})"/>`; }).join("") });
  L.rucola = bag({ c: "#eef6e6", band: "#5a8f2a", t: "RUCOLA", w: 24, h: 28, win: (w, h, x, y) => Array.from({ length: 7 }, (_, i) => { const cx = x + 3 + (i % 4) * 4.6, cy = y + 3.6 + Math.floor(i / 4) * 5; return `<path d="M${cx - 2.5} ${cy}h5M${cx - 1} ${cy - 1.4}v2.8M${cx + 1} ${cy - 1.4}v2.8" stroke="#3f7d2a" stroke-width="1.3" stroke-linecap="round"/>`; }).join("") });
  L.avocado = I(20, 26, sh(18) + `<path d="M0 -24C-5 -24 -6 -16 -8 -12C-11 -6 -8 0 0 0C8 0 11 -6 8 -12C6 -16 5 -24 0 -24Z" fill="#33501a"/><path d="M0 -24C-5 -24 -6 -16 -8 -12C-11 -6 -8 0 0 0C8 0 11 -6 8 -12C6 -16 5 -24 0 -24Z" fill="url(#fiSph)"/>` +
    `<path d="M0 -18.4C-3 -18.4 -4 -12 -5.2 -10C-7.2 -6 -5 -2.6 0 -2.6C5 -2.6 7.2 -6 5.2 -10C4 -12 3 -18.4 0 -18.4Z" fill="#cfe07a"/><path d="M0 -18.4C-3 -18.4 -4 -12 -5.2 -10C-7.2 -6 -5 -2.6 0 -2.6" fill="none" stroke="#a8c45a" stroke-width="1"/><circle cx="0" cy="-8" r="3.3" fill="#7a4a22"/><circle cx="0" cy="-8" r="3.3" fill="url(#fiSph)"/>`);
  L.corn = can({ c: "#f2c12e", t: "MAIS", band: "#2f7d32", tc: "#fff", art: `<path d="M-3 -9Q0 -14 3 -9" stroke="#f7dd6a" stroke-width="2" fill="none"/>` });
  L.beans = can({ c: "#8e3b2b", t: "KIDNEY", band: "#f4efe6" });
  L.chickpeas = can({ c: "#d9a441", t: "KICHERERBSEN", band: "#fff", tc: "#8a5a1a" });
  L.lentils = bag({ c: "#f7f1e4", band: "#b5553a", t: "LINSEN", w: 22, h: 28, fillPat: "fiCrumb", winBg: "#e9dcc6", win: (w, h, x, y) => Array.from({ length: 12 }, (_, i) => `<ellipse cx="${x + 2.6 + (i % 4) * 4.4}" cy="${y + 3 + Math.floor(i / 4) * 3.4}" rx="1.6" ry="1.1" fill="#c96b3d"/>`).join("") });
  L.passata = jar({ glass: "#f4d6d0", fill: "#b8261a", lid: "#2f7d32", t: "PASSATA", w: 16, h: 30, label: "#fff", lc: "#b8261a" });
  L.tomatopaste = (() => { const d = `M-12 -6Q-12 -9 -9 -9H10L13 -7.4V-4.6L10 -3H-9Q-12 -3 -12 -6Z`;
    return I(30, 12, sh(26) + P(d, "#c9ced5") + `<rect x="-7" y="-9" width="14" height="6" fill="#c0392b"/>` + txt("MARK", -4.8, 2.6) + `<rect x="13" y="-7" width="3" height="2" rx=".5" fill="#c0392b"/>` + S(d, "fiDown")); })();
  L.tomatocan = can({ c: "#c0392b", t: "TOMATEN", band: "#fff", art: `<circle cx="0" cy="-9.4" r="2.4" fill="#e2382a"/>` });
  L.frozenveg = bag({ c: "#2f6fbf", band: "#1d4f96", t: "GEMÜSE", w: 28, h: 34, top: "crimp", win: (w, h, x, y) => [["#f28c28", 0], ["#3f8f3a", 1], ["#f2c12e", 2], ["#3f8f3a", 3], ["#f28c28", 4], ["#e8392b", 5], ["#6abf4b", 6], ["#f2c12e", 7], ["#3f8f3a", 8]].map(([c, i]) => `<circle cx="${x + 3.6 + (i % 3) * 6.4}" cy="${y + 3.6 + Math.floor(i / 3) * 5.2}" r="2.4" fill="${c}"/>`).join("") });
  L.peas = bag({ c: "#2f6fbf", band: "#1d4f96", t: "ERBSEN", w: 26, h: 32, top: "crimp", win: (w, h, x, y) => Array.from({ length: 12 }, (_, i) => `<circle cx="${x + 2.6 + (i % 4) * 4.4}" cy="${y + 3 + Math.floor(i / 4) * 4.6}" r="2" fill="#6abf4b"/><circle cx="${x + 2.1 + (i % 4) * 4.4}" cy="${y + 2.5 + Math.floor(i / 4) * 4.6}" r=".6" fill="#c8eab4"/>`).join("") });
  L.frozenspinach = box({ c: "#2f7d32", top: "#1f5f22", t: "RAHMSPINAT", w: 26, h: 16, sideW: 3 });

  /* ===== Obst ===== */
  L.apple = round({ c: "#d92c25", d: "#f3a33a", r: 9 });
  L.greenapple = round({ c: "#8cc63f", d: "#d6e66a", r: 9 });
  L.pear = round({ c: "#c8d65a", d: "#e1b04a", r: 8, shape: "pear" });
  L.orange = round({ c: "#f5901c", d: "", r: 9, shape: "round", stem: "", leaf: "#4c9a3f", spot: `<circle cx="0" cy="-17.6" r=".9" fill="#7a8a2a"/>` + Array.from({ length: 10 }, (_, i) => `<circle cx="${r2(Math.cos(i * 2.4) * 5)}" cy="${r2(-9 + Math.sin(i * 2.4) * 5)}" r=".35" fill="#c96c08" opacity=".5"/>`).join("") });
  L.mandarin = round({ c: "#f7861c", d: "", r: 7, shape: "round", stem: "", leaf: "#4c9a3f" });
  L.lemon = round({ c: "#f6d42e", d: "", r: 7, shape: "lemon", stem: "", leaf: "" });
  L.lime = round({ c: "#7fbf3a", d: "", r: 6.5, shape: "lemon", stem: "", leaf: "" });
  L.peach = round({ c: "#f5a25c", d: "#e2523a", r: 8.5, shape: "round", stem: "#6b4426", leaf: "#4c9a3f", spot: `<path d="M-1 -17Q-3 -9 -1 -1" stroke="#d9603a" stroke-width=".8" fill="none" opacity=".6"/>` });
  L.plum = round({ c: "#4a2a6a", d: "#8a4a9a", r: 6.5, shape: "round", stem: "#6b4426", leaf: "" });
  L.kiwi = I(22, 16, sh(20) + `<ellipse cx="0" cy="-7" rx="10" ry="7" fill="#8b6a3e"/><ellipse cx="0" cy="-7" rx="10" ry="7" fill="url(#fiSph)"/><ellipse cx="4" cy="-7.5" rx="5.6" ry="5.6" fill="#8fc23a"/><ellipse cx="4" cy="-7.5" rx="5.6" ry="5.6" fill="none" stroke="#c9b48a" stroke-width=".6"/><ellipse cx="4" cy="-7.5" rx="2" ry="2" fill="#f4f1c9"/>` + Array.from({ length: 10 }, (_, i) => `<ellipse cx="${r2(4 + Math.cos(i * .628) * 3.3)}" cy="${r2(-7.5 + Math.sin(i * .628) * 3.3)}" rx=".5" ry=".3" fill="#222" transform="rotate(${i * 36} ${r2(4 + Math.cos(i * .628) * 3.3)} ${r2(-7.5 + Math.sin(i * .628) * 3.3)})"/>`).join(""));
  L.banana = I(38, 18, sh(30) + `<path d="M-16 -6C-10 2 10 2 16 -10C14 -11 12 -10 11 -9C6 -3 -8 -2 -13 -8Z" fill="#e8bd2a"/><path d="M-15 -10C-8 -2 10 -3 16 -14C14 -15 12 -14 11 -13C6 -6 -7 -6 -12 -12Z" fill="#fbd94a"/><path d="M-15 -10C-8 -2 10 -3 16 -14C14 -15 12 -14 11 -13C6 -6 -7 -6 -12 -12Z" fill="url(#fiTop)"/>` +
    `<path d="M-12 -9.6C-6 -4.6 7 -5 13 -12.6" stroke="#d7a51e" stroke-width=".6" fill="none"/><path d="M16 -14L18.4 -16.4M16 -10L18.4 -11" stroke="#5a4420" stroke-width="1.6" stroke-linecap="round"/><path d="M-14 -11L-16 -12" stroke="#3a2a14" stroke-width="1.6" stroke-linecap="round"/>`);
  L.grapes = I(24, 30, sh(18) + [[0, -24], [-5, -20], [5, -20], [-7, -14], [0, -15], [7, -14], [-4, -9], [4, -9], [0, -4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.7" fill="#6e4596"/><circle cx="${x}" cy="${y}" r="3.7" fill="url(#fiSph)"/>`).join("") + `<path d="M0 -27L1 -31" stroke="#6b4426" stroke-width="1.2"/>`);
  const punnet = (berry, c = "#f4efe6") => { const d = `M-13 -11H13L11 0H-11Z`; return I(28, 21, sh(26) + berry + P(d, c, ` opacity=".92"`) + `<path d="M-12 -7H12M-11.4 -3.6H11.4" stroke="#000" stroke-opacity=".08" stroke-width=".6"/>` + S(d, "fiDown")); };
  L.berries = punnet([[-8, -12], [-3, -13], [2, -12], [7, -13], [-5, -15], [1, -16], [6, -15.5], [-1, -11]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.8" fill="#34306e"/><circle cx="${x}" cy="${y}" r="2.8" fill="url(#fiSph)"/><circle cx="${x}" cy="${y - 2}" r=".6" fill="#1d1a44"/>`).join(""));
  L.raspberry = punnet([[-8, -12], [-2.6, -13], [3, -12], [8, -12.6], [-5, -15.4], [1, -16], [6, -15.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#d21f4f"/>` + [[-1, -1], [1, -1], [0, .4], [-1.2, .8], [1.2, .8], [0, -1.8]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r=".95" fill="#e8406c"/>`).join("") + `<circle cx="${x}" cy="${y}" r="3" fill="url(#fiSph)" opacity=".6"/>`).join(""), "#f5f7f2");
  L.strawberry = punnet([[-7, -11], [0, -12], [7, -11], [-3.4, -15], [4, -15]].map(([x, y]) => { const d = `M${x} ${y + 4.2}C${x - 4.2} ${y} ${x - 3.4} ${y - 4} ${x} ${y - 3}C${x + 3.4} ${y - 4} ${x + 4.2} ${y} ${x} ${y + 4.2}Z`; return P(d, "#df2a34") + `<path d="${d}" fill="url(#fiSeed)"/>` + S(d, "fiSph") + `<path d="M${x - 2.2} ${y - 3.6}L${x} ${y - 2.4}L${x + 2.2} ${y - 3.6}M${x} ${y - 2.6}V${y - 4.6}" stroke="#3f8f3a" stroke-width="1.1" fill="none"/>`; }).join(""));
  L.cherries = I(24, 22, sh(20) + `<path d="M-5 -9Q-2 -18 3 -21M5 -8Q4 -16 3 -21" stroke="#5a7a2a" stroke-width="1" fill="none"/><path d="M3 -21Q7 -23 9 -20Q6 -19 3 -21Z" fill="#4c9a3f"/>` + [[-5, -6], [5, -5.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="#a3101f"/><circle cx="${x}" cy="${y}" r="4.6" fill="url(#fiSph)"/>`).join(""));
  L.mango = I(24, 20, sh(22) + `<path d="M-11 -8C-11 -16 8 -18 11 -9C12 -3 4 0 -3 0C-8 0 -11 -3 -11 -8Z" fill="#f6a723"/><path d="M-2 -16C4 -17 10 -13 11 -9C9 -6 4 -8 -2 -16Z" fill="#e2502b" opacity=".7"/><path d="M-11 -8C-11 -16 8 -18 11 -9C12 -3 4 0 -3 0C-8 0 -11 -3 -11 -8Z" fill="url(#fiSph)"/>`);
  L.pineapple = I(20, 38, sh(18) + `<ellipse cx="0" cy="-10" rx="8" ry="10" fill="#d99a28"/>` + [-4, 0, 4].map(x => `<path d="M${x - 4} -18L${x + 4} -3M${x + 4} -18L${x - 4} -3" stroke="#a8701a" stroke-width=".6"/>`).join("") + `<ellipse cx="0" cy="-10" rx="8" ry="10" fill="url(#fiSph)"/><path d="M0 -20L-5 -32M0 -20L0 -35M0 -20L5 -32M0 -20L-8 -27M0 -20L8 -27" stroke="#3f8f3a" stroke-width="2" stroke-linecap="round"/>`);
  L.melon = I(32, 26, sh(30) + `<circle cx="0" cy="-12" r="12" fill="#3f8a35"/><path d="M-6 -23Q-9.6 -12 -6 -1M0 -24V0M6 -23Q9.6 -12 6 -1M-10.6 -18Q-12.6 -12 -10.6 -6M10.6 -18Q12.6 -12 10.6 -6" stroke="#1f5a1c" stroke-width="1.6" fill="none"/><circle cx="0" cy="-12" r="12" fill="url(#fiSph)"/>`);
  L.dates = I(26, 10, sh(24) + [-8, -2, 4, 9].map(x => `<ellipse cx="${x}" cy="-3.5" rx="3.4" ry="2.6" fill="#6e3c18"/><ellipse cx="${x}" cy="-3.5" rx="3.4" ry="2.6" fill="url(#fiSph)"/>`).join(""));
  L.pomegranate = round({ c: "#b52234", d: "#e0574a", r: 8.5, shape: "round", stem: "", leaf: "", spot: `<path d="M-2 -17.6L-2.6 -19.6L-1 -18.6L0 -20.4L1 -18.6L2.6 -19.6L2 -17.6Z" fill="#8e1b28"/>` });

  /* ===== Tiefkühl ===== */
  L.frozenberries = bag({ c: "#4a69d9", band: "#26409e", t: "BEEREN", w: 26, h: 34, top: "crimp", win: (w, h, x, y) => [[3, 4, "#34306e"], [9, 3, "#d21f4f"], [15, 5, "#34306e"], [6, 9, "#d21f4f"], [12, 10, "#34306e"], [3, 13, "#d21f4f"], [16, 13, "#34306e"]].map(([a, b, c]) => `<circle cx="${x + a}" cy="${y + b}" r="2.6" fill="${c}"/><circle cx="${x + a - .8}" cy="${y + b - .8}" r=".7" fill="#fff" opacity=".4"/>`).join("") });
  L.pizza = (() => { const d = RR(-19, -7, 38, 7, 1);
    return I(40, 9, sh(38) + P(d, "#c0392b") + `<rect x="-19" y="-7" width="38" height="2" fill="#e74c3c"/><circle cx="-10" cy="-3.4" r="3" fill="#f2c341"/><circle cx="-10" cy="-3.4" r="1" fill="#c0392b"/>` + txt("PIZZA", -1.4, 3.8, "#fff", 800, 4) + S(d, "fiFlat")); })();
  L.icecream = tub({ t: "EIS", sub: "Vanille", c: "#f3a6c8", w: 28, h: 15, lid: "#e57fae" });
  L.fries = bag({ c: "#f2c12e", band: "#c0392b", t: "POMMES", w: 26, h: 34, top: "crimp", win: (w, h, x, y) => Array.from({ length: 7 }, (_, i) => `<rect x="${x + 1.6 + i * 2.5}" y="${y + 1.6 + (i % 2) * 2}" width="1.8" height="10" rx=".6" fill="${i % 2 ? "#f7dd77" : "#efc95a"}" transform="rotate(${(i % 3) * 9 - 9} ${x + 2.5 + i * 2.5} ${y + 6})"/>`).join("") });
  L.frozenchicken = bag({ c: "#e9eef3", band: "#c0392b", t: "NUGGETS", w: 26, h: 32, top: "crimp", win: (w, h, x, y) => [[4, 4], [11, 3.6], [7.4, 9], [14, 9.4]].map(([a, b]) => `<path d="M${x + a - 3} ${y + b}Q${x + a - 3} ${y + b - 2.6} ${x + a} ${y + b - 2.4}Q${x + a + 3.2} ${y + b - 2} ${x + a + 2.8} ${y + b + .6}Q${x + a} ${y + b + 2.6} ${x + a - 3} ${y + b}Z" fill="#d9a04a"/>`).join("") });

  /* ===== Kohlenhydrate ===== */
  L.rice = bag({ c: "#f7f3ea", band: "#c43c2f", t: "REIS", w: 26, h: 34, fillPat: "fiRice", winBg: "#e4dac4", win: () => "" });
  L.basmati = bag({ c: "#f1e6cf", band: "#6b2a6e", t: "BASMATI", w: 24, h: 34, fillPat: "fiRice", winBg: "#e0d2b2", win: () => "" });
  L.ricecup = box({ c: "#fff", top: "#c43c2f", t: "KOCHBEUTEL", w: 26, h: 18, sideW: 4, motif: `<rect x="-9" y="-9" width="14" height="6" rx="2" fill="url(#fiRice)"/><rect x="-9" y="-9" width="14" height="6" rx="2" fill="none" stroke="#e1d7c0" stroke-width=".5"/>` });
  L.pasta = bag({ c: "#fff8e4", band: "#1f5fae", t: "PENNE", w: 26, h: 34, win: (w, h, x, y) => Array.from({ length: 12 }, (_, i) => { const cx = x + 2 + (i % 3) * 6, cy = y + 2.4 + Math.floor(i / 3) * 4.4; return `<rect x="${cx}" y="${cy}" width="5" height="2.2" rx=".6" fill="${i % 2 ? "#f0c55a" : "#e8b84a"}" transform="rotate(${(i * 37) % 60 - 30} ${cx + 2.5} ${cy + 1})"/>`; }).join("") });
  L.fusilli = bag({ c: "#fff8e4", band: "#2f7d32", t: "FUSILLI", w: 26, h: 34, win: (w, h, x, y) => Array.from({ length: 6 }, (_, i) => { const cx = x + 4 + (i % 3) * 6.4, cy = y + 4 + Math.floor(i / 3) * 7; return `<path d="M${cx - 3} ${cy}q1.5-2 3 0t3 0" stroke="#e8b84a" stroke-width="1.8" fill="none" stroke-linecap="round" transform="rotate(${i * 25 - 30} ${cx} ${cy})"/>`; }).join("") });
  L.spaghetti = I(14, 46, sh(12) + `<rect x="-5" y="-44" width="10" height="44" rx="2" fill="#fbf3dd"/>` + [-3.4, -1.7, 0, 1.7, 3.4].map(x => `<line x1="${x}" y1="-42" x2="${x}" y2="-2" stroke="#ecc25a" stroke-width=".9"/>`).join("") + `<rect x="-5" y="-28" width="10" height="10" fill="#1f5fae"/>` + txt("SPAG.", -21.6, 2.4) + S(RR(-5, -44, 10, 44, 2), "fiCyl"));
  L.noodles = box({ c: "#f6e7c4", top: "#c0392b", t: "MIE", w: 24, h: 14, sideW: 3, motif: `<path d="M-9 -4q1.5-2.4 3 0t3 0 3 0 3 0 3 0" stroke="#e2b04a" stroke-width="1" fill="none"/>` });
  L.gnocchi = bag({ c: "#fff8e4", band: "#2f7d32", t: "GNOCCHI", w: 26, h: 26, win: (w, h, x, y) => [[4, 3.6], [10, 3], [15.4, 4], [6.6, 8], [12.6, 8]].map(([a, b]) => `<ellipse cx="${x + a}" cy="${y + b}" rx="2.8" ry="2" fill="#f2dfa8"/><path d="M${x + a - 1.6} ${y + b}h3.2" stroke="#d9bf7a" stroke-width=".5"/>`).join("") });
  L.couscous = box({ c: "#f2c12e", top: "#7a3e1a", t: "COUSCOUS", w: 22, h: 26, motif: `<ellipse cx="-2" cy="-10" rx="7" ry="4.6" fill="#f6e3a4"/><ellipse cx="-2" cy="-10" rx="7" ry="4.6" fill="url(#fiCrumb)"/>` });
  L.quinoa = bag({ c: "#f3ece0", band: "#7a3e1a", t: "QUINOA", w: 22, h: 30, fillPat: "fiCrumb", winBg: "#ead9b4", win: () => "" });
  L.oats = (() => { const it = bag({ c: "#f8f1df", band: "#2f7d32", t: "HAFERFLOCKEN", w: 26, h: 34, fillPat: "fiOats", winBg: "#f3e6c4", win: () => "" }); return it; })();
  L.cereal = box({ c: "#f2c12e", top: "#c0392b", t: "MÜSLI", w: 24, h: 38, motif: `<ellipse cx="-2.4" cy="-15" rx="8" ry="5" fill="#fff"/>` + [[-6, -16], [-2, -14], [2, -16], [-4, -18], [0, -18.4], [-7.6, -14.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="#b8742a"/>`).join("") + `<circle cx="1.4" cy="-13.4" r="1.4" fill="#c0392b"/>` });
  L.cornflakes = box({ c: "#f7f4ee", top: "#d9261a", t: "CORNFLAKES", w: 24, h: 38, motif: `<ellipse cx="-2.4" cy="-15" rx="8" ry="5" fill="#2f6fbf"/>` + [[-6, -16], [-2, -14.4], [2, -16], [-4, -18], [0, -18.4]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="1.3" fill="#e8a92b" transform="rotate(${x * 10} ${x} ${y})"/>`).join("") });
  L.granola = bag({ c: "#f6ead2", band: "#7a3e1a", t: "GRANOLA", w: 24, h: 32, fillPat: "fiOats", winBg: "#e9d3a2", win: (w, h, x, y) => [[4, 4], [11, 7], [7, 11]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="1.6" fill="#7a3a6e"/>`).join("") });
  L.bread = I(36, 18, sh(32) + `<path d="M-16 0V-8C-16 -17.4 16 -17.4 16 -8V0Z" fill="#c4823d"/><path d="M-16 0V-8C-16 -17.4 16 -17.4 16 -8V0Z" fill="url(#fiSph)"/><path d="M-9 -14.4L-6 -9.4M-1.4 -15.6L1.6 -10.4M6 -14.6L9 -9.6" stroke="#f0cc93" stroke-width="1.6" stroke-linecap="round"/>`);
  L.wholegrain = (() => { const d = RR(-14, -15, 28, 15, 2.6);
    return I(30, 18, sh(28) + P(d, "#e9dcc6", ` opacity=".9"`) + `<rect x="-12" y="-12.6" width="24" height="11" rx="1.4" fill="#6b4426"/><rect x="-12" y="-12.6" width="24" height="11" rx="1.4" fill="url(#fiCrumb)"/>` +
      `<rect x="-14" y="-9" width="28" height="4.6" fill="#2f7d32"/>` + txt("VOLLKORN", -5.8, 2.8) + S(d, "fiBag", .7)); })();
  L.toast = (() => { const d = `M-15 0V-14Q-17 -21 -8 -21H8Q17 -21 15 -14V0Z`;
    return I(32, 23, sh(30) + `<path d="M-13 -1V-14Q-14.6 -19.6 -7 -19.6H7Q14.6 -19.6 13 -14V-1Z" fill="#f6dcae"/><path d="M-13 -1V-14Q-14.6 -19.6 -7 -19.6H7Q14.6 -19.6 13 -14V-1Z" fill="url(#fiCrumb)" opacity=".5"/>` +
      P(d, "#fff", ` opacity=".35"`) + `<rect x="-15" y="-10" width="30" height="6" fill="#d24b3a"/>` + txt("TOAST", -5.6, 3.8) + S(d, "fiBag", .7)); })();
  L.rolls = I(34, 14, sh(32) + [-8.4, 8.4].map(x => `<ellipse cx="${x}" cy="-6" rx="7.6" ry="5.6" fill="#d39545"/><ellipse cx="${x}" cy="-6" rx="7.6" ry="5.6" fill="url(#fiSph)"/><path d="M${x - 3.4} -9.4Q${x} -6 ${x + 3.4} -9.4" stroke="#f2d3a0" stroke-width="1.1" fill="none"/>`).join(""));
  L.wraps = (() => { const d = RR(-14, -8, 28, 8, 2.4); return I(30, 10, sh(28) + `<ellipse cx="0" cy="-4.4" rx="12.6" ry="2.6" fill="#f2deb4"/>` + P(d, "#fff", ` opacity=".4"`) + `<rect x="-14" y="-8" width="28" height="3" fill="#2f7d32"/>` + txt("WRAPS", -2, 2.8, "#7a5a2a") + S(d, "fiBag", .7)); })();
  L.ricecakes = I(20, 24, sh(18) + `<rect x="-8" y="-22" width="16" height="22" rx="7" fill="#f7f3ea"/>` + [-18.6, -14.6, -10.6, -6.6, -2.6].map(y => `<path d="M-7.4 ${y}H7.4" stroke="#e1d4b8" stroke-width=".7"/>`).join("") + `<rect x="-8" y="-15" width="16" height="6" fill="#d24b3a"/>` + txt("REISWAFF.", -11, 2.2) + S(RR(-8, -22, 16, 22, 7), "fiCyl") + S(RR(-8, -22, 16, 22, 7), "fiGlass", .6));
  L.crispbread = box({ c: "#f6ead2", top: "#c0392b", t: "KNÄCKE", w: 26, h: 14, sideW: 3, motif: `<rect x="-10" y="-5" width="16" height="3" rx=".8" fill="#d9b06a"/>` });

  /* ===== Öl, Backen, Gewürze, Saucen ===== */
  L.oil = bottle({ c: "#7f8a14", cap: "#2b5a2a", t: "OLIVENÖL", alpha: .9 });
  L.rapeoil = bottle({ c: "#f2c12e", cap: "#d4ae12", t: "RAPSÖL", alpha: .85, pet: true });
  L.vinegar = bottle({ c: "#4a1810", cap: "#222", t: "BALSAMICO", alpha: .92, h: 40, label: "#f4f0e2" });
  L.soy = bottle({ c: "#2a160c", cap: "#c0392b", t: "SOJA", h: 34, w: 12, label: "#fff", lc: "#c0392b" });
  L.ketchup = bottle({ c: "#b8241c", cap: "#fff", t: "KETCHUP", h: 34, w: 16, neck: 6, label: "#fff", lc: "#b8241c", pet: true });
  L.mustard = jar({ glass: "#f6e7b5", fill: "#d9a420", lid: "#c0392b", t: "SENF", w: 16, h: 20, label: "#fff", lc: "#c0392b" });
  L.mayo = jar({ glass: "#fbf8ef", fill: "#f6edcc", lid: "#1f5fae", t: "MAYO", w: 20, h: 22, lc: "#1f5fae" });
  L.pesto = jar({ glass: "#dbe7c9", fill: "#4c7a25", lid: "#c0392b", t: "PESTO", w: 18, h: 17, fillPat: "fiCrumb" });
  L.honey = jar({ glass: "#f6e7b5", fill: "#e3a024", lid: "#6b4426", t: "HONIG", lc: "#8a5a1a" });
  L.jam = jar({ glass: "#f2d0d6", fill: "#a51c34", lid: "#f1f3f6", t: "KONFITÜRE", w: 18, h: 22, fillPat: "fiSeed" });
  L.pb = jar({ glass: "#f2e4cc", fill: "#a8692a", lid: "#c0392b", t: "ERDNUSS", w: 22, h: 22, lc: "#a8692a" });
  L.nutella = jar({ glass: "#ece2d6", fill: "#4a2c18", lid: "#fff", t: "NUSS-NOUGAT", w: 20, h: 22, lc: "#4a2c18" });
  L.flour = bag({ c: "#fbf8f1", band: "#2f6fbf", t: "MEHL", w: 24, h: 32, win: (w, h, x, y) => `<path d="M${x + 4} ${y + h - 3}l3-6 2 3 3-8 3 11z" fill="#e7c25a"/>` });
  L.sugar = bag({ c: "#fbf8f1", band: "#d24b3a", t: "ZUCKER", w: 24, h: 30 });
  L.bakingpowder = I(12, 12, sh(10) + `<rect x="-5" y="-10" width="10" height="10" rx="1" fill="#f4e3c1"/><rect x="-5" y="-10" width="10" height="3" fill="#c0392b"/>` + S(RR(-5, -10, 10, 10, 1), "fiFlat"));
  L.salt = I(14, 28, sh(12) + `<rect x="-6" y="-24" width="12" height="24" rx="2" fill="#2f6fbf"/><path d="M-6 -24L-3 -27H3L6 -24Z" fill="#9fb8dc"/>` + txt("SALZ", -10, 3.4) + S(RR(-6, -24, 12, 24, 2), "fiCyl"));
  L.peppermill = I(12, 34, sh(10) + `<path d="M-4 0V-20Q-6 -26 -3 -30H3Q6 -26 4 -20V0Z" fill="#5a3a22"/><path d="M-4 0V-20Q-6 -26 -3 -30H3Q6 -26 4 -20V0Z" fill="url(#fiCyl)"/><circle cx="0" cy="-32" r="2" fill="#3a2414"/>`);
  const shaker = c => I(12, 24, sh(10) + `<rect x="-5" y="-18" width="10" height="18" rx="1.5" fill="#fff" opacity=".75"/><rect x="-4.3" y="-13" width="8.6" height="12.5" rx="1" fill="${c}"/><rect x="-5" y="-11" width="10" height="5" fill="#fff"/><rect x="-5" y="-22" width="10" height="4" rx="1" fill="#e8eef4"/>` + S(RR(-5, -22, 10, 22, 1.5), "fiCyl") + S(RR(-5, -18, 10, 18, 1.5), "fiGlass", .6));
  L.spice = shaker("#c0392b");
  L.cinnamon = shaker("#8a4b1f");
  L.herbs = shaker("#4c7a25");
  L.curry = shaker("#e0a020");
  L.stock = box({ c: "#f2c12e", top: "#c0392b", t: "BRÜHE", w: 20, h: 16, sideW: 3 });

  /* ===== Süßes & Snacks ===== */
  L.chocolate = (() => { const d = RR(-17, -8, 34, 8, 1); return I(36, 10, sh(34) + P(d, "#5a3018") + `<rect x="-17" y="-8" width="21" height="8" fill="#7d4bb3"/>` + txt("SCHOKOLADE", -2.2, 2.6, "#fff", 800, -6.5) + `<path d="M4 -8H17M4 -4H17M10.5 -8V0" stroke="#7a4a2a" stroke-width=".7"/>` + S(d, "fiFlat")); })();
  L.proteinbar = (() => { const d = `M-15 -7H15L16.4 -5.6L15 -4.2L16.4 -2.8L15 -1.4V0H-15V-1.4L-16.4 -2.8L-15 -4.2L-16.4 -5.6Z`; return I(34, 9, sh(30) + P(d, "#222b38") + `<rect x="-7" y="-6" width="14" height="5" rx="1" fill="#f28c28"/>` + txt("PROTEIN", -2.6, 2.8, "#fff") + S(d, "fiDown") + `<path d="M-13 -6H-9" stroke="#fff" stroke-width=".7" opacity=".5"/>`); })();
  L.gummies = bag({ c: "#f7d633", band: "#d24b3a", t: "GUMMI", w: 24, h: 30, top: "crimp", win: (w, h, x, y) => [["#e22d36", 4, 4], ["#2f9e44", 10, 5], ["#f28c28", 15, 3], ["#e22d36", 7, 10], ["#2f6fbf", 13, 10]].map(([c, a, b]) => `<path d="M${x + a - 2} ${y + b + 2}V${y + b - 1}a2 2 0 0 1 4 0V${y + b + 2}Z" fill="${c}"/><circle cx="${x + a - 1}" cy="${y + b - 2.4}" r=".9" fill="${c}"/><circle cx="${x + a + 1}" cy="${y + b - 2.4}" r=".9" fill="${c}"/>`).join("") });
  L.chips = bag({ c: "#f2c12e", band: "#c0392b", t: "CHIPS", w: 26, h: 34, top: "crimp", win: (w, h, x, y) => [[5, 5], [12, 4], [8, 10], [14, 11], [4, 12]].map(([a, b]) => `<ellipse cx="${x + a}" cy="${y + b}" rx="3.6" ry="2.6" fill="#f5d36a" transform="rotate(${a * 8} ${x + a} ${y + b})"/><ellipse cx="${x + a}" cy="${y + b}" rx="3.6" ry="2.6" fill="url(#fiSoft)" transform="rotate(${a * 8} ${x + a} ${y + b})"/>`).join("") });
  L.cookies = (() => { const d = RR(-15, -10, 30, 10, 2); return I(32, 12, sh(30) + P(d, "#2f6fbf") + [-9.6, -3.2, 3.2, 9.6].map(x => `<circle cx="${x}" cy="-5" r="3.4" fill="#c98b45"/><circle cx="${x}" cy="-5" r="3.4" fill="url(#fiSph)"/><circle cx="${x - 1}" cy="-6" r=".6" fill="#4a2c18"/><circle cx="${x + 1}" cy="-4" r=".5" fill="#4a2c18"/>`).join("") + S(d, "fiBag", .6)); })();
  L.nuts = bag({ c: "#f2e4cc", band: "#6b4426", t: "NÜSSE", w: 24, h: 30, win: (w, h, x, y) => [[4, 4, "#b8742a"], [10, 3, "#d9b27a"], [15, 5, "#8a5a2a"], [6, 9, "#d9b27a"], [12, 9, "#b8742a"], [4, 13, "#8a5a2a"], [14, 13, "#d9b27a"]].map(([a, b, c]) => `<ellipse cx="${x + a}" cy="${y + b}" rx="2.6" ry="1.8" fill="${c}"/><ellipse cx="${x + a - .6}" cy="${y + b - .5}" rx="1" ry=".5" fill="#fff" opacity=".35"/>`).join("") });
  L.protein = (() => { const d = RR(-13, -30, 26, 30, 4); return I(30, 36, sh(28) + P(d, "#222b38") + `<rect x="-12" y="-35" width="24" height="6" rx="2" fill="#f28c28"/>` + S(RR(-12, -35, 24, 6, 2), "fiCyl") + `<rect x="-13" y="-22" width="26" height="12" fill="#f28c28"/>` + txt("WHEY", -14, 5.4, "#222b38") + txt("PROTEIN", -10.8, 2.4, "#222b38", 700) + S(d, "fiCyl")); })();
  L.creatine = (() => { const d = RR(-8, -20, 16, 20, 3); return I(20, 26, sh(18) + P(d, "#f4f6f8") + `<rect x="-7" y="-25" width="14" height="5" rx="1.5" fill="#2f6fbf"/><rect x="-8" y="-14" width="16" height="7" fill="#2f6fbf"/>` + txt("KREATIN", -9.4, 2.8) + S(d, "fiCyl")); })();

  /* ===== Getränke ===== */
  L.water = bottle({ c: "#d6ecf8", cap: "#2f7fe0", label: "#2f7fe0", t: "WASSER", alpha: .85, h: 50, w: 15, lc: "#fff", pet: true });
  L.cola = can({ c: "#c4161c", t: "COLA", band: "#c4161c", tc: "#fff", w: 14, h: 26, metal: "#d6dade" });
  L.energy = can({ c: "#1f2937", t: "ENERGY", band: "#2ecc71", tc: "#1f2937", w: 12, h: 30, metal: "#d6dade" });
  L.coffee = bag({ c: "#3a2414", band: "#c98b45", t: "KAFFEE", w: 24, h: 32, win: (w, h, x, y) => [[4, 4], [10, 6], [15, 3.6], [7, 11], [13, 12]].map(([a, b]) => `<ellipse cx="${x + a}" cy="${y + b}" rx="2.2" ry="1.6" fill="#5a3418"/><path d="M${x + a - 1.4} ${y + b}h2.8" stroke="#2a160c" stroke-width=".5"/>`).join("") });
  L.tea = box({ c: "#2f7d32", top: "#f2c12e", t: "TEE", w: 26, h: 16, sideW: 4 });
  L.wine = bottle({ c: "#4a0e1c", cap: "#4a0e1c", t: "WEIN", h: 50, w: 13, neck: 16, alpha: .95 });
  L.beer = bottle({ c: "#6e4212", cap: "#c9a227", t: "BIER", h: 42, w: 13, neck: 12 });

  /* ===== Sonstiges ===== */
  L.jarGeneric = jar({ glass: "#e8eef4", fill: "#b5c3d1", lid: "#7a8a99" });
  L.boxGeneric = box({ c: "#d8dee6", top: "#8a96a3", t: "", w: 22, h: 26 });
  L.canGeneric = can({ c: "#8a96a3", t: "" });
  L.bagGeneric = bag({ c: "#eef1f4", band: "#8a96a3", t: "", w: 24, h: 30 });

  /* ================= Eigene Formen: jedes Produkt soll ohne Lesen erkennbar sein ================= */
  /* Tetra-Brick mit flachem Deckel und Schraubverschluss (Pflanzendrinks, H-Milch, Saft) */
  const brick = ({ c = "#c9953f", body = "#f6efe2", t = "", sub = "", w = 18, h = 40, cap = "#fff", art = "", band = .45 }) => {
    const sd = w * .28, x0 = -w / 2, x1 = w / 2 - sd, fw = x1 - x0, cx = (x0 + x1) / 2;
    const front = `M${x0} 0V${-h}H${x1}V0Z`, side = `M${x1} 0V${-h}L${w / 2} ${-h + 1.6}V-1.2Z`, top = `M${x0} ${-h}L${x0 + sd * .9} ${-h - 2.4}H${w / 2 - .2}L${x1} ${-h}Z`;
    return I(w + 3, h + 7, sh(w) + P(front, body) + P(side, body) + S(side, "fiSide") + P(top, body) + S(top, "fiTop", .6) +
      `<rect x="${r2(x0 + 2)}" y="${r2(-h - 4.4)}" width="5.6" height="3.4" rx="1.1" fill="${cap}"/><rect x="${r2(x0 + 2)}" y="${r2(-h - 4.4)}" width="5.6" height="1.1" rx=".5" fill="#fff" opacity=".5"/>` +
      `<rect x="${x0}" y="${r2(-h * .62)}" width="${r2(fw)}" height="${r2(h * band)}" fill="${c}"/>` + `<path d="M${x1} ${r2(-h * .62 + .6)}h${r2(sd)}v${r2(h * band)}h${r2(-sd)}z" fill="${c}"/>` + S(`M${x1} ${r2(-h * .62 + .6)}h${r2(sd)}v${r2(h * band)}h${r2(-sd)}z`, "fiSide") +
      art + txt(t, -h * .2, fit(t, fw, 4.4), "#fff", 800, cx) + txt(sub, -h * .2 + 3, Math.min(2.3, fw * 1.5 / Math.max(4, sub.length)), "#fff", 600, cx) +
      fp(x0 + 1.6, -h * .12, fw - 3, 2, "#000", .2) + ns(x0 + 1.6, -4, .8, 0) + S(front, "fiFlat") + hl(x0 + 1.2, -h + 2, h - 4, 1.1, .45));
  };
  /* offener Becher von schräg oben: man sieht, was drin ist */
  const openTub = ({ c = "#e94b3c", body = "#fbfcfd", w = 28, h = 15, content, foil = "#d9dee4", t = "", spoon, mound = true }) => {
    const ry = w * .16, d = `M${-w / 2} ${-h}L${-w / 2 + 2.4} -1Q${-w / 2 + 2.6} 0 ${-w / 2 + 3.6} 0H${w / 2 - 3.6}Q${w / 2 - 2.6} 0 ${w / 2 - 2.4} -1L${w / 2} ${-h}Z`;
    return I(w + 4, h + ry * 2 + 9, sh(w - 2) + P(d, body) + `<rect x="${-w / 2 + 1}" y="${r2(-h * .72)}" width="${w - 2}" height="${r2(h * .44)}" fill="${c}"/>` + txt(t, -h * .42, fit(t, w - 6, 4.2)) + S(d, "fiCyl") +
      `<ellipse cx="0" cy="${-h}" rx="${w / 2 + .6}" ry="${r2(ry)}" fill="${body}"/><ellipse cx="0" cy="${-h}" rx="${w / 2 + .6}" ry="${r2(ry)}" fill="#000" opacity=".06"/>` +
      `<ellipse cx="0" cy="${r2(-h + .4)}" rx="${w / 2 - .9}" ry="${r2(ry - 1)}" fill="${content}"/>` +
      (mound ? `<path d="M${-w / 2 + 3} ${r2(-h)}Q${-w / 4} ${r2(-h - ry * 1.4)} 0 ${r2(-h - ry * .9)}Q${w / 4} ${r2(-h - ry * 1.6)} ${w / 2 - 4} ${r2(-h - .4)}Q0 ${r2(-h + ry * .6)} ${-w / 2 + 3} ${r2(-h)}Z" fill="${content}"/>` +
        `<path d="M${-w / 2 + 3} ${r2(-h)}Q${-w / 4} ${r2(-h - ry * 1.4)} 0 ${r2(-h - ry * .9)}Q${w / 4} ${r2(-h - ry * 1.6)} ${w / 2 - 4} ${r2(-h - .4)}Q0 ${r2(-h + ry * .6)} ${-w / 2 + 3} ${r2(-h)}Z" fill="url(#fiSoft)"/>` : "") +
      `<path d="M${w / 2 - 2} ${r2(-h - ry * .4)}Q${w / 2 + 4} ${r2(-h - ry * 3)} ${w / 2 - 6} ${r2(-h - ry * 3.6)}Q${w / 2 - 9} ${r2(-h - ry * 2)} ${w / 2 - 7} ${r2(-h - ry * .7)}Z" fill="${foil}"/>` +
      `<path d="M${w / 2 - 2} ${r2(-h - ry * .4)}Q${w / 2 + 4} ${r2(-h - ry * 3)} ${w / 2 - 6} ${r2(-h - ry * 3.6)}" stroke="#fff" stroke-width=".7" fill="none" opacity=".7"/>` +
      (spoon ? `<path d="M${-w / 2 + 6} ${r2(-h - ry * .6)}L${-w / 2 - 1} ${r2(-h - ry * 4.4)}" stroke="#c9ced6" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="${-w / 2 + 6.6}" cy="${r2(-h - ry * .3)}" rx="2.6" ry="1.4" fill="#dfe3e8"/>` : ""));
  };
  /* Glasflasche mit weitem Hals (Kefir, Ayran, Smoothie) */
  const wideBottle = ({ fill = "#f6f4ee", cap = "#c0392b", label = "#c0392b", t = "", lc = "#fff", w = 14, h = 32, check }) => {
    const d = `M${-w / 2} -2Q${-w / 2} 0 ${-w / 2 + 2} 0H${w / 2 - 2}Q${w / 2} 0 ${w / 2} -2V${-h + 9}Q${w / 2} ${-h + 5} ${w / 2 - 3} ${-h + 3}V${-h}H${-w / 2 + 3}V${-h + 3}Q${-w / 2} ${-h + 5} ${-w / 2} ${-h + 9}Z`;
    return I(w + 3, h + 5, sh(w) + P(d, "#eef3f6", ` opacity=".9"`) + P(d, fill) + `<rect x="${-w / 2}" y="${r2(-h * .58)}" width="${w}" height="${r2(h * .3)}" fill="${label}"/>` +
      (check ? Array.from({ length: Math.floor(w / 2.4) }, (_, i) => `<rect x="${r2(-w / 2 + i * 2.4)}" y="${r2(-h * .58)}" width="1.2" height="${r2(h * .3)}" fill="#fff" opacity=".25"/>`).join("") : "") +
      txt(t, -h * .4, fit(t, w - 2, 4), lc) + S(d, "fiCyl") + S(d, "fiGlass", .9) +
      `<rect x="${-w / 2 + 2.2}" y="${-h - 2.6}" width="${w - 4.4}" height="3.4" rx="1" fill="${cap}"/>` + S(RR(-w / 2 + 2.2, -h - 2.6, w - 4.4, 3.4, 1), "fiCyl") +
      Array.from({ length: Math.floor((w - 4.4) / 1.6) }, (_, i) => `<rect x="${r2(-w / 2 + 2.8 + i * 1.6)}" y="${-h - 2.2}" width=".5" height="2.6" fill="#000" opacity=".15"/>`).join(""));
  };
  /* Jutesack mit Kordel (Basmati) */
  const sack = ({ c = "#d8c39a", t = "", tc = "#6b2a6e", w = 24, h = 32, grain = "fiRice" }) => {
    const d = `M${-w / 2 + 1} 0Q${-w / 2 - 1.4} ${-h * .5} ${-w / 2 + 2} ${-h + 7}Q${-w / 4} ${-h + 5} 0 ${-h + 6}Q${w / 4} ${-h + 5} ${w / 2 - 2} ${-h + 7}Q${w / 2 + 1.4} ${-h * .5} ${w / 2 - 1} 0Q0 1.4 ${-w / 2 + 1} 0Z`;
    return I(w + 4, h + 4, sh(w) + P(d, c) + `<path d="${d}" fill="url(#fiCrumb)" opacity=".5"/>` +
      `<path d="M${-w / 2 + 3} ${-h + 7}Q-1 ${-h - 1} -3 ${-h + 1}M${w / 2 - 3} ${-h + 7}Q1 ${-h - 1} 3 ${-h + 1}" fill="${c}" stroke="#b9a275" stroke-width=".5"/><ellipse cx="0" cy="${-h + 2}" rx="5" ry="2.4" fill="#fff"/><ellipse cx="0" cy="${-h + 2}" rx="5" ry="2.4" fill="url(#${grain})"/>` +
      `<path d="M${-w / 2 + 2.4} ${-h + 7.4}Q0 ${-h + 5.6} ${w / 2 - 2.4} ${-h + 7.4}" stroke="#8a6d3a" stroke-width="1.3" fill="none"/>` +
      `<rect x="${-w / 2 + 3}" y="${-h * .58}" width="${w - 6}" height="9" rx="1.5" fill="#fff8ec"/><rect x="${-w / 2 + 3}" y="${-h * .58}" width="${w - 6}" height="2" fill="${tc}"/>` + txt(t, -h * .58 + 6.6, fit(t, w - 7, 3.6), tc) +
      S(d, "fiBag", .8));
  };
  /* Standbeutel aus Kraftpapier mit Zip und Sichtfenster */
  const kraft = ({ c = "#c79a64", t = "", tc = "#3a2a14", w = 22, h = 30, win, winBg = "#efe3c8", fillPat }) => {
    const d = `M${-w / 2} 0V${-h}H${w / 2}V0Z`;
    return I(w + 3, h + 4, sh(w) + P(d, c) + `<path d="${d}" fill="url(#fiCrumb)" opacity=".35"/>` + `<rect x="${-w / 2}" y="${-h + 3}" width="${w}" height="1.2" fill="#000" opacity=".18"/>` +
      `<rect x="${-w / 2 + 3}" y="${-h + 6.5}" width="${w - 6}" height="6" rx="1" fill="#fbf6ea"/>` + txt(t, -h + 11, fit(t, w - 7, 3.8), tc) +
      `<rect x="${-w / 2 + 3.5}" y="${-h + 15}" width="${w - 7}" height="${h - 19}" rx="${(w - 7) / 2 > 6 ? 5 : 3}" fill="${winBg}"/>` + (fillPat ? `<rect x="${-w / 2 + 3.5}" y="${-h + 15}" width="${w - 7}" height="${h - 19}" rx="5" fill="url(#${fillPat})"/>` : "") + (win ? win(w - 7, h - 19, -w / 2 + 3.5, -h + 15) : "") +
      S(d, "fiFlat") + `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="url(#fiDown)"/>`);
  };
  /* komplett durchsichtige Tüte – der Inhalt ist das Bild */
  const clearBag = ({ w = 26, h = 32, band = "#c0392b", t = "", content, base = "#f4ead0" }) => {
    const d = `M${-w / 2 + 1} 0Q${-w / 2 - .6} ${-h * .5} ${-w / 2 + 1} ${-h + 2}H${w / 2 - 1}Q${w / 2 + .6} ${-h * .5} ${w / 2 - 1} 0Q0 1 ${-w / 2 + 1} 0Z`;
    return I(w + 3, h + 4, sh(w) + P(d, base) + `<g clip-path="none">${content(w, h)}</g>` + P(d, "#fff", ` opacity=".14"`) +
      `<rect x="${-w / 2 + 1}" y="${-h}" width="${w - 2}" height="3" fill="${band}"/>` + `<rect x="${-w / 2 + 4}" y="${-h * .55}" width="${w - 8}" height="6.4" rx="1.4" fill="${band}"/>` + txt(t, -h * .55 + 4.6, fit(t, w - 9, 3.8)) +
      S(d, "fiGlass", .9) + `<path d="M${-w / 2 + 3} ${-h + 4}Q${-w / 2 + 2} ${-h * .5} ${-w / 2 + 3} -2" stroke="#fff" stroke-width="1.2" fill="none" opacity=".6" stroke-linecap="round"/>`);
  };
  /* Papiertüte mit Blockboden (Mehl, Zucker) */
  const paperBag = ({ c = "#fbf8f1", band = "#2f6fbf", t = "", w = 20, h = 30, art = "" }) => {
    const d = `M${-w / 2} 0V${-h + 4}L${-w / 2 + 2} ${-h}H${w / 2 - 2}L${w / 2} ${-h + 4}V0Z`;
    return I(w + 3, h + 3, sh(w) + P(d, c) + `<path d="M${-w / 2} ${-h + 4}H${w / 2}" stroke="#000" stroke-opacity=".12" stroke-width=".6"/><path d="M${-w / 2 + 2} ${-h}L0 ${-h + 3}L${w / 2 - 2} ${-h}" stroke="#000" stroke-opacity=".1" stroke-width=".5" fill="none"/>` +
      `<rect x="${-w / 2}" y="${-h * .66}" width="${w}" height="${h * .36}" fill="${band}"/>` + txt(t, -h * .44, fit(t, w - 2, 4.6)) + art + S(d, "fiFlat") + hl(-w / 2 + 1.2, -h + 5, h - 7, 1, .5));
  };

  /* ---------- Milch & Drinks: alle unterschiedlich ---------- */
  L.lfmilk = brick({ c: "#1aa29b", body: "#f2fbfa", t: "LAKTOSEFREI", sub: "fettarme Milch", w: 18, h: 40, cap: "#1aa29b", art: `<circle cx="-1.6" cy="-31" r="3.2" fill="#1aa29b" opacity=".2"/><path d="M-1.6 -34.4Q-4.4 -30.6 -1.6 -28.4Q1.2 -30.6 -1.6 -34.4Z" fill="#1aa29b"/>` });
  L.oatmilk = brick({ c: "#c9953f", body: "#f6efe2", t: "HAFER", sub: "Drink Barista", w: 18, h: 42, cap: "#8a5a1f", art: [-5, -1.4, 2.2].map((x, i) => `<path d="M${x} -27V-36" stroke="#b07a2a" stroke-width=".6"/>` + [0, 1, 2].map(k => `<ellipse cx="${x + (k % 2 ? .9 : -.9)}" cy="${-34 + k * 2.4}" rx="1" ry=".55" fill="#d9a84a" transform="rotate(${k % 2 ? 35 : -35} ${x + (k % 2 ? .9 : -.9)} ${-34 + k * 2.4})"/>`).join("")).join("") });
  L.soymilk = brick({ c: "#4f8f2a", body: "#f4f7ee", t: "SOJA", sub: "Drink", w: 18, h: 40, cap: "#3d7a20", art: `<path d="M-6 -30Q-2 -36 3 -33" stroke="#5f9c35" stroke-width="3.4" stroke-linecap="round" fill="none"/>` + [-4.6, -1.6, 1.4].map((x, i) => `<circle cx="${x}" cy="${-32.6 + (i === 1 ? -1.2 : 0)}" r="1.1" fill="#a6d170"/>`).join("") });
  L.almondmilk = brick({ c: "#9a6b47", body: "#f7f2ec", t: "MANDEL", sub: "Drink", w: 18, h: 40, cap: "#6b4426", art: [[-4.6, -31, 20], [-.6, -33, -10], [2.6, -30, 35]].map(([x, y, a]) => `<path d="M${x} ${y - 2.4}Q${x + 1.8} ${y} ${x} ${y + 2.4}Q${x - 1.8} ${y} ${x} ${y - 2.4}Z" fill="#b07a4a" transform="rotate(${a} ${x} ${y})"/>`).join("") });
  L.juice = (() => { const w = 15, h = 40, d = `M${-w / 2} -2Q${-w / 2} 0 ${-w / 2 + 2} 0H${w / 2 - 2}Q${w / 2} 0 ${w / 2} -2V${-h + 12}Q${w / 2} ${-h + 7} 3 ${-h + 4}V${-h}H-3V${-h + 4}Q${-w / 2} ${-h + 7} ${-w / 2} ${-h + 12}Z`;
    return I(w + 3, h + 5, sh(w) + P(d, "#f59a1e", ` opacity=".95"`) + `<rect x="${-w / 2}" y="-22" width="${w}" height="12" fill="#fff8e6"/><circle cx="0" cy="-16" r="4" fill="#f7941d"/><circle cx="0" cy="-16" r="3.1" fill="#fcc366"/>` +
      [0, 1, 2, 3, 4, 5].map(i => `<path d="M0 -16L${r2(Math.cos(i * 1.047) * 3)} ${r2(-16 + Math.sin(i * 1.047) * 3)}" stroke="#f7941d" stroke-width=".4"/>`).join("") + S(d, "fiCyl") + S(d, "fiGlass", .8) + `<rect x="-3.6" y="${-h - 4}" width="7.2" height="5" rx="1.2" fill="#2f7d32"/>`); })();
  L.kefir = wideBottle({ fill: "#f7f6f1", cap: "#c9ced6", label: "#c0392b", t: "KEFIR", w: 14, h: 30, check: true });
  L.buttermilk = (() => { const w = 15, h = 30, d = `M${-w / 2} -2Q${-w / 2} 0 ${-w / 2 + 2} 0H${w / 2 - 2}Q${w / 2} 0 ${w / 2} -2V${-h + 10}Q${w / 2} ${-h + 3} 0 ${-h + 2}Q${-w / 2} ${-h + 3} ${-w / 2} ${-h + 10}Z`;
    return I(w + 3, h + 6, sh(w) + P(d, "#fbf7e6") + `<rect x="${-w / 2}" y="-19" width="${w}" height="10" fill="#2a9d8f"/>` + txt("BUTTER", -14.6, 3.2) + txt("MILCH", -11.2, 3) + S(d, "fiCyl") +
      `<rect x="-3.4" y="${-h - 1.4}" width="6.8" height="4" rx="1.2" fill="#2a9d8f"/>` + S(RR(-3.4, -h - 1.4, 6.8, 4, 1.2), "fiCyl")); })();
  L.cream = (() => { const it = carton({ t: "SAHNE", sub: "30 %", c: "#d62f2f", w: 15, h: 18, top: 5, cap: "#d62f2f" });
    return I(it.w, it.h, it.svg + `<path d="M-6.4 -10.6Q-6.8 -14.2 -3.6 -14.4Q-3.4 -17 -.6 -16.4Q1.6 -17.4 2.4 -14.8Q4.6 -14.2 3.6 -11Z" fill="#fffdf6" stroke="#eee6d2" stroke-width=".4"/>`); })();
  L.proteinshake = (() => { const w = 13, h = 30, d = RR(-w / 2, -h, w, h, 3);
    return I(w + 3, h + 9, sh(w) + P(d, "#1f2937") + `<rect x="${-w / 2}" y="-21" width="${w}" height="11" fill="#f28c28"/>` + txt("PROTEIN", -16.6, 2.7, "#1f2937") + txt("30 g", -12.4, 2.6, "#1f2937", 700) + S(d, "fiCyl") +
      `<rect x="-5" y="${-h - 3.4}" width="10" height="3.8" rx="1" fill="#f28c28"/><rect x="-1.6" y="${-h - 7.6}" width="3.2" height="4.6" rx="1" fill="#f28c28"/>` + S(RR(-5, -h - 3.4, 10, 3.8, 1), "fiCyl")); })();

  /* ---------- Becher: jeder mit eigener Form und sichtbarem Inhalt ---------- */
  L.quark = openTub({ c: "#e94b3c", t: "QUARK", w: 28, h: 13, content: "#fbfaf4", spoon: true });
  L.skyr = (() => { const w = 18, h = 24, d = `M${-w / 2} ${-h}L${-w / 2 + 1.4} -1Q${-w / 2 + 1.6} 0 ${-w / 2 + 2.6} 0H${w / 2 - 2.6}Q${w / 2 - 1.6} 0 ${w / 2 - 1.4} -1L${w / 2} ${-h}Z`;
    return I(w + 3, h + 6, sh(w) + P(d, "#1f4fa0") + `<path d="M${-w / 2 + .6} -9L-4 -14L0 -10L4 -15L${w / 2 - .6} -9V-1H${-w / 2 + .6}Z" fill="#fff"/><path d="M-4 -14L-2.4 -12.6L-1 -13.8M4 -15L5.4 -13.4" stroke="#1f4fa0" stroke-width=".5" fill="none"/>` +
      txt("SKYR", -17, 4.6) + `<path d="M3 -20.6l.9 1.6M3.9 -20.6l-.9 1.6M2.6 -19.8h1.8" stroke="#fff" stroke-width=".4"/>` + S(d, "fiCyl") +
      `<ellipse cx="0" cy="${-h}" rx="${w / 2 + .4}" ry="2.4" fill="#e8eef6"/><ellipse cx="0" cy="${-h}" rx="${w / 2 + .4}" ry="2.4" fill="url(#fiTop)"/>`); })();
  L.yogurt = jar({ glass: "#eef3f6", fill: "#fbfaf4", lid: "#2f6fbf", t: "", w: 18, h: 20, fillTo: .9 });
  L.yogurt = I(L.yogurt.w, L.yogurt.h, L.yogurt.svg + `<rect x="-9" y="-12.6" width="18" height="6" fill="#2f6fbf"/>` + txt("JOGHURT", -8.6, 2.9) + `<path d="M-8.4 -17.4Q-4 -18.6 0 -17.4T8.4 -17.4" stroke="#fff" stroke-width=".8" fill="none" opacity=".8"/>`);
  L.greek = (() => { const it = tub({ t: "GREEK", sub: "Style 10 %", c: "#1f4fa0", w: 30, h: 15, lid: "#1f4fa0", band: .5 });
    const mk = Array.from({ length: 6 }, (_, i) => `<path d="M${-13 + i * 4.4} -3.6h3v-2.4h-2v1.2" stroke="#1f4fa0" stroke-width=".55" fill="none"/>`).join("");
    return I(it.w, it.h, it.svg + mk); })();
  L.sourcream = openTub({ c: "#c0392b", t: "SCHMAND", w: 20, h: 11, content: "#fffdf6", foil: "#e8e1d2" });
  L.pudding = (() => { const w = 18, h = 16, d = `M${-w / 2} ${-h}L${-w / 2 + 2} -1Q${-w / 2 + 2.2} 0 ${-w / 2 + 3.2} 0H${w / 2 - 3.2}Q${w / 2 - 2.2} 0 ${w / 2 - 2} -1L${w / 2} ${-h}Z`;
    return I(w + 3, h + 9, sh(w) + P(d, "#eef3f6", ` opacity=".85"`) + `<path d="M${-w / 2 + .8} ${-h + 4}H${w / 2 - .8}L${w / 2 - 2.2} -1H${-w / 2 + 2.2}Z" fill="#6b3f26"/>` + S(d, "fiCyl") + S(d, "fiGlass", .8) +
      `<path d="M${-w / 2 + 1} ${-h + 4}Q-4 ${-h - 4} 0 ${-h - 2}Q4 ${-h - 5} ${w / 2 - 1} ${-h + 4}Z" fill="#fffaf0"/><path d="M-4 ${-h - .4}Q0 ${-h - 4} 4 ${-h - .8}" stroke="#eadfc9" stroke-width=".6" fill="none"/>` +
      `<ellipse cx="0" cy="${-h}" rx="${w / 2 + .3}" ry="2.2" fill="none" stroke="#dfe7ee" stroke-width=".8"/><rect x="-5.6" y="-8" width="11.2" height="4" rx="1" fill="#f28c28"/>` + txt("PROTEIN", -5.2, 2.4, "#1f2937")); })();
  L.hummus = openTub({ c: "#c28c2f", t: "HUMMUS", w: 24, h: 9, content: "#e8cf9c", mound: false, foil: "#e6dcc6" });
  L.hummus = I(L.hummus.w, L.hummus.h, L.hummus.svg + `<path d="M-6 -10.4Q0 -13.4 6 -10.4Q0 -8 -6 -10.4Z" fill="none" stroke="#c9a868" stroke-width=".7"/><circle cx="0" cy="-10.6" r="1.4" fill="#b5852a" opacity=".7"/><circle cx="-3" cy="-11.2" r=".5" fill="#c0392b"/><circle cx="2.6" cy="-9.8" r=".5" fill="#c0392b"/><circle cx="1" cy="-12" r=".45" fill="#3f8f3a"/>`);

  /* ---------- Wurst, Aufschnitt & Co. ---------- */
  L.sausage = jar({ glass: "#eef3f6", fill: "#f2e7cf", lid: "#c0392b", w: 18, h: 28, fillTo: .92 });
  L.sausage = I(L.sausage.w, L.sausage.h, L.sausage.svg.replace(/(<rect x="-8.4"[^>]*fill="#f2e7cf"\/>|<path d="M-8\.1[^"]*" fill="#f2e7cf"\/>)/, "$1") +
    [-5.6, -1.9, 1.9, 5.6].map(x => `<rect x="${x - 1.6}" y="-24.4" width="3.2" height="23" rx="1.6" fill="#d98c58"/><rect x="${x - 1}" y="-23.6" width="1" height="21" rx=".5" fill="#f3b78a" opacity=".8"/>`).join("") +
    `<rect x="-9" y="-28" width="18" height="28" rx="4" fill="url(#fiGlass)" opacity=".8"/><rect x="-9" y="-15" width="18" height="6" fill="#fff"/>` + txt("WIENER", -10.8, 3, "#c0392b"));
  L.ham = pack({ w: 32, h: 11, frame: "#f7f9fb", t: "SCHINKEN", tc: "#c0392b", win: [-9, -4, 1, 6].map((x, i) => `<ellipse cx="${x + 3}" cy="-4.8" rx="5.6" ry="3.4" fill="${i % 2 ? "#f2a6a8" : "#f7bcbd"}" stroke="#fbe0e0" stroke-width=".8"/>`).join("") });
  L.tofu = (() => { const it = pack({ w: 26, h: 13, frame: "#eaf2e5", t: "TOFU", tc: "#2f7d32", win: `<rect x="-10" y="-9.4" width="20" height="8" rx="1.2" fill="#dbe9f2" opacity=".8"/><rect x="-8.6" y="-8.6" width="17.2" height="6.6" rx="1" fill="#f6f0dc"/><rect x="-8.6" y="-8.6" width="17.2" height="6.6" rx="1" fill="url(#fiSoft)"/><path d="M-8.6 -5.2H8.6" stroke="#e6dcc0" stroke-width=".4"/>` }); return it; })();
  L.schnitzel = (() => { const d = `M-17 0L-15 -10H15L17 0Z`;
    return I(38, 16, sh(34) + P(d, "#f1ece2") + `<path d="M-15 -10L-16 -12H16L15 -10Z" fill="#e6dfd1"/>` +
      [[-7, -5.4, -6], [6, -5, 8]].map(([x, y, a]) => `<path d="M${x - 8} ${y + 2}C${x - 9} ${y - 4} ${x + 6} ${y - 5} ${x + 8} ${y}C${x + 7} ${y + 4} ${x - 6} ${y + 4} ${x - 8} ${y + 2}Z" fill="#eea3a0" transform="rotate(${a} ${x} ${y})"/><path d="M${x - 8} ${y + 2}C${x - 9} ${y - 4} ${x + 6} ${y - 5} ${x + 8} ${y}C${x + 7} ${y + 4} ${x - 6} ${y + 4} ${x - 8} ${y + 2}Z" fill="url(#fiSoft)" transform="rotate(${a} ${x} ${y})"/><path d="M${x - 5} ${y}Q${x} ${y - 2.4} ${x + 5} ${y - .6}" stroke="#fde0dc" stroke-width=".7" fill="none" transform="rotate(${a} ${x} ${y})"/>`).join("") +
      `<path d="M-14 -1.6H14" stroke="#000" stroke-opacity=".06" stroke-width=".8"/><rect x="5" y="-3.4" width="9" height="3.2" rx=".6" fill="#c0392b"/>` + txt("METZGER", -1.1, 1.7, "#fff", 700, 9.5)); })();
  L.turkey = tray({ base: "#e9eef3", rim: "#c4ccd6", label: true, lc: "#2f7d32", food: [-10, -5, 0, 5, 10].map((x, i) => `<path d="M${x - 4} -8.6C${x - 4} -15 ${x + 3} -15.6 ${x + 4} -9Z" fill="${i % 2 ? "#f3c7b9" : "#f7d4c8"}"/><path d="M${x - 4} -8.6C${x - 4} -15 ${x + 3} -15.6 ${x + 4} -9Z" fill="url(#fiSoft)"/>`).join("") });

  /* ---------- Trockenware: eigene Verpackungsarten ---------- */
  L.basmati = sack({ c: "#d8c39a", t: "BASMATI", tc: "#6b2a6e", w: 24, h: 32 });
  L.quinoa = kraft({ c: "#c79a64", t: "QUINOA", w: 22, h: 30, fillPat: "fiCrumb", winBg: "#efe0bd" });
  L.granola = kraft({ c: "#b5793d", t: "GRANOLA", w: 22, h: 30, fillPat: "fiOats", winBg: "#e2c48a", win: (w, h, x, y) => [[4, 4], [11, 8], [7, 12], [13, 3]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="1.5" fill="#7a3a6e"/>`).join("") });
  L.nuts = kraft({ c: "#7a5232", t: "NÜSSE", tc: "#3a2a14", w: 22, h: 28, winBg: "#e9d8b8", win: (w, h, x, y) => [[4, 3, "#b8742a"], [10, 3.4, "#d9b27a"], [4.6, 8, "#d9b27a"], [11, 8.6, "#8a5a2a"], [7.4, 12, "#b8742a"]].map(([a, b, c]) => `<ellipse cx="${x + a}" cy="${y + b}" rx="2.4" ry="1.7" fill="${c}"/><ellipse cx="${x + a - .5}" cy="${y + b - .5}" rx=".9" ry=".4" fill="#fff" opacity=".35"/>`).join("") });
  L.pasta = clearBag({ w: 26, h: 32, band: "#1f5fae", t: "PENNE", base: "#f6e2a6", content: (w, h) => Array.from({ length: 22 }, (_, i) => { const x = -w / 2 + 3 + (i * 5.3) % (w - 7), y = -3 - ((i * 7.1) % (h - 7)); return `<rect x="${r2(x)}" y="${r2(y)}" width="4.8" height="2" rx=".6" fill="${i % 3 ? "#ecc155" : "#f3d07a"}" transform="rotate(${(i * 47) % 70 - 35} ${r2(x + 2.4)} ${r2(y + 1)})"/>`; }).join("") });
  L.fusilli = box({ c: "#fdf7ea", top: "#2f7d32", t: "FUSILLI", w: 24, h: 32, motif: `<rect x="-9" y="-21" width="13" height="16" rx="3" fill="#f3dc96"/>` + [[-6.4, -17], [-1.6, -14], [-6, -10], [-1.4, -8]].map(([x, y]) => `<path d="M${x - 2.6} ${y}q1.3-1.8 2.6 0t2.6 0" stroke="#d9a63a" stroke-width="1.5" fill="none" stroke-linecap="round"/>`).join("") + `<rect x="-9" y="-21" width="13" height="16" rx="3" fill="url(#fiGlass)" opacity=".6"/>` });
  L.lentils = clearBag({ w: 22, h: 28, band: "#b5553a", t: "LINSEN", base: "#e07a3c", content: (w, h) => `<rect x="${-w / 2 + 1}" y="${-h + 2}" width="${w - 2}" height="${h - 2}" fill="url(#fiMince)" opacity=".5"/>` + Array.from({ length: 30 }, (_, i) => `<ellipse cx="${r2(-w / 2 + 2.5 + (i * 3.7) % (w - 5))}" cy="${r2(-2 - (i * 2.9) % (h - 5))}" rx="1.2" ry=".85" fill="${i % 2 ? "#f08f4f" : "#cf6a2e"}"/>`).join("") });
  L.flour = paperBag({ c: "#fbf8f1", band: "#2f6fbf", t: "MEHL", w: 20, h: 30, art: `<path d="M-5 -6l2-4 1.4 2 2-5 2 7z" fill="#e7c25a"/>` });
  L.sugar = (() => { const d = RR(-9, -24, 18, 24, 1);
    return I(21, 27, sh(18) + P(d, "#fdfdfb") + `<rect x="-9" y="-24" width="18" height="6" fill="#1f5fae"/>` + txt("ZUCKER", -19.6, 3.4) +
      [[-4, -11], [0, -9.6], [4, -11.4], [-2, -6], [2.6, -5.6]].map(([x, y]) => `<rect x="${x - 1.6}" y="${y - 1.6}" width="3.2" height="3.2" rx=".4" fill="#fff" stroke="#d6dce4" stroke-width=".4"/>`).join("") + S(d, "fiFlat") + `<path d="M9 -24L11 -22.6V-1.4L9 0Z" fill="#e6e9ee"/>`); })();
  L.coffee = (() => { const d = `M-9 0V-24L-7 -27H7L9 -24V0Z`;
    return I(21, 30, sh(18) + P(d, "#2a1a10") + S(d, "fiBag") + `<path d="M-7 -27L-6 -29H6L7 -27" fill="#3a2414"/><circle cx="4.6" cy="-21" r="1.4" fill="#4a3424"/><circle cx="4.6" cy="-21" r=".6" fill="#1a0e06"/>` +
      `<rect x="-7" y="-15" width="14" height="7" rx="1" fill="#c98b45"/>` + txt("KAFFEE", -10.4, 2.9, "#2a1a10") + [[-3, -4], [0, -3], [3, -4.2]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.4" ry="1" fill="#6b4426"/><path d="M${x - .9} ${y}h1.8" stroke="#2a1a10" stroke-width=".35"/>`).join("")); })();
  L.rice = (() => { const d = `M-12 0V-26Q-12 -30 -8 -30H8Q12 -30 12 -26V0Z`;
    return I(27, 33, sh(24) + P(d, "#fdfcf8") + `<rect x="-12" y="-30" width="24" height="5" rx="2" fill="#c43c2f"/>` + txt("REIS", -26.4, 3.6) +
      `<path d="M-7 -20Q0 -22 7 -20V-6Q0 -4 -7 -6Z" fill="#efe6d0"/><path d="M-7 -20Q0 -22 7 -20V-6Q0 -4 -7 -6Z" fill="url(#fiRice)"/><path d="M-7 -20Q0 -22 7 -20V-6Q0 -4 -7 -6Z" fill="none" stroke="#c43c2f" stroke-width=".6"/>` +
      `<path d="M-12 -2H12" stroke="#c43c2f" stroke-width="1.6"/>` + S(d, "fiBag", .7)); })();

  /* ---------- Tiefkühl: Eiskristall-Optik, eigene Farben ---------- */
  const frost = (w, h) => Array.from({ length: 7 }, (_, i) => { const x = -w / 2 + 3 + (i * 6.1) % (w - 6), y = -h + 6 + (i * 5.3) % (h - 9); return `<path d="M${r2(x - 1.2)} ${r2(y)}h2.4M${r2(x)} ${r2(y - 1.2)}v2.4M${r2(x - .85)} ${r2(y - .85)}l1.7 1.7M${r2(x + .85)} ${r2(y - .85)}l-1.7 1.7" stroke="#fff" stroke-width=".35" opacity=".7"/>`; }).join("");
  const frozen = (it, w, h) => I(it.w, it.h, it.svg + frost(w, h));
  L.peas = frozen(L.peas, 26, 32); L.frozenberries = frozen(L.frozenberries, 26, 34); L.frozenveg = frozen(L.frozenveg, 28, 34);
  L.fries = frozen(bag({ c: "#d72f26", band: "#a81f18", t: "POMMES", w: 26, h: 34, top: "crimp", winBg: "#f6d870", win: (w, h, x, y) => Array.from({ length: 8 }, (_, i) => `<rect x="${x + 1.4 + i * 2.3}" y="${y + 1.4 + (i % 2) * 2}" width="1.8" height="${h - 4}" rx=".6" fill="${i % 2 ? "#f7dd77" : "#efc95a"}" transform="rotate(${(i % 3) * 7 - 7} ${x + 2.3 + i * 2.3} ${y + h / 2})"/>`).join("") }), 26, 34);
  L.frozenchicken = frozen(box({ c: "#e8741f", top: "#9e3c10", t: "NUGGETS", w: 30, h: 18, sideW: 3, motif: [[-9, -6], [-3, -8], [3, -5.6], [-6, -3]].map(([x, y]) => `<path d="M${x - 3} ${y}Q${x - 3} ${y - 2.6} ${x} ${y - 2.4}Q${x + 3.2} ${y - 2} ${x + 2.8} ${y + .6}Q${x} ${y + 2.6} ${x - 3} ${y}Z" fill="#e3a858"/><path d="M${x - 3} ${y}Q${x - 3} ${y - 2.6} ${x} ${y - 2.4}" stroke="#f6d08e" stroke-width=".6" fill="none"/>`).join("") }), 30, 18);
  L.frozenspinach = frozen(box({ c: "#1f6a2a", top: "#0f4a1a", t: "RAHMSPINAT", w: 26, h: 16, sideW: 3, motif: `<ellipse cx="-3" cy="-5" rx="7" ry="3" fill="#3f8f3a"/><ellipse cx="-3" cy="-5.6" rx="5" ry="1.6" fill="#eef4e6" opacity=".6"/>` }), 26, 16);

  /* ---------- Brot & Co. ---------- */
  L.wholegrain = (() => { const d = `M-15 0V-11Q-15 -16 -10 -16H10Q15 -16 15 -11V0Z`;
    return I(32, 18, sh(30) + P(d, "#4a2e1a") + `<path d="${d}" fill="url(#fiCrumb)"/>` + `<path d="M-15 -11Q-15 -16 -10 -16H10Q15 -16 15 -11" stroke="#2e1a0c" stroke-width="1.6" fill="none"/>` +
      Array.from({ length: 16 }, (_, i) => `<ellipse cx="${-12 + (i * 5.3) % 24}" cy="${-2 - (i * 3.3) % 12}" rx=".7" ry=".4" fill="${i % 2 ? "#d9c08a" : "#8a6a3a"}"/>`).join("") + S(d, "fiSoft")); })();
  L.toast = (() => { const d = `M-13 0V-15Q-15.6 -22 -7 -22H7Q15.6 -22 13 -15V0Z`, c2 = `M-11 -1V-14.6Q-13 -20.4 -6.4 -20.4H6.4Q13 -20.4 11 -14.6V-1Z`;
    return I(30, 24, sh(28) + `<g transform="translate(3 -1)">` + P(d, "#c98a42") + P(c2, "#f6e2b8") + `</g>` + P(d, "#d99a4f") + P(c2, "#f9ebc6") + `<path d="${c2}" fill="url(#fiCrumb)" opacity=".4"/>` + S(d, "fiSoft", .7)); })();

  /* ---------- Gewürze: eigene Formen ---------- */
  L.salt = (() => { const d = `M-6 0V-18Q-6 -22 -3 -23H3Q6 -22 6 -18V0Z`;
    return I(14, 28, sh(12) + P(d, "#eef3f6", ` opacity=".85"`) + `<rect x="-5.4" y="-16" width="10.8" height="15.4" rx="1.4" fill="#fff"/>` + S(d, "fiCyl") + S(d, "fiGlass", .8) +
      `<path d="M-3 -23Q0 -27 3 -23Z" fill="#c9ced6"/>` + [-1.4, 0, 1.4].map(x => `<circle cx="${x}" cy="-24.4" r=".35" fill="#555"/>`).join("") + `<rect x="-6" y="-11" width="12" height="4" fill="#2f6fbf"/>` + txt("SALZ", -8.1, 2.8)); })();
  L.curry = shaker("#e0a020"); L.cinnamon = (() => { const it = shaker("#8a4b1f"); return I(it.w, it.h, it.svg + `<rect x="5.6" y="-17" width="7" height="2" rx="1" fill="#8a4b1f" transform="rotate(-20 9 -16)"/><rect x="5.6" y="-14" width="7" height="2" rx="1" fill="#9a5a2a" transform="rotate(-20 9 -13)"/>`); })();
  const tin = (c, t, art = "") => { const d = RR(-7, -14, 14, 14, 1.4);
    return I(17, 18, sh(14) + P(d, c) + `<rect x="-7" y="-10" width="14" height="6" fill="#fff"/>` + txt(t, -5.8, fit(t, 13, 3), c) + art + S(d, "fiCyl") + `<ellipse cx="0" cy="-14" rx="7" ry="1.6" fill="#d6dade"/><ellipse cx="0" cy="-14" rx="5.6" ry="1.1" fill="#eef0f3"/>`); };
  L.spice = tin("#c0392b", "PAPRIKA");
  L.curry = tin("#e0a020", "CURRY");
  L.herbs = (() => { const pot = `M-8 -10H8L6.4 0H-6.4Z`;
    return I(22, 30, sh(14) + [[-6, -22, -30], [6, -23, 30], [0, -27, 0], [-3, -17, -60], [4, -17, 60], [-8, -15, -80], [8, -15, 80]].map(([x, y, a]) => `<path d="M0 -10Q${x * .4} ${(y - 10) / 2} ${x} ${y}" stroke="#3f7d2a" stroke-width=".8" fill="none"/><ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.2" fill="#4c9a3f" transform="rotate(${a} ${x} ${y})"/><ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.2" fill="url(#fiSph)" transform="rotate(${a} ${x} ${y})"/>`).join("") +
      P(pot, "#c96b3d") + `<rect x="-8.6" y="-11" width="17.2" height="2.6" rx=".8" fill="#b35a30"/>` + S(pot, "fiCyl")); })();
  L.icecream = (() => { const d = `M-14 0L-15 -12H15L14 0Z`;
    return I(32, 24, sh(28) + P(d, "#fbe3ec") + `<rect x="-15" y="-9" width="30" height="5" fill="#e57fae"/>` + txt("EIS", -5.4, 3.6) + S(d, "fiFlat") + `<rect x="-15.6" y="-13.4" width="31.2" height="2.6" rx="1" fill="#e57fae"/>` +
      `<circle cx="-3" cy="-17" r="4.6" fill="#fff5d8"/><circle cx="4" cy="-16.4" r="4.2" fill="#f6b3cc"/><circle cx="-3" cy="-17" r="4.6" fill="url(#fiSph)"/><circle cx="4" cy="-16.4" r="4.2" fill="url(#fiSph)"/>`); })();
  L.creamcheese = openTub({ c: "#7d4bb3", t: "FRISCHKÄSE", w: 24, h: 9, content: "#fbfaf6", mound: false, foil: "#c9b6e0" });
  L.creamcheese = I(L.creamcheese.w, L.creamcheese.h, L.creamcheese.svg + `<path d="M-6 -10Q0 -12.6 6 -10" stroke="#ece6da" stroke-width="1.6" fill="none"/>` + [[-4, -10.6], [1, -11.4], [4, -9.8], [-1, -9.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".45" fill="#3f8f3a"/>`).join(""));

  /* ================= Weitere Produkte ================= */
  /* --- Milch & Käse --- */
  L.mascarpone = openTub({ c: "#1f4fa0", t: "MASCARPONE", w: 22, h: 10, content: "#fff7e2", foil: "#d9e2ee" });
  L.ricotta = (() => { const w = 18, h = 13, d = `M${-w / 2} ${-h}L${-w / 2 + 1.6} 0H${w / 2 - 1.6}L${w / 2} ${-h}Z`;
    return I(w + 3, h + 7, sh(w) + P(d, "#eef3f6", ` opacity=".85"`) + `<path d="M${-w / 2 + .8} ${-h + 1}H${w / 2 - .8}L${w / 2 - 2} -.6H${-w / 2 + 2}Z" fill="#fbfaf4"/><path d="M${-w / 2 + .8} ${-h + 1}H${w / 2 - .8}L${w / 2 - 2} -.6H${-w / 2 + 2}Z" fill="url(#fiCurd)" opacity=".5"/>` +
      Array.from({ length: 5 }, (_, i) => `<path d="M${-w / 2 + 2 + i * 3.4} ${-h + 1}L${-w / 2 + 2.6 + i * 3.2} -1" stroke="#cfd8e0" stroke-width=".5"/>`).join("") + S(d, "fiCyl") + S(d, "fiGlass", .8) +
      `<ellipse cx="0" cy="${-h}" rx="${w / 2 + .4}" ry="2" fill="#2f9e44"/>` + `<rect x="-6" y="-8" width="12" height="4" rx="1" fill="#2f9e44"/>` + txt("RICOTTA", -5.2, 2.6)); })();
  L.halloumi = pack({ w: 26, h: 12, frame: "#fbfaf4", t: "HALLOUMI", tc: "#1f4fa0", win: `<rect x="-9.6" y="-8.6" width="19.2" height="7" rx="1.6" fill="#f6efda"/><path d="M-6 -8.6V-1.6M0 -8.6V-1.6M6 -8.6V-1.6" stroke="#d9c79a" stroke-width=".6"/><path d="M-9 -6.4h18" stroke="#fff" stroke-width=".7" opacity=".6"/>` });
  L.camembert = (() => { const w = 26, h = 9, d = RR(-w / 2, -h, w, h, 2.6);
    return I(w + 3, h + 7, sh(w) + P(d, "#d9b47a") + `<path d="M${-w / 2} ${-h + 3}H${w / 2}" stroke="#b58a4a" stroke-width=".5"/>` + txt("CAMEMBERT", -2.6, 3, "#4a2c12") + S(d, "fiCyl") +
      `<ellipse cx="0" cy="${-h}" rx="${w / 2}" ry="3.4" fill="#e8c98e"/><ellipse cx="0" cy="${-h}" rx="${w / 2 - 1.4}" ry="2.6" fill="#fbf6ea"/><path d="M-6 ${-h - .6}h4M1 ${-h + .6}h5M-2 ${-h - 1.6}h3" stroke="#ece2cc" stroke-width=".6"/>` +
      `<path d="M${w / 2 - 1} ${-h}L${w / 2 - 6} ${-h - 2.6}" stroke="#4a2c12" stroke-width=".4" opacity=".3"/>`); })();
  L.minicheese = I(26, 12, sh(24) + [[-7, -5.4], [2, -5.8], [9, -4.6]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="#d62f2f"/><circle cx="${x}" cy="${y}" r="5" fill="url(#fiSph)"/>` + (i === 1 ? `<path d="M${x - 1} ${y - 5}L${x + 1.6} ${y}L${x - 1} ${y + 5}" fill="#f4d45a"/><path d="M${x - 1} ${y - 5}L${x + 1.6} ${y}L${x - 1} ${y + 5}" stroke="#b8241c" stroke-width=".5" fill="none"/>` : `<path d="M${x - 2} ${y - 4.6}Q${x + 1} ${y - 5.4} ${x + 3.6} ${y - 3}" stroke="#ff8a80" stroke-width=".7" fill="none"/>`)).join(""));
  L.yogurtdrink = wideBottle({ fill: "#f7c6d6", cap: "#e57fae", label: "#fff", t: "DRINK", lc: "#d0457a", w: 10, h: 24 });
  L.ricepudding = openTub({ c: "#f28c28", t: "MILCHREIS", w: 20, h: 12, content: "#fbf3df", mound: true, foil: "#f6d6b0" });
  L.ricepudding = I(L.ricepudding.w, L.ricepudding.h, L.ricepudding.svg + Array.from({ length: 9 }, (_, i) => `<ellipse cx="${-6 + (i * 4.3) % 12}" cy="${-13 - (i % 3)}" rx=".8" ry=".35" fill="#efe4c8"/>`).join("") + `<path d="M-4 -14.4Q0 -16 4 -14.4" stroke="#c47a2a" stroke-width=".9" fill="none" opacity=".7"/>`);
  L.eggwhite = (() => { const w = 13, h = 30, d = RR(-w / 2, -h + 5, w, h - 5, 2.4);
    return I(w + 6, h + 5, sh(w) + P(d, "#f3f6f8") + `<path d="M${-w / 2 + .8} ${-h * .62}H${w / 2 - .8}V-1H${-w / 2 + .8}Z" fill="#fbfdff" opacity=".9"/>` + `<rect x="${-w / 2}" y="-20" width="${w}" height="9" fill="#f2c12e"/>` + txt("EIKLAR", -15.2, 2.9, "#5a4200") + txt("flüssig", -12.4, 2, "#5a4200", 600) +
      S(d, "fiCyl") + S(d, "fiGlass", .9) + `<path d="M${w / 2} ${-h + 8}Q${w / 2 + 4} ${-h + 10} ${w / 2 + 2} -6" stroke="#dfe5ea" stroke-width="1.6" fill="none"/>` +
      `<rect x="-3" y="${-h}" width="6" height="5.4" rx="1" fill="#f2c12e"/>` + S(RR(-3, -h, 6, 5.4, 1), "fiCyl")); })();
  L.ghee = jar({ glass: "#f6e7b5", fill: "#f2c94c", lid: "#c9a227", t: "GHEE", w: 18, h: 18, lc: "#8a6d1d" });
  L.sprayCream = (() => { const d = RR(-6, -26, 12, 26, 2);
    return I(15, 36, sh(12) + P(d, "#e8edf2") + `<rect x="-6" y="-19" width="12" height="11" fill="#2f6fbf"/>` + txt("SPRÜH", -14.2, 2.6) + txt("SAHNE", -11.2, 2.6) + S(d, "fiCyl") +
      `<path d="M-5 -26Q0 -30 5 -26Z" fill="#c9ced6"/><rect x="-2.2" y="-33" width="4.4" height="5" rx="1.4" fill="#fff"/><path d="M-1.8 -33L0 -35L1.8 -33" fill="#fff"/>` + S(RR(-2.2, -33, 4.4, 5, 1.4), "fiCyl")); })();

  /* --- Fleisch & Fisch --- */
  L.drumsticks = tray({ base: "#2f3238", rim: "#50555e", label: true, lc: "#e8a10f", food: [[-9, 0], [0, 1], [9, 0]].map(([x, s]) => `<path d="M${x - 4} -9C${x - 6} -14 ${x - 1} -17 ${x + 2} -15C${x + 4} -14 ${x + 4} -11 ${x + 2} -9.6L${x + 5} -9Z" fill="${s ? "#efb0a0" : "#f3bcae"}"/><path d="M${x - 4} -9C${x - 6} -14 ${x - 1} -17 ${x + 2} -15" fill="none" stroke="#fde2d8" stroke-width=".7"/><circle cx="${x + 5.4}" cy="-9.2" r="1.2" fill="#f6efe2"/>`).join("") });
  L.meatballs = tray({ base: "#d4dae1", rim: "#bcc5cf", label: true, food: [[-10, -11.6], [-3.4, -12.4], [3.4, -12], [10, -11.4], [-6.6, -15.6], [0, -16.4], [6.6, -15.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#b8504f"/><circle cx="${x}" cy="${y}" r="3.4" fill="url(#fiMince)" opacity=".6"/><circle cx="${x}" cy="${y}" r="3.4" fill="url(#fiSph)"/>`).join("") });
  L.smokedsalmon = pack({ w: 32, h: 12, frame: "#1f3a5a", t: "RÄUCHERLACHS", tc: "#0f2236", win: [-9, -3, 3, 9].map((x, i) => `<path d="M${x - 5} -2C${x - 6} -7 ${x + 1} -10 ${x + 5} -7C${x + 6} -4 ${x + 3} -1.6 ${x - 5} -2Z" fill="${i % 2 ? "#f28a5a" : "#f59e6e"}"/><path d="M${x - 3} -3.4Q${x} -6.4 ${x + 3} -6" stroke="#fde3cf" stroke-width=".6" fill="none"/>`).join("") });
  L.sardines = (() => { const w = 26, h = 8, d = RR(-w / 2, -h, w, h, 3);
    return I(w + 3, h + 6, sh(w) + P(d, "#1f6aa0") + `<rect x="${-w / 2 + 3}" y="${-h + 1.6}" width="${w - 6}" height="${h - 3.2}" rx="1.4" fill="#fff"/>` + txt("SARDINEN", -2.6, 2.6, "#1f6aa0") + S(d, "fiCyl") +
      `<path d="M${-w / 2} ${-h}H${w / 2}" stroke="#c9ced6" stroke-width="1.6" stroke-linecap="round"/><circle cx="${w / 2 - 3}" cy="${-h - 1.4}" r="1.6" fill="none" stroke="#c9ced6" stroke-width=".8"/>`); })();
  L.veggieburger = box({ c: "#2f7d32", top: "#1f5a22", t: "VEGGIE", w: 28, h: 14, sideW: 3, motif: [-7, 3].map(x => `<ellipse cx="${x}" cy="-5.6" rx="4.6" ry="2.4" fill="#8a5a32"/><ellipse cx="${x}" cy="-5.6" rx="4.6" ry="2.4" fill="url(#fiCrumb)"/><path d="M${x - 3} -5.6h6" stroke="#5a3418" stroke-width=".6"/>`).join("") });
  L.chorizo = I(30, 10, sh(26) + `<path d="M-13 -4Q-2 -10 12 -5" stroke="#a52a1e" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M-11 -6Q-2 -11 10 -7" stroke="#d24b3a" stroke-width="1.2" fill="none" opacity=".7"/>` + [-8, -3, 2, 7].map((x, i) => `<circle cx="${x}" cy="${-6 + (i % 2) * .6}" r=".5" fill="#f6dbd5"/>`).join("") + `<path d="M-15 -3.4l-2 -1.4M14 -5.4l2 -1" stroke="#c9b48a" stroke-width=".8"/>`);

  /* --- Gemüse --- */
  L.greenbeans = I(30, 10, sh(26) + [[-4.6, -12, 4], [-3, -10, -4], [-1.4, -12.6, 8]].map(([y, x, a], i) => `<path d="M-12 ${y}Q0 ${y - 2.6} 12 ${y + 1}" stroke="${["#3d8a33", "#4f9e3d", "#2f7a2a"][i]}" stroke-width="2.2" stroke-linecap="round" fill="none"/>`).join("") + `<path d="M-10 -5.6Q0 -8 10 -4.6" stroke="#9fd07a" stroke-width=".5" fill="none"/>`);
  L.asparagus = I(32, 12, sh(28) + [-2, -4.4, -6.6].map((y, i) => `<path d="M-13 ${y}H11" stroke="${["#5f9c35", "#4c8a2a", "#6aaa3e"][i]}" stroke-width="2.2" stroke-linecap="round"/><path d="M11 ${y}l3 -.2" stroke="#7a5a8a" stroke-width="2" stroke-linecap="round"/>` + [-8, -3, 2, 7].map(x => `<path d="M${x} ${y - .9}l1 -.6" stroke="#3f7a1f" stroke-width=".5"/>`).join("")).join("") + `<rect x="-6" y="-8.6" width="2.4" height="8" rx=".6" fill="#c0392b"/>`);
  L.radish = I(28, 18, sh(24) + [[-7, -5], [0, -4.4], [7, -5.4]].map(([x, y]) => `<path d="M${x} ${y - 3}Q${x - 2} ${y - 9} ${x - 4} ${y - 12}M${x} ${y - 3}Q${x + 2} ${y - 9} ${x + 3} ${y - 13}" stroke="#4c9a3f" stroke-width="1.4" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="3.8" fill="#d6245a"/><circle cx="${x}" cy="${y}" r="3.8" fill="url(#fiSph)"/><path d="M${x} ${y + 3.6}v2" stroke="#f3e8ee" stroke-width=".6"/>`).join(""));
  L.beetroot = round({ c: "#7a1238", d: "#a8285a", r: 8, shape: "round", stem: "#a8285a", leaf: "#3f7a2a", spot: `<path d="M0 0v2.6" stroke="#5a0a28" stroke-width=".8"/>` });
  L.pumpkin = I(30, 24, sh(28) + [[-7, "#e2701c"], [7, "#e2701c"], [0, "#f08a2a"]].map(([x, c]) => `<ellipse cx="${x}" cy="-10" rx="${x ? 7.6 : 7}" ry="9.6" fill="${c}"/><ellipse cx="${x}" cy="-10" rx="${x ? 7.6 : 7}" ry="9.6" fill="url(#fiSph)"/>`).join("") + `<path d="M0 -19.4Q1 -22.6 3 -23.4" stroke="#6b4426" stroke-width="2" stroke-linecap="round" fill="none"/>`);
  L.kohlrabi = round({ c: "#b9d98a", d: "#d9eeb8", r: 8, shape: "round", stem: "", leaf: "", spot: `<path d="M-2 -16Q-6 -22 -8 -26M2 -16Q5 -23 8 -26M0 -16V-25" stroke="#7fae4a" stroke-width="1.2" fill="none"/><path d="M-8 -26q-3 -2 -1 -4q3 0 1 4M8 -26q3 -2 1 -4q-3 0 -1 4M0 -25q-2 -3 0 -4q2 1 0 4" fill="#5f9c35"/>` });
  L.cabbage = I(26, 22, sh(24) + `<circle cx="0" cy="-10" r="10.4" fill="#7a2a6a"/><circle cx="0" cy="-10" r="10.4" fill="url(#fiSph)"/>` + [[-4, -14, 6], [3, -8, 5], [-2, -6, 4]].map(([x, y, r]) => `<path d="M${x - r} ${y}Q${x} ${y - r * 1.2} ${x + r} ${y}" stroke="#b56aa6" stroke-width=".8" fill="none"/>`).join(""));
  L.brusselsprouts = I(24, 12, sh(22) + [[-7, -4], [0, -4.6], [7, -4], [-3.6, -8.6], [3.6, -8.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.7" fill="#6aa83d"/><path d="M${x - 2.6} ${y}Q${x} ${y - 3.4} ${x + 2.6} ${y}M${x - 1.6} ${y + 1.6}Q${x} ${y - 1} ${x + 1.6} ${y + 1.6}" stroke="#a6d170" stroke-width=".55" fill="none"/><circle cx="${x}" cy="${y}" r="3.7" fill="url(#fiSph)"/>`).join(""));
  L.celery = I(14, 36, sh(12) + [-3, 0, 3].map((x, i) => `<path d="M${x} 0V-22" stroke="${["#9fcf6e", "#b5dc86", "#8cc45c"][i]}" stroke-width="3" stroke-linecap="round"/>`).join("") + `<path d="M-4 -22q-3 -6 0 -10q2 3 1 9M3 -22q4 -6 1 -11q-2 4 -2 10M0 -22q-1 -8 1 -12q1 5 0 11" fill="#5f9c35"/>`);
  L.olives = jar({ glass: "#dfe9cf", fill: "#5a6a2a", lid: "#2f3b1a", t: "OLIVEN", w: 16, h: 22, label: "#fff", lc: "#3a4a1a" });
  L.olives = I(L.olives.w, L.olives.h, L.olives.svg + [[-4, -5], [0, -3.6], [4, -5.2], [-2, -18], [3, -19]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="1.5" fill="#4a5a1e"/><ellipse cx="${x - .6}" cy="${y - .5}" rx=".6" ry=".35" fill="#c9d48a" opacity=".6"/>`).join(""));
  L.pickles = jar({ glass: "#e6efd6", fill: "#c9d68a", lid: "#c0392b", t: "GURKEN", w: 18, h: 26, label: "#fff", lc: "#2f6e2a" });
  L.pickles = I(L.pickles.w, L.pickles.h, L.pickles.svg + [-5, -1.6, 1.8, 5.2].map(x => `<rect x="${x - 1.5}" y="-22" width="3" height="${x % 2 ? 7 : 6}" rx="1.5" fill="#4f7a2a"/><rect x="${x - 1.5}" y="-6.6" width="3" height="5.4" rx="1.5" fill="#5a8a30"/>`).join(""));
  L.sauerkraut = can({ c: "#f4efe0", t: "SAUERKRAUT", band: "#2f7d32", tc: "#fff", art: `<path d="M-7 -6q2 -2 4 0t4 0t4 0" stroke="#e2d9a8" stroke-width="1" fill="none"/>` });
  L.coconutmilk = can({ c: "#f7f5ee", t: "KOKOSMILCH", band: "#3b2a1a", tc: "#fff", art: `<circle cx="0" cy="-6.4" r="3" fill="#6b4426"/><path d="M-3 -6.4a3 3 0 0 0 6 0Z" fill="#fff"/>` });
  L.edamame = frozen(bag({ c: "#2f8a5a", band: "#1d5f3c", t: "EDAMAME", w: 26, h: 32, top: "crimp", winBg: "#e8f4df", win: (w, h, x, y) => [[5, 4, 20], [12, 6, -15], [6, 11, -30], [13, 12, 10]].map(([a, b, r]) => `<g transform="rotate(${r} ${x + a} ${y + b})"><path d="M${x + a - 4.4} ${y + b}Q${x + a} ${y + b - 3.2} ${x + a + 4.4} ${y + b}Q${x + a} ${y + b + 2.2} ${x + a - 4.4} ${y + b}Z" fill="#6cae3a"/>` + [-2.4, 0, 2.4].map(d => `<circle cx="${x + a + d}" cy="${y + b - .4}" r=".9" fill="#9fd06a"/>`).join("") + `</g>`).join("") }), 26, 32);

  /* --- Obst --- */
  L.watermelon = I(30, 18, sh(28) + `<path d="M-14 -2A14 14 0 0 1 14 -2Z" fill="#2f7a2a"/><path d="M-12.6 -2.4A12.6 12.6 0 0 1 12.6 -2.4Z" fill="#e9f4d0"/><path d="M-11.6 -2.6A11.6 11.6 0 0 1 11.6 -2.6Z" fill="#e8394a"/><path d="M-11.6 -2.6A11.6 11.6 0 0 1 11.6 -2.6Z" fill="url(#fiSoft)"/>` +
    [[-6, -5], [-2, -8], [3, -7.6], [7, -4.6], [0, -4]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx=".6" ry="1" fill="#2a1a10"/>`).join(""));
  L.coconut = I(24, 22, sh(22) + `<circle cx="0" cy="-10" r="10" fill="#6b4426"/><circle cx="0" cy="-10" r="10" fill="url(#fiCrumb)"/><circle cx="0" cy="-10" r="10" fill="url(#fiSph)"/>` + [[-3, -14], [1, -15.4], [-1, -11.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" fill="#3a2414"/>`).join(""));
  L.grapefruit = round({ c: "#f2a05a", d: "#e2523a", r: 9.6, shape: "round", stem: "", leaf: "" });
  L.apricot = round({ c: "#f6a83a", d: "#e2702a", r: 6.4, shape: "round", stem: "#6b4426", leaf: "" });
  L.raisins = kraft({ c: "#5a2a4a", t: "ROSINEN", tc: "#3a1a2a", w: 20, h: 26, winBg: "#7a3a5a", win: (w, h, x, y) => Array.from({ length: 12 }, (_, i) => `<ellipse cx="${x + 2 + (i * 3.3) % (w - 3)}" cy="${y + 2 + (i * 2.7) % (h - 3)}" rx="1.2" ry=".8" fill="#3a1424"/>`).join("") });
  L.applesauce = jar({ glass: "#f6efd6", fill: "#e9cf8a", lid: "#c0392b", t: "APFELMUS", w: 18, h: 24, label: "#fff", lc: "#c0392b" });
  L.fig = round({ c: "#6a3a6a", d: "#9a5a8a", r: 7, shape: "pear", stem: "#4a6a2a", leaf: "" });

  /* --- Brot, Getreide, Samen --- */
  L.bagels = I(30, 12, sh(28) + [-7, 7].map(x => `<ellipse cx="${x}" cy="-5.6" rx="7" ry="5" fill="#c98a42"/><ellipse cx="${x}" cy="-5.6" rx="7" ry="5" fill="url(#fiSph)"/><ellipse cx="${x}" cy="-6" rx="2.2" ry="1.4" fill="#8a5a2a"/>` + Array.from({ length: 8 }, (_, i) => `<ellipse cx="${x + Math.cos(i * .8) * 4.6}" cy="${-5.6 + Math.sin(i * .8) * 3}" rx=".55" ry=".3" fill="#fbf3dc"/>`).join("")).join(""));
  L.pita = I(30, 10, sh(28) + `<ellipse cx="0" cy="-4" rx="14" ry="4.4" fill="#e6c48a"/><ellipse cx="0" cy="-5" rx="13" ry="3.6" fill="#f2dcae"/><ellipse cx="0" cy="-5" rx="13" ry="3.6" fill="url(#fiSoft)"/>` + [[-6, -5.6], [2, -6], [7, -4.6], [-2, -4]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry=".7" fill="#c98a42" opacity=".6"/>`).join(""));
  L.baguette = I(40, 10, sh(34) + `<path d="M-17 -4Q-17 -9 -12 -9H13Q18 -9 18 -4Q18 0 13 0H-12Q-17 0 -17 -4Z" fill="#d39545"/><path d="M-17 -4Q-17 -9 -12 -9H13Q18 -9 18 -4Q18 0 13 0H-12Q-17 0 -17 -4Z" fill="url(#fiSph)"/>` + [-10, -3, 4, 11].map(x => `<path d="M${x - 2.4} -6.4L${x + 2.4} -3.4" stroke="#f2d3a0" stroke-width="1.4" stroke-linecap="round"/>`).join(""));
  L.pretzel = I(24, 18, sh(20) + `<path d="M0 -3C-10 -3 -12 -14 -5 -15C1 -16 3 -8 0 -6C-3 -8 -1 -16 5 -15C12 -14 10 -3 0 -3Z" fill="none" stroke="#7a3e14" stroke-width="3.4" stroke-linejoin="round"/><path d="M0 -3C-10 -3 -12 -14 -5 -15C1 -16 3 -8 0 -6C-3 -8 -1 -16 5 -15C12 -14 10 -3 0 -3Z" fill="none" stroke="#a8601e" stroke-width="1.4"/>` + [[-7, -10], [6, -11], [0, -4.4], [-3, -14]].map(([x, y]) => `<rect x="${x}" y="${y}" width=".9" height=".7" fill="#fff"/>`).join(""));
  L.croissant = I(28, 14, sh(24) + `<path d="M-12 -3Q-14 -9 -8 -10Q0 -15 8 -10Q14 -9 12 -3Q6 -6 0 -6Q-6 -6 -12 -3Z" fill="#d9963f"/><path d="M-12 -3Q-14 -9 -8 -10Q0 -15 8 -10Q14 -9 12 -3Q6 -6 0 -6Q-6 -6 -12 -3Z" fill="url(#fiSph)"/>` + [-5, 0, 5].map(x => `<path d="M${x - 1.4} -12.4Q${x} -8 ${x + 1.4} -6.4" stroke="#a8601e" stroke-width=".7" fill="none"/>`).join(""));
  L.chia = kraft({ c: "#2b2b2b", t: "CHIA", tc: "#1a1a1a", w: 20, h: 26, winBg: "#9aa0a6", win: (w, h, x, y) => Array.from({ length: 40 }, (_, i) => `<ellipse cx="${r2(x + 1.2 + (i * 2.3) % (w - 2))}" cy="${r2(y + 1.2 + (i * 1.7) % (h - 2))}" rx=".55" ry=".4" fill="${i % 3 ? "#2a2a2e" : "#e9e6de"}"/>`).join("") });
  L.linseed = kraft({ c: "#a8743a", t: "LEINSAMEN", tc: "#3a2a14", w: 20, h: 26, winBg: "#c7914e", win: (w, h, x, y) => Array.from({ length: 34 }, (_, i) => `<ellipse cx="${r2(x + 1.2 + (i * 2.3) % (w - 2))}" cy="${r2(y + 1.2 + (i * 1.9) % (h - 2))}" rx=".7" ry=".4" fill="#7a4a1a" transform="rotate(${i * 40} ${r2(x + 1.2 + (i * 2.3) % (w - 2))} ${r2(y + 1.2 + (i * 1.9) % (h - 2))})"/>`).join("") });
  L.tortellini = clearBag({ w: 26, h: 26, band: "#2f7d32", t: "TORTELLINI", base: "#f4ead0", content: (w, h) => [[-7, -6], [0, -7], [7, -5], [-4, -12], [4, -13], [-7, -18], [6, -19]].map(([x, y]) => `<path d="M${x - 3} ${y}Q${x} ${y - 4} ${x + 3} ${y}Q${x} ${y + 1.6} ${x - 3} ${y}Z" fill="#f2cf72"/><circle cx="${x}" cy="${y - .8}" r=".9" fill="#d9a63a"/>`).join("") });

  /* --- Saucen, Backen, Aufstriche --- */
  L.tahini = jar({ glass: "#efe2c6", fill: "#d9b780", lid: "#2b2b2b", t: "TAHIN", w: 16, h: 20, lc: "#6b4426" });
  L.hotsauce = bottle({ c: "#d22a1e", cap: "#2f7d32", label: "#fff", t: "CHILI", h: 30, w: 11, neck: 9, lc: "#d22a1e", pet: true });
  L.bbq = bottle({ c: "#4a1a10", cap: "#222", label: "#f2c12e", t: "BBQ", h: 32, w: 15, neck: 6, lc: "#4a1a10", pet: true });
  L.salsa = jar({ glass: "#f2d2c6", fill: "#c8402a", lid: "#2f7d32", t: "SALSA", w: 18, h: 18, lc: "#c8402a", fillPat: "fiSeed" });
  L.maple = bottle({ c: "#a85a14", cap: "#6b2a10", label: "#f6efe2", t: "AHORN", h: 30, w: 14, neck: 8, alpha: .85, lc: "#6b2a10" });
  L.cocoa = (() => { const d = RR(-8, -20, 16, 20, 2.4);
    return I(19, 24, sh(16) + P(d, "#5a3420") + `<rect x="-8" y="-14" width="16" height="7" fill="#f2dcae"/>` + txt("KAKAO", -9.4, 3, "#5a3420") + S(d, "fiCyl") + `<ellipse cx="0" cy="-20" rx="8" ry="1.8" fill="#c9a227"/><ellipse cx="0" cy="-20" rx="6.4" ry="1.2" fill="#e8c860"/>`); })();
  L.yeast = I(14, 10, sh(12) + `<rect x="-5.6" y="-7.6" width="11.2" height="7.6" rx="1" fill="#f2c12e"/><path d="M-5.6 -7.6L-3.6 -9.6H7.6L5.6 -7.6Z" fill="#f8d84a"/><path d="M5.6 -7.6L7.6 -9.6V-2L5.6 0Z" fill="#d4a812"/>` + txt("HEFE", -2.4, 2.6, "#7a5a00"));
  L.vanilla = I(18, 14, sh(16) + [-4, 0, 4].map((x, i) => `<g transform="rotate(${i * 8 - 8} ${x} -6)"><rect x="${x - 3.2}" y="-12" width="6.4" height="10" rx=".6" fill="#f7f1df"/><rect x="${x - 3.2}" y="-12" width="6.4" height="3" fill="#6b3a8a"/></g>`).join(""));
  L.mate = bottle({ c: "#e9a52b", cap: "#d4d8de", label: "#2b5aa0", t: "MATE", h: 40, w: 13, neck: 12, alpha: .9, lc: "#fff" });
  L.icetea = brick({ c: "#e98a2b", body: "#fbf2e2", t: "EISTEE", sub: "Pfirsich", w: 16, h: 34, cap: "#2f7d32", art: `<circle cx="-1.6" cy="-26" r="3.2" fill="#f5a25c"/><path d="M-1.6 -29Q-1 -31 1 -31.4" stroke="#3f8f3a" stroke-width=".8" fill="none"/>` });
  L.sparkling = bottle({ c: "#cfe6d8", cap: "#2f7d32", label: "#2f7d32", t: "SPRUDEL", h: 46, w: 14, neck: 12, alpha: .7, lc: "#fff" });
  L.sparkling = I(L.sparkling.w, L.sparkling.h, L.sparkling.svg + [[-3, -12], [2, -16], [-1, -26], [3, -30], [-2, -36]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="#fff" opacity=".8"/>`).join(""));
  L.iso = bottle({ c: "#3ab0e2", cap: "#1f2937", label: "#fff", t: "ISO", h: 38, w: 14, neck: 6, alpha: .85, lc: "#1f6aa0", pet: true });
  L.kombucha = bottle({ c: "#c7963a", cap: "#2b2b2b", label: "#f4efe2", t: "KOMBUCHA", h: 36, w: 13, neck: 10, alpha: .85, lc: "#4a3a1a" });
  L.sekt = bottle({ c: "#2f4a2a", cap: "#c9a227", label: "#f4efe2", t: "SEKT", h: 50, w: 14, neck: 16, alpha: .95, lc: "#2f4a2a" });

  /* --- Süßes, Snacks, Sport, Tiefkühl --- */
  L.popcorn = bag({ c: "#f6efe2", band: "#d62f2f", t: "POPCORN", w: 24, h: 30, top: "crimp", winBg: "#fffaf0", win: (w, h, x, y) => Array.from({ length: 9 }, (_, i) => `<circle cx="${x + 3 + (i % 3) * 5.4}" cy="${y + 3 + Math.floor(i / 3) * 4.4}" r="2.2" fill="#fffbe8"/><circle cx="${x + 3.6 + (i % 3) * 5.4}" cy="${y + 3.4 + Math.floor(i / 3) * 4.4}" r=".8" fill="#f2c94c"/>`).join("") });
  L.muesli_bar = (() => { const it = L.proteinbar; return I(it.w, it.h, it.svg.replace('fill="#222b38"', 'fill="#e2c48a"').replace(/>PROTEIN</, ">MÜSLI<")); })();
  L.icepop = I(16, 30, sh(10) + `<rect x="-1.2" y="-8" width="2.4" height="8" rx="1" fill="#e2c48a"/><path d="M-6 -9V-24Q-6 -28 0 -28Q6 -28 6 -24V-9Z" fill="#6b3a20"/><path d="M-6 -9V-24Q-6 -28 0 -28Q6 -28 6 -24V-9Z" fill="url(#fiCyl)"/><path d="M-4 -25Q-4 -26.6 -2 -26.8" stroke="#fff" stroke-width=".9" opacity=".6" fill="none"/>`);
  L.bcaa = (() => { const d = RR(-9, -20, 18, 20, 3); return I(21, 26, sh(18) + P(d, "#1f2937") + `<rect x="-8" y="-25" width="16" height="5" rx="1.5" fill="#22b8cf"/><rect x="-9" y="-14" width="18" height="7" fill="#22b8cf"/>` + txt("BCAA", -9, 3.6, "#1f2937") + S(d, "fiCyl")); })();
  L.ricecakechoc = I(20, 16, sh(18) + [0, 1, 2].map(i => `<ellipse cx="0" cy="${-3 - i * 3.6}" rx="8.6" ry="2.6" fill="#f2e4c4"/>`).join("") + `<ellipse cx="0" cy="-11" rx="8.6" ry="2.8" fill="#4a2c18"/><ellipse cx="-2" cy="-11.6" rx="3" ry=".8" fill="#7a5038"/>`);
  L.frozensalmon = frozen(box({ c: "#1f3a5a", top: "#f28a5a", t: "LACHS", w: 28, h: 14, sideW: 3, motif: `<path d="M-9 -4C-9 -8 2 -9 6 -6C7 -4 4 -2.4 -9 -4Z" fill="#f28a5a"/><path d="M-6 -5.4Q-1 -7.4 4 -6" stroke="#fde3cf" stroke-width=".6" fill="none"/>` }), 28, 14);
  L.frozenshrimp = frozen(bag({ c: "#1f6aa0", band: "#0f4a7a", t: "GARNELEN", w: 26, h: 30, top: "crimp", winBg: "#e8f2f8", win: (w, h, x, y) => [[5, 5], [12, 6], [8, 11]].map(([a, b]) => `<path d="M${x + a + 3} ${y + b - 1}A3.4 3.4 0 1 0 ${x + a + 2} ${y + b + 2.6}" stroke="#f0855c" stroke-width="2.2" fill="none" stroke-linecap="round"/>`).join("") }), 26, 30);
  L.frozenmango = frozen(bag({ c: "#f2a51c", band: "#c0392b", t: "MANGO", w: 24, h: 30, top: "crimp", winBg: "#fff4d6", win: (w, h, x, y) => [[4, 4], [10, 3.4], [6, 9], [12, 9.6], [8, 14]].map(([a, b]) => `<rect x="${x + a - 2}" y="${y + b - 2}" width="4" height="4" rx=".8" fill="#f8b630" transform="rotate(${a * 9} ${x + a} ${y + b})"/>`).join("") }), 24, 30);
  L.bakerolls = frozen(bag({ c: "#e9eef3", band: "#c47a2a", t: "AUFBACK", w: 28, h: 26, top: "crimp", winBg: "#fbf6ea", win: (w, h, x, y) => [[5, 5], [14, 5], [9.6, 10]].map(([a, b]) => `<ellipse cx="${x + a}" cy="${y + b}" rx="4.2" ry="3" fill="#e9c78a"/><path d="M${x + a - 2} ${y + b - 1}Q${x + a} ${y + b + .4} ${x + a + 2} ${y + b - 1}" stroke="#fbf0d8" stroke-width=".7" fill="none"/>`).join("") }), 28, 26);

  return L;
})();

document.body.insertAdjacentHTML("afterbegin", FI_DEFS);

/* Produktname → Icon. Reihenfolge = Priorität (spezifisch vor allgemein). */
const FOOD_RULES = [
  [/protein ?(shake|drink)|eiwei(ß|ss) ?drink|milchshake/, "proteinshake"], [/erdnuss ?butter|erdnussmus|peanut|mandelmus|nussmus|nussbutter|cashewmus/, "pb"],
  [/reiswaffel|maiswaffel/, "ricecakes"], [/milchreis|grieß/, "rice"],
  [/protein ?pudding|high protein pud|pudding|grießpudding/, "pudding"], [/whey|proteinpulver|protein ?pulver|isolat|casein/, "protein"], [/kreatin|creatin/, "creatine"],
  [/proteinriegel|protein ?bar|eiweißriegel|müsliriegel|riegel/, "proteinbar"], [/schokolade|schoko|chocolate|kakao(?! ?drink)/, "chocolate"],
  [/skyr/, "skyr"], [/griech|greek/, "greek"], [/hüttenkäse|körnig|cottage/, "cottage"],
  [/frischkäse|philadelphia|streichkäse|ziegenfrischkäse/, "creamcheese"], [/quark/, "quark"], [/schmand|saure sahne|sauerrahm|crème fra(î|i)che|creme fra(î|i)che|schmant/, "sourcream"],
  [/kefir|ayran|trinkjoghurt|lassi/, "kefir"], [/joghurt|yogurt|jogurt|yoghurt/, "yogurt"], [/buttermilch/, "buttermilk"],
  [/hafer ?(milch|drink)|oat ?(milk|drink)|haferdrink/, "oatmilk"], [/soja ?(milch|drink)|soy ?milk/, "soymilk"], [/mandel ?(milch|drink)|almond ?(milk|drink)|cashew ?drink|reis ?drink/, "almondmilk"],
  [/laktosefrei.*milch|milch.*laktosefrei|lactosefrei/, "lfmilk"], [/sahne|cremefine|rama cremefine|cream(?! ?cheese)/, "cream"], [/milch|milk/, "milk"],
  [/margarine|pflanzenfett|halbfettbutter|streichfett|rama\b|becel|lätta/, "margarine"], [/butter|ghee/, "butter"],
  [/mozzarella|burrata/, "mozzarella"], [/feta|hirtenkäse|schafskäse|weißkäse/, "feta"], [/parmesan|grana padano|pecorino|parmigiano/, "parmesan"],
  [/scheiben|scheibletten|toastkäse|sandwich ?käse|käse ?aufschnitt/, "slices"], [/käse|cheese|gouda|emmentaler|edamer|cheddar|bergkäse|camembert|brie/, "cheese"],
  [/\beier\b|\bei\b|freiland|eggs?\b|bodenhaltung/, "eggs"],
  [/lachs|salmon/, "salmon"], [/thunfisch|tuna/, "tuna"], [/garnele|shrimp|scampi|krabben/, "shrimp"], [/fischstäbchen|backfisch/, "fishsticks"],
  [/fisch|kabeljau|seelachs|forelle|pangasius|dorsch|alaska/, "fish"],
  [/hack|mince|gehacktes|bolognese ?fleisch/, "mince"], [/nuggets|chicken ?wings|crispy|hähnchen ?schenkel ?tk|knusper ?hähnchen/, "frozenchicken"],
  [/(hähnchen|hühner|puten|geflügel)(brust)? ?(aufschnitt|wurst|salami|scheiben)|(hähnchen|puten)brust ?(fein|hauchdünn|gegart)/, "chickenslices"],
  [/schnitzel/, "schnitzel"], [/pute|truthahn|turkey/, "turkey"], [/hähnchen|haehnchen|huhn|hühner|chicken|geflügel/, "chicken"],
  [/speck|bacon|bauchspeck|pancetta/, "bacon"], [/salami|chorizo|pepperoni|cervelat|mettwurst/, "salami"], [/schinken|aufschnitt|ham\b|prosciutto|bierschinken/, "ham"],
  [/bratwurst|rostbratwurst|grillwurst|nürnberger/, "bratwurst"], [/würstchen|wiener|frankfurter|wurst|bockwurst|hot ?dog/, "sausage"],
  [/steak|rind|beef|schwein|kotelett|gulasch|lamm|filet/, "steak"], [/tofu|tempeh|seitan/, "tofu"], [/hummus|humus/, "hummus"],
  [/pizza|flammkuchen/, "pizza"], [/(^|\s)eis(\s|$)|eiscreme|speiseeis|ice ?cream|sorbet|magnum/, "icecream"], [/pommes|fries|wedges|kroketten|rösti/, "fries"],
  [/rahmspinat|tk.?spinat|spinat.*(tk|tiefgek|gefroren)|blattspinat portion/, "frozenspinach"], [/erbsen/, "peas"],
  [/beeren tk|tk.?beeren|tiefkühl.?beeren|beerenmisch|beeren.?mix|früchte.?mix/, "frozenberries"],
  [/brokkoli|broccoli/, "broccoli"], [/blumenkohl/, "cauliflower"], [/gelbe paprika/, "pepperY"], [/grüne paprika/, "pepperG"], [/paprika(?!pulver|.?gewürz)/, "pepper"],
  [/tomatenmark/, "tomatopaste"], [/passata|passiert|tomatensoße|tomatensauce|pastasauce|nudelsauce|sugo|arrabbiata/, "passata"],
  [/gehackte tomaten|dosentomaten|stückige tomaten|tomaten.*dose|pizzatomaten/, "tomatocan"], [/cherry|cocktailtomate|datteltomate|snacktomate/, "cherrytomato"], [/tomate/, "tomato"],
  [/gurke/, "cucumber"], [/zucchini/, "zucchini"], [/aubergine/, "eggplant"], [/möhre|karotte|rübe|rüebli/, "carrot"],
  [/frühlingszwiebel|lauchzwiebel/, "springonion"], [/rote zwiebel/, "redonion"], [/lauch|porree/, "leek"], [/zwiebel|schalotte/, "onion"], [/knoblauch/, "garlic"],
  [/ingwer|ginger/, "ginger"], [/chili(?!pulver|.?flocken|.?soße|.?sauce)|peperoni|jalape/, "chili"],
  [/süßkartoffel|batate/, "sweetpotato"], [/kartoffeln|potatoes|drillinge/, "potatoes"], [/kartoffel|potato/, "potato"],
  [/champignon|pilz|shiitake|kräuterseitling/, "mushroom"], [/rucola|rauke/, "rucola"], [/spinat|feldsalat|babyspinat/, "spinach"], [/salat|eisberg|romana|kopfsalat/, "lettuce"],
  [/avocado/, "avocado"], [/mais/, "corn"], [/kichererbse/, "chickpeas"], [/linse/, "lentils"], [/bohne|kidney/, "beans"], [/gemüse|wok|gemuese|ratatouille/, "frozenveg"],
  [/granatapfel/, "pomegranate"], [/grüner apfel|granny/, "greenapple"], [/apfel|äpfel|apple/, "apple"], [/birne/, "pear"],
  [/mandarine|clementine/, "mandarin"], [/orange|blutorange|grapefruit/, "orange"], [/zitrone|lemon/, "lemon"], [/limette/, "lime"],
  [/pfirsich|nektarine|aprikose|marille/, "peach"], [/pflaume|zwetschge|zwetschke/, "plum"], [/kirsche/, "cherries"],
  [/kiwi/, "kiwi"], [/banane|banana/, "banana"], [/traube|weintraube/, "grapes"], [/erdbeer/, "strawberry"], [/himbeer|brombeer/, "raspberry"],
  [/heidelbeer|blaubeer|beere/, "berries"], [/mango/, "mango"], [/ananas/, "pineapple"], [/melone/, "melon"], [/dattel|feige/, "dates"],
  [/kochbeutel/, "ricecup"], [/basmati|jasmin/, "basmati"], [/reis(?!waffel)|rice/, "rice"], [/spaghetti|linguine|tagliatelle|bandnudel/, "spaghetti"],
  [/fusilli|spirelli|farfalle/, "fusilli"], [/mie|ramen|asia.?nudel|udon|glasnudel|reisnudel|instant ?nudel|yum ?yum/, "noodles"], [/gnocchi|schupfnudel/, "gnocchi"],
  [/nudel|penne|pasta|makkaroni|tortellini|ravioli|rigatoni/, "pasta"], [/couscous|bulgur/, "couscous"], [/quinoa|amaranth|hirse/, "quinoa"],
  [/granola|crunchy|knusper|crunch/, "granola"], [/cornflakes|flakes|cerealien|cereals|choco ?pops/, "cornflakes"], [/müsli|muesli/, "cereal"],
  [/hafer|oat|porridge|haferkleie/, "oats"], [/knäcke/, "crispbread"], [/vollkornbrot|pumpernickel|eiweißbrot|roggenbrot|schwarzbrot|vollkorn ?brot|sandwichbrot/, "wholegrain"],
  [/toast/, "toast"], [/brötchen|semmel|aufback|baguette|ciabatta|laugen/, "rolls"], [/wrap|tortilla/, "wraps"], [/brot|bread/, "bread"],
  [/rapsöl|sonnenblumenöl|kokosöl|bratöl/, "rapeoil"], [/öl\b|olivenöl|oil/, "oil"], [/essig|balsamico/, "vinegar"], [/soja ?soße|sojasauce|soy|teriyaki/, "soy"],
  [/ketchup|bbq|grillsauce/, "ketchup"], [/senf/, "mustard"], [/mayo|remoulade|aioli/, "mayo"], [/pesto/, "pesto"], [/honig|honey|sirup|agave/, "honey"],
  [/marmelade|konfitüre|gelee|fruchtaufstrich/, "jam"], [/nutella|nougat|nuss.?nougat|schoko ?creme/, "nutella"],
  [/mehl|flour/, "flour"], [/zucker|sugar|erythrit|xylit|süßstoff/, "sugar"], [/backpulver|natron|hefe|vanille/, "bakingpowder"], [/salz|salt/, "salt"], [/pfeffer/, "peppermill"],
  [/zimt/, "cinnamon"], [/kräuter|oregano|basilikum|petersilie|thymian|schnittlauch|dill/, "herbs"], [/brühe|bouillon|fond/, "stock"], [/curry|kurkuma/, "curry"],
  [/gewürz|chili|paprikapulver|knoblauchpulver/, "spice"],
  [/gummi|haribo|fruchtgummi|weingummi|lakritz/, "gummies"], [/chips|flips|nachos|popcorn|cracker/, "chips"], [/keks|cookie|kekse|waffel|zwieback/, "cookies"],
  [/nüsse|nuss|mandel|cashew|walnuss|studentenfutter|pistazie|erdnüsse/, "nuts"],
  [/wasser|water|sprudel/, "water"], [/cola|pepsi|limo|fanta|sprite|schorle|eistee/, "cola"], [/energy|red bull|monster/, "energy"], [/kaffee|coffee|espresso/, "coffee"],
  [/tee\b|tea/, "tea"], [/saft|juice|smoothie|nektar/, "juice"], [/wein|wine|sekt|prosecco/, "wine"], [/bier|beer|radler/, "beer"]
];
const FOOD_CAT_FALLBACK = { milch: "yogurt", fleisch: "chicken", gemuese: "pepper", obst: "apple", tiefkuehl: "frozenveg", kohlenhydrate: "rice", oel: "oil", backen: "flour", gewuerze: "spice", suess: "chocolate", sonstiges: "boxGeneric" };
const GENERIC_TAG = /dairies|fermented|milk-products|^en:foods?$|beverages|plant-based|products|groceries|snacks$|meals|spreads$|condiments|sweeteners|^en:fats$/;
const normName = s => String(s || "").normalize("NFC").toLowerCase().replace(/\s+/g, " ").trim();
function iconFromText(t) { for (const [re, k] of FOOD_RULES) if (re.test(t)) return k; return null; }
/* „ohne Zucker“, „zuckerfrei“, „no added sugar“ … dürfen nicht zum Zucker-Symbol führen */
const NEGATED = /(ohne (zusatz von |zugesetzten? )?zucker(zusatz)?|zuckerfrei|zuckerarm|zuckerreduziert|ohne zuckerzusatz|0 ?% ?zucker|sugar[- ]?free|no (added )?sugars?|without (added )?sugars?|unsweetened|ungesüßt|ohne süßungsmittel|laktosefrei(?= ?(quark|joghurt|skyr|käse|butter|sahne)))/g;
/* eindeutige Getränke-Kategorien von Open Food Facts schlagen den Namen (z. B. „Volvic“) */
function iconFromTags(tags) {
  const t = (tags || []).join(" ");
  if (/waters\b|mineral-water|spring-water|eaux|mineralwasser|wasser\b/.test(t)) return /carbonated|sparkling|gazeuse|mit-kohlensaure|sprudel/.test(t) ? "sparkling" : "water";
  if (/energy-drinks/.test(t)) return "energy";
  if (/\bjuices?\b|fruit-juices|nectars|smoothies/.test(t)) return "juice";
  if (/sodas|colas|soft-drinks/.test(t) && !/teas/.test(t)) return "cola";
  if (/iced-teas/.test(t)) return "icetea";
  if (/\bbeers\b/.test(t)) return "beer";
  if (/\bwines\b/.test(t)) return "wine";
  return null;
}
function foodIconKey(p) {
  if (p.icon && FI[p.icon]) return p.icon;
  const tk = iconFromTags(p.tags); if (tk) return tk;
  const full = normName(p.name).replace(NEGATED, " "), base = full.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  let k = base && iconFromText(base);
  if (!k && p.tags && p.tags.length) for (const tag of [...p.tags].reverse()) { if (GENERIC_TAG.test(tag)) continue; k = iconFromText(tag.replace(/^[a-z]{2}:/, "").replace(/-/g, " ")); if (k) break; }
  return k || iconFromText(full) || FOOD_CAT_FALLBACK[p.cat] || "boxGeneric";
}
/* Namen & Gruppen für die Symbol-Auswahl */
const ICON_GROUPS = [["milch", "Milch & Eier"], ["fleisch", "Fleisch, Fisch & Veggie"], ["gemuese", "Gemüse"], ["obst", "Obst"], ["tiefkuehl", "Tiefkühl"], ["kohlenhydrate", "Brot, Reis & Nudeln"], ["saucen", "Öl, Saucen & Backen"], ["suess", "Süßes & Sport"], ["drinks", "Getränke"], ["sonst", "Sonstiges"]];
const ICON_NAMES = {
  milk: ["Milch", "milch"], lfmilk: ["Laktosefreie Milch", "milch"], oatmilk: ["Haferdrink", "milch"], soymilk: ["Sojadrink", "milch"], almondmilk: ["Mandeldrink", "milch"], cream: ["Sahne", "milch"],
  buttermilk: ["Buttermilch", "milch"], kefir: ["Kefir", "milch"], quark: ["Quark", "milch"], skyr: ["Skyr", "milch"], yogurt: ["Joghurt", "milch"], greek: ["Griech. Joghurt", "milch"],
  cottage: ["Körniger Frischkäse", "milch"], creamcheese: ["Frischkäse", "milch"], sourcream: ["Schmand", "milch"], pudding: ["Pudding", "milch"], butter: ["Butter", "milch"],
  margarine: ["Margarine", "milch"], cheese: ["Käse", "milch"], parmesan: ["Parmesan", "milch"], slices: ["Käsescheiben", "milch"], mozzarella: ["Mozzarella", "milch"], feta: ["Feta", "milch"], eggs: ["Eier", "milch"],
  chicken: ["Hähnchen", "fleisch"], turkey: ["Pute", "fleisch"], mince: ["Hackfleisch", "fleisch"], steak: ["Steak / Rind", "fleisch"], schnitzel: ["Schnitzel", "fleisch"], salmon: ["Lachs", "fleisch"],
  fish: ["Fisch", "fleisch"], shrimp: ["Garnelen", "fleisch"], tuna: ["Thunfisch", "fleisch"], ham: ["Schinken", "fleisch"], salami: ["Salami", "fleisch"], chickenslices: ["Geflügel-Aufschnitt", "fleisch"],
  sausage: ["Würstchen", "fleisch"], bratwurst: ["Bratwurst", "fleisch"], bacon: ["Bacon", "fleisch"], tofu: ["Tofu", "fleisch"], hummus: ["Hummus", "fleisch"],
  broccoli: ["Brokkoli", "gemuese"], cauliflower: ["Blumenkohl", "gemuese"], pepper: ["Paprika rot", "gemuese"], pepperY: ["Paprika gelb", "gemuese"], pepperG: ["Paprika grün", "gemuese"],
  tomato: ["Tomate", "gemuese"], cherrytomato: ["Cherrytomaten", "gemuese"], cucumber: ["Gurke", "gemuese"], zucchini: ["Zucchini", "gemuese"], eggplant: ["Aubergine", "gemuese"], carrot: ["Karotte", "gemuese"],
  onion: ["Zwiebel", "gemuese"], redonion: ["Rote Zwiebel", "gemuese"], springonion: ["Frühlingszwiebel", "gemuese"], leek: ["Lauch", "gemuese"], garlic: ["Knoblauch", "gemuese"], ginger: ["Ingwer", "gemuese"],
  chili: ["Chili", "gemuese"], potato: ["Kartoffel", "gemuese"], potatoes: ["Kartoffeln (Netz)", "gemuese"], sweetpotato: ["Süßkartoffel", "gemuese"], mushroom: ["Champignons", "gemuese"],
  lettuce: ["Salat", "gemuese"], spinach: ["Spinat", "gemuese"], rucola: ["Rucola", "gemuese"], avocado: ["Avocado", "gemuese"], corn: ["Mais (Dose)", "gemuese"], beans: ["Bohnen (Dose)", "gemuese"],
  chickpeas: ["Kichererbsen", "gemuese"], lentils: ["Linsen", "gemuese"], passata: ["Passata", "gemuese"], tomatopaste: ["Tomatenmark", "gemuese"], tomatocan: ["Tomaten (Dose)", "gemuese"],
  apple: ["Apfel", "obst"], greenapple: ["Grüner Apfel", "obst"], pear: ["Birne", "obst"], orange: ["Orange", "obst"], mandarin: ["Mandarine", "obst"], lemon: ["Zitrone", "obst"], lime: ["Limette", "obst"],
  peach: ["Pfirsich", "obst"], plum: ["Pflaume", "obst"], kiwi: ["Kiwi", "obst"], banana: ["Banane", "obst"], grapes: ["Trauben", "obst"], berries: ["Heidelbeeren", "obst"], raspberry: ["Himbeeren", "obst"],
  strawberry: ["Erdbeeren", "obst"], cherries: ["Kirschen", "obst"], mango: ["Mango", "obst"], pineapple: ["Ananas", "obst"], melon: ["Melone", "obst"], dates: ["Datteln", "obst"], pomegranate: ["Granatapfel", "obst"],
  frozenveg: ["TK-Gemüse", "tiefkuehl"], peas: ["TK-Erbsen", "tiefkuehl"], frozenspinach: ["TK-Spinat", "tiefkuehl"], frozenberries: ["TK-Beeren", "tiefkuehl"], pizza: ["Pizza", "tiefkuehl"],
  icecream: ["Eis", "tiefkuehl"], fries: ["Pommes", "tiefkuehl"], frozenchicken: ["Nuggets", "tiefkuehl"], fishsticks: ["Fischstäbchen", "tiefkuehl"],
  rice: ["Reis", "kohlenhydrate"], basmati: ["Basmati", "kohlenhydrate"], ricecup: ["Kochbeutelreis", "kohlenhydrate"], pasta: ["Nudeln", "kohlenhydrate"], fusilli: ["Fusilli", "kohlenhydrate"],
  spaghetti: ["Spaghetti", "kohlenhydrate"], noodles: ["Mie-Nudeln", "kohlenhydrate"], gnocchi: ["Gnocchi", "kohlenhydrate"], couscous: ["Couscous", "kohlenhydrate"], quinoa: ["Quinoa", "kohlenhydrate"],
  oats: ["Haferflocken", "kohlenhydrate"], cereal: ["Müsli", "kohlenhydrate"], cornflakes: ["Cornflakes", "kohlenhydrate"], granola: ["Granola", "kohlenhydrate"], bread: ["Brot", "kohlenhydrate"],
  wholegrain: ["Vollkornbrot", "kohlenhydrate"], toast: ["Toast", "kohlenhydrate"], rolls: ["Brötchen", "kohlenhydrate"], wraps: ["Wraps", "kohlenhydrate"], ricecakes: ["Reiswaffeln", "kohlenhydrate"], crispbread: ["Knäckebrot", "kohlenhydrate"],
  oil: ["Olivenöl", "saucen"], rapeoil: ["Rapsöl", "saucen"], vinegar: ["Essig", "saucen"], soy: ["Sojasauce", "saucen"], ketchup: ["Ketchup", "saucen"], mustard: ["Senf", "saucen"], mayo: ["Mayo", "saucen"],
  pesto: ["Pesto", "saucen"], honey: ["Honig", "saucen"], jam: ["Konfitüre", "saucen"], pb: ["Erdnussbutter", "saucen"], nutella: ["Nuss-Nougat-Creme", "saucen"], flour: ["Mehl", "saucen"], sugar: ["Zucker", "saucen"],
  bakingpowder: ["Backpulver", "saucen"], salt: ["Salz", "saucen"], peppermill: ["Pfeffer", "saucen"], spice: ["Gewürz", "saucen"], cinnamon: ["Zimt", "saucen"], herbs: ["Kräuter", "saucen"], curry: ["Curry", "saucen"], stock: ["Brühe", "saucen"],
  chocolate: ["Schokolade", "suess"], proteinbar: ["Proteinriegel", "suess"], gummies: ["Fruchtgummi", "suess"], chips: ["Chips", "suess"], cookies: ["Kekse", "suess"], nuts: ["Nüsse", "suess"],
  protein: ["Proteinpulver", "suess"], creatine: ["Kreatin", "suess"], proteinshake: ["Proteinshake", "suess"],
  water: ["Wasser", "drinks"], cola: ["Cola / Limo", "drinks"], energy: ["Energy Drink", "drinks"], juice: ["Saft", "drinks"], coffee: ["Kaffee", "drinks"], tea: ["Tee", "drinks"], wine: ["Wein", "drinks"], beer: ["Bier", "drinks"],
  boxGeneric: ["Packung", "sonst"], bagGeneric: ["Tüte", "sonst"], jarGeneric: ["Glas", "sonst"], canGeneric: ["Dose", "sonst"]
};

/* neue, spezielle Regeln – stehen vor den allgemeinen */
FOOD_RULES.unshift(
  [/^(?!.*(sprudel|classic|medium|kohlensäure|spritzig|sparkling|perlend)).*(volvic|evian|gerolsteiner|vittel|adelholzener|bonaqa|vio\b|christinen|rhön|apollinaris|selters|fiji|san pellegrino|aqua ?(panna|mia)|still(es)? wasser|naturelle|mineralwasser|quellwasser|tafelwasser)/, "water"],
  [/saft\b|säfte|juice|direktsaft|nektar|smoothie/, "juice"],
  [/kokosmilch|kokosnussmilch|coconut milk/, "coconutmilk"], [/eiklar|eiweiß ?flüssig|egg ?white|flüssigei/, "eggwhite"], [/milchreis/, "ricepudding"],
  [/joghurt ?drink|trinkjoghurt|yogurt ?drink/, "yogurtdrink"], [/sprühsahne|sprüh ?sahne/, "sprayCream"], [/ghee|butterschmalz/, "ghee"],
  [/mascarpone/, "mascarpone"], [/ricotta/, "ricotta"], [/halloumi|grillkäse/, "halloumi"], [/camembert|brie\b/, "camembert"], [/mini ?käse|babybel|minis\b/, "minicheese"],
  [/räucherlachs|graved/, "smokedsalmon"], [/lachs.*(tk|tiefk|gefroren)|(tk|tiefkühl).*lachs/, "frozensalmon"], [/garnelen.*(tk|tiefk|gefroren)|(tk|tiefkühl).*garnelen/, "frozenshrimp"],
  [/mango.*(tk|tiefk|gefroren)|(tk|tiefkühl).*mango/, "frozenmango"], [/aufback|backbrötchen/, "bakerolls"],
  [/hähnchenschenkel|unterschenkel|drumstick|keulen?\b|chicken ?legs/, "drumsticks"], [/frikadelle|bällchen|meatball|köttbullar|buletten/, "meatballs"],
  [/sardine|makrele|hering|matjes|sprotten/, "sardines"], [/veggie|vegan.*(burger|patty|frikadelle)|(burger|patty).*vegan/, "veggieburger"], [/chorizo/, "chorizo"],
  [/grüne bohnen|brechbohnen|buschbohnen|prinzessbohnen|stangenbohnen/, "greenbeans"], [/spargel/, "asparagus"], [/radieschen|rettich/, "radish"], [/rote bete|rote beete|randen/, "beetroot"],
  [/kürbis|hokkaido|butternut/, "pumpkin"], [/kohlrabi/, "kohlrabi"], [/rotkohl|weißkohl|spitzkohl|wirsing|blaukraut/, "cabbage"], [/rosenkohl/, "brusselsprouts"], [/sellerie/, "celery"],
  [/oliven(?!öl)/, "olives"], [/gewürzgurke|essiggurke|cornichon|gurken ?im ?glas/, "pickles"], [/sauerkraut/, "sauerkraut"], [/edamame/, "edamame"],
  [/wassermelone/, "watermelon"], [/kokosnuss|kokos(?!milch|öl)/, "coconut"], [/grapefruit|pampelmuse/, "grapefruit"], [/aprikose|marille/, "apricot"],
  [/rosinen|sultanin|trockenobst|cranberries getrocknet/, "raisins"], [/apfelmus|apfelmark/, "applesauce"], [/feige/, "fig"],
  [/bagel/, "bagels"], [/pita|fladenbrot|naan/, "pita"], [/baguette/, "baguette"], [/brezel|breze/, "pretzel"], [/croissant|hörnchen/, "croissant"],
  [/chia/, "chia"], [/leinsamen|flohsamen|hanfsamen/, "linseed"], [/tortellini|ravioli|maultasche/, "tortellini"],
  [/tahin|sesammus/, "tahini"], [/sriracha|chili ?(soße|sauce)|hot ?sauce|tabasco/, "hotsauce"], [/bbq|barbecue/, "bbq"], [/salsa|dip ?sauce/, "salsa"], [/ahornsirup|maple/, "maple"],
  [/kakao ?pulver|backkakao|kakaopulver/, "cocoa"], [/\bhefe\b|trockenhefe/, "yeast"], [/vanillezucker|vanille ?schote|vanillin/, "vanilla"],
  [/mate\b|club-mate|mate tee/, "mate"], [/eistee|ice ?tea/, "icetea"], [/sprudel|mineralwasser|medium|classic|kohlensäure|spritzig|sparkling|gerolsteiner|apollinaris|selters|pellegrino/, "sparkling"], [/iso ?(drink|tonic)|isotonisch|elektrolyt/, "iso"], [/kombucha/, "kombucha"], [/\bsekt\b|prosecco|champagner|crémant/, "sekt"],
  [/popcorn/, "popcorn"], [/müsliriegel|haferriegel|früchteriegel|granola ?bar/, "muesli_bar"], [/eis am stiel|stieleis|magnum|calippo/, "icepop"], [/bcaa|eaa|aminos/, "bcaa"],
  [/schoko.*reiswaffel|reiswaffel.*schoko/, "ricecakechoc"]
);
Object.assign(ICON_NAMES, {
  mascarpone: ["Mascarpone", "milch"], ricotta: ["Ricotta", "milch"], halloumi: ["Halloumi", "milch"], camembert: ["Camembert", "milch"], minicheese: ["Mini-Käse", "milch"],
  yogurtdrink: ["Joghurtdrink", "milch"], ricepudding: ["Milchreis", "milch"], eggwhite: ["Eiklar", "milch"], ghee: ["Ghee", "milch"], sprayCream: ["Sprühsahne", "milch"],
  drumsticks: ["Hähnchenschenkel", "fleisch"], meatballs: ["Frikadellen", "fleisch"], smokedsalmon: ["Räucherlachs", "fleisch"], sardines: ["Sardinen", "fleisch"], veggieburger: ["Veggie-Burger", "fleisch"], chorizo: ["Chorizo", "fleisch"],
  greenbeans: ["Grüne Bohnen", "gemuese"], asparagus: ["Spargel", "gemuese"], radish: ["Radieschen", "gemuese"], beetroot: ["Rote Bete", "gemuese"], pumpkin: ["Kürbis", "gemuese"], kohlrabi: ["Kohlrabi", "gemuese"],
  cabbage: ["Rotkohl / Kohl", "gemuese"], brusselsprouts: ["Rosenkohl", "gemuese"], celery: ["Sellerie", "gemuese"], olives: ["Oliven", "gemuese"], pickles: ["Gewürzgurken", "gemuese"], sauerkraut: ["Sauerkraut", "gemuese"], coconutmilk: ["Kokosmilch", "gemuese"],
  watermelon: ["Wassermelone", "obst"], coconut: ["Kokosnuss", "obst"], grapefruit: ["Grapefruit", "obst"], apricot: ["Aprikose", "obst"], raisins: ["Rosinen", "obst"], applesauce: ["Apfelmus", "obst"], fig: ["Feige", "obst"],
  edamame: ["TK-Edamame", "tiefkuehl"], frozensalmon: ["TK-Lachs", "tiefkuehl"], frozenshrimp: ["TK-Garnelen", "tiefkuehl"], frozenmango: ["TK-Mango", "tiefkuehl"], bakerolls: ["Aufbackbrötchen", "tiefkuehl"], icepop: ["Eis am Stiel", "tiefkuehl"],
  bagels: ["Bagels", "kohlenhydrate"], pita: ["Pita / Fladenbrot", "kohlenhydrate"], baguette: ["Baguette", "kohlenhydrate"], pretzel: ["Brezel", "kohlenhydrate"], croissant: ["Croissant", "kohlenhydrate"],
  chia: ["Chiasamen", "kohlenhydrate"], linseed: ["Leinsamen", "kohlenhydrate"], tortellini: ["Tortellini", "kohlenhydrate"],
  tahini: ["Tahin", "saucen"], hotsauce: ["Chilisauce", "saucen"], bbq: ["BBQ-Sauce", "saucen"], salsa: ["Salsa", "saucen"], maple: ["Ahornsirup", "saucen"], cocoa: ["Kakao", "saucen"], yeast: ["Hefe", "saucen"], vanilla: ["Vanillezucker", "saucen"],
  popcorn: ["Popcorn", "suess"], muesli_bar: ["Müsliriegel", "suess"], bcaa: ["BCAA / EAA", "suess"], ricecakechoc: ["Schoko-Reiswaffeln", "suess"],
  mate: ["Mate", "drinks"], icetea: ["Eistee", "drinks"], sparkling: ["Sprudelwasser", "drinks"], iso: ["Iso-Drink", "drinks"], kombucha: ["Kombucha", "drinks"], sekt: ["Sekt", "drinks"]
});

/* SVG für ein Produkt im Regal: bei mehreren Packungen bis zu 3 hintereinander */
function foodSVG(key, copies, unit = 1.2, partial) {
  const it = FI[key] || FI.boxGeneric;
  const n = Math.max(1, Math.min(3, copies));
  const off = it.w * .32, lift = 2.6;
  const W = it.w + off * (n - 1) + 4, H = it.h + lift * (n - 1) + 4;
  let g = "";
  for (let i = n - 1; i >= 0; i--) {
    const x = W / 2 + (i - (n - 1) / 2) * off, y = H - 2 - i * lift;
    g += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"${i ? ` opacity=".93"` : ""}>${it.svg}</g>`;
  }
  return `<svg class="fi" viewBox="0 0 ${W.toFixed(1)} ${H.toFixed(1)}" width="${(W * unit).toFixed(0)}" height="${(H * unit).toFixed(0)}"${partial ? ` style="opacity:.75"` : ""}>${g}</svg>`;
}

