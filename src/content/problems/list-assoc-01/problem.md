---
id: list-assoc-01
slug: list-assoc-01
title: assoc で連想リストを引く
category: リスト操作
difficulty: intermediate
estimatedMinutes: 9
learningGoals:
  - association list
  - assoc
draft: false
hint: assoc の結果から second を使うと値だけを取り出せます
---

## assoc と連想リスト

連想リストは、キーと値の組をリストで並べた表現です。
`assoc` はキーに対応する組を返します。

```lisp
(assoc 'name '((name "Lisp") (year 1984)))
; => (NAME "Lisp")
```

### 問題
次の連想リストから `name` と `year` の値だけを取り出して出力してください。

`((name "Lisp") (year 1984) (kind "language"))`
