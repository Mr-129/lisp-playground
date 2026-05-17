---
id: list-plist-01
slug: list-plist-01
title: property list から値を探す
category: リスト操作
difficulty: advanced
estimatedMinutes: 12
learningGoals:
  - property list
  - 再帰的な走査
hint: 先頭のキーが違ったら、rest を 2 回進めて次のペアへ移ります
draft: false
---

## property list から値を探す

property list は、`key value key value ...` のようにキーと値が交互に並ぶリストです。
現在の学習モードでは `getf` は未実装なので、先頭から 2 要素ずつ進めて自分で探します。

```lisp
'(name "Lisp" year 1984 kind "language")
```

### 問題
キーと property list を受け取り、対応する値を返す `plist-value` 関数を定義してください。
キーが見つからないときは `nil` を返します。