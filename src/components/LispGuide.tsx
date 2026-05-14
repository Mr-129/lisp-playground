import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export interface GuideSectionSummary {
  id: string;
  title: string;
  keywords: string[];
}

const GUIDE_SECTIONS: GuideSectionSummary[] = [
  { id: 'guide-intro', title: 'Lispとは', keywords: ['common lisp', 'john mccarthy', '同図像性', 'homoiconicity'] },
  { id: 'guide-s-expr', title: 'S式（S-expression）', keywords: ['s式', 'atom', 'list', 'prefix notation', '前置記法'] },
  { id: 'guide-types', title: '基本データ型', keywords: ['整数', '浮動小数点数', '文字列', 'シンボル', 'nil'] },
  { id: 'guide-evaluation', title: '評価（Evaluation）とクォート', keywords: ['評価', 'quote', 'クォート', "'", 'quote', 'symbol evaluation', 'code as data', 'list literal'] },
  { id: 'guide-variables', title: '変数の定義と束縛', keywords: ['defvar', 'defparameter', 'setq', 'let', 'let*', 'レキシカルスコープ'] },
  { id: 'guide-defun', title: '関数の定義（defun）', keywords: ['defun', 'optional', '関数定義'] },
  { id: 'guide-lambda', title: '無名関数（lambda）', keywords: ['lambda', 'funcall', 'apply', "#'", 'mapcar', 'function', 'function object'] },
  { id: 'guide-conditions', title: '条件分岐', keywords: ['if', 'cond', 'when', 'unless', 'and', 'or', 'not'] },
  { id: 'guide-lists', title: 'リスト操作', keywords: ['car', 'cdr', 'cons', 'append', 'nth', 'member'] },
  { id: 'guide-loops', title: '繰り返し（ループ）', keywords: ['dotimes', 'dolist', '再帰', 'factorial'] },
  { id: 'guide-hof', title: '高階関数', keywords: ['mapcar', 'reduce', 'remove-if', 'funcall', 'apply'] },
  { id: 'guide-closures', title: 'クロージャ', keywords: ['closure', 'make-adder', 'make-counter', 'lambda'] },
  { id: 'guide-io', title: '入出力', keywords: ['print', 'princ', 'format', '~A', '~S', '~D'] },
  { id: 'guide-predicates', title: '比較と述語関数', keywords: ['eq', 'eql', 'equal', 'numberp', 'stringp', 'oddp'] },
  { id: 'guide-references', title: '📚 参考', keywords: ['hyperspec', 'practical common lisp', 'cltl2', 'reference'] },
];

function normalizeSearchText(text: string): string {
  return text.trim().toLocaleLowerCase();
}

export function filterGuideSections(searchQuery: string): GuideSectionSummary[] {
  const normalizedSearchQuery = normalizeSearchText(searchQuery);

  if (!normalizedSearchQuery) {
    return GUIDE_SECTIONS;
  }

  return GUIDE_SECTIONS.filter((section) => {
    const searchableText = [section.title, ...section.keywords].join(' ').toLocaleLowerCase();
    return searchableText.includes(normalizedSearchQuery);
  });
}

interface LispGuideProps {
  searchQuery?: string;
  selectedSectionId?: string | null;
}

export function LispGuide({ searchQuery = '', selectedSectionId = null }: LispGuideProps) {
  const navigate = useNavigate();
  const hasActiveSearch = searchQuery.trim().length > 0;
  const filteredSections = useMemo(() => filterGuideSections(searchQuery), [searchQuery]);
  const visibleSectionIds = useMemo(
    () => new Set(filteredSections.map((section) => section.id)),
    [filteredSections]
  );

  useEffect(() => {
    if (!selectedSectionId) {
      return;
    }

    document.getElementById(selectedSectionId)?.scrollIntoView?.({ block: 'start' });
  }, [selectedSectionId]);

  const shouldShowSection = (sectionId: string) => !hasActiveSearch || visibleSectionIds.has(sectionId);

  return (
    <div className="lisp-guide">
      <div className="guide-content">
        <h2 className="guide-main-title">📘 Common Lisp 基本構文ガイド</h2>
        {hasActiveSearch && (
          <div className="guide-search-summary" role="status">
            {filteredSections.length > 0
              ? `「${searchQuery}」に一致するガイド項目: ${filteredSections.length}件`
              : `「${searchQuery}」に一致するガイド項目はありません。`}
          </div>
        )}

        {/* 1. Lispとは */}
        {shouldShowSection('guide-intro') && (
        <section id="guide-intro" className="guide-section">
          <h3>Lispとは</h3>
          <p>
            <strong>Lisp</strong>（LISt Processor）は、1958年に<strong>John McCarthy</strong>によって設計された、
            世界で2番目に古い高水準プログラミング言語です（FORTRANに次ぐ）。
            人工知能（AI）研究で広く使用され、現在も <strong>Common Lisp</strong>、<strong>Scheme</strong>、<strong>Clojure</strong> などの
            方言として活発に使われています。
          </p>
          <p>
            Lispの最大の特徴は、<strong>「コードとデータが同じ構造（S式）で表現される」</strong>ことです。
            これを <strong>同図像性（homoiconicity）</strong>と呼び、マクロによるメタプログラミングを可能にします。
          </p>
        </section>
        )}

        {/* 2. S式 */}
        {shouldShowSection('guide-s-expr') && (
        <section id="guide-s-expr" className="guide-section">
          <h3>S式（S-expression）</h3>
          <p>
            Lispのプログラムはすべて<strong>S式</strong>で構成されます。
            S式は<strong>アトム（atom）</strong>か、括弧で囲まれた<strong>リスト</strong>のいずれかです。
          </p>
          <pre className="guide-code">{`;; アトムの例
42          ; 数値アトム
"hello"     ; 文字列アトム
t           ; 真（true）を表す特殊なアトム
nil         ; 偽（false）/ 空リスト
foo         ; シンボルアトム

;; リスト（S式）の例
(+ 1 2)           ; => 3
(* 3 (+ 1 2))     ; => 9（ネスト可能）`}</pre>
          <p>
            リストの最初の要素は<strong>演算子（関数名）</strong>、残りは<strong>引数</strong>です。
            これを<strong>前置記法（prefix notation）</strong>と呼びます。
          </p>
          <div className="guide-note">
            <strong>💡 ポイント:</strong> 数学では <code>1 + 2</code> と書きますが、Lispでは <code>(+ 1 2)</code> と書きます。
            演算子が常に先頭に来るため、引数の数に制限がなく <code>(+ 1 2 3 4 5)</code> も有効です。
          </div>
        </section>
        )}

        {/* 3. データ型 */}
        {shouldShowSection('guide-types') && (
        <section id="guide-types" className="guide-section">
          <h3>基本データ型</h3>
          <table className="guide-table">
            <thead>
              <tr><th>型</th><th>例</th><th>説明</th></tr>
            </thead>
            <tbody>
              <tr><td>整数</td><td><code>42</code>, <code>-7</code>, <code>0</code></td><td>任意精度の整数</td></tr>
              <tr><td>浮動小数点数</td><td><code>3.14</code>, <code>1.0e10</code></td><td>実数</td></tr>
              <tr><td>文字列</td><td><code>"Hello"</code></td><td>ダブルクォートで囲む</td></tr>
              <tr><td>シンボル</td><td><code>foo</code>, <code>my-var</code></td><td>識別子として使用</td></tr>
              <tr><td>真偽値</td><td><code>t</code> / <code>nil</code></td><td>NILのみが偽、それ以外はすべて真</td></tr>
              <tr><td>リスト</td><td><code>'(1 2 3)</code></td><td>コンスセルの連鎖</td></tr>
            </tbody>
          </table>
          <div className="guide-note">
            <strong>💡 ポイント:</strong> Common Lispでは <code>nil</code> は「偽」と「空リスト」の両方を表します。
            <code>nil</code> 以外のすべての値は真（truthy）です。<code>0</code> や <code>""</code> も真です。
          </div>
        </section>
        )}

        {/* 4. 評価とクォート */}
        {shouldShowSection('guide-evaluation') && (
        <section id="guide-evaluation" className="guide-section">
          <h3>評価（Evaluation）とクォート</h3>
          <p>
            Lispの処理系は式を<strong>評価（evaluate）</strong>して値を返します。
            リストが評価されると、先頭が関数として呼び出され、残りの要素が引数として渡されます。
          </p>
          <pre className="guide-code">{`;; 通常の評価
(+ 1 2)       ; => 3  （+関数を1と2で呼び出し）

;; クォート（'）で評価を抑制
'(+ 1 2)      ; => (+ 1 2)  （リストそのものが返る）
'hello        ; => HELLO     （シンボルそのものが返る）

;; quote は ' の正式な書き方
(quote (1 2 3))  ; => (1 2 3)`}</pre>
          <p>
            <code>'</code>（クォート）を付けると、式は評価されずにそのままデータとして扱われます。
            リストリテラルを書くときに必須です。
          </p>
          <h4>シンボルは通常は変数として評価される</h4>
          <p>
            シンボルをそのまま書くと、通常は「その名前の変数を参照する式」として扱われます。
            シンボルそのものをデータとして扱いたいときは、<code>quote</code> を付けます。
          </p>
          <pre className="guide-code">{`(defvar x 10)

x      ; => 10
'x     ; => X`}</pre>
          <h4>コードとデータは同じ形で書ける</h4>
          <p>
            <code>(+ 1 2)</code> は計算する式ですが、<code>'(+ 1 2)</code> は「足し算の式そのもの」というデータです。
            Lisp ではプログラムとリストデータが同じ形で書けるため、コードをそのままデータとして扱えます。
          </p>
          <pre className="guide-code">{`(+ 1 2)      ; => 3
'(+ 1 2)     ; => (+ 1 2)

(first '(+ 1 2))   ; => +
(rest '(+ 1 2))    ; => (1 2)`}</pre>
          <h4>quote と list で式データを作る</h4>
          <p>
            <code>quote</code> は式をそのまま書く方法で、<code>list</code> は式を組み立てる方法です。
            どちらも結果として同じ式データを作れます。
          </p>
          <pre className="guide-code">{`'(+ 1 2)           ; => (+ 1 2)
(list '+ 1 2)      ; => (+ 1 2)`}</pre>
          <div className="guide-note">
            <strong>💡 よくある誤解:</strong> <code>'+</code> は<strong>シンボル</strong>、<code>#'+</code> は<strong>関数オブジェクト</strong>です。<br />
            この違いを区別すると、<code>funcall</code> や <code>apply</code> を読みやすくなります。
          </div>
        </section>
        )}

        {/* 5. 変数 */}
        {shouldShowSection('guide-variables') && (
        <section id="guide-variables" className="guide-section">
          <h3>変数の定義と束縛</h3>
          <h4>グローバル変数（defvar / defparameter）</h4>
          <pre className="guide-code">{`;; defvar: 未定義のときだけ値を設定
(defvar *name* "Lisp")       ; 慣例: *earmuffs* で囲む

;; defparameter: 毎回値を上書き
(defparameter *pi* 3.14159)

;; setq: 既存の変数に値を代入
(setq *name* "Common Lisp")`}</pre>
          <div className="guide-note">
            <strong>💡 慣例:</strong> グローバル変数は <code>*asterisks*</code>（イヤーマフ記法）で囲むのが Common Lisp の慣例です。
          </div>

          <h4>ローカル変数（let / let*）</h4>
          <pre className="guide-code">{`;; let: 複数の変数を同時に束縛（並列束縛）
(let ((x 10)
      (y 20))
  (+ x y))     ; => 30

;; let*: 前の束縛を参照できる（逐次束縛）
(let* ((x 10)
       (y (* x 2)))
  (+ x y))     ; => 30`}</pre>
          <p>
            <code>let</code> で定義された変数はそのブロック内でのみ有効です（<strong>レキシカルスコープ</strong>）。
          </p>
        </section>
        )}

        {/* 6. 関数定義 */}
        {shouldShowSection('guide-defun') && (
        <section id="guide-defun" className="guide-section">
          <h3>関数の定義（defun）</h3>
          <pre className="guide-code">{`;; 基本構文
(defun 関数名 (引数リスト)
  本体)

;; 例: 二乗を計算する関数
(defun square (x)
  (* x x))

(square 5)    ; => 25

;; 複数の式を含む関数（最後の式の値が返る）
(defun greet (name)
  (print "Hello!")
  (format nil "Welcome, ~A!" name))

;; オプション引数
(defun hello (&optional (name "World"))
  (format nil "Hello, ~A!" name))

(hello)         ; => "Hello, World!"
(hello "Lisp")  ; => "Hello, Lisp!"`}</pre>
        </section>
  )}

        {/* 7. 無名関数 (lambda) */}
  {shouldShowSection('guide-lambda') && (
  <section id="guide-lambda" className="guide-section">
          <h3>無名関数（lambda）</h3>
          <pre className="guide-code">{`;; lambda で無名関数を作成
(lambda (x) (* x x))

;; 即座に呼び出す
((lambda (x y) (+ x y)) 3 4)   ; => 7

;; 変数に格納して funcall で呼ぶ
(defvar *fn* (lambda (x) (* x 2)))
(funcall *fn* 5)                ; => 10

;; #' で関数オブジェクトを取得
(mapcar #'1+ '(1 2 3))         ; => (2 3 4)
(mapcar (lambda (x) (* x x)) '(1 2 3 4))  ; => (1 4 9 16)`}</pre>
          <h4>function と #'</h4>
          <p>
            <code>#'</code> は <code>(function ...)</code> の省略形です。
            関数名や lambda 式を「関数オブジェクト」として扱いたいときに使います。
          </p>
          <pre className="guide-code">{`#'+
(function +)
(function (lambda (x) (* x x)))`}</pre>
          <h4>funcall と apply</h4>
          <p>
            <code>funcall</code> は引数をそのまま並べて渡し、<code>apply</code> は最後のリストを展開して渡します。
            見た目は似ていますが、可変長の引数列を扱うときに役割が分かれます。
          </p>
          <pre className="guide-code">{`(funcall #'+ 1 2 3)     ; => 6
(apply #'+ '(1 2 3))    ; => 6
(apply #'+ 10 '(1 2 3)) ; => 16`}</pre>
          <h4>関数オブジェクトを変数に入れる</h4>
          <p>
            関数は値なので、変数に束縛したり、条件によって返したりできます。
            ここまで理解できると、高階関数の見え方がかなり変わります。
          </p>
          <pre className="guide-code">{`(defvar *op* #'+)
(funcall *op* 3 4 5)   ; => 12

(defun choose-op (use-add)
  (if use-add #'+ #'*))

(funcall (choose-op t) 2 3 4)   ; => 9
(funcall (choose-op nil) 2 3 4) ; => 24`}</pre>
          <div className="guide-note">
            <strong>💡 funcall vs apply:</strong>
            <code>funcall</code> は引数を個別に渡し、<code>apply</code> はリストとして渡します。<br />
            <code>(funcall #'+ 1 2 3)</code> → 6、<code>(apply #'+ '(1 2 3))</code> → 6
          </div>
        </section>
        )}

        {/* 8. 条件分岐 */}
        {shouldShowSection('guide-conditions') && (
        <section id="guide-conditions" className="guide-section">
          <h3>条件分岐</h3>

          <h4>if式</h4>
          <pre className="guide-code">{`;; if: 条件が真なら第2引数、偽なら第3引数
(if (> 3 2)
    "3 is greater"
    "2 is greater")    ; => "3 is greater"

;; 偽の分岐は省略可能（nil が返る）
(if nil "yes")         ; => NIL`}</pre>

          <h4>cond式（多分岐）</h4>
          <pre className="guide-code">{`;; cond: 複数の条件を順に評価
(defun classify (n)
  (cond
    ((< n 0)  "negative")
    ((= n 0)  "zero")
    ((< n 10) "small")
    (t        "large")))    ; t はデフォルト節

(classify 5)    ; => "small"
(classify -1)   ; => "negative"`}</pre>

          <h4>when / unless</h4>
          <pre className="guide-code">{`;; when: 条件が真のとき複数の式を実行
(when (> 5 3)
  (print "5 > 3")
  "yes")

;; unless: 条件が偽のとき実行
(unless (> 2 5)
  "2 is not greater than 5")`}</pre>

          <h4>論理演算子</h4>
          <pre className="guide-code">{`;; and: すべて真なら最後の値、偽があればnil
(and t t 42)     ; => 42
(and t nil 42)   ; => NIL

;; or: 最初の真値、すべて偽ならnil
(or nil nil 42)  ; => 42
(or nil nil)     ; => NIL

;; not: 真偽の反転
(not nil)        ; => T
(not 42)         ; => NIL`}</pre>
        </section>
  )}

        {/* 9. リスト操作 */}
  {shouldShowSection('guide-lists') && (
  <section id="guide-lists" className="guide-section">
          <h3>リスト操作</h3>
          <p>
            Lispの名前は <strong>LISt Processor</strong> に由来します。
            リストはLispの最も重要なデータ構造で、<strong>コンスセル（cons cell）</strong>の連鎖で構成されます。
          </p>
          <pre className="guide-code">{`;; リストの作成
'(1 2 3)              ; クォートでリストリテラル
(list 1 2 3)          ; list 関数で作成
(cons 1 (cons 2 (cons 3 nil)))  ; コンスセルで手動構築

;; 基本アクセス
(car '(1 2 3))        ; => 1     先頭要素（first）
(cdr '(1 2 3))        ; => (2 3) 残り（rest）
(cadr '(1 2 3))       ; => 2     2番目（car of cdr）
(caddr '(1 2 3))      ; => 3     3番目

;; 要素の追加
(cons 0 '(1 2 3))     ; => (0 1 2 3)  先頭に追加

;; リスト操作関数
(append '(1 2) '(3 4))  ; => (1 2 3 4) 結合
(reverse '(1 2 3))      ; => (3 2 1)   反転
(length '(1 2 3))        ; => 3         長さ
(member 2 '(1 2 3))      ; => (2 3)     検索
(nth 1 '(10 20 30))     ; => 20        n番目
(last '(1 2 3))          ; => (3)       最後のコンスセル`}</pre>

          <div className="guide-note">
            <strong>💡 car / cdr の由来:</strong>
            IBMの機械語命令に由来します。<code>car</code> = Contents of Address Register、
            <code>cdr</code> = Contents of Decrement Register。
            現代では <code>first</code> / <code>rest</code> というエイリアスも使えます。
          </div>
        </section>
        )}

        {/* 10. ループ */}
        {shouldShowSection('guide-loops') && (
        <section id="guide-loops" className="guide-section">
          <h3>繰り返し（ループ）</h3>

          <h4>dotimes（回数指定ループ）</h4>
          <pre className="guide-code">{`;; 0 から n-1 まで繰り返し
(dotimes (i 5)
  (print i))     ; 0, 1, 2, 3, 4 を出力`}</pre>

          <h4>dolist（リストループ）</h4>
          <pre className="guide-code">{`;; リストの各要素に対して繰り返し
(dolist (x '(1 2 3))
  (print (* x x)))   ; 1, 4, 9 を出力`}</pre>

          <h4>再帰</h4>
          <pre className="guide-code">{`;; Lispでは再帰が自然なループ手法
(defun factorial (n)
  (if (<= n 1)
      1
      (* n (factorial (- n 1)))))

(factorial 5)   ; => 120`}</pre>
        </section>
  )}

        {/* 11. 高階関数 */}
  {shouldShowSection('guide-hof') && (
  <section id="guide-hof" className="guide-section">
          <h3>高階関数</h3>
          <p>
            関数を引数として受け取ったり、関数を返したりする関数を<strong>高階関数</strong>と呼びます。
            Lispでは関数がファーストクラスオブジェクトです。
          </p>
          <pre className="guide-code">{`;; mapcar: 各要素に関数を適用して新しいリストを返す
(mapcar #'1+ '(1 2 3))                    ; => (2 3 4)
(mapcar (lambda (x) (* x x)) '(1 2 3))   ; => (1 4 9)

;; remove-if: 条件に合う要素を除去
(remove-if #'oddp '(1 2 3 4 5))           ; => (2 4)

;; reduce: リストを畳み込む
(reduce #'+ '(1 2 3 4 5))                 ; => 15

;; funcall: 関数オブジェクトを呼び出す
(funcall #'+ 1 2 3)                        ; => 6

;; apply: 引数をリストで渡す
(apply #'+ '(1 2 3))                       ; => 6`}</pre>
        </section>
  )}

        {/* 12. クロージャ */}
  {shouldShowSection('guide-closures') && (
  <section id="guide-closures" className="guide-section">
          <h3>クロージャ</h3>
          <p>
            クロージャは、関数とその定義時の環境（変数の束縛）を一緒に保持する仕組みです。
            <code>let</code> で環境を作り、<code>lambda</code> でそれを閉じ込めます。
          </p>
          <pre className="guide-code">{`;; 加算器を作る関数
(defun make-adder (n)
  (lambda (x) (+ x n)))

(defvar *add5* (make-adder 5))
(funcall *add5* 10)     ; => 15
(funcall *add5* 20)     ; => 25

;; 状態を持つカウンター
(defun make-counter ()
  (let ((count 0))
    (lambda ()
      (setq count (+ count 1))
      count)))

(defvar *c* (make-counter))
(funcall *c*)    ; => 1
(funcall *c*)    ; => 2
(funcall *c*)    ; => 3`}</pre>
        </section>
  )}

        {/* 13. 出力 */}
  {shouldShowSection('guide-io') && (
  <section id="guide-io" className="guide-section">
          <h3>入出力</h3>
          <pre className="guide-code">{`;; print: 値を出力（改行あり、読み取り可能形式）
(print "Hello")     ; "Hello" と出力

;; princ: 人間が読みやすい形式で出力
(princ "Hello")     ; Hello と出力（クォートなし）

;; format: 書式指定出力
(format t "~A + ~A = ~A~%" 1 2 3)
;; => 1 + 2 = 3 と出力

;; format の主な書式指定子:
;; ~A  美的（aesthetic）出力
;; ~S  読み取り可能（S式）形式
;; ~D  10進数
;; ~%  改行
;; ~{~A ~}  リストの各要素をフォーマット`}</pre>
        </section>
  )}

        {/* 14. 比較と述語 */}
  {shouldShowSection('guide-predicates') && (
  <section id="guide-predicates" className="guide-section">
          <h3>比較と述語関数</h3>
          <pre className="guide-code">{`;; 数値の比較
(= 1 1)       ; => T
(/= 1 2)      ; => T  (not equal)
(< 1 2)       ; => T
(> 2 1)       ; => T
(<= 1 1)      ; => T
(>= 2 1)      ; => T

;; 述語関数（真偽を返す関数、慣例で p で終わる）
(numberp 42)   ; => T   数値か？
(stringp "hi") ; => T   文字列か？
(listp '(1))   ; => T   リストか？
(null nil)     ; => T   nilか？
(zerop 0)      ; => T   ゼロか？
(plusp 5)      ; => T   正の数か？
(minusp -3)    ; => T   負の数か？
(evenp 4)      ; => T   偶数か？
(oddp 3)       ; => T   奇数か？

;; 等価性
(eq 'a 'a)       ; => T  同一オブジェクトか
(eql 1 1)        ; => T  同一の型と値か
(equal '(1) '(1)) ; => T 構造的に等しいか`}</pre>
        </section>
  )}

        {/* 参照リンク */}
  {shouldShowSection('guide-references') && (
  <section id="guide-references" className="guide-section guide-references">
          <h3>📚 参考</h3>
          <ul className="reference-list">
            <li>
              <a href="https://www.lispworks.com/documentation/HyperSpec/Front/" target="_blank" rel="noopener noreferrer">
                <strong>Common Lisp HyperSpec</strong>
              </a>
              <span className="ref-desc"> — ANSI Common Lisp の公式仕様書。関数・マクロ・特殊オペレータの完全なリファレンス。</span>
            </li>
            <li>
              <a href="https://www.cs.cmu.edu/Groups/AI/html/cltl/cltl2.html" target="_blank" rel="noopener noreferrer">
                <strong>Common Lisp the Language, 2nd Edition (CLtL2)</strong>
              </a>
              <span className="ref-desc"> — Guy L. Steele 著。ANSI 標準化前の包括的なリファレンス。オンラインで全文公開。</span>
            </li>
            <li>
              <a href="https://gigamonkeys.com/book/" target="_blank" rel="noopener noreferrer">
                <strong>Practical Common Lisp</strong>
              </a>
              <span className="ref-desc"> — Peter Seibel 著。実践的な Common Lisp チュートリアル。全文無料公開。入門に最適。</span>
            </li>
            <li>
              <a href="https://lisp-lang.org/learn/" target="_blank" rel="noopener noreferrer">
                <strong>lisp-lang.org - Learn Common Lisp</strong>
              </a>
              <span className="ref-desc"> — Common Lisp コミュニティ公式サイト。チュートリアルとガイドの集約。</span>
            </li>
            <li>
              <a href="https://www.gnu.org/software/emacs/manual/html_node/eintr/" target="_blank" rel="noopener noreferrer">
                <strong>An Introduction to Programming in Emacs Lisp</strong>
              </a>
              <span className="ref-desc"> — GNU による Emacs Lisp 入門。Lisp の基本概念を学ぶのに有用（Emacs Lisp は Common Lisp と方言が異なる点に注意）。</span>
            </li>
            <li>
              <a href="https://en.wikipedia.org/wiki/Common_Lisp" target="_blank" rel="noopener noreferrer">
                <strong>Wikipedia: Common Lisp</strong>
              </a>
              <span className="ref-desc"> — 歴史、仕様、実装の概要。</span>
            </li>
          </ul>
        </section>
        )}

        <div className="guide-footer">
          <p>上記の構文を理解したら、問題を選択して実際にコードを書いてみましょう！</p>
          <button className="guide-start-button" onClick={() => navigate('/problems')}>
            ← 問題一覧に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
