---
id: loop-01
slug: loop-01
title: dotimesループ
category: ループ
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - ループ
draft: false
hint: dotimes は0から始まるので、(+ i 1) で調整します
---

## dotimes

指定回数だけ繰り返すマクロです。

```lisp
(dotimes (i 5)
  (print i))
; 0, 1, 2, 3, 4 を出力
```

### 問題
1から10までの数を出力してください。
