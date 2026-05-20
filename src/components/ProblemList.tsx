import { useState } from 'react';
import { Icon } from './Icon';
import { Problem } from '../types';
import { getNextRecommendedProblem, getProblemsByCategory, getProblemsByCourse, getProblemsByLearningPath, PROBLEM_COURSES, problems } from '../data/problems';
import { getPublicProblemTier } from '../utils/siteMode';

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

type ProblemListMode = 'category' | 'path' | 'course';

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
  const courses = getProblemsByCourse();
  const pathProblems = getProblemsByLearningPath();
  const solvedSet = new Set(solvedProblemIds);
  const bookmarkedSet = new Set(bookmarkedProblemIds);
  const normalizedSearchQuery = normalizeSearchText(searchQuery);
  const filterProblem = (problem: Problem) => matchesProblemSearch(problem, normalizedSearchQuery);
  const nextRecommendedProblem = getNextRecommendedProblem(solvedProblemIds);
  const selectedProblem = selectedId ? PROBLEM_BY_ID.get(selectedId) ?? null : null;
  const selectedCourse = selectedProblem?.catalog ? PROBLEM_COURSES[selectedProblem.catalog.courseId] : null;
  const solvedPathCount = pathProblems.filter((problem) => solvedSet.has(problem.id)).length;
  const recentlyViewedProblems = resolveProblems(recentProblemIds)
    .filter(filterProblem)
    .slice(0, RECENT_PROBLEM_LIMIT);
  const bookmarkedProblems = resolveProblems(bookmarkedProblemIds).filter(filterProblem);
  const visibleCourses = Array.from(courses.entries())
    .map(([courseId, courseProblems]) => [courseId, courseProblems.filter(filterProblem)] as const)
    .filter(([, courseProblems]) => courseProblems.length > 0);
  const visiblePathProblems = pathProblems.filter(filterProblem);
  const visibleCategories = Array.from(categories.entries())
    .map(([category, categoryProblems]) => [category, categoryProblems.filter(filterProblem)] as const)
    .filter(([, categoryProblems]) => categoryProblems.length > 0);
  const learningPathMessage = normalizedSearchQuery
    ? `検索中の学習パス候補: ${visiblePathProblems.length}件`
    : nextRecommendedProblem?.learningPath
      ? `次に学ぶ: ステップ ${nextRecommendedProblem.learningPath.step} ${nextRecommendedProblem.title}`
      : '全ステップ完了済みです。';
  const courseMessage = normalizedSearchQuery
    ? `検索中のコース候補: ${visibleCourses.length}件`
    : selectedProblem?.catalog && selectedCourse
      ? `現在のコース: ${selectedCourse.title} / 第${selectedProblem.catalog.courseOrder}問`
      : nextRecommendedProblem?.catalog
        ? `おすすめコース: ${PROBLEM_COURSES[nextRecommendedProblem.catalog.courseId].title}`
        : `利用可能コース: ${Object.keys(PROBLEM_COURSES).length}件`;
  const hasVisibleProblems =
    (listMode === 'path'
      ? visiblePathProblems.length > 0
      : listMode === 'course'
        ? visibleCourses.length > 0
        : visibleCategories.length > 0)
    || bookmarkedProblems.length > 0
    || recentlyViewedProblems.length > 0;

  const renderProblemButton = (problem: Problem, compact = false, view: 'default' | 'path' | 'course' = 'default') => {
    const tier = getPublicProblemTier(problem);
    const isStandardPreview = tier === 'standard';
    const pathStatus = view === 'path'
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
      : view === 'path' && problem.learningPath
        ? `ステップ ${problem.learningPath.step} / ${pathStatus}`
        : view === 'course' && problem.catalog
          ? `第${problem.catalog.courseOrder}問 / ${problem.category}`
          : null;

    return (
      <button
        key={`${compact ? 'shortcut' : 'category'}-${problem.id}`}
        type="button"
        className={`problem-item ${selectedId === problem.id ? 'selected' : ''} ${solvedSet.has(problem.id) ? 'solved' : ''} ${compact ? 'compact' : ''} ${nextRecommendedProblem?.id === problem.id ? 'recommended' : ''} ${isStandardPreview ? 'standard-preview' : 'free-preview'}`}
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
          {isStandardPreview && (
            <span className="problem-status-icon locked-preview" aria-label="有料候補コンテンツ"><Icon name="lock" className="ui-icon-small" /></span>
          )}
          {bookmarkedSet.has(problem.id) && (
            <span className="problem-status-icon bookmarked" aria-label="ブックマーク"><Icon name="bookmark" className="ui-icon-small" /></span>
          )}
          {solvedSet.has(problem.id) && (
            <span className="problem-status-icon" aria-label="解答済み"><Icon name="check" className="ui-icon-small" /></span>
          )}
          <span
            className="difficulty-badge"
            style={{ backgroundColor: DIFFICULTY_COLOR[problem.difficulty] }}
          >
            {DIFFICULTY_LABEL[problem.difficulty]}
          </span>
          <span className={`problem-tier-badge ${tier}`}>
            {tier === 'standard' ? 'Standard' : 'Free'}
          </span>
        </span>
      </button>
    );
  };

  return (
    <div className="problem-list">
      <div className="problem-list-header">
        <h2><span className="ui-label"><Icon name="problem" /><span>問題一覧</span></span></h2>
      </div>
      <div className="problem-list-body">
        <div className="learning-path-panel">
          <div className="learning-path-copy">
            <h3 className="learning-path-title"><span className="ui-label"><Icon name="compass" /><span>学習ナビ</span></span></h3>
            <p className="learning-path-description">学習パス、コース、カテゴリの3軸で問題を見比べられます。</p>
            <p className="learning-path-progress">進捗 {solvedPathCount}/{pathProblems.length}</p>
            <p className="learning-path-next">{learningPathMessage}</p>
            <p className="learning-path-course">{courseMessage}</p>
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
              className={`problem-list-mode-button ${listMode === 'course' ? 'active' : ''}`}
              aria-pressed={listMode === 'course'}
              onClick={() => setListMode('course')}
            >
              コース別
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
                <h3 className="problem-shortcut-title"><span className="ui-label"><Icon name="bookmark" /><span>ブックマーク</span></span></h3>
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
            {visiblePathProblems.map((problem) => renderProblemButton(problem, false, 'path'))}
          </div>
        ) : listMode === 'course' ? (
          visibleCourses.map(([courseId, courseProblems]) => {
            const course = PROBLEM_COURSES[courseId];

            return (
              <div key={courseId} className="problem-category course-category">
                <h3 className="category-title">
                  <span>{course.title}</span>
                  <span className="category-progress">
                    {courseProblems.filter((problem) => solvedSet.has(problem.id)).length}/{courseProblems.length}
                  </span>
                </h3>
                <p className="course-category-description">{course.description}</p>
                {courseProblems.map((problem) => renderProblemButton(problem, false, 'course'))}
              </div>
            );
          })
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
