---
id: cond-01
slug: cond-01
title: if式
category: 条件分岐
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - 条件分岐
draft: false
hint: (plusp n) で正の数か判定できます
---

## if式

`if` は条件分岐の基本形です。

```lisp
(if (条件) 
    真の場合の値
    偽の場合の値)
```

NIL は偽、それ以外はすべて真です。

### 問題
引数が正の数なら "positive"、そうでなければ "non-positive" を返す
関数 `check-sign` を定義してください。
