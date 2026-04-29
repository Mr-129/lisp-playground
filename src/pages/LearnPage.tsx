import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProblemList } from '../components/ProblemList';
import { ProblemView } from '../components/ProblemView';
import { LispGuide } from '../components/LispGuide';
import { Problem } from '../types';

interface LearnPageProps {
  selectedProblem: Problem | null;
  onSelectProblem: (problem: Problem) => void;
  onShowSolution: () => void;
  onNavigateToEditor: () => void;
  initialView?: 'problem' | 'guide';
}

export function LearnPage({
  selectedProblem,
  onSelectProblem,
  onShowSolution,
  onNavigateToEditor,
  initialView = 'problem',
}: LearnPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showGuide, setShowGuide] = useState(initialView === 'guide');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setShowGuide(initialView === 'guide');
  }, [initialView]);

  const handleSelectProblem = useCallback((problem: Problem) => {
    onSelectProblem(problem);
    setShowGuide(false);
    if (location.pathname === '/guide') {
      navigate('/learn');
    }
  }, [location.pathname, navigate, onSelectProblem]);

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
            <button
              className={`guide-mode-button ${showGuide ? 'active' : ''}`}
              onClick={() => {
                setShowGuide(true);
                navigate('/guide');
              }}
              aria-label="構文ガイドを表示"
            >
              📘 構文ガイド
            </button>
            <ProblemList
              selectedId={selectedProblem?.id ?? null}
              onSelect={handleSelectProblem}
            />
          </>
        )}
      </div>
      <div className="learn-main">
        {showGuide ? (
          <LispGuide />
        ) : selectedProblem ? (
          <div className="learn-problem-area">
            <ProblemView
              key={selectedProblem.id}
              problem={selectedProblem}
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
