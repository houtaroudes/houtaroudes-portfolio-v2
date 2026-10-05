import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CodeCircle, Compass, Rocket } from "reicon-react";

/*
 * Loading intro for v2.
 *
 * Same visual system as the reference portfolio: a workflow diagram that
 * assembles itself. Nodes drop in one at a time, the cable between each pair
 * goes live in orange with a glow, a dot runs down it, a green check lands on
 * the node it reached, and a status line pulses while it works then settles to
 * green when it is done. The words of the name rise out of a mask above it.
 *
 * What is deliberately different from the reference:
 *  - the steps are YOUR three, taken from the method section on this page
 *    (Discover, Build, Launch) rather than someone else's automation nodes.
 *  - it is driven by real readiness. The strip does not end on a fixed timer
 *    and abandon a half-drawn diagram: the last beat waits for the page to
 *    finish loading and paint. On a warm cache the whole thing is over almost
 *    immediately, and a floor stops it from flashing.
 *  - reduced motion skips it outright, and it plays three times a day (counted
 *    locally, reset daily) rather than on every single refresh.
 *
 * Timing is one list of steps, so the sequence is readable in one place
 * instead of being scattered across CSS delays that have to stay in sync.
 */

const TITLE = ["Bryan", "Sacueza"];
const STEPS = [
  { label: "Discover", Icon: Compass },
  { label: "Build", Icon: CodeCircle },
  { label: "Launch", Icon: Rocket },
];

/* Intro budget. Same rule as the game portfolio: three plays a day, counted in
   localStorage and reset when the date changes, so three refreshes show it
   three times and after that the page simply loads. */
const KEY_DATE = "v2-intro-date";
const KEY_COUNT = "v2-intro-count";
const PLAYS_PER_DAY = 3;

/* React StrictMode runs effects twice on one page load in development. Without
   this guard a single visit would spend two of the three plays. */
let counted = false;

function isForcedReplay() {
  try {
    return new URLSearchParams(window.location.search).get("intro") === "1";
  } catch {
    return false;
  }
}

function playsToday() {
  try {
    if (localStorage.getItem(KEY_DATE) !== new Date().toDateString()) return 0;
    const n = parseInt(localStorage.getItem(KEY_COUNT) || "0", 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function countPlay() {
  try {
    const today = new Date().toDateString();
    const n = localStorage.getItem(KEY_DATE) === today ? playsToday() : 0;
    localStorage.setItem(KEY_DATE, today);
    localStorage.setItem(KEY_COUNT, String(n + 1));
  } catch {
    /* private mode: nothing to remember, harmless */
  }
}

/* Beat timings in ms. */
const T = {
  canvasIn: 260,
  nodeStep: 330,
  cableLead: 130, // cable lights up just before the node it feeds arrives
  checkAfter: 240,
  doneHold: 380,
};
const MIN_MS = 1200;
const MAX_MS = 3600;

/**
 * Decide once, at mount, whether this visit shows the intro. Reads only, so it
 * is safe under StrictMode's double render. `?intro=1` replays it on demand
 * without spending one of the day's plays.
 */
function initIntro() {
  if (typeof window === "undefined") return { mode: "skip", forced: false };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return { mode: "skip", forced: false };
  }
  if (isForcedReplay()) return { mode: "run", forced: true };
  if (playsToday() >= PLAYS_PER_DAY) return { mode: "skip", forced: false };
  return { mode: "run", forced: false };
}

/** Resolve once the window has loaded, or immediately if it already has. */
function whenLoaded() {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => {
    window.addEventListener("load", resolve, { once: true });
  });
}

/** Two frames, so the page under the overlay has actually painted. */
function nextFrames() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

export default function BootIntro() {
  const [{ mode, forced }] = useState(initIntro);
  const [beats, setBeats] = useState({ nodes: 0, cables: 0, checks: 0 });
  const [done, setDone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  const wrapRef = useRef(null);
  const nodeRefs = useRef([]);
  const [paths, setPaths] = useState([]);

  /* Cables are measured from the real node boxes, so they stay attached at any
     width, in either theme, and while the row reflows on a phone. */
  useLayoutEffect(() => {
    if (mode !== "run") return undefined;
    const measure = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const box = wrap.getBoundingClientRect();
      const next = [];
      for (let i = 0; i < nodeRefs.current.length - 1; i += 1) {
        const a = nodeRefs.current[i];
        const b = nodeRefs.current[i + 1];
        if (!a || !b) continue;
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const x1 = ra.right - box.left;
        const y1 = ra.top + ra.height / 2 - box.top;
        const x2 = rb.left - box.left;
        const y2 = rb.top + rb.height / 2 - box.top;
        const mid = x1 + (x2 - x1) / 2;
        next.push({
          d: `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`,
          x: x1,
          y: y1,
          span: x2 - x1,
        });
      }
      setPaths(next);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mode]);

  useEffect(() => {
    if (mode !== "run") return undefined;
    const started = Date.now();
    const timers = [];
    let cancelled = false;
    const after = (ms, fn) => {
      timers.push(window.setTimeout(fn, ms));
    };

    // Spend one of the day's plays, unless this was a manual replay.
    if (!forced && !counted) {
      counted = true;
      countPlay();
    }

    // 1. Walk the diagram.
    for (let i = 0; i < STEPS.length; i += 1) {
      const appearAt = T.canvasIn + i * T.nodeStep;
      after(appearAt, () =>
        setBeats((b) => ({ ...b, nodes: Math.max(b.nodes, i + 1) })),
      );
      if (i < STEPS.length - 1) {
        const cableAt = T.canvasIn + (i + 1) * T.nodeStep - T.cableLead;
        after(cableAt, () =>
          setBeats((b) => ({ ...b, cables: Math.max(b.cables, i + 1) })),
        );
      }
      const checkAt = appearAt + T.checkAfter;
      after(checkAt, () =>
        setBeats((b) => ({ ...b, checks: Math.max(b.checks, i + 1) })),
      );
    }
    after(
      T.canvasIn + STEPS.length * T.nodeStep + T.checkAfter,
      () => setDone(true),
    );

    // 2. Lift only once the diagram has finished AND the page is really ready.
    const finish = async () => {
      const timeline = T.canvasIn + STEPS.length * T.nodeStep + T.doneHold;
      const target = Math.max(timeline, MIN_MS);
      await whenLoaded();
      await nextFrames();
      if (cancelled) return;
      const wait = Math.max(0, target - (Date.now() - started));
      after(wait, () => setLeaving(true));
    };
    finish();

    // 3. Never hang on a slow or broken asset.
    const ceiling = window.setTimeout(() => setLeaving(true), MAX_MS);
    timers.push(ceiling);

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [mode, forced]);

  useEffect(() => {
    if (!leaving) return undefined;
    const t = window.setTimeout(() => setGone(true), 620);
    return () => window.clearTimeout(t);
  }, [leaving]);

  if (mode === "skip" || gone) return null;

  return (
    <div
      className={`boot${leaving ? " boot--leaving" : ""}`}
      role="presentation"
      aria-hidden="true"
    >
      <h1 className="boot-title">
        {TITLE.map((word, i) => (
          <span className="boot-word" key={word}>
            <span
              className="boot-word-in"
              style={{ animationDelay: `${80 + i * 110}ms` }}
            >
              {word}
            </span>
          </span>
        ))}
      </h1>

      <div className={`boot-canvas${done ? " is-done" : ""}`} ref={wrapRef}>
        <svg className="boot-cables" aria-hidden="true">
          {paths.map((p, i) => (
            <path
              key={p.d}
              className={`boot-cable${beats.cables > i ? " is-live" : ""}`}
              d={p.d}
            />
          ))}
        </svg>

        {paths.map((p, i) =>
          beats.cables > i ? (
            <span
              key={`dot-${p.d}`}
              className="boot-dot"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                "--span": `${p.span}px`,
              }}
            />
          ) : null,
        )}

        <div className="boot-row">
          {STEPS.map((step, i) => (
            <div
              key={step.label}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className={[
                "boot-node",
                i === 0 ? "boot-node--trigger" : "",
                beats.nodes > i ? "is-in" : "",
                beats.checks > i ? "is-done" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="boot-node-port boot-node-port--in" />
              <span className="boot-node-card">
                <step.Icon
                  className="boot-node-icon"
                  size={21}
                  weight="Outline"
                  aria-hidden="true"
                />
                <span className="boot-node-check">
                  <svg viewBox="0 0 24 24" width="9" height="9" aria-hidden="true">
                    <path
                      d="M4.5 12.5l5 5 10-11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
              <span className="boot-node-port boot-node-port--out" />
              <span className="boot-node-label">{step.label}</span>
            </div>
          ))}
        </div>

        <p className={`boot-status${done ? " is-done" : ""}`}>
          <span className="boot-status-dot" />
          {done ? "Build complete" : "Assembling the build"}
        </p>
      </div>
    </div>
  );
}
