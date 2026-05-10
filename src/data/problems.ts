import { Problem, ProblemCatalogInfo, ProblemCourseId, ProblemTag, ProblemTier } from '../types';

type ProblemSeed = Omit<Problem, 'order' | 'estimatedMinutes' | 'learningGoals' | 'learningPath' | 'catalog'>
  & Partial<Pick<Problem, 'estimatedMinutes' | 'learningGoals'>>;

const CORE_LEARNING_PATH = {
  id: 'lisp-core-path',
  title: 'Lisp 基礎ステップ',
};

const DEFAULT_ESTIMATED_MINUTES: Record<Problem['difficulty'], number> = {
  beginner: 6,
  intermediate: 10,
  advanced: 14,
};

const CATEGORY_ORDER = [
  '基本構文',
  '条件分岐',
  '数値計算',
  'リスト操作',
  '文字列操作',
  'ループ',
  '高階関数',
  '再帰',
  'クロージャ',
];

const DIFFICULTY_ORDER: Record<Problem['difficulty'], number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

const CATEGORY_TO_COURSE: Record<string, ProblemCourseId> = {
  '基本構文': 'intro-core',
  '条件分岐': 'intro-core',
  '数値計算': 'intro-core',
  '文字列操作': 'intro-core',
  'スコープ': 'intro-core',
  '型判定': 'intro-core',
  'リスト操作': 'data-and-control',
  'ループ': 'data-and-control',
  '高階関数': 'functional-patterns',
  '再帰': 'functional-patterns',
  'クロージャ': 'functional-patterns',
  '総合問題': 'functional-patterns',
};

const CATEGORY_TO_TAGS: Record<string, ProblemTag[]> = {
  '基本構文': ['syntax'],
  '条件分岐': ['conditionals'],
  '数値計算': ['math'],
  '文字列操作': ['strings'],
  'スコープ': ['scope'],
  '型判定': ['types'],
  'リスト操作': ['lists'],
  'ループ': ['loops'],
  '高階関数': ['higher-order'],
  '再帰': ['recursion'],
  'クロージャ': ['closures'],
  '総合問題': ['challenge'],
};

export const PROBLEM_COURSES: Record<ProblemCourseId, { title: string; description: string }> = {
  'intro-core': {
    title: '入門コース',
    description: '基本構文、条件分岐、数値、文字列、スコープを順番に固めるコースです。',
  },
  'data-and-control': {
    title: 'データと制御コース',
    description: 'リスト処理とループを中心に、データの扱いと反復を身につけます。',
  },
  'functional-patterns': {
    title: '関数型パターンコース',
    description: '高階関数、再帰、クロージャ、総合問題で抽象化と応用を練習します。',
  },
};

function getProblemTier(difficulty: Problem['difficulty']): ProblemTier {
  return difficulty === 'beginner' ? 'free' : 'standard';
}

function getProblemCourseId(category: string): ProblemCourseId {
  const courseId = CATEGORY_TO_COURSE[category];
  if (!courseId) {
    throw new Error(`Unknown problem category: ${category}`);
  }
  return courseId;
}

function getProblemTags(category: string): ProblemTag[] {
  const tags = CATEGORY_TO_TAGS[category];
  if (!tags) {
    throw new Error(`Unknown problem category: ${category}`);
  }
  return [...tags];
}

const problemSeeds: ProblemSeed[] = [
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
    solution: '(print (+ 10 20))\n(print (* 5 6))',
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'basic-01-visible-1',
          label: '足し算と掛け算の出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '30\n30\n', comparison: 'exact' },
            returnValue: { value: '30', comparison: 'exact' },
          },
        },
        {
          id: 'basic-01-hidden-1',
          label: 'エッジケース確認',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '30\n30\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: '(defvar *greeting* "Hello, Lisp!")\n(print *greeting*)',
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'basic-02-visible-1',
          label: '文字列を定義して出力する',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '"Hello, Lisp!"\n', comparison: 'exact' },
          },
        },
        {
          id: 'basic-02-hidden-1',
          label: '同一要件の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '"Hello, Lisp!"\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: '(defun add (a b)\n  (+ a b))\n(print (add 3 7))',
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'basic-03-visible-1',
          label: '加算関数の出力と戻り値',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '10\n', comparison: 'exact' },
            returnValue: { value: '10', comparison: 'exact' },
          },
        },
        {
          id: 'basic-03-hidden-1',
          label: '加算関数の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '10\n', comparison: 'exact' },
            returnValue: { value: '10', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: '(defun check-sign (n)\n  (if (plusp n) "positive" "non-positive"))\n(print (check-sign 5))\n(print (check-sign -3))',
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'cond-01-visible-1',
          label: '正負判定の基本ケース',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '"positive"\n"non-positive"\n', comparison: 'exact' },
          },
        },
        {
          id: 'cond-01-hidden-1',
          label: '正負判定の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '"positive"\n"non-positive"\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'cond-02-visible-1',
          label: 'FizzBuzz の基本ケース',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '"FizzBuzz"\n"Fizz"\n"Buzz"\n7\n', comparison: 'exact' },
          },
        },
        {
          id: 'cond-02-hidden-1',
          label: 'FizzBuzz の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '"FizzBuzz"\n"Fizz"\n"Buzz"\n7\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: "(defvar *my-list* '(10 20 30 40 50))\n(print (car *my-list*))\n(print (cdr *my-list*))",
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'list-01-visible-1',
          label: '先頭要素と残りのリストを出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '10\n(20 30 40 50)\n', comparison: 'exact' },
          },
        },
        {
          id: 'list-01-hidden-1',
          label: 'list 基本ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '10\n(20 30 40 50)\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: "(print (reverse (append '(1 2 3) '(4 5 6))))",
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'list-02-visible-1',
          label: '結合して反転したリストを出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '(6 5 4 3 2 1)\n', comparison: 'exact' },
          },
        },
        {
          id: 'list-02-hidden-1',
          label: 'list 操作の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '(6 5 4 3 2 1)\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defun fib (n)
  (cond
    ((= n 0) 0)
    ((= n 1) 1)
    (t (+ (fib (- n 1)) (fib (- n 2))))))
(print (fib 0))
(print (fib 1))
(print (fib 10))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'recursion-01-visible-1',
          label: 'fib の基本ケースを出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '0\n1\n55\n', comparison: 'exact' },
          },
        },
        {
          id: 'recursion-01-hidden-1',
          label: 'fib の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '0\n1\n55\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: "(print (mapcar (lambda (x) (* x 2)) '(1 2 3 4 5)))",
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'higher-01-visible-1',
          label: 'mapcar で各要素を2倍',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '(2 4 6 8 10)\n', comparison: 'exact' },
          },
        },
        {
          id: 'higher-01-hidden-1',
          label: 'mapcar 基本ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '(2 4 6 8 10)\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defun make-multiplier (n)
  (lambda (x) (* x n)))
(defvar *triple* (make-multiplier 3))
(print (funcall *triple* 7))
(print (funcall *triple* 10))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'closure-01-visible-1',
          label: 'make-multiplier の出力を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '21\n30\n', comparison: 'exact' },
          },
        },
        {
          id: 'closure-01-hidden-1',
          label: 'クロージャ基本の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '21\n30\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defun make-counter (start)
  (let ((count start))
    (lambda ()
      (setq count (+ count 1))
      count)))
(defvar *c* (make-counter 10))
(print (funcall *c*))
(print (funcall *c*))
(print (funcall *c*))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'closure-02-visible-1',
          label: 'make-counter の増加を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '11\n12\n13\n', comparison: 'exact' },
          },
        },
        {
          id: 'closure-02-hidden-1',
          label: 'クロージャ状態保持の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '11\n12\n13\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: '(dotimes (i 10)\n  (print (+ i 1)))',
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'loop-01-visible-1',
          label: '1から10までを出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n', comparison: 'exact' },
          },
        },
        {
          id: 'loop-01-hidden-1',
          label: 'dotimes 基本ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(dolist (word '("Common" "Lisp" "is" "fun"))
  (print word))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'loop-02-visible-1',
          label: 'dolist で各要素を出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '"Common"\n"Lisp"\n"is"\n"fun"\n', comparison: 'exact' },
          },
        },
        {
          id: 'loop-02-hidden-1',
          label: 'dolist 基本ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '"Common"\n"Lisp"\n"is"\n"fun"\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(let ((sum 0) (i 1))
  (loop
    (if (> i 5) (return (print sum)))
    (setq sum (+ sum i))
    (setq i (+ i 1))))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'loop-03-visible-1',
          label: 'loop で合計を計算して出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '15\n', comparison: 'exact' },
            returnValue: { value: '15', comparison: 'exact' },
          },
        },
        {
          id: 'loop-03-hidden-1',
          label: 'loop 基本ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '15\n', comparison: 'exact' },
            returnValue: { value: '15', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(print (string-upcase (concatenate 'string "Hello" " " "Lisp")))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'string-01-visible-1',
          label: '文字列結合と大文字変換の出力を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '"HELLO LISP"\n', comparison: 'exact' },
          },
        },
        {
          id: 'string-01-hidden-1',
          label: '文字列操作の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '"HELLO LISP"\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defvar *text* "Common Lisp Programming")\n(print (subseq *text* 7 11))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'string-02-visible-1',
          label: '部分文字列の出力を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '"Lisp"\n', comparison: 'exact' },
          },
        },
        {
          id: 'string-02-hidden-1',
          label: '部分文字列の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '"Lisp"\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(print (concatenate 'string "Year: " (write-to-string 2026)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'string-03-visible-1',
          label: '数値と文字列結合の出力を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '"Year: 2026"\n', comparison: 'exact' },
          },
        },
        {
          id: 'string-03-hidden-1',
          label: '文字列変換・結合の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '"Year: 2026"\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(print (abs -42))\n(print (expt 2 8))\n(print (mod 17 5))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'math-01-visible-1',
          label: '数学関数3つの出力を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '42\n256\n2\n', comparison: 'exact' },
          },
        },
        {
          id: 'math-01-hidden-1',
          label: '数学関数の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '42\n256\n2\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defun positive-even-p (n)\n  (and (plusp n) (evenp n)))\n(print (positive-even-p 4))\n(print (positive-even-p -2))\n(print (positive-even-p 3))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'math-02-visible-1',
          label: 'positive-even-p の出力を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: 'T\nNIL\nNIL\n', comparison: 'exact' },
          },
        },
        {
          id: 'math-02-hidden-1',
          label: '数値判定の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: 'T\nNIL\nNIL\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(dolist (n '(3 -1 4 -1 5 -9 2 -6))\n  (when (plusp n) (print n)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'cond-03-visible-1',
          label: 'when で正の数だけ出力を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '3\n4\n5\n2\n', comparison: 'exact' },
          },
        },
        {
          id: 'cond-03-hidden-1',
          label: 'when/unless の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '3\n4\n5\n2\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defun two-digit-p (n)\n  (and (>= n 10) (< n 100)))\n(print (two-digit-p 42))\n(print (two-digit-p 5))\n(print (two-digit-p 100))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'cond-04-visible-1',
          label: 'two-digit-p の出力を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: 'T\nNIL\nNIL\n', comparison: 'exact' },
          },
        },
        {
          id: 'cond-04-hidden-1',
          label: '論理演算子の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: 'T\nNIL\nNIL\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(print (cons 1 (cons 2 (cons 3 nil))))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'list-03-visible-1',
          label: 'cons で (1 2 3) を構築',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '(1 2 3)\n', comparison: 'exact' },
          },
        },
        {
          id: 'list-03-hidden-1',
          label: 'cons 構築の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '(1 2 3)\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defvar *fruits* '(("apple" 150) ("banana" 100) ("cherry" 300)))\n(print (second (assoc "apple" *fruits*)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'list-04-visible-1',
          label: 'assoc で apple の価格を取得',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '150\n', comparison: 'exact' },
          },
        },
        {
          id: 'list-04-hidden-1',
          label: 'assoc 基本ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '150\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(print (remove-if-not #'evenp '(1 2 3 4 5 6 7 8 9 10)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'list-05-visible-1',
          label: '偶数だけを抽出して出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '(2 4 6 8 10)\n', comparison: 'exact' },
          },
        },
        {
          id: 'list-05-hidden-1',
          label: 'フィルタリングの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '(2 4 6 8 10)\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defun factorial (n)\n  (if (<= n 1) 1 (* n (factorial (- n 1)))))\n(print (factorial 0))\n(print (factorial 1))\n(print (factorial 5))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'recursion-02-visible-1',
          label: 'factorial の基本ケースを出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '1\n1\n120\n', comparison: 'exact' },
          },
        },
        {
          id: 'recursion-02-hidden-1',
          label: 'factorial の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '1\n1\n120\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defun my-sum (lst)\n  (if (null lst)\n      0\n      (+ (car lst) (my-sum (cdr lst)))))\n(print (my-sum '(1 2 3 4 5)))\n(print (my-sum nil))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'recursion-03-visible-1',
          label: 'my-sum の結果を出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '15\n0\n', comparison: 'exact' },
          },
        },
        {
          id: 'recursion-03-hidden-1',
          label: 'リスト再帰の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '15\n0\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defun my-reverse (lst)\n  (if (null lst)\n      nil\n      (append (my-reverse (cdr lst)) (list (car lst)))))\n(print (my-reverse '(1 2 3 4 5)))\n(print (my-reverse nil))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'recursion-04-visible-1',
          label: 'my-reverse の結果を出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '(5 4 3 2 1)\nNIL\n', comparison: 'exact' },
          },
        },
        {
          id: 'recursion-04-hidden-1',
          label: 'reverse 再帰の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '(5 4 3 2 1)\nNIL\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(print (remove-if (lambda (s) (<= (length s) 3)) '("I" "love" "Common" "Lisp" "so" "much")))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'higher-02-visible-1',
          label: '短い単語を除去して出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '("love" "Common" "Lisp" "much")\n', comparison: 'exact' },
          },
        },
        {
          id: 'higher-02-hidden-1',
          label: 'remove-if の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '("love" "Common" "Lisp" "much")\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(print (reduce #'* '(1 2 3 4 5)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'higher-03-visible-1',
          label: 'reduce で積を計算',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '120\n', comparison: 'exact' },
            returnValue: { value: '120', comparison: 'exact' },
          },
        },
        {
          id: 'higher-03-hidden-1',
          label: 'reduce 基本ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '120\n', comparison: 'exact' },
            returnValue: { value: '120', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(print (every #'evenp '(2 4 6 8 10)))\n(print (some #'evenp '(1 3 5 7)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'higher-04-visible-1',
          label: 'every と some の判定結果を出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: 'T\nNIL\n', comparison: 'exact' },
          },
        },
        {
          id: 'higher-04-hidden-1',
          label: 'some/every の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: 'T\nNIL\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defun apply-all (fns x)\n  (mapcar (lambda (f) (funcall f x)) fns))\n(print (apply-all (list #'1+ #'(lambda (x) (* x x)) #'abs) -3))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'higher-05-visible-1',
          label: 'apply-all の結果を出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '(-2 9 3)\n', comparison: 'exact' },
          },
        },
        {
          id: 'higher-05-hidden-1',
          label: '高階関数応用の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '(-2 9 3)\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defun make-accumulator ()
  (let ((items nil))
    (lambda (x)
      (setq items (append items (list x)))
      items)))
(defvar *acc* (make-accumulator))
(print (funcall *acc* "a"))
(print (funcall *acc* "b"))
(print (funcall *acc* "c"))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'closure-03-visible-1',
          label: 'make-accumulator の出力を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '("a")\n("a" "b")\n("a" "b" "c")\n', comparison: 'exact' },
          },
        },
        {
          id: 'closure-03-hidden-1',
          label: 'クロージャ応用の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '("a")\n("a" "b")\n("a" "b" "c")\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(let* ((r 5) (area (* 3.14159 r r)))\n  (print area))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'scope-01-visible-1',
          label: 'let* で円の面積を出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '78.53975\n', comparison: 'exact' },
          },
        },
        {
          id: 'scope-01-hidden-1',
          label: 'let* スコープの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '78.53975\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(progn\n  (print "Processing...")\n  (print (* 6 7)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'scope-02-visible-1',
          label: 'progn で2つの出力を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '"Processing..."\n42\n', comparison: 'exact' },
          },
        },
        {
          id: 'scope-02-hidden-1',
          label: 'progn の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '"Processing..."\n42\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'type-01-visible-1',
          label: 'type-name の出力を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '"number"\n"string"\n"list"\n"nil"\n', comparison: 'exact' },
          },
        },
        {
          id: 'type-01-hidden-1',
          label: '型判定の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '"number"\n"string"\n"list"\n"nil"\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defun qsort (lst)
  (if (null lst)
      nil
      (let* ((pivot (car lst))
             (rest (cdr lst))
             (less (remove-if-not (lambda (x) (< x pivot)) rest))
             (greater (remove-if (lambda (x) (< x pivot)) rest)))
        (append (qsort less) (list pivot) (qsort greater)))))
(print (qsort '(3 1 4 1 5 9 2 6 5 3)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'challenge-01-visible-1',
          label: 'qsort の結果を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '(1 1 2 3 3 4 5 5 6 9)\n', comparison: 'exact' },
          },
        },
        {
          id: 'challenge-01-hidden-1',
          label: 'クイックソートの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '(1 1 2 3 3 4 5 5 6 9)\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'challenge-02-visible-1',
          label: 'FizzBuzz リスト生成を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '(1 2 "Fizz" 4 "Buzz" "Fizz" 7 8 "Fizz" "Buzz" 11 "Fizz" 13 14 "FizzBuzz" 16 17 "Fizz" 19 "Buzz")\n', comparison: 'exact' },
          },
        },
        {
          id: 'challenge-02-hidden-1',
          label: 'FizzBuzz の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '(1 2 "Fizz" 4 "Buzz" "Fizz" 7 8 "Fizz" "Buzz" 11 "Fizz" 13 14 "FizzBuzz" 16 17 "Fizz" 19 "Buzz")\n', comparison: 'exact' },
          },
        },
      ],
    },
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
    solution: `(defun flatten (lst)
  (cond
    ((null lst) nil)
    ((consp lst) (append (flatten (car lst)) (flatten (cdr lst))))
    (t (list lst))))
(print (flatten '(1 (2 3) (4 (5 6)))))
(print (flatten '(1 2 3)))
(print (flatten nil))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'challenge-03-visible-1',
          label: 'flatten の結果を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '(1 2 3 4 5 6)\n(1 2 3)\nNIL\n', comparison: 'exact' },
          },
        },
        {
          id: 'challenge-03-hidden-1',
          label: 'flatten の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '(1 2 3 4 5 6)\n(1 2 3)\nNIL\n', comparison: 'exact' },
          },
        },
      ],
    },
  },
  {
    id: 'basic-quote-01',
    title: 'quote とシンボル',
    category: '基本構文',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    learningGoals: ['quote', 'symbol'],
    description: `## quote とシンボル

Common Lisp では、式を評価せずそのまま扱いたいときに \`quote\` を使います。
省略記法の \`'\` は reader syntax です。

\`\`\`lisp
'hello            ; => HELLO
'(a b c)          ; => (A B C)
(quote (1 2 3))  ; => (1 2 3)
\`\`\`

### 問題
次の 2 つをそれぞれ出力してください。
- シンボル \`hello\`
- リスト \`(lisp common lambda)\``,
    hint: 'どちらも quote 付きで print すると確認しやすくなります',
    initialCode: '; quote を使って値をそのまま出力してください\n',
    solution: `(print 'hello)
(print '(lisp common lambda))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'basic-quote-01-visible-1',
          label: 'quote したシンボルとリストを出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: 'HELLO\n(LISP COMMON LAMBDA)\n', comparison: 'exact' },
          },
        },
        {
          id: 'basic-quote-01-hidden-1',
          label: 'quote 基本ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: 'HELLO\n(LISP COMMON LAMBDA)\n', comparison: 'exact' },
          },
        },
      ],
    },
  },
  {
    id: 'basic-let-01',
    title: 'let による局所束縛',
    category: '基本構文',
    difficulty: 'beginner',
    estimatedMinutes: 6,
    learningGoals: ['let', 'lexical binding'],
    description: `## let

\`let\` は局所変数を束縛する基本形です。

\`\`\`lisp
(let ((x 10)
      (y 20))
  (+ x y))
; => 30
\`\`\`

### 問題
\`let\` を使って \`x=4\` と \`y=8\` を束縛し、
次の 2 つを順に出力してください。
- 合計
- 積`,
    hint: 'let の本体には複数の式を書けます',
    initialCode: '; let を使って 2 つの値を計算してください\n',
    solution: `(let ((x 4)
      (y 8))
  (print (+ x y))
  (print (* x y)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'basic-let-01-visible-1',
          label: 'let で合計と積を出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '12\n32\n', comparison: 'exact' },
          },
        },
        {
          id: 'basic-let-01-hidden-1',
          label: 'let 基本ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '12\n32\n', comparison: 'exact' },
          },
        },
      ],
    },
  },
  {
    id: 'basic-lambda-01',
    title: 'lambda と funcall',
    category: '基本構文',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    learningGoals: ['lambda', 'funcall'],
    description: `## lambda と funcall

\`lambda\` は無名関数を作り、\`funcall\` は関数オブジェクトを呼び出します。

\`\`\`lisp
(funcall (lambda (x) (* x x)) 5)
; => 25
\`\`\`

### 問題
次の 2 つを出力してください。
- 引数を 3 乗する無名関数を使って \`4\` を計算した結果
- 引数を 2 倍して 1 足す無名関数を使って \`7\` を計算した結果`,
    hint: 'どちらも (funcall (lambda (...) ...) 値) の形で書けます',
    initialCode: '; funcall と lambda を使って値を計算してください\n',
    solution: `(print (funcall (lambda (x) (* x x x)) 4))
(print (funcall (lambda (x) (+ (* x 2) 1)) 7))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'basic-lambda-01-visible-1',
          label: 'lambda と funcall の基本計算',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '64\n15\n', comparison: 'exact' },
          },
        },
        {
          id: 'basic-lambda-01-hidden-1',
          label: 'lambda 基本ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '64\n15\n', comparison: 'exact' },
          },
        },
      ],
    },
  },
  {
    id: 'function-apply-01',
    title: 'apply で引数列を渡す',
    category: '高階関数',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    learningGoals: ['apply', 'function object'],
    description: `## apply

\`apply\` は最後の引数のリストを展開して関数に渡します。

\`\`\`lisp
(apply #'+ '(1 2 3 4))
; => 10
\`\`\`

### 問題
\`apply\` を使って、次の 2 つを出力してください。
- リスト \`(1 2 3 4 5)\` の合計
- リスト \`(9 4 7 3)\` の最大値`,
    hint: '関数は #\'+ や #\'max の形で渡せます',
    initialCode: '; apply を使って 2 つの結果を出力してください\n',
    solution: `(print (apply #'+ '(1 2 3 4 5)))
(print (apply #'max '(9 4 7 3)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'function-apply-01-visible-1',
          label: 'apply で合計と最大値を出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '15\n9\n', comparison: 'exact' },
          },
        },
        {
          id: 'function-apply-01-hidden-1',
          label: 'apply 基本ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '15\n9\n', comparison: 'exact' },
          },
        },
      ],
    },
  },
  {
    id: 'list-member-01',
    title: 'length と member',
    category: 'リスト操作',
    difficulty: 'beginner',
    estimatedMinutes: 6,
    learningGoals: ['length', 'member'],
    description: `## length と member

リストの長さを見るには \`length\`、要素の位置以降を探すには \`member\` を使います。

\`\`\`lisp
(length '(a b c))
; => 3

(member 'b '(a b c d))
; => (B C D)
\`\`\`

### 問題
リスト \`(a b c d)\` に対して、次の 2 つを出力してください。
- リストの長さ
- \`c\` を \`member\` で探した結果`,
    hint: 'シンボル c は quote 付きで渡します',
    initialCode: `(defvar *letters* '(a b c d))
; length と member の結果を出力してください
`,
    solution: `(defvar *letters* '(a b c d))
(print (length *letters*))
(print (member 'c *letters*))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'list-member-01-visible-1',
          label: 'length と member の結果を出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '4\n(C D)\n', comparison: 'exact' },
          },
        },
        {
          id: 'list-member-01-hidden-1',
          label: 'member 基本ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '4\n(C D)\n', comparison: 'exact' },
          },
        },
      ],
    },
  },
  {
    id: 'list-assoc-01',
    title: 'assoc で連想リストを引く',
    category: 'リスト操作',
    difficulty: 'intermediate',
    estimatedMinutes: 9,
    learningGoals: ['association list', 'assoc'],
    description: `## assoc と連想リスト

連想リストは、キーと値の組をリストで並べた表現です。
\`assoc\` はキーに対応する組を返します。

\`\`\`lisp
(assoc 'name '((name "Lisp") (year 1984)))
; => (NAME "Lisp")
\`\`\`

### 問題
次の連想リストから \`name\` と \`year\` の値だけを取り出して出力してください。

\`((name "Lisp") (year 1984) (kind "language"))\``,
  hint: 'assoc の結果から second を使うと値だけを取り出せます',
  initialCode: `(defvar *info* '((name "Lisp") (year 1984) (kind "language")))
; name と year の値を出力してください
`,
  judge: {
    kind: 'program',
    cases: [
      {
        id: 'list-assoc-01-visible-1',
        label: 'name と year の値を取り出す',
        visibility: 'visible',
        run: { code: '' },
        expect: {
          output: { value: '"Lisp"\n1984\n', comparison: 'exact' },
        },
      },
      {
        id: 'list-assoc-01-hidden-1',
        label: 'assoc 応用の非公開チェック',
        visibility: 'hidden',
        run: { code: '' },
        expect: {
          output: { value: '"Lisp"\n1984\n', comparison: 'exact' },
        },
      },
    ],
  },
  solution: `(defvar *info* '((name "Lisp") (year 1984) (kind "language")))
(print (second (assoc 'name *info*)))
(print (second (assoc 'year *info*)))`,
  },
  {
    id: 'higher-filter-01',
    title: 'remove-if-not で絞り込む',
    category: '高階関数',
    difficulty: 'intermediate',
    estimatedMinutes: 9,
    learningGoals: ['remove-if-not', 'predicate'],
    description: `## remove-if-not

\`remove-if-not\` は、条件に合う要素だけを残す関数です。

\`\`\`lisp
(remove-if-not #'evenp '(1 2 3 4 5 6))
; => (2 4 6)
\`\`\`

### 問題
リスト \`(1 2 3 4 5 6 7 8)\` から、
偶数だけを取り出したリストを出力してください。`,
    hint: 'predicate には evenp をそのまま渡せます',
    initialCode: '; 偶数だけを残したリストを出力してください\n',
    solution: `(print (remove-if-not #'evenp '(1 2 3 4 5 6 7 8)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'higher-filter-01-visible-1',
          label: 'remove-if-not で偶数を抽出',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '(2 4 6 8)\n', comparison: 'exact' },
          },
        },
        {
          id: 'higher-filter-01-hidden-1',
          label: 'filter の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '(2 4 6 8)\n', comparison: 'exact' },
          },
        },
      ],
    },
  },
  {
    id: 'higher-reduce-01',
    title: 'reduce で畳み込む',
    category: '高階関数',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    learningGoals: ['reduce', 'aggregation'],
    description: `## reduce

\`reduce\` は、リストを左からたたみ込んで 1 つの値にまとめます。

\`\`\`lisp
(reduce #'+ '(1 2 3 4))
; => 10
\`\`\`

### 問題
\`reduce\` を使って、次の 2 つを出力してください。
- リスト \`(3 6 9 12)\` の合計
- リスト \`(2 3 4)\` の積`,
    hint: '積は #\'* を使います',
    initialCode: '; reduce で合計と積を出力してください\n',
    solution: `(print (reduce #'+ '(3 6 9 12)))
(print (reduce #'* '(2 3 4)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'higher-reduce-01-visible-1',
          label: 'reduce で合計と積を出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '30\n24\n', comparison: 'exact' },
          },
        },
        {
          id: 'higher-reduce-01-hidden-1',
          label: 'reduce 応用の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '30\n24\n', comparison: 'exact' },
          },
        },
      ],
    },
  },
  {
    id: 'string-format-01',
    title: 'format で文字列を組み立てる',
    category: '文字列操作',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    learningGoals: ['format', 'string construction'],
    description: `## format

\`format\` は文字列整形の基本ツールです。
第 1 引数に \`nil\` を渡すと、出力せず文字列を返します。

\`\`\`lisp
(format nil "Hello, ~A!" "Lisp")
; => "Hello, Lisp!"
\`\`\`

### 問題
\`format\` を使って、
\`Alice scored 95 points.\` という文字列を作り、出力してください。`,
    hint: '~A を 2 つ使うと値を差し込めます',
    initialCode: '; format で文章を作って出力してください\n',
    solution: `(print (format nil "~A scored ~A points." "Alice" 95))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'string-format-01-visible-1',
          label: 'format で文章を生成して出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '"Alice scored 95 points."\n', comparison: 'exact' },
          },
        },
        {
          id: 'string-format-01-hidden-1',
          label: 'format 文字列の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '"Alice scored 95 points."\n', comparison: 'exact' },
          },
        },
      ],
    },
  },
  {
    id: 'math-average-01',
    title: '平均値を計算する',
    category: '数値計算',
    difficulty: 'beginner',
    estimatedMinutes: 7,
    learningGoals: ['/', 'length'],
    description: `## 平均値

合計を要素数で割ると平均値になります。
リストの長さは \`length\` で取れます。

### 問題
リスト \`(2 4 6 8)\` の平均値を計算し、出力してください。`,
    hint: '合計は + で、要素数は length で求めます',
    initialCode: `(defvar *nums* '(2 4 6 8))
; 平均値を出力してください
`,
    solution: `(defvar *nums* '(2 4 6 8))
(print (/ (+ 2 4 6 8) (length *nums*)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'math-average-01-visible-1',
          label: '平均値の出力を確認',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '5\n', comparison: 'exact' },
          },
        },
        {
          id: 'math-average-01-hidden-1',
          label: '平均値計算の非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '5\n', comparison: 'exact' },
          },
        },
      ],
    },
  },
  {
    id: 'loop-collect-01',
    title: 'dotimes で平方を並べる',
    category: 'ループ',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    learningGoals: ['dotimes', 'iteration'],
    description: `## dotimes で繰り返す

\`dotimes\` は、指定した回数だけ繰り返す基本的な反復です。

\`\`\`lisp
(dotimes (i 3)
  (print (* (+ i 1) (+ i 1))))
; => 1, 4, 9 を順に出力
\`\`\`

### 問題
1 から 5 までの平方を、それぞれ 1 行ずつ出力してください。`,
    hint: 'dotimes は 0 から始まるので、必要なら (+ i 1) で補正します',
    initialCode: '; dotimes で 1 から 5 までの平方を順に出力してください\n',
    solution: `(dotimes (i 5)
  (print (* (+ i 1) (+ i 1))))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'loop-collect-01-visible-1',
          label: '1から5までの平方を順に出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '1\n4\n9\n16\n25\n', comparison: 'exact' },
          },
        },
        {
          id: 'loop-collect-01-hidden-1',
          label: 'dotimes 応用ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '1\n4\n9\n16\n25\n', comparison: 'exact' },
          },
        },
      ],
    },
  },
  {
    id: 'recursion-sum-01',
    title: '再帰でリストの合計を出す',
    category: '再帰',
    difficulty: 'intermediate',
    estimatedMinutes: 11,
    learningGoals: ['recursion', 'car', 'cdr'],
    description: `## 再帰でリストをたどる

リストの合計は、
「空リストなら 0、そうでなければ先頭 + 残りの合計」と考えると再帰で書けます。

### 問題
リストの要素の合計を返す \`sum-list\` を定義し、
次の 2 つを出力してください。
- \`(1 2 3 4 5)\` の合計
- 空リストの合計`,
    hint: 'ベースケースは null、再帰では car と cdr を使います',
    initialCode: '; sum-list 関数を定義してください\n\n; テスト\n; (print (sum-list (quote (1 2 3 4 5))))\n; (print (sum-list nil))\n',
    solution: `(defun sum-list (lst)
  (if (null lst)
      0
      (+ (car lst) (sum-list (cdr lst)))))
(print (sum-list '(1 2 3 4 5)))
(print (sum-list nil))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'recursion-sum-01-visible-1',
          label: 'sum-list の結果を出力',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '15\n0\n', comparison: 'exact' },
          },
        },
        {
          id: 'recursion-sum-01-hidden-1',
          label: 'sum-list 非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '15\n0\n', comparison: 'exact' },
          },
        },
      ],
    },
  },
  {
    id: 'binding-let-star-01',
    title: 'let* で前の束縛を使う',
    category: '基本構文',
    difficulty: 'intermediate',
    estimatedMinutes: 7,
    learningGoals: ['let*', 'sequential binding'],
    description: `## let*

\`let*\` は、前に束縛した変数を次の束縛式で使える形です。

\`\`\`lisp
(let* ((x 10)
       (y (+ x 5)))
  y)
; => 15
\`\`\`

### 問題
\`let*\` を使って、
- \`base = 3\`
- \`double = base * 2\`
- \`triple = base * 3\`
を順に束縛し、\`double + triple\` を出力してください。`,
    hint: 'let* なら後ろの束縛で前の変数を参照できます',
    initialCode: '; let* で順番に束縛してください\n',
    solution: `(let* ((base 3)
       (double (* base 2))
       (triple (* base 3)))
  (print (+ double triple)))`,
    judge: {
      kind: 'program',
      cases: [
        {
          id: 'binding-let-star-01-visible-1',
          label: 'let* で前の束縛を使って計算',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '15\n', comparison: 'exact' },
          },
        },
        {
          id: 'binding-let-star-01-hidden-1',
          label: 'let* 基本ケースの非公開チェック',
          visibility: 'hidden',
          run: { code: '' },
          expect: {
            output: { value: '15\n', comparison: 'exact' },
          },
        },
      ],
    },
  },
];

function getCategoryIndex(category: string): number {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

export const problems: Problem[] = problemSeeds
  .map((problem, originalIndex) => ({ problem, originalIndex }))
  .sort((left, right) => {
    const categoryDiff = getCategoryIndex(left.problem.category) - getCategoryIndex(right.problem.category);
    if (categoryDiff !== 0) return categoryDiff;

    const difficultyDiff = DIFFICULTY_ORDER[left.problem.difficulty] - DIFFICULTY_ORDER[right.problem.difficulty];
    if (difficultyDiff !== 0) return difficultyDiff;

    return left.originalIndex - right.originalIndex;
  })
  .map((sortedProblem, index, sortedProblems) => {
    const { problem } = sortedProblem;
    const courseId = getProblemCourseId(problem.category);
    const courseOrder =
      sortedProblems
        .slice(0, index)
        .filter((candidate) => getProblemCourseId(candidate.problem.category) === courseId)
        .length + 1;
    const catalog: ProblemCatalogInfo = {
      tier: getProblemTier(problem.difficulty),
      courseId,
      courseOrder,
      tags: getProblemTags(problem.category),
    };

    return {
      ...problem,
      order: index + 1,
      estimatedMinutes: problem.estimatedMinutes ?? DEFAULT_ESTIMATED_MINUTES[problem.difficulty],
      learningGoals: problem.learningGoals ?? [problem.category],
      learningPath: {
        ...CORE_LEARNING_PATH,
        step: index === 0 ? 1 : index + 1,
        prerequisites: index === 0 ? [] : [sortedProblems[index - 1].problem.id],
      },
      catalog,
    };
  });

export function getProblemsByLearningPath(): Problem[] {
  return problems
    .filter((problem) => problem.learningPath !== undefined)
    .sort((left, right) => (left.learningPath?.step ?? left.order) - (right.learningPath?.step ?? right.order));
}

export function getProblemsByCourse(): Map<ProblemCourseId, Problem[]> {
  const map = new Map<ProblemCourseId, Problem[]>();

  for (const courseId of Object.keys(PROBLEM_COURSES) as ProblemCourseId[]) {
    const courseProblems = problems
      .filter((problem) => problem.catalog?.courseId === courseId)
      .sort((left, right) => (left.catalog?.courseOrder ?? left.order) - (right.catalog?.courseOrder ?? right.order));

    map.set(courseId, courseProblems);
  }

  return map;
}

export function getNextRecommendedProblem(solvedProblemIds: string[]): Problem | null {
  const solvedSet = new Set(solvedProblemIds);
  const pathProblems = getProblemsByLearningPath();

  return pathProblems.find((problem) => {
    if (solvedSet.has(problem.id)) {
      return false;
    }

    return (problem.learningPath?.prerequisites ?? []).every((problemId) => solvedSet.has(problemId));
  }) ?? pathProblems.find((problem) => !solvedSet.has(problem.id)) ?? null;
}

export function getProblemsByCategory(): Map<string, Problem[]> {
  const map = new Map<string, Problem[]>();
  for (const p of problems) {
    const list = map.get(p.category) ?? [];
    list.push(p);
    map.set(p.category, list);
  }
  return map;
}
