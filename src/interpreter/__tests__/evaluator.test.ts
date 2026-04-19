import { describe, it, expect, beforeEach } from 'vitest';
import { evaluate, createGlobalEnv, resetEvaluationDepth, OutputFn } from '../evaluator';
import { readFromString } from '../parser';
import { printValue, makeNumber, NIL, Environment } from '../types';

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

  it('WHEN — 真', () => {
    expect(evalCode('(when t 42)')).toBe('42');
  });

  it('WHEN — 偽', () => {
    expect(evalCode('(when nil 42)')).toBe('NIL');
  });

  it('UNLESS — 偽', () => {
    expect(evalCode('(unless nil 42)')).toBe('42');
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

  it('LET*', () => {
    expect(evalCode('(let* ((x 10) (y (+ x 5))) y)')).toBe('15');
  });

  it('SETQ', () => {
    expect(evalCode('(defvar *x* 0) (setq *x* 42) *x*')).toBe('42');
  });

  it('DEFVAR', () => {
    expect(evalCode('(defvar *val* 100) *val*')).toBe('100');
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

  it('FUNCALL', () => {
    expect(evalCode('(defun sq (x) (* x x)) (funcall #\'sq 6)')).toBe('36');
  });

  it('APPLY', () => {
    expect(evalCode("(apply #'+ '(1 2 3))")).toBe('6');
  });

  it('FUNCTION / #\'', () => {
    expect(evalCode("(funcall #'+ 10 20)")).toBe('30');
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
  it('CONS', () => expect(evalCode("(cons 1 '(2 3))")).toBe('(1 2 3)'));
  it('LIST', () => expect(evalCode('(list 1 2 3)')).toBe('(1 2 3)'));
  it('APPEND', () => expect(evalCode("(append '(1 2) '(3 4))")).toBe('(1 2 3 4)'));
  it('LENGTH', () => expect(evalCode("(length '(a b c))")).toBe('3'));
  it('REVERSE', () => expect(evalCode("(reverse '(1 2 3))")).toBe('(3 2 1)'));
  it('LAST', () => expect(evalCode("(last '(1 2 3))")).toBe('(3)'));
  it('MEMBER', () => expect(evalCode("(member 2 '(1 2 3))")).toBe('(2 3)'));
  it('REMOVE', () => expect(evalCode("(remove 2 '(1 2 3 2))")).toBe('(1 3)'));
  it('ASSOC', () => expect(evalCode("(assoc 'b '((a 1) (b 2) (c 3)))")).toBe('(B 2)'));
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

  it('STRING-UPCASE', () => {
    expect(evalCode('(string-upcase "hello")')).toBe('"HELLO"');
  });

  it('STRING-DOWNCASE', () => {
    expect(evalCode('(string-downcase "HELLO")')).toBe('"hello"');
  });

  it('SUBSEQ', () => {
    expect(evalCode('(subseq "hello" 1 3)')).toBe('"el"');
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
