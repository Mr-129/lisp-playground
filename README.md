# Lisperpaw - Common Lisp 学習スタジオ

<p align="center">
  <strong>Lisperpaw</strong><br>
  Lisp を始める人の最初の一歩を、猫の前足みたいに軽く踏み出せる学習スタジオ
</p>

---

## 概要

**Lisperpaw** は、Lisp を始める人の最初の一歩を支えるための、ガイド、実行環境、演習を一体化した Common Lisp 学習プラットフォームです。  
構文ガイドで理解し、ブラウザ上ですぐ試し、問題演習で定着できます。  
初学者が迷わず始められ、中級入口まで継続して学べる導線を目指しています。  
サーバーサイドの処理は不要で、すべてフロントエンドのみで動作するため、無料のホスティングサービスに静的サイトとしてデプロイできます。

### 主な特長

- **学ぶ・試す・解くの一体化** — ガイド、エディタ、REPL、問題演習を一つのサイトで往復できる
- **日本語初学者向け導線** — 日本語 UI と説明で、最初の一歩から迷いにくい構成
- **ブラウザ内 Lisp インタプリタ** — サーバー不要、完全クライアントサイド実行
- **ブランドアイコンと独自UI** — Tree Tiered ベースのブランドマークと SVG icon system を採用
- **クロージャ対応** — レキシカルスコープ、高階関数、状態を持つクロージャ
- **主要ルート分離** — Home、問題一覧、学習詳細、エディタ、REPL を分けた導線設計
- **Lisp 構文ガイド** — 16セクションの包括的な Common Lisp リファレンス
- **Lisp 構文ハイライト** — キーワード・ビルトイン・文字列・コメントの色分け
- **バックグラウンド実行** — Web Worker によるUIブロックなし実行 + 10秒タイムアウト
- **コード永続化** — localStorage によるコード・選択中問題・解答済み問題の自動保存
- **学習パス** — 初学者向けの推奨順、次に学ぶ問題、カテゴリ別表示の切り替えに対応
- **イベント計測基盤** — 問題閲覧、検索、コード実行、REPL、CTA クリックを `trackEvent` 経由で一元計測し、内部 queue / `dataLayer` / GA4 に接続可能
- **価格ページ** — `/pricing` で Free / Standard / Supporter の差分を静的に比較できる
- **問い合わせ導線** — Header から `/contact` へ遷移でき、不具合報告と購入前の質問を公開前の一次窓口へ誘導できる
- **更新通知の仮登録** — Header / LearnPage から waitlist 導線へ進み、どこから登録意向が出たかを計測できる
- **問題モード** — カテゴリ別の学習問題（全66問） + 進捗ダッシュボード + 自動正答判定
- **REPL モード** — 1行ずつ式を評価、環境を引き継いだ対話的実行
- **フリーモード** — 自由にコードを書いて実験
- **日本語 UI / エラーメッセージ** — 日本語学習者に最適化

---

## ページ構成

| ルート | 役割 | 主な内容 |
|---|---|---|
| `/` | Home 画面 | 学習導線の入口。構文ガイド、問題一覧、フリーモードへの導線を表示 |
| `/problems` | 問題一覧ページ | カテゴリ別の問題カード一覧、進捗ダッシュボード、おすすめ問題導線 |
| `/learn`, `/learn/:slug` | 学習詳細ページ | 選択中の問題文、ヒント、解答表示、エディタ遷移 |
| `/guide` | 構文ガイドページ | Lisp 基本構文ガイドの通読導線 |
| `/editor` | エディタページ | コード実行、正答判定、結果表示 |
| `/repl` | REPL ページ | 1行ずつ評価する対話実行環境 |
| `/contact` | 問い合わせページ | 不具合報告と購入前質問の一次窓口 |
| `/pricing` | 価格ページ | Free / Standard / Supporter の差分案内 |

### Home 画面 (`/`)
```
┌─────────────────────────────────────────────────────────┐
│  Lisperpaw          [学習]  [エディタ]  [REPL]       │
├─────────────────────────────────────────────────────────┤
│  Lisperpaw へようこそ                                  │
│                                                         │
│  日本語で学び、すぐ試し、問題で定着できる              │
│                                                         │
│   1. 構文ガイドで理解する                               │
│   2. 問題で確かめる                                     │
│   3. エディタと REPL で試す                             │
│                                                         │
│  [はじめに構文ガイド] [問題から始める] [まずは試す]    │
└─────────────────────────────────────────────────────────┘
```

### 問題一覧ページ (`/problems`)
```
┌─────────────────────────────────────────────────────────┐
│  📚 問題一覧ページ                                      │
│  進捗とおすすめ問題を見ながら詳細ページへ進む          │
├─────────────────────────────────────────────────────────┤
│  総問題数 66 / 解いた問題 0 / 想定学習時間 約9時間50分  │
│  次のおすすめ: 1. 初めてのS式                          │
├─────────────────────────────────────────────────────────┤
│  基本構文                                                │
│  0/11 完了                                              │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │ 1. 初めてのS式│ │ 2. 変数の定義 │                      │
│  │ 初級 / 6分   │  │ 初級 / 6分   │                      │
│  │ [問題文を見る]│ │ [問題文を見る]│                      │
│  └──────────────┘  └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

### 学習詳細ページ (`/learn`, `/learn/:slug`, `/guide`)
```
┌─────────────────────────────────────────────────────────┐
│  Lisperpaw          [学習]  [エディタ]  [REPL]       │
├──────────┬──────────────────────────────────────────────┤
│ 📚 問題   │  Lisp 構文ガイド / 問題文                    │
│          │                                              │
│ ▸ 基本構文│  ■ 基本構文                                  │
│   初めて…│    S式、アトム、リスト...                    │
│   変数の…│  ■ 変数と束縛                                │
│ ▸ 条件分岐│    defvar, let, let*...                     │
│ ▸ リスト  │  ■ 関数定義                                  │
│ ▸ 高階関数│    defun, lambda...                         │
└──────────┴──────────────────────────────────────────────┘
```

### エディタページ (`/editor`)
```
┌─────────────────────────────────────────────────────────┐
│  Lisperpaw          [学習]  [エディタ]  [REPL]       │
├──────────────────────────┬──────────────────────────────┤
│  エディタ                │  実行結果                    │
│                          │                              │
│  (defun greet (name)     │  出力:                       │
│    (format nil ...))     │  "Hello, World!"             │
│                          │                              │
│  (print (greet ...))     │  戻り値:                     │
│                          │  "Hello, World!"             │
│        [▶ 実行]          │  ✓ 正解！                    │
└──────────────────────────┴──────────────────────────────┘
```

### REPL ページ (`/repl`)
```
┌─────────────────────────────────────────────────────────┐
│  Lisperpaw          [学習]  [エディタ]  [REPL]       │
├─────────────────────────────────────────────────────────┤
│  REPL                                                    │
│  > (+ 1 2 3)                                             │
│  6                                                       │
│                                                          │
│  履歴を保持したまま 1 行ずつ式を評価                    │
└─────────────────────────────────────────────────────────┘
```

### 問い合わせページ (`/contact`)

- 現時点の一次窓口として GitHub issue を案内
- 不具合報告と購入前の質問で CTA を分離し、それぞれ `contact_cta_clicked` として計測
- 個人情報や決済情報を載せないこと、即時返信や個別サポートは未対応であることを明示

### 価格ページ (`/pricing`)

- Header / LearnPage の CTA から遷移し、`pricing_page_viewed` を計測
- Free / Standard / Supporter の差分を静的に比較可能
- 決済未接続の段階では案内のみを表示し、購入前確認は `/contact` へ誘導

### 更新通知の仮登録

- Header / LearnPage から `waitlist_cta_clicked` を計測しつつ、現在は GitHub issue ベースの暫定 waitlist へ誘導
- GitHub issue を使う間は個人情報やメールアドレスを書かない前提で運用
- private form に切り替える場合は [index.html](index.html) の `meta[name="lisp-playground-waitlist-url"]` を差し替える

---

## 技術スタック

| レイヤー | 技術 | バージョン |
|----------|------|-----------|
| フレームワーク | React + TypeScript | 18.x / 5.x |
| ルーティング | react-router-dom (HashRouter) | 7.x |
| ビルドツール | Vite | 5.x |
| エディタ | CodeMirror 6 (via @uiw/react-codemirror) + Lisp構文ハイライト | 4.x |
| Lisp実行 | カスタムインタプリタ (TypeScript) + Web Worker | — |
| テスト | Vitest + Testing Library | 4.x / 16.x |
| スタイリング | Pure CSS | — |

---

## セットアップ

### 前提条件

- Node.js 20 または 22 を推奨
- npm 9+

### インストール

```bash
git clone <リポジトリURL>
cd LispEditerApp
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。
ポートが使用中の場合、Vite は `5174` など別ポートへ自動で切り替えます。

### 任意: GA4 計測設定

GA4 を有効にする場合は、`.env.local` に Measurement ID を設定します。

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

この値がある場合、起動時に `gtag.js` を読み込み、`trackEvent` で発火したイベントを GA4 event 形式でも送信します。
未設定でも内部 queue と `dataLayer` は維持されるため、ローカル開発や GTM 前提の検証は継続できます。

### プロダクションビルド

```bash
npm run build
```

`dist/` フォルダに静的ファイルが生成されます。

> **Windows ローカルビルド補足**: 現在の確認では、日本語パス配下そのものが主因ではなく、`Node.js 24` 環境で `vite build` が異常終了します。
> 同一ワークスペース、同一パスで `Node.js 20` と `Node.js 22` では build 成功を確認しています。
> `npx tsc -b` は `Node.js 24` でも通るため、問題は TypeScript ではなく Vite 本体の build 後段です。
> ローカル build は `Node.js 20` または `22` を使用してください。配布用の正規 build は GitHub Actions の `deploy` ブランチ経由、Node 22 実行を正経路とします。

### プレビュー

```bash
npm run preview
```

### テスト

```bash
# 全テストを1回実行
npm test

# ウォッチモード（ファイル変更時に自動再実行）
npm run test:watch

# V8 coverage レポートを再計測
npm run test:coverage

# Playwright による主要導線の E2E スモークテスト
npm run test:e2e
```

Vitest によるテストスイートが用意されています。

`npm run test:coverage` を実行すると、HTML レポートが `coverage/` に出力されます。
coverage の数値は実装進行で変動するため、必要な時点で `npm run test:coverage` を再実行して確認してください。

`npm run test:e2e` は Playwright の Chromium を使って、home / guide / problems / editor / repl の主要導線と REPL の基本実行フローを headless で確認します。
`npm test` は `src/**/*.{test,spec}.{ts,tsx}` 配下の Vitest スイートのみを対象にし、Playwright の E2E spec は `npm run test:e2e` に分離しています。

#### テスト構成

- `src/interpreter/__tests__/`: parser / evaluator / repl / security を含むインタプリタ中核の回帰
- `src/components/__tests__/`, `src/pages/__tests__/`, `src/__tests__/`: UI、ルーティング、localStorage 復元、ブランド表示の回帰
- `src/data/__tests__/`, `src/judge/__tests__/`, `src/utils/__tests__/`, `src/worker/__tests__/`, `src/editor/__tests__/`: problem loader、judge、analytics/storage、worker、syntax highlight の回帰
- `npm test` の直近フル実行実績は 2026-05-20 時点で **32 files / 611 tests passed**
- `npm run test:e2e` は主要導線のブラウザスモークテストを担当

---

## プロジェクト構造

```
LispEditerApp/
├── index.html                  # エントリーポイント / meta / favicon 参照
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── favicon.svg             # Tree Tiered ベースの favicon
├── src/
│   ├── App.tsx                 # ルーティング定義 (HashRouter)
│   ├── App.css / index.css     # グローバルスタイル
│   ├── main.tsx                # React マウント
│   ├── __tests__/              # App 全体の統合テスト
│   ├── components/             # Header / Icon / Editor / Problem UI
│   ├── config/
│   │   └── brand.ts            # ブランド名・title・description の定義
│   ├── content/
│   │   └── problems/           # problem.md / starter / solution / judge の外部問題資産
│   ├── data/                   # problem loader と UI 向け facade
│   ├── editor/                 # CodeMirror 拡張
│   ├── interpreter/            # Lisp インタプリタ本体
│   ├── judge/                  # 採点レイヤー
│   ├── pages/                  # Home / Learn / Editor / REPL などのページ
│   ├── utils/                  # analytics / storage / waitlist / siteMode
│   ├── worker/                 # Web Worker 実行基盤
│   └── types/                  # Problem / judge などの型定義
├── docs/
│   ├── CONVERSATION_HISTORY.md     # セッション単位の作業履歴
│   ├── REVIEW.md                   # コードレビュー・課題管理
│   ├── PRE_DEPLOY_CHECKLIST.md     # deploy 判定基準
│   ├── POST_DEPLOY_VERIFICATION.md # 公開後の確認ログ
│   └── IMPLEMENTATION_TASKS.md     # 実装バックログ
└── dist/                       # ビルド出力 (git管理外)
```


## 現在の制限事項

- `defmacro`、`macrolet` などのマクロ機能は未対応です。
- package system、CLOS、構造体、condition system、stream/file I/O などの Common Lisp 全機能は実装していません。
- `format` は `~A`, `~S`, `~D`, `~%`, `~~` を中心とした限定実装です。
- `executeLisp` の各呼び出しは独立しており、状態を引き継ぐのは REPL モードのみです。
- 学習サイトとして必要な主要機能を優先しているため、Common Lisp 完全互換は現時点の目標ではありません。

---

## 将来計画

Lisperpaw は、当面は静的配信を維持しながら、学習体験の完成度を高める方針です。
特に、英語圏の教材と総量で競うのではなく、日本語で Common Lisp を学び、すぐ試し、問題で定着できる学習体験を強めていきます。

### 短期

- 日本語初学者向けの導線改善
- ガイド、問題、エディタ、REPL を往復しやすい学習フローの強化
- 学習進捗の可視化と保存
- 問題やガイドの検索導線
- 再訪しやすくするブックマーク、復習、履歴系機能
- 学習サイトとしての信頼性向上と既知課題の整理

### 中期

- 認証、同期、商品導線の整備
- プレミアムコンテンツの管理と継続学習機能の追加
- 無料学習サイトから継続利用される学習プラットフォームへの移行

### 長期

- 現行のブラウザ内インタプリタは、Common Lisp 学習のための学習モードとして維持
- 将来的にバックエンド側で本物の Lisp 処理系を扱える条件が整った場合のみ、学習モードとは別の実処理系モードを検討
- この実処理系モードの検討は、バックエンド確保と学習プラットフォーム中核機能の完成後に着手

---

## 対応する Common Lisp 機能

### 特殊形式

| 形式 | 説明 | 例 |
|------|------|-----|
| `quote` / `'` | クォート | `'(1 2 3)` |
| `if` | 条件分岐 | `(if (> x 0) "positive" "non-positive")` |
| `cond` | 多分岐 | `(cond ((= x 1) "one") (t "other"))` |
| `when` / `unless` | 条件付き実行 | `(when (> x 0) (print x))` |
| `and` / `or` / `not` | 論理演算 | `(and t nil)` → `NIL` |
| `let` / `let*` | ローカル変数束縛 | `(let ((x 1)) x)` |
| `progn` | 逐次実行 | `(progn (print 1) (print 2))` |
| `setq` / `setf` | 代入 | `(setq x 42)` |
| `defvar` / `defparameter` | グローバル変数 | `(defvar *x* 10)` |
| `defun` | 関数定義 | `(defun add (a b) (+ a b))` |
| `lambda` | 無名関数 | `(lambda (x) (* x x))` |
| `funcall` / `apply` | 関数呼び出し | `(funcall #'+ 1 2)` |
| `function` / `#'` | 関数オブジェクト取得 | `#'car` |
| `dotimes` | 回数ループ | `(dotimes (i 10) (print i))` |
| `dolist` | リストループ | `(dolist (x '(1 2 3)) (print x))` |
| `loop` + `return` | 無限ループ | `(loop ... (return val))` |

### 組み込み関数

<details>
<summary>算術 (15関数)</summary>

`+`, `-`, `*`, `/`, `mod`, `abs`, `max`, `min`, `floor`, `ceiling`, `round`, `sqrt`, `expt`, `1+`, `1-`

</details>

<details>
<summary>比較 (11関数)</summary>

`=`, `/=`, `<`, `>`, `<=`, `>=`, `zerop`, `plusp`, `minusp`, `evenp`, `oddp`

</details>

<details>
<summary>等値 (3関数)</summary>

`eq`, `eql`, `equal`

</details>

<details>
<summary>型判定 (7関数)</summary>

`numberp`, `stringp`, `symbolp`, `listp`, `consp`, `atom`, `null`, `functionp`

</details>

<details>
<summary>リスト操作 (15関数)</summary>

`car`/`first`, `cdr`/`rest`, `second`, `third`, `nth`, `cons`, `list`, `append`, `length`, `reverse`, `last`, `member`, `remove`, `assoc`

</details>

<details>
<summary>高階関数 (7関数)</summary>

`mapcar`, `remove-if`, `remove-if-not`, `reduce`, `some`, `every`, `sort`

</details>

<details>
<summary>文字列 (7関数)</summary>

`concatenate`, `string-upcase`, `string-downcase`, `subseq`, `string=`, `write-to-string`, `parse-integer`

</details>

<details>
<summary>入出力 (4関数)</summary>

`print`, `princ`, `terpri`, `format`

</details>

---

## 問題の追加方法

問題データは [src/content/problems](src/content/problems) 配下の「1 問 1 フォルダ」構成で管理します。

詳細なテンプレートと運用ルールは [docs/PROBLEM_AUTHORING_GUIDE.md](docs/PROBLEM_AUTHORING_GUIDE.md) を参照してください。

1. [src/content/problems/manifest.json](src/content/problems/manifest.json) の `problemOrder` に問題 ID を追加する
2. [src/content/problems/basic-01/problem.md](src/content/problems/basic-01/problem.md) を雛形にして `src/content/problems/<id>/problem.md` を作る
3. 同じフォルダに `starter.lisp`, `solution.lisp`, `judge.json` を置く

`problem.md` は本文を Markdown で書き、先頭に YAML frontmatter を持たせます。

```yaml
---
id: list-06
slug: list-06
title: 要素数を数える
category: リスト操作
difficulty: beginner
estimatedMinutes: 8
learningGoals:
  - リスト操作
hint: length が使えます
draft: false
---

## リストの長さ

本文は Markdown で記述します。
```

`starter.lisp` は初期コード、`solution.lisp` は模範解答、`judge.json` は採点条件です。採点は `program` / `function` judge を使います。

補足:

- [src/data/problems.ts](src/data/problems.ts) は現在、外部コンテンツを読み込んで `order` / `learningPath` / `catalog` を付与する薄い facade です
- Learn 詳細 URL の canonical 形式は `/learn/<slug>` です
- legacy の `/learn/<id>` は後方互換で解決され、slug URL に正規化されます
- `slug` は他の問題の `id` / `slug` と衝突しない値を使います

### カテゴリの自動生成

`problem.md` の `category` frontmatter でグルーピングされます。新しいカテゴリ名を指定するだけで自動的にサイドバーに新セクションが追加されます。

---

## デプロイ

すべて **無料プラン** で対応可能な静的ホスティングサービスです。  
本アプリはサーバーサイド処理不要のため、ビルド成果物 (`dist/`) をそのまま配信できます。

### GitHub Pages（推奨）

GitHub Actions で自動デプロイする方式です。リポジトリに含まれる `.github/workflows/deploy.yml` がそのまま使えます。

1. GitHub にリポジトリを push
2. リポジトリの **Settings → Pages → Source** を **GitHub Actions** に変更
3. 通常開発は `main` ブランチで進める（`main` への push / PR は CI のみ実行）
4. 価格や金銭関連を含む変更では、`deploy` へ反映する前に [docs/PRE_DEPLOY_CHECKLIST.md](docs/PRE_DEPLOY_CHECKLIST.md) の必須項目を確認する
5. 公開したい commit を `deploy` ブランチへ反映して push すると、自動ビルド＆デプロイされる
6. 公開後の確認結果を [docs/POST_DEPLOY_VERIFICATION.md](docs/POST_DEPLOY_VERIFICATION.md) に残す

> **運用メモ**: 価格や課金まわりの未完成機能を main に積み上げても、`deploy` ブランチへ反映しない限り GitHub Pages には公開されません。

> **価格公開前メモ**: `/contact` の問い合わせ導線、価格文言、未接続の決済表現、計測導線を確認しないまま `deploy` へ push しないでください。判定基準は [docs/PRE_DEPLOY_CHECKLIST.md](docs/PRE_DEPLOY_CHECKLIST.md) にまとめています。

> **Note**: `vite.config.ts` の `base` は `'./'`（相対パス）のままで動作します。  
> サブディレクトリ配信（`https://user.github.io/repo/`）でも相対パスなら問題ありません。

### Cloudflare Pages

CDN・プレビューURL・アクセス解析が無料で使えるため、学習サイトとの相性が良いサービスです。

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. **Workers & Pages → Create → Pages → Connect to Git**
3. リポジトリを選択し、以下を設定:
   - **ビルドコマンド**: `npm run build`
   - **ビルド出力ディレクトリ**: `dist`
  - **Node.js バージョン**: 環境変数 `NODE_VERSION` = `20` または `22`
4. **Save and Deploy**

PR ごとにプレビュー URL が自動生成されるため、レビューが容易です。

### Vercel

1. [Vercel](https://vercel.com) でリポジトリをインポート
2. ビルドコマンド: `npm run build`、出力ディレクトリ: `dist`
3. デプロイ完了

### Netlify

1. [Netlify](https://www.netlify.com) でリポジトリをインポート
2. ビルドコマンド: `npm run build`、公開ディレクトリ: `dist`

---

## 開発ガイド

### インタプリタの拡張

新しい組み込み関数を追加するには、[src/interpreter/evaluator.ts](src/interpreter/evaluator.ts) の `createGlobalEnv` 関数内に追記します:

```typescript
defBuiltin('MY-FUNC', (args) => {
  // args[0], args[1] ... で引数にアクセス
  // 型チェックを行い、LispValue を返す
  if (args[0].type !== 'number') throw new Error('my-func: 数値が期待されます');
  return makeNumber(args[0].value * 2);
});
```

新しい特殊形式を追加するには、`evalList` 関数内の `switch (head.name)` に `case` を追加します。

---

## ライセンス

MIT License

---

## 貢献

Issue や Pull Request を歓迎します。問題データの追加も大歓迎です。
