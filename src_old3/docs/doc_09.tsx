const Docs = 
{
title: "PARAG 1",
code: `

document title="SolidJSによるモダン開発" author="開発チーム" {
    
    section heading="1. はじめに" {
        paragraph "SolidJSは、Reactに似たJSXの書き方を採用しながらも、仮想DOM（Virtual DOM）を一切使用しない革新的なフロントエンドライブラリです。コンポーネントは最初の1回しか実行されないため、非常に高いパフォーマンスを発揮します。"
    }
    
    section heading="2. 主な特徴とメリット" {
        paragraph "細粒度のリアクティビティ（Fine-grained Reactivity）により、状態（Signal）が変化した部分のDOMだけがピンポイントで更新されます。"
        
        paragraph "また、標準のControl Flowコンポーネント（ForやShowなど）を活用することで、無駄な再レンダリングを徹底的に排除した無駄のないDOM構築が可能です。"
    }
    
    section heading="3. まとめ" {
        // バックスラッシュを使うことで、KDL内で改行を含んだ長文を綺麗に記述できます
        content "このように、SolidJSはクリーンなコード構造と \
究極の実行速度を両立させたいモダンなWebアプリケーション \
開発において、現在最も有力な選択肢の1つとなっています。"
    }
}


`
}

export default Docs;

