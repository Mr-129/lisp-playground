// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from '../HomePage';

function renderHomePage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guide" element={<div>guide-page</div>} />
        <Route path="/problems" element={<div>problems-page</div>} />
        <Route path="/editor" element={<div>editor-page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('HomePage', () => {
  it('ウェルカムメッセージを表示する', () => {
    renderHomePage();
    expect(screen.getByText(/Lisp Playground へようこそ/)).toBeInTheDocument();
  });

  it('問題一覧ボタンから問題一覧ページへ移動できる', () => {
    renderHomePage();
    fireEvent.click(screen.getByText('📚 問題一覧を見る'));
    expect(screen.getByText('problems-page')).toBeInTheDocument();
  });

  it('構文ガイドボタンから構文ガイドへ移動できる', () => {
    renderHomePage();
    fireEvent.click(screen.getByText('📘 構文ガイドを読む'));
    expect(screen.getByText('guide-page')).toBeInTheDocument();
  });
});