import { useEffect, useMemo, useState } from "react";

// The upstream API caches and GitHub's own graph lags, so asking more often
// than this only produces identical answers. Overridable for tests.
const REFRESH_MS = 15 * 60 * 1000;

// Returning to the tab refreshes right away, but not more often than this, so
// flicking between windows cannot turn into one request per alt-tab.
const MIN_REFRESH_GAP_MS = 30 * 1000;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const GithubIcon = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-4 1.2-4-2.1-5.5-2.5M17 22v-3.2c0-.9-.3-1.5-.6-1.8 2.1-.2 4.3-1 4.3-4.7 0-1-.4-1.9-1-2.6.1-.3.4-1.3-.1-2.7 0 0-.9-.3-2.9 1a10 10 0 00-5.4 0c-2-1.3-2.9-1-2.9-1-.5 1.4-.2 2.4-.1 2.7-.6.7-1 1.6-1 2.6 0 3.7 2.2 4.5 4.3 4.7-.3.3-.5.7-.6 1.4V22" />
  </svg>
);

export default function GitHubHeatmap({ username = "houtaroudes", year, refreshMs = REFRESH_MS }) {
  // The chart year is state rather than a value sampled once at mount: a tab
  // left open over New Year would otherwise keep showing, and keep re-fetching,
  // the previous year. An explicit `year` prop pins it; without one it follows
  // the clock and rolls over on the first refresh after the date changes.
  const [activeYear, setActiveYear] = useState(() => year ?? new Date().getFullYear());
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let timer = null;
    // Kept in the effect closure rather than in state on purpose: once a chart
    // has rendered, a later refresh that fails must leave it alone instead of
    // swapping working data for the error card. Only a first load may do that.
    let gotData = false;
    let lastLoadAt = 0;

    async function load() {
      lastLoadAt = Date.now();
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
        if (!res.ok) throw new Error("contributions API error");
        const json = await res.json();
        if (cancelled) return;
        gotData = true;
        setData(json);
        setError(false);
        setRefreshedAt(Date.now());
        if (year === undefined) {
          const nowYear = new Date().getFullYear();
          setActiveYear((prev) => (prev === nowYear ? prev : nowYear));
        }
      } catch {
        if (!cancelled && !gotData) setError(true);
      }
    }

    function startTimer() {
      if (timer === null && refreshMs > 0) timer = setInterval(load, refreshMs);
    }

    function stopTimer() {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Polling a background tab is pure waste, so the timer only runs while the
    // page is visible. Coming back into view refreshes straight away rather
    // than waiting out whatever is left of the interval, but only once the data
    // is genuinely getting old, so flicking between windows stays cheap.
    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        if (Date.now() - lastLoadAt > MIN_REFRESH_GAP_MS) load();
        startTimer();
      } else {
        stopTimer();
      }
    }

    load();
    if (document.visibilityState === "visible") startTimer();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      stopTimer();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [username, refreshMs, year]);

  const { weeks, monthLabels, longestStreak, total } = useMemo(() => {
    if (!data) return { weeks: [], monthLabels: [], longestStreak: 0, total: 0 };
    const days = (data.contributions || []).filter((d) => d.date.startsWith(String(activeYear)));
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
    return { weeks: wks, monthLabels: labels, longestStreak: best, total: data.total?.[String(activeYear)] ?? totalFromDays };
  }, [data, activeYear]);

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
          <div
            className="gh-heatmap-stats"
            title={refreshedAt ? `Last refreshed ${new Date(refreshedAt).toLocaleTimeString()}` : undefined}
          >
            <span>
              <strong>{total}</strong> contributions in {activeYear}
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
