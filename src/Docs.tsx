export const Docs = [
  {
    title: "case A",
    code: `
site "My Tech Blog" {
    author "John Doe" email="john@example.com"
}
  
`,
  },
  {
    title: "case B",
    code: `
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
  `,
  },
];
