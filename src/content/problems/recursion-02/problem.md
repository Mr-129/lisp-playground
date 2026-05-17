---
id: recursion-02
slug: recursion-02
title: 階乗
category: 再帰
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - 再帰
draft: false
hint: (if (<= n 1) 1 (* n (factorial (- n 1))))
---

## 階乗（factorial）

再帰の最も基本的な例です。

```lisp
; n! = n × (n-1) × ... × 1
; 0! = 1（ベースケース）
```

### 問題
階乗を計算する再帰関数 `factorial` を定義してください。
`(factorial 5)` が 120 を返すようにしてください。
