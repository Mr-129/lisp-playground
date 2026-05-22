# Lambda Lab — T-401 認証方式比較

**作成日**: 2026年5月12日  
**位置づけ**: 内部向けの技術比較メモ  
**対象**: Firebase Auth / Supabase Auth

**関連ドキュメント**: [IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md) — T-401 以降の実装バックログ  
**関連ドキュメント**: [STORAGE_BOUNDARY.md](./STORAGE_BOUNDARY.md) — localStorage と外部正本の境界  
**関連ドキュメント**: [PLATFORM_STRATEGY.md](./PLATFORM_STRATEGY.md) — 収益化と静的サイト維持の前提

---

## 1. 背景

Lambda Lab は現在、GitHub Pages 上で配信する静的 SPA であり、学習継続に必要な軽量データは localStorage に保存している。

T-401 以降では、次の要件を段階的に満たす必要がある。

1. ログイン状態をブラウザをまたいで維持できる
2. `solved` / `bookmarked` を account 単位で同期できる
3. T-402 で entitlement を外部正本として扱える
4. T-404 で課金状態と権限反映を安全に接続できる

このため、認証だけでなく「将来のデータ同期と権限管理にどれだけ自然につながるか」を評価軸に含める。

---

## 2. 評価前提

今回の比較は、次の制約のもとで行う。

- 公開サイト本体は静的配信を維持する
- localStorage は scratch data と端末内利便性に留める
- 課金や entitlement の正本は外部サービスへ移す
- 初期は自前バックエンドを持たず、必要最小限の外部 SaaS で進める

---

## 3. 比較表

| 観点 | Firebase Auth | Supabase Auth | このプロジェクトでの評価 |
|---|---|---|---|
| 静的 SPA との相性 | 良い。クライアント SDK が成熟している | 良い。SPA での session 管理も一般的 | 両者とも適合 |
| Email/Password と OAuth | 十分強い。Google 連携も自然 | 十分強い。主要 OAuth に対応 | 大差なし |
| 匿名利用からの移行 | 匿名 auth を使いやすい | 匿名 auth は可能だが設計判断が増える | 匿名 upgrade を重視するなら Firebase 優位 |
| 進捗同期との接続 | Firestore / RTDB を別途設計する必要がある | Auth と Postgres を同一基盤で扱える | `solved` / `bookmarked` 同期は Supabase 優位 |
| entitlement 管理 | Firestore + Cloud Functions 等を組む前提 | Postgres + RLS + Edge Functions で寄せやすい | T-402/T-404 を見据えると Supabase 優位 |
| 有料コンテンツの外出し | Firestore 設計次第で可能 | テーブル分離や取得制御を SQL/RLS で組みやすい | T-403 を考えると Supabase 優位 |
| billing webhook との接続 | Cloud Functions 前提で問題なし | Edge Functions / DB 更新で問題なし | どちらも可能だが Supabase の方が権限反映まで一直線 |
| データの見通し | NoSQL 中心。小規模では速いが関係が増えると設計の意図が分散しやすい | SQL 中心。user / entitlement / progress を整理しやすい | 学習 progress と課金の両立では Supabase 優位 |
| 運用の分かりやすさ | Auth と DB と function が分かれやすい | Auth / DB / RLS / function を 1 サービスに寄せやすい | 初期の認知負荷は Supabase 優位 |
| vendor lock-in | 強い。Firestore 依存が深くなりやすい | 強いが、Postgres ベースで export しやすい | 将来移行余地は Supabase がやや有利 |
| 日本語学習サイト向けの初期導線 | Google ログインを早く載せやすい | Email/Password 起点が自然。OAuth も可能 | 初期はどちらでも成立 |

---

## 4. 結論

### 第一候補: Supabase Auth

現時点では、**Supabase Auth を第一候補とするのが妥当** である。

理由は次の通り。

1. 認証だけでなく、T-402 の entitlement、T-403 の有料データ分離、T-404 の課金反映まで同じ基盤でつなぎやすい
2. [STORAGE_BOUNDARY.md](./STORAGE_BOUNDARY.md) で外部正本に移すと定義した `solved` / `bookmarked` / 権限系を、SQL と RLS で整理しやすい
3. 静的 SPA のままでも、クライアントは auth session を扱い、正本は Supabase 側に持つ構成にしやすい
4. 自前バックエンドをまだ持たない段階でも、auth と data の境界を 1 つのサービスにまとめやすい

### Firebase Auth を選ぶべき条件

次の条件を優先するなら、Firebase を再評価してよい。

1. 匿名 auth を前提にし、後から account upgrade する導線を強く使いたい
2. Google ログインを最優先の入口にしたい
3. 進捗同期や entitlement より先に、まず認証だけを極小で入れたい

ただし、その場合でも T-402 以降で Firestore / function 設計を別途固める必要がある。

---

## 5. T-401 の最小実装スコープ

T-401 を実装する場合の最小スコープは次の通りとする。

1. 認証プロバイダを 1 つに決定する
2. `src/` に auth client と session 読み取り層を追加する
3. Header に login / logout 導線を追加する
4. ログイン後に `solved` と `bookmarked` だけを外部同期対象にする
5. `code`、`problem-id`、`recently-viewed`、`repl-session` は当面 local のまま維持する

この段階では、課金連携まではまだ入れない。

---

## 6. 推奨データ分割

### T-401 で外部へ移すもの

- user id
- auth session
- solved problem ids
- bookmarked problem ids

### T-401 では localStorage に残すもの

- current code draft
- selected problem id
- recently viewed problem ids
- repl session

### T-402 以降で追加するもの

- entitlement
- billing customer reference
- premium access state

---

## 7. 未解決事項

実装前に次の 3 点は決める必要がある。

1. login 導線を Email/Password から始めるか、OAuth を最初から含めるか
2. 匿名利用から login へ進んだときの `solved` / `bookmarked` merge を初回のみ自動で行うか
3. T-404 の課金導線を Stripe Checkout と Lemon Squeezy のどちらで試すか

---

## 8. 判断メモ

現フェーズでは「認証だけを入れる」より、「認証がその後の entitlement と billing に自然につながるか」を優先する。

その前提に立つ限り、Lambda Lab の T-401 の出発点は Firebase より Supabase の方が整合的である。