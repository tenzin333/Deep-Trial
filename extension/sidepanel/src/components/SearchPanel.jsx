import { Search, X, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { useSearch } from "../hooks/useSearch";

export default function SearchPanel() {
  const { query, result, loading, search, clear } = useSearch();

  return (
    <div className="p-4">
      {/* Search input */}
      <div className="relative mb-4">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="text"
          placeholder="Ask about your browsing history..."
          value={query}
          onChange={(e) => search(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm transition-all duration-200"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
            outline: "none",
          }}
          onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
          onBlur={(e) => e.target.style.borderColor = "var(--border)"}
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => e.target.style.color = "var(--text-primary)"}
            onMouseLeave={(e) => e.target.style.color = "var(--text-muted)"}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-2.5">
            <Loader2
              size={18}
              className="animate-spin"
              style={{ color: "var(--accent)" }}
            />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Thinking...
            </span>
          </div>
        </div>
      )}

      {/* Answer */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles size={13} style={{ color: "var(--accent)" }} />
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                AI Answer
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
              {result.answer}
            </p>
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
                {result.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl p-3 transition-all duration-200"
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-active)";
                      e.currentTarget.style.background = "var(--bg-overlay)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.background = "var(--bg-surface)";
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {source.title}
                      </p>
                      <p className="text-[10px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {source.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                        style={{
                          background: "var(--accent-muted)",
                          color: "var(--accent)",
                        }}
                      >
                        {Math.round(source.similarity_score * 100)}%
                      </span>
                      <ExternalLink size={11} style={{ color: "var(--text-muted)" }} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !result && (
        <div className="text-center py-10 animate-fade-in">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--accent-muted)" }}
          >
            <Search size={20} style={{ color: "var(--accent)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Ask anything
          </p>
          <div className="mt-3 space-y-1.5">
            {[
              "What was I reading about React?",
              "Summarize my AI research this week",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => search(suggestion)}
                className="block mx-auto px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                style={{
                  color: "var(--text-muted)",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "var(--border-hover)";
                  e.target.style.color = "var(--text-secondary)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.color = "var(--text-muted)";
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