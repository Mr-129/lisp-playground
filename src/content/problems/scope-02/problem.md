---
id: scope-02
slug: scope-02
title: progn（複数式の実行）
category: スコープ
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - スコープ
draft: false
hint: progn の中に print を2つ並べます
---

## progn

`progn` は複数の式を順番に実行し、最後の式の値を返します。

```lisp
(progn
  (print "first")
  (print "second")
  42)
; "first" と "second" を出力し、42 を返す
```

### 問題
`progn` を使って、"Processing..." を出力してから計算結果 `(* 6 7)` を出力してください。
