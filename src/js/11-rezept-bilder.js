/* ---------- Rezept-Illustrationen ---------- */
const PHOTO_KEY = "makro.recipePhotos";
let recipePhotos = loadJSON(PHOTO_KEY, {});

function seeded(seed) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
}
/* ---------- Rezeptbilder (realistisch gezeichnet) ---------- */
let artSeq = 0;
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = f < 0 ? 0 : 255, p = Math.abs(f);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function makeArt(seed) {
  const R = seeded(seed), u = "a" + (++artSeq) + "_", defs = new Map();
  const f1 = n => +n.toFixed(1);
  const stopsHTML = st => st.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ""}/>`).join("");
  const A = {
    R, u, f1,
    rnd: (a, b) => a + R() * (b - a),
    rg(name, st, o = {}) {
      const id = u + name;
      if (!defs.has(id)) defs.set(id, `<radialGradient id="${id}" cx="${o.cx ?? .38}" cy="${o.cy ?? .34}" r="${o.r ?? .75}">${stopsHTML(st)}</radialGradient>`);
      return `url(#${id})`;
    },
    lg(name, st, o = {}) {
      const id = u + name;
      if (!defs.has(id)) defs.set(id, `<linearGradient id="${id}" x1="${o.x1 ?? 0}" y1="${o.y1 ?? 0}" x2="${o.x2 ?? 0}" y2="${o.y2 ?? 1}">${stopsHTML(st)}</linearGradient>`);
      return `url(#${id})`;
    },
    rot: (a, x, y) => `transform="translate(${f1(x)} ${f1(y)}) rotate(${a.toFixed(0)})"`,
    /* unregelmäßige, weiche Form */
    blob(cx, cy, r, wob = .12, n = 12, ry) {
      const pts = [];
      for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2, k = 1 + (R() - .5) * 2 * wob;
        pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * (ry ?? r) * k]);
      }
      const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      let d = `M${mid(pts[n - 1], pts[0]).map(f1).join(" ")}`;
      for (let i = 0; i < n; i++) { const m = mid(pts[i], pts[(i + 1) % n]); d += `Q${f1(pts[i][0])} ${f1(pts[i][1])} ${f1(m[0])} ${f1(m[1])}`; }
      return d + "Z";
    },
    /* Punkte in einer Fläche verteilen, ohne dass alles übereinander klebt */
    place(reg, n, minD = 4) {
      const pts = [];
      for (let t = 0; t < n * 40 && pts.length < n; t++) {
        let x, y;
        if (reg.a0 != null) {
          const a = A.rnd(reg.a0, reg.a1), r = Math.sqrt(A.rnd((reg.r0 || 0) ** 2 / reg.r ** 2, 1)) * reg.r;
          x = reg.cx + Math.cos(a) * r; y = reg.cy + Math.sin(a) * r;
        } else if (reg.w) {
          x = reg.x + R() * reg.w; y = reg.y + R() * reg.h;
        } else {
          const a = R() * Math.PI * 2, r = Math.sqrt(R()) * reg.r;
          x = reg.cx + Math.cos(a) * r; y = reg.cy + Math.sin(a) * (reg.ry ?? reg.r) / reg.r * r;
        }
        if (pts.every(p => (p[0] - x) ** 2 + (p[1] - y) ** 2 >= minD * minD)) pts.push([x, y]);
      }
      return pts.sort((a, b) => a[1] - b[1]);
    },
    many(reg, n, minD, fn) { return A.place(reg, n, minD).map(([x, y]) => fn(x, y, A.rnd(0, 360))).join(""); },
    shadowGroup: body => `<g filter="url(#${u}sh)">${body}</g>`,

    /* ---- Untergründe ---- */
    table(kind) {
      let b = "";
      if (kind === "wood") {
        b += `<rect width="160" height="120" fill="${A.lg("wood", [[0, "#8a5d3b"], [1, "#5e3c24"]], { x2: 1, y2: 1 })}"/>`;
        for (let i = 0; i < 4; i++) {
          b += `<rect y="${i * 30}" width="160" height="30" fill="${["#000", "#fff"][i % 2]}" opacity="${f1(.04 + R() * .05)}"/>`;
          b += `<path d="M0 ${i * 30}H160" stroke="#2b1a0e" stroke-opacity=".45" stroke-width=".8"/>`;
          for (let k = 0; k < 4; k++) {
            const y = i * 30 + 4 + R() * 22;
            b += `<path d="M0 ${f1(y)}C40 ${f1(y + A.rnd(-3, 3))} 90 ${f1(y + A.rnd(-3, 3))} 160 ${f1(y + A.rnd(-2, 2))}" stroke="${R() > .5 ? "#2b1a0e" : "#c9935f"}" stroke-opacity=".18" stroke-width="${f1(A.rnd(.4, .9))}" fill="none"/>`;
          }
        }
      } else if (kind === "linen") {
        const pid = u + "lin";
        defs.set(pid, `<pattern id="${pid}" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><path d="M0 .6H2.4M.6 0V2.4" stroke="#8b7a5e" stroke-opacity=".10" stroke-width=".5"/></pattern>`);
        b += `<rect width="160" height="120" fill="#ece3d3"/><rect width="160" height="120" fill="url(#${pid})"/>`;
        b += `<path d="M118 0L160 0L160 120L136 120Z" fill="#cfd9c8" opacity=".55"/><path d="M118 0L136 120" stroke="#b3c2a9" stroke-width=".8" opacity=".7"/>`;
      } else {
        b += `<rect width="160" height="120" fill="${A.lg("marble", [[0, "#f7f7f8"], [1, "#e6e6ea"]], { x2: 1 })}"/>`;
        for (let i = 0; i < 6; i++) {
          let x = A.rnd(-20, 160), y = A.rnd(-10, 40), d = `M${f1(x)} ${f1(y)}`;
          for (let k = 0; k < 5; k++) { x += A.rnd(10, 35); y += A.rnd(8, 28); d += `Q${f1(x - A.rnd(0, 20))} ${f1(y - A.rnd(-12, 12))} ${f1(x)} ${f1(y)}`; }
          b += `<path d="${d}" stroke="#9a9aa8" stroke-opacity="${f1(A.rnd(.12, .3))}" stroke-width="${f1(A.rnd(.3, 1.1))}" fill="none"/>`;
        }
      }
      return b;
    },
    light: () => `<rect width="160" height="120" fill="${A.rg("vig", [[0, "#fff", .14], [.55, "#fff", 0], [1, "#000", .28]], { cx: .32, cy: .25, r: .95 })}"/>`,

    /* ---- Geschirr ---- */
    castShadow: (cx, cy, rx, ry, op = .32) => `<ellipse cx="${f1(cx + 4)}" cy="${f1(cy + 6)}" rx="${rx}" ry="${ry}" fill="#000" opacity="${op}" filter="url(#${u}bl)"/>`,
    plate(cx, cy, r) {
      return A.castShadow(cx, cy, r, r * .97) +
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${A.rg("plate", [[0, "#ffffff"], [.8, "#f6f6f3"], [.94, "#e3e3de"], [1, "#cfcfc9"]], { cx: .42, cy: .4, r: .62 })}"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${f1(r * .74)}" fill="${A.rg("well", [[0, "#fdfdfc"], [.86, "#f2f2ee"], [1, "#dcdcd6"]], { cx: .46, cy: .44, r: .58 })}"/>` +
        `<path d="M${f1(cx - r * .88 * .94)} ${f1(cy + r * .88 * .34)}A${f1(r * .88)} ${f1(r * .88)} 0 0 1 ${f1(cx - r * .88 * .17)} ${f1(cy - r * .88 * .98)}" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".95"/>`;
    },
    bowl(cx, cy, r, glaze = "#f4f1ea") {
      return A.castShadow(cx, cy, r, r * .97, .36) +
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${A.rg("bowlO", [[0, shade(glaze, .5)], [.85, glaze], [1, shade(glaze, -.22)]], { cx: .4, cy: .38, r: .65 })}"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${f1(r * .87)}" fill="${A.rg("bowlI", [[0, shade(glaze, .45)], [.65, shade(glaze, .1)], [1, shade(glaze, -.35)]], { cx: .58, cy: .62, r: .62 })}"/>` +
        `<path d="M${f1(cx - r * .94 * .94)} ${f1(cy + r * .94 * .34)}A${f1(r * .94)} ${f1(r * .94)} 0 0 1 ${f1(cx - r * .94 * .17)} ${f1(cy - r * .94 * .98)}" stroke="#fff" stroke-width="1.8" stroke-linecap="round" fill="none" opacity=".9"/>`;
    },
    board(x, y, w, h) {
      return A.castShadow(x + w / 2, y + h / 2, w / 2, h / 2, .3) +
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${A.lg("board", [[0, "#d8a86c"], [1, "#b98345"]], { x2: 1, y2: .4 })}"/>` +
        Array.from({ length: 6 }, () => { const yy = y + 4 + R() * (h - 8); return `<path d="M${x + 3} ${f1(yy)}Q${x + w / 2} ${f1(yy + A.rnd(-2, 2))} ${x + w - 3} ${f1(yy + A.rnd(-1.5, 1.5))}" stroke="#8b5a2b" stroke-opacity=".2" stroke-width=".6" fill="none"/>`; }).join("") +
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="#9a6a35" stroke-opacity=".6"/>`;
    },
    tray(x, y, w, h) {
      return A.castShadow(x + w / 2, y + h / 2, w / 2, h / 2, .35) +
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${A.lg("tray", [[0, "#5b5f66"], [1, "#2f3237"]])}"/>` +
        `<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="3" fill="#f3ead8"/>` +
        `<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="3" fill="${A.rg("paper", [[0, "#fff", .25], [1, "#a08050", .25]], { r: .9 })}"/>`;
    },
    fork(x, y, a = 0) {
      const g = A.lg("steel", [[0, "#f4f5f7"], [.5, "#b9bec6"], [1, "#e9ecf0"]], { x2: 1, y2: 0 });
      return `<g ${A.rot(a, x, y)}><g filter="url(#${u}sh)"><path d="M-1.6 -6 L-1.6 30 Q0 33 1.6 30 L1.6 -6 Z" fill="${g}"/><path d="M-4.6 -8 Q-4.6 -2 0 -1 Q4.6 -2 4.6 -8 Z" fill="${g}"/>${[-4.2, -1.5, 1.5, 4.2].map(t => `<rect x="${t - .6}" y="-24" width="1.2" height="17" rx=".6" fill="${g}"/>`).join("")}</g></g>`;
    },
    napkin(x, y, w, h, col = "#9fb8a0") {
      return `<g filter="url(#${u}sh)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="${col}"/><path d="M${x + w * .5} ${y}V${y + h}" stroke="#000" stroke-opacity=".08"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="${A.lg("nap", [[0, "#fff", .18], [1, "#000", .08]], { x2: 1, y2: 0 })}"/></g>`;
    },

    /* ---- Soßen & Grundlagen ---- */
    sauce(cx, cy, r, col, wob = .14, ry) {
      return `<path d="${A.blob(cx, cy, r, wob, 14, ry)}" fill="${A.rg("sauce" + col.slice(1), [[0, shade(col, .22)], [.7, col], [1, shade(col, -.3)]], { cx: .42, cy: .4, r: .7 })}"/>` +
        `<ellipse cx="${f1(cx - r * .32)}" cy="${f1(cy - r * .38)}" rx="${f1(r * .32)}" ry="${f1(r * .16)}" fill="#fff" opacity=".22" filter="url(#${u}bs)"/>`;
    },
    porridge(cx, cy, r, col) {
      let b = A.sauce(cx, cy, r, col, .04);
      b += A.many({ cx, cy, r: r * .92 }, 70, 1.6, (x, y, a) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="1.5" ry=".9" fill="${shade(col, R() > .5 ? -.12 : .12)}" opacity=".7" ${`transform="rotate(${a.toFixed(0)} ${f1(x)} ${f1(y)})"`}/>`);
      return b;
    },
    creamy(cx, cy, r, col) {
      let b = A.sauce(cx, cy, r, col, .03);
      for (let i = 0; i < 4; i++) b += `<path d="M${f1(cx - r * .7 + i * 4)} ${f1(cy - r * .2 + i * 5)}q${f1(r * .4)} ${f1(-r * .3)} ${f1(r * .8)} 0" stroke="#fff" stroke-width="1.4" opacity=".55" fill="none"/>`;
      return b;
    },
    drizzle(cx, cy, w, col, rows = 3) {
      let out = "";
      for (let r = 0; r < rows; r++) {
        const y0 = cy - (rows - 1) * 5 + r * 10 + A.rnd(-2, 2), seg = w / 3, amp = A.rnd(4, 7);
        let x = cx - w / 2 + A.rnd(-3, 3), y = y0, d = `M${f1(x)} ${f1(y)}`;
        for (let i = 0; i < 3; i++) {
          const nx = x + seg, ny = y0 + A.rnd(-2, 2), s2 = i % 2 ? 1 : -1;
          d += `C${f1(x + seg * .35)} ${f1(y + amp * s2)} ${f1(x + seg * .65)} ${f1(ny - amp * s2)} ${f1(nx)} ${f1(ny)}`;
          x = nx; y = ny;
        }
        out += `<path d="${d}" stroke="${shade(col, -.18)}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".92"/><path d="${d}" stroke="${shade(col, .4)}" stroke-width=".8" fill="none" stroke-linecap="round" opacity=".85" transform="translate(-.4 -.5)"/>`;
      }
      return out;
    },

    /* ---- Zutaten ---- */
    tomato(x, y, s = 4.6) {
      return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${s}" fill="${A.rg("tom", [[0, "#ff9e88"], [.5, "#ea3a2a"], [1, "#9c160e"]])}"/>` +
        `<path d="M${f1(x)} ${f1(y - 1.6)}l.7 1.3 1.3-.3-.9 1 .6 1.2-1.7-.6-1.7.6.6-1.2-.9-1 1.3.3z" fill="#3f7a2a"/>` +
        `<ellipse cx="${f1(x - s * .38)}" cy="${f1(y - s * .42)}" rx="${f1(s * .28)}" ry="${f1(s * .18)}" fill="#fff" opacity=".6"/>`;
    },
    tomatoSlice(x, y, s = 6.5) {
      let b = `<circle cx="${f1(x)}" cy="${f1(y)}" r="${s}" fill="#d42c1e"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(s * .84)}" fill="#f0503e"/>`;
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2 + .4, cx = x + Math.cos(a) * s * .45, cy = y + Math.sin(a) * s * .45;
        b += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(s * .3)}" ry="${f1(s * .2)}" fill="#ff8a70" transform="rotate(${(a * 57.3).toFixed(0)} ${f1(cx)} ${f1(cy)})"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r=".6" fill="#f6e3a0"/>`;
      }
      return b + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(s * .16)}" fill="#ffb3a0"/>`;
    },
    pepper(x, y, a, col, s = 1) {
      const g = col === "y" ? A.lg("pepY", [[0, "#ffe05c"], [1, "#e09600"]]) : col === "g" ? A.lg("pepG", [[0, "#7cc455"], [1, "#2a6f1d"]]) : A.lg("pepR", [[0, "#ff5a42"], [1, "#a8130a"]]);
      return `<g ${A.rot(a, x, y)}><path d="M${-5 * s} ${-1.5 * s}Q0 ${-2.4 * s} ${5 * s} ${-1.5 * s}L${5 * s} ${1.2 * s}Q0 ${.4 * s} ${-5 * s} ${1.2 * s}Z" fill="${g}" stroke="${g}" stroke-width="${f1(.8 * s)}" stroke-linejoin="round"/><path d="M${-4 * s} ${-1.1 * s}Q0 ${-1.8 * s} ${4 * s} ${-1.1 * s}" stroke="#fff" stroke-width=".5" opacity=".6" fill="none"/></g>`;
    },
    chickenSlice(x, y, a, s = 1) {
      return `<g ${A.rot(a, x, y)} ><rect x="${-8 * s}" y="${-3.6 * s}" width="${16 * s}" height="${7.2 * s}" rx="${3.2 * s}" fill="${A.rg("chk", [[0, "#f6d39a"], [.6, "#dc953f"], [1, "#9a571c"]], { cx: .4, cy: .3, r: .8 })}"/>` +
        `<path d="M${-5 * s} ${-3 * s}l${2.6 * s} ${6 * s}M${-.6 * s} ${-3.2 * s}l${2.6 * s} ${6.4 * s}M${3.8 * s} ${-3 * s}l${2.4 * s} ${6 * s}" stroke="#7a4517" stroke-opacity=".5" stroke-width="${f1(.9 * s)}"/>` +
        `<rect x="${-8 * s}" y="${-3.6 * s}" width="${16 * s}" height="${2.2 * s}" rx="${1.1 * s}" fill="#fff" opacity=".18"/></g>`;
    },
    chickenCube(x, y, a, s = 1) {
      return `<g ${A.rot(a, x, y)}><rect x="${-3.8 * s}" y="${-3.4 * s}" width="${7.6 * s}" height="${6.8 * s}" rx="${2 * s}" fill="${A.rg("chk", [[0, "#f6d39a"], [.6, "#dc953f"], [1, "#9a571c"]], { cx: .4, cy: .3, r: .8 })}"/><rect x="${-3 * s}" y="${-2.8 * s}" width="${4 * s}" height="${1.6 * s}" rx=".8" fill="#fff" opacity=".22"/></g>`;
    },
    turkeySlice(x, y, a) {
      return `<g ${A.rot(a, x, y)}><rect x="-7" y="-3" width="14" height="6" rx="3" fill="${A.rg("tur", [[0, "#fbe9cc"], [.75, "#e9bf86"], [1, "#c58d4b"]], { cx: .4, cy: .3, r: .8 })}"/><path d="M-4 -2.6l2 5.2M1 -2.8l2 5.4" stroke="#8a5221" stroke-opacity=".45" stroke-width=".8"/></g>`;
    },
    crumb(x, y, s = 2.4) { return `<path d="${A.blob(x, y, s, .45, 6)}" fill="${A.rg("hack", [[0, "#9b6440"], [.7, "#6b3c20"], [1, "#43230f"]])}"/>`; },
    salmon(x, y, a, s = 1) {
      const g = A.lg("sal", [[0, "#ffa77a"], [.6, "#f2733f"], [1, "#d9552a"]], { x2: .3 });
      let b = `<g ${A.rot(a, x, y)}><path d="M${-17 * s} ${-9 * s}Q${-2 * s} ${-12 * s} ${15 * s} ${-8 * s}Q${20 * s} 0 ${15 * s} ${8 * s}Q0 ${12 * s} ${-17 * s} ${9 * s}Q${-21 * s} 0 ${-17 * s} ${-9 * s}Z" fill="${g}"/>`;
      for (let i = -3; i <= 3; i++) b += `<path d="M${(i * 4.6 - 2) * s} ${-9.5 * s}Q${(i * 4.6 + 3) * s} 0 ${(i * 4.6 - 2) * s} ${9.5 * s}" stroke="#ffe0cf" stroke-width="${f1(.9 * s)}" fill="none" opacity=".85"/>`;
      b += `<path d="M${-16 * s} ${-8 * s}Q0 ${-11 * s} ${14 * s} ${-7 * s}" stroke="#a5481f" stroke-width="${f1(2 * s)}" fill="none" opacity=".55" stroke-linecap="round"/>`;
      b += `<ellipse cx="${-4 * s}" cy="${-3 * s}" rx="${7 * s}" ry="${2.4 * s}" fill="#fff" opacity=".22"/></g>`;
      return b;
    },
    broccoli(x, y, s = 1) {
      const g = A.rg("broc", [[0, "#7cc95a"], [.65, "#3c8a2e"], [1, "#1f5418"]]);
      let b = `<path d="M${f1(x - 1.6 * s)} ${f1(y + 1 * s)}L${f1(x - 1.2 * s)} ${f1(y + 7 * s)}L${f1(x + 1.4 * s)} ${f1(y + 7 * s)}L${f1(x + 1.8 * s)} ${f1(y + 1 * s)}Z" fill="#9fcf6f"/>`;
      [[-3.2, -.6, 3.4], [3.1, -.4, 3.3], [0, -3.6, 3.7], [-1.6, 1.4, 2.8], [1.8, 1.6, 2.6]].forEach(([dx, dy, r]) => {
        b += `<circle cx="${f1(x + dx * s)}" cy="${f1(y + dy * s)}" r="${f1(r * s)}" fill="${g}"/>`;
      });
      for (let i = 0; i < 6; i++) b += `<circle cx="${f1(x + A.rnd(-4, 4) * s)}" cy="${f1(y + A.rnd(-5, 2) * s)}" r=".55" fill="#bde39b" opacity=".8"/>`;
      return b;
    },
    bean(x, y, a) { return `<g ${A.rot(a, x, y)}><path d="M-3.8 0Q-3.8 -2.6 -.6 -2.4Q1 -1.2 2.2 -2.4Q4 -2 3.8 .4Q3.4 2.6 0 2.4Q-3.8 2.4 -3.8 0Z" fill="${A.rg("bean", [[0, "#b8394a"], [.7, "#7a1726"], [1, "#4a0a14"]])}"/><ellipse cx="-1.4" cy="-1" rx="1.4" ry=".55" fill="#fff" opacity=".35"/></g>`; },
    corn(x, y, a) { return `<rect x="${f1(x - 1.6)}" y="${f1(y - 1.7)}" width="3.2" height="3.4" rx="1.1" fill="${A.rg("corn", [[0, "#fff0a0"], [.6, "#f6cf2c"], [1, "#d39a07"]])}" transform="rotate(${a.toFixed(0)} ${f1(x)} ${f1(y)})"/>`; },
    cucumber(x, y, s = 5.4) {
      let b = `<circle cx="${f1(x)}" cy="${f1(y)}" r="${s}" fill="#3f7a28"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(s - 1)}" fill="${A.rg("cuc", [[0, "#f4fbdf"], [.7, "#d8eda8"], [1, "#a9d070"]], { cx: .5, cy: .5, r: .55 })}"/>`;
      for (let i = 0; i < 5; i++) { const a = i / 5 * 6.28; b += `<ellipse cx="${f1(x + Math.cos(a) * s * .35)}" cy="${f1(y + Math.sin(a) * s * .35)}" rx=".9" ry=".5" fill="#eaf3cf" stroke="#b9d68a" stroke-width=".3"/>`; }
      return b;
    },
    zucchini(x, y, s = 5.6) {
      let b = `<circle cx="${f1(x)}" cy="${f1(y)}" r="${s}" fill="#2c5e1f"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(s - .9)}" fill="${A.rg("zuc", [[0, "#f6f4cf"], [.75, "#e2e6a8"], [1, "#b8c977"]], { cx: .5, cy: .5, r: .55 })}"/>`;
      b += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(s * .38)}" fill="none" stroke="#d6d79a" stroke-width=".5"/>`;
      return b + `<path d="M${f1(x - s * .5)} ${f1(y - s * .55)}a${f1(s * .7)} ${f1(s * .7)} 0 0 1 ${f1(s * .8)} -.2" stroke="#c9a23a" stroke-width=".9" opacity=".6" fill="none"/>`;
    },
    potato(x, y, a, s = 7) {
      return `<g ${A.rot(a, x, y)}><ellipse rx="${s}" ry="${f1(s * .78)}" fill="#b88746"/><ellipse rx="${f1(s * .86)}" ry="${f1(s * .64)}" fill="${A.rg("pot", [[0, "#fff1b8"], [.7, "#f0cb6a"], [1, "#d7a43f"]])}"/><ellipse cx="${f1(-s * .3)}" cy="${f1(-s * .25)}" rx="${f1(s * .3)}" ry="${f1(s * .14)}" fill="#fff" opacity=".45"/></g>`;
    },
    sweetCube(x, y, a, s = 6) {
      return `<g ${A.rot(a, x, y)}><rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="${f1(s * .28)}" fill="${A.rg("swt", [[0, "#ffc27a"], [.65, "#f07a1f"], [1, "#a8460a"]])}"/><rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="${f1(s * .28)}" fill="none" stroke="#6b2a05" stroke-opacity=".35" stroke-width=".8"/><ellipse cx="${f1(-s * .15)}" cy="${f1(-s * .2)}" rx="${f1(s * .22)}" ry="${f1(s * .1)}" fill="#fff" opacity=".4"/></g>`;
    },
    banana(x, y, s = 5) {
      return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${s}" fill="${A.rg("ban", [[0, "#fffbe6"], [.75, "#f8eab0"], [1, "#e6cf78"]], { cx: .45, cy: .42, r: .6 })}"/>` +
        `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(s * .45)}" fill="none" stroke="#efdb94" stroke-width=".5"/>` +
        [0, 2.1, 4.2].map(a => `<circle cx="${f1(x + Math.cos(a) * s * .2)}" cy="${f1(y + Math.sin(a) * s * .2)}" r=".45" fill="#8a6a2a"/>`).join("");
    },
    blueberry(x, y, s = 2.8) {
      return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${s}" fill="${A.rg("blu", [[0, "#8b96df"], [.55, "#3b418f"], [1, "#1b1d4d"]])}"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${s}" fill="#c9d2ff" opacity=".18"/><circle cx="${f1(x + s * .25)}" cy="${f1(y + s * .2)}" r=".7" fill="#141533"/><circle cx="${f1(x - s * .38)}" cy="${f1(y - s * .4)}" r="${f1(s * .25)}" fill="#fff" opacity=".55"/>`;
    },
    raspberry(x, y, s = 3.4) {
      const g = A.rg("ras", [[0, "#ff8fa7"], [.6, "#e01c4b"], [1, "#8c0a2a"]]);
      return [[0, 0], [-1.3, -1], [1.3, -1], [-1.4, 1], [1.4, 1], [0, -1.8], [0, 1.9]].map(([dx, dy]) => `<circle cx="${f1(x + dx * s / 3)}" cy="${f1(y + dy * s / 3)}" r="${f1(s * .38)}" fill="${g}"/>`).join("");
    },
    berries(x, y, a) { return R() > .45 ? A.blueberry(x, y) : A.raspberry(x, y); },
    apple(x, y, a, s = 5.4) {
      return `<g ${A.rot(a, x, y)}><rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="1.3" fill="${A.rg("app", [[0, "#fffbe8"], [1, "#efe3b3"]])}"/><path d="M${-s / 2 + .6} ${-s / 2 + .2}H${s / 2 - .6}" stroke="#c9241c" stroke-width="1.6" stroke-linecap="round"/></g>`;
    },
    oat(x, y, a) { return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="2.6" ry="1.7" fill="${A.rg("oat", [[0, "#f6e6bf"], [1, "#cfae6c"]])}" transform="rotate(${a.toFixed(0)} ${f1(x)} ${f1(y)})"/>`; },
    rice(cx, cy, r, ry) {
      let b = `<path d="${A.blob(cx, cy, r, .07, 12, ry)}" fill="${A.rg("riceB", [[0, "#ffffff"], [.8, "#f1ede2"], [1, "#d6d0bf"]])}"/>`;
      b += A.many({ cx, cy, r: r * .95, ry: (ry ?? r) * .95 }, Math.round(r * r * .5), 1.25, (x, y, a) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="1.9" ry=".85" fill="#fffef9" stroke="#cfc8b4" stroke-width=".25" transform="rotate(${a.toFixed(0)} ${f1(x)} ${f1(y)})"/>`);
      return b;
    },
    pastaNest(cx, cy, r) {
      let lo = "", hi = "";
      for (let i = 0; i < 46; i++) {
        const a1 = R() * 6.28, a2 = a1 + A.rnd(1.2, 2.6), r1 = A.rnd(.25, 1) * r, r2 = A.rnd(.25, 1) * r;
        const p = `M${f1(cx + Math.cos(a1) * r1)} ${f1(cy + Math.sin(a1) * r1)}Q${f1(cx + Math.cos((a1 + a2) / 2) * r * 1.05)} ${f1(cy + Math.sin((a1 + a2) / 2) * r * 1.05)} ${f1(cx + Math.cos(a2) * r2)} ${f1(cy + Math.sin(a2) * r2)}`;
        lo += `<path d="${p}" stroke="#d3a645" stroke-width="2.1" fill="none" stroke-linecap="round"/>`;
        hi += `<path d="${p}" stroke="#f9e19a" stroke-width=".8" fill="none" stroke-linecap="round" transform="translate(-.35 -.45)"/>`;
      }
      return lo + hi;
    },
    shrimp(x, y, a, s = 1) {
      const g = A.lg("shr", [[0, "#ffc3a8"], [1, "#ee6f45"]]);
      let b = `<g ${A.rot(a, x, y)}><path d="M${-5 * s} ${-2 * s}A${5 * s} ${5 * s} 0 1 1 ${-1 * s} ${4.6 * s}" stroke="${g}" stroke-width="${f1(4.4 * s)}" fill="none" stroke-linecap="round"/>`;
      for (let i = 0; i < 4; i++) { const t = -2.6 + i * 1.3; b += `<path d="M${f1(Math.cos(t) * 3 * s)} ${f1(Math.sin(t) * 3 * s)}L${f1(Math.cos(t) * 7 * s)} ${f1(Math.sin(t) * 7 * s)}" stroke="#fff" stroke-width=".5" opacity=".7"/>`; }
      return b + `<path d="M${-1.6 * s} ${4.4 * s}l${-2.6 * s} ${2.2 * s}l${3.4 * s} ${.8 * s}z" fill="#d9431c"/></g>`;
    },
    leaf(x, y, a, s, kind) {
      const g = kind === "spin" ? A.lg("spin", [[0, "#4f9440"], [1, "#1f4f19"]]) : kind === "basil" ? A.lg("bas", [[0, "#7fd05a"], [1, "#2f8a22"]]) : A.lg("let", [[0, "#c8ec8c"], [1, "#5fae3a"]]);
      const wavy = kind === "let";
      const d = wavy
        ? `M0 ${-7 * s}Q${4 * s} ${-6 * s} ${5 * s} ${-2 * s}Q${6.5 * s} ${1 * s} ${4 * s} ${4 * s}Q${2 * s} ${7 * s} 0 ${7 * s}Q${-2 * s} ${7 * s} ${-4 * s} ${4 * s}Q${-6.5 * s} ${1 * s} ${-5 * s} ${-2 * s}Q${-4 * s} ${-6 * s} 0 ${-7 * s}Z`
        : `M0 ${-6 * s}Q${4.2 * s} ${-2 * s} 0 ${6 * s}Q${-4.2 * s} ${-2 * s} 0 ${-6 * s}Z`;
      return `<g ${A.rot(a, x, y)}><path d="${d}" fill="${g}"/><path d="M0 ${-5.4 * s}L0 ${5.6 * s}" stroke="#e9f7d4" stroke-opacity=".6" stroke-width=".5"/>${[-2, 1].map(t => `<path d="M0 ${t * s}l${2.2 * s} ${-1.8 * s}M0 ${t * s}l${-2.2 * s} ${-1.8 * s}" stroke="#e9f7d4" stroke-opacity=".4" stroke-width=".35"/>`).join("")}</g>`;
    },
    herbs(cx, cy, r, n = 14) { return A.many({ cx, cy, r }, n, 1.4, (x, y) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(A.rnd(.5, .9))}" fill="${R() > .5 ? "#3e8a2c" : "#5aa83a"}"/>`); },
    onion(x, y, a) { return `<g ${A.rot(a, x, y)}><path d="M-3.4 0A3.4 3.4 0 0 1 3.4 0" stroke="#b27cc2" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M-2.4 .2A2.4 2.4 0 0 1 2.4 .2" stroke="#f3e6f5" stroke-width=".6" fill="none"/></g>`; },
    tuna(x, y, a) { return `<g ${A.rot(a, x, y)}><path d="${A.blob(0, 0, 3.4, .35, 7, 2.4)}" fill="${A.rg("tun", [[0, "#e9c7b4"], [1, "#b98a74"]])}"/><path d="M-2 -.6L1.8 -.2M-1.6 .9L1.5 1.1" stroke="#9c6d58" stroke-width=".4" opacity=".6"/></g>`; },
    cottage(x, y, s = 2.2) { return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${s}" fill="${A.rg("cot", [[0, "#ffffff"], [.7, "#f6f3ea"], [1, "#d9d3c2"]])}"/>`; },
    lentil(x, y) { return `<circle cx="${f1(x)}" cy="${f1(y)}" r="1.1" fill="#f0a347" stroke="#c97a22" stroke-width=".3"/>`; },
    lemon(x, y, a, s = 1) {
      return `<g ${A.rot(a, x, y)}><path d="M${-8 * s} 0A${8 * s} ${8 * s} 0 0 1 ${8 * s} 0Z" fill="#f2c51b"/><path d="M${-7 * s} 0A${7 * s} ${7 * s} 0 0 1 ${7 * s} 0Z" fill="${A.rg("lem", [[0, "#fff8c4"], [1, "#f6dc4a"]], { cx: .5, cy: 1, r: .9 })}"/>${[-55, -90, -125].map(d => `<path d="M0 0L${f1(Math.cos(d / 57.3) * 6.6 * s)} ${f1(Math.sin(d / 57.3) * 6.6 * s)}" stroke="#fffbe0" stroke-width=".6"/>`).join("")}</g>`;
    },
    egg(cx, cy, s = 1) {
      return `<path d="${A.blob(cx, cy, 11 * s, .16, 10)}" fill="${A.rg("eggW", [[0, "#ffffff"], [.85, "#fbfaf5"], [1, "#e9e3d2"]])}"/><circle cx="${f1(cx + 1)}" cy="${f1(cy)}" r="${f1(4.4 * s)}" fill="${A.rg("yolk", [[0, "#ffd65a"], [.7, "#f5a00e"], [1, "#d97f00"]])}"/><ellipse cx="${f1(cx - .4)}" cy="${f1(cy - 1.6)}" rx="1.5" ry=".8" fill="#fff" opacity=".75"/>`;
    },
    bread(x, y, a, s = 1, topping = "") {
      return `<g ${A.rot(a, x, y)}><path d="M${-12 * s} ${12 * s}V${-3 * s}Q${-14 * s} ${-13 * s} ${-4 * s} ${-13 * s}Q0 ${-16 * s} ${4 * s} ${-13 * s}Q${14 * s} ${-13 * s} ${12 * s} ${-3 * s}V${12 * s}Z" fill="${A.lg("crust", [[0, "#8a5226"], [1, "#5e3415"]])}"/>` +
        `<path d="M${-10.4 * s} ${10.6 * s}V${-2.6 * s}Q${-12 * s} ${-11 * s} ${-3.6 * s} ${-11.2 * s}Q0 ${-13.6 * s} ${3.6 * s} ${-11.2 * s}Q${12 * s} ${-11 * s} ${10.4 * s} ${-2.6 * s}V${10.6 * s}Z" fill="${A.rg("crumbB", [[0, "#c79a63"], [1, "#9b6a3a"]], { r: .9 })}"/>` +
        Array.from({ length: 22 }, () => `<circle cx="${f1(A.rnd(-9, 9) * s)}" cy="${f1(A.rnd(-9, 9) * s)}" r="${f1(A.rnd(.4, 1))}" fill="${R() > .5 ? "#6e4420" : "#e0bb84"}" opacity=".7"/>`).join("") + topping + `</g>`;
    },
    wrapHalf(x, y, a, s = 1) {
      const t = A.lg("tortR", [[0, "#f7e4b8"], [.55, "#eccb8c"], [1, "#c9984f"]]);
      let b = `<g ${A.rot(a, x, y)}><rect x="${-24 * s}" y="${-10 * s}" width="${30 * s}" height="${20 * s}" rx="${9 * s}" fill="${t}"/>`;
      for (let i = 0; i < 4; i++) b += `<path d="M${(-18 + i * 6) * s} ${-9 * s}l${3 * s} ${18 * s}" stroke="#a86e2c" stroke-opacity=".45" stroke-width="${f1(1.4 * s)}" stroke-linecap="round"/>`;
      b += `<ellipse cx="${6 * s}" cy="0" rx="${7 * s}" ry="${10 * s}" fill="#e7c47f"/><ellipse cx="${6 * s}" cy="0" rx="${5.6 * s}" ry="${8.6 * s}" fill="#f4e3bd"/>`;
      const fills = ["#5fb13c", "#e2412c", "#fffaf0", "#d9a35c", "#5fb13c", "#fffaf0"];
      for (let i = 0; i < 14; i++) { const ang = R() * 6.28, rr = Math.sqrt(R()) * .8; b += `<ellipse cx="${f1((6 + Math.cos(ang) * 5 * rr) * s)}" cy="${f1(Math.sin(ang) * 7.6 * rr * s)}" rx="${f1(A.rnd(1.1, 1.9) * s)}" ry="${f1(A.rnd(.9, 1.5) * s)}" fill="${fills[i % fills.length]}"/>`; }
      return b + `<ellipse cx="${-12 * s}" cy="${-5 * s}" rx="${9 * s}" ry="${2 * s}" fill="#fff" opacity=".25"/></g>`;
    },
    pancake(cx, cy, r) {
      return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" fill="${A.rg("pan", [[0, "#f3c47f"], [.75, "#d89040"], [1, "#9a5a1f"]], { cx: .45, cy: .42, r: .62 })}"/>` +
        Array.from({ length: 10 }, () => `<circle cx="${f1(cx + A.rnd(-.6, .6) * r)}" cy="${f1(cy + A.rnd(-.6, .6) * r)}" r="${f1(A.rnd(.6, 1.6))}" fill="#a8641f" opacity=".35"/>`).join("");
    },
    swirl(cx, cy, w, col) {
      const d = `M${f1(cx - w / 2)} ${f1(cy + 2)}C${f1(cx - w / 4)} ${f1(cy - 7)} ${f1(cx + w / 4)} ${f1(cy + 8)} ${f1(cx + w / 2)} ${f1(cy - 1)}`;
      return `<path d="${d}" stroke="${shade(col, -.12)}" stroke-width="7.4" fill="none" stroke-linecap="round" opacity=".55" transform="translate(.6 .9)"/><path d="${d}" stroke="${col}" stroke-width="6.6" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".9" transform="translate(-.8 -1.4)"/>`;
    },
    dollop(cx, cy, r, col) {
      return `<path d="${A.blob(cx, cy, r, .14, 9)}" fill="${A.rg("dol" + col.slice(1), [[0, "#ffffff"], [.7, col], [1, shade(col, -.15)]])}"/><path d="M${f1(cx - r * .5)} ${f1(cy)}q${f1(r * .5)} ${f1(-r * .6)} ${f1(r)} 0" stroke="#fff" stroke-width="1.1" fill="none" opacity=".8"/>`;
    },

    svg(body) {
      return `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs>${[...defs.values()].join("")}` +
        `<filter id="${u}sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx=".5" dy=".9" stdDeviation=".7" flood-color="#000" flood-opacity=".38"/></filter>` +
        `<filter id="${u}bl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.4"/></filter>` +
        `<filter id="${u}bs" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter></defs>${body}</svg>`;
    }
  };
  return A;
}

/* Ein Bild pro Rezept – wie angerichtet */
const DISH = {
  bolo: A => {
    let b = A.table("wood") + A.napkin(126, 18, 30, 86) + A.plate(78, 60, 50) + A.fork(141, 66, 0);
    b += A.shadowGroup(A.pastaNest(78, 60, 33));
    b += A.sauce(77, 57, 21, "#b2301d", .18);
    b += A.shadowGroup(A.many({ cx: 77, cy: 57, r: 17 }, 40, 2.3, (x, y) => A.crumb(x, y, A.rnd(1.3, 2.2))) +
      A.many({ cx: 77, cy: 57, r: 15 }, 6, 5, (x, y, a) => A.pepper(x, y, a, "r", .55)));
    b += A.many({ cx: 74, cy: 55, r: 10 }, 9, 2.4, (x, y, a) => `<rect x="${A.f1(x)}" y="${A.f1(y)}" width="2.4" height="1.1" rx=".3" fill="#fff6d8" transform="rotate(${a.toFixed(0)} ${A.f1(x)} ${A.f1(y)})"/>`);
    b += A.herbs(77, 56, 16, 16) + A.shadowGroup(A.leaf(85, 46, 30, .9, "basil") + A.leaf(90, 50, 75, .75, "basil"));
    return b + A.light();
  },
  bowl: A => {
    let b = A.table("wood") + A.bowl(78, 60, 51, "#2f3a46");
    const c = { cx: 78, cy: 60 };
    b += A.rice(64, 50, 19, 17);
    b += A.shadowGroup(
      A.many({ ...c, r: 40, r0: 12, a0: -.4, a1: 1.35 }, 10, 6.5, (x, y, a) => A.chickenSlice(x, y, 60 + A.rnd(-15, 15), 1)) +
      A.many({ ...c, r: 40, r0: 14, a0: 1.45, a1: 2.85 }, 8, 7, (x, y) => A.broccoli(x, y, 1.05)) +
      A.many({ ...c, r: 40, r0: 18, a0: 4.6, a1: 6.1 }, 16, 3.6, (x, y, a) => A.pepper(x, y, a, A.R() > .5 ? "r" : "y", .75)));
    b += A.many({ cx: 78, cy: 60, r: 34 }, 40, 2.4, (x, y, a) => `<ellipse cx="${A.f1(x)}" cy="${A.f1(y)}" rx=".8" ry=".45" fill="${A.R() > .3 ? "#f7f0d8" : "#2b2b2b"}" transform="rotate(${a.toFixed(0)} ${A.f1(x)} ${A.f1(y)})"/>`);
    b += A.shadowGroup(A.many({ cx: 80, cy: 62, r: 32 }, 10, 5, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r="1.1" fill="#7ac142"/>`));
    return b + A.light();
  },
  chili: A => {
    let b = A.table("wood") + A.bowl(78, 60, 50, "#e9e1d4");
    b += A.sauce(78, 60, 41, "#9b2a17", .04);
    b += A.shadowGroup(
      A.many({ cx: 78, cy: 60, r: 37 }, 55, 2.6, (x, y) => A.crumb(x, y, A.rnd(1.4, 2.3))) +
      A.many({ cx: 78, cy: 60, r: 36 }, 22, 4.4, (x, y, a) => A.bean(x, y, a)) +
      A.many({ cx: 78, cy: 60, r: 36 }, 24, 3.4, (x, y, a) => A.corn(x, y, a)) +
      A.many({ cx: 78, cy: 60, r: 34 }, 8, 6, (x, y, a) => A.pepper(x, y, a, "g", .7)));
    b += A.swirl(72, 50, 18, "#fbf8f2") + A.herbs(72, 52, 12, 16) + A.herbs(84, 66, 20, 12);
    return b + A.light();
  },
  lachs: A => {
    let b = A.table("wood") + A.napkin(4, 20, 22, 80, "#c7d3e0") + A.plate(80, 60, 50) + A.fork(14, 64, 0);
    b += A.shadowGroup(
      A.salmon(73, 46, -8, 1.2) +
      A.many({ cx: 100, cy: 70, r: 15 }, 7, 8, (x, y, a) => A.potato(x, y, a, 6.8)) +
      A.many({ cx: 63, cy: 78, r: 13 }, 6, 7, (x, y) => A.broccoli(x, y, 1.2)) +
      A.lemon(103, 38, 25, .85));
    b += A.herbs(100, 70, 15, 18) + A.herbs(73, 44, 9, 8);
    return b + A.light();
  },
  blech: A => {
    let b = A.table("wood") + A.tray(8, 12, 144, 96);
    b += A.many({ x: 14, y: 18, w: 132, h: 84 }, 14, 12, (x, y) => `<ellipse cx="${A.f1(x)}" cy="${A.f1(y)}" rx="${A.f1(A.rnd(4, 9))}" ry="${A.f1(A.rnd(3, 6))}" fill="#b07a3a" opacity=".18"/>`);
    const area = { x: 16, y: 20, w: 128, h: 80 };
    b += A.shadowGroup(
      A.many(area, 30, 7.2, (x, y, a) => A.sweetCube(x, y, a, 7)) +
      A.many(area, 12, 10, (x, y, a) => A.chickenCube(x, y, a, 1.6)) +
      A.many(area, 16, 7, (x, y, a) => A.pepper(x, y, a, A.R() > .5 ? "r" : "y", .9)) +
      A.many(area, 10, 9, (x, y, a) => A.onion(x, y, a)));
    b += A.many(area, 50, 3, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r=".7" fill="${A.R() > .5 ? "#2f6b22" : "#5c3a1a"}"/>`);
    return b + A.light();
  },
  garnelen: A => {
    let b = A.table("wood") + A.plate(80, 60, 50) + A.fork(144, 62, 0);
    b += A.rice(60, 62, 19, 17);
    const side = { cx: 80, cy: 60, r: 38, r0: 10, a0: -1.7, a1: 1.7 };
    b += A.shadowGroup(
      A.many(side, 13, 6, (x, y) => A.zucchini(x, y, 5.4)) +
      A.many({ ...side, r: 36 }, 9, 8, (x, y, a) => A.shrimp(x, y, a, 1.1)) +
      A.many({ ...side, r: 35 }, 7, 7, (x, y) => A.tomato(x, y, 3.8)));
    b += A.herbs(92, 60, 20, 22) + A.shadowGroup(A.lemon(56, 40, -30, .7));
    return b + A.light();
  },
  curry: A => {
    let b = A.table("wood") + A.bowl(78, 60, 50, "#2c4a5e");
    b += A.sauce(78, 60, 41, "#d4821c", .04);
    b += A.many({ cx: 78, cy: 60, r: 37 }, 90, 2.2, (x, y) => A.lentil(x, y));
    b += A.shadowGroup(
      A.many({ cx: 78, cy: 60, r: 34 }, 15, 7.5, (x, y, a) => A.chickenCube(x, y, a, 1.3)) +
      A.many({ cx: 78, cy: 60, r: 34 }, 9, 8, (x, y, a) => A.leaf(x, y, a, 1, "spin")));
    b += `<path d="M56 50q12 -8 26 0t24 2" stroke="#fff6e6" stroke-width="1.6" fill="none" opacity=".8"/><path d="M60 72q10 -6 22 0t20 1" stroke="#fff6e6" stroke-width="1.2" fill="none" opacity=".6"/>` + A.herbs(80, 58, 24, 22);
    return b + A.light();
  },
  thunsalat: A => {
    let b = A.table("marble") + A.bowl(78, 60, 51, "#ffffff");
    const c = { cx: 78, cy: 60, r: 41 };
    b += A.shadowGroup(
      A.many({ ...c, a0: 0, a1: 6.28 }, 14, 8, (x, y, a) => A.leaf(x, y, a, 1.5, "let")) +
      A.many({ ...c, r: 37, r0: 4, a0: -1.5, a1: -.2 }, 14, 4, (x, y, a) => A.tuna(x, y, a)) +
      A.many({ ...c, r: 37, r0: 4, a0: -.1, a1: 1.1 }, 16, 4, (x, y, a) => A.bean(x, y, a)) +
      A.many({ ...c, r: 37, r0: 4, a0: 1.2, a1: 2.3 }, 20, 3.2, (x, y, a) => A.corn(x, y, a)) +
      A.many({ ...c, r: 37, r0: 6, a0: 2.4, a1: 3.7 }, 8, 8, (x, y) => A.cucumber(x, y, 5)) +
      A.many({ ...c, r: 37, r0: 6, a0: 3.8, a1: 4.9 }, 7, 7.4, (x, y) => A.tomato(x, y, 4)) +
      A.many({ cx: 78, cy: 60, r: 16 }, 7, 5, (x, y, a) => A.onion(x, y, a)));
    return b + A.herbs(78, 60, 30, 14) + A.light();
  },
  wrap: A => {
    let b = A.table("wood") + A.board(14, 16, 132, 88);
    b += A.shadowGroup(A.leaf(40, 82, 40, 1.6, "let") + A.leaf(118, 34, -30, 1.4, "let"));
    b += A.shadowGroup(A.wrapHalf(70, 46, 12, 1.25) + A.wrapHalf(84, 74, 168, 1.25));
    b += A.shadowGroup(A.tomatoSlice(124, 78, 6) + A.tomatoSlice(132, 64, 5.5) + A.cucumber(32, 34, 5.5) + A.cucumber(42, 28, 5.2));
    return b + A.light();
  },
  quarkbowl: A => {
    let b = A.table("linen") + A.bowl(76, 60, 50, "#b8d4e8");
    b += A.creamy(76, 60, 41, "#f7f4ee");
    b += A.many({ cx: 76, cy: 60, r: 38, r0: 8, a0: 3.2, a1: 5.3 }, 40, 2.6, (x, y, a) => A.oat(x, y, a));
    b += A.shadowGroup(A.many({ cx: 76, cy: 60, r: 38, r0: 2, a0: -.6, a1: 2.3 }, 30, 4.6, (x, y, a) => A.berries(x, y, a)));
    b += A.drizzle(74, 58, 40, "#f0b440", 2);
    return b + A.light();
  },
  oats: A => {
    let b = A.table("linen") + A.bowl(76, 60, 50, "#e7c9a9");
    b += A.porridge(76, 60, 41, "#e6d6b6");
    b += A.swirl(70, 70, 34, "#fbf9f3");
    b += A.shadowGroup(A.many({ cx: 76, cy: 60, r: 36, r0: 8, a0: -1.8, a1: 1 }, 12, 8.5, (x, y) => A.banana(x, y, 5.2)));
    b += A.many({ cx: 70, cy: 58, r: 26 }, 26, 2.4, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r=".55" fill="#8a5426" opacity=".8"/>`);
    return b + A.light();
  },
  omelett: A => {
    let b = A.table("linen") + A.plate(74, 60, 50) + A.fork(140, 62, 0);
    b += A.shadowGroup(`<path d="M38 64 A36 30 0 0 1 108 54 Q74 78 38 64Z" fill="${A.rg("om", [[0, "#ffe27e"], [.65, "#f5bd2e"], [1, "#cf8c0e"]], { cx: .5, cy: .75, r: .75 })}"/>`);
    b += A.many({ x: 46, y: 36, w: 56, h: 24 }, 14, 5, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r="${A.f1(A.rnd(1, 2.6))}" fill="#b8680a" opacity=".3"/>`);
    b += A.shadowGroup(A.leaf(52, 70, 120, 1, "spin") + A.leaf(62, 73, 100, .9, "spin") + A.leaf(72, 73, 80, .85, "spin") + A.tomatoSlice(84, 72, 5.4) + A.tomatoSlice(96, 66, 5));
    b += A.shadowGroup(A.bread(70, 90, 8, .7) + A.bread(88, 92, -14, .66));
    b += A.herbs(74, 48, 16, 16);
    return b + A.light();
  },
  pancakes: A => {
    let b = A.table("linen") + A.plate(76, 60, 50) + A.fork(141, 62, 0);
    b += A.shadowGroup(A.pancake(80, 65, 32) + A.pancake(78, 62, 32) + A.pancake(76, 59, 32));
    b += A.drizzle(76, 56, 38, "#c9781e", 2);
    b += A.shadowGroup(A.many({ cx: 78, cy: 58, r: 17 }, 16, 4.6, (x, y, a) => A.berries(x, y, a)) + A.banana(60, 52, 5.4) + A.banana(66, 44, 5.4) + A.banana(94, 70, 5.4));
    return b + A.light();
  },
  shake: A => {
    let b = A.table("marble");
    b += A.castShadow(80, 96, 28, 8, .35);
    const glass = A.lg("gl", [[0, "#ffffff", .6], [.22, "#ffffff", .12], [.78, "#ffffff", .06], [1, "#ffffff", .5]], { x2: 1, y2: 0 });
    const milk = A.lg("milk", [[0, "#fbefc0"], [1, "#e6c873"]]);
    b += `<path d="M58 20 L102 20 L97 100 Q80 105 63 100 Z" fill="${milk}"/>`;
    b += `<path d="M58 20 L102 20 L101 31 L59 31 Z" fill="#fffaf0"/>` + A.many({ x: 61, y: 22, w: 38, h: 8 }, 16, 2.6, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r="${A.f1(A.rnd(.5, 1.3))}" fill="#fff" stroke="#e8dcb8" stroke-width=".3"/>`);
    b += `<path d="M58 20 L102 20 L97 100 Q80 105 63 100 Z" fill="${glass}" stroke="#d3d9e0" stroke-width="1.2"/>`;
    b += `<path d="M63 28 L67 94" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".6"/><path d="M95 30 L93 60" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".45"/>`;
    b += `<g filter="url(#${A.u}sh)"><path d="M86 30 L104 4" stroke="#2fb380" stroke-width="4.6" stroke-linecap="round"/><path d="M86 30 L104 4" stroke="#fff" stroke-width="1.1" stroke-dasharray="3 3" stroke-linecap="round" opacity=".7"/></g>`;
    b += A.shadowGroup(A.banana(60, 22, 9));
    b += A.shadowGroup(A.banana(124, 92, 6) + A.banana(134, 84, 6) + A.banana(28, 90, 6));
    return b + A.light();
  },
  skyrapfel: A => {
    let b = A.table("marble") + A.bowl(78, 60, 50, "#d5c4e8");
    b += A.creamy(78, 60, 41, "#fbfaf6");
    b += A.shadowGroup(A.many({ cx: 78, cy: 60, r: 37, r0: 4, a0: -2, a1: 1.5 }, 24, 5.6, (x, y, a) => A.apple(x, y, a, 5.6)));
    b += A.drizzle(76, 60, 40, "#a8682a", 2);
    b += A.many({ cx: 70, cy: 64, r: 22 }, 30, 2.2, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r=".5" fill="#8a5426" opacity=".7"/>`);
    return b + A.light();
  },
  huettenbrot: A => {
    let b = A.table("wood") + A.board(14, 16, 132, 88);
    const top = () => A.many({ cx: 0, cy: 1, r: 13 }, 30, 2.8, (x, y) => A.cottage(x, y, 2.4)) +
      A.cucumber(-7, -6, 5.4) + A.cucumber(6, 8, 5.2) + A.tomatoSlice(7, -6, 5.4) + A.tomatoSlice(-6, 8, 5) + A.herbs(0, 0, 12, 14);
    b += A.shadowGroup(A.bread(52, 60, -8, 1.95, top()) + A.bread(108, 60, 10, 1.95, top()));
    return b + A.light();
  }
};

function recipeArt(r) {
  const f = DISH[r.id];
  if (!f) return "";
  const A = extendArt3(extendArt(makeArt(r.id)));
  return A.svg(f(A));
}
/* ---------- Weitere Zeichen-Bausteine ---------- */
function extendArt(A) {
  const { R, f1 } = A;
  const at = (x, y) => `${f1(x)} ${f1(y)}`;
  Object.assign(A, {
    /* Geschirr */
    skillet(cx, cy, r, handleA = 20) {
      const hx = cx + Math.cos(handleA / 57.3) * r, hy = cy + Math.sin(handleA / 57.3) * r;
      return `<g ${A.rot(handleA, hx, hy)}><rect x="-2" y="-4.5" width="34" height="9" rx="4.5" fill="#000" opacity=".3" filter="url(#${A.u}bl)" transform="translate(3 4)"/><rect x="-2" y="-4" width="34" height="8" rx="4" fill="${A.lg("hdl", [[0, "#4a4e55"], [1, "#16181b"]])}"/></g>` +
        A.castShadow(cx, cy, r, r, .4) +
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${A.rg("iron", [[0, "#55595f"], [.8, "#2a2c30"], [1, "#121315"]], { cx: .4, cy: .35, r: .7 })}"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${f1(r * .88)}" fill="${A.rg("ironI", [[0, "#3b3e43"], [1, "#1c1d20"]], { cx: .55, cy: .6, r: .6 })}"/>` +
        `<path d="M${at(cx - r * .9, cy + r * .3)}A${f1(r * .95)} ${f1(r * .95)} 0 0 1 ${at(cx - r * .1, cy - r * .95)}" stroke="#9aa0a8" stroke-width="1.3" fill="none" opacity=".7" stroke-linecap="round"/>`;
    },
    casserole(x, y, w, h, glaze = "#c8452f") {
      const g = A.lg("cas" + glaze.slice(1), [[0, shade(glaze, .25)], [1, shade(glaze, -.2)]]);
      return A.castShadow(x + w / 2, y + h / 2, w / 2 + 6, h / 2 + 2, .38) +
        `<rect x="${x - 8}" y="${y + h / 2 - 7}" width="${w + 16}" height="14" rx="6" fill="${g}"/>` +
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${g}"/>` +
        `<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="6" fill="${A.lg("casI", [[0, "#000", .35], [.15, "#000", .05], [1, "#000", .15]])}"/>` +
        `<path d="M${x + 6} ${y + 2.5}H${x + w - 14}" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>`;
    },
    ramekin(cx, cy, r, glaze = "#f4efe6") {
      let b = A.castShadow(cx, cy, r, r, .36) + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${A.rg("ram", [[0, "#ffffff"], [.8, glaze], [1, shade(glaze, -.2)]], { cx: .4, cy: .38, r: .65 })}"/>`;
      for (let i = 0; i < 28; i++) { const a = i / 28 * 6.28; b += `<path d="M${at(cx + Math.cos(a) * r * .86, cy + Math.sin(a) * r * .86)}L${at(cx + Math.cos(a) * r, cy + Math.sin(a) * r)}" stroke="${shade(glaze, -.18)}" stroke-width=".7"/>`; }
      return b + `<circle cx="${cx}" cy="${cy}" r="${f1(r * .84)}" fill="${A.rg("ramI", [[0, shade(glaze, .3)], [1, shade(glaze, -.3)]], { cx: .58, cy: .62, r: .62 })}"/>`;
    },
    spoon(x, y, a = 0) {
      const g = A.lg("steel", [[0, "#f4f5f7"], [.5, "#b9bec6"], [1, "#e9ecf0"]], { x2: 1, y2: 0 });
      return `<g ${A.rot(a, x, y)} filter="url(#${A.u}sh)"><ellipse cx="0" cy="-12" rx="5.2" ry="7.5" fill="${g}"/><ellipse cx="-1.4" cy="-14" rx="1.6" ry="3" fill="#fff" opacity=".7"/><path d="M-1.4 -5 L-1.6 28 Q0 31 1.6 28 L1.4 -5 Z" fill="${g}"/></g>`;
    },
    roundBoard(cx, cy, r) {
      return A.castShadow(cx, cy, r, r, .32) + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${A.rg("rb", [[0, "#dcae72"], [1, "#b07a3e"]], { r: .8 })}"/>` +
        Array.from({ length: 5 }, (_, i) => `<circle cx="${cx}" cy="${cy}" r="${f1(r * (.25 + i * .15))}" fill="none" stroke="#8b5a2b" stroke-opacity=".15" stroke-width=".6"/>`).join("") +
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#8f5f2c" stroke-opacity=".6"/>`;
    },

    rectBlob(x, y, w, h, j = 1.6) {
      const pts = [], n = 10;
      for (let i = 0; i < n; i++) pts.push([x + w * i / n, y + A.rnd(-j, j)]);
      for (let i = 0; i < n; i++) pts.push([x + w + A.rnd(-j, j), y + h * i / n]);
      for (let i = 0; i < n; i++) pts.push([x + w - w * i / n, y + h + A.rnd(-j, j)]);
      for (let i = 0; i < n; i++) pts.push([x + A.rnd(-j, j), y + h - h * i / n]);
      return "M" + pts.map(p => at(p[0], p[1])).join("L") + "Z";
    },
    steakWhole(x, y, a, s = 1) {
      const shape = A.blob(0, 0, 19 * s, .1, 12, 13 * s), cid = A.u + "stc" + Math.floor(R() * 1e6);
      let b = `<g ${A.rot(a, x, y)}><clipPath id="${cid}"><path d="${shape}"/></clipPath><path d="${shape}" fill="${A.rg("stw", [[0, "#9a5a34"], [.6, "#6b3720"], [1, "#3a1a0c"]], { cx: .45, cy: .4, r: .7 })}"/><g clip-path="url(#${cid})">`;
      for (let i = -3; i <= 3; i++) b += `<path d="M${(i * 5.4 - 6) * s} ${-14 * s}l${14 * s} ${28 * s}" stroke="#2a1006" stroke-width="${f1(1.6 * s)}" stroke-linecap="round" opacity=".7"/>`;
      b += `</g>`;
      b += `<path d="M${-12 * s} ${8 * s}Q${-17 * s} 0 ${-12 * s} ${-8 * s}" stroke="#f3e2c8" stroke-width="${f1(2.2 * s)}" fill="none" opacity=".75" stroke-linecap="round"/>`;
      return b + `<ellipse cx="${-5 * s}" cy="${-5 * s}" rx="${8 * s}" ry="${2.6 * s}" fill="#fff" opacity=".15"/></g>`;
    },

    /* Zutaten */
    mushroom(x, y, a, s = 1) {
      return `<g ${A.rot(a, x, y)}><path d="M${-6 * s} 0A${6 * s} ${5 * s} 0 0 1 ${6 * s} 0L${2.2 * s} 0L${2.4 * s} ${5 * s}Q0 ${6 * s} ${-2.4 * s} ${5 * s}L${-2.2 * s} 0Z" fill="${A.lg("mush", [[0, "#f4e8d2"], [1, "#c9a578"]])}"/>` +
        `<path d="M${-6 * s} 0A${6 * s} ${5 * s} 0 0 1 ${6 * s} 0" stroke="#8a6238" stroke-width="${f1(1.1 * s)}" fill="none"/>` +
        `<path d="M${-4 * s} ${-1 * s}Q0 ${-3.6 * s} ${4 * s} ${-1 * s}" stroke="#b08a5c" stroke-width=".4" fill="none"/></g>`;
    },
    greenBean(x, y, a, s = 1) {
      return `<g ${A.rot(a, x, y)}><path d="M${-10 * s} 0Q0 ${-2.2 * s} ${10 * s} 0" stroke="${A.lg("gbn", [[0, "#8fd16a"], [1, "#3d8a2c"]])}" stroke-width="${f1(2.8 * s)}" fill="none" stroke-linecap="round"/><path d="M${-8 * s} ${-.9 * s}Q0 ${-2.6 * s} ${8 * s} ${-.9 * s}" stroke="#d6f2b8" stroke-width=".5" fill="none" opacity=".7"/></g>`;
    },
    pea(x, y, s = 1.9) { return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${s}" fill="${A.rg("pea", [[0, "#b9ec86"], [.6, "#5fb33a"], [1, "#2f7a22"]])}"/>`; },
    edamame(x, y, a) { return `<g ${A.rot(a, x, y)}><ellipse rx="2.6" ry="1.9" fill="${A.rg("eda", [[0, "#c6ef93"], [.65, "#78c14c"], [1, "#3f8a2c"]])}"/><ellipse cx="-.7" cy="-.6" rx=".8" ry=".4" fill="#fff" opacity=".5"/></g>`; },
    steakSlice(x, y, a, s = 1) {
      const g = A.lg("stk", [[0, "#3a1a0c"], [.1, "#6b3720"], [.2, "#b8505a"], [.5, "#e07c86"], [.8, "#b8505a"], [.9, "#6b3720"], [1, "#3a1a0c"]]);
      return `<g ${A.rot(a, x, y)}><path d="M${-13 * s} ${-5 * s}Q0 ${-7 * s} ${13 * s} ${-5 * s}L${13 * s} ${5 * s}Q0 ${7 * s} ${-13 * s} ${5 * s}Z" fill="${g}"/><path d="M${-12 * s} ${-4.6 * s}Q0 ${-6.4 * s} ${12 * s} ${-4.6 * s}" stroke="#fff" stroke-width=".6" opacity=".25" fill="none"/></g>`;
    },
    wedge(x, y, a, s = 1) {
      return `<g ${A.rot(a, x, y)}><path d="M${-9 * s} ${2.5 * s}Q0 ${-6.5 * s} ${9 * s} ${2.5 * s}Z" fill="${A.lg("wdg", [[0, "#ffb15c"], [1, "#e0661a"]])}"/><path d="M${-9 * s} ${2.5 * s}Q0 ${-6.5 * s} ${9 * s} ${2.5 * s}" stroke="#8a3a0c" stroke-width="${f1(1.4 * s)}" fill="none" stroke-linecap="round"/><path d="M${-5 * s} ${1.5 * s}L${5 * s} ${1.5 * s}" stroke="#6b2a05" stroke-opacity=".3" stroke-width="${f1(1.6 * s)}"/></g>`;
    },
    fishFillet(x, y, a, s = 1) {
      let b = `<g ${A.rot(a, x, y)}><path d="${A.blob(0, 0, 16 * s, .08, 12, 9 * s)}" fill="${A.rg("fish", [[0, "#fdf6e6"], [.65, "#f1d9a6"], [1, "#d29b52"]], { cx: .45, cy: .4, r: .7 })}"/>`;
      for (let i = -2; i <= 2; i++) b += `<path d="M${(i * 5 - 1.5) * s} ${-7 * s}Q${(i * 5 + 2) * s} 0 ${(i * 5 - 1.5) * s} ${7 * s}" stroke="#e2c08a" stroke-width=".6" fill="none"/>`;
      return b + `<ellipse cx="${-5 * s}" cy="${-3 * s}" rx="${6 * s}" ry="${2 * s}" fill="#fff" opacity=".35"/></g>`;
    },
    tofu(x, y, a, s = 6) {
      return `<g ${A.rot(a, x, y)}><rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="${f1(s * .22)}" fill="${A.rg("tof", [[0, "#fff6dc"], [.6, "#f0d69a"], [1, "#c98e3a"]])}"/><rect x="${-s / 2 + 1}" y="${-s / 2 + 1}" width="${f1(s * .45)}" height="${f1(s * .2)}" rx=".6" fill="#fff" opacity=".45"/></g>`;
    },
    mozz(x, y, s = 4) { return `<path d="${A.blob(x, y, s, .3, 8)}" fill="${A.rg("moz", [[0, "#ffffff"], [.7, "#fbf3dc"], [1, "#e9cf95"]])}"/>` + (R() > .5 ? `<circle cx="${f1(x + A.rnd(-1.5, 1.5))}" cy="${f1(y + A.rnd(-1.5, 1.5))}" r="${f1(A.rnd(.6, 1.3))}" fill="#c98a3a" opacity=".55"/>` : ""); },
    parm(x, y, a) { return `<g ${A.rot(a, x, y)}><path d="M-3 -1.2L2.6 -1.8L3.2 1L-2.4 1.6Z" fill="#f6ebc0" stroke="#e2cf8c" stroke-width=".3"/><path d="M-2.4 -.8L2 -1.3" stroke="#fff" stroke-width=".4" opacity=".8"/></g>`; },
    crouton(x, y, a, s = 4.2) { return `<g ${A.rot(a, x, y)}><rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="1" fill="${A.rg("crt", [[0, "#f3cf8a"], [.6, "#d39a4a"], [1, "#8f5a22"]])}"/><circle cx="-.6" cy=".4" r=".4" fill="#7a4a1a"/><circle cx=".9" cy="-.7" r=".35" fill="#7a4a1a"/></g>`; },
    penne(x, y, a, s = 1) {
      return `<g ${A.rot(a, x, y)}><path d="M${-5 * s} ${-1.8 * s}L${3.4 * s} ${-1.8 * s}L${5 * s} ${1.8 * s}L${-3.4 * s} ${1.8 * s}Z" fill="${A.lg("pen", [[0, "#fbe39a"], [1, "#d9a843"]])}" stroke="#c8952f" stroke-width=".3" stroke-linejoin="round"/>` +
        `<path d="M${-3 * s} ${-1.4 * s}L${-1.6 * s} ${1.4 * s}M${-.6 * s} ${-1.4 * s}L${.8 * s} ${1.4 * s}M${1.8 * s} ${-1.4 * s}L${3.2 * s} ${1.4 * s}" stroke="#c8952f" stroke-width=".35" opacity=".7"/></g>`;
    },
    salmonCube(x, y, a, s = 5.4) {
      return `<g ${A.rot(a, x, y)}><rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="1.1" fill="${A.lg("salc", [[0, "#ffa07a"], [1, "#f06a3a"]])}"/><path d="M${-s / 2} ${-s * .1}L${s * .1} ${-s / 2}M${-s / 2} ${s * .35}L${s * .35} ${-s / 2}M${-s * .1} ${s / 2}L${s / 2} ${-s * .1}" stroke="#ffe1d0" stroke-width=".6"/></g>`;
    },
    scrambled(cx, cy, r) { return A.many({ cx, cy, r }, Math.round(r * 1.4), 2.6, (x, y) => `<path d="${A.blob(x, y, A.rnd(2.2, 3.6), .35, 7)}" fill="${A.rg("scr", [[0, "#fff1a0"], [.6, "#f9d548"], [1, "#e0aa1a"]])}"/>`); },
    sesame(cx, cy, r, n = 20, col = "#f6efd8") { return A.many({ cx, cy, r }, n, 1.6, (x, y, a) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx=".9" ry=".5" fill="${col}" transform="rotate(${a.toFixed(0)} ${f1(x)} ${f1(y)})"/>`); },
    pepperHalf(x, y, a, s, col) {
      const g = col === "y" ? A.rg("phY", [[0, "#ffe680"], [.7, "#f2b20c"], [1, "#b67a00"]]) : A.rg("phR", [[0, "#ff7a62"], [.7, "#d92414"], [1, "#8a0f06"]]);
      let b = `<g ${A.rot(a, x, y)}><path d="${A.blob(0, 0, 14 * s, .08, 10, 10 * s)}" fill="${g}"/><path d="${A.blob(0, 0, 11.5 * s, .1, 10, 7.6 * s)}" fill="#6b3a1e"/>`;
      b += A.many({ cx: 0, cy: 0, r: 10 * s, ry: 6.5 * s }, 16, 2.2 * s, (px, py) => R() > .35 ? A.crumb(px, py, 1.6 * s) : `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="1.4" ry=".7" fill="#fbf6e8"/>`);
      b += A.many({ cx: 0, cy: 0, r: 8 * s, ry: 5 * s }, 5, 4 * s, (px, py) => A.mozz(px, py, 3.2 * s));
      return b + `<rect x="${-2 * s}" y="${-11.5 * s}" width="${4 * s}" height="${3 * s}" rx="1" fill="#4a8a2c"/></g>`;
    },
    loaf(x, y, a, s = 1) {
      return `<g ${A.rot(a, x, y)}><path d="M${-11 * s} ${10 * s}V${-4 * s}Q${-12 * s} ${-12 * s} 0 ${-12 * s}Q${12 * s} ${-12 * s} ${11 * s} ${-4 * s}V${10 * s}Z" fill="${A.lg("lcr", [[0, "#7a4520"], [1, "#4f2a10"]])}"/>` +
        `<path d="M${-9.5 * s} ${8.6 * s}V${-3.6 * s}Q${-10.4 * s} ${-10.4 * s} 0 ${-10.4 * s}Q${10.4 * s} ${-10.4 * s} ${9.5 * s} ${-3.6 * s}V${8.6 * s}Z" fill="${A.rg("lcb", [[0, "#e2b878"], [1, "#b88148"]], { r: .85 })}"/>` +
        Array.from({ length: 18 }, () => `<circle cx="${f1(A.rnd(-8, 8) * s)}" cy="${f1(A.rnd(-8, 7) * s)}" r="${f1(A.rnd(.3, .8))}" fill="${R() > .5 ? "#7a4a20" : "#f3dcae"}" opacity=".7"/>`).join("") +
        `<ellipse cx="0" cy="${-10.6 * s}" rx="${4.5 * s}" ry="${1.6 * s}" fill="#f4e2a8" stroke="#c9a24a" stroke-width=".4"/></g>`;
    },
    brownie(x, y, a, s = 1) {
      let b = `<g ${A.rot(a, x, y)}><rect x="${-11 * s}" y="${-11 * s}" width="${22 * s}" height="${22 * s}" rx="${2.4 * s}" fill="${A.rg("brw", [[0, "#6b3d24"], [.7, "#4a2614"], [1, "#2a130a"]])}"/>`;
      for (let i = 0; i < 5; i++) { let px = A.rnd(-9, 6) * s, py = A.rnd(-9, 9) * s; b += `<path d="M${f1(px)} ${f1(py)}l${f1(A.rnd(2, 5) * s)} ${f1(A.rnd(-2, 2) * s)}l${f1(A.rnd(1, 4) * s)} ${f1(A.rnd(-2, 3) * s)}" stroke="#8b5a3c" stroke-width=".7" fill="none" opacity=".8"/>`; }
      for (let i = 0; i < 4; i++) b += `<rect x="${f1(A.rnd(-9, 7) * s)}" y="${f1(A.rnd(-9, 7) * s)}" width="2.2" height="2" rx=".5" fill="#2b1206"/>`;
      return b + `<rect x="${-10 * s}" y="${-10.5 * s}" width="${14 * s}" height="${2.4 * s}" rx="1" fill="#fff" opacity=".12"/></g>`;
    },
    cakeSlice(x, y, a, s = 1) {
      const R1 = 30 * s;
      const c1 = .5, s1 = .866, c2 = .45, s2 = .78;
      return `<g ${A.rot(a, x, y)}><path d="M0 0L${f1(-R1 * c1)} ${f1(-R1 * s1)}A${R1} ${R1} 0 0 1 ${f1(R1 * c1)} ${f1(-R1 * s1)}Z" fill="${A.lg("crustC", [[0, "#c88a44"], [1, "#9a6025"]])}" stroke="#8a5420" stroke-width=".6" stroke-linejoin="round"/>` +
        `<path d="M${f1(R1 * .04)} ${f1(-R1 * .06)}L${f1(-R1 * c2)} ${f1(-R1 * s2)}A${f1(R1 * .9)} ${f1(R1 * .9)} 0 0 1 ${f1(R1 * c2)} ${f1(-R1 * s2)}Z" fill="${A.rg("cheese", [[0, "#fffaea"], [.65, "#fbeac0"], [1, "#efcf86"]], { cx: .5, cy: .3, r: .8 })}"/>` +
        `<path d="M${f1(-R1 * .4)} ${f1(-R1 * .7)}A${f1(R1 * .8)} ${f1(R1 * .8)} 0 0 1 ${f1(R1 * .4)} ${f1(-R1 * .7)}" stroke="#d9a75a" stroke-width="2.6" fill="none" opacity=".55"/>` +
        `<path d="M${f1(-R1 * .3)} ${f1(-R1 * .5)}L${f1(-R1 * .05)} ${f1(-R1 * .12)}" stroke="#fff" stroke-width="1.6" opacity=".6" stroke-linecap="round"/></g>`;
    },
    scoop(cx, cy, r, col) {
      return `<path d="${A.blob(cx, cy, r, .1, 16)}" fill="${A.rg("sc" + col.slice(1), [[0, shade(col, .45)], [.65, col], [1, shade(col, -.25)]], { cx: .4, cy: .35, r: .7 })}"/>` +
        Array.from({ length: 5 }, () => { const ang = A.rnd(0, 6.28), rr = A.rnd(.3, .8) * r; return `<path d="M${at(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr)}q${f1(A.rnd(-3, 3))} ${f1(A.rnd(1, 3))} ${f1(A.rnd(2, 4))} ${f1(A.rnd(-1, 1))}" stroke="${shade(col, -.15)}" stroke-width=".7" fill="none" opacity=".7"/>`; }).join("") +
        `<ellipse cx="${f1(cx - r * .32)}" cy="${f1(cy - r * .36)}" rx="${f1(r * .3)}" ry="${f1(r * .16)}" fill="#fff" opacity=".45"/>`;
    },
    muffin(x, y, s = 1) {
      let b = `<circle cx="${f1(x + 1)}" cy="${f1(y + 2)}" r="${f1(15 * s)}" fill="#000" opacity=".25" filter="url(#${A.u}bl)"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(15 * s)}" fill="#e8eef7"/>`;
      for (let i = 0; i < 26; i++) { const a = i / 26 * 6.28; b += `<path d="M${at(x + Math.cos(a) * 12.5 * s, y + Math.sin(a) * 12.5 * s)}L${at(x + Math.cos(a) * 15 * s, y + Math.sin(a) * 15 * s)}" stroke="#b7c6dc" stroke-width=".8"/>`; }
      b += `<path d="${A.blob(x, y, 13 * s, .1, 12)}" fill="${A.rg("muf", [[0, "#f1c983"], [.6, "#d4943f"], [1, "#9a5c1f"]], { cx: .42, cy: .38, r: .7 })}"/>`;
      b += A.many({ cx: x, cy: y, r: 10 * s }, 6, 4.5 * s, (px, py) => A.blueberry(px, py, 2.4));
      return b;
    },
    shard(x, y, a, s = 1) {
      const pts = Array.from({ length: 6 }, (_, i) => { const ang = i / 6 * 6.28 + A.rnd(-.3, .3), rr = A.rnd(10, 15) * s; return at(Math.cos(ang) * rr, Math.sin(ang) * rr * .8); });
      let b = `<g ${A.rot(a, x, y)}><path d="M${pts.join("L")}Z" fill="${A.rg("brk", [[0, "#ffffff"], [.75, "#f6f2ea"], [1, "#ddd4c3"]])}" stroke="#e4ddcd" stroke-width=".5" stroke-linejoin="round"/>`;
      b += A.many({ cx: 0, cy: 0, r: 9 * s, ry: 7 * s }, 9, 4.2, (px, py, aa) => A.berries(px, py, aa));
      return b + `<path d="M${f1(-10 * s)} ${f1(-3 * s)}q${f1(3 * s)} ${f1(-4 * s)} ${f1(7 * s)} 0t${f1(7 * s)} 0t${f1(6 * s)} 0" stroke="#3b1d0e" stroke-width="1.2" fill="none" opacity=".85"/><path d="M${f1(-8 * s)} ${f1(5 * s)}q${f1(3 * s)} ${f1(-3 * s)} ${f1(6 * s)} 0t${f1(7 * s)} 0" stroke="#3b1d0e" stroke-width="1" fill="none" opacity=".8"/></g>`;
    },
    lime(x, y, a, s = 1) {
      return `<g ${A.rot(a, x, y)}><path d="M${-8 * s} 0A${8 * s} ${8 * s} 0 0 1 ${8 * s} 0Z" fill="#4f9a26"/><path d="M${-7 * s} 0A${7 * s} ${7 * s} 0 0 1 ${7 * s} 0Z" fill="${A.rg("lim", [[0, "#f0fbc4"], [1, "#b8e05a"]], { cx: .5, cy: 1, r: .9 })}"/>${[-55, -90, -125].map(d => `<path d="M0 0L${f1(Math.cos(d / 57.3) * 6.6 * s)} ${f1(Math.sin(d / 57.3) * 6.6 * s)}" stroke="#f6ffe0" stroke-width=".6"/>`).join("")}</g>`;
    }
  });
  return A;
}

/* Bilder für die neuen Rezepte */
Object.assign(DISH, {
  geschnetzelt: A => {
    let b = A.table("wood") + A.plate(80, 60, 50) + A.fork(144, 62, 0);
    b += A.rice(60, 58, 19, 18);
    b += A.sauce(94, 62, 22, "#e7cfa4", .1, 26);
    b += A.shadowGroup(A.many({ cx: 94, cy: 62, r: 18, ry: 22 }, 8, 7, (x, y, a) => A.turkeySlice(x, y, a)) + A.many({ cx: 94, cy: 62, r: 18, ry: 22 }, 7, 6, (x, y, a) => A.mushroom(x, y, a, .85)));
    return b + A.herbs(90, 60, 22, 26) + A.light();
  },
  lasagne: A => {
    let b = A.table("wood") + A.casserole(26, 22, 108, 76, "#b8412c");
    b += `<rect x="31" y="27" width="98" height="66" rx="5" fill="#a92c18"/>`;
    b += `<path d="${A.rectBlob(34, 30, 92, 60, 2.2)}" fill="${A.rg("lasT", [[0, "#ffe9ad"], [.6, "#f1c35a"], [1, "#d08a2a"]], { cx: .45, cy: .45, r: .75 })}" stroke-linejoin="round"/>`;
    b += A.many({ x: 36, y: 32, w: 88, h: 56 }, 34, 6, (x, y) => `<path d="${A.blob(x, y, A.rnd(1.5, 4.2), .4, 7)}" fill="${A.R() > .4 ? "#b5651a" : "#8f4a12"}" opacity="${A.f1(A.rnd(.3, .6))}"/>`);
    b += A.many({ x: 32, y: 28, w: 96, h: 64 }, 18, 8, (x, y) => (x < 38 || x > 122 || y < 34 || y > 86) ? `<path d="${A.blob(x, y, A.rnd(2, 3.5), .3, 7)}" fill="#c3301c"/>` : "");
    b += A.shadowGroup(A.leaf(70, 52, 30, 1.1, "basil") + A.leaf(78, 50, 80, 1, "basil") + A.leaf(100, 70, -20, 1, "basil")) + A.herbs(80, 60, 30, 16);
    return b + A.light();
  },
  burrito: A => {
    let b = A.table("wood") + A.bowl(78, 60, 51, "#c46a3a");
    const c = { cx: 78, cy: 60 };
    b += A.rice(78, 60, 40, 40);
    b += A.shadowGroup(
      A.many({ ...c, r: 38, r0: 14, a0: -2.2, a1: -.9 }, 9, 6.4, (x, y, a) => A.chickenSlice(x, y, -30 + A.rnd(-12, 12), .95)) +
      A.many({ ...c, r: 38, r0: 14, a0: -.8, a1: .4 }, 18, 4, (x, y, a) => A.bean(x, y, a)) +
      A.many({ ...c, r: 38, r0: 14, a0: .5, a1: 1.6 }, 22, 3.2, (x, y, a) => A.corn(x, y, a)) +
      A.many({ ...c, r: 38, r0: 14, a0: 1.7, a1: 2.9 }, 12, 4, (x, y, a) => A.pepper(x, y, a, A.R() > .5 ? "r" : "y", .7)) +
      A.many({ ...c, r: 38, r0: 14, a0: 3, a1: 4.1 }, 8, 5.4, (x, y) => A.tomato(x, y, 3.4)));
    b += A.swirl(78, 60, 16, "#fbf8f2") + A.herbs(78, 60, 14, 12) + A.shadowGroup(A.lime(110, 30, 35, .9));
    return b + A.light();
  },
  teriyaki: A => {
    let b = A.table("wood") + A.plate(80, 60, 50) + A.fork(144, 62, 0);
    b += A.rice(98, 72, 17, 15) + A.sesame(98, 72, 12, 10, "#2b2b2b");
    b += A.shadowGroup(A.salmon(70, 50, -12, 1.05) + A.many({ cx: 66, cy: 80, r: 12 }, 5, 7, (x, y) => A.broccoli(x, y, 1.1)));
    b += `<path d="${A.blob(70, 50, 16, .1, 12, 8)}" fill="#6b2d0e" opacity=".42"/>` + A.sesame(70, 50, 13, 18) + A.herbs(70, 48, 10, 8);
    return b + A.light();
  },
  steak: A => {
    let b = A.table("wood") + A.plate(80, 60, 50) + A.fork(16, 62, 0);
    b += A.shadowGroup(A.steakWhole(66, 44, -8, 1) + [0, 1, 2].map(i => A.steakSlice(60 + i * 6, 66 + i * 5, 28 - i * 10, .85)).join(""));
    b += A.shadowGroup(A.many({ cx: 102, cy: 52, r: 14 }, 5, 10, (x, y, a) => A.wedge(x, y, a, 1.3)) +
      Array.from({ length: 9 }, (_, i) => A.greenBean(96 + A.rnd(-3, 3), 76 + i * 1.8, -25 + A.rnd(-8, 8), 1.05)).join(""));
    b += A.many({ cx: 66, cy: 46, r: 14 }, 16, 2, (x, y) => `<rect x="${A.f1(x)}" y="${A.f1(y)}" width="1.1" height="1.1" fill="#fff" opacity=".9"/>`) + A.herbs(102, 52, 13, 12) + A.shadowGroup(A.leaf(74, 34, 40, .9, "basil"));
    return b + A.light();
  },
  paprikafuell: A => {
    let b = A.table("linen") + A.casserole(20, 22, 120, 76, "#f2ece2");
    b += `<rect x="25" y="27" width="110" height="66" rx="5" fill="${A.rg("tomB", [[0, "#e04a30"], [1, "#9c2414"]])}"/>`;
    b += A.shadowGroup(A.pepperHalf(54, 44, -10, 1.3, "r") + A.pepperHalf(104, 44, 12, 1.3, "y") + A.pepperHalf(56, 77, 8, 1.3, "y") + A.pepperHalf(106, 77, -6, 1.3, "r"));
    return b + A.herbs(80, 60, 50, 30) + A.light();
  },
  pizza: A => {
    let b = A.table("wood") + A.roundBoard(80, 60, 54);
    b += `<circle cx="80" cy="60" r="44" fill="${A.rg("crustP", [[0, "#f6d9a0"], [.85, "#e2a75a"], [1, "#a8662a"]], { cx: .5, cy: .5, r: .55 })}"/>`;
    b += A.many({ cx: 80, cy: 60, r: 43 }, 14, 8, (x, y) => Math.hypot(x - 80, y - 60) > 37 ? `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r="${A.f1(A.rnd(1, 2))}" fill="#8a4a1a" opacity=".45"/>` : "");
    b += A.sauce(80, 60, 37, "#c8341f", .04);
    b += A.many({ cx: 80, cy: 60, r: 33 }, 14, 9, (x, y) => A.mozz(x, y, A.rnd(3.4, 5)));
    b += A.shadowGroup(A.many({ cx: 80, cy: 60, r: 32 }, 9, 8, (x, y, a) => A.chickenCube(x, y, a, 1.05)) + A.many({ cx: 80, cy: 60, r: 32 }, 9, 7, (x, y, a) => A.pepper(x, y, a, A.R() > .5 ? "r" : "g", .7)) + A.many({ cx: 80, cy: 60, r: 30 }, 5, 9, (x, y, a) => A.mushroom(x, y, a, .7)));
    b += [0, 45, 90, 135].map(d => `<path d="M${(80 + Math.cos(d / 57.3) * 44).toFixed(1)} ${(60 + Math.sin(d / 57.3) * 44).toFixed(1)}L${(80 - Math.cos(d / 57.3) * 44).toFixed(1)} ${(60 - Math.sin(d / 57.3) * 44).toFixed(1)}" stroke="#7a3a12" stroke-opacity=".35" stroke-width=".7"/>`).join("");
    b += A.shadowGroup(A.leaf(74, 52, 20, 1, "basil") + A.leaf(92, 70, 70, .9, "basil"));
    return b + A.light();
  },
  burger: A => {
    let b = A.table("wood") + A.board(12, 16, 136, 88);
    const bun = A.rg("bun", [[0, "#f7cf86"], [.6, "#d98d36"], [1, "#9a5418"]], { cx: .42, cy: .38, r: .7 });
    b += A.shadowGroup(`<circle cx="56" cy="60" r="26" fill="${A.rg("bunIn", [[0, "#fbe7bd"], [1, "#e0b16a"]])}"/>` + A.leaf(56, 58, 20, 3.2, "let") + `<circle cx="56" cy="60" r="20" fill="${A.rg("pat", [[0, "#7a4628"], [.7, "#4a2614"], [1, "#2c150a"]])}"/>` +
      A.many({ cx: 56, cy: 60, r: 17 }, 18, 3, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r="${A.f1(A.rnd(.6, 1.4))}" fill="#2a1408" opacity=".6"/>`) +
      A.tomatoSlice(50, 55, 7.6) + A.tomatoSlice(63, 64, 7.2) + A.onion(55, 66, 20) + A.onion(48, 64, 160));
    b += A.shadowGroup(`<circle cx="108" cy="58" r="26" fill="${bun}"/>` + A.sesame(108, 58, 20, 34, "#fbf1d6") + `<ellipse cx="100" cy="48" rx="10" ry="5" fill="#fff" opacity=".25"/>`);
    b += A.shadowGroup(A.cucumber(30, 90, 5.4) + A.cucumber(40, 94, 5.2) + A.cucumber(130, 92, 5.2));
    return b + A.light();
  },
  onepot: A => {
    let b = A.table("wood") + A.skillet(76, 60, 50, 15);
    b += A.sauce(76, 60, 42, "#d9583a", .05);
    b += A.shadowGroup(A.many({ cx: 76, cy: 60, r: 39 }, 46, 4.2, (x, y, a) => A.penne(x, y, a, 1.05)) +
      A.many({ cx: 76, cy: 60, r: 36 }, 9, 8, (x, y, a) => A.chickenCube(x, y, a, 1.15)) +
      A.many({ cx: 76, cy: 60, r: 36 }, 8, 8, (x, y) => A.zucchini(x, y, 4.8)) +
      A.many({ cx: 76, cy: 60, r: 35 }, 7, 8, (x, y) => A.tomato(x, y, 3.8)) +
      A.many({ cx: 76, cy: 60, r: 34 }, 6, 9, (x, y, a) => A.leaf(x, y, a, .95, "spin")) +
      A.many({ cx: 76, cy: 60, r: 26 }, 10, 5, (x, y, a) => A.parm(x, y, a)));
    return b + A.herbs(76, 60, 34, 20) + A.light();
  },
  seelachs: A => {
    let b = A.table("linen") + A.plate(78, 60, 50) + A.fork(142, 62, 0);
    b += A.shadowGroup(A.fishFillet(72, 48, -10, 1.15) +
      A.many({ cx: 98, cy: 74, r: 13 }, 5, 8.5, (x, y, a) => A.potato(x, y, a, 6.4)) +
      A.many({ cx: 62, cy: 78, r: 12 }, 26, 3.6, (x, y) => A.pea(x, y)) + A.lemon(98, 40, 20, .8));
    b += A.herbs(72, 46, 12, 14) + A.herbs(98, 74, 12, 10);
    return b + A.light();
  },
  shakshuka: A => {
    let b = A.table("linen") + A.skillet(74, 60, 46, 200);
    b += A.sauce(74, 60, 39, "#c3301c", .05);
    b += A.shadowGroup(A.many({ cx: 74, cy: 60, r: 34 }, 10, 6, (x, y, a) => A.pepper(x, y, a, A.R() > .5 ? "r" : "y", .75)) + A.many({ cx: 74, cy: 60, r: 33 }, 6, 6, (x, y, a) => A.onion(x, y, a)));
    b += A.egg(62, 50, .95) + A.egg(86, 54, .95) + A.egg(72, 74, .95);
    b += A.herbs(74, 60, 34, 34);
    b += A.shadowGroup(A.bread(136, 46, 80, .8) + A.bread(140, 84, 100, .78));
    return b + A.light();
  },
  dal: A => {
    let b = A.table("wood") + A.bowl(78, 60, 50, "#2c4a5e");
    b += A.sauce(78, 60, 41, "#e3a332", .04);
    b += A.many({ cx: 78, cy: 60, r: 38 }, 110, 2.1, (x, y) => A.lentil(x, y));
    b += A.rice(96, 48, 15, 13);
    b += A.shadowGroup(A.many({ cx: 70, cy: 70, r: 18 }, 6, 9, (x, y, a) => A.leaf(x, y, a, 1, "spin")));
    b += A.swirl(64, 56, 18, "#fbf8f2") + A.herbs(76, 62, 26, 22);
    return b + A.light();
  },
  tofu: A => {
    let b = A.table("wood") + A.skillet(74, 60, 48, 25);
    b += A.rice(58, 52, 15, 14);
    b += A.shadowGroup(A.many({ cx: 74, cy: 60, r: 40, r0: 8, a0: -1.2, a1: 2.6 }, 12, 7.6, (x, y, a) => A.tofu(x, y, a, 6.6)) +
      A.many({ cx: 74, cy: 60, r: 38, r0: 10, a0: -1.2, a1: 2.6 }, 6, 9, (x, y) => A.broccoli(x, y, 1.05)) +
      A.many({ cx: 74, cy: 60, r: 38, r0: 10, a0: -1.2, a1: 2.6 }, 9, 6, (x, y, a) => A.pepper(x, y, a, A.R() > .5 ? "r" : "y", .75)));
    b += A.sesame(80, 62, 30, 26) + A.herbs(82, 62, 26, 12);
    return b + A.light();
  },
  thunpasta: A => {
    let b = A.table("wood") + A.plate(78, 60, 50) + A.fork(142, 62, 0);
    b += A.sauce(78, 60, 30, "#c6361f", .12);
    b += A.shadowGroup(A.many({ cx: 78, cy: 60, r: 30 }, 40, 4.2, (x, y, a) => A.penne(x, y, a, 1.05)) +
      A.many({ cx: 78, cy: 60, r: 22 }, 12, 4.8, (x, y, a) => A.tuna(x, y, a)) +
      A.many({ cx: 78, cy: 60, r: 20 }, 10, 4.4, (x, y, a) => A.parm(x, y, a)));
    b += A.herbs(78, 58, 24, 18) + A.shadowGroup(A.leaf(86, 48, 30, .9, "basil") + A.leaf(91, 52, 80, .75, "basil"));
    return b + A.light();
  },
  caesar: A => {
    let b = A.table("marble") + A.bowl(78, 60, 51, "#ffffff");
    b += A.shadowGroup(A.many({ cx: 78, cy: 60, r: 38 }, 12, 9, (x, y, a) => A.leaf(x, y, a, 1.7, "let")) +
      A.many({ cx: 78, cy: 60, r: 26 }, 7, 8, (x, y, a) => A.chickenSlice(x, y, a, .95)) +
      A.many({ cx: 78, cy: 60, r: 32 }, 10, 6, (x, y, a) => A.crouton(x, y, a)) +
      A.many({ cx: 78, cy: 60, r: 30 }, 14, 4, (x, y, a) => A.parm(x, y, a)) +
      A.many({ cx: 78, cy: 60, r: 34, r0: 22, a0: 3.4, a1: 4.6 }, 4, 7, (x, y) => A.tomato(x, y, 3.8)));
    b += A.drizzle(78, 60, 40, "#f6f1e2", 2);
    return b + A.light();
  },
  poke: A => {
    let b = A.table("wood") + A.bowl(78, 60, 51, "#1f2328");
    const c = { cx: 78, cy: 60 };
    b += `<circle cx="78" cy="60" r="42" fill="#f4f0e6"/>` + A.rice(78, 60, 17, 17);
    b += A.shadowGroup(
      A.many({ ...c, r: 40, r0: 18, a0: -2.5, a1: -.75 }, 18, 5.6, (x, y, a) => A.salmonCube(x, y, a, 6)) +
      A.many({ ...c, r: 40, r0: 18, a0: -.65, a1: .85 }, 10, 6.6, (x, y) => A.cucumber(x, y, 5.4)) +
      A.many({ ...c, r: 40, r0: 18, a0: .95, a1: 2.3 }, 28, 3.6, (x, y, a) => A.edamame(x, y, a)) +
      A.many({ ...c, r: 40, r0: 18, a0: 2.4, a1: 3.75 }, 36, 3, (x, y, a) => A.corn(x, y, a)));
    b += A.sesame(78, 60, 14, 14, "#2b2b2b") + A.sesame(78, 60, 36, 18) + A.herbs(78, 60, 12, 8);
    return b + A.light();
  },
  ruehrei: A => {
    let b = A.table("linen") + A.plate(76, 60, 50) + A.fork(141, 62, 0);
    const top = () => A.many({ cx: 0, cy: 0, r: 9 }, 5, 6, (x, y, a) => A.leaf(x, y, a, .85, "spin")) + A.scrambled(0, 0, 11) + A.scrambled(0, 1, 7) + A.herbs(0, 0, 10, 10);
    b += A.shadowGroup(A.bread(62, 58, -10, 1.15, top()) + A.bread(90, 62, 12, 1.15, top()));
    b += A.shadowGroup(A.tomato(84, 92, 4.4) + A.tomato(93, 88, 4.2) + A.tomato(76, 94, 4));
    return b + A.light();
  },
  brownie: A => {
    let b = A.table("wood") + A.board(14, 14, 132, 92);
    b += A.shadowGroup(A.brownie(58, 44, -4, 1.1) + A.brownie(86, 46, 6, 1.1) + A.brownie(60, 74, 5, 1.1) + A.brownie(90, 76, -7, 1.1));
    b += A.many({ x: 40, y: 28, w: 70, h: 64 }, 40, 2, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r=".5" fill="#fff" opacity=".55"/>`);
    b += A.shadowGroup(A.raspberry(120, 36, 4) + A.raspberry(126, 46, 4) + A.raspberry(118, 82, 4) + A.blueberry(30, 84) + A.blueberry(36, 90));
    return b + A.light();
  },
  cheesecake: A => {
    let b = A.table("linen") + A.plate(78, 60, 50) + A.fork(141, 62, 0);
    b += A.shadowGroup(A.cakeSlice(66, 92, 28, 1.75));
    b += A.drizzle(88, 54, 26, "#c8193f", 1);
    b += A.shadowGroup(A.many({ cx: 92, cy: 46, r: 11 }, 9, 4.8, (x, y, a) => A.berries(x, y, a)) + A.leaf(98, 40, 40, .85, "basil"));
    b += A.shadowGroup(A.raspberry(54, 76, 3.6) + A.blueberry(100, 78) + A.blueberry(104, 72));
    return b + A.light();
  },
  nicecream: A => {
    let b = A.table("marble") + A.bowl(76, 60, 50, "#f6c5d3");
    b += `<circle cx="76" cy="60" r="41" fill="#f7eef0"/>`;
    b += A.shadowGroup(A.scoop(62, 52, 16, "#f6e7a8") + A.scoop(90, 52, 16, "#d94f86") + A.scoop(76, 76, 16, "#8a4fb8"));
    b += A.shadowGroup(A.banana(70, 40, 4.6) + A.banana(58, 66, 4.6) + A.many({ cx: 84, cy: 64, r: 10 }, 5, 4.6, (x, y, a) => A.berries(x, y, a)));
    b += A.spoon(136, 70, 20);
    return b + A.light();
  },
  bananenbrot: A => {
    let b = A.table("wood") + A.board(12, 16, 136, 88);
    b += A.shadowGroup(A.loaf(50, 60, -12, 1.55) + A.loaf(80, 62, 0, 1.55) + A.loaf(110, 60, 12, 1.55));
    b += A.shadowGroup(A.banana(28, 88, 6) + A.banana(40, 94, 6) + A.banana(126, 90, 6) + A.many({ x: 110, y: 26, w: 26, h: 14 }, 4, 6, (x, y) => `<ellipse cx="${A.f1(x)}" cy="${A.f1(y)}" rx="3" ry="1.8" fill="#8a5a2a"/><path d="M${A.f1(x - 2)} ${A.f1(y)}q2 -1.4 4 0" stroke="#5a3214" stroke-width=".5" fill="none"/>`));
    b += A.drizzle(80, 50, 70, "#e6a826", 1);
    return b + A.light();
  },
  schokocreme: A => {
    let b = A.table("marble");
    b += A.castShadow(80, 98, 26, 8, .35);
    const glass = A.lg("gl", [[0, "#ffffff", .6], [.22, "#ffffff", .12], [.78, "#ffffff", .06], [1, "#ffffff", .5]], { x2: 1, y2: 0 });
    const layers = [[96, 102, "#4a2414"], [80, 96, "#f8f4ec"], [66, 80, "#5a2e1a"], [56, 66, "#f8f4ec"], [40, 56, "#5a2e1a"]];
    const clip = A.u + "gc";
    b += `<clipPath id="${clip}"><path d="M58 26 L102 26 L97 100 Q80 105 63 100 Z"/></clipPath><g clip-path="url(#${clip})">` +
      layers.map(([y1, y2, col]) => `<rect x="50" y="${y1 - 2}" width="60" height="${y2 - y1 + 4}" fill="${col}"/>`).join("") +
      `<rect x="50" y="38" width="60" height="4" fill="#7a4228"/>` + A.many({ x: 60, y: 74, w: 40, h: 8 }, 6, 7, (x, y) => A.raspberry(x, y, 3)) + A.many({ x: 60, y: 50, w: 40, h: 8 }, 6, 7, (x, y) => A.blueberry(x, y, 2.6)) + `</g>`;
    b += `<path d="M58 26 L102 26 L97 100 Q80 105 63 100 Z" fill="${glass}" stroke="#d3d9e0" stroke-width="1.2"/><path d="M63 32 L67 94" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>`;
    b += A.shadowGroup(A.raspberry(72, 34, 4) + A.blueberry(82, 33, 3) + A.raspberry(90, 35, 3.6) + A.leaf(80, 30, 30, .7, "basil"));
    b += A.spoon(124, 72, 25) + A.shadowGroup(A.raspberry(30, 88, 3.6) + A.blueberry(38, 94));
    return b + A.light();
  },
  crumble: A => {
    let b = A.table("linen") + A.ramekin(74, 60, 46, "#d9534f");
    b += A.sauce(74, 60, 37, "#e9c27a", .05);
    b += A.shadowGroup(A.many({ cx: 74, cy: 60, r: 34 }, 10, 8, (x, y, a) => A.apple(x, y, a, 6)) +
      A.many({ cx: 74, cy: 60, r: 35 }, 46, 4.6, (x, y) => `<path d="${A.blob(x, y, A.rnd(2.4, 4), .35, 7)}" fill="${A.rg("crb", [[0, "#f6d79a"], [.6, "#d9a050"], [1, "#9a6020"]])}"/>`));
    b += A.swirl(70, 52, 22, "#fbf9f3") + A.many({ cx: 74, cy: 60, r: 30 }, 30, 2.4, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r=".5" fill="#7a4520" opacity=".8"/>`);
    b += A.spoon(136, 68, 15);
    return b + A.light();
  },
  muffins: A => {
    let b = A.table("wood") + A.board(12, 14, 136, 92);
    b += A.shadowGroup(A.muffin(52, 46, 1.15) + A.muffin(102, 48, 1.15) + A.muffin(78, 80, 1.15));
    b += A.shadowGroup(A.many({ x: 20, y: 76, w: 26, h: 22 }, 6, 5, (x, y) => A.blueberry(x, y)) + A.many({ x: 116, y: 78, w: 24, h: 20 }, 5, 5, (x, y) => A.blueberry(x, y)));
    return b + A.light();
  },
  bark: A => {
    let b = A.table("marble") + A.tray(8, 12, 144, 96);
    b += A.shadowGroup(A.shard(38, 40, 10, 1.55) + A.shard(82, 36, -20, 1.5) + A.shard(124, 42, 30, 1.45) + A.shard(48, 82, -8, 1.55) + A.shard(92, 80, 25, 1.5) + A.shard(132, 86, -15, 1.2));
    return b + A.light();
  }
});


/* ---------- Bausteine für Frühstück & Snacks ---------- */
function extendArt3(A) {
  const { R, f1 } = A;
  const at = (x, y) => `${f1(x)} ${f1(y)}`;
  Object.assign(A, {
    waffle(x, y, a, s = 1) {
      const w = 26 * s;
      let b = `<g ${A.rot(a, x, y)}><rect x="${-w / 2}" y="${-w / 2}" width="${w}" height="${w}" rx="${4 * s}" fill="${A.rg("waf", [[0, "#f6cf86"], [.7, "#dc9a44"], [1, "#a8621f"]], { cx: .42, cy: .38, r: .75 })}"/>`;
      const n = 4, cell = (w - 4 * s) / n;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const cx = -w / 2 + 2 * s + i * cell + cell * .16, cy = -w / 2 + 2 * s + j * cell + cell * .16, cw = cell * .68;
        b += `<rect x="${f1(cx)}" y="${f1(cy)}" width="${f1(cw)}" height="${f1(cw)}" rx="${f1(.8 * s)}" fill="${A.lg("wafP", [[0, "#9a5a1c"], [1, "#d9984a"]])}"/>`;
      }
      return b + `<rect x="${-w / 2 + 2}" y="${-w / 2 + 1.5}" width="${f1(w * .5)}" height="${f1(2 * s)}" rx="1" fill="#fff" opacity=".25"/></g>`;
    },
    frenchToast(x, y, a, s = 1) {
      return `<g ${A.rot(a, x, y)}><path d="M${-12 * s} ${12 * s}V${-3 * s}Q${-14 * s} ${-13 * s} ${-4 * s} ${-13 * s}Q0 ${-16 * s} ${4 * s} ${-13 * s}Q${14 * s} ${-13 * s} ${12 * s} ${-3 * s}V${12 * s}Z" fill="${A.lg("ftc", [[0, "#9a5a22"], [1, "#6e3a12"]])}"/>` +
        `<path d="M${-10.4 * s} ${10.6 * s}V${-2.6 * s}Q${-12 * s} ${-11 * s} ${-3.6 * s} ${-11.2 * s}Q0 ${-13.6 * s} ${3.6 * s} ${-11.2 * s}Q${12 * s} ${-11 * s} ${10.4 * s} ${-2.6 * s}V${10.6 * s}Z" fill="${A.rg("ftb", [[0, "#f8d78e"], [.6, "#e3a24e"], [1, "#b8732a"]], { r: .85 })}"/>` +
        Array.from({ length: 12 }, () => `<circle cx="${f1(A.rnd(-8, 8) * s)}" cy="${f1(A.rnd(-8, 8) * s)}" r="${f1(A.rnd(.8, 2))}" fill="#a8641f" opacity=".3"/>`).join("") + `</g>`;
    },
    smokedSalmon(x, y, a, s = 1) {
      const d = `M${-10 * s} ${-3 * s}Q${-6 * s} ${-8 * s} ${-2 * s} ${-3 * s}Q${2 * s} ${-8 * s} ${6 * s} ${-3 * s}Q${10 * s} ${-7 * s} ${11 * s} ${-1 * s}L${10 * s} ${4 * s}Q${6 * s} ${0} ${2 * s} ${4 * s}Q${-2 * s} ${0} ${-6 * s} ${4 * s}Q${-9 * s} ${1 * s} ${-11 * s} ${3 * s}Z`;
      return `<g ${A.rot(a, x, y)}><path d="${d}" fill="${A.lg("smk", [[0, "#ffa27a"], [1, "#e8582c"]])}"/>` +
        [-6, -1, 4].map(t => `<path d="M${t * s} ${-5 * s}q${1.4 * s} ${4 * s} 0 ${8 * s}" stroke="#ffe3d4" stroke-width=".6" fill="none"/>`).join("") +
        `<path d="M${-8 * s} ${-3.6 * s}Q${-5 * s} ${-6.6 * s} ${-2.6 * s} ${-3.8 * s}" stroke="#fff" stroke-width=".6" opacity=".6" fill="none"/></g>`;
    },
    wrapRoll(x, y, a, s, fills) {
      const t = A.lg("tortR", [[0, "#f7e4b8"], [.55, "#eccb8c"], [1, "#c9984f"]]);
      let b = `<g ${A.rot(a, x, y)}><rect x="${-24 * s}" y="${-10 * s}" width="${30 * s}" height="${20 * s}" rx="${9 * s}" fill="${t}"/>`;
      for (let i = 0; i < 4; i++) b += `<path d="M${(-18 + i * 6) * s} ${-9 * s}l${3 * s} ${18 * s}" stroke="#a86e2c" stroke-opacity=".45" stroke-width="${f1(1.4 * s)}" stroke-linecap="round"/>`;
      b += `<ellipse cx="${6 * s}" cy="0" rx="${7 * s}" ry="${10 * s}" fill="#e7c47f"/><ellipse cx="${6 * s}" cy="0" rx="${5.6 * s}" ry="${8.6 * s}" fill="#f4e3bd"/>`;
      for (let i = 0; i < 16; i++) { const ang = R() * 6.28, rr = Math.sqrt(R()) * .8; b += `<ellipse cx="${f1((6 + Math.cos(ang) * 5 * rr) * s)}" cy="${f1(Math.sin(ang) * 7.6 * rr * s)}" rx="${f1(A.rnd(1.1, 2) * s)}" ry="${f1(A.rnd(.9, 1.6) * s)}" fill="${fills[i % fills.length]}"/>`; }
      return b + `<ellipse cx="${-12 * s}" cy="${-5 * s}" rx="${9 * s}" ry="${2 * s}" fill="#fff" opacity=".25"/></g>`;
    },
    eggMuffin(x, y, s = 1) {
      let b = `<circle cx="${f1(x + 1)}" cy="${f1(y + 2)}" r="${f1(14 * s)}" fill="#000" opacity=".25" filter="url(#${A.u}bl)"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(14 * s)}" fill="#d8e9de"/>`;
      for (let i = 0; i < 24; i++) { const a = i / 24 * 6.28; b += `<path d="M${at(x + Math.cos(a) * 11.6 * s, y + Math.sin(a) * 11.6 * s)}L${at(x + Math.cos(a) * 14 * s, y + Math.sin(a) * 14 * s)}" stroke="#a9c9b4" stroke-width=".8"/>`; }
      b += `<path d="${A.blob(x, y, 12 * s, .08, 12)}" fill="${A.rg("emf", [[0, "#ffe7a0"], [.6, "#f2c04a"], [1, "#c98a1c"]], { cx: .42, cy: .38, r: .7 })}"/>`;
      b += A.many({ cx: x, cy: y, r: 9 * s }, 8, 3 * s, (px, py, aa) => R() > .45 ? `<rect x="${f1(px - 1.4)}" y="${f1(py - .8)}" width="2.8" height="1.6" rx=".6" fill="#e2412c" transform="rotate(${aa.toFixed(0)} ${f1(px)} ${f1(py)})"/>` : `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="1.8" ry="1" fill="#2f6b22" transform="rotate(${aa.toFixed(0)} ${f1(px)} ${f1(py)})"/>`);
      return b + `<ellipse cx="${f1(x - 4 * s)}" cy="${f1(y - 4 * s)}" rx="${f1(4 * s)}" ry="${f1(1.6 * s)}" fill="#fff" opacity=".35"/>`;
    },
    boiledEgg(x, y, a, s = 1) {
      return `<g ${A.rot(a, x, y)}><ellipse rx="${f1(11 * s)}" ry="${f1(8 * s)}" fill="${A.rg("bew", [[0, "#ffffff"], [.8, "#f7f5ee"], [1, "#ddd8c8"]])}"/><circle cx="${f1(.5 * s)}" cy="0" r="${f1(4.6 * s)}" fill="${A.rg("bey", [[0, "#ffe27a"], [.7, "#f5b52a"], [1, "#e09a10"]], { cx: .45, cy: .45, r: .6 })}"/>` +
        Array.from({ length: 4 }, () => `<circle cx="${f1(A.rnd(-3, 3) * s)}" cy="${f1(A.rnd(-3, 3) * s)}" r=".35" fill="#2b2b2b"/>`).join("") + `</g>`;
    },
    proteinBar(x, y, a, s = 1) {
      let b = `<g ${A.rot(a, x, y)}><rect x="${-18 * s}" y="${-6.5 * s}" width="${36 * s}" height="${13 * s}" rx="${3 * s}" fill="${A.rg("bar", [[0, "#e9cf98"], [.7, "#c99a58"], [1, "#94622c"]], { cx: .45, cy: .35, r: .8 })}"/>`;
      for (let i = 0; i < 14; i++) { const ox = A.rnd(-16, 16) * s, oy = A.rnd(-4.6, 4.6) * s; b += `<ellipse cx="${f1(ox)}" cy="${f1(oy)}" rx="1.6" ry="1" fill="${R() > .5 ? "#f3e2b8" : "#a8763c"}" opacity=".8" transform="rotate(${A.rnd(0, 180).toFixed(0)} ${f1(ox)} ${f1(oy)})"/>`; }
      b += `<path d="M${-15 * s} ${-2 * s}q${3 * s} ${-4 * s} ${6 * s} 0t${6 * s} 0t${6 * s} 0t${6 * s} 0t${6 * s} 0" stroke="#7a4a1e" stroke-width="1.1" fill="none" opacity=".85"/>`;
      return b + `<rect x="${-16 * s}" y="${-6 * s}" width="${20 * s}" height="${1.8 * s}" rx=".9" fill="#fff" opacity=".22"/></g>`;
    },
    stick(x, y, a, s, kind) {
      const skin = kind === "cuc" ? "#3d7a26" : kind === "y" ? "#e3a20c" : "#c8200f";
      const flesh = kind === "cuc" ? A.lg("stC", [[0, "#eaf6c8"], [1, "#bfe08a"]]) : kind === "y" ? A.lg("stY", [[0, "#ffe680"], [1, "#f5c12a"]]) : A.lg("stR", [[0, "#ff7a62"], [1, "#e2321e"]]);
      return `<g ${A.rot(a, x, y)}><rect x="${-16 * s}" y="${-2.8 * s}" width="${32 * s}" height="${5.6 * s}" rx="${1.6 * s}" fill="${flesh}"/><rect x="${-16 * s}" y="${1.4 * s}" width="${32 * s}" height="${1.6 * s}" rx=".8" fill="${skin}"/><path d="M${-14 * s} ${-1.8 * s}H${12 * s}" stroke="#fff" stroke-width=".6" opacity=".55"/></g>`;
    },
    turkeyRoll(x, y, a, s = 1) {
      let b = `<g ${A.rot(a, x, y)}><rect x="${-16 * s}" y="${-6 * s}" width="${26 * s}" height="${12 * s}" rx="${5.6 * s}" fill="${A.lg("trl", [[0, "#fbe2d2"], [.5, "#f3c7ae"], [1, "#d9a083"]])}"/>`;
      b += `<path d="M${-12 * s} ${-3 * s}q${4 * s} ${2 * s} ${8 * s} 0t${8 * s} 0" stroke="#fff" stroke-width=".6" opacity=".5" fill="none"/>`;
      b += `<ellipse cx="${10 * s}" cy="0" rx="${4 * s}" ry="${6 * s}" fill="#f0c3a8"/><ellipse cx="${10 * s}" cy="0" rx="${3 * s}" ry="${4.8 * s}" fill="#fffaf0"/><ellipse cx="${10 * s}" cy="0" rx="${1.2 * s}" ry="${2.2 * s}" fill="#6fae3e"/>`;
      return b + `</g>`;
    },
    pod(x, y, a, s = 1) {
      const g = A.lg("pod", [[0, "#a6dd72"], [1, "#4a9a2c"]]);
      return `<g ${A.rot(a, x, y)}><path d="M${-12 * s} 0Q${-11 * s} ${-4 * s} ${-6 * s} ${-3.6 * s}Q${-2 * s} ${-5 * s} ${2 * s} ${-3.4 * s}Q${7 * s} ${-5 * s} ${11 * s} ${-2 * s}Q${13 * s} ${1 * s} ${10 * s} ${3 * s}Q${6 * s} ${4.4 * s} ${2 * s} ${3.2 * s}Q${-2 * s} ${4.6 * s} ${-6 * s} ${3.4 * s}Q${-11 * s} ${3.6 * s} ${-12 * s} 0Z" fill="${g}"/>` +
        [-6, 0, 6].map(t => `<ellipse cx="${t * s}" cy="${-.3 * s}" rx="${2.4 * s}" ry="${2 * s}" fill="#fff" opacity=".18"/>`).join("") +
        `<path d="M${-11 * s} ${.4 * s}Q0 ${1.6 * s} ${11 * s} ${-.2 * s}" stroke="#2f6b1c" stroke-width=".5" fill="none" opacity=".6"/></g>`;
    },
    appleWedge(x, y, a, s = 1) {
      return `<g ${A.rot(a, x, y)}><path d="M${-12 * s} ${2 * s}A${12 * s} ${9 * s} 0 0 1 ${12 * s} ${2 * s}Q0 ${4 * s} ${-12 * s} ${2 * s}Z" fill="#c9241c"/><path d="M${-10.5 * s} ${2.2 * s}A${10.5 * s} ${7.4 * s} 0 0 1 ${10.5 * s} ${2.2 * s}Q0 ${4 * s} ${-10.5 * s} ${2.2 * s}Z" fill="${A.lg("apw", [[0, "#fffbe6"], [1, "#efe1a8"]])}"/><ellipse cx="0" cy="${-1.6 * s}" rx="${1 * s}" ry="${.6 * s}" fill="#5a3214"/></g>`;
    },
    riceCake(x, y, s = 1, topping = "") {
      let b = `<g transform="translate(${f1(x)} ${f1(y)})"><circle r="${f1(17 * s)}" fill="${A.rg("rck", [[0, "#fbf1d8"], [.8, "#ead6a6"], [1, "#c9a868"]])}"/>`;
      b += A.many({ cx: 0, cy: 0, r: 15 * s }, 40, 2.3 * s, (px, py) => `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(A.rnd(.8, 1.4) * s)}" fill="${R() > .5 ? "#fffaf0" : "#dcc28c"}" opacity=".9"/>`);
      return b + `<circle r="${f1(17 * s)}" fill="none" stroke="#c39a52" stroke-width=".8"/>` + topping + `</g>`;
    },
    chickpea(x, y, s = 2.6) {
      return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${s}" fill="${A.rg("chp", [[0, "#ffd88a"], [.65, "#e0963a"], [1, "#9a5a18"]])}"/><path d="M${f1(x - s * .4)} ${f1(y - s * .7)}q${f1(s * .6)} ${f1(s * .6)} ${f1(s * .2)} ${f1(s * 1.4)}" stroke="#8a4a14" stroke-width=".45" fill="none" opacity=".7"/>`;
    },
    drinkGlass(top, bottom, foam, extra = "") {
      const glass = A.lg("gl", [[0, "#ffffff", .6], [.22, "#ffffff", .12], [.78, "#ffffff", .06], [1, "#ffffff", .5]], { x2: 1, y2: 0 });
      let b = A.castShadow(80, 96, 28, 8, .35) + `<path d="M58 20 L102 20 L97 100 Q80 105 63 100 Z" fill="${A.lg("liq" + top.slice(1), [[0, top], [1, bottom]])}"/>`;
      b += `<path d="M58 20 L102 20 L101 31 L59 31 Z" fill="${foam}"/>` + A.many({ x: 61, y: 22, w: 38, h: 8 }, 16, 2.6, (x, y) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(A.rnd(.5, 1.3))}" fill="#fff" opacity=".8"/>`);
      b += extra + `<path d="M58 20 L102 20 L97 100 Q80 105 63 100 Z" fill="${glass}" stroke="#d3d9e0" stroke-width="1.2"/>`;
      b += `<path d="M63 28 L67 94" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".6"/><path d="M95 30 L93 60" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".45"/>`;
      return b + `<g filter="url(#${A.u}sh)"><path d="M86 30 L104 4" stroke="#e8467c" stroke-width="4.6" stroke-linecap="round"/><path d="M86 30 L104 4" stroke="#fff" stroke-width="1.1" stroke-dasharray="3 3" stroke-linecap="round" opacity=".7"/></g>`;
    }
  });
  return A;
}

Object.assign(DISH, {
  /* ---- Frühstück ---- */
  porridge: A => {
    let b = A.table("linen") + A.bowl(76, 60, 50, "#bfd9c6");
    b += A.porridge(76, 60, 41, "#e9dcc0");
    b += A.shadowGroup(A.many({ cx: 76, cy: 60, r: 37, r0: 6, a0: -1.9, a1: 1.2 }, 16, 6.2, (x, y, a) => A.apple(x, y, a, 5.8)));
    b += A.drizzle(70, 62, 34, "#f0b440", 2) + A.many({ cx: 76, cy: 60, r: 34 }, 50, 2, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r=".5" fill="#8a5426" opacity=".8"/>`);
    b += A.spoon(136, 70, 18);
    return b + A.light();
  },
  skyrbowl: A => {
    let b = A.table("linen") + A.bowl(76, 60, 50, "#9fb7cf");
    b += A.creamy(76, 60, 41, "#f8f6f1");
    b += A.shadowGroup([0, 1, 2, 3, 4, 5, 6].map(i => { const ang = -2.3 + i * .42; return A.banana(76 + Math.cos(ang) * 26, 60 + Math.sin(ang) * 26, 5.6); }).join(""));
    b += A.many({ cx: 76, cy: 60, r: 36, r0: 6, a0: 1, a1: 3.4 }, 40, 2.6, (x, y, a) => A.oat(x, y, a));
    b += A.drizzle(76, 62, 34, "#b06f2c", 2);
    return b + A.light();
  },
  waffeln: A => {
    let b = A.table("linen") + A.plate(76, 60, 50) + A.fork(141, 62, 0);
    b += A.shadowGroup(A.waffle(64, 52, -10, 1.15) + A.waffle(88, 66, 12, 1.15));
    b += A.drizzle(78, 58, 40, "#e6a826", 2);
    b += A.shadowGroup(A.many({ cx: 78, cy: 60, r: 22 }, 12, 5, (x, y, a) => A.berries(x, y, a)));
    b += A.many({ cx: 76, cy: 60, r: 30 }, 30, 2, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r=".5" fill="#fff" opacity=".7"/>`);
    return b + A.light();
  },
  lachsbrot: A => {
    let b = A.table("wood") + A.board(14, 16, 132, 88);
    const top = () => A.many({ cx: 0, cy: 1, r: 13 }, 26, 2.8, (x, y) => A.cottage(x, y, 2.4)) + A.smokedSalmon(-1, -5, -15, 1.45) + A.smokedSalmon(2, 6, 10, 1.35) + A.cucumber(-9, 9, 4.6) + A.cucumber(10, -9, 4.4) + A.herbs(0, 0, 13, 18);
    b += A.shadowGroup(A.bread(52, 60, -8, 1.9, top()) + A.bread(108, 60, 10, 1.9, top()));
    b += A.shadowGroup(A.lemon(130, 30, -40, .7));
    return b + A.light();
  },
  fruehburrito: A => {
    let b = A.table("wood") + A.board(14, 16, 132, 88);
    const fills = ["#f9d548", "#f2c03a", "#3f7d34", "#e2412c", "#fffaf0", "#f9d548"];
    b += A.shadowGroup(A.wrapRoll(70, 46, 12, 1.25, fills) + A.wrapRoll(84, 74, 168, 1.25, fills));
    b += A.shadowGroup(A.tomatoSlice(124, 80, 6) + A.tomatoSlice(132, 66, 5.4) + A.leaf(34, 32, 30, 1.2, "spin") + A.leaf(42, 26, 80, 1, "spin"));
    return b + A.light();
  },
  eiermuffins: A => {
    let b = A.table("linen") + A.board(12, 14, 136, 92);
    b += A.shadowGroup(A.eggMuffin(52, 44, 1.15) + A.eggMuffin(100, 44, 1.15) + A.eggMuffin(56, 80, 1.15) + A.eggMuffin(104, 80, 1.15));
    b += A.herbs(80, 60, 50, 24);
    return b + A.light();
  },
  bircher: A => {
    let b = A.table("linen") + A.bowl(76, 60, 50, "#e6d3ef");
    b += A.porridge(76, 60, 41, "#efe4cc");
    b += A.shadowGroup(A.many({ cx: 76, cy: 60, r: 37, r0: 4, a0: 2.2, a1: 4.6 }, 22, 3.4, (x, y, a) => `<rect x="${A.f1(x - 3)}" y="${A.f1(y - .8)}" width="6" height="1.6" rx=".8" fill="#f6efc8" stroke="#c9241c" stroke-width=".35" transform="rotate(${a.toFixed(0)} ${A.f1(x)} ${A.f1(y)})"/>`) +
      A.many({ cx: 76, cy: 60, r: 37, r0: 4, a0: -1.5, a1: 1.5 }, 18, 4.6, (x, y, a) => A.berries(x, y, a)));
    b += A.swirl(72, 74, 24, "#fbf9f3") + A.many({ cx: 70, cy: 60, r: 26 }, 18, 3, (x, y, a) => A.oat(x, y, a));
    return b + A.light();
  },
  frenchtoast: A => {
    let b = A.table("linen") + A.plate(76, 60, 50) + A.fork(141, 62, 0);
    b += A.shadowGroup(A.frenchToast(70, 58, -14, 1.3) + A.frenchToast(84, 64, 12, 1.3));
    b += A.swirl(80, 54, 18, "#fbf9f3") + A.drizzle(78, 62, 36, "#e6a826", 2);
    b += A.shadowGroup(A.many({ cx: 80, cy: 60, r: 22 }, 12, 5, (x, y, a) => A.berries(x, y, a)) + A.leaf(92, 50, 30, .8, "basil"));
    b += A.many({ cx: 78, cy: 60, r: 30 }, 30, 2, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r=".5" fill="#fff" opacity=".75"/>`);
    return b + A.light();
  },
  smoothiebowl: A => {
    let b = A.table("marble") + A.bowl(78, 60, 51, "#ffffff");
    b += A.creamy(78, 60, 42, "#a8457e");
    b += A.shadowGroup([0, 1, 2, 3, 4].map(i => A.banana(54 + i * 11.5, 40 + Math.abs(i - 2) * 1.5, 5.4)).join("") +
      [0, 1, 2, 3, 4, 5, 6, 7].map(i => A.blueberry(49 + i * 8, 56, 3)).join("") +
      [0, 1, 2, 3, 4, 5].map(i => A.raspberry(54 + i * 9.6, 66, 3.6)).join(""));
    b += A.many({ x: 50, y: 74, w: 56, h: 10 }, 30, 2.4, (x, y, a) => A.oat(x, y, a));
    b += A.spoon(140, 66, 18);
    return b + A.light();
  },
  spiegelei: A => {
    let b = A.table("linen") + A.plate(76, 60, 50) + A.fork(141, 62, 0);
    b += A.shadowGroup(A.bread(72, 60, -6, 1.45));
    b += A.egg(66, 52, 1.05) + A.egg(80, 66, 1.05);
    b += A.shadowGroup(A.tomato(104, 78, 4.4) + A.tomato(110, 70, 4.2) + A.tomato(100, 86, 4) + A.leaf(46, 80, 40, 1, "spin") + A.leaf(52, 86, 100, .9, "spin"));
    b += A.many({ cx: 72, cy: 60, r: 18 }, 14, 2, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r=".4" fill="#2b2b2b"/>`) + A.herbs(72, 58, 16, 10);
    return b + A.light();
  },
  huettenbowl: A => {
    let b = A.table("linen") + A.bowl(76, 60, 50, "#f2c6a8");
    b += A.sauce(76, 60, 41, "#f6f2e8", .03);
    b += A.many({ cx: 76, cy: 60, r: 39 }, 110, 2.6, (x, y) => A.cottage(x, y, 2.1));
    b += A.shadowGroup(A.many({ cx: 76, cy: 60, r: 36, r0: 4, a0: -1.7, a1: 1.2 }, 22, 4.8, (x, y, a) => A.berries(x, y, a)));
    b += A.many({ cx: 76, cy: 60, r: 34, r0: 8, a0: 1.6, a1: 3.6 }, 24, 2.8, (x, y, a) => A.oat(x, y, a)) + A.drizzle(70, 64, 26, "#f0b440", 1);
    return b + A.light();
  },

  /* ---- Snacks ---- */
  riegel: A => {
    let b = A.table("wood") + A.board(14, 16, 132, 88);
    b += A.shadowGroup(A.proteinBar(70, 42, -6, 1.3) + A.proteinBar(84, 62, 4, 1.3) + A.proteinBar(76, 82, -3, 1.3));
    b += A.many({ x: 20, y: 24, w: 30, h: 70 }, 10, 4, (x, y, a) => A.oat(x, y, a)) + A.many({ x: 118, y: 24, w: 24, h: 70 }, 8, 4, (x, y, a) => A.oat(x, y, a));
    return b + A.light();
  },
  gemuesesticks: A => {
    let b = A.table("wood") + A.board(10, 14, 140, 92);
    b += A.ramekin(50, 60, 22, "#ffffff") + A.creamy(50, 60, 17, "#f7f4ee") + A.herbs(50, 60, 12, 18);
    b += A.shadowGroup([0, 1, 2, 3, 4, 5].map(i => A.stick(106, 26 + i * 6, -8 + i * 3, 1.15, "cuc")).join("") +
      [0, 1, 2, 3, 4, 5].map(i => A.stick(108, 66 + i * 6, 8 - i * 3, 1.15, i % 2 ? "y" : "r")).join(""));
    return b + A.light();
  },
  eiergurke: A => {
    let b = A.table("linen") + A.plate(78, 60, 50);
    b += A.shadowGroup(A.boiledEgg(62, 44, -20, 1.1) + A.boiledEgg(88, 42, 15, 1.1) + A.boiledEgg(58, 70, 10, 1.1) + A.boiledEgg(84, 72, -12, 1.1));
    b += A.shadowGroup(A.many({ cx: 108, cy: 60, r: 10 }, 5, 7.5, (x, y) => A.cucumber(x, y, 5.4)) + A.tomato(72, 92, 4.2) + A.tomato(82, 94, 4));
    b += A.herbs(72, 58, 26, 14);
    return b + A.light();
  },
  putenroellchen: A => {
    let b = A.table("wood") + A.plate(80, 60, 50);
    b += A.shadowGroup([0, 1, 2, 3, 4].map(i => A.turkeyRoll(76, 34 + i * 12, -6 + (i % 2) * 8, 1.15)).join(""));
    b += A.shadowGroup(A.many({ cx: 112, cy: 64, r: 10 }, 4, 8, (x, y) => A.cucumber(x, y, 5.2)));
    b += A.herbs(76, 58, 24, 18);
    return b + A.light();
  },
  edamame: A => {
    let b = A.table("wood") + A.bowl(78, 60, 50, "#1f2328");
    b += `<circle cx="78" cy="60" r="43" fill="#2a2f35"/>`;
    b += A.shadowGroup(A.many({ cx: 78, cy: 60, r: 34 }, 22, 8, (x, y, a) => A.pod(x, y, a, 1.05)));
    b += A.many({ cx: 78, cy: 60, r: 36 }, 40, 2, (x, y) => `<rect x="${A.f1(x)}" y="${A.f1(y)}" width="1.1" height="1.1" fill="#fff" opacity=".9"/>`);
    return b + A.light();
  },
  thunhaeppchen: A => {
    let b = A.table("marble") + A.board(10, 14, 140, 92);
    const pos = [[40, 40], [80, 38], [120, 42], [44, 80], [84, 82], [122, 80]];
    b += A.shadowGroup(pos.map(([x, y]) => A.cucumber(x, y, 13)).join(""));
    b += A.shadowGroup(pos.map(([x, y]) => `<path d="${A.blob(x, y - 1, 8, .25, 9)}" fill="${A.rg("tcr", [[0, "#f6e8dc"], [.7, "#dcbfa8"], [1, "#b8957c"]])}"/>` + A.tomato(x + 3, y - 3, 2.4) + A.herbs(x, y - 1, 6, 5)).join(""));
    return b + A.light();
  },
  apfelpb: A => {
    let b = A.table("linen") + A.plate(78, 60, 50);
    b += A.ramekin(100, 60, 17, "#ffffff") + A.sauce(100, 60, 13, "#b98a5c", .05) + A.swirl(100, 60, 12, "#d4a874");
    b += A.shadowGroup([0, 1, 2, 3, 4, 5].map(i => { const ang = 1.65 + i * .6; return A.appleWedge(76 + Math.cos(ang) * 22, 60 + Math.sin(ang) * 22, ang * 57.3, 1.15); }).join(""));
    b += A.many({ cx: 100, cy: 60, r: 10 }, 12, 2, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r=".5" fill="#6b3a14"/>`);
    return b + A.light();
  },
  beerenshake: A => {
    let b = A.table("marble");
    b += A.drinkGlass("#e889b6", "#b23a73", "#f6d6e6", A.many({ x: 62, y: 36, w: 34, h: 60 }, 14, 7, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r="${A.f1(A.rnd(.6, 1.4))}" fill="#7a1f4a" opacity=".35"/>`));
    b += A.shadowGroup(A.raspberry(60, 20, 5) + A.blueberry(70, 18, 3.4));
    b += A.shadowGroup(A.raspberry(124, 92, 4) + A.blueberry(132, 86) + A.blueberry(30, 92) + A.raspberry(38, 86, 4));
    return b + A.light();
  },
  reiswaffeln: A => {
    let b = A.table("wood") + A.board(12, 14, 136, 92);
    const top = () => A.many({ cx: 0, cy: 0, r: 13 }, 24, 3, (x, y) => A.cottage(x, y, 2.4)) + A.tomatoSlice(-5, -4, 5) + A.tomatoSlice(6, 5, 5) + A.cucumber(6, -7, 4) + A.herbs(0, 0, 12, 12);
    b += A.shadowGroup(A.riceCake(50, 50, 1.25, top()) + A.riceCake(104, 52, 1.25, top()) + A.riceCake(78, 86, 1.05, ""));
    return b + A.light();
  },
  kichererbsen: A => {
    let b = A.table("wood") + A.bowl(78, 60, 50, "#e9e1d4");
    b += `<circle cx="78" cy="60" r="43" fill="#d9c8a6"/>`;
    b += A.shadowGroup(A.many({ cx: 78, cy: 60, r: 39 }, 120, 4.8, (x, y) => A.chickpea(x, y, A.rnd(2.4, 2.9))));
    b += A.many({ cx: 78, cy: 60, r: 38 }, 60, 2, (x, y) => `<circle cx="${A.f1(x)}" cy="${A.f1(y)}" r=".5" fill="#b8321d" opacity=".7"/>`) + A.herbs(78, 60, 34, 14);
    return b + A.light();
  }
});

const artCache = new Map();
/* ---------- Rezeptbilder v4: Draufsicht, klarer Stil passend zu den Kühlschrank-Icons ----------
   Bildfläche 160×100 (16:10). Das Wichtige liegt in der Mitte (x 30–130), damit auch das quadratische
   Vorschaubild passt. Keine Filter (Safari zeichnet die sonst unscharf). */
const RA4 = (() => {
  const r2 = n => +(+n).toFixed(2);
  const P = (x, y) => `${r2(x)} ${r2(y)}`;
  const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const tone = (h, k) => "#" + hx(h).map(c => Math.max(0, Math.min(255, Math.round(k > 0 ? c + (255 - c) * k : c * (1 + k))))).map(v => v.toString(16).padStart(2, "0")).join("");
  const rng = seed => { let h = 2166136261; for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; };

  let R, uid, defs;
  const id = p => p + (uid++);
  const rad = (c, stops, cx = .38, cy = .32, r = .8) => { const i = id("r"); defs += `<radialGradient id="${i}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, col, a = 1]) => `<stop offset="${o}" stop-color="${col}" stop-opacity="${a}"/>`).join("")}</radialGradient>`; return `url(#${i})`; };
  const lin = (stops, x2 = 1, y2 = 1) => { const i = id("l"); defs += `<linearGradient id="${i}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, col, a = 1]) => `<stop offset="${o}" stop-color="${col}" stop-opacity="${a}"/>`).join("")}</linearGradient>`; return `url(#${i})`; };
  /* Muster: feine Sprenkel / Poren – werden einmal pro Bild definiert */
  let pats = {};
  const pat = (name, w, h, body) => { if (!pats[name]) { pats[name] = 1; defs += `<pattern id="${name}" patternUnits="userSpaceOnUse" width="${w}" height="${h}">${body}</pattern>`; } return `url(#${name})`; };
  const dots = (n, w, h, col, rmin, rmax, op = 1) => Array.from({ length: n }, () => `<circle cx="${r2(rr(0, w))}" cy="${r2(rr(0, h))}" r="${r2(rr(rmin, rmax))}" fill="${col}" opacity="${op}"/>`).join("");
  const speckDark = () => pat("spD", 9, 9, dots(16, 9, 9, "#2a1a0e", .1, .26, .55));
  const speckLight = () => pat("spL", 7, 7, dots(10, 7, 7, "#ffffff", .1, .24, .7));
  const pores = () => pat("por", 6, 6, Array.from({ length: 7 }, () => `<ellipse cx="${r2(rr(0, 6))}" cy="${r2(rr(0, 6))}" rx="${r2(rr(.25, .6))}" ry="${r2(rr(.15, .35))}" fill="#7a4a1e" opacity=".45" ${rot(rr(0, 6), rr(0, 6), rr(0, 180))}/>`).join(""));
  const bubbles = () => pat("bub", 7, 7, Array.from({ length: 5 }, () => `<circle cx="${r2(rr(0, 7))}" cy="${r2(rr(0, 7))}" r="${r2(rr(.2, .5))}" fill="#8a5220" opacity=".5"/>`).join(""));
  const weave = () => pat("wv", 2, 2, `<rect width="2" height="2" fill="none"/><path d="M0 .5H2M.5 0V2" stroke="#000" stroke-width=".18" opacity=".06"/>`);
  const texOver = (d, kind = "food", op = 1) => {
    const c = clip(d);
    return `<g ${c} opacity="${op}"><rect x="0" y="0" width="160" height="100" fill="${speckDark()}" opacity=".5"/><rect x="0" y="0" width="160" height="100" fill="${speckLight()}" opacity=".6"/></g>`;
  };
  const clip = d => { const i = id("c"); defs += `<clipPath id="${i}"><path d="${d}"/></clipPath>`; return `clip-path="url(#${i})"`; };
  const rot = (x, y, a) => `transform="rotate(${r2(a)} ${r2(x)} ${r2(y)})"`;
  const rr = (a, b) => a + (b - a) * R();

  /* ---------- Regionen ---------- */
  const circle = (cx, cy, r) => ({ d: `M${P(cx - r, cy)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`, inside: (x, y) => (x - cx) ** 2 + (y - cy) ** 2 < r * r, cx, cy, r, bb: [cx - r, cy - r, cx + r, cy + r] });
  const blob = (cx, cy, rx, ry = rx, wob = .12) => {
    const n = 10, pts = [], k = [];
    for (let i = 0; i < n; i++) k.push(1 + (R() - .5) * 2 * wob);
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; pts.push([cx + Math.cos(a) * rx * k[i], cy + Math.sin(a) * ry * k[i]]); }
    let d = `M${P(...pts[0])}`;
    for (let i = 0; i < n; i++) { const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]; d += `C${P(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)} ${P(p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)} ${P(...p2)}`; }
    return { d: d + "Z", inside: (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < .92, cx, cy, r: Math.max(rx, ry), bb: [cx - rx, cy - ry, cx + rx, cy + ry] };
  };
  const sector = (cx, cy, r, a0, a1, gap = 1.1) => {
    const A0 = a0 * Math.PI / 180, A1 = a1 * Math.PI / 180, m = (A0 + A1) / 2;
    const ox = Math.cos(m) * gap, oy = Math.sin(m) * gap, X = cx + ox, Y = cy + oy, rr0 = r - gap;
    const d = `M${P(X, Y)}L${P(X + Math.cos(A0) * rr0, Y + Math.sin(A0) * rr0)}A${rr0} ${rr0} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${P(X + Math.cos(A1) * rr0, Y + Math.sin(A1) * rr0)}Z`;
    const inside = (x, y) => { const dx = x - X, dy = y - Y, dd = Math.hypot(dx, dy); if (dd > rr0 - 1 || dd < 2) return false; let a = Math.atan2(dy, dx) * 180 / Math.PI; while (a < a0) a += 360; while (a > a0 + 360) a -= 360; return a > a0 + 4 && a < a1 - 4; };
    return { d, inside, cx: X + Math.cos(m) * r * .55, cy: Y + Math.sin(m) * r * .55, r: r * .45, bb: [cx - r, cy - r, cx + r, cy + r] };
  };
  const rect = (x, y, w, h, rx = 3) => ({ d: `M${P(x + rx, y)}H${r2(x + w - rx)}Q${P(x + w, y)} ${P(x + w, y + rx)}V${r2(y + h - rx)}Q${P(x + w, y + h)} ${P(x + w - rx, y + h)}H${r2(x + rx)}Q${P(x, y + h)} ${P(x, y + h - rx)}V${r2(y + rx)}Q${P(x, y)} ${P(x + rx, y)}Z`, inside: (X, Y) => X > x + 1 && X < x + w - 1 && Y > y + 1 && Y < y + h - 1, cx: x + w / 2, cy: y + h / 2, r: Math.min(w, h) / 2, bb: [x, y, x + w, y + h] });

  /* Punkte in einer Region verteilen (mit Mindestabstand) */
  const spots = (reg, n, minD = 3) => {
    const out = []; let tries = 0;
    while (out.length < n && tries < n * 60) {
      tries++;
      const x = rr(reg.bb[0], reg.bb[2]), y = rr(reg.bb[1], reg.bb[3]);
      if (!reg.inside(x, y)) continue;
      if (out.some(([a, b]) => (a - x) ** 2 + (b - y) ** 2 < minD * minD)) continue;
      out.push([x, y]);
    }
    return out.sort((a, b) => a[1] - b[1]);
  };
  /* kleiner Schatten unter einem Stück */
  /* weicher, leicht nach rechts unten fallender Schatten (Verlauf statt Filter) */
  const softSh = () => { if (!pats.__sh) { pats.__sh = 1; defs += `<radialGradient id="shS"><stop offset="0" stop-color="#24160a" stop-opacity=".95"/><stop offset=".5" stop-color="#24160a" stop-opacity=".5"/><stop offset="1" stop-color="#24160a" stop-opacity="0"/></radialGradient>`; } return "url(#shS)"; };
  const sh = (x, y, rx, ry = rx * .7, a = .22) => `<ellipse cx="${r2(x + rx * .07 + .5)}" cy="${r2(y + ry * .1 + .9)}" rx="${r2(rx * 1.16 + .6)}" ry="${r2(ry * 1.18 + .6)}" fill="${softSh()}" opacity="${r2(Math.min(.6, a * 1.8))}"/>`;

  /* ---------- Stücke (einzelne Zutaten, Draufsicht) ---------- */
  const PC = {
    grain: (x, y) => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="1.15" ry=".5" fill="#fffdf7" stroke="#e2dccd" stroke-width=".22" ${rot(x, y, rr(0, 180))}/>`,
    floret: (x, y, s = 1) => {
      let g = sh(x, y, 4.2 * s, 3.4 * s);
      g += `<path d="M${P(x, y + 1 * s)}L${P(x + rr(-1, 1) * s, y + 4.5 * s)}" stroke="#8fbf5a" stroke-width="${r2(1.8 * s)}" stroke-linecap="round"/>`;
      [[-2.2, -.6, 2.4], [1.9, -.8, 2.5], [0, -2.6, 2.4], [-.4, 1, 2.2], [2.2, 1.4, 1.8], [-2.4, 1.6, 1.7]].forEach(([dx, dy, r], i) => {
        const X = x + dx * s, Y = y + dy * s;
        g += `<circle cx="${r2(X)}" cy="${r2(Y)}" r="${r2(r * s)}" fill="${i % 2 ? "#2f7d32" : "#3b8f3b"}"/><circle cx="${r2(X - .6 * s)}" cy="${r2(Y - .6 * s)}" r="${r2(r * .5 * s)}" fill="#5fae4e"/>`;
        for (let k = 0; k < 3; k++) g += `<circle cx="${r2(X + rr(-r, r) * .6 * s)}" cy="${r2(Y + rr(-r, r) * .6 * s)}" r="${r2(.35 * s)}" fill="#7cc461"/>`;
      });
      return g;
    },
    strip: (x, y, s = 1, col = "#d9302a") => { const a = rr(0, 180), L = rr(7, 10) * s; return sh(x, y, L / 2, 1.6 * s, .16) + `<g ${rot(x, y, a)}><rect x="${r2(x - L / 2)}" y="${r2(y - 1.3 * s)}" width="${r2(L)}" height="${r2(2.6 * s)}" rx="${r2(1.3 * s)}" fill="${col}"/><rect x="${r2(x - L / 2 + 1.2)}" y="${r2(y - .9 * s)}" width="${r2(L - 2.4)}" height="${r2(.7 * s)}" rx=".35" fill="#fff" opacity=".45"/></g>`; },
    cherry: (x, y, s = 1) => sh(x, y, 3.2 * s) + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(3.1 * s)}" fill="#e3342a"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(2.3 * s)}" fill="#f2604f"/>` +
      [0, 1, 2].map(i => { const a = i * 2.1 + .4; return `<ellipse cx="${r2(x + Math.cos(a) * 1.2 * s)}" cy="${r2(y + Math.sin(a) * 1.2 * s)}" rx="${r2(.75 * s)}" ry="${r2(.45 * s)}" fill="#f7c36b" ${rot(x + Math.cos(a) * 1.2 * s, y + Math.sin(a) * 1.2 * s, a * 57)}/>`; }).join("") + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(.6 * s)}" fill="#f9b8a6"/>`,
    tomatoSlice: (x, y, s = 1) => sh(x, y, 5 * s) + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(5 * s)}" fill="#d92b22"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(4.2 * s)}" fill="#f0503f"/>` +
      [0, 1, 2, 3, 4].map(i => { const a = i * 1.2566; return `<path d="M${P(x, y)}L${P(x + Math.cos(a - .45) * 3.6 * s, y + Math.sin(a - .45) * 3.6 * s)}A${r2(3.6 * s)} ${r2(3.6 * s)} 0 0 1 ${P(x + Math.cos(a + .45) * 3.6 * s, y + Math.sin(a + .45) * 3.6 * s)}Z" fill="#f98a73"/><ellipse cx="${r2(x + Math.cos(a) * 2.3 * s)}" cy="${r2(y + Math.sin(a) * 2.3 * s)}" rx="${r2(.6 * s)}" ry="${r2(.35 * s)}" fill="#fbd27a"/>`; }).join("") + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(1 * s)}" fill="#f7a891"/>`,
    cucumber: (x, y, s = 1) => sh(x, y, 4.2 * s) + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(4.2 * s)}" fill="#2f7d32"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(3.6 * s)}" fill="#cde9a6"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(2 * s)}" fill="#e6f5cf"/>` +
      [0, 1, 2, 3, 4, 5].map(i => { const a = i * 1.047; return `<ellipse cx="${r2(x + Math.cos(a) * 1.3 * s)}" cy="${r2(y + Math.sin(a) * 1.3 * s)}" rx="${r2(.5 * s)}" ry="${r2(.28 * s)}" fill="#f6fbe9" ${rot(x + Math.cos(a) * 1.3 * s, y + Math.sin(a) * 1.3 * s, a * 57)}/>`; }).join(""),
    zucchini: (x, y, s = 1) => sh(x, y, 4 * s) + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(4 * s)}" fill="#2b5e22"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(3.4 * s)}" fill="#d9e9a0"/><circle cx="${r2(x - .8 * s)}" cy="${r2(y - .8 * s)}" r="${r2(1.8 * s)}" fill="#c7a25a" opacity=".55"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(1.3 * s)}" fill="#eef5c9"/>`,
    corn: (x, y, s = 1) => `<rect x="${r2(x - 1.1 * s)}" y="${r2(y - .9 * s)}" width="${r2(2.2 * s)}" height="${r2(1.9 * s)}" rx="${r2(.7 * s)}" fill="#f6c42c" stroke="#e0a91a" stroke-width=".25" ${rot(x, y, rr(-30, 30))}/><circle cx="${r2(x - .4 * s)}" cy="${r2(y - .3 * s)}" r="${r2(.35 * s)}" fill="#fde68a"/>`,
    bean: (x, y, s = 1) => { const a = rr(0, 180); return `<g ${rot(x, y, a)}><path d="M${P(x - 2.2 * s, y)}C${P(x - 2.2 * s, y - 1.8 * s)} ${P(x + 2.2 * s, y - 1.8 * s)} ${P(x + 2.2 * s, y)}C${P(x + 2.2 * s, y + 1.6 * s)} ${P(x + .4 * s, y + .6 * s)} ${P(x, y + .9 * s)}C${P(x - .4 * s, y + .6 * s)} ${P(x - 2.2 * s, y + 1.6 * s)} ${P(x - 2.2 * s, y)}Z" fill="#7a1f24"/><ellipse cx="${r2(x - .5 * s)}" cy="${r2(y - .7 * s)}" rx="${r2(.9 * s)}" ry="${r2(.35 * s)}" fill="#c25a5f"/></g>`; },
    pea: (x, y, s = 1) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(1.5 * s)}" fill="#5aa832"/><circle cx="${r2(x - .5 * s)}" cy="${r2(y - .5 * s)}" r="${r2(.5 * s)}" fill="#a6dc76"/>`,
    edamame: (x, y, s = 1) => { const a = rr(0, 180); return sh(x, y, 4 * s, 1.8 * s, .15) + `<g ${rot(x, y, a)}><path d="M${P(x - 4.4 * s, y)}Q${P(x - 3 * s, y - 2.4 * s)} ${P(x - 1.4 * s, y - 1.4 * s)}Q${P(x, y - 2.6 * s)} ${P(x + 1.4 * s, y - 1.4 * s)}Q${P(x + 3 * s, y - 2.4 * s)} ${P(x + 4.4 * s, y)}Q${P(x, y + 1.8 * s)} ${P(x - 4.4 * s, y)}Z" fill="#6cae3a"/>` + [-2.6, 0, 2.6].map(d => `<ellipse cx="${r2(x + d * s)}" cy="${r2(y - .5 * s)}" rx="${r2(1.1 * s)}" ry="${r2(.8 * s)}" fill="#8fcd55"/>`).join("") + `</g>`; },
    chickpea: (x, y, s = 1) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(1.9 * s)}" fill="#e2b25e"/><path d="M${P(x - .6 * s, y - 1.6 * s)}Q${P(x + .5 * s, y)} ${P(x - .2 * s, y + 1.6 * s)}" stroke="#c48d3a" stroke-width="${r2(.35 * s)}" fill="none"/><circle cx="${r2(x - .7 * s)}" cy="${r2(y - .7 * s)}" r="${r2(.55 * s)}" fill="#f3d39a"/>`,
    blueberry: (x, y, s = 1) => sh(x, y, 2 * s, 1.5 * s, .2) + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(2 * s)}" fill="#33306b"/><circle cx="${r2(x - .6 * s)}" cy="${r2(y - .7 * s)}" r="${r2(.7 * s)}" fill="#6a68b8"/><path d="M${P(x - .5 * s, y + .4 * s)}l${r2(.5 * s)} ${r2(-.4 * s)} ${r2(.5 * s)} ${r2(.4 * s)}" stroke="#1d1b45" stroke-width="${r2(.3 * s)}" fill="none"/>`,
    raspberry: (x, y, s = 1) => sh(x, y, 2.3 * s, 1.7 * s, .2) + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(2.3 * s)}" fill="#c81d43"/>` + [[-1, -1], [0, -1.3], [1, -1], [-1.3, 0], [0, 0], [1.3, 0], [-1, 1], [0, 1.3], [1, 1]].map(([a, b]) => `<circle cx="${r2(x + a * s)}" cy="${r2(y + b * s)}" r="${r2(.62 * s)}" fill="#e43c5f"/>`).join("") + `<circle cx="${r2(x - .8 * s)}" cy="${r2(y - .9 * s)}" r="${r2(.35 * s)}" fill="#fff" opacity=".6"/>`,
    strawberry: (x, y, s = 1) => { const a = rr(-40, 40); return sh(x, y, 3.4 * s) + `<g ${rot(x, y, a)}><path d="M${P(x, y + 4 * s)}C${P(x - 4.4 * s, y + 1 * s)} ${P(x - 3.6 * s, y - 3.6 * s)} ${P(x, y - 3 * s)}C${P(x + 3.6 * s, y - 3.6 * s)} ${P(x + 4.4 * s, y + 1 * s)} ${P(x, y + 4 * s)}Z" fill="#e0262f"/><path d="M${P(x, y + 2.8 * s)}C${P(x - 2.8 * s, y + .6 * s)} ${P(x - 2.4 * s, y - 2.2 * s)} ${P(x, y - 1.8 * s)}C${P(x + 2.4 * s, y - 2.2 * s)} ${P(x + 2.8 * s, y + .6 * s)} ${P(x, y + 2.8 * s)}Z" fill="#f78a8e"/><path d="M${P(x - 2.2 * s, y - 3.4 * s)}L${P(x, y - 2.4 * s)}L${P(x + 2.2 * s, y - 3.4 * s)}" stroke="#3f8f3a" stroke-width="${r2(1 * s)}" fill="none" stroke-linecap="round"/></g>`; },
    banana: (x, y, s = 1) => sh(x, y, 3.2 * s) + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(3.2 * s)}" fill="#f6e3a1"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(2.8 * s)}" fill="#fbefc4"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(1.2 * s)}" fill="none" stroke="#e7cf88" stroke-width="${r2(.4 * s)}"/>` + [0, 1, 2].map(i => `<circle cx="${r2(x + Math.cos(i * 2.1) * .55 * s)}" cy="${r2(y + Math.sin(i * 2.1) * .55 * s)}" r="${r2(.22 * s)}" fill="#8a6d3b"/>`).join(""),
    appleCube: (x, y, s = 1) => { const a = rr(-25, 25); return sh(x, y, 2.4 * s) + `<g ${rot(x, y, a)}><rect x="${r2(x - 2.2 * s)}" y="${r2(y - 2.2 * s)}" width="${r2(4.4 * s)}" height="${r2(4.4 * s)}" rx="${r2(.8 * s)}" fill="#f8efc8"/><rect x="${r2(x - 2.2 * s)}" y="${r2(y - 2.2 * s)}" width="${r2(4.4 * s)}" height="${r2(1.1 * s)}" rx="${r2(.5 * s)}" fill="#d83a2e"/></g>`; },
    appleSlice: (x, y, s = 1) => { const a = rr(0, 360); return sh(x, y, 4 * s, 2 * s, .15) + `<g ${rot(x, y, a)}><path d="M${P(x - 4.5 * s, y)}A${r2(4.5 * s)} ${r2(4.5 * s)} 0 0 0 ${P(x + 4.5 * s, y)}Z" fill="#f8efc8"/><path d="M${P(x - 4.5 * s, y)}A${r2(4.5 * s)} ${r2(4.5 * s)} 0 0 0 ${P(x + 4.5 * s, y)}" stroke="#d83a2e" stroke-width="${r2(.9 * s)}" fill="none"/><ellipse cx="${r2(x)}" cy="${r2(y + 1 * s)}" rx="${r2(.5 * s)}" ry="${r2(.3 * s)}" fill="#6b4426"/></g>`; },
    oat: (x, y, s = 1) => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(1.5 * s)}" ry="${r2(1 * s)}" fill="#e9d3a4" stroke="#d1b47c" stroke-width=".2" ${rot(x, y, rr(0, 180))}/>`,
    choc: (x, y, s = 1) => `<path d="M${P(x - 1.2 * s, y - .9 * s)}L${P(x + 1.3 * s, y - 1.1 * s)}L${P(x + 1 * s, y + 1.1 * s)}L${P(x - 1.2 * s, y + .9 * s)}Z" fill="#3e2416" ${rot(x, y, rr(0, 90))}/><path d="M${P(x - .8 * s, y - .6 * s)}L${P(x + .6 * s, y - .7 * s)}" stroke="#7a5038" stroke-width=".3"/>`,
    crouton: (x, y, s = 1) => sh(x, y, 2 * s) + `<rect x="${r2(x - 1.8 * s)}" y="${r2(y - 1.8 * s)}" width="${r2(3.6 * s)}" height="${r2(3.6 * s)}" rx="${r2(.7 * s)}" fill="#d9a04f" ${rot(x, y, rr(0, 90))}/><circle cx="${r2(x - .5 * s)}" cy="${r2(y - .5 * s)}" r="${r2(.8 * s)}" fill="#f0c77e"/>`,
    parmesan: (x, y, s = 1) => `<path d="M${P(x - 2.4 * s, y)}L${P(x + 2 * s, y - 1 * s)}L${P(x + 2.4 * s, y + .4 * s)}L${P(x - 1.6 * s, y + 1 * s)}Z" fill="#fbefc0" stroke="#e8d38f" stroke-width=".2" ${rot(x, y, rr(0, 180))}/>`,
    herb: (x, y, s = 1) => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(1 * s)}" ry="${r2(.55 * s)}" fill="${R() > .5 ? "#3f8f3a" : "#5aa846"}" ${rot(x, y, rr(0, 180))}/>`,
    sesame: (x, y, s = 1) => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(.55 * s)}" ry="${r2(.3 * s)}" fill="${R() > .7 ? "#2b2b2b" : "#fbf3dc"}" ${rot(x, y, rr(0, 180))}/>`,
    mushroom: (x, y, s = 1) => { const a = rr(0, 360); return sh(x, y, 3 * s) + `<g ${rot(x, y, a)}><path d="M${P(x - 3.2 * s, y)}C${P(x - 3.2 * s, y - 3.4 * s)} ${P(x + 3.2 * s, y - 3.4 * s)} ${P(x + 3.2 * s, y)}Q${P(x + 1 * s, y + .3 * s)} ${P(x + .9 * s, y + 2.6 * s)}H${r2(x - .9 * s)}Q${P(x - 1 * s, y + .3 * s)} ${P(x - 3.2 * s, y)}Z" fill="#efe1cd"/><path d="M${P(x - 3.2 * s, y)}C${P(x - 3.2 * s, y - 3.4 * s)} ${P(x + 3.2 * s, y - 3.4 * s)} ${P(x + 3.2 * s, y)}" stroke="#a9825c" stroke-width="${r2(.7 * s)}" fill="none"/></g>`; },
    onion: (x, y, s = 1) => `<path d="M${P(x - 2.6 * s, y + 1 * s)}A${r2(2.8 * s)} ${r2(2.8 * s)} 0 0 1 ${P(x + 2.6 * s, y + 1 * s)}" stroke="#a85d9a" stroke-width="${r2(.8 * s)}" fill="none" ${rot(x, y, rr(0, 360))}/>`,
    spinach: (x, y, s = 1) => { const a = rr(0, 360); return sh(x, y, 3.6 * s, 2 * s, .14) + `<g ${rot(x, y, a)}><path d="M${P(x - 4 * s, y)}Q${P(x - 1 * s, y - 3.2 * s)} ${P(x + 4 * s, y)}Q${P(x - 1 * s, y + 3.2 * s)} ${P(x - 4 * s, y)}Z" fill="#2f6e2a"/><path d="M${P(x - 4 * s, y)}L${P(x + 3.4 * s, y)}" stroke="#5f9c3d" stroke-width="${r2(.35 * s)}"/></g>`; },
    lettuce: (x, y, s = 1) => { const a = rr(0, 360); let d = ""; for (let i = 0; i <= 12; i++) { const t = i / 12 * Math.PI * 2, r = (5 + Math.sin(t * 5) * .9) * s; d += `${i ? "L" : "M"}${P(x + Math.cos(t) * r * 1.2, y + Math.sin(t) * r * .8)}`; } return sh(x, y, 5.5 * s, 3.5 * s, .12) + `<g ${rot(x, y, a)}><path d="${d}Z" fill="${R() > .5 ? "#8fcd55" : "#7cbf47"}"/><path d="M${P(x - 4.5 * s, y)}L${P(x + 4.5 * s, y)}M${P(x - 1 * s, y)}L${P(x + 1 * s, y - 2.5 * s)}M${P(x + 1.5 * s, y)}L${P(x + 3 * s, y + 2.2 * s)}" stroke="#c8e6a0" stroke-width="${r2(.45 * s)}"/></g>`; },
    potato: (x, y, s = 1) => sh(x, y, 4.8 * s, 3.6 * s) + `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(4.8 * s)}" ry="${r2(3.8 * s)}" fill="#e7c06a" ${rot(x, y, rr(-30, 30))}/><ellipse cx="${r2(x - .8 * s)}" cy="${r2(y - .8 * s)}" rx="${r2(3.3 * s)}" ry="${r2(2.4 * s)}" fill="#f6dc94"/><path d="M${P(x + 1.6 * s, y - 2.6 * s)}A${r2(4 * s)} ${r2(3 * s)} 0 0 1 ${P(x + 4 * s, y + 1 * s)}" stroke="#a87a3a" stroke-width="${r2(.6 * s)}" fill="none"/>` + [0, 1].map(() => PC.herb(x + rr(-2, 2) * s, y + rr(-2, 1) * s, .8 * s)).join(""),
    sweetWedge: (x, y, s = 1) => { const a = rr(0, 360); return sh(x, y, 5 * s, 2.4 * s, .18) + `<g ${rot(x, y, a)}><path d="M${P(x - 5.4 * s, y + 1.4 * s)}Q${P(x, y - 4.2 * s)} ${P(x + 5.4 * s, y + 1.4 * s)}Z" fill="#e8742e"/><path d="M${P(x - 5.4 * s, y + 1.4 * s)}Q${P(x, y - 4.2 * s)} ${P(x + 5.4 * s, y + 1.4 * s)}" stroke="#a84a1c" stroke-width="${r2(1 * s)}" fill="none"/><path d="M${P(x - 3 * s, y + .4 * s)}Q${P(x, y - 1.8 * s)} ${P(x + 3 * s, y + .4 * s)}" stroke="#f6a463" stroke-width="${r2(.8 * s)}" fill="none"/><circle cx="${r2(x + 1 * s)}" cy="${r2(y - .4 * s)}" r="${r2(.35 * s)}" fill="#6b2a10"/></g>`; },
    greenBean: (x, y, s = 1) => { const a = rr(-25, 25); return sh(x, y, 5 * s, 1 * s, .15) + `<g ${rot(x, y, a)}><path d="M${P(x - 6 * s, y)}Q${P(x, y - 1.4 * s)} ${P(x + 6 * s, y)}" stroke="#3d8a33" stroke-width="${r2(1.6 * s)}" stroke-linecap="round" fill="none"/><path d="M${P(x - 5 * s, y - .5 * s)}Q${P(x, y - 1.6 * s)} ${P(x + 5 * s, y - .5 * s)}" stroke="#76bd55" stroke-width="${r2(.45 * s)}" fill="none"/></g>`; },
    chickenSlice: (x, y, s = 1, a) => { a = a ?? rr(0, 180); return sh(x, y, 5 * s, 2.4 * s, .2) + `<g ${rot(x, y, a)}><rect x="${r2(x - 5.5 * s)}" y="${r2(y - 2 * s)}" width="${r2(11 * s)}" height="${r2(4 * s)}" rx="${r2(1.8 * s)}" fill="#d99a4e"/><rect x="${r2(x - 5 * s)}" y="${r2(y - 1.3 * s)}" width="${r2(10 * s)}" height="${r2(2.2 * s)}" rx="${r2(1 * s)}" fill="#f1d3a8"/>` + [-3, 0, 3].map(d => `<path d="M${P(x + d * s - 1, y - 2 * s)}L${P(x + d * s + 1, y + 2 * s)}" stroke="#8a5320" stroke-width="${r2(.55 * s)}" opacity=".6"/>`).join("") + `</g>`; },
    chickenCube: (x, y, s = 1) => sh(x, y, 2.6 * s) + `<rect x="${r2(x - 2.5 * s)}" y="${r2(y - 2.3 * s)}" width="${r2(5 * s)}" height="${r2(4.6 * s)}" rx="${r2(1.2 * s)}" fill="#d99a4e" ${rot(x, y, rr(0, 90))}/><rect x="${r2(x - 1.6 * s)}" y="${r2(y - 1.5 * s)}" width="${r2(3 * s)}" height="${r2(2.6 * s)}" rx="${r2(.8 * s)}" fill="#efc489" ${rot(x, y, rr(0, 90))}/>`,
    mince: (x, y, s = 1) => `<path d="M${P(x - 1.3 * s, y)}L${P(x - .3 * s, y - 1.2 * s)}L${P(x + 1.2 * s, y - .6 * s)}L${P(x + .9 * s, y + .9 * s)}L${P(x - .6 * s, y + 1.1 * s)}Z" fill="${R() > .5 ? "#6e3a24" : "#874a2e"}"/>`,
    shrimp: (x, y, s = 1) => { const a = rr(0, 360); return sh(x, y, 4 * s, 3 * s, .2) + `<g ${rot(x, y, a)}><path d="M${P(x + 3.6 * s, y - 1 * s)}A${r2(3.8 * s)} ${r2(3.8 * s)} 0 1 0 ${P(x + 2.2 * s, y + 3 * s)}" stroke="#f0855c" stroke-width="${r2(3 * s)}" fill="none" stroke-linecap="round"/><path d="M${P(x + 3.6 * s, y - 1 * s)}A${r2(3.8 * s)} ${r2(3.8 * s)} 0 1 0 ${P(x + 2.2 * s, y + 3 * s)}" stroke="#fbc0a3" stroke-width="${r2(.8 * s)}" fill="none" stroke-dasharray="${r2(1.2 * s)} ${r2(1 * s)}"/><path d="M${P(x + 2.2 * s, y + 3 * s)}l${r2(2 * s)} ${r2(.8 * s)} ${r2(-.6 * s)} ${r2(1.4 * s)}Z" fill="#e2552f"/></g>`; },
    tofu: (x, y, s = 1) => sh(x, y, 3 * s) + `<rect x="${r2(x - 2.8 * s)}" y="${r2(y - 2.8 * s)}" width="${r2(5.6 * s)}" height="${r2(5.6 * s)}" rx="${r2(1 * s)}" fill="#e3b462" ${rot(x, y, rr(-20, 20))}/><rect x="${r2(x - 1.9 * s)}" y="${r2(y - 2 * s)}" width="${r2(3.8 * s)}" height="${r2(3.6 * s)}" rx="${r2(.7 * s)}" fill="#f6e5c0" ${rot(x, y, rr(-20, 20))}/>`,
    salmonCube: (x, y, s = 1) => sh(x, y, 2.8 * s) + `<g ${rot(x, y, rr(-30, 30))}><rect x="${r2(x - 2.7 * s)}" y="${r2(y - 2.5 * s)}" width="${r2(5.4 * s)}" height="${r2(5 * s)}" rx="${r2(.8 * s)}" fill="#f47c45"/><path d="M${P(x - 2.7 * s, y - 1 * s)}Q${P(x, y - .2 * s)} ${P(x + 2.7 * s, y - 1.4 * s)}M${P(x - 2.7 * s, y + 1.2 * s)}Q${P(x, y + 2 * s)} ${P(x + 2.7 * s, y + .8 * s)}" stroke="#fcd6bf" stroke-width="${r2(.5 * s)}" fill="none"/></g>`,
    egg: (x, y, s = 1) => { let d = ""; for (let i = 0; i <= 12; i++) { const t = i / 12 * Math.PI * 2, r = (6 + Math.sin(t * 3 + 1) * .9 + Math.cos(t * 5) * .5) * s; d += `${i ? "L" : "M"}${P(x + Math.cos(t) * r, y + Math.sin(t) * r * .9)}`; } return sh(x, y, 6 * s, 5 * s, .14) + `<path d="${d}Z" fill="#fffdf8" stroke="#efe6d4" stroke-width=".4" stroke-linejoin="round"/><circle cx="${r2(x + .6 * s)}" cy="${r2(y - .3 * s)}" r="${r2(2.6 * s)}" fill="#f4a51c"/><circle cx="${r2(x + .6 * s)}" cy="${r2(y - .3 * s)}" r="${r2(2.1 * s)}" fill="#fbbf24"/><circle cx="${r2(x - .2 * s)}" cy="${r2(y - 1.1 * s)}" r="${r2(.7 * s)}" fill="#fff" opacity=".7"/>`; },
    eggHalf: (x, y, s = 1) => sh(x, y, 3.4 * s, 4 * s) + `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(3.4 * s)}" ry="${r2(4.4 * s)}" fill="#fffdf8" stroke="#e8decb" stroke-width=".3" ${rot(x, y, rr(-30, 30))}/><circle cx="${r2(x)}" cy="${r2(y + .3 * s)}" r="${r2(1.9 * s)}" fill="#f8b62a"/><circle cx="${r2(x - .5 * s)}" cy="${r2(y - .2 * s)}" r="${r2(.6 * s)}" fill="#fde68a"/>`,
    scramble: (x, y, s = 1) => sh(x, y, 3 * s) + `<path d="M${P(x - 3 * s, y)}Q${P(x - 3 * s, y - 2.8 * s)} ${P(x, y - 2.6 * s)}Q${P(x + 3.2 * s, y - 2.8 * s)} ${P(x + 3 * s, y)}Q${P(x + 3 * s, y + 2.6 * s)} ${P(x, y + 2.4 * s)}Q${P(x - 3 * s, y + 2.6 * s)} ${P(x - 3 * s, y)}Z" fill="#f8d55a" ${rot(x, y, rr(0, 180))}/><circle cx="${r2(x - .8 * s)}" cy="${r2(y - .8 * s)}" r="${r2(1.2 * s)}" fill="#fde98f"/>`,
    cottage: (x, y, s = 1) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(1.4 * s)}" fill="#fffef9" stroke="#e7e0d0" stroke-width=".25"/>`,
    lentil: (x, y, s = 1) => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(.9 * s)}" ry="${r2(.7 * s)}" fill="#e98a3a"/>`,
    pasta: (x, y, s = 1) => { const a = rr(0, 180); return `<g ${rot(x, y, a)}><path d="M${P(x - 3.4 * s, y - 1.2 * s)}L${P(x + 2.4 * s, y - 1.6 * s)}L${P(x + 3.4 * s, y + 1.2 * s)}L${P(x - 2.4 * s, y + 1.6 * s)}Z" fill="#f2c45e" stroke="#d9a238" stroke-width=".3"/>` + [-1.8, 0, 1.8].map(d => `<path d="M${P(x + d * s - .4, y - 1.4 * s)}L${P(x + d * s + .4, y + 1.4 * s)}" stroke="#dba640" stroke-width=".3"/>`).join("") + `</g>`; },
    cubeRed: (x, y, s = 1) => `<rect x="${r2(x - 1.3 * s)}" y="${r2(y - 1.3 * s)}" width="${r2(2.6 * s)}" height="${r2(2.6 * s)}" rx=".5" fill="#d9302a" ${rot(x, y, rr(0, 90))}/>`
  };

  /* ---------- Flächen (Reis, Soße, Joghurt …) ---------- */
  const fill = (reg, base, hi, items = [], o = {}) => {
    const c = clip(reg.d);
    let g = `<path d="${reg.d}" fill="${rad(0, [[0, hi], [.7, base], [1, tone(base, -.18)]], .35, .3, .85)}"/>`;
    g += `<g ${c}>`;
    for (const [fn, n, s = 1, md = 3] of items) for (const [x, y] of spots(reg, n, md)) g += PC[fn](x, y, s);
    if (o.extra) g += o.extra;
    g += `<rect x="0" y="0" width="160" height="100" fill="${speckDark()}" opacity=".45"/><rect x="0" y="0" width="160" height="100" fill="${speckLight()}" opacity=".5"/>`;
    /* Innenschatten am Rand + Glanz oben links: wirkt wie ein Häufchen */
    g += `<path d="${reg.d}" fill="none" stroke="${tone(base, -.35)}" stroke-width="3.2" opacity=".22"/><path d="${reg.d}" fill="none" stroke="${tone(base, -.25)}" stroke-width="1.2" opacity=".35"/>`;
    g += `<ellipse cx="${r2(reg.cx - reg.r * .35)}" cy="${r2(reg.cy - reg.r * .38)}" rx="${r2(reg.r * .45)}" ry="${r2(reg.r * .22)}" fill="${rad(0, [[0, "#fff", 1], [1, "#fff", 0]], .5, .5, .5)}" opacity="${Math.min(.9, (o.gloss ?? .12) * 3)}" ${rot(reg.cx - reg.r * .35, reg.cy - reg.r * .38, -25)}/>`;
    if ((o.gloss ?? 0) >= .2) g += spots(reg, Math.max(3, Math.round(reg.r * .35)), 4).map(([x, y]) => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(rr(.6, 1.4))}" ry="${r2(rr(.3, .6))}" fill="#fff" opacity="${r2(rr(.35, .7))}" ${rot(x, y, -30)}/>`).join("");
    g += `</g>`;
    return g;
  };
  const T = {
    rice: reg => fill(reg, "#f4efe2", "#fffdf6", [["grain", Math.round(reg.r * reg.r * .55), 1, 1.35]]),
    quinoa: reg => fill(reg, "#efe2c4", "#fbf3df", [["grain", Math.round(reg.r * reg.r * .5), .8, 1.2]]),
    tomatoSauce: reg => fill(reg, "#c63a22", "#e3573a", [["herb", Math.round(reg.r * .5), .8, 4]], { gloss: .25, extra: spots(reg, Math.round(reg.r * .7), 3).map(([x, y]) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(rr(.5, 1.2))}" fill="#9d2a17" opacity=".5"/>`).join("") }),
    bolognese: reg => fill(reg, "#a83a24", "#c8513a", [["mince", Math.round(reg.r * reg.r * .35), 1.1, 1.8], ["herb", Math.round(reg.r * .3), .8, 5]], { gloss: .22 }),
    chili: reg => fill(reg, "#9e3422", "#bd4a32", [["mince", Math.round(reg.r * reg.r * .2), 1.1, 2], ["bean", Math.round(reg.r * .9), 1, 3.6], ["corn", Math.round(reg.r * .7), 1, 3]]),
    curry: reg => fill(reg, "#d98a2b", "#f0aa48", [["chickenCube", Math.round(reg.r * .45), 1, 6], ["spinach", Math.round(reg.r * .3), .7, 6], ["lentil", Math.round(reg.r * reg.r * .1), 1, 1.8]]),
    dal: reg => fill(reg, "#e38a2e", "#f3a74b", [["lentil", Math.round(reg.r * reg.r * .3), 1, 1.4], ["spinach", Math.round(reg.r * .3), .7, 6]]),
    yogurt: (reg, col = "#fbfaf6") => fill(reg, col, "#ffffff", [], { extra: [0, 1, 2].map(i => `<path d="M${P(reg.cx - reg.r * .7, reg.cy - reg.r * .3 + i * reg.r * .3)}q${r2(reg.r * .35)} ${r2(-reg.r * .25)} ${r2(reg.r * .7)} 0t${r2(reg.r * .7)} 0" stroke="${tone(col, -.08)}" stroke-width="1" fill="none" opacity=".8"/>`).join("") }),
    oats: reg => fill(reg, "#e7d3ac", "#f4e6c8", [["oat", Math.round(reg.r * reg.r * .35), 1, 1.8]]),
    porridge: reg => fill(reg, "#ead8b4", "#f7ead0", [["oat", Math.round(reg.r * reg.r * .22), 1, 2.2]]),
    spinachBed: reg => fill(reg, "#2f6e2a", "#3f8f3a", [["spinach", Math.round(reg.r * reg.r * .12), 1, 3.5]]),
    lettuceBed: reg => fill(reg, "#7cbf47", "#9fd668", [["lettuce", Math.round(reg.r * reg.r * .06), 1, 5]]),
    corn: reg => fill(reg, "#e9b21f", "#f8d24a", [["corn", Math.round(reg.r * reg.r * .6), 1, 1.6]]),
    beans: reg => fill(reg, "#6a1a1e", "#8a2a2e", [["bean", Math.round(reg.r * reg.r * .3), 1, 2.6]]),
    peas: reg => fill(reg, "#4f9a2c", "#6ab43c", [["pea", Math.round(reg.r * reg.r * .45), 1, 2.4]]),
    edamame: reg => fill(reg, "#5d9e33", "#78b848", [["pea", Math.round(reg.r * reg.r * .4), 1.2, 2.6]]),
    chickpeas: reg => fill(reg, "#d6a24f", "#e8bc6e", [["chickpea", Math.round(reg.r * reg.r * .12), 1.7, 5]]),
    broccoli: reg => fill(reg, "#2c6b2a", "#3b8f3b", [["floret", Math.round(reg.r * reg.r * .055), 1, 6.5]]),
    pepper: reg => fill(reg, "#b8261d", "#d9302a", [["strip", Math.round(reg.r * reg.r * .08), 1, 3.4]]),
    pepperMix: reg => fill(reg, "#c0502a", "#d9622f", [["strip", Math.round(reg.r * reg.r * .05), 1, 3.4]], { extra: spots(reg, Math.round(reg.r * reg.r * .04), 4).map(([x, y]) => PC.strip(x, y, 1, R() > .5 ? "#f2b81c" : "#4c9a3f")).join("") }),
    cucumber: reg => fill(reg, "#bfe08f", "#d4ecaa", [["cucumber", Math.round(reg.r * reg.r * .07), 1, 6.2]]),
    tomato: reg => fill(reg, "#d6372a", "#ef5240", [["cherry", Math.round(reg.r * reg.r * .07), 1, 6]]),
    zucchini: reg => fill(reg, "#7ea547", "#9ec064", [["zucchini", Math.round(reg.r * reg.r * .08), 1, 6.4]]),
    mushrooms: reg => fill(reg, "#c9ad8a", "#ddc6a5", [["mushroom", Math.round(reg.r * reg.r * .07), 1, 5.6]]),
    berries: reg => fill(reg, "#3c2f6e", "#5b4c98", [["blueberry", Math.round(reg.r * reg.r * .12), 1, 3.6], ["raspberry", Math.round(reg.r * reg.r * .05), 1, 4.4]]),
    blueberries: reg => fill(reg, "#2f2b61", "#4a4590", [["blueberry", Math.round(reg.r * reg.r * .2), 1, 3.4]]),
    banana: reg => fill(reg, "#efd890", "#f8e7ad", [["banana", Math.round(reg.r * reg.r * .07), 1, 5.6]]),
    apple: reg => fill(reg, "#efe0a8", "#f8edc4", [["appleCube", Math.round(reg.r * reg.r * .12), 1, 4.2]]),
    potatoes: reg => fill(reg, "#d9b05c", "#efcf82", [["potato", Math.round(reg.r * reg.r * .035), 1, 8.5]]),
    sweetPotato: reg => fill(reg, "#c95e24", "#e3793a", [["sweetWedge", Math.round(reg.r * reg.r * .045), 1, 7]]),
    greenBeans: reg => fill(reg, "#2f7a2b", "#4c9a3f", [["greenBean", Math.round(reg.r * reg.r * .07), 1, 3.4]]),
    chicken: reg => fill(reg, "#c98a44", "#e2ab66", [["chickenSlice", Math.round(reg.r * reg.r * .05), 1, 6]]),
    chickenCubes: reg => fill(reg, "#c98a44", "#e2ab66", [["chickenCube", Math.round(reg.r * reg.r * .1), 1, 4.8]]),
    tofu: reg => fill(reg, "#d9a24f", "#ecc070", [["tofu", Math.round(reg.r * reg.r * .07), 1, 5.6]]),
    salmonCubes: reg => fill(reg, "#e8723b", "#f59160", [["salmonCube", Math.round(reg.r * reg.r * .09), 1, 5]]),
    mince: reg => fill(reg, "#7a3f26", "#93533a", [["mince", Math.round(reg.r * reg.r * .45), 1.2, 1.6]]),
    shrimp: reg => fill(reg, "#e46d43", "#f39062", [["shrimp", Math.round(reg.r * reg.r * .05), 1, 7]]),
    cottage: reg => fill(reg, "#f6f2e8", "#ffffff", [["cottage", Math.round(reg.r * reg.r * .5), 1, 1.9]]),
    scramble: reg => fill(reg, "#f2c845", "#fbe17c", [["scramble", Math.round(reg.r * reg.r * .09), 1, 4.4], ["herb", 3, .8, 4]]),
    pasta: reg => fill(reg, "#e7b04a", "#f6cd70", [["pasta", Math.round(reg.r * reg.r * .1), 1.2, 5]]),
    spaghetti: reg => {
      let x = ""; for (let i = 0; i < Math.round(reg.r * 2.2); i++) {
        const rad0 = reg.r * rr(.25, .95), a0 = rr(0, Math.PI * 2), sw = rr(1.4, 3.2), cx = reg.cx + rr(-2, 2), cy = reg.cy + rr(-2, 2);
        const x0 = cx + Math.cos(a0) * rad0, y0 = cy + Math.sin(a0) * rad0 * .92, x1 = cx + Math.cos(a0 + sw) * rad0, y1 = cy + Math.sin(a0 + sw) * rad0 * .92;
        const d = `M${P(x0, y0)}A${r2(rad0)} ${r2(rad0 * .92)} 0 ${sw > Math.PI ? 1 : 0} 1 ${P(x1, y1)}`;
        x += `<path d="${d}" stroke="#c9902e" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/><path d="${d}" stroke="${R() > .5 ? "#f6d27a" : "#efc25a"}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
      }
      return fill(reg, "#e2ac45", "#f3c968", [], { extra: x });
    },
    smoothie: (reg, col = "#7d3f8f") => fill(reg, col, tone(col, .25), [])
  };

  /* ---------- Geschirr und Untergrund ---------- */
  const TABLES = { haupt: ["#8a6446", "#7f5b3f"], frueh: ["#dcc19b", "#d2b58d"], snack: ["#5f6468", "#585d61"], dessert: ["#e4cfc6", "#dcc4ba"] };
  const table = type => {
    const [a, b] = TABLES[type] || TABLES.haupt;
    let g = `<rect width="160" height="100" fill="${a}"/>`;
    const n = 5, h = 100 / n;
    for (let i = 0; i < n; i++) {
      const y = i * h, c = i % 2 ? b : a;
      g += `<rect x="0" y="${r2(y)}" width="160" height="${r2(h)}" fill="${lin([[0, tone(c, .04)], [.5, c], [1, tone(c, -.04)]], 1, 0)}"/>`;
      for (let k = 0; k < 7; k++) { const yy = y + 2 + k * (h - 4) / 6 + rr(-.8, .8); g += `<path d="M0 ${r2(yy)}C40 ${r2(yy + rr(-1.5, 1.5))} 90 ${r2(yy + rr(-1.5, 1.5))} 160 ${r2(yy + rr(-1, 1))}" stroke="${tone(c, -.12)}" stroke-width="${r2(rr(.2, .5))}" fill="none" opacity=".55"/>`; }
      if (R() > .4) { const kx = rr(10, 150), ky = y + rr(5, h - 5); g += `<ellipse cx="${r2(kx)}" cy="${r2(ky)}" rx="${r2(rr(2, 3.6))}" ry="${r2(rr(.9, 1.4))}" fill="none" stroke="${tone(c, -.18)}" stroke-width=".5" opacity=".6"/><ellipse cx="${r2(kx)}" cy="${r2(ky)}" rx="1" ry=".5" fill="${tone(c, -.2)}" opacity=".6"/>`; }
      g += `<rect x="0" y="${r2(y + h - .5)}" width="160" height=".9" fill="${tone(c, -.25)}" opacity=".7"/><rect x="0" y="${r2(y + h + .4)}" width="160" height=".5" fill="#fff" opacity=".25"/>`;
    }
    g += `<rect width="160" height="100" fill="${speckDark()}" opacity=".35"/>`;
    g += `<rect width="160" height="100" fill="${rad(0, [[0, "#fff", .18], [.6, "#fff", 0], [1, "#000", .12]], .45, .4, .8)}"/>`;
    return g;
  };
  const napkin = (side = 1, col = "#ffffff", stripe = "#9fb7d0") => {
    const x = side > 0 ? 118 : 4, y = side > 0 ? 50 : 8;
    return `<g ${rot(x + 19, y + 22, side * 8)}><rect x="${x}" y="${y}" width="38" height="46" rx="2" fill="#2a1f14" opacity=".08" transform="translate(1.2 1.6)"/><rect x="${x}" y="${y}" width="38" height="46" rx="2" fill="${col}"/>` +
      `<rect x="${x}" y="${y + 6}" width="38" height="2.2" fill="${stripe}"/><rect x="${x}" y="${y + 38}" width="38" height="2.2" fill="${stripe}"/></g>`;
  };
  const fork = (x, y, a = 0) => `<g ${rot(x, y, a)} opacity=".95"><rect x="${x - 1.1}" y="${y - 2}" width="2.2" height="30" rx="1.1" fill="#c9ced6" transform="translate(.8 1)" opacity=".35"/><rect x="${x - 1.1}" y="${y + 8}" width="2.2" height="22" rx="1.1" fill="#aeb6c1"/><path d="M${x - 3} ${y - 4}V${y + 5}Q${x} ${y + 9} ${x + 3} ${y + 5}V${y - 4}" fill="none" stroke="#aeb6c1" stroke-width="1.1"/>${[-1, 1].map(d => `<line x1="${x + d}" y1="${y - 4}" x2="${x + d}" y2="${y + 4}" stroke="#aeb6c1" stroke-width=".8"/>`).join("")}</g>`;
  const spoon = (x, y, a = 0) => `<g ${rot(x, y, a)}><ellipse cx="${x}" cy="${y}" rx="4" ry="5.6" fill="#aeb6c1"/><ellipse cx="${x - .8}" cy="${y - 1}" rx="2.2" ry="3.4" fill="#d8dde3"/><rect x="${x - 1}" y="${y + 5}" width="2" height="22" rx="1" fill="#aeb6c1"/></g>`;
  const plate = (cx = 80, cy = 50, r = 42) => sh(cx + 2.4, cy + 3, r, r * .97, .32) +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${rad(0, [[0, "#ffffff"], [.72, "#f4f3f0"], [.93, "#e4e1db"], [1, "#cdc8bf"]], .42, .38, .72)}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r2(r * .975)}" fill="none" stroke="${lin([[0, "#fff", .95], [.5, "#fff", .2], [1, "#9a948a", .5]])}" stroke-width="${r2(r * .035)}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r2(r * .75)}" fill="${rad(0, [[0, "#ffffff"], [.8, "#f6f5f2"], [1, "#eceae5"]], .45, .42, .8)}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r2(r * .75)}" fill="none" stroke="${lin([[0, "#8a8378", .45], [.45, "#c9c4bb", .25], [1, "#fff", .9]])}" stroke-width="${r2(r * .03)}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r2(r * .73)}" fill="${lin([[0, "#6b6358", .1], [.35, "#6b6358", 0], [1, "#fff", 0]])}"/>` +
    `<path d="${`M${P(cx - r * .92, cy + r * .08)}A${r * .93} ${r * .93} 0 0 1 ${P(cx - r * .1, cy - r * .92)}`}" stroke="#fff" stroke-width="${r2(r * .05)}" fill="none" opacity=".75" stroke-linecap="round"/>` +
    `<path d="${`M${P(cx - r * .8, cy - r * .3)}A${r * .86} ${r * .86} 0 0 1 ${P(cx - r * .45, cy - r * .7)}`}" stroke="#fff" stroke-width="${r2(r * .025)}" fill="none" stroke-linecap="round"/>`;
  const bowl = (cx = 80, cy = 50, r = 42, glaze = "#3b6aa0") => sh(cx + 2.6, cy + 3.2, r, r * .97, .36) +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${rad(0, [[0, tone(glaze, .32)], [.55, glaze], [.9, tone(glaze, -.22)], [1, tone(glaze, -.38)]], .36, .32, .78)}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r2(r * .95)}" fill="none" stroke="${lin([[0, "#fff", .85], [.5, "#fff", .15], [1, "#000", .15]])}" stroke-width="${r2(r * .04)}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r2(r * .9)}" fill="${lin([[0, tone(glaze, -.42)], [.45, tone(glaze, -.18)], [1, tone(glaze, .22)]])}"/>` +
    `<path d="${`M${P(cx - r * .9, cy + r * .1)}A${r * .93} ${r * .93} 0 0 1 ${P(cx - r * .05, cy - r * .92)}`}" stroke="#fff" stroke-width="${r2(r * .045)}" fill="none" opacity=".55" stroke-linecap="round"/>`;
  /* Schatten der Schüsselwand auf dem Essen (oben links), wirkt wie echte Tiefe */
  const bowlAO = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r2(r + .2)}" fill="${rad(0, [[0, "#000", 0], [.7, "#000", 0], [.9, "#1a1008", .18], [1, "#1a1008", .42]], .58, .6, .62)}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r2(r + .2)}" fill="none" stroke="#1a1008" stroke-opacity=".25" stroke-width=".6"/>`;
  const bowlInner = (cx = 80, cy = 50, r = 42) => circle(cx, cy, r * .84);
  const pan = (cx = 78, cy = 50, r = 40) => sh(cx + 2.6, cy + 3.2, r, r * .97, .4) +
    `<g ${rot(cx, cy, 25)}><rect x="${cx + r - 2}" y="${cy - 3.4}" width="36" height="6.8" rx="3.4" fill="${lin([[0, "#4a4a50"], [.5, "#2b2b2e"], [1, "#151517"]], 0, 1)}"/><rect x="${cx + r + 20}" y="${cy - 1}" width="12" height="2" rx="1" fill="#6a6a70"/></g>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${rad(0, [[0, "#5c5c63"], [.8, "#2a2a2e"], [1, "#151517"]], .35, .3, .8)}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r2(r * .97)}" fill="none" stroke="${lin([[0, "#c9ccd2", .8], [.5, "#6a6a70", .3], [1, "#000", .4]])}" stroke-width="1.2"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r2(r * .88)}" fill="${rad(0, [[0, "#3a3a3f"], [1, "#1c1c1f"]], .4, .38, .8)}"/>`;
  const board = (x = 30, y = 14, w = 100, h = 72) => sh(x + w / 2 + 1.5, y + h / 2 + 2, w / 2, h / 2, .16) +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${lin([[0, "#d7a46a"], [1, "#b98149"]])}"/>` +
    Array.from({ length: 16 }, (_, i) => `<path d="M${x + 2} ${r2(y + 3 + i * (h - 6) / 15)}C${r2(x + w * .3)} ${r2(y + 3 + i * (h - 6) / 15 + rr(-1.6, 1.6))} ${r2(x + w * .7)} ${r2(y + 3 + i * (h - 6) / 15 + rr(-1.6, 1.6))} ${x + w - 2} ${r2(y + 3 + i * (h - 6) / 15)}" stroke="#9a6431" stroke-width="${r2(rr(.2, .55))}" fill="none" opacity=".5"/>`).join("") +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${speckDark()}" opacity=".4"/><rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="6" fill="none" stroke="#e6b884" stroke-width=".8" opacity=".7"/>` +
    `<circle cx="${x + w - 7}" cy="${y + 7}" r="2.4" fill="${tone("#b98149", -.25)}"/>`;
  const dish = (x = 32, y = 16, w = 96, h = 68, col = "#f2efe9") => sh(x + w / 2 + 1.5, y + h / 2 + 2.4, w / 2 + 4, h / 2, .2) +
    `<rect x="${x - 7}" y="${y + h / 2 - 7}" width="${w + 14}" height="14" rx="6" fill="${tone(col, -.08)}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${col}"/><rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="6" fill="${tone(col, -.06)}"/>`;
  const glass = (cx, top, bottom, w, layers, o = {}) => {
    const x0 = cx - w / 2, h = bottom - top;
    let g = sh(cx + 1, bottom + 1, w * .62, 2.6, .2) + `<g ${clip(`M${x0} ${top}H${x0 + w}L${x0 + w - 3} ${bottom}H${x0 + 3}Z`)}>`;
    let y = bottom;
    for (const [col, frac, extra] of layers) { const hh = h * frac; g += `<rect x="${x0}" y="${r2(y - hh)}" width="${w}" height="${r2(hh + .5)}" fill="${col}"/>`; if (extra) g += extra(x0, y - hh, w, hh); y -= hh; }
    g += `</g><path d="M${x0} ${top}H${x0 + w}L${x0 + w - 3} ${bottom}H${x0 + 3}Z" fill="#fff" opacity=".12" stroke="#c9d4de" stroke-width="1"/><rect x="${x0 + 2.4}" y="${top + 4}" width="2.4" height="${h - 10}" rx="1.2" fill="#fff" opacity=".55"/><ellipse cx="${cx}" cy="${top}" rx="${w / 2}" ry="2" fill="#fff" opacity=".35" stroke="#c9d4de" stroke-width=".6"/>`;
    if (o.straw) g += `<path d="M${cx + 2} ${top + 10}L${cx + 10} ${top - 14}" stroke="${o.straw}" stroke-width="2.6" stroke-linecap="round"/>`;
    return g;
  };

  /* ---------- Größere Einzelteile ---------- */
  const BIG = {
    salmon: (x, y, s = 1, a = -12, glaze) => `<g ${rot(x, y, a)}>${sh(x, y + 1, 15.5 * s, 7.5 * s, .16)}<path d="M${P(x - 15 * s, y - 6 * s)}Q${P(x, y - 9 * s)} ${P(x + 15 * s, y - 5 * s)}Q${P(x + 17 * s, y)} ${P(x + 14 * s, y + 6 * s)}Q${P(x, y + 8.5 * s)} ${P(x - 14 * s, y + 6 * s)}Q${P(x - 17 * s, y)} ${P(x - 15 * s, y - 6 * s)}Z" fill="${glaze ? "#b4521d" : "#e8743c"}"/>` +
      `<path d="M${P(x - 13 * s, y - 4.5 * s)}Q${P(x, y - 7 * s)} ${P(x + 13 * s, y - 3.8 * s)}Q${P(x + 14 * s, y)} ${P(x + 12 * s, y + 4.5 * s)}Q${P(x, y + 6.5 * s)} ${P(x - 12 * s, y + 4.5 * s)}Q${P(x - 14.5 * s, y)} ${P(x - 13 * s, y - 4.5 * s)}Z" fill="${glaze ? "#cf6a2a" : "#f6904f"}"/>` +
      [-9, -4, 1, 6, 11].map(d => `<path d="M${P(x + d * s, y - 6 * s)}Q${P(x + (d + 3) * s, y)} ${P(x + (d + 1) * s, y + 6 * s)}" stroke="${glaze ? "#e99a5c" : "#fde0cb"}" stroke-width="${r2(.9 * s)}" fill="none"/>`).join("") +
      (glaze ? `<path d="M${P(x - 10 * s, y - 2 * s)}Q${P(x, y - 4 * s)} ${P(x + 10 * s, y - 2 * s)}" stroke="#fff" stroke-width="1.2" opacity=".45" fill="none"/>` : `<path d="M${P(x - 12 * s, y - 3.5 * s)}Q${P(x - 4 * s, y - 6 * s)} ${P(x + 6 * s, y - 5 * s)}" stroke="#fff" stroke-width="1" opacity=".4" fill="none"/>`) + `</g>`,
    fishFillet: (x, y, s = 1, a = -8) => `<g ${rot(x, y, a)}>${sh(x, y + 1, 16 * s, 6.5 * s, .16)}<path d="M${P(x - 16 * s, y - 4 * s)}Q${P(x - 4 * s, y - 9 * s)} ${P(x + 14 * s, y - 5 * s)}Q${P(x + 18 * s, y)} ${P(x + 13 * s, y + 5 * s)}Q${P(x - 4 * s, y + 8 * s)} ${P(x - 16 * s, y + 3 * s)}Z" fill="#d7a259"/><path d="M${P(x - 14 * s, y - 3 * s)}Q${P(x - 4 * s, y - 7 * s)} ${P(x + 12 * s, y - 3.8 * s)}Q${P(x + 15 * s, y)} ${P(x + 11 * s, y + 3.8 * s)}Q${P(x - 4 * s, y + 6 * s)} ${P(x - 14 * s, y + 2 * s)}Z" fill="#f2d9a8"/>` + [-8, -2, 4, 9].map(d => `<path d="M${P(x + d * s, y - 5 * s)}Q${P(x + (d + 2) * s, y)} ${P(x + d * s, y + 4 * s)}" stroke="#e4c08a" stroke-width=".8" fill="none"/>`).join("") + `</g>`,
    steak: (x, y, s = 1) => {
      const body = `M${P(x - 16 * s, y - 6 * s)}C${P(x - 14 * s, y - 13 * s)} ${P(x + 4 * s, y - 14 * s)} ${P(x + 12 * s, y - 9 * s)}C${P(x + 17 * s, y - 5 * s)} ${P(x + 14 * s, y + 6 * s)} ${P(x + 6 * s, y + 10 * s)}C${P(x - 4 * s, y + 14 * s)} ${P(x - 18 * s, y + 6 * s)} ${P(x - 16 * s, y - 6 * s)}Z`;
      let g = `<path d="${body}" fill="#3b2a1a" opacity=".16" transform="translate(1 1.6)"/><path d="${body}" fill="${rad(0, [[0, "#9a5530"], [.7, "#6e3418"], [1, "#4a2210"]])}"/>`;
      g += `<g ${clip(body)}>` + [-12, -5, 2, 9, 16].map(d => `<path d="M${P(x + d * s - 8 * s, y + 12 * s)}L${P(x + d * s + 6 * s, y - 14 * s)}" stroke="#2e1408" stroke-width="${r2(1.6 * s)}" opacity=".75"/>`).join("") +
        `<path d="M${P(x - 12 * s, y - 7 * s)}Q${P(x - 2 * s, y - 12 * s)} ${P(x + 8 * s, y - 8 * s)}" stroke="#c98a5a" stroke-width="${r2(1.2 * s)}" fill="none" opacity=".5"/></g>`;
      /* zwei Scheiben vorne, rosa Kern */
      for (let i = 0; i < 3; i++) {
        const X = x - 4 * s + i * 7 * s, Y = y + 16 * s;
        g += `<g ${rot(X, Y, 70)}><rect x="${r2(X - 8 * s)}" y="${r2(Y - 3 * s)}" width="${r2(16 * s)}" height="${r2(6 * s)}" rx="${r2(2 * s)}" fill="#4a2210"/><rect x="${r2(X - 6.8 * s)}" y="${r2(Y - 2 * s)}" width="${r2(13.6 * s)}" height="${r2(4 * s)}" rx="${r2(1.6 * s)}" fill="${rad(0, [[0, "#f19b98"], [.6, "#d3555a"], [1, "#a93a3f"]], .5, .5, .7)}"/></g>`;
      }
      return g + [[-8, -4], [2, -2], [8, 2]].map(([a, b]) => `<circle cx="${r2(x + a * s)}" cy="${r2(y + b * s)}" r=".7" fill="#fff" opacity=".85"/><circle cx="${r2(x + a * s + 1.6)}" cy="${r2(y + b * s + .8)}" r=".5" fill="#111" opacity=".6"/>`).join("");
    },
    chickenBreast: (x, y, s = 1, a = 0) => { let g = sh(x, y + 1, 16 * s, 8 * s, .2); for (let i = 0; i < 5; i++) g += PC.chickenSlice(x - 10 * s + i * 5 * s, y + (i % 2 ? .8 : -.4), 1.05 * s, 80 + a); return g; },
    toast: (x, y, s = 1, a = 0, seeds = true) => sh(x, y + 1, 13 * s, 12 * s, .22) + `<g ${rot(x, y, a)}><path d="M${P(x - 12 * s, y + 11 * s)}V${r2(y - 5 * s)}C${P(x - 14 * s, y - 14 * s)} ${P(x - 3 * s, y - 15 * s)} ${P(x, y - 11 * s)}C${P(x + 3 * s, y - 15 * s)} ${P(x + 14 * s, y - 14 * s)} ${P(x + 12 * s, y - 5 * s)}V${r2(y + 11 * s)}Z" fill="#9b5f2c"/>` +
      `<path d="M${P(x - 10 * s, y + 9.4 * s)}V${r2(y - 4.6 * s)}C${P(x - 11.6 * s, y - 12 * s)} ${P(x - 2.6 * s, y - 12.6 * s)} ${P(x, y - 9.2 * s)}C${P(x + 2.6 * s, y - 12.6 * s)} ${P(x + 11.6 * s, y - 12 * s)} ${P(x + 10 * s, y - 4.6 * s)}V${r2(y + 9.4 * s)}Z" fill="#d8a364"/>` +
      `<path d="M${P(x - 10 * s, y + 9.4 * s)}V${r2(y - 4.6 * s)}C${P(x - 11.6 * s, y - 12 * s)} ${P(x - 2.6 * s, y - 12.6 * s)} ${P(x, y - 9.2 * s)}C${P(x + 2.6 * s, y - 12.6 * s)} ${P(x + 11.6 * s, y - 12 * s)} ${P(x + 10 * s, y - 4.6 * s)}V${r2(y + 9.4 * s)}Z" fill="${pores()}"/>` +
      (seeds ? Array.from({ length: 14 }, () => { const X = x + rr(-8, 8) * s, Y = y + rr(-8, 8) * s; return `<ellipse cx="${r2(X)}" cy="${r2(Y)}" rx="${r2(.7 * s)}" ry="${r2(.35 * s)}" fill="${R() > .5 ? "#7a4a1e" : "#efd7a6"}" ${rot(X, Y, rr(0, 180))}/>`; }).join("") : "") + `</g>`,
    wrap: (x, y, s = 1, a = 20, filling = ["#7cbf47", "#e8743c", "#f6f2e8", "#e3342a"]) => { let g = sh(x, y + 1, 16 * s, 7 * s, .2) + `<g ${rot(x, y, a)}><rect x="${r2(x - 16 * s)}" y="${r2(y - 6.5 * s)}" width="${r2(26 * s)}" height="${r2(13 * s)}" rx="${r2(5 * s)}" fill="#ecd3a2"/>` + [-10, -4, 2].map(d => `<path d="M${P(x + d * s, y - 6 * s)}Q${P(x + (d + 2) * s, y)} ${P(x + d * s, y + 6 * s)}" stroke="#d9b77c" stroke-width=".6" fill="none"/>`).join("") + `<circle cx="${r2(x - 12 * s)}" cy="${r2(y - 2 * s)}" r=".6" fill="#b88a4a"/><circle cx="${r2(x - 6 * s)}" cy="${r2(y + 3 * s)}" r=".6" fill="#b88a4a"/>`;
      g += `<ellipse cx="${r2(x + 10 * s)}" cy="${r2(y)}" rx="${r2(6 * s)}" ry="${r2(6.5 * s)}" fill="#ecd3a2"/>`; filling.forEach((c, i) => { g += `<ellipse cx="${r2(x + 10 * s + (i - 1.5) * .6 * s)}" cy="${r2(y + (i - 1.5) * 1.6 * s)}" rx="${r2(4 * s)}" ry="${r2(1.5 * s)}" fill="${c}"/>`; }); return g + `<ellipse cx="${r2(x + 10 * s)}" cy="${r2(y)}" rx="${r2(6 * s)}" ry="${r2(6.5 * s)}" fill="none" stroke="#d9b77c" stroke-width="1.2"/></g>`; },
    pancakes: (x, y, s = 1) => { let g = ""; for (let i = 3; i >= 0; i--) g += sh(x + i * .4, y + i * .6 + 1, 17 * s, 16 * s, .12) + `<circle cx="${r2(x + i * .4)}" cy="${r2(y + i * .6)}" r="${r2(16 * s)}" fill="${i ? "#b9732f" : rad(0, [[0, "#e7b06a"], [.8, "#cf8d43"], [1, "#a8662a"]])}"/>`; return g + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(15 * s)}" fill="${bubbles()}"/><path d="M${P(x - 8 * s, y - 4 * s)}Q${P(x - 2 * s, y + 6 * s)} ${P(x + 9 * s, y + 2 * s)}Q${P(x + 4 * s, y - 8 * s)} ${P(x - 8 * s, y - 4 * s)}Z" fill="#c8812e" opacity=".55"/><path d="M${P(x - 6 * s, y - 2 * s)}Q${P(x, y + 4 * s)} ${P(x + 6 * s, y)}" stroke="#fff" stroke-width=".9" opacity=".4" fill="none"/>`; },
    waffle: (x, y, s = 1, a = 0) => { let g = sh(x, y + 1, 14 * s, 14 * s, .2) + `<g ${rot(x, y, a)}><rect x="${r2(x - 13 * s)}" y="${r2(y - 13 * s)}" width="${r2(26 * s)}" height="${r2(26 * s)}" rx="${r2(4 * s)}" fill="#c98a3f"/>`; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) g += `<rect x="${r2(x - 11 * s + i * 5.6 * s)}" y="${r2(y - 11 * s + j * 5.6 * s)}" width="${r2(4.4 * s)}" height="${r2(4.4 * s)}" rx="${r2(.8 * s)}" fill="#a96a28"/><rect x="${r2(x - 11 * s + i * 5.6 * s)}" y="${r2(y - 11 * s + j * 5.6 * s)}" width="${r2(4.4 * s)}" height="${r2(1.2 * s)}" rx=".4" fill="#8a5420"/>`; return g + `</g>`; },
    brownie: (x, y, s = 1, a = 0) => sh(x, y + 1, 9 * s, 8 * s, .22) + `<g ${rot(x, y, a)}><rect x="${r2(x - 9 * s)}" y="${r2(y - 9 * s)}" width="${r2(18 * s)}" height="${r2(18 * s)}" rx="${r2(2 * s)}" fill="#3b2016"/><rect x="${r2(x - 8 * s)}" y="${r2(y - 8 * s)}" width="${r2(16 * s)}" height="${r2(16 * s)}" rx="${r2(1.6 * s)}" fill="#55301f"/><path d="M${P(x - 6 * s, y - 2 * s)}L${P(x - 1 * s, y - 4 * s)}L${P(x + 3 * s, y + 1 * s)}L${P(x + 6 * s, y - 1 * s)}" stroke="#7a4a32" stroke-width="${r2(.8 * s)}" fill="none"/>` + Array.from({ length: 4 }, () => PC.choc(x + rr(-6, 6) * s, y + rr(-6, 6) * s, 1.2 * s)).join("") + `</g>`,
    muffin: (x, y, s = 1) => sh(x, y + 1, 9 * s, 8 * s, .22) + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(10 * s)}" fill="#f1f1ee" stroke="#d6d9de" stroke-width=".8" stroke-dasharray="1.6 1"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(8.4 * s)}" fill="${rad(0, [[0, "#ecc078"], [.8, "#cf8f43"], [1, "#a8662a"]])}"/>` + Array.from({ length: 4 }, () => PC.blueberry(x + rr(-4.5, 4.5) * s, y + rr(-4.5, 4.5) * s, .8 * s)).join(""),
    cheesecake: (x, y, s = 1, a = 0) => `<g ${rot(x, y, a)}><path d="M${P(x - 15 * s, y + 9.5 * s)}L${P(x + 15 * s, y - 8.5 * s)}A${r2(30 * s)} ${r2(30 * s)} 0 0 1 ${P(x + 19 * s, y + 9.5 * s)}Z" fill="#3b2a1a" opacity=".14"/><path d="M${P(x - 16 * s, y + 8 * s)}L${P(x + 14 * s, y - 10 * s)}A${r2(30 * s)} ${r2(30 * s)} 0 0 1 ${P(x + 18 * s, y + 8 * s)}Z" fill="#c98a3f"/><path d="M${P(x - 13 * s, y + 6.5 * s)}L${P(x + 13.6 * s, y - 8 * s)}A${r2(28 * s)} ${r2(28 * s)} 0 0 1 ${P(x + 15.8 * s, y + 6.5 * s)}Z" fill="#fbf0d2"/><path d="M${P(x + 13.6 * s, y - 8 * s)}A${r2(28 * s)} ${r2(28 * s)} 0 0 1 ${P(x + 15.8 * s, y + 6.5 * s)}" stroke="#e7c27c" stroke-width="${r2(2 * s)}" fill="none"/></g>`,
    pizza: (x, y, r = 34) => { let g = sh(x, y + 1, r, r * .95, .22) + `<circle cx="${x}" cy="${y}" r="${r}" fill="#d9a35b"/><circle cx="${x}" cy="${y}" r="${r * .88}" fill="#c4442c"/>`; const reg = circle(x, y, r * .84); for (const [X, Y] of spots(reg, 14, 7)) g += `<circle cx="${r2(X)}" cy="${r2(Y)}" r="${r2(rr(3, 4.6))}" fill="#fff6dc" opacity=".95"/>`; return g; },
    burger: (x, y, s = 1) => sh(x, y + 1, 22 * s, 20 * s, .24) + `<path d="M${P(x - 23 * s, y)}Q${P(x - 21 * s, y + 6 * s)} ${P(x - 14 * s, y + 10 * s)}" stroke="#7cbf47" stroke-width="${r2(4 * s)}" fill="none" stroke-linecap="round"/><circle cx="${r2(x + 16 * s)}" cy="${r2(y + 12 * s)}" r="${r2(6 * s)}" fill="#e3342a"/>` +
      `<circle cx="${x}" cy="${y}" r="${r2(21 * s)}" fill="${rad(0, [[0, "#f0b768"], [.7, "#d18a3c"], [1, "#a8662a"]])}"/>` + Array.from({ length: 22 }, () => { const a = rr(0, Math.PI * 2), d = Math.sqrt(R()) * 15 * s, X = x + Math.cos(a) * d, Y = y + Math.sin(a) * d; return `<ellipse cx="${r2(X)}" cy="${r2(Y)}" rx=".9" ry=".45" fill="#fbf1d6" ${rot(X, Y, rr(0, 180))}/>`; }).join("") + `<ellipse cx="${r2(x - 6 * s)}" cy="${r2(y - 7 * s)}" rx="${r2(7 * s)}" ry="${r2(3.5 * s)}" fill="#fff" opacity=".22"/>`,
    pepperHalf: (x, y, s = 1, a = 0, fillCol = "#8a3a24") => sh(x, y + 1, 11 * s, 8 * s, .22) + `<g ${rot(x, y, a)}><path d="M${P(x - 12 * s, y)}C${P(x - 12 * s, y - 9 * s)} ${P(x + 10 * s, y - 10 * s)} ${P(x + 12 * s, y - 2 * s)}C${P(x + 13 * s, y + 6 * s)} ${P(x - 10 * s, y + 10 * s)} ${P(x - 12 * s, y)}Z" fill="#d9302a"/>` +
      `<path d="M${P(x - 9.5 * s, y)}C${P(x - 9.5 * s, y - 6.8 * s)} ${P(x + 8 * s, y - 7.8 * s)} ${P(x + 9.6 * s, y - 1.6 * s)}C${P(x + 10.4 * s, y + 4.6 * s)} ${P(x - 8 * s, y + 7.6 * s)} ${P(x - 9.5 * s, y)}Z" fill="${fillCol}"/>` +
      Array.from({ length: 8 }, () => `<circle cx="${r2(x + rr(-6, 6) * s)}" cy="${r2(y + rr(-4, 4) * s)}" r="${r2(rr(1.4, 2.4) * s)}" fill="#fff4d6"/>`).join("") + `<rect x="${r2(x + 11 * s)}" y="${r2(y - 3 * s)}" width="${r2(4 * s)}" height="${r2(2.4 * s)}" rx="1" fill="#3f8f3a"/></g>`,
    lasagne: (x, y, w = 80, h = 56) => { const reg = rect(x - w / 2 + 4, y - h / 2 + 4, w - 8, h - 8, 5); let g = `<path d="${reg.d}" fill="${rad(0, [[0, "#f1c46b"], [.75, "#dba24c"], [1, "#b3712c"]])}"/>`; const c = clip(reg.d); g += `<g ${c}>`; for (const [X, Y] of spots(reg, 26, 7)) g += `<circle cx="${r2(X)}" cy="${r2(Y)}" r="${r2(rr(2, 3.6))}" fill="${R() > .45 ? "#b4511f" : "#f8dc8e"}" opacity=".8"/>`; for (const [X, Y] of spots(reg, 10, 10)) g += PC.herb(X, Y, 1); return g + `<path d="M${x - w / 2 + 8} ${y + h / 2 - 8}Q${x} ${y + h / 2 - 2} ${x + w / 2 - 8} ${y + h / 2 - 9}" stroke="#c63a22" stroke-width="2.4" fill="none" opacity=".7"/></g>`; },
    riceCake: (x, y, s = 1) => sh(x, y + 1, 10 * s, 9 * s, .2) + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(10 * s)}" fill="#f2e4c4"/>` + Array.from({ length: 26 }, () => { const a = rr(0, Math.PI * 2), d = Math.sqrt(R()) * 8.4 * s; return `<ellipse cx="${r2(x + Math.cos(a) * d)}" cy="${r2(y + Math.sin(a) * d)}" rx="1.1" ry=".7" fill="#fbf3dc" stroke="#e2cfa3" stroke-width=".2"/>`; }).join(""),
    bar: (x, y, s = 1, a = 0) => sh(x, y + 1, 15 * s, 5 * s, .22) + `<g ${rot(x, y, a)}><rect x="${r2(x - 15 * s)}" y="${r2(y - 5 * s)}" width="${r2(30 * s)}" height="${r2(10 * s)}" rx="${r2(2.4 * s)}" fill="#b98149"/>` + Array.from({ length: 16 }, () => PC.oat(x + rr(-13, 13) * s, y + rr(-3.5, 3.5) * s, .8 * s)).join("") + `<path d="M${P(x - 13 * s, y - 2 * s)}L${P(x - 9 * s, y + 2 * s)}L${P(x - 5 * s, y - 2 * s)}L${P(x - 1 * s, y + 2 * s)}L${P(x + 3 * s, y - 2 * s)}L${P(x + 7 * s, y + 2 * s)}L${P(x + 11 * s, y - 2 * s)}" stroke="#3e2416" stroke-width="${r2(1.2 * s)}" fill="none" stroke-linecap="round"/></g>`,
    roll: (x, y, s = 1, a = 0) => sh(x, y + 1, 13 * s, 5 * s, .2) + `<g ${rot(x, y, a)}><rect x="${r2(x - 12 * s)}" y="${r2(y - 4.5 * s)}" width="${r2(22 * s)}" height="${r2(9 * s)}" rx="${r2(4.5 * s)}" fill="#f2b3a6"/><path d="M${P(x - 9 * s, y - 4 * s)}Q${P(x - 7 * s, y)} ${P(x - 9 * s, y + 4 * s)}M${P(x - 2 * s, y - 4.4 * s)}Q${P(x, y)} ${P(x - 2 * s, y + 4.4 * s)}" stroke="#e48f86" stroke-width=".7" fill="none"/><ellipse cx="${r2(x + 10 * s)}" cy="${r2(y)}" rx="${r2(3.6 * s)}" ry="${r2(4.4 * s)}" fill="#f2b3a6"/><ellipse cx="${r2(x + 10 * s)}" cy="${r2(y)}" rx="${r2(2.4 * s)}" ry="${r2(3.2 * s)}" fill="#fbfaf6"/><ellipse cx="${r2(x + 10 * s)}" cy="${r2(y)}" rx="${r2(1 * s)}" ry="${r2(1.6 * s)}" fill="#7cbf47"/></g>`,
    bananaBread: (x, y, s = 1) => sh(x, y + 1, 22 * s, 11 * s, .22) + `<rect x="${r2(x - 22 * s)}" y="${r2(y - 11 * s)}" width="${r2(44 * s)}" height="${r2(22 * s)}" rx="${r2(6 * s)}" fill="#8e5424"/><rect x="${r2(x - 20 * s)}" y="${r2(y - 9 * s)}" width="${r2(40 * s)}" height="${r2(18 * s)}" rx="${r2(5 * s)}" fill="${rad(0, [[0, "#d39a52"], [1, "#a8662a"]])}"/><path d="M${P(x - 14 * s, y)}Q${P(x, y - 3 * s)} ${P(x + 14 * s, y)}" stroke="#7a4a1e" stroke-width="${r2(1.6 * s)}" fill="none"/><g ${rot(x, y, -6)}><ellipse cx="${x}" cy="${r2(y - .6 * s)}" rx="${r2(13 * s)}" ry="${r2(3 * s)}" fill="#f2df9c"/><ellipse cx="${x}" cy="${r2(y - .6 * s)}" rx="${r2(10 * s)}" ry="${r2(1.4 * s)}" fill="#e9c97a"/></g>`
  };

  /* ---------- Bausteine für ganze Bilder ---------- */
  const bowlSectors = (secs, o = {}) => {
    const cx = 80, cy = 50, R0 = 42; let g = bowl(cx, cy, R0, o.glaze || "#3b6aa0");
    const inner = bowlInner(cx, cy, R0);
    g += `<circle cx="${cx}" cy="${cy}" r="${inner.r}" fill="#f4efe2"/>`;
    const tot = secs.reduce((a, s) => a + (s[1] || 1), 0); let a = o.start ?? -90;
    for (const [tex, w = 1] of secs) { const a1 = a + 360 * w / tot; g += T[tex](sector(cx, cy, inner.r, a, a1, .6)); a = a1; }
    if (o.top) g += o.top(cx, cy, inner.r);
    return g + bowlAO(cx, cy, inner.r);
  };
  const bowlFull = (tex, o = {}) => {
    const cx = o.cx ?? 80, cy = o.cy ?? 50, R0 = o.r ?? 42; let g = bowl(cx, cy, R0, o.glaze || "#e9e4dc");
    const inner = bowlInner(cx, cy, R0);
    g += typeof tex === "function" ? tex(inner) : T[tex](inner);
    if (o.top) g += o.top(cx, cy, inner.r, inner);
    return g + bowlAO(cx, cy, inner.r);
  };
  const panFull = (tex, o = {}) => { let g = pan(78, 50, 40); const inner = circle(78, 50, 35); g += typeof tex === "function" ? tex(inner) : T[tex](inner); if (o.top) g += o.top(78, 50, 35, inner); return g + bowlAO(78, 50, 35); };
  /* Teller mit Zonen: [Textur, cx, cy, rx, ry] oder Funktionen */
  const plateZones = (zones, o = {}) => {
    let g = plate(80, 50, 43);
    for (const z of zones) g += typeof z === "function" ? z() : T[z[0]](blob(z[1], z[2], z[3], z[4] ?? z[3], .1));
    return g;
  };
  const sprinkle = (reg, fn, n, s = 1, md = 3) => spots(reg, n, md).map(([x, y]) => PC[fn](x, y, s)).join("");
  const rows = (inner, list) => {        /* Smoothie-Bowl-Reihen */
    let g = ""; const n = list.length, cx = inner.cx, cy = inner.cy, r = inner.r;
    list.forEach(([fn, s = 1], i) => {
      const y = cy - r * .78 + (i + .5) * (r * 1.56 / n), half = Math.sqrt(Math.max(0, r * r - (y - cy) ** 2)) * .86;
      const step = (PC[fn] && fn !== "oat") ? 5.4 * s : 2.6;
      for (let x = cx - half + step / 2; x < cx + half; x += step) g += PC[fn](x + rr(-.6, .6), y + rr(-1, 1), s);
    });
    return g;
  };
  const zoom = (k, svg, cx = 80, cy = 50) => `<g transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})">${svg}</g>`;
  const drizzle = (cx, cy, r, col, w = 1.6) => {
    const pts = [], n = 7;
    for (let i = 0; i <= n; i++) pts.push([cx - r * .62 + i * r * 1.24 / n + rr(-1, 1), cy + (i % 2 ? 1 : -1) * r * rr(.22, .34)]);
    let d = `M${P(...pts[0])}`;
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; d += `C${P(x0 + (x1 - x0) * .2, y0 + (y1 - y0) * .9)} ${P(x1 - (x1 - x0) * .2, y1 - (y1 - y0) * .1)} ${P(x1, y1)}`; }
    return `<g ${rot(cx, cy, -28)}><path d="${d}" stroke="${tone(col, -.25)}" stroke-width="${r2(w + .6)}" fill="none" stroke-linecap="round" opacity=".5"/><path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity=".88"/><path d="${d}" stroke="#fff" stroke-width="${r2(w * .3)}" fill="none" stroke-linecap="round" opacity=".45" transform="translate(-.3 -.4)"/></g>`;
  };
  const drizzleOld = (cx, cy, r, col, w = 1.6) => `<path d="M${P(cx - r * .6, cy - r * .3)}q${r2(r * .2)} ${r2(r * .5)} ${r2(r * .4)} 0t${r2(r * .4)} 0t${r2(r * .4)} 0M${P(cx - r * .5, cy + r * .2)}q${r2(r * .2)} ${r2(r * .4)} ${r2(r * .4)} 0t${r2(r * .5)} 0" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity=".9"/>`;
  const lemon = (x, y, a = 0) => sh(x, y, 5, 3, .15) + `<g ${rot(x, y, a)}><path d="M${x - 6} ${y}A6 6 0 0 0 ${x + 6} ${y}Z" fill="#f2c916"/><path d="M${x - 5} ${y}A5 5 0 0 0 ${x + 5} ${y}Z" fill="#fbe77a"/>${[-2.5, 0, 2.5].map(d => `<line x1="${x}" y1="${y}" x2="${x + d * 1.6}" y2="${y + 4.2}" stroke="#f2c916" stroke-width=".5"/>`).join("")}</g>`;
  const dip = (x, y, r = 11, col = "#fbfaf6", herbs = true) => sh(x, y + 1, r + 2, r, .2) + `<circle cx="${x}" cy="${y}" r="${r + 2}" fill="#e9e4dc"/><circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>` + (herbs ? sprinkle(circle(x, y, r - 2), "herb", 7, .8, 2.4) : "") + `<path d="M${x - r * .5} ${y - r * .2}q${r * .25} ${-r * .3} ${r * .5} 0t${r * .5} 0" stroke="${tone(col, -.08)}" fill="none"/>`;
  const smallBowl = (x, y, r, tex, glaze = "#e9e4dc") => sh(x, y + 1, r, r * .95, .2) + `<circle cx="${x}" cy="${y}" r="${r}" fill="${glaze}"/>` + T[tex](circle(x, y, r * .82));

  /* ---------- Die Rezepte ---------- */
  const D = {
    bolo: () => plate() + T.spaghetti(blob(80, 50, 30, 28, .06)) + T.bolognese(blob(80, 47, 18, 16, .14)) + sprinkle(circle(80, 47, 13), "parmesan", 7, 1.2, 4) + sprinkle(circle(80, 47, 14), "herb", 7, 1.2, 4) + fork(132, 56, 18),
    bowl: () => bowlSectors([["rice", 1.4], ["chicken", 1.1], ["broccoli", 1], ["pepper", .8]], { glaze: "#3b6aa0", top: (x, y, r) => sprinkle(circle(x, y, r * .9), "sesame", 26, 1, 2.5) }),
    chili: () => bowlFull("chili", { glaze: "#2f3b4a", top: (x, y) => `<path d="M${x - 9} ${y - 4}q4 -6 9 -2t9 1q-2 7 -9 6t-9 -5Z" fill="#fbfaf6"/>` + sprinkle(circle(x, y - 2, 8), "herb", 6, 1.1, 2.5) }),
    lachs: () => plateZones([["potatoes", 101, 34, 15, 12], ["broccoli", 101, 66, 15, 12], () => BIG.salmon(64, 50, 1.25, -72), () => lemon(70, 79, -20)]) + fork(132, 56, 18),
    blech: () => `<rect x="24" y="12" width="112" height="76" rx="5" fill="#3d4048"/><rect x="24" y="12" width="112" height="76" rx="5" fill="none" stroke="#2a2c31" stroke-width="2"/><rect x="28" y="16" width="104" height="68" rx="3" fill="#e9e1d2"/>` + (() => { const reg = rect(30, 18, 100, 64, 3); return T.sweetPotato(reg).replace(/fill="url\(#r\d+\)"/, 'fill="#e9e1d2"') + [[48, 34, 20], [76, 62, -15], [104, 32, 10], [108, 64, -25], [62, 50, 40]].map(([x, y, a]) => BIG.chickenBreast(x, y, .7, a)).join("") + sprinkle(reg, "strip", 12, 1.1, 7) + sprinkle(reg, "onion", 10, 1.2, 6) + sprinkle(reg, "herb", 22, 1.1, 3); })(),
    garnelen: () => panFull(inner => T.zucchini(inner) + sprinkle(inner, "shrimp", 9, 1.05, 9) + sprinkle(inner, "cherry", 6, 1, 8) + sprinkle(inner, "herb", 12, 1, 3)) + smallBowl(32, 22, 13, "rice"),
    curry: () => bowlFull("curry", { glaze: "#2c6e6a", top: (x, y, r) => T.rice(blob(x + 12, y - 10, 13, 11, .12)) + `<path d="M${x - 16} ${y + 10}q5 -5 10 0t10 0" stroke="#fbfaf6" stroke-width="3" fill="none" stroke-linecap="round"/>` + sprinkle(circle(x - 8, y + 8, 10), "herb", 8, 1.3, 2.4) }),
    thunsalat: () => bowlSectors([["lettuceBed", 1], ["beans", 1], ["corn", .8], ["cucumber", 1], ["tomato", 1]], { glaze: "#e9e4dc", start: -60, top: (x, y) => `<circle cx="${x}" cy="${y}" r="9.5" fill="#d9b9a0"/>` + sprinkle(circle(x, y, 8.5), "mince", 14, 1.2, 2).replace(/#6e3a24|#874a2e/g, "#c9a587") + sprinkle(circle(x, y, 13), "onion", 5, 1, 4) }),
    wrap: () => board() + zoom(1.35, BIG.wrap(70, 42, 1.1, 18) + BIG.wrap(94, 60, 1.1, 198)) + sprinkle(circle(122, 24, 5), "cherry", 2, 1.2, 6) + PC.cucumber(40, 76, 1.4),
    quarkbowl: () => bowlFull("yogurt", { glaze: "#e8d9c6", top: (x, y, r, inner) => rows(inner, [["oat", 1.4], ["blueberry", 1.4], ["raspberry", 1.35], ["blueberry", 1.4], ["oat", 1.4]]) + drizzle(x, y, r * .7, "#d9921c", 1) }),
    oats: () => bowlFull("porridge", { glaze: "#7da0c4", top: (x, y, r, inner) => sprinkle(circle(x + 4, y - 4, r * .6), "banana", 7, 1.6, 8.5) + sprinkle(circle(x - 10, y + 10, 8), "oat", 8, 1.4, 2.6) }),
    omelett: () => plate() + zoom(1.25, `<path d="M51 48A26 18 0 0 0 103 48Z" fill="#3b2a1a" opacity=".12" transform="rotate(-12 77 48)"/>` + `<path d="M50 46A26 18 0 0 0 102 46Z" fill="#f2bd38" transform="rotate(-12 76 46)"/><path d="M52 45A24 15 0 0 0 100 45Z" fill="#f8d55a" transform="rotate(-12 76 46)"/><path d="M50 46H102" stroke="#e8a822" stroke-width="1.6" transform="rotate(-12 76 46)"/>` + sprinkle(blob(76, 52, 18, 8), "spinach", 4, .8, 6) + sprinkle(blob(76, 52, 18, 8), "cherry", 3, .8, 8), 76, 44) + BIG.toast(104, 70, .75, 18) + fork(132, 56, 18),
    pancakes: () => plate() + BIG.pancakes(79, 49, 1.55) + sprinkle(circle(79, 46, 16), "blueberry", 10, 1.6, 6) + sprinkle(circle(79, 46, 16), "raspberry", 6, 1.5, 7) + sprinkle(circle(79, 48, 9), "banana", 3, 1.6, 7.5) + fork(132, 56, 18),
    shake: () => board(36, 12, 88, 76) + glass(80, 20, 82, 26, [["#f4e7b8", 1]], { straw: "#7ec4a4" }) + PC.banana(110, 72, 1.6) + PC.banana(116, 66, 1.4),
    skyrapfel: () => bowlFull("yogurt", { glaze: "#c9d7e4", top: (x, y, r) => sprinkle(circle(x - 4, y + 2, r * .7), "appleCube", 12, 1.5, 6.4) + drizzle(x, y, r * .85, "#b9782f", 1.8) }) + PC.appleSlice(132, 74, 2),
    huettenbrot: () => board() + zoom(1.4, [[62, 50, -8], [98, 50, 10]].map(([x, y, a]) => BIG.toast(x, y, 1, a) + sprinkle(blob(x, y + 1, 9, 8), "cottage", 18, 1, 2) + sprinkle(blob(x, y + 2, 8, 7), "cucumber", 2, .75, 6) + sprinkle(blob(x, y, 8, 7), "tomatoSlice", 1, .7, 6) + sprinkle(blob(x, y, 9, 8), "herb", 5, .8, 2)).join("")),
    geschnetzelt: () => plateZones([["rice", 102, 50, 16, 20], () => T.mushrooms(blob(68, 48, 22, 20)).replace(/fill="url\(#r\d+\)"/, 'fill="#e9dcc4"') + sprinkle(blob(68, 48, 19, 17), "chickenSlice", 5, .8, 8) + sprinkle(blob(68, 48, 19, 17), "herb", 10, 1, 3)]) + fork(132, 56, 18),
    lasagne: () => dish(36, 18, 88, 64, "#f2efe9") + BIG.lasagne(80, 50, 80, 56),
    burrito: () => bowlSectors([["rice", 1.2], ["chicken", 1], ["beans", .8], ["corn", .8], ["pepperMix", .8], ["tomato", .8]], { glaze: "#c9572f", top: (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="#fbfaf6"/>` + sprinkle(circle(x, y, 6), "herb", 4, 1, 2.4) }),
    teriyaki: () => plateZones([["rice", 101, 34, 15, 12], ["broccoli", 101, 66, 15, 12], () => BIG.salmon(64, 50, 1.25, -72, true) + sprinkle(blob(64, 50, 9, 18), "sesame", 18, 1.2, 2)]) + fork(132, 56, 18),
    steak: () => plateZones([["sweetPotato", 106, 36, 14, 12], ["greenBeans", 104, 66, 15, 11], () => BIG.steak(64, 44, 1.15)]) + fork(132, 56, 18),
    paprikafuell: () => dish(34, 18, 92, 64, "#f2efe9") + `<rect x="40" y="24" width="80" height="52" rx="5" fill="#c63a22"/>` + BIG.pepperHalf(62, 40, 1, -10) + BIG.pepperHalf(98, 60, 1, 170) + BIG.pepperHalf(62, 64, .9, 10) + BIG.pepperHalf(98, 36, .9, 190),
    pizza: () => board(26, 8, 108, 84) + BIG.pizza(80, 50, 36) + sprinkle(circle(80, 50, 28), "chickenCube", 7, .9, 9) + sprinkle(circle(80, 50, 29), "strip", 7, .8, 8) + sprinkle(circle(80, 50, 29), "mushroom", 5, .75, 9) + sprinkle(circle(80, 50, 29), "herb", 14, 1.1, 4),
    burger: () => board() + BIG.burger(80, 50, 1.4) + PC.cucumber(124, 76, 1.4) + PC.cucumber(118, 82, 1.4),
    onepot: () => panFull(inner => T.pasta(inner) + sprinkle(inner, "chickenCube", 8, 1, 8) + sprinkle(inner, "zucchini", 5, .9, 9) + sprinkle(inner, "cherry", 5, 1, 8) + sprinkle(inner, "spinach", 6, .9, 6) + sprinkle(inner, "parmesan", 8, 1, 4)),
    seelachs: () => plateZones([["potatoes", 101, 34, 15, 12], ["peas", 101, 66, 14, 11], () => BIG.fishFillet(64, 50, 1.2, -72) + lemon(70, 79, -20) + sprinkle(blob(64, 50, 9, 16), "herb", 10, 1.1, 2.6)]) + fork(132, 56, 18),
    shakshuka: () => panFull(inner => T.tomatoSauce(inner) + sprinkle(inner, "strip", 8, .9, 8) + [[66, 40], [90, 42], [72, 62], [94, 62]].map(([x, y]) => PC.egg(x, y, 1.15)).join("") + sprinkle(inner, "herb", 18, 1.2, 3)) + BIG.toast(28, 76, .55, -20),
    dal: () => bowlFull("dal", { glaze: "#e9e4dc", top: (x, y) => T.rice(blob(x + 12, y - 10, 13, 11, .12)) + `<path d="M${x - 16} ${y + 10}q5 -5 10 0t10 0" stroke="#fbfaf6" stroke-width="3" fill="none" stroke-linecap="round"/>` + sprinkle(circle(x - 8, y + 6, 10), "herb", 9, 1.3, 2.4) }),
    tofu: () => bowlSectors([["rice", 1.2], ["tofu", 1.1], ["broccoli", 1], ["pepper", .8]], { glaze: "#2f3b4a", top: (x, y, r) => sprinkle(circle(x, y, r * .9), "sesame", 26, 1, 2.5) }),
    thunpasta: () => plate() + T.pasta(blob(80, 50, 30, 28, .08)) + T.tomatoSauce(blob(80, 48, 15, 13, .14)) + sprinkle(circle(80, 48, 12), "mince", 18, 1.4, 2.2).replace(/#6e3a24|#874a2e/g, "#c9a587") + sprinkle(circle(80, 48, 16), "parmesan", 6, 1, 4) + sprinkle(circle(80, 48, 16), "herb", 6, 1, 4) + fork(132, 56, 18),
    caesar: () => bowlFull("lettuceBed", { glaze: "#e9e4dc", top: (x, y, r, inner) => sprinkle(circle(x, y, r * .62), "chickenSlice", 5, 1.25, 10) + sprinkle(circle(x, y, r * .85), "crouton", 8, 1.3, 7) + sprinkle(circle(x, y, r * .85), "parmesan", 10, 1.3, 4) + spots(circle(x, y, r * .8), 9, 6).map(([a, b]) => `<ellipse cx="${r2(a)}" cy="${r2(b)}" rx="2" ry="1.4" fill="#fbf3dc" opacity=".95"/>`).join("") }),
    poke: () => bowlSectors([["rice", 1.2], ["salmonCubes", 1.1], ["edamame", .9], ["cucumber", .9], ["corn", .8]], { glaze: "#2f3b4a", top: (x, y, r) => sprinkle(circle(x, y, r * .9), "sesame", 30, 1, 2.4) }),
    ruehrei: () => plate() + zoom(1.3, BIG.toast(70, 50, 1.1, -10) + T.scramble(blob(70, 50, 11, 9)) + sprinkle(blob(70, 50, 10, 8), "spinach", 3, .7, 7), 70, 50) + sprinkle(circle(108, 50, 9), "cherry", 4, 1.2, 7) + fork(132, 56, 18),
    brownie: () => board() + zoom(1.4, BIG.brownie(68, 44, 1.2, -6) + BIG.brownie(92, 56, 1.2, 8) + sprinkle(circle(112, 34, 6), "raspberry", 3, 1, 5) + sprinkle(circle(50, 66, 5), "choc", 4, 1.3, 3.4)),
    cheesecake: () => plate() + BIG.cheesecake(74, 54, 1.75, -10) + sprinkle(circle(84, 50, 12), "blueberry", 7, 1.3, 5) + sprinkle(circle(86, 52, 12), "raspberry", 4, 1.3, 6) + fork(132, 56, 18),
    nicecream: () => bowlFull(inner => `<circle cx="${inner.cx}" cy="${inner.cy}" r="${inner.r}" fill="#efe8de"/>` + [[-9, -6, "#b04a8a"], [9, -5, "#f3e3b0"], [0, 9, "#8e3f8f"]].map(([dx, dy, c]) => sh(inner.cx + dx, inner.cy + dy, 11, 9) + `<circle cx="${inner.cx + dx}" cy="${inner.cy + dy}" r="11" fill="${rad(0, [[0, tone(c, .3)], [.8, c], [1, tone(c, -.2)]])}"/><path d="M${inner.cx + dx - 6} ${inner.cy + dy}q3 -4 6 0t6 0" stroke="${tone(c, -.15)}" fill="none"/>`).join("") + sprinkle(circle(inner.cx, inner.cy, inner.r * .9), "blueberry", 5, 1, 7), { glaze: "#c9d7e4" }),
    bananenbrot: () => board() + BIG.bananaBread(80, 50, 1.55) + PC.banana(122, 78, 2) + PC.banana(114, 82, 1.8),
    schokocreme: () => board(36, 12, 88, 76) + glass(80, 18, 82, 30, [["#5a3420", .3], ["#f8f4ec", .1], ["#6b3f26", .25], ["#f8f4ec", .1], ["#6b3f26", .2]]) + sprinkle(circle(80, 16, 10), "raspberry", 3, 1.1, 5) + PC.raspberry(110, 76, 1.4) + PC.blueberry(116, 70, 1.4),
    crumble: () => dish(34, 18, 92, 64, "#e9e2d6") + `<rect x="40" y="24" width="80" height="52" rx="5" fill="#c58a4a"/>` + sprinkle(rect(40, 24, 80, 52), "oat", 70, 1.5, 3).replace(/#e9d3a4/g, "#d9a85e") + sprinkle(rect(42, 26, 76, 48), "appleCube", 8, 1, 10) + dip(124, 78, 9, "#fbfaf6", false),
    muffins: () => board() + [[58, 32], [100, 32], [62, 68], [102, 68]].map(([x, y]) => BIG.muffin(x, y, 1.6)).join(""),
    bark: () => board() + zoom(1.35, [[58, 38, -12], [92, 32, 8], [64, 64, 10], [100, 62, -6]].map(([x, y, a]) => { const d = `M${x - 14} ${y - 8}L${x + 10} ${y - 11}L${x + 15} ${y + 6}L${x - 4} ${y + 11}L${x - 13} ${y + 4}Z`; return sh(x, y + 1, 14, 10, .2) + `<path d="${d}" fill="#fbfaf6" stroke="#ebe4d8" stroke-width=".8" ${rot(x, y, a)}/>` + sprinkle(blob(x, y, 9, 6), "blueberry", 3, .8, 5) + sprinkle(blob(x, y, 9, 6), "raspberry", 2, .8, 6) + `<path d="M${x - 9} ${y - 3}l5 6l4 -7l5 6" stroke="#3e2416" stroke-width="1.1" fill="none" ${rot(x, y, a)}/>`; }).join("")),
    porridge: () => bowlFull("porridge", { glaze: "#c9572f", top: (x, y, r) => sprinkle(circle(x + 2, y - 2, r * .6), "appleCube", 10, 1.5, 6.4) + `<g opacity=".55">${sprinkle(circle(x, y, r * .8), "mince", 16, .5, 3)}</g>` + drizzle(x, y, r * .75, "#e9a521", 1.2) }),
    skyrbowl: () => bowlFull("yogurt", { glaze: "#2f3b4a", top: (x, y, r, inner) => rows(inner, [["banana", 1.5], ["oat", 1.3], ["banana", 1.5]]) + drizzle(x, y, r * .85, "#b9782f", 1.8) }),
    waffeln: () => plate() + zoom(1.3, BIG.waffle(70, 46, 1, -8) + BIG.waffle(92, 58, .9, 12) + sprinkle(circle(84, 46, 12), "blueberry", 5, 1, 5) + sprinkle(circle(78, 56, 12), "raspberry", 3, 1, 6), 80, 52) + fork(134, 56, 18),
    lachsbrot: () => board() + zoom(1.4, [[62, 50, -8], [98, 50, 10]].map(([x, y, a]) => BIG.toast(x, y, 1, a) + sprinkle(blob(x, y + 1, 9, 8), "cottage", 16, 1, 2) + `<path d="M${x - 8} ${y - 2}q4 -6 8 -1t8 -1q-1 6 -8 7t-8 -5Z" fill="#f08a52"/><path d="M${x - 6} ${y - 2}q3 2 6 0t6 0" stroke="#fcd6bf" stroke-width=".7" fill="none"/>` + sprinkle(blob(x, y + 5, 8, 4), "cucumber", 2, .7, 6) + sprinkle(blob(x, y, 9, 8), "herb", 6, .8, 2)).join("")),
    fruehburrito: () => board() + zoom(1.35, BIG.wrap(70, 42, 1.1, 18, ["#f8d55a", "#2f6e2a", "#e3342a", "#f6f2e8"]) + BIG.wrap(94, 60, 1.1, 198, ["#f8d55a", "#2f6e2a", "#e3342a", "#f6f2e8"])) + sprinkle(circle(122, 24, 5), "cherry", 2, 1.2, 6),
    eiermuffins: () => board() + [[58, 32], [100, 32], [62, 68], [102, 68]].map(([x, y]) => zoom(1.55, sh(x, y + 1, 9, 8, .2) + `<circle cx="${x}" cy="${y}" r="10" fill="#f1f1ee" stroke="#d6d9de" stroke-width=".8" stroke-dasharray="1.6 1"/><circle cx="${x}" cy="${y}" r="8.4" fill="${rad(0, [[0, "#fbe08a"], [.8, "#e9b84a"], [1, "#c98a2a"]])}"/>` + sprinkle(circle(x, y, 6.5), "cubeRed", 4, 1, 3) + sprinkle(circle(x, y, 6.5), "herb", 4, 1, 2.5), x, y)).join(""),
    bircher: () => bowlFull("porridge", { glaze: "#7da0c4", top: (x, y, r, inner) => `<g opacity=".9">${sprinkle(circle(x, y, r * .8), "appleCube", 8, .8, 6)}</g>` + sprinkle(circle(x + 6, y - 8, 9), "blueberry", 6, 1, 4) + sprinkle(circle(x - 8, y + 6, 8), "raspberry", 3, 1, 5) }),
    frenchtoast: () => plate() + zoom(1.3, BIG.toast(68, 46, 1, -14, false).replace(/#d8a364/g, "#e2a24f").replace(/#9b5f2c/g, "#9a5420") + BIG.toast(92, 58, 1, 12, false).replace(/#d8a364/g, "#e2a24f").replace(/#9b5f2c/g, "#9a5420") + `<path d="M84 44q6 -4 10 0t8 2" stroke="#fbfaf6" stroke-width="3.4" fill="none" stroke-linecap="round"/>` + sprinkle(circle(80, 52, 14), "blueberry", 6, 1, 5) + sprinkle(circle(80, 52, 14), "strawberry", 3, .7, 7), 80, 52) + fork(134, 56, 18),
    smoothiebowl: () => bowlFull(inner => T.smoothie(inner, "#7d3f8f"), { glaze: "#e9e4dc", top: (x, y, r, inner) => rows(inner, [["banana", 1], ["blueberry", 1.05], ["oat", 1], ["raspberry", 1]]) }),
    spiegelei: () => plate() + zoom(1.25, BIG.toast(72, 52, 1.15, -6) + PC.egg(68, 46, 1.25) + PC.egg(78, 58, 1.15), 72, 52) + sprinkle(circle(110, 44, 8), "cherry", 3, 1.2, 7) + sprinkle(circle(108, 64, 7), "spinach", 4, .9, 5) + fork(134, 56, 18),
    huettenbowl: () => bowlFull("cottage", { glaze: "#c9d7e4", top: (x, y, r, inner) => sprinkle(circle(x + 4, y - 4, r * .6), "blueberry", 12, 1.4, 5.2) + sprinkle(circle(x - 6, y + 4, r * .5), "raspberry", 5, 1.3, 6.4) + sprinkle(circle(x - 10, y - 10, 8), "oat", 8, 1.4, 2.8) + drizzle(x, y, r * .75, "#e9a521", 1.2) }),
    riegel: () => board() + zoom(1.4, BIG.bar(80, 38, 1.1, -6) + BIG.bar(82, 62, 1.1, 4)),
    gemuesesticks: () => board() + zoom(1.3, dip(62, 50, 13) + [["#2f7d32", "#cde9a6"], ["#d9302a", "#f0503f"], ["#f2b81c", "#f8d24a"]].map(([a, b], j) => [0, 1, 2].map(i => { const x = 84 + i * 4 + j * 1.5, y = 32 + j * 12; return sh(x + 6, y + 2, 14, 2.4, .16) + `<rect x="${x}" y="${y}" width="30" height="5" rx="2.4" fill="${a}" ${rot(x + 15, y + 2.5, -8 + i * 6)}/><rect x="${x + 1}" y="${y + 1}" width="28" height="2.6" rx="1.3" fill="${b}" ${rot(x + 15, y + 2.5, -8 + i * 6)}/>`; }).join("")).join("")),
    eiergurke: () => plate() + [[62, 40], [76, 36], [66, 58], [80, 56]].map(([x, y]) => PC.eggHalf(x, y, 1.6)).join("") + sprinkle(blob(104, 50, 13, 18), "cucumber", 7, 1.2, 9) + sprinkle(circle(88, 72, 5), "cherry", 2, 1, 6) + sprinkle(circle(70, 48, 18), "sesame", 10, .8, 3).replace(/#fbf3dc/g, "#2b2b2b"),
    putenroellchen: () => board() + zoom(1.25, [[64, 36, -8], [70, 50, 4], [64, 64, -4], [100, 42, 12], [98, 60, -10]].map(([x, y, a]) => BIG.roll(x, y, 1.05, a)).join("")) + PC.cucumber(124, 78, 1.4),
    edamame: () => bowlFull(inner => `<circle cx="${inner.cx}" cy="${inner.cy}" r="${inner.r}" fill="#4f8f2c"/>` + sprinkle(inner, "edamame", 13, 2.3, 9) + sprinkle(inner, "sesame", 22, 1.6, 3).replace(/#2b2b2b/g, "#ffffff"), { glaze: "#2f3b4a" }),
    thunhaeppchen: () => board() + zoom(1.2, [[56, 34], [80, 32], [104, 34], [62, 62], [86, 62], [108, 60]].map(([x, y]) => PC.cucumber(x, y, 2.4) + `<circle cx="${x}" cy="${y - .5}" r="5.4" fill="#e3cbb4"/>` + sprinkle(circle(x, y - .5, 4.6), "mince", 8, .9, 1.6).replace(/#6e3a24|#874a2e/g, "#c9a587") + PC.cherry(x + 1.5, y - 2, .5) + PC.herb(x - 2, y - 2, .9)).join("")),
    apfelpb: () => board() + zoom(1.2, dip(62, 50, 13, "#d9a35b", false) + `<path d="M56 46q3 -3 6 0t6 0M54 53q4 -3 8 0t8 0" stroke="#9b5a24" stroke-width="1.2" fill="none" stroke-linecap="round"/>` + [[96, 30, 20], [104, 44, 60], [98, 60, 100], [110, 70, 130], [92, 74, 160]].map(([x, y, a]) => `<g ${rot(x, y, a)}>${PC.appleSlice(x, y, 2.2)}</g>`).join("")),
    beerenshake: () => board(36, 12, 88, 76) + glass(80, 20, 82, 26, [["#c4466f", 1]], { straw: "#f2b6c6" }) + PC.raspberry(110, 72, 1.6) + PC.blueberry(116, 66, 1.6) + PC.blueberry(108, 62, 1.4),
    reiswaffeln: () => board() + zoom(1.35, [[62, 40], [98, 40], [80, 64]].map(([x, y]) => BIG.riceCake(x, y, 1.25) + sprinkle(circle(x, y, 9), "cottage", 16, 1, 2) + PC.tomatoSlice(x - 2, y - 1, .9) + PC.cucumber(x + 4, y + 3, .8) + PC.herb(x - 4, y + 4, .9)).join("")),
    kichererbsen: () => bowlFull(inner => T.chickpeas(inner).replace(/#e2b25e/g, "#c9782f").replace(/#f3d39a/g, "#e8a35a") + sprinkle(inner, "herb", 10, 1.2, 3), { glaze: "#2f3b4a" }),
  };

  const shadeAll = svg => {
    const made = {};
    return svg.replace(/(<(?:path|circle|ellipse|rect)\b[^>]*?)fill="(#[0-9a-f]{6})"/g, (m, pre, col) => {
      if (/stroke-dasharray|opacity="\.(0|1)/.test(pre)) return m;
      if (!made[col]) { made[col] = id("s"); defs += `<radialGradient id="${made[col]}" cx=".34" cy=".3" r=".9"><stop offset="0" stop-color="${tone(col, .2)}"/><stop offset=".55" stop-color="${col}"/><stop offset="1" stop-color="${tone(col, -.24)}"/></radialGradient>`; }
      return `${pre}fill="url(#${made[col]})"`;
    });
  };
  function art(r) {
    if (!D[r.id]) return "";
    R = rng("v4" + r.id); uid = 0; defs = ""; pats = {};
    const body = shadeAll(D[r.id]());
    const t = table(r.type);
    const extra = ["bowl", "chili", "burrito", "tofu", "poke", "dal", "curry"].includes(r.id) ? fork(136, 22, 30) : (r.type === "frueh" && !["shake"].includes(r.id) ? spoon(136, 26, 25) : "");
    const nap = ["lachs", "teriyaki", "steak", "seelachs", "bolo", "thunpasta", "geschnetzelt", "spiegelei", "ruehrei", "omelett", "pancakes", "waffeln", "frenchtoast", "cheesecake"].includes(r.id) ? napkin(1) : "";
    const grade = `<rect width="160" height="100" fill="${lin([[0, "#fff4e0", .16], [.45, "#fff", 0], [1, "#1a0e04", .2]])}"/>` +
      `<rect width="160" height="100" fill="${rad(0, [[0, "#000", 0], [.6, "#000", 0], [1, "#0d0703", .42]], .46, .44, .78)}"/><rect width="160" height="100" fill="#ff9a40" opacity=".035"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100" width="640" height="400"><defs>${defs}</defs>${t}${nap}${extra}${body}${grade}</svg>`;
  }
  /* ---------- Bilder für eigene Mahlzeiten (aus den Zutaten zusammengesetzt) ---------- */
  const MT = { rice: "rice", basmati: "rice", ricecup: "rice", quinoa: "quinoa", couscous: "quinoa", pasta: "pasta", fusilli: "pasta", gnocchi: "pasta", spaghetti: "spaghetti", noodles: "spaghetti",
    potato: "potatoes", potatoes: "potatoes", fries: "potatoes", sweetpotato: "sweetPotato",
    chicken: "chicken", turkey: "chicken", chickenslices: "chicken", schnitzel: "chicken", frozenchicken: "chickenCubes", fish: "chickenCubes", fishsticks: "chickenCubes",
    steak: "mince", mince: "mince", bratwurst: "mince", sausage: "mince", ham: "mince", bacon: "mince", salami: "mince", tuna: "mince",
    salmon: "salmonCubes", shrimp: "shrimp", tofu: "tofu", eggs: "scramble",
    broccoli: "broccoli", cauliflower: "broccoli", pepper: "pepper", pepperY: "pepperMix", pepperG: "pepperMix", frozenveg: "pepperMix", carrot: "pepperMix", eggplant: "pepperMix",
    peas: "peas", beans: "beans", chickpeas: "chickpeas", hummus: "chickpeas", lentils: "dal", corn: "corn",
    spinach: "spinachBed", rucola: "spinachBed", frozenspinach: "spinachBed", lettuce: "lettuceBed", zucchini: "zucchini", tomato: "tomato", cherrytomato: "tomato",
    cucumber: "cucumber", mushroom: "mushrooms", passata: "tomatoSauce", tomatocan: "tomatoSauce", tomatopaste: "tomatoSauce", avocado: "edamame",
    berries: "blueberries", raspberry: "berries", strawberry: "berries", frozenberries: "berries", banana: "banana", apple: "apple", greenapple: "apple", cottage: "cottage" };
  const SPOON_BASE = { quark: "#fbfaf6", skyr: "#f6f8fb", yogurt: "#fbfaf6", greek: "#fbf8f0", sourcream: "#fbfaf6", creamcheese: "#fbfaf6", pudding: "#9a6a48" };
  const TOP = { berries: "blueberry", frozenberries: "blueberry", raspberry: "raspberry", strawberry: "strawberry", banana: "banana", apple: "appleCube", greenapple: "appleCube",
    oats: "oat", granola: "oat", cereal: "oat", cornflakes: "oat", nuts: "crouton", chocolate: "choc", cherries: "cherry", mango: "appleCube", peach: "appleCube", kiwi: "cucumber" };
  const DRIZ = { honey: "#d9921c", pb: "#b9782f", nutella: "#5a3420", jam: "#a51c34" };
  const SHAKE = { protein: 1, proteinshake: 1, milk: 1, lfmilk: 1, oatmilk: 1, soymilk: 1, almondmilk: 1, kefir: 1, buttermilk: 1, juice: 1, water: 1 };
  const BREAD = { bread: 1, wholegrain: 1, toast: 1, rolls: 1, crispbread: 1, ricecakes: 1 };
  function mealBody(list) {
    const keys = list.map(i => i.k), has = k => keys.includes(k);
    const tops = list.filter(i => TOP[i.k]).map(i => TOP[i.k]), driz = list.find(i => DRIZ[i.k]);
    const base = list.find(i => SPOON_BASE[i.k]) || list.find(i => i.k === "cottage");
    const porr = list.find(i => ["oats", "granola", "cereal", "cornflakes"].includes(i.k));
    /* Shake: nur Flüssiges, Pulver und Obst */
    if (list.some(i => SHAKE[i.k]) && list.every(i => SHAKE[i.k] || TOP[i.k] || DRIZ[i.k] || i.k === "creatine")) {
      const fruit = list.find(i => ["berries", "raspberry", "strawberry", "frozenberries"].includes(i.k)), choc = has("chocolate") || has("nutella");
      const col = fruit ? "#c4466f" : choc ? "#8a5a3a" : has("banana") ? "#f4e7b8" : has("juice") ? "#f5a23a" : "#f2ead8";
      return { type: "frueh", body: board(36, 12, 88, 76) + glass(80, 20, 82, 26, [[col, 1]], { straw: "#7ec4a4" }) + (has("banana") ? PC.banana(110, 72, 1.6) + PC.banana(116, 66, 1.4) : "") + (fruit ? PC.raspberry(110, 72, 1.6) + PC.blueberry(116, 66, 1.6) : "") };
    }
    /* Löffel-Schüssel: Quark, Skyr, Joghurt, Haferflocken … mit Toppings */
    if (base || porr) {
      const tex = base ? (base.k === "cottage" ? inner => T.cottage(inner) : inner => T.yogurt(inner, SPOON_BASE[base.k])) : "porridge";
      const glaze = ["#c9d7e4", "#e8d9c6", "#7da0c4", "#2f3b4a", "#e9e4dc"][keys.join("").length % 5];
      const tl = [...new Set(tops)].slice(0, 4);
      return { type: "frueh", body: bowlFull(tex, { glaze, top: (x, y, r, inner) => (tl.length >= 2 ? rows(inner, tl.map(t => [t, t === "oat" ? 1.3 : 1.35])) : tl.length ? sprinkle(circle(x + 3, y - 3, r * .62), tl[0], 12, 1.4, 5.6) : "") +
        (base && porr ? sprinkle(circle(x - 8, y + 8, r * .45), "oat", 14, 1.3, 2.4) : "") + (driz ? drizzle(x, y, r * .8, DRIZ[driz.k], 1.6) : "") }) };
    }
    /* Brot / Toast mit Belag */
    if (list.some(i => BREAD[i.k])) {
      const top = (x, y) => (has("cottage") || has("creamcheese") || has("quark") ? sprinkle(blob(x, y + 1, 9, 8), "cottage", 16, 1, 2) : "") +
        (has("eggs") ? PC.egg(x, y, .9) : "") + (has("ham") || has("chickenslices") || has("salami") ? `<path d="M${x - 8} ${y - 3}q4 -6 8 -1t8 -1q-1 6 -8 7t-8 -5Z" fill="#f2a6a8"/>` : "") +
        (has("salmon") ? `<path d="M${x - 8} ${y - 2}q4 -6 8 -1t8 -1q-1 6 -8 7t-8 -5Z" fill="#f08a52"/>` : "") + (has("cheese") || has("slices") ? `<rect x="${x - 8}" y="${y - 7}" width="15" height="13" rx="1.5" fill="#f4c84a" ${rot(x, y, 8)}/>` : "") +
        (has("avocado") ? `<ellipse cx="${x}" cy="${y}" rx="8" ry="6" fill="#a8c25a"/>` : "") + (has("tomato") || has("cherrytomato") ? PC.tomatoSlice(x - 3, y - 2, .8) : "") + (has("cucumber") ? PC.cucumber(x + 4, y + 3, .8) : "") + PC.herb(x - 4, y + 4, .9);
      return { type: "frueh", body: board() + zoom(1.4, [[62, 50, -8], [98, 50, 10]].map(([x, y, a]) => BIG.toast(x, y, 1, a) + top(x, y)).join("")) };
    }
    /* Herzhaft: Teller oder Bowl aus den Zutaten */
    const secs = []; const seen = new Set();
    for (const i of list) { const t = MT[i.k]; if (t && !seen.has(t)) { seen.add(t); secs.push([t, Math.max(.7, Math.min(1.6, Math.sqrt(i.g / 120)))]); } }
    if (!secs.length) return null;
    const sauce = secs.find(x => x[0] === "tomatoSauce");
    if (sauce && secs.some(x => ["pasta", "spaghetti"].includes(x[0]))) {
      const pst = secs.find(x => ["pasta", "spaghetti"].includes(x[0]))[0], meat = secs.some(x => x[0] === "mince");
      return { type: "haupt", body: plate() + T[pst](blob(80, 50, 30, 28, .06)) + (meat ? T.bolognese(blob(80, 47, 18, 16, .14)) : T.tomatoSauce(blob(80, 48, 16, 14, .14))) + sprinkle(circle(80, 47, 14), "herb", 7, 1.2, 4) + fork(132, 56, 18) };
    }
    const use = secs.filter(x => x[0] !== "tomatoSauce").slice(0, 5);
    if (use.length <= 3) {
      const zones = use.length === 1 ? [[use[0][0], 80, 50, 26, 24]] : use.length === 2 ? [[use[0][0], 66, 50, 18, 22], [use[1][0], 98, 50, 16, 20]] : [[use[0][0], 64, 50, 18, 22], [use[1][0], 100, 35, 14, 12], [use[2][0], 100, 66, 14, 12]];
      return { type: "haupt", body: plateZones(zones) + fork(132, 56, 18) };
    }
    return { type: "haupt", body: bowlSectors(use, { glaze: ["#3b6aa0", "#2f3b4a", "#2c6e6a", "#c9572f"][use.length % 4], top: (x, y, r) => sprinkle(circle(x, y, r * .9), "sesame", 18, 1, 2.6) }) };
  }
  function meal(seed, list) {
    R = rng("m" + seed); uid = 0; defs = ""; pats = {};
    const m = mealBody(list.filter(i => i.k).sort((a, b) => b.g - a.g));
    if (!m) return "";
    const body = shadeAll(m.body), t = table(m.type);
    const grade = `<rect width="160" height="100" fill="${lin([[0, "#fff4e0", .16], [.45, "#fff", 0], [1, "#1a0e04", .2]])}"/>` +
      `<rect width="160" height="100" fill="${rad(0, [[0, "#000", 0], [.6, "#000", 0], [1, "#0d0703", .42]], .46, .44, .78)}"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100" width="640" height="400"><defs>${defs}</defs>${t}${body}${grade}</svg>`;
  }
  return { art, meal, ids: Object.keys(D) };
})();
function artURL(r) {
  if (!artCache.has(r.id)) {
    const svg = RA4.art(r) || recipeArt(r).replace("<svg ", '<svg width="640" height="480" ');
    artCache.set(r.id, "data:image/svg+xml;charset=utf-8," + svg.replace(/"/g, "'").replace(/[\r\n%#<>{}]/g, encodeURIComponent));
  }
  return artCache.get(r.id);
}
const recipeImg = r => `<img src="${recipePhotos[r.id] || artURL(r)}" alt="" loading="lazy">`;

