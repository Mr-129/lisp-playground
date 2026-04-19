import { Problem } from '../types';
import { getProblemsByCategory } from '../data/problems';

interface ProblemListProps {
  selectedId: string | null;
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

export function ProblemList({ selectedId, onSelect }: ProblemListProps) {
  const categories = getProblemsByCategory();

  return (
    <div className="problem-list">
      <div className="problem-list-header">
        <h2>📚 問題一覧</h2>
      </div>
      <div className="problem-list-body">
        {Array.from(categories.entries()).map(([category, probs]) => (
          <div key={category} className="problem-category">
            <h3 className="category-title">{category}</h3>
            {probs.map((p) => (
              <button
                key={p.id}
                className={`problem-item ${selectedId === p.id ? 'selected' : ''}`}
                onClick={() => onSelect(p)}
              >
                <span className="problem-title">{p.title}</span>
                <span
                  className="difficulty-badge"
                  style={{ backgroundColor: DIFFICULTY_COLOR[p.difficulty] }}
                >
                  {DIFFICULTY_LABEL[p.difficulty]}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
