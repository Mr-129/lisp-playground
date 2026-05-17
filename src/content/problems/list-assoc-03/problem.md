---
id: list-assoc-03
slug: list-assoc-03
title: assoc で一覧を変換する
category: リスト操作
difficulty: intermediate
estimatedMinutes: 12
learningGoals:
  - assoc
  - mapcar
  - 変換処理
hint: 1 件ずつ assoc で探し、見つからないときだけ "unknown" を返します
draft: false
---

## assoc で一覧を変換する

設定表や辞書風データは、1 件だけ引くよりも「一覧をまとめて変換する」ときに便利です。
`mapcar` と `assoc` を組み合わせると、キーの並びを別のラベル列に変換できます。

### 問題
キーの一覧と対応表を受け取り、対応するラベル一覧を返す `resolve-labels` 関数を定義してください。
キーが見つからないときは、対応する位置に `"unknown"` を入れます。