const Docs = 
{
title: "SVG 2",
code: `
node "start" label="開始ゲート" type="circle" color="#e8f5e9" stroke="#2e7d32" text_color="#1b5e20"
node "process" label="非同期通信処理" type="rectangle" color="#fffde7" stroke="#fbc02d" dashed="true"
node "success" label="成功画面" type="rectangle" color="#e3f2fd" stroke="#1565c0" text_color="#0d47a1"

edge from="start" to="process" label="リクエスト" color="#2e7d32"
edge from="process" to="success" label="200 OK" color="#1565c0" dashed="true"


`
}

export default Docs;

