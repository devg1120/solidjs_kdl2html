import { createSignal, onMount, For } from "solid-js";

interface TocItem {
  id: string;
  text: string;
  level: number; // 2 = h2, 3 = h3
}

export function TableOfContents() {
  const [toc, setToc] = createSignal<TocItem[]>([]);

  onMount(() => {
    // 記事本文のコンテナ要素を取得（id="content" 内のヘッダーを対象にする）
    const contentArea = document.getElementById("content");
    if (!contentArea) return;

    // h2 と h3 要素をすべて取得
    const headings = contentArea.querySelectorAll("h2, h3");
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      // 既存のidがなければ自動でユニークなidを付与
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      items.push({
        id: heading.id,
        text: heading.textContent || "",
        level: heading.tagName === "H2" ? 2 : 3,
      });
    });

    setToc(items);
  });

  return (
    <nav class="toc-container">
      <h3>目次</h3>
      <ul>
        <For each={toc()}>
          {(item) => (
            <li class={`toc-item depth-${item.level}`}>
              <a href={`#${item.id}`}>{item.text}</a>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
}
