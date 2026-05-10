import { useState, useCallback, useEffect, type MouseEvent } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProblemsPage } from './pages/ProblemsPage';
import { LearnPage } from './pages/LearnPage';
import { EditorPage } from './pages/EditorPage';
import { ReplPage } from './pages/ReplPage';
import { Problem } from './types';
import {
  saveCode,
  loadCode,
  saveProblemId,
  loadProblemId,
  saveSolvedProblemIds,
  loadSolvedProblemIds,
  saveRecentlyViewedProblemIds,
  loadRecentlyViewedProblemIds,
  saveBookmarkedProblemIds,
  loadBookmarkedProblemIds,
} from './utils/storage';
import { initializeAnalytics, trackEvent } from './utils/analytics';
import { problems } from './data/problems';
import './App.css';

type PricingGuidePlacement = 'header' | 'learn_empty' | 'learn_problem';

const VALID_PROBLEM_IDS = new Set(problems.map((problem) => problem.id));
const PROBLEM_BY_ID = new Map(problems.map((problem) => [problem.id, problem]));

function normalizeProblemIds(problemIds: string[]): string[] {
  return Array.from(new Set(problemIds.filter((problemId) => VALID_PROBLEM_IDS.has(problemId))));
}

function prependProblemId(problemIds: string[], problemId: string): string[] {
  return [problemId, ...problemIds.filter((id) => id !== problemId)];
}

function getProblemTier(problem: Problem): 'free' | 'standard' | 'unknown' {
  return problem.catalog?.tier ?? 'unknown';
}

function getInitialSelectedProblem(): Problem | null {
  const savedId = loadProblemId();
  if (!savedId) {
    return null;
  }

  return PROBLEM_BY_ID.get(savedId) ?? null;
}

function getInitialSolvedProblemIds(): string[] {
  return normalizeProblemIds(loadSolvedProblemIds());
}

function getInitialRecentlyViewedProblemIds(): string[] {
  return normalizeProblemIds(loadRecentlyViewedProblemIds());
}

function getInitialBookmarkedProblemIds(): string[] {
  return normalizeProblemIds(loadBookmarkedProblemIds());
}

const DEFAULT_CODE = `; Lisp Playground へようこそ！
; ここにCommon Lispのコードを入力して実行できます。

; 基本的な計算
(print (+ 1 2 3))

; 関数定義
(defun greet (name)
  (format nil "Hello, ~A!" name))

(print (greet "World"))

; クロージャ
(defun make-counter ()
  (let ((count 0))
    (lambda ()
      (setq count (+ count 1))
      count)))

(defvar *counter* (make-counter))
(print (funcall *counter*))
(print (funcall *counter*))
(print (funcall *counter*))
`;

function App() {
  const [code, setCode] = useState(() => loadCode() ?? DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [returnValue, setReturnValue] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(getInitialSelectedProblem);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>(getInitialSolvedProblemIds);
  const [recentlyViewedProblemIds, setRecentlyViewedProblemIds] = useState<string[]>(
    getInitialRecentlyViewedProblemIds
  );
  const [bookmarkedProblemIds, setBookmarkedProblemIds] = useState<string[]>(
    getInitialBookmarkedProblemIds
  );
  const [learningSearchQuery, setLearningSearchQuery] = useState('');
  const [selectedGuideSectionId, setSelectedGuideSectionId] = useState<string | null>(null);
  const [pricingGuidePlacement, setPricingGuidePlacement] = useState<PricingGuidePlacement | null>(null);

  // Persist code to localStorage on change
  useEffect(() => {
    saveCode(code);
  }, [code]);

  useEffect(() => {
    initializeAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID);
  }, []);

  // Persist selected problem ID
  useEffect(() => {
    saveProblemId(selectedProblem?.id ?? null);
  }, [selectedProblem]);

  useEffect(() => {
    if (!selectedProblem) {
      return;
    }

    setRecentlyViewedProblemIds((previousIds) => {
      const nextIds = prependProblemId(previousIds, selectedProblem.id);
      const isUnchanged =
        nextIds.length === previousIds.length &&
        nextIds.every((problemId, index) => problemId === previousIds[index]);

      return isUnchanged ? previousIds : nextIds;
    });
  }, [selectedProblem]);

  useEffect(() => {
    saveSolvedProblemIds(solvedProblemIds);
  }, [solvedProblemIds]);

  useEffect(() => {
    saveRecentlyViewedProblemIds(recentlyViewedProblemIds);
  }, [recentlyViewedProblemIds]);

  useEffect(() => {
    saveBookmarkedProblemIds(bookmarkedProblemIds);
  }, [bookmarkedProblemIds]);

  const handleSelectProblem = useCallback((problem: Problem) => {
    trackEvent('problem_viewed', {
      problemId: problem.id,
      category: problem.category,
      difficulty: problem.difficulty,
      tier: getProblemTier(problem),
    });
    setSelectedProblem(problem);
    setSelectedGuideSectionId(null);
    setCode(problem.initialCode);
    setOutput('');
    setReturnValue('');
    setError(undefined);
    setIsCorrect(null);
  }, []);

  const handleShowSolution = useCallback(() => {
    if (selectedProblem) {
      setCode(selectedProblem.solution);
    }
  }, [selectedProblem]);

  const handleNavigateToEditor = useCallback(() => {
    // Reset output when navigating to editor
    setOutput('');
    setReturnValue('');
    setError(undefined);
    setIsCorrect(null);
  }, []);

  const handleProblemSolved = useCallback((problemId: string) => {
    if (solvedProblemIds.includes(problemId)) {
      return;
    }

    const solvedProblem = PROBLEM_BY_ID.get(problemId);
    if (solvedProblem) {
      trackEvent('problem_solved', {
        problemId: solvedProblem.id,
        category: solvedProblem.category,
        difficulty: solvedProblem.difficulty,
        tier: getProblemTier(solvedProblem),
      });
    }

    setSolvedProblemIds((previousIds) => [...previousIds, problemId]);
  }, [solvedProblemIds]);

  const handleToggleBookmark = useCallback((problemId: string) => {
    if (!VALID_PROBLEM_IDS.has(problemId)) {
      return;
    }

    setBookmarkedProblemIds((previousIds) => {
      if (previousIds.includes(problemId)) {
        return previousIds.filter((id) => id !== problemId);
      }

      return [problemId, ...previousIds];
    });
  }, []);

  const handleSkipToMain = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  }, []);

  const handleOpenPricingGuide = useCallback((placement: PricingGuidePlacement) => {
    trackEvent('pricing_cta_clicked', {
      placement,
      selectedProblemId: selectedProblem?.id ?? null,
      selectedProblemTier: selectedProblem ? getProblemTier(selectedProblem) : 'unknown',
    });
    setPricingGuidePlacement(placement);
  }, [selectedProblem]);

  const handleClosePricingGuide = useCallback(() => {
    setPricingGuidePlacement(null);
  }, []);

  useEffect(() => {
    if (!pricingGuidePlacement) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPricingGuidePlacement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pricingGuidePlacement]);

  return (
    <HashRouter>
      <div className="app">
        <a className="skip-link" href="#main-content" onClick={handleSkipToMain}>
          メインコンテンツへスキップ
        </a>
        <Header onOpenPricingGuide={() => handleOpenPricingGuide('header')} />
        <main id="main-content" className="app-body" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/problems"
              element={
                <ProblemsPage
                  selectedProblemId={selectedProblem?.id ?? null}
                  solvedProblemIds={solvedProblemIds}
                  onSelectProblem={handleSelectProblem}
                />
              }
            />
            <Route
              path="/learn"
              element={
                <LearnPage
                  selectedProblem={selectedProblem}
                  solvedProblemIds={solvedProblemIds}
                  recentProblemIds={recentlyViewedProblemIds}
                  bookmarkedProblemIds={bookmarkedProblemIds}
                  searchQuery={learningSearchQuery}
                  selectedGuideSectionId={selectedGuideSectionId}
                  onSelectProblem={handleSelectProblem}
                  onSearchQueryChange={setLearningSearchQuery}
                  onSelectGuideSection={setSelectedGuideSectionId}
                  onToggleBookmark={handleToggleBookmark}
                  onOpenPricingGuide={handleOpenPricingGuide}
                  onShowSolution={handleShowSolution}
                  onNavigateToEditor={handleNavigateToEditor}
                />
              }
            />
            <Route
              path="/guide"
              element={
                <LearnPage
                  selectedProblem={selectedProblem}
                  solvedProblemIds={solvedProblemIds}
                  recentProblemIds={recentlyViewedProblemIds}
                  bookmarkedProblemIds={bookmarkedProblemIds}
                  searchQuery={learningSearchQuery}
                  selectedGuideSectionId={selectedGuideSectionId}
                  onSelectProblem={handleSelectProblem}
                  onSearchQueryChange={setLearningSearchQuery}
                  onSelectGuideSection={setSelectedGuideSectionId}
                  onToggleBookmark={handleToggleBookmark}
                  onOpenPricingGuide={handleOpenPricingGuide}
                  onShowSolution={handleShowSolution}
                  onNavigateToEditor={handleNavigateToEditor}
                  initialView="guide"
                />
              }
            />
            <Route
              path="/editor"
              element={
                <EditorPage
                  code={code}
                  setCode={setCode}
                  selectedProblem={selectedProblem}
                  onProblemSolved={handleProblemSolved}
                  output={output}
                  setOutput={setOutput}
                  returnValue={returnValue}
                  setReturnValue={setReturnValue}
                  error={error}
                  setError={setError}
                  isCorrect={isCorrect}
                  setIsCorrect={setIsCorrect}
                />
              }
            />
            <Route
              path="/repl"
              element={<ReplPage />}
            />
          </Routes>
        </main>
        {pricingGuidePlacement && (
          <div className="pricing-guide-backdrop" onClick={handleClosePricingGuide}>
            <section
              className="pricing-guide-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="pricing-guide-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="pricing-guide-header">
                <div>
                  <p className="pricing-guide-eyebrow">Pricing Guide Preview</p>
                  <h2 id="pricing-guide-title">Free / Standard の案内</h2>
                </div>
                <button
                  type="button"
                  className="pricing-guide-close"
                  onClick={handleClosePricingGuide}
                  aria-label="Standard プラン案内を閉じる"
                >
                  ×
                </button>
              </div>
              <p className="pricing-guide-summary">
                {pricingGuidePlacement === 'header'
                  ? 'サイト全体の拡張方針として、入門は Free に残しつつ、より深い演習を Standard にまとめる予定です。'
                  : pricingGuidePlacement === 'learn_empty'
                    ? '学習開始前でも、Free の先にどんな拡張を置くかが分かるように先行案内を表示しています。'
                    : '今見ている学習導線の先に、より深い問題と詳しい解説を Standard として追加する予定です。'}
              </p>
              <div className="pricing-guide-grid">
                <section className="pricing-guide-plan free">
                  <p className="pricing-guide-plan-label">Free</p>
                  <h3>入門の継続無料</h3>
                  <ul>
                    <li>基本構文と入門コース</li>
                    <li>ガイド、エディタ、REPL</li>
                    <li>学習の最初の 1 周目</li>
                  </ul>
                </section>
                <section className="pricing-guide-plan standard">
                  <p className="pricing-guide-plan-label">Standard</p>
                  <h3>中級入口を深くする層</h3>
                  <ul>
                    <li>Standard 候補問題の解放</li>
                    <li>コース横断の演習と詳しい解説</li>
                    <li>価格ページで差分を明示予定</li>
                  </ul>
                </section>
              </div>
              <p className="pricing-guide-note">
                価格そのものは T-303 で静的ページとして公開予定です。現段階では、どの導線から関心が集まるかを GA4 で計測します。
              </p>
              <div className="pricing-guide-actions">
                <button type="button" className="pricing-guide-primary" onClick={handleClosePricingGuide}>
                  学習に戻る
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </HashRouter>
  );
}

export default App;
