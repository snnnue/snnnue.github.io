import React, { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
//  One-row album carousel that loops forever.
//  - The album in the middle is full size; each step away gets smaller,
//    paler and slightly blurred, so about five are visible at once.
//  - Only the middle album shows its title and artist.
//  - Move it by scrolling sideways (trackpad), dragging, clicking a
//    side album, or the arrow keys.
// ─────────────────────────────────────────────────────────────

const SHRINK = 0.2; // how much smaller each step away from the middle is
const FADE = 0.3; // how much paler each step away is
const BLUR = 0.9; // px of blur per step away
const GAP = 18; // px between covers

export default function AlbumCarousel({ items }) {
  const n = items.length;
  const wrapRef = useRef(null);
  const itemRefs = useRef([]);
  const st = useRef({ p: 0, target: 0, raf: 0, drag: null, snapTimer: 0, cur: 0 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const s = st.current;
    const wrapEl = wrapRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mod = (x) => ((x % n) + n) % n;
    const coverSize = () => wrapEl.querySelector(".carousel-item")?.offsetWidth || 160;
    // shortest signed distance from the middle to album i (wraps around)
    const dist = (i, p) => {
      let d = mod(i - p);
      if (d > n / 2) d -= n;
      return d;
    };

    function layout() {
      const size = coverSize();
      for (let i = 0; i < n; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const d = dist(i, s.p);
        const a = Math.abs(d);
        if (a > 2.9) {
          el.style.visibility = "hidden";
          continue;
        }
        const scale = 1 - SHRINK * a;
        const x = Math.sign(d) * (size * (a - (SHRINK / 2) * a * a) + GAP * a);
        el.style.visibility = "visible";
        el.style.transform = `translateX(-50%) translateX(${x.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        el.style.opacity = Math.max(0, 1 - FADE * a).toFixed(3);
        el.style.filter = a < 0.03 ? "none" : `blur(${(BLUR * a).toFixed(2)}px)`;
        el.style.zIndex = String(100 - Math.round(a * 10));
      }
      const c = mod(Math.round(s.p));
      if (c !== s.cur) {
        s.cur = c;
        setCurrent(c);
      }
    }

    function tick() {
      if (!s.drag) {
        const diff = s.target - s.p;
        s.p = reduce || Math.abs(diff) < 0.001 ? s.target : s.p + diff * 0.16;
      }
      layout();
      if (s.drag || s.p !== s.target) s.raf = requestAnimationFrame(tick);
      else s.raf = 0;
    }
    const kick = () => {
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };
    const snapSoon = () => {
      clearTimeout(s.snapTimer);
      s.snapTimer = setTimeout(() => {
        s.target = Math.round(s.target);
        kick();
      }, 140);
    };

    // sideways scrolling (trackpad, or shift + mouse wheel)
    function onWheel(e) {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!dx) return;
      e.preventDefault();
      s.target += dx / 140;
      kick();
      snapSoon();
    }
    // dragging with mouse or finger
    function onDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      s.drag = { x: e.clientX, p: s.p, moved: false, id: e.pointerId };
    }
    function onMove(e) {
      if (!s.drag) return;
      const dx = e.clientX - s.drag.x;
      if (!s.drag.moved && Math.abs(dx) < 5) return;
      if (!s.drag.moved) wrapEl.setPointerCapture(s.drag.id);
      s.drag.moved = true;
      s.p = s.drag.p - dx / (coverSize() * 0.85 + GAP);
      s.target = s.p;
      kick();
    }
    function onUp(e) {
      if (!s.drag) return;
      const { moved } = s.drag;
      s.drag = null;
      if (moved) {
        s.target = Math.round(s.p);
      } else {
        // a click on a side album brings it to the middle
        const item = e.target.closest?.(".carousel-item");
        if (item) {
          const i = Number(item.dataset.index);
          s.target = Math.round(s.p) + dist(i, Math.round(s.p));
        }
      }
      kick();
    }
    function onKey(e) {
      if (e.key === "ArrowRight") s.target = Math.round(s.target) + 1;
      else if (e.key === "ArrowLeft") s.target = Math.round(s.target) - 1;
      else return;
      e.preventDefault();
      kick();
    }

    const ro = new ResizeObserver(() => layout());
    ro.observe(wrapEl);
    layout();
    wrapEl.addEventListener("wheel", onWheel, { passive: false });
    wrapEl.addEventListener("pointerdown", onDown);
    wrapEl.addEventListener("pointermove", onMove);
    wrapEl.addEventListener("pointerup", onUp);
    wrapEl.addEventListener("pointercancel", onUp);
    wrapEl.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      clearTimeout(s.snapTimer);
      ro.disconnect();
      wrapEl.removeEventListener("wheel", onWheel);
      wrapEl.removeEventListener("pointerdown", onDown);
      wrapEl.removeEventListener("pointermove", onMove);
      wrapEl.removeEventListener("pointerup", onUp);
      wrapEl.removeEventListener("pointercancel", onUp);
      wrapEl.removeEventListener("keydown", onKey);
    };
  }, [n]);

  const it = items[current];
  return (
    <div className="carousel">
      <div
        className="carousel-track"
        ref={wrapRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Favourite albums. Use the left and right arrow keys to browse."
      >
        {items.map((a, i) => (
          <div
            key={i}
            data-index={i}
            className="carousel-item"
            ref={(el) => (itemRefs.current[i] = el)}
            aria-hidden={i !== current}
          >
            {a.image ? (
              <img src={a.image} alt={`${a.title} by ${a.artist}`} draggable="false" />
            ) : (
              <div className="carousel-empty" />
            )}
          </div>
        ))}
      </div>
      <div className="carousel-caption" aria-live="polite">
        <p key={`t${current}`} className="shelf-title">{it.title}</p>
        <p key={`m${current}`} className="shelf-meta">{it.artist} · {it.year}</p>
      </div>
    </div>
  );
}
