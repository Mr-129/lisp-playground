---
id: closure-03
slug: closure-03
title: メモ化（クロージャ応用）
category: クロージャ
difficulty: advanced
estimatedMinutes: 14
learningGoals:
  - クロージャ
draft: false
hint: let でリストをキャプチャし、setq と append で更新します
---

## クロージャによるメモ化

クロージャで連想リストを保持し、計算済みの結果を再利用するパターンです。

```lisp
(defun make-counter ()
  (let ((count 0))
    (lambda ()
      (setq count (+ count 1))
      count)))
```

### 問題
呼び出すたびにリストに要素を追加し、現在のリストを返す関数を返す
`make-accumulator` を定義してください。
