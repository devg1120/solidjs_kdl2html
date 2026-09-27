const Docs = {
  title: "PARAG 2 STR ATTR",
  code: `
document {
    title "SolidJSのスタイル機能" bold="true" size="20px" color="#0076d6"
    
    paragraph "これは通常のテキストです。"
    paragraph "ここを赤くて太い大きな文字に変更します。" color="red" bold="true" size="16px"
    paragraph "斜体（イタリック）の指定も組み合わせることができます。" italic="true" color="#4caf50"
    paragraph "ここを黄色の背景色の警告テキストにします。" bg_color="#fff9c4" color="#b71c1c" bold="true"
    paragraph "薄いグレーの背景でコード風の装飾を施すことも可能です。" bg_color="#f5f5f5" size="13px"

    gap

    // 値を引数ごとに別々のクォーテーションで囲んで複数渡します。
    // colors や bgs にカンマ区切りで順番にスタイルを指定します。
    paragraph "SolidJS" "と" "kdljs" "の" "強力な" "コンビネーション" colors="#0076d6,#333,#4caf50,#333,orange,purple" bgs="none,none,#e8f5e9,none,none,#f3e5f5" bolds="true,false,true,false,false,true"
    
    paragraph "重要キーワード" "は" "背景を黄色" "にします。" bgs="#ffeb3b,none,#fff3cd,none" colors="red,none,black,none"

    gap

  // heightプロパティで高さを自由に変更可能。第1引数にタイトルを付けられます
    scrollbox "利用規約および免責事項" height="120px" {
        paragraph "第1条（目的）" bold="true"
        paragraph "この規約は、本アプリケーションの利用条件を定めるものです。"
        paragraph "第2条（禁止事項）" bold="true"
        paragraph "ユーザーは、逆アセンブル、逆コンパイル、リバースエンジニアリング等を行ってはなりません。"
        paragraph "第3条（免責）" bold="true"
        paragraph "当方は、本システムの使用によって生じた如何なる損害についても責任を負いません。"
        paragraph "第4条（規約の変更）" bold="true"
        paragraph "本規約は、予告なく随時改定されることがあります。"
    }

    paragraph "別の小窓には、高さ指定を変えて別の要素を入れることも可能です。"

    // タイトルなし・別の高さを指定したシンプルなスクロールボックス
    scrollbox height="80px" {
        paragraph "ログ：システムを起動しました。"
        paragraph "ログ：データベースに接続しました。"
        paragraph "ログ：ユーザーセッションを開始しました。"
        paragraph "ログ：警告 - API応答が遅延しています。"
        paragraph "ログ：定期チェック完了。"
    }

    gap

  paragraph "ひとつの画面スペースを有効活用し、カテゴリーごとに情報を分類表示できます。"

    // タブ切り替えの親コンテナ
    tabs {
        // 1つ目のタブ：テキスト装飾
        tab "プロダクト紹介" {
            paragraph "SolidJS" "は超軽量なリアクティブライブラリです。" colors="#0076d6" bolds="true"
            paragraph "仮想DOMを使用せず、ダイレクトにDOMを更新するため非常に高速に動作します。"
        }
        
        // 2つ目のタブ：グラフチャートの埋め込み
        tab "売上パフォーマンス" {
            chart "2026年Q1セールス推移" type="line" color="#4caf50" {
                data "1月" 150
                data "2月" 340
                data "3月" 290
            }
        }

        // 3つ目のタブ：前回のスクロールボックスも中に入れられます
        tab "開発ログ (規約)" {
            scrollbox "エラーログ一覧" height="80px" {
                paragraph "Log: Build succeeded"
                paragraph "Warning: Performance hint"
                paragraph "Log: Server listening on port 3000"
                paragraph "Debug: Database connection kept alive"
            }
        }
    }

    paragraph "タブはドキュメント内に複数設置しても、それぞれの状態が独立して動作します。"

    gap

    paragraph "gridノードを使用することで、ドキュメント単調な縦並びから、本格的なマルチカラムダッシュボードへレイアウトを変更できます。"

    // 2列構成のグリッド：グラフとスクロールボックスを横並びにする
    grid cols=2 gap="16px" {
        chart "地域別シェア推移" type="percent" {
            data "東京" 55
            data "大阪" 30
            data "名古屋" 15
        }

        scrollbox "サーバーリアルタイムログ" height="145px" {
            paragraph "Info: API request processed in 45ms"
            paragraph "Info: Active connections: 1,420"
            paragraph "Debug: Cache hit ratio: 94.2%"
            paragraph "Warning: Disk space utilization at 82%"
            paragraph "Info: Sync service completed gracefully"
        }
    }

    paragraph "さらに、3列に設定して小さなコンテンツやテキストを均等に並べることも可能です。"

    // 3列構成のグリッド：3つのグラフを横並びにする
    grid cols=3 gap="10px" {
        chart "売上A" type="bar" color="#0076d6" {
            data "Q1" 80
            data "Q2" 120
        }
        chart "売上B" type="bar" color="#4caf50" {
            data "Q1" 95
            data "Q2" 85
        }
        chart "売上C" type="bar" color="#ff9800" {
            data "Q1" 40
            data "Q2" 150
        }
    }

    gap

   paragraph "各コンポーネントに span=2 などの属性を付与することで、横幅を自由に占有させることができます。"

    // 3列構成のグリッド
    grid cols=3 gap="16px" {
        
        // span=2 を指定：3マスのうち2マス分（全体の3分の2）に大きく広がるメイングラフ
        chart "月間総売上推移（メインデータ）" type="line" color="#0076d6" span=2 {
            data "1月" 120
            data "2月" 250
            data "3月" 410
        }

        // spanなし（デフォルトの1マス）：残りの1マスのスペースに収まるログ小窓
        scrollbox "システムイベント" height="220px" {
            paragraph "09:00 - システム稼働"
            paragraph "10:15 - バックアップ完了"
            paragraph "12:00 - 定期パッチ適用"
            paragraph "14:30 - バッチ処理完了"
            paragraph "17:00 - レポート自動生成"
        }
        
        // 次の行に回り込んで配置される1マスずつの小さなグラフ
        chart "セグメントA" type="bar" color="#4caf50" {
            data "Q1" 80
            data "Q2" 110
        }
        
        chart "セグメントB" type="bar" color="#ff9800" {
            data "Q1" 60
            data "Q2" 140
        }
        
        chart "セグメントC" type="bar" color="#e91e63" {
            data "Q1" 95
            data "Q2" 70
        }
    }
}

`,
};

export default Docs;
