# Common Lisp 教科書ドラフト 第7章から第9章

**作成日**: 2026年5月1日  
**対象範囲**: 第7章 データ型の全体像 / 第8章 変数と束縛 / 第9章 関数と lambda list  
**位置づけ**: 教科書本文の先行ドラフト

**関連文書**:
- [COMMON_LISP_TEXTBOOK_OUTLINE.md](./COMMON_LISP_TEXTBOOK_OUTLINE.md)
- [COMMON_LISP_TEXTBOOK_CH04_06.md](./COMMON_LISP_TEXTBOOK_CH04_06.md)
- [COMMON_LISP_FOUNDATIONS.md](./COMMON_LISP_FOUNDATIONS.md)

---

## この文書の読み方

この文書は、教科書の第7章から第9章に相当する本文ドラフトである。

各章では、次の 6 要素を揃える。

1. その章の結論
2. 基本概念の説明
3. 最小コード例
4. よくある誤解や落とし穴
5. Common Lisp 標準ではどう定義されるか
6. 参考 URL

---

## 第7章 データ型の全体像

### 1. この章の結論

Common Lisp を読み進めるには、個々の関数を先に覚えるよりも、**どの kind の object を相手にしているのかを見分ける地図**を持つ方が重要である。

この章の核は次の 4 点である。

1. Common Lisp には numbers、characters、strings、symbols、conses、arrays、hash tables など多様な型がある
2. list は cons の連鎖として表される
3. vector は array の一種である
4. `nil` と `t` は、単なる予約語ではなく、言語全体で特別な役割を持つ object である

---

### 2. 型を地図として眺める

Common Lisp では、日常的に使う object の種類がかなり多い。初学者向けには、まず次の 7 系統を地図として持つとよい。

1. numbers
2. characters
3. strings
4. symbols
5. conses / lists
6. arrays / vectors
7. hash tables

この段階では、すべての subtype を暗記する必要はない。重要なのは、「今読んでいる form が、どの kind の object を返し、どの kind の object を受け取るか」を見失わないことである。

---

### 3. numbers、characters、strings

最初に触れる self-evaluating object の中心は、数値、文字、文字列である。

```lisp
42
```

```lisp
#\A
```

```lisp
"hello"
```

これらは見た目も分かりやすく、reader の段階でそれぞれ number、character、string として読まれる。

学習上の要点は次の通りである。

- numbers は数値演算の対象になる
- characters は単一文字の object である
- strings は文字列であり、symbol とは別物である

特に `foo` と `"foo"` を混同しないことが重要である。前者は通常 symbol、後者は string である。

---

### 4. symbols、conses、lists

symbol は、Common Lisp で名前や識別子の中心になる object である。symbol には変数としての側面、関数名としての側面、package との結びつきなどがある。

一方、cons は 2 つの部分を持つ基本構造であり、list はその cons の連鎖として表される。

```lisp
(cons 1 2)
```

```lisp
(list 1 2 3)
```

```lisp
(cons 1 (cons 2 (cons 3 nil)))
```

2 番目と 3 番目は概念的には同じ list を表している。

ここで重要なのは、「Lisp の括弧は全部 list」と思い込まないことである。dotted pair のように、cons 構造ではあるが proper list ではない表記もある。

---

### 5. arrays、vectors、hash tables

Common Lisp は list だけの言語ではない。配列系や連想構造も標準で備えている。

#### 5.1 array と vector

array は一般的な配列型であり、vector は 1 次元 array の一種である。

```lisp
#(1 2 3)
```

この表記は simple vector の代表例である。list と違って、vector はランダムアクセスを意識した配列構造として使われる。

#### 5.2 hash table

hash table は、key から value を引くための標準的な連想構造である。入門段階では「list や alist だけでなく、標準の辞書構造もある」と理解すれば十分である。

```lisp
(make-hash-table)
```

この章では詳細な API よりも、「Common Lisp の標準型の地図に hash table も含まれる」と把握することが重要である。

---

### 6. `nil` と `t`

`nil` と `t` は、初学者が早い段階で必ず出会う特別な object である。

`nil` は少なくとも次の顔を持つ。

1. 空リスト
2. 偽
3. symbol

`t` は、標準的な真の代表値として使われる symbol である。

```lisp
nil
```

```lisp
t
```

この 2 つの役割を早く理解しておくと、条件分岐、list 処理、真偽判定がかなり読みやすくなる。

---

### 7. 最小コード例

第7章の最小例としては、次の 8 つで十分である。

```lisp
42
```

```lisp
#\A
```

```lisp
"hello"
```

```lisp
foo
```

```lisp
(cons 1 2)
```

```lisp
(list 1 2 3)
```

```lisp
#(1 2 3)
```

```lisp
nil
```

ここから見えることは次の通りである。

1. 見た目が違えば、reader が返す object の種類も違う
2. symbol と string は別物である
3. list は cons の連鎖として理解できる
4. Common Lisp には list 以外の標準構造もある

---

### 8. よくある誤解や落とし穴

#### 8.1 Lisp は list しかないと思ってしまう

list は重要だが、numbers、strings、vectors、hash tables なども標準的に使う。list だけで全てを説明しようとすると、後で設計が歪みやすい。

#### 8.2 symbol と string を同じものだと思ってしまう

`foo` と `"foo"` は全く別の object である。symbol は名前に関わり、string は文字列データである。

#### 8.3 `nil` を単なる false としか見ない

`nil` は false でもあるが、同時に空リストでもあり symbol でもある。この多面性を見落とすと、list 処理の理解が浅くなる。

---

### 9. Common Lisp 標準ではどう定義されるか

この章の仕様上の土台は、Types and Classes、Symbols、Conses、Arrays、Hash Tables などの章にまたがっている。

とくに重要なのは次の点である。

1. Common Lisp の型は 1 章だけで閉じず、複数章に分かれて定義される
2. symbol、cons、array、hash table はそれぞれ独立の重要概念である
3. `nil` と `t` の扱いは、真偽値、list、symbol の理解と結びついている

したがって、第7章は「型名の一覧」を覚える章ではなく、以後の学習で迷わないための型の地図を作る章として読むべきである。

---

### 10. 参考 URL

- Common Lisp HyperSpec Chapter 4 Types and Classes  
  https://www.lispworks.com/documentation/HyperSpec/Body/04_.htm
- Common Lisp HyperSpec Chapter 10 Symbols  
  https://www.lispworks.com/documentation/HyperSpec/Body/10_.htm
- Common Lisp HyperSpec Section 10.1 Symbol Concepts  
  https://www.lispworks.com/documentation/HyperSpec/Body/10_a.htm
- Common Lisp HyperSpec Chapter 12 Numbers  
  https://www.lispworks.com/documentation/HyperSpec/Body/12_.htm
- Common Lisp HyperSpec Chapter 13 Characters  
  https://www.lispworks.com/documentation/HyperSpec/Body/13_.htm
- Common Lisp HyperSpec Chapter 14 Conses  
  https://www.lispworks.com/documentation/HyperSpec/Body/14_.htm
- Common Lisp HyperSpec Section 14.1.2 Conses as Lists  
  https://www.lispworks.com/documentation/HyperSpec/Body/14_ab.htm
- Common Lisp HyperSpec Chapter 15 Arrays  
  https://www.lispworks.com/documentation/HyperSpec/Body/15_.htm
- Common Lisp HyperSpec Chapter 16 Strings  
  https://www.lispworks.com/documentation/HyperSpec/Body/16_.htm
- Common Lisp HyperSpec Chapter 18 Hash Tables  
  https://www.lispworks.com/documentation/HyperSpec/Body/18_.htm

---

## 第8章 変数と束縛

### 1. この章の結論

Common Lisp の変数を理解するには、単に「名前に値が入る」と見るだけでは足りない。重要なのは、**その名前がどこで束縛され、どの範囲で見え、lexical なのか special なのかを区別すること**である。

この章の核は次の 4 点である。

1. `let` と `let*` は局所束縛の基本である
2. `setq` と `setf` は代入に関わるが、役割は同じではない
3. `defvar` と `defparameter` は special variable を定義する代表的な手段である
4. Common Lisp の基本は lexical binding だが、special variable による dynamic binding も重要である

---

### 2. 束縛とは何か

束縛とは、symbol に対してその文脈で使う値を結びつけることである。

```lisp
(let ((x 10))
  x)
```

この式では、`x` という symbol が、この `let` の内部で値 10 を持つように束縛される。束縛の理解で重要なのは、symbol 自体と、その時点で見える binding を分けて考えることだ。

同じ symbol 名でも、異なる lexical scope では別の binding を持ちうる。

---

### 3. `let` と `let*`

局所変数を作る最初の基本は `let` と `let*` である。

#### 3.1 `let`

`let` では、初期値は同じ外側環境で計算され、その後で各変数が束縛される。

```lisp
(let ((x 1)
      (y 2))
  (+ x y))
```

#### 3.2 `let*`

`let*` では、左から順に束縛が作られる。

```lisp
(let* ((x 1)
       (y (+ x 1)))
  (+ x y))
```

この違いを曖昧にしないことが重要である。`let` と `let*` は見た目が似ているが、初期値評価の文脈が違う。

---

### 4. `setq` と `setf`

`setq` は、変数へ値を代入する基本形である。

```lisp
(setq x 10)
```

一方 `setf` は、より一般的な place に対する代入を扱う。

```lisp
(setf x 10)
```

```lisp
(setf (car xs) 10)
```

学習上は次の理解でよい。

- `setq`
  - symbol への代入を扱う基本形
- `setf`
  - generalized variable を含む広い代入の仕組み

入門段階では `setq` と `setf` の両方を見かけるが、「`setf` の方が一般的」と押さえておけば十分である。

---

### 5. `defvar` と `defparameter`

Common Lisp では、special variable を定義する代表的な手段として `defvar` と `defparameter` がある。

```lisp
(defvar *limit* 10)
```

```lisp
(defparameter *timeout* 30)
```

学習上の違いは次の通りである。

- `defvar`
  - すでに値があるなら再初期化しない
- `defparameter`
  - 評価時に再初期化する意図が強い

この違いは、設定値を保持したいのか、毎回更新したいのかを考えると理解しやすい。

---

### 6. lexical binding と special variable

Common Lisp では、通常の局所変数は lexical binding で理解するのが基本である。

```lisp
(let ((x 10))
  (+ x 1))
```

この `x` は lexical variable として働く。

一方、special variable は dynamic binding の振る舞いを持つ。学習初期では、次の程度の理解で十分である。

1. 普通の局所計算は lexical binding を前提に読む
2. 全体設定や文脈共有では special variable が使われることがある
3. `defvar` や `defparameter` は special variable と関係が深い

ここで重要なのは、lexical と dynamic を同じものとして読まないことである。

---

### 7. 最小コード例

第8章の最小例としては、次の 6 つで十分である。

```lisp
(let ((x 10))
  x)
```

```lisp
(let* ((x 1)
       (y (+ x 1)))
  y)
```

```lisp
(setq x 10)
```

```lisp
(setf (car xs) 10)
```

```lisp
(defvar *limit* 10)
```

```lisp
(defparameter *timeout* 30)
```

ここから見えることは次の通りである。

1. binding は scope の中で値を与える
2. `let` と `let*` は初期値評価の振る舞いが違う
3. `setf` は symbol 以外の place にも使える
4. special variable には専用の定義パターンがある

---

### 8. よくある誤解や落とし穴

#### 8.1 変数は symbol そのものだと思ってしまう

symbol と binding は分けて考える必要がある。同じ symbol 名でも、異なる scope では別の binding が見える。

#### 8.2 `let` と `let*` はほぼ同じだと思ってしまう

似て見えるが、初期値評価の文脈が違う。ここを曖昧にすると、後で依存する束縛を読むときに混乱する。

#### 8.3 `setq` と `setf` の違いを無視してしまう

短い例では似て見えるが、`setf` は generalized variable を扱える。list の要素や slot などへ代入するときに差が出る。

---

### 9. Common Lisp 標準ではどう定義されるか

この章の仕様上の基礎は、Environment、Symbols as Forms、変数の分類、`let`、`let*`、`setq`、`defvar`、`defparameter`、`setf` などにまたがっている。

とくに重要なのは次の点である。

1. symbol as form は variable または symbol macro として扱われる
2. lexical variable と dynamic variable は区別される
3. 代入は単なる `setq` だけでなく generalized variable の体系も持つ

したがって、第8章は「変数に値を入れる方法」を覚える章ではなく、binding と scope の規則を学ぶ章として読むべきである。

---

### 10. 参考 URL

- Common Lisp HyperSpec Section 3.1.1 Introduction to Environments  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_aa.htm
- Common Lisp HyperSpec Section 3.1.2.1.1 Symbols as Forms  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_abaa.htm
- Common Lisp HyperSpec Section 3.1.2.1.1.1 Lexical Variables  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_abaaa.htm
- Common Lisp HyperSpec Section 3.1.2.1.1.2 Dynamic Variables  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_abaab.htm
- Common Lisp HyperSpec Special Operator LET  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_let_l.htm#let
- Common Lisp HyperSpec Special Operator LET*  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_let_l.htm#letST
  https://www.lispworks.com/documentation/HyperSpec/Body/s_setq.htm#setq
- Common Lisp HyperSpec Macro DEFPARAMETER  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_defpar.htm#defparameter
- Common Lisp HyperSpec Macro DEFVAR  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_defpar.htm#defvar
  https://www.lispworks.com/documentation/HyperSpec/Body/m_setf_.htm#setf

---

## 第9章 関数と lambda list

### 1. この章の結論

Common Lisp の関数を理解するには、`defun` の書き方だけでなく、**関数が object であること、`lambda` が無名関数を作ること、lambda list が引数の受け取り規則を定義すること**をまとめて見る必要がある。

この章の核は次の 4 点である。

1. `lambda` は無名関数の定義を表す lambda expression を書く
2. `defun` は名前と関数定義を結びつける代表的な構文である
3. ordinary lambda list では required、`&optional`、`&rest`、`&key` などで引数受け取りを記述する
4. closure を理解すると、lexical binding が関数とどう結びつくかが見えてくる

---

### 2. `lambda` と関数 object

Common Lisp では、関数は名前だけではなく object として扱える。ただし、lambda expression そのものと function object は区別して読む方が正確である。

```lisp
(lambda (x) (* x x))
```

これは無名関数を表す lambda expression である。

```lisp
#'(lambda (x) (* x x))
```

これは `function` special operator の省略記法を使って、その lambda expression から closure を得る例である。

第6章で見た lambda form を思い出すと、lambda expression は operator 位置でも使われ、その場で呼び出される。このため、関数は「名前で呼ぶもの」だけでなく、その場で作って使う object としても理解できる。

```lisp
((lambda (x) (* x x)) 5)
```

この見方がないと、後で closure や高階関数を読むときに苦しくなる。

---

### 3. `defun`

`defun` は、名前付き関数を定義する代表的な構文である。

```lisp
(defun square (x)
  (* x x))
```

学習上は、`defun` を「symbol の function namespace に関数定義を与える構文」と考えると分かりやすい。

ここで重要なのは、変数としての symbol の値と、関数としての定義を混同しないことである。この区別があるからこそ、`x` と `#'x` の違いも理解しやすくなる。

---

### 4. ordinary lambda list

ordinary lambda list は、関数が引数をどう受け取るかを記述する。

#### 4.1 required parameters

最も基本なのは必須引数である。

```lisp
(defun add2 (x y)
  (+ x y))
```

#### 4.2 `&optional`

任意引数を表す。

```lisp
(defun greet (name &optional title)
  ...)
```

#### 4.3 `&rest`

残りの引数を list として受け取る。

```lisp
(defun sum-all (&rest numbers)
  ...)
```

#### 4.4 `&key`

キーワード引数を受け取る。

```lisp
(defun connect (&key host port)
  ...)
```

初学者はまず、required、`&optional`、`&rest`、`&key` の 4 種類を区別できれば十分である。

---

### 5. closure

closure は、外側の lexical binding を覚えたまま振る舞う関数である。

```lisp
(defun make-adder (n)
  (lambda (x)
    (+ x n)))
```

この `lambda` は、外側の `n` を覚えている。そのため、lexical binding と関数 object を結びつけて理解することが重要になる。

closure を理解すると、関数が単なる処理の箱ではなく、「環境を伴った object」として振る舞うことが見えてくる。

---

### 6. 関数名と関数 object の区別

Common Lisp では、value namespace と function namespace を区別しているので、関数名と関数 object も分けて考える必要がある。

```lisp
square
```

```lisp
#'square
```

前者は value の位置では通常変数参照として読まれ、後者は `function` special operator の省略記法として current lexical environment における関数 object を指す。

この区別を理解しておくと、`mapcar` などへ関数を渡すときの書き方が読みやすくなる。

```lisp
(mapcar #'square '(1 2 3))
```

---

### 7. 最小コード例

第9章の最小例としては、次の 6 つで十分である。

```lisp
#'(lambda (x) (* x x))
```

```lisp
(defun square (x)
  (* x x))
```

```lisp
(defun greet (name &optional title)
  ...)
```

```lisp
(defun sum-all (&rest numbers)
  ...)
```

```lisp
(defun connect (&key host port)
  ...)
```

```lisp
(defun make-adder (n)
  (lambda (x)
    (+ x n)))
```

ここから見えることは次の通りである。

1. `function` または `#'` で関数 object を明示できる
2. `defun` は名前付き関数定義の基本である
3. lambda list により引数受け取りを細かく記述できる
4. closure は lexical binding を関数が保持する例である

---

### 8. よくある誤解や落とし穴

#### 8.1 `defun` だけ覚えれば関数は十分だと思ってしまう

`defun` は重要だが、`lambda` と closure を理解しないと Common Lisp の関数観は半分しか見えない。

#### 8.2 `&rest` と `&key` を同じものだと思ってしまう

どちらも引数の柔軟性に関わるが、`&rest` は残りの実引数を list で受け取り、`&key` は名前付き引数を扱う。役割が違う。

#### 8.3 関数名と関数 object を混同してしまう

`square` と `#'square` は同じ書き方ではない。高階関数や関数渡しでは、この違いが重要になる。

---

### 9. Common Lisp 標準ではどう定義されるか

この章の仕様上の基礎は、Lambda Expressions、Closures and Lexical Binding、Lambda Lists にある。

とくに重要なのは次の点である。

1. lambda expression は function form や lambda form の理解とつながっている
2. closure は lexical binding と組み合わせて理解される
3. ordinary lambda list は関数の引数受け取り規則を体系的に定義する

したがって、第9章は「関数の書き方」を覚える章ではなく、関数 object、引数規則、closure をまとめて理解する章として読むべきである。

---

### 10. 参考 URL

- Common Lisp HyperSpec Section 3.1.3 Lambda Expressions  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_ac.htm
- Common Lisp HyperSpec Section 3.1.4 Closures and Lexical Binding  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_ad.htm
- Common Lisp HyperSpec Section 3.4 Lambda Lists  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_d.htm
- Common Lisp HyperSpec Section 3.4.1 Ordinary Lambda Lists  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_da.htm
- Common Lisp HyperSpec Macro DEFUN  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_defun.htm#defun
- Common Lisp HyperSpec Special Operator FUNCTION  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_fn.htm#function
- Common Lisp HyperSpec Accessor SYMBOL-FUNCTION  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_symb_1.htm#symbol-function

---

## 次の候補

第10章以降へ進むなら、次の順でつなぐのが自然である。

1. 第10章 制御構造
2. 第11章 cons・list・tree の処理
3. 第12章 反復と再帰

この順で進めると、第7章から第9章で導入した「型」「束縛」「関数定義」を、そのまま制御構造とデータ処理の本論へ接続できる。