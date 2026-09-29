import { createEffect, createSignal, onMount } from 'solid-js';
import Prism from 'prismjs';
// お好みのテーマCSSをインポート
//import 'prismjs/themes/prism-tomorrow.css';

import 'prismjs/themes/prism-okaidia.css';	//Okaidia（Monokai風の黒背景。エンジニアに人気）



// 必要に応じて言語を追加（例: JavaScript, TypeScript）
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

type CodeBlockProps = {
  code: string;
  language: string;
};

export function CodeBlock(props: CodeBlockProps) {
  let codeRef!: HTMLPreElement;
  const [html, setHtml] = createSignal('');

  createEffect(() => {
    const grammar = Prism.languages[props.language] || Prism.languages.text;
    const highlighted = Prism.highlight(props.code, grammar, props.language);
    setHtml(highlighted);
  });

  return (
    <pre class={`language-${props.language}`}
        style={{
		   "padding": "10px 0px",
		   "line-height": "16px",
	}}
    >
      <code ref={codeRef} style={{
	          "font-size": "12px",
		   "font-family": "monospace",
		  }}  innerHTML={html()} />
    </pre>
  );
}

