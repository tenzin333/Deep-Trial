import { useGraph } from "../hooks/useGraph";

export default function Header({ email }) {
  const { stats } = useGraph();

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Account row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, var(--accent), #9F7AEA)",
            }}
          >
            {email[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate max-w-[160px]" style={{ color: "var(--text-primary)" }}>
              {email.split("@")[0]}
            </p>
            <p className="text-[10px] truncate max-w-[160px]" style={{ color: "var(--text-muted)" }}>
              {email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "var(--green-muted)" }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--green)" }} />
          <span className="text-[10px] font-medium" style={{ color: "var(--green)" }}>Active</span>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center justify-between">
          <StatItem
            value={stats.nodes}
            label="Pages"
            color="var(--accent)"
            bg="var(--accent-muted)"
          />
          <div className="w-px h-8" style={{ background: "var(--border)" }} />
          <StatItem
            value={stats.edges}
            label="Connections"
            color="var(--green)"
            bg="var(--green-muted)"
          />
          <div className="w-px h-8" style={{ background: "var(--border)" }} />
          <StatItem
            value={stats.nodes > 0 ? (stats.edges / stats.nodes).toFixed(1) : "0"}
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
        <p className="text-lg font-bold tabular-nums" style={{ color, letterSpacing: "-0.02em" }}>
          {value}
        </p>
      </div>
      <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
    </div>
  );
}