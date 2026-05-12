import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';
import { Problem } from '../types';

type PricingPageSource = 'direct' | 'header' | 'learn_empty' | 'learn_problem';

interface PricingPageProps {
  selectedProblem: Problem | null;
}

function getPricingPageSource(search: string): PricingPageSource {
  const source = new URLSearchParams(search).get('from');
  if (source === 'header' || source === 'learn_empty' || source === 'learn_problem') {
    return source;
  }

  return 'direct';
}

function getBackPath(search: string, source: PricingPageSource): string {
  const back = new URLSearchParams(search).get('back');
  if (back && back.startsWith('/')) {
    return back;
  }

  return source === 'learn_empty' || source === 'learn_problem' ? '/learn' : '/';
}

function getSummary(source: PricingPageSource): string {
  if (source === 'header') {
    return 'サイト全体の拡張方針として、入門は Free に残しつつ、より深い演習と継続支援を別プランで整理する予定です。';
  }

  if (source === 'learn_empty') {
    return '学習開始前でも、Free の先にどんな拡張を置くかが分かるよう、価格ページを先に公開準備しています。';
  }

  if (source === 'learn_problem') {
    return '今見ている学習導線の先に、より深い問題、コース横断演習、継続学習向けの補助線を追加する予定です。';
  }

  return 'Free / Standard / Supporter の役割差分を、公開前の現時点で見える範囲だけ静的に整理しています。';
}

export function PricingPage({ selectedProblem }: PricingPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const source = useMemo(() => getPricingPageSource(location.search), [location.search]);
  const backPath = useMemo(() => getBackPath(location.search, source), [location.search, source]);

  useEffect(() => {
    trackEvent('pricing_page_viewed', {
      source,
      selectedProblemId: selectedProblem?.id ?? null,
      selectedProblemTier: selectedProblem?.catalog?.tier ?? 'unknown',
    });
  }, [selectedProblem?.catalog?.tier, selectedProblem?.id, source]);

  return (
    <div className="pricing-page">
      <div className="pricing-page-container">
        <section className="pricing-guide-modal pricing-page-hero" aria-labelledby="pricing-page-title">
          <div className="pricing-guide-header">
            <div>
              <p className="pricing-guide-eyebrow">Pricing</p>
              <h2 id="pricing-page-title">Free / Standard / Supporter</h2>
            </div>
          </div>
          <p className="pricing-guide-summary">{getSummary(source)}</p>
          <div className="pricing-page-context">
            <p>
              現時点では価格の確定値や決済導線はまだ公開していません。差分と運用方針を先に見せ、購入前の確認は
              `/contact` の問い合わせ導線で受ける前提です。
            </p>
            {selectedProblem && (
              <p>
                現在の選択問題: <strong>{selectedProblem.title}</strong>
                {' / '}
                {selectedProblem.catalog?.tier === 'standard' ? 'Standard 候補' : 'Free 導線'}
              </p>
            )}
          </div>
        </section>

        <div className="pricing-guide-grid pricing-page-grid">
          <section className="pricing-guide-plan free">
            <p className="pricing-guide-plan-label">Free</p>
            <p className="pricing-page-status available">公開中</p>
            <h3>入門を止めない無料レイヤー</h3>
            <ul>
              <li>基本構文と入門コース</li>
              <li>ガイド、エディタ、REPL</li>
              <li>最初の 1 周目に必要な学習導線</li>
            </ul>
          </section>

          <section className="pricing-guide-plan standard">
            <p className="pricing-guide-plan-label">Standard</p>
            <p className="pricing-page-status planned">公開準備中</p>
            <h3>中級入口を深くする主力プラン</h3>
            <ul>
              <li>Standard 候補問題の解放</li>
              <li>コース横断の演習と詳しい解説</li>
              <li>継続利用を前提にした学習導線</li>
            </ul>
          </section>

          <section className="pricing-guide-plan supporter">
            <p className="pricing-guide-plan-label">Supporter</p>
            <p className="pricing-page-status draft">構想中</p>
            <h3>開発継続を支援する上位枠</h3>
            <ul>
              <li>早期案内や今後の改善共有</li>
              <li>継続開発を支える支援的な位置づけ</li>
              <li>内容確定前は問い合わせベースで案内</li>
            </ul>
          </section>
        </div>

        <section className="pricing-guide-modal pricing-page-note-panel">
          <p className="pricing-guide-note">
            価格ページの公開は `deploy` ブランチへ反映する前に checklist で判断します。checkout や決済は未接続のため、
            このページではプラン差分の説明と問い合わせ導線のみを扱います。
          </p>
          <div className="pricing-page-actions">
            <button type="button" className="pricing-guide-primary" onClick={() => navigate(backPath)}>
              前の画面へ戻る
            </button>
            <button
              type="button"
              className="pricing-page-secondary"
              onClick={() => {
                trackEvent('contact_cta_clicked', {
                  placement: 'pricing_page',
                  channel: 'route',
                  purpose: 'pre_purchase',
                });
                navigate('/contact');
              }}
            >
              購入前の質問をする
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}