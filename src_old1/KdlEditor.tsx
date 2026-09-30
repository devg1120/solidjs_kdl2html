import { createSignal, createMemo, For, Show, onMount } from "solid-js";

// --- 行番号付きカスタムエディタコンポーネント ---
export function KdlEditor(props: {
  value: string;
  onInput: (val: string) => void;
}) {
  let textareaRef: HTMLTextAreaElement | undefined;
  let lineNumbersRef: HTMLDivElement | undefined;

  const lines = createMemo(() => {
    const count = props.value.split("\n").length;
    return Array.from({ length: Math.max(1, count) }, (_, i) => i + 1);
  });

  const handleScroll = () => {
    if (textareaRef && lineNumbersRef) {
      lineNumbersRef.scrollTop = textareaRef.scrollTop;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        border: "1px solid #ccc",
        "font-family": "monospace",
        "font-size": "14px",
        "line-height": "1.5",
        background: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        ref={lineNumbersRef}
        style={{
          width: "45px",
          padding: "12px 0",
          "background-color": "#f7f7f7",
          color: "#999",
          "text-align": "right",
          "padding-right": "8px",
          "user-select": "none",
          overflow: "hidden",
          "box-sizing": "border-box",
          "border-right": "1px solid #ddd",
        }}
      >
        <For each={lines()}>
          {(line) => <div style={{ height: "21px" }}>{line}</div>}
        </For>
      </div>

      <textarea
        ref={textareaRef}
        value={props.value}
        onInput={(e) => {
          props.onInput(e.currentTarget.value);
          handleScroll();
        }}
        onScroll={handleScroll}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          padding: "12px",
          resize: "none",
          "font-family": "inherit",
          "font-size": "inherit",
          "line-height": "21px",
          "white-space": "pre",
          "overflow-x": "auto",
          "overflow-y": "auto",
          "box-sizing": "border-box",
        }}
      />
    </div>
  );
}
