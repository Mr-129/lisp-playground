import { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { LearnPage } from './pages/LearnPage';
import { EditorPage } from './pages/EditorPage';
import { Problem } from './types';
import './App.css';

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
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [returnValue, setReturnValue] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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

  return (
    <HashRouter>
      <div className="app">
        <Header />
        <div className="app-body">
          <Routes>
            <Route
              path="/"
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
              path="/editor"
              element={
                <EditorPage
                  code={code}
                  setCode={setCode}
                  selectedProblem={selectedProblem}
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
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
