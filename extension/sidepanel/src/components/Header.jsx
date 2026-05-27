import { useEffect, useRef, useState } from "react";
import { useGraph } from "../hooks/useGraph";

function useAnimatedCounter(target, duration = 600) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = typeof target === "number" ? target : parseFloat(target) || 0;
    if (from === to) return;

    startRef.current = null;

    const tick = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = from + (to - from) * eased;
      setDisplay(typeof target === "number" ? Math.round(value) : value.toFixed(1));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
        fromRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

export default function Header({ email }) {
  const { stats } = useGraph();

  const avgLinks = stats.nodes > 0
    ? parseFloat((stats.edges / stats.nodes).toFixed(1))
    : 0;

  const displayNodes = useAnimatedCounter(stats.nodes);
  const displayEdges = useAnimatedCounter(stats.edges);
  const displayAvg = useAnimatedCounter(avgLinks);

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Account row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {/* Gradient ring around avatar */}
          <div
            className="p-[2px] rounded-xl shrink-0"
            style={{
              background: "var(--gradient-accent)",
              boxShadow: "var(--glow-sm)",
            }}
          >
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center text-xs font-semibold text-white"
              style={{ background: "var(--bg-surface)" }}
            >
              <span
                style={{
                  background: "var(--gradient-accent)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 700,
                }}
              >
                {email[0].toUpperCase()}
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium truncate max-w-[150px]" style={{ color: "var(--text-primary)" }}>
              {email.split("@")[0]}
            </p>
            <p className="text-[10px] truncate max-w-[150px]" style={{ color: "var(--text-muted)" }}>
              {email}
            </p>
          </div>
        </div>

        {/* Active badge with pulsing dot */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
          style={{ background: "var(--green-muted)" }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full animate-glow-ping-green"
            style={{ background: "var(--green)" }}
          />
          <span className="text-[10px] font-medium" style={{ color: "var(--green)" }}>Active</span>
        </div>
      </div>

      {/* Stats card */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "var(--gradient-surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex items-center justify-between">
          <StatItem
            value={displayNodes}
            label="Pages"
            color="var(--accent)"
            bg="var(--accent-muted)"
          />
          <div className="w-px h-8" style={{ background: "var(--border)" }} />
          <StatItem
            value={displayEdges}
            label="Connections"
            color="var(--green)"
            bg="var(--green-muted)"
          />
          <div className="w-px h-8" style={{ background: "var(--border)" }} />
          <StatItem
            value={displayAvg}
            label="Avg Links"
            color="var(--amber)"
            bg="var(--amber-muted)"
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({ value, label, color, bg }) {
  return (
    <div className="flex-1 text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        <p
          className="text-lg font-bold tabular-nums"
          style={{
            color,
            letterSpacing: "-0.02em",
            animation: "countUp 0.4s ease-out",
          }}
        >
          {value}
        </p>
      </div>
      <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
    </div>
  );
}
