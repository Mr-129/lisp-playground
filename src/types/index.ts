import type { JudgeSpec } from '../judge';

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
}
