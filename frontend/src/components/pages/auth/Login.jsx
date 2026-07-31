import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/");
      } else {
        setError(data.message || "The username/email or password you entered is incorrect.");
      }
    } catch (err) {
      console.log(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Main Instagram Style Login Card */}
        <div style={{
          backgroundColor: '#0c0d12',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '40px 32px 32px 32px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8)',
          textAlign: 'center'
        }}>
          {/* Instagram Style Logo */}
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
          <p style={{
            color: '#9ca3af',
            fontSize: '0.92rem',
            margin: '0 0 28px 0',
            fontWeight: 500
          }}>
            Log in to see photos and videos from your friends.
          </p>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Wide Field: Username / Email */}
            <div style={{ width: '100%' }}>
              <input
                type="text"
                placeholder="Phone number, username, or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '50px',
                  padding: '12px 16px',
                  fontSize: '0.95rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  backgroundColor: '#141722',
                  color: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0095f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)'}
              />
            </div>

            {/* Wide Field: Password */}
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '50px',
                  padding: '12px 75px 12px 16px',
                  fontSize: '0.95rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  backgroundColor: '#141722',
                  color: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0095f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)'}
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#0095f6',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              )}
            </div>

            {/* Submit Button in Instagram Blue Accent */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              style={{
                width: '100%',
                height: '46px',
                backgroundColor: '#0095f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: (loading || !username || !password) ? 'default' : 'pointer',
                opacity: (loading || !username || !password) ? 0.6 : 1,
                marginTop: '6px',
                transition: 'background-color 0.2s ease, opacity 0.2s ease'
              }}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            {error && (
              <div style={{ color: '#ff4d4f', fontSize: '0.88rem', marginTop: '6px', lineHeight: 1.4 }}>
                {error}
              </div>
            )}

            {/* Instagram Style Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '18px 0 14px 0'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
              <span style={{
                padding: '0 16px',
                color: '#8e8e8e',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
            </div>

            {/* Forgot Password Link */}
            <a
              href="#forgot"
              onClick={(e) => { e.preventDefault(); alert("Please contact support to reset your password."); }}
              style={{
                color: '#0095f6',
                fontSize: '0.88rem',
                fontWeight: 500,
                textDecoration: 'none'
              }}
            >
              Forgot password?
            </a>
          </form>
        </div>

        {/* Instagram Switcher Box */}
        <div style={{
          backgroundColor: '#0c0d12',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          fontSize: '0.95rem',
          color: '#9ca3af'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#0095f6', fontWeight: 700, textDecoration: 'none' }}>
            Sign up
          </Link>
        </div>
      </div>

      {/* Subtle Footer */}
      <footer style={{ marginTop: '48px', color: '#6e7681', fontSize: '0.78rem', textAlign: 'center' }}>
        <div>Pulse © 2026 Social Network. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default Login;
