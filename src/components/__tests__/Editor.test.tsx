// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Editor } from '../Editor';

const { codeMirrorPropsSpy } = vi.hoisted(() => ({
  codeMirrorPropsSpy: vi.fn(),
}));

vi.mock('@uiw/react-codemirror', () => ({
  default: (props: {
    value: string;
    onChange: (value: string) => void;
    basicSetup: Record<string, boolean>;
    style?: { fontSize?: string };
  }) => {
    codeMirrorPropsSpy(props);

    return (
      <textarea
        data-testid="mock-editor"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      />
    );
  },
}));

vi.mock('@codemirror/theme-one-dark', () => ({
  oneDark: {},
}));

vi.mock('../../editor/lisp-language', () => ({
  lispLanguage: [],
}));

function renderEditor(props: Partial<Parameters<typeof Editor>[0]> = {}) {
  const defaultProps = {
    code: '(+ 1 2)',
    onChange: vi.fn(),
    onRun: vi.fn(),
    isRunning: false,
    ...props,
  };

  return {
    ...render(<Editor {...defaultProps} />),
    props: defaultProps,
  };
}

describe('Editor', () => {
  beforeEach(() => {
    codeMirrorPropsSpy.mockClear();
  });

  it('CodeMirror に code と基本設定を渡す', () => {
    renderEditor({ code: '(print 1)' });

    expect(screen.getByTestId('mock-editor')).toHaveValue('(print 1)');

    const latestProps = codeMirrorPropsSpy.mock.lastCall?.[0];

    expect(latestProps?.style).toEqual({ fontSize: '14px' });
    expect(latestProps?.basicSetup).toMatchObject({
      lineNumbers: true,
      bracketMatching: true,
      closeBrackets: true,
      autocompletion: false,
      highlightActiveLine: true,
      indentOnInput: true,
    });
  });

  it('編集内容の変更を onChange に渡す', () => {
    const onChange = vi.fn();

    renderEditor({ onChange });

    fireEvent.change(screen.getByTestId('mock-editor'), {
      target: { value: '(print 42)' },
    });

    expect(onChange).toHaveBeenCalledWith('(print 42)');
  });

  it('実行ボタンを押すと onRun を呼ぶ', () => {
    const onRun = vi.fn();

    renderEditor({ onRun });

    fireEvent.click(screen.getByLabelText('コードを実行'));

    expect(onRun).toHaveBeenCalledTimes(1);
  });

  it('Ctrl+Enter で onRun を呼ぶ', () => {
    const onRun = vi.fn();

    renderEditor({ onRun });

    fireEvent.keyDown(screen.getByTestId('mock-editor'), { key: 'Enter', ctrlKey: true });

    expect(onRun).toHaveBeenCalledTimes(1);
  });

  it('Meta+Enter でも onRun を呼ぶ', () => {
    const onRun = vi.fn();

    renderEditor({ onRun });

    fireEvent.keyDown(screen.getByTestId('mock-editor'), { key: 'Enter', metaKey: true });

    expect(onRun).toHaveBeenCalledTimes(1);
  });

  it('通常の Enter では onRun を呼ばない', () => {
    const onRun = vi.fn();

    renderEditor({ onRun });

    fireEvent.keyDown(screen.getByTestId('mock-editor'), { key: 'Enter' });

    expect(onRun).not.toHaveBeenCalled();
  });

  it('実行中はボタンを無効化して実行中表示にする', () => {
    renderEditor({ isRunning: true });

    const button = screen.getByLabelText('コードを実行');

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('⏳ 実行中...');
  });
});