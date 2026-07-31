import { useNavigate, Link } from "react-router-dom";

function Error() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
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
          backgroundColor: '#0c0d12',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '40px 32px 36px 32px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8)',
          textAlign: 'center'
        }}>
          {/* Logo */}
          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            color: '#0095f6',
            letterSpacing: '-1.5px',
            margin: '0 0 8px 0',
            fontFamily: "system-ui, -apple-system, sans-serif"
          }}>
            pulse
          </h1>
          
          <div style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #0095f6 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '8px 0 4px 0',
            letterSpacing: '-2px'
          }}>
            404
          </div>

          <h2 style={{
            color: '#ffffff',
            fontSize: '1.25rem',
            fontWeight: 700,
            margin: '0 0 8px 0'
          }}>
            Page Not Found
          </h2>

          <p style={{
            color: '#9ca3af',
            fontSize: '0.92rem',
            lineHeight: 1.5,
            margin: '0 0 28px 0',
            fontWeight: 500
          }}>
            The page you are looking for doesn't exist or may have been moved.
          </p>

          <button
            onClick={() => navigate("/")}
            style={{
              width: '100%',
              height: '46px',
              backgroundColor: '#0095f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '24px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(0, 149, 246, 0.4)',
              transition: 'transform 0.15s ease, opacity 0.15s ease'
            }}
          >
            Back to Home
          </button>
        </div>

        {/* Support Link Card */}
        <div style={{
          backgroundColor: '#0c0d12',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#9ca3af'
        }}>
          Need help? <Link to="/help" style={{ color: '#0095f6', fontWeight: 600, textDecoration: 'none' }}>Visit Help Center</Link>
        </div>
      </div>
    </div>
  );
}

export default Error;