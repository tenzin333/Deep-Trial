// extension/sidepanel/src/components/Settings.jsx
import { LogOut, Github, Info } from "lucide-react";

export default function Settings({ onLogout }) {
  return (
    <div className="p-4 space-y-3">
      <p className="text-xs text-[#6A737D] uppercase tracking-wider mb-3">Settings</p>

      <div className="bg-[#1C1E21] rounded-lg border border-[#3B4046] divide-y divide-[#3B4046]">
        <a
          href="https://github.com/yourusername/deeptrail"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 hover:bg-[#24272A] transition"
        >
          <Github size={16} className="text-[#9FA6AE]" />
          <span className="text-sm text-white">GitHub</span>
        </a>

        <div className="flex items-center gap-3 p-3">
          <Info size={16} className="text-[#9FA6AE]" />
          <div>
            <span className="text-sm text-white">Version</span>
            <span className="text-xs text-[#6A737D] ml-2">1.0.0</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 p-3 w-full hover:bg-[#24272A] transition"
        >
          <LogOut size={16} className="text-[#D73847]" />
          <span className="text-sm text-[#D73847]">Sign Out</span>
        </button>
      </div>
    </div>
  );
}