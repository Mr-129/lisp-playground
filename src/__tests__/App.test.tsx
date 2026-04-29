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
  LearnPage: ({
    onShowSolution,
    onNavigateToEditor,
  }: {
    onShowSolution: () => void;
    onNavigateToEditor: () => void;
  }) => (
    <div>
      <div>learn-page</div>
      <button type="button" onClick={onShowSolution}>show-solution</button>
      <button type="button" onClick={onNavigateToEditor}>navigate-to-editor</button>
    </div>
  ),
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

  it('同じ問題を2回正解しても solved ID を重複保存しない', async () => {
    localStorage.setItem(STORAGE_KEY_PROBLEM, VALID_PROBLEM_ID);

    render(<App />);

    const solvedButton = screen.getByText('solved');
    fireEvent.click(solvedButton);
    fireEvent.click(solvedButton);

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

  it('保存済みの問題IDが不正なとき selectedProblem を null にする', async () => {
    localStorage.setItem(STORAGE_KEY_PROBLEM, 'missing-problem-id');

    render(<App />);

    expect(screen.getByTestId('selected-problem-id')).toHaveTextContent('none');

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEY_PROBLEM)).toBeNull();
    });
  });

  it('問題未選択で show-solution が呼ばれてもコードを変更しない', async () => {
    window.location.hash = '#/learn';

    render(<App />);

    fireEvent.click(screen.getByText('show-solution'));

    fireEvent.click(screen.getByText('navigate-to-editor'));

    await waitFor(() => {
      expect(window.location.hash).toBe('#/learn');
    });

    expect(localStorage.getItem('lisp-playground-code')).toContain('; Lisp Playground へようこそ！');
  });

  it('スキップリンクで現在のルートを維持したままメインコンテンツへ移動できる', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: 'メインコンテンツへスキップ' }));

    expect(document.activeElement).toBe(screen.getByRole('main'));
    expect(window.location.hash).toBe('#/editor');
  });
});