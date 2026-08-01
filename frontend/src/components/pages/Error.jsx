import { useNavigate, useRouteError, Link } from "react-router-dom";

function Error({ code, title, message }) {
  const navigate = useNavigate();
  const routeError = useRouteError();

  const displayCode = code || (routeError?.status ? String(routeError.status) : "404");
  const displayTitle = title || (routeError?.statusText || "Something went wrong");
  const displayMsg = message || (routeError?.data?.message || routeError?.message || "The page or resource you are looking for doesn't exist, was moved, or an unexpected error occurred.");

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-base, #070e20)',
      color: 'var(--text-1, #f3f4f6)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Pulse Themed Error Card */}
        <div style={{
          backgroundColor: 'var(--bg-card, #0f172a)',
          border: '1px solid var(--border, rgba(255, 255, 255, 0.12))',
          borderRadius: '20px',
          padding: '40px 32px 36px 32px',
          boxShadow: 'var(--shadow-md, 0 12px 40px rgba(0, 0, 0, 0.8))',
          textAlign: 'center'
        }}>
          {/* Logo */}
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 900,
            color: 'var(--text-1, #ffffff)',
            letterSpacing: '-1.5px',
            margin: '0 0 8px 0'
          }}>
            pulse
          </h1>
          
          <div style={{
            fontSize: '4.2rem',
            fontWeight: 900,
            background: 'var(--grad-main, linear-gradient(135deg, #0095f6 0%, #7c3aed 100%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '8px 0 4px 0',
            letterSpacing: '-2px'
          }}>
            {displayCode}
          </div>

          <h2 style={{
            color: 'var(--text-1, #ffffff)',
            fontSize: '1.25rem',
            fontWeight: 700,
            margin: '0 0 8px 0'
          }}>
            {displayTitle}
          </h2>

          <p style={{
            color: 'var(--text-2, #9ca3af)',
            fontSize: '0.92rem',
            lineHeight: 1.5,
            margin: '0 0 28px 0',
            fontWeight: 500
          }}>
            {displayMsg}
          </p>

          <button
            onClick={() => navigate("/")}
            style={{
              width: '100%',
              height: '46px',
              backgroundColor: 'var(--text-blue, #0095f6)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '24px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(0, 149, 246, 0.3)',
              transition: 'transform 0.15s ease, opacity 0.15s ease'
            }}
          >
            Back to Home
          </button>
        </div>

        {/* Support Link Card */}
        <div style={{
          backgroundColor: 'var(--bg-card, #0f172a)',
          border: '1px solid var(--border, rgba(255, 255, 255, 0.12))',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: 'var(--text-2, #9ca3af)'
        }}>
          Need help? <Link to="/help" style={{ color: 'var(--text-blue, #0095f6)', fontWeight: 600, textDecoration: 'none' }}>Visit Help Center</Link>
        </div>
      </div>
    </div>
  );
}

export default Error;