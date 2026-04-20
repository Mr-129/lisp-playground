// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ReplPage } from '../ReplPage';

function renderRepl() {
  return render(
    <MemoryRouter initialEntries={['/repl']}>
      <ReplPage />
    </MemoryRouter>
  );
}

describe('ReplPage', () => {
  it('ウェルカムメッセージを表示する', () => {
    renderRepl();
    expect(screen.getByText('Common Lisp REPL へようこそ！')).toBeInTheDocument();
  });

  it('REPLタイトルを表示する', () => {
    renderRepl();
    expect(screen.getByText('🖥️ REPL')).toBeInTheDocument();
  });

  it('入力欄が存在する', () => {
    renderRepl();
    expect(screen.getByLabelText('REPL 入力')).toBeInTheDocument();
  });

  it('空の入力では送信ボタンが無効', () => {
    renderRepl();
    const button = screen.getByLabelText('式を評価');
    expect(button).toBeDisabled();
  });

  it('式を入力して評価できる', () => {
    renderRepl();
    const input = screen.getByLabelText('REPL 入力');
    fireEvent.change(input, { target: { value: '(+ 1 2)' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('→ 3')).toBeInTheDocument();
    expect(screen.getByText('(+ 1 2)')).toBeInTheDocument();
  });

  it('環境を引き継いで次の式で使える', () => {
    renderRepl();
    const input = screen.getByLabelText('REPL 入力');

    // Define a variable
    fireEvent.change(input, { target: { value: '(defvar *x* 42)' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Use the variable
    fireEvent.change(input, { target: { value: '*x*' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('→ 42')).toBeInTheDocument();
  });

  it('エラーを表示する', () => {
    renderRepl();
    const input = screen.getByLabelText('REPL 入力');
    fireEvent.change(input, { target: { value: '(+ 1 "a")' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    const errorElements = screen.getAllByText(/⚠/);
    expect(errorElements.length).toBeGreaterThan(0);
  });

  it('クリアボタンで履歴をリセットする', () => {
    renderRepl();
    const input = screen.getByLabelText('REPL 入力');

    fireEvent.change(input, { target: { value: '(+ 1 2)' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('→ 3')).toBeInTheDocument();

    const clearBtn = screen.getByText('🗑️ クリア');
    fireEvent.click(clearBtn);

    expect(screen.queryByText('→ 3')).not.toBeInTheDocument();
    expect(screen.getByText('Common Lisp REPL へようこそ！')).toBeInTheDocument();
  });

  it('print出力を表示する', () => {
    renderRepl();
    const input = screen.getByLabelText('REPL 入力');
    fireEvent.change(input, { target: { value: '(print 42)' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('関数定義を引き継いで呼び出せる', () => {
    renderRepl();
    const input = screen.getByLabelText('REPL 入力');

    fireEvent.change(input, { target: { value: '(defun sq (x) (* x x))' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    fireEvent.change(input, { target: { value: '(sq 5)' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('→ 25')).toBeInTheDocument();
  });
});
