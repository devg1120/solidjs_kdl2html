import { createSignal, createEffect, onMount, For } from "solid-js";

interface TocItem {
  id: string;
  text: string;
  level: number; // 2 = h2, 3 = h3
}

export function TableOfContents(props) {
  const [toc, setToc] = createSignal<TocItem[]>([]);

  createEffect(() => {
    const contentArea = props.docRef();
    if (!contentArea) return;

    // 【重要】SolidJSが子コンポーネント(KdlNodeViewなど)のDOM描画・マウントを
    // 完全に完了するまで実行を遅延させる
    requestAnimationFrame(() => {
      // 描画完了後のDOMから li 要素をすべて取得
      const headings = contentArea.querySelectorAll("li");
      const items: TocItem[] = [];

      headings.forEach((heading) => {
        if (!heading.id || !heading.id.startsWith("h")) {
          return;
        }

        // heading.children[0] が存在するか安全にチェック
        const firstChild = heading.children[0];
        const text = firstChild ? (firstChild.textContent || "-") : (heading.textContent || "-");

        items.push({
          id: heading.id,
          text: text,
          level: Number(heading.id.length) - 1,
        });
      });

      setToc(items);
    });
  });

  return (
    <nav class="toc-container" style={{ margin: "10px 0", padding: "10px", background: "#f9f9f9", "border-radius": "4px" }}>
      <h3 style={{ margin: "0 0 10px 0" }}>目次</h3>
      <ul style={{ "list-style-type": "none", padding: "0" }}>
        <For each={toc()}>
          {(item) => (
            <li class={`toc-item depth-${item.level}`} style={{ "margin-left": `${(item.level - 1) * 15}px`, "margin-bottom": "4px" }}>
              <a href={`#${item.id}`} style={{ color: "#0076d6", "text-decoration": "none" }}>{item.text}</a>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
}
