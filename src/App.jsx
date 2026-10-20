import React, { useEffect, useMemo, useRef, useState } from "react";
import PixelPortrait from "./PixelPortrait.jsx";
import photo from "./assets/profile.jpg";
import { profile, navLabels, news, research, projects, show, orgs, interests } from "./content.js";

// ── small helpers ─────────────────────────────────────────────

function OrgLink({ org }) {
  const [hasLogo, setHasLogo] = useState(Boolean(org.logo));
  // no url yet → same look, just not clickable
  const Tag = org.url ? "a" : "span";
  const linkProps = org.url ? { href: org.url, target: "_blank", rel: "noreferrer" } : {};
  return (
    <Tag className="inline-link org" {...linkProps}>
      {hasLogo && <img className="org-logo" src={org.logo} alt="" style={{ height: `${org.logoHeight || 1.1}em` }} onError={() => setHasLogo(false)} />}
      <span>{org.name}</span>
    </Tag>
  );
}

// **bold**, [label](url) and {{org}} inside a sentence
function Rich({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\{\{[a-zA-Z0-9_-]+\}\})/g);
  return parts.map((p, i) => {
    if (p.startsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    const org = p.match(/^\{\{([a-zA-Z0-9_-]+)\}\}$/);
    if (org && orgs[org[1]]) return <OrgLink key={i} org={orgs[org[1]]} />;
    const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m)
      return (
        <a key={i} className="inline-link" href={m[2]} target="_blank" rel="noreferrer">
          {m[1]}
        </a>
      );
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

const ICONS = {
  webpage: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  paper: "M12 3a9 9 0 1 0 9 9h-9z M14 2.5V10h7.5A8 8 0 0 0 14 2.5z",
  poster: "M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5",
  slides: "M3 4h18v12H3z M12 16v4 M8 20h8",
  code: "M8 8l-4 4 4 4 M16 8l4 4-4 4",
  archive: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  linkedin: "M4 4h16v16H4z M8 10v6 M8 7.5v.01 M12 16v-3.5a2 2 0 0 1 4 0V16 M12 10v6",
  github: "M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
  scholar: "M2 9l10-5 10 5-10 5z M6 11v5c3 2 9 2 12 0v-5",
  mail: "M3 5h18v14H3z M3 7l9 6 9-6",
  instagram: "M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z M8.5 12a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0-7 0 M17 7v.01",
  download: "M12 4v11 M7 10l5 5 5-5 M5 20h14",
};
function Icon({ name, size = 18 }) {
  const d = ICONS[name] || ICONS.archive;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d.split(" M").map((seg, i) => <path key={i} d={i ? "M" + seg : seg} />)}
    </svg>
  );
}

// Pastel pixel pattern used where an image hasn't been added yet
function PixelPlaceholder({ seed, cols = 24, rows = 14 }) {
  const cells = useMemo(() => {
    let s = 0;
    for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
    const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    const colors = ["#f3eefc", "#e8dff9", "#dcd0f5", "#e1f0cc", "#cfe6ad", "#b8a6ec", "#f4a3c4"];
    const out = [];
    for (let i = 0; i < cols * rows; i++) {
      const v = rand();
      out.push(v < 0.62 ? colors[0] : v < 0.8 ? colors[1] : v < 0.88 ? colors[2] : v < 0.93 ? colors[3] : v < 0.96 ? colors[4] : v < 0.99 ? colors[5] : colors[6]);
    }
    return out;
  }, [seed, cols, rows]);
  return (
    <svg className="placeholder" viewBox={`0 0 ${cols} ${rows}`} preserveAspectRatio="none" aria-hidden="true">
      {cells.map((c, i) => <rect key={i} x={i % cols} y={Math.floor(i / cols)} width="1.02" height="1.02" fill={c} />)}
    </svg>
  );
}

function Monogram({ rows }) {
  const cell = 7;
  const w = rows[0].length * cell, h = rows.length * cell;
  return (
    <svg className="monogram" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {rows.flatMap((row, r) =>
        [...row].map((v, c) =>
          v === "0" ? null : <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={v === "2" ? "var(--c-accent)" : "var(--c-text)"} />
        )
      )}
    </svg>
  );
}

// ── routing: #projects and #cv are their own pages, everything else is home ──
function viewFromHash() {
  const h = (window.location.hash || "").replace("#", "");
  if (h === "projects" && show.projects) return h;
  if (h === "interests") return h;
  return "home";
}

function useRoute() {
  const [view, setView] = useState(viewFromHash);
  const [hash, setHash] = useState(window.location.hash.replace("#", ""));
  useEffect(() => {
    const on = () => {
      setView(viewFromHash());
      setHash(window.location.hash.replace("#", ""));
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return { view, hash };
}

function useScrollSpy(ids, enabled) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (!enabled) return;
    const onScroll = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled, ids.join()]);
  return active;
}

// ── sections ──────────────────────────────────────────────────

function News() {
  const [open, setOpen] = useState(false);
  if (!news.length) return null;
  const [first, ...rest] = news;
  return (
    <div className={`news ${open ? "is-open" : ""}`}>
      <button type="button" id="news-toggle" className="news-row news-head" aria-expanded={open} onClick={() => setOpen(!open)} disabled={!rest.length}>
        <span className="news-date">{first.date}</span>
        <span className="news-text">{first.text}</span>
        {rest.length > 0 && <span className="news-chevron" aria-hidden="true" />}
      </button>
      {open && (
        <ul className="news-rest">
          {rest.map((n, i) => (
            <li key={i} className="news-row">
              <span className="news-date">{n.date}</span>
              <span className="news-text">{n.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Home() {
  return (
    <>
      <section id="about" className="section about">
        <div className="hero-row">
          <h1 className="hero">
            {profile.greeting}{" "}
            <span className="hero-soft">
              {profile.tagline.split("\n").map((line, i, all) => (
                <React.Fragment key={i}>
                  {line}
                  {i < all.length - 1 && <>{" "}<br className="hero-br" /></>}
                </React.Fragment>
              ))}
            </span>
          </h1>
          {profile.monogram && <Monogram rows={profile.monogram} />}
        </div>
        <div className="bio">
          {profile.bio.map((p, i) => <p key={i}><Rich text={p} /></p>)}
        </div>
        <ul className="tags">
          {profile.tags.map((t) => <li key={t}>{t}</li>)}
        </ul>
        {profile.outside && <p className="outside"><Rich text={profile.outside} /></p>}
        <News />
      </section>

      <section id="research" className="section">
        <h2 className="section-title">{navLabels.research}</h2>
        {research.map((group) => (
          <div key={group.group} className="res-group">
            <h3 className="res-group-title">{group.group}</h3>
            <ul className="pubs">
              {group.items.map((r, i) => {
                const links = (r.links || []).filter((l) => l.url);
                return (
                  <li key={i} className="pub">
                    <p className="pub-label">{r.label}</p>
                    <div className="pub-body">
                      <h4 className="pub-title">{r.title}</h4>
                      {r.meta && <p className="pub-people"><Rich text={r.meta} /></p>}
                      {r.text && <p className="pub-text"><Rich text={r.text} /></p>}
                      {links.length > 0 && (
                        <p className="pub-links">
                          {links.map((l) => (
                            <a key={l.label} href={l.url} target="_blank" rel="noreferrer">
                              <Icon name={l.label.toLowerCase()} /> {l.label}
                            </a>
                          ))}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}

function Projects() {
  const tags = useMemo(() => ["All", ...new Set(projects.map((p) => p.tag))], []);
  const [filter, setFilter] = useState("All");
  const shown = projects.filter((p) => filter === "All" || p.tag === filter);
  return (
    <section className="section">
      <h2 className="section-title">{navLabels.projects}</h2>
      <div className="filters" role="tablist" aria-label="Filter projects">
        {tags.map((t) => (
          <button key={t} id={`filter-${t}`} type="button" role="tab" aria-selected={filter === t} className={filter === t ? "is-active" : ""} onClick={() => setFilter(t)}>
            {t}
          </button>
        ))}
      </div>
      <ul className="cards">
        {shown.map((p) => {
          const Wrap = p.url ? "a" : "div";
          return (
            <li key={p.title}>
              <Wrap className="card" {...(p.url ? { href: p.url, target: "_blank", rel: "noreferrer" } : {})}>
                <div className="card-head">
                  <h3 className="card-title">{p.title}</h3>
                  <span className="card-tag"># {p.tag}</span>
                  <span className="card-year">{p.year}</span>
                </div>
                <div className="card-media">
                  {p.image ? <img src={p.image} alt="" loading="lazy" /> : <PixelPlaceholder seed={p.title} />}
                </div>
                <p className="card-text">{p.text}</p>
              </Wrap>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Shelf({ items, kind }) {
  const poster = kind === "film";
  return (
    <ul className={`shelf ${poster ? "shelf-films" : "shelf-albums"}`}>
      {items.map((it, i) => (
        <li key={i} className="shelf-item">
          <div className="shelf-cover">
            {it.image ? (
              <img src={it.image} alt={`${it.title} cover`} loading="lazy" />
            ) : (
              <PixelPlaceholder seed={`${kind}-${i}-${it.title}`} cols={poster ? 10 : 12} rows={poster ? 15 : 12} />
            )}
          </div>
          <p className="shelf-title">{it.title}</p>
          <p className="shelf-meta">{poster ? it.director : it.artist} · {it.year}</p>
        </li>
      ))}
    </ul>
  );
}

function Interests() {
  const { outside, editorial } = interests;
  return (
    <section className="section interests">
      <h2 className="section-title">{navLabels.interests}</h2>

      <div className="int-block">
        <h3 className="res-group-title">{outside.title}</h3>
        <div className="pub">
          <p className="pub-label">{editorial.label}</p>
          <div className="pub-body">
            <h4 className="pub-title">{editorial.name}</h4>
            <p className="pub-people">{editorial.role}</p>
            <ul className="points">
              {editorial.points.map((p, i) => <li key={i}><Rich text={p} /></li>)}
            </ul>
          </div>
        </div>
        {outside.text?.length > 0 && (
          <div className="bio outside-text">
            {outside.text.map((p, i) => <p key={i}><Rich text={p} /></p>)}
          </div>
        )}
        {outside.tags?.length > 0 && (
          <ul className="tags">{outside.tags.map((t) => <li key={t}>{t}</li>)}</ul>
        )}
      </div>

      <div className="int-block">
        <h3 className="res-group-title">{interests.albumsTitle}</h3>
        <Shelf items={interests.albums} kind="album" />
      </div>

      <div className="int-block">
        <h3 className="res-group-title">{interests.filmsTitle}</h3>
        <Shelf items={interests.films} kind="film" />
      </div>
    </section>
  );
}

// ── page ──────────────────────────────────────────────────────

export default function App() {
  const { view, hash } = useRoute();
  const spy = useScrollSpy(["about", "research"], view === "home");
  const active = view === "home" ? spy : view;
  const first = useRef(true);

  // scroll to the right place when the page changes
  useEffect(() => {
    if (first.current) { first.current = false; if (!hash) return; }
    if (view !== "home") { window.scrollTo(0, 0); return; }
    const el = hash && document.getElementById(hash);
    if (el) el.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [view, hash]);

  const { links } = profile;
  const nav = [
    { id: "about", label: navLabels.about },
    { id: "research", label: navLabels.research },
    { id: "projects", label: navLabels.projects },
    { id: "interests", label: navLabels.interests },
  ].filter((n) => n.id !== "projects" || show.projects);

  return (
    <div className="page">
      <aside className="side">
        <div className="side-inner">
          <a className="wordmark" href="#about">{profile.name}</a>
          {view === "home" ? (
            <PixelPortrait src={photo} alt={`Portrait of ${profile.name}`} />
          ) : (
            <div className="side-rule" aria-hidden="true"><span className="scanline-handle" /></div>
          )}
          <nav className="nav" aria-label="Sections">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={active === n.id ? "is-active" : ""} aria-current={active === n.id ? "page" : undefined}>
                {n.label}
              </a>
            ))}
            {links.cvPdf && (
              <a href={links.cvPdf} target="_blank" rel="noreferrer">{navLabels.cv}</a>
            )}
          </nav>
          <div className="side-foot">
            <div className="socials">
              {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Icon name="linkedin" size={22} /></a>}
              {links.instagram && <a href={links.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Icon name="instagram" size={22} /></a>}
              {links.github && <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Icon name="github" size={22} /></a>}
              {links.scholar && <a href={links.scholar} target="_blank" rel="noreferrer" aria-label="Google Scholar"><Icon name="scholar" size={22} /></a>}
              {links.email && <a href={`mailto:${links.email}`} aria-label={`Email ${links.email}`}><Icon name="mail" size={22} /></a>}
            </div>
            <p className="copy">© {new Date().getFullYear()} {profile.name}</p>
          </div>
        </div>
      </aside>

      <main className="main">
        {view === "home" && <Home />}
        {view === "projects" && <Projects />}
        {view === "interests" && <Interests />}
      </main>
    </div>
  );
}
