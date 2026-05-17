---
id: recursion-sum-01
slug: recursion-sum-01
title: 再帰でリストの合計を出す
category: 再帰
difficulty: intermediate
estimatedMinutes: 11
learningGoals:
  - recursion
  - car
  - cdr
draft: false
hint: ベースケースは null、再帰では car と cdr を使います
---

## 再帰でリストをたどる

リストの合計は、
「空リストなら 0、そうでなければ先頭 + 残りの合計」と考えると再帰で書けます。

### 問題
リストの要素の合計を返す `sum-list` を定義し、
次の 2 つを出力してください。
- `(1 2 3 4 5)` の合計
- 空リストの合計
