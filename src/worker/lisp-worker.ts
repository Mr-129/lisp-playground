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

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { id, code } = e.data;
  const result = executeLisp(code);
  const response: WorkerResponse = { id, result };
  self.postMessage(response);
};
