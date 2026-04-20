import { useState, useRef, useCallback, useEffect } from 'react';
import { executeLispRepl, Environment } from '../interpreter';

interface ReplEntry {
  id: number;
  input: string;
  output: string;
  returnValue: string;
  error?: string;
}

export function ReplPage() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ReplEntry[]>([]);
  const [env, setEnv] = useState<Environment | undefined>(undefined);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const nextId = useRef(1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const result = executeLispRepl(trimmed, env);

    const entry: ReplEntry = {
      id: nextId.current++,
      input: trimmed,
      output: result.output,
      returnValue: result.returnValue,
      error: result.error,
    };

    setHistory(prev => [...prev, entry]);
    setEnv(result.env);
    setInputHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInput('');
  }, [input, env]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'ArrowUp' && !e.shiftKey) {
      if (inputHistory.length === 0) return;
      e.preventDefault();
      const newIndex = historyIndex === -1
        ? inputHistory.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(inputHistory[newIndex]);
    }
    if (e.key === 'ArrowDown' && !e.shiftKey) {
      if (historyIndex === -1) return;
      e.preventDefault();
      if (historyIndex >= inputHistory.length - 1) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(inputHistory[newIndex]);
      }
    }
  }, [handleSubmit, inputHistory, historyIndex]);

  const handleClear = useCallback(() => {
    setHistory([]);
    setEnv(undefined);
    setInputHistory([]);
    setHistoryIndex(-1);
    setInput('');
  }, []);

  return (
    <div className="repl-page">
      <div className="repl-header">
        <h2 className="repl-title">🖥️ REPL</h2>
        <span className="repl-subtitle">対話的 Lisp 実行環境 — 式を入力して Enter で評価</span>
        <button className="repl-clear-button" onClick={handleClear}>
          🗑️ クリア
        </button>
      </div>
      <div className="repl-output" ref={outputRef}>
        {history.length === 0 && (
          <div className="repl-welcome">
            <p>Common Lisp REPL へようこそ！</p>
            <p>式を入力して <kbd>Enter</kbd> で評価します。<kbd>Shift+Enter</kbd> で改行できます。</p>
            <p><kbd>↑</kbd> / <kbd>↓</kbd> で入力履歴を辿れます。</p>
            <p className="repl-welcome-example">
              例: <code>(+ 1 2 3)</code>、<code>(defun square (x) (* x x))</code>
            </p>
          </div>
        )}
        {history.map(entry => (
          <div key={entry.id} className="repl-entry">
            <div className="repl-prompt-line">
              <span className="repl-prompt">CL&gt;</span>
              <pre className="repl-input-text">{entry.input}</pre>
            </div>
            {entry.output && (
              <pre className="repl-output-text">{entry.output}</pre>
            )}
            {entry.error ? (
              <div className="repl-error">⚠ {entry.error}</div>
            ) : (
              <div className="repl-return">→ {entry.returnValue}</div>
            )}
          </div>
        ))}
      </div>
      <div className="repl-input-area">
        <span className="repl-prompt">CL&gt;</span>
        <textarea
          ref={inputRef}
          className="repl-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Lisp 式を入力..."
          rows={1}
          aria-label="REPL 入力"
        />
        <button
          className="repl-submit-button"
          onClick={handleSubmit}
          disabled={!input.trim()}
          aria-label="式を評価"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
