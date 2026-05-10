import { describe, it, expect } from 'vitest';
import { problems, getNextRecommendedProblem, getProblemsByCategory, getProblemsByLearningPath } from '../problems';

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
        expect(p.learningPath).toBeDefined();
        expect(p.catalog).toBeDefined();
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

  describe('learning path', () => {
    it('学習パス順の一覧を返す', () => {
      const pathProblems = getProblemsByLearningPath();

      expect(pathProblems).toHaveLength(problems.length);
      expect(pathProblems[0].learningPath?.step).toBe(1);
      expect(pathProblems[pathProblems.length - 1].learningPath?.step).toBe(pathProblems.length);
    });

    it('学習パスの前提は既存の問題IDだけを参照し、常に前のステップを指す', () => {
      const problemIds = new Set(problems.map((problem) => problem.id));

      for (const problem of problems) {
        const path = problem.learningPath;
        expect(path).toBeDefined();

        for (const prerequisite of path?.prerequisites ?? []) {
          expect(problemIds.has(prerequisite)).toBe(true);
        }

        if ((path?.step ?? 0) === 1) {
          expect(path?.prerequisites).toEqual([]);
        } else {
          expect(path?.prerequisites).toHaveLength(1);
        }
      }
    });

    it('未解答がない最初のステップを次のおすすめとして返す', () => {
      const firstProblem = getProblemsByLearningPath()[0];
      const secondProblem = getProblemsByLearningPath()[1];

      expect(getNextRecommendedProblem([])?.id).toBe(firstProblem.id);
      expect(getNextRecommendedProblem([firstProblem.id])?.id).toBe(secondProblem.id);
    });

    it('後ろの問題だけ解いていても最初の未解答ステップを優先する', () => {
      const [firstProblem, secondProblem] = getProblemsByLearningPath();

      expect(getNextRecommendedProblem([secondProblem.id])?.id).toBe(firstProblem.id);
    });
  });

  describe('catalog metadata', () => {
    it('商品属性の最小セットが揃っている', () => {
      const validTiers = new Set(['free', 'standard']);
      const validCourseIds = new Set(['intro-core', 'data-and-control', 'functional-patterns']);
      const validTags = new Set([
        'syntax',
        'conditionals',
        'math',
        'lists',
        'strings',
        'loops',
        'higher-order',
        'recursion',
        'closures',
        'scope',
        'types',
        'challenge',
      ]);

      for (const problem of problems) {
        const catalog = problem.catalog;
        expect(catalog).toBeDefined();
        expect(validTiers.has(catalog?.tier ?? '')).toBe(true);
        expect(validCourseIds.has(catalog?.courseId ?? '')).toBe(true);
        expect((catalog?.courseOrder ?? 0)).toBeGreaterThan(0);
        expect((catalog?.tags ?? []).length).toBeGreaterThan(0);
        expect((catalog?.tags ?? []).every((tag) => validTags.has(tag))).toBe(true);
      }
    });

    it('courseOrder がコース単位で連番になる', () => {
      const courseOrders = new Map<string, number[]>();

      for (const problem of problems) {
        const courseId = problem.catalog?.courseId;
        const courseOrder = problem.catalog?.courseOrder;

        expect(courseId).toBeDefined();
        expect(courseOrder).toBeDefined();

        const orders = courseOrders.get(courseId ?? '') ?? [];
        orders.push(courseOrder ?? 0);
        courseOrders.set(courseId ?? '', orders);
      }

      for (const orders of courseOrders.values()) {
        const sorted = [...orders].sort((left, right) => left - right);
        expect(sorted).toEqual(Array.from({ length: sorted.length }, (_, index) => index + 1));
      }
    });

    it('初級は free、中級以上は standard に割り当てられる', () => {
      for (const problem of problems) {
        expect(problem.catalog?.tier).toBe(problem.difficulty === 'beginner' ? 'free' : 'standard');
      }
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
