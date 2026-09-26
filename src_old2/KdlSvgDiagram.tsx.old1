import { createMemo, For, Show } from "solid-js";
import type { Node } from "kdljs";

export function KdlSvgDiagram(props: { nodes: Node[] }) {
  // 1. 全データの中から「node」という名前の定義ノードだけを抽出
  const diagramNodes = createMemo(() => {
    return props.nodes.filter(n => n.name === "node");
  });

  // 2. 全データの中から「edge」という名前の接続ノードだけを抽出
  const diagramEdges = createMemo(() => {
    return props.nodes.filter(n => n.name === "edge");
  });

  // 3. 各ノードの配置座標 (X, Y) を自動的にマッピング（今回はシンプルな円形配置ロジック）
  const nodePositions = createMemo(() => {
    const positions: Record<string, { x: number; y: number; label: string; type: string }> = {};
    const list = diagramNodes();
    const total = list.length;
    
    // SVGの中心点と配置半径
    const cx = 250;
    const cy = 200;
    const radius = 120;

    list.forEach((node, index) => {
      // 最初の引数（value）をID、またはnameプロパティをキーにする
      const id = String(node.values?.[0] || node.properties?.id || `node_${index}`);
      const label = String(node.properties?.label || id);
      const type = String(node.properties?.type || "rectangle");

      // 円周上に均等配置するための角度計算
      const angle = total > 1 ? (index / total) * 2 * Math.PI : 0;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      positions[id] = { x, y, label, type };
    });

    return positions;
  });

  // 4. 矢印線のパスデータを生成
  const edgePaths = createMemo(() => {
    const paths: Array<{ d: string; label: string; color: string }> = [];
    const positions = nodePositions();

    diagramEdges().forEach((edge) => {
      const fromId = String(edge.properties?.from || "");
      const toId = String(edge.properties?.to || "");
      const label = String(edge.properties?.label || "");
      const color = String(edge.properties?.color || "#999");

      const fromNode = positions[fromId];
      const toNode = positions[toId];

      if (fromNode && toNode) {
        // ノードの中心を結ぶシンプルな直線パス
        const d = `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;
        paths.push({ d, label, color });
      }
    });

    return paths;
  });

  return (
    <div style={{ background: "#fff", border: "1px solid #ccc", "border-radius": "4px", padding: "10px" }}>
      {/* SVGコンテナ定義 */}
      <svg viewBox="0 0 500 400" width="100%" height="100%" style={{ background: "#fafafa" }}>
        {/* 矢印の先端（マーカー）の定義 */}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#999" />
          </marker>
        </defs>

        {/* 線の描画（エッジ） */}
        <For each={edgePaths()}>
          {(path) => (
            <g>
              <path
                d={path.d}
                fill="none"
                stroke={path.color}
                stroke-width="2"
                marker-end="url(#arrow)"
              />
              {/* 線の上にラベルテキストを配置（簡易版） */}
              <Show when={path.label}>
                <text
                  x={path.d.split(" ")[1]} // 始点と終点の中間付近を簡易計算（必要に応じて最適化）
                  y={path.d.split(" ")[2]}
                  fill={path.color}
                  font-size="10px"
                  text-anchor="middle"
                  dy="-5"
                >
                  {path.label}
                </text>
              </Show>
            </g>
          )}
        </For>

        {/* 丸や四角の描画（ノード） */}
        <For each={Object.entries(nodePositions())}>
          {([id, pos]) => (
            <g transform={`translate(${pos.x}, ${pos.y})`}>
              <Show
                when={pos.type === "circle"}
                fallback={
                  // デフォルト：四角形（中心を合わせるためマイナスオフセット）
                  <rect
                    x="-50"
                    y="-20"
                    width="100"
                    height="40"
                    rx="5"
                    fill="#e1f5fe"
                    stroke="#0076d6"
                    stroke-width="2"
                  />
                }
              >
                {/* 円形ノード */}
                <circle r="30" fill="#efebe9" stroke="#5d4037" stroke-width="2" />
              </Show>

              {/* テキストラベル */}
              <text
                fill="#333"
                font-size="12px"
                font-family="sans-serif"
                text-anchor="middle"
                dominant-baseline="central"
                style={{ "user-select": "none" }}
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

