import { Search, X, ExternalLink, Sparkles } from "lucide-react";
import { useSearch } from "../hooks/useSearch";

/* Deterministic domain color from a small palette */
const DOMAIN_COLORS = [
  { bg: "rgba(108, 142, 239, 0.18)", color: "var(--accent)" },
  { bg: "rgba(159, 122, 234, 0.18)", color: "var(--purple)" },
  { bg: "rgba(61, 214, 140, 0.18)", color: "var(--green)" },
  { bg: "rgba(240, 180, 41, 0.18)", color: "var(--amber)" },
];

function domainColor(url) {
  try {
    const host = new URL(url).hostname;
    let hash = 0;
    for (let i = 0; i < host.length; i++) hash = (hash * 31 + host.charCodeAt(i)) & 0xffff;
    return DOMAIN_COLORS[hash % DOMAIN_COLORS.length];
  } catch {
    return DOMAIN_COLORS[0];
  }
}

function domainInitial(url) {
  try {
    return new URL(url).hostname.replace("www.", "")[0]?.toUpperCase() ?? "?";
  } catch {
    return "?";
  }
}

const SUGGESTIONS = [
  "What was I reading about React?",
  "Summarize my AI research this week",
  "What topics did I explore today?",
];

export default function SearchPanel() {
  const { query, result, loading, search, clear } = useSearch();

  return (
    <div className="p-4">
      {/* Search input */}
      <div className="relative mb-4">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="text"
          placeholder="Ask about your browsing history…"
          value={query}
          onChange={(e) => search(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
            outline: "none",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--accent)";
            e.target.style.boxShadow = "var(--glow-sm)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.boxShadow = "none";
          }}
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md transition-colors"
            style={{ color: "var(--text-muted)", background: "transparent", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Loading — animated thinking dots */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{
                    background: "var(--accent)",
                    animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    boxShadow: "var(--glow-sm)",
                  }}
                />
              ))}
            </div>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Thinking…
            </span>
          </div>
        </div>
      )}

      {/* Answer */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {/* AI Answer card with gradient accent */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--gradient-card)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--accent)",
              boxShadow: "var(--glow-sm)",
            }}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <Sparkles
                  size={13}
                  style={{
                    color: "var(--accent)",
                    filter: "drop-shadow(0 0 4px rgba(108, 142, 239, 0.5))",
                  }}
                />
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--accent)" }}
                >
                  AI Answer
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {result.answer}
              </p>
            </div>
          </div>

          {/* Sources */}
          {result.sources.length > 0 && (
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider mb-2.5 px-1"
                style={{ color: "var(--text-muted)" }}
              >
                Sources
              </p>
              <div className="space-y-2">
                {result.sources.map((source, i) => {
                  const dColor = domainColor(source.url);
                  const initial = domainInitial(source.url);
                  const score = Math.round(source.similarity_score * 100);

                  return (
                    <a
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl p-3 transition-all duration-200 animate-fade-in-up"
                      style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        textDecoration: "none",
                        animationDelay: `${i * 0.06}s`,
                        animationFillMode: "backwards",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-active)";
                        e.currentTarget.style.background = "var(--bg-overlay)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = "var(--glow-sm)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.background = "var(--bg-surface)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {/* Domain initial circle */}
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold"
                        style={{ background: dColor.bg, color: dColor.color }}
                      >
                        {initial}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                          {source.title}
                        </p>
                        <p className="text-[10px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {source.url}
                        </p>

                        {/* Similarity bar */}
                        <div className="mt-1.5 flex items-center gap-2">
                          <div
                            className="h-[3px] rounded-full overflow-hidden flex-1"
                            style={{ background: "var(--bg-overlay)" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${score}%`,
                                background: "var(--gradient-accent)",
                                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                              }}
                            />
                          </div>
                          <span
                            className="text-[9px] font-semibold shrink-0"
                            style={{ color: "var(--accent)" }}
                          >
                            {score}%
                          </span>
                        </div>
                      </div>

                      <ExternalLink size={11} style={{ color: "var(--text-muted)" }} className="shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !result && (
        <div className="text-center py-10 animate-fade-in">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float"
            style={{
              background: "var(--accent-muted)",
              boxShadow: "var(--glow-sm)",
            }}
          >
            <Search size={20} style={{ color: "var(--accent)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Ask anything
          </p>
          <p className="text-xs mt-1 mb-4" style={{ color: "var(--text-muted)" }}>
            Search across your entire browsing history
          </p>
          <div className="flex flex-col gap-1.5 items-center">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => search(suggestion)}
                className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                style={{
                  color: "var(--text-muted)",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-active)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.boxShadow = "var(--glow-sm)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
