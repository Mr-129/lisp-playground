---
id: recursion-tree-02
slug: recursion-tree-02
title: tree の数値を 2 倍する
category: 再帰
difficulty: advanced
estimatedMinutes: 14
learningGoals:
  - tree 変換
  - cons
  - 再帰
hint: atom を 2 倍し、枝では first と rest をそれぞれ再帰して cons で戻します
draft: false
---

## tree の数値を 2 倍する

tree 再帰では、ただ数えるだけでなく「同じ形を保ったまま新しい tree を返す」変換もよく行います。
今回は、すべての数値を 2 倍した新しい tree を作ります。

### 問題
tree を受け取り、すべての数値を 2 倍した tree を返す `double-tree` 関数を定義してください。
元の tree と同じ形を保って返します。