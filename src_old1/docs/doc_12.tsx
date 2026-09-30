const Docs = {
  title: "CHART",
  file:  new URL(import.meta.url).pathname.split('/').pop(),
  code: `
document {
    title "2026年度 プロジェクト進捗レポート" size="20px" bold="true" color="#333"
    
    paragraph "今期の各チームの開発スプリント消化数およびパフォーマンスチャートです。"

    // 緑色のグラフ
    chart "チーム別タスク消化数" color="#2e7d32" {
        data "フロントエンド" 45
        data "バックエンド" 68
        data "インフラ" 23
        data "QA・テスト" 39
    }

    paragraph "続いて、ユーザーから報告された月別のフィードバック件数です。"

    // オレンジ（警告・注意）カラーのグラフ
    chart "月別バグ報告数" color="#ef6c00" {
        data "1月" 12
        data "2月" 8
        data "3月" 25
        data "4月" 4
    }

    
    paragraph "typeプロパティを切り替えることで、異なる形状のグラフをシームレスに表示できます。"

    // type="line" を指定した折れ線グラフ
    chart "月間アクティブユーザー数 (MAU) 推移" type="line" color="#ff5722" {
        data "1月" 100
        data "2月" 150
        data "3月" 130
        data "4月" 240
        data "5月" 280
        data "6月" 410
      }

    paragraph "ユーザー満足度とデバイスの使用比率の集計データです。"

    // type="percent" を指定した帯グラフ
    chart "本システムに対する満足度調査" type="percent" {
        data "大変満足" 124
        data "満足" 85
        data "普通" 42
        data "不満" 15
    }

    paragraph "続いて、アクセスのあった端末の内訳推移です。"

    // 項目数が多くてもパレットカラーが自動的にループして綺麗に塗り分けられます
    chart "アクセス端末シェア" type="percent" {
        data "iOS" 450
        data "Android" 320
        data "Windows" 180
        data "macOS" 90
        data "Linux" 25
    }

    img "https://samplelib.com/jpeg/sample-photo-3840x2160.jpg"

    img "https://placehold.jp/3d4070/ffffff/150x150.png"  width="150"  height="150"

    img "https://placehold.jp/3d4070/ffffff/350x250.png"  width="350"  height="250"

/*
 <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13097.386053150183!2d135.22680752954528!3d34.84751957543601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sja!2sjp!4v1790598440911!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
 */
}
   map "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13097.386053150183!2d135.22680752954528!3d34.84751957543601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sja!2sjp!4v1790598440911!5m2!1sja!2sjp" width="400" height="250" 

  gap

  www "https://web.pref.hyogo.lg.jp/"  width="450"


// 左右分割 (デフォルト)
split "vertical" {
//split "horizontal" {
    tabs {
        tab "左側のメニュー" {
            node "項目 A"
            node "項目 B"
        }
    }
    chart "右側のレポート" type="bar" {
        data "売上" 120
        data "経費" 70
    }
}
`,
};

export default Docs;
