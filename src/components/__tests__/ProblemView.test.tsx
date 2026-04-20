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

  it('解答ボタンをクリックすると解答が表示される', () => {
    const onShowSolution = vi.fn();
    render(<ProblemView problem={mockProblem} onShowSolution={onShowSolution} />);
    
    fireEvent.click(screen.getByText('📖 解答を表示'));
    expect(screen.getByText('(print (+ 1 2))')).toBeInTheDocument();
    expect(onShowSolution).toHaveBeenCalled();
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
});
