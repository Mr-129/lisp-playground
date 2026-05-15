import { useNavigate, useLocation } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';
import { getWaitlistConfig, openWaitlistTarget } from '../utils/waitlist';
import { COMMERCIAL_FEATURES_ENABLED, CONTACT_PAGE_ENABLED, WAITLIST_ENABLED } from '../utils/siteMode';

interface HeaderProps {
  onOpenPricingGuide?: () => void;
}

export function Header({ onOpenPricingGuide = () => {} }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const waitlistConfig = WAITLIST_ENABLED
    ? getWaitlistConfig()
    : { url: null, channel: 'external_form' as const };
  const isLearningRoute =
    location.pathname === '/problems' ||
    location.pathname === '/learn' ||
    location.pathname.startsWith('/learn/') ||
    location.pathname === '/guide';
  const isContactRoute = location.pathname === '/contact';

  const handleNavigateToContact = () => {
    trackEvent('contact_cta_clicked', {
      placement: 'header',
      channel: 'route',
      purpose: 'general',
    });
    navigate('/contact');
  };

  const handleOpenWaitlist = () => {
    if (!waitlistConfig.url) {
      return;
    }

    trackEvent('waitlist_cta_clicked', {
      placement: 'header',
      channel: waitlistConfig.channel,
      selectedProblemId: null,
      selectedProblemTier: 'unknown',
    });
    openWaitlistTarget(waitlistConfig.url);
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="header-logo" onClick={() => navigate('/')} aria-label="ホームへ戻る">λ</button>
        <h1 className="header-title">
          <button className="header-title-link" onClick={() => navigate('/')}>Lisp Playground</button>
        </h1>
        <span className="header-subtitle">Common Lisp 学習環境</span>
      </div>
      <nav className="header-nav">
        <button
          className={`header-nav-button ${isLearningRoute ? 'active' : ''}`}
          onClick={() => navigate('/problems')}
        >
          📚 学習
        </button>
        <button
          className={`header-nav-button ${location.pathname === '/editor' ? 'active' : ''}`}
          onClick={() => navigate('/editor')}
        >
          🖊️ エディタ
        </button>
        <button
          className={`header-nav-button ${location.pathname === '/repl' ? 'active' : ''}`}
          onClick={() => navigate('/repl')}
        >
          🖥️ REPL
        </button>
      </nav>
      <div className="header-right">
        {WAITLIST_ENABLED && waitlistConfig.url && (
          <button
            type="button"
            className="header-waitlist-button"
            onClick={handleOpenWaitlist}
            aria-label="更新通知の仮登録を開く"
          >
            📮 更新通知
          </button>
        )}
        {CONTACT_PAGE_ENABLED && (
          <button
            type="button"
            className={`header-contact-button ${isContactRoute ? 'active' : ''}`}
            onClick={handleNavigateToContact}
            aria-label="お問い合わせページへ移動する"
          >
            ✉ お問い合わせ
          </button>
        )}
        {COMMERCIAL_FEATURES_ENABLED && (
          <button
            type="button"
            className="header-pricing-cta"
            onClick={onOpenPricingGuide}
            aria-label="Standard プランの案内を見る"
          >
            ✨ Standard案内
          </button>
        )}
        <a
          href="https://github.com/Mr-129/lisp-playground"
          target="_blank"
          rel="noopener noreferrer"
          className="header-link"
          aria-label="GitHub リポジトリ"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
