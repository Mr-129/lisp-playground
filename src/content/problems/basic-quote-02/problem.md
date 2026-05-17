---
id: basic-quote-02
slug: basic-quote-02
title: 変数とシンボルを見分ける
category: 基本構文
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - quote
  - symbol evaluation
draft: false
hint: 値としての x と、シンボルそのものの 'x をそれぞれ print します
---

## 変数とシンボルを見分ける

シンボルは、そのまま書くと通常は「変数参照」として評価されます。
一方で、`quote` を付けるとシンボルそのものをデータとして扱えます。

```lisp
(defvar x 10)

x    ; => 10
'x   ; => X
```

### 問題
変数 `x` に `10` を束縛し、次の 2 つを順に出力してください。
- `x` の値
- シンボル `'x`
