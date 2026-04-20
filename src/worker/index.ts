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

    let resolved = false;

    const timer = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      worker?.terminate();
      resolve({
        output: '',
        returnValue: '',
        error: `実行がタイムアウトしました（${timeout / 1000}秒を超過）`,
      });
    }, timeout);

    worker.onmessage = (e) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      worker?.terminate();
      const result = e.data?.result;
      if (result && typeof result === 'object' && 'output' in result) {
        resolve(result);
      } else {
        resolve({ output: '', returnValue: '', error: 'ワーカーから不正なレスポンスを受信しました' });
      }
    };

    worker.onerror = (e) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      worker?.terminate();
      // Fallback to synchronous execution
      resolve(executeLisp(code));
      e.preventDefault();
    };

    worker.postMessage({ id: 1, code });
  });
}
