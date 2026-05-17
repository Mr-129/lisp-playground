import { describe, expect, it } from 'vitest';
import { loadProblemContentFromSources } from '../problemContentLoader';

const VALID_MARKDOWN = `---
id: basic-01
slug: first-s-expression
title: 初めてのS式
category: 基本構文
difficulty: beginner
estimatedMinutes: 6
learningGoals:
  - 基本構文
hint: (print ...) を使います
draft: false
---

## S式

本文です。
`;

const VALID_JUDGE = {
  kind: 'program',
  cases: [
    {
      id: 'basic-01-visible-1',
      label: 'visible case',
      visibility: 'visible',
      run: { code: '' },
      expect: {
        output: { value: '30\n', comparison: 'exact' },
      },
    },
  ],
};

describe('problemContentLoader', () => {
  it('valid な content 一式を ProblemSeed に変換できる', () => {
    const problemSeeds = loadProblemContentFromSources({
      manifest: { version: 1, problemOrder: ['basic-01'] },
      markdownFiles: {
        'src/content/problems/basic-01/problem.md': VALID_MARKDOWN,
      },
      starterFiles: {
        'src/content/problems/basic-01/starter.lisp': '; start\n(print (+ 10 20))\n',
      },
      solutionFiles: {
        'src/content/problems/basic-01/solution.lisp': '(print (+ 10 20))\n(print (* 5 6))\n',
      },
      judgeFiles: {
        'src/content/problems/basic-01/judge.json': VALID_JUDGE,
      },
    });

    expect(problemSeeds).toHaveLength(1);
    expect(problemSeeds[0]).toMatchObject({
      id: 'basic-01',
      slug: 'first-s-expression',
      title: '初めてのS式',
      category: '基本構文',
      difficulty: 'beginner',
      hint: '(print ...) を使います',
      estimatedMinutes: 6,
      learningGoals: ['基本構文'],
    });
    expect(problemSeeds[0].description).toContain('## S式');
    expect(problemSeeds[0].initialCode).toContain('; start');
    expect(problemSeeds[0].solution).toContain('(print (* 5 6))');
    expect(problemSeeds[0].judge?.kind).toBe('program');
  });

  it('manifest にある問題の必須ファイルが欠けていると失敗する', () => {
    expect(() => loadProblemContentFromSources({
      manifest: { version: 1, problemOrder: ['basic-01'] },
      markdownFiles: {
        'src/content/problems/basic-01/problem.md': VALID_MARKDOWN,
      },
      starterFiles: {
        'src/content/problems/basic-01/starter.lisp': '; start\n',
      },
      solutionFiles: {},
      judgeFiles: {
        'src/content/problems/basic-01/judge.json': VALID_JUDGE,
      },
    })).toThrowError(/solution\.lisp/);
  });

  it('manifest 未登録の問題フォルダがあると失敗する', () => {
    expect(() => loadProblemContentFromSources({
      manifest: { version: 1, problemOrder: [] },
      markdownFiles: {
        'src/content/problems/basic-01/problem.md': VALID_MARKDOWN,
      },
      starterFiles: {
        'src/content/problems/basic-01/starter.lisp': '; start\n',
      },
      solutionFiles: {
        'src/content/problems/basic-01/solution.lisp': '(print 1)\n',
      },
      judgeFiles: {
        'src/content/problems/basic-01/judge.json': VALID_JUDGE,
      },
    })).toThrowError(/manifest\.json に未登録/);
  });

  it('slug が重複すると失敗する', () => {
    const secondMarkdown = VALID_MARKDOWN
      .replace('id: basic-01', 'id: basic-02')
      .replace('title: 初めてのS式', 'title: 2つ目の問題');

    expect(() => loadProblemContentFromSources({
      manifest: { version: 1, problemOrder: ['basic-01', 'basic-02'] },
      markdownFiles: {
        'src/content/problems/basic-01/problem.md': VALID_MARKDOWN,
        'src/content/problems/basic-02/problem.md': secondMarkdown,
      },
      starterFiles: {
        'src/content/problems/basic-01/starter.lisp': '; start\n',
        'src/content/problems/basic-02/starter.lisp': '; start\n',
      },
      solutionFiles: {
        'src/content/problems/basic-01/solution.lisp': '(print 1)\n',
        'src/content/problems/basic-02/solution.lisp': '(print 2)\n',
      },
      judgeFiles: {
        'src/content/problems/basic-01/judge.json': VALID_JUDGE,
        'src/content/problems/basic-02/judge.json': {
          ...VALID_JUDGE,
          cases: [{
            ...VALID_JUDGE.cases[0],
            id: 'basic-02-visible-1',
          }],
        },
      },
    })).toThrowError(/slug が重複/);
  });

  it('slug が別問題の id と衝突すると失敗する', () => {
    const secondMarkdown = VALID_MARKDOWN
      .replace('id: basic-01', 'id: basic-02')
      .replace('slug: first-s-expression', 'slug: basic-01')
      .replace('title: 初めてのS式', 'title: 2つ目の問題');

    expect(() => loadProblemContentFromSources({
      manifest: { version: 1, problemOrder: ['basic-01', 'basic-02'] },
      markdownFiles: {
        'src/content/problems/basic-01/problem.md': VALID_MARKDOWN,
        'src/content/problems/basic-02/problem.md': secondMarkdown,
      },
      starterFiles: {
        'src/content/problems/basic-01/starter.lisp': '; start\n',
        'src/content/problems/basic-02/starter.lisp': '; start\n',
      },
      solutionFiles: {
        'src/content/problems/basic-01/solution.lisp': '(print 1)\n',
        'src/content/problems/basic-02/solution.lisp': '(print 2)\n',
      },
      judgeFiles: {
        'src/content/problems/basic-01/judge.json': VALID_JUDGE,
        'src/content/problems/basic-02/judge.json': {
          ...VALID_JUDGE,
          cases: [{
            ...VALID_JUDGE.cases[0],
            id: 'basic-02-visible-1',
          }],
        },
      },
    })).toThrowError(/slug が別問題の id と衝突/);
  });
});