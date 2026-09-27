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


}

`,
};

export default Docs;
