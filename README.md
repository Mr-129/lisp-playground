# Lisp Playground - Common Lisp 学習環境

<p align="center">
  <strong>λ Lisp Playground</strong><br>
  ブラウザで動く Common Lisp インタプリタ付き学習サイト
</p>

---

## 概要

**Lisp Playground** は、ブラウザ上で Common Lisp のコードを入力・実行し、結果を確認できる学習プラットフォームです。  
サーバーサイドの処理は不要で、すべてフロントエンドのみで動作するため、無料のホスティングサービスに静的サイトとしてデプロイできます。

### 主な特長

- **ブラウザ内 Lisp インタプリタ** — サーバー不要、完全クライアントサイド実行
- **クロージャ対応** — レキシカルスコープ、高階関数、状態を持つクロージャ
- **主要ルート分離** — Home、問題一覧、学習詳細、エディタ、REPL を分けた導線設計
- **Lisp 構文ガイド** — 14セクションの包括的な Common Lisp リファレンス
- **Lisp 構文ハイライト** — キーワード・ビルトイン・文字列・コメントの色分け
- **バックグラウンド実行** — Web Worker によるUIブロックなし実行 + 10秒タイムアウト
- **コード永続化** — localStorage によるコード・選択中問題・解答済み問題の自動保存
- **問題モード** — カテゴリ別の学習問題（全38問） + 自動正答判定
- **REPL モード** — 1行ずつ式を評価、環境を引き継いだ対話的実行
- **フリーモード** — 自由にコードを書いて実験
- **日本語 UI / エラーメッセージ** — 日本語学習者に最適化

---

## ページ構成

| ルート | 役割 | 主な内容 |
|---|---|---|
| `/` | Home 画面 | 学習導線の入口。構文ガイド、問題一覧、フリーモードへの導線を表示 |
| `/problems` | 問題一覧ページ | カテゴリ別の問題カード一覧。問題文詳細ページへの入口 |
| `/learn` | 学習詳細ページ | 選択中の問題文、ヒント、解答表示、エディタ遷移 |
| `/guide` | 構文ガイドページ | Lisp 基本構文ガイドの通読導線 |
| `/editor` | エディタページ | コード実行、正答判定、結果表示 |
| `/repl` | REPL ページ | 1行ずつ評価する対話実行環境 |

### Home 画面 (`/`)
```
┌─────────────────────────────────────────────────────────┐
│  λ Lisp Playground    [学習]  [エディタ]  [REPL]       │
├─────────────────────────────────────────────────────────┤
│  λ Lisp Playground へようこそ                           │
│                                                         │
│   1. 構文ガイドを読む                                   │
│   2. 問題一覧から選ぶ                                   │
│   3. コードを書いて実行                                 │
│                                                         │
│  [📘 構文ガイドを読む] [📚 問題一覧を見る] [🖊️ フリー] │
└─────────────────────────────────────────────────────────┘
```

### 問題一覧ページ (`/problems`)
```
┌─────────────────────────────────────────────────────────┐
│  📚 問題一覧ページ                                      │
│  カテゴリごとに問題を選んで詳細ページに進む            │
├─────────────────────────────────────────────────────────┤
│  基本構文                                               │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │ 初めてのS式  │  │ 変数の定義   │                     │
│  │ 初級         │  │ 初級         │                     │
│  │ [問題文を見る]│  │ [問題文を見る]│                    │
│  └──────────────┘  └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

### 学習詳細ページ (`/learn`, `/guide`)
```
┌─────────────────────────────────────────────────────────┐
│  λ Lisp Playground    [学習]  [エディタ]  [REPL]       │
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
│  λ Lisp Playground    [学習]  [エディタ]  [REPL]       │
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
│  λ Lisp Playground    [学習]  [エディタ]  [REPL]       │
├─────────────────────────────────────────────────────────┤
│  REPL                                                    │
│  > (+ 1 2 3)                                             │
│  6                                                       │
│                                                          │
│  履歴を保持したまま 1 行ずつ式を評価                    │
└─────────────────────────────────────────────────────────┘
```

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
| スタイリング | Pure CSS (カスタムプロパティ) | — |

---

## セットアップ

### 前提条件

- Node.js 20+ 
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

### プロダクションビルド

```bash
npm run build
```

`dist/` フォルダに静的ファイルが生成されます。

> **Windows ローカルビルド補足**: 日本語パス配下では、`npm run build` と `npx vite build --debug` の双方が異常終了することを確認しています。
> `npx tsc -b` は通るため、ローカルでは型検査確認までは実施できます。
> 配布用の正規 build は GitHub Actions (`ubuntu-latest`) を利用してください。

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
```

Vitest によるテストスイートが用意されています。

`npm run test:coverage` を実行すると、HTML レポートが `coverage/` に出力されます。
2026-04-29 時点の coverage ベースラインは All files で Stmts 92.06 / Branch 81.85 / Funcs 97.66 / Lines 98.41 です。

#### インタプリタテスト (`src/interpreter/__tests__/`)

| テストファイル | 対象 | テスト数 |
|---|---|---|
| `types.test.ts` | LispValue ヘルパー関数 | 26 |
| `environment.test.ts` | レキシカルスコープ管理 | 9 |
| `parser.test.ts` | トークナイザ + パーサー | 23 |
| `evaluator.test.ts` | 評価器・特殊形式・ビルトイン・出力再束縛 | 149 |
| `integration.test.ts` | executeLisp E2E パイプライン | 25 |
| `repl.test.ts` | executeLispRepl 環境引き継ぎ | 8 |
| `security.test.ts` | 安全装置・仕様差分の回帰 | 13 |

#### UI / アプリ / 補助機能テスト (`src/components/__tests__/`, `src/pages/__tests__/`, `src/__tests__/`, `src/worker/__tests__/` ほか)

| テストファイル | 対象 | テスト数 |
|---|---|---|
| `Header.test.tsx` | ナビゲーションヘッダー | 15 |
| `Editor.test.tsx` | CodeMirror ラッパー・ショートカット | 7 |
| `OutputPanel.test.tsx` | 実行結果パネル | 7 |
| `ProblemList.test.tsx` | 問題一覧サイドバー | 5 |
| `ProblemView.test.tsx` | 問題表示・ヒント・解答・Markdown 分岐 | 14 |
| `LispGuide.test.tsx` | Lisp 構文ガイド | 16 |
| `App.test.tsx` | アプリ状態復元・進捗保存・ルーティング | 8 |
| `App.integration.test.tsx` | App ルーティング・ページ間状態連携 | 4 |
| `HomePage.test.tsx` | Home 画面導線 | 3 |
| `ProblemsPage.test.tsx` | 問題一覧ページ導線 | 6 |
| `LearnPage.test.tsx` | 学習ページ統合 | 13 |
| `EditorPage.test.tsx` | エディタページ統合 | 15 |
| `ReplPage.test.tsx` | REPLページ統合 | 18 |
| `problems.test.ts` | 問題データ整合性 | 89 |
| `storage.test.ts` | localStorage 永続化 | 19 |
| `lisp-language.test.ts` | Lisp 構文ハイライト | 13 |
| `worker.test.ts` | Worker 管理・フォールバック | 5 |
| `lisp-worker.test.ts` | Worker 本体メッセージ処理 | 2 |

| **合計** | | **512** |

---

## プロジェクト構造

```
LispEditerApp/
├── index.html                  # エントリーポイント
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx                # React マウント
│   ├── App.tsx                 # ルーティング定義 (HashRouter)
│   ├── App.css                 # グローバルスタイル
│   ├── index.css               # ベーススタイル
│   ├── __tests__/              # App 統合テスト
│   │   ├── App.test.tsx
│   │   └── App.integration.test.tsx
│   ├── test-setup.ts           # テスト初期化 (jest-dom)
│   ├── vite-env.d.ts
│   ├── types/
│   │   └── index.ts            # Problem 型定義
│   ├── interpreter/            # ★ Lisp インタプリタ
│   │   ├── index.ts            # 公開API (executeLisp, executeLispRepl)
│   │   ├── types.ts            # LispValue 型定義
│   │   ├── parser.ts           # レキサー + パーサー
│   │   ├── evaluator.ts        # 評価器 + 組み込み関数
│   │   ├── environment.ts      # 環境（スコープ）管理
│   │   └── __tests__/          # インタプリタ単体テスト
│   │       ├── types.test.ts
│   │       ├── environment.test.ts
│   │       ├── parser.test.ts
│   │       ├── evaluator.test.ts
│   │       ├── integration.test.ts
│   │       ├── repl.test.ts
│   │       └── security.test.ts
│   ├── editor/                 # CodeMirror 拡張
│   │   └── lisp-language.ts    # Lisp 構文ハイライト定義
│   ├── worker/                 # Web Worker
│   │   ├── index.ts            # Worker 管理・非同期実行API
│   │   ├── lisp-worker.ts      # Worker 本体
│   │   └── __tests__/          # Worker 単体テスト
│   ├── utils/                  # ユーティリティ
│   │   └── storage.ts          # localStorage 永続化
│   ├── pages/                  # ページコンポーネント
│   │   ├── HomePage.tsx        # Home 画面
│   │   ├── ProblemsPage.tsx    # 問題一覧ページ
│   │   ├── LearnPage.tsx       # 学習詳細ページ（問題 / ガイド）
│   │   ├── EditorPage.tsx      # エディタページ（実行環境）
│   │   ├── ReplPage.tsx        # REPLページ（対話式実行）
│   │   └── __tests__/          # ページ統合テスト
│   ├── components/             # React コンポーネント
│   │   ├── Header.tsx          # ナビゲーションヘッダー
│   │   ├── Editor.tsx          # CodeMirror エディタ
│   │   ├── LispGuide.tsx       # Lisp 構文ガイド
│   │   ├── OutputPanel.tsx     # 実行結果パネル
│   │   ├── ProblemList.tsx     # 問題一覧サイドバー
│   │   ├── ProblemView.tsx     # 問題説明・ヒント表示
│   │   └── __tests__/          # コンポーネント単体テスト
│   └── data/
│       ├── problems.ts         # 問題データ定義
│       └── __tests__/          # データ整合性テスト
├── docs/
│   ├── REVIEW.md               # コードレビュー・課題管理
│   ├── PLATFORM_STRATEGY.md    # プラットフォーム戦略
│   └── IMPLEMENTATION_TASKS.md # 実装バックログ
└── dist/                       # ビルド出力 (git管理外)
```


## 現在の制限事項

- `defmacro`、`macrolet` などのマクロ機能は未対応です。
- package system、CLOS、構造体、condition system、stream/file I/O などの Common Lisp 全機能は実装していません。
- `format` は `~A`, `~S`, `~D`, `~%`, `~~` を中心とした限定実装です。
- `executeLisp` の各呼び出しは独立しており、状態を引き継ぐのは REPL モードのみです。
- 学習サイトとして必要な主要機能を優先しているため、Common Lisp 完全互換は現時点の目標ではありません。

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

[src/data/problems.ts](src/data/problems.ts) に `Problem` オブジェクトを追加します。

```typescript
// src/data/problems.ts
{
  id: 'category-nn',           // ユニークID
  title: '問題タイトル',         // サイドバーに表示
  category: 'カテゴリ名',       // グループ分け
  difficulty: 'beginner',      // 'beginner' | 'intermediate' | 'advanced'
  description: `
## 解説タイトル

マークダウン形式で構文説明を記載。
\`\`\`lisp
(コード例)
\`\`\`

### 問題
ここに問題文を書く。
  `,
  hint: 'ヒントテキスト（省略可）',
  initialCode: '; エディタに表示される初期コード\n',
  expectedOutput: '期待する print 出力\n',     // 省略可
  expectedReturnValue: '期待する戻り値文字列',   // 省略可
  solution: '(模範解答コード)',
}
```

### カテゴリの自動生成

`category` フィールドでグルーピングされます。新しいカテゴリ名を指定するだけで自動的にサイドバーに新セクションが追加されます。

---

## デプロイ

すべて **無料プラン** で対応可能な静的ホスティングサービスです。  
本アプリはサーバーサイド処理不要のため、ビルド成果物 (`dist/`) をそのまま配信できます。

### GitHub Pages（推奨）

GitHub Actions で自動デプロイする方式です。リポジトリに含まれる `.github/workflows/deploy.yml` がそのまま使えます。

1. GitHub にリポジトリを push
2. リポジトリの **Settings → Pages → Source** を **GitHub Actions** に変更
3. `main` ブランチに push するたびに自動ビルド＆デプロイ

> **Note**: `vite.config.ts` の `base` は `'./'`（相対パス）のままで動作します。  
> サブディレクトリ配信（`https://user.github.io/repo/`）でも相対パスなら問題ありません。

### Cloudflare Pages

CDN・プレビューURL・アクセス解析が無料で使えるため、学習サイトとの相性が良いサービスです。

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. **Workers & Pages → Create → Pages → Connect to Git**
3. リポジトリを選択し、以下を設定:
   - **ビルドコマンド**: `npm run build`
   - **ビルド出力ディレクトリ**: `dist`
   - **Node.js バージョン**: 環境変数 `NODE_VERSION` = `20`
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
