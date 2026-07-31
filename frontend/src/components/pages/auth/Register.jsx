import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/");
      } else {
        setError(data.message || "Failed to create account. Please check your details.");
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
        {/* Main Instagram Style Register Card */}
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
            margin: '0 0 10px 0',
            fontFamily: "system-ui, -apple-system, sans-serif"
          }}>
            pulse
          </h1>
          
          <p style={{
            color: '#9ca3af',
            fontSize: '0.95rem',
            fontWeight: 600,
            margin: '0 0 24px 0',
            lineHeight: 1.45
          }}>
            Sign up to see photos and videos from your friends.
          </p>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Wide Field: Email / Mobile */}
            <div style={{ width: '100%' }}>
              <input
                type="email"
                placeholder="Mobile number or email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0095f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)'}
              />
            </div>

            {/* Wide Field: Username */}
            <div style={{ width: '100%' }}>
              <input
                type="text"
                placeholder="Username"
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
                  transition: 'border-color 0.2s ease'
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

            <p style={{ fontSize: '0.76rem', color: '#8e8e8e', margin: '4px 0', lineHeight: 1.45, textAlign: 'center' }}>
              People who use our service may have uploaded your contact information to Pulse. <a href="#privacy" style={{ color: '#0095f6', textDecoration: 'none' }}>Learn More</a>
            </p>

            <p style={{ fontSize: '0.76rem', color: '#8e8e8e', margin: '0 0 4px 0', lineHeight: 1.45, textAlign: 'center' }}>
              By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
            </p>

            {error && (
              <div style={{ color: '#ff4d4f', fontSize: '0.88rem', marginTop: '4px', lineHeight: 1.4 }}>
                {error}
              </div>
            )}

            {/* Submit Button in Instagram Blue Accent */}
            <button
              type="submit"
              disabled={loading || !username || !email || !password}
              style={{
                width: '100%',
                height: '46px',
                backgroundColor: '#0095f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: (loading || !username || !email || !password) ? 'default' : 'pointer',
                opacity: (loading || !username || !email || !password) ? 0.6 : 1,
                marginTop: '4px',
                transition: 'background-color 0.2s ease, opacity 0.2s ease'
              }}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
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
          Have an account?{' '}
          <Link to="/login" style={{ color: '#0095f6', fontWeight: 700, textDecoration: 'none' }}>
            Log in
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

export default Register;