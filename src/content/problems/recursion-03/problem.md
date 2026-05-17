---
id: recursion-03
slug: recursion-03
title: リストの再帰処理
category: 再帰
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - 再帰
draft: false
hint: "ベースケース: 空リスト→0、再帰: (+ (car lst) (my-sum (cdr lst)))"
---

## リストと再帰

リストを再帰的に処理するパターンは、car（先頭）を処理し、cdr（残り）に対して再帰呼び出しします。

```lisp
(defun my-length (lst)
  (if (null lst)
      0
      (+ 1 (my-length (cdr lst)))))
```

### 問題
リストの要素を合計する再帰関数 `my-sum` を定義してください。
