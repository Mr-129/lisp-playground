---
id: cond-02
slug: cond-02
title: cond式
category: 条件分岐
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - 条件分岐
draft: false
hint: (zerop (mod n 15)) で15の倍数か判定できます
---

## cond式

`cond` は複数条件の分岐に使います（switch文のようなもの）。

```lisp
(cond
  ((条件1) 式1)
  ((条件2) 式2)
  (t デフォルト))
```

### 問題
数値を受け取り、FizzBuzz を返す関数を定義してください。
- 15の倍数 → "FizzBuzz"
- 3の倍数 → "Fizz"
- 5の倍数 → "Buzz"
- それ以外 → その数値
