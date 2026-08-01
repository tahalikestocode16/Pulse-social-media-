import LeftNav from "../LeftNav.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";
import { Link } from "react-router-dom";

const BLOG_POSTS = [
  {
    id: "post-1",
    category: "PRODUCT UPDATES",
    title: "Introducing Dark Mode Accents, Infinite Explore & Real-Time Pulse",
    date: "July 31, 2026",
    author: "Pulse Engineering",
    readTime: "4 min read",
    summary: "We're excited to announce major UI upgrades on Pulse! Experience darker aesthetic accents, infinite scrolling explore feed, dynamic blue story rings, and real-time messaging.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "post-2",
    category: "CREATOR TIPS",
    title: "5 Visual Storytelling Techniques for High Engagement",
    date: "July 28, 2026",
    author: "Sarah Jenkins • Design Lead",
    readTime: "6 min read",
    summary: "Discover how to leverage grid composition, moody dark accents, and active story rings to build an engaged community around your visual brand on Pulse.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "post-3",
    category: "COMMUNITY & SAFETY",
    title: "How Pulse Keeps Your Direct Messages and Media Safe",
    date: "July 25, 2026",
    author: "Pulse Security Team",
    readTime: "5 min read",
    summary: "A deep dive into our end-to-end security architecture, session protection, and content safety tools designed to keep your social experience respectful.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80"
  }
];

function Blog() {
  return (
    <div className="page" style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh', color: 'var(--text-1)' }}>
      <MobileHeader />
      <LeftNav />

      <main style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '40px 20px 100px 20px', boxSizing: 'border-box' }}>
        {/* Blog Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ backgroundColor: 'rgba(0, 149, 246, 0.15)', color: '#0095f6', padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '1px' }}>
            PULSE EDITORIAL & BLOG
          </span>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, margin: '16px 0 12px 0', letterSpacing: '-0.03em', color: 'var(--text-1)' }}>
            Insights, Updates & Creator Stories
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-2)', maxWidth: '560px', margin: '0 auto' }}>
            News from the team building Pulse, creative guides, and platform updates.
          </p>
        </div>

        {/* Featured Blog Post */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', marginBottom: '40px', boxShadow: 'var(--shadow-md)' }}>
          <img src={BLOG_POSTS[0].image} alt="Featured" style={{ width: '100%', height: '320px', objectFit: 'cover' }} />
          <div style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ color: '#0095f6', fontWeight: 700, fontSize: '0.8rem' }}>{BLOG_POSTS[0].category}</span>
              <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>• {BLOG_POSTS[0].date} • {BLOG_POSTS[0].readTime}</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 12px 0', color: 'var(--text-1)' }}>
              {BLOG_POSTS[0].title}
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              {BLOG_POSTS[0].summary}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-1)' }}>{BLOG_POSTS[0].author}</span>
            </div>
          </div>
        </div>

        {/* Blog Post List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {BLOG_POSTS.slice(1).map(post => (
            <div key={post.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
              <img src={post.image} alt={post.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ color: '#0095f6', fontWeight: 700, fontSize: '0.78rem', marginBottom: '8px' }}>{post.category}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text-1)', lineHeight: 1.4 }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                  {post.summary}
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                  {post.author} • {post.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default Blog;
