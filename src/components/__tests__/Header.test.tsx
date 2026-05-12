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
    expect(screen.getByText('Lisp Playground')).toBeInTheDocument();
  });

  it('サブタイトルを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('Common Lisp 学習環境')).toBeInTheDocument();
  });

  it('ロゴ（λ）を表示する', () => {
    renderWithRouter();
    expect(screen.getByText('λ')).toBeInTheDocument();
  });

  it('ナビゲーションボタンを表示する', () => {
    renderWithRouter();
    expect(screen.getByText('📚 学習')).toBeInTheDocument();
    expect(screen.getByText('🖊️ エディタ')).toBeInTheDocument();
  });

  it('「/problems」パスで学習ボタンがactiveになる', () => {
    renderWithRouter('/problems');
    const learnButton = screen.getByText('📚 学習');
    expect(learnButton).toHaveClass('active');
    const editorButton = screen.getByText('🖊️ エディタ');
    expect(editorButton).not.toHaveClass('active');
  });

  it('「/learn」パスでも学習ボタンがactiveになる', () => {
    renderWithRouter('/learn');
    expect(screen.getByText('📚 学習')).toHaveClass('active');
  });

  it('「/guide」パスでも学習ボタンがactiveになる', () => {
    renderWithRouter('/guide');
    expect(screen.getByText('📚 学習')).toHaveClass('active');
  });

  it('「/editor」パスでエディタボタンがactiveになる', () => {
    renderWithRouter('/editor');
    const editorButton = screen.getByText('🖊️ エディタ');
    expect(editorButton).toHaveClass('active');
    const learnButton = screen.getByText('📚 学習');
    expect(learnButton).not.toHaveClass('active');
  });

  it('「/repl」パスでREPLボタンがactiveになる', () => {
    renderWithRouter('/repl');
    const replButton = screen.getByText('🖥️ REPL');
    expect(replButton).toHaveClass('active');
    expect(screen.getByText('📚 学習')).not.toHaveClass('active');
    expect(screen.getByText('🖊️ エディタ')).not.toHaveClass('active');
  });

  it('ロゴをクリックするとホームへ戻る', () => {
    renderWithRouter('/editor');

    fireEvent.click(screen.getByLabelText('ホームへ戻る'));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/');
  });

  it('タイトルをクリックするとホームへ戻る', () => {
    renderWithRouter('/repl');

    fireEvent.click(screen.getByText('Lisp Playground'));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/');
  });

  it('学習ボタンをクリックすると問題一覧へ移動する', () => {
    renderWithRouter('/editor');

    fireEvent.click(screen.getByText('📚 学習'));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/problems');
  });

  it('エディタボタンをクリックするとエディタへ移動する', () => {
    renderWithRouter('/');

    fireEvent.click(screen.getByText('🖊️ エディタ'));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/editor');
  });

  it('REPLボタンをクリックするとREPLへ移動する', () => {
    renderWithRouter('/');

    fireEvent.click(screen.getByText('🖥️ REPL'));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/repl');
  });

  it('お問い合わせボタンをクリックすると問い合わせページへ移動して計測する', () => {
    renderWithRouter('/');

    fireEvent.click(screen.getByLabelText('お問い合わせページへ移動する'));

    expect(trackEventMock).toHaveBeenCalledWith('contact_cta_clicked', {
      placement: 'header',
      channel: 'route',
      purpose: 'general',
    });
    expect(screen.getByTestId('location-path')).toHaveTextContent('/contact');
  });

  it('更新通知ボタンをクリックすると waitlist を開いて計測する', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    renderWithRouter('/');

    fireEvent.click(screen.getByLabelText('更新通知の仮登録を開く'));

    expect(trackEventMock).toHaveBeenCalledWith('waitlist_cta_clicked', {
      placement: 'header',
      channel: 'github_issue',
      selectedProblemId: null,
      selectedProblemTier: 'unknown',
    });
    expect(openSpy).toHaveBeenCalledWith(WAITLIST_URL, '_blank', 'noopener,noreferrer');
  });

  it('GitHubリンクを表示する', () => {
    renderWithRouter();
    const link = screen.getByLabelText('GitHub リポジトリ');
    expect(link).toHaveAttribute('href', 'https://github.com/Mr-129/lisp-playground');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('Standard 案内ボタンを表示してコールバックを呼ぶ', () => {
    const onOpenPricingGuide = vi.fn();

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="*" element={<Header onOpenPricingGuide={onOpenPricingGuide} />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText('Standard プランの案内を見る'));

    expect(onOpenPricingGuide).toHaveBeenCalledTimes(1);
  });
});
