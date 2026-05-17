---
id: binding-let-star-01
slug: binding-let-star-01
title: let* で前の束縛を使う
category: 基本構文
difficulty: intermediate
estimatedMinutes: 7
learningGoals:
  - let*
  - sequential binding
draft: false
hint: let* なら後ろの束縛で前の変数を参照できます
---

## let*

`let*` は、前に束縛した変数を次の束縛式で使える形です。

```lisp
(let* ((x 10)
       (y (+ x 5)))
  y)
; => 15
```

### 問題
`let*` を使って、
- `base = 3`
- `double = base * 2`
- `triple = base * 3`
を順に束縛し、`double + triple` を出力してください。
