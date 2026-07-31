import { Link } from "react-router-dom";

function MobileHeader() {
  return (
    <header className="mobileHeader">
      <Link to="/" className="mobileHeaderLogo">
        Pulse
      </Link>
      <div className="mobileHeaderActions">
        <Link to="/notifications" aria-label="Notifications" style={{ color: 'var(--text-1)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </Link>
        <Link to="/messages" aria-label="Direct Messages" style={{ color: 'var(--text-1)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22l-4-9-9-4 20-7z" />
          </svg>
        </Link>
      </div>
    </header>
  );
}

export default MobileHeader;
