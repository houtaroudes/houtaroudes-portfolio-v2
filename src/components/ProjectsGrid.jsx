import { ArrowUpRight } from "reicon-react";
import DailyDrivers from "./DailyDrivers";

/* ===== My projects, in the template's bento language =====
   A glass panel holding raised cards: monochrome stack marks, an orange
   kicker, the title, one line of what it is, the stack tags and an arrow.
   Each card is an <a> straight to the live build (or its source when there
   is nothing deployed), so nothing here needs a second click.

   Random Web Dev is the flagship: it spans two columns and carries a real
   screenshot, the way the template's wide cards carry their media.
*/
const PROJECTS = [
  {
    id: "random-web-dev",
    flag: true,
    kicker: "Flagship build",
    title: "Random Web Dev",
    desc: "My gamified learning hub — 26+ quests, live previews and code challenges. Learn by doing, not by watching.",
    tags: ["React", "Vite", "HTML", "CSS"],
    logos: ["/icons/react.svg", "/icons/vite.svg", "/icons/javascript.svg"],
    demo: "https://random-learning-webdev-site.vercel.app",
    code: "https://github.com/houtaroudes/random-learning-webdev-site",
    shot: "/images/shot-learning.png",
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
    desc: "A photobooth web app with a PHP + MySQL backend — built solo as a school project.",
    tags: ["PHP", "MySQL", "CSS", "JS"],
    logos: ["/icons/php.svg", "/icons/mysql.svg", "/icons/javascript.svg"],
    demo: "https://pixelpodweb.vercel.app",
    code: "https://github.com/houtaroudes/PixelPodWeb",
  },
  {
    id: "cafe",
    kicker: "Frontend",
    title: "Houtarou Cafe",
    desc: "A concept cafe site with minimalist design — ordering flow and a reservation system.",
    tags: ["HTML", "CSS", "JS"],
    logos: ["/icons/html5.svg", "/icons/css3.svg", "/icons/javascript.svg"],
    code: "https://github.com/houtaroudes/houtarou-cafe",
  },
  {
    id: "mfh",
    kicker: "Full Stack Platform",
    title: "Modern Filipino Homes",
    desc: "A secure proptech platform — property showcase, financing calculator, AI assistant and lead capture, all shipped live.",
    tags: ["React", "Vite", "tRPC", "MySQL", "Tailwind"],
    logos: ["/icons/react.svg", "/icons/vite.svg", "/icons/tailwindcss.svg", "/icons/mysql.svg"],
    demo: "https://modern-fil-homes.vercel.app",
    code: "https://github.com/houtaroudes/modern-fil-homes",
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
    id: "more",
    kicker: "Everything else",
    title: "All Repositories",
    desc: "Experiments, school projects and everything else over on GitHub.",
    tags: ["GitHub"],
    logos: ["/icons/github.svg"],
    code: "https://github.com/houtaroudes?tab=repositories",
  },
];

const Eyebrow = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{ marginRight: 6 }} aria-hidden="true">
    <path d="M4 0L8 4L4 8L0 4Z" />
  </svg>
);

function Marks({ logos }) {
  return (
    <span className="prj-marks" aria-hidden="true">
      {logos.map((src) => (
        <span key={src} className="prj-mark" style={{ "--logo-mask": `url('${src}')` }} />
      ))}
    </span>
  );
}

function ProjectCard({ project }) {
  return (
    <a
      className={`prj-card${project.flag ? " prj-card--flag" : ""}`}
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
}

export default function ProjectsGrid() {
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
          Everything here shipped. Open a card to walk through the work live.
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
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
