import { useNavigate, useLocation } from 'react-router-dom';
import { BRAND } from '../config/brand';
import { BrandMark, Icon } from './Icon';
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
  const isGlossaryRoute = location.pathname === '/glossary';
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
        <button className="header-logo" onClick={() => navigate('/')} aria-label="ホームへ戻る">
          <BrandMark className="header-logo-mark" />
        </button>
        <div className="header-brand-copy">
          <h1 className="header-title">
            <button className="header-title-link" onClick={() => navigate('/')}>{BRAND.name}</button>
          </h1>
          <span className="header-subtitle">{BRAND.subtitle}</span>
        </div>
      </div>
      <nav className="header-nav">
        <button
          className={`header-nav-button ${isLearningRoute ? 'active' : ''}`}
          onClick={() => navigate('/problems')}
        >
          <span className="ui-label ui-label-compact"><Icon name="learn" /><span>学習</span></span>
        </button>
        <button
          className={`header-nav-button ${isGlossaryRoute ? 'active' : ''}`}
          onClick={() => navigate('/glossary')}
        >
          <span className="ui-label ui-label-compact"><Icon name="glossary" /><span>用語集</span></span>
        </button>
        <button
          className={`header-nav-button ${location.pathname === '/editor' ? 'active' : ''}`}
          onClick={() => navigate('/editor')}
        >
          <span className="ui-label ui-label-compact"><Icon name="editor" /><span>エディタ</span></span>
        </button>
        <button
          className={`header-nav-button ${location.pathname === '/repl' ? 'active' : ''}`}
          onClick={() => navigate('/repl')}
        >
          <span className="ui-label ui-label-compact"><Icon name="terminal" /><span>REPL</span></span>
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
            <span className="ui-label ui-label-compact"><Icon name="updates" /><span>更新通知</span></span>
          </button>
        )}
        {CONTACT_PAGE_ENABLED && (
          <button
            type="button"
            className={`header-contact-button ${isContactRoute ? 'active' : ''}`}
            onClick={handleNavigateToContact}
            aria-label="お問い合わせページへ移動する"
          >
            <span className="ui-label ui-label-compact"><Icon name="contact" /><span>お問い合わせ</span></span>
          </button>
        )}
        {COMMERCIAL_FEATURES_ENABLED && (
          <button
            type="button"
            className="header-pricing-cta"
            onClick={onOpenPricingGuide}
            aria-label="Standard プランの案内を見る"
          >
            <span className="ui-label ui-label-compact"><Icon name="spark" /><span>Standard案内</span></span>
          </button>
        )}
        <a
          href={BRAND.githubUrl}
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
