import type { Problem } from '../types';

export type ProblemSeed = Omit<Problem, 'order' | 'estimatedMinutes' | 'learningGoals' | 'learningPath' | 'catalog'>
  & Partial<Pick<Problem, 'estimatedMinutes' | 'learningGoals'>>;