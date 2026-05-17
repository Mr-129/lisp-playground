---
id: string-02
slug: string-02
title: 部分文字列
category: 文字列操作
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - 文字列操作
draft: false
hint: '"Lisp" は7文字目から4文字分です（0始まり）'
---

## 部分文字列（subseq）

`subseq` で文字列の一部を取り出せます。

```lisp
(subseq "Hello World" 0 5)  ; => "Hello"
(subseq "Hello World" 6)    ; => "World"
```

### 問題
文字列 "Common Lisp Programming" から "Lisp" の部分だけを取り出して出力してください。
