import type { ExecutionResult } from '../interpreter';

export type StringComparison = 'exact' | 'trimmed' | 'normalized-lines';

export interface StringExpectation {
  value: string;
  comparison?: StringComparison;
}

export interface JudgeCaseExpectations {
  output?: StringExpectation;
  returnValue?: StringExpectation;
  error?: StringExpectation;
}

export interface JudgeCase {
  id: string;
  label: string;
  visibility: 'visible' | 'hidden';
  run: {
    code: string;
  };
  expect: JudgeCaseExpectations;
}

interface BaseJudgeSpec {
  kind: 'program' | 'function';
  passRule?: 'all';
  timeoutMs?: number;
}

export interface ProgramJudgeSpec extends BaseJudgeSpec {
  kind: 'program';
  cases: JudgeCase[];
}

export interface FunctionJudgeSpec extends BaseJudgeSpec {
  kind: 'function';
  functionName: string;
  cases: JudgeCase[];
}

export type JudgeSpec = ProgramJudgeSpec | FunctionJudgeSpec;

export interface JudgeMismatch {
  field: 'output' | 'returnValue' | 'error';
  expected: StringExpectation;
  actual?: string;
}

export interface JudgeCaseResult {
  id: string;
  label: string;
  visibility: 'visible' | 'hidden';
  passed: boolean;
  execution: ExecutionResult;
  mismatches: JudgeMismatch[];
}

export interface JudgeSummary {
  visiblePassed: number;
  visibleTotal: number;
  hiddenPassed: number;
  hiddenTotal: number;
}

export interface JudgeRunResult {
  passed: boolean;
  cases: JudgeCaseResult[];
  summary: JudgeSummary;
  firstFailure?: JudgeCaseResult;
}

export type JudgeExecutor = (code: string, timeout?: number) => Promise<ExecutionResult>;