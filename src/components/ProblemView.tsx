import { Problem } from '../types';
import { useState } from 'react';

interface ProblemViewProps {
  problem: Problem;
  onShowSolution: () => void;
}

export function ProblemView({ problem, onShowSolution }: ProblemViewProps) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="problem-view">
      <div className="problem-header">
        <h2>{problem.title}</h2>
      </div>
      <div className="problem-description">
        <SimpleMarkdown text={problem.description} />
      </div>
      <div className="problem-actions">
        {problem.hint && (
          <button
            className="hint-button"
            onClick={() => setShowHint(!showHint)}
          >
            💡 {showHint ? 'ヒントを隠す' : 'ヒントを表示'}
          </button>
        )}
        <button
          className="solution-button"
          onClick={() => {
            setShowSolution(!showSolution);
            if (!showSolution) onShowSolution();
          }}
        >
          📖 {showSolution ? '解答を隠す' : '解答を表示'}
        </button>
      </div>
      {showHint && problem.hint && (
        <div className="hint-box">
          <strong>ヒント:</strong> {problem.hint}
        </div>
      )}
      {showSolution && (
        <div className="solution-box">
          <strong>解答例:</strong>
          <pre>{problem.solution}</pre>
        </div>
      )}
    </div>
  );
}

// Simple markdown renderer (handles basic markdown subset)
function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`}>
          {listItems.map((item, i) => <li key={i}>{formatInline(item)}</li>)}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(<pre key={`code-${i}`} className="md-code">{codeLines.join('\n')}</pre>);
        codeLines = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h4 key={`h3-${i}`}>{formatInline(line.slice(4))}</h4>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h3 key={`h2-${i}`}>{formatInline(line.slice(3))}</h3>);
    } else if (line.startsWith('- ')) {
      listItems.push(line.slice(2));
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      elements.push(<p key={`p-${i}`}>{formatInline(line)}</p>);
    }
  }
  flushList();

  return <>{elements}</>;
}

function formatInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  const regex = /(\*\*(.+?)\*\*)|(`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<code key={match.index} className="md-inline-code">{match[4]}</code>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}
