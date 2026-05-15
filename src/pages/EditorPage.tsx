import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '../components/Editor';
import { OutputPanel } from '../components/OutputPanel';
import { runProblemJudge } from '../judge';
import type { JudgeRunResult } from '../judge';
import { executeLispAsync } from '../worker';
import { trackEvent } from '../utils/analytics';
import { Problem } from '../types';

interface EditorPageProps {
  code: string;
  setCode: (code: string) => void;
  selectedProblem: Problem | null;
  onProblemSolved: (problemId: string) => void;
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
  code, setCode, selectedProblem, onProblemSolved,
  output, setOutput, returnValue, setReturnValue,
  error, setError, isCorrect, setIsCorrect,
}: EditorPageProps) {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [judgeResult, setJudgeResult] = useState<JudgeRunResult | null>(null);

  useEffect(() => {
    setJudgeResult(null);
  }, [selectedProblem?.id]);

  const handleRun = useCallback(async () => {
    if (isRunning) return;

    const mode = selectedProblem ? 'guided' : 'free';

    setIsRunning(true);
    setOutput('');
    setReturnValue('');
    setError(undefined);
    setIsCorrect(null);
    setJudgeResult(null);

    try {
      const result = await executeLispAsync(code);
      let passed: boolean | null = null;

      setOutput(result.output);
      setReturnValue(result.returnValue);
      setError(result.error);

      if (selectedProblem && !result.error) {
        const nextJudgeResult = await runProblemJudge(selectedProblem, code);
        setJudgeResult(nextJudgeResult);

        if (nextJudgeResult) {
          const correct = nextJudgeResult.passed;
          passed = correct;
          setIsCorrect(correct);
          if (correct) {
            onProblemSolved(selectedProblem.id);
          }
        } else {
          setIsCorrect(null);
        }
      } else {
        setJudgeResult(null);
        setIsCorrect(null);
      }

      trackEvent('editor_code_executed', {
        mode,
        problemId: selectedProblem?.id ?? null,
        codeLength: code.length,
        hadError: Boolean(result.error),
        passed,
      });
    } catch (e) {
      setJudgeResult(null);
      setError(e instanceof Error ? e.message : '実行中にエラーが発生しました');

      trackEvent('editor_code_executed', {
        mode,
        problemId: selectedProblem?.id ?? null,
        codeLength: code.length,
        hadError: true,
        passed: null,
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, isRunning, onProblemSolved, selectedProblem, setOutput, setReturnValue, setError, setIsCorrect]);

  return (
    <div className="editor-page">
      <div className="editor-page-header">
        <button className="back-to-learn" onClick={() => navigate('/problems')}>
          ← 問題一覧に戻る
        </button>
        {selectedProblem && (
          <>
            <span className="current-problem-label">
              📝 {selectedProblem.title}
            </span>
            <button
              className="back-to-learn back-to-problem"
              onClick={() => navigate(`/learn/${selectedProblem.id}`)}
            >
              問題文に戻る
            </button>
          </>
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
          judgeResult={judgeResult}
        />
      </div>
    </div>
  );
}
