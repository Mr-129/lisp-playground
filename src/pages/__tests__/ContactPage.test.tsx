// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ContactPage } from '../ContactPage';

const { trackEventMock } = vi.hoisted(() => ({
  trackEventMock: vi.fn(),
}));

vi.mock('../../utils/analytics', () => ({
  trackEvent: trackEventMock,
}));

describe('ContactPage', () => {
  beforeEach(() => {
    trackEventMock.mockReset();
  });

  it('問い合わせページの案内文を表示する', () => {
    render(<ContactPage />);

    expect(screen.getByRole('heading', { name: 'お問い合わせ' })).toBeInTheDocument();
    expect(screen.getByText(/一次窓口は GitHub issue/)).toBeInTheDocument();
  });

  it('不具合報告リンクを表示して計測する', () => {
    render(<ContactPage />);

    const link = screen.getByRole('link', { name: 'GitHub issue で不具合を報告する' });
    fireEvent.click(link);

    expect(link).toHaveAttribute('href', expect.stringContaining('issues/new?title=%5BBug%5D%20'));
    expect(trackEventMock).toHaveBeenCalledWith('contact_cta_clicked', {
      placement: 'contact_page_bug_report',
      channel: 'github_issue',
      purpose: 'bug_report',
    });
  });

  it('購入前の質問リンクを表示して計測する', () => {
    render(<ContactPage />);

    const link = screen.getByRole('link', { name: 'GitHub issue で購入前の質問をする' });
    fireEvent.click(link);

    expect(link).toHaveAttribute('href', expect.stringContaining('issues/new?title=%5BQuestion%5D%20'));
    expect(trackEventMock).toHaveBeenCalledWith('contact_cta_clicked', {
      placement: 'contact_page_pre_purchase',
      channel: 'github_issue',
      purpose: 'pre_purchase',
    });
  });
});