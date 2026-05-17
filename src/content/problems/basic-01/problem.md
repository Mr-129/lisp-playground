---
id: basic-01
slug: first-s-expression
title: 初めてのS式
category: 基本構文
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - 基本構文
hint: (print ...) で値を出力できます
draft: false
---

## S式（S-expression）

Lispのプログラムは他のプログラムと比較したときに大きく二つの特徴があります。

1. **S式**
S式とは括弧 `()` で囲まれた式です。
例文としては、以下のような書き方をします。

```lisp
(+ 1 2)     ; => 3
(* 3 4)     ; => 12
```

2. **前置記法**
演算子が最初に来ます。
通常の四則演算を実施するときなどは、演算子は数字と数字の間にいますが、Lispではすべての演算子は最初に来ます。

例:**1 + 2**

- Lisp

```lisp
(+ 1 2)     ; => 3
```

- Python

```python
1 + 2
```

### 問題
`(+ 10 20)` の結果が 30 になることを確認し、
`(* 5 6)` の結果を出力してください。