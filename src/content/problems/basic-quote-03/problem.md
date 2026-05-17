---
id: basic-quote-03
slug: basic-quote-03
title: 式をデータとして出力する
category: 基本構文
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - quote
  - code as data
draft: false
hint: 1つ目は通常評価、2つ目は quote して print します
---

## 式をデータとして出力する

Lisp では、同じ見た目のリストでも「評価する式」と「そのまま扱うデータ」を書き分けられます。

```lisp
(+ 1 2)    ; => 3
'(+ 1 2)   ; => (+ 1 2)
```

### 問題
次の 2 つを順に出力してください。
- `(+ 1 2)` の計算結果
- `'(+ 1 2)` をそのまま表した式データ
