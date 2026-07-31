import LeftNav from "../LeftNav.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="page" style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh', color: 'var(--text-1)' }}>
      <MobileHeader />
      <LeftNav />

      <main style={{ maxWidth: '840px', width: '100%', margin: '0 auto', padding: '40px 20px 100px 20px', boxSizing: 'border-box' }}>
        {/* Editorial Hero Banner */}
        <div style={{ textAlign: 'center', padding: '40px 20px', marginBottom: '40px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}>
          <span style={{ backgroundColor: 'rgba(0, 149, 246, 0.15)', color: '#0095f6', padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '1px' }}>
            ABOUT PULSE
          </span>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, margin: '20px 0 16px 0', letterSpacing: '-0.03em', color: 'var(--text-1)' }}>
            Empowering Modern Visual Expression
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
            Pulse is built for creators, photographers, and friends who want a clean, fast, and privacy-first visual social network.
          </p>

          <Link to="/register" style={{ backgroundColor: '#0095f6', color: '#ffffff', textDecoration: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', display: 'inline-block' }}>
            Join the Community
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📸</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--text-1)' }}>High-Res Feeds</h3>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
              Share photos and videos without destructive compression. Experience media in rich dark mode colors.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚡</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--text-1)' }}>Real-Time Chat & Stories</h3>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
              Message friends with instant socket updates, and share daily moments with dynamic blue story rings.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--text-1)' }}>Explore & Discover</h3>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
              Discover trending visual content, filter by interest categories, and connect with accounts worldwide.
            </p>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default About;
