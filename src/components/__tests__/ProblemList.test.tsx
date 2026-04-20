// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProblemList } from '../ProblemList';
import { Problem } from '../../types';

// Mock the problems data
vi.mock('../../data/problems', () => {
  const mockProblems: Problem[] = [
    {
      id: 'cat1-01',
      title: '問題A',
      category: 'カテゴリ1',
      difficulty: 'beginner',
      description: 'テスト',
      initialCode: '',
      solution: '(+ 1 2)',
    },
    {
      id: 'cat1-02',
      title: '問題B',
      category: 'カテゴリ1',
      difficulty: 'intermediate',
      description: 'テスト',
      initialCode: '',
      solution: '(+ 1 2)',
    },
    {
      id: 'cat2-01',
      title: '問題C',
      category: 'カテゴリ2',
      difficulty: 'advanced',
      description: 'テスト',
      initialCode: '',
      solution: '(+ 1 2)',
    },
  ];

  return {
    problems: mockProblems,
    getProblemsByCategory: () => {
      const map = new Map<string, Problem[]>();
      map.set('カテゴリ1', [mockProblems[0], mockProblems[1]]);
      map.set('カテゴリ2', [mockProblems[2]]);
      return map;
    },
  };
});

describe('ProblemList', () => {
  it('カテゴリ名を表示する', () => {
    render(<ProblemList selectedId={null} onSelect={() => {}} />);
    expect(screen.getByText('カテゴリ1')).toBeInTheDocument();
    expect(screen.getByText('カテゴリ2')).toBeInTheDocument();
  });

  it('問題タイトルを表示する', () => {
    render(<ProblemList selectedId={null} onSelect={() => {}} />);
    expect(screen.getByText('問題A')).toBeInTheDocument();
    expect(screen.getByText('問題B')).toBeInTheDocument();
    expect(screen.getByText('問題C')).toBeInTheDocument();
  });

  it('難易度バッジを表示する', () => {
    render(<ProblemList selectedId={null} onSelect={() => {}} />);
    expect(screen.getByText('初級')).toBeInTheDocument();
    expect(screen.getByText('中級')).toBeInTheDocument();
    expect(screen.getByText('上級')).toBeInTheDocument();
  });

  it('選択された問題にselectedクラスが付く', () => {
    render(<ProblemList selectedId="cat1-01" onSelect={() => {}} />);
    const button = screen.getByText('問題A').closest('button');
    expect(button).toHaveClass('selected');
  });

  it('問題をクリックするとonSelectが呼ばれる', () => {
    const onSelect = vi.fn();
    render(<ProblemList selectedId={null} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText('問題B').closest('button')!);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'cat1-02', title: '問題B' }));
  });
});
