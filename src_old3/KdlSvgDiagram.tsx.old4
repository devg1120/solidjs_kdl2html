import { createMemo, For, Show } from "solid-js";
import type { Node } from "kdljs";

interface NodeStyleInfo {
  label: string;
  type: string;
  color: string;
  stroke: string;
  textColor: string;
  isDashed: boolean;
}

export function KdlSvgDiagram(props: { nodes: Node[] }) {
  // 1. 各データの抽出
  const diagramNodes = createMemo(() => props.nodes.filter(n => n.name === "node"));
  const diagramEdges = createMemo(() => props.nodes.filter(n => n.name === "edge"));

  // 2. レイアウトの方向（縦か横か）を判定するキャッシュ（デフォルトは縦: vertical）
  const orientation = createMemo(() => {
    const configNode = props.nodes.find(n => n.properties && n.properties.orientation);
    if (configNode && configNode.properties) {
      return String(configNode.properties.orientation) === "horizontal" ? "horizontal" : "vertical";
    }
    return "vertical";
  });

  // 3. 自動レイアウトとスタイルのマッピング計算（縦・横可変アルゴリズム）
  const nodePositions = createMemo(() => {
    const nodesList = diagramNodes();
    const edgesList = diagramEdges();
    const isHorizontal = orientation() === "horizontal";
    
    const nodeMap = new Map<string, NodeStyleInfo>();
    nodesList.forEach((n, index) => {
      const id = n.values && n.values.length > 0 ? String(n.values) : String(n.properties?.id || `n_${index}`);
      const label = String(n.properties?.label || id);
      const type = String(n.properties?.type || "rectangle");
      const color = String(n.properties?.color || (type === "circle" ? "#fbe9e7" : "#e1f5fe"));
      const stroke = String(n.properties?.stroke || (type === "circle" ? "#d84315" : "#0076d6"));
      const textColor = String(n.properties?.text_color || "#333");
      const isDashed = n.properties?.dashed === true || String(n.properties?.dashed) === "true";

      nodeMap.set(id, { label, type, color, stroke, textColor, isDashed });
    });

    const adjList = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodeMap.forEach((_, id) => {
      adjList.set(id, []);
      inDegree.set(id, 0);
    });

    edgesList.forEach(edge => {
      const from = String(edge.properties?.from || "");
      const to = String(edge.properties?.to || "");
      if (nodeMap.has(from) && nodeMap.has(to)) {
        adjList.get(from)!.push(to);
        inDegree.set(to, inDegree.get(to)! + 1);
      }
    });

    // 階層（深さ）決定アルゴリズム
    const nodeLayers = new Map<string, number>();
    const queue: string[] = [];

    nodeMap.forEach((_, id) => {
      if (inDegree.get(id) === 0) {
        nodeLayers.set(id, 0);
        queue.push(id);
      }
    });

    if (queue.length === 0 && nodeMap.size > 0) {
      const firstId = nodeMap.keys().next().value;
      if (firstId) {
        nodeLayers.set(firstId, 0);
        queue.push(firstId);
      }
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentLayer = nodeLayers.get(current) || 0;
      const neighbors = adjList.get(current) || [];
      for (const neighbor of neighbors) {
        const existingLayer = nodeLayers.get(neighbor);
        if (existingLayer === undefined || existingLayer < currentLayer + 1) {
          nodeLayers.set(neighbor, currentLayer + 1);
          queue.push(neighbor);
        }
      }
    }

    const layerGroups = new Map<number, string[]>();
    nodeMap.forEach((_, id) => {
      const layer = nodeLayers.has(id) ? nodeLayers.get(id)! : 0;
      if (!layerGroups.has(layer)) {
        layerGroups.set(layer, []);
      }
      layerGroups.get(layer)!.push(id);
    });

    const positions: Record<string, { x: number; y: number } & NodeStyleInfo> = {};
    const stepDistance = 140; 
    const crossDistance = 80; 

    layerGroups.forEach((nodesInLayer, layerIndex) => {
      const count = nodesInLayer.length;

      nodesInLayer.forEach((id, nodeIndex) => {
        let x = 0;
        let y = 0;

        if (isHorizontal) {
          x = 80 + layerIndex * stepDistance;
          y = count > 1 
            ? 60 + (nodeIndex * crossDistance) + (300 - (count * crossDistance)) / 2 
            : 180; 
        } else {
          y = 60 + layerIndex * stepDistance;
          x = count > 1 ? (600 / (count + 1)) * (nodeIndex + 1) : 300;
        }

        const styleInfo = nodeMap.get(id)!;
        positions[id] = { x, y, ...styleInfo };
      });
    });

    return positions;
  });
  // 4. 計算された座標とレイアウト方向をベースに、矢印（エッジ）のパスを生成
  const edgePaths = createMemo(() => {
    const paths: Array<{ d: string; lx: number; ly: number; label: string; color: string; isDashed: boolean }> = [];
    const positions = nodePositions();
    const isHorizontal = orientation() === "horizontal";

    diagramEdges().forEach((edge) => {
      const fromId = String(edge.properties?.from || "");
      const toId = String(edge.properties?.to || "");
      const label = String(edge.properties?.label || "");
      const color = String(edge.properties?.color || "#666");
      const isDashed = edge.properties?.dashed === true || String(edge.properties?.dashed) === "true";

      const fromNode = positions[fromId];
      const toNode = positions[toId];

      if (fromNode && toNode) {
        let d = "";
        let lx = 0;
        let ly = 0;

        // 【方向別の直角カギ線クランク分岐】
        if (isHorizontal) {
          // 横軸のカギ線：真ん中のX座標（midX）を算出し、縦に曲げてから目的地に直角接続
          if (fromNode.x !== toNode.x) {
            const midX = fromNode.x + (toNode.x - fromNode.x) / 2;
            d = `M ${fromNode.x} ${fromNode.y} L ${midX} ${fromNode.y} L ${midX} ${toNode.y} L ${toNode.x} ${toNode.y}`;
            lx = midX;
            ly = fromNode.y + (toNode.y - fromNode.y) / 2;
          } else {
            d = `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;
            lx = fromNode.x;
            ly = fromNode.y + (toNode.y - fromNode.y) / 2;
          }
        } else {
          // 縦軸のカギ線：真ん中のY座標（midY）を算出し、横に曲げて直角接続
          if (fromNode.y !== toNode.y) {
            const midY = fromNode.y + (toNode.y - fromNode.y) / 2;
            d = `M ${fromNode.x} ${fromNode.y} L ${fromNode.x} ${midY} L ${toNode.x} ${midY} L ${toNode.x} ${toNode.y}`;
            lx = fromNode.x + (toNode.x - fromNode.x) / 2;
            ly = midY;
          } else {
            d = `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;
            lx = fromNode.x + (toNode.x - fromNode.x) / 2;
            ly = fromNode.y;
          }
        }

        paths.push({ d, lx, ly, label, color, isDashed });
      }
    });

    return paths;
  });

  // キャンバスの最大表示領域を動的に確定
  const canvasSize = createMemo(() => {
    const positions = nodePositions();
    const isHorizontal = orientation() === "horizontal";
    let maxX = 600;
    let maxY = 350;

    Object.values(positions).forEach(pos => {
      if (pos.x + 90 > maxX) maxX = pos.x + 90;
      if (pos.y + 70 > maxY) maxY = pos.y + 70;
    });

    return { width: isHorizontal ? Math.max(600, maxX) : 600, height: maxY };
  });

  return (
    <div style={{ background: "#fff", border: "1px solid #ccc", "border-radius": "4px", padding: "10px" }}>
      <svg 
        viewBox={`0 0 ${canvasSize().width} ${canvasSize().height}`} 
        width="100%" 
        height="100%" 
        style={{ background: "#fafafa" }}
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#666" />
          </marker>
        </defs>

        {/* 矢印（エッジ）の描画 */}
        <For each={edgePaths()}>
          {(path) => (
            <g>
              <path
                d={path.d}
                fill="none"
                stroke={path.color}
                stroke-width="2"
                marker-end="url(#arrow)"
                stroke-linejoin="round"
                stroke-dasharray={path.isDashed ? "5,5" : "none"}
              />
              <Show when={path.label}>
                <rect
                  x={path.lx - 35}
                  y={path.ly - 8}
                  width="70"
                  height="16"
                  fill="#fafafa"
                  rx="3"
                />
                <text
                  x={path.lx}
                  y={path.ly}
                  fill="#555"
                  font-size="10px"
                  text-anchor="middle"
                  dominant-baseline="central"
                >
                  {path.label}
                </text>
              </Show>
            </g>
          )}
        </For>

        {/* ノードの描画 */}
        <For each={Object.entries(nodePositions())}>
          {([id, pos]) => (
            <g transform={`translate(${pos.x}, ${pos.y})`}>
              <Show
                when={pos.type === "circle"}
                fallback={
                  <rect
                    x="-55"
                    y="-20"
                    width="110"
                    height="40"
                    rx="6"
                    fill={pos.color}
                    stroke={pos.stroke}
                    stroke-width="2"
                    stroke-dasharray={pos.isDashed ? "4,4" : "none"}
                  />
                }
              >
                <circle 
                  r="25" 
                  fill={pos.color} 
                  stroke={pos.stroke} 
                  stroke-width="2" 
                  stroke-dasharray={pos.isDashed ? "4,4" : "none"}
                />
              </Show>

              <text
                fill={pos.textColor}
                font-size="11px"
                font-family="sans-serif"
                text-anchor="middle"
                dominant-baseline="central"
                style={{ "user-select": "none", "font-weight": "bold" }}
              >
                {pos.label}
              </text>
            </g>
          )}
        </For>
      </svg>
    </div>
  );
}
