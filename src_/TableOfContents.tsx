// TableOfContents.tsx
import { createSignal, createEffect, onCleanup, For } from "solid-js";

interface TocItem {
  id: string;
  text: string;
  level: number; // 2 = h2, 3 = h3
}

export function TableOfContents(props) {
  const [toc, setToc] = createSignal<TocItem[]>([]);
  const [isOpen, setIsOpen] = createSignal(true);
  let debounceTimer: number | undefined;

  createEffect(() => {
    const contentArea = props.docRef();
    const _trigger = props.kdlInput?.(); 
    
    if (!contentArea) return;

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = window.setTimeout(() => {
      requestAnimationFrame(() => {
        const headings = contentArea.querySelectorAll("li");
        const items: TocItem[] = [];

        headings.forEach((heading) => {
          if (!heading.id || !heading.id.startsWith("h")) {
            return;
          }

          const directSpans = heading.querySelectorAll(":scope > span");
          let text = "";
          
          if (directSpans.length > 0) {
            text = Array.from(directSpans)
              .map(span => span.textContent || "")
              .join(" ")
              .trim();
          }

          if (!text) {
            return; 
          }

          items.push({
            id: heading.id,
            text: text,
            level: Number(heading.id.length) - 1,
          });
        });

        setToc(items);
      });
    }, 300);
  });

  onCleanup(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
  });

  const handleTocClick = (e: MouseEvent, targetId: string) => {
    e.preventDefault();
    const contentArea = props.docRef();
    if (!contentArea) return;

    const targetElement = contentArea.querySelector(`li[id="${targetId}"]`);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav 
      class="toc-container" 
      style={{
        padding: "12px",
        "font-family": "sans-serif",
        height: "100%",           // 【重要】親要素の高さ（100%）にぴったり合わせる
        display: "flex",
        "flex-direction": "column", // 【重要】ヘッダーとリストを縦に並べる
        "box-sizing": "border-box",
        overflow: "hidden"         // 【重要】コンポーネント自体は絶対にはみ出してスクロールさせない
      }}
    >
      {/* トグル付きヘッダー：ここは常に上部に完全固定されます */}
      <div 
        onClick={() => setIsOpen(!isOpen())}
        style={{
          display: "flex",
          "justify-content": "space-between",
          "align-items": "center",
          cursor: "pointer",
          "border-bottom": "2px solid #ddd",
          "padding-bottom": "6px",
          "margin-bottom": "10px",
          "user-select": "none",
          flex: "0 0 auto" // ヘッダーが縮んだり潰れたりするのを防ぐ
        }}
      >
        <span style={{ "font-weight": "bold", "font-size": "14px", color: "#333" }}>
          📌 {isOpen() ? "ドキュメント目次" : "目次"}
        </span>
        <span style={{ "font-size": "12px", color: "#666", transition: "transform 0.2s", transform: isOpen() ? "rotate(0deg)" : "rotate(-180deg)" }}>
          ▼
        </span>
      </div>

      {/* 項目リストのスクロールエリア：目次が長くなった時はここだけがスクロールします */}
      <div
        style={{
          flex: 1, // 残りの縦幅をすべてこのリストエリアに割り当てる
          overflow: "hidden",
          "max-height": isOpen() ? "100%" : "0px", // アコーディオン開閉
          opacity: isOpen() ? 1 : 0,
          transition: "max-height 0.3s ease-in-out, opacity 0.2s ease-in-out",
          "overflow-y": "auto", // 【重要】項目が多い場合のみ、このエリア内部だけで縦スクロールさせる
          "min-height": 0       // フレックス子要素の突き抜け防止
        }}
      >
        <ul style={{ "list-style-type": "none", padding: "0", margin: "0" }}>
          <For each={toc()}>
            {(item) => (
              <li 
                class={`toc-item depth-${item.level}`} 
                style={{ 
                  "margin-left": `${(item.level - 2) * 12}px`,
                  "margin-bottom": "6px",
                  "line-height": "1.4"
                }}
              >
                <a 
                  href={`#${item.id}`} 
                  onClick={(e) => handleTocClick(e, item.id)}
                  style={{ 
                    color: "#0076d6", 
                    "text-decoration": "none", 
                    "font-size": "13px",
                    display: "inline-block",
                    "word-break": "break-all"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                >
                  {item.level === 2 ? "■ " : "• "} {item.text}
                </a>
              </li>
            )}
          </For>
        </ul>
      </div>
    </nav>
  );
}
