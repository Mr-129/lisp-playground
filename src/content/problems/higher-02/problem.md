---
id: higher-02
slug: higher-02
title: remove-if（フィルタ）
category: 高階関数
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - 高階関数
draft: false
hint: lambda で長さを判定する関数を作り、remove-if に渡します
---

## remove-if / remove-if-not

関数を渡して条件に合う要素を除去/抽出できます。

```lisp
(remove-if #'oddp '(1 2 3 4 5))
; => (2 4)

(remove-if-not #'plusp '(-1 0 1 2 -3))
; => (1 2)
```

### 問題
文字列のリストから、長さが3文字以下の短い単語を除去して出力してください。
リスト: ("I" "love" "Common" "Lisp" "so" "much")
