// extension/sidepanel/src/hooks/useGraph.js
import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";

export function useGraph() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ nodes: 0, edges: 0 });

  const fetchGraph = useCallback(async () => {
    try {
      const res = await api.get("/graph");
      setNodes(res.data.nodes);
      setEdges(res.data.edges);
      setStats({
        nodes: res.data.nodes.length,
        edges: res.data.edges.length,
      });
    } catch (err) {
      console.error("[DeepTrail] Graph fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll every 30 seconds
  useEffect(() => {
    fetchGraph();
    const interval = setInterval(fetchGraph, 30000);
    return () => clearInterval(interval);
  }, [fetchGraph]);

  return { nodes, edges, stats, loading, refresh: fetchGraph };
}