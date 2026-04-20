import { describe, it, expect } from 'vitest';
import { executeLispRepl } from '../index';

describe('executeLispRepl', () => {
  it('新しい環境で式を評価する', () => {
    const result = executeLispRepl('(+ 1 2)');
    expect(result.returnValue).toBe('3');
    expect(result.error).toBeUndefined();
    expect(result.env).toBeDefined();
  });

  it('環境を引き継いで変数を参照できる', () => {
    const r1 = executeLispRepl('(defvar *x* 10)');
    const r2 = executeLispRepl('*x*', r1.env);
    expect(r2.returnValue).toBe('10');
  });

  it('環境を引き継いで関数を呼び出せる', () => {
    const r1 = executeLispRepl('(defun double (x) (* x 2))');
    const r2 = executeLispRepl('(double 21)', r1.env);
    expect(r2.returnValue).toBe('42');
  });

  it('エラーが発生しても環境を返す', () => {
    const r1 = executeLispRepl('(defvar *y* 5)');
    const r2 = executeLispRepl('(/ 1 0)', r1.env);
    expect(r2.error).toBeDefined();
    expect(r2.env).toBeDefined();

    // 環境は保持されている
    const r3 = executeLispRepl('*y*', r2.env);
    expect(r3.returnValue).toBe('5');
  });

  it('引き継いだ環境で print 出力が正しく動作する', () => {
    const r1 = executeLispRepl('(defvar *z* 99)');
    const r2 = executeLispRepl('(print *z*)', r1.env);
    expect(r2.output).toBe('99\n');
    expect(r2.returnValue).toBe('99');
  });

  it('複数回の print が正しく出力される', () => {
    const r1 = executeLispRepl('(defvar *a* 1)');
    const r2 = executeLispRepl('(print *a*) (print (+ *a* 1))', r1.env);
    expect(r2.output).toBe('1\n2\n');
  });

  it('format 関数が引き継いだ環境で動作する', () => {
    const r1 = executeLispRepl('(defvar *name* "World")');
    const r2 = executeLispRepl('(format t "Hello, ~A!" *name*)', r1.env);
    expect(r2.output).toBe('Hello, World!');
  });

  it('クロージャが環境を跨いで動作する', () => {
    const r1 = executeLispRepl(`
      (defun make-counter ()
        (let ((c 0))
          (lambda () (setq c (+ c 1)) c)))
    `);
    const r2 = executeLispRepl('(defvar *cnt* (make-counter))', r1.env);
    const r3 = executeLispRepl('(funcall *cnt*)', r2.env);
    expect(r3.returnValue).toBe('1');
    const r4 = executeLispRepl('(funcall *cnt*)', r3.env);
    expect(r4.returnValue).toBe('2');
  });
});
