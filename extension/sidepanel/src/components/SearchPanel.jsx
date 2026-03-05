// extension/sidepanel/src/components/SearchPanel.jsx
import { Search, X, ExternalLink, Loader2 } from "lucide-react";
import { useSearch } from "../hooks/useSearch";

export default function SearchPanel() {
  const { query, result, loading, search, clear } = useSearch();

  return (
    <div className="p-4">
      {/* Search input */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A737D]" />
        <input
          type="text"
          placeholder="Ask about your browsing history..."
          value={query}
          onChange={(e) => search(e.target.value)}
          className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-[#24272A] border border-[#3B4046] text-white text-sm placeholder-[#6A737D] focus:outline-none focus:border-[#037DD6]"
        />
        {query && (
          <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={14} className="text-[#6A737D] hover:text-white" />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={20} className="text-[#037DD6] animate-spin" />
          <span className="ml-2 text-sm text-[#9FA6AE]">Thinking...</span>
        </div>
      )}

      {/* Answer */}
      {result && (
        <div className="space-y-3">
          <div className="bg-[#24272A] rounded-xl p-4 border border-[#3B4046]">
            <p className="text-sm text-white leading-relaxed">{result.answer}</p>
          </div>

          {/* Sources */}
          {result.sources.length > 0 && (
            <div>
              <p className="text-xs text-[#6A737D] mb-2 uppercase tracking-wider">Sources</p>
              <div className="space-y-2">
                {result.sources.map((source, i) => (
                <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#1C1E21] rounded-lg p-3 border border-[#3B4046] hover:border-[#037DD6] transition"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{source.title}</p>
                      <p className="text-[10px] text-[#6A737D] truncate">{source.url}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-[#037DD6] font-medium">
                        {Math.round(source.similarity_score * 100)}%
                      </span>
                      <ExternalLink size={12} className="text-[#6A737D]" />
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
        <div className="text-center py-8">
          <Search size={32} className="mx-auto text-[#3B4046] mb-3" />
          <p className="text-sm text-[#9FA6AE]">Ask anything</p>
          <p className="text-xs text-[#6A737D] mt-1">
            "What was I reading about React?"<br />
            "Summarize my AI research this week"
          </p>
        </div>
      )}
    </div>
  );
}