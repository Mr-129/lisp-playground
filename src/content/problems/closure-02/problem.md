---
id: closure-02
slug: closure-02
title: カウンター（クロージャ応用）
category: クロージャ
difficulty: advanced
estimatedMinutes: 14
learningGoals:
  - クロージャ
draft: false
hint: let で変数をキャプチャし、setq で更新します
---

## 状態を持つクロージャ

クロージャは状態（可変な変数）を閉じ込めることができます。

```lisp
(defun make-counter ()
  (let ((count 0))
    (lambda ()
      (setq count (+ count 1))
      count)))
```

### 問題
初期値を受け取り、呼び出すたびにその値から1ずつ増加するカウンターを返す
`make-counter` 関数を定義してください。
