import { useState, useRef, useCallback, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { executeLispRepl, Environment } from '../interpreter';
import {
  clearReplSession,
  loadReplSession,
  saveReplSession,
  type ReplHistoryEntry,
  type ReplSessionSnapshot,
} from '../utils/storage';
import { trackEvent } from '../utils/analytics';

type ReplEntry = ReplHistoryEntry;

const EMPTY_REPL_SESSION: ReplSessionSnapshot = {
  entries: [],
  inputHistory: [],
  draftInput: '',
};

function getNextEntryId(entries: ReplEntry[]): number {
  return entries.reduce((maxId, entry) => Math.max(maxId, entry.id), 0) + 1;
}

function restoreEnvironment(entries: ReplEntry[]): Environment | undefined {
  let restoredEnv: Environment | undefined;

  for (const entry of entries) {
    const restoredResult = executeLispRepl(entry.input, restoredEnv);
    restoredEnv = restoredResult.env;
  }

  return restoredEnv;
}

export function ReplPage() {
  const [restoredSession] = useState(() => loadReplSession() ?? EMPTY_REPL_SESSION);
  const [input, setInput] = useState(() => restoredSession.draftInput);
  const [history, setHistory] = useState<ReplEntry[]>(() => restoredSession.entries);
  const [env, setEnv] = useState<Environment | undefined>(() => restoreEnvironment(restoredSession.entries));
  const [inputHistory, setInputHistory] = useState<string[]>(() => restoredSession.inputHistory);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const nextId = useRef(getNextEntryId(restoredSession.entries));
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

  useEffect(() => {
    saveReplSession({
      entries: history,
      inputHistory,
      draftInput: input,
    });
  }, [history, inputHistory, input]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const result = executeLispRepl(trimmed, env);

    trackEvent('repl_command_executed', {
      inputLength: trimmed.length,
      historySize: history.length + 1,
      hadError: Boolean(result.error),
      outputLength: result.output.length,
    });

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
  }, [input, env, history.length]);

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
    clearReplSession();
    setHistory([]);
    setEnv(undefined);
    setInputHistory([]);
    setHistoryIndex(-1);
    setInput('');
    nextId.current = 1;
  }, []);

  return (
    <div className="repl-page">
      <div className="repl-header">
        <h2 className="repl-title"><span className="ui-label"><Icon name="terminal" /><span>REPL</span></span></h2>
        <span className="repl-subtitle">対話的 Lisp 実行環境 — 式を入力して Enter で評価</span>
        <button className="repl-clear-button" onClick={handleClear}>
          <span className="ui-label ui-label-compact"><Icon name="clear" /><span>クリア</span></span>
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
              <div className="repl-error"><Icon name="warning" className="ui-icon-small" /> {entry.error}</div>
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
          <Icon name="play" className="ui-icon-small" />
        </button>
      </div>
    </div>
  );
}
