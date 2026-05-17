---
id: basic-lambda-01
slug: basic-lambda-01
title: lambda と funcall
category: 基本構文
difficulty: intermediate
estimatedMinutes: 8
learningGoals:
  - lambda
  - funcall
draft: false
hint: どちらも (funcall (lambda (...) ...) 値) の形で書けます
---

## lambda と funcall

`lambda` は無名関数を作り、`funcall` は関数オブジェクトを呼び出します。

```lisp
(funcall (lambda (x) (* x x)) 5)
; => 25
```

### 問題
次の 2 つを出力してください。
- 引数を 3 乗する無名関数を使って `4` を計算した結果
- 引数を 2 倍して 1 足す無名関数を使って `7` を計算した結果
