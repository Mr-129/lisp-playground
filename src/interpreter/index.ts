import { readFromString } from './parser';
import { evaluate, createGlobalEnv, resetEvaluationDepth } from './evaluator';
import { printValue } from './types';

export interface ExecutionResult {
  output: string;
  returnValue: string;
  error?: string;
}

const MAX_OUTPUT_SIZE = 1024 * 1024; // 1 MB

export function executeLisp(source: string): ExecutionResult {
  let outputBuffer = '';
  const output = (text: string) => {
    outputBuffer += text;
    if (outputBuffer.length > MAX_OUTPUT_SIZE) {
      throw new Error('出力が大きすぎます（1MB を超えました）');
    }
  };
  resetEvaluationDepth();

  try {
    const expressions = readFromString(source);
    const env = createGlobalEnv(output);

    let lastValue = '';
    for (const expr of expressions) {
      const result = evaluate(expr, env, output);
      lastValue = printValue(result);
    }

    return {
      output: outputBuffer,
      returnValue: lastValue,
    };
  } catch (e) {
    return {
      output: outputBuffer,
      returnValue: '',
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
