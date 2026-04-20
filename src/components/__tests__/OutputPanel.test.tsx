// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OutputPanel } from '../OutputPanel';

describe('OutputPanel', () => {
  it('出力がないときプレースホルダーを表示する', () => {
    render(<OutputPanel output="" returnValue="" />);
    expect(screen.getByText('コードを入力して「実行」ボタンを押してください')).toBeInTheDocument();
  });

  it('出力テキストを表示する', () => {
    render(<OutputPanel output="42\n" returnValue="42" />);
    expect(screen.getByText('出力:')).toBeInTheDocument();
    expect(screen.getByText('戻り値:')).toBeInTheDocument();
  });

  it('戻り値を表示する', () => {
    render(<OutputPanel output="" returnValue="100" />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('戻り値:')).toBeInTheDocument();
  });

  it('エラーを表示する', () => {
    render(<OutputPanel output="" returnValue="" error="未定義の変数: x" />);
    expect(screen.getByText('未定義の変数: x')).toBeInTheDocument();
  });

  it('正解バッジを表示する', () => {
    render(<OutputPanel output="ok" returnValue="ok" isCorrect={true} />);
    expect(screen.getByText('✓ 正解！')).toBeInTheDocument();
  });

  it('不正解バッジを表示する', () => {
    render(<OutputPanel output="ng" returnValue="ng" isCorrect={false} />);
    expect(screen.getByText('✗ 不正解')).toBeInTheDocument();
  });

  it('isCorrect が null のときバッジを表示しない', () => {
    render(<OutputPanel output="test" returnValue="test" isCorrect={null} />);
    expect(screen.queryByText('✓ 正解！')).not.toBeInTheDocument();
    expect(screen.queryByText('✗ 不正解')).not.toBeInTheDocument();
  });
});
