---
id: recursion-tree-01
slug: recursion-tree-01
title: tree の葉を数える
category: 再帰
difficulty: intermediate
estimatedMinutes: 12
learningGoals:
  - tree 再帰
  - atom / null
hint: null は 0、atom は 1、そうでなければ first と rest に分けて数えます
draft: false
---

## tree の葉を数える

tree を再帰で処理するときは、空リスト、葉、枝の 3 つに分けて考えると書きやすくなります。
今回は、ネストしたリストの中にある「葉」の個数を数えます。

### 問題
tree を受け取り、含まれる葉の個数を返す `count-atoms` 関数を定義してください。
空リスト `nil` は 0 個と数えます。