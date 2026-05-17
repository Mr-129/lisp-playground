import type { Problem, ProblemCatalogInfo, ProblemCourseId, ProblemTag, ProblemTier } from '../types';
import { loadExternalProblemSeeds } from './problemContentLoader';

const CORE_LEARNING_PATH = {
  id: 'lisp-core-path',
  title: 'Lisp 基礎ステップ',
};

const DEFAULT_ESTIMATED_MINUTES: Record<Problem['difficulty'], number> = {
  beginner: 6,
  intermediate: 10,
  advanced: 14,
};

const CATEGORY_TO_COURSE: Record<string, ProblemCourseId> = {
  '基本構文': 'intro-core',
  '条件分岐': 'intro-core',
  '数値計算': 'intro-core',
  '文字列操作': 'intro-core',
  'スコープ': 'intro-core',
  '型判定': 'intro-core',
  'リスト操作': 'data-and-control',
  'ループ': 'data-and-control',
  '高階関数': 'functional-patterns',
  '再帰': 'functional-patterns',
  'クロージャ': 'functional-patterns',
  '総合問題': 'functional-patterns',
};

const CATEGORY_TO_TAGS: Record<string, ProblemTag[]> = {
  '基本構文': ['syntax'],
  '条件分岐': ['conditionals'],
  '数値計算': ['math'],
  '文字列操作': ['strings'],
  'スコープ': ['scope'],
  '型判定': ['types'],
  'リスト操作': ['lists'],
  'ループ': ['loops'],
  '高階関数': ['higher-order'],
  '再帰': ['recursion'],
  'クロージャ': ['closures'],
  '総合問題': ['challenge'],
};

export const PROBLEM_COURSES: Record<ProblemCourseId, { title: string; description: string }> = {
  'intro-core': {
    title: '入門コース',
    description: 'S式、条件分岐、数値・文字列処理など、Lisp 学習の最初の一歩を固めるコース。',
  },
  'data-and-control': {
    title: 'データと制御',
    description: 'リスト、ループ、基本的なデータ処理を通して手を動かしながら慣れるコース。',
  },
  'functional-patterns': {
    title: '関数型パターン',
    description: '高階関数、再帰、クロージャを使った Lisp らしい考え方へ進むコース。',
  },
};

function getProblemTier(difficulty: Problem['difficulty']): ProblemTier {
  return difficulty === 'beginner' ? 'free' : 'standard';
}

function getProblemCourseId(category: string): ProblemCourseId {
  return CATEGORY_TO_COURSE[category] ?? 'functional-patterns';
}

function getProblemTags(category: string): ProblemTag[] {
  return CATEGORY_TO_TAGS[category] ?? ['challenge'];
}

const problemSeeds = loadExternalProblemSeeds();
const courseOrderCounts = new Map<ProblemCourseId, number>();

export const problems: Problem[] = problemSeeds.map((problem, index) => {
  const courseId = getProblemCourseId(problem.category);
  const courseOrder = (courseOrderCounts.get(courseId) ?? 0) + 1;
  courseOrderCounts.set(courseId, courseOrder);

  const catalog: ProblemCatalogInfo = {
    tier: getProblemTier(problem.difficulty),
    courseId,
    courseOrder,
    tags: getProblemTags(problem.category),
  };

  return {
    ...problem,
    order: index + 1,
    estimatedMinutes: problem.estimatedMinutes ?? DEFAULT_ESTIMATED_MINUTES[problem.difficulty],
    learningGoals: problem.learningGoals ?? [problem.category],
    learningPath: {
      ...CORE_LEARNING_PATH,
      step: index + 1,
      prerequisites: index === 0 ? [] : [problemSeeds[index - 1].id],
    },
    catalog,
  };
});

export const PROBLEM_BY_ID = new Map(problems.map((problem) => [problem.id, problem]));
export const PROBLEM_BY_SLUG = new Map(problems.map((problem) => [problem.slug, problem]));

export function getProblemById(problemId: string): Problem | null {
  return PROBLEM_BY_ID.get(problemId) ?? null;
}

export function getProblemBySlug(problemSlug: string): Problem | null {
  return PROBLEM_BY_SLUG.get(problemSlug) ?? null;
}

export function resolveProblemByRouteKey(problemKey: string): Problem | null {
  return getProblemBySlug(problemKey) ?? getProblemById(problemKey);
}

export function getLearnProblemPath(problem: Pick<Problem, 'slug'>): string {
  return `/learn/${problem.slug}`;
}

export function getProblemsByLearningPath(): Problem[] {
  return problems
    .filter((problem) => problem.learningPath !== undefined)
    .sort((left, right) => (left.learningPath?.step ?? left.order) - (right.learningPath?.step ?? right.order));
}

export function getProblemsByCourse(): Map<ProblemCourseId, Problem[]> {
  const map = new Map<ProblemCourseId, Problem[]>();

  for (const courseId of Object.keys(PROBLEM_COURSES) as ProblemCourseId[]) {
    const courseProblems = problems
      .filter((problem) => problem.catalog?.courseId === courseId)
      .sort((left, right) => (left.catalog?.courseOrder ?? left.order) - (right.catalog?.courseOrder ?? right.order));

    map.set(courseId, courseProblems);
  }

  return map;
}

export function getNextRecommendedProblem(solvedProblemIds: string[]): Problem | null {
  const solvedSet = new Set(solvedProblemIds);
  const pathProblems = getProblemsByLearningPath();

  return pathProblems.find((problem) => {
    if (solvedSet.has(problem.id)) {
      return false;
    }

    return (problem.learningPath?.prerequisites ?? []).every((problemId) => solvedSet.has(problemId));
  }) ?? pathProblems.find((problem) => !solvedSet.has(problem.id)) ?? null;
}

export function getProblemsByCategory(): Map<string, Problem[]> {
  const map = new Map<string, Problem[]>();

  for (const problem of problems) {
    const list = map.get(problem.category) ?? [];
    list.push(problem);
    map.set(problem.category, list);
  }

  return map;
}