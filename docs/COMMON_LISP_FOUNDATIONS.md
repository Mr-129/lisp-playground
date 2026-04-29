# Common Lisp Foundations

## 1. この文書の目的

この文書は、Common Lisp を体系的に学ぶための基礎ガイドである。

狙いは 2 つある。

1. 一通り読めば、Common Lisp のコードを「見て意味の見当がつく」状態になること
2. その後に Common Lisp HyperSpec を辞書として読めるようになること

この文書はチュートリアルと仕様書の中間を狙っている。説明は学習向けに再構成しているが、参照元はできるだけ一次情報を優先した。

以降で単に「Lisp」と書く場合、特に断らない限り Common Lisp を指す。

---

## 2. 一次情報の参照元

最優先で参照したのは Common Lisp HyperSpec である。

- [Common Lisp HyperSpec: Contents](https://www.lispworks.com/documentation/HyperSpec/Front/Contents.htm)
- [Common Lisp HyperSpec: Highlights](https://www.lispworks.com/documentation/HyperSpec/Front/Hilights.htm)
- [Chapter 2: Syntax](https://www.lispworks.com/documentation/HyperSpec/Body/02_.htm)
- [Section 2.4: Standard Macro Characters](https://www.lispworks.com/documentation/HyperSpec/Body/02_d.htm)
- [Section 2.4.8: Sharpsign](https://www.lispworks.com/documentation/HyperSpec/Body/02_dh.htm)
- [Chapter 3: Evaluation and Compilation](https://www.lispworks.com/documentation/HyperSpec/Body/03_.htm)
- [Section 3.1: Evaluation](https://www.lispworks.com/documentation/HyperSpec/Body/03_a.htm)
- [Section 3.1.2: The Evaluation Model](https://www.lispworks.com/documentation/HyperSpec/Body/03_ab.htm)
- [Section 3.1.2.1: Form Evaluation](https://www.lispworks.com/documentation/HyperSpec/Body/03_aba.htm)
- [Section 3.4: Lambda Lists](https://www.lispworks.com/documentation/HyperSpec/Body/03_d.htm)
- [Section 3.4.1: Ordinary Lambda Lists](https://www.lispworks.com/documentation/HyperSpec/Body/03_da.htm)
- [Chapter 10: Symbols](https://www.lispworks.com/documentation/HyperSpec/Body/10_.htm)
- [Section 10.1: Symbol Concepts](https://www.lispworks.com/documentation/HyperSpec/Body/10_a.htm)
- [Accessor SYMBOL-FUNCTION](https://www.lispworks.com/documentation/HyperSpec/Body/f_symb_1.htm)
- [Function SYMBOL-PACKAGE](https://www.lispworks.com/documentation/HyperSpec/Body/f_symb_3.htm)
- [Accessor SYMBOL-VALUE](https://www.lispworks.com/documentation/HyperSpec/Body/f_symb_5.htm)
- [Function KEYWORDP](https://www.lispworks.com/documentation/HyperSpec/Body/f_kwdp.htm)
- [Chapter 11: Packages](https://www.lispworks.com/documentation/HyperSpec/Body/11_.htm)
- [Section 11.1.1: Introduction to Packages](https://www.lispworks.com/documentation/HyperSpec/Body/11_aa.htm)
- [Chapter 14: Conses](https://www.lispworks.com/documentation/HyperSpec/Body/14_.htm)
- [Section 14.1: Cons Concepts](https://www.lispworks.com/documentation/HyperSpec/Body/14_a.htm)
- [Section 14.1.2: Conses as Lists](https://www.lispworks.com/documentation/HyperSpec/Body/14_ab.htm)
- [Chapter 22: Printer](https://www.lispworks.com/documentation/HyperSpec/Body/22_.htm)
- [Chapter 23: Reader](https://www.lispworks.com/documentation/HyperSpec/Body/23_.htm)
- [Section 23.1.2: Effect of Readtable Case on the Lisp Reader](https://www.lispworks.com/documentation/HyperSpec/Body/23_ab.htm)

重要な前提として、HyperSpec は仕様書であって入門書ではない。そのため、学習順はこの文書側で組み直している。

---

## 3. まず理解すべき全体像

Common Lisp を最短で理解するには、次の 5 点を先に押さえるとよい。

1. Lisp のコードは、基本的に S 式で書かれる
2. 読み取りは reader が担当し、評価は evaluator が担当する
3. フォームの評価規則は大きく 3 種類に分かれる
4. リストは cons cell の連鎖で表現される
5. シンボルはただの名前ではなく、言語の中心的なオブジェクトである

この 5 点が見えれば、Lisp は「括弧が多い謎の言語」ではなく、「データとコードの表現が近い言語」として見えてくる。

---

## 4. Lisp は何を読んでいるのか

### 4.1 S 式が基本単位

Lisp は、コードもデータも S 式として表現する。

最初に覚えるべき見方は次の 2 種類で十分である。

- atom
  - 数値、文字列、シンボルなど、これ以上リストとして分解しないもの
- list
  - 丸括弧で囲まれた並び

例えば、次は list である。

```lisp
(+ 1 2)
```

この list は、見た目上は 3 要素の並びだが、意味としては「`+` を `1` と `2` に適用するフォーム」として読まれる。

### 4.2 reader と evaluator は別物

HyperSpec の Syntax 章と Reader 章を前提にすると、Lisp 処理系は概念的に次のように考えられる。

1. reader が文字列を読んで Lisp object に変換する
2. evaluator がその object をフォームとして評価する
3. printer が結果を文字列表現に戻す

つまり、`'(1 2 3)` のような表記を見たとき、最初から evaluator が読んでいるわけではない。まず reader がそれを quote を含む Lisp object として読む。

この分離は Common Lisp 理解の中心である。

---

## 5. 構文の基本

HyperSpec Chapter 2 は Syntax、Chapter 23 は Reader を扱っている。初学者が先に押さえるべきのは次の項目である。

### 5.1 丸括弧

`(` と `)` は list を作る基本記法である。

```lisp
(print "hello")
```

これは「2 要素リスト」であり、評価時には多くの場合「関数呼び出しまたは特殊形式」として扱われる。

### 5.2 シングルクォート

HyperSpec 2.4.3 は single-quote を標準 macro character として扱っている。学習上は次の理解でよい。

- `'x` は `x` を評価しない
- `'(1 2 3)` はリストをデータとして扱う

```lisp
x
'x
'(1 2 3)
```

上から順に、通常は変数参照、シンボルそのもの、リストそのものになる。

### 5.3 文字列

`"..."` は文字列リテラルである。

```lisp
"hello"
```

文字列は self-evaluating object として扱われる。

### 5.4 コメント

標準 macro character として `;` がある。

```lisp
; これはコメント
(+ 1 2)
```

### 5.5 backquote と comma

HyperSpec 2.4.6 と 2.4.7 は backquote と comma を標準 macro character として扱う。

学習上の理解はこうでよい。

- backquote は「ほぼ quote だが、一部だけ評価したい」場面で使う
- comma は backquote の中で評価を再開する

```lisp
(let ((x 10))
  `(1 2 ,x))
```

これは概念的に `(1 2 10)` を作る。

backquote は非常に重要だが、最初の段階では「リストを組み立てる記法」として理解すれば十分である。

### 5.6 sharpsign

HyperSpec 2.4.8 は `#` を dispatching macro character として定義している。`#` は「次の文字で読み方が変わる」記号である。

初学者が最初に知ればよいのは次の程度でよい。

- `#'` は function abbreviation
- `#(...)` は simple vector
- `#\a` のような文字オブジェクト表記がある
- `#b`, `#o`, `#x`, `#r` で基数を指定できる

```lisp
#'car
#(1 2 3)
#\A
#xFF
```

特に `#'car` は「関数オブジェクトを明示する」記法として頻出する。

### 5.7 token と大文字小文字

Syntax 章には token interpretation があり、Common Lisp reader は token をシンボルや数値などに解釈する。

実務上まず覚えるべき点は次の 2 つである。

- シンボルは reader により大文字化されるのが標準的である
- `|...|` や `\` による escape を使うと、大文字小文字や特殊文字をそのまま保持できる

そのため、`foo`, `Foo`, `FOO` が同じシンボルとして扱われることがある。初学者が「なぜ REPL の出力が大文字なのか」と戸惑うのは普通である。

---

## 6. 評価の基本モデル

HyperSpec 3.1.2.1 Form Evaluation は、フォームを 3 つに分けている。

1. symbols
2. conses
3. self-evaluating objects

これが Common Lisp の評価規則の土台である。

### 6.1 symbol は通常「変数名」として評価される

HyperSpec 3.1.2.1.1 に沿えば、フォームが symbol の場合、その symbol は symbol macro であるか、そうでなければ variable の名前として扱われる。

```lisp
x
```

これは「シンボル `x` そのもの」ではなく、「変数 `x` の値」を取りに行く。

そのため、未束縛の変数をそのまま評価すると unbound-variable になる。

ここで初学者がつまずきやすい点は次の通りである。

- `x` と `'x` は別物
- `x` は変数参照
- `'x` はシンボルそのもの

### 6.2 cons は compound form として評価される

HyperSpec 3.1.2.1.2 に沿えば、フォームが cons のとき、それは compound form である。

そしてその処理は次のどれに分類されるかで決まる。

- special form
- macro form
- function form
- lambda form

概念的には次のように分けると理解しやすい。

- special form
  - 独自の評価規則を持つ
  - 例: `if`, `let`, `quote`, `progn`
- macro form
  - まずコード変換され、その展開後のフォームが評価される
  - 例: `when`, `unless`, `cond`, `loop`, `defmacro` で定義したもの
- function form
  - 通常の関数呼び出し
  - 引数が先に評価される
- lambda form
  - その場で書いた lambda expression を呼び出す形

例えば、これは function form である。

```lisp
(+ 1 2)
```

これは special form である。

```lisp
(if test then-form else-form)
```

### 6.3 self-evaluating object は自分自身を値にする

HyperSpec 3.1.2.1.3 に沿えば、symbol でも cons でもないフォームは self-evaluating object である。

初学者が最初に触れる self-evaluating object は次のようなものだと考えてよい。

- numbers
- characters
- strings
- vectors

```lisp
42
3.14
"hello"
```

これらはそのまま評価結果になる。

ただし HyperSpec は、literal object を破壊的変更することの結果は未定義だと明記している。つまり、リテラルを「その場で書いたから安全な可変データ」と考えるのは危険である。

---

## 7. 特殊形式・マクロ・関数の違い

Common Lisp を体系的に学ぶうえで、ここは非常に重要である。

### 7.1 関数

関数呼び出しでは、通常まず引数が評価される。

```lisp
(+ 1 2)
```

`+` は関数、`1` と `2` は引数である。

### 7.2 特殊形式

特殊形式は、通常の関数呼び出しとは違う評価規則を持つ。

例えば `if` は、条件式は評価するが then/else の両方を先に評価したりはしない。

```lisp
(if (> x 0)
    "positive"
    "non-positive")
```

同様に `let`, `let*`, `quote`, `setq`, `progn`, `block`, `return-from` なども、関数ではなく評価規則を持つ構文である。

### 7.3 マクロ

マクロは「評価前にコードを別のコードへ変換する仕組み」である。

```lisp
(when test
  (print "ok"))
```

`when` は本質的には `if` と `progn` の組み合わせへ展開できる。だから、マクロを理解するには「Lisp コードが Lisp データでもある」という事実が重要になる。

学習順としては、最初はマクロを自作しなくてよい。まずは「`when`, `unless`, `cond`, `loop` は関数ではなく構文拡張として振る舞う」と理解するだけで十分である。

---

## 8. データの基本単位: cons と list

HyperSpec Chapter 14 は Conses を扱う。Lisp 理解の核はここにある。

### 8.1 cons cell

cons cell は 2 つの部分を持つ。

- car
- cdr

概念的には次のように考えられる。

```lisp
(cons 1 2)
```

これは「左に 1、右に 2 を持つ 1 個の cons」であり、必ずしも proper list ではない。

### 8.2 list は cons の連鎖

```lisp
(list 1 2 3)
```

これは概念的には次と同じである。

```lisp
(cons 1 (cons 2 (cons 3 nil)))
```

ここで `nil` が list の終端になる。

### 8.3 nil は重要な特殊存在

`nil` は少なくとも次の顔を持つ。

- 空リスト
- 偽
- シンボル

この多面性は Common Lisp において非常に重要である。逆に言うと、`nil` を理解すれば Lisp の多くが読みやすくなる。

### 8.4 dotted pair と tree

cons は list だけでなく、tree や dotted pair の表現にも使える。

```lisp
(a . b)
```

この表記は proper list ではない。初学者は「Lisp の括弧は全部 list だ」と思いがちだが、正確には cons 構造の表記であり、その一部が list である。

---

## 9. シンボルは名前以上のもの

HyperSpec Chapter 10 は Symbols を扱う。Lisp を読むとき、シンボルは単なる文字列ではない。

初学者がまず理解すべき観点は次の通りである。

- symbol-name
  - シンボルの名前
- symbol-value
  - 値セル
- function cell に対応する側面
  - 関数名として使われる側面
- symbol-plist
  - property list
- symbol-package
  - どの package に属しているか

Common Lisp では、`symbol-value` と `symbol-function` が別の入口として定義されており、学習上は「変数としての値」と「関数としての定義」を分けて考えると理解しやすい。

例えば同じシンボル名でも、変数としての値と関数としての定義は区別される。

このため、次の区別が重要になる。

- `x`
  - 変数位置では値を指す
- `#'x`
  - 関数オブジェクトを指す意図を表す

---

## 10. packages を理解する

HyperSpec Chapter 11 は Packages を扱う。

package は「シンボルを整理し、名前衝突を避けるための仕組み」である。

初学者向けには次だけ理解すれば十分である。

1. シンボルは package と結びついている
2. 同じ名前でも package が違えば別シンボルになりうる
3. export されたシンボルは `package:symbol` の形で表記されうる
4. keyword は通常 `:name` のように書かれ、`KEYWORD` package に属する

このあたりを知らないと、なぜ `:test` が単なる変数名ではないのか、なぜ `cl:car` のような書き方があるのかが分からなくなる。

---

## 11. 変数束縛とスコープ

HyperSpec 3.1.1 と 3.1.2.1.1 は environment と variables を扱う。Common Lisp 理解では、束縛とスコープが非常に重要である。

### 11.1 lexical binding が基本

`let` で作る局所変数は通常 lexical である。

```lisp
(let ((x 10)
      (y 20))
  (+ x y))
```

この場合、`x` と `y` はその範囲の中でだけ有効である。

### 11.2 let と let*

学習上の違いは次の通りである。

- `let`
  - 変数初期値を同じ外側環境で計算してから束縛する
- `let*`
  - 左から順に束縛する

```lisp
(let ((x 1)
      (y 2))
  ...)

(let* ((x 1)
       (y (+ x 1)))
  ...)
```

### 11.3 dynamic variable

HyperSpec は lexical variable と dynamic variable を区別している。最初は lexical binding を中心に学べばよいが、Common Lisp には特殊変数による dynamic binding もある。

学習上は次の理解で十分である。

- 局所計算の中心は lexical
- 全体設定や文脈の受け渡しに dynamic binding が使われることがある

---

## 12. 関数と lambda expression

HyperSpec 3.1.3 と 3.4 は、lambda expression と lambda list を扱う。

### 12.1 lambda は無名関数

```lisp
(lambda (x) (* x x))
```

これは関数を作る式である。

### 12.2 defun は名前付き関数定義

```lisp
(defun square (x)
  (* x x))
```

初学者向けには、`defun` は「名前と lambda expression を結びつける構文」と考えると分かりやすい。

### 12.3 closure

HyperSpec 3.1.4 は closures and lexical binding を扱う。Lisp の強みのひとつは closure である。

```lisp
(defun make-adder (n)
  (lambda (x) (+ x n)))
```

この関数が返す lambda は、外側の `n` を覚えている。

### 12.4 ordinary lambda list

HyperSpec 3.4.1 によれば、ordinary lambda list は関数が引数をどう受け取るかを記述する。

基本キーワードは次の通りである。

- required parameters
- `&optional`
- `&rest`
- `&key`
- `&allow-other-keys`
- `&aux`

典型例は次のようになる。

```lisp
(defun demo (x &optional y &rest more &key verbose &allow-other-keys &aux temp)
  ...)
```

初学者はまず次だけ覚えればよい。

- 必須引数
- `&optional`
- `&rest`
- `&key`

`&aux` や `&allow-other-keys` は後回しでよい。

---

## 13. 制御構文の最小セット

体系的に学ぶなら、最初に覚える制御構文は絞った方がよい。

### 13.1 if

最小の条件分岐である。

```lisp
(if test
    then-form
    else-form)
```

### 13.2 progn

複数フォームを順に評価し、最後の値を返す。

```lisp
(progn
  (print 1)
  (print 2)
  42)
```

### 13.3 setq

変数へ値を代入する基本形である。

```lisp
(setq x 10)
```

### 13.4 block / return-from

HyperSpec は `block` と `return-from` を制御移動の基本として持つ。

```lisp
(block search
  (when found
    (return-from search value))
  nil)
```

### 13.5 その次に学ぶもの

次の構文は早めに触れてよいが、最初の理解には必須ではない。

- `cond`
- `when`
- `unless`
- `and`, `or`, `not`
- `catch`, `throw`
- `tagbody`, `go`
- `unwind-protect`

特に `when` と `unless` は実用頻度が高いが、概念的には `if` と `progn` を理解した後で十分ついていける。

---

## 14. マクロはなぜ重要か

Common Lisp を「Lisp らしい言語」にしている最大の要素のひとつがマクロである。

### 14.1 マクロは関数ではない

関数は引数を評価した後で実行される。マクロは、評価前のフォームを受け取り、別のフォームへ変換する。

### 14.2 なぜ書けるのか

コードが list と symbol を中心にしたデータ構造で表現されているからである。

### 14.3 学習順の注意

最初から `defmacro` を書き始める必要はない。順序としては次が安全である。

1. quote を理解する
2. list / cons を理解する
3. backquote / comma を理解する
4. 既存マクロを読む
5. 最後に `defmacro` を書く

---

## 15. Reader, Printer, REPL

HyperSpec Chapter 22 と Chapter 23 は、Lisp を「対話的な言語」として理解するために重要である。

### 15.1 REPL は read-eval-print loop

REPL は次の繰り返しである。

1. read
2. eval
3. print

このため、Common Lisp の学習では「コードを書く」だけでなく「reader がどう読むか」「printer がどう表示するか」も理解する必要がある。

### 15.2 読みと表示は対称ではない

print されたものが常に元の入力と完全に同じ見た目になるわけではない。特にシンボルの大文字化、文字列の表示、パッケージ接頭辞の表示などで戸惑いやすい。

### 15.3 formatted output

Common Lisp では `format` が非常に重要である。仕様上は Printer 章の Formatted Output に位置づけられている。

入門段階では次だけ覚えるとよい。

- `~A`
- `~S`
- `~D`
- `~%`

---

## 16. Common Lisp を読むための最小語彙

ここまで読んだら、少なくとも次の語彙は説明できるようにしたい。

- S-expression
- atom
- list
- cons
- symbol
- package
- form
- self-evaluating object
- special operator / special form
- macro form
- function form
- lambda expression
- lexical binding
- dynamic binding
- closure
- reader macro
- literal object

この語彙が通れば、HyperSpec の章タイトルや辞書項目を見たときに「何の話か」が追えるようになる。

---

## 17. まずはここまでで十分、という学習順

### Phase 1: 見た目を読む

目標:

- 数値、文字列、シンボル、リストの区別がつく
- quote が分かる
- `(+ 1 2)` が関数呼び出しだと分かる

読むべき範囲:

- Syntax
- Reader の概念

### Phase 2: 評価を理解する

目標:

- symbol / cons / self-evaluating object の 3 分類が分かる
- 関数と特殊形式の違いが説明できる

読むべき範囲:

- Evaluation
- The Evaluation Model
- Form Evaluation

### Phase 3: データ構造を理解する

目標:

- cons と list の関係が分かる
- `nil` の役割が分かる
- tree と dotted pair が読める

読むべき範囲:

- Conses
- Symbols
- Packages

### Phase 4: 関数を書く

目標:

- `defun`, `lambda`, `let`, `let*`, `if`, `progn`, `setq` が書ける
- `&optional`, `&rest`, `&key` の違いが分かる

読むべき範囲:

- Lambda Expressions
- Lambda Lists
- Data and Control Flow

### Phase 5: Lisp らしさに入る

目標:

- backquote / comma が読める
- 基本的なマクロ展開の感覚がある
- REPL と reader/printer の関係が説明できる

読むべき範囲:

- Standard Macro Characters
- Sharpsign
- Reader
- Printer

---

## 18. 初学者が誤解しやすい点

### 18.1 「括弧が意味そのもの」ではない

括弧は list を表す。意味は evaluator が与える。

### 18.2 シンボルは文字列ではない

シンボルは名前を持つ Lisp object であり、value, function, package などの文脈と結びつく。

### 18.3 `x` と `'x` はまったく違う

- `x` は通常、変数参照
- `'x` はシンボルそのもの

### 18.4 Lisp のコードは全部「関数呼び出し」ではない

`if`, `let`, `quote`, `setq`, `progn`, `block` などは特別な評価規則を持つ。

### 18.5 `nil` はただの空リストではない

空リストであり、偽でもあり、シンボルでもある。

### 18.6 まずは Common Lisp を学ぶ

「Lisp」という語は Scheme, Racket, Clojure, Emacs Lisp なども含みうる。だが、それぞれ評価規則や標準ライブラリ、マクロ、名前空間の設計が違う。最初は方言を混ぜない方が理解しやすい。

---

## 19. このプロジェクトとの関係

このリポジトリの実装は Common Lisp の完全実装ではなく、学習用のサブセット実装である。

したがって、次のように読むとよい。

- この文書
  - Common Lisp 全体の考え方を理解するための地図
- プロジェクトの README
  - この実装がどこまで対応しているかの実用情報
- HyperSpec
  - 正式な参照辞書

つまり、この文書は「言語理解」、README は「このアプリで何が動くか」、HyperSpec は「仕様の原典」という役割分担で見るとよい。

---

## 20. ここまで読んだら確認したいチェックリスト

次の質問に説明で答えられれば、Common Lisp の基礎はかなり掴めている。

1. reader と evaluator の違いは何か
2. フォームが symbol のとき、どう評価されるか
3. フォームが cons のとき、何によって処理が変わるか
4. self-evaluating object とは何か
5. quote は何のためにあるか
6. cons と list の関係は何か
7. `nil` はなぜ特別か
8. `let` と `let*` の違いは何か
9. `lambda` と `defun` の違いは何か
10. 関数とマクロの違いは何か
11. `#'` は何を意味するか
12. package は何のためにあるか

この 12 問が通れば、少なくとも「Common Lisp のコードを見て大枠を理解する」段階には入っている。

---

## 21. 次に読むべき一次情報

基礎を終えた次の順番はこの通りがよい。

1. [Chapter 2: Syntax](https://www.lispworks.com/documentation/HyperSpec/Body/02_.htm)
2. [Chapter 3: Evaluation and Compilation](https://www.lispworks.com/documentation/HyperSpec/Body/03_.htm)
3. [Chapter 10: Symbols](https://www.lispworks.com/documentation/HyperSpec/Body/10_.htm)
4. [Chapter 11: Packages](https://www.lispworks.com/documentation/HyperSpec/Body/11_.htm)
5. [Chapter 14: Conses](https://www.lispworks.com/documentation/HyperSpec/Body/14_.htm)
6. [Chapter 22: Printer](https://www.lispworks.com/documentation/HyperSpec/Body/22_.htm)
7. [Chapter 23: Reader](https://www.lispworks.com/documentation/HyperSpec/Body/23_.htm)
8. [Chapter 5: Data and Control Flow](https://www.lispworks.com/documentation/HyperSpec/Body/05_.htm)
9. [Chapter 6: Iteration](https://www.lispworks.com/documentation/HyperSpec/Body/06_.htm)

学習の感覚としては、Chapter 2, 3, 10, 14 を抜けると「Lisp の見え方」が変わる。

---

## 22. まとめ

Common Lisp の基礎理解は、文法項目を丸暗記することではない。次の 4 本柱を掴むことが重要である。

1. reader が文字列を object に変える
2. evaluator が form を評価する
3. コードの大半は symbol と cons でできている
4. シンボル、cons、package、lambda、macro が Lisp の中核である

この観点で読むと、Common Lisp は複雑な言語というより、「記法、データ構造、評価規則がきれいに接続された言語」として見えてくる。
