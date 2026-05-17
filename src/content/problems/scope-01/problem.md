---
id: scope-01
slug: scope-01
title: let と let*
category: スコープ
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - スコープ
draft: false
hint: (let* ((r 5) (area (* 3.14159 r r))) ...)
---

## let と let*

`let` はローカル変数を定義します。
`let*` は前の束縛を参照できます。

```lisp
(let ((x 10) (y 20))
  (+ x y))  ; => 30

(let* ((x 10) (y (* x 2)))
  y)  ; => 20
```

### 問題
`let*` を使って、半径5の円の面積を計算して出力してください。
円周率は 3.14159 とします。面積 = π × r × r
