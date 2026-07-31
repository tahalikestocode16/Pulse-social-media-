import { useState, useEffect } from "react";
import NotifCard from "./NotifCard.jsx";
import LeftNav from "../LeftNav.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";

function Notifications() {
  const [notifs, setNotifs] = useState([]);

  const getNotifications = async () => {
    try {
      const response = await fetch("/notifications", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setNotifs(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className="page">
      <MobileHeader />
      <LeftNav />

      <main style={{ maxWidth: '600px', width: '100%', margin: '20px auto', padding: '0 16px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '1.4rem' }}>Notifications</h2>

        <div className="notifContainer">
          {notifs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </div>
              <h3 style={{ marginBottom: '6px' }}>Activity On Your Posts</h3>
              <p>When someone likes or comments on your posts, you'll see it here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>
                Recent Activity
              </div>
              {notifs.map((n) => (
                <NotifCard key={n._id} notification={n} />
              ))}
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default Notifications;
