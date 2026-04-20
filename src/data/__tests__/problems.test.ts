import { describe, it, expect } from 'vitest';
import { problems, getProblemsByCategory } from '../problems';

describe('problems データ', () => {
  describe('データ整合性', () => {
    it('すべての問題に必須フィールドがある', () => {
      for (const p of problems) {
        expect(p.id).toBeTruthy();
        expect(p.title).toBeTruthy();
        expect(p.category).toBeTruthy();
        expect(p.difficulty).toBeTruthy();
        expect(p.description).toBeTruthy();
        expect(p.initialCode).toBeDefined();
        expect(p.solution).toBeTruthy();
      }
    });

    it('IDが一意である', () => {
      const ids = problems.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('difficulty は beginner/intermediate/advanced のいずれか', () => {
      const validDifficulties = ['beginner', 'intermediate', 'advanced'];
      for (const p of problems) {
        expect(validDifficulties).toContain(p.difficulty);
      }
    });

    it('少なくとも1つの問題が存在する', () => {
      expect(problems.length).toBeGreaterThan(0);
    });

    it('すべてのカテゴリに問題がある', () => {
      const categories = new Set(problems.map(p => p.category));
      expect(categories.size).toBeGreaterThan(0);
    });
  });

  describe('getProblemsByCategory', () => {
    it('カテゴリごとにグループ化される', () => {
      const map = getProblemsByCategory();
      expect(map.size).toBeGreaterThan(0);

      let totalCount = 0;
      for (const [category, probs] of map) {
        expect(category).toBeTruthy();
        expect(probs.length).toBeGreaterThan(0);
        for (const p of probs) {
          expect(p.category).toBe(category);
        }
        totalCount += probs.length;
      }
      expect(totalCount).toBe(problems.length);
    });

    it('期待されるカテゴリが含まれる', () => {
      const map = getProblemsByCategory();
      const categories = Array.from(map.keys());
      expect(categories).toContain('基本構文');
      expect(categories).toContain('条件分岐');
      expect(categories).toContain('リスト操作');
    });
  });
});

describe('問題の解答が実行可能', () => {
  // dynamically import the interpreter to test solutions
  let executeLisp: typeof import('../../interpreter').executeLisp;

  beforeAll(async () => {
    const mod = await import('../../interpreter');
    executeLisp = mod.executeLisp;
  });

  it.each(problems.map(p => [p.id, p.title, p]))('"%s: %s" の解答がエラーなく実行できる', (_id, _title, problem) => {
    const result = executeLisp(problem.solution);
    expect(result.error).toBeUndefined();
  });

  it.each(
    problems.filter(p => p.expectedOutput !== undefined).map(p => [p.id, p.title, p])
  )('"%s: %s" の解答が期待される出力を生成する', (_id, _title, problem) => {
    const result = executeLisp(problem.solution);
    expect(result.output).toBe(problem.expectedOutput);
  });

  it.each(
    problems.filter(p => p.expectedReturnValue !== undefined).map(p => [p.id, p.title, p])
  )('"%s: %s" の解答が期待される戻り値を返す', (_id, _title, problem) => {
    const result = executeLisp(problem.solution);
    expect(result.returnValue).toBe(problem.expectedReturnValue);
  });
});
