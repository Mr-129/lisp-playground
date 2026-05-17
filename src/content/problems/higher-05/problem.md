---
id: higher-05
slug: higher-05
title: funcall と apply
category: 高階関数
difficulty: advanced
estimatedMinutes: 14
learningGoals:
  - 高階関数
draft: false
hint: mapcar で各関数に対して funcall を呼び出します
---

## funcall と apply

`funcall` は関数を引数付きで呼び出します。
`apply` はリストを引数として展開して関数を呼び出します。

```lisp
(funcall #'+ 1 2 3)        ; => 6
(apply #'+ '(1 2 3))       ; => 6
(apply #'max '(3 1 4 1 5)) ; => 5
```

### 問題
関数のリストを受け取り、それぞれを引数に適用した結果のリストを返す
`apply-all` 関数を定義してください。
`(apply-all (list #'1+ #'(lambda (x) (* x x)) #'abs) -3)` が `(-2 9 3)` を返すようにしてください。
