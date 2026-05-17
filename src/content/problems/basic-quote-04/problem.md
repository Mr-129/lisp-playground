---
id: basic-quote-04
slug: basic-quote-04
title: quote と list で同じ式を作る
category: 基本構文
difficulty: intermediate
estimatedMinutes: 8
learningGoals:
  - quote
  - list
  - symbol
draft: false
hint: 1つ目は quote、2つ目は list とシンボル '+ を使います
---

## quote と list で同じ式を作る

式データは、`quote` でそのまま書くことも、`list` で組み立てることもできます。

```lisp
'(+ 1 2)          ; => (+ 1 2)
(list '+ 1 2)     ; => (+ 1 2)
```

### 問題
次の 2 つを順に出力してください。
- `'(+ 1 2)`
- `(list '+ 1 2)`
