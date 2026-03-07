import { Share2, Clock, Settings } from "lucide-react";

const tabs = [
  { id: "graph", label: "Graph", icon: Share2 },
  { id: "activity", label: "Activity", icon: Clock },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function BottomNav({ active, onChange }) {
  return (
    <div
      className="px-2 py-2"
      style={{
        background: "var(--bg-raised)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center py-2 gap-1 rounded-xl transition-all duration-200 relative"
              style={{
                background: isActive ? "var(--accent-muted)" : "transparent",
              }}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.2 : 1.8}
                style={{
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                  transition: "color 0.2s, transform 0.2s",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              />
              <span
                className="text-[10px] font-medium transition-colors duration-200"
                style={{
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}