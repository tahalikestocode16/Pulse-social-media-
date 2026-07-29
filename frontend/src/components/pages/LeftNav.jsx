import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthUser from "./utils/authUser.jsx";

/* ─────────────────────────────────────────────────────────────
   SVG Icon — all icons drawn to match Instagram's icon set
───────────────────────────────────────────────────────────── */
const Svg = ({ children, size = 24 }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

/* Individual icon components */
const IcoPulse = () => (
  /* Camera-style Pulse logo icon */
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2" y="5" width="20" height="15" rx="3" stroke="currentColor" strokeWidth="1.75"/>
    <circle cx="12" cy="12.5" r="4" stroke="currentColor" strokeWidth="1.75"/>
    <path d="M8 5l1.5-2h5L16 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    <circle cx="18.5" cy="8" r="1" fill="currentColor"/>
  </svg>
);

const IcoHome = ({ filled }) => filled ? (
  <Svg>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill="currentColor" stroke="none"/>
    <path d="M9 21V12h6v9" stroke="#000" strokeWidth="1.75"/>
  </Svg>
) : (
  <Svg>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </Svg>
);

const IcoSearch = () => (
  <Svg>
    <circle cx="11" cy="11" r="7"/>
    <line x1="16.5" y1="16.5" x2="22" y2="22"/>
  </Svg>
);

const IcoExplore = () => (
  <Svg>
    <circle cx="12" cy="12" r="9"/>
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="currentColor" stroke="none"/>
  </Svg>
);

const IcoReels = () => (
  <Svg>
    <rect x="2" y="2" width="20" height="20" rx="4"/>
    <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none"/>
  </Svg>
);

const IcoMessages = () => (
  <Svg>
    {/* Paper-plane DM icon */}
    <path d="M22 2L11 13"/>
    <path d="M22 2L15 22l-4-9-9-4 20-7z"/>
  </Svg>
);

const IcoNotif = ({ filled }) => filled ? (
  <Svg>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor" stroke="none"/>
  </Svg>
) : (
  <Svg>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </Svg>
);

const IcoCreate = () => (
  <Svg>
    <rect x="3" y="3" width="18" height="18" rx="4"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </Svg>
);

const IcoMore = () => (
  <Svg>
    <line x1="3" y1="7" x2="21" y2="7"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="17" x2="21" y2="17"/>
  </Svg>
);

const IcoThreads = () => (
  /* Grid / apps icon */
  <Svg>
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </Svg>
);

const IcoSun = () => (
  <Svg>
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <path d="M12 1.5V4" />
    <path d="M12 20V22.5" />
    <path d="M4.5 12H7" />
    <path d="M17 12H19.5" />
    <path d="M5.6 5.6L7.7 7.7" />
    <path d="M16.3 16.3L18.4 18.4" />
    <path d="M5.6 18.4L7.7 16.3" />
    <path d="M16.3 7.7L18.4 5.6" />
  </Svg>
);

const IcoPulseAlt = () => (
  <Svg>
    <path d="M4 12h5l3-8 4 16 3-8h4" />
  </Svg>
);

const IcoMoon = () => (
  <Svg>
    <path d="M12 2a9.9 9.9 0 0 0 0 19.8 9.9 9.9 0 0 1 0-19.8z" fill="currentColor" />
  </Svg>
);

/* ─────────────────────────────────────────────────────────────
   Nav item definition
───────────────────────────────────────────────────────────── */
const NAV = [
  { to: "/",             label: "Home",          Icon: IcoHome,     filledOn: "/" },
  { to: "/search",       label: "Search",        Icon: IcoSearch },
  { to: "/explore",      label: "Explore",       Icon: IcoExplore },
  { to: "/reels",        label: "Reels",         Icon: IcoReels },
  { to: "/messages",     label: "Messages",      Icon: IcoMessages },
  { to: "/notifications",label: "Notifications", Icon: IcoNotif,    filledOn: "/notifications" },
  { to: "/posts/create", label: "Create",        Icon: IcoCreate },
];

const themeOptions = [
  { value: "pulse", label: "Pulse theme" },
  { value: "dark", label: "Dark mode" },
  { value: "light", label: "Light mode" },
];

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
function LeftNav() {
  const user = useAuthUser();
  const { pathname } = useLocation();
  const [theme, setTheme] = useState("pulse");
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const handleThemeChange = e => {
    setTheme(e.target.value);
  };

  const toggleMore = () => setMoreOpen(open => !open);

  return (
    <nav className="leftNav">
      {/* Logo */}
      <Link to="/" className="leftNavLogo" aria-label="Pulse home">
        <IcoPulse />
      </Link>

      {/* Main nav links */}
      <div className="leftNavItems">
        {NAV.map(({ to, label, Icon, filledOn }) => {
          const isActive = pathname === to;
          const isFilled = filledOn ? pathname === filledOn : false;
          return (
            <Link
              key={to}
              to={to}
              className={`leftNavBtn${isActive ? " active" : ""}`}
              aria-label={label}
              title={label}
            >
              <Icon filled={isFilled} />
              <span className="leftNavLabel">{label}</span>
            </Link>
          );
        })}

        <button
          className={`leftNavBtn leftNavBtn--plain${moreOpen ? " active" : ""}`}
          type="button"
          aria-label="More"
          title="More"
          onClick={toggleMore}
        >
          <IcoMore />
          <span className="leftNavLabel">More</span>
        </button>
      </div>

      {/* Bottom section */}
      <div className="leftNavBottom">
        {/* Profile avatar */}
        {user ? (
          <Link to="/profile" className="leftNavProfile" aria-label="Profile" title="Profile">
            <span className="leftNavAvatar">
              {user.profilePic
                ? <img src={user.profilePic} alt={user.username} className="leftNavAvatarImg" />
                : <span className="leftNavAvatarInitial">{user.username?.[0]?.toUpperCase()}</span>
              }
            </span>
            <span className="leftNavProfileInfo">
              <span className="leftNavUsername">{user.username}</span>
              <span className="leftNavEmail">{user.email || "View profile"}</span>
            </span>
          </Link>
        ) : (
          <Link to="/login" className="leftNavBtn" aria-label="Log in" title="Log in">
            <IcoHome />
            <span className="leftNavLabel">Log in</span>
          </Link>
        )}

        {/* More toggle */}
        <button
          className={`leftNavBtn leftNavBtn--plain${moreOpen ? " active" : ""}`}
          type="button"
          aria-label="More"
          title="More"
          onClick={toggleMore}
        >
          <IcoMore />
          <span className="leftNavLabel">More</span>
        </button>
      </div>

      <div className={`leftNavMorePanel${moreOpen ? " open" : ""}`} role="dialog" aria-hidden={!moreOpen}>
        <div className="leftNavMoreHeader">More</div>
        <div className="leftNavTheme">
          <label htmlFor="theme-select" className="leftNavThemeLabel">Theme</label>
          <select
            id="theme-select"
            className="leftNavThemeSelect"
            value={theme}
            onChange={handleThemeChange}
            aria-label="Choose theme"
          >
            {themeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Link to="/settings" className="leftNavMoreLink">Settings</Link>
        <Link to="/privacy" className="leftNavMoreLink">Privacy policy</Link>
        <Link to="/help" className="leftNavMoreLink">Help</Link>
      </div>
    </nav>
  );
}

export default LeftNav;
