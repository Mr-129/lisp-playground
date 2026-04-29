# v1.0.1 Release Notes

公開日: 2026-04-30
タグ: v1.0.1
対象コミット: 2e1534c

v1.0.1 は、v1.0.0 の初回公開内容をベースに、GitHub Releases 用の文書とタグの整合を取った公開調整版です。
アプリ本体の主要機能は v1.0.0 から変えておらず、公開ページとリポジトリ内の説明をそのまま対応づけられる状態に整えています。

## このリリースの位置づけ

- v1.0.0 の公開内容を引き継いだまま、リリースノート文書をタグ対象に含めるよう整理
- README のテスト件数、coverage ベースライン、テスト構成表を最新状態に同期
- parser / executeLisp 系の境界ケース補強を含んだ状態を、そのまま公開版として固定
- アプリ機能の大きな追加や仕様変更は含まない

## アプリ本体でできること

- Home、問題一覧、学習詳細、エディタ、REPL を分離した学習導線
- 問題データ 38 問、ヒント表示、解答表示、正答判定
- Common Lisp の基礎を整理した構文ガイド
- ブラウザ内 Common Lisp インタプリタ、主要な特殊形式、組み込み関数、クロージャ対応
- Web Worker 実行と 10 秒タイムアウトによる非同期実行
- localStorage によるコード、選択中問題、解答済み状態の保持
- フリーモードと REPL モードの両対応

## 品質情報

- フルテスト: 26 ファイル、519 テスト成功
- coverage: All files 92.73 / Branch 83.00 / Funcs 97.66 / Lines 99.03
- interpreter/index.ts: 100 / 100 / 100 / 100
- interpreter/parser.ts: 96.82 / 94.36 / 100 / 99.02

## 既知の制限

- Windows の日本語パス配下では、ローカルの npm run build と npx vite build --debug が不安定
- defmacro、macrolet、CLOS、package system、stream/file I/O など Common Lisp の全機能には未対応
- executeLisp の各呼び出しは独立しており、状態を引き継ぐのは REPL モードのみ

## GitHub Releases 本文案

Lisp Playground v1.0.1 は、ブラウザ上で Common Lisp を学習・実行できる公開版です。

主な内容:
- Home、問題一覧、学習詳細、エディタ、REPL を分離した学習導線
- 38 問の問題データ、ヒント表示、解答表示、正答判定
- Common Lisp 基礎構文ガイド
- ブラウザ内インタプリタ、Web Worker 実行、localStorage 永続化

今回の公開調整:
- parser / executeLisp 系の境界ケースに対するテスト補強を反映
- README のテスト件数、coverage ベースライン、テスト構成表を最新状態に同期
- GitHub Releases 用の文書とタグの整合を調整

品質情報:
- フルテスト 26 ファイル、519 テスト成功
- coverage: All files 92.73 / Branch 83.00 / Funcs 97.66 / Lines 99.03

既知の制限:
- Windows の日本語パス配下ではローカル build が不安定
- Common Lisp の全機能には未対応
- 状態を引き継ぐのは REPL モードのみ