import { ExternalLink, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useGraph } from "../hooks/useGraph";

const statusIcon = {
  complete: <CheckCircle size={12} className="text-[#28A745]" />,
  pending: <Clock size={12} className="text-[#F5841F]" />,
  failed: <AlertCircle size={12} className="text-[#D73847]" />,
};

export default function ActivityFeed() {
  const { nodes, loading } = useGraph();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#037DD6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock size={32} className="mx-auto text-[#3B4046] mb-3" />
        <p className="text-sm text-[#9FA6AE]">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <p className="text-xs text-[#6A737D] uppercase tracking-wider mb-3">Recent Captures</p>

      {nodes.map((node) => (
        <a
          key={node.id}
          href={node.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 bg-[#1C1E21] rounded-lg p-3 border border-[#3B4046] hover:border-[#037DD6] transition"
        >
          <div className="mt-0.5">
            {statusIcon[node.summary_status] || statusIcon.pending}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate">{node.title || "Untitled"}</p>
            <p className="text-[10px] text-[#6A737D] truncate mt-0.5">{node.url}</p>
            {node.summary && (
              <p className="text-[10px] text-[#9FA6AE] mt-1.5 line-clamp-2">{node.summary}</p>
            )}
            {node.keywords && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {node.keywords.slice(0, 3).map((kw, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#24272A] text-[#037DD6]">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
          <ExternalLink size={12} className="text-[#6A737D] shrink-0 mt-0.5" />
        </a>
      ))}
    </div>
  );
}