import { Suspense, lazy, useState } from "react";
import { ArrowUpRight, Cpu } from "reicon-react";
import { TECH_STACK_PREVIEW, TOTAL_TECH_SKILLS } from "../data/techStack.js";

/* The modal is code-split — most visitors never open it, so its code only
   downloads on first open (or earlier, on hover / focus). It stays mounted
   afterwards so the exit animation can play. */
const loadTechStackModal = () => import("./TechStackModal");
const TechStackModal = lazy(loadTechStackModal);

const Eyebrow = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{ marginRight: 6 }} aria-hidden="true">
    <path d="M4 0L8 4L4 8L0 4Z" />
  </svg>
);

/* ===== Tech Stack =====
   The card that opens the full breakdown. It used to ride inside the Daily
   Drivers section; that band moved up under the Projects headline, so the
   card now stands on its own right after the projects. */
export default function TechStack() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const openStack = () => {
    setMounted(true);
    setOpen(true);
  };

  return (
    <section className="section ts-section" id="tech-stack" aria-labelledby="ts-title">
      <div className="section-header reveal">
        <div className="section-eyebrow">
          <Eyebrow /> Under the hood
        </div>
        <h2 className="section-title" id="ts-title">
          My Tech Stack
        </h2>
        <p className="section-desc">
          Every tool I reach for across front-end, back-end, and creative work.
        </p>
      </div>

      <button
        type="button"
        className="dd-stack reveal"
        onClick={openStack}
        onMouseEnter={loadTechStackModal}
        onFocus={loadTechStackModal}
        aria-haspopup="dialog"
        aria-label="Open my tech stack and skills"
      >
        <span className="dd-stack-icon">
          <Cpu size={20} weight="Outline" />
        </span>
        <span className="dd-stack-body">
          <span className="dd-stack-title">{TOTAL_TECH_SKILLS} tools &amp; technologies</span>
          <span className="dd-stack-desc">
            Open the full breakdown — languages, frameworks, databases and creative software.
          </span>
          <span className="card-tags">
            {TECH_STACK_PREVIEW.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </span>
        </span>
        <span className="dd-stack-arrow" aria-hidden="true">
          <ArrowUpRight size={18} weight="Outline" />
        </span>
      </button>

      {mounted && (
        <Suspense fallback={null}>
          <TechStackModal open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </section>
  );
}
