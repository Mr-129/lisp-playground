// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { EditorPage } from '../EditorPage';
import { Problem } from '../../types';

const executeLispAsyncMock = vi.hoisted(() => vi.fn());

vi.mock('../../worker', () => ({
  executeLispAsync: executeLispAsyncMock,
}));

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

const outputOnlyProblem: Problem = {
  ...mockProblem,
  id: 'test-output-only',
  expectedReturnValue: undefined,
};

const returnValueOnlyProblem: Problem = {
  ...mockProblem,
  id: 'test-return-only',
  expectedOutput: undefined,
};

beforeEach(() => {
  executeLispAsyncMock.mockReset();
  executeLispAsyncMock.mockImplementation(async (code: string) => {
    switch (code) {
      case '(+ 1 2)':
        return { output: '', returnValue: '3', error: undefined };
      case '(print (+ 1 2))':
        return { output: '3\n', returnValue: '3', error: undefined };
      case '(print (+ 2 2))':
        return { output: '4\n', returnValue: '4', error: undefined };
      case '(undefined-func)':
        return { output: '', returnValue: '', error: 'Undefined function: undefined-func' };
      default:
        return { output: '', returnValue: '', error: undefined };
    }
  });
});

function renderEditorPage(props: Partial<Parameters<typeof EditorPage>[0]> = {}) {
  const defaultProps = {
    code: '(+ 1 2)',
    setCode: vi.fn(),
    selectedProblem: null,
    onProblemSolved: vi.fn(),
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
    <MemoryRouter initialEntries={['/editor']}>
      <Routes>
        <Route path="/editor" element={<EditorPage {...defaultProps} />} />
        <Route path="/problems" element={<div>problems-page</div>} />
      </Routes>
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

  it('「問題一覧に戻る」ボタンで problems へ遷移する', () => {
    renderEditorPage();

    fireEvent.click(screen.getByText('← 問題一覧に戻る'));

    expect(screen.getByText('problems-page')).toBeInTheDocument();
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
    const onProblemSolved = vi.fn();

    renderEditorPage({
      code: '(print (+ 1 2))',
      selectedProblem: mockProblem,
      onProblemSolved,
      setOutput,
      setReturnValue,
      setError,
      setIsCorrect,
    });

    fireEvent.click(screen.getByLabelText('コードを実行'));
    await waitFor(() => {
      expect(setIsCorrect).toHaveBeenCalledWith(true);
    });
    expect(onProblemSolved).toHaveBeenCalledWith('test-01');
  });

  it('expectedReturnValue が未定義でも expectedOutput のみで正解判定する', async () => {
    const setIsCorrect = vi.fn();
    const onProblemSolved = vi.fn();

    renderEditorPage({
      code: '(print (+ 1 2))',
      selectedProblem: outputOnlyProblem,
      onProblemSolved,
      setOutput: vi.fn(),
      setReturnValue: vi.fn(),
      setError: vi.fn(),
      setIsCorrect,
    });

    fireEvent.click(screen.getByLabelText('コードを実行'));

    await waitFor(() => {
      expect(setIsCorrect).toHaveBeenCalledWith(true);
    });
    expect(onProblemSolved).toHaveBeenCalledWith('test-output-only');
  });

  it('expectedOutput が未定義でも expectedReturnValue のみで正解判定する', async () => {
    const setIsCorrect = vi.fn();
    const onProblemSolved = vi.fn();

    renderEditorPage({
      code: '(+ 1 2)',
      selectedProblem: returnValueOnlyProblem,
      onProblemSolved,
      setOutput: vi.fn(),
      setReturnValue: vi.fn(),
      setError: vi.fn(),
      setIsCorrect,
    });

    fireEvent.click(screen.getByLabelText('コードを実行'));

    await waitFor(() => {
      expect(setIsCorrect).toHaveBeenCalledWith(true);
    });
    expect(onProblemSolved).toHaveBeenCalledWith('test-return-only');
  });

  it('不正解の場合 false を設定する', async () => {
    const setIsCorrect = vi.fn();
    const onProblemSolved = vi.fn();

    renderEditorPage({
      code: '(print (+ 2 2))',
      selectedProblem: mockProblem,
      onProblemSolved,
      setOutput: vi.fn(),
      setReturnValue: vi.fn(),
      setError: vi.fn(),
      setIsCorrect,
    });

    fireEvent.click(screen.getByLabelText('コードを実行'));
    await waitFor(() => {
      expect(setIsCorrect).toHaveBeenCalledWith(false);
    });
    expect(onProblemSolved).not.toHaveBeenCalled();
  });

  it('エラー時は正解判定しない', async () => {
    const setIsCorrect = vi.fn();
    const onProblemSolved = vi.fn();

    renderEditorPage({
      code: '(undefined-func)',
      selectedProblem: mockProblem,
      onProblemSolved,
      setOutput: vi.fn(),
      setReturnValue: vi.fn(),
      setError: vi.fn(),
      setIsCorrect,
    });

    fireEvent.click(screen.getByLabelText('コードを実行'));
    await waitFor(() => {
      expect(setIsCorrect).toHaveBeenCalledWith(null);
    });
    expect(onProblemSolved).not.toHaveBeenCalled();
  });

  it('executeLispAsync が Error を投げたときメッセージを設定する', async () => {
    const setError = vi.fn();
    executeLispAsyncMock.mockRejectedValueOnce(new Error('worker failed'));

    renderEditorPage({ setError });

    fireEvent.click(screen.getByLabelText('コードを実行'));

    await waitFor(() => {
      expect(setError).toHaveBeenCalledWith('worker failed');
    });
  });

  it('executeLispAsync が非 Error を投げたとき汎用エラーメッセージを設定する', async () => {
    const setError = vi.fn();
    executeLispAsyncMock.mockRejectedValueOnce('unexpected');

    renderEditorPage({ setError });

    fireEvent.click(screen.getByLabelText('コードを実行'));

    await waitFor(() => {
      expect(setError).toHaveBeenCalledWith('実行中にエラーが発生しました');
    });
  });

  it('実行中に Ctrl+Enter を押しても二重実行しない', async () => {
    let resolveExecution: ((value: { output: string; returnValue: string; error: undefined }) => void) | undefined;
    executeLispAsyncMock.mockImplementationOnce(() => new Promise((resolve) => {
      resolveExecution = resolve;
    }));

    renderEditorPage();

    fireEvent.click(screen.getByLabelText('コードを実行'));
    fireEvent.keyDown(screen.getByTestId('mock-editor'), { key: 'Enter', ctrlKey: true });

    expect(executeLispAsyncMock).toHaveBeenCalledTimes(1);

    resolveExecution?.({ output: '', returnValue: '3', error: undefined });

    await waitFor(() => {
      expect(screen.getByLabelText('コードを実行')).not.toBeDisabled();
    });
  });

  it('エディタにコードが表示される', () => {
    renderEditorPage({ code: '(defun foo () 42)' });
    const editor = screen.getByTestId('mock-editor');
    expect(editor).toHaveValue('(defun foo () 42)');
  });
});
