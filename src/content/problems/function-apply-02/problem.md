---
id: function-apply-02
slug: function-apply-02
title: 関数を変数に入れて funcall する
category: 高階関数
difficulty: intermediate
estimatedMinutes: 8
learningGoals:
  - function object
  - funcall
draft: false
hint: どちらも defvar で関数を束縛し、funcall で呼び出します
---

## 関数を変数に入れて funcall する

関数オブジェクトは、数値や文字列と同じように変数へ束縛できます。
その変数を `funcall` で呼び出せば、関数を値として扱う感覚がつかめます。

```lisp
(defvar *op* #'+)
(funcall *op* 3 4 5) ; => 12
```

### 問題
次の 2 つを順に出力してください。
- `*op*` に `#'+` を束縛して `3 4 5` を加算した結果
- 別の変数に `#'max` を束縛して `9 4 7 3` の最大値
