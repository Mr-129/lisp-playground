export interface AnalyticsContext {
  path: string;
  hash: string;
  title: string;
}

export interface AnalyticsEventPayloadMap {
  problem_viewed: {
    problemId: string;
    category: string;
    difficulty: string;
    tier: 'free' | 'standard' | 'unknown';
  };
  learning_search_used: {
    query: string;
    mode: 'problem' | 'guide';
    guideResultCount: number;
    selectedProblemId: string | null;
  };
  editor_code_executed: {
    mode: 'guided' | 'free';
    problemId: string | null;
    codeLength: number;
    hadError: boolean;
    passed: boolean | null;
  };
  problem_solved: {
    problemId: string;
    category: string;
    difficulty: string;
    tier: 'free' | 'standard' | 'unknown';
  };
  repl_command_executed: {
    inputLength: number;
    historySize: number;
    hadError: boolean;
    outputLength: number;
  };
  pricing_cta_clicked: {
    placement: 'header' | 'learn_empty' | 'learn_problem';
    selectedProblemId: string | null;
    selectedProblemTier: 'free' | 'standard' | 'unknown';
  };
  pricing_page_viewed: {
    source: 'direct' | 'header' | 'learn_empty' | 'learn_problem';
    selectedProblemId: string | null;
    selectedProblemTier: 'free' | 'standard' | 'unknown';
  };
  contact_cta_clicked: {
    placement: 'header' | 'pricing_page' | 'contact_page_bug_report' | 'contact_page_pre_purchase';
    channel: 'route' | 'github_issue';
    purpose: 'general' | 'bug_report' | 'pre_purchase';
  };
  waitlist_cta_clicked: {
    placement: 'header' | 'learn_empty' | 'learn_problem';
    channel: 'github_issue' | 'external_form';
    selectedProblemId: string | null;
    selectedProblemTier: 'free' | 'standard' | 'unknown';
  };
}

export type AnalyticsEventName = keyof AnalyticsEventPayloadMap;

export interface AnalyticsEvent<Name extends AnalyticsEventName = AnalyticsEventName> {
  name: Name;
  payload: AnalyticsEventPayloadMap[Name];
  occurredAt: string;
  context: AnalyticsContext;
}

export type AnalyticsTransport = (event: AnalyticsEvent) => void;

declare global {
  interface Window {
    __lispPlaygroundAnalyticsQueue?: AnalyticsEvent[];
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initializedGaMeasurementId: string | null = null;

function getAnalyticsContext(): AnalyticsContext {
  if (typeof window === 'undefined') {
    return {
      path: '/',
      hash: '',
      title: '',
    };
  }

  const hash = window.location.hash || '';

  return {
    path: hash ? hash.replace(/^#/, '') || '/' : window.location.pathname || '/',
    hash,
    title: document.title,
  };
}

function getAnalyticsQueue(): AnalyticsEvent[] {
  if (typeof window === 'undefined') {
    return [];
  }

  if (!window.__lispPlaygroundAnalyticsQueue) {
    window.__lispPlaygroundAnalyticsQueue = [];
  }

  return window.__lispPlaygroundAnalyticsQueue;
}

function getAnalyticsPageLocation(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.href;
}

function toGa4Parameters(event: AnalyticsEvent): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries({
      ...event.payload,
      page_path: event.context.path,
      page_title: event.context.title,
      page_location: getAnalyticsPageLocation(),
    }).filter(([, value]) => value !== undefined && value !== null)
  );
}

function ensureGtagStub(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dataLayer ??= [];

  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }
}

export function initializeAnalytics(gaMeasurementId?: string | null): void {
  if (typeof window === 'undefined' || !gaMeasurementId) {
    return;
  }

  ensureGtagStub();

  const existingScript = document.querySelector(`script[data-ga4-id="${gaMeasurementId}"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`;
    script.setAttribute('data-ga4-id', gaMeasurementId);
    document.head.appendChild(script);
  }

  if (initializedGaMeasurementId === gaMeasurementId) {
    return;
  }

  window.gtag?.('js', new Date());
  window.gtag?.('config', gaMeasurementId, {
    send_page_view: false,
  });
  initializedGaMeasurementId = gaMeasurementId;
}

const defaultTransport: AnalyticsTransport = (event) => {
  if (typeof window === 'undefined') {
    return;
  }

  getAnalyticsQueue().push(event);

  window.dataLayer?.push({
    event: event.name,
    ...event.payload,
    path: event.context.path,
    occurredAt: event.occurredAt,
  });

  window.gtag?.('event', event.name, toGa4Parameters(event));

  window.dispatchEvent(new CustomEvent('lisp-playground:analytics', {
    detail: event,
  }));
};

const transports = new Set<AnalyticsTransport>([defaultTransport]);

export function trackEvent<Name extends AnalyticsEventName>(
  name: Name,
  payload: AnalyticsEventPayloadMap[Name],
): AnalyticsEvent<Name> {
  const event: AnalyticsEvent<Name> = {
    name,
    payload,
    occurredAt: new Date().toISOString(),
    context: getAnalyticsContext(),
  };

  transports.forEach((transport) => {
    transport(event);
  });

  return event;
}

export function registerAnalyticsTransport(transport: AnalyticsTransport): () => void {
  transports.add(transport);

  return () => {
    transports.delete(transport);
  };
}

export function resetAnalyticsTransports(): void {
  transports.clear();
  transports.add(defaultTransport);
  initializedGaMeasurementId = null;
}

export function readTrackedEvents(): AnalyticsEvent[] {
  return getAnalyticsQueue().slice();
}

export function clearTrackedEvents(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.__lispPlaygroundAnalyticsQueue = [];
}