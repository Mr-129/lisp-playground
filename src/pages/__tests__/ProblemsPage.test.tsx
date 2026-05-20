// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ProblemsPage } from '../ProblemsPage';
import { problems } from '../../data/problems';

function LocationDisplay() {
  const location = useLocation();

  return <div data-testid="location-path">{location.pathname}</div>;
}

const BASIC_PROBLEM = problems.find((problem) => problem.id === 'basic-01');

function renderProblemsPage(selectedProblemId: string | null = null) {
  const onSelectProblem = vi.fn();

  const view = render(
    <MemoryRouter initialEntries={['/problems']}>
      <LocationDisplay />
      <Routes>
        <Route
          path="/problems"
          element={<ProblemsPage selectedProblemId={selectedProblemId} solvedProblemIds={[]} onSelectProblem={onSelectProblem} />}
        />
        <Route path="/learn/:problemId" element={<div>learn-page</div>} />
        <Route path="/guide" element={<div>guide-page</div>} />
        <Route path="/editor" element={<div>editor-page</div>} />
      </Routes>
    </MemoryRouter>
  );

  return { ...view, onSelectProblem };
}

describe('ProblemsPage', () => {
  it('問題一覧ページのタイトルを表示する', () => {
    renderProblemsPage();
    expect(screen.getByText('問題一覧ページ')).toBeInTheDocument();
  });

  it('問題文を見るボタンで問題詳細へ進める', () => {
    const { onSelectProblem } = renderProblemsPage();

    fireEvent.click(screen.getAllByText('問題文を見る')[0]);

    expect(onSelectProblem).toHaveBeenCalledTimes(1);
    expect(screen.getByText('learn-page')).toBeInTheDocument();
    expect(screen.getByTestId('location-path')).toHaveTextContent(`/learn/${BASIC_PROBLEM?.slug}`);
  });

  it('選択中の問題に現在の問題ラベルと selected クラスを付ける', () => {
    renderProblemsPage('basic-02');

    const selectedCard = screen.getByRole('heading', { level: 4, name: /変数の定義/ }).closest('article');

    expect(selectedCard).toHaveClass('selected');
    expect(within(selectedCard as HTMLElement).getByText('現在の問題')).toBeInTheDocument();
  });

  it('構文ガイドボタンでガイド画面へ移動できる', () => {
    renderProblemsPage();

    fireEvent.click(screen.getByText('構文ガイドへ'));

    expect(screen.getByText('guide-page')).toBeInTheDocument();
  });

  it('フリーモードボタンでエディタ画面へ移動できる', () => {
    renderProblemsPage();

    fireEvent.click(screen.getByText('フリーモード'));

    expect(screen.getByText('editor-page')).toBeInTheDocument();
  });

  it('問題カードに説明要約を表示しコードブロックは含めない', () => {
    renderProblemsPage();

    const problemCard = screen.getByRole('heading', { level: 4, name: /初めてのS式/ }).closest('article');

    expect(problemCard).toHaveTextContent('S式（S-expression）');
    expect(problemCard).not.toHaveTextContent('(+ 1 2)');
  });
});