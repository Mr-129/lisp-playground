---
id: list-tree-01
slug: list-tree-01
title: ネストリストを読む
category: リスト操作
difficulty: beginner
estimatedMinutes: 8
learningGoals:
  - ネストリスト
  - first / second
hint: first と second を順に使うと、内側のリストへ入れます
draft: false
---

## ネストリストを読む

ネストリストは、リストの中にさらにリストが入っているデータです。
tree の最初の一歩は、内側のリストを順番にたどって目的の場所を読むことです。

```lisp
(defvar *tree* '((red blue) (circle (square triangle)) leaf))

(first *tree*)
(second (second *tree*))
```

### 問題
次の `*menu*` から、以下を順に出力してください。

- 先頭のリスト `(tea coffee)`
- 2 番目の要素の中にある `(main soup)`