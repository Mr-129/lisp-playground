// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { problems } from '../data/problems';

vi.mock('../components/Header', () => ({
  Header: () => <div>header</div>,
}));

vi.mock('../pages/HomePage', () => ({
  HomePage: () => <div>home-page</div>,
}));

vi.mock('../pages/ProblemsPage', () => ({
  ProblemsPage: () => <div>problems-page</div>,
}));

vi.mock('../pages/LearnPage', () => ({
  LearnPage: () => <div>learn-page</div>,
}));

vi.mock('../pages/ReplPage', () => ({
  ReplPage: () => <div>repl-page</div>,
}));

vi.mock('../pages/EditorPage', () => ({
  EditorPage: ({
    selectedProblem,
    onProblemSolved,
  }: {
    selectedProblem: { id: string } | null;
    onProblemSolved: (problemId: string) => void;
  }) => (
    <div>
      <div data-testid="selected-problem-id">{selectedProblem?.id ?? 'none'}</div>
      <button
        type="button"
        onClick={() => {
          if (selectedProblem) {
            onProblemSolved(selectedProblem.id);
          }
        }}
      >
        solved
      </button>
    </div>
  ),
}));

const STORAGE_KEY_PROBLEM = 'lisp-playground-problem-id';
const STORAGE_KEY_SOLVED_PROBLEMS = 'lisp-playground-solved-problem-ids';
const VALID_PROBLEM_ID = problems[0].id;

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '#/editor';
  });

  it('ルート「/」でホーム画面を表示する', () => {
    window.location.hash = '#/';

    render(<App />);

    expect(screen.getByText('home-page')).toBeInTheDocument();
  });

  it('ルート「/problems」で問題一覧ページを表示する', () => {
    window.location.hash = '#/problems';

    render(<App />);

    expect(screen.getByText('problems-page')).toBeInTheDocument();
  });

  it('正解済み問題IDを localStorage に保存する', async () => {
    localStorage.setItem(STORAGE_KEY_PROBLEM, VALID_PROBLEM_ID);

    render(<App />);

    fireEvent.click(screen.getByText('solved'));

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEY_SOLVED_PROBLEMS)).toBe(JSON.stringify([VALID_PROBLEM_ID]));
    });
  });

  it('読み込み時に存在しない問題IDを除外して保存し直す', async () => {
    localStorage.setItem(
      STORAGE_KEY_SOLVED_PROBLEMS,
      JSON.stringify([VALID_PROBLEM_ID, 'missing-problem-id', VALID_PROBLEM_ID])
    );

    render(<App />);

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEY_SOLVED_PROBLEMS)).toBe(JSON.stringify([VALID_PROBLEM_ID]));
    });
  });

  it('スキップリンクで現在のルートを維持したままメインコンテンツへ移動できる', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: 'メインコンテンツへスキップ' }));

    expect(document.activeElement).toBe(screen.getByRole('main'));
    expect(window.location.hash).toBe('#/editor');
  });
});