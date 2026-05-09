# Common Lisp 教科書ドラフト 第16章から第18章

**作成日**: 2026年5月2日  
**対象範囲**: 第16章 condition system / 第17章 CLOS / 第18章 文字列、format、入出力  
**位置づけ**: 教科書本文の先行ドラフト

**関連文書**:
- [COMMON_LISP_TEXTBOOK_OUTLINE.md](./COMMON_LISP_TEXTBOOK_OUTLINE.md)
- [COMMON_LISP_TEXTBOOK_CH13_15.md](./COMMON_LISP_TEXTBOOK_CH13_15.md)
- [COMMON_LISP_FOUNDATIONS.md](./COMMON_LISP_FOUNDATIONS.md)

---

## この文書の読み方

この文書は、教科書の第16章から第18章に相当する本文ドラフトである。

各章では、次の 6 要素を揃える。

1. その章の結論
2. 基本概念の説明
3. 最小コード例
4. よくある誤解や落とし穴
5. Common Lisp 標準ではどう定義されるか
6. 参考 URL

---

### 2. condition と `error`

Common Lisp では、異常や注意すべき状況は condition として表現される。condition は文字列や数値ではなく object であり、handler はその object を受け取って処理を考える。

```lisp
(error "bad input")
```

`error` は、指定された condition を signal する標準関数である。学習上重要なのは、`error` が単なるメッセージ表示ではない点である。未処理なら debugger に入り、`error` 自体は直接 return しない。

そのため、第16章では「error を出すこと」より、「signal された condition がどの handler に渡り、どの restart で回復できるか」を追う読み方が重要になる。

---

### 3. `handler-case`

`handler-case` は、signal された condition を clause で受け取り、分岐的に処理するための基本手段である。

```lisp
(handler-case
    (error "bad input")
  (error (c)
    (declare (ignore c))
    :handled))
```

この形では、`error` 型の condition が signal されたときに、その clause へ制御が移る。入門段階では、`handler-case` を「condition system 版の分岐付き回復」と見てよい。

ただし、これは単純な try/catch の写像ではない。Common Lisp では handler と restart が分離されているので、`handler-case` はそのうち「どこで受けるか」を記述する側である。

---

### 4. `handler-bind`

`handler-bind` は、動的環境に handler function を設置する低レベルな仕組みである。

```lisp
(handler-bind
    ((error (lambda (c)
              (declare (ignore c))
              (invoke-restart 'use-default))))
  (restart-case
      (error "bad input")
    (use-default ()
      0)))
```

この例では、`error` が signal されると、`handler-bind` で設置した handler が呼ばれ、`use-default` という restart を選んで `0` を返す。

`handler-bind` を理解するうえで重要なのは次の 2 点である。

1. handler は 1 引数の関数として condition object を受け取る
2. handler は必ずそこで処理を完結するとは限らず、単に return してその後の処理を外側の handler に委ねることもある

つまり `handler-bind` は、「この condition が来たらこの recovery policy を試す」という動的な方針注入に向いている。

---

### 5. restart の考え方

restart は、condition が起きたときの回復地点や回復操作を名前付きで提示する仕組みである。

```lisp
(restart-case
    (error "bad input")
  (use-default ()
    0))
```

この例では `use-default` という restart が用意されている。重要なのは、`restart-case` は回復手段を確立するのであって、**この式だけで自動的に `0` を返すわけではない**ことだ。実際には debugger から対話的に選ばれることもあるし、`invoke-restart` でプログラムから選ばれることもある。

学習上の要点は、signal する側が「異常が起きた」と知らせ、restart 側が「どう回復できるか」を提示し、handler 側が「どの回復を選ぶか」を決められることだ。これが、単純な例外モデルより柔軟な点である。

---

### 6. 例外処理との違い

他言語の例外処理では、throw 側が回復の流れまで暗黙に決めてしまうことが多い。

Common Lisp では、より分解して考える。

1. condition は何が起きたかを表す
2. handler はその状況をどう扱うかを決める
3. restart は回復可能な選択肢を提示する

そのため、condition system は「例外処理の別記法」ではなく、「通知・判断・回復を分離した実行制御モデル」として理解した方が正確である。

---

### 7. 最小コード例

第16章の最小例としては、次の 4 つで十分である。

```lisp
(error "bad input")
```

```lisp
(handler-case
    (error "bad input")
  (error (c)
    (declare (ignore c))
    :handled))
```

```lisp
(restart-case
    (error "bad input")
  (use-default ()
    0))
```

```lisp
(handler-bind
    ((error (lambda (c)
              (declare (ignore c))
              (invoke-restart 'use-default))))
  (restart-case
      (error "bad input")
    (use-default ()
      0)))
```

ここから見えることは次の通りである。

1. `error` は condition を signal する
2. `handler-case` は clause ベースで回復分岐を書く
3. restart は回復地点を名前付きで提示する
4. `handler-bind` は recovery policy を動的に差し込める

---

### 8. よくある誤解や落とし穴

#### 8.1 condition system は try/catch と同じだと思ってしまう

似て見える部分はあるが、Common Lisp では handler と restart が分かれている。ここを落とすと、第16章の核心が抜ける。

#### 8.2 `error` はメッセージを出して戻るだけだと思ってしまう

未処理の `error` は直接 return しない。handler で非局所脱出するか、restart を使って回復する必要がある。

#### 8.3 `handler-bind` は必ず catch して終わると思ってしまう

`handler-bind` の handler は return して decline できる。常に処理完了するわけではない。

#### 8.4 restart は handler の別名だと思ってしまう

restart は回復地点や回復操作であり、handler とは役割が違う。handler が restart を選ぶ、という分担で読むべきである。

---

### 9. Common Lisp 標準ではどう定義されるか

この章の仕様上の土台は、Conditions 章全体と、その dictionary にある signal / handler / restart 関連 operator にある。

とくに重要なのは次の点である。

1. condition は検出された状況を表す object として定義される
2. active handler は `handler-bind` や `handler-case` により動的に確立される
3. `error` は condition を signal し、未処理なら debugger に渡るため直接 return しない
4. `handler-bind` の handler は 1 引数関数であり、return して decline することもできる
5. `handler-case` は clause ベースの handling を提供する
6. restart は動的環境で有効な名前付き回復点であり、`invoke-restart` で選択できる

したがって、第16章は「例外を捕まえる章」ではなく、Common Lisp が異常系をどう構造化しているかを学ぶ章として読むべきである。

---

### 10. 参考 URL

- Common Lisp HyperSpec Chapter 9 Conditions  
  https://www.lispworks.com/documentation/HyperSpec/Body/09_.htm
- Common Lisp HyperSpec Section 9.1 Condition System Concepts  
  https://www.lispworks.com/documentation/HyperSpec/Body/09_a.htm
- Common Lisp HyperSpec The Conditions Dictionary  
  https://www.lispworks.com/documentation/HyperSpec/Body/c_condit.htm
- Common Lisp HyperSpec Function ERROR  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_error.htm#error
- Common Lisp HyperSpec Macro HANDLER-BIND  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_handle.htm#handler-bind
- Common Lisp HyperSpec Macro HANDLER-CASE  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_hand_1.htm#handler-case
- Common Lisp HyperSpec System Class RESTART  
  https://www.lispworks.com/documentation/HyperSpec/Body/t_rst.htm#restart
- Common Lisp HyperSpec Macro RESTART-CASE  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_rst_ca.htm#restart-case
- Common Lisp HyperSpec Function INVOKE-RESTART  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_invo_1.htm#invoke-restart

---

## 第17章 CLOS

### 1. この章の結論

Common Lisp Object System は、「class に method がぶら下がる」だけの仕組みではない。**CLOS では class が構造を定義し、generic function が振る舞いの入口になり、method は引数の class に応じて選ばれる**。この視点が入ると、`defclass`、`make-instance`、`defgeneric`、`defmethod`、多重ディスパッチ、method combination が一本につながる。

この章の核は次の 5 点である。

1. `defclass` は class と slot 構造を定義する
2. `make-instance` は class から fresh な instance を作る
3. 振る舞いの中心は class ではなく generic function にある
4. `defmethod` は複数引数の class に基づいて dispatch できる
5. method combination により、primary method だけでなく `:before`、`:after`、`:around` も組み合わせられる

---

### 2. class と instance

class は object の設計図であり、instance はその class に属する具体的な object である。

```lisp
(defclass point ()
  ((x :initarg :x :accessor point-x)
   (y :initarg :y :accessor point-y)))
```

```lisp
(make-instance 'point :x 10 :y 20)
```

この例では、`point` という class を定義し、`x` と `y` という slot を持つ instance を生成している。`defclass` の slot option では `:initarg` や `:accessor` を指定できる。

学習上重要なのは、slot は class 定義の一部であり、field の単純な別名ではないことだ。accessor を定義しなければ、標準的には `slot-value` でアクセスすることになる。

---

### 3. generic function と method

CLOS では、振る舞いは generic function を入口にして組み立てる。

```lisp
(defgeneric describe-shape (shape))
```

```lisp
(defmethod describe-shape ((shape point))
  :point)
```

ここで重要なのは、method が class の中に閉じ込められているのではなく、generic function に追加される点である。Common Lisp では「object に message を送る」というより、「generic function に引数を渡し、適切な method を選ぶ」と考える方が正確である。

---

### 4. 多重ディスパッチ

CLOS の特徴の一つは、dispatch が第 1 引数だけに固定されないことだ。

```lisp
(defclass rectangle () ())
(defclass circle () ())
```

```lisp
(defgeneric collide (a b))
```

```lisp
(defmethod collide ((a rectangle) (b circle))
  :rectangle-circle)
```

```lisp
(defmethod collide ((a circle) (b rectangle))
  :circle-rectangle)
```

このように、`collide` は 2 つの引数の class の組み合わせで別の method を選べる。ここが、多くの単一ディスパッチ系 OOP と違う点である。

---

### 5. 継承と method combination

class は superclass から slot や method の構造を受け継げる。

```lisp
(defclass colored-point (point)
  ((color :initarg :color :accessor point-color)))
```

この `colored-point` は `point` を継承し、`x` と `y` に加えて `color` を持つ。

さらに CLOS では、method は単に「一つ選ばれる」だけではない。標準 method combination では、primary method に加え、` :before`、`:after`、`:around` といった qualifier 付き method が組み合わされる。

入門段階では、次のように整理するとよい。

1. primary method が処理の中心になる
2. `:before` は本体の前処理、`:after` は後処理として読む
3. `:around` は全体を包む制御として読む

この層が見えてくると、CLOS は「class の糖衣」ではなく、generic function を軸にした高度な dispatch system だと分かる。

---

### 6. slot と accessor の見方

初学者は slot を public field のように読んでしまいがちだが、CLOS では accessor 自体も generic function と method を通じて扱われる。

`defclass` の `:reader`、`:writer`、`:accessor` は、slot に対する method を定義する糖衣でもある。そのため、CLOS では「データ」と「操作」が最初から分離された枠組みで結びついている。

この見方が入ると、なぜ accessor をただの getter/setter として扱い切れないのかが理解しやすくなる。

---

### 7. 最小コード例

第17章の最小例としては、次の 6 つで十分である。

```lisp
(defclass point ()
  ((x :initarg :x :accessor point-x)
   (y :initarg :y :accessor point-y)))
```

```lisp
(make-instance 'point :x 10 :y 20)
```

```lisp
(defgeneric describe-shape (shape))
```

```lisp
(defmethod describe-shape ((shape point))
  :point)
```

```lisp
(defgeneric collide (a b))
```

```lisp
(defmethod collide ((a rectangle) (b circle))
  :rectangle-circle)
```

ここから見えることは次の通りである。

1. `defclass` は class と slot を定義する
2. `make-instance` は instance を生成する
3. 振る舞いの入口は generic function である
4. `defmethod` により class 特化した振る舞いを追加できる
5. dispatch は複数引数にまたがりうる

---

### 8. よくある誤解や落とし穴

#### 8.1 method は class の中にだけあると思ってしまう

CLOS では、method は generic function に結びつく。class は構造を定義するが、振る舞いの中心は generic function 側にある。

#### 8.2 dispatch は第 1 引数だけだと思ってしまう

CLOS では複数引数の class に基づいて method 選択が行える。これが多重ディスパッチである。

#### 8.3 slot はただの public field だと思ってしまう

slot は object system の一部であり、accessor や `slot-value` を通じて扱う。単純な構造体の field と同一視しない方がよい。

#### 8.4 継承は override だけだと思ってしまう

CLOS では継承に加え、method combination により複数 method が協調して働く。ここを落とすと CLOS らしさが見えない。

---

### 9. Common Lisp 標準ではどう定義されるか

この章の仕様上の土台は、Objects 章、とくに object creation、slots、generic functions and methods の節、および objects dictionary にある。

とくに重要なのは次の点である。

1. `defclass` は named class と slot option を定義する
2. `make-instance` は class から fresh な instance を作る standard generic function である
3. slot には `:initarg`、`:initform`、`:reader`、`:writer`、`:accessor` などの option がある
4. `defgeneric` と `defmethod` により振る舞いは generic function を中心に組み立てられる
5. `defmethod` の specializer により dispatch は複数引数へまたがりうる
6. 標準 method combination では primary method だけでなく `:before`、`:after`、`:around` の組み合わせが定義される

したがって、第17章は「Common Lisp にも class がある」という紹介で終わる章ではなく、CLOS が generic function 中心の object system であることを理解する章として読むべきである。

---

### 10. 参考 URL

- Common Lisp HyperSpec Chapter 7 Objects  
  https://www.lispworks.com/documentation/HyperSpec/Body/07_.htm
- Common Lisp HyperSpec Section 7.1 Object Creation and Initialization  
  https://www.lispworks.com/documentation/HyperSpec/Body/07_a.htm
- Common Lisp HyperSpec Section 7.5 Slots  
  https://www.lispworks.com/documentation/HyperSpec/Body/07_e.htm
- Common Lisp HyperSpec Section 7.6 Generic Functions and Methods  
  https://www.lispworks.com/documentation/HyperSpec/Body/07_f.htm
- Common Lisp HyperSpec The Objects Dictionary  
  https://www.lispworks.com/documentation/HyperSpec/Body/c_object.htm
- Common Lisp HyperSpec Macro DEFCLASS  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_defcla.htm#defclass
- Common Lisp HyperSpec Standard Generic Function MAKE-INSTANCE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_mk_ins.htm#make-instance
- Common Lisp HyperSpec Macro DEFGENERIC  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_defgen.htm#defgeneric
- Common Lisp HyperSpec Macro DEFMETHOD  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_defmet.htm#defmethod
- Common Lisp HyperSpec Function SLOT-VALUE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_slt_va.htm#slot-value
- Common Lisp HyperSpec Standard Method Combination  
  https://www.lispworks.com/documentation/HyperSpec/Body/07_ffb.htm#standard

---

## 第18章 文字列、format、入出力

### 1. この章の結論

Common Lisp では、文字列操作、整形出力、入力、出力は、ばらばらの便利関数の集まりではない。**string は sequence として扱われ、`format` は出力先を抽象化し、stream は I/O の媒体を表し、`read` と `write` / `print` は Lisp object を入出力する**。このつながりが見えると、REPL の外でも Common Lisp を実用的に使えるようになる。

この章の核は次の 5 点である。

1. string は単なる文字列リテラルではなく Lisp object である
2. `format` は整形結果を stream に送るか、`nil` なら string として返す
3. stream は入力元や出力先を抽象化する型である
4. `read` は文字列ではなく Lisp object を読む
5. `write` と `print` はどちらも printer だが、意図と既定動作が違う

---

### 2. 文字列の基本

文字列は Common Lisp の基本的な object の一つであり、文字列専用 operator で加工できる。

```lisp
(string-upcase "hello")
```

この例は、新しい大文字文字列を返す。ここで大事なのは、string が symbol ではない点である。`"hello"` は reader によって文字列 object として読まれ、`hello` という symbol とは別物である。

学習上は、次のように整理するとよい。

1. string は sequence の一種である
2. 文字単位の処理と string 単位の処理は分けて考える
3. `string-upcase` などの非破壊版と `nstring-upcase` などの破壊版は区別する

---

### 3. `format`

`format` は、Common Lisp で最も重要な整形出力 operator の一つである。

```lisp
(format nil "~A ~D" "count" 3)
```

この場合、出力先に `nil` を指定しているので、`format` は結果を string として返す。

```lisp
(format t "~A ~D" "count" 3)
```

こちらは `t` を指定しているので、通常は標準出力へ書き出す。

入門段階では、「`format` は printf 風の関数」という理解だけだと浅い。重要なのは、`format` が出力先を引数で受け取り、string 生成にも stream 出力にも使えることだ。

---

### 4. stream と `read`

stream は、入力元や出力先を表す抽象的な型である。file だけでなく、string stream もある。

```lisp
(with-input-from-string (s "(+ 1 2)")
  (read s))
```

この例では、string から stream を作り、そこから `read` で 1 個の Lisp object を読んでいる。返るのは「文字列」ではなく、reader によって構文解析された Lisp form である。

ここが第3章とつながる重要点であり、`read` は line reader ではなく Lisp reader の入口として理解する必要がある。

---

### 5. `write` と `print`

`write` と `print` は、どちらも Lisp object を出力する printer だが、意図が少し違う。

```lisp
(with-output-to-string (s)
  (write '(a b c) :stream s))
```

```lisp
(with-output-to-string (s)
  (print '(a b c) s))
```

`write` は Lisp printer の一般的な入口であり、keyword 引数で escaping や base などを細かく制御できる。一方 `print` は `prin1` に近い convenience で、printed representation の前に改行、後ろに空白を付ける。

学習上の要点は、`print` と `write` の違いを「好みの別名」と見ないことだ。`write` は制御可能な printer、`print` は REPL 的な見やすさ寄りの convenience として読む方がよい。

---

### 6. 読み書きの往復をどう考えるか

Common Lisp では、`read` と printer は強く結びついている。

とくに入門段階では、まず `prin1` と `read` の関係を押さえるとよい。HyperSpec では `prin1` は `read` に向いた printed representation を出力する側として説明され、`write` はその一般化された入口として printer control を keyword 引数で明示できる。一方 `format` の `~A` や `princ` 系は、人間向け表示に寄るため、そのまま `read` で安全に戻せるとは限らない。

この区別は、設定ファイル、データ保存、デバッグ表示で重要になる。機械可読性を重視するのか、人間向け表示を重視するのかで、使う printer を変える必要がある。

---

### 7. 最小コード例

第18章の最小例としては、次の 5 つで十分である。

```lisp
(string-upcase "hello")
```

```lisp
(format nil "~A ~D" "count" 3)
```

```lisp
(with-input-from-string (s "(+ 1 2)")
  (read s))
```

```lisp
(with-output-to-string (s)
  (write '(a b c) :stream s))
```

```lisp
(with-output-to-string (s)
  (print '(a b c) s))
```

ここから見えることは次の通りである。

1. string は operator で加工できる object である
2. `format` は string 生成にも使える
3. `read` は Lisp object を stream から読む
4. `write` は制御可能な printer である
5. `print` は対話的表示寄りの convenience である

---

### 8. よくある誤解や落とし穴

#### 8.1 string と symbol を同じものだと思ってしまう

`"name"` と `name` は別物である。第14章の symbol と package の理解ともつながる。

#### 8.2 `format` は画面に出すだけの関数だと思ってしまう

出力先が `nil` なら string を返す。ここを知らないと、文字列生成の強力な道具を見落とす。

#### 8.3 `read` はただの行入力だと思ってしまう

`read` は Lisp object を読む。reader 構文に従って parse される点が重要である。

#### 8.4 `write` と `print` は完全に同じだと思ってしまう

どちらも printer だが、既定動作や用途が違う。可読性重視か対話表示重視かで選び分けるべきである。

#### 8.5 stream は file だけだと思ってしまう

string stream や標準入出力 stream もある。stream は媒体の抽象化として読む方が本質に近い。

---

### 9. Common Lisp 標準ではどう定義されるか

この章の仕様上の土台は、Strings、Streams、Printer、Reader の各章と、それぞれの operator 定義にある。

とくに重要なのは次の点である。

1. string は専用 operator 群を持つ object / sequence として扱われる
2. `format` は destination に応じて stream へ出力するか string を返す
3. stream は入力元と出力先を抽象化する型である
4. `read` は stream から Lisp object を読む reader operator である
5. `write` は printer の基本形であり、keyword 引数で出力方針を制御できる
6. `print` は printer の convenience であり、改行と空白を伴う対話表示寄りの既定動作を持つ

したがって、第18章は「文字列処理の小技集」ではなく、Common Lisp が object の読み書きをどう設計しているかを学ぶ章として読むべきである。


### 10. 参考 URL

- Common Lisp HyperSpec Function STRING-UPCASE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_stg_up.htm#string-upcase
- Common Lisp HyperSpec Function STRING-DOWNCASE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_stg_up.htm#string-downcase
- Common Lisp HyperSpec Function STRING-CAPITALIZE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_stg_up.htm#string-capitalize
  https://www.lispworks.com/documentation/HyperSpec/Body/f_format.htm#format
  https://www.lispworks.com/documentation/HyperSpec/Body/21_.htm
  https://www.lispworks.com/documentation/HyperSpec/Body/t_stream.htm#stream
- Common Lisp HyperSpec Function READ  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_rd_rd.htm#read
- Common Lisp HyperSpec Function READ-PRESERVING-WHITESPACE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_rd_rd.htm#read-preserving-whitespace
- Common Lisp HyperSpec Function WRITE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_wr_pr.htm#write
- Common Lisp HyperSpec Function PRIN1  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_wr_pr.htm#prin1
- Common Lisp HyperSpec Function PRINT  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_wr_pr.htm#print
- Common Lisp HyperSpec Function PPRINT  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_wr_pr.htm#pprint
- Common Lisp HyperSpec Function PRINC  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_wr_pr.htm#princ
  https://www.lispworks.com/documentation/HyperSpec/Body/m_w_in_f.htm#with-input-from-string
- Common Lisp HyperSpec Macro WITH-OUTPUT-TO-STRING  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_w_out_.htm#with-output-to-string
- Common Lisp HyperSpec Chapter 22 Printer  
  https://www.lispworks.com/documentation/HyperSpec/Body/22_.htm
- Common Lisp HyperSpec Chapter 23 Reader  
  https://www.lispworks.com/documentation/HyperSpec/Body/23_.htm
