const Docs = 
{
title: "SVG 4",
code: `
diagram orientation="vertical"

node "client" label="ブラウザ"   type="rectangle" color="#eceff1" stroke="#455a64"
node "lb"     label="ロードバランサ" type="rectangle" color="#f3e5f5" stroke="#7b1fa2"
node "web1"   label="Webサーバー A" type="rectangle" color="#e1f5fe" stroke="#0288d1"
node "web2"   label="Webサーバー B" type="rectangle" color="#e1f5fe" stroke="#0288d1"

edge from="client" to="lb"   label="HTTPS"
edge from="lb"     to="web1" label="振分" color="#7b1fa2"
edge from="lb"     to="web2" label="振分" color="#7b1fa2"


`
}

export default Docs;

