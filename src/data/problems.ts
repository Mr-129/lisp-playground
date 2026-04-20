import { Problem } from '../types';

export const problems: Problem[] = [
  // ===== 基本構文 =====
  {
    id: 'basic-01',
    title: '初めてのS式',
    category: '基本構文',
    difficulty: 'beginner',
    description: `## S式（S-expression）

Lispのプログラムはすべて **S式** で書かれます。
S式は括弧 \`()\` で囲まれた式です。

\`\`\`lisp
(+ 1 2)     ; => 3
(* 3 4)     ; => 12
\`\`\`

**前置記法**: 演算子が最初に来ます。

### 問題
\`(+ 10 20)\` の結果が 30 になることを確認し、
\`(* 5 6)\` の結果を出力してください。`,
    hint: '(print ...) で値を出力できます',
    initialCode: '; 足し算\n(print (+ 10 20))\n\n; ここに掛け算を書いてください\n',
    expectedOutput: '30\n30\n',
    expectedReturnValue: '30',
    solution: '(print (+ 10 20))\n(print (* 5 6))',
  },
  {
    id: 'basic-02',
    title: '変数の定義',
    category: '基本構文',
    difficulty: 'beginner',
    description: `## 変数の定義

\`defvar\` でグローバル変数を定義します。
\`setq\` で変数に値を代入します。

\`\`\`lisp
(defvar *name* "Lisp")
(setq x 42)
\`\`\`

### 問題
変数 \`*greeting*\` に "Hello, Lisp!" という文字列を定義し、
\`print\` で出力してください。`,
    hint: '(defvar *greeting* "Hello, Lisp!") のように書きます',
    initialCode: '; 変数を定義して出力してください\n',
    expectedOutput: '"Hello, Lisp!"\n',
    solution: '(defvar *greeting* "Hello, Lisp!")\n(print *greeting*)',
  },
  {
    id: 'basic-03',
    title: '関数の定義',
    category: '基本構文',
    difficulty: 'beginner',
    description: `## 関数の定義（defun）

\`defun\` で関数を定義します。

\`\`\`lisp
(defun square (x)
  (* x x))

(square 5)  ; => 25
\`\`\`

### 問題
2つの引数を受け取り、その合計を返す関数 \`add\` を定義し、
\`(add 3 7)\` の結果を出力してください。`,
    hint: '(defun add (a b) (+ a b)) のように定義します',
    initialCode: '; add 関数を定義してください\n\n; テスト\n; (print (add 3 7))\n',
    expectedOutput: '10\n',
    expectedReturnValue: '10',
    solution: '(defun add (a b)\n  (+ a b))\n(print (add 3 7))',
  },

  // ===== 条件分岐 =====
  {
    id: 'cond-01',
    title: 'if式',
    category: '条件分岐',
    difficulty: 'beginner',
    description: `## if式

\`if\` は条件分岐の基本形です。

\`\`\`lisp
(if (条件) 
    真の場合の値
    偽の場合の値)
\`\`\`

NIL は偽、それ以外はすべて真です。

### 問題
引数が正の数なら "positive"、そうでなければ "non-positive" を返す
関数 \`check-sign\` を定義してください。`,
    hint: '(plusp n) で正の数か判定できます',
    initialCode: '; check-sign 関数を定義してください\n\n; テスト\n; (print (check-sign 5))\n; (print (check-sign -3))\n',
    expectedOutput: '"positive"\n"non-positive"\n',
    solution: '(defun check-sign (n)\n  (if (plusp n) "positive" "non-positive"))\n(print (check-sign 5))\n(print (check-sign -3))',
  },
  {
    id: 'cond-02',
    title: 'cond式',
    category: '条件分岐',
    difficulty: 'beginner',
    description: `## cond式

\`cond\` は複数条件の分岐に使います（switch文のようなもの）。

\`\`\`lisp
(cond
  ((条件1) 式1)
  ((条件2) 式2)
  (t デフォルト))
\`\`\`

### 問題
数値を受け取り、FizzBuzz を返す関数を定義してください。
- 15の倍数 → "FizzBuzz"
- 3の倍数 → "Fizz"
- 5の倍数 → "Buzz"
- それ以外 → その数値`,
    hint: '(zerop (mod n 15)) で15の倍数か判定できます',
    initialCode: '; fizzbuzz 関数を定義してください\n\n; テスト\n; (print (fizzbuzz 15))\n; (print (fizzbuzz 9))\n; (print (fizzbuzz 10))\n; (print (fizzbuzz 7))\n',
    expectedOutput: '"FizzBuzz"\n"Fizz"\n"Buzz"\n7\n',
    solution: `(defun fizzbuzz (n)
  (cond
    ((zerop (mod n 15)) "FizzBuzz")
    ((zerop (mod n 3)) "Fizz")
    ((zerop (mod n 5)) "Buzz")
    (t n)))
(print (fizzbuzz 15))
(print (fizzbuzz 9))
(print (fizzbuzz 10))
(print (fizzbuzz 7))`,
  },

  // ===== リスト操作 =====
  {
    id: 'list-01',
    title: 'リストの基本',
    category: 'リスト操作',
    difficulty: 'beginner',
    description: `## リスト

Lispの最も重要なデータ構造です。

\`\`\`lisp
'(1 2 3)              ; クォートでリストリテラル
(list 1 2 3)          ; list関数
(car '(1 2 3))        ; => 1 (先頭要素)
(cdr '(1 2 3))        ; => (2 3) (残り)
(cons 0 '(1 2 3))     ; => (0 1 2 3) (先頭に追加)
\`\`\`

### 問題
リスト \`(10 20 30 40 50)\` の先頭要素と、
残りのリストをそれぞれ出力してください。`,
    hint: 'car で先頭、cdr で残りを取得します',
    initialCode: "(defvar *my-list* '(10 20 30 40 50))\n\n; 先頭要素を出力\n\n; 残りのリストを出力\n",
    expectedOutput: '10\n(20 30 40 50)\n',
    solution: "(defvar *my-list* '(10 20 30 40 50))\n(print (car *my-list*))\n(print (cdr *my-list*))",
  },
  {
    id: 'list-02',
    title: 'リストの操作',
    category: 'リスト操作',
    difficulty: 'intermediate',
    description: `## リスト操作関数

\`\`\`lisp
(append '(1 2) '(3 4))  ; => (1 2 3 4)
(reverse '(1 2 3))      ; => (3 2 1)
(length '(1 2 3))        ; => 3
(member 2 '(1 2 3))      ; => (2 3)
\`\`\`

### 問題
2つのリストを結合し、反転させた結果を出力してください。
- リスト1: (1 2 3)
- リスト2: (4 5 6)`,
    hint: 'append で結合、reverse で反転',
    initialCode: "; 2つのリストを結合して反転させてください\n",
    expectedOutput: '(6 5 4 3 2 1)\n',
    solution: "(print (reverse (append '(1 2 3) '(4 5 6))))",
  },

  // ===== 再帰 =====
  {
    id: 'recursion-01',
    title: '再帰関数',
    category: '再帰',
    difficulty: 'intermediate',
    description: `## 再帰

Lispでは再帰が基本的なループ手法です。

\`\`\`lisp
(defun factorial (n)
  (if (<= n 1)
      1
      (* n (factorial (- n 1)))))
\`\`\`

### 問題
フィボナッチ数を計算する再帰関数 \`fib\` を定義してください。
- fib(0) = 0
- fib(1) = 1
- fib(n) = fib(n-1) + fib(n-2)`,
    hint: 'ベースケース2つ (n=0, n=1) を if/cond で処理します',
    initialCode: '; fib 関数を定義してください\n\n; テスト\n; (print (fib 0))\n; (print (fib 1))\n; (print (fib 10))\n',
    expectedOutput: '0\n1\n55\n',
    solution: `(defun fib (n)
  (cond
    ((= n 0) 0)
    ((= n 1) 1)
    (t (+ (fib (- n 1)) (fib (- n 2))))))
(print (fib 0))
(print (fib 1))
(print (fib 10))`,
  },

  // ===== 高階関数 =====
  {
    id: 'higher-01',
    title: 'mapcar',
    category: '高階関数',
    difficulty: 'intermediate',
    description: `## mapcar - リストの変換

\`mapcar\` はリストの各要素に関数を適用します。

\`\`\`lisp
(mapcar #'1+ '(1 2 3))
; => (2 3 4)

(mapcar (lambda (x) (* x x)) '(1 2 3 4))
; => (1 4 9 16)
\`\`\`

### 問題
リスト \`(1 2 3 4 5)\` の各要素を2倍にした新しいリストを出力してください。`,
    hint: 'lambda で無名関数を作り、mapcar に渡します',
    initialCode: "; 各要素を2倍にしてください\n",
    expectedOutput: '(2 4 6 8 10)\n',
    solution: "(print (mapcar (lambda (x) (* x 2)) '(1 2 3 4 5)))",
  },

  // ===== クロージャ =====
  {
    id: 'closure-01',
    title: 'クロージャの基本',
    category: 'クロージャ',
    difficulty: 'advanced',
    description: `## クロージャ

クロージャは、関数とその定義時の環境を一緒に保持する仕組みです。

\`\`\`lisp
(defun make-adder (n)
  (lambda (x) (+ x n)))

(defvar *add5* (make-adder 5))
(funcall *add5* 10)  ; => 15
\`\`\`

\`make-adder\` が返す lambda は、\`n\` の値を「覚えて」います。

### 問題
引数に指定した倍率で掛け算する関数を返す \`make-multiplier\` を定義してください。
\`(funcall (make-multiplier 3) 7)\` が 21 を返すようにしてください。`,
    hint: 'lambda の中で外側の変数を参照すると、クロージャになります',
    initialCode: '; make-multiplier 関数を定義してください\n\n; テスト\n; (defvar *triple* (make-multiplier 3))\n; (print (funcall *triple* 7))\n; (print (funcall *triple* 10))\n',
    expectedOutput: '21\n30\n',
    solution: `(defun make-multiplier (n)
  (lambda (x) (* x n)))
(defvar *triple* (make-multiplier 3))
(print (funcall *triple* 7))
(print (funcall *triple* 10))`,
  },
  {
    id: 'closure-02',
    title: 'カウンター（クロージャ応用）',
    category: 'クロージャ',
    difficulty: 'advanced',
    description: `## 状態を持つクロージャ

クロージャは状態（可変な変数）を閉じ込めることができます。

\`\`\`lisp
(defun make-counter ()
  (let ((count 0))
    (lambda ()
      (setq count (+ count 1))
      count)))
\`\`\`

### 問題
初期値を受け取り、呼び出すたびにその値から1ずつ増加するカウンターを返す
\`make-counter\` 関数を定義してください。`,
    hint: 'let で変数をキャプチャし、setq で更新します',
    initialCode: '; make-counter 関数を定義してください（初期値を引数に取る）\n\n; テスト\n; (defvar *c* (make-counter 10))\n; (print (funcall *c*))\n; (print (funcall *c*))\n; (print (funcall *c*))\n',
    expectedOutput: '11\n12\n13\n',
    solution: `(defun make-counter (start)
  (let ((count start))
    (lambda ()
      (setq count (+ count 1))
      count)))
(defvar *c* (make-counter 10))
(print (funcall *c*))
(print (funcall *c*))
(print (funcall *c*))`,
  },

  // ===== ループ =====
  {
    id: 'loop-01',
    title: 'dotimesループ',
    category: 'ループ',
    difficulty: 'beginner',
    description: `## dotimes

指定回数だけ繰り返すマクロです。

\`\`\`lisp
(dotimes (i 5)
  (print i))
; 0, 1, 2, 3, 4 を出力
\`\`\`

### 問題
1から10までの数を出力してください。`,
    hint: 'dotimes は0から始まるので、(+ i 1) で調整します',
    initialCode: '; 1から10を出力してください\n',
    expectedOutput: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n',
    solution: '(dotimes (i 10)\n  (print (+ i 1)))',
  },
  {
    id: 'loop-02',
    title: 'dolistループ',
    category: 'ループ',
    difficulty: 'beginner',
    description: `## dolist

リストの各要素に対して繰り返すマクロです。

\`\`\`lisp
(dolist (item '("apple" "banana" "cherry"))
  (print item))
\`\`\`

### 問題
リスト \`("Common" "Lisp" "is" "fun")\` の各要素を出力してください。`,
    hint: 'dolist を使います',
    initialCode: '; リストの各要素を出力してください\n',
    expectedOutput: '"Common"\n"Lisp"\n"is"\n"fun"\n',
    solution: `(dolist (word '("Common" "Lisp" "is" "fun"))
  (print word))`,
  },
  {
    id: 'loop-03',
    title: 'loop マクロ',
    category: 'ループ',
    difficulty: 'intermediate',
    description: `## loop マクロ

\`loop\` は汎用的な繰り返し構文です。
\`return\` で値を返して脱出できます。

\`\`\`lisp
(loop
  (print "hello")
  (return nil))
\`\`\`

### 問題
\`loop\` と \`return\` を使って、1から5までの合計を計算してください。
結果（15）を出力してください。`,
    hint: 'let で変数を用意し、loop 内で加算、条件を満たしたら return で脱出します',
    initialCode: `; loop を使って 1+2+3+4+5 を計算してください\n`,
    expectedOutput: '15\n',
    expectedReturnValue: '15',
    solution: `(let ((sum 0) (i 1))
  (loop
    (if (> i 5) (return (print sum)))
    (setq sum (+ sum i))
    (setq i (+ i 1))))`,
  },

  // ===== 文字列操作 =====
  {
    id: 'string-01',
    title: '文字列の基本',
    category: '文字列操作',
    difficulty: 'beginner',
    description: `## 文字列操作

Lispには便利な文字列操作関数があります。

\`\`\`lisp
(concatenate 'string "Hello" " " "World")
; => "Hello World"

(string-upcase "hello")   ; => "HELLO"
(string-downcase "HELLO") ; => "hello"
(length "abc")            ; => 3
\`\`\`

### 問題
"Hello" と "Lisp" を空白で結合し、大文字に変換して出力してください。`,
    hint: 'concatenate で結合、string-upcase で大文字変換します',
    initialCode: `; "Hello" と "Lisp" を結合して大文字にしてください\n`,
    expectedOutput: '"HELLO LISP"\n',
    solution: `(print (string-upcase (concatenate 'string "Hello" " " "Lisp")))`,
  },
  {
    id: 'string-02',
    title: '部分文字列',
    category: '文字列操作',
    difficulty: 'intermediate',
    description: `## 部分文字列（subseq）

\`subseq\` で文字列の一部を取り出せます。

\`\`\`lisp
(subseq "Hello World" 0 5)  ; => "Hello"
(subseq "Hello World" 6)    ; => "World"
\`\`\`

### 問題
文字列 "Common Lisp Programming" から "Lisp" の部分だけを取り出して出力してください。`,
    hint: '"Lisp" は7文字目から4文字分です（0始まり）',
    initialCode: `(defvar *text* "Common Lisp Programming")\n; "Lisp" を取り出してください\n`,
    expectedOutput: '"Lisp"\n',
    solution: `(defvar *text* "Common Lisp Programming")\n(print (subseq *text* 7 11))`,
  },
  {
    id: 'string-03',
    title: '文字列の比較と変換',
    category: '文字列操作',
    difficulty: 'intermediate',
    description: `## 文字列の比較と変換

\`\`\`lisp
(string= "abc" "abc")       ; => T
(write-to-string 42)        ; => "42"
(parse-integer "123")       ; => 123
\`\`\`

### 問題
数値 2026 を文字列に変換し、"Year: " と結合して出力してください。`,
    hint: 'write-to-string で数値→文字列変換し、concatenate で結合します',
    initialCode: `; 数値2026を文字列にして結合してください\n`,
    expectedOutput: '"Year: 2026"\n',
    solution: `(print (concatenate 'string "Year: " (write-to-string 2026)))`,
  },

  // ===== 数値計算 =====
  {
    id: 'math-01',
    title: '四則演算と数学関数',
    category: '数値計算',
    difficulty: 'beginner',
    description: `## 数学関数

\`\`\`lisp
(abs -5)       ; => 5
(max 3 7 2)    ; => 7
(min 3 7 2)    ; => 2
(expt 2 10)    ; => 1024
(sqrt 144)     ; => 12
(mod 17 5)     ; => 2
\`\`\`

### 問題
以下の計算結果をそれぞれ出力してください：
1. -42 の絶対値
2. 2 の 8 乗
3. 17 を 5 で割った余り`,
    hint: 'abs, expt, mod を使います',
    initialCode: `; 3つの計算結果を出力してください\n`,
    expectedOutput: '42\n256\n2\n',
    solution: `(print (abs -42))\n(print (expt 2 8))\n(print (mod 17 5))`,
  },
  {
    id: 'math-02',
    title: '数値の判定',
    category: '数値計算',
    difficulty: 'beginner',
    description: `## 数値の判定関数

\`\`\`lisp
(zerop 0)     ; => T
(plusp 5)     ; => T
(minusp -3)   ; => T
(evenp 4)     ; => T
(oddp 7)      ; => T
\`\`\`

### 問題
引数の数値が「正の偶数」かどうかを判定する関数 \`positive-even-p\` を定義してください。
正の偶数なら T、それ以外なら NIL を返します。`,
    hint: '(and (plusp n) (evenp n)) で両方の条件を同時にチェックできます',
    initialCode: `; positive-even-p 関数を定義してください\n\n; テスト\n; (print (positive-even-p 4))\n; (print (positive-even-p -2))\n; (print (positive-even-p 3))\n`,
    expectedOutput: 'T\nNIL\nNIL\n',
    solution: `(defun positive-even-p (n)\n  (and (plusp n) (evenp n)))\n(print (positive-even-p 4))\n(print (positive-even-p -2))\n(print (positive-even-p 3))`,
  },

  // ===== 追加 条件分岐 =====
  {
    id: 'cond-03',
    title: 'when と unless',
    category: '条件分岐',
    difficulty: 'beginner',
    description: `## when と unless

\`when\` は条件が真のときだけ式を実行します。
\`unless\` は条件が偽のときだけ式を実行します。

\`\`\`lisp
(when (> 5 3)
  (print "5は3より大きい"))

(unless (> 3 5)
  (print "3は5より大きくない"))
\`\`\`

### 問題
リスト内の数値について、正の数のみ出力する処理を書いてください。
リストは \`(3 -1 4 -1 5 -9 2 -6)\` です。`,
    hint: 'dolist で各要素を取り出し、when と plusp で正の数を判定します',
    initialCode: `; 正の数だけ出力してください\n`,
    expectedOutput: '3\n4\n5\n2\n',
    solution: `(dolist (n '(3 -1 4 -1 5 -9 2 -6))\n  (when (plusp n) (print n)))`,
  },
  {
    id: 'cond-04',
    title: '論理演算子',
    category: '条件分岐',
    difficulty: 'intermediate',
    description: `## 論理演算子（and, or, not）

\`\`\`lisp
(and t t)    ; => T
(and t nil)  ; => NIL
(or nil t)   ; => T
(not nil)    ; => T
\`\`\`

\`and\` は最後の真の値を、\`or\` は最初の真の値を返します（短絡評価）。

### 問題
引数が「10以上かつ100未満」の数値かどうかを判定する関数 \`two-digit-p\` を定義してください。`,
    hint: '(and (>= n 10) (< n 100)) を使います',
    initialCode: `; two-digit-p 関数を定義してください\n\n; テスト\n; (print (two-digit-p 42))\n; (print (two-digit-p 5))\n; (print (two-digit-p 100))\n`,
    expectedOutput: 'T\nNIL\nNIL\n',
    solution: `(defun two-digit-p (n)\n  (and (>= n 10) (< n 100)))\n(print (two-digit-p 42))\n(print (two-digit-p 5))\n(print (two-digit-p 100))`,
  },

  // ===== 追加 リスト操作 =====
  {
    id: 'list-03',
    title: 'cons によるリスト構築',
    category: 'リスト操作',
    difficulty: 'beginner',
    description: `## cons でリストを組み立てる

\`cons\` は新しい要素をリストの先頭に追加します。

\`\`\`lisp
(cons 1 nil)           ; => (1)
(cons 1 '(2 3))        ; => (1 2 3)
(cons 1 (cons 2 nil))  ; => (1 2)
\`\`\`

### 問題
\`cons\` だけを使って、リスト \`(1 2 3)\` を作成し出力してください。`,
    hint: '内側から (cons 3 nil)、次に (cons 2 ...)、最後に (cons 1 ...) と組み立てます',
    initialCode: `; cons だけでリスト (1 2 3) を作ってください\n`,
    expectedOutput: '(1 2 3)\n',
    solution: `(print (cons 1 (cons 2 (cons 3 nil))))`,
  },
  {
    id: 'list-04',
    title: 'assoc（連想リスト）',
    category: 'リスト操作',
    difficulty: 'intermediate',
    description: `## 連想リスト（alist）

連想リストはキーと値のペアのリストです。
\`assoc\` でキーに対応するペアを検索します。

\`\`\`lisp
(defvar *alist* '(("name" "Taro") ("age" "25")))
(assoc "name" *alist*)  ; => ("name" "Taro")
\`\`\`

### 問題
果物と価格の連想リストを作成し、"apple" の価格を取り出して出力してください。
- apple: 150, banana: 100, cherry: 300`,
    hint: 'assoc で見つけたペアの second (2番目の要素) を取り出します',
    initialCode: `; 連想リストを作って apple の価格を取得してください\n`,
    expectedOutput: '150\n',
    solution: `(defvar *fruits* '(("apple" 150) ("banana" 100) ("cherry" 300)))\n(print (second (assoc "apple" *fruits*)))`,
  },
  {
    id: 'list-05',
    title: 'リストのフィルタリング',
    category: 'リスト操作',
    difficulty: 'intermediate',
    description: `## remove-if / remove-if-not

条件に合う/合わない要素を除去した新しいリストを返します。

\`\`\`lisp
(remove-if #'minusp '(3 -1 4 -1 5))
; => (3 4 5)

(remove-if-not #'evenp '(1 2 3 4 5 6))
; => (2 4 6)
\`\`\`

### 問題
リスト \`(1 2 3 4 5 6 7 8 9 10)\` から偶数だけを取り出して出力してください。`,
    hint: 'remove-if-not と evenp を使います',
    initialCode: `; 偶数だけを取り出してください\n`,
    expectedOutput: '(2 4 6 8 10)\n',
    solution: `(print (remove-if-not #'evenp '(1 2 3 4 5 6 7 8 9 10)))`,
  },

  // ===== 追加 再帰 =====
  {
    id: 'recursion-02',
    title: '階乗',
    category: '再帰',
    difficulty: 'beginner',
    description: `## 階乗（factorial）

再帰の最も基本的な例です。

\`\`\`lisp
; n! = n × (n-1) × ... × 1
; 0! = 1（ベースケース）
\`\`\`

### 問題
階乗を計算する再帰関数 \`factorial\` を定義してください。
\`(factorial 5)\` が 120 を返すようにしてください。`,
    hint: '(if (<= n 1) 1 (* n (factorial (- n 1))))',
    initialCode: `; factorial 関数を定義してください\n\n; テスト\n; (print (factorial 0))\n; (print (factorial 1))\n; (print (factorial 5))\n`,
    expectedOutput: '1\n1\n120\n',
    solution: `(defun factorial (n)\n  (if (<= n 1) 1 (* n (factorial (- n 1)))))\n(print (factorial 0))\n(print (factorial 1))\n(print (factorial 5))`,
  },
  {
    id: 'recursion-03',
    title: 'リストの再帰処理',
    category: '再帰',
    difficulty: 'intermediate',
    description: `## リストと再帰

リストを再帰的に処理するパターンは、car（先頭）を処理し、cdr（残り）に対して再帰呼び出しします。

\`\`\`lisp
(defun my-length (lst)
  (if (null lst)
      0
      (+ 1 (my-length (cdr lst)))))
\`\`\`

### 問題
リストの要素を合計する再帰関数 \`my-sum\` を定義してください。`,
    hint: 'ベースケース: 空リスト→0、再帰: (+ (car lst) (my-sum (cdr lst)))',
    initialCode: `; my-sum 関数を定義してください\n\n; テスト\n; (print (my-sum '(1 2 3 4 5)))\n; (print (my-sum nil))\n`,
    expectedOutput: '15\n0\n',
    solution: `(defun my-sum (lst)\n  (if (null lst)\n      0\n      (+ (car lst) (my-sum (cdr lst)))))\n(print (my-sum '(1 2 3 4 5)))\n(print (my-sum nil))`,
  },
  {
    id: 'recursion-04',
    title: 'リストの反転（再帰）',
    category: '再帰',
    difficulty: 'advanced',
    description: `## リストの反転を再帰で実装

組み込みの \`reverse\` を使わずに、リストを反転する関数を自作してください。

\`\`\`lisp
; ヒント: append で末尾に追加するパターン
(append '(1 2) '(3))  ; => (1 2 3)
\`\`\`

### 問題
\`reverse\` を使わずにリストを反転する \`my-reverse\` を定義してください。`,
    hint: '(append (my-reverse (cdr lst)) (list (car lst)))',
    initialCode: `; my-reverse 関数を定義してください（reverse は使わない）\n\n; テスト\n; (print (my-reverse '(1 2 3 4 5)))\n; (print (my-reverse nil))\n`,
    expectedOutput: '(5 4 3 2 1)\nNIL\n',
    solution: `(defun my-reverse (lst)\n  (if (null lst)\n      nil\n      (append (my-reverse (cdr lst)) (list (car lst)))))\n(print (my-reverse '(1 2 3 4 5)))\n(print (my-reverse nil))`,
  },

  // ===== 追加 高階関数 =====
  {
    id: 'higher-02',
    title: 'remove-if（フィルタ）',
    category: '高階関数',
    difficulty: 'intermediate',
    description: `## remove-if / remove-if-not

関数を渡して条件に合う要素を除去/抽出できます。

\`\`\`lisp
(remove-if #'oddp '(1 2 3 4 5))
; => (2 4)

(remove-if-not #'plusp '(-1 0 1 2 -3))
; => (1 2)
\`\`\`

### 問題
文字列のリストから、長さが3文字以下の短い単語を除去して出力してください。
リスト: ("I" "love" "Common" "Lisp" "so" "much")`,
    hint: 'lambda で長さを判定する関数を作り、remove-if に渡します',
    initialCode: `; 長さ3以下の単語を除去してください\n`,
    expectedOutput: '("love" "Common" "Lisp" "much")\n',
    solution: `(print (remove-if (lambda (s) (<= (length s) 3)) '("I" "love" "Common" "Lisp" "so" "much")))`,
  },
  {
    id: 'higher-03',
    title: 'reduce（畳み込み）',
    category: '高階関数',
    difficulty: 'intermediate',
    description: `## reduce

\`reduce\` はリストの要素を左から順に2つずつ関数に渡して畳み込みます。

\`\`\`lisp
(reduce #'+ '(1 2 3 4 5))         ; => 15
(reduce #'max '(3 1 4 1 5 9 2))   ; => 9
\`\`\`

### 問題
\`reduce\` を使って、リスト \`(1 2 3 4 5)\` の全要素の積を計算してください。`,
    hint: '#\'* を reduce に渡します',
    initialCode: `; reduce を使って積を計算してください\n`,
    expectedOutput: '120\n',
    expectedReturnValue: '120',
    solution: `(print (reduce #'* '(1 2 3 4 5)))`,
  },
  {
    id: 'higher-04',
    title: 'some と every',
    category: '高階関数',
    difficulty: 'intermediate',
    description: `## some と every

\`some\` はリスト内に条件を満たす要素が1つでもあれば真を返します。
\`every\` はすべての要素が条件を満たせば真を返します。

\`\`\`lisp
(some #'evenp '(1 3 5 6))    ; => T
(every #'plusp '(1 2 3))     ; => T
(every #'plusp '(1 -2 3))    ; => NIL
\`\`\`

### 問題
リスト \`(2 4 6 8 10)\` がすべて偶数か、リスト \`(1 3 5 7)\` に偶数が含まれるか、
それぞれ判定して出力してください。`,
    hint: 'every と some に #\'evenp を渡します',
    initialCode: `; 2つの判定結果を出力してください\n`,
    expectedOutput: 'T\nNIL\n',
    solution: `(print (every #'evenp '(2 4 6 8 10)))\n(print (some #'evenp '(1 3 5 7)))`,
  },
  {
    id: 'higher-05',
    title: 'funcall と apply',
    category: '高階関数',
    difficulty: 'advanced',
    description: `## funcall と apply

\`funcall\` は関数を引数付きで呼び出します。
\`apply\` はリストを引数として展開して関数を呼び出します。

\`\`\`lisp
(funcall #'+ 1 2 3)        ; => 6
(apply #'+ '(1 2 3))       ; => 6
(apply #'max '(3 1 4 1 5)) ; => 5
\`\`\`

### 問題
関数のリストを受け取り、それぞれを引数に適用した結果のリストを返す
\`apply-all\` 関数を定義してください。
\`(apply-all (list #'1+ #'(lambda (x) (* x x)) #'abs) -3)\` が \`(-2 9 3)\` を返すようにしてください。`,
    hint: 'mapcar で各関数に対して funcall を呼び出します',
    initialCode: `; apply-all 関数を定義してください\n\n; テスト\n; (print (apply-all (list #'1+ #'(lambda (x) (* x x)) #'abs) -3))\n`,
    expectedOutput: '(-2 9 3)\n',
    solution: `(defun apply-all (fns x)\n  (mapcar (lambda (f) (funcall f x)) fns))\n(print (apply-all (list #'1+ #'(lambda (x) (* x x)) #'abs) -3))`,
  },

  // ===== 追加 クロージャ =====
  {
    id: 'closure-03',
    title: 'メモ化（クロージャ応用）',
    category: 'クロージャ',
    difficulty: 'advanced',
    description: `## クロージャによるメモ化

クロージャで連想リストを保持し、計算済みの結果を再利用するパターンです。

\`\`\`lisp
(defun make-counter ()
  (let ((count 0))
    (lambda ()
      (setq count (+ count 1))
      count)))
\`\`\`

### 問題
呼び出すたびにリストに要素を追加し、現在のリストを返す関数を返す
\`make-accumulator\` を定義してください。`,
    hint: 'let でリストをキャプチャし、setq と append で更新します',
    initialCode: `; make-accumulator を定義してください\n\n; テスト\n; (defvar *acc* (make-accumulator))\n; (print (funcall *acc* "a"))\n; (print (funcall *acc* "b"))\n; (print (funcall *acc* "c"))\n`,
    expectedOutput: '("a")\n("a" "b")\n("a" "b" "c")\n',
    solution: `(defun make-accumulator ()
  (let ((items nil))
    (lambda (x)
      (setq items (append items (list x)))
      items)))
(defvar *acc* (make-accumulator))
(print (funcall *acc* "a"))
(print (funcall *acc* "b"))
(print (funcall *acc* "c"))`,
  },

  // ===== 追加 let / スコープ =====
  {
    id: 'scope-01',
    title: 'let と let*',
    category: 'スコープ',
    difficulty: 'beginner',
    description: `## let と let*

\`let\` はローカル変数を定義します。
\`let*\` は前の束縛を参照できます。

\`\`\`lisp
(let ((x 10) (y 20))
  (+ x y))  ; => 30

(let* ((x 10) (y (* x 2)))
  y)  ; => 20
\`\`\`

### 問題
\`let*\` を使って、半径5の円の面積を計算して出力してください。
円周率は 3.14159 とします。面積 = π × r × r`,
    hint: '(let* ((r 5) (area (* 3.14159 r r))) ...)',
    initialCode: `; let* で円の面積を計算してください\n`,
    expectedOutput: '78.53975\n',
    expectedReturnValue: '78.53975',
    solution: `(let* ((r 5) (area (* 3.14159 r r)))\n  (print area))`,
  },
  {
    id: 'scope-02',
    title: 'progn（複数式の実行）',
    category: 'スコープ',
    difficulty: 'beginner',
    description: `## progn

\`progn\` は複数の式を順番に実行し、最後の式の値を返します。

\`\`\`lisp
(progn
  (print "first")
  (print "second")
  42)
; "first" と "second" を出力し、42 を返す
\`\`\`

### 問題
\`progn\` を使って、"Processing..." を出力してから計算結果 \`(* 6 7)\` を出力してください。`,
    hint: 'progn の中に print を2つ並べます',
    initialCode: `; progn で2つの処理を実行してください\n`,
    expectedOutput: '"Processing..."\n42\n',
    expectedReturnValue: '42',
    solution: `(progn\n  (print "Processing...")\n  (print (* 6 7)))`,
  },

  // ===== 追加 型判定 =====
  {
    id: 'type-01',
    title: '型判定関数',
    category: '型判定',
    difficulty: 'beginner',
    description: `## 型判定関数

\`\`\`lisp
(numberp 42)        ; => T
(stringp "hello")   ; => T
(listp '(1 2))      ; => T
(symbolp 'foo)      ; => T
(null nil)          ; => T
(atom 42)           ; => T（リスト以外はアトム）
\`\`\`

### 問題
引数の型を文字列で返す関数 \`type-name\` を定義してください。
- 数値 → "number"
- 文字列 → "string"  
- リスト → "list"
- NIL → "nil"
- それ以外 → "other"`,
    hint: 'cond で numberp, stringp, null, listp を順に判定します。null は listp より先に判定してください',
    initialCode: `; type-name 関数を定義してください\n\n; テスト\n; (print (type-name 42))\n; (print (type-name "hello"))\n; (print (type-name '(1 2)))\n; (print (type-name nil))\n`,
    expectedOutput: '"number"\n"string"\n"list"\n"nil"\n',
    solution: `(defun type-name (x)
  (cond
    ((numberp x) "number")
    ((stringp x) "string")
    ((null x) "nil")
    ((listp x) "list")
    (t "other")))
(print (type-name 42))
(print (type-name "hello"))
(print (type-name '(1 2)))
(print (type-name nil))`,
  },

  // ===== 総合問題 =====
  {
    id: 'challenge-01',
    title: 'クイックソート',
    category: '総合問題',
    difficulty: 'advanced',
    description: `## クイックソート

再帰・リスト操作・高階関数を組み合わせた総合問題です。

クイックソートのアルゴリズム：
1. リストが空なら空リストを返す
2. 先頭要素をピボットとする
3. 残りの要素をピボットより小さいものと大きいものに分ける
4. それぞれを再帰的にソートし、結合する

### 問題
クイックソートを実装する \`qsort\` 関数を定義してください。`,
    hint: 'remove-if と remove-if-not でピボットより小さい/大きい要素を分離します',
    initialCode: `; qsort 関数を定義してください\n\n; テスト\n; (print (qsort '(3 1 4 1 5 9 2 6 5 3)))\n`,
    expectedOutput: '(1 1 2 3 3 4 5 5 6 9)\n',
    solution: `(defun qsort (lst)
  (if (null lst)
      nil
      (let* ((pivot (car lst))
             (rest (cdr lst))
             (less (remove-if-not (lambda (x) (< x pivot)) rest))
             (greater (remove-if (lambda (x) (< x pivot)) rest)))
        (append (qsort less) (list pivot) (qsort greater)))))
(print (qsort '(3 1 4 1 5 9 2 6 5 3)))`,
  },
  {
    id: 'challenge-02',
    title: 'FizzBuzz リスト生成',
    category: '総合問題',
    difficulty: 'intermediate',
    description: `## FizzBuzz リスト生成

ループ・条件分岐・リスト操作の総合問題です。

### 問題
1から20までの FizzBuzz の結果をリストとして生成し、出力してください。
- 15の倍数 → "FizzBuzz"
- 3の倍数 → "Fizz"
- 5の倍数 → "Buzz"
- それ以外 → その数値`,
    hint: 'let で結果リストを空にし、dotimes で要素を追加していきます。append で末尾追加できます',
    initialCode: `; 1-20のFizzBuzzリストを生成してください\n`,
    expectedOutput: '(1 2 "Fizz" 4 "Buzz" "Fizz" 7 8 "Fizz" "Buzz" 11 "Fizz" 13 14 "FizzBuzz" 16 17 "Fizz" 19 "Buzz")\n',
    solution: `(defun fizzbuzz (n)
  (cond
    ((zerop (mod n 15)) "FizzBuzz")
    ((zerop (mod n 3)) "Fizz")
    ((zerop (mod n 5)) "Buzz")
    (t n)))
(let ((result nil))
  (dotimes (i 20)
    (setq result (append result (list (fizzbuzz (+ i 1))))))
  (print result))`,
  },
  {
    id: 'challenge-03',
    title: 'flatten（ネストリストの平坦化）',
    category: '総合問題',
    difficulty: 'advanced',
    description: `## リストの平坦化

ネストしたリストを1次元に平坦化する関数を作る問題です。

\`\`\`lisp
(flatten '(1 (2 3) (4 (5 6))))
; => (1 2 3 4 5 6)
\`\`\`

### 問題
ネストしたリストを平坦化する \`flatten\` 関数を定義してください。
再帰と \`consp\`（コンスセルかどうかの判定）を使います。`,
    hint: 'cond で null, consp, atom の3パターンに分岐。consp なら car と cdr をそれぞれ flatten して append',
    initialCode: `; flatten 関数を定義してください\n\n; テスト\n; (print (flatten '(1 (2 3) (4 (5 6)))))\n; (print (flatten '(1 2 3)))\n; (print (flatten nil))\n`,
    expectedOutput: '(1 2 3 4 5 6)\n(1 2 3)\nNIL\n',
    solution: `(defun flatten (lst)
  (cond
    ((null lst) nil)
    ((consp lst) (append (flatten (car lst)) (flatten (cdr lst))))
    (t (list lst))))
(print (flatten '(1 (2 3) (4 (5 6)))))
(print (flatten '(1 2 3)))
(print (flatten nil))`,
  },
];

export function getProblemsByCategory(): Map<string, Problem[]> {
  const map = new Map<string, Problem[]>();
  for (const p of problems) {
    const list = map.get(p.category) ?? [];
    list.push(p);
    map.set(p.category, list);
  }
  return map;
}
