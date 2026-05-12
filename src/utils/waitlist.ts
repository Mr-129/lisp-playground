export type WaitlistChannel = 'github_issue' | 'external_form';

export interface WaitlistConfig {
  url: string | null;
  channel: WaitlistChannel;
}

const WAITLIST_URL_META_NAME = 'lisp-playground-waitlist-url';

function inferWaitlistChannel(url: string): WaitlistChannel {
  return /github\.com\/[^/]+\/[^/]+\/issues\/new/i.test(url) ? 'github_issue' : 'external_form';
}

function isSupportedWaitlistUrl(url: string): boolean {
  return url.startsWith('https://') || url.startsWith('http://') || url.startsWith('mailto:');
}

export function getWaitlistConfig(doc?: Document): WaitlistConfig {
  const currentDocument = doc ?? (typeof document !== 'undefined' ? document : null);

  if (!currentDocument) {
    return {
      url: null,
      channel: 'external_form',
    };
  }

  const meta = currentDocument.querySelector(`meta[name="${WAITLIST_URL_META_NAME}"]`) as HTMLMetaElement | null;
  const url = meta?.content.trim() ?? '';

  if (!url || !isSupportedWaitlistUrl(url)) {
    return {
      url: null,
      channel: 'external_form',
    };
  }

  return {
    url,
    channel: inferWaitlistChannel(url),
  };
}

export function openWaitlistTarget(url: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}