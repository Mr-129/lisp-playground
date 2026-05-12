# Lisp Playground — データ保存境界

**作成日**: 2026年5月12日  
**位置づけ**: 内部向けアーキテクチャ方針  
**対象**: localStorage、将来の認証、同期、課金、権限管理

**関連ドキュメント**: [PLATFORM_STRATEGY.md](./PLATFORM_STRATEGY.md) — 収益化とプラットフォーム方針  
**関連ドキュメント**: [IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md) — T-401 以降の実装バックログ  
**関連ドキュメント**: [AUTH_PROVIDER_COMPARISON.md](./AUTH_PROVIDER_COMPARISON.md) — 認証方式比較

---

## 1. 目的

本書は、現在 localStorage に保存しているデータのうち、どれを今後もブラウザ内に残してよいか、どれを将来は外部の正本へ移すべきかを固定する。

狙いは次の 3 点である。

1. 静的サイトのままでも継続利用を支える設計を崩さない
2. 収益化の段階で localStorage を権限や課金の正本として誤用しない
3. T-401 以降で認証、権限、購入状態を追加するときの境界を先に明文化する

---

## 2. 前提

現時点の永続化は [src/utils/storage.ts](../src/utils/storage.ts) の localStorage のみで構成されている。

localStorage は次の性質を持つ。

- ブラウザ、端末、プロファイル、URL ごとに分離される
- ユーザー自身が削除できる
- ユーザー自身が書き換えできる
- サーバー側の真正性チェックを持たない
- 別ブラウザや別端末では自動で共有されない

このため、localStorage は「操作の続き」や「端末内の利便性」には向くが、「お金に関わる真実のデータ」には向かない。

---

## 3. 判定ルール

### localStorage に残してよいデータ

- 失われても金銭や権限の事故にならない
- 改ざんされてもサービス側の信頼性を壊さない
- 端末ごとに違っていても困らない
- 匿名利用でも成立する

### 将来は外部の正本が必要なデータ

- ログインやユーザー識別に関わる
- 有料プランや権限に関わる
- 購入、請求、サブスク状態に関わる
- private な連絡先、waitlist、問い合わせ履歴に関わる
- 複数端末で同期されること自体が価値になる

### 併用してよいデータ

- UI の快適さのために localStorage に cache してもよい
- ただし、正本は外部に置く
- 矛盾時は外部の正本を優先する

---

## 4. 現在の保存項目の仕分け

| localStorage key | 用途 | 当面の扱い | 将来の正本 | 理由 |
|---|---|---|---|---|
| `lisp-playground-code` | エディタの下書きコード | localStorage に残す | local のままを基本。必要なら後で任意同期 | 下書きであり、端末ごとの差が許容できる |
| `lisp-playground-problem-id` | 最後に開いていた問題 | localStorage に残す | local のまま | 画面復元用であり、端末固有で問題ない |
| `lisp-playground-solved-problem-ids` | 解答済み進捗 | 匿名時は localStorage | ログイン後は外部を正本候補 | 複数端末同期が価値になりうるため |
| `lisp-playground-recently-viewed-problem-ids` | 最近見た問題 | localStorage に残す | local のままを基本 | 利便性用で、端末依存でも成立する |
| `lisp-playground-bookmarked-problem-ids` | ブックマーク | 匿名時は localStorage | ログイン後は外部を正本候補 | 継続利用価値が高く、同期対象に向く |
| `lisp-playground-repl-session` | REPL の履歴と下書き | localStorage に残す | local のままを基本 | 一時セッション性が強く、金銭や権限と無関係 |

### 補足

- `solved` と `bookmarked` は、匿名利用では localStorage のままでよい
- ただし「ログインして進捗同期」を売る段階では、外部の正本へ移す候補になる
- `code` と `repl-session` は scratch data に近いため、同期対象にするなら後で opt-in にするのが妥当

---

## 5. 外部の正本が必須なデータ

次のデータは localStorage のみで保持してはいけない。

### 認証とユーザー識別

- user id
- login session
- provider account linkage

### 課金と権限

- Free / Standard / Supporter の entitlement
- customer id
- subscription id
- purchase status
- 請求状態、解約状態、返金状態

### private な連絡先

- waitlist のメールアドレス
- メール配信同意情報
- 非公開の問い合わせ内容

### 収益化価値そのものになる同期データ

- 複数端末同期された進捗
- account ベースの復習リスト
- 将来の premium unlock 状態

---

## 6. 収益化フェーズでの推奨境界

### いまのままでよい領域

- エディタの下書き
- 最後に見た問題
- 最近見た問題
- REPL セッション

### ログイン後に外部同期を追加すべき領域

- 解答済み進捗
- ブックマーク
- 必要なら学習ダッシュボード用の集計

### localStorage を絶対に正本にしてはいけない領域

- ログイン状態
- 有料会員フラグ
- 問題 unlock 状態
- 決済結果

---

## 7. 実装時の運用ルール

### 匿名利用

- 既存どおり localStorage のみで成立させる
- データ消失リスクは受け入れる

### ログイン後

- 課金・権限系は外部を正本にする
- `solved` と `bookmarked` は外部と同期する
- `problem-id`、`recently-viewed`、`repl-session` は端末ローカルのままでもよい

### 初回ログイン時の merge 方針

- `solved` は local と外部を和集合で統合する
- `bookmarked` も local と外部を和集合で統合する
- `code` と `repl-session` は自動同期しない
- 権限系は必ず外部を採用する

---

## 8. T-401 以降への影響

### T-401 認証方式の決定

- user id と session を外部サービスへ移す
- localStorage は補助 cache に留める

### T-402 プレミアム権限モデル

- entitlement は外部の正本だけで判定する
- localStorage の flag で unlock しない

### T-403 有料コンテンツの外出し

- premium data の取得条件は外部の権限判定に従う

### T-404 課金導線の接続

- 購入状態、Checkout 結果、反映済み権限は外部の記録を信頼する

---

## 9. 結論

Lisp Playground は、静的サイトのままでも収益化の前段までは進められる。

ただし、その前提は次の分離である。

- localStorage は scratch と端末内利便性のために使う
- 収益、権限、private 連絡先、同期価値のあるデータは外部の正本へ移す

この境界を崩さない限り、現在の localStorage ベースの学習体験は維持したまま、認証と課金を後から追加できる。