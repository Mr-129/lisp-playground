# Common Lisp 教科書ドラフト 第19章から第21章

**作成日**: 2026年5月2日  
**対象範囲**: 第19章 file、pathname、外部資源 / 第20章 コンパイル、宣言、型、最適化 / 第21章 プロジェクト構成とエコシステム  
**位置づけ**: 教科書本文の先行ドラフト

**関連文書**:
- [COMMON_LISP_TEXTBOOK_OUTLINE.md](./COMMON_LISP_TEXTBOOK_OUTLINE.md)
- [COMMON_LISP_TEXTBOOK_CH16_18.md](./COMMON_LISP_TEXTBOOK_CH16_18.md)
- [COMMON_LISP_FOUNDATIONS.md](./COMMON_LISP_FOUNDATIONS.md)

---

## この文書の読み方

この文書は、教科書の第19章から第21章に相当する本文ドラフトである。

各章では、次の 6 要素を揃える。

1. その章の結論
2. 基本概念の説明
3. 最小コード例
4. よくある誤解や落とし穴
5. Common Lisp 標準ではどう定義されるか
6. 参考 URL

---

## 第19章 file、pathname、外部資源

### 1. この章の結論

Common Lisp の file I/O は、単に「文字列でファイル名を書いて読む」仕組みではない。**pathname が file の場所を表す抽象表現であり、`open` が stream を作り、`with-open-file` が resource 管理を安全にする**。この見方が入ると、`open`、`close`、`probe-file`、`make-pathname`、`merge-pathnames` がばらばらの API ではなく、ひとつの file model として見える。

この章の核は次の 5 点である。

1. pathname は単なる文字列ではなく、file の場所を表す structured object である
2. file を読む書く操作は、最終的には stream を通じて行う
3. `open` と `close` を手で扱えるが、通常は `with-open-file` を使う方が安全である
4. `probe-file` は「存在確認して必要なら truename を得る」ための基本手段である
5. path の書式、host / device の扱い、文字コード指定の細部は処理系や OS に依存しうる

---

### 2. pathname と pathspec

Common Lisp では、file の位置を pathname として扱う。学習上重要なのは、pathname を単なる OS 依存文字列として扱い切らないことだ。

```lisp
(pathname "data/example.txt")
```

この式は、文字列から pathname object を得る最小例である。

また、pathname は component ごとに組み立てることもできる。

```lisp
(make-pathname :directory '(:relative "data")
               :name "example"
               :type "txt")
```

このように考えると、「directory」「name」「type」といった構造を明示的に扱える。実務では文字列連結で path を作るより、pathname 操作で不足 component を埋める方が読みやすく、処理系差も吸収しやすい。

---

### 3. `open`、`close`、`with-open-file`

file I/O の中心は stream である。`open` は file から stream を作り、`close` はその stream を閉じる。

```lisp
(with-open-file (in "data.txt" :direction :input)
  (read-line in nil :eof))
```

この例では、`with-open-file` が input stream を作り、body の評価後に stream を閉じる。

書き込み側の最小例は次の通りである。

```lisp
(with-open-file (out "result.txt"
                     :direction :output
                     :if-exists :supersede
                     :if-does-not-exist :create)
  (write-line "hello" out))
```

入門段階では、次の 3 つをまず固めるとよい。

1. `:direction` で input / output を指定する
2. 出力時は `:if-exists` を明示する
3. 明確な理由がない限り `open` と `close` を手で対にするより `with-open-file` を使う

---

### 4. 存在確認と path の合成

file の存在確認と path の補完には、`probe-file` や `merge-pathnames` を使う。

```lisp
(probe-file "result.txt")
```

`probe-file` は、file が存在しなければ `nil` を返し、存在すればその file の truename を返す。したがって、単なる boolean というより、「存在確認と truename の取得」を兼ねた API として理解した方がよい。

```lisp
(merge-pathnames "config.lisp" #p"project/")
```

`merge-pathnames` は、不足している component を default 側から補う。pathname を構造として扱う利点が、ここで分かりやすく現れる。

---

### 5. 外部資源と実装差

file system は Lisp 単体では完結しない外部資源なので、Common Lisp 標準だけでは固定しきれない部分がある。

たとえば、次のような点は処理系や OS に依存しやすい。

1. Windows と Unix 系での path 表現の見え方
2. host / device / directory component の扱い
3. text file の文字コード名や `external-format` 指定の細部
4. compiled file や logical pathname の運用慣習

したがって、第19章では「標準が抽象的に何を保証するか」と「実際の file system による差」を分けて読む必要がある。

---

### 6. 最小コード例

第19章の最小例としては、次の 4 つで十分である。

```lisp
(pathname "data/example.txt")
```

```lisp
(make-pathname :directory '(:relative "data")
               :name "example"
               :type "txt")
```

```lisp
(with-open-file (in "data.txt" :direction :input)
  (read-line in nil :eof))
```

```lisp
(probe-file "data.txt")
```

ここから見えることは次の通りである。

1. pathname は object として組み立てられる
2. file I/O は stream を通じて行う
3. `with-open-file` は resource 管理の基本形である
4. `probe-file` は存在確認と truename 取得を兼ねる

---

### 7. よくある誤解や落とし穴

#### 7.1 pathname は単なる文字列だと思ってしまう

Common Lisp では pathname は抽象的な file 位置表現である。文字列連結だけで扱い続けると、移植性と可読性が落ちやすい。

#### 7.2 `open` したら明示的に `close` しなくてもよいと思ってしまう

GC に頼るより、`with-open-file` でスコープを切って resource を閉じる方が正しい。

#### 7.3 `probe-file` はただの true / false を返すと思ってしまう

`probe-file` は存在時に truename を返す。返り値に path 情報が含まれる点が重要である。

#### 7.4 path 表記や文字コード指定はどの処理系でも同じだと思ってしまう

この部分は実装差が出やすい。教材では abstract model を理解し、実務では対象処理系の manual を確認する必要がある。

---

### 8. Common Lisp 標準ではどう定義されるか

この章の仕様上の土台は、pathname 関連 operator と files dictionary にある。

とくに重要なのは次の点である。

1. pathname は file の場所を表す標準 object であり、component 単位で扱える
2. file 操作は pathname designator を受け取り、host file system と相互作用する
3. `open` は file stream を確立し、`close` はその stream を閉じる
4. `with-open-file` は stream を確立し、body の後で close する標準的な形を提供する
5. `probe-file` は存在時に physical truename を返し、不在時に `nil` を返す
6. file system の詳細、path 解釈、外部形式の実際の運用には実装依存部分が残る

したがって、第19章は「ファイル名を文字列で渡す章」ではなく、「pathname と stream を介して外部資源をどう安全に扱うか」を学ぶ章として読むべきである。

---

### 9. 参考 URL

- Common Lisp HyperSpec Function OPEN  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_open.htm#open
- Common Lisp HyperSpec Macro WITH-OPEN-FILE  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_w_open.htm#with-open-file
- Common Lisp HyperSpec Function CLOSE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_close.htm#close
- Common Lisp HyperSpec Type PATHNAME  
  https://www.lispworks.com/documentation/HyperSpec/Body/a_pn.htm#pathname
- Common Lisp HyperSpec Function MAKE-PATHNAME  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_mk_pn.htm#make-pathname
- Common Lisp HyperSpec Function MERGE-PATHNAMES  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_merge_.htm#merge-pathnames
- Common Lisp HyperSpec Function PROBE-FILE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_probe_.htm#probe-file
- Common Lisp HyperSpec Function TRUENAME  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_tn.htm#truename
- Common Lisp HyperSpec The Files Dictionary  
  https://www.lispworks.com/documentation/HyperSpec/Body/c_files.htm

---

## 第20章 コンパイル、宣言、型、最適化

### 1. この章の結論

Common Lisp は「REPL で逐次解釈するだけの言語」ではない。**`compile` は関数を、`compile-file` はソースファイルを compile し、`load` はその成果を current image に取り込む**。さらに `declare` や `optimize` は compiler に意図を伝える仕組みであり、性能・安全性・debug 性の兼ね合いを明示的に扱える。

この章の核は次の 5 点である。

1. `compile` は関数単位の compile を扱う
2. `compile-file` はソースファイルを implementation-dependent な compiled file に変換する
3. `load` は source / compiled file を Lisp image に読み込む
4. `declare` の type / optimize は compiler への意図表明であり、単なる comment ではない
5. 最適化の実際の効き方は処理系依存であり、移植可能なのは兼ね合いの枠組みまでである

---

### 2. `compile` と `compile-file`

まず、`compile` と `compile-file` は対象が違う。

```lisp
(defun square (x)
  (* x x))

(compile 'square)
```

この例では、`square` という関数定義を compile する。

一方、file 単位では `compile-file` を使う。

```lisp
(multiple-value-bind (output warnings failure)
    (compile-file "app.lisp")
  (declare (ignore warnings))
  (when (and output (not failure))
    (load output)))
```

重要なのは、`compile-file` が単に `load` の高速版ではないことだ。`compile-file` は compiled artifact を作り、`load` はその artifact もしくは source を image に取り込む。役割が分かれている。

---

### 3. `load` と image の更新

`load` は file を current Lisp environment に読み込む標準関数である。

```lisp
(load "app.lisp")
```

学習上重要なのは、`load` が「別 process を起動する」のではなく、**今動いている Lisp image を更新する**ことだ。そのため、`defun`、`defparameter`、`defclass` などの top-level form は、読み込み後の session にそのまま反映される。

また、HyperSpec が明記している通り、filespec が不完全なときにソースファイルと compiled file のどちらを選ぶかは implementation-dependent である。したがって、「`load "foo"` は必ず source を読む」と決めつけるのは危険である。

---

### 4. `declare`、型宣言、`optimize`

`declare` は compiler に追加情報を与える仕組みである。第20章では、とくに type declaration と optimize declaration が重要になる。

```lisp
(defun add-fixnums (a b)
  (declare (type fixnum a b)
           (optimize (speed 2) (safety 3) (debug 3)))
  (+ a b))
```

この例では、`a` と `b` が `fixnum` だと宣言しつつ、speed / safety / debug の優先度を compiler に伝えている。

ここで大事なのは、宣言を「必ず runtime check を入れる命令」と思わないことだ。宣言は compiler が code generation や check 方針を決める材料であり、特に `safety` を下げたときは誤った宣言が深刻な不整合を生みうる。

---

### 5. `eval-when`

file compilation では、「compile 時に必要な定義」と「load 時に必要な定義」を区別しなければならないことがある。その調整に使うのが `eval-when` である。

```lisp
(eval-when (:compile-toplevel :load-toplevel :execute)
  (defmacro dbg (form)
    `(format t "~S => ~S~%" ',form ,form)))
```

このような形を使う理由は、後続の top-level form を compile する時点で `dbg` macro が必要になるからである。

第20章で `eval-when` が難しく見えるのは当然だが、最初は次の読み方で十分である。

1. compile-file 中に必要な定義なら `:compile-toplevel` が関係する
2. load 時にも必要なら `:load-toplevel` が関係する
3. REPL 直接評価でも使いたいなら `:execute` も含める

---

### 6. 最小コード例

第20章の最小例としては、次の 4 つで十分である。

```lisp
(defun square (x)
  (* x x))

(compile 'square)
```

```lisp
(multiple-value-bind (output warnings failure)
    (compile-file "app.lisp")
  (declare (ignore warnings))
  (when (and output (not failure))
    (load output)))
```

```lisp
(defun add-fixnums (a b)
  (declare (type fixnum a b)
           (optimize (speed 2) (safety 3) (debug 3)))
  (+ a b))
```

```lisp
(eval-when (:compile-toplevel :load-toplevel :execute)
  (defmacro dbg (form)
    `(format t "~S => ~S~%" ',form ,form)))
```

ここから見えることは次の通りである。

1. `compile` は関数単位で使える
2. `compile-file` と `load` は file 単位の build / load cycle を作る
3. 宣言は compiler に type と optimization policy を伝える
4. `eval-when` は compile-time / load-time / execute-time の境界を制御する

---

### 7. よくある誤解や落とし穴

#### 7.1 `compile` と `compile-file` は同じだと思ってしまう

前者は関数単位、後者は file 単位である。対象も返り値の意味も違う。

#### 7.2 `load "foo"` は必ずソースファイルを読むと思ってしまう

filespec が不完全な場合、source / compiled file の選択は処理系依存になる。

#### 7.3 type declaration は必ず安全な runtime check になると思ってしまう

宣言は compiler への情報であり、低 safety 設定では誤った宣言が危険になりうる。

#### 7.4 `optimize` を強くすれば、どの処理系でも同じように速くなると思ってしまう

`speed`、`safety`、`debug`、`space`、`compilation-speed` という枠組みは標準化されているが、実際の code generation は実装依存である。

#### 7.5 `eval-when` を使わなくても macro 定義は常に compile 時に見えると思ってしまう

file compilation の境界では、compile-time に必要な定義を明示しないと意図通りに動かないことがある。

---

### 8. Common Lisp 標準ではどう定義されるか

この章の仕様上の土台は、evaluation / compilation 関連 operator と declaration 関連規定にある。

とくに重要なのは次の点である。

1. `compile` は関数または lambda expression を compiled function に変換し、warning / failure 情報も返す
2. `compile-file` はソースファイルを implementation-dependent な compiled file に変換し、output pathname と状態を返す
3. `load` は file を current Lisp environment に読み込み、filespec の解決には implementation-dependent な部分がある
4. `declare` は lexical scope 内で有効な declaration を与える
5. `optimize` は `speed`、`safety`、`debug`、`space`、`compilation-speed` といった quality を指定する
6. `eval-when` は top-level form が compile 時、load 時、実行時のどこで評価されるかを制御する

したがって、第20章は「速くするためのおまじない集」ではなく、「Common Lisp が compile / load と declaration をどう言語モデルに組み込んでいるか」を学ぶ章として読むべきである。

---

### 9. 参考 URL

- Common Lisp HyperSpec Function COMPILE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_cmp.htm#compile
- Common Lisp HyperSpec Function COMPILE-FILE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_cmp_fi.htm#compile-file
- Common Lisp HyperSpec Function LOAD  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_load.htm#load
- Common Lisp HyperSpec Special Operator EVAL-WHEN  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_eval_w.htm#eval-when
- Common Lisp HyperSpec Special Operator DECLARE  
  https://www.lispworks.com/documentation/HyperSpec/Body/s_declar.htm#declare
- Common Lisp HyperSpec Declaration OPTIMIZE  
  https://www.lispworks.com/documentation/HyperSpec/Body/d_optimi.htm#optimize
- Common Lisp HyperSpec Section 3.2.3 File Compilation  
  https://www.lispworks.com/documentation/HyperSpec/Body/03_bc.htm

---

## 第21章 プロジェクト構成とエコシステム

### 1. この章の結論

Common Lisp でプロジェクトを組むときは、**ANSI Common Lisp が標準化している土台と、実務で広く使われているエコシステムを分けて理解する**ことが重要である。標準が与えるのは package、`load`、`require` / `provide` といった基礎であり、実際の system 定義や依存関係管理には ASDF と Quicklisp が事実上の標準として使われることが多い。

この章の核は次の 5 点である。

1. 名前空間の土台は `defpackage` と `in-package` にある
2. 複数ファイルのプロジェクトの build / load には ASDF が事実上の標準である
3. ライブラリの取得と導入には Quicklisp が広く使われる
4. `require` / `provide` は標準にあるが非推奨であり、現代的なプロジェクト構成全体を置き換えるものではない
5. テスト、デバッグ、エディタ連携は ANSI 標準ではなく、処理系やエコシステムの層に属する

---

### 2. package 構成が土台になる

Common Lisp のプロジェクトでは、まず package 境界を明示する。

```lisp
(defpackage #:my-app
  (:use #:cl)
  (:export #:main))

(in-package #:my-app)

(defun main ()
  (format t "hello~%"))
```

入門段階では、`package.lisp` に `defpackage`、その後のソースファイルに `in-package` と本体を書く構成が分かりやすい。ここで重要なのは、「directory 構成」より先に「symbol がどの package に属するか」を決めることだ。

---

### 3. ASDF による system 定義

ASDF は Common Lisp の事実上の標準 build 機能であり、ソースファイル群をひとつの system として記述し、compile / load の順序や依存関係を管理する。

```lisp
(asdf:defsystem #:my-app
  :serial t
  :components ((:file "package")
               (:file "main")))
```

この例は小さな system の最小形である。ASDF の要点は次の通りである。

1. プロジェクトを system 単位で定義する
2. component と dependency に基づいて compile / load の計画を作る
3. package や macro を先に読み込む必要がある、という Common Lisp 特有の順序問題を整理できる

教材としては、まず「複数ファイルを正しい順序で load するための記述」と理解すれば十分である。

---

### 4. Quicklisp によるライブラリ管理

Quicklisp は Common Lisp のライブラリ管理手段であり、配布されている system を download、install、load するために使われる。

```lisp
(ql:quickload "alexandria")
```

Quicklisp の初回導入では quickstart file を一度 load して install を実行し、その後の日常的な利用では `ql:quickload` を使う。

ここで重要なのは、Quicklisp が ASDF を置き換えるのではなく、**依存ライブラリを取得したうえで ASDF に system を load させる立場**だという点である。したがって、プロジェクトの構成とライブラリの取得は別の層だと整理すると混乱しにくい。

---

### 5. `require` / `provide`、テスト、デバッグの位置づけ

Common Lisp 標準には `require` と `provide` があるが、これらは `*modules*` を介した module 管理の仕組みであり、HyperSpec でも deprecated とされている。さらに、何を module 名として認識するか、どこから探すか、といった運用は処理系依存になりやすい。そのため、移植可能なプロジェクト構成の中心には ASDF を置く方が現実的である。

また、unit test framework、debugger の UI、editor 連携、live reload の作法などは ANSI Common Lisp の仕様範囲外である。実務では次のような流れが一般的になる。

1. REPL から system を load する
2. 必要なライブラリを Quicklisp で導入する
3. condition が起きたら処理系 debugger で調べる
4. 関数や method を再定義して短い反復で試す

つまり第21章は、「標準仕様が終わる地点」と「実際の開発文化が始まる地点」をつなぐ章である。

---

### 6. 最小コード例

第21章の最小例としては、次の 3 つで十分である。

```lisp
(defpackage #:my-app
  (:use #:cl)
  (:export #:main))

(in-package #:my-app)
```

```lisp
(asdf:defsystem #:my-app
  :serial t
  :components ((:file "package")
               (:file "main")))
```

```lisp
(ql:quickload "alexandria")
```

ここから見えることは次の通りである。

1. プロジェクトの最小単位は package と system である
2. ASDF はソースファイル群を system として読み込む
3. Quicklisp は外部ライブラリを取得して使えるようにする

---

### 7. よくある誤解や落とし穴

#### 7.1 package は directory 名や file 名のことだと思ってしまう

package は symbol の名前空間であり、filesystem 上の folder とは別概念である。

#### 7.2 Quicklisp が build system だと思ってしまう

Quicklisp はライブラリ管理手段であり、system 定義と load の計画の中心は ASDF にある。

#### 7.3 `require` / `provide` だけで移植可能なプロジェクトを管理できると思ってしまう

小規模な用途では使えても、これらは deprecated でもあり、プロジェクト全体の依存関係と読み込み順を明示するには ASDF の方が適している。

#### 7.4 テストやデバッグの流れも ANSI Common Lisp が全部規定していると思ってしまう

この領域はエコシステムと処理系文化の部分が大きい。標準だけでは完結しない。

#### 7.5 package 定義より先に本体 file を load してしまう

複数ファイルのプロジェクトでは、package や macro を先に定義する読み込み順が重要になる。ここを ASDF に任せる意味は大きい。

---

### 8. Common Lisp 標準ではどう定義されるか

この章の仕様上の土台は package system と file loading にあり、ASDF や Quicklisp 自体は ANSI Common Lisp 標準の外にある。

とくに重要なのは次の点である。

1. `defpackage` と `in-package` は package を定義し、その package を current package にする標準 operator である
2. `load` は file を current Lisp environment に取り込む標準関数である
3. `require` と `provide` は標準にあるが deprecated であり、module の探し方や実際の運用には処理系依存部分がある
4. ASDF は ANSI 標準ではないが、Common Lisp ソフトウェアを build / load する事実上の標準機能である
5. Quicklisp も ANSI 標準ではなく、エコシステム側のライブラリ配布 / installation の仕組みである
6. テスト framework、debugger UI、editor integration は標準仕様ではなく処理系や外部 tool の層に属する

したがって、第21章は「Common Lisp 標準の章」であると同時に、「標準だけでは足りない部分をどうエコシステムが補っているか」を学ぶ章として読むべきである。

---

### 9. 参考 URL

- Common Lisp HyperSpec Macro DEFPACKAGE  
  https://www.lispworks.com/documentation/HyperSpec/Body/m_defpkg.htm#defpackage
  https://www.lispworks.com/documentation/HyperSpec/Body/m_in_pkg.htm#in-package
- Common Lisp HyperSpec Function REQUIRE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_provid.htm#require
- Common Lisp HyperSpec Function PROVIDE  
  https://www.lispworks.com/documentation/HyperSpec/Body/f_provid.htm#provide
  https://www.lispworks.com/documentation/HyperSpec/Body/f_load.htm#load
- ASDF Official Site  
  https://asdf.common-lisp.dev/
- ASDF Manual  
  https://asdf.common-lisp.dev/asdf.html
- ASDF Manual Using ASDF  
  https://common-lisp.net/project/asdf/asdf/Using-ASDF.html
- ASDF Manual Defining Systems with defsystem  
  https://common-lisp.net/project/asdf/asdf/Defining-systems-with-defsystem.html
- Quicklisp Official Site  
  https://www.quicklisp.org/beta/
