import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import AuthForm from "./components/AuthForm";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import GraphView from "./components/GraphView";
import SearchPanel from "./components/SearchPanel";
import ActivityFeed from "./components/ActivityFeed";
import Settings from "./components/Settings";

export default function App() {
  const { user, loading, login, register, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("graph");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#141618]">
        <div className="w-8 h-8 border-2 border-[#037DD6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm onLogin={login} onRegister={register} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#141618]">
      <Header email={user.email} />

      <main className="flex-1 overflow-y-auto">
        {activeTab === "graph" && <GraphView />}
        {activeTab === "search" && <SearchPanel />}
        {activeTab === "activity" && <ActivityFeed />}
        {activeTab === "settings" && <Settings onLogout={logout} />}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}