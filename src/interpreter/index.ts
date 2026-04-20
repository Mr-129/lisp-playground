import { readFromString } from './parser';
import { evaluate, createGlobalEnv, rebindOutputBuiltins, resetEvaluationDepth } from './evaluator';
import { printValue, Environment } from './types';

export type { Environment } from './types';

export interface ExecutionResult {
  output: string;
  returnValue: string;
  error?: string;
}

export interface ReplExecutionResult extends ExecutionResult {
  env: Environment;
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

/**
 * REPL execution: evaluates source within a given environment (or creates a new one).
 * Returns the result along with the updated environment for subsequent calls.
 */
export function executeLispRepl(
  source: string,
  existingEnv?: Environment,
): ReplExecutionResult {
  let outputBuffer = '';
  const output = (text: string) => {
    outputBuffer += text;
    if (outputBuffer.length > MAX_OUTPUT_SIZE) {
      throw new Error('出力が大きすぎます（1MB を超えました）');
    }
  };
  resetEvaluationDepth();

  const env = existingEnv ?? createGlobalEnv(output);
  if (existingEnv) {
    rebindOutputBuiltins(env, output);
  }

  try {
    const expressions = readFromString(source);

    let lastValue = '';
    for (const expr of expressions) {
      const result = evaluate(expr, env, output);
      lastValue = printValue(result);
    }

    return { output: outputBuffer, returnValue: lastValue, env };
  } catch (e) {
    return {
      output: outputBuffer,
      returnValue: '',
      error: e instanceof Error ? e.message : String(e),
      env,
    };
  }
}
