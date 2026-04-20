import { executeLisp } from '../interpreter';

export interface WorkerRequest {
  id: number;
  code: string;
}

export interface WorkerResponse {
  id: number;
  result: {
    output: string;
    returnValue: string;
    error?: string;
  };
}

self.onmessage = (e: MessageEvent) => {
  const data = e.data as Partial<WorkerRequest>;
  if (typeof data.id !== 'number' || typeof data.code !== 'string') {
    self.postMessage({ id: data.id ?? 0, result: { output: '', returnValue: '', error: '不正なメッセージ形式' } });
    return;
  }
  const result = executeLisp(data.code);
  const response: WorkerResponse = { id: data.id, result };
  self.postMessage(response);
};
