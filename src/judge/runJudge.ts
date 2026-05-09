import { executeLispAsync } from '../worker';
import type { ExecutionResult } from '../interpreter';
import type { Problem } from '../types';
import { compareExecutionAgainstExpectations } from './compare';
import { getProblemJudgeSpec } from './legacy';
import type { JudgeCase, JudgeCaseResult, JudgeExecutor, JudgeRunResult, JudgeSpec, JudgeSummary } from './types';

function buildCaseSource(spec: JudgeSpec, userCode: string, judgeCase: JudgeCase): string {
  if (!judgeCase.run.code.trim()) {
    return userCode;
  }

  switch (spec.kind) {
    case 'program':
    case 'function':
      return `${userCode}\n${judgeCase.run.code}`;
    default:
      return userCode;
  }
}

function buildSummary(caseResults: JudgeCaseResult[]): JudgeSummary {
  const visibleCases = caseResults.filter((result) => result.visibility === 'visible');
  const hiddenCases = caseResults.filter((result) => result.visibility === 'hidden');

  return {
    visiblePassed: visibleCases.filter((result) => result.passed).length,
    visibleTotal: visibleCases.length,
    hiddenPassed: hiddenCases.filter((result) => result.passed).length,
    hiddenTotal: hiddenCases.length,
  };
}

async function runCase(
  spec: JudgeSpec,
  userCode: string,
  judgeCase: JudgeCase,
  executor: JudgeExecutor,
): Promise<JudgeCaseResult> {
  const source = buildCaseSource(spec, userCode, judgeCase);

  let execution: ExecutionResult;
  try {
    execution = await executor(source, spec.timeoutMs);
  } catch (error) {
    execution = {
      output: '',
      returnValue: '',
      error: error instanceof Error ? error.message : String(error),
    };
  }

  const mismatches = compareExecutionAgainstExpectations(execution, judgeCase.expect);

  return {
    id: judgeCase.id,
    label: judgeCase.label,
    visibility: judgeCase.visibility,
    execution,
    mismatches,
    passed: mismatches.length === 0,
  };
}

export async function runJudge(
  spec: JudgeSpec,
  userCode: string,
  executor: JudgeExecutor = executeLispAsync,
): Promise<JudgeRunResult> {
  const caseResults: JudgeCaseResult[] = [];

  for (const judgeCase of spec.cases) {
    caseResults.push(await runCase(spec, userCode, judgeCase, executor));
  }

  const passed = caseResults.every((result) => result.passed);

  return {
    passed,
    cases: caseResults,
    summary: buildSummary(caseResults),
    firstFailure: caseResults.find((result) => !result.passed),
  };
}

export async function runProblemJudge(
  problem: Problem,
  userCode: string,
  executor: JudgeExecutor = executeLispAsync,
): Promise<JudgeRunResult | null> {
  const judgeSpec = getProblemJudgeSpec(problem);
  if (!judgeSpec) {
    return null;
  }

  return runJudge(judgeSpec, userCode, executor);
}