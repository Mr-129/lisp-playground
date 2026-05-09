# Common Lisp 教科書ドラフト 執筆ガイド

**対象**: `docs/COMMON_LISP_TEXTBOOK_CH*.md` を中心とした教材ドラフト  
**目的**: 章構成、仕様説明、参考 URL の表記をそろえ、後からレビューしやすくする

---

## 1. 章の基本構成

各章は、原則として次の 6 要素をそろえる。

1. その章の結論
2. 基本概念の説明
3. 最小コード例
4. よくある誤解や落とし穴
5. Common Lisp 標準ではどう定義されるか
6. 参考 URL

本文の粒度や分量は章ごとに前後してよいが、この見出し構造はできるだけ崩さない。

---

## 2. 本文の説明方針

1. 初学者向けに説明しても、仕様上ずれる表現は避ける。
2. 省略記法を説明するときは、reader syntax なのか evaluator の規則なのかを分けて書く。
3. 関数、マクロ、special operator などの分類は、可能な限り HyperSpec の用語に合わせる。
4. 調査して説明を補った箇所には、章末の参考 URL に実際に参照した一次資料を残す。

---

## 3. 参考 URL の書き方

### 3.1 page-level 参照

章全体の概念を示すときは、Chapter、Section、Dictionary のページ参照を使ってよい。

例:

- Common Lisp HyperSpec Chapter 23 Reader  
  https://www.lispworks.com/documentation/HyperSpec/Body/23_.htm
- Common Lisp HyperSpec Section 3.1.2 The Evaluation Model  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_ab.htm
- Common Lisp HyperSpec The Conses Dictionary  
  https://www.lispworks.com/documentation/HyperSpec/Body/c_conses.htm

### 3.2 operator-level 参照

個別の operator を示す行は、必ず 1 operator 1 行にする。

許容する例:

- Common Lisp HyperSpec Function LIST  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_list_.htm#list
- Common Lisp HyperSpec Function LIST*  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_list_.htm#listST
- Common Lisp HyperSpec Macro WHEN  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_when_.htm#when
- Common Lisp HyperSpec Macro UNLESS  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_when_.htm#unless

避ける例:

- Common Lisp HyperSpec Function LIST, LIST*
- Common Lisp HyperSpec Macro WHEN, UNLESS
- Common Lisp HyperSpec Function REQUIRE / PROVIDE

同一 HTML に複数 operator が載っていても、行は分け、URL は operator ごとの anchor を張る。

### 3.3 kind ラベル

operator-level 参照の kind ラベルは、HyperSpec の表記に合わせる。

主に使うもの:

- Function
- Macro
- Special Operator
- Accessor
- Type
- Declaration
- System Class
- Standard Generic Function
- Standard Method Combination

本文での説明語と参考 URL の kind ラベルがずれないようにする。

### 3.4 補助資料の扱い

ANSI 仕様の補助参照、ASDF、Quicklisp など HyperSpec 以外の資料を入れる場合は、その資料の立ち位置を短く明示する。

例:

- CL Community Spec（補助参照。ANSI 仕様ドラフトの HTML 化）
- ASDF Official Site
- Quicklisp beta

---

## 4. URL 確定の手順

1. まず HyperSpec の該当 Chapter / Section / Dictionary を特定する。
2. operator-level の参照は、できるだけ個別 anchor 付き URL を使う。
3. 同一ページに複数 operator がある場合は、operator ごとの anchor 名を確認する。
4. URL 推測で済ませず、必要なら X_AllSym や dictionary ページ、または実ページの anchor を確認する。
5. Web 取得が不安定なときは、PowerShell の Invoke-WebRequest などで title や anchor を確認してから書く。

---

## 5. 運用ルール

1. 参考 URL を追加するときは、まず page-level 参照が必要か、operator-level 参照が必要かを分けて考える。
2. operator-level 参照を書くなら、 grouped 表記に戻さない。
3. 既存章を更新するときも、このガイドの表記へ合わせる。
4. 例外を作る場合は、なぜ grouped 表記を避けられないのかを明記する。
