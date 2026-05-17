---
id: higher-04
slug: higher-04
title: some と every
category: 高階関数
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - 高階関数
draft: false
hint: "every と some に #'evenp を渡します"
---

## some と every

`some` はリスト内に条件を満たす要素が1つでもあれば真を返します。
`every` はすべての要素が条件を満たせば真を返します。

```lisp
(some #'evenp '(1 3 5 6))    ; => T
(every #'plusp '(1 2 3))     ; => T
(every #'plusp '(1 -2 3))    ; => NIL
```

### 問題
リスト `(2 4 6 8 10)` がすべて偶数か、リスト `(1 3 5 7)` に偶数が含まれるか、
それぞれ判定して出力してください。
