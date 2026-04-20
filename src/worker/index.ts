import { ExecutionResult, executeLisp } from '../interpreter';

const DEFAULT_TIMEOUT = 10000; // 10 seconds

/**
 * Execute Lisp code asynchronously using a Web Worker.
 * Falls back to synchronous execution if Workers are unavailable.
 */
export function executeLispAsync(
  code: string,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<ExecutionResult> {
  // Use a Worker with ?worker&inline query for Vite bundling
  return new Promise((resolve) => {
    let worker: Worker | null = null;

    try {
      worker = new Worker(
        new URL('./lisp-worker.ts', import.meta.url),
        { type: 'module' },
      );
    } catch {
      // Worker not available (e.g., SSR, or bundling issue) — fallback to sync
      resolve(executeLisp(code));
      return;
    }

    const timer = setTimeout(() => {
      worker?.terminate();
      resolve({
        output: '',
        returnValue: '',
        error: `実行がタイムアウトしました（${timeout / 1000}秒を超過）`,
      });
    }, timeout);

    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker?.terminate();
      resolve(e.data.result);
    };

    worker.onerror = (e) => {
      clearTimeout(timer);
      worker?.terminate();
      // Fallback to synchronous execution
      resolve(executeLisp(code));
      e.preventDefault();
    };

    worker.postMessage({ id: 1, code });
  });
}
