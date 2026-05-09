// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { problems } from '../data/problems';

const { selectableProblem } = vi.hoisted(() => ({
  selectableProblem: {
    id: 'basic-02',
    order: 2,
    title: 'モック問題',
    category: 'モック',
    difficulty: 'beginner' as const,
    description: 'モックの問題です',
    initialCode: '; mock initial code',
    estimatedMinutes: 5,
    learningGoals: ['mock-goal'],
    solution: '(print 2)',
  },
}));

vi.mock('../components/Header', () => ({
  Header: () => <div>header</div>,
}));

vi.mock('../pages/HomePage', () => ({
  HomePage: () => <div>home-page</div>,
}));

vi.mock('../pages/ProblemsPage', () => ({
  ProblemsPage: ({
    onSelectProblem,
  }: {
    onSelectProblem: (problem: typeof selectableProblem) => void;
  }) => (
    <div>
      <div>problems-page</div>
      <button type="button" onClick={() => onSelectProblem(selectableProblem)}>
        select-problem
      </button>
    </div>
  ),
}));

vi.mock('../pages/LearnPage', () => ({
  LearnPage: ({
    selectedProblem,
    recentProblemIds = [],
    bookmarkedProblemIds = [],
    onSelectProblem,
    onToggleBookmark,
    onShowSolution,
    onNavigateToEditor,
  }: {
    selectedProblem: { id: string } | null;
    recentProblemIds?: string[];
    bookmarkedProblemIds?: string[];
    onSelectProblem?: (problem: typeof selectableProblem) => void;
    onToggleBookmark?: (problemId: string) => void;
    onShowSolution: () => void;
    onNavigateToEditor: () => void;
  }) => (
    <div>
      <div>learn-page</div>
      <div data-testid="learn-selected-problem-id">{selectedProblem?.id ?? 'none'}</div>
      <div data-testid="learn-recent-problem-ids">{recentProblemIds.join(',')}</div>
      <div data-testid="learn-bookmarked-problem-ids">{bookmarkedProblemIds.join(',')}</div>
      <button type="button" onClick={onShowSolution}>show-solution</button>
      <button type="button" onClick={onNavigateToEditor}>navigate-to-editor</button>
      <button type="button" onClick={() => onSelectProblem?.(selectableProblem)}>select-problem-from-learn</button>
      <button
        type="button"
        onClick={() => {
          if (selectedProblem) {
            onToggleBookmark?.(selectedProblem.id);
          }
        }}
      >
        toggle-bookmark
      </button>
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
const STORAGE_KEY_RECENTLY_VIEWED_PROBLEMS = 'lisp-playground-recently-viewed-problem-ids';
const STORAGE_KEY_BOOKMARKED_PROBLEMS = 'lisp-playground-bookmarked-problem-ids';
const VALID_PROBLEM_ID = problems[0].id;
const SECOND_VALID_PROBLEM_ID = selectableProblem.id;

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

  it('選択した問題を最近見た問題として localStorage に保存する', async () => {
    window.location.hash = '#/problems';

    render(<App />);

    fireEvent.click(screen.getByText('select-problem'));

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEY_RECENTLY_VIEWED_PROBLEMS)).toBe(
        JSON.stringify([SECOND_VALID_PROBLEM_ID])
      );
    });
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

  it('読み込み時に存在しない recent と bookmark の問題IDを除外して保存し直す', async () => {
    localStorage.setItem(
      STORAGE_KEY_RECENTLY_VIEWED_PROBLEMS,
      JSON.stringify([VALID_PROBLEM_ID, 'missing-problem-id', VALID_PROBLEM_ID])
    );
    localStorage.setItem(
      STORAGE_KEY_BOOKMARKED_PROBLEMS,
      JSON.stringify(['missing-problem-id', SECOND_VALID_PROBLEM_ID, SECOND_VALID_PROBLEM_ID])
    );

    render(<App />);

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEY_RECENTLY_VIEWED_PROBLEMS)).toBe(
        JSON.stringify([VALID_PROBLEM_ID])
      );
      expect(localStorage.getItem(STORAGE_KEY_BOOKMARKED_PROBLEMS)).toBe(
        JSON.stringify([SECOND_VALID_PROBLEM_ID])
      );
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

  it('保存済みの問題IDを最近見た問題の先頭へ復元する', async () => {
    localStorage.setItem(STORAGE_KEY_PROBLEM, VALID_PROBLEM_ID);
    localStorage.setItem(
      STORAGE_KEY_RECENTLY_VIEWED_PROBLEMS,
      JSON.stringify([SECOND_VALID_PROBLEM_ID])
    );
    window.location.hash = '#/learn';

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('learn-recent-problem-ids')).toHaveTextContent(
        `${VALID_PROBLEM_ID},${SECOND_VALID_PROBLEM_ID}`
      );
    });
  });

  it('ブックマークを切り替えて localStorage に保存する', async () => {
    localStorage.setItem(STORAGE_KEY_PROBLEM, VALID_PROBLEM_ID);
    window.location.hash = '#/learn';

    render(<App />);

    fireEvent.click(screen.getByText('toggle-bookmark'));

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEY_BOOKMARKED_PROBLEMS)).toBe(
        JSON.stringify([VALID_PROBLEM_ID])
      );
    });

    fireEvent.click(screen.getByText('toggle-bookmark'));

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEY_BOOKMARKED_PROBLEMS)).toBe(JSON.stringify([]));
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