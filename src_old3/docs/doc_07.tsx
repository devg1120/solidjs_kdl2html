const Docs = 
{
title: "SVG 3",
code: `
diagram orientation="horizontal"

node "input"   label="データ入力"  type="circle"    color="#e8f5e9" stroke="#2e7d32" text_color="#1b5e20"
node "process" label="検証サーバー" type="rectangle" color="#e3f2fd" stroke="#1565c0"
node "success" label="同期完了"    type="rectangle" color="#fffde7" stroke="#fbc02d"
node "alert"   label="エラー通知"  type="circle"    color="#ffebee" stroke="#c62828" text_color="#b71c1c" dashed="true"

edge from="input"   to="process" label="送信"     color="#2e7d32"
edge from="process" to="success" label="正常(200)" color="#1565c0"
edge from="process" to="alert"   label="異常"      color="#c62828" dashed="true"


`
}

export default Docs;

