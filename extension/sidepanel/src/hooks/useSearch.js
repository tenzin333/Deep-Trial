import { useState, useRef } from "react";
import api from "../lib/api";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const search = (value) => {
    setQuery(value);
    setResult(null);

    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!value.trim()) return;

    // 500ms debounce — wait for user to stop typing
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.post("/query", { question: value });
        setResult(res.data);
      } catch (err) {
        console.error("[DeepTrail] Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const clear = () => {
    setQuery("");
    setResult(null);
  };

  return { query, result, loading, search, clear };
}