/* Erscheinungsbild: Standard hell. "dark" = immer dunkel, "auto" = wie das Gerät */
function applyTheme(t) {
  const want = t === "dark" ? "all" : t === "auto" ? "(prefers-color-scheme: dark)" : "not all";
  for (const sh of document.styleSheets) {
    let rules; try { rules = sh.cssRules; } catch (e) { continue; }
    for (const r of rules) if (r.media && (r._dk || /prefers-color-scheme:\s*dark/.test(r.media.mediaText))) { r._dk = true; r.media.mediaText = want; }
  }
  const dark = t === "dark" || (t === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = dark ? "#0f1115" : "#ffffff";
}
try { applyTheme(localStorage.getItem("makro.theme") || "light"); } catch (e) { applyTheme("light"); }
