# Common Lisp 教科書ドラフト 第4章から第6章

**作成日**: 2026年5月1日  
**対象範囲**: 第4章 S式と reader の基礎 / 第5章 quote、backquote、reader macro / 第6章 評価モデル  
**位置づけ**: 教科書本文の先行ドラフト

**関連文書**:
- [COMMON_LISP_TEXTBOOK_OUTLINE.md](./COMMON_LISP_TEXTBOOK_OUTLINE.md)
- [COMMON_LISP_TEXTBOOK_CH01_03.md](./COMMON_LISP_TEXTBOOK_CH01_03.md)
- [COMMON_LISP_FOUNDATIONS.md](./COMMON_LISP_FOUNDATIONS.md)

---

## この文書の読み方

この文書は、教科書の第4章から第6章に相当する本文ドラフトである。

各章では、次の 6 要素を揃える。

1. その章の結論
2. 基本概念の説明
3. 最小コード例
4. よくある誤解や落とし穴
5. Common Lisp 標準ではどう定義されるか
6. 参考 URL

---

## 第4章 S式と reader の基礎

### 1. この章の結論

Common Lisp を読み始めるときに最初に身につけるべきなのは、**見た目の文字列をそのまま意味だと思わず、まず reader がどのような object を作るのかを考えること**である。

この章の核は次の 4 点である。

1. Common Lisp のコードやデータは、基本的に S 式として書かれる
2. S 式は入門上、atom と list に分けて見ると理解しやすい
3. reader は文字列を Lisp object に変換する
4. token の解釈、大文字小文字、escape の規則を知らないと、見た目と内部表現のずれで混乱しやすい

---

### 2. S式とは何か

Lisp の記法は、コードとデータの両方を S 式で表現する点に大きな特徴がある。入門段階では、S 式を次の 2 種類に分けて見るとよい。

- atom
  - 数値、文字列、文字、シンボルなど、これ以上リストとして分解しないもの
- list
  - 丸括弧で囲まれた並び

たとえば、次の式は list である。

```lisp
(+ 1 2)
```

見た目としては 3 要素の並びだが、Common Lisp ではこれがそのまま form になり、評価されると関数適用として解釈されることが多い。

ここで重要なのは、S 式は単なる見た目の分類ではなく、reader が入力を object として組み立てるときの基本単位だということである。

---

### 3. reader は何をしているのか

reader は、文字列を読んで Lisp object を返す。したがって、reader の仕事は「実行」ではなく「構成」である。

たとえば、次の 2 つは見た目は似ているが、reader が作る object は違う。

```lisp
foo
```

```lisp
(foo)
```

前者は通常 symbol として読まれ、後者は list として読まれる。どちらが変数参照か、関数呼び出しか、特殊形式かは、reader の次の段階で決まる。

この分離を理解すると、「reader は object を作る」「evaluator は form を評価する」という役割分担がはっきりする。

---

### 4. token の解釈

reader は空白や区切り文字を手がかりに token を切り出し、それが数値なのか、symbol なのか、別の表記なのかを解釈する。

たとえば、次は異なる token の例である。

```lisp
123
```

```lisp
foo
```

```lisp
"foo"
```

数値、symbol、文字列では、reader が返す object の種類が違う。見た目が短くても、reader がどの型の object として読んだかで、評価や表示のされ方が変わる。

---

### 5. 大文字小文字と escape

Common Lisp で初学者がよく戸惑うのは、REPL で symbol が大文字に見えることである。これは reader が token を標準的には大文字化して扱うためである。

たとえば、次の token は標準的な readtable case のもとでは同じ symbol として読まれることがある。

```lisp
foo
```

```lisp
Foo
```

```lisp
FOO
```

一方で、escape を使うと表記を保持できる。

```lisp
|Foo|
```

```lisp
f\oo
```

この規則を知らないと、「入力した名前」と「表示された名前」が一致しないように見えて混乱しやすい。

---

### 6. 最小コード例

第4章の最小例としては、次の 4 つで十分である。

```lisp
42
```

```lisp
foo
```

```lisp
(foo 1 2)
```

```lisp
|Foo|
```

ここから見えることは次の通りである。

1. 入力は reader により object として読まれる
2. 数値、symbol、list は見た目から区別できる
3. symbol の大文字小文字はそのまま保存されるとは限らない
4. escape は reader に対する指示として働く

---

### 7. よくある誤解や落とし穴

#### 7.1 丸括弧の中身は全部すぐ実行されると思ってしまう

丸括弧はまず list を作る記法であり、その list が後でどのような form として扱われるかは評価段階の話である。見た目の括弧だけで「すぐ実行」と決めつけると理解が崩れる。

#### 7.2 symbol は入力した綴りのまま保存されると思ってしまう

Common Lisp では、標準的には readtable case の影響で symbol 名が大文字化される。これは処理系の気まぐれではなく reader の規則に属する。

#### 7.3 文字列と symbol を同じように見てしまう

`foo` と `"foo"` は全く別の object である。片方は symbol、もう片方は string であり、評価規則も表示規則も違う。

---

### 8. Common Lisp 標準ではどう定義されるか

この章で扱った内容の仕様上の土台は、主に Syntax と Reader の章にある。

とくに重要なのは次の点である。

1. macro character や token の扱いは reader 規則に属する
2. 左括弧、右括弧、文字列、コメントなどの表記は標準 macro character として定義される
3. readtable case により symbol の大文字小文字の扱いが決まる

したがって、第4章は見た目の記号を暗記する章ではなく、reader がどのように入力を object に変えるかを理解する章として読むべきである。

---

### 9. 参考 URL

- Common Lisp HyperSpec Chapter 2 Syntax  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_.htm
- Common Lisp HyperSpec Section 2.2 Reader Algorithm  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_b.htm
- Common Lisp HyperSpec Section 2.3 Interpretation of Tokens  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_c.htm
- Common Lisp HyperSpec Section 2.4 Standard Macro Characters  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_d.htm
- Common Lisp HyperSpec Chapter 23 Reader  
  https://www.lispworks.com/documentation/HyperSpec/Body/23_.htm
- Common Lisp HyperSpec Section 23.1.2 Effect of Readtable Case on the Lisp Reader  
  https://www.lispworks.com/documentation/HyperSpec/Body/23_ab.htm
  https://www.lispworks.com/documentation/HyperSpec/Body/14_.htm
- Common Lisp HyperSpec Function LIST  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_list_.htm#list
- Common Lisp HyperSpec Function LIST*  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_list_.htm#listST

---

## 第5章 quote、backquote、reader macro

### 1. この章の結論

Common Lisp の学習で早い段階につまずきやすいのは、`'`, `` ` ``, `,`, `#'`, `#(...)`, `#\A`, `#xFF` のような記号表現である。これらは evaluator の気まぐれな例外ではなく、**reader が特別な規則で object を構成するための入口**である。

この章の核は次の 4 点である。

1. `quote` と single quote は「評価しない object を扱う」ための基本手段である
2. backquote と comma は、テンプレートの一部だけ評価したいときに使う
3. `#` は dispatching macro character であり、後続文字で読み方が変わる
4. 記号表現の多くは、評価規則ではなく読み取り規則として理解した方が整理しやすい

---

### 2. quote と single quote

最初に押さえるべきなのは、`quote` と single quote の関係である。

```lisp
(quote x)
```

```lisp
'x
```

HyperSpec では、`'object` は `(quote object)` と等価である。この 2 つは、どちらも「symbol x を変数参照としてではなく、その object 自体として扱う」ために使う。

同様に、次の式では list をデータとして扱う。

```lisp
'(1 2 3)
```

ここで大事なのは、single quote が単なる飾り記号ではないこと、そして quote の理解なしに evaluator の説明へ進まないことだ。

---

### 3. backquote と comma

backquote は、ほぼ quote に似ているが、一部だけ評価したいときに使う。comma は、その backquote の内部で評価を再開する印である。

```lisp
(let ((x 10))
  `(1 2 ,x))
```

この例は、概念的には `(1 2 10)` に近い list を作る。

入門段階では、backquote を「list を組み立てるためのテンプレート記法」と理解すれば十分である。ただし、正確な展開規則は単純な文字列展開ではなく、入れ子や splice を含むと少し複雑になる。

---

### 4. sharpsign と dispatching macro character

`#` は dispatching macro character であり、後ろに続く文字によって reader の動作が変わる。

初学者が最初に押さえればよいのは次の例である。

```lisp
#'car
```

```lisp
#(1 2 3)
```

```lisp
#\A
```

```lisp
#xFF
```

これらはそれぞれ、function abbreviation、simple vector、character object、16進数の表記として読まれる。

この章で重要なのは、`#` 自体にひとつの意味があるのではなく、「`#` + 次の文字」で読み方が決まることだ。

---

### 5. reader macro という考え方

reader macro とは、特定の文字が reader に特別な読み方をさせる仕組みである。single quote、double quote、semicolon、backquote、comma、sharpsign などは、標準 readtable のもとで特別な役割を持つ macro character である。

ここで注意したいのは、reader macro と Common Lisp の macro を混同しないことである。

- reader macro
  - 文字列を object に読む段階の仕組み
- macro
  - form を展開する段階の仕組み

この 2 つはどちらも「拡張」や「省略記法」に見えるが、働く層が違う。

---

### 6. 最小コード例

第5章の最小例としては、次の 6 つで十分である。

```lisp
'x
```

```lisp
'(1 2 3)
```

```lisp
(let ((x 10))
  `(1 2 ,x))
```

```lisp
#'car
```

```lisp
#(1 2 3)
```

```lisp
#xFF
```

ここから見えることは次の通りである。

1. quote は symbol や list をそのまま扱う入口になる
2. backquote は「一部だけ評価するテンプレート」を作る
3. `#` から始まる表記は reader の dispatch 規則に従う
4. これらの記号表現は、見た目が特殊でも reader 規則として整理できる

---

### 7. よくある誤解や落とし穴

#### 7.1 `'x` は evaluator が特別扱いしているだけだと思ってしまう

`'x` はまず reader により quote を含む form として読まれる。したがって、最初に理解すべきなのは読み取り規則である。

#### 7.2 backquote は単純な文字列テンプレートだと思ってしまう

backquote は見た目ほど単純ではない。特に入れ子や splice を含む場合、展開規則は reader と language semantics の両方を意識する必要がある。入門段階では使いどころを限定して理解した方が安全である。

#### 7.3 reader macro と macro を混同してしまう

これは非常に多い混乱である。reader macro は「文字をどう読むか」、macro は「form をどう展開するか」の問題であり、層が違う。

#### 7.4 quote や backquote が毎回まったく新しい list を作ると思ってしまう

quoted object を破壊的に変更するのは未定義動作である。また backquote も、見た目どおりの固定展開や常に完全な新規構造を保証するわけではない。リテラルやテンプレート由来の構造を破壊的に更新する前提では書かない方が安全である。

---

### 8. Common Lisp 標準ではどう定義されるか

この章の仕様上の基礎は、主に Standard Macro Characters と Sharpsign の節にある。

とくに重要なのは次の点である。

1. single quote、backquote、comma、double quote、semicolon などは標準 macro character として定義される
2. sharpsign は dispatching macro character として定義される
3. abbreviated expression は reader が object を構成するための標準表記である

したがって、第5章は「特殊記号の丸暗記」ではなく、「reader がどの略記をどう object に変えるか」を理解する章として読むのがよい。

---

### 9. 参考 URL

- Common Lisp HyperSpec Section 2.4 Standard Macro Characters  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_d.htm
- Common Lisp HyperSpec Section 2.4.3 Single-Quote  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_dc.htm
- Common Lisp HyperSpec Section 2.4.6 Backquote  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_df.htm
- Common Lisp HyperSpec Section 2.4.7 Comma  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_dg.htm
- Common Lisp HyperSpec Section 2.4.8 Sharpsign  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_dh.htm
- Common Lisp HyperSpec Section 2.4.9 Re-Reading Abbreviated Expressions  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_di.htm
- Common Lisp HyperSpec Chapter 23 Reader  
  https://www.lispworks.com/documentation/HyperSpec/Body/23_.htm
- Common Lisp HyperSpec Special Operator QUOTE  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_quote.htm#quote
- Common Lisp HyperSpec Special Operator FUNCTION  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_fn.htm#function

---

## 第6章 評価モデル

### 1. この章の結論

Common Lisp の評価モデルを理解すると、`x` と `'x` の違い、`(+ 1 2)` と `(if test a b)` の違い、macro と function の違いがひとつの規則でつながって見えるようになる。

この章の核は次の 4 点である。

1. form は symbols、conses、self-evaluating objects の 3 種類に分けられる
2. symbol は通常、変数名として評価される
3. cons form は compound form として扱われ、その分類により評価規則が変わる
4. special form、macro form、function form、lambda form の区別が Common Lisp 実行規則の土台になる

---

### 2. form の 3 区分

HyperSpec の evaluation model では、form は次の 3 つに分けて整理される。

1. symbols
2. conses
3. self-evaluating objects
  https://www.lispworks.com/documentation/HyperSpec/Body/s_if.htm#if
- Common Lisp HyperSpec Macro WHEN  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_when_.htm#when
- Common Lisp HyperSpec Macro UNLESS  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_when_.htm#unless
  https://www.lispworks.com/documentation/HyperSpec/Body/s_fn.htm#function

この整理が重要なのは、見た目ではなく object の種類によって評価規則が決まるからである。

たとえば次は self-evaluating object の例である。

```lisp
42
```

```lisp
"hello"
```

これらは通常、そのまま値になる。

---

### 3. symbol の評価

form が symbol の場合、その symbol は通常、変数の名前として扱われる。

```lisp
x
```

この式は、symbol object `x` そのものではなく、通常は変数 `x` の値を取りに行く。そのため、x が束縛されていなければ unbound-variable になる。

この点が分かると、次の違いがはっきりする。

```lisp
x
```

```lisp
'x
```

前者は変数参照、後者は symbol object そのものを返すための form である。

---

### 4. cons form の評価

form が cons の場合、それは compound form として扱われる。そしてその処理は、どの kind の form に分類されるかで決まる。

- special form
- macro form
- function form
- lambda form

この 4 つを区別できるようになると、Common Lisp の多くのコードが読めるようになる。

#### 4.1 special form

special form は、引数を一律に評価しない。独自の評価規則を持つ。

```lisp
(if test then-form else-form)
```

`if` では、条件分岐に応じて必要な branch だけが評価される。これは通常の関数呼び出しとは違う。

#### 4.2 macro form

macro form は、最初に macro expansion が行われ、その結果として得られた form がさらに評価される。

```lisp
(when test
  (print "ok"))
```

`when` は典型的な macro form であり、そのまま machine primitive として実行されるのではなく、別の form へ展開されてから評価される。

#### 4.3 function form

function form では、cdr 側の subform が左から右へ評価され、その値が関数へ渡される。なお、operator の function definition を引数評価より前に確定するかどうかまでは、仕様上は固定されない。

```lisp
(+ 1 2)
```

これは典型的な function form である。

#### 4.4 lambda form

lambda form は、その場に書かれた lambda expression を呼び出す形である。

```lisp
((lambda (x) (* x x)) 5)
```

この形を見ると、関数が名前だけではなく object として扱われることも理解しやすい。

---

### 5. 最小コード例

第6章の最小例としては、次の 6 つで十分である。

```lisp
42
```

```lisp
x
```

```lisp
'x
```

```lisp
(+ 1 2)
```

```lisp
(if test a b)
```

```lisp
((lambda (x) (* x x)) 5)
```

ここから見えることは次の通りである。

1. self-evaluating object は通常そのまま値になる
2. symbol は通常、変数参照になる
3. quote を使うと symbol や list を object として扱える
4. cons form は分類によって評価規則が変わる

---

### 6. よくある誤解や落とし穴

#### 6.1 symbol は常にその symbol 自身を意味すると思ってしまう

Common Lisp では、form として現れた symbol は通常、変数名として扱われる。symbol object 自体を扱いたいなら quote が必要になる。

#### 6.2 list は全部同じ規則で評価されると思ってしまう

`(+ 1 2)` と `(if test a b)` はどちらも list に見えるが、function form と special form では評価規則が違う。ここを曖昧にすると、制御構造と関数呼び出しの違いが見えなくなる。

#### 6.3 macro は関数の一種だと思ってしまう

macro は関数呼び出しそのものではない。macro form はまず展開され、その展開後の form が評価される。関数呼び出しと同じ規則ではない。

---

### 7. Common Lisp 標準ではどう定義されるか

この章の仕様上の基礎は、Evaluation と The Evaluation Model の節にある。

とくに重要なのは次の点である。

1. form evaluation は symbols、conses、self-evaluating objects に分けて整理される
2. conses as forms は special forms、macro forms、function forms、lambda forms に分類される
3. symbol as form は variable または symbol macro として扱われる

したがって、第6章は「何が実行されるか」を感覚で覚える章ではなく、form の種類ごとの規則を学ぶ章である。

---

### 8. 参考 URL

- Common Lisp HyperSpec Chapter 3 Evaluation and Compilation  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_.htm
- Common Lisp HyperSpec Section 3.1 Evaluation  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_a.htm
- Common Lisp HyperSpec Section 3.1.2 The Evaluation Model  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_ab.htm
- Common Lisp HyperSpec Section 3.1.2.1 Form Evaluation  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_aba.htm
- Common Lisp HyperSpec Section 3.1.2.1.1 Symbols as Forms  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_abaa.htm
- Common Lisp HyperSpec Section 3.1.2.1.2 Conses as Forms  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_abab.htm
- Common Lisp HyperSpec Section 3.1.2.1.2.1 Special Forms  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_ababa.htm
- Common Lisp HyperSpec Section 3.1.2.1.2.2 Macro Forms  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_ababb.htm
- Common Lisp HyperSpec Section 3.1.2.1.2.3 Function Forms  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_ababc.htm
- Common Lisp HyperSpec Section 3.1.2.1.2.4 Lambda Forms  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_ababd.htm

---

## 次の候補

第7章以降へ進むなら、次の順でつなぐのが自然である。

1. 第7章 データ型の全体像
2. 第8章 変数と束縛
3. 第9章 関数と lambda list

この順で進めると、第4章から第6章で導入した「reader」「略記」「評価規則」を、そのまま型、束縛、関数定義の本論へ接続できる。