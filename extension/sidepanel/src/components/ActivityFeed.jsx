import { ExternalLink, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useGraph } from "../hooks/useGraph";

const statusConfig = {
  complete: {
    icon: CheckCircle,
    color: "var(--green)",
    bg: "var(--green-muted)",
    label: "Done",
  },
  pending: {
    icon: Clock,
    color: "var(--amber)",
    bg: "var(--amber-muted)",
    label: "Processing",
  },
  failed: {
    icon: AlertCircle,
    color: "var(--red)",
    bg: "var(--red-muted)",
    label: "Failed",
  },
};

export default function ActivityFeed() {
  const { nodes, loading } = useGraph();

  if (loading) {
    return (
      <div className="p-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-20 rounded-xl" style={{ opacity: 1 - i * 0.2 }} />
        ))}
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="text-center py-10 animate-fade-in">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--accent-muted)" }}
        >
          <Clock size={20} style={{ color: "var(--accent)" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          No activity yet
        </p>
        <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
          Start browsing to see your captures here
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <p
        className="text-[10px] font-semibold uppercase tracking-wider mb-3 px-1"
        style={{ color: "var(--text-muted)" }}
      >
        Recent Captures
      </p>

      <div className="space-y-2">
        {nodes.map((node, index) => {
          const status = statusConfig[node.summary_status] || statusConfig.pending;
          const StatusIcon = status.icon;

          return (
            <a
              key={node.id}
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-xl p-3 transition-all duration-200 animate-fade-in-up"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                animationDelay: `${index * 0.04}s`,
                animationFillMode: "backwards",
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
              {/* Status icon */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: status.bg }}
              >
                <StatusIcon size={13} style={{ color: status.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {node.title || "Untitled"}
                </p>
                <p className="text-[10px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {node.url}
                </p>

                {node.summary && (
                  <p
                    className="text-[11px] mt-1.5 leading-relaxed"
                    style={{
                      color: "var(--text-secondary)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {node.summary}
                  </p>
                )}

                {node.keywords && node.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {node.keywords.slice(0, 3).map((kw, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-medium px-1.5 py-0.5 rounded-md"
                        style={{
                          background: "var(--accent-muted)",
                          color: "var(--accent)",
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Arrow */}
              <ExternalLink size={12} className="shrink-0 mt-1" style={{ color: "var(--text-muted)" }} />
            </a>
          );
        })}
      </div>
    </div>
  );
}