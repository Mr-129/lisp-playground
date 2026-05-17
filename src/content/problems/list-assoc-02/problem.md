---
id: list-assoc-02
slug: list-assoc-02
title: assoc で設定値を探す
category: リスト操作
difficulty: intermediate
estimatedMinutes: 10
learningGoals:
  - assoc
  - association list
hint: assoc の結果を変数に入れて、見つかったときだけ second で値を返します
draft: false
---

## assoc で設定値を探す

association list は、キーと値のペアを並べたリストです。
`assoc` を使うと、キーに対応するペアをまとめて取り出せます。

```lisp
(assoc 'theme '((mode "study") (theme "dark") (lang "ja")))
; => (THEME "dark")
```

### 問題
キーと設定表を受け取り、値だけを返す `lookup-setting` 関数を定義してください。
キーが見つからないときは `nil` を返します。