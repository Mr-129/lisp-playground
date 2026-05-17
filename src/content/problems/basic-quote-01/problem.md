---
id: basic-quote-01
slug: basic-quote-01
title: quote とシンボル
category: 基本構文
difficulty: beginner
estimatedMinutes: 5
learningGoals:
  - quote
  - symbol
draft: false
hint: どちらも quote 付きで print すると確認しやすくなります
---

## quote とシンボル

Common Lisp では、式を評価せずそのまま扱いたいときに `quote` を使います。
省略記法の `'` は reader syntax です。

```lisp
'hello            ; => HELLO
'(a b c)          ; => (A B C)
(quote (1 2 3))  ; => (1 2 3)
```

### 問題
次の 2 つをそれぞれ出力してください。
- シンボル `hello`
- リスト `(lisp common lambda)`
