// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GlossaryPage } from '../GlossaryPage';

function renderGlossaryPage() {
  return render(
    <MemoryRouter initialEntries={['/glossary']}>
      <Routes>
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/guide" element={<div>guide-page</div>} />
        <Route path="/problems" element={<div>problems-page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('GlossaryPage', () => {
  it('用語集タイトルと代表的な用語を表示する', () => {
    renderGlossaryPage();

    expect(screen.getByText('Lisp の用語解説')).toBeInTheDocument();
    expect(screen.getByText('S式')).toBeInTheDocument();
    expect(screen.getByText('クロージャ')).toBeInTheDocument();
  });

  it('検索で用語を絞り込める', () => {
    renderGlossaryPage();

    fireEvent.change(screen.getByLabelText('用語を検索'), {
      target: { value: 'funcall' },
    });

    expect(screen.getByText('funcall')).toBeInTheDocument();
    expect(screen.queryByText('S式')).not.toBeInTheDocument();
  });

  it('構文ガイドボタンからガイドへ移動できる', () => {
    renderGlossaryPage();

    fireEvent.click(screen.getByText('構文ガイドへ'));

    expect(screen.getByText('guide-page')).toBeInTheDocument();
  });
});