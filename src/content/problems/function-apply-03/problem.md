---
id: function-apply-03
slug: function-apply-03
title: "function と #' の両方を使う"
category: 高階関数
difficulty: intermediate
estimatedMinutes: 8
learningGoals:
  - function
  - "#'"
  - funcall
  - apply
draft: false
hint: function で取り出した関数も、funcall と apply でそのまま使えます
---

## function と #' の両方を使う

`#'` は `(function ...)` の省略形です。
この 2 つを両方使ってみると、`#'` がただの記号ではなく、関数を取り出す書き方だと分かります。

```lisp
(funcall (function 1+) 9)   ; => 10
(apply (function max) '(2 7 3)) ; => 7
```

### 問題
次の 2 つを順に出力してください。
- `(function 1+)` を `funcall` して `9` を 1 増やした結果
- `(function max)` を `apply` して `(2 7 3)` の最大値
