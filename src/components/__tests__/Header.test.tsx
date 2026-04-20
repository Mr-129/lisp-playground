// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../Header';

function renderWithRouter(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Header />
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('タイトルを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('Lisp Playground')).toBeInTheDocument();
  });

  it('サブタイトルを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('Common Lisp 学習環境')).toBeInTheDocument();
  });

  it('ロゴ（λ）を表示する', () => {
    renderWithRouter();
    expect(screen.getByText('λ')).toBeInTheDocument();
  });

  it('ナビゲーションボタンを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('📚 学習')).toBeInTheDocument();
    expect(screen.getByText('🖊️ エディタ')).toBeInTheDocument();
  });

  it('「/」パスで学習ボタンがactiveになる', () => {
    renderWithRouter('/');
    const learnButton = screen.getByText('📚 学習');
    expect(learnButton).toHaveClass('active');
    const editorButton = screen.getByText('🖊️ エディタ');
    expect(editorButton).not.toHaveClass('active');
  });

  it('「/editor」パスでエディタボタンがactiveになる', () => {
    renderWithRouter('/editor');
    const editorButton = screen.getByText('🖊️ エディタ');
    expect(editorButton).toHaveClass('active');
    const learnButton = screen.getByText('📚 学習');
    expect(learnButton).not.toHaveClass('active');
  });

  it('GitHubリンクを表示する', () => {
    renderWithRouter();
    const link = screen.getByLabelText('GitHub リポジトリ');
    expect(link).toHaveAttribute('href', 'https://github.com/Mr-129/lisp-playground');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
