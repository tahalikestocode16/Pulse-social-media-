import LeftNav from "../LeftNav.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";

function Terms() {
  return (
    <div className="page" style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh', color: 'var(--text-1)' }}>
      <MobileHeader />
      <LeftNav />

      <main style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '40px 20px 100px 20px', boxSizing: 'border-box' }}>
        {/* Editorial Article Header */}
        <div style={{ marginBottom: '36px', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ backgroundColor: 'rgba(0, 149, 246, 0.15)', color: '#0095f6', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
              TERMS OF SERVICE
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>4 min read • Effective July 2026</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.25, margin: '0 0 16px 0', letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
            Pulse Terms of Service & Community Rules
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80" 
              alt="Pulse Team" 
              style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #0095f6' }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)' }}>Pulse Editorial Team</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>Terms & Usage Agreement</div>
            </div>
          </div>
        </div>

        {/* Editorial Content */}
        <article style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-1)' }}>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.7, color: 'var(--text-1)', fontWeight: 500 }}>
            Welcome to Pulse! By accessing or using Pulse, you agree to follow these Terms of Service. 
            Our mission is to empower visual storytelling in a respectful, creative environment.
          </p>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '36px', marginBottom: '16px', color: 'var(--text-1)' }}>
            1. Community Guidelines & Respect
          </h2>
          <p style={{ color: 'var(--text-2)' }}>
            We maintain zero tolerance for harassment, hate speech, spam, or malicious content. 
            Users must treat each other with courtesy in comments, direct messages, and posts.
          </p>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '36px', marginBottom: '16px', color: 'var(--text-1)' }}>
            2. Content Ownership & Copyright
          </h2>
          <p style={{ color: 'var(--text-2)' }}>
            You retain full copyright and ownership of any media, photos, or text you upload to Pulse. 
            By sharing content publicly, you grant Pulse a non-exclusive license to host and display your media across your profile and feeds.
          </p>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '36px', marginBottom: '16px', color: 'var(--text-1)' }}>
            3. Account Responsibilities
          </h2>
          <p style={{ color: 'var(--text-2)' }}>
            You are responsible for maintaining the confidentiality of your account credentials. 
            Pulse reserves the right to suspend or terminate accounts that violate community safety standards.
          </p>
        </article>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default Terms;
