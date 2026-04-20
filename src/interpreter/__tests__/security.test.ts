import { describe, it, expect } from 'vitest';
import { executeLisp } from '../index';

describe('セキュリティ修正', () => {
  describe('MOD ゼロ除算チェック', () => {
    it('(mod 10 0) はエラーになる', () => {
      const result = executeLisp('(mod 10 0)');
      expect(result.error).toMatch(/ゼロ/);
    });

    it('(mod -7 0) はエラーになる', () => {
      const result = executeLisp('(mod -7 0)');
      expect(result.error).toMatch(/ゼロ/);
    });

    it('(mod 10 3) は正常に動作する', () => {
      const result = executeLisp('(mod 10 3)');
      expect(result.returnValue).toBe('1');
    });
  });

  describe('NTH 負インデックスチェック', () => {
    it('(nth -1 \'(1 2 3)) はエラーになる', () => {
      const result = executeLisp("(nth -1 '(1 2 3))");
      expect(result.error).toMatch(/非負/);
    });

    it('(nth 0 \'(a b c)) は正常に動作する', () => {
      const result = executeLisp("(nth 0 '(a b c))");
      expect(result.returnValue).toBe('A');
    });
  });

  describe('SUBSEQ リスト対応', () => {
    it('文字列の subseq が動作する', () => {
      const result = executeLisp('(subseq "hello" 1 4)');
      expect(result.returnValue).toBe('"ell"');
    });

    it('リストの subseq が動作する', () => {
      const result = executeLisp("(subseq '(a b c d e) 1 3)");
      expect(result.returnValue).toBe('(B C)');
    });

    it('リストの subseq で end 省略', () => {
      const result = executeLisp("(subseq '(a b c d e) 2)");
      expect(result.returnValue).toBe('(C D E)');
    });

    it('空リストの subseq', () => {
      const result = executeLisp("(subseq nil 0)");
      expect(result.returnValue).toBe('NIL');
    });
  });

  describe('MAPCAR 複数リスト対応', () => {
    it('単一リストのmapcarが動作する', () => {
      const result = executeLisp("(mapcar #'1+ '(1 2 3))");
      expect(result.returnValue).toBe('(2 3 4)');
    });

    it('複数リストのmapcarが動作する', () => {
      const result = executeLisp("(mapcar #'+ '(1 2 3) '(10 20 30))");
      expect(result.returnValue).toBe('(11 22 33)');
    });

    it('長さの異なるリストは最短に合わせる', () => {
      const result = executeLisp("(mapcar #'+ '(1 2) '(10 20 30))");
      expect(result.returnValue).toBe('(11 22)');
    });

    it('空リストを含む場合はNIL', () => {
      const result = executeLisp("(mapcar #'+ '() '(1 2 3))");
      expect(result.returnValue).toBe('NIL');
    });
  });
});
