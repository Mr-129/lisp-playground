---
id: function-apply-04
slug: function-apply-04
title: apply の固定引数を使う
category: 高階関数
difficulty: advanced
estimatedMinutes: 10
learningGoals:
  - apply
  - argument expansion
draft: false
hint: 最後のリストだけが展開される点に注目してください
---

## apply の固定引数を使う

`apply` は最後のリストだけを展開し、それより前の引数はそのまま渡します。
この形が分かると、固定値と可変個引数を組み合わせる場面で応用しやすくなります。

```lisp
(apply #'+ 10 '(1 2 3))
; => 16
```

### 問題
次の 2 つを順に出力してください。
- `(apply #'+ 10 '(1 2 3))` の結果
- `(apply #'max 0 '(7 3 9 2))` の結果
