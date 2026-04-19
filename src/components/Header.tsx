export function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <span className="header-logo">λ</span>
        <h1 className="header-title">Lisp Playground</h1>
        <span className="header-subtitle">Common Lisp 学習環境</span>
      </div>
      <div className="header-right">
        <a
          href="https://github.com/miyaz/LispEditerApp"
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
