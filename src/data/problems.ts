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
