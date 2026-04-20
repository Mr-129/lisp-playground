import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the Worker class for testing
class MockWorker {
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;
  postMessage = vi.fn();
  terminate = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

describe('executeLispAsync', () => {
  let originalWorker: typeof Worker;

  beforeEach(() => {
    originalWorker = globalThis.Worker;
    vi.useFakeTimers();
  });

  afterEach(() => {
    globalThis.Worker = originalWorker;
    vi.useRealTimers();
    vi.resetModules();
  });

  it('falls back to synchronous execution when Worker is not available', async () => {
    // @ts-expect-error - mock Worker to throw
    globalThis.Worker = class {
      constructor() {
        throw new Error('Worker not supported');
      }
    };

    const { executeLispAsync } = await import('../index');
    const result = await executeLispAsync('(+ 1 2)');
    expect(result.returnValue).toBe('3');
    expect(result.error).toBeUndefined();
  });

  it('resolves with result from worker', async () => {
    let workerInstance: MockWorker | null = null;
    // @ts-expect-error - mock Worker
    globalThis.Worker = class {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      postMessage = vi.fn();
      terminate = vi.fn();
      constructor() {
        workerInstance = this as unknown as MockWorker;
      }
    };

    const { executeLispAsync } = await import('../index');
    const promise = executeLispAsync('(+ 1 2)');

    // Simulate worker response
    workerInstance!.onmessage!({
      data: {
        id: 1,
        result: { output: '', returnValue: '3', error: undefined },
      },
    } as MessageEvent);

    const result = await promise;
    expect(result.returnValue).toBe('3');
    expect(workerInstance!.terminate).toHaveBeenCalled();
  });

  it('resolves with timeout error when worker takes too long', async () => {
    // @ts-expect-error - mock Worker
    globalThis.Worker = class {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      postMessage = vi.fn();
      terminate = vi.fn();
    };

    const { executeLispAsync } = await import('../index');
    const promise = executeLispAsync('(loop)', 5000);

    vi.advanceTimersByTime(5000);

    const result = await promise;
    expect(result.error).toContain('タイムアウト');
  });

  it('falls back to sync on worker error', async () => {
    let workerInstance: MockWorker | null = null;
    // @ts-expect-error - mock Worker
    globalThis.Worker = class {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent | Event) => void) | null = null;
      postMessage = vi.fn();
      terminate = vi.fn();
      constructor() {
        workerInstance = this as unknown as MockWorker;
      }
    };

    const { executeLispAsync } = await import('../index');
    const promise = executeLispAsync('(+ 1 2)');

    // Simulate worker error
    const errorEvent = {
      message: 'Worker crashed',
      preventDefault: vi.fn(),
    } as unknown as ErrorEvent;
    workerInstance!.onerror!(errorEvent);

    const result = await promise;
    // Falls back to sync execution
    expect(result.returnValue).toBe('3');
  });
});
