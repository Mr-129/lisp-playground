import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { OutputPanel } from './components/OutputPanel';
import { ProblemList } from './components/ProblemList';
import { ProblemView } from './components/ProblemView';
import { executeLisp } from './interpreter';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleRun = useCallback(() => {
    const result = executeLisp(code);
    setOutput(result.output);
    setReturnValue(result.returnValue);
    setError(result.error);

    // Judge if problem is selected
    if (selectedProblem && !result.error) {
      let correct = true;
      if (selectedProblem.expectedOutput !== undefined) {
        correct = correct && result.output === selectedProblem.expectedOutput;
      }
      if (selectedProblem.expectedReturnValue !== undefined) {
        correct = correct && result.returnValue === selectedProblem.expectedReturnValue;
      }
      setIsCorrect(correct);
    } else {
      setIsCorrect(null);
    }
  }, [code, selectedProblem]);

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

  const handleFreeMode = useCallback(() => {
    setSelectedProblem(null);
    setCode(DEFAULT_CODE);
    setOutput('');
    setReturnValue('');
    setError(undefined);
    setIsCorrect(null);
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="サイドバーを切り替え">
            {sidebarOpen ? '◀' : '▶'}
          </button>
          {sidebarOpen && (
            <>
              <button className="free-mode-button" onClick={handleFreeMode} aria-label="フリーモードに切り替え">
                🖊️ フリーモード
              </button>
              <ProblemList
                selectedId={selectedProblem?.id ?? null}
                onSelect={handleSelectProblem}
              />
            </>
          )}
        </div>
        <div className="main-content">
          {selectedProblem && (
            <ProblemView
              key={selectedProblem.id}
              problem={selectedProblem}
              onShowSolution={handleShowSolution}
            />
          )}
          <div className="editor-output-container">
            <Editor code={code} onChange={setCode} onRun={handleRun} />
            <OutputPanel
              output={output}
              returnValue={returnValue}
              error={error}
              isCorrect={isCorrect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
