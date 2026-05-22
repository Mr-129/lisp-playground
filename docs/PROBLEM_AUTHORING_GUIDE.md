# 問題 Authoring ガイド

この文書は、Lambda Lab に新しい問題を追加するときの最短手順をまとめたものです。

## 1. `id` と `slug` の役割

- `id`: 内部で使う安定 ID。manifest、フォルダ名、storage、学習パス参照で使う
- `slug`: 公開 URL 用の識別子。Learn ページの canonical URL は `/learn/<slug>`

命名ルール:

- どちらも小文字英数とハイフンのみ
- `id` は公開後に変更しない
- `slug` も公開後は原則固定する
- `slug` は他の問題の `slug` と重複させない
- `slug` は他の問題の `id` とも重複させない

補足:

- legacy の `/learn/<id>` は後方互換で解決されます
- ただし、古い `slug` から新しい `slug` への自動 redirect はありません

## 2. フォルダ構成

1 問につき 1 フォルダを使います。

```text
src/content/problems/<id>/
  problem.md
  starter.lisp
  solution.lisp
  judge.json
```

表示順は [src/content/problems/manifest.json](../src/content/problems/manifest.json) の `problemOrder` で管理します。

## 3. 追加手順

1. `src/content/problems/<id>/` を作る
2. [src/content/problems/manifest.json](../src/content/problems/manifest.json) の `problemOrder` に `id` を追加する
3. `problem.md` に frontmatter と本文を書く
4. `starter.lisp` に初期コードを書く
5. `solution.lisp` に模範解答を書く
6. `judge.json` に採点条件を書く
7. テストを実行する

カテゴリは `problem.md` の `category` で自動グルーピングされます。新しいカテゴリ名を指定すると、一覧 UI に新しいセクションが自動追加されます。

## 4. `problem.md` テンプレート

```yaml
---
id: list-06
slug: count-elements
title: 要素数を数える
category: リスト操作
difficulty: beginner
estimatedMinutes: 8
learningGoals:
  - リスト操作
  - length の利用
hint: length が使えます
draft: false
---

## リストの長さ

問題文は Markdown で記述します。
現在の renderer は `react-markdown` + `remark-gfm` なので、通常の箇条書きに加えて番号付きリスト、ネストしたリスト、list item 配下の fenced code block も使えます。見出しは UI 上の階層都合で `##` が h3、`###` が h4 として描画されます。
```

frontmatter の意味:

- `id`: 内部 ID。manifest の値、フォルダ名と一致させる
- `slug`: Learn URL に使う公開用文字列。他問題の `id` / `slug` と衝突しない名前にする
- `title`: 問題タイトル
- `category`: 問題一覧とサイドバーのグルーピング単位
- `difficulty`: `beginner` / `intermediate` / `advanced`
- `estimatedMinutes`: 想定学習時間
- `learningGoals`: 学習目標の配列
- `hint`: 任意
- `draft`: 現行運用では `false` を使う

## 5. `starter.lisp` と `solution.lisp`

- `starter.lisp`: 学習者が最初に見るコード
- `solution.lisp`: 模範解答。Learn ページの「解答を表示」で使う

初期コードは空でも構いませんが、学習意図があるなら関数名や引数だけ先に置いた方が誘導しやすくなります。

## 6. `judge.json` テンプレート

### `program` judge

```json
{
  "kind": "program",
  "cases": [
    {
      "id": "list-06-visible-1",
      "label": "visible case",
      "visibility": "visible",
      "run": {
        "code": ""
      },
      "expect": {
        "output": {
          "value": "3\n",
          "comparison": "exact"
        }
      }
    }
  ]
}
```

### `function` judge

```json
{
  "kind": "function",
  "functionName": "count-elements",
  "cases": [
    {
      "id": "list-06-visible-1",
      "label": "(1 2 3)",
      "visibility": "visible",
      "run": {
        "code": "(print (count-elements '(1 2 3)))"
      },
      "expect": {
        "output": {
          "value": "3\n",
          "comparison": "exact"
        }
      }
    }
  ]
}
```

使い分け:

- そのままプログラム全体を実行して判定するなら `program`
- 特定関数を実装させ、複数ケースで呼び出したいなら `function`

## 7. 検証コマンド

問題を追加または更新したら、最低限次を実行します。

```bash
npm test -- --run src/data/__tests__/problemContentLoader.test.ts src/data/__tests__/problems.test.ts
```

ルーティングや画面表示まで触れた場合は、追加で次も実行します。

```bash
npm test -- --run src/pages/__tests__/LearnPage.test.tsx src/pages/__tests__/ProblemsPage.test.tsx src/pages/__tests__/EditorPage.test.tsx
```

## 8. 既存問題を編集するときの原則

- 本文、ヒント、模範解答の改善は自由に行える
- `id` は既存データや storage 参照のため固定する
- `slug` は公開 URL なので安易に変更しない
- URL を変えずに名称だけ直したい場合は `title` だけを更新する