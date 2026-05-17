---
id: list-05
slug: list-05
title: リストのフィルタリング
category: リスト操作
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - リスト操作
draft: false
hint: remove-if-not と evenp を使います
---

## remove-if / remove-if-not

条件に合う/合わない要素を除去した新しいリストを返します。

```lisp
(remove-if #'minusp '(3 -1 4 -1 5))
; => (3 4 5)

(remove-if-not #'evenp '(1 2 3 4 5 6))
; => (2 4 6)
```

### 問題
リスト `(1 2 3 4 5 6 7 8 9 10)` から偶数だけを取り出して出力してください。
