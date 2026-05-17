---
id: loop-collect-01
slug: loop-collect-01
title: dotimes で平方を並べる
category: ループ
difficulty: intermediate
estimatedMinutes: 8
learningGoals:
  - dotimes
  - iteration
draft: false
hint: dotimes は 0 から始まるので、必要なら (+ i 1) で補正します
---

## dotimes で繰り返す

`dotimes` は、指定した回数だけ繰り返す基本的な反復です。

```lisp
(dotimes (i 3)
  (print (* (+ i 1) (+ i 1))))
; => 1, 4, 9 を順に出力
```

### 問題
1 から 5 までの平方を、それぞれ 1 行ずつ出力してください。
