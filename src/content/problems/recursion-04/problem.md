---
id: recursion-04
slug: recursion-04
title: リストの反転（再帰）
category: 再帰
difficulty: advanced
estimatedMinutes: 14
learningGoals:
  - 再帰
draft: false
hint: (append (my-reverse (cdr lst)) (list (car lst)))
---

## リストの反転を再帰で実装

組み込みの `reverse` を使わずに、リストを反転する関数を自作してください。

```lisp
; ヒント: append で末尾に追加するパターン
(append '(1 2) '(3))  ; => (1 2 3)
```

### 問題
`reverse` を使わずにリストを反転する `my-reverse` を定義してください。
