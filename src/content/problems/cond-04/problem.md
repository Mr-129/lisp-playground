---
id: cond-04
slug: cond-04
title: 論理演算子
category: 条件分岐
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - 条件分岐
draft: false
hint: (and (>= n 10) (< n 100)) を使います
---

## 論理演算子（and, or, not）

```lisp
(and t t)    ; => T
(and t nil)  ; => NIL
(or nil t)   ; => T
(not nil)    ; => T
```

`and` は最後の真の値を、`or` は最初の真の値を返します（短絡評価）。

### 問題
引数が「10以上かつ100未満」の数値かどうかを判定する関数 `two-digit-p` を定義してください。
