import { Problem } from '../types';
import { getProblemsByCategory } from '../data/problems';

interface ProblemListProps {
  selectedId: string | null;
  solvedProblemIds: string[];
  onSelect: (problem: Problem) => void;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: '#4caf50',
  intermediate: '#ff9800',
  advanced: '#f44336',
};

export function ProblemList({ selectedId, solvedProblemIds, onSelect }: ProblemListProps) {
  const categories = getProblemsByCategory();
  const solvedSet = new Set(solvedProblemIds);

  return (
    <div className="problem-list">
      <div className="problem-list-header">
        <h2>📚 問題一覧</h2>
      </div>
      <div className="problem-list-body">
        {Array.from(categories.entries()).map(([category, probs]) => (
          <div key={category} className="problem-category">
            <h3 className="category-title">
              <span>{category}</span>
              <span className="category-progress">
                {probs.filter((problem) => solvedSet.has(problem.id)).length}/{probs.length}
              </span>
            </h3>
            {probs.map((p) => (
              <button
                key={p.id}
                className={`problem-item ${selectedId === p.id ? 'selected' : ''} ${solvedSet.has(p.id) ? 'solved' : ''}`}
                onClick={() => onSelect(p)}
              >
                <span className="problem-title">{p.order}. {p.title}</span>
                <span className="problem-item-meta">
                  {solvedSet.has(p.id) && (
                    <span className="problem-status-icon" aria-label="解答済み">✓</span>
                  )}
                  <span
                    className="difficulty-badge"
                    style={{ backgroundColor: DIFFICULTY_COLOR[p.difficulty] }}
                  >
                    {DIFFICULTY_LABEL[p.difficulty]}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
