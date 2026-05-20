// @vitest-environment jsdom
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from '../Header';

const { trackEventMock } = vi.hoisted(() => ({
  trackEventMock: vi.fn(),
}));

vi.mock('../../utils/analytics', () => ({
  trackEvent: trackEventMock,
}));

const WAITLIST_URL = 'https://github.com/Mr-129/lisp-playground/issues/new?title=%5BWaitlist%5D%20';

function setWaitlistMeta(url = WAITLIST_URL) {
  document.head.querySelector('meta[name="lisp-playground-waitlist-url"]')?.remove();
  const meta = document.createElement('meta');
  meta.name = 'lisp-playground-waitlist-url';
  meta.content = url;
  document.head.appendChild(meta);
}

function LocationDisplay() {
  const location = useLocation();

  return <div data-testid="location-path">{location.pathname}</div>;
}

function renderWithRouter(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <Header />
              <LocationDisplay />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('Header', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    trackEventMock.mockReset();
    setWaitlistMeta();
  });

  afterEach(() => {
    document.head.querySelector('meta[name="lisp-playground-waitlist-url"]')?.remove();
  });

  it('タイトルを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('Lambda Atelier')).toBeInTheDocument();
  });

  it('サブタイトルを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('Common Lisp 学習スタジオ')).toBeInTheDocument();
  });

  it('ロゴボタンを表示する', () => {
    renderWithRouter();
    expect(screen.getByLabelText('ホームへ戻る')).toBeInTheDocument();
  });

  it('ナビゲーションボタンを表示する', () => {
    renderWithRouter();
    expect(screen.getByRole('button', { name: '学習' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '用語集' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'エディタ' })).toBeInTheDocument();
  });

  it('「/glossary」パスで用語集ボタンがactiveになる', () => {
    renderWithRouter('/glossary');
    const glossaryButton = screen.getByRole('button', { name: '用語集' });
    expect(glossaryButton).toHaveClass('active');
    expect(screen.getByRole('button', { name: '学習' })).not.toHaveClass('active');
  });

  it('「/problems」パスで学習ボタンがactiveになる', () => {
    renderWithRouter('/problems');
    const learnButton = screen.getByRole('button', { name: '学習' });
    expect(learnButton).toHaveClass('active');
    const editorButton = screen.getByRole('button', { name: 'エディタ' });
    expect(editorButton).not.toHaveClass('active');
  });

  it('「/learn」パスでも学習ボタンがactiveになる', () => {
    renderWithRouter('/learn');
    expect(screen.getByRole('button', { name: '学習' })).toHaveClass('active');
  });

  it('「/learn/:problemId」パスでも学習ボタンがactiveになる', () => {
    renderWithRouter('/learn/basic-01');
    expect(screen.getByRole('button', { name: '学習' })).toHaveClass('active');
  });

  it('「/guide」パスでも学習ボタンがactiveになる', () => {
    renderWithRouter('/guide');
    expect(screen.getByRole('button', { name: '学習' })).toHaveClass('active');
  });

  it('「/editor」パスでエディタボタンがactiveになる', () => {
    renderWithRouter('/editor');
    const editorButton = screen.getByRole('button', { name: 'エディタ' });
    expect(editorButton).toHaveClass('active');
    const learnButton = screen.getByRole('button', { name: '学習' });
    expect(learnButton).not.toHaveClass('active');
  });

  it('「/repl」パスでREPLボタンがactiveになる', () => {
    renderWithRouter('/repl');
    const replButton = screen.getByRole('button', { name: 'REPL' });
    expect(replButton).toHaveClass('active');
    expect(screen.getByRole('button', { name: '学習' })).not.toHaveClass('active');
    expect(screen.getByRole('button', { name: 'エディタ' })).not.toHaveClass('active');
  });

  it('ロゴをクリックするとホームへ戻る', () => {
    renderWithRouter('/editor');

    fireEvent.click(screen.getByLabelText('ホームへ戻る'));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/');
  });

  it('タイトルをクリックするとホームへ戻る', () => {
    renderWithRouter('/repl');

    fireEvent.click(screen.getByText('Lambda Atelier'));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/');
  });

  it('学習ボタンをクリックすると問題一覧へ移動する', () => {
    renderWithRouter('/editor');

    fireEvent.click(screen.getByRole('button', { name: '学習' }));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/problems');
  });

  it('エディタボタンをクリックするとエディタへ移動する', () => {
    renderWithRouter('/');

    fireEvent.click(screen.getByRole('button', { name: 'エディタ' }));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/editor');
  });

  it('用語集ボタンをクリックすると用語集ページへ移動する', () => {
    renderWithRouter('/');

    fireEvent.click(screen.getByRole('button', { name: '用語集' }));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/glossary');
  });

  it('REPLボタンをクリックするとREPLへ移動する', () => {
    renderWithRouter('/');

    fireEvent.click(screen.getByRole('button', { name: 'REPL' }));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/repl');
  });

  it('お問い合わせボタンをクリックすると問い合わせページへ移動して計測する', () => {
    renderWithRouter('/');

    expect(screen.queryByLabelText('お問い合わせページへ移動する')).not.toBeInTheDocument();
  });

  it('free-only モードでは waitlist と pricing CTA を表示しない', () => {
    renderWithRouter('/');

    expect(screen.queryByLabelText('更新通知の仮登録を開く')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Standard プランの案内を見る')).not.toBeInTheDocument();
  });

  it('GitHubリンクを表示する', () => {
    renderWithRouter();
    const link = screen.getByLabelText('GitHub リポジトリ');
    expect(link).toHaveAttribute('href', 'https://github.com/Mr-129/lisp-playground');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('free-only モードでは onOpenPricingGuide を渡しても Standard 案内を表示しない', () => {
    const onOpenPricingGuide = vi.fn();

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="*" element={<Header onOpenPricingGuide={onOpenPricingGuide} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByLabelText('Standard プランの案内を見る')).not.toBeInTheDocument();
    expect(onOpenPricingGuide).not.toHaveBeenCalled();
  });
});
