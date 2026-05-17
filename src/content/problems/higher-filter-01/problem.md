---
id: higher-filter-01
slug: higher-filter-01
title: remove-if-not で絞り込む
category: 高階関数
difficulty: intermediate
estimatedMinutes: 9
learningGoals:
  - remove-if-not
  - predicate
draft: false
hint: predicate には evenp をそのまま渡せます
---

## remove-if-not

`remove-if-not` は、条件に合う要素だけを残す関数です。

```lisp
(remove-if-not #'evenp '(1 2 3 4 5 6))
; => (2 4 6)
```

### 問題
リスト `(1 2 3 4 5 6 7 8)` から、
偶数だけを取り出したリストを出力してください。
