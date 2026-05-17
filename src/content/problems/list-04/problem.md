---
id: list-04
slug: list-04
title: assoc（連想リスト）
category: リスト操作
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - リスト操作
draft: false
hint: assoc で見つけたペアの second (2番目の要素) を取り出します
---

## 連想リスト（alist）

連想リストはキーと値のペアのリストです。
`assoc` でキーに対応するペアを検索します。

```lisp
(defvar *alist* '(("name" "Taro") ("age" "25")))
(assoc "name" *alist*)  ; => ("name" "Taro")
```

### 問題
果物と価格の連想リストを作成し、"apple" の価格を取り出して出力してください。
- apple: 150, banana: 100, cherry: 300
