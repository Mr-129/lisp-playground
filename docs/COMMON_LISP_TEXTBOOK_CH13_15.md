# Common Lisp 教科書ドラフト 第13章から第15章

**作成日**: 2026年5月1日  
**対象範囲**: 第13章 多値と generalized variable / 第14章 symbol と package / 第15章 macro  
**位置づけ**: 教科書本文の先行ドラフト

**関連文書**:
- [COMMON_LISP_TEXTBOOK_OUTLINE.md](./COMMON_LISP_TEXTBOOK_OUTLINE.md)
- [COMMON_LISP_TEXTBOOK_CH10_12.md](./COMMON_LISP_TEXTBOOK_CH10_12.md)
- [COMMON_LISP_FOUNDATIONS.md](./COMMON_LISP_FOUNDATIONS.md)

---

## この文書の読み方

この文書は、教科書の第13章から第15章に相当する本文ドラフトである。

各章では、次の 6 要素を揃える。

1. その章の結論
2. 基本概念の説明
3. 最小コード例
4. よくある誤解や落とし穴
5. Common Lisp 標準ではどう定義されるか
6. 参考 URL

---

## 第13章 多値と generalized variable

### 1. この章の結論

Common Lisp では、式は常に 1 個の値だけを返すとは限らない。**1 個の primary value に加えて、必要なら追加の値を返せる**。同時に、代入先も単なる変数名に限られず、**place として読める場所なら `setf` で更新できる**。この 2 つを理解すると、Common Lisp が実用的な言語としてどれだけ柔軟かが見えてくる。

この章の核は次の 4 点である。

1. Common Lisp の式は 0 個以上の値を返せる
2. 多くの文脈は primary value だけを受け取り、残りは捨てる
3. `multiple-value-bind` は複数の返り値を束縛する基本手段である
4. `setf` は変数だけでなく place を更新できる

---

### 2. multiple values の基本

Common Lisp では、1 つの式が複数の値を返せる。

```lisp
(values 1 2 3)
```

これは list を返しているのではない。`1`、`2`、`3` という 3 個の値を返している。

ここで重要なのは、すべての文脈が複数値を保持するわけではない点である。たとえば多くの通常の受け取り側は primary value だけを使い、残りは捨てる。

```lisp
(list (values 1 2 3))
```

この式を「3 要素の list ができる」と読むのは誤りである。`list` に渡るのは通常、primary value だけだと理解する必要がある。

---

### 3. `multiple-value-bind`

複数の返り値をはっきり受け取りたいときは `multiple-value-bind` を使う。

```lisp
(multiple-value-bind (a b c)
    (values 1 2 3)
  (list a b c))
```

この形を使うと、複数の値を別々の変数へ束縛できる。

返された値より変数の方が多ければ、余った変数には `nil` が入る。逆に値の方が多ければ、余分な値は捨てられる。

学習上の要点は、multiple values は「複数要素のコンテナ」ではなく、評価の結果として複数個の値が返る仕組みだということである。そのため、必要なら `multiple-value-bind` や `multiple-value-list` のような受け口を使う。

---

### 4. place と `setf`

第8章で見た `setq` は変数に値を入れるための基本形だったが、Common Lisp では更新対象をより一般化して扱える。ここで出てくるのが place という考え方である。

```lisp
(setf x 10)
```

これは単純な変数更新だが、`setf` はそれだけに限られない。

```lisp
(setf (car xs) 'a)
```

このように、`car` で見えている場所も更新対象にできる。つまり `setf` は「変数へ代入する記法」というより、「値を格納できる場所を更新する共通インターフェース」として理解する方が正確である。

---

### 5. generalized variable の見方

Common Lisp 標準では、`setf` が扱う「更新可能な場所」を generalized variable として整理する。

入門段階では、次の 3 種類を押さえれば十分である。

1. 変数そのもの
2. cons や配列、hash table などの一部を指す place
3. `setf` 用の拡張規則を持つ accessor

したがって、generalized variable は「新しい変数の種類」ではない。あるフォームが place として使えるかどうか、という見方で理解するのが重要である。

---

### 6. `setq` と `setf` の使い分け

学習上は次のように整理すると分かりやすい。

1. `setq` は変数への代入
2. `setf` は一般化された更新

```lisp
(setq x 10)
```

```lisp
(setf (car xs) 10)
```

`setf` は `setq` の完全な別物というより、より広い更新モデルに立つ記法である。実務では `setf` を中心に読む場面が多いが、`setq` が変数への代入の基本であることも押さえておくと理解しやすい。

---

### 7. 最小コード例

第13章の最小例としては、次の 6 つで十分である。

```lisp
(values 1 2 3)
```

```lisp
(list (values 1 2 3))
```

```lisp
(multiple-value-bind (a b c)
    (values 1 2 3)
  (list a b c))
```

```lisp
(setq x 10)
```

```lisp
(setf x 10)
```

```lisp
(setf (car xs) 'a)
```

ここから見えることは次の通りである。

1. 多値は list とは違う
2. primary value だけが使われる文脈が多い
3. 複数値を受け取るには専用の受け口が必要である
4. `setf` は変数名以外の place も更新できる

---

### 8. よくある誤解や落とし穴

#### 8.1 `values` は list を返すと思ってしまう

`values` は list を返すわけではない。複数の値を返す。list が必要なら明示的に作る必要がある。

#### 8.2 すべての文脈が多値を保持すると誤解する

多くの文脈は primary value だけを使う。複数値を保持したいなら `multiple-value-bind` などを使う必要がある。

#### 8.3 `setf` は変数代入の別名だと思ってしまう

`setf` は place を更新するための共通記法であり、単純な変数代入に限られない。

#### 8.4 どんなフォームでも place になると思ってしまう

place になれるフォームには規則がある。見た目が「場所っぽい」からといって自由に `setf` できるわけではない。

---

### 9. Common Lisp 標準ではどう定義されるか

この章の仕様上の土台は、Data and Control Flow の multiple values 群と、Generalized Reference の place / `setf` 規則にある。

とくに重要なのは次の点である。

1. `values` と `multiple-value-bind` は複数値の受け渡しを定義する
2. 多値は通常の list と同じものではない
3. `setf` は generalized variable を更新するための標準的な仕組みである
4. place の扱いは `setf` 展開規則と結びついている

したがって、第13章は「返り値を 2 個以上にする小技」を覚える章ではなく、評価結果の受け渡しと更新対象の抽象化を学ぶ章として理解するべきである。

---

### 10. 参考 URL

- Common Lisp HyperSpec Chapter 5 Data and Control Flow  
  https://www.lispworks.com/documentation/HyperSpec/Body/05_.htm
- Common Lisp HyperSpec Section 5.1 Generalized Reference  
  https://www.lispworks.com/documentation/HyperSpec/Body/05_a.htm
- Common Lisp HyperSpec Section 5.1.1 Overview of Places and Generalized Reference  
  https://www.lispworks.com/documentation/HyperSpec/Body/05_aa.htm
- Common Lisp HyperSpec Section 5.1.2 Kinds of Places  
  https://www.lispworks.com/documentation/HyperSpec/Body/05_ab.htm
- Common Lisp HyperSpec Section 5.1.2.3 VALUES Forms as Places  
  https://www.lispworks.com/documentation/HyperSpec/Body/05_abc.htm
- Common Lisp HyperSpec Macro MULTIPLE-VALUE-BIND  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_multip.htm#multiple-value-bind
  https://www.lispworks.com/documentation/HyperSpec/Body/f_values.htm
- Common Lisp HyperSpec Macro SETF  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_setf_.htm#setf
- Common Lisp HyperSpec Macro PSETF  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_setf_.htm#psetf
  https://www.lispworks.com/documentation/HyperSpec/Body/f_get_se.htm
- Common Lisp HyperSpec The Data and Control Flow Dictionary  
  https://www.lispworks.com/documentation/HyperSpec/Body/c_data_a.htm

---

## 第14章 symbol と package

### 1. この章の結論

Common Lisp を深く理解するには、symbol と package を分けて考える必要がある。**symbol は名前を持つ Lisp object であり、package は名前と symbol の対応を管理する仕組みである**。この切り分けが入ると、keyword、`intern`、`find-symbol`、`export`、`use-package` の役割が一気に整理しやすくなる。

この章の核は次の 4 点である。

1. symbol は文字列ではなく Lisp object である
2. symbol には name、value、function、plist、home package などの観点がある
3. package は symbol そのものではなく、名前解決と可視性を管理する
4. keyword は KEYWORD package に intern された symbol である

---

### 2. symbol の基本

symbol は名前を持つ object であり、単なる文字列ではない。

```lisp
'foo
```

この `foo` は文字列ではなく symbol である。symbol を理解するには、少なくとも次の観点を持っておくとよい。

1. 名前
2. 値セル
3. 関数セル
4. property list
5. home package

```lisp
(symbol-name 'foo)
```

```lisp
(symbol-package 'foo)
```

`symbol-package` が返すのは、その symbol の home package である。したがって、uninterned symbol では `nil` が返ることもある。

ここでいう値セルと関数セルは、`symbol-value` や `symbol-function` がアクセスする global な cell を指す。`let` が作る lexical variable や `flet` / `labels` が作る lexical function binding は、これらの accessor からは見えない。

このように、symbol は「名前が印字される object」であると同時に、さまざまな文脈と結びついている。

---

### 3. keyword

keyword は KEYWORD package に intern された symbol である。KEYWORD package に intern されると、その symbol は自分自身に束縛され、external symbol となり、constant variable として扱われる。そのため、コード上では self-evaluating に見える。

```lisp
:name
```

```lisp
(keywordp :name)
```

keyword は設定やオプションのラベルとして非常によく使われるが、文字列とは役割が違う。Common Lisp のコードでは、`"name"` と `:name` は見た目が似ていても意味はかなり異なる。

---

### 4. package の役割

package は、名前と symbol の対応、および symbol の可視性を管理する仕組みである。

ここで重要なのは、package が「値を保存する箱」だと誤解しないことだ。value cell や function cell を持つのは symbol であり、package はどの名前がどの symbol を指すかを管理する。

```lisp
(find-symbol "CAR" "COMMON-LISP")
```

```lisp
(intern "FOO" "CL-USER")
```

`find-symbol` は package 内の名前解決を問い合わせ、`intern` は名前に対応する symbol を見つけるか、必要なら作成する。

より正確には、`find-symbol` は「その名前の symbol がその package で accessible か」を調べ、見つかった場合は第2返り値として `:internal`、`:external`、`:inherited` のいずれかを返す。`intern` も同様の状態を返すが、見つからず新規に作成した場合の第2返り値は `nil` である。

---

### 5. `export` と `use-package`

package を理解するうえで重要なのが、外部シンボルと継承である。

```lisp
(export (intern "MY-NAME" "MY-APP") "MY-APP")
```

```lisp
(use-package "COMMON-LISP" "MY-APP")
```

`export` は package で accessible な symbol を、その package の external symbol にする。`use-package` は、ある package の external symbol を別の package で inherited symbol として accessible にする。

そのため、package を module に近いものとして見ることはできるが、完全に同じ概念ではない。symbol 単位の公開や衝突管理が前面に出るのが Common Lisp らしい点である。

---

### 6. symbol と package を分けて考える

初学者が一番混乱しやすいのは、symbol と package を同じものとして読んでしまうことだ。

学習上は次のように整理するとよい。

1. symbol は Lisp object
2. package は名前空間と可視性の管理機構
3. 同じ印字名でも package が違えば別の symbol になりうる
4. keyword は package と評価規則の両面で特殊である

この切り分けが入ると、なぜ Common Lisp で `intern` や `find-symbol` が重要なのか、また package prefix が必要になるのかが理解しやすくなる。

---

### 7. 最小コード例

第14章の最小例としては、次の 7 つで十分である。

```lisp
'foo
```

```lisp
(symbol-name 'foo)
```

```lisp
(symbol-package 'foo)
```

```lisp
:name
```

```lisp
(keywordp :name)
```

```lisp
(find-symbol "CAR" "COMMON-LISP")
```

```lisp
(intern "FOO" "CL-USER")
```

ここから見えることは次の通りである。

1. symbol は文字列ではない
2. symbol は package と結びつく
3. keyword は特別な symbol の使われ方である
4. package は名前解決の仕組みとして理解するべきである

---

### 8. よくある誤解や落とし穴

#### 8.1 symbol は文字列だと思ってしまう

symbol は文字列ではない。名前を持つ object であり、value や function の文脈にも関わる。

#### 8.2 package が値や関数を直接持つと思ってしまう

値セルや関数セルを持つのは symbol であり、package はそれらの名前解決と可視性を管理する。

#### 8.3 keyword をただの短い文字列だと思ってしまう

keyword は symbol であり、KEYWORD package に intern され、自分自身に束縛されるので self-evaluating に見える。

#### 8.4 `intern` は単なる文字列変換だと思ってしまう

`intern` は package の中で名前に対応する symbol を見つけるか作成する操作であり、package の状態と結びついている。

---

### 9. Common Lisp 標準ではどう定義されるか

この章の仕様上の土台は、Symbols と Packages の 2 章にまたがっている。

とくに重要なのは次の点である。

1. symbol の概念は `symbol-name`、`symbol-value`、`symbol-function`、`symbol-package` などで具体化される
2. `symbol-package` は symbol の home package を返し、uninterned symbol では `nil` を返しうる
3. `symbol-value` と `symbol-function` は symbol の global な value cell / function cell にアクセスし、lexical binding そのものは扱わない
4. `find-symbol` と `intern` は、symbol だけでなく accessible status も返す
5. `export` と `use-package` は external / inherited という可視性の変化を通じて package を管理する
6. package は symbol identity そのものではなく、名前解決と可視性の層である
7. keyword は KEYWORD package に intern された symbol として定義される

したがって、第14章は「パッケージ名の書き方」を覚える章ではなく、Common Lisp の名前空間がどう成立しているかを学ぶ章として読むべきである。

---

### 10. 参考 URL

- Common Lisp HyperSpec Chapter 10 Symbols  
  https://www.lispworks.com/documentation/HyperSpec/Body/10_.htm
- Common Lisp HyperSpec Section 10.1 Symbol Concepts  
  https://www.lispworks.com/documentation/HyperSpec/Body/10_a.htm
- Common Lisp HyperSpec The Symbols Dictionary  
  https://www.lispworks.com/documentation/HyperSpec/Body/c_symbol.htm
- Common Lisp HyperSpec Type KEYWORD  
  https://www.lispworks.com/documentation/HyperSpec/Body/t_kwd.htm
- Common Lisp HyperSpec Function KEYWORDP  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_kwdp.htm#keywordp
- Common Lisp HyperSpec Accessor SYMBOL-FUNCTION  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_symb_1.htm
- Common Lisp HyperSpec Function SYMBOL-NAME  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_symb_2.htm
- Common Lisp HyperSpec Function SYMBOL-PACKAGE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_symb_3.htm
- Common Lisp HyperSpec Accessor SYMBOL-VALUE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_symb_5.htm
- Common Lisp HyperSpec Chapter 11 Packages  
  https://www.lispworks.com/documentation/HyperSpec/Body/11_.htm
- Common Lisp HyperSpec Section 11.1 Package Concepts  
  https://www.lispworks.com/documentation/HyperSpec/Body/11_a.htm
- Common Lisp HyperSpec The Packages Dictionary  
  https://www.lispworks.com/documentation/HyperSpec/Body/c_packag.htm
- Common Lisp HyperSpec Function INTERN  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_intern.htm#intern
- Common Lisp HyperSpec Function FIND-SYMBOL  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_find_s.htm#find-symbol
- Common Lisp HyperSpec Function EXPORT  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_export.htm#export
- Common Lisp HyperSpec Function USE-PACKAGE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_use_pk.htm#use-package

---

## 第15章 macro

### 1. この章の結論

Common Lisp の macro は、関数の別名ではない。**macro は引数の評価前にフォームを受け取り、別のフォームへ展開することで言語を拡張する**。この視点が入ると、`defmacro`、`macroexpand`、backquote、gensym が 1 本の線でつながる。

この章の核は次の 4 点である。

1. macro は値を直接計算するのではなく、コードを生成する
2. macro の引数は関数のようには先に評価されない
3. `defmacro` は展開規則を定義する
4. Common Lisp の macro は自動的に hygienic ではないので、変数捕捉に注意が要る

---

### 2. macro と関数の違い

関数は、評価済みの引数を受け取って値を返す。

一方 macro は、まだ評価されていないフォームを受け取り、展開後のフォームを返す。その展開後のフォームが評価される。

```lisp
(defmacro my-when (test &body body)
  `(if ,test
       (progn ,@body)
       nil))
```

この `my-when` は body を先に評価しているのではない。`if` と `progn` を使った新しいフォームへ書き換えている。

したがって、macro は「関数より強い関数」ではなく、評価前のコード変換として理解する必要がある。

---

### 3. `defmacro` と macro expansion

`defmacro` は macro を定義する標準手段である。

```lisp
(defmacro my-when (test &body body)
  `(if ,test
       (progn ,@body)
       nil))
```

このとき重要なのは、macro 本体の返り値が「最終結果そのもの」ではなく、「あとで評価されるフォーム」だという点である。

その確認に使うのが `macroexpand-1` や `macroexpand` である。

```lisp
(macroexpand-1 '(my-when ready (print "ok")))
```

これにより、macro 呼び出しがどんなフォームへ展開されるかを観察できる。標準上は、`macroexpand-1` と `macroexpand` は展開後フォームに加えて、「実際に展開が起きたか」を示す第2返り値も返す。

---

### 4. backquote と comma

macro を書くときは、展開後のコードを組み立てるために backquote と comma をよく使う。

```lisp
(let ((x 10))
  `(1 2 ,x))
```

backquote は macro そのものではない。展開結果の list 構造を読みやすく組み立てるための記法である。

学習上は、次のように押さえるとよい。

1. backquote は「ほぼ quote」
2. comma はその一部だけ評価を再開する
3. comma-at は list の中身を展開位置へ差し込む

macro を理解するうえで backquote は非常に便利だが、macro の本質はあくまで「評価前のフォーム変換」にある。

---

### 5. gensym と変数捕捉

Common Lisp の macro は自動的に hygienic ではない。そのため、展開後のコードで一時変数名が衝突すると、意図しない変数捕捉が起きうる。

そこでよく使うのが `gensym` である。

```lisp
(gensym "TMP-")
```

`gensym` は fresh な symbol を作るため、展開結果の一時変数名をぶつかりにくくできる。

入門段階では、「Common Lisp の macro は hygienic macro system ではないので、必要なら `gensym` で衝突回避を行う」と理解しておけば十分である。

---

### 6. `macroexpand` を読む習慣

macro 学習で最も実務的に重要なのは、定義を書くだけでなく展開結果を読む習慣を持つことだ。

1. まず macro 呼び出しを書く
2. `macroexpand-1` で 1 段階展開を見る
3. 必要なら `macroexpand` で繰り返し展開を見る
4. 展開後のフォームが本当に意図通りかを確認する

ここでいう `macroexpand` は、フォーム全体が macro form でなくなるまで繰り返し展開する道具であり、任意の入れ子 subform を全面的にたどって展開する道具ではない。また、環境を与えた場合は `macrolet` や `symbol-macrolet` による局所定義も考慮される。

macro は便利だが、展開結果を読まずに書くと誤解が積み上がりやすい。そのため、第15章では「書く技術」より先に「展開を読む技術」を重視して学ぶ方が安全である。

---

### 7. 最小コード例

第15章の最小例としては、次の 5 つで十分である。

```lisp
(defmacro my-when (test &body body)
  `(if ,test
       (progn ,@body)
       nil))
```

```lisp
(macroexpand-1 '(my-when ready (print "ok")))
```

```lisp
(let ((x 10))
  `(1 2 ,x))
```

```lisp
(gensym "TMP-")
```

```lisp
(macrolet ((twice (form) `(progn ,form ,form)))
  (twice (print "hi")))
```

ここから見えることは次の通りである。

1. macro はフォームを別フォームへ展開する
2. backquote は展開結果を組み立てる補助記法である
3. `macroexpand-1` は展開確認の基本手段である
4. `gensym` は変数捕捉の回避に役立つ

---

### 8. よくある誤解や落とし穴

#### 8.1 macro は関数とほぼ同じだと思ってしまう

関数は評価済み引数を受け取り、macro は未評価フォームを受け取る。ここを混同すると macro の意味を見失う。

#### 8.2 macro が最終値を返すと思ってしまう

macro が返すのは通常、あとで評価されるフォームである。値そのものではない。

#### 8.3 backquote を使えば macro を理解した気になってしまう

backquote は便利な記法だが、本質は展開規則にある。展開後に何が評価されるかを読めなければ不十分である。

#### 8.4 Common Lisp の macro は自動的に hygienic だと思ってしまう

自動で変数捕捉が防がれるわけではない。必要なら `gensym` などで明示的に衝突を避ける。

---

### 9. Common Lisp 標準ではどう定義されるか

この章の仕様上の土台は、Macro Lambda Lists、`defmacro`、`macroexpand`、および reader / syntax の backquote 記法にまたがっている。

とくに重要なのは次の点である。

1. macro lambda list は通常の lambda list に似ているが、macro 用の規則を持つ
2. `defmacro` は global environment に macro function を結びつけ、その展開関数は form と environment を受けて form を返す
3. `macroexpand-1` は 1 段階、`macroexpand` はフォーム全体が macro form でなくなるまで展開する標準手段であり、第2返り値で展開有無も返す
4. `macroexpand` 系は環境付きなら `macrolet` / `symbol-macrolet` の局所定義を考慮し、同名の局所関数定義があれば macro 定義は shadow される
5. backquote は macro 展開結果を組み立てる便利な記法だが、macro 機構そのものではない

したがって、第15章は「短い DSL を量産する章」ではなく、Common Lisp の拡張性がどの層で動いているかを理解する章として読むべきである。

---

### 10. 参考 URL

- Common Lisp HyperSpec Chapter 3 Evaluation and Compilation  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_.htm
- Common Lisp HyperSpec Section 3.4.4 Macro Lambda Lists  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_dd.htm
- Common Lisp HyperSpec Section 3.4.4.1 Destructuring by Lambda Lists  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_dda.htm
- Common Lisp HyperSpec Macro DEFMACRO  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_defmac.htm#defmacro
  https://www.lispworks.com/documentation/HyperSpec/Body/f_macro_.htm#macro-function
- Common Lisp HyperSpec Function MACROEXPAND  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_mexp_.htm#macroexpand
- Common Lisp HyperSpec Function MACROEXPAND-1  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_mexp_.htm#macroexpand-1
- Common Lisp HyperSpec Special Operator FLET  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_flet_.htm#flet
- Common Lisp HyperSpec Special Operator LABELS  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_flet_.htm#labels
- Common Lisp HyperSpec Special Operator MACROLET  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_flet_.htm#macrolet
  https://www.lispworks.com/documentation/HyperSpec/Body/s_symbol.htm#symbol-macrolet
- Common Lisp HyperSpec Function GENSYM  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_gensym.htm#gensym
- Common Lisp HyperSpec Chapter 2 Syntax  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_.htm
- Common Lisp HyperSpec Chapter 23 Reader  
  https://www.lispworks.com/documentation/HyperSpec/Body/23_.htm

---

## 次の候補

第16章以降へ進むなら、次の順でつなぐのが自然である。

1. 第16章 condition system
2. 第17章 CLOS
3. 第18章 文字列、format、入出力

この順で進めると、第13章から第15章で導入した「多値」「名前空間」「言語拡張」を、そのまま実践的なエラー処理、オブジェクトシステム、I/O へ接続できる。