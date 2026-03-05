// extension/sidepanel/src/components/GraphView.jsx
import { useMemo, useCallback } from "react";
import ReactFlow, { Background, useNodesState, useEdgesState } from "reactflow";
import dagre from "dagre";
import { useGraph } from "../hooks/useGraph";
import "reactflow/dist/style.css";

const nodeWidth = 160;
const nodeHeight = 40;

function getLayoutedElements(nodes, edges) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 30, ranksep: 50 });

  nodes.forEach((node) => g.setNode(node.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return { ...node, position: { x: pos.x - nodeWidth / 2, y: pos.y - nodeHeight / 2 } };
  });

  return { nodes: layoutedNodes, edges };
}

export default function GraphView() {
  const { nodes: graphNodes, edges: graphEdges, loading } = useGraph();

  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    const nodes = graphNodes.map((n) => ({
      id: n.id,
      data: {
        label: (
          <div className="text-xs truncate px-1">
            {n.title || new URL(n.url).hostname}
          </div>
        ),
      },
      style: {
        background: "#24272A",
        border: "1px solid #3B4046",
        borderRadius: "8px",
        color: "#fff",
        fontSize: "11px",
        width: nodeWidth,
        height: nodeHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    }));

    const edges = graphEdges.map((e, i) => ({
      id: `e-${i}`,
      source: e.source,
      target: e.target,
      style: { stroke: "#037DD6", strokeWidth: 1.5, opacity: e.similarity },
      animated: e.similarity > 0.9,
    }));

    if (nodes.length === 0) return { nodes: [], edges: [] };
    return getLayoutedElements(nodes, edges);
  }, [graphNodes, graphEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Update when data changes
  useMemo(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#037DD6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (flowNodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-6">
        <Share2 className="w-10 h-10 text-[#3B4046] mb-3" />
        <p className="text-sm text-[#9FA6AE]">No pages captured yet</p>
        <p className="text-xs text-[#6A737D] mt-1">Browse the web and DeepTrail will build your knowledge graph</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-280px)] w-full min-h-[250px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#3B4046" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}