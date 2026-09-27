import { createSignal, createMemo, For, Show, onMount } from "solid-js";
import { parse } from "kdljs";
import type { Node } from "kdljs";
import { Docs } from "./Docs";

import { KdlEditor } from "./KdlEditor";

import { KdlTableView } from "./KdlView";
import { KdlTableView_Raw } from "./KdlView";
import { KdlNodeView } from "./KdlView";
import { KdlNodeView_Raw } from "./KdlView";

import { KdlSvgDiagram } from "./KdlSvgDiagram";

// 2. メインコンポーネント
export default function KdlToHtmlApp() {
  const [selectedValue, setSelectedValue] = createSignal(0);

  const [isDebug, setIsDebug] = createSignal(false);
  const toggle_debug = () => setIsDebug(!isDebug());

  const [isShowRaw, setIsShowRaw] = createSignal(false);
  const toggle_ShowRaw = () => setIsShowRaw(!isShowRaw());

  const options = [];

  for (let i = 0; i < Docs.length; i++) {
    options.push({
      value: i,
      label: Docs[i].title,
    });
  }

  const [kdlInput, setKdlInput] = createSignal(Docs[selectedValue()].code);

  onMount(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
  });

  const [leftWidth, setLeftWidth] = createSignal(50);
  let containerRef: HTMLDivElement | undefined;

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef) return;
      const rect = containerRef.getBoundingClientRect();
      const newWidth = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.max(10, Math.min(90, newWidth)));
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // パースの生データを保持する
  const rawParseResult = createMemo(() => {
    try {
      const result = parse(kdlInput());
      if (
        result &&
        typeof result === "object" &&
        "errors" in result &&
        Array.isArray(result.errors) &&
        result.errors.length > 0
      ) {
        const firstError = result.errors[0];
        const line =
          firstError.token?.startLine ||
          firstError.previousToken?.startLine ||
          firstError.line ||
          null;
        const column =
          firstError.token?.startColumn ||
          firstError.previousToken?.startColumn ||
          firstError.column ||
          null;

        return {
          debug_error: firstError.message || "KDL構文エラーが発生しました",
          error_line: line,
          error_column: column,
        };
      }
      return result;
    } catch (e: any) {
      const errorMsg = e.message || String(e);
      const lineMatch =
        errorMsg.match(/line\s*(\d+)/i) || errorMsg.match(/(\d+):/);
      const colMatch =
        errorMsg.match(/column\s*(\d+)/i) ||
        (lineMatch ? errorMsg.match(/:\s*(\d+)/) : null);
      return {
        debug_error: errorMsg,
        error_line:
          e.token?.startLine ||
          e.line ||
          (lineMatch ? parseInt(lineMatch, 10) : null),
        error_column:
          e.token?.startColumn ||
          e.column ||
          (colMatch ? parseInt(colMatch, 10) : null),
      };
    }
  });

  // エラーオブジェクトの判定シグナル
  const parseError = createMemo(() => {
    const result = rawParseResult();
    if (result && typeof result === "object" && "debug_error" in result) {
      return result as {
        debug_error: string;
        error_line: number | null;
        error_column: number | null;
      };
    }
    return null;
  });

  // 多層セーフティネットによる配列抽出
  const parsedNodes = createMemo<Node[]>(() => {
    const result = rawParseResult();
    if (!result || "debug_error" in result) return [];

    if (Array.isArray(result)) return result;

    if (typeof result === "object") {
      if (
        "output" in result &&
        result.output &&
        typeof result.output === "object" &&
        "nodes" in result.output
      ) {
        return (result.output as any).nodes || [];
      }
      if ("nodes" in result) {
        return (result as any).nodes || [];
      }
      if ("output" in result && Array.isArray(result.output)) {
        return result.output;
      }
    }
    return [];
  });

  // 最上位ルートのレイアウト判定（プロパティがあり、かつ「子要素を1つも持たないフラットなデータ行である場合」のみテーブル化を許可）
  const isRootTable = createMemo(() => {
    const nodes = parsedNodes();
    return (
      nodes.length > 0 &&
      nodes.every(
        (node) =>
          node.properties &&
          Object.keys(node.properties).length > 0 &&
          (!node.children || node.children.length === 0),
      )
    );
  });
/*
  const isDiagramData = createMemo(() => {
    const nodes = parsedNodes();
    return nodes.some((n) => n.name === "node" || n.name === "edge");
  });
*/
  // 1. isDiagramData の判定を修正 (ルート直下、または svg ノードの子要素に node/edge があるか)
  const isDiagramData = createMemo(() => {
    const nodes = parsedNodes();
    // ルート直下に node/edge があるか
    const hasDirectDiagram = nodes.some((n) => n.name === "node" || n.name === "edge");
    if (hasDirectDiagram) return true;

    // もしルートに 'svg' ノードがあれば、その子要素もチェックする
    const svgNode = nodes.find((n) => n.name === "svg");
    if (svgNode && svgNode.children) {
      return svgNode.children.some((n) => n.name === "node" || n.name === "edge" || n.name === "diagram");
    }

    return false;
  });

  // 2. KdlSvgDiagram に渡すノード配列を調整する用のメモを定義
  const diagramTargetNodes = createMemo<Node[]>(() => {
    const nodes = parsedNodes();
    const svgNode = nodes.find((n) => n.name === "svg");
    
    // svg { ... } で囲まれている場合は、その中の children をフラットにして渡す
    // ついでに orientation 設定を持つ "diagram" ノードの情報等も一緒に引き渡す
    if (svgNode && svgNode.children) {
      return svgNode.children;
    }
    return nodes;
  });

  return (
    <div
      style={{
        border: "solid red 1px",
        padding: "10px",
        "font-family": "sans-serif",
        height: "100vh",
        "box-sizing": "border-box",
        display: "flex",
        "flex-direction": "column",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0" }}>SolidJS + kdljs 動作確認ボード</h3>

      <div style={{ "margin-bottom": "10px" }}>
        <select
          style={{
            padding: "6px 20px",
            "background-color": "#f1f1f1",
            "font-size": "16px",
            color: "blue",
          }}
          value={selectedValue()}
          onChange={(e) => {
            setSelectedValue(Number(e.currentTarget.value));
            setKdlInput(Docs[Number(e.currentTarget.value)].code);
          }}
        >
          <For each={options}>
            {(item) => <option value={item.value}>{item.label}</option>}
          </For>
        </select>
        <button
          onClick={toggle_debug}
          style={{
            "background-color": isDebug() ? "gray" : "#ffffff",
            color: isDebug() ? "#ffffff" : "gray",
            margin: "0px 0px 0px 30px",
            padding: "6px 20px",
            border: "none",
            "border-radius": "3px",
            cursor: "pointer",
            "font-size": "14px",
            transition: "background-color 0.3s",
          }}
        >
          {isDebug() ? "Debug" : "no Debug"}
        </button>
        <button
          onClick={toggle_ShowRaw}
          style={{
            "background-color": isShowRaw() ? "gray" : "#ffffff",
            color: isShowRaw() ? "#ffffff" : "gray",
            margin: "0px 0px 0px 30px",
            padding: "6px 20px",
            border: "none",
            "border-radius": "3px",
            cursor: "pointer",
            "font-size": "14px",
            transition: "background-color 0.3s",
          }}
        >
          {isShowRaw() ? "Raw" : "Not Raw"}
        </button>
      </div>

      <div
        ref={containerRef}
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          width: "100%",
          "user-select": "none",
        }}
      >
        <div
          style={{
            width: `${leftWidth()}%`,
            "box-sizing": "border-box",
            display: "flex",
            "flex-direction": "column",
          }}
        >
          <h3 style={{ margin: "0 0 5px 0" }}>KDL 入力</h3>
          <KdlEditor value={kdlInput()} onInput={setKdlInput} />
        </div>

        <div
          onMouseDown={handleMouseDown}
          style={{
            width: "4px",
            cursor: "col-resize",
            "background-color": "#ccc",
            margin: "0 10px",
            "border-radius": "4px",
            transition: "background-color 0.2s",
            height: "100%",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#999")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ccc")}
        />

        <div
          style={{
            width: `${100 - leftWidth()}%`,
            "box-sizing": "border-box",
            display: "flex",
            "flex-direction": "column",
          }}
        >
          <h3 style={{ margin: "0 0 5px 0" }}>変換されたHTML DOM / TABLE</h3>

          <div
            style={{
              flex: 1,
              overflow: "auto",
              border: "solid 1px #000000",
              padding: "10px",
            }}
          >
            <Show when={parseError()}>
              {(errorObj) => (
                <div
                  style={{
                    background: "#fde8e8",
                    color: "#9b1c1c",
                    border: "1px solid #f8b4b4",
                    padding: "15px",
                    "border-radius": "4px",
                    "margin-bottom": "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      "align-items": "center",
                      gap: "10px",
                      "margin-bottom": "8px",
                    }}
                  >
                    <strong>⚠️ KDL シンタックスエラー</strong>
                    <Show when={errorObj().error_line !== null}>
                      <span
                        style={{
                          background: "#e02424",
                          color: "#fff",
                          padding: "2px 8px",
                          "border-radius": "12px",
                          "font-size": "12px",
                        }}
                      >
                        {errorObj().error_line} 行目 : {errorObj().error_column}{" "}
                        文字目付近
                      </span>
                    </Show>
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      padding: "10px",
                      background: "#fff",
                      border: "1px solid #f8b4b4",
                      "border-radius": "4px",
                      "font-family": "monospace",
                      "font-size": "13px",
                      "white-space": "pre-wrap",
                    }}
                  >
                    {errorObj().debug_error}
                  </pre>
                </div>
              )}
            </Show>

            <Show
              when={parsedNodes().length > 0}
              fallback={
                <Show when={!parseError()}>
                  <div style={{ color: "#666" }}>
                    <p>⚠️ 表示できる有効なノードがありません。</p>
                  </div>
                </Show>
              }
            >
              <Show
                when={isDiagramData()}
                fallback={
                  <Show
                    when={isRootTable()}
                    fallback={
                      <ul
                        style={{
                          margin: 0,
                          padding: 0,
                          "list-style-type": "none",
                          "padding-left": "0px",
                        }}
                      >
                        <Switch>
                          <Match when={!isShowRaw()}>
                            <For each={parsedNodes()}>
                              {(node) => <KdlNodeView node={node} />}
                            </For>
                          </Match>
                          <Match when={isShowRaw()}>
                            <For each={parsedNodes()}>
                              {(node) => <KdlNodeView_Raw node={node} />}
                            </For>
                          </Match>
                        </Switch>
                      </ul>
                    }
                  >
                    <Switch>
                      <Match when={!isShowRaw()}>
                        <KdlTableView rows={parsedNodes()} />
                      </Match>
                      <Match when={isShowRaw()}>
                        <KdlTableView_Raw rows={parsedNodes()} />
                      </Match>
                    </Switch>
                  </Show>
                }
              >
{/* 修正前: <KdlSvgDiagram nodes={parsedNodes()} /> */}
{/* 修正後: */}
<KdlSvgDiagram nodes={diagramTargetNodes()} />


              </Show>
            </Show>

            {/* 現在のパース構造データ（デバッグ用） */}
            <Show when={isDebug()}>
              <div
                style={{
                  "margin-top": "20px",
                  "border-top": "2px dashed #ccc",
                  padding: "10px 0",
                }}
              >
                <p
                  style={{
                    margin: "0 0 5px 0",
                    "font-size": "12px",
                    color: "#666",
                    "font-weight": "bold",
                  }}
                >
                  ⬇️ 現在のパース構造データ（デバッグ用）
                </p>
                <pre
                  style={{
                    background: "#f9f9f9",
                    padding: "8px",
                    "font-size": "11px",
                    border: "1px solid #eee",
                  }}
                >
                  {JSON.stringify(rawParseResult(), null, 2)}
                </pre>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
