import type { JudgeCaseResult, JudgeMismatch, JudgeRunResult } from '../judge';

interface OutputPanelProps {
  output: string;
  returnValue: string;
  error?: string;
  isCorrect?: boolean | null;
  isRunning?: boolean;
  judgeResult?: JudgeRunResult | null;
}

function getMismatchFieldLabel(field: JudgeMismatch['field']): string {
  switch (field) {
    case 'output':
      return '出力';
    case 'returnValue':
      return '戻り値';
    case 'error':
      return 'エラー';
    default:
      return field;
  }
}

function getCaseLabel(cases: JudgeCaseResult[], caseResult: JudgeCaseResult, index: number): string {
  if (caseResult.visibility === 'visible') {
    return caseResult.label;
  }

  const hiddenIndex = cases
    .slice(0, index + 1)
    .filter((currentCase) => currentCase.visibility === 'hidden')
    .length;

  return `非公開ケース ${hiddenIndex}`;
}

function formatMismatchValue(value: string | undefined): string {
  if (value === undefined || value === '') {
    return '(なし)';
  }

  return value;
}

export function OutputPanel({ output, returnValue, error, isCorrect, isRunning, judgeResult }: OutputPanelProps) {
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
        {isRunning ? (
          <div className="output-placeholder">
            ⏳ 実行中...
          </div>
        ) : error ? (
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
            {!output && !returnValue && !judgeResult && (
              <div className="output-placeholder">
                コードを入力して「実行」ボタンを押してください
              </div>
            )}
            {judgeResult && (
              <div className="judge-details">
                <div className="judge-summary" aria-label="採点サマリー">
                  <div className="judge-summary-item">
                    <span className="judge-summary-label">公開ケース</span>
                    <span className="judge-summary-value">
                      {judgeResult.summary.visiblePassed}/{judgeResult.summary.visibleTotal}
                    </span>
                  </div>
                  {judgeResult.summary.hiddenTotal > 0 && (
                    <div className="judge-summary-item">
                      <span className="judge-summary-label">非公開ケース</span>
                      <span className="judge-summary-value">
                        {judgeResult.summary.hiddenPassed}/{judgeResult.summary.hiddenTotal}
                      </span>
                    </div>
                  )}
                </div>
                <div className="judge-case-list">
                  {judgeResult.cases.map((caseResult, index) => (
                    <section
                      key={caseResult.id}
                      className={`judge-case ${caseResult.passed ? 'passed' : 'failed'}`}
                    >
                      <div className="judge-case-header">
                        <div>
                          <div className="judge-case-label">
                            {getCaseLabel(judgeResult.cases, caseResult, index)}
                          </div>
                          <div className="judge-case-meta">
                            {caseResult.visibility === 'visible' ? '公開ケース' : '非公開ケース'}
                          </div>
                        </div>
                        <span className={`judge-case-status ${caseResult.passed ? 'passed' : 'failed'}`}>
                          {caseResult.passed ? 'OK' : 'NG'}
                        </span>
                      </div>
                      {!caseResult.passed && caseResult.visibility === 'hidden' && (
                        <p className="judge-case-note">非公開ケースのため詳細は表示しません。</p>
                      )}
                      {!caseResult.passed && caseResult.visibility === 'visible' && (
                        <ul className="judge-mismatch-list">
                          {caseResult.mismatches.map((mismatch, mismatchIndex) => (
                            <li key={`${caseResult.id}-${mismatch.field}-${mismatchIndex}`} className="judge-mismatch-item">
                              <div className="judge-mismatch-field">{getMismatchFieldLabel(mismatch.field)}</div>
                              <div className="judge-mismatch-values">
                                <div>
                                  <div className="judge-mismatch-label">期待値</div>
                                  <pre className="judge-mismatch-value">
                                    {formatMismatchValue(mismatch.expected.value)}
                                  </pre>
                                </div>
                                <div>
                                  <div className="judge-mismatch-label">実際の値</div>
                                  <pre className="judge-mismatch-value">
                                    {formatMismatchValue(mismatch.actual)}
                                  </pre>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
