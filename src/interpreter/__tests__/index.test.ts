import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
  vi.doUnmock('../parser');
});

describe('executeLisp / executeLispRepl', () => {
  it('REPL でも出力サイズ制限を超えるとエラーを返す', async () => {
    const { executeLispRepl } = await import('../index');

    const result = executeLispRepl(`
      (dotimes (i 25000)
        (print "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"))
    `);

    expect(result.error).toContain('出力が大きすぎます');
    expect(result.returnValue).toBe('');
    expect(result.env).toBeDefined();
  });

  it('executeLisp は non-Error の例外も文字列化して返す', async () => {
    vi.doMock('../parser', () => ({
      readFromString: vi.fn(() => {
        throw 'raw failure';
      }),
    }));

    const { executeLisp } = await import('../index');
    const result = executeLisp('(print 1)');

    expect(result).toEqual({
      output: '',
      returnValue: '',
      error: 'raw failure',
    });
  });

  it('executeLispRepl は non-Error の例外時も env を返す', async () => {
    vi.doMock('../parser', () => ({
      readFromString: vi.fn(() => {
        throw 'raw failure';
      }),
    }));

    const { executeLispRepl } = await import('../index');
    const result = executeLispRepl('(print 1)');

    expect(result.output).toBe('');
    expect(result.returnValue).toBe('');
    expect(result.error).toBe('raw failure');
    expect(result.env).toBeDefined();
  });
});