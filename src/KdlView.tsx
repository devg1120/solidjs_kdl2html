import { createSignal, createMemo, For, Show, onMount } from "solid-js";
import { parse } from "kdljs";
import type { Node } from "kdljs";
import { Docs } from "./Docs";

import { KdlSvgDiagram } from "./KdlSvgDiagram";

// --- テーブル表示用のコンポーネント ---
export function KdlTableView(props: { rows: Node[] }) {
  const headers = createMemo(() => {
    const keysSet = new Set<string>();
    for (const node of props.rows) {
      if (node.properties) {
        Object.keys(node.properties).forEach((key) => keysSet.add(key));
      }
    }
    return Array.from(keysSet);
  });

  return (
    <div style={{ "overflow-x": "auto", margin: "10px 0" }}>
      <table
        style={{
          width: "100%",
          "border-collapse": "collapse",
          "font-size": "14px",
          "text-align": "left",
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr style={{ "background-color": "#f2f2f2" }}>
            {/*
              <th style={{ padding: "8px", border: "1px solid #ddd", "font-weight": "bold" }}>Node</th>
	      */}
            <Show
              when={props.rows.some((r) => r.values && r.values.length > 0)}
            >
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  "font-weight": "bold",
                }}
              >
                Value
              </th>
            </Show>
            <For each={headers()}>
              {(header) => (
                <th
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    "font-weight": "bold",
                    color: "#4caf50",
                  }}
                >
                  {header}
                </th>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={props.rows}>
            {(rowNode) => (
              <tr style={{ "border-bottom": "1px solid #ddd" }}>
                {/*
                  <td style={{ padding: "8px", border: "1px solid #ddd", color: "#0076d6", "font-weight": "bold" }}>
                    {rowNode.name}
                  </td>
	      */}
                <Show
                  when={props.rows.some((r) => r.values && r.values.length > 0)}
                >
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      color: "#d32f2f",
                    }}
                  >
                    {rowNode.values?.map((v) => String(v)).join(", ") || ""}
                  </td>
                </Show>
                <For each={headers()}>
                  {(header) => {
                    const val = rowNode.properties?.[header];
                    return (
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {val !== undefined ? String(val) : "-"}
                      </td>
                    );
                  }}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}

export function KdlTableView_Raw(props: { rows: Node[] }) {
  const headers = createMemo(() => {
    const keysSet = new Set<string>();
    for (const node of props.rows) {
      if (node.properties) {
        Object.keys(node.properties).forEach((key) => keysSet.add(key));
      }
    }
    return Array.from(keysSet);
  });

  return (
    <div style={{ "overflow-x": "auto", margin: "10px 0" }}>
      <table
        style={{
          width: "100%",
          "border-collapse": "collapse",
          "font-size": "14px",
          "text-align": "left",
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr style={{ "background-color": "#f2f2f2" }}>
            <th
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                "font-weight": "bold",
              }}
            >
              Node
            </th>

            <Show
              when={props.rows.some((r) => r.values && r.values.length > 0)}
            >
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  "font-weight": "bold",
                }}
              >
                Value
              </th>
            </Show>
            <For each={headers()}>
              {(header) => (
                <th
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    "font-weight": "bold",
                    color: "#4caf50",
                  }}
                >
                  {header}
                </th>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={props.rows}>
            {(rowNode) => (
              <tr style={{ "border-bottom": "1px solid #ddd" }}>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    color: "#0076d6",
                    "font-weight": "bold",
                  }}
                >
                  {rowNode.name}
                </td>

                <Show
                  when={props.rows.some((r) => r.values && r.values.length > 0)}
                >
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      color: "#d32f2f",
                    }}
                  >
                    {rowNode.values?.map((v) => String(v)).join(", ") || ""}
                  </td>
                </Show>
                <For each={headers()}>
                  {(header) => {
                    const val = rowNode.properties?.[header];
                    return (
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {val !== undefined ? String(val) : "-"}
                      </td>
                    );
                  }}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}

// --- 各ノードを表示する子コンポーネント（ノード名非表示版） ---
export function KdlNodeView(props: { node: Node; isShowRaw: any }) {

  // 【新規追加】自身のノード名が "svg" の場合は、自身の子要素（nodes）をダイアグラムに渡して描画する
  if (props.node.name === "svg" && props.node.children) {
    return (
      <div style={{ "margin-top": "10px", "margin-bottom": "15px" }}>
        <KdlSvgDiagram nodes={props.node.children} />
      </div>
    );
  }

  // 子要素があり、かつそれらすべてがプロパティを持っていて「さらにその下がネストしていない」場合のみ部分テーブル化
  const shouldRenderTable = createMemo(() => {
    return (
      props.node.children &&
      props.node.children.length > 0 &&
      props.node.children.every(
        (child) =>
          child.properties &&
          Object.keys(child.properties).length > 0 &&
          (!child.children || child.children.length === 0),
      )
    );
  });

  // 【機能拡張】KDLプロパティからスタイル設定（背景色を含む）を動的に抽出
  const textStyle = createMemo(() => {
    const propsMap = props.node.properties || {};

    const isBold = propsMap.bold === true || String(propsMap.bold) === "true";
    const customColor = String(propsMap.color || "#333");
    const fontSize = String(propsMap.size || "14px");
    const isItalic =
      propsMap.italic === true || String(propsMap.italic) === "true";

    // 【新規追加】背景色のプロパティ（bg_color）を取得。未指定なら transparent（透明）
    const customBgColor = propsMap.bg_color
      ? String(propsMap.bg_color)
      : "transparent";

    return {
      "font-weight": isBold ? "bold" : "normal",
      color: customColor,
      "font-size": fontSize,
      "font-style": isItalic ? "italic" : "normal",
      "background-color": customBgColor,
      // 背景色が設定されている場合のみ、見栄えを整えるための余白と角丸を追加
      padding: customBgColor !== "transparent" ? "2px 6px" : "0px",
      "border-radius": customBgColor !== "transparent" ? "3px" : "0px",
      "line-height": "1.6",
    };
  });

  // 【機能拡張】装飾用のスタイルプロパティ（bg_colorを追加）を除外してテキストを抽出
  const displayPropertyValues = createMemo(() => {
    if (!props.node.properties) return [];

    return Object.entries(props.node.properties)
      .filter(
        ([key]) =>
          !["bold", "color", "size", "italic", "bg_color"].includes(key),
      ) // bg_color もテキスト出力から除外
      .map(([_, val]) => String(val));
  });

  return (
    <li
      style={{
        "margin-bottom": "8px",
        "list-style-type": "none",
        "margin-left": "10px",
      }}
    >
      {/* 【変更箇所】ノード名の描画を完全に削除しました。本文(values)とプロパティのみをマッピングします */}

      {/* 本文テキスト（値）の表示：ノード名が消えたため、左端にスッキリ配置されるようmarginを調整 */}
      {/*
      <Show when={props.node.values && props.node.values.length > 0}>
        <span style={{ color: "#333", "font-size": "14px" }}>
          {props.node.values.map((v) => String(v)).join(", ")}
        </span>
      </Show>
      */}
      <Show when={props.node.values && props.node.values.length > 0}>
        <span style={textStyle()}>
          {props.node.values.map((v) => String(v)).join(", ")}
        </span>
      </Show>

      {/* プロパティ（属性）の表示：値がない場合はこれが先頭になります */}
      {/*
      <Show when={props.node.properties && Object.keys(props.node.properties).length > 0}>
        <span style={{ 
          color: "#4caf50", 
          "margin-left": props.node.values && props.node.values.length > 0 ? "8px" : "0px", 
          "font-style": "italic",
          "font-weight": props.node.values && props.node.values.length > 0 ? "normal" : "bold", // 値がない(見出し等の)場合は少し強調
          "font-size": props.node.values && props.node.values.length > 0 ? "13px" : "15px"
        }}>
	  {Object.values(props.node.properties).map((v) => String(v)).join(" ")}
        </span>
      </Show>
      */}
      <Show when={displayPropertyValues().length > 0}>
        <span style={textStyle()}>
          {/* テキストとプロパティ値が両方ある場合は少し隙間を空ける */}
          <Show when={props.node.values && props.node.values.length > 0}>
            &nbsp;
          </Show>
          {displayPropertyValues().join(" ")}
        </span>
      </Show>

      <Show when={props.node.children && props.node.children.length > 0}>
        <div style={{ "padding-left": "15px", "margin-top": "4px" }}>
          <Show
            when={shouldRenderTable()}
            fallback={
              <ul style={{ "list-style-type": "none", "padding-left": "0" }}>
                <For each={props.node.children}>
                  {(childNode) => (
                    <KdlNodeView node={childNode} isShowRaw={props.isShowRaw} />
                  )}
                </For>
              </ul>
            }
          >
            <KdlTableView rows={props.node.children!} />
          </Show>
        </div>
      </Show>
    </li>
  );
}

// --- 各ノードを表示する子コンポーネント ---
export function KdlNodeView_Raw(props: { node: Node }) {
  // 子要素があり、かつそれらすべてがプロパティを持っていて「さらにその下がネストしていない」場合のみ部分テーブル化
  const shouldRenderTable = createMemo(() => {
    return (
      props.node.children &&
      props.node.children.length > 0 &&
      props.node.children.every(
        (child) =>
          child.properties &&
          Object.keys(child.properties).length > 0 &&
          (!child.children || child.children.length === 0),
      )
    );
  });

  return (
    <li
      style={{
        "margin-bottom": "8px",
        "list-style-type": "none",
        "margin-left": "10px",
      }}
    >
      <strong style={{ color: "#0076d6" }}>{props.node.name}</strong>

      <Show when={props.node.values && props.node.values.length > 0}>
        <span style={{ color: "#333", "margin-left": "8px" }}>
          {props.node.values.map((v) => String(v)).join(", ")}
        </span>
      </Show>

      <Show
        when={
          props.node.properties && Object.keys(props.node.properties).length > 0
        }
      >
        <span
          style={{
            color: "#4caf50",
            "margin-left": "8px",
            "font-style": "italic",
          }}
        >
          {Object.entries(props.node.properties)
            .map(([k, v]) => `${k}=${v}`)
            .join(" ")}
        </span>
      </Show>

      <Show when={props.node.children && props.node.children.length > 0}>
        <div style={{ "padding-left": "15px", "margin-top": "4px" }}>
          <Show
            when={shouldRenderTable()}
            fallback={
              <ul style={{ "list-style-type": "none", "padding-left": "0" }}>
                <For each={props.node.children}>
                  {(childNode) => <KdlNodeView_Raw node={childNode} />}
                </For>
              </ul>
            }
          >
            <KdlTableView_Raw rows={props.node.children!} />
          </Show>
        </div>
      </Show>
    </li>
  );
}
