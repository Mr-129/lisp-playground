// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LearnPage } from '../LearnPage';
import { Problem } from '../../types';

const mockProblem: Problem = {
  id: 'test-01',
  title: 'テスト問題',
  category: 'テスト',
  difficulty: 'beginner',
  description: '## テスト\n\nテスト問題の説明です。',
  hint: 'ヒント',
  initialCode: '; テスト',
  solution: '(+ 1 2)',
};

function renderLearnPage(props: Partial<Parameters<typeof LearnPage>[0]> = {}) {
  const defaultProps = {
    selectedProblem: null,
    onSelectProblem: vi.fn(),
    onShowSolution: vi.fn(),
    onNavigateToEditor: vi.fn(),
    ...props,
  };
  return render(
    <MemoryRouter>
      <LearnPage {...defaultProps} />
    </MemoryRouter>
  );
}

describe('LearnPage', () => {
  it('ウェルカムメッセージを表示する', () => {
    renderLearnPage();
    expect(screen.getByText(/Lisp Playground へようこそ/)).toBeInTheDocument();
  });

  it('学習ステップを表示する', () => {
    renderLearnPage();
    expect(screen.getByText('構文ガイドを読む')).toBeInTheDocument();
    expect(screen.getByText('問題を選ぶ')).toBeInTheDocument();
    expect(screen.getByText('コードを書いて実行')).toBeInTheDocument();
  });

  it('構文ガイドボタンがある', () => {
    renderLearnPage();
    expect(screen.getByText('📘 構文ガイドを読む')).toBeInTheDocument();
  });

  it('フリーモードボタンがある', () => {
    renderLearnPage();
    expect(screen.getByText('🖊️ フリーモードで始める')).toBeInTheDocument();
  });

  it('サイドバーに構文ガイドボタンがある', () => {
    renderLearnPage();
    expect(screen.getByLabelText('構文ガイドを表示')).toBeInTheDocument();
  });

  it('構文ガイドボタンをクリックするとガイドが表示される', () => {
    renderLearnPage();
    fireEvent.click(screen.getByLabelText('構文ガイドを表示'));
    expect(screen.getByText(/Common Lisp 基本構文ガイド/)).toBeInTheDocument();
  });

  it('問題が選択されているとき問題ビューを表示する', () => {
    renderLearnPage({ selectedProblem: mockProblem });
    expect(screen.getByText('テスト問題')).toBeInTheDocument();
    expect(screen.getByText('🖊️ エディタで解く →')).toBeInTheDocument();
  });

  it('サイドバートグルボタンが動作する', () => {
    renderLearnPage();
    const toggleBtn = screen.getByLabelText('サイドバーを切り替え');
    expect(toggleBtn).toHaveTextContent('◀');
    
    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveTextContent('▶');
  });
});
