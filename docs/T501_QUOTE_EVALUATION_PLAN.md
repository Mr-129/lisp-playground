# T-501 評価モデルと quote 系の具体案

**作成日**: 2026年5月12日  
**位置づけ**: T-501 の実装用具体化メモ  
**目的**: 「評価モデルと quote 系の補強」を、実際に着手できるガイド追記案と問題追加案まで落とし込む

**関連文書**:
- [IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md)
- [LEARNING_COVERAGE_GAPS.md](./LEARNING_COVERAGE_GAPS.md)
- [PROBLEM_ROADMAP_JP.md](./PROBLEM_ROADMAP_JP.md)

---

## 1. この文書の結論

T-501 は、新しい大分類を増やすよりも、**既存の「基本構文」と「高階関数」の中に、評価と関数オブジェクトのつながりを補う 8 問を追加する** 方針で進めるのがよい。

理由は次の通り。

1. 現状でも `basic-quote-01`、`basic-lambda-01`、`function-apply-01`、`higher-04` があり、完全な空白領域ではない
2. 足りないのは「quote がある」ことではなく、**シンボル評価、コードとデータ、`'` と `#'`、`funcall` と `apply` の関係** である
3. まずは既存カテゴリのまま厚くした方が、カテゴリ追加やタグ追加なしで短く実装できる

したがって、T-501 の第一弾では **新規カテゴリや新規 ProblemTag は増やさない**。

---

## 2. 既存カバー範囲と残っている穴

### 既にあるもの

- `basic-quote-01`: quote でシンボルとリストをそのまま出力する
- `basic-lambda-01`: `lambda` と `funcall` の基本計算
- `function-apply-01`: `apply` で最後のリストを展開する
- `higher-04`: `funcall` と `apply` を組み合わせて複数関数へ適用する

### まだ弱いもの

- シンボルが通常は「変数参照」として評価されること
- `x` と `'x` の違い
- `(+ 1 2)` と `'(+ 1 2)` の違い
- `'( + 1 2 )` と `(list '+ 1 2)` がどちらも「式データ」になること
- `'+' はシンボルであり、`#'+` は関数オブジェクトであること
- 関数オブジェクトを変数に入れて `funcall` できること
- `apply` に固定引数と最後のリストを一緒に渡せること
- 条件によって関数を返し、その戻り値を `funcall` できること

---

## 3. 実装方針

### 3-1. カテゴリ方針

- quote / 評価の基礎は **基本構文** に置く
- `function` / `#'` / `funcall` / `apply` の応用は **高階関数** に置く
- 今回は `シンボルとクォート` カテゴリを新設しない

### 3-2. judge 方針

- 全問とも既存どおり `judge.kind: 'program'` を使う
- visible 1 件 + hidden 1 件の最小構成で始める
- hidden は基本的に「同型の別値」か「同じ概念の別関数」で確認する

### 3-3. テスト方針

- [src/data/__tests__/problems.test.ts](../src/data/__tests__/problems.test.ts) に問題数・整合性の追記
- [src/components/__tests__/LispGuide.test.tsx](../src/components/__tests__/LispGuide.test.tsx) に新しい見出しと検索語のテストを追加
- [src/pages/__tests__/LearnPage.test.tsx](../src/pages/__tests__/LearnPage.test.tsx) に新規問題が学習導線に出ることを確認するテストを追加

---

## 4. ガイド追記案

### 4-1. 追記対象

- [src/components/LispGuide.tsx](../src/components/LispGuide.tsx) の `guide-evaluation`
- [src/components/LispGuide.tsx](../src/components/LispGuide.tsx) の `guide-lambda`
- 必要に応じて `GUIDE_SECTIONS` の keywords を追加

### 4-2. `guide-evaluation` に追加する内容

既存の「評価（Evaluation）とクォート」は短くまとまっているが、T-501 では次の 4 小項目を足す。

#### A. シンボルは通常は変数として評価される

追加したい説明:

- `x` は「シンボルそのもの」ではなく、通常は変数参照として扱われる
- そのため、未定義シンボルをそのまま書くとエラーになる
- `'x` と書くと、変数参照ではなくシンボル `X` 自体を表せる

追加したいコード例:

```lisp
(defvar x 10)

x      ; => 10
'x     ; => X
```

#### B. コードとデータは同じ形で書ける

追加したい説明:

- `(+ 1 2)` は評価される式
- `'(+ 1 2)` は「足し算の式そのもの」というデータ
- Lisp ではプログラムを list として扱える

追加したいコード例:

```lisp
(+ 1 2)      ; => 3
'(+ 1 2)     ; => (+ 1 2)

(first '(+ 1 2))   ; => +
(rest '(+ 1 2))    ; => (1 2)
```

#### C. quote した式と `list` で作った式の関係

追加したい説明:

- quote は「そのまま書く」方法
- `list` は「組み立てる」方法
- どちらも結果として式データを作れる

追加したいコード例:

```lisp
'(+ 1 2)           ; => (+ 1 2)
(list '+ 1 2)      ; => (+ 1 2)
```

#### D. よくある誤解

追加したい注意書き:

- `'+' は **シンボル**
- `#'+` は **関数オブジェクト**
- この違いを曖昧にしたまま `funcall` や `apply` を読むとつまずきやすい

短い note 例:

```lisp
'+    ; => +
#'+   ; => #<FUNCTION +>
```

### 4-3. `guide-lambda` に追加する内容

既存の `guide-lambda` は無名関数の基本だけなので、T-501 では **関数オブジェクトの扱い** を追記する。

#### A. `function` と `#'`

追加したい説明:

- `#'` は `(function ...)` の省略形
- `#'+` や `#'max` のように、関数を値として渡すときに使う
- `lambda` フォームも `function` で包める

追加したいコード例:

```lisp
#'+
(function +)
(function (lambda (x) (* x x)))
```

#### B. `funcall` と `apply` の違い

追加したい説明:

- `funcall` は引数をそのまま並べて渡す
- `apply` は最後のリストを展開して渡す
- 見た目が似ていても、使う場面が違う

追加したいコード例:

```lisp
(funcall #'+ 1 2 3)     ; => 6
(apply #'+ '(1 2 3))    ; => 6
(apply #'+ 10 '(1 2 3)) ; => 16
```

#### C. 関数オブジェクトを変数に入れる

追加したい説明:

- 関数は値として変数に束縛できる
- 条件によって関数を返す設計もできる

追加したいコード例:

```lisp
(defvar *op* #'+)
(funcall *op* 3 4 5)   ; => 12

(defun choose-op (use-add)
  (if use-add #'+ #'*))

(funcall (choose-op t) 2 3 4)   ; => 9
(funcall (choose-op nil) 2 3 4) ; => 24
```

### 4-4. GUIDE_SECTIONS の更新案

キーワードは次の追加で十分である。

- `guide-evaluation`: `symbol evaluation`, `code as data`, `list literal`
- `guide-lambda`: `function`, `function object`, `funcall`, `apply`, `#'`

---

## 5. 追加問題案

このバッチは **8 問** を推奨する。問題 ID は仮であり、実装時に最終調整してよい。

### 1. `basic-quote-02` 変数とシンボルを見分ける

- **カテゴリ**: 基本構文
- **難易度**: beginner
- **学習目標**: `quote`, `symbol evaluation`
- **狙い**: `x` と `'x` の違いを最短で理解させる
- **問題文の要点**:
  - 変数 `x` に 10 を束縛する
  - `x` と `'x` を順に出力する
- **想定出力**:

```text
10
X
```

- **hidden の考え方**: 別の変数名と値でも同じ理解で書けるか確認する

### 2. `basic-quote-03` 式をデータとして出力する

- **カテゴリ**: 基本構文
- **難易度**: beginner
- **学習目標**: `quote`, `code as data`
- **狙い**: `(+ 1 2)` と `'(+ 1 2)` の違いを体感させる
- **問題文の要点**:
  - `(+ 1 2)` の計算結果を出力する
  - `'(+ 1 2)` をそのまま出力する
- **想定出力**:

```text
3
(+ 1 2)
```

- **hidden の考え方**: 別の演算子と値でも、評価と非評価を正しく使い分けられるかを見る

### 3. `basic-quote-04` `quote` と `list` で同じ式を作る

- **カテゴリ**: 基本構文
- **難易度**: intermediate
- **学習目標**: `quote`, `list`, `symbol`
- **狙い**: 「そのまま書く」と「組み立てる」の両方で式データを作れることを理解させる
- **問題文の要点**:
  - `'(+ 1 2)` を出力する
  - `(list '+ 1 2)` を出力する
- **想定出力**:

```text
(+ 1 2)
(+ 1 2)
```

- **hidden の考え方**: `*` や `max` など別のシンボルでも正しく組み立てられるか確認する

### 4. `basic-quote-05` `'+' と `#'+` を見分ける

- **カテゴリ**: 基本構文
- **難易度**: intermediate
- **学習目標**: `quote`, `function`, `functionp`, `symbolp`
- **狙い**: T-501 の最大の誤解ポイントを先に潰す
- **問題文の要点**:
  - `(symbolp '+)` の結果を出力する
  - `(functionp #'+)` の結果を出力する
- **想定出力**:

```text
T
T
```

- **hidden の考え方**: `max` や `abs` でも同じ違いが分かるか確認する

### 5. `function-apply-02` 関数を変数に入れて `funcall` する

- **カテゴリ**: 高階関数
- **難易度**: intermediate
- **学習目標**: `function object`, `funcall`
- **狙い**: 関数を値として持てることを明示的に練習する
- **問題文の要点**:
  - `*op*` に `#'+` を束縛する
  - `funcall` で `3 4 5` を計算する
  - 別の変数に `#'max` を束縛して最大値も出力する
- **想定出力**:

```text
12
9
```

- **hidden の考え方**: 別の関数オブジェクトでも変数経由で呼び出せるか確認する

### 6. `function-apply-03` `function` と `#'` の両方を使う

- **カテゴリ**: 高階関数
- **難易度**: intermediate
- **学習目標**: `function`, `#'`, `funcall`, `apply`
- **狙い**: `#'` をただの記号として覚えるのではなく、省略形だと理解させる
- **問題文の要点**:
  - `(function 1+)` を `funcall` で呼び出す
  - `(function max)` を `apply` で呼び出す
- **想定出力**:

```text
10
7
```

- **hidden の考え方**: `1-` や `min` などでも書けるか確認する

### 7. `function-apply-04` `apply` の固定引数を使う

- **カテゴリ**: 高階関数
- **難易度**: advanced
- **学習目標**: `apply`, `argument expansion`
- **狙い**: 既存の `function-apply-01` より一段深い `apply` の使い方を追加する
- **問題文の要点**:
  - `(apply #'+ 10 '(1 2 3))` 型の書き方で合計を出す
  - `(apply #'max 0 '(7 3 9 2))` 型の書き方で最大値を出す
- **想定出力**:

```text
16
9
```

- **hidden の考え方**: 固定引数 2 個以上や別関数でも最後のリストだけ展開されることを確認する

### 8. `function-dispatch-01` 条件によって関数を返す

- **カテゴリ**: 高階関数
- **難易度**: advanced
- **学習目標**: `function object`, `if`, `funcall`
- **狙い**: 関数オブジェクトを「渡す」だけでなく「返す」まで進める
- **問題文の要点**:
  - `use-add` が真なら `#'+`、偽なら `#'*` を返す `choose-op` を定義する
  - `(funcall (choose-op t) 2 3 4)` と `(funcall (choose-op nil) 2 3 4)` を出力する
- **想定出力**:

```text
9
24
```

- **hidden の考え方**: `#'max` / `#'min` など別分岐でも関数を返せることを確認する

---

## 6. 推奨実装順

実装順は次の通りがよい。

1. `guide-evaluation` の拡張
2. `basic-quote-02` から `basic-quote-05` の追加
3. `guide-lambda` の関数オブジェクト追記
4. `function-apply-02` から `function-dispatch-01` の追加
5. Guide / LearnPage / problems のテスト更新

この順にすると、ガイドと問題が常に対応した状態で進められる。

---

## 7. 実装時の注意

- 第一弾では debug 問題に寄せない。読解 / 修正型は T-505 で扱う
- `eval` 的な話題には踏み込まない。現行学習モードの範囲に留める
- 関数オブジェクトの説明では、`'+'` と `#'+` の違いを必ず並べる
- ガイド文は長文化しすぎず、**短い説明 + すぐ試せるコード + よくある誤解** の順で構成する