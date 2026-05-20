import { useState, useCallback, useEffect, useMemo, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ProblemList } from '../components/ProblemList';
import { ProblemView } from '../components/ProblemView';
import { LispGuide, filterGuideSections } from '../components/LispGuide';
import {
  getLearnProblemPath,
  getNextRecommendedProblem,
  getProblemsByCourse,
  PROBLEM_COURSES,
  resolveProblemByRouteKey,
} from '../data/problems';
import { trackEvent } from '../utils/analytics';
import { getWaitlistConfig, openWaitlistTarget } from '../utils/waitlist';
import { COMMERCIAL_FEATURES_ENABLED, WAITLIST_ENABLED, getPublicProblemTier } from '../utils/siteMode';
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

function getProblemSummary(description: string): string {
  const lines = description
    .replace(/```[\s\S]*?```/g, '')
    .split('\n')
    .map((line) => line.replace(/[`#*]/g, '').trim())
    .filter(Boolean);

  return lines.find((line) => !line.startsWith('問題')) ?? '問題文を開いて詳細を確認できます。';
}

const DIFFICULTY_LABEL: Record<Problem['difficulty'], string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
};

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
  const { problemId } = useParams<{ problemId: string }>();
  const [showGuide, setShowGuide] = useState(initialView === 'guide');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const waitlistConfig = useMemo(
    () => (WAITLIST_ENABLED ? getWaitlistConfig() : { url: null, channel: 'external_form' as const }),
    []
  );
  const routeProblem = useMemo(() => {
    if (!problemId) {
      return null;
    }

    const resolvedProblem = resolveProblemByRouteKey(problemId);

    if (resolvedProblem) {
      return resolvedProblem;
    }

    if (selectedProblem && (selectedProblem.id === problemId || selectedProblem.slug === problemId)) {
      return selectedProblem;
    }

    return null;
  }, [problemId, selectedProblem]);
  const activeProblem = routeProblem;
  const activeProblemTier = getPublicProblemTier(activeProblem);
  const hasActiveSearch = searchQuery.trim().length > 0;
  const solvedProblemSet = useMemo(() => new Set(solvedProblemIds), [solvedProblemIds]);
  const nextRecommendedProblem = useMemo(() => getNextRecommendedProblem(solvedProblemIds), [solvedProblemIds]);
  const nextRecommendedProblemTier = getPublicProblemTier(nextRecommendedProblem);
  const guideSearchResults = useMemo(
    () => (hasActiveSearch ? filterGuideSections(searchQuery) : []),
    [hasActiveSearch, searchQuery]
  );
  const selectedCourse = useMemo(
    () => (activeProblem?.catalog ? PROBLEM_COURSES[activeProblem.catalog.courseId] : null),
    [activeProblem]
  );
  const selectedCourseProblems = useMemo(
    () => (activeProblem?.catalog ? getProblemsByCourse().get(activeProblem.catalog.courseId) ?? [] : []),
    [activeProblem?.catalog?.courseId]
  );
  const solvedCourseCount = useMemo(
    () => selectedCourseProblems.filter((problem) => solvedProblemSet.has(problem.id)).length,
    [selectedCourseProblems, solvedProblemSet]
  );
  const nextCourseProblem = useMemo(
    () => selectedCourseProblems.find((problem) => !solvedProblemSet.has(problem.id)) ?? null,
    [selectedCourseProblems, solvedProblemSet]
  );
  const isStandardCandidate = COMMERCIAL_FEATURES_ENABLED && activeProblemTier === 'standard';

  useEffect(() => {
    setShowGuide(initialView === 'guide');
  }, [initialView]);

  useEffect(() => {
    if (!routeProblem || selectedProblem?.id === routeProblem.id) {
      return;
    }

    onSelectProblem(routeProblem);
  }, [onSelectProblem, routeProblem, selectedProblem?.id]);

  useEffect(() => {
    if (!problemId || !routeProblem || routeProblem.slug === problemId) {
      return;
    }

    navigate(getLearnProblemPath(routeProblem), { replace: true });
  }, [navigate, problemId, routeProblem]);

  const handleSelectProblem = useCallback((problem: Problem) => {
    onSelectGuideSection(null);
    onSelectProblem(problem);
    setShowGuide(false);
    navigate(getLearnProblemPath(problem));
  }, [navigate, onSelectGuideSection, onSelectProblem]);

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
      selectedProblemId: activeProblem?.id ?? null,
      selectedProblemTier: activeProblem?.catalog?.tier ?? 'unknown',
    });
    openWaitlistTarget(waitlistConfig.url);
  }, [activeProblem?.catalog?.tier, activeProblem?.id, waitlistConfig.channel, waitlistConfig.url]);

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
        selectedProblemId: activeProblem?.id ?? null,
      });
    }
  }, [activeProblem?.id, onSearchQueryChange, onSelectGuideSection, searchQuery, showGuide]);

  return (
    <div className="learn-page">
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="サイドバーを切り替え">
          <Icon name={sidebarOpen ? 'chevron-left' : 'chevron-right'} />
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
        ) : activeProblem ? (
          <div className="learn-problem-area">
            <div className="learn-actions">
              <button className="guide-start-button" type="button" onClick={() => navigate('/learn')}>
                <span className="ui-label"><Icon name="back" /><span>Learn に戻る</span></span>
              </button>
            </div>
            {activeProblem.catalog && selectedCourse && (
              <section className="learn-course-card" aria-label="現在のコース情報">
                <div className="learn-course-card-header">
                  <div>
                    <p className="learn-course-eyebrow">現在のコース</p>
                    <h3>{selectedCourse.title}</h3>
                  </div>
                  <span className={`learn-course-tier ${activeProblemTier}`}>
                    {activeProblemTier === 'free' ? 'Free' : 'Standard'}
                  </span>
                </div>
                <p className="learn-course-description">{selectedCourse.description}</p>
                <div className="learn-course-stats">
                  <span className="learn-course-stat">第{activeProblem.catalog.courseOrder}問</span>
                  <span className="learn-course-stat">{solvedCourseCount}/{selectedCourseProblems.length} 完了</span>
                  <span className="learn-course-stat">{activeProblem.category}</span>
                </div>
                <p className="learn-course-next">
                  {nextCourseProblem
                    ? nextCourseProblem.id === activeProblem.id
                      ? 'この問題がコースの次の一問です。'
                      : `次のコース問題: ${nextCourseProblem.title}`
                    : 'このコースはすべて完了しています。'}
                </p>
              </section>
            )}
            {COMMERCIAL_FEATURES_ENABLED ? (
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
                    <span className="ui-label"><Icon name="spark" /><span>Standard の案内を見る</span></span>
                  </button>
                  {waitlistConfig.url && (
                    <button
                      type="button"
                      className="pricing-inline-link waitlist-cta-button"
                      onClick={() => handleOpenWaitlist('learn_problem')}
                    >
                      <span className="ui-label"><Icon name="updates" /><span>更新通知を受け取る</span></span>
                    </button>
                  )}
                </div>
              </section>
            ) : (
              <section className="learn-course-card" aria-label="無料公開中のお知らせ">
                <p className="learn-course-eyebrow">現在の公開方針</p>
                <h3>現在は全問題を無料公開中です</h3>
                <p className="learn-course-description">
                  Standard 候補として整理していた問題も含め、当面はすべての学習コンテンツを無料で利用できます。
                </p>
              </section>
            )}
            <ProblemView
              key={activeProblem.id}
              problem={activeProblem}
              isSolved={solvedProblemIds.includes(activeProblem.id)}
              isBookmarked={bookmarkedProblemIds.includes(activeProblem.id)}
              onToggleBookmark={() => onToggleBookmark(activeProblem.id)}
              onShowSolution={onShowSolution}
            />
            <div className="learn-actions">
              <button className="start-coding-button" onClick={handleStartCoding}>
                <span className="ui-label"><Icon name="editor" /><span>エディタで解く</span></span>
              </button>
            </div>
          </div>
        ) : (
          <div className="learn-empty-state">
            <div className="learn-empty-card">
              <h2>問題を選択して練習を始める</h2>
              <p>Learn では、概要を確認してから問題文へ進み、最後にエディタで手を動かします。</p>
              {problemId && !routeProblem && (
                <p>指定された問題が見つからないため、学習トップを表示しています。</p>
              )}
              {nextRecommendedProblem ? (
                <section className="learn-course-card" aria-label="おすすめの練習問題">
                  <div className="learn-course-card-header">
                    <div>
                      <p className="learn-course-eyebrow">おすすめの練習問題</p>
                      <h3>{nextRecommendedProblem.order}. {nextRecommendedProblem.title}</h3>
                    </div>
                      <span className={`learn-course-tier ${nextRecommendedProblemTier}`}>
                        {nextRecommendedProblemTier === 'standard' ? 'Standard' : 'Free'}
                    </span>
                  </div>
                  <p className="learn-course-description">{getProblemSummary(nextRecommendedProblem.description)}</p>
                  <div className="learn-course-stats">
                    <span className="learn-course-stat">{nextRecommendedProblem.category}</span>
                    <span className="learn-course-stat">{DIFFICULTY_LABEL[nextRecommendedProblem.difficulty]}</span>
                    <span className="learn-course-stat">{nextRecommendedProblem.estimatedMinutes}分</span>
                  </div>
                  <div className="welcome-actions">
                    <button
                      className="guide-start-button"
                      type="button"
                      onClick={() => handleSelectProblem(nextRecommendedProblem)}
                    >
                      <span className="ui-label"><Icon name="solution" /><span>この問題の問題文へ</span></span>
                    </button>
                    <button className="start-coding-button" type="button" onClick={handleStartCoding}>
                      <span className="ui-label"><Icon name="editor" /><span>フリーモードで始める</span></span>
                    </button>
                  </div>
                </section>
              ) : (
                <section className="learn-course-card" aria-label="学習完了メッセージ">
                  <p className="learn-course-eyebrow">進捗</p>
                  <h3>全問クリア済みです</h3>
                  <p className="learn-course-description">左の一覧から復習したい問題を選ぶか、構文ガイドで整理し直せます。</p>
                </section>
              )}
              {COMMERCIAL_FEATURES_ENABLED ? (
                <section className="pricing-cta-banner free" aria-label="Standard プランの案内">
                  <div className="pricing-cta-copy">
                    <p className="pricing-cta-eyebrow">Free の次に進む学習導線</p>
                    <h3>Standard の学習拡張を準備中です</h3>
                    <p>
                      Learn トップでは要点整理と次の一問を案内し、より深い中級問題や横断演習は Standard 側に追加する方針です。
                      価格ページでは Free / Standard / Supporter の差分を確認できます。
                    </p>
                    {waitlistConfig.channel === 'github_issue' && waitlistConfig.url && (
                      <p className="waitlist-cta-note">
                        更新通知の仮登録は GitHub issue ベースの暫定導線です。個人情報やメールアドレスは書かないでください。
                      </p>
                    )}
                  </div>
                  <div className="pricing-cta-actions">
                    <button
                      className="pricing-cta-button"
                      type="button"
                      onClick={() => onOpenPricingGuide('learn_empty')}
                    >
                      <span className="ui-label"><Icon name="spark" /><span>Standard の案内を見る</span></span>
                    </button>
                    {waitlistConfig.url && (
                      <button
                        className="pricing-inline-link waitlist-cta-button"
                        type="button"
                        onClick={() => handleOpenWaitlist('learn_empty')}
                      >
                        <span className="ui-label"><Icon name="updates" /><span>更新通知を受け取る</span></span>
                      </button>
                    )}
                  </div>
                </section>
              ) : (
                <section className="learn-course-card" aria-label="無料公開中のお知らせ">
                  <p className="learn-course-eyebrow">現在の公開方針</p>
                  <h3>現在は全問題を無料公開中です</h3>
                  <p className="learn-course-description">
                    問題一覧から選べる全問題を無料で公開し、学習導線はガイドと演習に集中させています。
                  </p>
                </section>
              )}
              <div className="welcome-actions">
                <button className="guide-start-button" type="button" onClick={() => navigate('/problems')}>
                  <span className="ui-label"><Icon name="problem" /><span>問題一覧ページへ</span></span>
                </button>
                <button className="start-coding-button" type="button" onClick={handleOpenGuide}>
                  <span className="ui-label"><Icon name="guide" /><span>構文ガイドを開く</span></span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
