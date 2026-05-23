# Lisperpaw — 競合・参考リソース比較

**作成日**: 2026年4月30日  
**位置づけ**: 内部向け比較メモ  
**対象**: Common Lisp 学習サイト / 学習リソース

---

## 1. この文書の目的

本書は、Lisperpaw の競合と代替手段を整理し、今後の問題追加、学習導線、商品設計の参考にするための比較メモである。

ここでいう競合は、完全に同じ機能構成のサービスだけでなく、学習者が「Common Lisp を学ぶために代わりに使うもの」も含める。

---

## 2. 比較対象一覧

| 名前 | URL | 語学 | 種類 | 料金 | 概要 |
|---|---|---|---|---|---|
| Exercism Common Lisp Track | https://exercism.org/tracks/common-lisp | 英語 | 演習プラットフォーム | 無料 | Common Lisp の concepts と exercises を段階的に解ける。メンタリング導線あり。 |
| Lisp Koans | https://github.com/google/lisp-koans | 英語 | Koan 型演習リポジトリ | 無料 | 壊れたテストを直しながら Common Lisp の機能を順に学ぶ。 |
| Learn Common Lisp | https://lisp-lang.org/learn/ | 英語 | 学習ポータル / チュートリアル | 無料 | Functions、Variables、Lists、I/O、Macros、CLOS まで章立てで学べる。 |
| Learn X in Y Minutes: Common Lisp | https://learnxinyminutes.com/common-lisp/ | 英語 | 超短縮チュートリアル | 無料 | 1 ページで Common Lisp の主要構文と例を素早く確認できる。 |
| Practical Common Lisp | https://gigamonkeys.com/book/ | 英語 | 実践書 / 無料公開書籍 | 無料閲覧 / 書籍版は有料 | 入門から実践まで広く扱う定番書。オンライン本文は無料公開。 |
| The Common Lisp Cookbook | https://lispcookbook.github.io/cl-cookbook/ | 英語 | Cookbook / 実務リファレンス | 無料閲覧 / 一部有料支援あり | 基礎から実務、ライブラリ、デバッグまで幅広く参照できる。 |
| Common Lisp HyperSpec | https://www.lispworks.com/documentation/HyperSpec/Front/Contents.htm | 英語 | 仕様リファレンス | 無料 | ANSI Common Lisp の標準参照先。学習サイトというより仕様辞書。 |
| CL Community Spec | https://cl-community-spec.github.io/pages/index.html | 英語 | 仕様レンダリング | 無料 | ANSI 仕様草案を HTML で読みやすくしたもの。 |
| Common Lisp Libraries Read the Docs | https://common-lisp-libraries.readthedocs.io/ | 英語 | ライブラリ文書ポータル | 無料 | Quicklisp、Alexandria、Hunchentoot などの実務寄り情報を整理。 |
| Common-Lisp.net | https://common-lisp.net/ | 英語 | コミュニティ入口 / ポータル | 無料 | Common Lisp 全体の入口、ニュース、ダウンロード、コミュニティ導線。 |

---

## 3. 料金区分の見え方

### 完全無料で使えるもの

- Exercism Common Lisp Track
- Lisp Koans
- Learn Common Lisp
- Learn X in Y Minutes: Common Lisp
- Common Lisp HyperSpec
- CL Community Spec
- Common Lisp Libraries Read the Docs
- Common-Lisp.net

### 無料で読めるが、有料導線もあるもの

- Practical Common Lisp
  - Web 本文は無料公開
  - 印刷書籍や電子書籍は別途有料で入手可能
- The Common Lisp Cookbook
  - Web 本文は無料公開
  - PDF / EPUB の寄付付き配布や、関連する有料動画講座への導線あり

### 現時点の判断

- Common Lisp 学習の主要な公開導線は、全体としては無料リソースがかなり強い
- そのため、有料化する場合は「基礎知識の提供」だけでは弱い
- 課金対象は、体系化コース、進捗同期、復習導線、実践課題、更新継続価値の方が適している

---

## 4. 競合の種類別整理

### 直接競合に近いもの

- Exercism Common Lisp Track
- Lisp Koans
- Learn Common Lisp

これらは、学習順序や演習をある程度提供しており、Lisperpaw と比較されやすい。

### 強い代替手段

- Practical Common Lisp
- The Common Lisp Cookbook
- Learn X in Y Minutes: Common Lisp

これらはサイト一体型ではないが、学習者が実際に使うことの多い代替ルートである。

### 権威ある参照先

- Common Lisp HyperSpec
- CL Community Spec

これらは競合というより、仕様理解の基準になる参照先である。

### 学習後の受け皿

- Common Lisp Libraries Read the Docs
- Common-Lisp.net

これらは中級以降や実務導線の比較対象として有効である。

---

## 5. Lisperpaw から見た示唆

### 現状の優位性

- 日本語 UI と日本語学習導線を持つ
- ブラウザでそのまま試せる
- 問題、ガイド、エディタ、REPL が一体化している
- localStorage による継続学習の土台がある

### 現状の弱み

- 問題数 38 問では、演習量で Exercism に大きく負ける
- 実践トピックの幅では Cookbook や Practical Common Lisp に及ばない
- macro、package、CLOS、condition system などの中級以降で不足が大きい
- 継続利用を促す UI と商品設計はまだ未整備

### 参考にすべき点

- Exercism: concepts と exercises の二層構造
- Lisp Koans: 小さい穴埋め問題を順番に解く設計
- Learn Common Lisp: 章立ての明快さ
- Practical Common Lisp: 実践章の混ぜ方
- Cookbook: 中級以降の辞書的導線

---

## 6. 当面の戦略示唆

1. まずは「日本語で、ブラウザで、問題演習まで一体化している」強みを伸ばす
2. 問題数は段階的に増やし、最低でも入門から中級入口までをサイト内で完結できる密度を目指す
3. 有料化を考える場合は、無料で代替しにくい価値を作る
4. その価値は、単純な問題の量よりも、体系化コース、復習、同期、実践課題、更新継続性に置く

---

## 7. 次に検討すると良いこと

- 競合を踏まえた 120 から 200 問規模の問題ロードマップ作成
- 入門、中級、実践の 3 層カリキュラム設計
- 無料で出す範囲と、将来的に深さで差をつける範囲の整理

---

## 8. 日本における Lisp の商用利用ジャンル

公開情報から確認できた範囲では、日本で Lisp がビジネス用途に使われてきた、または現在も需要が見えるジャンルは次の通りである。

### 運行計画・スケジューリング

- 日本航空と日本電気は、AI を利用して全運行乗務員 2,200 人の月間乗務員スケジュールを短時間で作成するシステムを共同開発し、本格運用した
- ベースになったのは NEC の Lisp マシン LIME とされている

この系統は、制約充足、最適化、計画立案のような問題と相性が良い。

### 製造業・自動車向けの技術データ管理と解析

- 日本の事例として、自動車衝突試験データベースシステムの構築事例が公開されている
- Common-Lisp.net でも、日本の事例として Mathematical Systems, Inc. の Car Crash Database System が紹介されており、Honda での利用に触れている

この系統は、技術データの検索、参照、解析、知識管理と相性が良い。

### エキスパートシステム・知識処理

- 日立の HiLISP では、主な応用として ES/KERNEL が挙げられている
- 国内初の商用 Common Lisp 処理系としてリリースされた実装でもあり、日本では知識処理系やエキスパートシステムの文脈が強かったことが分かる

この系統は、ルールベース、推論、知識表現のような用途である。

### AI ワークステーション / AI 応用基盤

- NTT の ELIS は AI ワークステーションとして発表され、後に ELIS-8100 として発売された
- 1980年代から1990年代初頭にかけて、日本では Lisp が AI 応用基盤として商用化された歴史がある

これは現在の直接市場というより、日本での商用利用の歴史的土台として重要である。

### 受託開発・業務システム対応

- 現在でも、日本国内には Lisp 対応可能として掲載されている開発会社一覧が存在する
- 掲載カテゴリ上は、AI、業務システム、Web システム、検索技術、PDF 処理、CAD 周辺などと隣接している

ただし、この種の掲載情報は「Lisp を実際にどの案件で採用したか」まで常に示すわけではないため、現在の主流利用分野を断定する材料としては弱い。現時点では、「国内に受託需要の窓口は残っている」というシグナルとして扱うのが妥当である。

---

## 9. いま日本で見えるジャンルの要約

確度の高いものから並べると、次の理解が妥当である。

1. 計画最適化やスケジューリング
2. 製造業向けの技術データ管理、検索、解析
3. エキスパートシステム、知識処理、推論
4. AI 応用基盤や研究寄りの業務システム
5. 受託開発としての業務システム、Web、検索、PDF、CAD 周辺

つまり、日本での Lisp は、一般的な Web 開発言語として広く使われているというより、知識処理、技術計算、探索、最適化、業務支援のような問題設定で商用利用されてきた色が強い。

---

## 10. 参考にした公開情報

- 情報処理学会 コンピュータ博物館「LispマシンLIME」
  - 日本航空と日本電気による乗務員スケジューリングの事例
- 情報処理学会 コンピュータ博物館「通研ELIS」
  - NTT の AI ワークステーションとしての商用化経緯
- Wikipedia「HiLISP」
  - 国内初の商用 Common Lisp 処理系と ES/KERNEL の記載
- CiNii Research「JLUGM--日本Lispユーザ会議(2)Lisp応用事例:自動車衝突試験データベースシステムの構築」
  - 自動車衝突試験データベースの国内応用事例
- Common-Lisp.net「Companies using Lisp」
  - 日本の事例として Mathematical Systems, Inc. と Pocket Change を掲載
- 比較ビズ「Lispに対応可能なシステム開発会社11選を徹底比較」
  - 日本国内での Lisp 対応受託開発の市場シグナル
- システム幹事「Lisp対応可能のシステム開発会社一覧」
  - 国内の開発会社検索カテゴリとしての Lisp 対応状況