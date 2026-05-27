import { useEffect, useRef, useState } from "react";
import { Share2, Search, Clock, Settings } from "lucide-react";

const tabs = [
  { id: "graph", label: "Graph", icon: Share2 },
  { id: "search", label: "Search", icon: Search },
  { id: "activity", label: "Activity", icon: Clock },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function BottomNav({ active, onChange }) {
  const tabRefs = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const containerRef = useRef(null);

  // Compute sliding indicator position
  useEffect(() => {
    const idx = tabs.findIndex((t) => t.id === active);
    const el = tabRefs.current[idx];
    if (el && containerRef.current) {
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const elRect = el.getBoundingClientRect();
      setIndicator({
        left: elRect.left - containerLeft + elRect.width * 0.2,
        width: elRect.width * 0.6,
      });
    }
  }, [active]);

  return (
    <div
      style={{
        background: "var(--bg-raised)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        ref={containerRef}
        className="flex items-center px-1 py-1.5 relative"
      >
        {/* Sliding pill indicator */}
        <div
          className="absolute bottom-2 h-[3px] rounded-full pointer-events-none"
          style={{
            background: "var(--gradient-accent)",
            left: indicator.left,
            width: indicator.width,
            boxShadow: "var(--glow-sm)",
            transition:
              "left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />

        {tabs.map(({ id, label, icon: Icon }, idx) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              ref={(el) => (tabRefs.current[idx] = el)}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center py-1.5 gap-0.5 rounded-xl relative"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              {/* Icon with spring scale */}
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: isActive ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  style={{
                    color: isActive ? "var(--accent)" : "var(--text-muted)",
                    transition: "color 0.2s ease",
                    filter: isActive ? "drop-shadow(0 0 4px rgba(108, 142, 239, 0.5))" : "none",
                  }}
                />
              </span>
              <span
                className="text-[9px] font-medium"
                style={{
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                  transition: "color 0.2s ease",
                  letterSpacing: "0.02em",
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
