const Docs = {
  title: "PARAG 2 STR ATTR",
  code: `
document {
    title "SolidJSのスタイル機能" bold="true" size="20px" color="#0076d6"
    
    line 2 "#0080FF"
    //line 2  red
    gap 40

    paragraph "これは通常のテキストです。"
    paragraph "ここを赤くて太い大きな文字に変更します。" color="red" bold="true" size="16px"
    paragraph "斜体（イタリック）の指定も組み合わせることができます。" italic="true" color="#4caf50"
    paragraph "ここを黄色の背景色の警告テキストにします。" bg_color="#fff9c4" color="#b71c1c" bold="true"
    paragraph "薄いグレーの背景でコード風の装飾を施すことも可能です。" bg_color="#f5f5f5" size="13px"

 gap

  center-title  テスト表のタイトル
  table {
     row rank=1 product="スマートフォン" price=98000 category="ガジェット" sales=1200
     row rank=2 product="ワイヤレスイヤホン" price=15000 category="オーディオ" sales=3500
     row rank=3 product="スマートウォッチ" price=32000 category="ガジェット" sales=850
     row rank=4 product="4Kモニター" price=45000 category="PC周辺機器" sales=400
  }

 gap

  center-title  SVGのタイトル
  svg {
      diagram orientation="horizontal"
      
      node "input"   label="データ入力"  type="circle"    color="#e8f5e9" stroke="#2e7d32" text_color="#1b5e20"
      node "process" label="検証サーバー" type="rectangle" color="#e3f2fd" stroke="#1565c0"
      node "success" label="同期完了"    type="rectangle" color="#fffde7" stroke="#fbc02d"
      node "alert"   label="エラー通知"  type="circle"    color="#ffebee" stroke="#c62828" text_color="#b71c1c" dashed="true"
      
      edge from="input"   to="process" label="送信"     color="#2e7d32"
      edge from="process" to="success" label="正常(200)" color="#1565c0"
      edge from="process" to="alert"   label="異常"      color="#c62828" dashed="true"
  
  }

}

`,
};

export default Docs;
