# Common Lisp 教科書ドラフト 第22章から第24章

**作成日**: 2026年5月4日  
**対象範囲**: 第22章 実践パターン / 第23章 Common Lisp の商用利用と応用分野 / 第24章 実装差と処理系ごとの違い  
**位置づけ**: 教科書本文の先行ドラフト

**関連文書**:
- [COMMON_LISP_TEXTBOOK_OUTLINE.md](./COMMON_LISP_TEXTBOOK_OUTLINE.md)
- [COMMON_LISP_TEXTBOOK_CH19_21.md](./COMMON_LISP_TEXTBOOK_CH19_21.md)
- [COMMON_LISP_TEXTBOOK_STYLE_GUIDE.md](./COMMON_LISP_TEXTBOOK_STYLE_GUIDE.md)
- [COMMON_LISP_FOUNDATIONS.md](./COMMON_LISP_FOUNDATIONS.md)

---

## この文書の読み方

この文書は、教科書の第22章から第24章に相当する本文ドラフトである。

各章では、次の 6 要素を揃える。

1. その章の結論
2. 基本概念の説明
3. 最小コード例
4. よくある誤解や落とし穴
5. Common Lisp 標準ではどう定義されるか
6. 参考 URL

---

## 第22章 実践パターン

### 1. この章の結論

Common Lisp の実践力は、単に「関数をたくさん書けること」からは生まれない。**macro による局所 DSL、CLOS による振る舞いの分離、sequence / list / pathname / stream を使った変換、condition system による回復可能な失敗処理を組み合わせることで、小さくても拡張しやすいアプリケーションを作れる**。これが第22章の結論である。

この章の核は次の 5 点である。

1. 実践パターンとは、個別ライブラリ名ではなく言語機能の組み合わせ方である
2. macro は対象領域固有の記法を局所的に与えるために使う
3. generic function は「データ構造」より「操作の入口」を中心に設計するのに向いている
4. データ変換は list / sequence 処理と pathname / stream 処理を分けて考えると整理しやすい
5. 条件処理を例外の置き換えとしてだけでなく、回復戦略の導線として扱うと実務向きになる

---

### 2. 実践パターンを見る観点

入門を終えたあとに重要なのは、「どのライブラリを覚えるか」よりも「何をどの抽象で表すか」である。Common Lisp は標準だけでも、次のような設計を組み立てやすい。

1. 入力を読み、内部表現へ正規化する
2. 正規化後の object に対して規則を適用する
3. 必要なら macro で対象領域用の記法を与える
4. 外部 I/O や利用者との接点で condition を処理する
5. package と file 単位で構成を分け、compile / load の流れを回す

この流れを意識すると、「Lisp らしさ」は mysterious な何かではなく、抽象化の置き方にあると分かる。

---

### 3. DSL とルール処理

Common Lisp が DSL に向くと言われる理由は、code が list 構造として扱いやすく、macro で syntax を増やせるからである。ただし、実務で有効なのは巨大な新言語を作ることではなく、**局所的に読みやすい form を導入すること**である。

たとえば、業務 rule を「ある object を受け取って条件を満たしたら更新する関数」と見れば、同じ形が何度も出てくる。そのとき macro は、その反復形を短くするのに向いている。

また、rule engine を大げさに考えすぎる必要はない。最初の一歩は、

1. 正規化済みの data structure を定める
2. 各 rule を普通の関数または lambda として並べる
3. rule の適用順序を list で管理する

という形で十分である。macro は、その rule 定義が何十個も並び始めてから導入しても遅くない。

---

### 4. データ変換、知識表現、小さなアプリケーション設計

Common Lisp の実践パターンとして頻出なのは、次の 3 つである。

#### 4.1 データ変換

CSV、JSON、S 式、設定 file、path 文字列などを内部表現に変換し、そこから表示用や保存用の形へ戻す。ここでは、入力形式と内部表現を分離するのが重要である。

#### 4.2 知識表現

状態や種類に応じて振る舞いが変わるなら、単純な if の連鎖より CLOS の generic function で操作の入口を揃えた方が整理しやすい。知識表現と言っても、最初は「class と generic function で対象 object を読む」程度から始めてよい。

#### 4.3 小さなアプリケーション設計

小さなアプリケーションでも、次の境界を意識すると壊れにくくなる。

1. 入出力層
2. 中核ロジック層
3. error / restart を扱う境界層
4. package / file 単位の build 層

この分離は、Web アプリケーションでも CLI ツールでもバッチ処理プログラムでも同じである。

---

### 5. 条件システムを含む実務的な組み立て

実践では、「失敗したら即座に落とす」だけでは扱いにくい場面が多い。入力が壊れている、外部 file が一時的に読めない、部分的に既定値で続行したい、といった要求があるからである。

Common Lisp の condition system は、ここで力を発揮する。重要なのは、

1. signal する場所
2. 受ける場所
3. 回復の選択肢を与える場所

を分離できることである。入門では `handler-case` を中心に覚えれば十分だが、実践では「失敗をどう回復するか」を API の一部として考える視点が役に立つ。

---

### 6. 最小コード例

第22章の最小例としては、次の 4 つで十分である。

```lisp
(defmacro define-rule (name (object) condition &body body)
  `(defun ,name (,object)
     (when ,condition
       ,@body)))

(defclass invoice ()
  ((amount :initarg :amount :reader invoice-amount)
   (status :initarg :status :accessor invoice-status)))

(define-rule mark-review (invoice)
  (> (invoice-amount invoice) 100000)
  (setf (invoice-status invoice) :review))
```

```lisp
(defclass csv-source ()
  ((path :initarg :path :reader source-path)))

(defclass api-source ()
  ((endpoint :initarg :endpoint :reader source-endpoint)))

(defgeneric load-records (source))

(defmethod load-records ((source csv-source))
  (list :from :csv :path (source-path source)))

(defmethod load-records ((source api-source))
  (list :from :api :endpoint (source-endpoint source)))
```

```lisp
(defun normalize-row (row)
  (list :id (getf row :id)
        :name (string-upcase (getf row :name))
        :amount (round (getf row :amount))))

(mapcar #'normalize-row
        '((:id 1 :name "alice" :amount 1000.2)
          (:id 2 :name "bob" :amount 900.8)))
```

```lisp
(defun safe-amount (text)
  (handler-case
      (parse-integer text)
    (error ()
      0)))
```

ここから見えることは次の通りである。

1. macro は繰り返しの定義形を短くするために使える
2. generic function は source ごとの振る舞い分岐を整理できる
3. データ変換は「入力を内部表現へ寄せる」段階として書ける
4. 条件処理は境界で default を与える設計と相性がよい

---

### 7. よくある誤解や落とし穴

#### 7.1 「Lisp らしい」コードとは最初から macro だと思ってしまう

ほとんどの場合、最初は関数と data structure で十分である。macro は反復形が見えてから導入する方が安全である。

#### 7.2 DSL を作ること自体が目的になってしまう

DSL は対象領域を読みやすくするための手段である。記法を増やした結果、debug や導入が難しくなるなら逆効果である。

#### 7.3 object 指向にすると class が中心になると思ってしまう

CLOS では generic function が振る舞いの入口である。class 階層だけを先に固めると設計を誤りやすい。

#### 7.4 condition system は try/catch の Lisp 版だと思ってしまう

`handler-case` だけを見るとそう見えるが、Common Lisp の condition system は handler と restart を分けて考えられる点に意味がある。

#### 7.5 小さなツールなら設計分離は不要だと思ってしまう

小さいプログラムでも、入力、中核ロジック、出力、失敗処理の境界を分けておくと、後で機能追加しやすい。

---

### 8. Common Lisp 標準ではどう定義されるか

第22章の重要点は、**「実践パターン」という章名自体は標準の用語ではないが、その土台となる部品の多くは ANSI Common Lisp 標準で定義されている**ということである。

とくに重要なのは次の点である。

1. macro expansion の仕組みは標準の evaluator と macro system によって支えられる
2. class、generic function、method は CLOS の標準要素として定義される
3. list / sequence / stream / pathname は標準の data processing と I/O の基礎を与える
4. `handler-case` や `restart-case` は condition system の標準的な入口である
5. どの実践パターンを採用するかは標準が決めるのではなく、標準部品をどう組み合わせるかで決まる

したがって、第22章は「新しい標準機能の章」ではなく、「これまで学んだ標準要素を、実際の設計としてどう束ねるか」を学ぶ章として読むべきである。

---

### 9. 参考 URL

- Common Lisp HyperSpec Macro DEFMACRO  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_defmac.htm#defmacro
- Common Lisp HyperSpec The Objects Dictionary  
  https://www.lispworks.com/documentation/HyperSpec/Body/c_object.htm
- Common Lisp HyperSpec Macro DEFCLASS  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_defcla.htm#defclass
- Common Lisp HyperSpec Macro DEFGENERIC  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_defgen.htm#defgeneric
- Common Lisp HyperSpec Macro DEFMETHOD  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_defmet.htm#defmethod
- Common Lisp HyperSpec Macro HANDLER-CASE  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_hand_1.htm#handler-case
- Common Lisp HyperSpec Macro RESTART-CASE  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_rst_ca.htm#restart-case
- Practical Common Lisp  
  https://gigamonkeys.com/book/
- On Lisp  
  https://www.paulgraham.com/onlisp.html
- Code for Paradigms of Artificial Intelligence Programming: Case Studies in Common Lisp  
  https://www.norvig.com/paip.html

---

## 第23章 Common Lisp の商用利用と応用分野

### 1. この章の結論

Common Lisp は「研究用にしか使われない言語」ではない。**公開資料から確認できる範囲だけでも、Web アプリケーション、設計支援、データ変換、知識処理、業務支援、AI、分析、教育用ツールなど、変化の多い対象領域で継続的に使われてきた**。ただし、利用実態の多くは社内システムや非公開プロジェクトに埋もれやすいので、公開事例は「全体の母集団」ではなく「どういう領域に向くかを示す観測点」として読む必要がある。

この章の核は次の 5 点である。

1. Common Lisp の商用価値は、言語の流行より問題との適合性で判断すべきである
2. 要件変化が多い領域、記号処理が絡む領域、規則や知識を明示したい領域と相性がよい
3. 公開事例は少なく見えても、処理系提供元の公開事例や歴史的記事から使われ方を読める
4. 日本語圏では公開一次資料が限られるため、断定よりも公開ソースに基づく読み方が重要である
5. 学習者は「どの会社が使っているか」だけでなく、「なぜその領域で採用されるのか」を見るべきである

---

### 2. 商用利用を支える性質

商用利用で Common Lisp が選ばれる場面には、いくつか共通点がある。

1. 要件変更が速い
2. 対象領域の知識を code に近い形で表したい
3. 試作版から運用 code へ連続的に育てたい
4. 対話的な開発環境による短い反復が効く
5. 一般的な CRUD だけでなく、推論、変換、最適化、設計支援、解析といった処理が入る

つまり、単に「Web が書けるか」や「DB に繋がるか」ではなく、**仕様変更と抽象化コストのバランス**で強みが出やすい。

---

### 3. どの応用分野で強みが出やすいか

公開資料ベースで見ると、Common Lisp の応用分野はかなり幅広い。

#### 3.1 Web と業務システム

Paul Graham の Viaweb の記事は、Web アプリケーションをサーバ側 Lisp で高速に作り込んだ歴史的事例として重要である。ここでは「サーバ上で自分たちが制御できるソフトウェアなら、実装言語を自由に選べる」という視点が明示されている。

#### 3.2 知識処理、AI、ルールベース処理

Franz の Allegro CL / AllegroGraph の公開資料では、記号的 AI、知識グラフ、規則、LLM 連携といった方向が強く打ち出されている。Common Lisp の柔軟な data / code 表現が、この種のアプリケーションと相性がよいことは理解しやすい。

#### 3.3 解析、設計支援、工学、教育

LispWorks の公開事例には、化学工学、株式取引、自然言語処理、信号処理、楽譜編集、公共安全など、多様な分野の例が並ぶ。ここから読み取るべきなのは「一つの流行分野だけに閉じない」という点である。

#### 3.4 データ変換と内部ツール

公開事例としては目立ちにくいが、Common Lisp は一括変換、知識管理、専用 editor、社内自動化のような、社内で効くツールを作る用途とも相性がよい。こうしたソフトウェアは公表されにくいので、外から見える件数だけで評価しにくい。

---

### 4. 公開事例をどう読むか

第23章では、商用利用を扇情的に語らないことが重要である。特定の会社名や国別の利用率を雑に並べても、教材としては精度が落ちるからである。

学習上は、公開一次資料を次のように読むとよい。

1. その事例で Common Lisp が何の課題を解いたのか
2. 開発速度、表現力、保守性のうち何が効いたのか
3. 実装差や処理系固有の機能が重要だったのか
4. その事例が言語自体の本質なのか、特定ベンダーの製品戦略なのか

また、日本での利用例については、公開された一次資料が英語圏より少ない。したがって、「日本では使われていない」あるいは「広く使われている」といった強い断定は避け、**公開資料が少ないこと自体を前提に、公開できる範囲の事例から用途の傾向を読む**のが安全である。

---

### 5. 小さく始める実装パターン

商用利用と言っても、最初から巨大 system を作る必要はない。Common Lisp では、次の順序で育てるのが自然である。

1. REPL で対象モデルを固める
2. file / package に分けて compile / load cycle を作る
3. batch job や CLI ツールとして境界を作る
4. 必要なら Web、GUI、DB、外部 process、knowledge graph へ接続する

この進み方は、PoC、社内ツール、研究用の試作版、商用製品の初期版まで連続している。ここが Common Lisp の強みの一つである。

---

### 6. 最小コード例

第23章の最小例としては、次の 3 つで十分である。

```lisp
(defclass order ()
  ((amount :initarg :amount :reader order-amount)
   (channel :initarg :channel :reader order-channel)))

(defgeneric route-order (order))

(defmethod route-order ((order order))
  (if (> (order-amount order) 10000)
      :manual-review
      :auto-approve))
```

```lisp
(defun normalize-order-row (row)
  (list :id (getf row :id)
        :customer (string-upcase (getf row :customer))
        :amount (round (getf row :amount))))
```

```lisp
(defun import-order-amount (text)
  (handler-case
      (parse-integer text)
    (error ()
      :invalid-input)))
```

ここから見えることは次の通りである。

1. 対象領域の操作は generic function で入口を揃えられる
2. 業務入力は正規化段階を別関数に切り出した方が安全である
3. 商用 code では「失敗したら終了」より「無効入力として扱う」分岐が重要になる

---

### 7. よくある誤解や落とし穴

#### 7.1 利用事例が少なく見えるので実務では使われないと思ってしまう

商用 code は非公開のことが多い。公開事例の少なさは、即座に不適性を意味しない。

#### 7.2 有名な歴史的事例だけで現在の全体像を判断してしまう

Viaweb は重要な歴史的事例だが、現代の利用領域はそれだけではない。処理系提供元の文書や公開事例も合わせて見るべきである。

#### 7.3 商用利用とは大企業導入の数で決まると思ってしまう

実際には、内部ツール、設計支援、分析系、教育系、研究開発系のソフトウェアも重要である。商用価値は公開された企業名の数だけでは測れない。

#### 7.4 Common Lisp を使えば自動的に開発が速くなると思ってしまう

言語特性だけでは不十分で、problem decomposition、REPL 活用、package 設計、build 運用も必要である。

#### 7.5 日本語圏の公開情報が少ないことを、利用実態がゼロである根拠だと思ってしまう

この推論は危険である。公開資料が限られるなら、断定ではなく「確認可能な範囲」を明示して書くべきである。

---

### 8. Common Lisp 標準ではどう定義されるか

第23章で扱う「商用利用」や「応用分野」は、当然ながら ANSI Common Lisp 標準が直接規定する主題ではない。標準が規定するのは言語の意味論と中核機能であり、どの市場でどう使うかは言語仕様の外の話である。

それでも、この章が標準と無関係なわけではない。重要なのは次の点である。

1. 実務で効く抽象化の多くは、macro、CLOS、condition system、package system、stream / pathname など標準要素の上に成り立つ
2. 商用利用で本当に差が出るのは、標準部分の強さと処理系実装・周辺環境の組み合わせである
3. したがって「商用利用章」は、標準を離れた雑談ではなく、標準の力がどう実際のアプリケーションに接続されるかを見る章である

第23章は、「標準の外側の世界で Common Lisp がどう働くか」を公開資料ベースで読む章として位置づけるのが適切である。

---

### 9. 参考 URL

- Beating the Averages  
  https://www.paulgraham.com/avg.html
- LispWorks Product Information  
  https://www.lispworks.com/products/lispworks.html
- LispWorks Success Stories  
  https://www.lispworks.com/success-stories/index.html
- Allegro Common Lisp  
  https://franz.com/products/allegrocl/
- AllegroGraph - AllegroGraph  
  https://franz.com/agraph/allegrograph/
- Practical Common Lisp  
  https://gigamonkeys.com/book/

---

## 第24章 実装差と処理系ごとの違い

### 1. この章の結論

ANSI Common Lisp は移植性の土台を与えるが、**実際の開発体験と運用形態は処理系ごとにかなり違う**。どこまでが標準で、どこからが実装固有なのかを見分けられないと、移植できるはずのコードを不必要に壊したり、逆に処理系固有の機能に依存しているのに移植可能だと思い込んだりする。これが第24章の結論である。

この章の核は次の 5 点である。

1. 標準は中核言語を定めるが、delivery、FFI、threads、IDE、debugger、image 操作などは処理系差が大きい
2. SBCL、CCL、CLISP、LispWorks、Allegro CL は、それぞれ強みと前提が違う
3. 移植可能なコードは「処理系差をなくす」のでなく、「差が出る境界を隔離する」ことで作る
4. FASL、core、saved image などのビルド成果物は通常は移植できない
5. 実装選定は好みだけでなく、プラットフォーム、delivery、運用、ライブラリ、保守性の要求で決めるべきである

---

### 2. どこまでが標準で、どこからが実装依存か

学習者が最初に押さえるべきなのは、Common Lisp には少なくとも 3 層あるということだ。

1. ANSI Common Lisp 標準で定義される層
2. 多くの処理系で似た慣習があるが、標準ではない層
3. 処理系固有の拡張層

標準で定義されるのは、評価モデル、macro 展開、CLOS の中核、condition system、package system、sequence、pathnames、stream などである。

一方で、次のようなものは処理系差が大きい。

1. image 保存と executable delivery
2. thread API
3. FFI の細部
4. external-format 名や文字コード運用
5. socket、OS interface、profiler、inspector、IDE
6. 実装固有の package と拡張機能

ここを曖昧にしたまま実装を進めると、後で「標準だと思っていたものが実は処理系固有の API だった」という問題が起きやすい。

---

### 3. 代表的な処理系の見方

#### 3.1 SBCL

SBCL manual は ANSI conformance、extensions、idiosyncrasies を明示的に整理している。compiler、threading、external formats、FFI、package locks、profiling などの documentation が厚く、open source 実装としての情報量が多い。生成 artifact や implementation-specific extension の扱いを理解しながら使うのに向いている。

#### 3.2 CCL

Clozure CL documentation は、threads、sockets、subprocesses、Gray Streams、MOP、FFI、platform-specific notes、application builder を章立てで整理している。heap image や kernel、IDE、Objective-C bridge など、実装構造を含めて理解したいときに有益である。

#### 3.3 CLISP

GNU CLISP の公式 site は ANSI Common Lisp implementation であること、implementation notes があること、project の公開形態や current version を示している。教育用や移植性観察の素材としては有益だが、現代的な運用面を検討する際は release cadence や周辺環境も合わせて見る必要がある。

#### 3.4 LispWorks

LispWorks は複数 platform 対応の implementation と IDE、CAPI、delivery、商用 edition を含めた product として位置づけられている。documentation と product information がまとまっており、GUI、delivery、enterprise integration を含めた選定を考えるときに見やすい。

#### 3.5 Allegro CL

Allegro CL は記号的 AI、knowledge graph 連携、delivery、debugging / IDE、database / web / interoperability を含む商用 platform として説明されている。AllegroGraph との組み合わせや enterprise 向けの位置づけを含めて読むと、商用ベンダー実装の考え方が見えやすい。

---

### 4. 移植可能なコードの考え方

移植可能なコードを書くときに重要なのは、「どの処理系でも完全に同じ内部実装にする」ことではない。重要なのは、差が出る場所を制御することである。

実務では次の方針が有効である。

1. 中核ロジックは標準 Common Lisp へ寄せる
2. threads、FFI、delivery、OS 依存 I/O は境界 package に隔離する
3. 実装判定は少数の箇所に閉じ込める
4. FASL や saved image を他処理系や他 version 間で持ち回らない
5. 早い段階で複数実装で簡単な動作確認を回す

reader conditional や `*features*` は便利だが、アプリケーション全体に散らばると保守しづらい。数を増やすより、実装ごとの切替ファイルに集約した方がよい。

---

### 5. 処理系選定の観点

第24章では、処理系の優劣を一つの軸で決めないことが大事である。選定では少なくとも次を確認すべきである。

1. target OS と CPU
2. image / executable delivery の要件
3. threads、sockets、FFI の必要度
4. IDE や debugger をどこまで重視するか
5. 商用 support が必要か
6. 対象 deployment に合わせたライブラリや周辺環境があるか

学習者にとっては、最初の 1 実装に慣れたあと、もう 1 実装で同じ code を試す経験が重要である。そこで初めて、標準部分と処理系固有部分の境界が見えてくる。

---

### 6. 最小コード例

第24章の最小例としては、次の 3 つで十分である。

```lisp
(defparameter *implementation*
  (cond
    ((member :sbcl *features*) :sbcl)
    ((member :ccl *features*) :ccl)
    ((member :clisp *features*) :clisp)
    ((member :lispworks *features*) :lispworks)
    ((member :allegro *features*) :allegro)
    (t :unknown)))
```

```lisp
(defun compile-and-load-portably (source)
  (multiple-value-bind (output warnings failure)
      (compile-file source)
    (declare (ignore warnings))
    (unless failure
      (load output))))
```

```lisp
(defun implementation-note ()
  #+sbcl "Use SBCL-specific extensions only behind a wrapper."
  #+ccl "Keep heap image and platform notes in mind."
  #+clisp "Check implementation notes before relying on extensions."
  #+lispworks "Separate portable code from delivery-specific code."
  #+allegro "Isolate vendor APIs and product-specific integration."
  #-(or sbcl ccl clisp lispworks allegro)
  "Treat implementation-specific behavior as unknown until documented.")
```

ここから見えることは次の通りである。

1. 処理系判定は `*features*` か reader conditional に集約できる
2. `compile-file` と `load` の中核部分は標準である
3. 実装依存の注意点は薄い wrapper や adapter に閉じ込めるべきである

---

### 7. よくある誤解や落とし穴

#### 7.1 ANSI Common Lisp ならすべての挙動が同じだと思ってしまう

標準が定める範囲は広いが、delivery、threading、FFI、debugger、external format などは処理系差が大きい。

#### 7.2 FASL や saved image は持ち運べると思ってしまう

通常は version や implementation に依存する。build artifact を binary interchange format のように扱うのは危険である。

#### 7.3 reader conditional をあちこちに書けば移植可能になると思ってしまう

分岐が散るほど保守性は落ちる。標準寄りの中核部分と切替層に分ける方がよい。

#### 7.4 一つの実装で動いたので標準準拠だと思ってしまう

その code が implementation extension の上に立っている可能性は常にある。別実装での簡単な動作確認が有効である。

#### 7.5 処理系選定を好みだけで決めてしまう

実際には OS、support、delivery、IDE、運用条件の方が重要である。

---

### 8. Common Lisp 標準ではどう定義されるか

第24章の要点は、標準が移植性の基準面を与える一方で、implementation-defined や implementation-dependent な余地も明確に残しているということである。

とくに重要なのは次の点である。

1. `compile-file` は implementation-dependent な compiled file を生成する
2. `load` の filespec 解決や compiled file の扱いには実装依存部分がある
3. reader と `*features*` は処理系差の分岐を扱うときの基礎になる
4. 実装拡張の存在自体は標準違反ではなく、標準の外側に追加される層である
5. 移植可能なコードの設計とは、標準を守るだけでなく、標準外を明示的に隔離することである

したがって、第24章は「どの実装が正しいか」を競う章ではなく、「標準の上に複数の実装がどう乗るか」を理解する章として読むべきである。

---

### 9. 参考 URL

- Common Lisp HyperSpec Function COMPILE-FILE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_cmp_fi.htm#compile-file
- Common Lisp HyperSpec Function LOAD  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_load.htm#load
- Common Lisp HyperSpec Chapter 23 Reader  
  https://www.lispworks.com/documentation/HyperSpec/Body/23_.htm
- Common Lisp HyperSpec Special Operator EVAL-WHEN  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_eval_w.htm#eval-when
- SBCL User Manual  
  https://www.sbcl.org/manual/
- Clozure CL Documentation  
  https://ccl.clozure.com/manual/
- CLISP - an ANSI Common Lisp Implementation  
  https://clisp.sourceforge.io/
- LispWorks Documentation  
  https://www.lispworks.com/documentation/
- LispWorks Product Information  
  https://www.lispworks.com/products/lispworks.html
- Allegro Common Lisp  
  https://franz.com/products/allegrocl/