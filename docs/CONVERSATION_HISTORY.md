# Lisperpaw — 会話経歴ログ

## 2026年5月22日〜23日

### 概要

- サイト名を Lisperpaw に確定し、visible brand、README、title / description、関連テストを現行名称へ同期した。
- アイコンは Paw 系候補を 10 案追加して検討したが、production では最終的に Tree Tiered に戻した。
- `main` と `deploy` の二段 push 運用で GitHub Pages を更新し、公開サイトのブランド表記と icon 配信を実画面で確認した。

### 時系列メモ

1. サイト名候補を再検討した結果、Lisperpaw を採用し、[src/config/brand.ts](../src/config/brand.ts)、[index.html](../index.html)、README、関連テストを更新した。
2. focused Vitest 42 tests passed とフル回帰 32 files / 611 tests passed を確認後、`main` と `deploy` の両方へ push し、GitHub Pages 上で Lisperpaw 表記の公開を確認した。
3. `docs/icon-candidates/` に Paw 系の brand icon 候補を 10 件追加し、比較 gallery を更新した。
4. 一時的に Paw Ladder を [public/favicon.svg](../public/favicon.svg) と [src/components/Icon.tsx](../src/components/Icon.tsx) の `BrandMark` に反映し、`deploy` run `26296805560` の success と公開反映を確認した。
5. 見た目レビューの結果、production icon は Tree Tiered に戻す判断とし、`6f35c3a` で rollback して `deploy` run `26316882323` の success を確認した。
6. review / 公開確認 / 会話履歴の 3 文書を current state に同期し、運用ログ上でも Lisperpaw + Tree Tiered が current decision であることを明文化した。

### 今回の判断

- ブランド名: Lisperpaw
- ブランドアイコン: Tree Tiered
- 公開運用: `main` と `deploy` の二段 push を維持し、GitHub Pages は `deploy` ブランチ経由で反映する

### 検証メモ

- `npm test`: 2026-05-22 の直近フル実行で 32 files / 611 tests passed
- `npx vitest run src/components/__tests__/Header.test.tsx src/pages/__tests__/HomePage.test.tsx src/__tests__/App.test.tsx`: 2026-05-22, 2026-05-23 ともに 42 tests passed
- GitHub Actions `CI & Deploy`: `26296805560`（Paw Ladder 反映）success、`26316882323`（Tree Tiered 復帰）success

### レビュー結論

- `ebc57f3`、`77d0bec`、`6f35c3a` の review では、実装側の blocking な不具合は確認されなかった。
- 直近で最もドリフトしやすかったのは実装ではなく運用ドキュメントであり、ブランド名、icon の current decision、公開確認ログの同期を優先して更新した。

## 2026年5月20日

### 概要

- Lisp 学習サイトの glossary 追加、Home からの導線追加、ブランド刷新、アイコン探索、公開検証までを一連で実施した。
- ブランド候補は S式、List Processor、Tree Form、List Spine を軸に広げ、最終的に Tree Tiered を本命アイコンとして採用した。
- サイト名は Lambda Atelier 案から再検討し、最終的に Lambda Lab へ変更した。

### 時系列メモ

1. Glossary ページを追加し、構文ガイドや問題一覧への導線を整備した。
2. Header / Home / Learn / Editor / REPL をまたぐ visible brand の刷新と、SVG icon system の導入を進めた。
3. `docs/icon-candidates/` に S式ベースのブランドアイコン候補を作成し、Tree 系と Spine 系を中心に比較ページを整備した。
4. Tree Tiered を本命アイコンとして選定し、`public/favicon.svg` と `src/components/Icon.tsx` の `BrandMark` に反映した。
5. フル回帰で 1 件だけ stale label を持つテストを修正し、その後 `npm test` 611 tests passed と clean build success を確認した。
6. サイト名候補を比較した結果、Lambda Lab を採用し、`src/config/brand.ts`、`index.html`、関連テストへ反映した。
7. ブランド変更後の focused Vitest 42 tests passed を確認し、README / REVIEW / deploy チェックリストの同期作業に入った。
8. フル validation で Playwright smoke test に旧ブランド名依存の期待値が 1 件残っていることを確認し、`e2e/app-smoke.spec.ts` を修正して再実行 3/3 passed を確認した。

### 今回の判断

- ブランド名: Lambda Lab
- ブランドアイコン: Tree Tiered
- 公開運用: `main` と `deploy` の二段 push を維持し、GitHub Pages は `deploy` ブランチ経由で反映する

### 検証メモ

- `npm test`: 直近フル実行で 32 files / 611 tests passed
- `Remove-Item dist -Recurse -Force -ErrorAction SilentlyContinue; npm run build`: clean build success
- `npx vitest run src/components/__tests__/Header.test.tsx src/pages/__tests__/HomePage.test.tsx src/__tests__/App.test.tsx`: 42 tests passed
- `npm run test:e2e`: 3 passed

### レビュー結論

- 直近差分に対するコードレビューでは、実装側の blocking な不具合は確認されなかった。見つかった 1 件は E2E テストの旧ブランド期待値で、修正済み。
- 主要な改善対象は README / REVIEW / 運用ログのドキュメントドリフトであり、ブランド名・検証結果・公開手順の同期を優先した。