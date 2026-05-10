import type { JudgeSpec } from '../judge';

export type ProblemTier = 'free' | 'standard';

export type ProblemCourseId = 'intro-core' | 'data-and-control' | 'functional-patterns';

export type ProblemTag =
  | 'syntax'
  | 'conditionals'
  | 'math'
  | 'lists'
  | 'strings'
  | 'loops'
  | 'higher-order'
  | 'recursion'
  | 'closures'
  | 'scope'
  | 'types'
  | 'challenge';

export interface ProblemCatalogInfo {
  tier: ProblemTier;
  courseId: ProblemCourseId;
  courseOrder: number;
  tags: ProblemTag[];
}

export interface LearningPathStep {
  id: string;
  title: string;
  step: number;
  prerequisites: string[];
}

export interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  hint?: string;
  initialCode: string;
  expectedOutput?: string;
  expectedReturnValue?: string;
  solution: string;
  judge?: JudgeSpec;
  order: number;
  estimatedMinutes: number;
  learningGoals: string[];
  learningPath?: LearningPathStep;
  catalog?: ProblemCatalogInfo;
}
