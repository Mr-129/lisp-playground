import { useNavigate } from 'react-router-dom';
import { getProblemsByCategory } from '../data/problems';
import { Problem } from '../types';

interface ProblemsPageProps {
  selectedProblemId: string | null;
  onSelectProblem: (problem: Problem) => void;
}

const DIFFICULTY_LABEL: Record<Problem['difficulty'], string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
};

function getProblemSummary(description: string): string {
  const lines = description
    .replace(/```[\s\S]*?```/g, '')
    .split('\n')
    .map((line) => line.replace(/[`#*]/g, '').trim())
    .filter(Boolean);

  return lines.find((line) => !line.startsWith('問題')) ?? '問題文を開いて詳細を確認できます。';
}

export function ProblemsPage({ selectedProblemId, onSelectProblem }: ProblemsPageProps) {
  const navigate = useNavigate();
  const categories = Array.from(getProblemsByCategory().entries());

  const handleOpenProblem = (problem: Problem) => {
    onSelectProblem(problem);
    navigate('/learn');
  };

  return (
    <div className="problems-page">
      <div className="problems-page-header">
        <div>
          <h2>📚 問題一覧ページ</h2>
          <p>カテゴリごとに問題を選んで、問題文の詳細ページに進めます。</p>
        </div>
        <div className="problems-page-actions">
          <button className="guide-start-button" type="button" onClick={() => navigate('/guide')}>
            📘 構文ガイドへ
          </button>
          <button className="start-coding-button" type="button" onClick={() => navigate('/editor')}>
            🖊️ フリーモード
          </button>
        </div>
      </div>

      <div className="problems-page-body">
        {categories.map(([category, categoryProblems]) => (
          <section key={category} className="problem-section">
            <h3 className="problem-section-title">{category}</h3>
            <div className="problem-card-grid">
              {categoryProblems.map((problem) => (
                <article
                  key={problem.id}
                  className={`problem-card ${selectedProblemId === problem.id ? 'selected' : ''}`}
                >
                  <div className="problem-card-header">
                    <span className="problem-card-difficulty">{DIFFICULTY_LABEL[problem.difficulty]}</span>
                    {selectedProblemId === problem.id && (
                      <span className="problem-card-current">現在の問題</span>
                    )}
                  </div>
                  <h4>{problem.title}</h4>
                  <p>{getProblemSummary(problem.description)}</p>
                  <button
                    className="problem-card-button"
                    type="button"
                    onClick={() => handleOpenProblem(problem)}
                  >
                    問題文を見る
                  </button>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}