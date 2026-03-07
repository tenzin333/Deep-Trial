import { LogOut, Github, Info, ChevronRight, ExternalLink } from "lucide-react";

export default function Settings({ onLogout }) {
  return (
    <div className="p-4 animate-fade-in">
      <p
        className="text-[10px] font-semibold uppercase tracking-wider mb-3 px-1"
        style={{ color: "var(--text-muted)" }}
      >
        Settings
      </p>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
        }}
      >
        {/* GitHub link */}
        <a
          href="https://github.com/tenzin333/deeptrail"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3.5 transition-colors duration-150"
          style={{ borderBottom: "1px solid var(--border)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-overlay)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "var(--bg-overlay)" }}
          >
            <Github size={15} style={{ color: "var(--text-secondary)" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>GitHub</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>View source code</p>
          </div>
          <ExternalLink size={14} style={{ color: "var(--text-muted)" }} />
        </a>

        {/* Version */}
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "var(--bg-overlay)" }}
          >
            <Info size={15} style={{ color: "var(--text-secondary)" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Version</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>DeepTrail Extension</p>
          </div>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-lg"
            style={{
              background: "var(--accent-muted)",
              color: "var(--accent)",
              fontFamily: "var(--font-mono)",
            }}
          >
            v1.0.0
          </span>
        </div>

        {/* Sign Out */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3.5 w-full transition-colors duration-150"
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--red-muted)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "var(--red-muted)" }}
          >
            <LogOut size={15} style={{ color: "var(--red)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--red)" }}>Sign Out</p>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
          Built with AI-powered knowledge mapping
        </p>
      </div>
    </div>
  );
}