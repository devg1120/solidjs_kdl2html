const Docs = {
  title: "ELEMENT",
  file:  new URL(import.meta.url).pathname.split('/').pop(),
  code: `
qt "AAAAAAAAAAAAAAAAA"

qt "AAAAAAAAAA \
     BBBBBBBBB \
     CCCCCCCCC"
qt 1233444444

gap 

qt title {

    p "aaaaaa      bbbbbbb"
    p "aaaaaa      bbbbbbb"

}

qt title color="lightgreen"  {

    p "aaaaaa      bbbbbbb"
    p "aaaaaa      bbbbbbb"

}

qt title color="gray"  width="12" {

    p "aaaaaa      bbbbbbb"
    p "aaaaaa      bbbbbbb"

}

qt title  {

    p "aaaaaa      bbbbbbb"
    qt  xxxxx {
            qt yyyyy {
		    qt zzzzzz
	    }
    }

}



p "pppp qqqqqq xxxx"

gap 

code """
foo
This is the base indentation
bar
""" color="red"  width="300"

hcode """
  function $initHighlight(block, cls) {
    try {
      if (cls.search(/-highlight/) != -1)
        return process(block, true, 0x0F) +
           ' class=""';
    } catch (e) {
    /* handle exception */
    }
    for (var i = 0 / 2; i < classes.length; i++) {
      if (checkCondition(classes[i]) === undefined)
        return //]/g;
    }
  }
"""

gap

checklist チェックリスト {
  a ばなな  checked="true"
  b 林檎
  c みかん  checked="true"

}

`,
};

export default Docs;
