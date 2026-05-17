---
id: math-02
slug: math-02
title: 数値の判定
category: 数値計算
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - 数値計算
draft: false
hint: (and (plusp n) (evenp n)) で両方の条件を同時にチェックできます
---

## 数値の判定関数

```lisp
(zerop 0)     ; => T
(plusp 5)     ; => T
(minusp -3)   ; => T
(evenp 4)     ; => T
(oddp 7)      ; => T
```

### 問題
引数の数値が「正の偶数」かどうかを判定する関数 `positive-even-p` を定義してください。
正の偶数なら T、それ以外なら NIL を返します。
