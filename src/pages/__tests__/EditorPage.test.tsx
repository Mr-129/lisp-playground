// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EditorPage } from '../EditorPage';
import { Problem } from '../../types';

// Mock CodeMirror since it doesn't work well in jsdom
vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea
      data-testid="mock-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock('@codemirror/theme-one-dark', () => ({
  oneDark: {},
}));

vi.mock('../../editor/lisp-language', () => ({
  lispLanguage: [],
}));

const mockProblem: Problem = {
  id: 'test-01',
  title: 'テスト問題',
  category: 'テスト',
  difficulty: 'beginner',
  description: 'テスト',
  initialCode: '(+ 1 2)',
  expectedOutput: '3\n',
  expectedReturnValue: '3',
  solution: '(print (+ 1 2))',
};

function renderEditorPage(props: Partial<Parameters<typeof EditorPage>[0]> = {}) {
  const defaultProps = {
    code: '(+ 1 2)',
    setCode: vi.fn(),
    selectedProblem: null,
    output: '',
    setOutput: vi.fn(),
    returnValue: '',
    setReturnValue: vi.fn(),
    error: undefined,
    setError: vi.fn(),
    isCorrect: null,
    setIsCorrect: vi.fn(),
    ...props,
  };
  return { ...render(
    <MemoryRouter>
      <EditorPage {...defaultProps} />
    </MemoryRouter>
  ), props: defaultProps };
}

describe('EditorPage', () => {
  it('フリーモード表示（問題未選択）', () => {
    renderEditorPage();
    expect(screen.getByText('🖊️ フリーモード')).toBeInTheDocument();
  });

  it('選択中の問題名を表示する', () => {
    renderEditorPage({ selectedProblem: mockProblem });
    expect(screen.getByText('📝 テスト問題')).toBeInTheDocument();
  });

  it('「問題一覧に戻る」ボタンがある', () => {
    renderEditorPage();
    expect(screen.getByText('← 問題一覧に戻る')).toBeInTheDocument();
  });

  it('実行ボタンがある', () => {
    renderEditorPage();
    expect(screen.getByLabelText('コードを実行')).toBeInTheDocument();
  });

  it('実行ボタンをクリックするとコードが実行される', async () => {
    const setOutput = vi.fn();
    const setReturnValue = vi.fn();
    const setError = vi.fn();

    renderEditorPage({
      code: '(+ 1 2)',
      setOutput,
      setReturnValue,
      setError,
    });

    fireEvent.click(screen.getByLabelText('コードを実行'));
    await waitFor(() => {
      expect(setReturnValue).toHaveBeenCalledWith('3');
    });
    expect(setError).toHaveBeenCalledWith(undefined);
  });

  it('問題のコードを実行して正解判定する', async () => {
    const setOutput = vi.fn();
    const setReturnValue = vi.fn();
    const setError = vi.fn();
    const setIsCorrect = vi.fn();

    renderEditorPage({
      code: '(print (+ 1 2))',
      selectedProblem: mockProblem,
      setOutput,
      setReturnValue,
      setError,
      setIsCorrect,
    });

    fireEvent.click(screen.getByLabelText('コードを実行'));
    await waitFor(() => {
      expect(setIsCorrect).toHaveBeenCalledWith(true);
    });
  });

  it('不正解の場合 false を設定する', async () => {
    const setIsCorrect = vi.fn();

    renderEditorPage({
      code: '(print (+ 2 2))',
      selectedProblem: mockProblem,
      setOutput: vi.fn(),
      setReturnValue: vi.fn(),
      setError: vi.fn(),
      setIsCorrect,
    });

    fireEvent.click(screen.getByLabelText('コードを実行'));
    await waitFor(() => {
      expect(setIsCorrect).toHaveBeenCalledWith(false);
    });
  });

  it('エラー時は正解判定しない', async () => {
    const setIsCorrect = vi.fn();

    renderEditorPage({
      code: '(undefined-func)',
      selectedProblem: mockProblem,
      setOutput: vi.fn(),
      setReturnValue: vi.fn(),
      setError: vi.fn(),
      setIsCorrect,
    });

    fireEvent.click(screen.getByLabelText('コードを実行'));
    await waitFor(() => {
      expect(setIsCorrect).toHaveBeenCalledWith(null);
    });
  });

  it('エディタにコードが表示される', () => {
    renderEditorPage({ code: '(defun foo () 42)' });
    const editor = screen.getByTestId('mock-editor');
    expect(editor).toHaveValue('(defun foo () 42)');
  });
});
