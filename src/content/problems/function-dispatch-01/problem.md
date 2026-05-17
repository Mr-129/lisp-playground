---
id: function-dispatch-01
slug: choose-op-by-condition
title: 条件によって関数を返す
category: 高階関数
difficulty: advanced
estimatedMinutes: 12
learningGoals:
  - function object
  - if
  - funcall
hint: if の戻り値として関数オブジェクトを返し、その結果を funcall します
draft: false
---

## 条件によって関数を返す

関数オブジェクトは、引数として渡すだけでなく、関数の戻り値として返すこともできます。
これが分かると、「条件によって処理を切り替える関数」を Lisp らしく書けるようになります。

```lisp
(defun choose-op (use-add)
  (if use-add #'+ #'*))
```

### 問題
`use-add` が真なら `#'+`、偽なら `#'*` を返す `choose-op` を定義し、
次の 2 つを順に出力してください。
- `(funcall (choose-op t) 2 3 4)`
- `(funcall (choose-op nil) 2 3 4)`