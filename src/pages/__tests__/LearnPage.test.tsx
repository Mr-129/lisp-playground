// @vitest-environment jsdom
import { useState } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { LearnPage } from '../LearnPage';
import { problems } from '../../data/problems';
import { Problem } from '../../types';

const mockProblem: Problem = {
  id: 'test-01',
  order: 1,
  title: 'テスト問題',
  category: 'テスト',
  difficulty: 'beginner',
  description: '## テスト\n\nテスト問題の説明です。',
  hint: 'ヒント',
  initialCode: '; テスト',
  estimatedMinutes: 5,
  learningGoals: ['test-goal'],
  solution: '(+ 1 2)',
};

const anotherProblem: Problem = {
  id: 'test-02',
  order: 2,
  title: '別の問題',
  category: 'テスト',
  difficulty: 'beginner',
  description: '## 別問題\n\n別の問題です。',
  hint: '別のヒント',
  initialCode: '; 別テスト',
  estimatedMinutes: 7,
  learningGoals: ['another-goal'],
  solution: '(+ 3 4)',
};

const firstCourseProblem = problems.find((problem) => problem.catalog?.courseId === 'intro-core') as Problem;

function LocationDisplay() {
  const location = useLocation();

  return <div data-testid="location-path">{location.pathname}</div>;
}

function renderLearnPage(
  props: Partial<Parameters<typeof LearnPage>[0]> = {},
  initialPath = '/learn'
) {
  const defaultProps = {
    selectedProblem: null,
    solvedProblemIds: [],
    searchQuery: '',
    selectedGuideSectionId: null,
    onSelectProblem: vi.fn(),
    onSearchQueryChange: vi.fn(),
    onSelectGuideSection: vi.fn(),
    onShowSolution: vi.fn(),
    onNavigateToEditor: vi.fn(),
    ...props,
  };
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <LocationDisplay />
      <Routes>
        <Route path="/learn" element={<LearnPage {...defaultProps} />} />
        <Route path="/guide" element={<LearnPage {...defaultProps} initialView="guide" />} />
        <Route path="/problems" element={<div>problems-page</div>} />
        <Route path="/editor" element={<div>editor-page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function renderStatefulLearnPage(initialPath = '/guide') {
  const onSelectProblem = vi.fn();
  const onNavigateToEditor = vi.fn();

  function LearnPageHarness({ initialView = 'problem' }: { initialView?: 'problem' | 'guide' }) {
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGuideSectionId, setSelectedGuideSectionId] = useState<string | null>(null);

    return (
      <LearnPage
        selectedProblem={selectedProblem}
        solvedProblemIds={[]}
        searchQuery={searchQuery}
        selectedGuideSectionId={selectedGuideSectionId}
        onSelectProblem={(problem) => {
          onSelectProblem(problem);
          setSelectedProblem(problem);
        }}
        onSearchQueryChange={setSearchQuery}
        onSelectGuideSection={setSelectedGuideSectionId}
        onShowSolution={vi.fn()}
        onNavigateToEditor={onNavigateToEditor}
        initialView={initialView}
      />
    );
  }

  const view = render(
    <MemoryRouter initialEntries={[initialPath]}>
      <LocationDisplay />
      <Routes>
        <Route path="/learn" element={<LearnPageHarness />} />
        <Route path="/guide" element={<LearnPageHarness initialView="guide" />} />
        <Route path="/problems" element={<div>problems-page</div>} />
        <Route path="/editor" element={<div>editor-page</div>} />
      </Routes>
    </MemoryRouter>
  );

  return { ...view, onSelectProblem, onNavigateToEditor };
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

  it('検索入力を表示する', () => {
    renderLearnPage();
    expect(screen.getByLabelText('問題とガイドを検索')).toBeInTheDocument();
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

  it('コース情報を持つ問題では現在のコースカードを表示する', () => {
    renderLearnPage({ selectedProblem: firstCourseProblem });

    const courseCard = screen.getByLabelText('現在のコース情報');

    expect(within(courseCard).getByRole('heading', { name: '入門コース' })).toBeInTheDocument();
    expect(within(courseCard).getByText('Free')).toBeInTheDocument();
    expect(within(courseCard).getByText(/第1問/)).toBeInTheDocument();
    expect(within(courseCard).getByText('この問題がコースの次の一問です。')).toBeInTheDocument();
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
                solvedProblemIds={[]}
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
                solvedProblemIds={[]}
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

  it('guide ルートで問題を選ぶと learn へ遷移し問題ビューを表示する', () => {
    const { onSelectProblem } = renderStatefulLearnPage('/guide');

    fireEvent.click(screen.getByRole('button', { name: /初めてのS式/ }));

    expect(onSelectProblem).toHaveBeenCalledWith(expect.objectContaining({ id: 'basic-01' }));
    expect(screen.getByTestId('location-path')).toHaveTextContent('/learn');
    expect(screen.getAllByText(/初めてのS式/).length).toBeGreaterThan(0);
    expect(screen.getByText('🖊️ エディタで解く →')).toBeInTheDocument();
  });

  it('問題ビューのエディタボタンで editor へ遷移しコールバックを呼ぶ', () => {
    const onNavigateToEditor = vi.fn();

    renderLearnPage({ selectedProblem: mockProblem, onNavigateToEditor });

    fireEvent.click(screen.getByText('🖊️ エディタで解く →'));

    expect(onNavigateToEditor).toHaveBeenCalledTimes(1);
    expect(screen.getByText('editor-page')).toBeInTheDocument();
    expect(screen.getByTestId('location-path')).toHaveTextContent('/editor');
  });

  it('空状態の問題一覧ボタンで problems へ遷移する', () => {
    renderLearnPage();

    fireEvent.click(screen.getByText('📚 問題一覧ページへ'));

    expect(screen.getByText('problems-page')).toBeInTheDocument();
    expect(screen.getByTestId('location-path')).toHaveTextContent('/problems');
  });

  it('空状態のフリーモードボタンで editor へ遷移する', () => {
    const onNavigateToEditor = vi.fn();

    renderLearnPage({ onNavigateToEditor });

    fireEvent.click(screen.getByText('🖊️ フリーモードで始める'));

    expect(onNavigateToEditor).toHaveBeenCalledTimes(1);
    expect(screen.getByText('editor-page')).toBeInTheDocument();
    expect(screen.getByTestId('location-path')).toHaveTextContent('/editor');
  });

  it('検索入力で問題一覧を絞り込める', () => {
    const onSearchQueryChange = vi.fn();

    renderLearnPage({ onSearchQueryChange });

    fireEvent.change(screen.getByLabelText('問題とガイドを検索'), {
      target: { value: '初めてのS式' },
    });

    expect(onSearchQueryChange).toHaveBeenCalledWith('初めてのS式');
  });

  it('ガイド検索結果から guide へ遷移し、検索語を維持したまま対象セクションを表示する', () => {
    renderStatefulLearnPage('/learn');

    fireEvent.change(screen.getByLabelText('問題とガイドを検索'), {
      target: { value: 'mapcar' },
    });
    fireEvent.click(screen.getByRole('button', { name: '高階関数' }));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/guide');
    expect(screen.getByLabelText('問題とガイドを検索')).toHaveValue('mapcar');
    expect(screen.getByRole('heading', { name: '高階関数' })).toBeInTheDocument();
    expect(screen.queryByText('Lispとは')).not.toBeInTheDocument();
  });
});
