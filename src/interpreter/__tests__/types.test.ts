import { describe, it, expect } from 'vitest';
import {
  NIL, T, makeNumber, makeString, makeSymbol, makeList,
  isTruthy, isEqual, printValue,
} from '../types';

describe('types ヘルパー', () => {
  describe('makeNumber', () => {
    it('数値ノードを生成する', () => {
      const n = makeNumber(42);
      expect(n).toEqual({ type: 'number', value: 42 });
    });

    it('小数を扱える', () => {
      expect(makeNumber(3.14).value).toBe(3.14);
    });

    it('負の数を扱える', () => {
      expect(makeNumber(-7).value).toBe(-7);
    });
  });

  describe('makeString', () => {
    it('文字列ノードを生成する', () => {
      expect(makeString('hello')).toEqual({ type: 'string', value: 'hello' });
    });

    it('空文字列を扱える', () => {
      expect(makeString('').value).toBe('');
    });
  });

  describe('makeSymbol', () => {
    it('大文字に変換される', () => {
      expect(makeSymbol('foo').name).toBe('FOO');
    });
  });

  describe('makeList', () => {
    it('空配列は NIL を返す', () => {
      expect(makeList([])).toEqual(NIL);
    });

    it('要素ありの場合はリストを返す', () => {
      const list = makeList([makeNumber(1), makeNumber(2)]);
      expect(list.type).toBe('list');
    });
  });

  describe('isTruthy', () => {
    it('NIL は偽', () => {
      expect(isTruthy(NIL)).toBe(false);
    });

    it('T は真', () => {
      expect(isTruthy(T)).toBe(true);
    });

    it('数値 0 も真', () => {
      expect(isTruthy(makeNumber(0))).toBe(true);
    });

    it('空文字列も真', () => {
      expect(isTruthy(makeString(''))).toBe(true);
    });
  });

  describe('isEqual', () => {
    it('NIL 同士は等しい', () => {
      expect(isEqual(NIL, NIL)).toBe(true);
    });

    it('T 同士は等しい', () => {
      expect(isEqual(T, T)).toBe(true);
    });

    it('同じ数値は等しい', () => {
      expect(isEqual(makeNumber(5), makeNumber(5))).toBe(true);
    });

    it('異なる数値は等しくない', () => {
      expect(isEqual(makeNumber(5), makeNumber(6))).toBe(false);
    });

    it('同じ文字列は等しい', () => {
      expect(isEqual(makeString('a'), makeString('a'))).toBe(true);
    });

    it('異なる型は等しくない', () => {
      expect(isEqual(makeNumber(1), makeString('1'))).toBe(false);
    });

    it('リスト同士の比較', () => {
      const a = makeList([makeNumber(1), makeNumber(2)]);
      const b = makeList([makeNumber(1), makeNumber(2)]);
      expect(isEqual(a, b)).toBe(true);
    });

    it('異なる長さのリストは等しくない', () => {
      const a = makeList([makeNumber(1)]);
      const b = makeList([makeNumber(1), makeNumber(2)]);
      expect(isEqual(a, b)).toBe(false);
    });
  });

  describe('printValue', () => {
    it('数値', () => expect(printValue(makeNumber(42))).toBe('42'));
    it('文字列', () => expect(printValue(makeString('hi'))).toBe('"hi"'));
    it('シンボル', () => expect(printValue(makeSymbol('X'))).toBe('X'));
    it('NIL', () => expect(printValue(NIL)).toBe('NIL'));
    it('T', () => expect(printValue(T)).toBe('T'));
    it('リスト', () => {
      const list = makeList([makeNumber(1), makeNumber(2)]);
      expect(printValue(list)).toBe('(1 2)');
    });
  });
});
