import { useMemo } from "react";
import { DAILY_DRIVERS } from "../data/dailyDrivers.js";

/* One tool. Single-colour marks go through a CSS mask so a black glyph can
   be painted with its brand colour; multi-colour marks stay an <img>. */
function Driver({ tool }) {
  if (tool.color) {
    return (
      <span className="dd-item">
        <span
          className="dd-mark"
          style={{
            "--icon-url": `url('${tool.icon}')`,
            "--brand-color": tool.color,
            "--brand-color-dark": tool.darkColor ?? tool.color,
          }}
        />
        <span className="dd-label">{tool.name}</span>
      </span>
    );
  }
  return (
    <span className="dd-item">
      <img className="dd-img" src={tool.icon} alt="" width={20} height={20} loading="lazy" decoding="async" />
      <span className="dd-label">{tool.name}</span>
    </span>
  );
}

/* ===== Daily Drivers =====
   The template's "Tools I work with" strip: a label on the left, the marquee
   filling the rest. It sits directly under the Projects head, so the tools are
   the first thing after the headline instead of a section you have to scroll
   to find.

   The track is duplicated so the CSS keyframe can translate by exactly -50%
   and loop seamlessly. The animated copy is aria-hidden; the real, deduped
   list rides along in an sr-only <ul> for screen readers. */
export default function DailyDrivers() {
  const doubled = useMemo(() => [...DAILY_DRIVERS, ...DAILY_DRIVERS], []);

  return (
    <div className="dd-band reveal">
      <div className="dd-band-head">
        <span className="dd-band-eyebrow">Daily Drivers</span>
        <h2 className="dd-band-label">Tools I work with</h2>
      </div>

      <div className="dd-marquee" aria-hidden="true">
        <div className="dd-track">
          {doubled.map((tool, i) => (
            <Driver key={`${tool.name}-${i}`} tool={tool} />
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {DAILY_DRIVERS.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>
    </div>
  );
}
