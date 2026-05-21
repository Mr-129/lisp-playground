# Lambda Lab — 会話経歴ログ

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