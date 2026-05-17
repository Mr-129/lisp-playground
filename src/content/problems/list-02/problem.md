---
id: list-02
slug: list-02
title: リストの操作
category: リスト操作
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - リスト操作
draft: false
hint: append で結合、reverse で反転
---

## リスト操作関数

```lisp
(append '(1 2) '(3 4))  ; => (1 2 3 4)
(reverse '(1 2 3))      ; => (3 2 1)
(length '(1 2 3))        ; => 3
(member 2 '(1 2 3))      ; => (2 3)
```

### 問題
2つのリストを結合し、反転させた結果を出力してください。
- リスト1: (1 2 3)
- リスト2: (4 5 6)
