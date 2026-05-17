---
id: loop-03
slug: loop-03
title: loop マクロ
category: ループ
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - ループ
draft: false
hint: let で変数を用意し、loop 内で加算、条件を満たしたら return で脱出します
---

## loop マクロ

`loop` は汎用的な繰り返し構文です。
`return` で値を返して脱出できます。

```lisp
(loop
  (print "hello")
  (return nil))
```

### 問題
`loop` と `return` を使って、1から5までの合計を計算してください。
結果（15）を出力してください。
