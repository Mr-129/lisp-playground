# Common Lisp 教科書ドラフト 第10章から第12章

**作成日**: 2026年5月1日  
**対象範囲**: 第10章 制御構造 / 第11章 cons・list・tree の処理 / 第12章 反復と再帰  
**位置づけ**: 教科書本文の先行ドラフト

**関連文書**:
- [COMMON_LISP_TEXTBOOK_OUTLINE.md](./COMMON_LISP_TEXTBOOK_OUTLINE.md)
- [COMMON_LISP_TEXTBOOK_CH07_09.md](./COMMON_LISP_TEXTBOOK_CH07_09.md)
- [COMMON_LISP_FOUNDATIONS.md](./COMMON_LISP_FOUNDATIONS.md)

---

## この文書の読み方

この文書は、教科書の第10章から第12章に相当する本文ドラフトである。

各章では、次の 6 要素を揃える。

1. その章の結論
2. 基本概念の説明
3. 最小コード例
4. よくある誤解や落とし穴
5. Common Lisp 標準ではどう定義されるか
6. 参考 URL

---

## 第10章 制御構造

### 1. この章の結論

Common Lisp の制御構造は、見た目は関数呼び出しに似ていても、**評価規則が違うからこそ制御構造として機能する**。この点を押さえると、`if`、`cond`、`when`、`unless`、`progn`、`block`、`return-from`、`catch`、`throw`、`unwind-protect` が一つの地図に収まる。

この章の核は次の 4 点である。

1. 条件分岐では、必要な branch だけを評価する
2. 複数フォームの順次評価には `progn` が基礎になる
3. Common Lisp には局所脱出と非局所脱出の仕組みがある
4. 真偽値は `nil` だけが偽であり、それ以外は真として扱う

---

### 2. 条件分岐の基本

最初に理解すべき制御構造は `if` である。

```lisp
(if test
    then-form
    else-form)
```

`if` が重要なのは、通常の関数呼び出しのように then と else の両方を先に評価しない点にある。条件が真なら then 側、偽なら else 側だけが評価される。

ここで Common Lisp の真偽値規則も同時に理解するとよい。Common Lisp では `nil` だけが偽であり、それ以外の object は真として扱われる。

```lisp
(if nil :yes :no)
```

```lisp
(if 0 :yes :no)
```

後者が真側へ進むことは、他言語経験者がよくつまずく点である。

---

### 3. `cond`、`when`、`unless`

`if` を理解した後に読むべきなのが `cond`、`when`、`unless` である。

#### 3.1 `cond`

複数条件を順に判定したいときに使う。

```lisp
(cond ((< x 0) :negative)
      ((= x 0) :zero)
      (t :positive))
```

#### 3.2 `when`

条件が真のときだけ複数フォームを実行したいときに使う。

```lisp
(when ready
  (print "start")
  (run-task))
```

#### 3.3 `unless`

条件が偽のときだけ実行したいときに使う。

```lisp
(unless cached
  (load-data))
```

学習上は、`cond` は多分岐、`when` と `unless` は `if` を読みやすくした構文だと理解すれば十分である。

---

### 4. `progn` と順次評価

Common Lisp では、複数フォームを順に評価して最後の値を返すというパターンが非常によく出てくる。その基礎が `progn` である。

```lisp
(progn
  (print 1)
  (print 2)
  42)
```

この式は、`1` を表示し、`2` を表示し、最後に `42` を返す。

`when` や `unless` の本体、関数本体、`let` の body などでも、暗黙の `progn` が関わることが多い。したがって `progn` は単独の特殊形式というだけでなく、Common Lisp の評価の流れを読むための基本単位でもある。

---

### 5. `block` と `return-from`

局所的な脱出を理解するには、`block` と `return-from` が基礎になる。

```lisp
(block search
  (when found
    (return-from search value))
  nil)
```

ここでは `search` という名前の脱出点を作り、必要になったらその地点から値を返して抜ける。

これは単なる「途中 return」ではなく、評価の流れに名前付きの出口を作る仕組みとして理解するとよい。

---

### 6. `catch`、`throw`、`unwind-protect`

Common Lisp には、より広い制御移動のための仕組みもある。

#### 6.1 `catch` と `throw`

```lisp
(catch 'done
  (throw 'done 42))
```

`catch` は tag に対応する受け口を作り、`throw` はその tag に向けて値を返しながら脱出する。

#### 6.2 `unwind-protect`

```lisp
(unwind-protect
    (use-resource)
  (cleanup-resource))
```

`unwind-protect` は、途中でどのように脱出しても cleanup 側を必ず実行したいときに使う。

学習上は、`block` / `return-from` は名前付き局所脱出、`catch` / `throw` は tag による非局所脱出、`unwind-protect` は後始末の保証、とまず分けて理解するとよい。

---

### 7. 最小コード例

第10章の最小例としては、次の 8 つで十分である。

```lisp
(if test a b)
```

```lisp
(cond ((p x) :a)
      (t :b))
```

```lisp
(when ready
  (start))
```

```lisp
(unless cached
  (load-data))
```

```lisp
(progn
  (step1)
  (step2)
  :done)
```

```lisp
(block out
  (return-from out 42))
```

```lisp
(catch 'done
  (throw 'done 42))
```

```lisp
(unwind-protect
    (work)
  (cleanup))
```

ここから見えることは次の通りである。

1. 制御構造は関数呼び出しと同じ規則では動かない
2. 条件分岐では必要な branch だけが評価される
3. 順次評価、途中脱出、後始末は別々の構造として整理できる
4. 真偽値は `nil` だけが偽である

---

### 8. よくある誤解や落とし穴

#### 8.1 `if` は関数だと思ってしまう

`if` は関数ではない。もし関数なら then 側と else 側の両方が先に評価されるはずだが、Common Lisp ではそうならない。

#### 8.2 `0` や空文字列は偽だと思ってしまう

Common Lisp では `nil` だけが偽である。`0` も空文字列も真として扱われる。

#### 8.3 `block` / `return-from` と `catch` / `throw` を同じものだと思ってしまう

どちらも脱出だが、前者は名前付き exit point、後者は tag を使った制御移動であり、用途と読み方が違う。

---

### 9. Common Lisp 標準ではどう定義されるか

この章の仕様上の土台は、Evaluation と Data and Control Flow にまたがっている。

とくに重要なのは次の点である。

1. `if`、`progn`、`block`、`return-from`、`catch`、`throw`、`unwind-protect` などは制御移動や評価順に関わる
2. `cond`、`when`、`unless` は `if` の理解を前提に読むと整理しやすい
3. 真偽値の扱いは `nil` を中心に理解する必要がある

したがって、第10章は「便利構文の一覧」を覚える章ではなく、評価の流れをどう制御するかを学ぶ章として読むべきである。

---

### 10. 参考 URL

- Common Lisp HyperSpec Chapter 5 Data and Control Flow  
  https://www.lispworks.com/documentation/HyperSpec/Body/05_.htm
- Common Lisp HyperSpec Section 5.2 Transfer of Control to an Exit Point  
  https://www.lispworks.com/documentation/HyperSpec/Body/05_b.htm
- Common Lisp HyperSpec Section 3.1.2.1.2.1 Special Forms  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_ababa.htm
- Common Lisp HyperSpec The Data and Control Flow Dictionary  
  https://www.lispworks.com/documentation/HyperSpec/Body/c_data_a.htm
- Common Lisp HyperSpec Special Operator IF  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_if.htm#if
  https://www.lispworks.com/documentation/HyperSpec/Body/m_cond.htm#cond
- Common Lisp HyperSpec Macro WHEN  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_when_.htm#when
- Common Lisp HyperSpec Macro UNLESS  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_when_.htm#unless
  https://www.lispworks.com/documentation/HyperSpec/Body/s_progn.htm#progn
- Common Lisp HyperSpec Special Operator BLOCK  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_block.htm#block
- Common Lisp HyperSpec Special Operator RETURN-FROM  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_ret_fr.htm#return-from
- Common Lisp HyperSpec Special Operator CATCH  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_catch.htm#catch
- Common Lisp HyperSpec Special Operator THROW  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_throw.htm#throw
- Common Lisp HyperSpec Special Operator UNWIND-PROTECT  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_unwind.htm#unwind-protect

---

## 第11章 cons・list・tree の処理

### 1. この章の結論

Lisp らしいデータ処理の中心は cons にある。**list は cons の特殊な並びであり、tree は cons と atom を再帰的に組み合わせた見方で理解できる**。この視点が入ると、`car`、`cdr`、`cons`、proper list、dotted pair、alist、plist が一つの体系として見えてくる。

この章の核は次の 4 点である。

1. cons は 2 つの部分を持つ基本構造である
2. proper list は cons の連鎖であり、`nil` で終わる
3. dotted pair は cons を list 以外として見る入口になる
4. association list と property list は Lisp らしい軽量な連想データ表現である

---

### 2. `cons`、`car`、`cdr`

cons cell は 2 つの部分を持つ。

1. `car`
2. `cdr`

`cons` は、その 2 つを持つ新しい cons を作る。

```lisp
(cons 1 2)
```

`car` は左側、`cdr` は右側を取り出すと理解するとよい。

```lisp
(car '(a b c))
```

```lisp
(cdr '(a b c))
```

この 3 つをセットで理解すると、list を単なる配列のようにではなく、cons 構造の連鎖として読めるようになる。

---

### 3. proper list と dotted pair

proper list は、`cdr` を辿っていくと最後に `nil` に到達する cons の連鎖である。

```lisp
(list 1 2 3)
```

これは概念的には次と同じである。

```lisp
(cons 1 (cons 2 (cons 3 nil)))
```

一方、dotted pair は proper list ではない cons 表記である。

```lisp
'(a . b)
```

ここでは評価する式としてではなく、cons の読み方を示すデータ表現として見ている。

この表記を理解すると、「括弧で囲まれたものは全部 list」という誤解から抜けられる。

---

### 4. tree と再帰的な見方

Lisp では、tree を専用の構造体としてではなく、cons と atom の再帰的組み合わせとして読むことが多い。

```lisp
'((a b) (c (d e)) f)
```

このデータは list でもあるが、同時に tree としても読める。学習上の要点は、list と tree が排他的な概念ではなく、同じ cons 構造をどの観点で見るかの違いだということである。

この視点が入ると、再帰処理がなぜ Lisp と相性がよいかも理解しやすくなる。

---

### 5. association list と property list

連想データを軽く持ちたいとき、Common Lisp では alist と plist がよく使われる。

#### 5.1 association list

alist は key と value の組を cons で持つ list である。

```lisp
'((name . "Alice")
  (age . 20))
```

#### 5.2 property list

plist は indicator と value を交互に並べた list である。

```lisp
'(:name "Alice" :age 20)
```

alist と plist はどちらも標準ライブラリの辞書構造とは違うが、小さなデータや設定を扱うときに便利である。

---

### 6. 最小コード例

第11章の最小例としては、次の 7 つで十分である。

```lisp
(cons 1 2)
```

```lisp
(car '(a b c))
```

```lisp
(cdr '(a b c))
```

```lisp
(list 1 2 3)
```

```lisp
'(a . b)
```

```lisp
'((a b) (c (d e)) f)
```

```lisp
'(:name "Alice" :age 20)
```

ここから見えることは次の通りである。

1. list は cons から理解できる
2. `car` と `cdr` は cons の 2 面を読む入口になる
3. dotted pair は proper list とは別の cons 表記である
4. tree、alist、plist は cons 構造の応用として理解できる

---

### 7. よくある誤解や落とし穴

#### 7.1 `cdr` は常に list を返すと思ってしまう

proper list ではそう見えやすいが、一般の cons では `cdr` が atom であることもある。dotted pair を読めばこの点が見える。

#### 7.2 list と tree は別々の構造だと思ってしまう

Lisp では、同じ cons 構造を linear に見れば list、階層的に見れば tree と考えることが多い。

#### 7.3 alist と plist を同じデータ表現だと思ってしまう

どちらも連想データだが、alist は pair の list、plist は交互並びの list であり、読み方も処理の仕方も違う。

---

### 8. Common Lisp 標準ではどう定義されるか

この章の仕様上の土台は、Cons Concepts と Conses as Lists にある。

とくに重要なのは次の点である。

1. cons は list の材料であると同時に、list 以外の構造も表せる
2. proper list の理解には `nil` を終端として読むことが必要である
3. alist や plist は cons/list の上に成り立つ慣用表現として理解できる

したがって、第11章は「`car` / `cdr` の使い方」を覚える章ではなく、Lisp 的なデータ構造を cons から読む章として理解するべきである。

---

### 9. 参考 URL

- Common Lisp HyperSpec Chapter 14 Conses  
  https://www.lispworks.com/documentation/HyperSpec/Body/14_.htm
- Common Lisp HyperSpec Section 14.1 Cons Concepts  
  https://www.lispworks.com/documentation/HyperSpec/Body/14_a.htm
- Common Lisp HyperSpec Section 14.1.2 Conses as Lists  
  https://www.lispworks.com/documentation/HyperSpec/Body/14_ab.htm
- Common Lisp HyperSpec The Conses Dictionary  
  https://www.lispworks.com/documentation/HyperSpec/Body/c_conses.htm
  https://www.lispworks.com/documentation/HyperSpec/Body/f_cons.htm#cons
- Common Lisp HyperSpec Accessor CAR  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_car_c.htm#car
- Common Lisp HyperSpec Accessor CDR  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_car_c.htm#cdr
  https://www.lispworks.com/documentation/HyperSpec/Body/f_append.htm#append

---

## 第12章 反復と再帰

### 1. この章の結論

Common Lisp では、データ処理を 1 つの書き方だけに固定しない。**tree をたどるなら再帰が自然なことが多く、list を順に処理するなら `dolist` や `mapcar` が自然なこともあり、集約なら `reduce` が読みやすいこともある**。重要なのは、問題に合った反復手段を選べるようになることである。

この章の核は次の 4 点である。

1. 再帰は cons/list/tree と相性がよい
2. `dolist`、`dotimes`、`loop` は代表的な反復構文である
3. `mapcar`、`mapcan`、`reduce` はデータ変換や集約の表現力を増やす
4. Common Lisp では再帰と反復を対立物ではなく、使い分ける道具として理解する方がよい

---

### 2. 再帰の基本

再帰は、問題を「より小さな同じ種類の問題」に分けて解く書き方である。Lisp では list や tree が再帰的な構造なので、再帰との相性がよい。

```lisp
(defun my-length (xs)
  (if (null xs)
      0
      (+ 1 (my-length (cdr xs)))))
```

この関数は、空リストなら 0、そうでなければ先頭を 1 と数えて残りへ進む。

再帰を理解するうえで重要なのは、必ず終端条件を持つこと、そして 1 回ごとに問題が小さくなることだ。

---

### 3. `dolist` と `dotimes`

反復構文の最初の基本は `dolist` と `dotimes` である。

#### 3.1 `dolist`

list の各要素を順に処理する。

```lisp
(dolist (x '(1 2 3))
  (print x))
```

#### 3.2 `dotimes`

整数カウントで繰り返す。

```lisp
(dotimes (i 3)
  (print i))
```

学習上は、`dolist` は list 向け、`dotimes` は回数反復向けと覚えると整理しやすい。

---

### 4. `loop`

`loop` は Common Lisp の代表的な反復 facility であり、非常に強力である。

```lisp
(loop for x in '(1 2 3)
      collect (* x x))
```

`loop` は便利だが、最初からすべての clause を覚える必要はない。入門段階では次のような使い方だけで十分である。

1. `for ... in ...`
2. `for ... from ... below ...`
3. `collect`
4. `sum`
5. `do`

`loop` は読みやすいと感じる人もいれば、通常の S 式らしさが薄れると感じる人もいる。そのため、再帰や `dolist` と併せて比較しながら覚えるのがよい。

---

### 5. `mapcar`、`mapcan`、`reduce`

データ変換や集約では、反復を明示的に書かずに表現できる関数群が有効である。

#### 5.1 `mapcar`

各要素に関数を適用し、その結果の list を返す。

```lisp
(mapcar #'1+ '(1 2 3))
```

#### 5.2 `mapcan`

各要素に関数を適用し、その結果の list 群を `nconc` 相当でつなぎ合わせる。

```lisp
(mapcan (lambda (x)
          (if (oddp x)
              (list x)
              nil))
        '(1 2 3 4 5))
```

そのため、`mapcan` は「`mapcar` の結果を単純に平坦化するもの」とだけ覚えるより、返された list を破壊的につなぐ系統の操作だと押さえる方が正確である。

#### 5.3 `reduce`

列の要素を畳み込んで 1 つの値へまとめる。

```lisp
(reduce #'+ '(1 2 3 4))
```

学習上は、`mapcar` は変換、`mapcan` は展開しながら連結、`reduce` は集約、とまず分けて理解するとよい。

---

### 6. 再帰と反復の使い分け

どの書き方を選ぶかは、問題の形で決めるのが実務的である。

1. tree をたどるなら再帰が自然なことが多い
2. list を順に走査して副作用を伴うなら `dolist` が読みやすいことが多い
3. 変換結果の list を作るなら `mapcar` が明快なことが多い
4. 集約なら `reduce` や `loop ... sum` が読みやすいことが多い

ここで重要なのは、「どれが最も Lisp らしいか」を争うことではなく、データ構造と目的に合う書き方を選ぶことだ。

---

### 7. 最小コード例

第12章の最小例としては、次の 6 つで十分である。

```lisp
(defun my-length (xs)
  (if (null xs)
      0
      (+ 1 (my-length (cdr xs)))))
```

```lisp
(dolist (x '(1 2 3))
  (print x))
```

```lisp
(dotimes (i 3)
  (print i))
```

```lisp
(loop for x in '(1 2 3)
      collect (* x x))
```

```lisp
(mapcar #'1+ '(1 2 3))
```

```lisp
(reduce #'+ '(1 2 3 4))
```

ここから見えることは次の通りである。

1. 再帰は list 構造と自然に結びつく
2. 反復構文には用途ごとの読みやすさがある
3. `mapcar` や `reduce` は処理の意図を短く表現できる
4. 1 つの問題に複数の表現方法がありうる

---

### 8. よくある誤解や落とし穴

#### 8.1 再帰の方が常に Lisp らしいと思ってしまう

再帰は強力だが、すべてを再帰で書く必要はない。単純な反復や集約なら `dolist`、`loop`、`reduce` の方が明快なことも多い。

#### 8.2 `mapcan` は `mapcar` とほぼ同じだと思ってしまう

`mapcan` は結果を `nconc` 的につなぐので、返す値の形を意識しないと予想外の構造になる。変換と連結が同時に起きる点に加え、破壊的連結の性質も意識する必要がある。

#### 8.3 深い再帰でも常に安全だと思ってしまう

Common Lisp は末尾再帰最適化を言語仕様として保証しない。実装依存の最適化に頼りきるより、必要なら反復構文も使い分ける方が安全である。

---

### 9. Common Lisp 標準ではどう定義されるか

この章の仕様上の土台は、Iteration と Sequences、および Data and Control Flow の辞書項目にまたがっている。

とくに重要なのは次の点である。

1. `loop` には独立した iteration facility がある
2. `dolist`、`dotimes`、`mapcar`、`mapcan`、`reduce` はそれぞれ別の意図を持つ標準手段である
3. 再帰は syntax ではなく、list/tree 構造と評価規則の組み合わせの中で理解される

したがって、第12章は「繰り返しの書き方一覧」を覚える章ではなく、問題の形に応じて処理スタイルを選ぶ章として読むのがよい。

---

### 10. 参考 URL

- Common Lisp HyperSpec Chapter 6 Iteration  
  https://www.lispworks.com/documentation/HyperSpec/Body/06_.htm
- Common Lisp HyperSpec Section 6.1 The LOOP Facility  
  https://www.lispworks.com/documentation/HyperSpec/Body/06_a.htm
  https://www.lispworks.com/documentation/HyperSpec/Body/c_iterat.htm
- Common Lisp HyperSpec Function MAPC  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_mapc_.htm#mapc
- Common Lisp HyperSpec Function MAPCAR  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_mapc_.htm#mapcar
- Common Lisp HyperSpec Function MAPCAN  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_mapc_.htm#mapcan
- Common Lisp HyperSpec Function MAPL  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_mapc_.htm#mapl
- Common Lisp HyperSpec Function MAPLIST  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_mapc_.htm#maplist
- Common Lisp HyperSpec Function MAPCON  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_mapc_.htm#mapcon
- Common Lisp HyperSpec Function REDUCE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_reduce.htm
- Common Lisp HyperSpec Chapter 17 Sequences  
  https://www.lispworks.com/documentation/HyperSpec/Body/17_.htm
- Common Lisp HyperSpec Chapter 14 Conses  
  https://www.lispworks.com/documentation/HyperSpec/Body/14_.htm

---

## 次の候補

第13章以降へ進むなら、次の順でつなぐのが自然である。

1. 第13章 多値と generalized variable
2. 第14章 symbol と package
3. 第15章 macro

この順で進めると、第10章から第12章で導入した「制御」「データ処理」「反復」を、そのまま Common Lisp 特有の実用機能へ接続できる。