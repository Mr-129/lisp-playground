# Lisp Playground — 実装バックログ

**作成日**: 2026年4月21日  
**位置づけ**: 内部向け実装タスク一覧  
**関連文書**: [PLATFORM_STRATEGY.md](./PLATFORM_STRATEGY.md), [PROBLEM_ROADMAP_JP.md](./PROBLEM_ROADMAP_JP.md), [LEARNING_COVERAGE_GAPS.md](./LEARNING_COVERAGE_GAPS.md), [PROBLEM_CONTENT_EXTERNALIZATION_PLAN.md](./PROBLEM_CONTENT_EXTERNALIZATION_PLAN.md)

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
  - 2026-05-09: Node 24.13.0 で一度だけ `npm run build` が Windows 異常終了コード `0xC0000409` 相当で終了したが、その後の再検証では `npm run build` 5回、`npx vite build` 5回とも成功した
  - 2026-05-10: 追加検証で、Windows 環境の Node 24.13.0 では `npm run build` が `EXIT=-1073740791` で再度異常終了し、`npx tsc -b` は成功、同じワークスペースを一時 Node 22.22.2 で実行した `vite build` は成功した。現時点では unsupported runtime 上の環境依存事象として扱う
  - 2026-05-10: GitHub Pages workflow は `deploy` ブランチ push 時のみ公開を実行し、`main` の push / PR は CI のみとする運用へ変更。Actions の Node 版数も 22 に固定
  - 2026-05-14: `deploy-github-pages` job は `github-pages` environment の branch policy も通過条件になることを確認。run `#36` は attempt 1 で `Branch "deploy" is not allowed to deploy to github-pages due to environment protection rules.` により reject されたが、environment 側に `deploy` を許可したあと attempt 2 で success した。詳細な切り分けと復旧手順はローカルの個人用 runbook へ分離した
  - README / REVIEW に「ローカル Windows 日本語パスでは build が不安定であり、配布用 build は GitHub Actions の `deploy` ブランチ経由を正経路とする」旨を記載済み
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

- **ステータス**: `done`
- **目的**: 無料/有料/コースの区別を持てるデータ構造へ拡張する
- **対象ファイル**:
  - [src/types/index.ts](../src/types/index.ts)
  - [src/data/problems.ts](../src/data/problems.ts)
  - [src/data/__tests__/problems.test.ts](../src/data/__tests__/problems.test.ts)
- **依存関係**: T-105
- **実装内容**:
  - `catalog` に `tier`, `tags`, `courseId`, `courseOrder` をまとめて追加する
  - 既存 51 問に仮割当てを行う
- **完了条件**:
  - 全問題に商品設計用のメタデータが付与される
  - データ整合性テストが追加される

- **実施メモ**:
  - `src/types/index.ts` に `ProblemTier`, `ProblemCourseId`, `ProblemTag`, `ProblemCatalogInfo` を追加し、商品属性を `catalog` に集約済み
  - `src/data/problems.ts` で全 51 問へ `catalog` を自動付与し、`tier` は初級=`free`、中級以上=`standard` として仮割当て済み
  - `courseId` は `intro-core` / `data-and-control` / `functional-patterns` の 3 コースに整理し、`courseOrder` をコース単位の連番で生成するよう対応済み
  - `tags` はカテゴリ起点の制御語彙に限定し、将来のフィルタやコース整理へ流用できる形に整理済み
  - 既存の `Problem` モックへの影響を広げないため、型上の `catalog` は optional に保ちつつ、`problems` 実データ側では全件付与をテストで担保済み
  - `src/data/__tests__/problems.test.ts` に商品属性の最小セット、`courseOrder` 連番、`tier` 割当ての整合性テストを追加済み
  - 2026-05-10: `npm test -- src/data/__tests__/problems.test.ts` で 65 件通過を確認済み

### T-202 コース単位の表示設計

- **ステータス**: `done`
- **目的**: 問題一覧をコースやテーマ単位で見せられるようにする
- **対象ファイル**:
  - [src/data/problems.ts](../src/data/problems.ts)
  - [src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx)
  - [src/components/ProblemList.tsx](../src/components/ProblemList.tsx)
  - [src/App.css](../src/App.css)
- **依存関係**: T-201
- **実装内容**:
  - `src/data/problems.ts` に `PROBLEM_COURSES` と `getProblemsByCourse()` を追加し、コース見出しの元データを一本化
  - `src/components/ProblemList.tsx` に「学習パス順 / コース別 / カテゴリ別」の 3 モード切替を追加
  - `src/pages/LearnPage.tsx` に選択中問題のコースカードを追加し、コース内位置、完了数、次の一問を表示
  - `src/components/__tests__/ProblemList.test.tsx` と `src/pages/__tests__/LearnPage.test.tsx` に回帰テストを追加
  - 2026-05-10: `npm test` 540 件通過、`npm run test:e2e` 3 件通過を確認済み
- **完了条件**:
  - カテゴリとコースの両軸で問題を見られる
  - 学習ページ上で現在のコース文脈が確認できる

### T-203 ロック済みコンテンツ UI の土台

- **ステータス**: `done`
- **目的**: 課金前でも、有料候補コンテンツの存在を UI 上に示せるようにする
- **対象ファイル**:
  - [src/components/ProblemList.tsx](../src/components/ProblemList.tsx)
  - [src/components/ProblemView.tsx](../src/components/ProblemView.tsx)
  - [src/App.css](../src/App.css)
- **依存関係**: T-201
- **実装内容**:
  - `ProblemList` に `Free / Standard` バッジと standard 問題向けの lock 表示を追加
  - `ProblemView` に tier chip と standard preview note を追加し、未実装課金導線に依存せず有料候補を説明
  - `src/components/__tests__/ProblemList.test.tsx` と `src/components/__tests__/ProblemView.test.tsx` に free / standard 表示差分の回帰テストを追加
  - 2026-05-10: `npm test` 543 件通過、`npm run test:e2e` 3 件通過を確認済み
- **完了条件**:
  - 無料と有料候補が UI で区別できる
  - 誤って未実装課金導線に依存しない

---

## 6. Phase 2: 計測と導線整備

### T-301 イベント計測の抽象化

- **ステータス**: `done`
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
  - ブラウザ標準イベント / `dataLayer` / 内部 queue のいずれにも接続できる状態になっている

- **実施メモ**:
  - [src/utils/analytics.ts](../src/utils/analytics.ts) を追加し、trackEvent から internal queue / CustomEvent / dataLayer / gtag へ配信できるよう対応済み
  - [src/App.tsx](../src/App.tsx)、[src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx)、[src/pages/EditorPage.tsx](../src/pages/EditorPage.tsx)、[src/pages/ReplPage.tsx](../src/pages/ReplPage.tsx) の主要行動を計測対象に追加済み
  - 2026-05-10: `npm test` 546 件通過、`npm run test:e2e` 3 件通過を確認済み

### T-302 CTA と価格導線の追加

- **ステータス**: `done`
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
  - GA4 Measurement ID を設定した場合に `gtag` でも CTA click を送信できる

- **実施メモ**:
  - [src/components/Header.tsx](../src/components/Header.tsx) に Standard 案内 CTA、[src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx) に CTA banner / empty state CTA、[src/App.tsx](../src/App.tsx) に pricing guide modal を追加済み
  - CTA click は pricing_cta_clicked として placement / selected problem context 付きで計測し、GA4 Measurement ID 設定時は gtag にも送信済み
  - 2026-05-10: `npm test` 553 件通過、`npm run test:e2e` 3 件通過を確認済み。公開は `deploy` ブランチへ反映するまで保留される

### T-302A 問い合わせ導線の整備

- **ステータス**: `done`
- **目的**: 不具合報告や購入前の確認先を公開前に明示し、価格導線より先にサポートの受け皿を作る
- **対象ファイル**:
  - [src/components/Header.tsx](../src/components/Header.tsx)
  - [src/pages/ContactPage.tsx](../src/pages/ContactPage.tsx)
  - [src/App.tsx](../src/App.tsx)
  - [src/utils/analytics.ts](../src/utils/analytics.ts)
  - [src/App.css](../src/App.css)
  - [README.md](../README.md)
- **依存関係**: T-302
- **実装内容**:
  - 公開サイトから辿れる問い合わせ導線を 1 つ以上追加する
  - 不具合報告と購入前問い合わせの用途が分かる案内文を用意する
  - どの導線から問い合わせへ進んだかを計測できるようにする
- **完了条件**:
  - 少なくとも 1 つの公開ルートから問い合わせ先に到達できる
  - 問い合わせの用途と返信期待値が文言で明示される
  - 問い合わせ導線 click が計測できる

- **実施メモ**:
  - [src/components/Header.tsx](../src/components/Header.tsx) に `/contact` 遷移ボタンを追加し、header からの導線を `contact_cta_clicked` として計測するよう更新済み
  - [src/pages/ContactPage.tsx](../src/pages/ContactPage.tsx) を追加し、不具合報告と購入前問い合わせを GitHub issue の暫定窓口へ分岐して案内、返信期待値と公開前の注意書きを明示済み
  - 2026-05-10: `npm test` 558 件通過を確認済み。次は T-302B で deploy 前 checklist を整備する

### T-302B 価格公開前チェックリスト整備

- **ステータス**: `done`
- **目的**: 価格や金銭関連の導線を `deploy` ブランチへ反映してよい条件を明文化し、公開判断を属人化させない
- **対象ファイル**:
  - [docs/POST_DEPLOY_VERIFICATION.md](./POST_DEPLOY_VERIFICATION.md)
  - [docs/PRE_DEPLOY_CHECKLIST.md](./PRE_DEPLOY_CHECKLIST.md)
  - [docs/REVIEW.md](./REVIEW.md)
  - [README.md](../README.md)
- **依存関係**: T-302A
- **実装内容**:
  - 価格公開前に確認すべき項目を checklist 化する
  - `deploy` ブランチへ反映してよい条件を明文化する
  - 問い合わせ導線、価格文言、決済未接続時の扱い、公開対象範囲を確認項目に含める
- **完了条件**:
  - deploy 前に確認すべき項目が文書化されている
  - 問い合わせ導線の存在確認が checklist に含まれる
  - 金銭関連を公開してよい判断基準が明確になっている

- **実施メモ**:
  - [docs/PRE_DEPLOY_CHECKLIST.md](./PRE_DEPLOY_CHECKLIST.md) を追加し、問い合わせ導線、価格文言、決済未接続時の扱い、計測、テスト、docs 同期を `deploy` 前の必須項目として明文化済み
  - [README.md](../README.md) の GitHub Pages 手順に checklist 確認と公開後ログ更新を追加し、[docs/POST_DEPLOY_VERIFICATION.md](./POST_DEPLOY_VERIFICATION.md) は公開後ログであることを明記済み
  - 2026-05-10: docs-only 変更のため追加テストは不要。次は T-303 で価格ページ本体の静的実装へ進む

### T-303 価格ページの静的実装

- **ステータス**: `done`
- **目的**: 価格仮説を実際の導線として見えるようにする
- **対象ファイル**:
  - [src/App.tsx](../src/App.tsx)
  - [src/pages/PricingPage.tsx](../src/pages/PricingPage.tsx)
  - [src/components/Header.tsx](../src/components/Header.tsx)
  - [src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx)
  - [src/utils/analytics.ts](../src/utils/analytics.ts)
  - [src/App.css](../src/App.css)
- **依存関係**: T-302A, T-302B
- **実装内容**:
  - `/pricing` 相当のページを追加する
  - Free / Standard / Supporter の差分を可視化する
  - 課金前は待機リストや通知登録でもよい
- **完了条件**:
  - 価格ページが公開できる
  - 価格ページ遷移率が測定可能になる

- **実施メモ**:
  - [src/pages/PricingPage.tsx](../src/pages/PricingPage.tsx) を追加し、Free / Standard / Supporter の差分を静的表示
  - [src/App.tsx](../src/App.tsx) は modal 方式を廃止し、Header / LearnPage CTA から `/pricing` route へ遷移する構成へ変更
  - `pricing_page_viewed` を追加し、`from` パラメータ（header / learn_empty / learn_problem / direct）付きで到達計測を実装
  - 2026-05-10: `npm test` 561 件、`npm run test:e2e` 3 件通過を確認。次は T-304 メール獲得導線へ進む
  - 2026-05-12: 実装レビューで LearnPage の価格案内文言を `/pricing` 公開済みの表現へ同期し、`main` push は CI のみ / Pages 配信は `deploy` push のみである運用を再確認

### T-304 メール獲得導線

- **ステータス**: `done`
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

- **実施メモ**:
  - [index.html](../index.html) に `meta[name="lisp-playground-waitlist-url"]` を追加し、waitlist の遷移先をコードから切り離して設定可能にした
  - 現在の暫定導線は GitHub issue ベースとし、[src/components/Header.tsx](../src/components/Header.tsx) と [src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx) から `waitlist_cta_clicked` を placement 付きで計測する構成を追加した
  - GitHub issue を waitlist に使う間は個人情報やメールアドレスを書かせない運用に固定し、private form が用意できたら meta URL の差し替えだけで移行できるようにした
  - 2026-05-12: `npm test` 564 件、`npm run test:e2e` 3 件の通過を確認。Phase 2 は 6/6 完了

---

## 7. Phase 3: 初回サブスク実験

### T-401 認証方式の決定とクライアント層追加

- **ステータス**: `blocked`
- **目的**: Firebase Auth か Supabase Auth のいずれかに統一する
- **判断資料**: [AUTH_PROVIDER_COMPARISON.md](./AUTH_PROVIDER_COMPARISON.md)
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

## 8. Phase 4: 学習コンテンツ拡張

この phase は、Phase 3 の認証 / 課金判断と独立に進める。学習サイトとしての密度不足を解消するための、コンテンツ拡張トラックとして扱う。

### T-501 評価モデルと quote 系の補強

- **ステータス**: `done` (2026-05-14)
- **目的**: `quote` / `#'` / `function` / `funcall` / `apply` と symbol 評価のつながりを説明と演習の両方で補強する
- **判断資料**: [T501_QUOTE_EVALUATION_PLAN.md](./T501_QUOTE_EVALUATION_PLAN.md)
- **対象ファイル**:
  - [src/components/LispGuide.tsx](../src/components/LispGuide.tsx)
  - [src/components/__tests__/LispGuide.test.tsx](../src/components/__tests__/LispGuide.test.tsx)
  - [src/data/problems.ts](../src/data/problems.ts)
  - [src/data/__tests__/problems.test.ts](../src/data/__tests__/problems.test.ts)
  - [src/pages/__tests__/LearnPage.test.tsx](../src/pages/__tests__/LearnPage.test.tsx)
- **依存関係**: T-104, T-102A
- **実装内容**:
  - ガイドに「評価されるもの / 評価させないもの」の説明を追加する
  - `quote`、`#'`、`function`、`funcall`、`apply`、symbol の評価をつなぐ具体例を追加する
  - `quote` 系の典型的なつまずきを扱う問題を 6 から 8 問追加する
  - 新規ガイド節と問題が検索導線に自然に乗ることを確認する
- **完了条件**:
  - ガイドだけで `quote` と通常評価の違いが説明できる
  - Explicit judge 付きの新規問題が 6 問以上追加されている
  - ガイド表示、問題データ、学習導線に対するテストが追加されている
- **完了メモ**:
  - `guide-evaluation` と `guide-lambda` に評価モデルと関数オブジェクトの説明を追加済み
  - `basic-quote-02` から `basic-quote-05`、`function-apply-02` から `function-dispatch-01` までの 8 問を追加済み
  - `problems` / `LispGuide` / `LearnPage` の局所テストで導線と検索を確認済み
  - 2026-05-14: GitHub Actions run `#36` attempt 2 の success と公開 Learn ページの当時の `進捗 0/59` を確認し、59 問版の反映を確認済み。ローカル回帰として `npm test -- --run` 578 件通過を再確認

### T-502 tree / association list / property list 問題群の追加

- **ステータス**: `done` (2026-05-17)
- **目的**: 平坦な list 中心の学習から、Lisp らしいネストデータ処理へ進める
- **対象ファイル**:
  - [src/components/LispGuide.tsx](../src/components/LispGuide.tsx)
  - [src/components/__tests__/LispGuide.test.tsx](../src/components/__tests__/LispGuide.test.tsx)
  - src/content/problems/**
  - [src/data/__tests__/problems.test.ts](../src/data/__tests__/problems.test.ts)
  - [src/pages/__tests__/LearnPage.test.tsx](../src/pages/__tests__/LearnPage.test.tsx)
- **依存関係**: T-501, T-102A, T-604
- **実装内容**:
  - ガイドに tree、ネストリスト走査、`assoc`、property list 的なデータの見方を追加する
  - tree 再帰、設定表参照、変換処理を扱う問題を 6 から 8 問追加する
  - 新規問題は外部化後の問題フォルダ形式で追加する
  - 必要ならカテゴリや learning path の配置を見直す
- **完了条件**:
  - ネストデータを扱う新規問題が 6 問以上追加されている
  - `assoc` を使う代表例がガイドと問題の両方に存在する
  - 問題一覧と LearnPage 上で新規問題群が自然に辿れる
- **完了メモ**:
  - `guide-tree-data` を追加し、ネストリスト、tree 再帰、`assoc`、property list 的データの説明を [src/components/LispGuide.tsx](../src/components/LispGuide.tsx) に反映済み
  - `list-tree-01`、`list-assoc-02`、`list-assoc-03`、`list-plist-01`、`recursion-tree-01`、`recursion-tree-02`、`recursion-tree-03` の 7 問を externalized problem 形式で追加済み
  - [src/content/problems/manifest.json](../src/content/problems/manifest.json) に順序を追加し、[src/data/__tests__/problems.test.ts](../src/data/__tests__/problems.test.ts) と [src/pages/__tests__/LearnPage.test.tsx](../src/pages/__tests__/LearnPage.test.tsx) に導線確認を追加済み
  - 2026-05-17: `npm test -- --run src/data/__tests__/problemContentLoader.test.ts src/data/__tests__/problems.test.ts src/components/__tests__/LispGuide.test.tsx src/pages/__tests__/LearnPage.test.tsx` で 138 件通過を確認済み

### T-503 等価性・述語・型分岐の強化

- **ステータス**: `todo`
- **目的**: `eq` / `eql` / `equal`、`nil`、truthiness、述語関数の使い分けを曖昧なままにしない
- **対象ファイル**:
  - [src/components/LispGuide.tsx](../src/components/LispGuide.tsx)
  - [src/components/__tests__/LispGuide.test.tsx](../src/components/__tests__/LispGuide.test.tsx)
  - src/content/problems/**
  - [src/data/__tests__/problems.test.ts](../src/data/__tests__/problems.test.ts)
  - [src/pages/__tests__/LearnPage.test.tsx](../src/pages/__tests__/LearnPage.test.tsx)
- **依存関係**: T-501, T-604
- **実装内容**:
  - ガイドに等価性比較の違いと、典型的に迷いやすいケースを追加する
  - 述語関数、型判定、真偽値分岐の判断問題を 4 から 6 問追加する
  - 新規問題は外部化後の問題フォルダ形式で追加する
  - `nil`、空リスト、真値の扱いで誤答しやすいケースを含める
- **完了条件**:
  - ガイドに `eq` / `eql` / `equal` の比較表か使い分け説明がある
  - 新規問題が 4 問以上追加されている
  - 既存の比較 / 述語セクションと重複せず、判断基準が明示されている

### T-504 束縛・状態更新・closure 問題群の拡張

- **ステータス**: `todo`
- **目的**: `let` / `let*` / `setf` / closure の関係を「状態がどこで変わるか」という観点で理解しやすくする
- **対象ファイル**:
  - [src/components/LispGuide.tsx](../src/components/LispGuide.tsx)
  - [src/components/__tests__/LispGuide.test.tsx](../src/components/__tests__/LispGuide.test.tsx)
  - src/content/problems/**
  - [src/data/__tests__/problems.test.ts](../src/data/__tests__/problems.test.ts)
  - [src/pages/__tests__/LearnPage.test.tsx](../src/pages/__tests__/LearnPage.test.tsx)
- **依存関係**: T-501, T-604
- **実装内容**:
  - ガイドに lexical scope、再束縛、状態更新、closure の保持する環境を説明する節を追加する
  - `let*`、`setf`、カウンタ、蓄積器、状態付き closure の問題を 5 から 6 問追加する
  - 新規問題は外部化後の問題フォルダ形式で追加する
  - 誤解しやすい「外側の変数が変わるのか / 新しい束縛なのか」を問題文に含める
- **完了条件**:
  - 新規問題が 5 問以上追加されている
  - ガイドに scope と closure の関係を説明する具体例がある
  - 学習者が状態更新の意図を読み取りやすい問題文になっている

### T-505 読解・デバッグ・修正型演習の導入

- **ステータス**: `todo`
- **目的**: 新規実装だけでなく、既存コードを読んで原因を見つけて直す練習を導入する
- **対象ファイル**:
  - [src/types/index.ts](../src/types/index.ts)
  - [src/components/ProblemView.tsx](../src/components/ProblemView.tsx)
  - [src/components/__tests__/ProblemView.test.tsx](../src/components/__tests__/ProblemView.test.tsx)
  - [src/pages/EditorPage.tsx](../src/pages/EditorPage.tsx)
  - [src/pages/__tests__/EditorPage.test.tsx](../src/pages/__tests__/EditorPage.test.tsx)
  - src/content/problems/**
  - [src/data/__tests__/problems.test.ts](../src/data/__tests__/problems.test.ts)
- **依存関係**: T-501, T-502, T-503, T-504, T-102A, T-604
- **実装内容**:
  - 現在の問題モデルで不足があれば、読解 / デバッグ / 修正型演習を表現する最小メタデータを追加する
  - バグ修正、出力差分原因の特定、エラーメッセージ読解を扱う問題を 6 から 10 問追加する
  - 新規問題は外部化後の問題フォルダ形式で追加する
  - 必要なら ProblemView と EditorPage の表示を調整し、修正対象コードを見やすくする
- **完了条件**:
  - 読解 / デバッグ / 修正型の各タイプを最低 1 問ずつ追加できている
  - 既存の editor / judge フローで解ける形に収まっている
  - 問題表示と判定フローに対する回帰テストが追加されている

---

## 9. Phase 4.5: 問題コンテンツ外部化

この phase は、今後の問題追加と修正をコード本体から切り離し、Markdown / frontmatter / judge.json ベースで運用できるようにするための基盤整備トラックである。Phase 4 の今後の問題追加より先に進める。

### T-601 問題コンテンツ外部化の設計確定

- **ステータス**: `done` (2026-05-15)
- **目的**: 問題フォルダ構成、frontmatter 項目、manifest、judge 形式、移行順序を手戻り少なく確定する
- **判断資料**: [PROBLEM_CONTENT_EXTERNALIZATION_PLAN.md](./PROBLEM_CONTENT_EXTERNALIZATION_PLAN.md)
- **対象ファイル**:
  - [docs/PROBLEM_CONTENT_EXTERNALIZATION_PLAN.md](./PROBLEM_CONTENT_EXTERNALIZATION_PLAN.md)
  - [docs/IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md)
- **依存関係**: なし
- **実装内容**:
  - 1 問 = 1 フォルダの正式構成を決める
  - Markdown + YAML frontmatter、`starter.lisp`、`solution.lisp`、`judge.json` の責務分離を定義する
  - `manifest.json` で順序を固定し、`slug` は持つが初期移行では id route を維持する方針を明文化する
  - 段階移行、pilot 問題、validation 方針を整理する
- **完了条件**:
  - 設計文書が存在する
  - 後続の実装タスクへ分解されている
- **完了メモ**:
  - [PROBLEM_CONTENT_EXTERNALIZATION_PLAN.md](./PROBLEM_CONTENT_EXTERNALIZATION_PLAN.md) を追加し、target directory、schema、manifest、judge 形式、二重系移行、slug 方針を確定済み
  - docs-only 変更のため追加テストは不要

### T-602 build-time loader / validation / manifest 基盤

- **ステータス**: `done` (2026-05-15)
- **目的**: 外部ファイル群を build 時に読み込み、現行の `Problem[]` へ正規化する基盤を作る
- **対象ファイル**:
  - [package.json](../package.json)
  - [src/data/problems.ts](../src/data/problems.ts)
  - `src/data/problemContentSchema.ts`（新規）
  - `src/data/problemContentLoader.ts`（新規）
  - `src/data/problemCatalog.ts`（新規）
  - `src/data/__tests__/problemContentLoader.test.ts`（新規）
  - `src/content/problems/manifest.json`（新規）
- **依存関係**: T-601, T-105, T-201, T-102A
- **実装内容**:
  - `yaml` と `zod` を導入し、frontmatter / manifest / judge の validation を追加する
  - `import.meta.glob` で Markdown、Lisp、JSON を raw import し、問題単位へ束ねる
  - `order`、`catalog`、`learningPath` を現行ルールで導出し、既存の `Problem[]` export 面を維持する
  - invalid content を明確に失敗させる loader test を整備する
- **完了条件**:
  - `problems` export の利用側をほぼ変更せずに新 loader へ切り替えられる
  - manifest と content の整合性エラーを自動検知できる
- **完了メモ**:
  - `src/data/problemContentSchema.ts`、`src/data/problemContentLoader.ts`、`src/data/problemCatalog.ts` を追加し、frontmatter / manifest / judge の validation と build-time loader を実装済み
  - `src/content/problems/manifest.json` を追加し、manifest ベースの content 読み込み経路を導入済み
  - `src/data/problems.ts` は external content を legacy `problemSeeds` と merge する構成へ更新済み
  - `src/data/__tests__/problemContentLoader.test.ts` を追加し、validation と読み込みの局所テストを整備済み
  - 2026-05-15: `src/data/__tests__/problemContentLoader.test.ts` と `src/data/__tests__/problems.test.ts` の 78 件通過を確認済み

### T-603 二重系読み込みと pilot 3 問移行

- **ステータス**: `done` (2026-05-15)
- **目的**: 全件移行前に、外部ファイル形式が Learn / Editor / judge を壊さないことを確認する
- **対象ファイル**:
  - [src/data/problems.ts](../src/data/problems.ts)
  - `src/content/problems/basic-01/**`（新規）
  - `src/content/problems/...`（pilot 3 問）
  - [src/data/__tests__/problems.test.ts](../src/data/__tests__/problems.test.ts)
  - [src/pages/__tests__/LearnPage.test.tsx](../src/pages/__tests__/LearnPage.test.tsx)
  - [src/pages/__tests__/EditorPage.test.tsx](../src/pages/__tests__/EditorPage.test.tsx)
- **依存関係**: T-602
- **実装内容**:
  - 外部ファイル問題と legacy `problemSeeds` の二重系読み込みを可能にする
  - 同一 `id` は外部ファイル側を優先する
  - `program` judge、`function` judge、長文 Markdown を含む代表 3 問を移行する
  - Learn、Problems、Editor、judge の局所回帰を確認する
- **完了条件**:
  - pilot 3 問が外部ファイルから配信される
  - 既存ルート、採点、表示が維持される
- **完了メモ**:
  - `basic-01`、`basic-03`、`function-dispatch-01` を `src/content/problems/<id>/` 配下へ外部化済み
  - `basic-03` は pilot の function judge 代表として、external content 側で `kind: 'function'` / `functionName: 'add'` へ切り替え済み
  - `src/content/problems/manifest.json` に pilot 3 問を登録し、同一 ID は external content を優先する二重系読み込みを実運用へ反映済み
  - `src/data/__tests__/problems.test.ts` に pilot content 読み込みと `basic-03` の function judge 化を確認するテストを追加済み
  - 2026-05-15: `src/pages/__tests__/ProblemsPage.test.tsx` と `src/pages/__tests__/LearnPage.test.tsx` の 29 件通過を確認済み

### T-604 全問題移行と legacy `problemSeeds` 廃止

- **ステータス**: `done`
- **目的**: 問題データの単一ソースを外部コンテンツへ移し、巨大な TypeScript 配列を解消する
- **対象ファイル**:
  - [src/data/problems.ts](../src/data/problems.ts)
  - `src/content/problems/**`
  - [src/data/__tests__/problems.test.ts](../src/data/__tests__/problems.test.ts)
  - [README.md](../README.md)
- **依存関係**: T-603
- **実装内容**:
  - 残り全問題を問題フォルダ形式へ移行する
  - `problemSeeds` を削除し、`src/data/problems.ts` を facade / normalizer 中心へ縮小する
  - 問題件数、カテゴリ、judge 整合性、学習パス順の回帰を確認する
  - authoring ルールを README か専用 guide に追加する
- **完了条件**:
  - 全問題が外部コンテンツ由来になる
  - `src/data/problems.ts` に問題本文や solution の巨大配列が残らない
- **完了メモ**:
  - 2026-05-15: 一時移行スクリプト [scripts/archive/migrate-legacy-problems-to-content.mjs](../scripts/archive/migrate-legacy-problems-to-content.mjs) で残り 56 問を外部コンテンツへ書き出し、pilot 3 問とあわせて当時の全 59 問を `src/content/problems/<id>/` 配下へ移行済み
  - 2026-05-17: T-502 追加 7 問も同じ external content 構成で追加され、現行 66 問が `src/content/problems/<id>/` 配下に揃っている
  - `src/content/problems/manifest.json` を単一の順序ソースとし、`src/data/problems.ts` は external content を読み込んで `learningPath` / `catalog` を付与する薄い facade へ縮小済み
  - `src/data/problemCatalog.ts` から legacy merge ロジックを削除し、authoring 導線は README の外部コンテンツ手順へ統一済み
  - `npm test -- --run src/data/__tests__/problemContentLoader.test.ts src/data/__tests__/problems.test.ts` で 80 件通過を確認済み

### T-605 slug ルーティングと authoring 導線の整備

- **ステータス**: `done`
- **目的**: id と URL を分離し、問題追加時の authoring 体験をさらに改善する
- **対象ファイル**:
  - [src/types/index.ts](../src/types/index.ts)
  - [src/App.tsx](../src/App.tsx)
  - [src/pages/ProblemsPage.tsx](../src/pages/ProblemsPage.tsx)
  - [src/pages/LearnPage.tsx](../src/pages/LearnPage.tsx)
  - [src/pages/EditorPage.tsx](../src/pages/EditorPage.tsx)
  - [README.md](../README.md)
  - `docs/PROBLEM_AUTHORING_GUIDE.md`（新規候補）
- **依存関係**: T-604
- **実装内容**:
  - frontmatter の `slug` を route 解決に使えるようにする
  - 既存 id route は redirect か後方互換で維持する方針を決める
  - 問題追加テンプレートと執筆手順を文書化する
- **完了条件**:
  - `/learn/:slug` が解決できる
  - 新規問題追加手順が文書だけで再現できる
- **完了メモ**:
  - 2026-05-15: `Problem` runtime type と external content loader に `slug` を通し、`src/data/problems.ts` に route 解決 helper と canonical Learn path helper を追加済み
  - `src/pages/LearnPage.tsx` で `/learn/<slug>` を canonical としつつ、legacy の `/learn/<id>` は後方互換で解決して slug URL へ正規化するよう更新済み
  - `src/pages/ProblemsPage.tsx` と `src/pages/EditorPage.tsx` の Learn 導線を slug ベースへ統一済み
  - [PROBLEM_AUTHORING_GUIDE.md](./PROBLEM_AUTHORING_GUIDE.md) を追加し、`id` / `slug` の責務、frontmatter テンプレート、judge テンプレート、検証手順を文書化済み
  - `npm test -- --run src/data/__tests__/problemContentLoader.test.ts src/pages/__tests__/LearnPage.test.tsx src/pages/__tests__/ProblemsPage.test.tsx src/pages/__tests__/EditorPage.test.tsx src/__tests__/App.integration.test.tsx src/__tests__/App.test.tsx` で 74 件通過を確認済み

---

## 10. いまは着手しないタスク

次は、現時点では backlog に置くが実行順の後ろに回す。

- ダーク / ライトテーマ
- PWA 対応
- ステップ実行デバッガ
- コード共有 URL
- バックエンドベースの実 Lisp 実行環境導入（現行の学習モードと分離し、バックエンド確保と学習プラットフォーム成立後に検討）
- 教育機関向けクラス管理
- ランキングや競争機能

---

## 11. 次に実行するべきタスク

次の実装対象は **T-503 等価性・述語・型分岐の強化** とする。  
前回更新: 2026-05-17

理由は次の通り。

1. T-502 が完了し、tree / association list / property list の学習カバレッジが追加されたため、次は比較・述語・真偽値判断の穴を埋めるのが自然である
2. [PROBLEM_AUTHORING_GUIDE.md](./PROBLEM_AUTHORING_GUIDE.md) と externalized problem 運用が機能しており、T-503 も同じ追加フローで継続できる
3. `eq` / `eql` / `equal`、`nil`、truthiness は今後の読解・デバッグ問題の前提になりやすく、T-504 / T-505 より先に揃える価値が高い
4. 既存の比較演算・条件分岐セクションと接続しやすく、LearnPage 上の導線も現行カテゴリのまま拡張できる

---

## 12. 全体進捗サマリー

最終更新: 2026-05-17

| Phase | タスク数 | 完了 | 進捗 |
|---|---|---|---|
| Phase 0: 信頼性・立ち位置 | 5 (T-001〜T-005) | 5 | 100% |
| Phase 1: 継続利用基盤 | 7 (T-101〜T-106, T-102A) | 7 | 100% |
| Phase 1.5: 商品設計前提 | 3 (T-201〜T-203) | 3 | 100% |
| Phase 2: 計測・導線整備 | 6 (T-301, T-302, T-302A, T-302B, T-303, T-304) | 6 | 100% |
| Phase 3: 初回サブスク実験 | 4 (T-401〜T-404) | 0 (blocked) | 0% |
| Phase 4: 学習コンテンツ拡張 | 5 (T-501〜T-505) | 2 | 40% |
| Phase 4.5: 問題コンテンツ外部化 | 5 (T-601〜T-605) | 5 | 100% |
| **合計** | **35** | **28** | **80%** |

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
| T-201 | 問題データに商品属性を追加 | 2026-05-10 |
| T-202 | コース単位の表示設計 | 2026-05-10 |
| T-203 | ロック済みコンテンツ UI の土台 | 2026-05-10 |
| T-301 | イベント計測の抽象化 | 2026-05-10 |
| T-302 | CTA と価格導線の追加 | 2026-05-10 |
| T-302A | 問い合わせ導線の整備 | 2026-05-10 |
| T-302B | 価格公開前チェックリスト整備 | 2026-05-10 |
| T-303 | 価格ページの静的実装 | 2026-05-10 |
| T-304 | メール獲得導線 | 2026-05-12 |
| T-501 | 評価モデルと quote 系の補強 | 2026-05-14 |
| T-502 | tree / association list / property list 問題群の追加 | 2026-05-17 |
| T-601 | 問題コンテンツ外部化の設計確定 | 2026-05-15 |
| T-602 | build-time loader / validation / manifest 基盤 | 2026-05-15 |
| T-603 | 二重系読み込みと pilot 3 問移行 | 2026-05-15 |
| T-604 | 全問題移行と legacy `problemSeeds` 廃止 | 2026-05-15 |
| T-605 | slug ルーティングと authoring 導線の整備 | 2026-05-15 |

### 未着手タスク（実施推奨順）

| 順番 | ID | タスク名 | 依存 |
|---|---|---|---|
| 1 | T-503 | 等価性・述語・型分岐の強化 | T-501, T-604 |
| 2 | T-504 | 束縛・状態更新・closure 問題群の拡張 | T-501, T-604 |
| 3 | T-505 | 読解・デバッグ・修正型演習の導入 | T-501〜T-504, T-102A, T-604 |
| 4 | T-401 | 認証方式の決定とクライアント層追加 | T-303, T-304（blocked） |
| 5 | T-402 | プレミアム権限モデル | T-401, T-201（blocked） |
| 6 | T-403 | 有料コンテンツの外出し | T-402（blocked） |
| 7 | T-404 | 課金導線の接続 | T-401, T-402（blocked） |

### 採点モデル移行の完了状況（T-102A サブ項目）

既存 51 問の Explicit judge 移行は完了済みで、T-501 追加 8 問と T-502 追加 7 問も同形式で作成済み。現行 66 問に `expectedOutput` / `expectedReturnValue` の残存は 0 件。

| カテゴリ | 問題数 | 移行完了 |
|---|---|---|
| 基本構文 | 11 | ✅ |
| 条件分岐 | 4 | ✅ |
| 数値計算 | 3 | ✅ |
| 文字列操作 | 4 | ✅ |
| リスト操作 | 11 | ✅ |
| ループ | 4 | ✅ |
| 高階関数 | 12 | ✅ |
| 再帰 | 8 | ✅ |
| クロージャ | 3 | ✅ |
| スコープ | 2 | ✅ |
| 型判定 | 1 | ✅ |
| 総合問題 | 3 | ✅ |
| **合計** | **66** | **✅ 全件** |