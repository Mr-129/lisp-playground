interface OutputPanelProps {
  output: string;
  returnValue: string;
  error?: string;
  isCorrect?: boolean | null;
}

export function OutputPanel({ output, returnValue, error, isCorrect }: OutputPanelProps) {
  return (
    <div className="output-container">
      <div className="output-toolbar">
        <span className="output-label">実行結果</span>
        {isCorrect !== null && isCorrect !== undefined && (
          <span className={`judge-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? '✓ 正解！' : '✗ 不正解'}
          </span>
        )}
      </div>
      <div className="output-body">
        {error ? (
          <div className="output-error">
            <span className="error-icon">⚠</span>
            <span>{error}</span>
          </div>
        ) : (
          <>
            {output && (
              <div className="output-section">
                <div className="output-section-label">出力:</div>
                <pre className="output-text">{output}</pre>
              </div>
            )}
            {returnValue && (
              <div className="output-section">
                <div className="output-section-label">戻り値:</div>
                <pre className="output-return">{returnValue}</pre>
              </div>
            )}
            {!output && !returnValue && (
              <div className="output-placeholder">
                コードを入力して「実行」ボタンを押してください
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
