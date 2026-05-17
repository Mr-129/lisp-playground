---
id: recursion-tree-03
slug: recursion-tree-03
title: tree の数値を合計する
category: 再帰
difficulty: advanced
estimatedMinutes: 14
learningGoals:
  - tree 再帰
  - 集計処理
hint: null は 0、atom はその数値、枝では first と rest の合計を足します
draft: false
---

## tree の数値を合計する

tree を再帰で処理すると、集計処理も 1 つのパターンとして書けます。
今回は、ネストした tree に含まれる数値をすべて足し合わせます。

### 問題
数値だけでできた tree を受け取り、合計を返す `sum-tree` 関数を定義してください。