import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProblemList } from '../components/ProblemList';
import { ProblemView } from '../components/ProblemView';
import { LispGuide, filterGuideSections } from '../components/LispGuide';
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
  onShowSolution,
  onNavigateToEditor,
  initialView = 'problem',
}: LearnPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showGuide, setShowGuide] = useState(initialView === 'guide');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const hasActiveSearch = searchQuery.trim().length > 0;
  const guideSearchResults = useMemo(
    () => (hasActiveSearch ? filterGuideSections(searchQuery) : []),
    [hasActiveSearch, searchQuery]
  );

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
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  onSearchQueryChange(nextQuery);
                  if (!nextQuery.trim()) {
                    onSelectGuideSection(null);
                  }
                }}
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
                <button className="start-coding-button" type="button" onClick={() => navigate('/editor')}>
                  🖊️ フリーモードで始める
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
