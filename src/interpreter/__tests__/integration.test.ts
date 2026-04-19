import { describe, it, expect } from 'vitest';
import { executeLisp } from '../index';

/**
 * 結合テスト — executeLisp を通して
 * パーサ → 評価器 → 出力 のパイプライン全体をテストする
 */
describe('executeLisp — 結合テスト', () => {
  // -------------------------------------------------------
  // 基本的な式の評価
  // -------------------------------------------------------
  describe('基本評価', () => {
    it('算術式を評価する', () => {
      const r = executeLisp('(+ 1 2)');
      expect(r.returnValue).toBe('3');
      expect(r.error).toBeUndefined();
    });

    it('ネストした式を評価する', () => {
      const r = executeLisp('(* (+ 1 2) (- 10 5))');
      expect(r.returnValue).toBe('15');
    });

    it('複数の式を順番に評価する', () => {
      const r = executeLisp('(+ 1 2) (* 3 4)');
      expect(r.returnValue).toBe('12');
    });

    it('文字列を返す', () => {
      const r = executeLisp('"hello"');
      expect(r.returnValue).toBe('"hello"');
    });

    it('空のソースは空文字列を返す', () => {
      const r = executeLisp('');
      expect(r.returnValue).toBe('');
      expect(r.error).toBeUndefined();
    });
  });

  // -------------------------------------------------------
  // 出力テスト
  // -------------------------------------------------------
  describe('出力', () => {
    it('PRINT で出力バッファに書き込まれる', () => {
      const r = executeLisp('(print 42)');
      expect(r.output).toBe('42\n');
    });

    it('複数の PRINT', () => {
      const r = executeLisp('(print 1) (print 2) (print 3)');
      expect(r.output).toBe('1\n2\n3\n');
    });

    it('FORMAT t で出力バッファに書き込まれる', () => {
      const r = executeLisp('(format t "hello ~A" "world")');
      expect(r.output).toBe('hello world');
    });

    it('FORMAT nil は文字列を返し出力なし', () => {
      const r = executeLisp('(format nil "~A" 42)');
      expect(r.output).toBe('');
      expect(r.returnValue).toBe('"42"');
    });
  });

  // -------------------------------------------------------
  // 問題のサンプルコードが正しく動作するか
  // -------------------------------------------------------
  describe('問題サンプルコード', () => {
    it('basic-01: S式 — 足し算と掛け算', () => {
      const r = executeLisp('(print (+ 10 20))\n(print (* 5 6))');
      expect(r.output).toBe('30\n30\n');
    });

    it('basic-02: 変数の定義', () => {
      const r = executeLisp('(defvar *greeting* "Hello, Lisp!")\n(princ *greeting*)');
      expect(r.output).toBe('Hello, Lisp!');
    });

    it('関数定義と呼び出し', () => {
      const r = executeLisp(`
        (defun square (x) (* x x))
        (print (square 5))
      `);
      expect(r.output).toBe('25\n');
    });

    it('FizzBuzz', () => {
      const r = executeLisp(`
        (defun fizzbuzz (n)
          (cond
            ((= (mod n 15) 0) "FizzBuzz")
            ((= (mod n 3) 0) "Fizz")
            ((= (mod n 5) 0) "Buzz")
            (t (write-to-string n))))
        (dotimes (i 15)
          (print (fizzbuzz (+ i 1))))
      `);
      const lines = r.output.trim().split('\n');
      expect(lines).toHaveLength(15);
      expect(lines[0]).toBe('"1"');
      expect(lines[2]).toBe('"Fizz"');
      expect(lines[4]).toBe('"Buzz"');
      expect(lines[14]).toBe('"FizzBuzz"');
    });

    it('再帰で階乗を計算する', () => {
      const r = executeLisp(`
        (defun factorial (n)
          (if (<= n 1) 1 (* n (factorial (- n 1)))))
        (print (factorial 10))
      `);
      expect(r.output).toBe('3628800\n');
    });

    it('MAPCAR でリスト変換', () => {
      const r = executeLisp(`
        (print (mapcar #'1+ '(1 2 3 4 5)))
      `);
      expect(r.output).toBe('(2 3 4 5 6)\n');
    });
  });

  // -------------------------------------------------------
  // エラーハンドリング
  // -------------------------------------------------------
  describe('エラーハンドリング', () => {
    it('構文エラーは error フィールドに格納される', () => {
      const r = executeLisp('(+ 1');
      expect(r.error).toBeDefined();
      expect(r.error).toContain('括弧が閉じられていません');
    });

    it('未定義変数エラー', () => {
      const r = executeLisp('undefined-var');
      expect(r.error).toBeDefined();
      expect(r.error).toContain('未定義の変数');
    });

    it('型エラー', () => {
      const r = executeLisp('(+ 1 "a")');
      expect(r.error).toBeDefined();
    });

    it('エラー時にも途中出力を保持する', () => {
      const r = executeLisp('(print 42) undefined-var');
      expect(r.output).toBe('42\n');
      expect(r.error).toBeDefined();
    });
  });

  // -------------------------------------------------------
  // 安全装置
  // -------------------------------------------------------
  describe('安全装置', () => {
    it('再帰深度超過でエラー', () => {
      const r = executeLisp('(defun f (x) (f x)) (f 0)');
      expect(r.error).toBeDefined();
      expect(r.error).toBeDefined();
    });

    it('出力サイズ制限を超えるとエラー', () => {
      // 大量の出力を生成
      const r = executeLisp(`
        (dotimes (i 100000)
          (print "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"))
      `);
      expect(r.error).toBeDefined();
      expect(r.error).toContain('出力が大きすぎます');
    });
  });

  // -------------------------------------------------------
  // 複合シナリオ
  // -------------------------------------------------------
  describe('複合シナリオ', () => {
    it('クロージャ + 高階関数', () => {
      const r = executeLisp(`
        (defun make-adder (n) (lambda (x) (+ x n)))
        (defvar *add5* (make-adder 5))
        (print (mapcar *add5* '(1 2 3)))
      `);
      expect(r.output).toBe('(6 7 8)\n');
    });

    it('リスト操作の組み合わせ', () => {
      const r = executeLisp(`
        (print
          (reduce #'+ 
            (mapcar (lambda (x) (* x x)) '(1 2 3 4 5))))
      `);
      expect(r.output).toBe('55\n');
    });

    it('LET + 再帰', () => {
      const r = executeLisp(`
        (defun fib (n)
          (if (<= n 1) n
            (+ (fib (- n 1)) (fib (- n 2)))))
        (print (fib 10))
      `);
      expect(r.output).toBe('55\n');
    });

    it('連続した executeLisp 呼び出しは独立', () => {
      executeLisp('(defvar *x* 99)');
      const r = executeLisp('*x*');
      expect(r.error).toBeDefined(); // *x* は次の呼び出しでは未定義
    });
  });
});
