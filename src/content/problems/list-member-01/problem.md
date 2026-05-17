---
id: list-member-01
slug: list-member-01
title: length と member
category: リスト操作
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - length
  - member
draft: false
hint: シンボル c は quote 付きで渡します
---

## length と member

リストの長さを見るには `length`、要素の位置以降を探すには `member` を使います。

```lisp
(length '(a b c))
; => 3

(member 'b '(a b c d))
; => (B C D)
```

### 問題
リスト `(a b c d)` に対して、次の 2 つを出力してください。
- リストの長さ
- `c` を `member` で探した結果
