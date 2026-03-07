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

  return (
    <div
      className="flex flex-col items-center justify-center h-screen px-6 max-w-full"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[120px] opacity-30 pointer-events-none"
        style={{ background: "var(--accent)" }}
      />

      {/* Logo */}
      <div className="relative mb-8 animate-fade-in-up">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: "linear-gradient(135deg, var(--accent), #9F7AEA)",
            boxShadow: "0 8px 32px rgba(108, 142, 239, 0.25)"
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
        <h1 className="text-2xl font-bold text-center" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
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
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Tab toggle */}
        <div
          className="flex rounded-xl p-1 mb-5"
          style={{ background: "var(--bg-overlay)" }}
        >
          {["Sign In", "Sign Up"].map((label, i) => {
            const active = i === 0 ? isLogin : !isLogin;
            return (
              <button
                key={label}
                onClick={() => { setIsLogin(i === 0); setError(""); }}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: active ? "var(--bg-surface)" : "transparent",
                  color: active ? "var(--text-primary)" : "var(--text-muted)",
                  boxShadow: active ? "var(--shadow-sm)" : "none",
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
              className="w-full px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                background: "var(--bg-overlay)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                outline: "none",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
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
              className="w-full px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                background: "var(--bg-overlay)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                outline: "none",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
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

          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-200 mt-2"
            style={{
              background: loading || !email || !password
                ? "var(--bg-overlay)"
                : "var(--accent)",
              color: loading || !email || !password
                ? "var(--text-muted)"
                : "#fff",
              cursor: loading || !email || !password ? "not-allowed" : "pointer",
              boxShadow: loading || !email || !password
                ? "none"
                : "0 4px 16px rgba(108, 142, 239, 0.3)",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: "currentColor", borderTopColor: "transparent" }}
                />
                {isLogin ? "Signing in..." : "Creating account..."}
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