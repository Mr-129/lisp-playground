---
id: recursion-01
slug: recursion-01
title: 再帰関数
category: 再帰
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - 再帰
draft: false
hint: ベースケース2つ (n=0, n=1) を if/cond で処理します
---

## 再帰

Lispでは再帰が基本的なループ手法です。

```lisp
(defun factorial (n)
  (if (<= n 1)
      1
      (* n (factorial (- n 1)))))
```

### 問題
フィボナッチ数を計算する再帰関数 `fib` を定義してください。
- fib(0) = 0
- fib(1) = 1
- fib(n) = fib(n-1) + fib(n-2)
