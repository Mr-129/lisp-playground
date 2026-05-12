import { useState, useCallback, useEffect, useMemo, type ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProblemList } from '../components/ProblemList';
import { ProblemView } from '../components/ProblemView';
import { LispGuide, filterGuideSections } from '../components/LispGuide';
import { getProblemsByCourse, PROBLEM_COURSES } from '../data/problems';
import { trackEvent } from '../utils/analytics';
import { getWaitlistConfig, openWaitlistTarget } from '../utils/waitlist';
import { Problem } from '../types';

interface LearnPageProps {
  selectedProblem: Problem | null;
  solvedProblemIds: string[];
  recentProblemIds?: string[];
  bookmarkedProblemIds?: string[];
  searchQuery?: string;
  selectedGuideSectionId?: string | null;
  onSelectProblem: (problem: Problem) => void;
  onSearchQueryChange?: (query: string) => void;
  onSelectGuideSection?: (sectionId: string | null) => void;
  onToggleBookmark?: (problemId: string) => void;
  onOpenPricingGuide?: (placement: 'learn_empty' | 'learn_problem') => void;
  onShowSolution: () => void;
  onNavigateToEditor: () => void;
  initialView?: 'problem' | 'guide';
}

export function LearnPage({
  selectedProblem,
  solvedProblemIds,
  recentProblemIds = [],
  bookmarkedProblemIds = [],
  searchQuery = '',
  selectedGuideSectionId = null,
  onSelectProblem,
  onSearchQueryChange = () => {},
  onSelectGuideSection = () => {},
  onToggleBookmark = () => {},
  onOpenPricingGuide = () => {},
  onShowSolution,
  onNavigateToEditor,
  initialView = 'problem',
}: LearnPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showGuide, setShowGuide] = useState(initialView === 'guide');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const waitlistConfig = useMemo(() => getWaitlistConfig(), []);
  const hasActiveSearch = searchQuery.trim().length > 0;
  const solvedProblemSet = useMemo(() => new Set(solvedProblemIds), [solvedProblemIds]);
  const guideSearchResults = useMemo(
    () => (hasActiveSearch ? filterGuideSections(searchQuery) : []),
    [hasActiveSearch, searchQuery]
  );
  const selectedCourse = useMemo(
    () => (selectedProblem?.catalog ? PROBLEM_COURSES[selectedProblem.catalog.courseId] : null),
    [selectedProblem]
  );
  const selectedCourseProblems = useMemo(
    () => (selectedProblem?.catalog ? getProblemsByCourse().get(selectedProblem.catalog.courseId) ?? [] : []),
    [selectedProblem?.catalog?.courseId]
  );
  const solvedCourseCount = useMemo(
    () => selectedCourseProblems.filter((problem) => solvedProblemSet.has(problem.id)).length,
    [selectedCourseProblems, solvedProblemSet]
  );
  const nextCourseProblem = useMemo(
    () => selectedCourseProblems.find((problem) => !solvedProblemSet.has(problem.id)) ?? null,
    [selectedCourseProblems, solvedProblemSet]
  );
  const isStandardCandidate = selectedProblem?.catalog?.tier === 'standard';

  useEffect(() => {
    setShowGuide(initialView === 'guide');
  }, [initialView]);

  const handleSelectProblem = useCallback((problem: Problem) => {
    onSelectGuideSection(null);
    onSelectProblem(problem);
    setShowGuide(false);
    if (location.pathname === '/guide') {
      navigate('/learn');
    }
  }, [location.pathname, navigate, onSelectGuideSection, onSelectProblem]);

  const handleOpenGuide = useCallback(() => {
    onSelectGuideSection(null);
    setShowGuide(true);
    navigate('/guide');
  }, [navigate, onSelectGuideSection]);

  const handleOpenGuideSection = useCallback((sectionId: string) => {
    onSelectGuideSection(sectionId);
    setShowGuide(true);
    navigate('/guide');
  }, [navigate, onSelectGuideSection]);

  const handleStartCoding = useCallback(() => {
    onNavigateToEditor();
    navigate('/editor');
  }, [navigate, onNavigateToEditor]);

  const handleOpenWaitlist = useCallback((placement: 'learn_empty' | 'learn_problem') => {
    if (!waitlistConfig.url) {
      return;
    }

    trackEvent('waitlist_cta_clicked', {
      placement,
      channel: waitlistConfig.channel,
      selectedProblemId: selectedProblem?.id ?? null,
      selectedProblemTier: selectedProblem?.catalog?.tier ?? 'unknown',
    });
    openWaitlistTarget(waitlistConfig.url);
  }, [selectedProblem?.catalog?.tier, selectedProblem?.id, waitlistConfig.channel, waitlistConfig.url]);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextQuery = event.target.value;
    const normalizedQuery = nextQuery.trim();

    onSearchQueryChange(nextQuery);

    if (!normalizedQuery) {
      onSelectGuideSection(null);
      return;
    }

    if (normalizedQuery !== searchQuery.trim()) {
      trackEvent('learning_search_used', {
        query: normalizedQuery,
        mode: showGuide ? 'guide' : 'problem',
        guideResultCount: filterGuideSections(nextQuery).length,
        selectedProblemId: selectedProblem?.id ?? null,
      });
    }
  }, [onSearchQueryChange, onSelectGuideSection, searchQuery, selectedProblem?.id, showGuide]);

  return (
    <div className="learn-page">
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="サイドバーを切り替え">
          {sidebarOpen ? '◀' : '▶'}
        </button>
        {sidebarOpen && (
          <>
            <div className="learn-search-panel">
              <label className="learn-search-label" htmlFor="learn-search-input">
                問題とガイドを検索
              </label>
              <input
                id="learn-search-input"
                className="learn-search-input"
                type="search"
                value={searchQuery}
                placeholder="例: mapcar / クロージャ / 条件分岐"
                onChange={handleSearchChange}
              />
              <p className="learn-search-meta">問題タイトル、カテゴリ、ガイド見出しで絞り込めます。</p>
            </div>
            <button
              className={`guide-mode-button ${showGuide ? 'active' : ''}`}
              onClick={handleOpenGuide}
              aria-label="構文ガイドを表示"
            >
              📘 構文ガイド
            </button>
            {hasActiveSearch && (
              <div className="guide-search-results">
                <h3 className="guide-search-results-title">ガイド結果</h3>
                {guideSearchResults.length > 0 ? (
                  guideSearchResults.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      className={`guide-search-result-button ${selectedGuideSectionId === section.id ? 'active' : ''}`}
                      onClick={() => handleOpenGuideSection(section.id)}
                    >
                      {section.title}
                    </button>
                  ))
                ) : (
                  <p className="guide-search-empty">一致するガイド項目はありません。</p>
                )}
              </div>
            )}
            <ProblemList
              selectedId={selectedProblem?.id ?? null}
              solvedProblemIds={solvedProblemIds}
              recentProblemIds={recentProblemIds}
              bookmarkedProblemIds={bookmarkedProblemIds}
              searchQuery={searchQuery}
              onSelect={handleSelectProblem}
            />
          </>
        )}
      </div>
      <div className="learn-main">
        {showGuide ? (
          <LispGuide searchQuery={searchQuery} selectedSectionId={selectedGuideSectionId} />
        ) : selectedProblem ? (
          <div className="learn-problem-area">
            {selectedProblem.catalog && selectedCourse && (
              <section className="learn-course-card" aria-label="現在のコース情報">
                <div className="learn-course-card-header">
                  <div>
                    <p className="learn-course-eyebrow">現在のコース</p>
                    <h3>{selectedCourse.title}</h3>
                  </div>
                  <span className={`learn-course-tier ${selectedProblem.catalog.tier}`}>
                    {selectedProblem.catalog.tier === 'free' ? 'Free' : 'Standard'}
                  </span>
                </div>
                <p className="learn-course-description">{selectedCourse.description}</p>
                <div className="learn-course-stats">
                  <span className="learn-course-stat">第{selectedProblem.catalog.courseOrder}問</span>
                  <span className="learn-course-stat">{solvedCourseCount}/{selectedCourseProblems.length} 完了</span>
                  <span className="learn-course-stat">{selectedProblem.category}</span>
                </div>
                <p className="learn-course-next">
                  {nextCourseProblem
                    ? nextCourseProblem.id === selectedProblem.id
                      ? 'この問題がコースの次の一問です。'
                      : `次のコース問題: ${nextCourseProblem.title}`
                    : 'このコースはすべて完了しています。'}
                </p>
              </section>
            )}
            <section
              className={`pricing-cta-banner ${isStandardCandidate ? 'standard' : 'free'}`}
              aria-label="Standard プランの案内"
            >
              <div className="pricing-cta-copy">
                <p className="pricing-cta-eyebrow">Free の次に進む学習導線</p>
                <h3>{isStandardCandidate ? 'この問題は Standard 候補です' : 'Standard の学習拡張を準備中です'}</h3>
                <p>
                  Free は入門コースを継続無料、Standard は中級問題、コース横断演習、詳しい解説を追加する方針です。
                  価格ページでは Free / Standard / Supporter の差分を比較できます。
                </p>
                {waitlistConfig.channel === 'github_issue' && waitlistConfig.url && (
                  <p className="waitlist-cta-note">
                    更新通知の仮登録は暫定的に GitHub issue で受け付けます。個人情報やメールアドレスは書かないでください。
                  </p>
                )}
              </div>
              <div className="pricing-cta-actions">
                <button
                  type="button"
                  className="pricing-cta-button"
                  onClick={() => onOpenPricingGuide('learn_problem')}
                >
                  ✨ Standard の案内を見る
                </button>
                {waitlistConfig.url && (
                  <button
                    type="button"
                    className="pricing-inline-link waitlist-cta-button"
                    onClick={() => handleOpenWaitlist('learn_problem')}
                  >
                    📮 更新通知を受け取る
                  </button>
                )}
              </div>
            </section>
            <ProblemView
              key={selectedProblem.id}
              problem={selectedProblem}
              isSolved={solvedProblemIds.includes(selectedProblem.id)}
              isBookmarked={bookmarkedProblemIds.includes(selectedProblem.id)}
              onToggleBookmark={() => onToggleBookmark(selectedProblem.id)}
              onShowSolution={onShowSolution}
            />
            <div className="learn-actions">
              <button className="start-coding-button" onClick={handleStartCoding}>
                🖊️ エディタで解く →
              </button>
            </div>
          </div>
        ) : (
          <div className="learn-empty-state">
            <div className="learn-empty-card">
              <h2>問題を選択してください</h2>
              <p>問題一覧ページで問題文を選ぶか、構文ガイドから学習を始められます。</p>
              <div className="welcome-actions">
                <button className="guide-start-button" type="button" onClick={() => navigate('/problems')}>
                  📚 問題一覧ページへ
                </button>
                <button className="start-coding-button" type="button" onClick={handleStartCoding}>
                  🖊️ フリーモードで始める
                </button>
              </div>
              <div className="pricing-inline-note">
                <p>入門を進めた後の Standard 学習拡張や Supporter 案内は、価格ページにまとめています。</p>
                {waitlistConfig.channel === 'github_issue' && waitlistConfig.url && (
                  <p className="waitlist-cta-note">
                    更新通知の仮登録は GitHub issue ベースの暫定導線です。個人情報やメールアドレスは書かないでください。
                  </p>
                )}
                <div className="pricing-inline-actions">
                  <button
                    className="pricing-inline-link"
                    type="button"
                    onClick={() => onOpenPricingGuide('learn_empty')}
                  >
                    ✨ Standard の案内を見る
                  </button>
                  {waitlistConfig.url && (
                    <button
                      className="pricing-inline-link waitlist-cta-button"
                      type="button"
                      onClick={() => handleOpenWaitlist('learn_empty')}
                    >
                      📮 更新通知を受け取る
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
