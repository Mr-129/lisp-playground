---
id: basic-02
slug: basic-02
title: 変数の定義
category: 基本構文
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - 基本構文
draft: false
hint: (defvar *greeting* "Hello, Lisp!") のように書きます
---

## 変数の定義

`defvar` でグローバル変数を定義します。
`setq` で変数に値を代入します。

```lisp
(defvar *name* "Lisp")
(setq x 42)
```

### 問題
変数 `*greeting*` に "Hello, Lisp!" という文字列を定義し、
`print` で出力してください。
