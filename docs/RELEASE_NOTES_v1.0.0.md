# v1.0.0 Release Notes

公開日: 2026-04-30
タグ: v1.0.0
対象コミット: 061032b

このリリースは、ブラウザ上で Common Lisp を学習・実行できる Lisp Playground の最初のまとまった公開版です。
問題一覧から学習詳細へ進み、エディタで実行し、REPL で対話的に試す一連の学習導線をひととおり提供します。

## 主な内容

- Home、問題一覧、学習詳細、エディタ、REPL を分離した学習導線を提供
- 問題データ 38 問を収録し、ヒント表示、解答表示、正答判定に対応
- Common Lisp の基礎を整理した構文ガイドを搭載
- ブラウザ内の Common Lisp インタプリタを実装し、主要な特殊形式、組み込み関数、クロージャをサポート
- Web Worker 実行と 10 秒タイムアウトにより、UI を止めにくい実行経路を用意
- localStorage によりコード、選択中問題、解答済み状態を保持
- フリーモードと REPL モードの両方で試行しやすい構成に整理

## 今回の仕上げ

- interpreter/parser の字句解析と構文解析の境界ケースを追加テストで補強
- executeLisp / executeLispRepl の出力制限と例外処理の境界ケースを追加テストで補強
- README のテスト件数、coverage ベースライン、テスト構成表を最新状態に同期

## 検証結果

- フルテスト: 26 ファイル、519 テスト成功
- coverage: All files 92.73 / Branch 83.00 / Funcs 97.66 / Lines 99.03
- interpreter/index.ts: 100 / 100 / 100 / 100
- interpreter/parser.ts: 96.82 / 94.36 / 100 / 99.02

## 既知の制限

- Windows の日本語パス配下では、ローカルの npm run build と npx vite build --debug が不安定
- defmacro、macrolet、CLOS、package system、stream/file I/O など Common Lisp の全機能には未対応
- executeLisp の各呼び出しは独立しており、状態を引き継ぐのは REPL モードのみ

## GitHub Releases 用の短い説明文

Lisp Playground の初回公開版です。Home、問題一覧、学習詳細、エディタ、REPL を備えた Common Lisp 学習用のフロントエンド環境として利用できます。今回の更新では interpreter/parser と executeLisp 系の境界ケースのテストを補強し、README のテスト件数と coverage ベースラインも最新化しました。