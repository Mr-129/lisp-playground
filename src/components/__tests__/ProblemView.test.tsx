// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProblemView } from '../ProblemView';
import { Problem } from '../../types';

const mockProblem: Problem = {
  id: 'test-01',
  title: 'テスト問題',
  category: 'テスト',
  difficulty: 'beginner',
  description: '## テスト\n\nこれは**テスト問題**です。\n\n- 項目1\n- 項目2\n\n```lisp\n(+ 1 2)\n```',
  hint: 'これはヒントです',
  initialCode: '; テストコード',
  expectedOutput: '3\n',
  solution: '(print (+ 1 2))',
};

const mockProblemNoHint: Problem = {
  ...mockProblem,
  id: 'test-02',
  hint: undefined,
};

const mockProblemWithInlineCode: Problem = {
  ...mockProblem,
  id: 'test-03',
  description: 'インラインコード `(+ 1 2)` を含む説明です。',
};

const mockProblemInlineAtEdges: Problem = {
  ...mockProblem,
  id: 'test-04',
  description: '`(+ 1 2)` と **強調**',
};

const mockProblemWithSubHeading: Problem = {
  ...mockProblem,
  id: 'test-05',
  description: '### 小見出し',
};

const mockProblemInlineOnly: Problem = {
  ...mockProblem,
  id: 'test-06',
  description: '`(+ 1 2)`',
};

describe('ProblemView', () => {
  it('問題タイトルを表示する', () => {
    render(<ProblemView problem={mockProblem} onShowSolution={() => {}} />);
    expect(screen.getByRole('heading', { level: 2, name: 'テスト問題' })).toBeInTheDocument();
  });

  it('マークダウンの見出しをレンダリングする', () => {
    render(<ProblemView problem={mockProblem} onShowSolution={() => {}} />);
    // h3 in markdown becomes h4 in SimpleMarkdown renderer
    expect(screen.getByRole('heading', { level: 3, name: 'テスト' })).toBeInTheDocument();
  });

  it('### 見出しを h4 としてレンダリングする', () => {
    render(<ProblemView problem={mockProblemWithSubHeading} onShowSolution={() => {}} />);

    expect(screen.getByRole('heading', { level: 4, name: '小見出し' })).toBeInTheDocument();
  });

  it('太字テキストをレンダリングする', () => {
    render(<ProblemView problem={mockProblem} onShowSolution={() => {}} />);
    const boldEl = screen.getByText('テスト問題', { selector: 'strong' });
    expect(boldEl).toBeInTheDocument();
  });

  it('ヒントボタンをクリックするとヒントが表示される', () => {
    render(<ProblemView problem={mockProblem} onShowSolution={() => {}} />);
    
    expect(screen.queryByText('これはヒントです')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText('💡 ヒントを表示'));
    expect(screen.getByText('これはヒントです')).toBeInTheDocument();
  });

  it('ヒントボタンを再度クリックするとヒントを隠す', () => {
    render(<ProblemView problem={mockProblem} onShowSolution={() => {}} />);

    fireEvent.click(screen.getByText('💡 ヒントを表示'));
    expect(screen.getByText('これはヒントです')).toBeInTheDocument();

    fireEvent.click(screen.getByText('💡 ヒントを隠す'));
    expect(screen.queryByText('これはヒントです')).not.toBeInTheDocument();
  });

  it('解答ボタンをクリックすると解答が表示される', () => {
    const onShowSolution = vi.fn();
    render(<ProblemView problem={mockProblem} onShowSolution={onShowSolution} />);
    
    fireEvent.click(screen.getByText('📖 解答を表示'));
    expect(screen.getByText('(print (+ 1 2))')).toBeInTheDocument();
    expect(onShowSolution).toHaveBeenCalled();
  });

  it('解答ボタンを再度クリックすると解答を隠し callback は初回だけ呼ぶ', () => {
    const onShowSolution = vi.fn();
    render(<ProblemView problem={mockProblem} onShowSolution={onShowSolution} />);

    fireEvent.click(screen.getByText('📖 解答を表示'));
    expect(screen.getByText('(print (+ 1 2))')).toBeInTheDocument();
    expect(onShowSolution).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('📖 解答を隠す'));
    expect(screen.queryByText('(print (+ 1 2))')).not.toBeInTheDocument();
    expect(onShowSolution).toHaveBeenCalledTimes(1);
  });

  it('ヒントがない場合、ヒントボタンを表示しない', () => {
    render(<ProblemView problem={mockProblemNoHint} onShowSolution={() => {}} />);
    expect(screen.queryByText('💡 ヒントを表示')).not.toBeInTheDocument();
  });

  it('リスト項目をレンダリングする', () => {
    render(<ProblemView problem={mockProblem} onShowSolution={() => {}} />);
    expect(screen.getByText('項目1')).toBeInTheDocument();
    expect(screen.getByText('項目2')).toBeInTheDocument();
  });

  it('コードブロックをレンダリングする', () => {
    render(<ProblemView problem={mockProblem} onShowSolution={() => {}} />);
    expect(screen.getByText('(+ 1 2)')).toBeInTheDocument();
  });

  it('インラインコードをレンダリングする', () => {
    render(<ProblemView problem={mockProblemWithInlineCode} onShowSolution={() => {}} />);

    const inlineCode = screen.getByText('(+ 1 2)', { selector: 'code' });
    expect(inlineCode).toBeInTheDocument();
    expect(inlineCode).toHaveClass('md-inline-code');
    expect(screen.getByText(/インラインコード/)).toBeInTheDocument();
  });

  it('先頭がインラインコードで末尾が強調の説明をレンダリングする', () => {
    render(<ProblemView problem={mockProblemInlineAtEdges} onShowSolution={() => {}} />);

    expect(screen.getByText('(+ 1 2)', { selector: 'code' })).toBeInTheDocument();
    expect(screen.getByText('強調', { selector: 'strong' })).toBeInTheDocument();
  });

  it('インラインコードだけの説明をレンダリングする', () => {
    render(<ProblemView problem={mockProblemInlineOnly} onShowSolution={() => {}} />);

    expect(screen.getByText('(+ 1 2)', { selector: 'code' })).toBeInTheDocument();
  });
});
