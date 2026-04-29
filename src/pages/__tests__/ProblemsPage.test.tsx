// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProblemsPage } from '../ProblemsPage';

function renderProblemsPage() {
  const onSelectProblem = vi.fn();

  const view = render(
    <MemoryRouter initialEntries={['/problems']}>
      <Routes>
        <Route
          path="/problems"
          element={<ProblemsPage selectedProblemId={null} onSelectProblem={onSelectProblem} />}
        />
        <Route path="/learn" element={<div>learn-page</div>} />
      </Routes>
    </MemoryRouter>
  );

  return { ...view, onSelectProblem };
}

describe('ProblemsPage', () => {
  it('問題一覧ページのタイトルを表示する', () => {
    renderProblemsPage();
    expect(screen.getByText('📚 問題一覧ページ')).toBeInTheDocument();
  });

  it('問題文を見るボタンで問題詳細へ進める', () => {
    const { onSelectProblem } = renderProblemsPage();

    fireEvent.click(screen.getAllByText('問題文を見る')[0]);

    expect(onSelectProblem).toHaveBeenCalledTimes(1);
    expect(screen.getByText('learn-page')).toBeInTheDocument();
  });
});