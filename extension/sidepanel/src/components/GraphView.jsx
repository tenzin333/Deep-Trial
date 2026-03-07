import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import dagre from "dagre";
import { Search, X, Share2, ExternalLink, ChevronUp, ChevronDown, ArrowRight, Trash2 } from "lucide-react";
import { useGraph } from "../hooks/useGraph";
import "reactflow/dist/style.css";

const NODE_W = 172;
const NODE_H = 46;

/* ─── dagre layout ─── */
function layoutElements(rawNodes, rawEdges) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 40, ranksep: 60 });

  rawNodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  rawEdges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);

  const nodes = rawNodes.map((n) => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 } };
  });
  return { nodes, edges: rawEdges };
}

/* ─── helpers ─── */
function getConnectedIds(nodeId, edges) {
  const ids = new Set([nodeId]);
  edges.forEach((e) => {
    if (e.source === nodeId) ids.add(e.target);
    if (e.target === nodeId) ids.add(e.source);
  });
  return ids;
}

function hostname(url) {
  try { return new URL(url).hostname.replace("www.", ""); }
  catch { return "Untitled"; }
}

/* ─── flow styles ─── */
const nodeStyle = (highlight) => ({
  background: highlight === "active"
    ? "var(--bg-overlay)"
    : "var(--bg-surface)",
  border: highlight === "active"
    ? "2px solid var(--accent)"
    : highlight === "connected"
      ? "1px solid var(--border-active)"
      : "1px solid var(--border)",
  borderRadius: "14px",
  width: NODE_W,
  height: NODE_H,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: highlight === "dimmed" ? 0.18 : 1,
  boxShadow: highlight === "active"
    ? "0 0 20px rgba(108, 142, 239, 0.2), 0 4px 12px rgba(0,0,0,0.3)"
    : highlight === "connected"
      ? "0 2px 8px rgba(0,0,0,0.25)"
      : "0 1px 4px rgba(0,0,0,0.15)",
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
});

const edgeStyle = (highlight) => ({
  stroke: highlight === "active" || highlight === "connected"
    ? "var(--accent)"
    : "var(--text-muted)",
  strokeWidth: highlight === "active" ? 2.5 : highlight === "connected" ? 1.8 : 1.2,
  opacity: highlight === "dimmed" ? 0.08 : highlight === "active" ? 1 : 0.5,
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
});

const labelStyle = (highlight) => ({
  fontSize: "11px",
  fontFamily: "var(--font-sans)",
  fontWeight: highlight === "active" ? 600 : 500,
  color: highlight === "active"
    ? "var(--accent)"
    : highlight === "dimmed"
      ? "var(--text-muted)"
      : "var(--text-primary)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  padding: "0 10px",
  letterSpacing: "-0.01em",
  transition: "color 0.35s ease",
});

/* ─────────────────────────────────────────────────
   NodeDetailPanel — compact expandable peek bar
   ───────────────────────────────────────────────── */
function NodeDetailPanel({ node, connectedNodes, onClose, onNavigate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const hasMeta = node.summary || (node.keywords && node.keywords.length > 0) || connectedNodes.length > 0;

  const handleDelete = async () => {
    setDeleting(true);
    const result = await onDelete(node.id);
    if (!result.success) {
      setDeleting(false);
      setConfirmDelete(false);
    }
    setDeleting(false)
    // If success, the parent will unmount this panel by clearing activeNodeId
  };

  return (
    <div
      className="absolute bottom-3 left-3 right-3 z-10"
      style={{
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(19, 21, 23, 0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: confirmDelete ? "1px solid rgba(239, 107, 115, 0.3)" : "1px solid var(--border)",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.4)",
          transition: "border-color 0.2s ease",
        }}
      >
        {/* ── Delete confirmation overlay ── */}
        {confirmDelete && (
          <div className="px-3.5 py-3 flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--red-muted)" }}
            >
              <Trash2 size={13} style={{ color: "var(--red)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                Remove this page?
              </p>
              <p className="text-[10px] mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                {node.title || hostname(node.url)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors duration-150"
                style={{
                  background: "var(--bg-surface)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-surface)")}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150"
                style={{
                  background: deleting ? "var(--red-muted)" : "var(--red)",
                  color: "#fff",
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? (
                  <span className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full border-[1.5px] border-t-transparent animate-spin"
                      style={{ borderColor: "#fff", borderTopColor: "transparent" }}
                    />
                    Deleting
                  </span>
                ) : "Delete"}
              </button>
            </div>
          </div>
        )}

        {/* ── Peek bar (hidden during confirm) ── */}
        {!confirmDelete && (
          <div className="flex items-center gap-2.5 px-3.5 py-3">
            {/* Accent dot */}
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: "var(--accent)", boxShadow: "0 0 8px rgba(108, 142, 239, 0.4)" }}
            />

            {/* Title + host */}
            <div className="min-w-0 flex-1">
              <p
                className="text-[12px] font-semibold truncate leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {node.title || "Untitled"}
              </p>
              <p className="text-[10px] truncate leading-tight mt-0.5" style={{ color: "var(--text-muted)" }}>
                {hostname(node.url)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Open in new tab */}
              <a
                href={node.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg transition-colors duration-150"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                title="Open page"
              >
                <ExternalLink size={13} />
              </a>

              {/* Delete */}
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded-lg transition-colors duration-150"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--red-muted)";
                  e.currentTarget.style.color = "var(--red)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-muted)";
                }}
                title="Delete page"
              >
                <Trash2 size={13} />
              </button>

              {/* Expand / collapse */}
              {hasMeta && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-1.5 rounded-lg transition-colors duration-150"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  title={expanded ? "Collapse" : "Show details"}
                >
                  {expanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
                </button>
              )}

              {/* Close */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg transition-colors duration-150"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                title="Close"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        )}

        {/* ── Expanded section ── */}
        <div
          style={{
            maxHeight: expanded ? "240px" : "0px",
            opacity: expanded ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease",
          }}
        >
          <div className="px-3.5 pb-3.5" style={{ borderTop: "1px solid var(--border)" }}>
            {/* Summary */}
            {node.summary && (
              <p
                className="text-[11px] leading-relaxed mt-3"
                style={{
                  color: "var(--text-secondary)",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {node.summary}
              </p>
            )}

            {/* Keywords — inline chips */}
            {node.keywords && node.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2.5">
                {node.keywords.slice(0, 5).map((kw, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-medium px-1.5 py-0.5 rounded-md"
                    style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}

            {/* Connected nodes — horizontal scroll */}
            {connectedNodes.length > 0 && (
              <div className="mt-3">
                <p
                  className="text-[9px] font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {connectedNodes.length} linked
                </p>
                <div
                  className="flex gap-1.5 overflow-x-auto pb-1"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <style>{`
                    .connected-scroll::-webkit-scrollbar { display: none; }
                  `}</style>
                  {connectedNodes.map((cn) => (
                    <button
                      key={cn.id}
                      onClick={() => onNavigate(cn.id)}
                      className="connected-scroll flex items-center gap-1.5 shrink-0 pl-2 pr-2.5 py-1.5 rounded-lg transition-all duration-150"
                      style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        maxWidth: "160px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-active)";
                        e.currentTarget.style.background = "var(--bg-overlay)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.background = "var(--bg-surface)";
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: "var(--green)" }}
                      />
                      <span
                        className="text-[10px] font-medium truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {cn.title || hostname(cn.url)}
                      </span>
                      <ArrowRight size={9} className="shrink-0" style={{ color: "var(--text-muted)" }} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   GraphInner — needs ReactFlow context
   ───────────────────────────────────────────────── */
function GraphInner({ graphNodes, graphEdges, loading, onDelete }) {
  const { fitView, setCenter } = useReactFlow();

  const [query, setQuery] = useState("");
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);

  /* connected set for active node */
  const connectedIds = useMemo(() => {
    if (!activeNodeId) return null;
    return getConnectedIds(
      activeNodeId,
      graphEdges.map((e, i) => ({ id: `e-${i}`, source: e.source, target: e.target }))
    );
  }, [activeNodeId, graphEdges]);

  /* search matches */
  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return graphNodes
      .filter((n) => {
        const title = (n.title || "").toLowerCase();
        const url = (n.url || "").toLowerCase();
        const keywords = (n.keywords || []).join(" ").toLowerCase();
        const summary = (n.summary || "").toLowerCase();
        return title.includes(q) || url.includes(q) || keywords.includes(q) || summary.includes(q);
      })
      .slice(0, 8);
  }, [query, graphNodes]);

  /* build flow elements */
  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(() => {
    const nodes = graphNodes.map((n) => {
      let highlight = "normal";
      if (connectedIds) {
        if (n.id === activeNodeId) highlight = "active";
        else if (connectedIds.has(n.id)) highlight = "connected";
        else highlight = "dimmed";
      }

      return {
        id: n.id,
        data: {
          label: <div style={labelStyle(highlight)}>{n.title || hostname(n.url)}</div>,
          raw: n,
        },
        style: nodeStyle(highlight),
      };
    });

    const edges = graphEdges.map((e, i) => {
      let highlight = "normal";
      if (connectedIds) {
        const srcMatch = connectedIds.has(e.source);
        const tgtMatch = connectedIds.has(e.target);
        if ((e.source === activeNodeId || e.target === activeNodeId) && srcMatch && tgtMatch) {
          highlight = "active";
        } else if (srcMatch && tgtMatch) {
          highlight = "connected";
        } else {
          highlight = "dimmed";
        }
      }

      return {
        id: `e-${i}`,
        source: e.source,
        target: e.target,
        style: edgeStyle(highlight),
        animated: highlight === "active",
      };
    });

    if (nodes.length === 0) return { nodes: [], edges: [] };
    return layoutElements(nodes, edges);
  }, [graphNodes, graphEdges, activeNodeId, connectedIds]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);

  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges, setNodes, setEdges]);

  /* zoom to a selected node */
  const focusNode = useCallback(
    (nodeId) => {
      setActiveNodeId(nodeId);
      setShowResults(false);

      const target = layoutNodes.find((n) => n.id === nodeId);
      if (target) {
        setTimeout(() => {
          setCenter(
            target.position.x + NODE_W / 2,
            target.position.y + NODE_H / 2,
            { zoom: 1.6, duration: 600 }
          );
        }, 50);
      }
    },
    [layoutNodes, setCenter]
  );

  /* clear everything */
  const clearSelection = useCallback(() => {
    setQuery("");
    setActiveNodeId(null);
    setShowResults(false);
    setTimeout(() => fitView({ duration: 500, padding: 0.2 }), 50);
  }, [fitView]);

  /* click on graph background */
  const onPaneClick = useCallback(() => {
    if (activeNodeId) {
      setActiveNodeId(null);
      setTimeout(() => fitView({ duration: 400, padding: 0.2 }), 50);
    }
  }, [activeNodeId, fitView]);

  /* click a flow node */
  const onNodeClick = useCallback(
    (_, node) => {
      if (activeNodeId === node.id) {
        setActiveNodeId(null);
        setTimeout(() => fitView({ duration: 400, padding: 0.2 }), 50);
      } else {
        focusNode(node.id);
      }
    },
    [activeNodeId, focusNode, fitView]
  );

  /* handle delete */
  const handleDelete = useCallback(
    async (nodeId) => {
      const result = await onDelete(nodeId);
      if (result.success) {
        setActiveNodeId(null);
        setQuery("");
        setTimeout(() => fitView({ duration: 500, padding: 0.2 }), 100);
      }
      return result;
    },
    [onDelete, fitView]
  );

  /* ─── derived data for detail panel ─── */
  const activeNode = useMemo(
    () => graphNodes.find((n) => n.id === activeNodeId),
    [activeNodeId, graphNodes]
  );

  const connectedNodes = useMemo(() => {
    if (!connectedIds || !activeNodeId) return [];
    return graphNodes.filter((n) => connectedIds.has(n.id) && n.id !== activeNodeId);
  }, [connectedIds, activeNodeId, graphNodes]);

  /* ─── render ─── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (graphNodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "var(--accent-muted)" }}
        >
          <Share2 size={20} style={{ color: "var(--accent)" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          No pages captured yet
        </p>
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Browse the web and DeepTrail will build your knowledge graph automatically
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 180px)", minHeight: "300px" }}>
      {/* ── search bar ── */}
      <div className="absolute top-3 left-3 right-3 z-10">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: query ? "var(--accent)" : "var(--text-muted)" }}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search your knowledge graph..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
              if (!e.target.value) setActiveNodeId(null);
            }}
            onFocus={() => query && setShowResults(true)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm transition-all duration-200"
            style={{
              background: "rgba(19, 21, 23, 0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: query
                ? "1px solid var(--border-active)"
                : "1px solid var(--border)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-sans)",
              outline: "none",
              boxShadow: "var(--shadow-lg)",
            }}
          />
          {query && (
            <button
              onClick={clearSelection}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md"
            >
              <X size={14} style={{ color: "var(--text-muted)" }} />
            </button>
          )}
        </div>

        {/* ── search results dropdown ── */}
        {showResults && query && matches.length > 0 && (
          <div
            className="mt-1.5 rounded-xl overflow-hidden animate-fade-in"
            style={{
              background: "rgba(19, 21, 23, 0.95)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
              maxHeight: "260px",
              overflowY: "auto",
            }}
          >
            <div className="px-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {matches.length} result{matches.length !== 1 ? "s" : ""}
              </span>
            </div>
            {matches.map((node) => (
              <button
                key={node.id}
                onClick={() => focusNode(node.id)}
                className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left transition-colors duration-150"
                style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-overlay)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                  style={{ background: "var(--accent)" }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {node.title || "Untitled"}
                  </p>
                  <p className="text-[10px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {hostname(node.url)}
                  </p>
                  {node.keywords && node.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {node.keywords.slice(0, 3).map((kw, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-medium px-1.5 py-0.5 rounded-md"
                          style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* no results */}
        {showResults && query && matches.length === 0 && (
          <div
            className="mt-1.5 rounded-xl px-4 py-5 text-center animate-fade-in"
            style={{
              background: "rgba(19, 21, 23, 0.95)",
              backdropFilter: "blur(16px)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              No matching pages found
            </p>
          </div>
        )}
      </div>

      {/* ── detail panel ── */}
      {activeNode && (
        <NodeDetailPanel
          key={activeNodeId}
          node={activeNode}
          connectedNodes={connectedNodes}
          onClose={clearSelection}
          onNavigate={focusNode}
          onDelete={handleDelete}
        />
      )}

      {/* ── react flow canvas ── */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={3}
      >
        <Background color="rgba(255,255,255,0.025)" gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}

/* ─── wrapper ─── */
export default function GraphView() {
  const { nodes, edges, loading, deleteNode } = useGraph();

  return (
    <ReactFlowProvider>
      <GraphInner graphNodes={nodes} graphEdges={edges} loading={loading} onDelete={deleteNode} />
    </ReactFlowProvider>
  );
}