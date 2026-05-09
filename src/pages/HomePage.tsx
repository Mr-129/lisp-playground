import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="learn-welcome">
        <div className="welcome-content">
          <h2>λ Lisp Playground へようこそ</h2>
          <p>Common Lisp を、日本語で学び、すぐ試し、問題で定着できる学習サイトです。</p>
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
              📘 はじめに構文ガイド
            </button>
            <button className="guide-start-button" type="button" onClick={() => navigate('/problems')}>
              📚 問題から始める
            </button>
            <button className="start-coding-button" type="button" onClick={() => navigate('/editor')}>
              🖊️ まずは試してみる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}