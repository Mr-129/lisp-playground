import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProblemList } from '../components/ProblemList';
import { ProblemView } from '../components/ProblemView';
import { LispGuide } from '../components/LispGuide';
import { Problem } from '../types';

interface LearnPageProps {
  selectedProblem: Problem | null;
  onSelectProblem: (problem: Problem) => void;
  onShowSolution: () => void;
  onNavigateToEditor: () => void;
}

export function LearnPage({ selectedProblem, onSelectProblem, onShowSolution, onNavigateToEditor }: LearnPageProps) {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSelectProblem = useCallback((problem: Problem) => {
    onSelectProblem(problem);
    setShowGuide(false);
  }, [onSelectProblem]);

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
              onClick={() => setShowGuide(true)}
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
          <div className="learn-welcome">
            <div className="welcome-content">
              <h2>λ Lisp Playground へようこそ</h2>
              <p>Common Lisp を対話的に学べる学習環境です。</p>
              <div className="welcome-steps">
                <div className="welcome-step">
                  <span className="step-number">1</span>
                  <div>
                    <strong>構文ガイドを読む</strong>
                    <p>まずは左のサイドバーから「📘 構文ガイド」をクリックして、Lispの基本構文を学びましょう。</p>
                  </div>
                </div>
                <div className="welcome-step">
                  <span className="step-number">2</span>
                  <div>
                    <strong>問題を選ぶ</strong>
                    <p>サイドバーの問題一覧から、難易度に合った問題を選びましょう。</p>
                  </div>
                </div>
                <div className="welcome-step">
                  <span className="step-number">3</span>
                  <div>
                    <strong>コードを書いて実行</strong>
                    <p>「エディタで解く」ボタンでエディタに移動し、コードを書いて実行しましょう。</p>
                  </div>
                </div>
              </div>
              <div className="welcome-actions">
                <button className="guide-start-button" onClick={() => setShowGuide(true)}>
                  📘 構文ガイドを読む
                </button>
                <button className="start-coding-button" onClick={() => navigate('/editor')}>
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
