import { describe, it, expect } from 'vitest';
import { tokenize, readFromString } from '../parser';
import { makeNumber, makeString, makeSymbol, NIL } from '../types';

describe('tokenize', () => {
  it('括弧をトークナイズする', () => {
    const tokens = tokenize('()');
    expect(tokens.map(t => t.type)).toEqual(['lparen', 'rparen']);
  });

  it('数値をトークナイズする', () => {
    const tokens = tokenize('42 -3 1.5');
    expect(tokens).toEqual([
      expect.objectContaining({ type: 'number', value: '42' }),
      expect.objectContaining({ type: 'number', value: '-3' }),
      expect.objectContaining({ type: 'number', value: '1.5' }),
    ]);
  });

  it('文字列をトークナイズする', () => {
    const tokens = tokenize('"hello"');
    expect(tokens[0]).toEqual(expect.objectContaining({ type: 'string', value: 'hello' }));
  });

  it('エスケープ文字を処理する', () => {
    const tokens = tokenize('"a\\nb"');
    expect(tokens[0].value).toBe('a\nb');
  });

  it('シンボルをトークナイズする', () => {
    const tokens = tokenize('defun foo +');
    expect(tokens.map(t => t.value)).toEqual(['defun', 'foo', '+']);
  });

  it('クォートをトークナイズする', () => {
    const tokens = tokenize("'(1 2)");
    expect(tokens[0].type).toBe('quote');
  });

  it("#' をトークナイズする", () => {
    const tokens = tokenize("#'car");
    expect(tokens[0].type).toBe('sharp-quote');
    expect(tokens[1]).toEqual(expect.objectContaining({ type: 'symbol', value: 'car' }));
  });

  it('コメントを無視する', () => {
    const tokens = tokenize('; comment\n42');
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe('number');
  });

  it('未閉の文字列でエラー', () => {
    expect(() => tokenize('"unclosed')).toThrow('文字列が閉じられていません');
  });

  it('行番号・列番号を追跡する', () => {
    const tokens = tokenize('(\n  42)');
    expect(tokens[0].line).toBe(1);
    expect(tokens[1].line).toBe(2);
  });
});

describe('readFromString (parse)', () => {
  it('空リストを NIL にパースする', () => {
    const result = readFromString('()');
    expect(result).toEqual([NIL]);
  });

  it('数値をパースする', () => {
    const result = readFromString('42');
    expect(result).toEqual([makeNumber(42)]);
  });

  it('文字列をパースする', () => {
    const result = readFromString('"hello"');
    expect(result).toEqual([makeString('hello')]);
  });

  it('シンボルを大文字に変換してパースする', () => {
    const result = readFromString('foo');
    expect(result).toEqual([makeSymbol('FOO')]);
  });

  it('NIL リテラルをパースする', () => {
    const result = readFromString('nil');
    expect(result).toEqual([NIL]);
  });

  it('T リテラルをパースする', () => {
    const result = readFromString('t');
    expect(result[0].type).toBe('t');
  });

  it('S式をパースする', () => {
    const result = readFromString('(+ 1 2)');
    expect(result).toHaveLength(1);
    const list = result[0];
    expect(list.type).toBe('list');
    if (list.type === 'list') {
      expect(list.elements).toHaveLength(3);
      expect(list.elements[0]).toEqual(makeSymbol('+'));
      expect(list.elements[1]).toEqual(makeNumber(1));
      expect(list.elements[2]).toEqual(makeNumber(2));
    }
  });

  it('ネストした S式をパースする', () => {
    const result = readFromString('(+ (* 2 3) 4)');
    expect(result).toHaveLength(1);
    const outer = result[0];
    expect(outer.type).toBe('list');
    if (outer.type === 'list') {
      expect(outer.elements[1].type).toBe('list');
    }
  });

  it("クォートを (QUOTE ...) に展開する", () => {
    const result = readFromString("'(1 2)");
    expect(result).toHaveLength(1);
    const quoted = result[0];
    expect(quoted.type).toBe('list');
    if (quoted.type === 'list') {
      expect(quoted.elements[0]).toEqual(makeSymbol('QUOTE'));
    }
  });

  it("#' を (FUNCTION ...) に展開する", () => {
    const result = readFromString("#'car");
    expect(result).toHaveLength(1);
    const fn = result[0];
    expect(fn.type).toBe('list');
    if (fn.type === 'list') {
      expect(fn.elements[0]).toEqual(makeSymbol('FUNCTION'));
      expect(fn.elements[1]).toEqual(makeSymbol('CAR'));
    }
  });

  it('複数の式をパースする', () => {
    const result = readFromString('1 2 3');
    expect(result).toHaveLength(3);
  });

  it('閉じ括弧がない場合エラー', () => {
    expect(() => readFromString('(+ 1')).toThrow('括弧が閉じられていません');
  });

  it('余分な閉じ括弧でエラー', () => {
    expect(() => readFromString(')')).toThrow("予期しない ')'");
  });
});
