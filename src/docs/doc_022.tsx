const Docs = {
  title: "BOOK TOC",
  file:  new URL(import.meta.url).pathname.split('/').pop(),
  code: `

"SolidJS超入門" {
    h1 "第1章: リアクティビティの本質" {
        h2  "1-1: Signalとは何か" {
        p "ananannaa"
        h3 "(1) TEST1"  {
		p "KKKKKKKKKKKKKKKKKKKKKKKKKKK\
			KKKKKKKKKKKKKKKKKKKKKKKKKKKK\
			HHHHHHHHHHHHHHHHHHHHHHHHHHHHH\
			"
	}
        h3 "(2) TEST2"
        h3 "(3) TEST3" 
	
        }
 
        h2 "1-2: Memoによる最適化" {
             p "zxzxzxzxzxzxz"
        }
    }
    
    h1 "第2章: コンポーネント設計" {
        h2 "2-1: Propsの取り扱い"
        h2 "2-2: Control Flow (For, Show)" {
        h3 "(1) TEST1" {
           tabel {
              row rank=1 product="スマートフォン" price=98000 category="ガジェット" sales=1200
              row rank=2 product="ワイヤレスイヤホン" price=15000 category="オーディオ" sales=3500
              row rank=3 product="スマートウォッチ" price=32000 category="ガジェット" sales=850
              row rank=4 product="4Kモニター" price=45000 category="PC周辺機器" sales=400
           }
         }
        h3 "(2) TEST2"

        h3 "(3) TEST3"
	}
    }

}


`,
};

export default Docs;
