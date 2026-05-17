---
id: string-01
slug: string-01
title: 文字列の基本
category: 文字列操作
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - 文字列操作
draft: false
hint: concatenate で結合、string-upcase で大文字変換します
---

## 文字列操作

Lispには便利な文字列操作関数があります。

```lisp
(concatenate 'string "Hello" " " "World")
; => "Hello World"

(string-upcase "hello")   ; => "HELLO"
(string-downcase "HELLO") ; => "hello"
(length "abc")            ; => 3
```

### 問題
"Hello" と "Lisp" を空白で結合し、大文字に変換して出力してください。
