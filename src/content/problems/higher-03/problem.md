---
id: higher-03
slug: higher-03
title: reduce（畳み込み）
category: 高階関数
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - 高階関数
draft: false
hint: "#'* を reduce に渡します"
---

## reduce

`reduce` はリストの要素を左から順に2つずつ関数に渡して畳み込みます。

```lisp
(reduce #'+ '(1 2 3 4 5))         ; => 15
(reduce #'max '(3 1 4 1 5 9 2))   ; => 9
```

### 問題
`reduce` を使って、リスト `(1 2 3 4 5)` の全要素の積を計算してください。
