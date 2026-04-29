import { describe, it, expect, beforeEach } from 'vitest';
import { evaluate, createGlobalEnv, rebindOutputBuiltins, resetEvaluationDepth, OutputFn } from '../evaluator';
import { readFromString } from '../parser';
import { printValue, Environment } from '../types';

let outputBuffer: string;
let output: OutputFn;
let env: Environment;

function evalCode(source: string): string {
  const exprs = readFromString(source);
  let last = '';
  for (const expr of exprs) {
    last = printValue(evaluate(expr, env, output));
  }
  return last;
}

beforeEach(() => {
  outputBuffer = '';
  output = (text: string) => { outputBuffer += text; };
  resetEvaluationDepth();
  env = createGlobalEnv(output);
});

describe('evaluator — 特殊形式', () => {
  it('QUOTE', () => {
    expect(evalCode("'(1 2 3)")).toBe('(1 2 3)');
  });

  it('IF — 真', () => {
    expect(evalCode('(if t 1 2)')).toBe('1');
  });

  it('IF — 偽', () => {
    expect(evalCode('(if nil 1 2)')).toBe('2');
  });

  it('COND', () => {
    expect(evalCode('(cond ((= 1 2) "a") ((= 1 1) "b") (t "c"))')).toBe('"b"');
  });

  it('COND はどの節も真でなければ NIL を返す', () => {
    expect(evalCode('(cond ((= 1 2) "a") ((= 2 3) "b"))')).toBe('NIL');
  });

  it('COND の各節がリストでないとエラー', () => {
    expect(() => evalCode('(cond t)')).toThrow('condの各節はリストである必要があります');
  });

  it('WHEN — 真', () => {
    expect(evalCode('(when t 42)')).toBe('42');
  });

  it('WHEN — 真で複数式を順に評価する', () => {
    expect(evalCode('(when t 1 2 3)')).toBe('3');
  });

  it('WHEN — 真でも body がなければ NIL を返す', () => {
    expect(evalCode('(when t)')).toBe('NIL');
  });

  it('WHEN — 偽', () => {
    expect(evalCode('(when nil 42)')).toBe('NIL');
  });

  it('UNLESS — 偽', () => {
    expect(evalCode('(unless nil 42)')).toBe('42');
  });

  it('UNLESS — 真', () => {
    expect(evalCode('(unless t 42)')).toBe('NIL');
  });

  it('AND', () => {
    expect(evalCode('(and 1 2 3)')).toBe('3');
    expect(evalCode('(and 1 nil 3)')).toBe('NIL');
  });

  it('OR', () => {
    expect(evalCode('(or nil nil 5)')).toBe('5');
    expect(evalCode('(or nil nil)')).toBe('NIL');
  });

  it('NOT', () => {
    expect(evalCode('(not nil)')).toBe('T');
    expect(evalCode('(not t)')).toBe('NIL');
  });

  it('PROGN', () => {
    expect(evalCode('(progn 1 2 3)')).toBe('3');
  });

  it('LET', () => {
    expect(evalCode('(let ((x 10) (y 20)) (+ x y))')).toBe('30');
  });

  it('LET はシンボルだけの束縛を NIL で初期化する', () => {
    expect(evalCode('(let (x) x)')).toBe('NIL');
  });

  it('LET*', () => {
    expect(evalCode('(let* ((x 10) (y (+ x 5))) y)')).toBe('15');
  });

  it('LET* はシンボルだけの束縛を NIL で初期化する', () => {
    expect(evalCode('(let* (x) x)')).toBe('NIL');
  });

  it('SETQ', () => {
    expect(evalCode('(defvar *x* 0) (setq *x* 42) *x*')).toBe('42');
  });

  it('SETQ は未定義変数を新規束縛する', () => {
    expect(evalCode('(setq *fresh* 7) *fresh*')).toBe('7');
  });

  it('DEFVAR', () => {
    expect(evalCode('(defvar *val* 100) *val*')).toBe('100');
  });

  it('DEFVAR は初期値省略時に NIL を束縛する', () => {
    expect(evalCode('(defvar *empty*) *empty*')).toBe('NIL');
  });

  it('DEFVAR は既存値を上書きしない', () => {
    expect(evalCode('(defvar *v* 1) (defvar *v* 999) *v*')).toBe('1');
  });

  it('DEFPARAMETER は既存値を上書きする', () => {
    expect(evalCode('(defparameter *p* 1) (defparameter *p* 999) *p*')).toBe('999');
  });

  it('DEFUN', () => {
    expect(evalCode('(defun add (a b) (+ a b)) (add 3 4)')).toBe('7');
  });

  it('LAMBDA', () => {
    expect(evalCode('(funcall (lambda (x) (* x x)) 5)')).toBe('25');
  });

  it('LAMBDA の &REST パラメータ', () => {
    expect(evalCode('(funcall (lambda (&rest xs) (length xs)) 1 2 3)')).toBe('3');
  });

  it('LAMBDA の &REST は引数がないと NIL を束縛する', () => {
    expect(evalCode('(funcall (lambda (&rest xs) xs))')).toBe('NIL');
  });

  it('LAMBDA の &REST は固定引数の後続をまとめる', () => {
    expect(evalCode('(funcall (lambda (x &rest xs) (list x (length xs))) 1 2 3)')).toBe('(1 2)');
  });

  it('FUNCALL', () => {
    expect(evalCode('(defun sq (x) (* x x)) (funcall #\'sq 6)')).toBe('36');
  });

  it('APPLY', () => {
    expect(evalCode("(apply #'+ '(1 2 3))")).toBe('6');
  });

  it('FUNCTION / #\'', () => {
    expect(evalCode("(funcall #'+ 10 20)")).toBe('30');
  });

  it('FUNCTION は lambda フォームも受け取れる', () => {
    expect(evalCode('(funcall (function (lambda (x) (+ x 1))) 4)')).toBe('5');
  });

  it.each([
    ['(let 42 1)', 'letの束縛リストが不正です'],
    ['(let ((1 2)) 1)', 'letの変数名はシンボルである必要があります'],
    ['(let* 42 1)', 'let*の束縛リストが不正です'],
    ['(let* ((1 2)) 1)', 'let*の変数名はシンボルである必要があります'],
    ['(setq 1 2)', 'setqの対象はシンボルである必要があります'],
    ['(defvar 1 2)', 'defvarの対象はシンボルである必要があります'],
    ['(defun 1 (x) x)', 'defunの関数名はシンボルである必要があります'],
    ['(defun foo 1 x)', 'defunのパラメータリストが不正です'],
    ['(defun foo (1) x)', 'パラメータはシンボルである必要があります'],
    ['(funcall (lambda 1 42))', 'lambdaのパラメータリストが不正です'],
    ['(funcall (lambda (1) 42) 0)', 'パラメータはシンボルである必要があります'],
    ['(function 42)', '#functionの引数が不正です'],
  ])('不正な特殊形式 %s でエラーを投げる', (source, message) => {
    expect(() => evalCode(source)).toThrow(message);
  });

  it('DOTIMES', () => {
    evalCode('(dotimes (i 3) (print i))');
    expect(outputBuffer).toBe('0\n1\n2\n');
  });

  it('DOLIST', () => {
    evalCode("(dolist (x '(a b c)) (print x))");
    expect(outputBuffer).toBe('A\nB\nC\n');
  });

  it('LOOP + RETURN', () => {
    expect(evalCode(`
      (let ((i 0))
        (loop
          (if (= i 5) (return i))
          (setq i (+ i 1))))
    `)).toBe('5');
  });

  it('LOOP は RETURN がないと無限ループ検出エラーになる', () => {
    expect(() => evalCode('(loop)')).toThrow('無限ループを検出しました');
  });

  it('非関数を呼び出すとエラーを投げる', () => {
    expect(() => evalCode('(1 2)')).toThrow('1 は関数ではありません');
  });
});

describe('evaluator — 算術ビルトイン', () => {
  it('+', () => expect(evalCode('(+ 1 2 3)')).toBe('6'));
  it('-', () => expect(evalCode('(- 10 3)')).toBe('7'));
  it('- (単項)', () => expect(evalCode('(- 5)')).toBe('-5'));
  it('*', () => expect(evalCode('(* 2 3 4)')).toBe('24'));
  it('/', () => expect(evalCode('(/ 10 2)')).toBe('5'));
  it('/ ゼロ除算でエラー', () => {
    expect(() => evalCode('(/ 1 0)')).toThrow('ゼロ除算');
  });
  it('MOD', () => expect(evalCode('(mod 10 3)')).toBe('1'));
  it('ABS', () => expect(evalCode('(abs -5)')).toBe('5'));
  it('MAX', () => expect(evalCode('(max 1 5 3)')).toBe('5'));
  it('MIN', () => expect(evalCode('(min 1 5 3)')).toBe('1'));
  it('FLOOR', () => expect(evalCode('(floor 3.7)')).toBe('3'));
  it('CEILING', () => expect(evalCode('(ceiling 3.2)')).toBe('4'));
  it('ROUND', () => expect(evalCode('(round 3.5)')).toBe('4'));
  it('SQRT', () => expect(evalCode('(sqrt 9)')).toBe('3'));
  it('EXPT', () => expect(evalCode('(expt 2 10)')).toBe('1024'));
  it('1+', () => expect(evalCode('(1+ 5)')).toBe('6'));
  it('1-', () => expect(evalCode('(1- 5)')).toBe('4'));
});

describe('evaluator — 比較ビルトイン', () => {
  it('=', () => expect(evalCode('(= 1 1)')).toBe('T'));
  it('/=', () => expect(evalCode('(/= 1 2)')).toBe('T'));
  it('<', () => expect(evalCode('(< 1 2)')).toBe('T'));
  it('>', () => expect(evalCode('(> 2 1)')).toBe('T'));
  it('<=', () => expect(evalCode('(<= 1 1)')).toBe('T'));
  it('>=', () => expect(evalCode('(>= 2 1)')).toBe('T'));
  it('ZEROP', () => {
    expect(evalCode('(zerop 0)')).toBe('T');
    expect(evalCode('(zerop 1)')).toBe('NIL');
  });
  it('PLUSP', () => expect(evalCode('(plusp 1)')).toBe('T'));
  it('MINUSP', () => expect(evalCode('(minusp -1)')).toBe('T'));
  it('EVENP', () => expect(evalCode('(evenp 4)')).toBe('T'));
  it('ODDP', () => expect(evalCode('(oddp 3)')).toBe('T'));
});

describe('evaluator — 型判定', () => {
  it('NUMBERP', () => expect(evalCode('(numberp 1)')).toBe('T'));
  it('STRINGP', () => expect(evalCode('(stringp "a")')).toBe('T'));
  it('SYMBOLP', () => expect(evalCode("(symbolp 'x)")).toBe('T'));
  it('LISTP', () => expect(evalCode("(listp '(1))")).toBe('T'));
  it('LISTP — NIL もリスト', () => expect(evalCode('(listp nil)')).toBe('T'));
  it('CONSP', () => {
    expect(evalCode("(consp '(1))")).toBe('T');
    expect(evalCode('(consp nil)')).toBe('NIL');
  });
  it('ATOM', () => expect(evalCode('(atom 1)')).toBe('T'));
  it('NULL', () => {
    expect(evalCode('(null nil)')).toBe('T');
    expect(evalCode('(null 1)')).toBe('NIL');
  });
  it('FUNCTIONP', () => expect(evalCode("(functionp #'+)")).toBe('T'));
});

describe('evaluator — リスト操作', () => {
  it('CAR', () => expect(evalCode("(car '(1 2 3))")).toBe('1'));
  it('CDR', () => expect(evalCode("(cdr '(1 2 3))")).toBe('(2 3)'));
  it('CAR of NIL', () => expect(evalCode('(car nil)')).toBe('NIL'));
  it('FIRST / REST', () => {
    expect(evalCode("(first '(a b c))")).toBe('A');
    expect(evalCode("(rest '(a b c))")).toBe('(B C)');
  });
  it('SECOND / THIRD', () => {
    expect(evalCode("(second '(a b c))")).toBe('B');
    expect(evalCode("(third '(a b c))")).toBe('C');
  });
  it('NTH', () => expect(evalCode("(nth 1 '(a b c))")).toBe('B'));
  it('NTH of NIL', () => expect(evalCode('(nth 0 nil)')).toBe('NIL'));
  it('CONS', () => expect(evalCode("(cons 1 '(2 3))")).toBe('(1 2 3)'));
  it('CONS with NIL', () => expect(evalCode('(cons 1 nil)')).toBe('(1)'));
  it('CONS with atom', () => expect(evalCode('(cons 1 2)')).toBe('(1 2)'));
  it('LIST', () => expect(evalCode('(list 1 2 3)')).toBe('(1 2 3)'));
  it('APPEND', () => expect(evalCode("(append '(1 2) '(3 4))")).toBe('(1 2 3 4)'));
  it('APPEND skips NIL and appends atoms as-is', () => expect(evalCode('(append nil 1 nil 2)')).toBe('(1 2)'));
  it('APPEND of only NIL returns NIL', () => expect(evalCode('(append nil nil)')).toBe('NIL'));
  it('LENGTH', () => expect(evalCode("(length '(a b c))")).toBe('3'));
  it('LENGTH は不正な型でエラー', () => expect(() => evalCode('(length 42)')).toThrow('length: リストまたは文字列が期待されます'));
  it('REVERSE', () => expect(evalCode("(reverse '(1 2 3))")).toBe('(3 2 1)'));
  it('REVERSE of NIL', () => expect(evalCode('(reverse nil)')).toBe('NIL'));
  it('LAST', () => expect(evalCode("(last '(1 2 3))")).toBe('(3)'));
  it('MEMBER', () => expect(evalCode("(member 2 '(1 2 3))")).toBe('(2 3)'));
  it('REMOVE', () => expect(evalCode("(remove 2 '(1 2 3 2))")).toBe('(1 3)'));
  it('ASSOC', () => expect(evalCode("(assoc 'b '((a 1) (b 2) (c 3)))")).toBe('(B 2)'));
  it('ASSOC returns NIL when key is absent', () => expect(evalCode("(assoc 'z '((a 1) (b 2) (c 3)))")).toBe('NIL'));
});

describe('evaluator — 高階関数', () => {
  it('MAPCAR', () => {
    expect(evalCode("(mapcar #'1+ '(1 2 3))")).toBe('(2 3 4)');
  });

  it('MAPCAR with lambda', () => {
    expect(evalCode("(mapcar (lambda (x) (* x x)) '(1 2 3))")).toBe('(1 4 9)');
  });

  it('REMOVE-IF', () => {
    expect(evalCode("(remove-if #'evenp '(1 2 3 4 5))")).toBe('(1 3 5)');
  });

  it('REMOVE-IF-NOT', () => {
    expect(evalCode("(remove-if-not #'evenp '(1 2 3 4 5))")).toBe('(2 4)');
  });

  it('REDUCE', () => {
    expect(evalCode("(reduce #'+ '(1 2 3 4))")).toBe('10');
  });

  it('SOME', () => {
    expect(evalCode("(some #'evenp '(1 3 4 5))")).toBe('T');
    expect(evalCode("(some #'evenp '(1 3 5))")).toBe('NIL');
  });

  it('EVERY', () => {
    expect(evalCode("(every #'numberp '(1 2 3))")).toBe('T');
  });

  it('SORT', () => {
    expect(evalCode("(sort '(3 1 2) #'<)")).toBe('(1 2 3)');
  });
});

describe('evaluator — 文字列操作', () => {
  it('CONCATENATE', () => {
    expect(evalCode("(concatenate 'string \"hello\" \" \" \"world\")")).toBe('"hello world"');
  });

  it('CONCATENATE は文字列以外を printValue で連結する', () => {
    expect(evalCode("(concatenate 'string \"a\" 1 'b)")).toBe('"a1B"');
  });

  it('CONCATENATE の最初の引数が string 指定でないとエラー', () => {
    expect(() => evalCode("(concatenate 'list \"a\")")).toThrow("concatenate: 最初の引数は 'string である必要があります");
  });

  it('STRING-UPCASE', () => {
    expect(evalCode('(string-upcase "hello")')).toBe('"HELLO"');
  });

  it('STRING-DOWNCASE', () => {
    expect(evalCode('(string-downcase "HELLO")')).toBe('"hello"');
  });

  it('SUBSEQ', () => {
    expect(evalCode('(subseq "hello" 1 3)')).toBe('"el"');
  });

  it('SUBSEQ はリストも切り出せる', () => {
    expect(evalCode("(subseq '(a b c d) 1 3)")).toBe('(B C)');
  });

  it('SUBSEQ of NIL returns NIL', () => {
    expect(evalCode('(subseq nil 0 1)')).toBe('NIL');
  });

  it('SUBSEQ の対象が文字列・リスト・NIL 以外だとエラー', () => {
    expect(() => evalCode('(subseq 42 0 1)')).toThrow('subseq: 文字列またはリストが期待されます');
  });

  it('STRING=', () => {
    expect(evalCode('(string= "abc" "abc")')).toBe('T');
    expect(evalCode('(string= "abc" "xyz")')).toBe('NIL');
  });

  it('WRITE-TO-STRING', () => {
    expect(evalCode('(write-to-string 42)')).toBe('"42"');
  });

  it('PARSE-INTEGER', () => {
    expect(evalCode('(parse-integer "123")')).toBe('123');
  });

  it('PARSE-INTEGER は整数化できない文字列でエラー', () => {
    expect(() => evalCode('(parse-integer "abc")')).toThrow('parse-integer: "abc" は整数に変換できません');
  });

  it('PARSE-INTEGER の対象が文字列でないとエラー', () => {
    expect(() => evalCode('(parse-integer 123)')).toThrow('parse-integer: 文字列が期待されます');
  });
});

describe('evaluator — 入出力', () => {
  it('PRINT', () => {
    evalCode('(print 42)');
    expect(outputBuffer).toBe('42\n');
  });

  it('PRINC', () => {
    evalCode('(princ "hello")');
    expect(outputBuffer).toBe('hello');
  });

  it('TERPRI', () => {
    evalCode('(terpri)');
    expect(outputBuffer).toBe('\n');
  });

  it('FORMAT nil', () => {
    expect(evalCode('(format nil "~A + ~A = ~A" 1 2 3)')).toBe('"1 + 2 = 3"');
  });

  it('FORMAT t', () => {
    evalCode('(format t "hello~%world")');
    expect(outputBuffer).toBe('hello\nworld');
  });

  it('FORMAT は ~S ~D ~~ と未知ディレクティブを処理する', () => {
    expect(evalCode('(format nil "~S ~D ~~ ~Q" (quote a) 42)')).toBe('"A 42 ~ ~Q"');
  });

  it('FORMAT のフォーマット文字列が文字列でないとエラー', () => {
    expect(() => evalCode('(format nil 42)')).toThrow('format: フォーマット文字列が期待されます');
  });
});

describe('evaluator — rebindOutputBuiltins', () => {
  it('既存環境の出力系ビルトインを新しい出力先へ差し替える', () => {
    let reboundOutput = '';

    rebindOutputBuiltins(env, (text) => {
      reboundOutput += text;
    });

    evalCode('(print 1) (princ "x") (terpri) (format t "~S ~D ~~ ~Q" (quote a) 42)');

    expect(outputBuffer).toBe('');
    expect(reboundOutput).toBe('1\nx\nA 42 ~ ~Q');
  });

  it('format nil は rebind 後も文字列を返し出力しない', () => {
    let reboundOutput = '';

    rebindOutputBuiltins(env, (text) => {
      reboundOutput += text;
    });

    expect(evalCode('(format nil "~A" 5)')).toBe('"5"');
    expect(reboundOutput).toBe('');
  });

  it('rebind 後の format でもフォーマット文字列型を検証する', () => {
    rebindOutputBuiltins(env, () => {});

    expect(() => evalCode('(format t 42)')).toThrow('format: フォーマット文字列が期待されます');
  });

  it('rebind 後の format でも ~% で改行を出力する', () => {
    let reboundOutput = '';

    rebindOutputBuiltins(env, (text) => {
      reboundOutput += text;
    });

    evalCode('(format t "a~%b")');

    expect(reboundOutput).toBe('a\nb');
  });
});

describe('evaluator — クロージャ', () => {
  it('クロージャが環境をキャプチャする', () => {
    expect(evalCode(`
      (defun make-adder (n) (lambda (x) (+ x n)))
      (funcall (make-adder 5) 10)
    `)).toBe('15');
  });

  it('状態を持つクロージャ', () => {
    evalCode(`
      (defun make-counter ()
        (let ((count 0))
          (lambda ()
            (setq count (+ count 1))
            count)))
      (defvar *c* (make-counter))
      (print (funcall *c*))
      (print (funcall *c*))
      (print (funcall *c*))
    `);
    expect(outputBuffer).toBe('1\n2\n3\n');
  });
});

describe('evaluator — 安全装置', () => {
  it('無限再帰でエラーを投げる', () => {
    expect(() => evalCode('(defun f (x) (f x)) (f 0)')).toThrow();
  });

  it('未定義変数でエラーを投げる', () => {
    expect(() => evalCode('undefined-var')).toThrow('未定義の変数');
  });
});
