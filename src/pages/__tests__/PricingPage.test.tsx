// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Problem } from '../../types';
import { PricingPage } from '../PricingPage';

const { trackEventMock } = vi.hoisted(() => ({
  trackEventMock: vi.fn(),
}));

vi.mock('../../utils/analytics', () => ({
  trackEvent: trackEventMock,
}));

const selectedProblem = {
  id: 'basic-01',
  title: '初めてのS式',
  category: '基本構文',
  difficulty: 'beginner' as const,
  description: 'desc',
  initialCode: 'code',
  solution: 'solution',
  order: 1,
  estimatedMinutes: 5,
  learningGoals: ['goal'],
  catalog: {
    tier: 'standard' as const,
    courseId: 'intro-core',
    courseOrder: 1,
    tags: ['syntax'],
  },
} satisfies Problem;

function renderPricingPage(initialEntry = '/pricing?from=learn_problem&back=%2Flearn') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/pricing" element={<PricingPage selectedProblem={selectedProblem} />} />
        <Route path="/learn" element={<div>learn-page</div>} />
        <Route path="/contact" element={<div>contact-page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('PricingPage', () => {
  beforeEach(() => {
    trackEventMock.mockReset();
  });

  it('価格ページ表示時に page viewed を計測する', () => {
    renderPricingPage();

    expect(screen.getByRole('heading', { name: 'Free / Standard / Supporter' })).toBeInTheDocument();
    expect(trackEventMock).toHaveBeenCalledWith('pricing_page_viewed', {
      source: 'learn_problem',
      selectedProblemId: 'basic-01',
      selectedProblemTier: 'standard',
    });
  });

  it('前の画面へ戻るボタンで back path に戻る', () => {
    renderPricingPage();

    fireEvent.click(screen.getByRole('button', { name: '前の画面へ戻る' }));

    expect(screen.getByText('learn-page')).toBeInTheDocument();
  });

  it('購入前の質問ボタンで contact へ遷移して計測する', () => {
    renderPricingPage('/pricing?from=header&back=%2F');

    fireEvent.click(screen.getByRole('button', { name: '購入前の質問をする' }));

    expect(trackEventMock).toHaveBeenCalledWith('contact_cta_clicked', {
      placement: 'pricing_page',
      channel: 'route',
      purpose: 'pre_purchase',
    });
    expect(screen.getByText('contact-page')).toBeInTheDocument();
  });
});