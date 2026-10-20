import React, { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
//  Portrait with a pastel pixel version revealed above a scan line.
//  - The line rests at the top. It moves only while you click (or touch)
//    and drag, and stays where you let go. Arrow keys move it too.
//  - Above the line, the photo becomes pastel cubes. Cubes twinkle,
//    and "neuron" cubes (pink) fire and pass signals to each other,
//    one cube at a time, like spikes travelling between cells.
//  - A click (or tap) without dragging starts a burst of signals there.
// ─────────────────────────────────────────────────────────────

const COLS = 24; // number of cubes across. Bigger = smaller cubes
const ROWS = 28;
const FOCUS_Y = 0.15; // 0 = crop from top of photo, 1 = from bottom
const N_NODES = 15;
const N_EXTRA_DOTS = 8; // extra pink squares shown on the photo

const PALETTE = {
  bg: ["#f6f2fd", "#efe8fb", "#e8def8", "#ded2f4", "#d4c6f1"],
  light: ["#e3f2cf", "#d6ecbc", "#c8e5a6"],
  mid: ["#bcdc93", "#b4a3ea", "#a9d07e"],
  dark: ["#9b86e0", "#8b74d8", "#7a63cd"],
  pink: "#f4a3c4",
  hot: "#ff6fae",
};

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function hexToRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// Average each cell of the photo and map it to a pastel colour
function buildGrid(img, crop) {
  const S = 8; // samples per cell side
  const c = document.createElement("canvas");
  c.width = COLS * S;
  c.height = ROWS * S;
  const x = c.getContext("2d", { willReadFrequently: true });
  x.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, c.width, c.height);
  const d = x.getImageData(0, 0, c.width, c.height).data;
  const r = rng(7);
  // coarse noise so the background forms soft patches instead of static
  const noise = Array.from({ length: 8 * 8 }, () => r());
  const patch = (col, row) => noise[Math.floor((row / ROWS) * 8) * 8 + Math.floor((col / COLS) * 8)];

  const grid = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      let R = 0, G = 0, B = 0;
      for (let yy = 0; yy < S; yy++) {
        for (let xx = 0; xx < S; xx++) {
          const i = ((row * S + yy) * c.width + col * S + xx) * 4;
          R += d[i]; G += d[i + 1]; B += d[i + 2];
        }
      }
      const n = S * S;
      R /= n; G /= n; B /= n;
      const L = (0.299 * R + 0.587 * G + 0.114 * B) / 255;
      const max = Math.max(R, G, B), min = Math.min(R, G, B);
      const sat = max === 0 ? 0 : (max - min) / max;
      const warm = R > B + 8;
      const jitter = r();
      let color;
      if (L > 0.9 && sat < 0.12) {
        const p = PALETTE.bg;
        color = p[Math.min(p.length - 1, Math.floor((patch(col, row) * 0.7 + jitter * 0.3) * p.length))];
      } else if (L > 0.66 && warm) {
        const p = PALETTE.light;
        color = p[L > 0.82 ? 0 : L > 0.74 ? 1 : 2];
      } else if (L > 0.42) {
        color = warm ? PALETTE.mid[jitter > 0.5 ? 0 : 2] : PALETTE.mid[1];
      } else {
        const p = PALETTE.dark;
        color = p[L > 0.28 ? 0 : L > 0.14 ? 1 : 2];
      }
      grid.push(hexToRgb(color));
    }
  }
  return grid;
}

function pickCells(count, minDist, seed) {
  const r = rng(seed);
  const out = [];
  let tries = 0;
  while (out.length < count && tries < 4000) {
    tries++;
    const c = Math.floor(r() * COLS), rr = Math.floor(r() * ROWS);
    if (out.every((p) => Math.abs(p.c - c) + Math.abs(p.r - rr) >= minDist)) out.push({ c, r: rr });
  }
  return out;
}

// A staircase path through the grid, one cube at a time
function gridPath(a, b) {
  const path = [{ c: a.c, r: a.r }];
  let c = a.c, r = a.r;
  while (c !== b.c || r !== b.r) {
    const dc = b.c - c, dr = b.r - r;
    const goCol = dr === 0 || (dc !== 0 && Math.random() < Math.abs(dc) / (Math.abs(dc) + Math.abs(dr)));
    if (goCol) c += Math.sign(dc);
    else r += Math.sign(dr);
    path.push({ c, r });
  }
  return path;
}

export default function PixelPortrait({ src, alt }) {
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const accent = hexToRgb(PALETTE.pink);
    const hot = hexToRgb(PALETTE.hot);
    const white = [255, 255, 255];

    const nodes = pickCells(N_NODES, 5, 2026).map((p) => ({ ...p, fireT: -1e9 }));
    const dots = [...nodes, ...pickCells(N_EXTRA_DOTS, 3, 1019)];
    nodes.forEach((n, i) => {
      n.near = nodes
        .map((m, j) => ({ j, d: Math.abs(m.c - n.c) + Math.abs(m.r - n.r) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 4)
        .map((o) => o.j);
    });

    const st = {
      img: null, crop: null, grid: null,
      line: 0, target: 0, dragging: false, moved: false,
      twinkles: [], signals: [], nextAmbient: 0, raf: 0, alive: true,
    };

    const img = new Image();
    img.onload = () => {
      if (!st.alive) return;
      const aspect = COLS / ROWS;
      const sw = img.naturalWidth;
      const sh = Math.min(img.naturalHeight, sw / aspect);
      st.crop = { sx: 0, sy: (img.naturalHeight - sh) * FOCUS_Y, sw, sh };
      st.img = img;
      st.grid = buildGrid(img, st.crop);
      resize();
      draw(performance.now());
      if (!reduce) st.raf = requestAnimationFrame(loop);
    };
    img.src = src;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    }
    const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
    ro.observe(canvas);

    // cell edges in canvas pixels (rounded so cubes never leave seams)
    const cx = (c) => Math.round((c * canvas.width) / COLS);
    const cy = (r) => Math.round((r * canvas.height) / ROWS);
    function fillCell(c, r, color, inset = 0) {
      const x0 = cx(c), x1 = cx(c + 1), y0 = cy(r), y1 = cy(r + 1);
      const ix = (x1 - x0) * inset, iy = (y1 - y0) * inset;
      ctx.fillStyle = color;
      ctx.fillRect(x0 + ix, y0 + iy, x1 - x0 - 2 * ix, y1 - y0 - 2 * iy);
    }

    function fire(i, t, spread) {
      const n = nodes[i];
      if (t - n.fireT < 500) return;
      n.fireT = t;
      if (spread <= 0) return;
      const targets = n.near.slice(0, 1 + Math.floor(Math.random() * 2));
      for (const j of targets) {
        st.signals.push({ path: gridPath(n, nodes[j]), t0: t + 120, to: j, spread: spread - 1 });
      }
    }

    function update(t) {
      // ambient activity
      if (t > st.nextAmbient) {
        fire(Math.floor(Math.random() * nodes.length), t, 2);
        st.nextAmbient = t + 1300 + Math.random() * 1400;
      }
      // twinkles
      if (Math.random() < 0.09) {
        st.twinkles.push({ c: Math.floor(Math.random() * COLS), r: Math.floor(Math.random() * ROWS), t0: t, dur: 500 + Math.random() * 600 });
      }
      st.twinkles = st.twinkles.filter((w) => t - w.t0 < w.dur);
      // signals arriving
      st.signals = st.signals.filter((s) => {
        const step = (t - s.t0) / 55;
        if (step >= s.path.length - 1) {
          fire(s.to, t, Math.random() < 0.7 ? s.spread : 0);
          return false;
        }
        return true;
      });
      // line easing
      const target = st.target;
      st.line += (target - st.line) * (reduce ? 1 : 0.35);
      if (Math.abs(target - st.line) < 0.0005) st.line = target;
    }

    function draw(t) {
      if (!st.img) return;
      const W = canvas.width, H = canvas.height;
      const ly = Math.round(st.line * H);
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(st.img, st.crop.sx, st.crop.sy, st.crop.sw, st.crop.sh, 0, 0, W, H);

      // pink squares on the photo (below the line)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, ly, W, H - ly);
      ctx.clip();
      for (const d of dots) {
        const node = nodes.find((n) => n.c === d.c && n.r === d.r);
        const k = node ? Math.max(0, 1 - (t - node.fireT) / 700) : 0;
        fillCell(d.c, d.r, rgb(mix(accent, hot, k), 0.6 + 0.4 * k), 0.12);
      }
      ctx.restore();

      if (ly <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, ly);
      ctx.clip();

      // base cubes
      for (let r = 0; r < ROWS; r++) {
        if (cy(r) >= ly) break;
        for (let c = 0; c < COLS; c++) fillCell(c, r, rgb(st.grid[r * COLS + c]));
      }
      // twinkles: cube lightens and a small white spark appears in its middle
      for (const w of st.twinkles) {
        const p = (t - w.t0) / w.dur;
        const k = Math.sin(Math.PI * p);
        fillCell(w.c, w.r, rgb(mix(st.grid[w.r * COLS + w.c], white, 0.55 * k)));
        fillCell(w.c, w.r, rgb(white, 0.95 * k), 0.36);
      }
      // signal trails, travelling one cube at a time
      for (const s of st.signals) {
        const step = Math.floor((t - s.t0) / 55);
        if (step < 0) continue;
        for (let k = 0; k < 6; k++) {
          const idx = step - k;
          if (idx < 0 || idx >= s.path.length) continue;
          const p = s.path[idx];
          const base = st.grid[p.r * COLS + p.c];
          const a = 1 - k / 6;
          fillCell(p.c, p.r, rgb(mix(base, k === 0 ? white : accent, k === 0 ? 0.85 : 0.75 * a)));
        }
      }
      // neuron cubes: pink, flashing when they fire, with a ring that spreads
      for (const n of nodes) {
        const dt = t - n.fireT;
        const k = Math.max(0, 1 - dt / 600);
        fillCell(n.c, n.r, rgb(mix(accent, hot, k)));
        if (k > 0) {
          fillCell(n.c, n.r, rgb(white, 0.9 * k), 0.3);
          const grow = 1 + (1 - k) * 1.6;
          const w = (cx(n.c + 1) - cx(n.c)) * grow, h = (cy(n.r + 1) - cy(n.r)) * grow;
          const mx = (cx(n.c) + cx(n.c + 1)) / 2, my = (cy(n.r) + cy(n.r + 1)) / 2;
          ctx.strokeStyle = rgb(hot, 0.7 * k);
          ctx.lineWidth = Math.max(1, W / 240);
          ctx.strokeRect(mx - w / 2, my - h / 2, w, h);
        }
      }
      ctx.restore();
    }

    function loop(t) {
      update(t);
      draw(t);
      if (lineRef.current) lineRef.current.style.transform = `translateY(${st.line * frame.clientHeight}px)`;
      st.raf = requestAnimationFrame(loop);
    }

    function frac(e) {
      const rect = frame.getBoundingClientRect();
      return {
        x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
        y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
      };
    }
    function burstAt(p) {
      const c = p.x * COLS, r = p.y * ROWS;
      const order = nodes
        .map((n, i) => ({ i, d: Math.abs(n.c - c) + Math.abs(n.r - r) }))
        .sort((a, b) => a.d - b.d);
      const t = performance.now();
      fire(order[0].i, t, 3);
      if (order[1]) setTimeout(() => fire(order[1].i, performance.now(), 2), 150);
    }
    function redrawStatic() {
      if (!reduce) return;
      update(performance.now());
      draw(performance.now());
      if (lineRef.current) lineRef.current.style.transform = `translateY(${st.line * frame.clientHeight}px)`;
    }

    // The line only moves while you press and drag. It stays where you let go.
    function onDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      st.dragging = true;
      st.moved = false;
      st.startY = e.clientY;
      st.startX = e.clientX;
      frame.setPointerCapture(e.pointerId);
    }
    function onMove(e) {
      if (!st.dragging) return;
      if (!st.moved && Math.hypot(e.clientX - st.startX, e.clientY - st.startY) < 4) return;
      st.moved = true;
      st.target = frac(e).y;
      e.preventDefault();
      redrawStatic();
    }
    function onUp(e) {
      if (!st.dragging) return;
      st.dragging = false;
      if (!st.moved) burstAt(frac(e)); // a plain click makes the neurons fire
      redrawStatic();
    }
    function onKey(e) {
      const step = e.shiftKey ? 0.2 : 0.05;
      if (e.key === "ArrowDown") st.target = Math.min(1, st.target + step);
      else if (e.key === "ArrowUp") st.target = Math.max(0, st.target - step);
      else if (e.key === "Enter" || e.key === " ") burstAt({ x: 0.5, y: 0.4 });
      else return;
      e.preventDefault();
      redrawStatic();
    }

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerdown", onDown);
    frame.addEventListener("pointerup", onUp);
    frame.addEventListener("pointercancel", onUp);
    frame.addEventListener("keydown", onKey);

    return () => {
      st.alive = false;
      cancelAnimationFrame(st.raf);
      ro.disconnect();
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerdown", onDown);
      frame.removeEventListener("pointerup", onUp);
      frame.removeEventListener("pointercancel", onUp);
      frame.removeEventListener("keydown", onKey);
    };
  }, [src]);

  return (
    <div className="portrait">
      <div className="scanline" ref={lineRef} aria-hidden="true">
        <span className="scanline-handle" />
      </div>
      <div
        className="portrait-frame"
        ref={frameRef}
        tabIndex={0}
        role="img"
        aria-label={`${alt}. Drag up or down to reveal the pixel version.`}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
