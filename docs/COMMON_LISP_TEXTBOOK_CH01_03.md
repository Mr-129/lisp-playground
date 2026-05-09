# Common Lisp 教科書ドラフト 第1章から第3章

**作成日**: 2026年5月1日  
**対象範囲**: 第1章 Common Lisp とは何か / 第2章 Lisp 的なものの見方 / 第3章 REPL・Reader・Evaluator・Printer  
**位置づけ**: 教科書本文の先行ドラフト

**関連文書**:
- [COMMON_LISP_TEXTBOOK_OUTLINE.md](./COMMON_LISP_TEXTBOOK_OUTLINE.md)
- [COMMON_LISP_FOUNDATIONS.md](./COMMON_LISP_FOUNDATIONS.md)

---

## この文書の読み方

この文書は、教科書の第1章から第3章に相当する本文ドラフトである。

各章では、次の 6 要素を揃える。

1. その章の結論
2. 基本概念の説明
3. 最小コード例
4. よくある誤解や落とし穴
5. Common Lisp 標準ではどう定義されるか
6. 参考 URL

---

## 第1章 Common Lisp とは何か

### 1. この章の結論

Common Lisp は、Lisp 系言語の一種ではあるが、単に「Lisp のどれか」ではない。Common Lisp は、複数の Lisp 方言を整理統合する形で標準化された、**大きく、実用寄りで、拡張性の高いプログラミング言語**である。

学習の出発点として重要なのは、Common Lisp を次の 3 点で捉えることである。

1. 歴史ある Lisp 系言語の中でも、標準仕様が比較的大きく定義されている
2. 対話的開発、マクロ、動的な開発体験に強みがある
3. Scheme、Clojure、Emacs Lisp と似て見えても、目的と設計思想がかなり違う

---

### 2. Common Lisp の位置づけ

Lisp という言葉は、ひとつの製品名ではなく、言語の系統名に近い。したがって「Lisp を学ぶ」と言うだけでは、何を学ぶのかがまだ曖昧である。

Common Lisp は、その曖昧さを減らすために重要である。Common Lisp は、1980年代に存在していた複数の主要 Lisp 方言の実務上の共通部分を整理し、**共通の土台を持つ標準言語**としてまとめられた。

このとき重要なのは、Common Lisp が最小主義の言語ではないことである。むしろ逆で、Common Lisp は次のような特徴を持つ。

- 関数、変数、マクロ、オブジェクトシステム、条件システム、パッケージなどを標準仕様の中で広く扱う
- 小さな核だけを定義するのではなく、実用上よく使う仕組みを言語側で多く備える
- 処理系ごとの差はあるが、共通仕様の上で移植性を議論しやすい

そのため Common Lisp は、入門時には少し大きく見えるが、学び進めると「小さな部品を何層にも組み合わせる」言語というより、「かなり強力な道具箱を最初から持っている」言語として見えてくる。

---

### 3. 他の Lisp 系言語との違い

初学者が最も混同しやすいのは、Common Lisp、Scheme、Clojure、Emacs Lisp の違いである。見た目は似ていても、同じ言語ではない。

#### 3.1 Scheme との違い

Scheme は、言語仕様をできるだけ小さく保ち、少数の原理を明快にする方向が強い。Common Lisp はそれよりも、**実務上よく使う機能をまとめて大きく標準化する方向**が強い。

入門段階では、次の理解で十分である。

- Scheme は小さく整った核を重視しやすい
- Common Lisp は大きく実用的な標準ライブラリと開発体験を重視しやすい

#### 3.2 Clojure との違い

Clojure は現代的な Lisp として人気が高いが、Common Lisp とは別言語である。特に、JVM 上で動くこと、不変データ構造や並行処理の設計、ホスト環境との関係などが大きく異なる。

見た目が S 式で似ていても、Common Lisp の仕様書を読んで Clojure を理解することはできないし、逆も同じである。

#### 3.3 Emacs Lisp との違い

Emacs Lisp は Emacs 拡張のための言語として非常に重要だが、Common Lisp とは設計背景も標準化の経路も違う。Emacs Lisp を経験した人が Common Lisp に入ると、似た記法のせいで「同じ感覚で読める」と思いがちだが、変数束縛、名前空間、標準機能の整理、実装文化など多くの点で差がある。

---

### 4. 主な Common Lisp 処理系

Common Lisp は仕様書だけでは動かない。実際に使うには処理系が必要である。学習時点では、次のような実装名を知っておくとよい。

- SBCL
- Clozure CL
- CLISP
- Allegro CL
- LispWorks

ここで大事なのは、**処理系は違っても、学習の基準はまず標準仕様に置く**という点である。処理系ごとに最適化、拡張、開発環境、速度、ライセンスの差はあるが、基礎学習では「標準で何が保証されるか」を先に押さえる方が混乱しにくい。

---

### 5. 最小コード例

最初の例として、次の 3 つだけで十分である。

```lisp
(+ 1 2)
```

```lisp
(defun square (x)
  (* x x))
```

```lisp
(square 5)
```

この 3 つから分かることは次の通りである。

1. コードは基本的に括弧付きの S 式で書かれる
2. 関数定義も関数呼び出しも、見た目の規則がかなり統一されている
3. データ表現とコード表現の距離が近い

---

### 6. よくある誤解や落とし穴

#### 6.1 Lisp は全部同じだと思ってしまう

これは最初の大きな誤解である。Common Lisp、Scheme、Clojure、Emacs Lisp は相互に影響し合っているが、別言語として扱うべきである。

#### 6.2 Common Lisp は古いので実用性が低いと思ってしまう

Common Lisp は確かに歴史が長いが、それは「使えない」という意味ではない。むしろ、言語の柔軟性、対話的開発、マクロ、実装系の成熟など、現代でも独特の強みを持つ。

#### 6.3 処理系ごとの差を先に気にしすぎる

入門段階では、実装差よりも標準仕様の中心概念を先に固める方がよい。最初から処理系固有拡張に寄ると、何が Common Lisp そのものなのか見えにくくなる。

---

### 7. Common Lisp 標準ではどう定義されるか

Common Lisp の基礎学習では、仕様上の基準点を明確にしておく必要がある。Common Lisp HyperSpec は、ANSI Common Lisp の内容を参照しやすい形でまとめた主要な参照資料である。

この章の範囲で重要なのは、次の 2 点である。

1. Common Lisp は、標準仕様を持つ言語として読むべきである
2. ただし HyperSpec は入門書ではなく、辞書や仕様参照として使う方が適している

したがって学習の順番は、まず教科書的な整理で全体像を掴み、その後で HyperSpec を辞書として引く形が自然である。補助的な参考資料を併用する場合でも、仕様確認の基準は HyperSpec に置くのがよい。

---

### 8. 参考 URL

- Common Lisp HyperSpec Contents  
  https://www.lispworks.com/documentation/HyperSpec/Front/Contents.htm
- Common Lisp HyperSpec Highlights  
  https://www.lispworks.com/documentation/HyperSpec/Front/Hilights.htm
- Common Lisp HyperSpec Macro DEFUN  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_defun.htm#defun
- CL Community Spec（補助参照。ANSI 仕様ドラフトの HTML 化）  
  https://cl-community-spec.github.io/pages/index.html
- SBCL 公式サイト  
  https://www.sbcl.org/
- Clozure CL 公式サイト  
  https://ccl.clozure.com/
- CLISP 公式サイト  
  https://clisp.sourceforge.io/
- Allegro CL 公式サイト  
  https://franz.com/products/allegrocl/
- LispWorks 公式サイト  
  https://www.lispworks.com/

---

## 第2章 Lisp 的なものの見方

### 1. この章の結論

Common Lisp を理解するには、文法項目を丸暗記するより前に、**Lisp は何を自然なものとして扱う言語なのか**を掴む必要がある。

Lisp 的な見方の中心には、次の 4 点がある。

1. コードとデータの表現が近い
2. 対話的に少しずつ定義し、試し、修正する
3. 言語そのものを拡張対象として見る
4. 記号やリストを、単なる入れ物ではなく意味を持つ構造として扱う

この 4 点が見えると、Lisp の括弧の多さは負担ではなく、構造がむき出しになっている利点として理解しやすくなる。

---

### 2. コードとデータの距離が近い

Common Lisp の最も有名な特徴のひとつは、コードが S 式として書かれることである。S 式は、リストやシンボルのような基本データ構造に近い形で表現される。

たとえば、次の式を見る。

```lisp
(+ 1 2)
```

これは「関数呼び出し」であると同時に、reader が読む対象としては「リストに似た構造」でもある。この近さが、後で学ぶマクロやコード変換の理解につながる。

重要なのは、「コードとデータが完全に同一である」と雑に言わないことである。正確には、**コードがデータ構造に近い表現を持つため、コードをプログラムから扱いやすい**という理解がよい。

---

### 3. 対話的開発が前提にある

Common Lisp では、ファイルを書いて全部まとめて実行するだけでなく、REPL 上で関数を試し、定義を更新し、すぐ結果を見る流れが自然である。

この文化は、単なる便利機能ではなく、言語の学び方や設計の仕方そのものに影響する。具体的には次のような流れが多い。

1. 小さな式を REPL で試す
2. 関数を定義する
3. その関数をすぐ呼び出して挙動を見る
4. 必要なら定義し直す

この反復の速さが、Common Lisp の生産性の一部になっている。

---

### 4. 言語を拡張するという発想

多くの言語では、言語本体の文法は固定されており、利用者はその上で関数やクラスを書く。Common Lisp ではもちろん関数やクラスも書くが、それに加えて**マクロで新しい記法や制御構造を作る**という発想が中心にある。

このとき重要なのは、マクロが「文字列置換」ではないことである。Common Lisp では、reader が form を読んだ後、その form が macro form ならまず展開され、その展開結果が評価される。この意味で、マクロはコード変換機構として理解するのが正確である。

したがって Lisp 的なものの見方には、「言語は固定の箱ではなく、自分の問題領域に合わせて形を変えられるものだ」という発想が含まれる。

---

### 5. 記号処理に強いとはどういうことか

Lisp は昔から記号処理に強い言語として語られてきた。しかし、この言い方だけでは抽象的すぎる。ここでいう記号処理とは、単に文字列を扱うことではなく、**名前、関係、木構造、式そのものをプログラムの対象として扱いやすい**ことを意味する。

たとえば次のような問題に向きやすい。

- 規則の列を式として扱う
- データ変換の手順を木構造で持つ
- 小さな言語や DSL を作る
- 条件分岐や推論規則を宣言的に整理する

この背景には、リスト、シンボル、マクロ、REPL 文化が一体として働くことがある。

---

### 6. 最小コード例

Lisp 的な見方を掴むには、複雑な例より次のような最小例が有効である。

```lisp
(list '+ 1 2)
```

```lisp
'(+ 1 2)
```

```lisp
(eval '(+ 1 2))
```

この 3 つの例から見えることは次の通りである。

1. コードに見えるものをデータとして組み立てられる
2. quote を使うと評価せずに式そのものを扱える
3. 式をデータとして持ち、あとで評価する発想が見える

ただし、`eval` は強力だが誤用もしやすい。HyperSpec では、`eval` は current dynamic environment と null lexical environment で form を評価するとされる。つまり、周囲の lexical binding をそのまま見に行く手段だと思わない方がよい。学習初期では「コードとデータが近い」ことを見るための例として使い、設計上の常用手段と混同しない方がよい。

---

### 7. よくある誤解や落とし穴

#### 7.1 括弧が多いだけの言語だと思ってしまう

Lisp の表面だけを見ると、すべてが括弧で囲まれているように見える。しかし、本質は括弧ではなく、**構造が素直に表に出ていること**である。

#### 7.2 マクロを単なる便利構文だと思ってしまう

マクロは短縮記法ではなく、言語の抽象化手段である。これを理解するには、コードがデータ構造に近いことと、評価の前に展開があることを一緒に見る必要がある。

#### 7.3 REPL をお試し機能としか見ない

REPL は単なる電卓ではない。対話的開発そのものが Common Lisp の重要な開発様式である。

---

### 8. Common Lisp 標準ではどう定義されるか

この章の内容のうち、仕様上の核になるのは次の点である。

1. コードを構成するフォームやオブジェクトは、reader と evaluator の流れの中で扱われる
2. シンボル、cons、リスト、関数、マクロといった概念は仕様の中心にある
3. どの表記が reader によりどう読まれるかは Syntax と Reader の章に対応している

つまり「Lisp 的なものの見方」は単なる精神論ではなく、仕様上の構造と強く結びついている。

---

### 9. 参考 URL

- Common Lisp HyperSpec Chapter 2 Syntax  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_.htm
- Common Lisp HyperSpec Chapter 3 Evaluation and Compilation  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_.htm
- Common Lisp HyperSpec Chapter 14 Conses  
  https://www.lispworks.com/documentation/HyperSpec/Body/14_.htm
  https://www.lispworks.com/documentation/HyperSpec/Body/23_.htm
- Common Lisp HyperSpec Function LIST  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_list_.htm#list
- Common Lisp HyperSpec Function LIST*  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_list_.htm#listST
  https://www.lispworks.com/documentation/HyperSpec/Body/s_quote.htm#quote
- Common Lisp HyperSpec Function EVAL  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_eval.htm#eval
- CL Community Spec（補助参照。ANSI 仕様ドラフトの HTML 化）  
  https://cl-community-spec.github.io/pages/index.html

---

## 第3章 REPL・Reader・Evaluator・Printer

### 1. この章の結論

Common Lisp を学ぶ上で最も重要な分解は、**文字列を読む段階**と**式を評価する段階**を分けることである。

REPL は、概念的には次の 4 段階から成る。

1. Read
2. Eval
3. Print
4. Loop

初学者がつまずく原因の多くは、この 4 つを一つの操作だと思ってしまうことにある。実際には、reader が何をオブジェクトとして読むかと、evaluator がそれをどう実行するかは別問題である。

---

### 2. REPL とは何か

REPL は Read-Eval-Print Loop の略である。入力された文字列をそのまま実行する装置ではなく、処理を段階に分けて行う対話環境である。

概念的な流れは次の通りである。

1. 利用者が文字列を入力する
2. reader がそれを Lisp object として読む
3. evaluator がその object をフォームとして評価する
4. printer が結果を表示する
5. もう一度入力待ちへ戻る

この流れを理解すると、エラーが「読み取り段階の問題」なのか「評価段階の問題」なのかを切り分けやすくなる。

---

### 3. reader の役割

reader の役割は、文字列から Lisp object を構成することである。reader は、入力文字列を見て「これは list か」「これは symbol か」「これは数値か」「これは single quote や sharpsign のような reader syntax か」を判定する。

たとえば次の入力を考える。

```lisp
'(1 2 3)
```

ここで最初に起きるのは評価ではない。reader が single quote の reader syntax としてこれを読み、`(quote (1 2 3))` に対応する Lisp object を作る。その後に evaluator がその object をどう扱うかが決まる。

reader を理解すると、次のような表記が「評価規則」ではなく「読み取り規則」に属することが見えてくる。

- `'`
- `` ` ``
- `,`
- `#'`
- `#(...)`
- `#\A`
- `#xFF`

つまり、見た目が特殊だからといって、全部 evaluator の仕事ではない。

---

### 4. evaluator の役割

evaluator は、reader が返した Lisp object をフォームとして評価する。ここで重要なのは、評価の規則が object の種類によって変わることである。

基本的には次の 3 分類で考えると分かりやすい。

1. symbol
2. cons form
3. self-evaluating object

たとえば、数値や文字列は通常 self-evaluating object として、そのまま値になる。

```lisp
42
```

```lisp
"hello"
```

一方で symbol は通常、変数名として解釈される。

```lisp
x
```

そして cons は compound form として扱われ、special form、macro form、function form、lambda form のどれに当たるかで評価規則が変わる。

```lisp
(+ 1 2)
```

この式は function form の典型例である。

---

### 5. printer の役割

printer は、評価結果の Lisp object を表示可能な形へ変換する。学習初期では reader と evaluator に比べて目立たないが、printer も重要である。

なぜなら、利用者が REPL で見るのは「内部の値そのもの」ではなく、**printer を通した表現**だからである。

たとえば、シンボルの大文字表示や文字列の出力表現、リストの表示は printer の規則と関わる。ここを理解していないと、「なぜ入力と出力の見た目が少し違うのか」で混乱しやすい。

---

### 6. 4 段階を分けて考える意味

REPL を 1 つの黒箱としてではなく、Read / Eval / Print / Loop に分けて考えると、次の利点がある。

1. 構文エラーと評価エラーを切り分けられる
2. quote や sharpsign が reader 側の規則だと理解できる
3. マクロが evaluator の前に展開される話へ自然につながる
4. 実装系や学習用処理系の差分を整理しやすくなる

この分解は、後で macro、reader macro、condition system を学ぶときにも土台になる。

---

### 7. 最小コード例

#### 7.1 reader と evaluator を分けて考えるための例

```lisp
'x
```

これは reader により `(quote x)` に対応するフォームとして読まれ、evaluator により「シンボル x そのもの」を返す。

```lisp
x
```

これは通常、変数 x の値を参照しようとする。x が束縛されていなければエラーになる。

```lisp
(quote x)
```

これは `'x` と同じ意味を持つ代表例である。ここで重要なのは、`'x` は単なる省略記法であり、見た目の違いに引きずられずに読むことである。

---

### 8. よくある誤解や落とし穴

#### 8.1 reader が評価していると思ってしまう

`'(1 2 3)` を見たとき、最初から evaluator が「評価しない」と決めているように感じるかもしれない。しかし概念的には、まず reader が single quote syntax を `(quote ...)` に対応するフォームとして読む。

#### 8.2 quote をただの記号だと思ってしまう

single quote は飾りではない。reader の読み取り規則に属する省略記法として理解する必要がある。

#### 8.3 REPL の表示を内部表現と完全に同一視してしまう

REPL の出力は printer を通った表現である。したがって、見えている文字列と内部の object をそのまま同一視すると誤解しやすい。

---

### 9. Common Lisp 標準ではどう定義されるか

この章の仕様上の基礎は、主に Syntax、Evaluation、Reader、Printer の章にある。

とくに重要なのは次の点である。

1. 評価モデルでは、フォームを symbol、cons、self-evaluating object に分けて考える
2. reader は token、macro character、dispatching macro character などの規則で object を読む
3. printer は object を外部表現へ戻す役割を担う

この分解を先に理解しておくと、後の `quote`、`backquote`、`macroexpand`、package、reader customization の理解が大きく楽になる。

---

### 10. 参考 URL

- Common Lisp HyperSpec Chapter 3 Evaluation and Compilation  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_.htm
- Common Lisp HyperSpec Section 3.1 Evaluation  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_a.htm
- Common Lisp HyperSpec Section 3.1.2 The Evaluation Model  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_ab.htm
- Common Lisp HyperSpec Section 3.1.2.1 Form Evaluation  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_aba.htm
- Common Lisp HyperSpec Chapter 22 Printer  
  https://www.lispworks.com/documentation/HyperSpec/Body/22_.htm
- Common Lisp HyperSpec Chapter 23 Reader  
  https://www.lispworks.com/documentation/HyperSpec/Body/23_.htm
- Common Lisp HyperSpec Section 2.4 Standard Macro Characters  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_d.htm
- Common Lisp HyperSpec Section 2.4.8 Sharpsign  
  https://www.lispworks.com/documentation/HyperSpec/Body/02_dh.htm
- Common Lisp HyperSpec Function EVAL  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_eval.htm#eval
- Common Lisp HyperSpec Special Operator QUOTE  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_quote.htm#quote
  https://www.lispworks.com/documentation/HyperSpec/Body/s_fn.htm#function
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

---

## 次の候補

第4章から第6章へ進むと、次の流れでつなぎやすい。

1. 第4章 S式と reader の基礎
2. 第5章 quote、backquote、reader macro
3. 第6章 評価モデル

この順で進めると、第1章から第3章で導入した「Common Lisp とは何か」「Lisp 的な見方」「REPL の分解」を、そのまま構文と評価の本論へ接続できる。