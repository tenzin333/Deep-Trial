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

  const deleteNode = useCallback(async (nodeId) => {
    try {
      await api.delete(`/nodes/${nodeId}`)

      setNodes((prevData) => {
        const updated = prevData.filter((item) => item.id != nodeId)
        setStats((s) => ({ ...s, nodes: updated.length }));
        return updated
      })
      setEdges((prevData) => {
        const updated = prevData.filter((item) => item.source != nodeId && item.target != nodeId)
        setStats((s) => ({ ...s, edges: updated.length }));
        return updated
      })
      return { success: True }
    } catch (error) {
      console.error("[DeepTrail] Delete node failed:", error); return { success: false, error: error.response?.data?.detail || "Failed to delete" };
    }
  }, [])

  const clearAll = useCallback( async() => {
    try{
      await api.delete("/nodes/clearAll");
      setNodes([])
      setEdges([])
      setStats([])
    }catch(error){
      console.error("[DeepTrail] Delete node failed:", error); return { success: false, error: error.response?.data?.detail || "Failed to delete" };
    }
  }, [])

  // Poll every 30 seconds
  useEffect(() => {
    fetchGraph();
    const interval = setInterval(fetchGraph, 30000);
    return () => clearInterval(interval);
  }, [fetchGraph]);

  return { nodes, edges, stats, loading, refresh: fetchGraph, deleteNode, clearAll };
}