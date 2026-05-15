import { useNavigate } from 'react-router-dom';
import { getNextRecommendedProblem, getProblemsByCategory, problems } from '../data/problems';
import { Problem } from '../types';

interface ProblemsPageProps {
  selectedProblemId: string | null;
  solvedProblemIds: string[];
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

function formatTotalStudyTime(minutes: number): string {
  if (minutes < 60) {
    return `約${minutes}分`;
  }

  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;
  return remain === 0 ? `約${hours}時間` : `約${hours}時間${remain}分`;
}

export function ProblemsPage({ selectedProblemId, solvedProblemIds, onSelectProblem }: ProblemsPageProps) {
  const navigate = useNavigate();
  const categories = Array.from(getProblemsByCategory().entries());
  const solvedSet = new Set(solvedProblemIds);
  const solvedCount = problems.filter((problem) => solvedSet.has(problem.id)).length;
  const remainingCount = problems.length - solvedCount;
  const completionRate = problems.length === 0 ? 0 : Math.round((solvedCount / problems.length) * 100);
  const totalStudyMinutes = problems.reduce((sum, problem) => sum + problem.estimatedMinutes, 0);
  const nextProblem = getNextRecommendedProblem(solvedProblemIds);

  const handleOpenProblem = (problem: Problem) => {
    onSelectProblem(problem);
    navigate(`/learn/${problem.id}`);
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
        <section className="practice-dashboard">
          <div className="practice-stat-grid">
            <article className="practice-stat-card">
              <span className="practice-stat-label">総問題数</span>
              <strong className="practice-stat-value">{problems.length}</strong>
            </article>
            <article className="practice-stat-card">
              <span className="practice-stat-label">解いた問題</span>
              <strong className="practice-stat-value">{solvedCount}</strong>
            </article>
            <article className="practice-stat-card">
              <span className="practice-stat-label">残り問題</span>
              <strong className="practice-stat-value">{remainingCount}</strong>
            </article>
            <article className="practice-stat-card">
              <span className="practice-stat-label">想定学習時間</span>
              <strong className="practice-stat-value">{formatTotalStudyTime(totalStudyMinutes)}</strong>
            </article>
          </div>

          <div className={`practice-recommendation ${nextProblem ? '' : 'completed'}`}>
            {nextProblem ? (
              <>
                <div className="practice-recommendation-copy">
                  <span className="practice-recommendation-label">次のおすすめ</span>
                  <h3>{nextProblem.order}. {nextProblem.title}</h3>
                  <p>
                    {nextProblem.category} / {DIFFICULTY_LABEL[nextProblem.difficulty]} / {nextProblem.estimatedMinutes}分
                  </p>
                  <p>{getProblemSummary(nextProblem.description)}</p>
                </div>
                <button
                  className="problem-card-button"
                  type="button"
                  onClick={() => handleOpenProblem(nextProblem)}
                >
                  この問題から始める
                </button>
              </>
            ) : (
              <div className="practice-recommendation-copy">
                <span className="practice-recommendation-label">進捗</span>
                <h3>全問クリア済みです</h3>
                <p>完了率は {completionRate}% です。復習したい問題を選び直して、再度解き直せます。</p>
              </div>
            )}
          </div>
        </section>

        {categories.map(([category, categoryProblems]) => (
          <section key={category} className="problem-section">
            <div className="problem-section-heading">
              <h3 className="problem-section-title">{category}</h3>
              <span className="problem-section-progress">
                {categoryProblems.filter((problem) => solvedSet.has(problem.id)).length}/{categoryProblems.length} 完了
              </span>
            </div>
            <div className="problem-card-grid">
              {categoryProblems.map((problem) => (
                <article
                  key={problem.id}
                  className={`problem-card ${selectedProblemId === problem.id ? 'selected' : ''} ${solvedSet.has(problem.id) ? 'solved' : ''} ${nextProblem?.id === problem.id ? 'recommended' : ''}`}
                >
                  <div className="problem-card-header">
                    <span className="problem-card-difficulty">{DIFFICULTY_LABEL[problem.difficulty]}</span>
                    <div className="problem-card-statuses">
                      {solvedSet.has(problem.id) && (
                        <span className="problem-card-solved">クリア済み</span>
                      )}
                      {selectedProblemId === problem.id && (
                        <span className="problem-card-current">現在の問題</span>
                      )}
                    </div>
                  </div>
                  <h4>{problem.order}. {problem.title}</h4>
                  <p>{getProblemSummary(problem.description)}</p>
                  <div className="problem-card-meta">
                    <span>{problem.estimatedMinutes}分</span>
                    <span>{problem.learningGoals.slice(0, 2).join(' / ')}</span>
                  </div>
                  <button
                    className="problem-card-button"
                    type="button"
                    onClick={() => handleOpenProblem(problem)}
                  >
                    {solvedSet.has(problem.id) ? 'もう一度解く' : '問題文を見る'}
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