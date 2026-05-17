---
id: basic-quote-05
slug: basic-quote-05
title: "'+ と #'+ を見分ける"
category: 基本構文
difficulty: intermediate
estimatedMinutes: 8
learningGoals:
  - quote
  - function
  - symbolp
  - functionp
draft: false
hint: quote した + と、関数オブジェクトの + を別々に判定します
---

## ''+ と #'+ を見分ける

`'+` はシンボル、`#'+` は関数オブジェクトです。
この違いが分かると、`funcall` や `apply` の読み方がかなり楽になります。

```lisp
(symbolp '+)    ; => T
(functionp #'+) ; => T
```

### 問題
次の 2 つを順に出力してください。
- `(symbolp '+)` の結果
- `(functionp #'+)` の結果
