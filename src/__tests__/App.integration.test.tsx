// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from '../App';
import { problems } from '../data/problems';

vi.mock('../components/Header', () => ({
  Header: () => <div>header</div>,
}));

vi.mock('../pages/EditorPage', () => ({
  EditorPage: ({
    code,
    output,
    returnValue,
    error,
    isCorrect,
  }: {
    code: string;
    output: string;
    returnValue: string;
    error?: string;
    isCorrect: boolean | null;
  }) => (
    <div>
      <div>editor-page</div>
      <div data-testid="editor-code">{code}</div>
      <div data-testid="editor-output">{output}</div>
      <div data-testid="editor-return-value">{returnValue}</div>
      <div data-testid="editor-error">{error ?? 'none'}</div>
      <div data-testid="editor-is-correct">{isCorrect === null ? 'null' : String(isCorrect)}</div>
    </div>
  ),
}));

vi.mock('../pages/ReplPage', () => ({
  ReplPage: () => <div>repl-page</div>,
}));

const STORAGE_KEY_PROBLEM = 'lisp-playground-problem-id';
const BASIC_PROBLEM = problems.find((problem) => problem.id === 'basic-01');

describe('App integration', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '#/problems';
  });

  it('保存済みの問題IDを ProblemsPage の選択状態として復元する', async () => {
    localStorage.setItem(STORAGE_KEY_PROBLEM, 'basic-02');

    render(<App />);

    const selectedCardTitle = await screen.findByRole('heading', { level: 4, name: '変数の定義' });
    const selectedCard = selectedCardTitle.closest('article');

    expect(selectedCard).toHaveClass('selected');
    expect(within(selectedCard as HTMLElement).getByText('現在の問題')).toBeInTheDocument();
  });

  it('問題一覧から問題詳細へ進むと LearnPage に選択中問題を引き継ぐ', async () => {
    render(<App />);

    fireEvent.click((await screen.findAllByText('問題文を見る'))[0]);

    await waitFor(() => {
      expect(window.location.hash).toBe('#/learn');
    });

    expect(screen.getByText('🖊️ エディタで解く →')).toBeInTheDocument();
    expect(screen.getAllByText('初めてのS式').length).toBeGreaterThan(0);
  });

  it('保存済みの問題IDがある状態で LearnPage を開くと問題詳細を直接表示する', async () => {
    localStorage.setItem(STORAGE_KEY_PROBLEM, 'basic-01');
    window.location.hash = '#/learn';

    render(<App />);

    expect(await screen.findByText('💡 ヒントを表示')).toBeInTheDocument();
    expect(screen.getAllByText('初めてのS式').length).toBeGreaterThan(0);
    expect(screen.getByText('🖊️ エディタで解く →')).toBeInTheDocument();
  });

  it('LearnPage で解答表示後にエディタへ進むと解答コードを引き継ぎ実行結果をリセットする', async () => {
    localStorage.setItem(STORAGE_KEY_PROBLEM, 'basic-01');
    window.location.hash = '#/learn';

    render(<App />);

    fireEvent.click(await screen.findByText('📖 解答を表示'));
    fireEvent.click(screen.getByText('🖊️ エディタで解く →'));

    await waitFor(() => {
      expect(window.location.hash).toBe('#/editor');
    });

    expect(screen.getByText('editor-page')).toBeInTheDocument();
    expect(screen.getByTestId('editor-code').textContent).toBe(BASIC_PROBLEM?.solution ?? '');
    expect(screen.getByTestId('editor-output')).toBeEmptyDOMElement();
    expect(screen.getByTestId('editor-return-value')).toBeEmptyDOMElement();
    expect(screen.getByTestId('editor-error')).toHaveTextContent('none');
    expect(screen.getByTestId('editor-is-correct')).toHaveTextContent('null');
  });
});