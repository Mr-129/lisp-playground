---
id: challenge-03
slug: challenge-03
title: flatten（ネストリストの平坦化）
category: 総合問題
difficulty: advanced
estimatedMinutes: 14
learningGoals:
  - 総合問題
draft: false
hint: cond で null, consp, atom の3パターンに分岐。consp なら car と cdr をそれぞれ flatten して append
---

## リストの平坦化

ネストしたリストを1次元に平坦化する関数を作る問題です。

```lisp
(flatten '(1 (2 3) (4 (5 6))))
; => (1 2 3 4 5 6)
```

### 問題
ネストしたリストを平坦化する `flatten` 関数を定義してください。
再帰と `consp`（コンスセルかどうかの判定）を使います。
