import { useEffect, useMemo, useState } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const GithubIcon = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-4 1.2-4-2.1-5.5-2.5M17 22v-3.2c0-.9-.3-1.5-.6-1.8 2.1-.2 4.3-1 4.3-4.7 0-1-.4-1.9-1-2.6.1-.3.4-1.3-.1-2.7 0 0-.9-.3-2.9 1a10 10 0 00-5.4 0c-2-1.3-2.9-1-2.9-1-.5 1.4-.2 2.4-.1 2.7-.6.7-1 1.6-1 2.6 0 3.7 2.2 4.5 4.3 4.7-.3.3-.5.7-.6 1.4V22" />
  </svg>
);

export default function GitHubHeatmap({ username = "houtaroudes", year = new Date().getFullYear() }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("API error"))))
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  const { weeks, monthLabels, longestStreak, total } = useMemo(() => {
    if (!data) return { weeks: [], monthLabels: [], longestStreak: 0, total: 0 };
    const days = (data.contributions || []).filter((d) => d.date.startsWith(String(year)));
    if (!days.length) return { weeks: [], monthLabels: [], longestStreak: 0, total: 0 };

    // Pad the first week so columns align with weekdays (Sunday first).
    const firstDow = new Date(days[0].date + "T00:00:00Z").getUTCDay();
    const cells = [...Array(firstDow).fill(null), ...days];
    const wks = [];
    for (let i = 0; i < cells.length; i += 7) wks.push(cells.slice(i, i + 7));

    // Month labels at the column where each new month starts.
    const labels = [];
    let lastMonth = -1;
    wks.forEach((wk, col) => {
      const first = wk.find(Boolean);
      if (!first) return;
      const m = new Date(first.date + "T00:00:00Z").getUTCMonth();
      if (m !== lastMonth) {
        labels.push({ col, label: MONTHS[m] });
        lastMonth = m;
      }
    });

    // Longest streak of consecutive active days.
    let cur = 0;
    let best = 0;
    days.forEach((d) => {
      cur = d.count > 0 ? cur + 1 : 0;
      if (cur > best) best = cur;
    });

    const totalFromDays = days.reduce((a, d) => a + d.count, 0);
    return { weeks: wks, monthLabels: labels, longestStreak: best, total: data.total?.[String(year)] ?? totalFromDays };
  }, [data, year]);

  if (error) {
    return (
      <div className="gh-heatmap-card gh-heatmap-error reveal">
        <GithubIcon s={20} />
        <p>Couldn't load GitHub activity right now.</p>
        <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer">
          @{username} on GitHub →
        </a>
      </div>
    );
  }

  return (
    <div className="gh-heatmap-card reveal reveal-delay-1">
      <div className="gh-heatmap-head">
        <a className="gh-heatmap-user" href={`https://github.com/${username}`} target="_blank" rel="noreferrer">
          <GithubIcon s={16} /> @{username}
        </a>
        {data && (
          <div className="gh-heatmap-stats">
            <span>
              <strong>{total}</strong> contributions in {year}
            </span>
            <span className="gh-stat-sep">·</span>
            <span>
              <strong>{longestStreak}</strong>-day streak
            </span>
          </div>
        )}
      </div>

      <div className="gh-heatmap-scroll">
        {data ? (
          <div className="gh-heatmap-inner">
            <div className="gh-heatmap-months">
              {monthLabels.map((m) => (
                <span key={`${m.label}-${m.col}`} style={{ gridColumnStart: m.col + 1 }}>
                  {m.label}
                </span>
              ))}
            </div>
            <div className="gh-heatmap-grid">
              {weeks.flatMap((wk, ci) =>
                wk.map((d, ri) =>
                  d ? (
                    <div
                      key={d.date}
                      className="gh-day"
                      data-level={d.level}
                      title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}
                    />
                  ) : (
                    <div key={`pad-${ci}-${ri}`} className="gh-day gh-day-pad" />
                  )
                )
              )}
            </div>
          </div>
        ) : (
          <div className="gh-heatmap-inner" aria-hidden="true">
            <div className="gh-heatmap-grid">
              {Array.from({ length: 53 * 7 }).map((_, i) => (
                <div key={i} className="gh-day gh-day-loading" />
              ))}
            </div>
          </div>
        )}
      </div>

      {data && (
        <div className="gh-heatmap-legend">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="gh-day gh-legend-day" data-level={l} />
          ))}
          <span>More</span>
        </div>
      )}
    </div>
  );
}
