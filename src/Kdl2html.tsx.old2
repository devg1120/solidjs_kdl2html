import { createSignal, createMemo, For, Show } from "solid-js";
import { parse } from "kdljs";
import type { Node } from "kdljs";

// 1. 各ノードを表示する子コンポーネント
function KdlNodeView(props: { node: Node }) {
  return (
    <li style={{ "margin-bottom": "8px" }}>
      <strong style={{ color: "#0076d6" }}>{props.node.name}</strong>
      
      <Show when={props.node.values && props.node.values.length > 0}>
        <span style={{ color: "#d32f2f", "margin-left": "8px" }}>
          {props.node.values.map(v => String(v)).join(", ")}
        </span>
      </Show>

      <Show when={props.node.properties && Object.keys(props.node.properties).length > 0}>
        <span style={{ color: "#4caf50", "margin-left": "8px", "font-style": "italic" }}>
          {Object.entries(props.node.properties).map(([k, v]) => `${k}=${v}`).join(" ")}
        </span>
      </Show>

      <Show when={props.node.children && props.node.children.length > 0}>
        <ul style={{ "padding-left": "20px", "margin-top": "4px", "list-style-type": "circle" }}>
          <For each={props.node.children}>
            {(childNode) => <KdlNodeView node={childNode} />}
          </For>
        </ul>
      </Show>
    </li>
  );
}

// 2. メインコンポーネント

export default function KdlToHtmlApp() {
  const [kdlInput, setKdlInput] = createSignal(`
site "My Tech Blog" {
    author "John Doe" email="john@example.com"
}
  `.trim());

/*
export default function KdlToHtmlApp() {
  const [kdlInput, setKdlInput] = createSignal(`
project "ポートフォリオサイト制作" status="進行中" {
    backlog {
        task "デザインの作成" priority="high" cost=5
        task "ドメインの取得" priority="low" cost=1
    }
    todo {
        task "SolidJSのセットアップ" priority="medium" cost=2
        task "kdljsのインテグレーション" priority="high" cost=3
    }
    in-progress {
        task "コンポーネントの再帰レンダラーの実装" priority="high" cost=4
    }
    done {
        task "Viteプロジェクトの立ち上げ" cost=1
    }
}
  `.trim());
*/

  // パースの生データをそのまま保持する（構造確認用）
  const rawParseResult = createMemo(() => {
    try {
      return parse(kdlInput());
    } catch (e: any) {
      return { debug_error: e.message || String(e) };
    }
  });

  // ループに回すための純粋な配列を抽出
  const parsedNodes = createMemo<Node[]>(() => {
    const result = rawParseResult();
    if (!result) return [];
    if ("debug_error" in result) return [];
    
    // オブジェクトの中に { output: [...] } がある場合
    if (typeof result === "object" && "output" in result) {
      return (result as any).output || [];
    }
    // 直接配列が返ってきている場合
    return Array.isArray(result) ? result : [];
  });

  return (
    <div style={{ padding: "20px", "font-family": "sans-serif" }}>
      <h2>SolidJS + kdljs 動作確認ボード</h2>
      
      <div style={{ display: "flex", gap: "20px" }}>
        {/* 左側: 入力エリア */}
        <div style={{ flex: 1 }}>
          <h3>KDL 入力</h3>
          <textarea
            value={kdlInput()}
            onInput={(e) => setKdlInput(e.currentTarget.value)}
            rows={8}
            style={{ width: "100%", "font-family": "monospace", padding: "10px" }}
          />
        </div>

        {/* 右側: 構築されたHTML DOM */}
        <div style={{ flex: 1, border: "2px solid #333", padding: "15px", "border-radius": "8px", "background-color": "#fafafa" }}>
          <h3>変換されたHTML DOM</h3>
          
          {/* 【チェック1】コンポーネント自体が生きているか確認用の固定文字 */}
          <div style={{ background: "#e0f7fa", padding: "5px", "margin-bottom": "10px", "font-size": "12px" }}>
            🟢 枠線の描画システムは正常に動作しています
          </div>

          <Show 
            when={parsedNodes().length > 0} 
            fallback={
              <div style={{ color: "#666" }}>
                <p>⚠️ 表示できる有効なノードがありません。</p>
                <p>現在の生パースデータ（デバッグ用）:</p>
                <pre style={{ background: "#eee", padding: "8px" }}>
                  {JSON.stringify(rawParseResult(), null, 2)}
                </pre>
              </div>
            }
          >
            {/* HTMLツリーを構築 */}
            <ul style={{ "list-style-type": "square", "padding-left": "20px" }}>
              <For each={parsedNodes()}>
                {(node) => <KdlNodeView node={node} />}
              </For>
            </ul>
          </Show>
        </div>
      </div>
    </div>
  );
}

