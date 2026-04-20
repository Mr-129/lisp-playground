import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '../components/Editor';
import { OutputPanel } from '../components/OutputPanel';
import { executeLisp } from '../interpreter';
import { Problem } from '../types';

interface EditorPageProps {
  code: string;
  setCode: (code: string) => void;
  selectedProblem: Problem | null;
  output: string;
  setOutput: (output: string) => void;
  returnValue: string;
  setReturnValue: (returnValue: string) => void;
  error: string | undefined;
  setError: (error: string | undefined) => void;
  isCorrect: boolean | null;
  setIsCorrect: (isCorrect: boolean | null) => void;
}

export function EditorPage({
  code, setCode, selectedProblem,
  output, setOutput, returnValue, setReturnValue,
  error, setError, isCorrect, setIsCorrect,
}: EditorPageProps) {
  const navigate = useNavigate();

  const handleRun = useCallback(() => {
    const result = executeLisp(code);
    setOutput(result.output);
    setReturnValue(result.returnValue);
    setError(result.error);

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
  }, [code, selectedProblem, setOutput, setReturnValue, setError, setIsCorrect]);

  return (
    <div className="editor-page">
      <div className="editor-page-header">
        <button className="back-to-learn" onClick={() => navigate('/')}>
          ← 問題一覧に戻る
        </button>
        {selectedProblem && (
          <span className="current-problem-label">
            📝 {selectedProblem.title}
          </span>
        )}
        {!selectedProblem && (
          <span className="current-problem-label">
            🖊️ フリーモード
          </span>
        )}
      </div>
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
  );
}
