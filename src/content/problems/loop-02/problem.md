---
id: loop-02
slug: loop-02
title: dolistループ
category: ループ
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - ループ
draft: false
hint: dolist を使います
---

## dolist

リストの各要素に対して繰り返すマクロです。

```lisp
(dolist (item '("apple" "banana" "cherry"))
  (print item))
```

### 問題
リスト `("Common" "Lisp" "is" "fun")` の各要素を出力してください。
