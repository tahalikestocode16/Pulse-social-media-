import { useState } from "react";
import LeftNav from "../LeftNav.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";
import { Link } from "react-router-dom";

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "How do I update my profile picture, username, or bio?",
    answer: "Go to your Profile page by clicking your avatar in the left sidebar or mobile navigation, then tap 'Edit Profile'. You can upload a new photo, edit your username, email, or bio, and click 'Save Changes'. Your changes will update immediately across the entire app."
  },
  {
    id: "faq-2",
    question: "How do I switch between Dark mode, Light mode, and Beta Purple themes?",
    answer: "Click 'More' on the left navigation bar (or bottom menu on mobile), select 'Choose Theme', and pick from Beta Dark (Purple), Beta Light (Purple), Dark Mode, Light Mode, or Pulse theme. Your theme choice is saved automatically."
  },
  {
    id: "faq-3",
    question: "How do private messages work on mobile phones?",
    answer: "On mobile devices, tapping 'Messages' opens your active conversation list. Selecting any thread opens full-screen chat with instant real-time messaging via Socket.IO. Tap the '< Back' arrow in the chat header to return to your message thread list."
  },
  {
    id: "faq-4",
    question: "How do I create posts, share media, or view Pulses reels?",
    answer: "Click the '+' Create button in the sidebar or bottom navigation bar to share photos and captions. To watch full-screen short videos, tap 'Pulses' in the sidebar to open the snap-scroll video feed."
  },
  {
    id: "faq-5",
    question: "How do I report inappropriate content or block users?",
    answer: "Click the three dots (...) menu on any post card to submit a report to the moderation team. You can also visit any user's profile and tap 'Block' or 'Report' to manage your safety preferences."
  }
];

function Help() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq(prev => (prev === id ? null : id));
  };

  return (
    <div className="page" style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh', color: 'var(--text-1)' }}>
      <MobileHeader />
      <LeftNav />

      <main style={{ maxWidth: '860px', width: '100%', margin: '0 auto', padding: '40px 20px 100px 20px', boxSizing: 'border-box' }}>
        {/* Help Center Hero */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ 
            backgroundColor: 'rgba(147, 51, 234, 0.14)', 
            color: 'var(--text-blue)', 
            padding: '6px 18px', 
            borderRadius: '20px', 
            fontSize: '0.82rem', 
            fontWeight: 800, 
            letterSpacing: '1px' 
          }}>
            PULSE HELP CENTER & FAQ
          </span>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, margin: '16px 0 12px 0', letterSpacing: '-0.03em', color: 'var(--text-1)' }}>
            How can we help you today?
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-2)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            Find quick answers to common questions about your profile, themes, messaging, and account safety.
          </p>
        </div>

        {/* Support Graphic / Hero Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '40px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000&auto=format&fit=crop&q=80" 
            alt="Pulse Support Center" 
            style={{ width: '100%', height: '240px', objectFit: 'cover' }} 
          />
          <div style={{ padding: '24px 28px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-1)' }}>
              Need Additional Assistance?
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              Our support team is available 24/7. Explore our creator guidelines or check out the latest product announcements on our blog.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/blog" style={{
                backgroundColor: 'var(--text-blue)',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.88rem',
                textDecoration: 'none'
              }}>
                Visit Pulse Blog
              </Link>
              <Link to="/about" style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-1)',
                padding: '10px 20px',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '0.88rem',
                textDecoration: 'none'
              }}>
                About Pulse
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Accordions Section */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div 
                  key={faq.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-1)',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      textAlign: 'left',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <span>{faq.question}</span>
                    <span style={{ 
                      fontSize: '1.2rem', 
                      color: 'var(--text-blue)', 
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      marginLeft: '12px'
                    }}>
                      ▼
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 24px 22px 24px',
                      fontSize: '0.95rem',
                      color: 'var(--text-2)',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--border)',
                      paddingTop: '16px'
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default Help;
