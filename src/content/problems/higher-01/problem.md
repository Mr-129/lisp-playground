---
id: higher-01
slug: higher-01
title: mapcar
category: 高階関数
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - 高階関数
draft: false
hint: lambda で無名関数を作り、mapcar に渡します
---

## mapcar - リストの変換

`mapcar` はリストの各要素に関数を適用します。

```lisp
(mapcar #'1+ '(1 2 3))
; => (2 3 4)

(mapcar (lambda (x) (* x x)) '(1 2 3 4))
; => (1 4 9 16)
```

### 問題
リスト `(1 2 3 4 5)` の各要素を2倍にした新しいリストを出力してください。
