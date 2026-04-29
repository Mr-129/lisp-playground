import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const executeLispMock = vi.hoisted(() => vi.fn());

vi.mock('../../interpreter', () => ({
  executeLisp: executeLispMock,
}));

describe('lisp-worker', () => {
  const originalSelf = globalThis.self;

  beforeEach(() => {
    executeLispMock.mockReset();
    Object.defineProperty(globalThis, 'self', {
      value: {
        postMessage: vi.fn(),
        onmessage: null,
      },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    vi.resetModules();
    Object.defineProperty(globalThis, 'self', {
      value: originalSelf,
      configurable: true,
      writable: true,
    });
  });

  it('valid request を受けると executeLisp の結果を postMessage する', async () => {
    executeLispMock.mockReturnValue({ output: '42\n', returnValue: '42', error: undefined });

    await import('../lisp-worker');

    const handler = globalThis.self.onmessage as (event: MessageEvent) => void;
    handler({ data: { id: 7, code: '(print 42)' } } as MessageEvent);

    expect(executeLispMock).toHaveBeenCalledWith('(print 42)');
    expect(globalThis.self.postMessage).toHaveBeenCalledWith({
      id: 7,
      result: { output: '42\n', returnValue: '42', error: undefined },
    });
  });

  it('invalid request のとき executeLisp を呼ばずエラーを返す', async () => {
    await import('../lisp-worker');

    const handler = globalThis.self.onmessage as (event: MessageEvent) => void;
    handler({ data: { id: 'bad-id', code: 123 } } as unknown as MessageEvent);

    expect(executeLispMock).not.toHaveBeenCalled();
    expect(globalThis.self.postMessage).toHaveBeenCalledWith({
      id: 'bad-id',
      result: {
        output: '',
        returnValue: '',
        error: '不正なメッセージ形式',
      },
    });
  });
});