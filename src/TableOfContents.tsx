import { createSignal, createEffect, onMount, For } from "solid-js";

interface TocItem {
  id: string;
  text: string;
  level: number; // 2 = h2, 3 = h3
}

export function TableOfContents(props) {
  const [toc, setToc] = createSignal<TocItem[]>([]);
  console.log(props.docRef);

  createEffect(() => {
    const contentArea = props.docRef();
    //console.log(props.docRef);

    if (!contentArea) return;

    // h2 と h3 要素をすべて取得
    const headings = contentArea.querySelectorAll("li");
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      
      if (!heading.id) {
	      return
      }
      if (!heading.id.startsWith("h")) {
	      return
      }

      console.log(heading.id)
      items.push({
        id: heading.id,
        //text: heading.textContent || "",
        text: heading.children[0].textContent || "-",   //span
        level: Number(heading.id.length) -1,
      });
     
    });
  console.log(items)
  });


/*
  onMount(() => {
    console.log("onMount")
    // 記事本文のコンテナ要素を取得（id="content" 内のヘッダーを対象にする）
    const contentArea = props.docRef;
    //console.log(props.docRef);

    if (!contentArea) return;

    // h2 と h3 要素をすべて取得
    const headings = contentArea.querySelectorAll("li");
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      // 既存のidがなければ自動でユニークなidを付与
      console.log(heading.id)
      
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      items.push({
        id: heading.id,
        text: heading.textContent || "",
        level: heading.tagName === "H2" ? 2 : 3,
      });
     
    });

    //setToc(items);
  });
*/
  return (<></>)


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
