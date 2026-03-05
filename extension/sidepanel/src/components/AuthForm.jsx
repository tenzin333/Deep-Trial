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
    <div className="flex flex-col items-center justify-center h-screen bg-[#141618] px-6 max-w-md mx-auto">
      {/* Logo */}
      <div className="w-16 h-16 rounded-full bg-[#037DD6] flex items-center justify-center mb-4">
        <span className="text-2xl font-bold text-white">D</span>
      </div>
      <h1 className="text-xl font-bold text-white mb-1">DeepTrail</h1>
      <p className="text-sm text-[#9FA6AE] mb-8">Your AI Research Memory</p>

      {/* Form */}
      <div className="w-full space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[#24272A] border border-[#3B4046] text-white placeholder-[#6A737D] text-sm focus:outline-none focus:border-[#037DD6]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full px-4 py-3 rounded-lg bg-[#24272A] border border-[#3B4046] text-white placeholder-[#6A737D] text-sm focus:outline-none focus:border-[#037DD6]"
        />

        {error && (
          <p className="text-xs text-[#D73847] text-center">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className="w-full py-3 rounded-full bg-[#037DD6] hover:bg-[#0260A4] text-white font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : isLogin ? "Sign In" : "Create Account"}
        </button>
      </div>

      {/* Toggle */}
      <button
        onClick={() => { setIsLogin(!isLogin); setError(""); }}
        className="mt-6 text-sm text-[#037DD6] hover:underline"
      >
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}