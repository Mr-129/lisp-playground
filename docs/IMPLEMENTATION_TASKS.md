# Lisp Playground — 実装バックログ

**作成日**: 2026年4月21日  
**位置づけ**: 内部向け実装タスク一覧  
**関連文書**: [PLATFORM_STRATEGY.md](./PLATFORM_STRATEGY.md), [PROBLEM_ROADMAP_JP.md](./PROBLEM_ROADMAP_JP.md)

---

## 1. この文書の使い方

この文書は、戦略文書をそのまま実装可能な粒度まで落としたバックログである。

- タスクは基本的に上から順に実行する
- 各タスクは、対象ファイル、依存関係、完了条件を持つ
- 1回の実装では原則 1 タスクか、密接に結びついた 2 タスクまでを扱う
- 実装後は、テスト、ドキュメント、必要な UI 確認までを完了条件に含める

ステータスは次の 4 つで管理する。

- `todo`: 未着手
- `doing`: 実装中
- `done`: 完了
- `blocked`: 依存待ちまたは方針未決

---

## 2. 推奨実行順

最初の 11 タスクは、次の順番で進める。

| 順番 | ID | タスク | 理由 |
|---|---|---|---|
| 1 | T-001 | `#'` reader macro 対応 | 既存資料と実装の不一致を先に解消する |
| 2 | T-002 | 問題切替時の ProblemView 状態リーク修正 | 学習体験の信頼性を上げる |
| 3 | T-003 | Windows 日本語パス下の build 安定化確認 | 配信基盤の不安を潰す |
| 4 | T-004 | 対応機能・未対応機能の明文化 | 期待値コントロールを行う |
| 5 | T-101 | 解答済み問題の保存 | 再訪理由を作る最小機能 |
| 6 | T-102 | 学習進捗 UI | 進捗が見える状態にする |
| 7 | T-102A | 採点モデル設計 | 問題拡張前に判定基盤を固める |
| 8 | T-103 | 最近見た問題・ブックマーク | 継続利用を増やす |
| 9 | T-104 | 問題とガイドの検索 | 辞典としての価値を上げる |
| 10 | T-105 | 学習パスの導入 | 初学者の迷いを減らす |
| 11 | T-201 | 問題データの商品属性追加 | 有料導線の前提を整える |

---

## 3. Phase 0: 信頼性と立ち位置の固定化

### T-001 `#'` reader macro 対応

- **ステータス**: `done`
- **目的**: 問題文や説明で使われている `#'` 記法を実装と一致させる
- **対象ファイル**:
  - [src/interpreter/parser.ts](../src/interpreter/parser.ts)
  - [src/interpreter/__tests__/parser.test.ts](../src/interpreter/__tests__/parser.test.ts)
  - [src/interpreter/__tests__/integration.test.ts](../src/interpreter/__tests__/integration.test.ts)
- **依存関係**: なし
- **実装内容**:
  - `#'symbol` を `(function symbol)` 相当として解釈できるようにする
  - 必要なら tokenizer と parser の双方を修正する
  - 既存の `function` 特殊形式と整合性を取る
- **完了条件**:
  - `#'+` や `#'car` を含むコードが実行できる
  - テストを追加し、既存テストを壊さない

- **実施メモ**:
  - `src/interpreter/parser.ts` で `sharp-quote` token と `(FUNCTION ...)` 展開を確認済み
  - `parser.test.ts` と `integration.test.ts` に `#'` 回帰テストあり

### T-002 問題切替時の ProblemView 状態リーク修正

- **ステータス**: `done`
- **目的**: 問題を切り替えたときに hint / solution の表示状態が引き継がれないようにする
- **対象ファイル**:
  - [src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx)
  - [src/components/ProblemView.tsx](../src/components/ProblemView.tsx)
  - [src/components/__tests__/ProblemView.test.tsx](../src/components/__tests__/ProblemView.test.tsx)
- **依存関係**: なし
- **実装内容**:
  - 問題 ID 単位で state をリセットする
  - `key` 付与または state 初期化の責務を明確にする
- **完了条件**:
  - 問題 A で解答表示後、問題 B に切り替えると初期状態になる
  - テストで再現と修正を確認できる

- **実施メモ**:
  - `src/pages/LearnPage.tsx` の `ProblemView` に `key={selectedProblem.id}` を付与済み
  - `src/pages/__tests__/LearnPage.test.tsx` にリセット回帰テストを追加済み

### T-003 Windows 日本語パス下の build 安定化確認

- **ステータス**: `done`
- **目的**: ローカル build の不安定さを解消し、GitHub Pages 配信前提を強くする
- **対象ファイル**:
  - [package.json](../package.json)
  - [vite.config.ts](../vite.config.ts)
  - [.github/workflows](../.github/workflows) 内のデプロイ設定
  - [docs/REVIEW.md](./REVIEW.md)
- **依存関係**: なし
- **実装内容**:
  - Windows 日本語パスで build が落ちる原因を切り分ける
  - 必要なら script、Vite 設定、CI を調整する
  - 再現不能なら検証手順を記録する
- **完了条件**:
  - ローカルまたは CI で build の成功条件が明確になっている
  - 失敗が残る場合も、回避方法が文書化されている

- **実施メモ**:
  - 2026-04-30: Node 20 / 22 では同一ワークスペース・同一日本語パス配下でも `vite build` 成功を確認済み。安定運用対象は Node 20 / 22 とする
  - 2026-05-09: Node 24.13.0 で一度だけ `npm run build` が Windows 異常終了コード `0xC0000409` 相当で終了したが、その後の再検証では `npm run build` 5回、`npx vite build` 5回とも成功し、恒常再現しなかった
  - 2026-05-09: `npx tsc -b` は一貫して成功し、Windows Application log に `node.exe` の crash 記録や dump も見当たらなかったため、現時点では unsupported runtime 上の間欠的な環境要因として扱う
  - README / REVIEW に「ローカル Windows 日本語パスでは build が不安定であり、配布用 build は GitHub Actions を正経路とする」旨を記載済み
  - Node 24 対応の恒久修正は現時点では着手しない。再発時に dump / event log を追加取得して調査を再開する
  - 2026-04-29: `main` への push 後に GitHub Actions `Build & Deploy` の success を確認し、`https://mr-129.github.io/lisp-playground/` で公開を確認済み
  - 2026-04-29: 公開 URL 上で学習ページ → エディタ → REPL の主要導線スモークテストを実施し、結果を [POST_DEPLOY_VERIFICATION.md](./POST_DEPLOY_VERIFICATION.md) に記録済み
  - 2026-04-29: モバイルレイアウト修正の再デプロイ後、公開 URL 上で 390px / 320px 幅の学習ページ、エディタ、REPL を確認し、横方向オーバーフローが解消されたことを確認済み
  - 2026-04-29: `29c898a` の再デプロイ後、公開 URL 上で home 画面、問題一覧ページ、ヘッダーロゴの戻り導線、エディタからの問題一覧復帰導線を確認し、390px / 320px 幅でも問題ないことを確認済み
  - 2026-04-29: `cce86dd` の再デプロイ後、公開 URL 上で問題一覧ページのカード UI と CTA スタイルが他ページと同じデザインへ復旧していることを確認済み

### T-004 対応機能・未対応機能の明文化

- **ステータス**: `done`
- **目的**: 学習者の期待値を正しく制御する
- **対象ファイル**:
  - [README.md](../README.md)
  - [docs/REVIEW.md](./REVIEW.md)
  - [docs/PLATFORM_STRATEGY.md](./PLATFORM_STRATEGY.md)
- **依存関係**: T-001
- **実装内容**:
  - 現時点で対応している特殊形式、ビルトイン、制限事項を整理する
  - 未対応の Common Lisp 機能は明記する
  - 説明と実装の不一致を減らす
- **完了条件**:
  - README を読めば、できることとできないことが分かる
  - 問題やガイド内の記述が実装と矛盾しない

- **実施メモ**:
  - README に現在の制限事項と Windows ローカル build 補足を追加済み
  - REVIEW の既知バグ状況を最新実装へ更新済み

### T-005 エラーメッセージ改善の下調べ

- **ステータス**: `done`
- **目的**: 初学者の離脱要因を減らすため、改善余地の大きいエラーを特定する
- **対象ファイル**:
  - [src/interpreter/parser.ts](../src/interpreter/parser.ts)
  - [src/interpreter/evaluator.ts](../src/interpreter/evaluator.ts)
  - [src/components/OutputPanel.tsx](../src/components/OutputPanel.tsx)
- **依存関係**: なし
- **実装内容**:
  - 頻出エラー候補を洗い出す
  - どの形式なら補足メッセージを足せるか整理する
- **完了条件**:
  - 次タスクとして実装可能な改善候補が 5 件以上整理されている

- **調査結果**:
  1. **未定義変数 / 未定義関数**: `未定義の変数: ...` や `未定義の関数: ...` に、`defvar` / `defun` / `#'` の候補を補足できる
  2. **括弧未閉じ / 予期しない閉じ括弧**: `parser.ts` の行番号情報を利用して、「どの行付近を閉じ忘れたか」の補足を追加できる
  3. **型不一致**: `car`, `cdr`, `mapcar`, `string=` などで、期待型と実際の値を `printValue` 付きで返す余地がある
  4. **関数ではない値の呼び出し**: `${printValue(fn)} は関数ではありません` に、`#'` や `lambda` の使用例を足せる
  5. **安全装置系エラー**: 再帰深度超過、出力サイズ超過、無限ループ検出に「どう回避するか」の補足を足せる
  6. **reader macro / quote 系の誤用**: `#functionの引数が不正です` を、`#'symbol` か `(function symbol)` の形を示す文面へ改善できる

---

## 4. Phase 1: 継続利用の基盤づくり

### T-101 解答済み問題の保存

- **ステータス**: `done`
- **目的**: 問題を解いた記録を保存し、再訪理由を作る
- **対象ファイル**:
  - [src/utils/storage.ts](../src/utils/storage.ts)
  - [src/App.tsx](../src/App.tsx)
  - [src/pages/EditorPage.tsx](../src/pages/EditorPage.tsx)
  - [src/__tests__/App.test.tsx](../src/__tests__/App.test.tsx)
  - [src/utils/__tests__/storage.test.ts](../src/utils/__tests__/storage.test.ts)
- **依存関係**: なし
- **実装内容**:
  - 解答済み問題 ID の保存 API を storage に追加する
  - 正答時に solved 状態を更新する
  - 問題 ID が削除された場合の扱いを決める
- **完了条件**:
  - リロード後も解答済み状態が保持される
  - テストで保存と読込が検証される

- **実施メモ**:
  - `src/utils/storage.ts` に solved problem IDs の save/load API を追加済み
  - `src/App.tsx` で起動時に存在しない問題 ID を除外しつつ solved state を復元するように対応済み
  - `src/pages/EditorPage.tsx` で正答時のみ solved 状態を更新するように対応済み
  - `src/__tests__/App.test.tsx` と `src/utils/__tests__/storage.test.ts` で保存・復元・不正 ID 除外を検証済み
  - 2026-04-29: GitHub Pages 公開環境でも `basic-01` の正答後に `lisp-playground-problem-id`, `lisp-playground-code`, `lisp-playground-solved-problem-ids` が保存されることを確認済み
  - 2026-04-29: 公開環境で再読込後にエディタの現在問題表示、CodeMirror 内容、学習ページの選択中問題が復元されることを確認済み。詳細は [POST_DEPLOY_VERIFICATION.md](./POST_DEPLOY_VERIFICATION.md)

### T-102 学習進捗 UI

- **ステータス**: `done`
- **目的**: どこまで進んだかを一覧で見えるようにする
- **対象ファイル**:
  - [src/components/ProblemList.tsx](../src/components/ProblemList.tsx)
  - [src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx)
  - [src/App.css](../src/App.css)
  - [src/components/__tests__/ProblemList.test.tsx](../src/components/__tests__/ProblemList.test.tsx)
- **依存関係**: T-101
- **実装内容**:
  - solved 表示、カテゴリ別進捗、全体進捗を追加する
  - 未完了だけ表示する簡易フィルタを検討する
- **完了条件**:
  - 問題一覧上で完了状態が分かる
  - 進捗数値が実データと一致する

- **実施メモ**:
  - `src/pages/ProblemsPage.tsx` に全体進捗ダッシュボード、次のおすすめ問題、カテゴリ別完了数を追加済み
  - `src/components/ProblemList.tsx` と `src/components/ProblemView.tsx` で solved 表示、問題順、学習目標、想定学習時間を表示するよう更新済み
  - `src/App.tsx` から solved state を `ProblemsPage` / `LearnPage` へ受け渡し、`npm test` 通過と Node 22 での build 成功を確認済み

### T-102A 採点モデル設計

- **ステータス**: `done`
- **目的**: 問題拡張前に、採点方式を将来拡張しやすい形で整理する
- **対象ファイル**:
  - [src/types/index.ts](../src/types/index.ts)
  - [src/pages/EditorPage.tsx](../src/pages/EditorPage.tsx)
  - [src/components/OutputPanel.tsx](../src/components/OutputPanel.tsx)
  - [src/data/problems.ts](../src/data/problems.ts)
  - 新規 judge レイヤー
- **依存関係**: T-102
- **実装内容**:
  - 現行の `expectedOutput` / `expectedReturnValue` 比較の制約を整理する
  - `program` / `function` judge を軸にした採点モデルを定義する
  - visible / hidden test、互換レイヤー、段階移行方針を決める
- **完了条件**:
  - 今後の問題拡張で採用する採点モデルが文書化されている
  - 既存 51 問を壊さない移行方針が明文化されている

- **実施メモ**:
  - [PROBLEM_JUDGING_MODEL.md](./PROBLEM_JUDGING_MODEL.md) を追加し、judge 設定ベースへの移行方針を整理済み
  - 初期採用は `program` judge と `function` judge の 2 種類に限定し、互換レイヤー経由で既存 51 問を維持する方針を確定
  - `EditorPage` 直結の採点ロジックを将来的に `src/judge/` へ切り出す設計とした
  - `src/judge/` に `types.ts`, `compare.ts`, `legacy.ts`, `runJudge.ts` の初期実装を追加し、`EditorPage` から legacy 互換 judge を呼び出す基盤まで実装済み
  - `src/judge/__tests__/runJudge.test.ts` と `src/pages/__tests__/EditorPage.test.tsx` で judge 基盤と既存判定互換を確認済み
  - **2026-05-09 完了: 全 51 問の Legacy → Explicit judge 移行**
    - `src/data/problems.ts` の全問題から `expectedOutput` / `expectedReturnValue` を削除
    - 各問題に `judge.kind: 'program'`、`visible` ケース 1 件 + `hidden` ケース 1 件、`run.code: ''`、`expect.output.comparison: 'exact'` の構成を追加
    - 移行バッチ: basic 系 → binding 系 → cond 系 → loop 系 → list 系 → higher 系 → recursion 系 → closure 系 → scope/type/challenge 系 → string/math 系
    - `src/data/problems.ts` に `expectedOutput` / `expectedReturnValue` の残存が **0 件** であることを確認済み
    - `npm test -- --run src/data/__tests__/problems.test.ts` で 58/58 passed（全テスト通過）
    - 型エラー: なし

### T-103 最近見た問題とブックマーク
- **ステータス**: `done`
- **目的**: 中断と再開をしやすくする
- **対象ファイル**:
  - [src/utils/storage.ts](../src/utils/storage.ts)
  - [src/App.tsx](../src/App.tsx)
  - [src/components/ProblemList.tsx](../src/components/ProblemList.tsx)
  - [src/components/ProblemView.tsx](../src/components/ProblemView.tsx)
- **依存関係**: T-101, T-102A
- **実装内容**:
  - recently viewed の保存
  - bookmark の保存
  - 一覧からアクセスできる UI を追加
- **完了条件**:
  - 直近閲覧問題へ戻れる
  - 任意の問題をブックマークできる

- **実施メモ**:
  - `src/utils/storage.ts` に recently viewed / bookmarked problem IDs の save/load API を追加済み
  - `src/App.tsx` で selected problem 変更時に recent を先頭へ更新し、bookmark を toggle で永続化するよう対応済み
  - `src/components/ProblemList.tsx` に「最近見た問題」「★ ブックマーク」ショートカットを追加済み
  - `src/components/ProblemView.tsx` にブックマークトグル UI を追加済み
  - `src/__tests__/App.test.tsx`、`src/components/__tests__/ProblemList.test.tsx`、`src/components/__tests__/ProblemView.test.tsx`、`src/utils/__tests__/storage.test.ts` に回帰テストを追加済み
  - 2026-05-10: `npm test` 514 件通過、`npm run test:e2e` 3 件通過を確認済み

### T-104 問題とガイドの検索

- **ステータス**: `done`
- **目的**: 辞典としての価値を上げる
- **対象ファイル**:
  - [src/components/ProblemList.tsx](../src/components/ProblemList.tsx)
  - [src/components/LispGuide.tsx](../src/components/LispGuide.tsx)
  - [src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx)
  - [src/types/index.ts](../src/types/index.ts)
- **依存関係**: なし
- **実装内容**:
  - 問題タイトル、説明、カテゴリ、難易度で絞れる検索導線を作る
  - 構文ガイドの見出しやキーワードも検索対象に含める
  - 初期はクライアントサイド検索で実装する
- **完了条件**:
  - キーワードで問題やガイド項目を絞り込める
  - 検索結果から対象箇所へ遷移できる

- **実施メモ**:
  - `src/App.tsx` に検索 query / 選択中ガイドセクション state を追加し、`/learn` と `/guide` をまたいで検索状態を維持するよう対応済み
  - `src/pages/LearnPage.tsx` に検索入力とガイド検索結果ボタンを追加済み
  - `src/components/ProblemList.tsx` で問題タイトル、カテゴリ、難易度、説明、学習目標を対象に絞り込み対応済み
  - `src/components/LispGuide.tsx` にガイド索引ベースのセクション検索と、検索結果からのセクションジャンプを追加済み
  - `src/components/__tests__/ProblemList.test.tsx`、`src/components/__tests__/LispGuide.test.tsx`、`src/pages/__tests__/LearnPage.test.tsx` に検索回帰テストを追加済み
  - 2026-05-10: `npm test` 522 件通過、`npm run test:e2e` 3 件通過を確認済み

### T-105 学習パスの導入

- **ステータス**: `done`
- **目的**: 初学者が何から学ぶべきかを迷わないようにする
- **対象ファイル**:
  - [src/types/index.ts](../src/types/index.ts)
  - [src/data/problems.ts](../src/data/problems.ts)
  - [src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx)
  - [src/components/ProblemList.tsx](../src/components/ProblemList.tsx)
  - [src/data/__tests__/problems.test.ts](../src/data/__tests__/problems.test.ts)
  - [src/components/__tests__/ProblemList.test.tsx](../src/components/__tests__/ProblemList.test.tsx)
- **依存関係**: T-101, T-102
- **実装内容**:
  - 問題に path / order / prerequisites の概念を追加する
  - まず学ぶべき順序を UI で示す
  - 難易度だけでなく学習経路で見せる
- **完了条件**:
  - 初学者向けの推奨順が分かる
  - path に従った一覧表示ができる

- **実施メモ**:
  - `src/types/index.ts` に `learningPath` を追加し、`src/data/problems.ts` で全 51 問へ path / step / prerequisites を付与するよう対応済み
  - `src/data/problems.ts` に `getProblemsByLearningPath` を追加し、`getNextRecommendedProblem` を学習パスと prerequisite ベースへ更新済み
  - `src/components/ProblemList.tsx` で学習パス panel、次に学ぶ問題の表示、カテゴリ別 / 学習パス順の切り替えを追加済み
  - 検索中は学習パス panel も検索件数ベースの表示に切り替え、結果一覧との文脈ずれを防ぐよう対応済み
  - `src/data/__tests__/problems.test.ts` に path 整合性テスト、`src/components/__tests__/ProblemList.test.tsx` に学習パス UI の回帰テストを追加済み
  - 2026-05-10: `npm test -- src/data/__tests__/problems.test.ts src/components/__tests__/ProblemList.test.tsx src/pages/__tests__/ProblemsPage.test.tsx` で 79 件通過を確認済み

### T-106 REPL 履歴の永続化

- **ステータス**: `done`
- **目的**: REPL を一時的な遊び場ではなく継続的な学習の場にする
- **対象ファイル**:
  - [src/pages/ReplPage.tsx](../src/pages/ReplPage.tsx)
  - [src/utils/storage.ts](../src/utils/storage.ts)
  - [src/pages/__tests__/ReplPage.test.tsx](../src/pages/__tests__/ReplPage.test.tsx)
- **依存関係**: なし
- **実装内容**:
  - 入力履歴や直近セッションを localStorage に保存する
  - リロード時に再開できるようにする
- **完了条件**:
  - REPL の直近履歴が保持される
  - クリア時の挙動が明確である

- **実施メモ**:
  - `src/utils/storage.ts` に REPL セッション snapshot の save/load/clear API を追加済み
  - `src/pages/ReplPage.tsx` で履歴、入力履歴、入力中 draft を localStorage へ保存し、初期表示時に履歴を replay して REPL 環境を復元するよう対応済み
  - クリアボタンで画面上の履歴だけでなく保存済み session も削除するよう対応済み
  - `src/pages/__tests__/ReplPage.test.tsx` に reload 後の復元と clear 後の削除テストを追加済み
  - `src/utils/__tests__/storage.test.ts` に REPL session snapshot の保存・復元・削除テストを追加済み
  - `e2e/app-smoke.spec.ts` の REPL smoke を拡張し、reload 後の復元と clear 後の非復元を確認済み
  - 2026-05-10: `npm test` 529 件通過、`npm run test:e2e` 3 件通過を確認済み

---

## 5. Phase 1.5: 商品設計の前提づくり

### T-201 問題データに商品属性を追加

- **ステータス**: `todo`
- **目的**: 無料/有料/コースの区別を持てるデータ構造へ拡張する
- **対象ファイル**:
  - [src/types/index.ts](../src/types/index.ts)
  - [src/data/problems.ts](../src/data/problems.ts)
  - [src/data/__tests__/problems.test.ts](../src/data/__tests__/problems.test.ts)
- **依存関係**: T-105
- **実装内容**:
  - `tier`, `tags`, `courseId`, `pathOrder` などの属性を追加する
  - 既存 51 問に仮割当てを行う
- **完了条件**:
  - 全問題に商品設計用のメタデータが付与される
  - データ整合性テストが追加される

### T-202 コース単位の表示設計

- **ステータス**: `todo`
- **目的**: 問題一覧をコースやテーマ単位で見せられるようにする
- **対象ファイル**:
  - [src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx)
  - [src/components/ProblemList.tsx](../src/components/ProblemList.tsx)
  - [src/components/ProblemView.tsx](../src/components/ProblemView.tsx)
- **依存関係**: T-201
- **実装内容**:
  - コース単位の見出しと導線を追加する
  - 現在のカテゴリ表示との共存方法を決める
- **完了条件**:
  - カテゴリとコースの両軸で問題を見られる

### T-203 ロック済みコンテンツ UI の土台

- **ステータス**: `todo`
- **目的**: 課金前でも、有料候補コンテンツの存在を UI 上に示せるようにする
- **対象ファイル**:
  - [src/components/ProblemList.tsx](../src/components/ProblemList.tsx)
  - [src/components/ProblemView.tsx](../src/components/ProblemView.tsx)
  - [src/App.css](../src/App.css)
- **依存関係**: T-201
- **実装内容**:
  - `tier` に基づいた lock 表示を追加する
  - まだ課金を実装しない段階でも、表示だけ確認できるようにする
- **完了条件**:
  - 無料と有料候補が UI で区別できる
  - 誤って未実装課金導線に依存しない

---

## 6. Phase 2: 計測と導線整備

### T-301 イベント計測の抽象化

- **ステータス**: `todo`
- **目的**: 計測ツールに依存しないイベント送信層を作る
- **対象ファイル**:
  - [src/App.tsx](../src/App.tsx)
  - [src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx)
  - [src/pages/EditorPage.tsx](../src/pages/EditorPage.tsx)
  - [src/pages/ReplPage.tsx](../src/pages/ReplPage.tsx)
  - [src/utils](../src/utils)
- **依存関係**: T-101, T-104
- **実装内容**:
  - `trackEvent` のような薄いラッパーを作る
  - 問題閲覧、実行、正答、検索、REPL 利用をイベント化する
- **完了条件**:
  - 計測の呼び出し点がコード上で一貫している

### T-302 CTA と価格導線の追加

- **ステータス**: `todo`
- **目的**: 課金前の需要シグナルを測る
- **対象ファイル**:
  - [src/components/Header.tsx](../src/components/Header.tsx)
  - [src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx)
  - [src/App.tsx](../src/App.tsx)
- **依存関係**: T-301
- **実装内容**:
  - 将来の価格ページや待機リストへの導線を追加する
  - 学習体験を邪魔しない配置を設計する
- **完了条件**:
  - CTA のクリックが計測できる
  - 少なくとも 1 つの価格導線が存在する

### T-303 価格ページの静的実装

- **ステータス**: `todo`
- **目的**: 価格仮説を実際の導線として見えるようにする
- **対象ファイル**:
  - [src/App.tsx](../src/App.tsx)
  - [src/pages](../src/pages)
  - [src/components/Header.tsx](../src/components/Header.tsx)
  - [src/App.css](../src/App.css)
- **依存関係**: T-302
- **実装内容**:
  - `/pricing` 相当のページを追加する
  - Free / Standard / Supporter の差分を可視化する
  - 課金前は待機リストや通知登録でもよい
- **完了条件**:
  - 価格ページが公開できる
  - 価格ページ遷移率が測定可能になる

### T-304 メール獲得導線

- **ステータス**: `todo`
- **目的**: 課金前の見込みユーザーを蓄積する
- **対象ファイル**:
  - [src/components/Header.tsx](../src/components/Header.tsx)
  - [src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx)
  - [index.html](../index.html)
- **依存関係**: T-303
- **実装内容**:
  - 外部フォームまたは簡易登録導線をつなぐ
  - どこで登録したかが分かるように計測する
- **完了条件**:
  - メール登録導線が 1 つ以上存在する

---

## 7. Phase 3: 初回サブスク実験

### T-401 認証方式の決定とクライアント層追加

- **ステータス**: `blocked`
- **目的**: Firebase Auth か Supabase Auth のいずれかに統一する
- **対象ファイル**:
  - [src/App.tsx](../src/App.tsx)
  - [src/components/Header.tsx](../src/components/Header.tsx)
  - 新規 auth 関連ファイル
- **依存関係**: T-303, T-304
- **実装内容**:
  - 認証プロバイダ選定
  - ログイン状態管理の導入
- **完了条件**:
  - ログインとログアウトの基本導線が動く

### T-402 プレミアム権限モデル

- **ステータス**: `blocked`
- **目的**: Free / Standard / Supporter をコード上で扱えるようにする
- **対象ファイル**:
  - [src/types/index.ts](../src/types/index.ts)
  - [src/App.tsx](../src/App.tsx)
  - [src/components/ProblemList.tsx](../src/components/ProblemList.tsx)
- **依存関係**: T-401, T-201
- **実装内容**:
  - entitlement の型と判定ロジックを導入する
  - UI 上のロック、表示、案内文を切り替える
- **完了条件**:
  - ログイン状態とプラン状態に応じて UI が変わる

### T-403 有料コンテンツの外出し

- **ステータス**: `blocked`
- **目的**: 有料候補データを無料バンドルから切り離す
- **対象ファイル**:
  - [src/data/problems.ts](../src/data/problems.ts)
  - 新規 premium catalog 取得レイヤー
  - [src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx)
- **依存関係**: T-402
- **実装内容**:
  - 無料データとプレミアムデータの取得経路を分ける
  - 認証後のみプレミアムデータを取得できるようにする
- **完了条件**:
  - 無料 build にプレミアム本体を含めない構成になる

### T-404 課金導線の接続

- **ステータス**: `blocked`
- **目的**: 価格ページから実際の購入導線へつなぐ
- **対象ファイル**:
  - [src/pages](../src/pages)
  - [src/components/Header.tsx](../src/components/Header.tsx)
  - 新規 billing 連携ファイル
- **依存関係**: T-401, T-402
- **実装内容**:
  - Stripe Checkout または Lemon Squeezy の導線を接続する
  - 購入後に entitlement を反映する
- **完了条件**:
  - テスト環境で購入から権限反映までの導線が確認できる

---

## 8. いまは着手しないタスク

次は、現時点では backlog に置くが実行順の後ろに回す。

- ダーク / ライトテーマ
- PWA 対応
- ステップ実行デバッガ
- コード共有 URL
- バックエンドベースの実 Lisp 実行環境導入（現行の学習モードと分離し、バックエンド確保と学習プラットフォーム成立後に検討）
- 教育機関向けクラス管理
- ランキングや競争機能

---

## 9. 次に実行するべきタスク

次の実装対象は **T-201 問題データに商品属性を追加** とする。  
前回更新: 2026-05-10

理由は次の通り。

1. 学習パスで problem metadata の土台ができたため、次は商品属性を足してコース設計と収益導線の前提を揃える価値が高い
2. `src/types/index.ts` と `src/data/problems.ts` に metadata を追加する流れで、T-202 / T-203 の UI 設計へ自然につながる
3. 既存の solved / bookmark / path 導線を壊さずに、有料化やコース表示に必要な情報を先に整備できる
4. 問題本文や judge を増やさずにプロダクト設計の解像度を上げられるため、次の一手として費用対効果が高い

---

## 10. 全体進捗サマリー

最終更新: 2026-05-10

| Phase | タスク数 | 完了 | 進捗 |
|---|---|---|---|
| Phase 0: 信頼性・立ち位置 | 5 (T-001〜T-005) | 5 | 100% |
| Phase 1: 継続利用基盤 | 7 (T-101〜T-106, T-102A) | 7 | 100% |
| Phase 1.5: 商品設計前提 | 3 (T-201〜T-203) | 0 | 0% |
| Phase 2: 計測・導線整備 | 4 (T-301〜T-304) | 0 | 0% |
| Phase 3: 初回サブスク実験 | 4 (T-401〜T-404) | 0 (blocked) | 0% |
| **合計** | **23** | **12** | **52%** |

### 完了済みタスク一覧

| ID | タスク名 | 完了日 |
|---|---|---|
| T-001 | `#'` reader macro 対応 | 2026-04 |
| T-002 | 問題切替時の ProblemView 状態リーク修正 | 2026-04 |
| T-003 | Windows 日本語パス下の build 安定化確認 | 2026-04 |
| T-004 | 対応機能・未対応機能の明文化 | 2026-04 |
| T-005 | エラーメッセージ改善の下調べ | 2026-04 |
| T-101 | 解答済み問題の保存 | 2026-04 |
| T-102 | 学習進捗 UI | 2026-04 |
| T-102A | 採点モデル設計 + 全 51 問 Explicit judge 移行 | 2026-05-09 |
| T-103 | 最近見た問題とブックマーク | 2026-05-10 |
| T-104 | 問題とガイドの検索 | 2026-05-10 |
| T-105 | 学習パスの導入 | 2026-05-10 |
| T-106 | REPL 履歴の永続化 | 2026-05-10 |

### 未着手タスク（実施推奨順）

| 順番 | ID | タスク名 | 依存 |
|---|---|---|---|
| 1 | T-201 | 問題データに商品属性を追加 | T-105 |
| 2 | T-202 | コース単位の表示設計 | T-201 |
| 3 | T-203 | ロック済みコンテンツ UI の土台 | T-201 |
| 4 | T-301 | イベント計測の抽象化 | T-101, T-104 |
| 5 | T-302 | CTA と価格導線の追加 | T-301 |
| 6 | T-303 | 価格ページの静的実装 | T-302 |
| 7 | T-304 | メール獲得導線 | T-303 |
| — | T-401〜T-404 | 認証・課金・有料コンテンツ | T-303, T-304（blocked） |

### 採点モデル移行の完了状況（T-102A サブ項目）

全 51 問が Explicit judge 形式へ移行済み。`expectedOutput` / `expectedReturnValue` の残存は 0 件。

| カテゴリ | 問題数 | 移行完了 |
|---|---|---|
| 基本構文 | 7 | ✅ |
| 条件分岐 | 4 | ✅ |
| 数値計算 | 3 | ✅ |
| 文字列操作 | 4 | ✅ |
| リスト操作 | 7 | ✅ |
| ループ | 4 | ✅ |
| 高階関数 | 8 | ✅ |
| 再帰 | 5 | ✅ |
| クロージャ | 3 | ✅ |
| スコープ | 2 | ✅ |
| 型判定 | 1 | ✅ |
| 総合問題 | 3 | ✅ |
| **合計** | **51** | **✅ 全件** |