// theme.js 값을 CSS 변수로 바꾸고, Google Fonts를 불러와요. (보통 수정할 필요 없어요)
export function applyTheme(theme) {
  const root = document.documentElement;
  const { fonts, sizes, colors, layout } = theme;
  const fallback = `"${fonts.korean.family}", system-ui, -apple-system, "Apple SD Gothic Neo", sans-serif`;

  root.style.setProperty("--font-heading", `"${fonts.heading.family}", ${fallback}`);
  root.style.setProperty("--font-body", `"${fonts.body.family}", ${fallback}`);
  root.style.setProperty("--font-label", `"${fonts.label.family}", ${fallback}`);
  root.style.setProperty("--w-heading", fonts.heading.weight);
  root.style.setProperty("--w-body", fonts.body.weight);
  root.style.setProperty("--w-bold", fonts.body.boldWeight);
  root.style.setProperty("--w-label", fonts.label.weight);

  for (const [k, v] of Object.entries(sizes)) root.style.setProperty(`--size-${k}`, `${v}px`);
  for (const [k, v] of Object.entries(colors)) root.style.setProperty(`--c-${k}`, v);
  root.style.setProperty("--sidebar", `${layout.sidebarWidth}px`);
  root.style.setProperty("--gap", `${layout.gap}px`);
  root.style.setProperty("--max", `${layout.maxWidth}px`);
  root.style.setProperty("--pad", `${layout.sidePadding ?? 48}px`);

  // Collect the weights each family needs, then load one stylesheet per family
  const need = {};
  const add = (family, w) => {
    if (!family) return;
    (need[family] ||= new Set()).add(Number(w) || 400);
  };
  add(fonts.heading.family, fonts.heading.weight);
  add(fonts.body.family, fonts.body.weight);
  add(fonts.body.family, fonts.body.boldWeight);
  add(fonts.label.family, fonts.label.weight);
  add(fonts.korean.family, fonts.body.weight);
  add(fonts.korean.family, fonts.body.boldWeight);
  add(fonts.korean.family, fonts.heading.weight);

  for (const [family, weights] of Object.entries(need)) {
    const ws = [...weights].sort((a, b) => a - b).join(";");
    const href = `https://fonts.googleapis.com/css2?family=${family.trim().replace(/ /g, "+")}:wght@${ws}&display=swap`;
    if (document.querySelector(`link[href="${href}"]`)) continue;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
}
