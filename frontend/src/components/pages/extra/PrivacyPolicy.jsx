import LeftNav from "../LeftNav.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";

function PrivacyPolicy() {
  return (
    <div className="page" style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh', color: 'var(--text-1)' }}>
      <MobileHeader />
      <LeftNav />

      <main style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '40px 20px 100px 20px', boxSizing: 'border-box' }}>
        {/* Editorial Article Header */}
        <div style={{ marginBottom: '36px', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ backgroundColor: 'rgba(0, 149, 246, 0.15)', color: '#0095f6', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
              LEGAL & PRIVACY
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>5 min read • Updated July 2026</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.25, margin: '0 0 16px 0', letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
            Pulse Privacy Policy & Data Commitment
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80" 
              alt="Pulse Team" 
              style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #0095f6' }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)' }}>Pulse Safety & Trust Team</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>Official Platform Guidelines</div>
            </div>
          </div>
        </div>

        {/* Editorial Article Content */}
        <article style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-1)' }}>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.7, color: 'var(--text-1)', fontWeight: 500 }}>
            At Pulse, we believe your privacy is fundamental to creating a safe, expressive social community. 
            This Privacy Policy outlines how we collect, protect, and respect your personal information.
          </p>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', margin: '28px 0', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#0095f6', fontSize: '1.2rem' }}>Core Data Principles</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Zero Unnecessary Tracking:</strong> We only collect data necessary to provide a vibrant feed and real-time direct messaging.</li>
              <li><strong>End-to-End Control:</strong> You own your photos, videos, and comments. You can edit or delete them anytime.</li>
              <li><strong>No Data Sales:</strong> We never sell your personal data or private messages to third-party data brokers.</li>
            </ul>
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '36px', marginBottom: '16px', color: 'var(--text-1)' }}>
            1. Information We Collect
          </h2>
          <p style={{ color: 'var(--text-2)' }}>
            When you create an account on Pulse, we collect basic account details including your chosen username, email address, profile picture, and bio. 
            When you post photos, videos, or send messages, content is securely processed to deliver real-time social interactions across web and mobile apps.
          </p>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '36px', marginBottom: '16px', color: 'var(--text-1)' }}>
            2. How Your Data Is Used
          </h2>
          <p style={{ color: 'var(--text-2)' }}>
            We utilize your information to deliver your personal home feed, enable real-time messaging via websockets, recommend creators in Explore, and highlight active story rings around user avatars.
          </p>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '36px', marginBottom: '16px', color: 'var(--text-1)' }}>
            3. Account Security & Storage
          </h2>
          <p style={{ color: 'var(--text-2)' }}>
            All passwords are encrypted using industry-standard salted hashes. Sessions are protected with HTTP-only security cookies to keep your account safe across desktop and mobile devices.
          </p>
        </article>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default PrivacyPolicy;
