// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ProblemList } from '../ProblemList';
import { Problem } from '../../types';

// Mock the problems data
vi.mock('../../data/problems', () => {
  const mockProblems: Problem[] = [
    {
      id: 'cat1-01',
      slug: 'cat1-01',
      order: 1,
      title: '問題A',
      category: 'カテゴリ1',
      difficulty: 'beginner',
      description: 'テスト',
      initialCode: '',
      estimatedMinutes: 5,
      learningGoals: ['goal-a'],
      learningPath: { id: 'starter', title: 'Lisp 基礎ステップ', step: 1, prerequisites: [] },
      catalog: { tier: 'free', courseId: 'intro-core', courseOrder: 1, tags: ['syntax'] },
      solution: '(+ 1 2)',
    },
    {
      id: 'cat1-02',
      slug: 'cat1-02',
      order: 2,
      title: '問題B',
      category: 'カテゴリ1',
      difficulty: 'intermediate',
      description: 'テスト',
      initialCode: '',
      estimatedMinutes: 8,
      learningGoals: ['goal-b'],
      learningPath: { id: 'starter', title: 'Lisp 基礎ステップ', step: 3, prerequisites: ['cat2-01'] },
      catalog: { tier: 'standard', courseId: 'functional-patterns', courseOrder: 2, tags: ['higher-order'] },
      solution: '(+ 1 2)',
    },
    {
      id: 'cat2-01',
      slug: 'cat2-01',
      order: 3,
      title: '問題C',
      category: 'カテゴリ2',
      difficulty: 'advanced',
      description: 'テスト',
      initialCode: '',
      estimatedMinutes: 10,
      learningGoals: ['goal-c'],
      learningPath: { id: 'starter', title: 'Lisp 基礎ステップ', step: 2, prerequisites: ['cat1-01'] },
      catalog: { tier: 'standard', courseId: 'functional-patterns', courseOrder: 1, tags: ['recursion'] },
      solution: '(+ 1 2)',
    },
  ];

  return {
    problems: mockProblems,
    PROBLEM_COURSES: {
      'intro-core': { title: '入門コース', description: '基本構文を固めるコースです。' },
      'data-and-control': { title: 'データと制御コース', description: 'リストとループを学びます。' },
      'functional-patterns': { title: '関数型パターンコース', description: '再帰と高階関数を学びます。' },
    },
    getNextRecommendedProblem: (solvedProblemIds: string[]) => {
      const solvedSet = new Set(solvedProblemIds);
      return [...mockProblems]
        .sort((left, right) => (left.learningPath?.step ?? left.order) - (right.learningPath?.step ?? right.order))
        .find((problem) => !solvedSet.has(problem.id) && (problem.learningPath?.prerequisites ?? []).every((problemId) => solvedSet.has(problemId))) ?? null;
    },
    getProblemsByCategory: () => {
      const map = new Map<string, Problem[]>();
      map.set('カテゴリ1', [mockProblems[0], mockProblems[1]]);
      map.set('カテゴリ2', [mockProblems[2]]);
      return map;
    },
    getProblemsByLearningPath: () => [mockProblems[0], mockProblems[2], mockProblems[1]],
    getProblemsByCourse: () => {
      const map = new Map();
      map.set('intro-core', [mockProblems[0]]);
      map.set('data-and-control', []);
      map.set('functional-patterns', [mockProblems[2], mockProblems[1]]);
      return map;
    },
  };
});

describe('ProblemList', () => {
  it('カテゴリ名を表示する', () => {
    render(<ProblemList selectedId={null} solvedProblemIds={[]} onSelect={() => {}} />);
    expect(screen.getByText('カテゴリ1')).toBeInTheDocument();
    expect(screen.getByText('カテゴリ2')).toBeInTheDocument();
  });

  it('問題タイトルを表示する', () => {
    render(<ProblemList selectedId={null} solvedProblemIds={[]} onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: /問題A/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /問題B/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /問題C/ })).toBeInTheDocument();
  });

  it('難易度バッジを表示する', () => {
    render(<ProblemList selectedId={null} solvedProblemIds={[]} onSelect={() => {}} />);
    expect(screen.getByText('初級')).toBeInTheDocument();
    expect(screen.getByText('中級')).toBeInTheDocument();
    expect(screen.getByText('上級')).toBeInTheDocument();
  });

  it('free-only モードでは全問題を Free 表示にし lock 表示を出さない', () => {
    render(<ProblemList selectedId={null} solvedProblemIds={[]} onSelect={() => {}} />);

    const freeButton = screen.getByRole('button', { name: /問題A/ });
    const standardButton = screen.getByRole('button', { name: /問題B/ });

    expect(within(freeButton).getByText('Free')).toBeInTheDocument();
    expect(within(standardButton).getByText('Free')).toBeInTheDocument();
    expect(within(standardButton).queryByLabelText('有料候補コンテンツ')).not.toBeInTheDocument();
  });

  it('選択された問題にselectedクラスが付く', () => {
    render(<ProblemList selectedId="cat1-01" solvedProblemIds={[]} onSelect={() => {}} />);
    const button = screen.getByRole('button', { name: /問題A/ });
    expect(button).toHaveClass('selected');
  });

  it('問題をクリックするとonSelectが呼ばれる', () => {
    const onSelect = vi.fn();
    render(<ProblemList selectedId={null} solvedProblemIds={[]} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText(/問題B/).closest('button')!);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'cat1-02', title: '問題B' }));
  });

  it('最近見た問題とブックマークのショートカットを表示する', () => {
    render(
      <ProblemList
        selectedId={null}
        solvedProblemIds={[]}
        recentProblemIds={['cat1-02', 'cat1-01']}
        bookmarkedProblemIds={['cat2-01']}
        onSelect={() => {}}
      />
    );

    expect(screen.getByText('最近見た問題')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ブックマーク' })).toBeInTheDocument();
  });

  it('次に学ぶべき学習パスの問題を表示する', () => {
    render(<ProblemList selectedId={null} solvedProblemIds={['cat1-01']} onSelect={() => {}} />);

    expect(screen.getByText('次に学ぶ: ステップ 2 問題C')).toBeInTheDocument();
  });

  it('ショートカットから問題を選択できる', () => {
    const onSelect = vi.fn();
    render(
      <ProblemList
        selectedId={null}
        solvedProblemIds={[]}
        recentProblemIds={['cat1-02']}
        bookmarkedProblemIds={['cat2-01']}
        onSelect={onSelect}
      />
    );

    const bookmarkedSection = screen.getByRole('heading', { name: 'ブックマーク' }).closest('.problem-shortcut-section');
    fireEvent.click(within(bookmarkedSection as HTMLElement).getByRole('button', { name: /問題C/ }));

    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'cat2-01', title: '問題C' }));
  });

  it('searchQuery で一致する問題だけ表示する', () => {
    render(
      <ProblemList
        selectedId={null}
        solvedProblemIds={[]}
        searchQuery="カテゴリ2"
        onSelect={() => {}}
      />
    );

    expect(screen.getByText(/問題C/)).toBeInTheDocument();
    expect(screen.queryByText(/問題A/)).not.toBeInTheDocument();
    expect(screen.queryByText(/問題B/)).not.toBeInTheDocument();
  });

  it('学習パス順に切り替えるとステップ順に一覧表示する', () => {
    render(<ProblemList selectedId={null} solvedProblemIds={[]} onSelect={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: '学習パス順' }));

    const pathSection = screen.getByText('Lisp 基礎ステップ').closest('.problem-category');
    const buttons = within(pathSection as HTMLElement).getAllByRole('button');

    expect(buttons[0]).toHaveTextContent('問題A');
    expect(buttons[1]).toHaveTextContent('問題C');
    expect(buttons[1]).toHaveTextContent('ステップ 2');
    expect(buttons[2]).toHaveTextContent('問題B');
  });

  it('コース別に切り替えるとコース見出しごとに一覧表示する', () => {
    render(<ProblemList selectedId={null} solvedProblemIds={[]} onSelect={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'コース別' }));

    expect(screen.getByText('関数型パターンコース')).toBeInTheDocument();
    expect(screen.getByText('再帰と高階関数を学びます。')).toBeInTheDocument();

    const courseSection = screen.getByText('関数型パターンコース').closest('.problem-category');
    const buttons = within(courseSection as HTMLElement).getAllByRole('button');

    expect(buttons[0]).toHaveTextContent('問題C');
    expect(buttons[0]).toHaveTextContent('第1問');
    expect(buttons[1]).toHaveTextContent('問題B');
    expect(buttons[1]).toHaveTextContent('第2問');
  });

  it('searchQuery に一致しない場合は空メッセージを表示する', () => {
    render(
      <ProblemList
        selectedId={null}
        solvedProblemIds={[]}
        searchQuery="存在しない語句"
        onSelect={() => {}}
      />
    );

    expect(screen.getByText('一致する問題はありません。')).toBeInTheDocument();
  });
});
