import { describe, expect, it, vi } from 'vitest';
import type { Problem } from '../../types';
import { compareExecutionAgainstExpectations } from '../compare';
import { getProblemJudgeSpec } from '../legacy';
import { runJudge, runProblemJudge } from '../runJudge';
import type { FunctionJudgeSpec, ProgramJudgeSpec } from '../types';

const legacyProblem: Problem = {
  id: 'legacy-01',
  slug: 'legacy-01',
  order: 1,
  title: 'legacy',
  category: 'test',
  difficulty: 'beginner',
  description: 'legacy',
  initialCode: '(print (+ 1 2))',
  expectedOutput: '3\n',
  expectedReturnValue: '3',
  estimatedMinutes: 5,
  learningGoals: ['legacy'],
  solution: '(print (+ 1 2))',
};

describe('judge helpers', () => {
  it('legacy problem から互換 judge を生成する', () => {
    const spec = getProblemJudgeSpec(legacyProblem);

    expect(spec).toMatchObject({
      kind: 'program',
      cases: [
        {
          id: 'legacy-main',
          expect: {
            output: { value: '3\n', comparison: 'exact' },
            returnValue: { value: '3', comparison: 'exact' },
          },
        },
      ],
    });
  });

  it('normalized-lines 比較で改行差分を吸収する', () => {
    const mismatches = compareExecutionAgainstExpectations(
      { output: ' 1 \r\n 2 \r\n', returnValue: '', error: undefined },
      {
        output: { value: '1\n2', comparison: 'normalized-lines' },
      },
    );

    expect(mismatches).toHaveLength(0);
  });

  it('予期しない error は不一致として扱う', () => {
    const mismatches = compareExecutionAgainstExpectations(
      { output: '', returnValue: '', error: 'boom' },
      {
        output: { value: '', comparison: 'exact' },
      },
    );

    expect(mismatches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'error', actual: 'boom' }),
      ]),
    );
  });
});

describe('runJudge', () => {
  it('program judge を実行できる', async () => {
    const spec: ProgramJudgeSpec = {
      kind: 'program',
      cases: [
        {
          id: 'main',
          label: 'main',
          visibility: 'visible',
          run: { code: '' },
          expect: {
            output: { value: '3\n', comparison: 'exact' },
            returnValue: { value: '3', comparison: 'exact' },
          },
        },
      ],
    };

    const executor = vi.fn(async () => ({ output: '3\n', returnValue: '3', error: undefined }));
    const result = await runJudge(spec, '(print (+ 1 2))', executor);

    expect(result.passed).toBe(true);
    expect(result.summary).toEqual({
      visiblePassed: 1,
      visibleTotal: 1,
      hiddenPassed: 0,
      hiddenTotal: 0,
    });
  });

  it('function judge を複数ケースで実行できる', async () => {
    const userCode = '(defun add1 (x) (+ x 1))';
    const spec: FunctionJudgeSpec = {
      kind: 'function',
      functionName: 'add1',
      cases: [
        {
          id: 'visible-1',
          label: '2->3',
          visibility: 'visible',
          run: { code: '(print (add1 2))' },
          expect: {
            output: { value: '3\n', comparison: 'exact' },
          },
        },
        {
          id: 'hidden-1',
          label: '4->5',
          visibility: 'hidden',
          run: { code: '(print (add1 4))' },
          expect: {
            output: { value: '5\n', comparison: 'exact' },
          },
        },
      ],
    };

    const executor = vi.fn(async (source: string) => {
      switch (source) {
        case `${userCode}\n(print (add1 2))`:
          return { output: '3\n', returnValue: '3', error: undefined };
        case `${userCode}\n(print (add1 4))`:
          return { output: '5\n', returnValue: '5', error: undefined };
        default:
          return { output: '', returnValue: '', error: 'unexpected source' };
      }
    });

    const result = await runJudge(spec, userCode, executor);

    expect(result.passed).toBe(true);
    expect(result.summary).toEqual({
      visiblePassed: 1,
      visibleTotal: 1,
      hiddenPassed: 1,
      hiddenTotal: 1,
    });
  });

  it('runProblemJudge は legacy problem を採点できる', async () => {
    const executor = vi.fn(async () => ({ output: '3\n', returnValue: '3', error: undefined }));

    const result = await runProblemJudge(legacyProblem, '(print (+ 1 2))', executor);

    expect(result?.passed).toBe(true);
  });
});