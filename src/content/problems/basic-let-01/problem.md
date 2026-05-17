---
id: basic-let-01
slug: basic-let-01
title: let による局所束縛
category: 基本構文
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - let
  - lexical binding
draft: false
hint: let の本体には複数の式を書けます
---

## let

`let` は局所変数を束縛する基本形です。

```lisp
(let ((x 10)
      (y 20))
  (+ x y))
; => 30
```

### 問題
`let` を使って `x=4` と `y=8` を束縛し、
次の 2 つを順に出力してください。
- 合計
- 積
