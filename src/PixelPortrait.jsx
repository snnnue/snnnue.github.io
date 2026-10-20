import React, { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
//  Portrait hidden under a pastel pixel version of itself.
//  - By default the pixels cover the whole photo.
//  - Move the mouse over it (or drag a finger) and the cubes along
//    your path shrink away, uncovering the photo underneath.
//  - The small square under the photo ("cover me") puts the pixels back.
//  - Cubes still twinkle, and pink "neuron" cubes fire and pass signals.
//  - A click without moving starts a burst of signals there.
// ─────────────────────────────────────────────────────────────

const COLS = 24; // number of cubes across. Bigger = smaller cubes
const ROWS = 28;
const FOCUS_Y = 0.15; // 0 = crop from top of photo, 1 = from bottom
const N_NODES = 15;

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


const BRUSH = 1.6; // how many cubes around the cursor get uncovered
const HINT_CELLS = 16; // cubes that open on their own when the page loads, as a hint
const PEEK_SHARE = 0.06; // once this share of cubes is uncovered, the Cover Me button starts to pulse

export default function PixelPortrait({ src, alt }) {
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const apiRef = useRef({});
  const [tip, setTip] = useState(false);
  const [peeked, setPeeked] = useState(false); // has the visitor uncovered part of the photo?

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const accent = hexToRgb(PALETTE.pink);
    const hot = hexToRgb(PALETTE.hot);
    const white = [255, 255, 255];
    const N = COLS * ROWS;

    const nodes = pickCells(N_NODES, 5, 2026).map((p) => ({ ...p, fireT: -1e9 }));
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
      cover: new Float32Array(N).fill(1), // 1 = cube fully there, 0 = gone
      target: new Float32Array(N).fill(1),
      backAt: new Float64Array(N), // when a cube should start coming back
      hintAt: [], // cubes waiting to open for the first-load hint
      tick: 0, peeked: false,
      last: null, down: false, moved: false,
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
      openHint(performance.now());
      draw(performance.now());
      if (!reduce) st.raf = requestAnimationFrame(loop);
    };
    img.src = src;

    // On first load, a few scattered cubes (mostly over the face) open by
    // themselves, so visitors can tell there is a photo underneath.
    function openHint(t) {
      const r = rng(1019);
      const picked = new Set();
      let tries = 0;
      while (picked.size < HINT_CELLS && tries < 500) {
        tries++;
        const c = 5 + Math.floor(r() * (COLS - 10));
        const rr = 6 + Math.floor(r() * (ROWS - 12));
        picked.add(rr * COLS + c);
      }
      let k = 0;
      for (const i of picked) {
        if (reduce) { st.cover[i] = 0; st.target[i] = 0; }
        else st.hintAt.push({ i, at: t + 500 + k++ * 70 });
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    }
    const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
    ro.observe(canvas);

    const cx = (c) => Math.round((c * canvas.width) / COLS);
    const cy = (r) => Math.round((r * canvas.height) / ROWS);
    // draw one cube; `k` (0..1) shrinks it toward its centre as it disappears
    function fillCell(c, r, color, inset = 0, k = 1) {
      const x0 = cx(c), x1 = cx(c + 1), y0 = cy(r), y1 = cy(r + 1);
      const w = x1 - x0, h = y1 - y0;
      const s = (1 - k) / 2 + inset * k;
      ctx.fillStyle = color;
      ctx.fillRect(x0 + w * s, y0 + h * s, w * (1 - 2 * s), h * (1 - 2 * s));
    }
    const coverAt = (c, r) => st.cover[r * COLS + c];

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

    // uncover the cubes around a point (in cell units)
    function erase(pc, pr) {
      const r0 = Math.max(0, Math.floor(pr - BRUSH)), r1 = Math.min(ROWS - 1, Math.ceil(pr + BRUSH));
      const c0 = Math.max(0, Math.floor(pc - BRUSH)), c1 = Math.min(COLS - 1, Math.ceil(pc + BRUSH));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          if (Math.hypot(c + 0.5 - pc, r + 0.5 - pr) <= BRUSH) {
            const i = r * COLS + c;
            st.target[i] = 0;
            st.backAt[i] = 0;
          }
        }
      }
    }
    // erase along the path from the last point so fast moves leave no gaps
    function eraseTo(p) {
      const pc = p.x * COLS, pr = p.y * ROWS;
      if (st.last) {
        const dc = pc - st.last.c, dr = pr - st.last.r;
        const steps = Math.max(1, Math.ceil(Math.hypot(dc, dr) / 0.4));
        for (let s = 1; s <= steps; s++) erase(st.last.c + (dc * s) / steps, st.last.r + (dr * s) / steps);
      } else erase(pc, pr);
      st.last = { c: pc, r: pr };
    }
    // bring every cube back, in a quick ripple from the top-left
    function coverAll() {
      const t = performance.now();
      st.hintAt = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c;
          if (st.target[i] === 1 && st.cover[i] > 0.99) continue;
          st.backAt[i] = t + (r + c) * 14 + Math.random() * 60;
        }
      }
      if (reduce) { st.target.fill(1); st.cover.fill(1); draw(t); }
    }
    apiRef.current.coverAll = coverAll;

    function update(t) {
      if (t > st.nextAmbient) {
        fire(Math.floor(Math.random() * nodes.length), t, 2);
        st.nextAmbient = t + 1300 + Math.random() * 1400;
      }
      if (Math.random() < 0.09) {
        st.twinkles.push({ c: Math.floor(Math.random() * COLS), r: Math.floor(Math.random() * ROWS), t0: t, dur: 500 + Math.random() * 600 });
      }
      st.twinkles = st.twinkles.filter((w) => t - w.t0 < w.dur);
      st.signals = st.signals.filter((s) => {
        const step = (t - s.t0) / 55;
        if (step >= s.path.length - 1) {
          fire(s.to, t, Math.random() < 0.7 ? s.spread : 0);
          return false;
        }
        return true;
      });
      if (st.hintAt.length) {
        st.hintAt = st.hintAt.filter((h) => {
          if (t < h.at) return true;
          st.target[h.i] = 0;
          return false;
        });
      }
      // tell the button when the visitor has uncovered a fair bit of the photo
      if (++st.tick % 12 === 0) {
        let open = 0;
        for (let i = 0; i < N; i++) if (st.target[i] === 0) open++;
        const peekedNow = open > N * PEEK_SHARE;
        if (peekedNow !== st.peeked) { st.peeked = peekedNow; setPeeked(peekedNow); }
      }
      for (let i = 0; i < N; i++) {
        if (st.backAt[i] && t >= st.backAt[i]) { st.target[i] = 1; st.backAt[i] = 0; }
        const d = st.target[i] - st.cover[i];
        if (d !== 0) {
          st.cover[i] += d * (d < 0 ? 0.28 : 0.22);
          if (Math.abs(st.target[i] - st.cover[i]) < 0.01) st.cover[i] = st.target[i];
        }
      }
    }

    function draw(t) {
      if (!st.img) return;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(st.img, st.crop.sx, st.crop.sy, st.crop.sw, st.crop.sh, 0, 0, W, H);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const k = coverAt(c, r);
          if (k > 0.02) fillCell(c, r, rgb(st.grid[r * COLS + c]), 0, k);
        }
      }
      for (const w of st.twinkles) {
        const k = coverAt(w.c, w.r);
        if (k < 0.5) continue;
        const p = Math.sin(Math.PI * ((t - w.t0) / w.dur));
        fillCell(w.c, w.r, rgb(mix(st.grid[w.r * COLS + w.c], white, 0.55 * p)), 0, k);
        fillCell(w.c, w.r, rgb(white, 0.95 * p), 0.36, k);
      }
      for (const s of st.signals) {
        const step = Math.floor((t - s.t0) / 55);
        if (step < 0) continue;
        for (let j = 0; j < 6; j++) {
          const idx = step - j;
          if (idx < 0 || idx >= s.path.length) continue;
          const p = s.path[idx];
          const k = coverAt(p.c, p.r);
          if (k < 0.5) continue;
          const base = st.grid[p.r * COLS + p.c];
          const a = 1 - j / 6;
          fillCell(p.c, p.r, rgb(mix(base, j === 0 ? white : accent, j === 0 ? 0.85 : 0.75 * a)), 0, k);
        }
      }
      for (const n of nodes) {
        const k = coverAt(n.c, n.r);
        if (k < 0.02) continue;
        const f = Math.max(0, 1 - (t - n.fireT) / 600);
        fillCell(n.c, n.r, rgb(mix(accent, hot, f)), 0, k);
        if (f > 0 && k > 0.5) {
          fillCell(n.c, n.r, rgb(white, 0.9 * f), 0.3, k);
          const grow = 1 + (1 - f) * 1.6;
          const w = (cx(n.c + 1) - cx(n.c)) * grow, h = (cy(n.r + 1) - cy(n.r)) * grow;
          const mx = (cx(n.c) + cx(n.c + 1)) / 2, my = (cy(n.r) + cy(n.r + 1)) / 2;
          ctx.strokeStyle = rgb(hot, 0.7 * f);
          ctx.lineWidth = Math.max(1, W / 240);
          ctx.strokeRect(mx - w / 2, my - h / 2, w, h);
        }
      }
    }

    function loop(t) {
      update(t);
      draw(t);
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
      fire(order[0].i, performance.now(), 3);
    }
    function after() {
      if (reduce) { for (let i = 0; i < N; i++) st.cover[i] = st.target[i]; draw(performance.now()); }
    }

    // mouse: uncover while hovering. touch/pen: uncover while dragging.
    function onMove(e) {
      if (e.pointerType === "mouse" || st.down) {
        if (st.down) st.moved = true;
        eraseTo(frac(e));
        after();
      }
    }
    function onLeave(e) { if (e.pointerType === "mouse") st.last = null; }
    function onDown(e) {
      st.down = true;
      st.moved = false;
      if (e.pointerType !== "mouse") {
        frame.setPointerCapture(e.pointerId);
        st.last = null;
        eraseTo(frac(e));
        after();
      }
    }
    function onUp(e) {
      if (!st.down) return;
      st.down = false;
      if (e.pointerType !== "mouse") st.last = null;
      else if (!st.moved) burstAt(frac(e));
    }
    function onKey(e) {
      // keyboard: Enter uncovers / covers the whole photo
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      const anyCovered = st.target.some((v) => v === 1);
      if (anyCovered) { st.target.fill(0); st.backAt.fill(0); after(); }
      else coverAll();
    }

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    frame.addEventListener("pointerdown", onDown);
    frame.addEventListener("pointerup", onUp);
    frame.addEventListener("pointercancel", onUp);
    frame.addEventListener("keydown", onKey);

    return () => {
      st.alive = false;
      cancelAnimationFrame(st.raf);
      ro.disconnect();
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      frame.removeEventListener("pointerdown", onDown);
      frame.removeEventListener("pointerup", onUp);
      frame.removeEventListener("pointercancel", onUp);
      frame.removeEventListener("keydown", onKey);
    };
  }, [src]);

  return (
    <div className="portrait">
      <div
        className="portrait-frame"
        ref={frameRef}
        tabIndex={0}
        role="img"
        aria-label={`${alt}, hidden under pixels. Move over it to uncover; press Enter to uncover all.`}
      >
        <canvas ref={canvasRef} />
      </div>
      <div className="cover-wrap">
        <button
          type="button"
          id="cover-me"
          className={`cover-btn${peeked ? " is-peeked" : ""}`}
          aria-label="Cover Me! Put the pixels back"
          onClick={() => apiRef.current.coverAll?.()}
          onMouseEnter={() => setTip(true)}
          onMouseLeave={() => setTip(false)}
          onFocus={() => setTip(true)}
          onBlur={() => setTip(false)}
        />
        {tip && <span className="cover-tip" role="tooltip">Cover Me!</span>}
      </div>
    </div>
  );
}
