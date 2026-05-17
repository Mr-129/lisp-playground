---
id: higher-reduce-01
slug: higher-reduce-01
title: reduce で畳み込む
category: 高階関数
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - reduce
  - aggregation
draft: false
hint: "積は #'* を使います"
---

## reduce

`reduce` は、リストを左からたたみ込んで 1 つの値にまとめます。

```lisp
(reduce #'+ '(1 2 3 4))
; => 10
```

### 問題
`reduce` を使って、次の 2 つを出力してください。
- リスト `(3 6 9 12)` の合計
- リスト `(2 3 4)` の積
