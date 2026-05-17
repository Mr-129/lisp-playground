---
id: string-format-01
slug: string-format-01
title: format で文字列を組み立てる
category: 文字列操作
difficulty: intermediate
estimatedMinutes: 8
learningGoals:
  - format
  - string construction
draft: false
hint: ~A を 2 つ使うと値を差し込めます
---

## format

`format` は文字列整形の基本ツールです。
第 1 引数に `nil` を渡すと、出力せず文字列を返します。

```lisp
(format nil "Hello, ~A!" "Lisp")
; => "Hello, Lisp!"
```

### 問題
`format` を使って、
`Alice scored 95 points.` という文字列を作り、出力してください。
