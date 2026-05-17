---
id: list-03
slug: list-03
title: cons によるリスト構築
category: リスト操作
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - リスト操作
draft: false
hint: 内側から (cons 3 nil)、次に (cons 2 ...)、最後に (cons 1 ...) と組み立てます
---

## cons でリストを組み立てる

`cons` は新しい要素をリストの先頭に追加します。

```lisp
(cons 1 nil)           ; => (1)
(cons 1 '(2 3))        ; => (1 2 3)
(cons 1 (cons 2 nil))  ; => (1 2)
```

### 問題
`cons` だけを使って、リスト `(1 2 3)` を作成し出力してください。
