---
id: basic-03
slug: define-add-function
title: 関数の定義
category: 基本構文
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - 基本構文
hint: (defun add (a b) (+ a b)) のように定義します
draft: false
---

## 関数の定義（defun）

`defun` で関数を定義します。

```lisp
(defun square (x)
  (* x x))

(square 5)  ; => 25
```

### 問題
2つの引数を受け取り、その合計を返す関数 `add` を定義してください。

採点では、定義した `add` に対して複数の引数パターンを呼び出します。