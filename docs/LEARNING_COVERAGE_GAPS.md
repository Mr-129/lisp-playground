# Lisp Playground — 学習範囲の不足一覧と優先順位

**作成日**: 2026年5月12日  
**位置づけ**: 内部向けコンテンツ優先順位整理  
**目的**: 現在の学習サイトがどこまでカバーできていて、次にどの学習範囲を優先して厚くすべきかを整理する

**関連文書**:
- [IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md)
- [PROBLEM_ROADMAP_JP.md](./PROBLEM_ROADMAP_JP.md)
- [COMMON_LISP_TEXTBOOK_OUTLINE.md](./COMMON_LISP_TEXTBOOK_OUTLINE.md)
- [T501_QUOTE_EVALUATION_PLAN.md](./T501_QUOTE_EVALUATION_PLAN.md)

---

## 1. この文書の結論

現状の Lisp Playground は、**Common Lisp 全体**を網羅する教材ではなく、**入門から初中級入口までのコア領域**を学ぶサイトとして見るのが妥当である。

したがって、次に優先すべき不足範囲は、いきなり macro や CLOS に進むことではない。まずは、現在の学習モードでも十分に拡張できる **評価モデル、symbol / quote、木構造、等価性、状態変化、読解 / デバッグ** を厚くするべきである。

優先順位は次の 3 段階で考える。

1. **Priority 1**: 現在の学習モードでそのまま厚くすべき中核領域
2. **Priority 2**: Common Lisp らしさを強めるために近いうちに追加したい領域
3. **Priority 3**: 教科書レベルや上級編として後続で扱う領域

---

## 2. 現在地

現時点の構成は次のように整理できる。

- 問題数は **59 問**
- ガイドは **15 セクション**
- 厚い領域は、基本構文、条件分岐、リスト操作、再帰、高階関数、クロージャ、ループ、文字列、数値、基本的な述語である
- 薄い、または未収録の領域は、symbol と評価の深掘り、木構造、association list、property list、等価性の使い分け、状態更新、読解 / デバッグ、package、macro、CLOS、condition system、array / vector / hash table、stream / file / pathname である

2026年5月14日時点で、Priority 1 の `symbol / quote / function object / 評価モデル` は T-501 第1弾として 8 問とガイド追記を反映済みである。次の主対象は `tree / association list / property list` と `等価性・述語・型分岐` に移っている。

重要なのは、現状が「空っぽ」なのではなく、**説明と演習が短くまとまっているため、深さが不足して見える** ことである。問題は量の絶対不足だけではなく、**中級に橋をかける章と問題の不足** にある。

---

## 3. 優先順位の基準

優先順位は、次の観点で決める。

1. 学習効果が大きいか
2. 現在の学習モードで扱いやすいか
3. 初学者が「分かった」を「使える」に変えやすいか
4. Common Lisp 特有の重要性が高いか
5. 上級トピックへ進む前提として必要か

---

## 4. Priority 1: 先に厚くすべき中核領域

ここは、**今のサイトの満足度を最も上げやすい不足範囲** である。原則として、現行の学習モードのまま追加しやすい。

| 優先 | 不足領域 | 先にやる理由 | 追加したい内容 | 依存度 |
|---|---|---|---|---|
| P1-1 | symbol / quote / function object / 評価モデル | Lisp のつまずきは「評価されるもの」と「評価させないもの」の理解不足が最大要因になりやすい | quote、`#'`、`function`、`funcall`、`apply`、symbol 評価、コードとデータの違いを扱うガイド拡張と 6 から 8 問 | 低 |
| P1-2 | tree / association list / property list 的な発想 | 現状は平坦な list 中心で、Lisp らしいデータ処理の手応えがまだ弱い | ネストリスト走査、tree 再帰、`assoc`、設定表・辞書風データ処理の問題 6 から 8 問 | 低 |
| P1-3 | 等価性と述語の使い分け | `eq` / `eql` / `equal`、`nil`、真偽値、型判定を曖昧なまま進むと中級で詰まりやすい | 比較・述語・truthiness・型分岐の解説強化と 4 から 6 問 | 低 |
| P1-4 | 状態変化、束縛、`let*`、`setf`、closure の実感 | 変数と closure は触れているが、「どこが変わり、どこが閉じ込められるか」の理解を深める余地が大きい | lexical scope、再束縛、蓄積器、カウンタ、状態更新の問題 5 から 6 問 | 低 |
| P1-5 | 読解 / デバッグ / 修正型演習 | 現状は新規実装型に寄っており、「既存コードを読んで直す」練習が不足している | バグ修正、出力差分の原因特定、エラーメッセージ読解の問題 6 から 10 問 | なし |

### Priority 1 の補足

- 最優先は **P1-1** と **P1-5** である
- ここを厚くすると、ガイドの不足感よりも「理解のつながり」が改善される
- macro や package に行く前に、この層を固めた方が学習サイトとしての完成度は上がる

---

## 5. Priority 2: Common Lisp らしさを強める近接領域

ここは重要だが、Priority 1 を埋めてから進めた方が効果が高い。内容によっては、軽微な処理系確認や追加実装が必要になる。

| 優先 | 不足領域 | 位置づけ | 追加したい内容 | 依存度 |
|---|---|---|---|---|
| P2-1 | backquote / comma / reader notation | quote の次に理解させると Lisp の見え方が一段変わる | backquote、comma、reader 記法の整理と 4 から 6 問 | 中 |
| P2-2 | lambda list の拡張 | `&rest` だけでなく API 設計の感覚につながる | `&optional`、`&key`、引数設計、関数インタフェース問題 4 から 6 問 | 中 |
| P2-3 | generalized variable と place の考え方 | `setf` を「代入文」ではなく Common Lisp 的に理解するために必要 | `setf` の対象、更新パターン、破壊的操作の注意点 | 中 |
| P2-4 | multiple values | Common Lisp の実用感を上げる代表機能 | `values`、`multiple-value-bind`、戻り値設計の解説と演習 | 中 |
| P2-5 | array / vector / hash table の基礎 | list だけでは扱いにくいデータ構造へ進む入口になる | 配列・ベクタ・辞書的構造の比較、用途別問題 | 中から高 |

### Priority 2 の補足

- ここは「Lisp の入門サイト」から「Common Lisp 学習サイト」へ進める層である
- Priority 1 を飛ばしてここから厚くすると、トピック数は増えるが学習者の理解はつながりにくい

---

## 6. Priority 3: 後続で扱う上級 Common Lisp 領域

ここは Common Lisp を体系的に学ぶうえで重要だが、現状のサイトで最初に埋めるべき不足ではない。教材拡張だけでなく、処理系やモード設計も絡みやすい。

| 優先 | 不足領域 | 後回しにする理由 | 将来の扱い方 |
|---|---|---|---|
| P3-1 | package と symbol namespace | 重要だが、初学者の最初の価値はここでは決まらない | 教科書中盤以降で体系化する |
| P3-2 | macro / `defmacro` | Common Lisp の華だが、基礎理解なしでは難所になりやすい | 教科書上級編または拡張モードで扱う |
| P3-3 | condition system / restart | 実務では重要だが、入門体験の優先順位は高くない | 実践編で扱う |
| P3-4 | CLOS / generic function / method | 言語の幅を広げるが、現行学習モードの中心価値ではない | 上級編として分離する |
| P3-5 | stream / file / pathname | 静的学習サイトとの相性調整が必要 | 実処理系モードや将来の拡張で扱う |

---

## 7. 直近の推奨拡張順

次に学習範囲を広げるなら、順番は次の通りが望ましい。

1. **tree / alist を中心に Lisp 的データ処理を増やす**
2. **等価性、述語、型分岐の判断問題を増やす**
3. **状態変化、scope、closure の誤解しやすい箇所を増やす**
4. **読解 / デバッグ / 修正型問題を追加する**
5. 必要に応じて評価モデルと quote 系の補助例を継続強化する
6. その後に backquote、lambda list 拡張、multiple values へ進む
7. package、macro、CLOS はさらに後ろでよい

---

## 8. 最初の追加対象として妥当なテーマ

次の 1 バッチとしては、次の 5 テーマが妥当である。

1. tree 再帰と `assoc`
2. `eq` / `eql` / `equal` と真偽値
3. `let` / `let*` / `setf` / closure
4. 読解 / デバッグ / エラー修正
5. backquote / comma / reader notation

この 5 テーマを先に足すと、問題数を単に増やすよりも、学習サイトとしての「密度不足」の印象を大きく減らせる。