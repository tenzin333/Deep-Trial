import { useState } from "react";

export default function AuthForm({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onRegister(email, password);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !loading && email && password;

  return (
    <div
      className="flex flex-col items-center justify-center h-screen px-6 max-w-full relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Ambient orb 1 — blue, top center */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "var(--accent)",
          filter: "blur(110px)",
          opacity: 0.18,
          animation: "orb-drift-1 8s ease-in-out infinite",
        }}
      />

      {/* Ambient orb 2 — purple, bottom right */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-40px",
          right: "-40px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "#9F7AEA",
          filter: "blur(100px)",
          opacity: 0.14,
          animation: "orb-drift-2 10s ease-in-out infinite",
        }}
      />

      {/* Ambient orb 3 — teal, bottom left */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "20%",
          left: "-30px",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: "#38BDF8",
          filter: "blur(90px)",
          opacity: 0.1,
          animation: "orb-drift-3 7s ease-in-out infinite",
        }}
      />

      {/* Logo */}
      <div className="relative mb-8 animate-fade-in-up">
        {/* Floating logo icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: "var(--gradient-accent)",
            boxShadow: "0 8px 32px rgba(108, 142, 239, 0.3), 0 0 0 1px rgba(108,142,239,0.15)",
            animation: "float 3s ease-in-out infinite",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <line x1="12" y1="3" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="21"/>
            <line x1="3" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="21" y2="12"/>
            <line x1="5.6" y1="5.6" x2="7.8" y2="7.8"/>
            <line x1="16.2" y1="16.2" x2="18.4" y2="18.4"/>
            <line x1="5.6" y1="18.4" x2="7.8" y2="16.2"/>
            <line x1="16.2" y1="7.8" x2="18.4" y2="5.6"/>
          </svg>
        </div>
        <h1
          className="text-2xl font-bold text-center"
          style={{
            letterSpacing: "-0.04em",
            background: "var(--gradient-accent)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          DeepTrail
        </h1>
        <p className="text-sm text-center mt-1.5" style={{ color: "var(--text-muted)" }}>
          Your AI-powered research memory
        </p>
      </div>

      {/* Form card */}
      <div
        className="w-full animate-fade-in-up delay-1 rounded-2xl p-5"
        style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg), 0 0 0 1px rgba(108,142,239,0.04)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Tab toggle */}
        <div
          className="flex rounded-xl p-1 mb-5 relative"
          style={{ background: "var(--bg-overlay)" }}
        >
          {/* Sliding active background */}
          <div
            className="absolute top-1 bottom-1 rounded-lg transition-all"
            style={{
              background: "var(--bg-surface)",
              boxShadow: "var(--shadow-sm)",
              left: isLogin ? "4px" : "calc(50% + 2px)",
              width: "calc(50% - 6px)",
              transition: "left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
          {["Sign In", "Sign Up"].map((label, i) => {
            const active = i === 0 ? isLogin : !isLogin;
            return (
              <button
                key={label}
                onClick={() => { setIsLogin(i === 0); setError(""); }}
                className="flex-1 py-2 rounded-lg text-sm font-medium relative z-10 transition-colors duration-200"
                style={{
                  color: active ? "var(--text-primary)" : "var(--text-muted)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm"
              style={{
                background: "var(--bg-overlay)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                outline: "none",
                fontFamily: "var(--font-sans)",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--accent)";
                e.target.style.boxShadow = "var(--glow-sm)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm"
              style={{
                background: "var(--bg-overlay)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                outline: "none",
                fontFamily: "var(--font-sans)",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--accent)";
                e.target.style.boxShadow = "var(--glow-sm)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs animate-fade-in"
              style={{
                background: "var(--red-muted)",
                color: "var(--red)",
                border: "1px solid rgba(239, 107, 115, 0.15)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          {/* Submit button with shimmer effect */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="shimmer-btn w-full py-2.5 rounded-xl font-medium text-sm mt-2"
            style={{
              background: canSubmit ? "var(--gradient-accent)" : "var(--bg-overlay)",
              color: canSubmit ? "#fff" : "var(--text-muted)",
              cursor: canSubmit ? "pointer" : "not-allowed",
              border: "none",
              boxShadow: canSubmit ? "0 4px 20px rgba(108, 142, 239, 0.35), 0 1px 0 rgba(255,255,255,0.1) inset" : "none",
              transition: "background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => canSubmit && (e.currentTarget.style.transform = "scale(1.01)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={(e) => canSubmit && (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => canSubmit && (e.currentTarget.style.transform = "scale(1.01)")}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2.5">
                {/* Three animated dots */}
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.8)",
                      animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </span>
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
