---
id: string-03
slug: string-03
title: 文字列の比較と変換
category: 文字列操作
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - 文字列操作
draft: false
hint: write-to-string で数値→文字列変換し、concatenate で結合します
---

## 文字列の比較と変換

```lisp
(string= "abc" "abc")       ; => T
(write-to-string 42)        ; => "42"
(parse-integer "123")       ; => 123
```

### 問題
数値 2026 を文字列に変換し、"Year: " と結合して出力してください。
