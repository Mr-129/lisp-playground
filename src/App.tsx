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
} from './utils/storage';
import { problems } from './data/problems';
import './App.css';

const VALID_PROBLEM_IDS = new Set(problems.map((problem) => problem.id));

function getInitialSolvedProblemIds(): string[] {
  return Array.from(
    new Set(loadSolvedProblemIds().filter((problemId) => VALID_PROBLEM_IDS.has(problemId)))
  );
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
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(() => {
    const savedId = loadProblemId();
    if (savedId) {
      return problems.find(p => p.id === savedId) ?? null;
    }
    return null;
  });
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>(getInitialSolvedProblemIds);

  // Persist code to localStorage on change
  useEffect(() => {
    saveCode(code);
  }, [code]);

  // Persist selected problem ID
  useEffect(() => {
    saveProblemId(selectedProblem?.id ?? null);
  }, [selectedProblem]);

  useEffect(() => {
    saveSolvedProblemIds(solvedProblemIds);
  }, [solvedProblemIds]);

  const handleSelectProblem = useCallback((problem: Problem) => {
    setSelectedProblem(problem);
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
    setSolvedProblemIds((previousIds) => {
      if (previousIds.includes(problemId)) {
        return previousIds;
      }

      return [...previousIds, problemId];
    });
  }, []);

  const handleSkipToMain = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  }, []);

  return (
    <HashRouter>
      <div className="app">
        <a className="skip-link" href="#main-content" onClick={handleSkipToMain}>
          メインコンテンツへスキップ
        </a>
        <Header />
        <main id="main-content" className="app-body" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/problems"
              element={
                <ProblemsPage
                  selectedProblemId={selectedProblem?.id ?? null}
                  onSelectProblem={handleSelectProblem}
                />
              }
            />
            <Route
              path="/learn"
              element={
                <LearnPage
                  selectedProblem={selectedProblem}
                  onSelectProblem={handleSelectProblem}
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
                  onSelectProblem={handleSelectProblem}
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
      </div>
    </HashRouter>
  );
}

export default App;
