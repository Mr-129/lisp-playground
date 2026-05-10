import { useState } from 'react';
import { Problem } from '../types';
import { getNextRecommendedProblem, getProblemsByCategory, getProblemsByLearningPath, problems } from '../data/problems';

interface ProblemListProps {
  selectedId: string | null;
  solvedProblemIds: string[];
  recentProblemIds?: string[];
  bookmarkedProblemIds?: string[];
  searchQuery?: string;
  onSelect: (problem: Problem) => void;
}

const RECENT_PROBLEM_LIMIT = 5;
const PROBLEM_BY_ID = new Map(problems.map((problem) => [problem.id, problem]));

type ProblemListMode = 'category' | 'path';

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

function normalizeSearchText(text: string): string {
  return text.trim().toLocaleLowerCase();
}

function matchesProblemSearch(problem: Problem, normalizedSearchQuery: string): boolean {
  if (!normalizedSearchQuery) {
    return true;
  }

  const searchableText = [
    problem.title,
    problem.category,
    DIFFICULTY_LABEL[problem.difficulty],
    problem.description,
    problem.learningGoals.join(' '),
  ]
    .join(' ')
    .toLocaleLowerCase();

  return searchableText.includes(normalizedSearchQuery);
}

function resolveProblems(problemIds: string[]): Problem[] {
  return problemIds
    .map((problemId) => PROBLEM_BY_ID.get(problemId))
    .filter((problem): problem is Problem => problem !== undefined);
}

export function ProblemList({
  selectedId,
  solvedProblemIds,
  recentProblemIds = [],
  bookmarkedProblemIds = [],
  searchQuery = '',
  onSelect,
}: ProblemListProps) {
  const [listMode, setListMode] = useState<ProblemListMode>('category');
  const categories = getProblemsByCategory();
  const pathProblems = getProblemsByLearningPath();
  const solvedSet = new Set(solvedProblemIds);
  const bookmarkedSet = new Set(bookmarkedProblemIds);
  const normalizedSearchQuery = normalizeSearchText(searchQuery);
  const filterProblem = (problem: Problem) => matchesProblemSearch(problem, normalizedSearchQuery);
  const nextRecommendedProblem = getNextRecommendedProblem(solvedProblemIds);
  const solvedPathCount = pathProblems.filter((problem) => solvedSet.has(problem.id)).length;
  const recentlyViewedProblems = resolveProblems(recentProblemIds)
    .filter(filterProblem)
    .slice(0, RECENT_PROBLEM_LIMIT);
  const bookmarkedProblems = resolveProblems(bookmarkedProblemIds).filter(filterProblem);
  const visiblePathProblems = pathProblems.filter(filterProblem);
  const visibleCategories = Array.from(categories.entries())
    .map(([category, categoryProblems]) => [category, categoryProblems.filter(filterProblem)] as const)
    .filter(([, categoryProblems]) => categoryProblems.length > 0);
  const learningPathMessage = normalizedSearchQuery
    ? `検索中の学習パス候補: ${visiblePathProblems.length}件`
    : nextRecommendedProblem?.learningPath
      ? `次に学ぶ: ステップ ${nextRecommendedProblem.learningPath.step} ${nextRecommendedProblem.title}`
      : '全ステップ完了済みです。';
  const hasVisibleProblems =
    (listMode === 'path' ? visiblePathProblems.length > 0 : visibleCategories.length > 0)
    || bookmarkedProblems.length > 0
    || recentlyViewedProblems.length > 0;

  const renderProblemButton = (problem: Problem, compact = false, pathView = false) => {
    const pathStatus = pathView
      ? solvedSet.has(problem.id)
        ? 'クリア済み'
        : nextRecommendedProblem?.id === problem.id
          ? '次に学ぶ'
          : (problem.learningPath?.prerequisites ?? []).every((problemId) => solvedSet.has(problemId))
            ? '取り組み可能'
            : '前提待ち'
      : null;

    const subtitle = compact
      ? `${problem.category} / ${DIFFICULTY_LABEL[problem.difficulty]}`
      : pathView && problem.learningPath
        ? `ステップ ${problem.learningPath.step} / ${pathStatus}`
        : null;

    return (
      <button
        key={`${compact ? 'shortcut' : 'category'}-${problem.id}`}
        type="button"
        className={`problem-item ${selectedId === problem.id ? 'selected' : ''} ${solvedSet.has(problem.id) ? 'solved' : ''} ${compact ? 'compact' : ''} ${pathView && nextRecommendedProblem?.id === problem.id ? 'recommended' : ''}`}
        onClick={() => onSelect(problem)}
      >
        <span className="problem-title-stack">
          <span className="problem-title">{problem.order}. {problem.title}</span>
          {subtitle && (
            <span className="problem-subtitle">
              {subtitle}
            </span>
          )}
        </span>
        <span className="problem-item-meta">
          {bookmarkedSet.has(problem.id) && (
            <span className="problem-status-icon bookmarked" aria-label="ブックマーク">★</span>
          )}
          {solvedSet.has(problem.id) && (
            <span className="problem-status-icon" aria-label="解答済み">✓</span>
          )}
          <span
            className="difficulty-badge"
            style={{ backgroundColor: DIFFICULTY_COLOR[problem.difficulty] }}
          >
            {DIFFICULTY_LABEL[problem.difficulty]}
          </span>
        </span>
      </button>
    );
  };

  return (
    <div className="problem-list">
      <div className="problem-list-header">
        <h2>📚 問題一覧</h2>
      </div>
      <div className="problem-list-body">
        <div className="learning-path-panel">
          <div className="learning-path-copy">
            <h3 className="learning-path-title">🧭 学習パス</h3>
            <p className="learning-path-description">初学者向けの推奨順で、何から学ぶべきかを確認できます。</p>
            <p className="learning-path-progress">進捗 {solvedPathCount}/{pathProblems.length}</p>
            <p className="learning-path-next">{learningPathMessage}</p>
          </div>
          <div className="problem-list-mode-toggle" role="group" aria-label="問題一覧の表示順">
            <button
              type="button"
              className={`problem-list-mode-button ${listMode === 'path' ? 'active' : ''}`}
              aria-pressed={listMode === 'path'}
              onClick={() => setListMode('path')}
            >
              学習パス順
            </button>
            <button
              type="button"
              className={`problem-list-mode-button ${listMode === 'category' ? 'active' : ''}`}
              aria-pressed={listMode === 'category'}
              onClick={() => setListMode('category')}
            >
              カテゴリ別
            </button>
          </div>
        </div>
        {(bookmarkedProblems.length > 0 || recentlyViewedProblems.length > 0) && (
          <div className="problem-shortcuts">
            {bookmarkedProblems.length > 0 && (
              <div className="problem-shortcut-section">
                <h3 className="problem-shortcut-title">★ ブックマーク</h3>
                {bookmarkedProblems.map((problem) => renderProblemButton(problem, true))}
              </div>
            )}
            {recentlyViewedProblems.length > 0 && (
              <div className="problem-shortcut-section">
                <h3 className="problem-shortcut-title">最近見た問題</h3>
                {recentlyViewedProblems.map((problem) => renderProblemButton(problem, true))}
              </div>
            )}
          </div>
        )}
        {!hasVisibleProblems && normalizedSearchQuery && (
          <p className="problem-search-empty">一致する問題はありません。</p>
        )}
        {listMode === 'path' ? (
          <div className="problem-category">
            <h3 className="category-title">
              <span>{pathProblems[0]?.learningPath?.title ?? '学習パス'}</span>
              <span className="category-progress">{solvedPathCount}/{pathProblems.length}</span>
            </h3>
            {visiblePathProblems.map((problem) => renderProblemButton(problem, false, true))}
          </div>
        ) : visibleCategories.map(([category, probs]) => (
          <div key={category} className="problem-category">
            <h3 className="category-title">
              <span>{category}</span>
              <span className="category-progress">
                {probs.filter((problem) => solvedSet.has(problem.id)).length}/{probs.length}
              </span>
            </h3>
            {probs.map((problem) => renderProblemButton(problem))}
          </div>
        ))}
      </div>
    </div>
  );
}
