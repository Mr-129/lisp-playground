---
id: type-01
slug: type-01
title: 型判定関数
category: 型判定
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - 型判定
draft: false
hint: cond で numberp, stringp, null, listp を順に判定します。null は listp より先に判定してください
---

## 型判定関数

```lisp
(numberp 42)        ; => T
(stringp "hello")   ; => T
(listp '(1 2))      ; => T
(symbolp 'foo)      ; => T
(null nil)          ; => T
(atom 42)           ; => T（リスト以外はアトム）
```

### 問題
引数の型を文字列で返す関数 `type-name` を定義してください。
- 数値 → "number"
- 文字列 → "string"  
- リスト → "list"
- NIL → "nil"
- それ以外 → "other"
