import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface GlossaryTerm {
  term: string;
  aliases?: string[];
  summary: string;
  detail: string;
  example?: string;
}

interface GlossarySection {
  id: string;
  title: string;
  description: string;
  terms: GlossaryTerm[];
}

const GLOSSARY_SECTIONS: GlossarySection[] = [
  {
    id: 'basics',
    title: '基本形とデータ',
    description: 'Lisp のコードとデータを読むときに最初に出てくる土台です。',
    terms: [
      {
        term: 'S式',
        aliases: ['s-expression', 'sexp'],
        summary: 'Lisp のコードとデータの基本単位です。',
        detail: '丸括弧で囲んだ形だけでなく、数値・文字列・シンボルのような単独の値も S式 に含まれます。',
        example: '(+ 1 2)',
      },
      {
        term: 'atom',
        aliases: ['アトム'],
        summary: 'リストではない最小単位の値です。',
        detail: '数値、文字列、シンボル、NIL などは atom として扱われます。',
        example: '42',
      },
      {
        term: 'symbol',
        aliases: ['シンボル'],
        summary: '名前を表す基本データです。',
        detail: '変数名や関数名として使われ、評価時にはその名前に束縛された値を参照します。',
        example: 'user-name',
      },
      {
        term: 'nil',
        aliases: ['NIL'],
        summary: '空リストであり、同時に偽でもある特別な値です。',
        detail: 'Lisp では NIL が「要素がない」と「false」を兼ねます。条件式でも頻出します。',
        example: '()',
      },
      {
        term: 'cons cell',
        aliases: ['cons', 'コンスセル'],
        summary: 'リストをつなぐ 2 要素の箱です。',
        detail: 'car と cdr を持つペアで、リストは cons cell が連結した構造として表現されます。',
        example: "(cons 'a '(b c))",
      },
      {
        term: 'list',
        aliases: ['リスト'],
        summary: '順序付きの要素列で、Lisp ではコードもリストで書きます。',
        detail: 'データ構造として使うだけでなく、関数呼び出しや特殊形式の見た目もリストです。',
        example: "'(1 2 3)",
      },
    ],
  },
  {
    id: 'evaluation',
    title: '評価と構文',
    description: 'Lisp が式をどう読むか、どこまで評価するかを理解するための語群です。',
    terms: [
      {
        term: 'quote',
        aliases: ["'", 'クォート'],
        summary: '式を評価せず、そのままデータとして扱います。',
        detail: 'リストやシンボルを「実行」ではなく「その形のまま」扱いたいときに使います。',
        example: "'(a b c)",
      },
      {
        term: 'eval',
        aliases: ['評価'],
        summary: '式を実行して値へ変換することです。',
        detail: 'Lisp では評価前の見た目がそのままデータになるため、quote と eval の対比が重要です。',
        example: '(eval (list \'+ 1 2))',
      },
      {
        term: 'special form',
        aliases: ['特殊形式'],
        summary: '引数の評価ルールが通常の関数と異なる構文です。',
        detail: 'if, let, lambda, quote などは全部の引数を先に評価しないため、通常の関数とは別扱いです。',
        example: '(if condition then-value else-value)',
      },
      {
        term: 'macro',
        aliases: ['マクロ'],
        summary: '評価前の式を書き換える仕組みです。',
        detail: '関数が「値」を受け取るのに対し、マクロは「式そのもの」を受け取って新しい式を返します。',
        example: '(when ready (print "go"))',
      },
      {
        term: 'keyword',
        aliases: ['キーワード'],
        summary: '先頭に : が付く自己評価シンボルです。',
        detail: '設定値やオプション名としてよく使われ、通常のシンボルのように変数参照はされません。',
        example: ':direction',
      },
      {
        term: 'predicate',
        aliases: ['述語'],
        summary: '真偽値を返す判定用の関数です。',
        detail: '慣習的に末尾を ? や p にして表し、条件分岐やフィルタで多用します。',
        example: '(listp value)',
      },
    ],
  },
  {
    id: 'functions',
    title: '関数と束縛',
    description: '関数を作る、呼ぶ、局所変数を置くときに頻出する用語です。',
    terms: [
      {
        term: 'lambda',
        aliases: ['ラムダ'],
        summary: '無名関数を作るための構文です。',
        detail: 'その場で関数を定義できるので、高階関数やクロージャと組み合わせてよく使います。',
        example: '(lambda (x) (+ x 1))',
      },
      {
        term: 'defun',
        aliases: ['関数定義'],
        summary: '名前付き関数を定義する代表的な形式です。',
        detail: '引数リストと本体をまとめて定義し、以後はその名前で呼び出せます。',
        example: '(defun square (x) (* x x))',
      },
      {
        term: 'funcall',
        summary: '関数オブジェクトを呼び出す関数です。',
        detail: '変数に入った関数や lambda 式の結果など、名前ではなく値として持っている関数を実行します。',
        example: '(funcall fn 10)',
      },
      {
        term: 'apply',
        summary: '引数リストを展開して関数へ渡します。',
        detail: '最後の引数をリストとして受け取り、その中身を個別の引数として呼び出しに使います。',
        example: "(apply #'+ '(1 2 3 4))",
      },
      {
        term: 'let',
        summary: '局所変数をまとめて束縛する構文です。',
        detail: '同じ段階で初期値を計算してから、まとめて本体へ持ち込みます。',
        example: '(let ((x 1) (y 2)) (+ x y))',
      },
      {
        term: 'let*',
        summary: '局所変数を順番に束縛する構文です。',
        detail: '後ろの変数初期化で前に束縛した値を参照できる点が let との違いです。',
        example: '(let* ((x 2) (y (+ x 3))) y)',
      },
    ],
  },
  {
    id: 'lists',
    title: 'リスト操作の基本',
    description: 'リストを分解したり、辞書のように見立てたりするときの基本語です。',
    terms: [
      {
        term: 'car',
        summary: 'リストの先頭要素を取り出します。',
        detail: 'cons cell の前半に入っている値を返します。リスト走査の最初の一歩です。',
        example: "(car '(10 20 30))",
      },
      {
        term: 'cdr',
        summary: 'リストの先頭以外の残りを返します。',
        detail: 'cons cell の後半を返し、再帰やループでリストを順に処理するときに使います。',
        example: "(cdr '(10 20 30))",
      },
      {
        term: 'association list',
        aliases: ['alist'],
        summary: 'キーと値のペアを並べたリストです。',
        detail: '簡易的な辞書として使われ、キー検索には assoc などを使います。',
        example: "'((name . \"Ada\") (role . \"admin\"))",
      },
      {
        term: 'property list',
        aliases: ['plist'],
        summary: 'キーと値を交互に並べたリストです。',
        detail: 'キーワードと組み合わせて設定情報を表すときによく使います。',
        example: "'(:name \"Ada\" :role \"admin\")",
      },
      {
        term: 'mapcar',
        summary: '各要素へ関数を適用して新しいリストを作ります。',
        detail: '元のリストを壊さず、同じ長さの結果リストを返す代表的な高階関数です。',
        example: "(mapcar #'1+ '(1 2 3))",
      },
      {
        term: 'reduce',
        summary: '複数要素を 1 つの値へ畳み込みます。',
        detail: '総和、最大値、文字列連結のように、リスト全体を 1 結果へ集約したいときに使います。',
        example: "(reduce #'+ '(1 2 3 4))",
      },
    ],
  },
  {
    id: 'runtime',
    title: 'スコープと実行モデル',
    description: '状態を持つ関数や対話的な実行環境を理解するための語群です。',
    terms: [
      {
        term: 'lexical scope',
        aliases: ['レキシカルスコープ', '静的スコープ'],
        summary: '変数がどこで見えるかを、コードの書かれた位置で決める規則です。',
        detail: '関数が定義された時点の周囲の束縛を参照できるため、クロージャの基盤になります。',
        example: '(let ((x 10)) (lambda () x))',
      },
      {
        term: 'closure',
        aliases: ['クロージャ'],
        summary: '周囲の束縛を保持したまま使える関数です。',
        detail: '関数を返したあとも外側のローカル変数を覚えていられるので、状態つき関数を作れます。',
        example: '(make-counter)',
      },
      {
        term: 'setq',
        summary: '変数へ値を代入する基本的な形式です。',
        detail: '既存の束縛を更新するときに使い、クロージャ内部の状態更新でもよく出てきます。',
        example: '(setq total (+ total 1))',
      },
      {
        term: 'recursion',
        aliases: ['再帰'],
        summary: '関数が自分自身を呼び出して問題を分割する手法です。',
        detail: 'リスト処理や木構造の走査で自然に書ける一方、停止条件を明確に置く必要があります。',
        example: '(defun fact (n) (if (<= n 1) 1 (* n (fact (- n 1)))))',
      },
      {
        term: 'higher-order function',
        aliases: ['高階関数'],
        summary: '関数を引数に取る、または関数を返す関数です。',
        detail: 'mapcar, reduce, filter 的な処理や、関数生成のパターンで頻繁に使います。',
        example: '(mapcar fn values)',
      },
      {
        term: 'REPL',
        aliases: ['Read Eval Print Loop'],
        summary: '入力してすぐ評価結果を確認できる対話実行環境です。',
        detail: '小さく試して理解を進める LISP 学習の中心的な道具で、このサイトでも独立ページとして使えます。',
        example: '(+ 1 2)',
      },
    ],
  },
];

const TOTAL_TERM_COUNT = GLOSSARY_SECTIONS.reduce((count, section) => count + section.terms.length, 0);

function matchesQuery(term: GlossaryTerm, query: string): boolean {
  if (!query) {
    return true;
  }

  const corpus = [term.term, term.summary, term.detail, term.example ?? '', ...(term.aliases ?? [])]
    .join(' ')
    .toLowerCase();

  return corpus.includes(query);
}

export function GlossaryPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredSections = GLOSSARY_SECTIONS.map((section) => ({
    ...section,
    terms: section.terms.filter((term) => matchesQuery(term, normalizedQuery)),
  })).filter((section) => section.terms.length > 0);
  const matchedTermCount = filteredSections.reduce((count, section) => count + section.terms.length, 0);

  return (
    <div className="glossary-page">
      <div className="glossary-page-container">
        <section className="glossary-page-hero" aria-labelledby="glossary-page-title">
          <div>
            <p className="glossary-page-eyebrow">Glossary</p>
            <h2 id="glossary-page-title">Lisp の用語解説</h2>
          </div>
          <p className="glossary-page-summary">
            構文ガイドや問題で繰り返し出てくる言葉を、1 ページで引ける早見表としてまとめました。
            「名前は見たことがあるけれど意味が曖昧」という語を素早く引き直す用途を想定しています。
          </p>
          <div className="glossary-page-actions">
            <button type="button" className="glossary-page-primary" onClick={() => navigate('/guide')}>
              📘 構文ガイドへ
            </button>
            <button type="button" className="glossary-page-secondary" onClick={() => navigate('/problems')}>
              📚 問題一覧へ
            </button>
          </div>
        </section>

        <section className="glossary-toolbar" aria-label="用語検索">
          <label className="glossary-search-label" htmlFor="glossary-search-input">
            用語を検索
          </label>
          <input
            id="glossary-search-input"
            className="glossary-search-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例: quote, closure, plist"
          />
          <p className="glossary-search-meta">
            {normalizedQuery ? `${matchedTermCount}語ヒット` : `全 ${TOTAL_TERM_COUNT} 語を掲載`}
          </p>
        </section>

        {!normalizedQuery && (
          <nav className="glossary-index" aria-label="用語カテゴリ">
            {GLOSSARY_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                className="glossary-index-chip"
                onClick={() => document.getElementById(`glossary-section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                {section.title}
              </button>
            ))}
          </nav>
        )}

        {filteredSections.length === 0 ? (
          <section className="glossary-empty" aria-live="polite">
            <h3>該当する用語がありません</h3>
            <p>別の表記や英語名でも検索できます。例: lambda, alist, recursion</p>
          </section>
        ) : (
          filteredSections.map((section) => (
            <section
              key={section.id}
              id={`glossary-section-${section.id}`}
              className="glossary-section"
              aria-labelledby={`glossary-heading-${section.id}`}
            >
              <div className="glossary-section-header">
                <div>
                  <h3 id={`glossary-heading-${section.id}`}>{section.title}</h3>
                  <p>{section.description}</p>
                </div>
                <span className="glossary-section-count">{section.terms.length}語</span>
              </div>
              <div className="glossary-card-grid">
                {section.terms.map((term) => (
                  <article key={term.term} className="glossary-card">
                    <div className="glossary-card-header">
                      <h4>{term.term}</h4>
                      {term.aliases && term.aliases.length > 0 && (
                        <div className="glossary-card-aliases" aria-label={`${term.term} の別名`}>
                          {term.aliases.map((alias) => (
                            <span key={alias} className="glossary-card-alias">
                              {alias}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="glossary-card-summary">{term.summary}</p>
                    <p className="glossary-card-detail">{term.detail}</p>
                    {term.example && (
                      <div className="glossary-card-example">
                        <span>例</span>
                        <pre>
                          <code>{term.example}</code>
                        </pre>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}