import { useState } from "react";
import LeftNav from "../LeftNav.jsx";
import RightSidebar from "../RightSidebar.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";
import { Link } from "react-router-dom";

function About() {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1420);
  const [bookmarked, setBookmarked] = useState(false);

  const toggleLike = () => {
    if (liked) {
      setLikeCount(count => count - 1);
      setLiked(false);
    } else {
      setLikeCount(count => count + 1);
      setLiked(true);
    }
  };

  return (
    <div className="page">
      <MobileHeader />
      <LeftNav />

      {/* Main Content Column — Expands Full Available Width Between Sidebars */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '820px',
        margin: '0 auto',
        padding: '24px 16px 100px 16px',
        boxSizing: 'border-box'
      }}>
        {/* Instagram Styled Editorial Blog Post */}
        <article style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          
          {/* Article Header & Meta Bar */}
          <div style={{ padding: '32px 28px 20px 28px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              flexWrap: 'wrap'
            }}>
              <span style={{
                backgroundColor: 'rgba(0, 149, 246, 0.12)',
                color: '#0095f6',
                padding: '4px 12px',
                borderRadius: '12px'
              }}>
                ABOUT PULSE
              </span>
              <span style={{ color: 'var(--text-3)' }}>•</span>
              <span style={{ color: 'var(--text-2)' }}>August 1, 2026</span>
              <span style={{ color: 'var(--text-3)' }}>•</span>
              <span style={{ color: 'var(--text-2)' }}>3 min read</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              margin: '0 0 20px 0',
              color: 'var(--text-1)',
              letterSpacing: '-0.02em'
            }}>
              Building Pulse: Reimagining How We Connect Through Visual Media
            </h1>

            {/* Author Profile Row (Instagram Style) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#0095f6',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                P
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  The Pulse Team
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#0095f6">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
                  Official Product Blog • @pulse
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Text Body (No Graphic Picture) */}
          <div style={{
            padding: '24px 28px 32px 28px',
            fontSize: '1.02rem',
            lineHeight: 1.75,
            color: 'var(--text-1)',
            borderTop: '1px solid var(--border)'
          }}>
            <p style={{ marginTop: 0, marginBottom: '24px' }}>
              When we set out to build <strong>Pulse</strong>, we asked ourselves a fundamental question: <em>What makes social media truly meaningful?</em> The answer was simple — effortless photo sharing, instant conversations with people who matter, and a clean, distraction-free environment.
            </p>

            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              margin: '28px 0 12px 0',
              color: 'var(--text-1)',
              letterSpacing: '-0.01em',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ width: '4px', height: '18px', backgroundColor: '#0095f6', borderRadius: '2px' }} />
              1. A Feed Designed for Quality
            </h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-2)' }}>
              Visual media deserves to look its best. On Pulse, every photo and video is rendered with high fidelity, preserving crisp detail and rich color spectrums. Whether you're posting a landscape shot or a quick video moment, your content shines without destructive compression.
            </p>

            {/* Editorial Quote Block (Instagram Style) */}
            <blockquote style={{
              margin: '24px 0',
              padding: '18px 22px',
              backgroundColor: 'var(--bg-surface)',
              borderLeft: '4px solid #0095f6',
              borderRadius: '0 12px 12px 0',
              fontSize: '1.02rem',
              fontWeight: 600,
              fontStyle: 'italic',
              color: 'var(--text-1)',
              lineHeight: 1.6
            }}>
              "Social media should be a clean canvas for self-expression. Pulse puts content and community front and center."
            </blockquote>

            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              margin: '28px 0 12px 0',
              color: 'var(--text-1)',
              letterSpacing: '-0.01em',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ width: '4px', height: '18px', backgroundColor: '#a855f7', borderRadius: '2px' }} />
              2. Real-Time Chat & Stories
            </h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-2)' }}>
              Sharing isn't just about public posts. With our built-in real-time chat, instant typing indicators, and dynamic story rings, staying in touch with friends feels immediate and fluid.
            </p>

            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              margin: '28px 0 12px 0',
              color: 'var(--text-1)',
              letterSpacing: '-0.01em',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ width: '4px', height: '18px', backgroundColor: '#10b981', borderRadius: '2px' }} />
              3. Built for Every Screen & Theme
            </h2>
            <p style={{ marginBottom: 0, color: 'var(--text-2)' }}>
              Whether you use Pulse on a mobile phone, tablet, or wide desktop setup, the layout adapts fluidly. Plus, with custom dark, light, and purple themes, you can personalize your visual atmosphere anytime.
            </p>
          </div>

          {/* Article Engagement Bar (Instagram Like / Share / Bookmark) */}
          <div style={{
            padding: '16px 28px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Like Button */}
              <button
                type="button"
                onClick={toggleLike}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: liked ? '#ed4956' : 'var(--text-1)',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  padding: 0
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? '#ed4956' : 'none'} stroke={liked ? '#ed4956' : 'currentColor'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                <span>{likeCount.toLocaleString()}</span>
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={() => navigator.clipboard && navigator.clipboard.writeText(window.location.href)}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: 'var(--text-1)',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  padding: 0
                }}
                title="Copy Link"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
                <span>Share</span>
              </button>
            </div>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={() => setBookmarked(!bookmarked)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: bookmarked ? '#0095f6' : 'var(--text-1)',
                padding: 0
              }}
              title="Save Article"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill={bookmarked ? '#0095f6' : 'none'} stroke={bookmarked ? '#0095f6' : 'currentColor'} strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </button>
          </div>

        </article>

        {/* Community Call to Action Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-1)' }}>
            Join the Pulse Community
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-2)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
            Ready to explore? Create your account or check out the help center.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              backgroundColor: '#0095f6',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '10px 24px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.92rem'
            }}>
              Create Account
            </Link>
            <Link to="/help" style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-1)',
              border: '1px solid var(--border)',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.92rem'
            }}>
              Help Center
            </Link>
          </div>
        </div>

      </main>

      {/* Right Sidebar Suggestions */}
      <RightSidebar />

      <MobileBottomNav />
    </div>
  );
}

export default About;
