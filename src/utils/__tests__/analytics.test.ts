// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearTrackedEvents,
  initializeAnalytics,
  readTrackedEvents,
  registerAnalyticsTransport,
  resetAnalyticsTransports,
  trackEvent,
} from '../analytics';

describe('analytics', () => {
  beforeEach(() => {
    window.location.hash = '#/learn';
    document.title = 'Analytics Test';
    window.dataLayer = [];
    delete window.gtag;
    document.querySelectorAll('script[data-ga4-id]').forEach((element) => element.remove());
    clearTrackedEvents();
    resetAnalyticsTransports();
  });

  it('initializeAnalytics で GA4 script と gtag config を準備する', () => {
    initializeAnalytics('G-TEST1234');

    const script = document.querySelector('script[data-ga4-id="G-TEST1234"]') as HTMLScriptElement | null;

    expect(script).not.toBeNull();
    expect(script?.src).toContain('https://www.googletagmanager.com/gtag/js?id=G-TEST1234');
    expect(window.gtag).toBeTypeOf('function');
    expect(window.dataLayer).toEqual([
      ['js', expect.any(Date)],
      ['config', 'G-TEST1234', { send_page_view: false }],
    ]);
  });

  it('trackEvent でイベントを queue と dataLayer に保存する', () => {
    const event = trackEvent('problem_viewed', {
      problemId: 'basic-01',
      category: '基本構文',
      difficulty: 'beginner',
      tier: 'free',
    });

    expect(readTrackedEvents()).toHaveLength(1);
    expect(readTrackedEvents()[0]).toMatchObject({
      name: 'problem_viewed',
      payload: { problemId: 'basic-01' },
      context: { path: '/learn', hash: '#/learn', title: 'Analytics Test' },
    });
    expect(window.dataLayer).toEqual([
      expect.objectContaining({
        event: 'problem_viewed',
        problemId: 'basic-01',
        path: '/learn',
      }),
    ]);
    expect(event.name).toBe('problem_viewed');
  });

  it('gtag があれば GA4 event 形式でも送信する', () => {
    window.gtag = vi.fn();

    trackEvent('pricing_cta_clicked', {
      placement: 'header',
      selectedProblemId: null,
      selectedProblemTier: 'unknown',
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'pricing_cta_clicked', expect.objectContaining({
      placement: 'header',
      page_path: '/learn',
      page_title: 'Analytics Test',
    }));
  });

  it('registerAnalyticsTransport で追加 transport にも配送できる', () => {
    const transport = vi.fn();
    const unregister = registerAnalyticsTransport(transport);

    trackEvent('repl_command_executed', {
      inputLength: 7,
      historySize: 1,
      hadError: false,
      outputLength: 1,
    });

    expect(transport).toHaveBeenCalledTimes(1);
    expect(transport).toHaveBeenCalledWith(expect.objectContaining({
      name: 'repl_command_executed',
      payload: expect.objectContaining({ inputLength: 7 }),
    }));

    unregister();
    transport.mockClear();

    trackEvent('repl_command_executed', {
      inputLength: 9,
      historySize: 2,
      hadError: true,
      outputLength: 0,
    });

    expect(transport).not.toHaveBeenCalled();
  });

  it('clearTrackedEvents で queue を空にする', () => {
    trackEvent('editor_code_executed', {
      mode: 'free',
      problemId: null,
      codeLength: 12,
      hadError: false,
      passed: null,
    });

    expect(readTrackedEvents()).toHaveLength(1);

    clearTrackedEvents();

    expect(readTrackedEvents()).toEqual([]);
  });
});