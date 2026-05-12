import { trackEvent } from '../utils/analytics';

const BUG_REPORT_URL = 'https://github.com/Mr-129/lisp-playground/issues/new?title=%5BBug%5D%20';
const PRE_PURCHASE_URL = 'https://github.com/Mr-129/lisp-playground/issues/new?title=%5BQuestion%5D%20';

export function ContactPage() {
  return (
    <div className="contact-page">
      <section className="contact-page-header">
        <p className="contact-page-eyebrow">Contact</p>
        <h2>お問い合わせ</h2>
        <p>
          現時点の一次窓口は GitHub issue です。不具合報告、価格公開前の質問、導入前に確認したい点を
          こちらから受け付けます。
        </p>
      </section>

      <div className="contact-page-grid">
        <section className="contact-page-card">
          <span className="contact-page-chip">Bug Report</span>
          <h3>不具合を報告する</h3>
          <p>
            再現手順、問題 ID、利用ルート、画面の状況が分かる内容を issue に残してください。
            公開された issue 上で確認と返答を行います。
          </p>
          <a
            className="contact-page-link"
            href={BUG_REPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent('contact_cta_clicked', {
                placement: 'contact_page_bug_report',
                channel: 'github_issue',
                purpose: 'bug_report',
              });
            }}
          >
            GitHub issue で不具合を報告する
          </a>
        </section>

        <section className="contact-page-card">
          <span className="contact-page-chip">Pre-Purchase</span>
          <h3>購入前の質問をする</h3>
          <p>
            価格公開前の導線、プラン差分、利用想定に関する質問も issue で一次受付します。
            金銭関連の正式公開前は、ここを暫定窓口として扱います。
          </p>
          <a
            className="contact-page-link"
            href={PRE_PURCHASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent('contact_cta_clicked', {
                placement: 'contact_page_pre_purchase',
                channel: 'github_issue',
                purpose: 'pre_purchase',
              });
            }}
          >
            GitHub issue で購入前の質問をする
          </a>
        </section>
      </div>

      <section className="contact-page-note">
        <h3>公開前の案内</h3>
        <ul>
          <li>現時点では GitHub issue を一次窓口とし、即時返信や個別サポートは未対応です。</li>
          <li>個人情報、決済情報、秘密にしたい内容は issue に書かないでください。</li>
          <li>価格や金銭関連を公開する前に、別途メール窓口や公開前チェックを整備する予定です。</li>
        </ul>
      </section>
    </div>
  );
}