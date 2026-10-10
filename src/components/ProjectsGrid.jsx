import { useState, useRef, useEffect } from "react";
import { ArrowUpRight } from "reicon-react";
import DailyDrivers from "./DailyDrivers";

/* ===== My projects, in the template's bento language =====
   A glass panel holding raised cards: monochrome stack marks, an orange
   kicker, the title, one line of what it is, the stack tags and an arrow.
   Each card is an <a> straight to the live build (or its source when there
   is nothing deployed). The two flagships also carry a story button: the
   long version of the work opens in a drawer instead of crowding the grid.

   Random Web Dev is the flagship and St. Joseph Village is the second
   highlight: both span the full row and carry a real screenshot, the way
   the template's wide cards carry their media. PixCodes is the third
   highlight: a screenshot card too, but two columns wide instead of the
   whole row, so it sits between the wide cards and the plain stack.
*/
const PROJECTS = [
  {
    id: "random-web-dev",
    flag: true,
    kicker: "Flagship build",
    title: "Random Web Dev",
    desc: "My gamified learning hub with 26+ quests, live previews and code challenges. Learn by doing, not by watching.",
    tags: ["React", "Vite", "HTML", "CSS"],
    logos: ["/icons/react.svg", "/icons/vite.svg", "/icons/javascript.svg"],
    demo: "https://random-learning-webdev-site.vercel.app",
    code: "https://github.com/houtaroudes/Random-Learning-WebDev",
    shot: "/images/shot-learning.png",
    story: {
      problem: "Learning resources are passive: videos and docs you watch but never touch. It is hard to tell whether you can actually build anything.",
      approach: "I built a hub that treats practice like a game: 26+ exercises with live previews you can open in the browser, code challenges with instant feedback, and progress that unlocks as you go.",
      proof: "Public repo on GitHub, deployed live on Vercel",
    },
  },
  {
    id: "st-joseph-village",
    flag: true,
    kicker: "Cinematic build",
    title: "St. Joseph Village",
    desc: "A cinematic concept landing page: a generated 3D village you fly through on scroll, an interactive 68-lot site plan and a live financing calculator.",
    tags: ["React", "Vite", "Three.js", "Framer Motion"],
    logos: ["/icons/react.svg", "/icons/vite.svg", "/icons/threedotjs.svg"],
    demo: "https://st-joseph-village.vercel.app",
    code: "https://github.com/houtaroudes/st-joseph-village",
    shot: "/images/shot-stjoseph.png",
    story: {
      problem: "Subdivision landing pages are static galleries: rows of photos that give no feel for the place or the actual math of buying a lot.",
      approach: "I made the village itself the page: a generated 3D scene in Three.js that you fly through on scroll, a clickable 68-lot site plan, and a financing calculator with real Pag-IBIG vs bank numbers.",
      proof: "Public repo on GitHub, deployed live on Vercel",
    },
  },
  {
    id: "pixcodes",
    hl: true,
    kicker: "Playable build",
    title: "PixCodes",
    desc: "A browser game about writing CSS: a rendered target, sixteen levels, and checks that grade your code against it in a sandboxed frame.",
    tags: ["React", "Vite", "CSS", "Codemirror"],
    logos: ["/icons/react.svg", "/icons/vite.svg", "/icons/css3.svg"],
    demo: "https://site-7d4c5e9f5f5e44248af0691c372581ea.freebuff.page",
    code: "https://github.com/houtaroudes/pixcodes",
    shot: "/images/shot-pixcodes.png",
  },
  {
    id: "motion",
    kicker: "Frontend",
    title: "Motion Website",
    desc: "A front-end inspiration hub for exploring layout and animation ideas.",
    tags: ["HTML", "CSS", "JS"],
    logos: ["/icons/javascript.svg", "/icons/html5.svg", "/icons/css3.svg"],
    demo: "https://motion-website-des.vercel.app",
    code: "https://github.com/houtaroudes/motion-website",
  },
  {
    id: "pixelpod",
    kicker: "Full Stack",
    title: "PixelPodWeb",
    desc: "A photobooth web app with a PHP + MySQL backend, built solo as a school project.",
    tags: ["PHP", "MySQL", "CSS", "JS"],
    logos: ["/icons/php.svg", "/icons/mysql.svg", "/icons/javascript.svg"],
    code: "https://github.com/houtaroudes/PixelPodWeb",
  },
  {
    id: "cafe",
    kicker: "Frontend",
    title: "Houtarou Cafe",
    desc: "A concept cafe site with minimalist design: ordering flow and a reservation system.",
    tags: ["HTML", "CSS", "JS"],
    logos: ["/icons/html5.svg", "/icons/css3.svg", "/icons/javascript.svg"],
    code: "https://github.com/houtaroudes/houtarou-cafe",
  },
  {
    id: "mfh",
    kicker: "Full Stack Platform",
    title: "Modern Filipino Homes",
    desc: "A secure proptech platform: property showcase, financing calculator, AI assistant and lead capture, all shipped live.",
    tags: ["React", "Vite", "tRPC", "MySQL", "Tailwind"],
    logos: ["/icons/react.svg", "/icons/vite.svg", "/icons/tailwindcss.svg", "/icons/mysql.svg"],
    demo: "https://modern-fil-homes.vercel.app",
  },
  {
    id: "mediqueue",
    kicker: "Full Stack",
    title: "MediQueue",
    desc: "Campus clinic booking + walk-in queueing with a live NOW SERVING board and role-based dashboards.",
    tags: ["PHP", "MySQL", "JS", "CSS"],
    logos: ["/icons/php.svg", "/icons/mysql.svg", "/icons/javascript.svg"],
    code: "https://github.com/houtaroudes/mediqueue",
  },
  {
    id: "kalendaryo",
    kicker: "Booking product",
    title: "Kalendaryo",
    desc: "Appointment booking for small businesses: pick a service, take an open time, and it is held. Owners get a dashboard for services, hours and bookings, on Supabase Postgres with row level security.",
    tags: ["React", "Vite", "Tailwind", "Supabase"],
    logos: ["/icons/react.svg", "/icons/vite.svg", "/icons/tailwindcss.svg"],
    code: "https://github.com/houtaroudes/kalendaryo",
    story: {
      problem: "Small businesses take bookings by chat and memory, so double bookings and no-shows are normal. A slot can be promised to two people at once and nobody knows until both arrive.",
      approach: "I built a four step booking flow (service, time, details, done) with a real availability engine that walks opening hours, subtracts what is taken and only offers times that finish before closing. The owner side edits services, prices and hours and sees every booking grouped by day. It runs on Supabase with row level security, and falls back to a seeded local store when no env vars are set so the flow works before a backend exists.",
      proof: "11 tests pass on the pure slot logic, oxlint clean, production build green, and the database proven to expose booking times while denying the customer columns",
    },
  },
  {
    id: "more",
    kicker: "Everything else",
    title: "All Repositories",
    desc: "Experiments, school projects and everything else over on GitHub.",
    tags: ["GitHub"],
    logos: ["/icons/github.svg"],
    code: "https://github.com/houtaroudes?tab=repositories",
  },
];

export { PROJECT_COUNT };

const Eyebrow = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{ marginRight: 6 }} aria-hidden="true">
    <path d="M4 0L8 4L4 8L0 4Z" />
  </svg>
);

const PROJECT_COUNT = PROJECTS.filter((p) => p.id !== "more").length;

function Marks({ logos }) {
  return (
    <span className="prj-marks" aria-hidden="true">
      {logos.map((src) => (
        <span key={src} className="prj-mark" style={{ "--logo-mask": `url('${src}')` }} />
      ))}
    </span>
  );
}

function StoryDrawer({ project, onClose }) {
  const panelRef = useRef(null);
  useEffect(() => {
    const panel = panelRef.current;
    /* aria-modal tells assistive tech the page behind is inert, so Tab has
       to stop at the drawer edges instead of walking out to the cards. */
    const focusables = () =>
      panel ? [...panel.querySelectorAll('a[href], button:not([disabled])')] : [];
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const leavingBackwards = e.shiftKey && (document.activeElement === first || document.activeElement === panel);
      if (leavingBackwards) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    if (panel) panel.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div className="story-overlay" onClick={onClose}>
      <aside
        className="story-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} build story`}
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="story-close" onClick={onClose} aria-label="Close build story">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
        <span className="prj-kicker">Build story</span>
        <h3 className="story-title">{project.title}</h3>
        {project.shot && (
          <span className="story-shot">
            <img src={project.shot} alt={`${project.title} screenshot`} />
          </span>
        )}
        <div className="story-block">
          <span className="story-label">The problem</span>
          <p>{project.story.problem}</p>
        </div>
        <div className="story-block">
          <span className="story-label">The approach</span>
          <p>{project.story.approach}</p>
        </div>
        <p className="story-proof">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 19c-4 1.2-4-2.1-5.5-2.5M17 22v-3.2c0-.9-.3-1.5-.6-1.8 2.1-.2 4.3-1 4.3-4.7 0-1-.4-1.9-1-2.6.1-.3.4-1.3-.1-2.7 0 0-.9-.3-2.9 1a10 10 0 00-5.4 0c-2-1.3-2.9-1-2.9-1-.5 1.4-.2 2.4-.1 2.7-.6.7-1 1.6-1 2.6 0 3.7 2.2 4.5 4.3 4.7-.3.3-.5.7-.6 1.4V22" />
          </svg>
          {project.story.proof}
        </p>
        <div className="story-actions">
          {project.demo && (
            <a className="story-btn story-btn--primary" href={project.demo} target="_blank" rel="noopener noreferrer">
              Open the live build
              <ArrowUpRight size={15} weight="Outline" aria-hidden="true" />
            </a>
          )}
          {project.code && (
            <a className="story-btn" href={project.code} target="_blank" rel="noopener noreferrer">
              View the code
            </a>
          )}
        </div>
      </aside>
    </div>
  );
}

function ProjectCard({ project, onStory }) {
  const card = (
    <a
      className={`prj-card${project.flag && !project.story ? " prj-card--flag" : project.hl ? " prj-card--hl" : ""}`}
      href={project.demo || project.code}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="prj-card-head">
        <Marks logos={project.logos} />
        <span className="prj-kicker">{project.kicker}</span>
        <span className="prj-title">{project.title}</span>
        <span className="prj-desc">{project.desc}</span>
        <span className="card-tags">
          {project.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </span>
        <span className="prj-arrow" aria-hidden="true">
          <ArrowUpRight size={16} weight="Outline" />
        </span>
      </span>
      {project.shot && (
        <span className="prj-shot">
          <img src={project.shot} alt={`${project.title} screenshot`} loading="lazy" decoding="async" />
        </span>
      )}
    </a>
  );
  if (!project.story) return card;
  return (
    <div className={`prj-cardwrap${project.flag ? " prj-cardwrap--flag" : ""}`}>
      {card}
      <button
        type="button"
        className="prj-story-btn"
        onClick={(e) => onStory(project, e.currentTarget)}
      >
        Read the build story
      </button>
    </div>
  );
}

export default function ProjectsGrid() {
  const [story, setStory] = useState(null);
  const storyTrigger = useRef(null);
  const openStory = (project, trigger) => {
    storyTrigger.current = trigger;
    setStory(project);
  };
  const closeStory = () => {
    setStory(null);
    if (storyTrigger.current) storyTrigger.current.focus();
  };
  return (
    <div className="prj">
      <header className="prj-head reveal">
        <div className="prj-headline">
          <div className="prj-heading">
            <div className="section-eyebrow">
              <Eyebrow /> Projects
            </div>
            <h1 className="prj-title-lg">Real apps, sites and builds you can open.</h1>
          </div>
          {/* The template's answer to "don't make them scroll to the bottom to
              reach me": a pill parked beside the headline that jumps straight
              to Contact. It is an anchor, not a route, because v2 is one page
              and `html { scroll-behavior: smooth }` already smooth-scrolls. */}
          <a className="prj-cta" href="#contact">
            Get in touch
            <ArrowUpRight size={16} weight="Outline" aria-hidden="true" />
          </a>
        </div>
        <p className="prj-lede">
          Everything here shipped. Open a card for the build story, the code, or the live site.
        </p>
      </header>

      {/* The tools strip rides between the head and the cards, the way the
          template puts it on Home. */}
      <DailyDrivers />

      <div className="prj-panel reveal">
        <span className="prj-hint" aria-hidden="true">
          Click a card to open it
        </span>
        <div className="prj-grid">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} onStory={openStory} />
          ))}
        </div>
      </div>
      {story && <StoryDrawer project={story} onClose={closeStory} />}
    </div>
  );
}
