---
id: closure-01
slug: closure-01
title: クロージャの基本
category: クロージャ
difficulty: advanced
estimatedMinutes: 14
learningGoals:
  - クロージャ
draft: false
hint: lambda の中で外側の変数を参照すると、クロージャになります
---

## クロージャ

クロージャは、関数とその定義時の環境を一緒に保持する仕組みです。

```lisp
(defun make-adder (n)
  (lambda (x) (+ x n)))

(defvar *add5* (make-adder 5))
(funcall *add5* 10)  ; => 15
```

`make-adder` が返す lambda は、`n` の値を「覚えて」います。

### 問題
引数に指定した倍率で掛け算する関数を返す `make-multiplier` を定義してください。
`(funcall (make-multiplier 3) 7)` が 21 を返すようにしてください。
