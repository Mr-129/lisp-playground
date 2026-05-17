---
id: cond-03
slug: cond-03
title: when と unless
category: 条件分岐
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - 条件分岐
draft: false
hint: dolist で各要素を取り出し、when と plusp で正の数を判定します
---

## when と unless

`when` は条件が真のときだけ式を実行します。
`unless` は条件が偽のときだけ式を実行します。

```lisp
(when (> 5 3)
  (print "5は3より大きい"))

(unless (> 3 5)
  (print "3は5より大きくない"))
```

### 問題
リスト内の数値について、正の数のみ出力する処理を書いてください。
リストは `(3 -1 4 -1 5 -9 2 -6)` です。
