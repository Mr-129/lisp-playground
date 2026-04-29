import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="learn-welcome">
        <div className="welcome-content">
          <h2>λ Lisp Playground へようこそ</h2>
          <p>Common Lisp を対話的に学べる学習環境です。</p>
          <div className="welcome-steps">
            <div className="welcome-step">
              <span className="step-number">1</span>
              <div>
                <strong>構文ガイドを読む</strong>
                <p>まずは構文ガイドで、Common Lisp の基本構文と考え方を押さえましょう。</p>
              </div>
            </div>
            <div className="welcome-step">
              <span className="step-number">2</span>
              <div>
                <strong>問題一覧から選ぶ</strong>
                <p>問題一覧ページで、カテゴリや難易度を見ながら解きたい問題を選べます。</p>
              </div>
            </div>
            <div className="welcome-step">
              <span className="step-number">3</span>
              <div>
                <strong>コードを書いて実行</strong>
                <p>問題詳細からエディタへ進み、コードを書いて実行しながら学習します。</p>
              </div>
            </div>
          </div>
          <div className="welcome-actions">
            <button className="guide-start-button" type="button" onClick={() => navigate('/guide')}>
              📘 構文ガイドを読む
            </button>
            <button className="guide-start-button" type="button" onClick={() => navigate('/problems')}>
              📚 問題一覧を見る
            </button>
            <button className="start-coding-button" type="button" onClick={() => navigate('/editor')}>
              🖊️ フリーモードで始める
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}