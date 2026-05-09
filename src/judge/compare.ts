import type { ExecutionResult } from '../interpreter';
import type { JudgeCaseExpectations, JudgeMismatch, StringComparison, StringExpectation } from './types';

function normalizeForComparison(value: string | undefined, comparison: StringComparison): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  switch (comparison) {
    case 'trimmed':
      return value.trim();
    case 'normalized-lines':
      return value
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trim();
    case 'exact':
    default:
      return value;
  }
}

function createMismatch(
  field: JudgeMismatch['field'],
  actual: string | undefined,
  expectation: StringExpectation,
): JudgeMismatch | null {
  const comparison = expectation.comparison ?? 'exact';
  const normalizedActual = normalizeForComparison(actual, comparison);
  const normalizedExpected = normalizeForComparison(expectation.value, comparison);

  if (normalizedActual === normalizedExpected) {
    return null;
  }

  return {
    field,
    actual,
    expected: expectation,
  };
}

export function compareExecutionAgainstExpectations(
  execution: ExecutionResult,
  expectations: JudgeCaseExpectations,
): JudgeMismatch[] {
  const mismatches: JudgeMismatch[] = [];

  const outputMismatch = expectations.output
    ? createMismatch('output', execution.output, expectations.output)
    : null;
  if (outputMismatch) {
    mismatches.push(outputMismatch);
  }

  const returnValueMismatch = expectations.returnValue
    ? createMismatch('returnValue', execution.returnValue, expectations.returnValue)
    : null;
  if (returnValueMismatch) {
    mismatches.push(returnValueMismatch);
  }

  if (expectations.error) {
    const errorMismatch = createMismatch('error', execution.error, expectations.error);
    if (errorMismatch) {
      mismatches.push(errorMismatch);
    }
  } else if (execution.error !== undefined) {
    mismatches.push({
      field: 'error',
      actual: execution.error,
      expected: { value: '', comparison: 'exact' },
    });
  }

  return mismatches;
}