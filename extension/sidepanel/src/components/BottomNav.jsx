// extension/sidepanel/src/components/BottomNav.jsx
import { Share2, Search, Clock, Settings } from "lucide-react";

const tabs = [
  { id: "graph", label: "Graph", icon: Share2 },
  { id: "search", label: "Search", icon: Search },
  { id: "activity", label: "Activity", icon: Clock },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function BottomNav({ active, onChange }) {
  return (
    <div className="bg-[#1C1E21] border-t border-[#3B4046] flex">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex-1 flex flex-col items-center py-2.5 gap-1 transition ${
            active === id
              ? "text-[#037DD6]"
              : "text-[#6A737D] hover:text-[#9FA6AE]"
          }`}
        >
          <Icon size={18} />
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}