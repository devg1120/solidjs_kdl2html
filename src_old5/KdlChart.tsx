import { createMemo, For, Show } from "solid-js";
import type { Node } from "kdljs";

export function KdlChart(props: { node: Node }) {
  // 1. 子要素から "data" ノードを抽出
  const chartData = createMemo(() => {
    if (!props.node.children) return [];
    return props.node.children
      .filter((n) => n.name === "data" && n.values && n.values.length >= 2)
      .map((n) => ({
        label: String(n.values[0]),
        value: Number(n.values[1]) || 0,
      }));
  });

  // 2. グラフの基本設定
  const chartTitle = () => String(props.node.values[0] || "簡易グラフ");
  const chartType = () => String(props.node.properties?.type || "bar");
  const mainColor = () => String(props.node.properties?.color || "#0076d6");

  // 3. データの合計値を計算（帯グラフの比率計算用）
  const totalValue = createMemo(() => {
    return chartData().reduce((sum, item) => sum + item.value, 0);
  });

  // 4. 帯グラフ用のカラーパレット（明示的な指定がない場合のデフォルト配色）
  const palette = [
    "#0076d6", "#4caf50", "#ff9800", "#e91e63", "#9c27b0", 
    "#00bcd4", "#ffeb3b", "#795548", "#607d8b", "#9e9e9e"
  ];

  // 5. 帯グラフ用の各セグメントの幅と開始位置（X座標）を計算
  const stackedSegments = createMemo(() => {
    const data = chartData();
    const total = totalValue();
    if (total === 0 || data.length === 0) return [];

    let currentX = 0;
    const width = 500; // グラフの全長幅

    return data.map((d, i) => {
      const percentage = (d.value / total) * 100;
      const segmentWidth = (d.value / total) * width;
      const x = currentX;
      currentX += segmentWidth; // 次のセグメントの開始位置を進める

      return {
        label: d.label,
        value: d.value,
        percentage: percentage.toFixed(1),
        x,
        width: segmentWidth,
        color: palette[i % palette.length]
      };
    });
  });

  // 6. 棒・折れ線グラフ用の最大値計算
  const maxValue = createMemo(() => {
    const data = chartData();
    if (data.length === 0) return 1;
    const max = Math.max(...data.map((d) => d.value));
    return max <= 0 ? 1 : max;
  });

  // 共通サイズ定義
  const width = 540;

  // 折れ線グラフ用レイアウト
  const linePadding = { top: 30, right: 40, bottom: 40, left: 50 };
  const lineChartHeight = 220;
  const graphInnerWidth = width - linePadding.left - linePadding.right;
  const graphInnerHeight = lineChartHeight - linePadding.top - linePadding.bottom;

  const points = createMemo(() => {
    const data = chartData();
    if (data.length === 0) return [];
    const stepX = data.length > 1 ? graphInnerWidth / (data.length - 1) : graphInnerWidth / 2;
    return data.map((d, i) => {
      const x = linePadding.left + (data.length > 1 ? i * stepX : graphInnerWidth / 2);
      const y = linePadding.top + graphInnerHeight - (d.value / maxValue()) * graphInnerHeight;
      return { x, y, label: d.label, value: d.value };
    });
  });

  const pathD = createMemo(() => {
    return points().map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  });

  // 棒グラフ用レイアウト
  const rowHeight = 35;
  const barPaddingLeft = 90;
  const barPaddingRight = 40;
  const barChartWidth = width - barPaddingLeft - barPaddingRight;
  const barHeight = createMemo(() => chartData().length * rowHeight + 40);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e0e0e0",
        "border-radius": "6px",
        padding: "16px",
        margin: "12px 0",
        "box-shadow": "0 2px 4px rgba(0,0,0,0.02)",
        "max-width": "560px"
      }}
    >
      {/* グラフタイトル */}
      <h4 style={{ margin: "0 0 12px 0", color: "#333", "font-size": "15px", "border-left": `4px solid ${chartType() === 'percent' ? '#333' : mainColor()}`, "padding-left": "8px" }}>
        {chartTitle()}
      </h4>

      <Show when={chartData().length > 0} fallback={<p style={{ color: "#999", "font-size": "13px" }}>データがありません。</p>}>
        
        {/* 【新規追加】帯グラフ (type="percent") の描画 */}
        <Show when={chartType() === "percent"}>
          <div style={{ "margin-bottom": "10px" }}>
            <svg viewBox="0 0 500 65" width="100%" height="100%">
              {/* 1本に積み上げられた100%横棒 */}
              <g>
                <For each={stackedSegments()}>
                  {(seg) => (
                    <rect
                      x={seg.x}
                      y="5"
                      width={seg.width}
                      height="35"
                      fill={seg.color}
                      style={{ transition: "all 0.3s ease" }}
                    >
                      <title>{`${seg.label}: ${seg.value} (${seg.percentage}%)`}</title>
                    </rect>
                  )}
                </For>
              </g>

              {/* バー内のパーセンテージテキスト（幅が十分に広い場合のみ表示） */}
              <g fill="#fff" font-size="11px" font-weight="bold" text-anchor="middle" dominant-baseline="central">
                <For each={stackedSegments()}>
                  {(seg) => (
                    <Show when={seg.width > 35}>
                      <text x={seg.x + seg.width / 2} y="22.5">
                        {seg.percentage}%
                      </text>
                    </Show>
                  )}
                </For>
              </g>
            </svg>

            {/* 下部に配置するカスタム凡例（レジェンド） */}
            <div style={{ display: "flex", "flex-wrap": "wrap", gap: "12px", "margin-top": "8px", "padding": "0 4px" }}>
              <For each={stackedSegments()}>
                {(seg) => (
                  <div style={{ display: "flex", "align-items": "center", "font-size": "12px", color: "#555" }}>
                    <span style={{ width: "12px", height: "12px", background: seg.color, "border-radius": "3px", "margin-right": "5px", "display": "inline-block" }} />
                    <strong>{seg.label}</strong>
                    <span style={{ color: "#888", "margin-left": "4px" }}>({seg.value}件 / {seg.percentage}%)</span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>

        {/* 折れ線グラフ (type="line") の描画 */}
        <Show when={chartType() === "line"}>
          <svg viewBox={`0 0 ${width} ${lineChartHeight}`} width="100%" height="100%">
            <g stroke="#f3f3f3" stroke-width="1">
              <line x1={linePadding.left} y1={linePadding.top} x2={width - linePadding.right} y2={linePadding.top} />
              <line x1={linePadding.left} y1={linePadding.top + graphInnerHeight * 0.5} x2={width - linePadding.right} y2={linePadding.top + graphInnerHeight * 0.5} stroke-dasharray="3,3" />
              <line x1={linePadding.left} y1={linePadding.top + graphInnerHeight} x2={width - linePadding.right} y2={linePadding.top + graphInnerHeight} stroke="#e0e0e0" />
            </g>
            <text x={linePadding.left - 10} y={linePadding.top + 4} fill="#999" font-size="11px" text-anchor="end">{maxValue()}</text>
            <text x={linePadding.left - 10} y={linePadding.top + graphInnerHeight + 4} fill="#999" font-size="11px" text-anchor="end">0</text>
            <path d={pathD()} fill="none" stroke={mainColor()} stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style={{ transition: "d 0.3s ease" }} />
            <For each={points()}>
              {(pt) => (
                <g>
                  <text x={pt.x} y={lineChartHeight - linePadding.bottom + 20} fill="#666" font-size="11px" text-anchor="middle">{pt.label}</text>
                  <text x={pt.x} y={pt.y - 10} fill="#333" font-size="11px" font-weight="bold" text-anchor="middle">{pt.value}</text>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#fff" stroke={mainColor()} stroke-width="3" />
                </g>
              )}
            </For>
          </svg>
        </Show>

        {/* 従来の棒グラフ (type="bar" または未指定) の描画 */}
        <Show when={chartType() !== "line" && chartType() !== "percent"}>
          <svg viewBox={`0 0 ${width} ${barHeight()}`} width="100%" height="100%">
            <g stroke="#f0f0f0" stroke-width="1">
              <line x1={barPaddingLeft} y1={10} x2={barPaddingLeft} y2={barHeight() - 25} />
              <line x1={barPaddingLeft + barChartWidth * 0.5} y1={10} x2={barPaddingLeft + barChartWidth * 0.5} y2={barHeight() - 25} stroke-dasharray="3,3" />
              <line x1={barPaddingLeft + barChartWidth} y1={10} x2={barPaddingLeft + barChartWidth} y2={barHeight() - 25} />
            </g>
            <For each={chartData()}>
              {(item, index) => {
                const y = createMemo(() => index() * rowHeight + 15);
                const barWidth = createMemo(() => (item.value / maxValue()) * barChartWidth);
                return (
                  <g>
                    <text x={barPaddingLeft - 10} y={y() + 12} fill="#666" font-size="12px" text-anchor="end" dominant-baseline="central">
                      {item.label}
                    </text>
                    <rect x={barPaddingLeft} y={y()} width={barWidth()} height="20" rx="4" fill={mainColor()} style={{ transition: "width 0.3s ease" }} />
                    <text x={barPaddingLeft + barWidth() + 8} y={y() + 12} fill="#333" font-size="12px" font-weight="bold" dominant-baseline="central">
                      {item.value}
                    </text>
                  </g>
                );
              }}
            </For>
          </svg>
        </Show>

      </Show>
    </div>
  );
}
