---
id: function-apply-01
slug: function-apply-01
title: apply で引数列を渡す
category: 高階関数
difficulty: intermediate
estimatedMinutes: 8
learningGoals:
  - apply
  - function object
draft: false
hint: "関数は #'+ や #'max の形で渡せます"
---

## apply

`apply` は最後の引数のリストを展開して関数に渡します。

```lisp
(apply #'+ '(1 2 3 4))
; => 10
```

### 問題
`apply` を使って、次の 2 つを出力してください。
- リスト `(1 2 3 4 5)` の合計
- リスト `(9 4 7 3)` の最大値
