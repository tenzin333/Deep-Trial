import { useEffect, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import AuthForm from "./components/AuthForm";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import GraphView from "./components/GraphView";
import ActivityFeed from "./components/ActivityFeed";
import Settings from "./components/Settings";
import { setupInterceptors } from "./lib/api";

export default function App() {
  const { user, loading, login, register, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("graph");
  
   useEffect(() => {
    setupInterceptors(logout);
  }, [logout]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: "var(--bg-base)" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent-muted)" }}
          >
            <div
              className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
            />
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading...</p>
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

      <main className="flex-1 overflow-y-auto">
        <div key={activeTab} className="animate-fade-in">
          {activeTab === "graph" && <GraphView />}
          {activeTab === "activity" && <ActivityFeed />}
          {activeTab === "settings" && <Settings onLogout={logout} />}
        </div>
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}