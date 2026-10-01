import { createSignal, createEffect, For } from "solid-js";

interface TocItem {
  id: string;
  text: string;
  level: number; // 2 = h2, 3 = h3
}

export function TableOfContents(props) {
  const [toc, setToc] = createSignal<TocItem[]>([]);

  createEffect(() => {
    // 1. props.docRef() だけでなく、kdlInput() もここで読み出すことで
    //    データやドキュメントが切り替わるたびにこの createEffect が確実に再実行されます
    const contentArea = props.docRef();
    const _trigger = props.kdlInput?.(); 
    
    if (!contentArea) return;

    // 2. SolidJSが新しいデータに基づいて DOM (li要素) を構築し終えるのを待つ
    requestAnimationFrame(() => {
      const headings = contentArea.querySelectorAll("li");
      const items: TocItem[] = [];

      headings.forEach((heading) => {
        if (!heading.id || !heading.id.startsWith("h")) {
          return;
        }

        const firstChild = heading.children[0];
        const text = firstChild ? (firstChild.textContent || "_") : (heading.textContent || "_");
        console.log(text);
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
      <h3 style={{ margin: "0 0 5px 0", "font-size": "15px" }}>[ TOC ]</h3>
      <ul style={{ "list-style-type": "none", padding: "0" }}>
        <For each={toc()}>
          {(item) => (
            <li class={`toc-item depth-${item.level}`} style={{ "margin-left": `${(item.level - 1) * 15}px`, "margin-bottom": "4px" }}>
              <a href={`#${item.id}`} style={{ color: "#0076d6", "text-decoration": "none", "font-size": "14px" }}>{item.text}</a>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
}
