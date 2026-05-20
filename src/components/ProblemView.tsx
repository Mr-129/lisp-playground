import { Problem } from '../types';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icon } from './Icon';
import { getPublicProblemTier } from '../utils/siteMode';

interface ProblemViewProps {
  problem: Problem;
  isSolved?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onShowSolution: () => void;
}

const DIFFICULTY_LABEL: Record<Problem['difficulty'], string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
};

export function ProblemView({
  problem,
  isSolved = false,
  isBookmarked = false,
  onToggleBookmark = () => {},
  onShowSolution,
}: ProblemViewProps) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const tier = getPublicProblemTier(problem);
  const isStandardPreview = tier === 'standard';

  return (
    <div className="problem-view">
      <div className="problem-header">
        <div className="problem-meta-row">
          <span className="problem-meta-chip">No. {problem.order}</span>
          <span className="problem-meta-chip">{problem.category}</span>
          <span className="problem-meta-chip">{DIFFICULTY_LABEL[problem.difficulty]}</span>
          <span className="problem-meta-chip">{problem.estimatedMinutes}分</span>
          <span className={`problem-meta-chip tier ${tier}`}>
            {isStandardPreview ? <span className="ui-label ui-label-compact"><Icon name="lock" className="ui-icon-small" /><span>Standard候補</span></span> : 'Free'}
          </span>
          {isSolved && <span className="problem-meta-chip solved">クリア済み</span>}
        </div>
        <h2>{problem.title}</h2>
      </div>
      {isStandardPreview && (
        <div className="problem-access-note standard-preview" role="note">
          <strong>有料候補コンテンツ:</strong> この問題は将来の Standard 向け候補です。現段階では preview 表示のみで、学習や解答の操作は制限していません。
        </div>
      )}
      {problem.learningGoals.length > 0 && (
        <div className="problem-goals">
          {problem.learningGoals.map((goal) => (
            <span key={goal} className="problem-goal-chip">{goal}</span>
          ))}
        </div>
      )}
      <div className="problem-description">
        <MarkdownDescription text={problem.description} />
      </div>
      <div className="problem-actions">
        <button
          type="button"
          className={`bookmark-button ${isBookmarked ? 'active' : ''}`}
          aria-pressed={isBookmarked}
          onClick={onToggleBookmark}
        >
          <span className="ui-label ui-label-compact"><Icon name="bookmark" className="ui-icon-small" /><span>{isBookmarked ? 'ブックマーク済み' : 'ブックマーク'}</span></span>
        </button>
        {problem.hint && (
          <button
            type="button"
            className="hint-button"
            onClick={() => setShowHint(!showHint)}
          >
            <span className="ui-label ui-label-compact"><Icon name="hint" className="ui-icon-small" /><span>{showHint ? 'ヒントを隠す' : 'ヒントを表示'}</span></span>
          </button>
        )}
        <button
          type="button"
          className="solution-button"
          onClick={() => {
            setShowSolution(!showSolution);
            if (!showSolution) onShowSolution();
          }}
        >
          <span className="ui-label ui-label-compact"><Icon name="solution" className="ui-icon-small" /><span>{showSolution ? '解答を隠す' : '解答を表示'}</span></span>
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

function MarkdownDescription({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => <h3>{children}</h3>,
        h3: ({ children }) => <h4>{children}</h4>,
        code: ({ children, className, node: _node, ...props }) => {
          const content = Array.isArray(children) ? children.join('') : String(children ?? '');
          const isBlock = /language-/.test(className ?? '') || content.includes('\n');

          if (isBlock) {
            return (
              <pre className="md-code">
                <code className={className} {...props}>{content.replace(/\n$/, '')}</code>
              </pre>
            );
          }

          return <code className="md-inline-code" {...props}>{children}</code>;
        },
        pre: ({ children }) => <>{children}</>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
