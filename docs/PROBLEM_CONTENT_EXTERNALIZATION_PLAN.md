# 問題コンテンツ外部化計画

**作成日**: 2026年5月15日  
**位置づけ**: 問題本文・メタ情報・採点条件を、TypeScript の巨大配列から外部ファイル群へ移すための設計文書  
**関連文書**:
- [IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md)
- [PROBLEM_JUDGING_MODEL.md](./PROBLEM_JUDGING_MODEL.md)
- [LEARNING_COVERAGE_GAPS.md](./LEARNING_COVERAGE_GAPS.md)

**ステータス注記**:
- T-601〜T-605 は完了済み。現在の canonical Learn URL は `/learn/<slug>` で、legacy の `/learn/<id>` は後方互換として slug URL に正規化される。
- 本書の「初期移行では id ルートを維持する」は設計時点の判断ログとして残している。最新の authoring 手順は [PROBLEM_AUTHORING_GUIDE.md](./PROBLEM_AUTHORING_GUIDE.md) を参照する。
- [scripts/archive/migrate-legacy-problems-to-content.mjs](../scripts/archive/migrate-legacy-problems-to-content.mjs) は pre-T604 状態からの一時移行補助であり、archive 済み。通常運用では再実行しない。

---

## 1. この文書の結論

今後の問題追加・修正を手戻り少なく進めるため、問題データは次の形へ移行する。

1. 1 問 = 1 フォルダ
2. 本文は Markdown + YAML frontmatter
3. 初期コードと解答例は `.lisp` ファイル分離
4. 採点条件は `judge.json` に分離
5. 問題全体の並び順だけは中央 `manifest.json` で管理
6. アプリ内部では、読み込み後に従来どおり `Problem[]` へ正規化する

この構成により、編集者は問題本文と採点条件をコード本体から切り離して扱え、アプリ側は既存 UI と導線を大きく壊さずに済む。

---

## 2. 設計目標

この設計の目標は次の 5 点である。

1. 問題文修正を TypeScript の巨大配列編集から解放する
2. 問題追加を「問題フォルダを 1 つ増やす」作業へ寄せる
3. 既存の Learn / Problems / Editor / judge 導線を大きく変えない
4. 将来の slug ベース URL に備えつつ、初期移行では id ベースを維持する
5. 1 問ずつ段階移行できるようにし、big bang 移行を避ける

---

## 3. 今回あえてやらないこと

初期移行では次を同時にやらない。

- Markdown renderer の全面刷新
- MDX 化
- 課金コンテンツの分離配信
- ルーティングの即時 slug 化
- ガイド本文の同時外部化
- full URL を frontmatter に保持する設計

特に URL は `pageUrl` を持たず、**slug を持ってアプリ側で URL を組み立てる** 方針とする。環境ごとの base URL や HashRouter 事情をコンテンツへ埋め込まないためである。

---

## 4. 目標ディレクトリ構成

初期配置先は `src/content/problems/` とする。Vite の `import.meta.glob` で build 時に読み込みやすく、アプリ本体との距離も近いためである。

```text
src/
  content/
    problems/
      manifest.json
      basic-01/
        problem.md
        starter.lisp
        solution.lisp
        judge.json
      basic-02/
        problem.md
        starter.lisp
        solution.lisp
        judge.json
      ...
```

### 4-1. 各ファイルの責務

- `manifest.json`
  - 問題全体の並び順だけを保持する
  - ファイルシステム順に依存しないための中央管理ファイル
- `problem.md`
  - frontmatter に編集者向けメタ情報を置く
  - Markdown 本文はそのまま問題文になる
- `starter.lisp`
  - `initialCode` のソース
- `solution.lisp`
  - `solution` のソース
- `judge.json`
  - `JudgeSpec` に対応する採点条件

---

## 5. frontmatter の正式項目

`problem.md` の frontmatter は次を正式項目とする。

### 5-1. 必須項目

- `id`
- `slug`
- `title`
- `category`
- `difficulty`
- `learningGoals`

### 5-2. 任意項目

- `estimatedMinutes`
- `hint`
- `draft`

### 5-3. frontmatter 例

```md
---
id: basic-01
slug: first-s-expression
title: 初めてのS式
category: 基本構文
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - 基本構文
hint: (print ...) で値を出力できます
draft: false
---

## S式（S-expression）

Lisp のプログラムはすべて **S式** で書かれます。
...
```

### 5-4. frontmatter に入れない項目

次の項目は編集者が直接持たず、読み込み後にコード側で導出する。

- `order`
- `catalog`
- `learningPath`
- `tier`
- `courseOrder`
- `prerequisites`

理由は、これらが「問題の原文」ではなく「アプリ内の配置ルール」に属する情報だからである。

---

## 6. manifest の役割

問題全体の順序は `manifest.json` で管理する。

```json
{
  "version": 1,
  "problemOrder": [
    "basic-01",
    "basic-02",
    "basic-03"
  ]
}
```

manifest は次の責務だけを持つ。

1. 問題の表示順を固定する
2. 読み込み時に欠落や重複を検知する
3. `order` と `learningPath.step` の元データになる

カテゴリ順や難易度順を都度計算するのではなく、**作者が意図した学習順を manifest で固定する**。

---

## 7. judge ファイルは JSON を採用する

採点条件は `judge.json` を正式形式とする。

理由は次の通り。

1. 現行の `JudgeSpec` はネストが深く、JSON の方が壊れにくい
2. YAML は入力は楽だが、インデントミスの事故が増えやすい
3. Vite / TypeScript 側で JSON を扱う方が追加依存が少なく済む

### 7-1. 例

```json
{
  "kind": "program",
  "cases": [
    {
      "id": "basic-01-visible-1",
      "label": "足し算と掛け算の出力",
      "visibility": "visible",
      "run": { "code": "" },
      "expect": {
        "output": { "value": "30\n30\n", "comparison": "exact" },
        "returnValue": { "value": "30", "comparison": "exact" }
      }
    }
  ]
}
```

---

## 8. アプリ内の読み込み構成

読み込みは build 時 import を前提とし、実行時 fetch は使わない。

### 8-1. 推奨する責務分割

- `src/data/problemContentSchema.ts`
  - frontmatter / manifest / judge の runtime validation
- `src/data/problemContentLoader.ts`
  - `import.meta.glob` で raw ファイル群を収集し、問題単位へ束ねる
- `src/data/problemCatalog.ts`
  - raw content を現在の `Problem` 形へ正規化し、`order` / `catalog` / `learningPath` を付与する
- `src/data/problems.ts`
  - 既存の export 面を保つ facade に縮小する

### 8-2. 読み込みの流れ

1. `manifest.json` を読む
2. `problem.md` / `starter.lisp` / `solution.lisp` / `judge.json` を `id` 単位で束ねる
3. frontmatter と judge を validation する
4. Markdown 本文、starter、solution、judge を 1 つの raw problem にまとめる
5. manifest 順に並べ替える
6. 現行ルールで `order` / `catalog` / `learningPath` を導出する
7. `Problem[]` として export する

### 8-3. 依存ライブラリ方針

初期実装で追加する候補は次の 2 つに絞る。

- `yaml`: Markdown frontmatter の YAML parse
- `zod`: runtime validation

judge と manifest は JSON を使うため、`yaml` は frontmatter parse のみに限定し、追加の content parser は初期段階では入れない。

---

## 9. 移行方針

### 9-1. 二重系移行を採用する

最初から全 59 問を一括移行しない。しばらくは次の二重系で動かす。

1. 外部ファイル化された問題
2. 従来の `problemSeeds`

同一 `id` が両方に存在する場合は、**外部ファイル側を優先**する。

これにより、1 問ずつ安全に移行できる。

### 9-2. pilot 問題は 3 問で始める

pilot は次の代表ケースを選ぶ。

1. `program` judge の基本問題
2. `function` judge の問題
3. Markdown 本文が比較的長い問題

この 3 問で、一覧表示、Learn、Editor、judge の全導線を検証できる。

### 9-3. 全件移行は自動化前提で行う

全 59 問は手作業で打ち直さず、現行 `Problem[]` から一括変換するスクリプトを使う前提とする。

ただし、その自動変換スクリプト自体は一時的な移行補助であり、初期のランタイム依存には含めない。

---

## 10. URL 設計方針

### 10-1. 初期移行では id ルートを維持する

初期移行では `/learn/:problemId` を維持する。既存の Problems / Learn / Editor 導線を壊さずに済むためである。

### 10-2. slug は先に持たせる

ただし frontmatter には `slug` を必須で持たせる。

理由は次の通り。

1. 将来の URL 改善に備えられる
2. 後から 59 問ぶん slug を追加し直す手戻りを避けられる
3. authoring 時点で命名規約を固定できる

### 10-3. full URL は持たない

`pageUrl` のような完全 URL は保持しない。環境差分をコンテンツに混ぜないためである。

---

## 11. validation とテスト

最低限、次の検証を自動化する。

1. `manifest.json` の重複・欠落チェック
2. `id` と `slug` の一意性チェック、および `slug` が他問題の `id` と衝突しないことの確認
3. 各問題フォルダに 4 ファイルが揃っていることの確認
4. frontmatter schema の validation
5. `judge.json` の schema validation
6. `Problem[]` へ正規化した後の件数整合性
7. pilot 問題の Learn / Editor / judge 回帰テスト

追加対象テストの中心は次とする。

- `src/data/__tests__/problemContentLoader.test.ts`
- `src/data/__tests__/problems.test.ts`
- `src/pages/__tests__/LearnPage.test.tsx`
- `src/pages/__tests__/EditorPage.test.tsx`

---

## 12. リスクと回避策

### リスク 1: 一気に全問題を移して壊れる

- **回避策**: 二重系 + pilot 3 問移行を先に入れる

### リスク 2: authoring schema が曖昧で後から修正が広がる

- **回避策**: frontmatter の正式項目を固定し、導出項目はコード側へ寄せる

### リスク 3: URL 設計を同時に変えて回帰が増える

- **回避策**: 初期移行では id route 維持、slug route は別タスク化する

### リスク 4: Markdown renderer の機能不足に引っ張られる

- **回避策**: まず保存形式だけ外部化し、renderer 改修は必要が出た時点で別タスクに分離する

---

## 13. この設計で先に着手する順番

1. schema と loader 境界の確定
2. `manifest.json` + build-time loader + validation 基盤
3. pilot 3 問の外部化
4. 全問題移行
5. slug route と authoring guide の整備

この順番なら、問題追加ペースを止めすぎずに基盤移行を進められる。