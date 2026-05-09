import type { Problem } from '../types';
import type { JudgeSpec } from './types';

export function getProblemJudgeSpec(problem: Problem): JudgeSpec | null {
  if (problem.judge) {
    return problem.judge;
  }

  if (problem.expectedOutput === undefined && problem.expectedReturnValue === undefined) {
    return null;
  }

  return {
    kind: 'program',
    passRule: 'all',
    cases: [
      {
        id: 'legacy-main',
        label: 'main',
        visibility: 'visible',
        run: { code: '' },
        expect: {
          output: problem.expectedOutput !== undefined
            ? { value: problem.expectedOutput, comparison: 'exact' }
            : undefined,
          returnValue: problem.expectedReturnValue !== undefined
            ? { value: problem.expectedReturnValue, comparison: 'exact' }
            : undefined,
        },
      },
    ],
  };
}