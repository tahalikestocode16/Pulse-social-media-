import { Link, useLocation } from "react-router-dom";

function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="mobileBottomNav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99999 }}>
      <Link to="/" className={`mobileBottomNavBtn ${pathname === "/" ? "active" : ""}`} aria-label="Home">
        <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
        </svg>
      </Link>

      <Link to="/search" className={`mobileBottomNavBtn ${pathname === "/search" ? "active" : ""}`} aria-label="Search">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
      </Link>

      <Link to="/pulses" className={`mobileBottomNavBtn ${pathname === "/pulses" ? "active" : ""}`} aria-label="Pulses">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="2" width="20" height="20" rx="4" />
          <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
        </svg>
      </Link>

      <Link to="/posts/create" className={`mobileBottomNavBtn ${pathname === "/posts/create" ? "active" : ""}`} aria-label="Create Post">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </Link>

      <Link to="/notifications" className={`mobileBottomNavBtn ${pathname === "/notifications" ? "active" : ""}`} aria-label="Notifications">
        <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/notifications" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </Link>

      <Link to="/profile" className={`mobileBottomNavBtn ${pathname.startsWith("/profile") ? "active" : ""}`} aria-label="Profile">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="8" r="4" />
          <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        </svg>
      </Link>
    </nav>
  );
}

export default MobileBottomNav;
