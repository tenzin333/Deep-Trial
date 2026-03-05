// extension/sidepanel/src/components/Header.jsx
import { useGraph } from "../hooks/useGraph";

export default function Header({ email }) {
  const { stats } = useGraph();

  return (
    <div className="bg-[#24272A] rounded-xl p-4 text-center w-full">
      {/* Top row — account */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#037DD6] to-[#F5841F] flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {email[0].toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-[#9FA6AE] truncate max-w-[180px]">
            {email}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#28A745]" />
          <span className="text-xs text-[#6A737D]">Active</span>
        </div>
      </div>

      {/* Stats card */}
      <div className="bg-[#24272A] rounded-xl p-4 text-center">
        <p className="text-3xl font-bold text-white">{stats.nodes}</p>
        <p className="text-xs text-[#9FA6AE] mt-1">Pages Captured</p>
        <div className="flex justify-center gap-4 mt-3">
          <div className="text-center">
            <p className="text-sm font-semibold text-[#037DD6]">{stats.edges}</p>
            <p className="text-xs text-[#6A737D]">Connections</p>
          </div>
          <div className="w-px bg-[#3B4046]" />
          <div className="text-center">
            <p className="text-sm font-semibold text-[#28A745]">
              {stats.nodes > 0 ? Math.round((stats.edges / stats.nodes) * 10) / 10 : 0}
            </p>
            <p className="text-xs text-[#6A737D]">Avg Links</p>
          </div>
        </div>
      </div>
    </div>
  );
}