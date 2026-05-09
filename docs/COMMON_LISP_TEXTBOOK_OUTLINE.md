# Common Lisp 教科書の章立て案

**作成日**: 2026年5月1日  
**位置づけ**: 調査設計 / 教材設計の土台  
**目的**: Common Lisp を教科書レベルで体系化するために、何章立てで、何を調べるかを先に固定する

**関連文書**:
- [COMMON_LISP_FOUNDATIONS.md](./COMMON_LISP_FOUNDATIONS.md)
- [COMMON_LISP_TEXTBOOK_STYLE_GUIDE.md](./COMMON_LISP_TEXTBOOK_STYLE_GUIDE.md)
- [DIFFERENTIATION_BRIEF.md](./DIFFERENTIATION_BRIEF.md)
- [PROBLEM_ROADMAP_JP.md](./PROBLEM_ROADMAP_JP.md)

---

## 1. この文書の使い方

この文書は、今後の Common Lisp 調査を「そのまま教材に転換できる粒度」で整理するための章立て案である。

目的は次の 3 つである。

1. 調査の抜け漏れを防ぐ
2. 仕様、入門、実践を混ぜずに整理する
3. 将来のガイド、問題、実装差分整理につなげる

---

## 2. 今後の調査ルール

今後このテーマで調査を進めるときは、各章ごとに次の要素を揃える。

1. その章の結論
2. 基本概念の説明
3. 最小コード例
4. よくある誤解や落とし穴
5. Common Lisp 標準ではどう定義されるか
6. 参考 URL

表記ルールや参考 URL の詳細な運用は、[COMMON_LISP_TEXTBOOK_STYLE_GUIDE.md](./COMMON_LISP_TEXTBOOK_STYLE_GUIDE.md) を正本とする。

### 参考 URL の扱い

- 調査結果には必ず参考 URL を明示する
- 可能な限り一次情報を優先する
- 仕様の根拠と学習向け解説は分けて扱う

### 優先する参照先

1. Common Lisp HyperSpec
2. CL Community Spec
3. 実装やツールの公式ドキュメント
4. 実践的な補助資料

---

## 3. 教科書全体の構成案

この教科書は、次の 5 部構成を推奨する。

1. 導入
2. 構文と評価
3. 中核言語機能
4. 実践 Common Lisp
5. 応用と発展

付録として、仕様書の読み方と、このアプリとの対応差分を整理する。

---

## 第I部 導入

### 第1章 Common Lisp とは何か

- 調べること:
  - Common Lisp の定義
  - ANSI 標準化の位置づけ
  - Scheme、Clojure、Emacs Lisp との違い
  - 主な処理系の違い
- この章の役割:
  - 「Lisp 一般」ではなく「Common Lisp」を学ぶ理由を明確にする

### 第2章 Lisp 的なものの見方

- 調べること:
  - コードとデータの近さ
  - 対話的開発とは何か
  - 記号処理に強い理由
  - 拡張可能な言語としての特徴
- この章の役割:
  - なぜ Common Lisp が独特に見えるのかを先に解く

### 第3章 REPL・Reader・Evaluator・Printer

- 調べること:
  - REPL の流れ
  - reader と evaluator の違い
  - printer の役割
  - 読み取りと評価を分けて考える意味
- この章の役割:
  - 初学者が最初に混乱しやすい地点を整理する

---

## 第II部 構文と評価

### 第4章 S式と reader の基礎

- 調べること:
  - atom と list
  - token の解釈
  - 大文字小文字の扱い
  - escape と reader case
- この章の役割:
  - Common Lisp の見た目を読めるようにする

### 第5章 quote、backquote、reader macro

- 調べること:
  - quote と single quote
  - backquote と comma
  - `#'`, `#(...)`, `#\\A`, `#xFF` などの基本
  - reader macro という考え方
- この章の役割:
  - 学習者が最初に遭遇する記号表現を整理する

### 第6章 評価モデル

- 調べること:
  - self-evaluating object
  - symbol の評価
  - cons form の評価
  - special form / macro form / function form / lambda form
- この章の役割:
  - Common Lisp の実行規則の土台を理解する

### 第7章 データ型の全体像

- 調べること:
  - 数値、文字、文字列、symbol、cons、list
  - array、vector、hash table の概要
  - `nil` と `t` の役割
- この章の役割:
  - 後続章の前提となる型の地図を作る

---

## 第III部 中核言語機能

### 第8章 変数と束縛

- 調べること:
  - `let`, `let*`
  - `setq`, `setf`
  - `defvar`, `defparameter`
  - lexical binding と special variable
- この章の役割:
  - 変数と状態の基本を整理する

### 第9章 関数と lambda list

- 調べること:
  - `defun`, `lambda`
  - required / optional / rest / key 引数
  - 関数オブジェクト
  - closure の基本
- この章の役割:
  - Common Lisp の関数定義を体系的に理解する

### 第10章 制御構造

- 調べること:
  - `if`, `cond`, `when`, `unless`
  - `progn`, `block`, `return-from`
  - `catch`, `throw`, `unwind-protect`
  - 真偽値の扱い
- この章の役割:
  - 条件分岐と非局所脱出の基礎を固める

### 第11章 cons・list・tree の処理

- 調べること:
  - `car`, `cdr`, `cons`
  - proper list と dotted pair
  - tree 的な構造の見方
  - association list と property list
- この章の役割:
  - Lisp らしいデータ処理の中心を押さえる

### 第12章 反復と再帰

- 調べること:
  - 再帰の基本
  - `dolist`, `dotimes`, `loop`
  - `mapcar`, `mapcan`, `reduce`
  - 反復と再帰の使い分け
- この章の役割:
  - 実際にデータを処理する書き方を増やす

### 第13章 多値と generalized variable

- 調べること:
  - multiple values
  - `values`, `multiple-value-bind`
  - place という考え方
  - `setf` と generalized variable
- この章の役割:
  - Common Lisp 特有の実用機能を整理する

### 第14章 symbol と package

- 調べること:
  - symbol の構造
  - keyword
  - package の役割
  - `intern`, `find-symbol`, `export`, `use-package`
- この章の役割:
  - Common Lisp の名前空間を理解する

### 第15章 macro

- 調べること:
  - macro と関数の違い
  - `defmacro`
  - `macroexpand`
  - backquote を用いた展開
  - macro の落とし穴
- この章の役割:
  - Common Lisp の拡張性の中心を理解する

### 第16章 condition system

- 調べること:
  - `error`
  - `handler-case`, `handler-bind`
  - restart の考え方
  - 例外処理との違い
- この章の役割:
  - Common Lisp 独自のエラー処理モデルを理解する

### 第17章 CLOS

- 調べること:
  - class と instance
  - generic function と method
  - 多重ディスパッチ
  - 継承と method combination の基礎
- この章の役割:
  - Common Lisp のオブジェクトシステムを導入する

---

## 第IV部 実践 Common Lisp

### 第18章 文字列、format、入出力

- 調べること:
  - 文字列処理の基本
  - `format`
  - stream
  - `read`, `print`, `write`
- この章の役割:
  - REPL 外でも役立つ I/O の基礎を扱う

### 第19章 file、pathname、外部資源

- 調べること:
  - file I/O
  - pathname
  - open / close の基本
  - 文字コードや実装差の注意点
- この章の役割:
  - 実務に近い入出力へ進む

### 第20章 コンパイル、宣言、型、最適化

- 調べること:
  - compile と load
  - type declaration
  - optimize declaration
  - 実装依存最適化の考え方
- この章の役割:
  - Common Lisp が単なるインタプリタ言語ではないことを理解する

### 第21章 プロジェクト構成とエコシステム

- 調べること:
  - ASDF
  - Quicklisp
  - パッケージ構成
  - テスト、デバッグ、開発フロー
- この章の役割:
  - 教科書の知識をプロジェクト開発へつなぐ

### 第22章 実践パターン

- 調べること:
  - DSL
  - ルール処理
  - データ変換
  - 知識表現
  - 小さなアプリケーション設計
- この章の役割:
  - Common Lisp の使いどころを理解する

---

## 第V部 応用と発展

### 第23章 Common Lisp の商用利用と応用分野

- 調べること:
  - 日本での利用例
  - スケジューリング、最適化、知識処理
  - Web、業務システム、データ変換の事例
  - 学習サイトとして扱うべき題材
- この章の役割:
  - なぜ学ぶ価値があるかを実務文脈で示す

### 第24章 実装差と処理系ごとの違い

- 調べること:
  - SBCL、CCL、CLISP、LispWorks、Allegro CL などの違い
  - 仕様準拠と実装依存の境界
  - ポータブルコードを書く際の注意
- この章の役割:
  - 仕様と実装のズレを理解する

### 第25章 さらに先へ進むためのテーマ

- 調べること:
  - MOP
  - FFI
  - 並行処理
  - reader customization
  - 実装内部
- この章の役割:
  - 教科書後半や発展編への入口を用意する

---

## 付録

### 付録A HyperSpec の読み方

- どの章を辞書として引くか
- 学習順と仕様書順の違い
- 初学者が HyperSpec で迷いやすい点

### 付録B このアプリとの対応差分

- 現行の学習モードで再現できる範囲
- 未対応機能
- 教科書上は扱うが、現行アプリでは未実装の機能

### 付録C つまずきやすいポイント集

- quote と evaluation の混同
- package と symbol の混同
- function と value の混同
- macro と function の混同
- lexical と dynamic の混同

---

## 4. 推奨する調査順

教科書として自然に調査を進めるなら、次の順を推奨する。

1. 第1章から第7章
2. 第8章から第12章
3. 第14章、第15章、第16章
4. 第17章から第22章
5. 第23章以降と付録

特に重要なのは、**最初に「reader と evaluator の違い」と「symbol / list / quote」を固めること** である。ここが曖昧なまま進むと、後続章の理解が崩れやすい。

---

## 5. 先に調査を始めるべき章

最初の実行バッチとしては、次の 8 章を優先する。

1. 第1章 Common Lisp とは何か
2. 第3章 REPL・Reader・Evaluator・Printer
3. 第4章 S式と reader の基礎
4. 第5章 quote、backquote、reader macro
5. 第6章 評価モデル
6. 第8章 変数と束縛
7. 第9章 関数と lambda list
8. 第11章 cons・list・tree の処理

この 8 章が揃うと、入門者向けの「第1巻」の骨格になる。