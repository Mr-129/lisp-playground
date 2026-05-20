import { useNavigate } from 'react-router-dom';
import { BrandMark, Icon } from '../components/Icon';
import { BRAND } from '../config/brand';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="learn-welcome">
        <div className="welcome-content">
          <div className="welcome-brand">
            <div className="welcome-brand-shell">
              <BrandMark className="welcome-brand-mark" />
            </div>
            <div>
              <p className="welcome-eyebrow">{BRAND.eyebrow}</p>
              <h2>{BRAND.homeTitle}</h2>
            </div>
          </div>
          <p>{BRAND.description}</p>
          <p className="welcome-subcopy">構文ガイドで理解し、問題で確かめ、エディタと REPL で手を動かしながら学べます。</p>
          <div className="welcome-steps">
            <div className="welcome-step">
              <span className="step-number">1</span>
              <div>
                <strong>構文ガイドで理解する</strong>
                <p>まずは構文ガイドで、Common Lisp の基本構文と考え方を日本語で押さえましょう。</p>
              </div>
            </div>
            <div className="welcome-step">
              <span className="step-number">2</span>
              <div>
                <strong>問題で確かめる</strong>
                <p>問題一覧から選んで、理解した内容を演習で確かめながら定着させます。</p>
              </div>
            </div>
            <div className="welcome-step">
              <span className="step-number">3</span>
              <div>
                <strong>エディタと REPL で試す</strong>
                <p>問題詳細やフリーモードからコードを書き、実行しながら理解を深められます。</p>
              </div>
            </div>
          </div>
          <div className="welcome-actions">
            <button className="guide-start-button" type="button" onClick={() => navigate('/guide')}>
              <span className="ui-label"><Icon name="guide" /><span>はじめに構文ガイド</span></span>
            </button>
            <button className="guide-start-button" type="button" onClick={() => navigate('/glossary')}>
              <span className="ui-label"><Icon name="glossary" /><span>用語集を開く</span></span>
            </button>
            <button className="guide-start-button" type="button" onClick={() => navigate('/problems')}>
              <span className="ui-label"><Icon name="problem" /><span>問題から始める</span></span>
            </button>
            <button className="start-coding-button" type="button" onClick={() => navigate('/editor')}>
              <span className="ui-label"><Icon name="editor" /><span>まずは試してみる</span></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}