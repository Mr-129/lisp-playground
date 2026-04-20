import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '../components/Editor';
import { OutputPanel } from '../components/OutputPanel';
import { executeLispAsync } from '../worker';
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
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput('');
    setReturnValue('');
    setError(undefined);
    setIsCorrect(null);

    try {
      const result = await executeLispAsync(code);
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
    } catch (e) {
      setError(e instanceof Error ? e.message : '実行中にエラーが発生しました');
    } finally {
      setIsRunning(false);
    }
  }, [code, isRunning, selectedProblem, setOutput, setReturnValue, setError, setIsCorrect]);

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
        <Editor code={code} onChange={setCode} onRun={handleRun} isRunning={isRunning} />
        <OutputPanel
          output={output}
          returnValue={returnValue}
          error={error}
          isCorrect={isCorrect}
          isRunning={isRunning}
        />
      </div>
    </div>
  );
}
