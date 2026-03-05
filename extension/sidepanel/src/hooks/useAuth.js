import { useState, useEffect } from "react";
import api from "../lib/api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(["token", "email"], (data) => {
      if (data.token && data.email) {
        setUser({ email: data.email, token: data.token });
      }
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.access_token;
    await chrome.storage.local.set({ token, email });
    setUser({ email, token });
  };

  const register = async (email, password) => {
    const res = await api.post("/auth/register", { email, password });
    const token = res.data.access_token;
    await chrome.storage.local.set({ token, email });
    setUser({ email, token });
  };

  const logout = async () => {
    await chrome.storage.local.remove(["token", "email"]);
    setUser(null);
  };

  return { user, loading, login, register, logout };
}