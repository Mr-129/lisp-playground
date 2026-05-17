---
id: challenge-01
slug: challenge-01
title: クイックソート
category: 総合問題
difficulty: advanced
estimatedMinutes: 14
learningGoals:
  - 総合問題
draft: false
hint: remove-if と remove-if-not でピボットより小さい/大きい要素を分離します
---

## クイックソート

再帰・リスト操作・高階関数を組み合わせた総合問題です。

クイックソートのアルゴリズム：
1. リストが空なら空リストを返す
2. 先頭要素をピボットとする
3. 残りの要素をピボットより小さいものと大きいものに分ける
4. それぞれを再帰的にソートし、結合する

### 問題
クイックソートを実装する `qsort` 関数を定義してください。
