import { useEffect, useRef, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import AuthForm from "./components/AuthForm";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import GraphView from "./components/GraphView";
import ActivityFeed from "./components/ActivityFeed";
import Settings from "./components/Settings";
import SearchPanel from "./components/SearchPanel";
import { setupInterceptors } from "./lib/api";

const TAB_ORDER = ["graph", "search", "activity", "settings"];

export default function App() {
  const { user, loading, login, register, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("graph");
  const prevTabRef = useRef("graph");
  const [slideDir, setSlideDir] = useState("20px");

  useEffect(() => {
    setupInterceptors(logout);
  }, [logout]);

  const handleTabChange = (newTab) => {
    const prevIndex = TAB_ORDER.indexOf(prevTabRef.current);
    const nextIndex = TAB_ORDER.indexOf(newTab);
    setSlideDir(nextIndex > prevIndex ? "20px" : "-20px");
    prevTabRef.current = newTab;
    setActiveTab(newTab);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: "var(--bg-base)" }}>
        <div className="flex flex-col items-center gap-4">
          {/* Gradient logo spinner */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center relative"
            style={{ background: "var(--gradient-accent)", boxShadow: "var(--glow-md)" }}
          >
            <div
              className="w-5 h-5 rounded-full border-2 border-t-transparent"
              style={{
                borderColor: "rgba(255,255,255,0.6)",
                borderTopColor: "transparent",
                animation: "spin 0.8s linear infinite",
              }}
            />
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading DeepTrail…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onLogin={login} onRegister={register} />;
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--bg-base)" }}>
      <Header email={user.email} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div
          key={activeTab}
          className="animate-tab-in"
          style={{ "--slide-from": slideDir }}
        >
          {activeTab === "graph" && <GraphView />}
          {activeTab === "search" && <SearchPanel />}
          {activeTab === "activity" && <ActivityFeed />}
          {activeTab === "settings" && <Settings onLogout={logout} />}
        </div>
      </main>

      <BottomNav active={activeTab} onChange={handleTabChange} />
    </div>
  );
}
