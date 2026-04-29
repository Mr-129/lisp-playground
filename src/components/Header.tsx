import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLearningRoute =
    location.pathname === '/problems' ||
    location.pathname === '/learn' ||
    location.pathname === '/guide';

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
