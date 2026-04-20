import { useCallback, useState, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { lispLanguage } from '../editor/lisp-language';

interface EditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  isRunning?: boolean;
}

export function Editor({ code, onChange, onRun, isRunning }: EditorProps) {
  const [fontSize] = useState(14);
  const extensions = useMemo(() => [lispLanguage], []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
    }
  }, [onRun]);

  return (
    <div className="editor-container" onKeyDown={handleKeyDown}>
      <div className="editor-toolbar">
        <span className="editor-label">エディタ</span>
        <div className="editor-actions">
          <span className="shortcut-hint">Ctrl+Enter で実行</span>
          <button className="run-button" onClick={onRun} disabled={isRunning} aria-label="コードを実行">
            {isRunning ? '⏳ 実行中...' : '▶ 実行'}
          </button>
        </div>
      </div>
      <div className="editor-body">
        <CodeMirror
          value={code}
          height="100%"
          theme={oneDark}
          extensions={extensions}
          onChange={onChange}
          style={{ fontSize: `${fontSize}px` }}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: false,
            highlightActiveLine: true,
            indentOnInput: true,
          }}
        />
      </div>
    </div>
  );
}
