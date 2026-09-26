const Docs = 
{
title: "SVG 1",
code: `
node "start" label="ログイン画面" type="circle"
node "check" label="パスワード検証" type="rectangle"
node "home" label="ホーム画面" type="rectangle"
node "error" label="エラー表示" type="circle"

edge from="start" to="check" label="進む" color="#0076d6"
edge from="check" to="home" label="OK" color="#4caf50"
edge from="check" to="error" label="NG" color="#d32f2f"

`
}

export default Docs;

