import { useEffect, useRef, useState } from "react";
import { LogOut, Github, Info, ExternalLink, Zap, Shield } from "lucide-react";

function SettingsRow({ children, style, onClick, href, target, rel, isDestructive }) {
  const [hovered, setHovered] = useState(false);
  const Tag = href ? "a" : "div";

  const props = {
    href,
    target,
    rel,
    onClick,
    className: "flex items-center gap-3 px-4 py-3.5 w-full relative overflow-hidden transition-colors duration-150",
    style: {
      cursor: onClick || href ? "pointer" : "default",
      background: hovered
        ? isDestructive
          ? "var(--red-muted)"
          : "var(--bg-overlay)"
        : "transparent",
      textDecoration: "none",
      ...style,
    },
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  return (
    <Tag {...props}>
      {/* Left accent indicator */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          bottom: "20%",
          width: "2px",
          borderRadius: "0 2px 2px 0",
          background: isDestructive ? "var(--red)" : "var(--gradient-accent)",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left center",
          transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />
      {children}
    </Tag>
  );
}

export default function Settings({ onLogout }) {
  const [autoSave, setAutoSave] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_AUTO_SAVE_STATUS" }).then((res) => {
      setAutoSave(!!res?.autoSaveEnabled);
    }).catch(() => {});
  }, []);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await chrome.runtime.sendMessage({ type: "TOGGLE_AUTO_SAVE" });
      setAutoSave(!!res?.autoSaveEnabled);
    } catch (e) {
      console.error("[DeepTrail] Failed to toggle auto-save:", e);
    }
    setToggling(false);
  };

  return (
    <div className="p-4 animate-fade-in">
      {/* Section label with gradient line */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <p
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          Settings
        </p>
        <div
          className="flex-1 h-px"
          style={{
            background: "linear-gradient(90deg, var(--border-hover) 0%, transparent 100%)",
          }}
        />
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Auto-Save Toggle */}
        <SettingsRow
          onClick={toggling ? undefined : handleToggle}
          style={{ borderBottom: "1px solid var(--border)", opacity: toggling ? 0.7 : 1 }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200"
            style={{
              background: autoSave ? "var(--accent-muted)" : "var(--bg-overlay)",
            }}
          >
            <Zap
              size={15}
              style={{
                color: autoSave ? "var(--accent)" : "var(--text-secondary)",
                filter: autoSave ? "drop-shadow(0 0 4px rgba(108, 142, 239, 0.4))" : "none",
              }}
            />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Auto-Save Pages</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {autoSave ? "Automatically saving visited pages" : "Only saves when you trigger it"}
            </p>
          </div>

          {/* Spring toggle switch */}
          <div
            className="shrink-0 w-10 h-[22px] rounded-full relative"
            style={{
              background: autoSave ? "var(--accent)" : "var(--bg-overlay)",
              border: autoSave ? "none" : "1px solid var(--border)",
              boxShadow: autoSave ? "var(--glow-sm)" : "none",
              transition: "background 0.25s ease, box-shadow 0.25s ease",
            }}
          >
            <div
              className="w-[18px] h-[18px] rounded-full absolute top-[2px]"
              style={{
                background: autoSave ? "#fff" : "var(--text-muted)",
                left: autoSave ? "20px" : "2px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                transition: "left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease",
              }}
            />
          </div>
        </SettingsRow>

        {/* GitHub link */}
        <SettingsRow
          href="https://github.com/tenzin333/deeptrail"
          target="_blank"
          rel="noopener noreferrer"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--bg-overlay)" }}
          >
            <Github size={15} style={{ color: "var(--text-secondary)" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>GitHub</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>View source code</p>
          </div>
          <ExternalLink size={14} style={{ color: "var(--text-muted)" }} />
        </SettingsRow>

        {/* Privacy Policy */}
        <SettingsRow
          href="https://tenzin333.github.io/deep-trail-privacy/DeepTrail_Privacy_Policy.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--bg-overlay)" }}
          >
            <Shield size={15} style={{ color: "var(--text-secondary)" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Privacy Policy</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>How we handle your data</p>
          </div>
          <ExternalLink size={14} style={{ color: "var(--text-muted)" }} />
        </SettingsRow>

        {/* Version */}
        <SettingsRow style={{ borderBottom: "1px solid var(--border)" }}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--bg-overlay)" }}
          >
            <Info size={15} style={{ color: "var(--text-secondary)" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Version</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>DeepTrail Extension</p>
          </div>
          {/* Gradient version badge */}
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-lg shrink-0 text-white"
            style={{
              background: "var(--gradient-accent)",
              fontFamily: "var(--font-mono)",
              boxShadow: "var(--glow-sm)",
            }}
          >
            v1.0.2
          </span>
        </SettingsRow>

        {/* Sign Out */}
        <SettingsRow onClick={onLogout} isDestructive>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--red-muted)" }}
          >
            <LogOut size={15} style={{ color: "var(--red)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--red)" }}>Sign Out</p>
        </SettingsRow>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
          Developed by Tenzin Thinlay
        </p>
      </div>
    </div>
  );
}
