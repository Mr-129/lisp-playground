// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

  it('judge サマリーと visible case の差分を表示する', () => {
    render(
      <OutputPanel
        output=""
        returnValue=""
        isCorrect={false}
        judgeResult={{
          passed: false,
          summary: {
            visiblePassed: 0,
            visibleTotal: 1,
            hiddenPassed: 0,
            hiddenTotal: 1,
          },
          cases: [
            {
              id: 'visible-case',
              label: 'visible sample',
              visibility: 'visible',
              passed: false,
              execution: { output: 'actual-visible', returnValue: '', error: undefined },
              mismatches: [
                {
                  field: 'output',
                  expected: { value: 'expected-visible', comparison: 'exact' },
                  actual: 'actual-visible',
                },
              ],
            },
            {
              id: 'hidden-case',
              label: 'secret sample',
              visibility: 'hidden',
              passed: false,
              execution: { output: '', returnValue: '', error: undefined },
              mismatches: [
                {
                  field: 'output',
                  expected: { value: 'secret-expected', comparison: 'exact' },
                  actual: 'secret-actual',
                },
              ],
            },
          ],
          firstFailure: {
            id: 'visible-case',
            label: 'visible sample',
            visibility: 'visible',
            passed: false,
            execution: { output: 'actual-visible', returnValue: '', error: undefined },
            mismatches: [
              {
                field: 'output',
                expected: { value: 'expected-visible', comparison: 'exact' },
                actual: 'actual-visible',
              },
            ],
          },
        }}
      />,
    );

    expect(screen.queryByText('コードを入力して「実行」ボタンを押してください')).not.toBeInTheDocument();
    const summary = screen.getByLabelText('採点サマリー');
    expect(within(summary).getByText('公開ケース')).toBeInTheDocument();
    expect(within(summary).getByText('非公開ケース')).toBeInTheDocument();
    expect(within(summary).getAllByText(/0\s*\/\s*1/)).toHaveLength(2);
    expect(screen.getByText('visible sample')).toBeInTheDocument();
    expect(screen.getByText('expected-visible')).toBeInTheDocument();
    expect(screen.getByText('actual-visible')).toBeInTheDocument();
  });

  it('hidden case は詳細を隠して generic label で表示する', () => {
    render(
      <OutputPanel
        output=""
        returnValue=""
        isCorrect={false}
        judgeResult={{
          passed: false,
          summary: {
            visiblePassed: 1,
            visibleTotal: 1,
            hiddenPassed: 0,
            hiddenTotal: 1,
          },
          cases: [
            {
              id: 'visible-case',
              label: 'visible sample',
              visibility: 'visible',
              passed: true,
              execution: { output: 'ok', returnValue: '', error: undefined },
              mismatches: [],
            },
            {
              id: 'hidden-case',
              label: 'secret sample',
              visibility: 'hidden',
              passed: false,
              execution: { output: '', returnValue: '', error: undefined },
              mismatches: [
                {
                  field: 'output',
                  expected: { value: 'secret-expected', comparison: 'exact' },
                  actual: 'secret-actual',
                },
              ],
            },
          ],
          firstFailure: {
            id: 'hidden-case',
            label: 'secret sample',
            visibility: 'hidden',
            passed: false,
            execution: { output: '', returnValue: '', error: undefined },
            mismatches: [
              {
                field: 'output',
                expected: { value: 'secret-expected', comparison: 'exact' },
                actual: 'secret-actual',
              },
            ],
          },
        }}
      />,
    );

    expect(screen.getByText('非公開ケース 1')).toBeInTheDocument();
    expect(screen.getByText('非公開ケースのため詳細は表示しません。')).toBeInTheDocument();
    expect(screen.queryByText('secret sample')).not.toBeInTheDocument();
    expect(screen.queryByText('secret-expected')).not.toBeInTheDocument();
  });
});
