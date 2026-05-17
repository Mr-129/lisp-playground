---
id: list-01
slug: list-01
title: リストの基本
category: リスト操作
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - リスト操作
draft: false
hint: car で先頭、cdr で残りを取得します
---

## リスト

Lispの最も重要なデータ構造です。

```lisp
'(1 2 3)              ; クォートでリストリテラル
(list 1 2 3)          ; list関数
(car '(1 2 3))        ; => 1 (先頭要素)
(cdr '(1 2 3))        ; => (2 3) (残り)
(cons 0 '(1 2 3))     ; => (0 1 2 3) (先頭に追加)
```

### 問題
リスト `(10 20 30 40 50)` の先頭要素と、
残りのリストをそれぞれ出力してください。
