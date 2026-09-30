const Docs = {
  title: "TABLE",
  file:  new URL(import.meta.url).pathname.split('/').pop(),
  code: `

  table {
row rank=1 product="スマートフォン" price=98000 category="ガジェット" sales=1200
row rank=2 product="ワイヤレスイヤホン" price=15000 category="オーディオ" sales=3500
row rank=3 product="スマートウォッチ" price=32000 category="ガジェット" sales=850
row rank=4 product="4Kモニター" price=45000 category="PC周辺機器" sales=400
}


  table {
department "開発部" {
    task id="T01" title="ログイン機能実装" assignee="田中" status="進行中" priority="高"
    task id="T02" title="バグ修正 #402" assignee="鈴木" status="完了" priority="中"
}

department "マーケティング部" {
    task id="T03" title="キャンペーンLP作成" assignee="佐藤" status="未着手" priority="高"
    task id="T04" title="SNS広告効果分析" assignee="高橋" status="完了" priority="低"
}
  }
`,
};

export default Docs;
