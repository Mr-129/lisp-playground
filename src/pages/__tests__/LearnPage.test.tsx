// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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

const anotherProblem: Problem = {
  id: 'test-02',
  title: '別の問題',
  category: 'テスト',
  difficulty: 'beginner',
  description: '## 別問題\n\n別の問題です。',
  hint: '別のヒント',
  initialCode: '; 別テスト',
  solution: '(+ 3 4)',
};

function renderLearnPage(
  props: Partial<Parameters<typeof LearnPage>[0]> = {},
  initialPath = '/learn'
) {
  const defaultProps = {
    selectedProblem: null,
    onSelectProblem: vi.fn(),
    onShowSolution: vi.fn(),
    onNavigateToEditor: vi.fn(),
    ...props,
  };
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/learn" element={<LearnPage {...defaultProps} />} />
        <Route path="/guide" element={<LearnPage {...defaultProps} initialView="guide" />} />
        <Route path="/problems" element={<div>problems-page</div>} />
        <Route path="/editor" element={<div>editor-page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('LearnPage', () => {
  it('問題未選択時に案内カードを表示する', () => {
    renderLearnPage();
    expect(screen.getByText('問題を選択してください')).toBeInTheDocument();
  });

  it('問題一覧ページへの導線を表示する', () => {
    renderLearnPage();
    expect(screen.getByText('📚 問題一覧ページへ')).toBeInTheDocument();
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

  it('guide ルートでは初期表示でガイドを表示する', () => {
    renderLearnPage({}, '/guide');
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

  it('問題を切り替えるとヒントと解答の表示状態がリセットされる', () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/learn']}>
        <Routes>
          <Route
            path="/learn"
            element={
              <LearnPage
                selectedProblem={mockProblem}
                onSelectProblem={vi.fn()}
                onShowSolution={vi.fn()}
                onNavigateToEditor={vi.fn()}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('💡 ヒントを表示'));
    fireEvent.click(screen.getByText('📖 解答を表示'));

    expect(screen.getByText('ヒント')).toBeInTheDocument();
    expect(screen.getByText('(+ 1 2)')).toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={['/learn']}>
        <Routes>
          <Route
            path="/learn"
            element={
              <LearnPage
                selectedProblem={anotherProblem}
                onSelectProblem={vi.fn()}
                onShowSolution={vi.fn()}
                onNavigateToEditor={vi.fn()}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('別の問題')).toBeInTheDocument();
    expect(screen.queryByText('ヒント')).not.toBeInTheDocument();
    expect(screen.queryByText('(+ 1 2)')).not.toBeInTheDocument();
  });
});
