import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ShareModal({ isOpen, onClose, post, currentUser }) {
  const [copied, setCopied] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sentMap, setSentMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchUsers();
    }
  }, [isOpen, currentUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/users/suggestions", { credentials: "include" });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.log("Error loading users for share modal:", err);
    }
  };

  if (!isOpen || !post) return null;

  const postUrl = `${window.location.origin}/posts/${post._id || ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendDM = async (recipient) => {
    try {
      const messageText = `Check out this post by @${post.author?.username || 'user'} on Pulse: ${postUrl}`;
      const response = await fetch(`/messages/send/${recipient._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: messageText }),
      });

      if (response.ok) {
        setSentMap(prev => ({ ...prev, [recipient._id]: true }));
      }
    } catch (err) {
      console.log("Error sending post via DM:", err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-card)'
        }}>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-1)' }}>Share Post</span>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-1)', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Copy Link Section */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, overflow: 'hidden' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0095f6" strokeWidth="2">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-1)' }}>Copy post link</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{postUrl}</div>
            </div>
          </div>

          <button
            onClick={handleCopyLink}
            style={{
              padding: '8px 16px',
              backgroundColor: copied ? '#10b981' : '#0095f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background-color 0.2s ease'
            }}
          >
            {copied ? "Copied ✓" : "Copy Link"}
          </button>
        </div>

        {/* Send to Direct Messages Header & Search */}
        <div style={{ padding: '14px 16px 8px 16px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-2)', marginBottom: '10px' }}>
            Send in Direct Message
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: 'var(--text-1)',
              fontSize: '0.85rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* User Search & Send List */}
        <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredUsers.length === 0 ? (
            <div style={{ fontSize: '0.82rem', color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>
              {currentUser ? "No users found" : "Log in to send DMs"}
            </div>
          ) : (
            filteredUsers.map((u) => {
              const isSent = sentMap[u._id];
              return (
                <div key={u._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={u.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                      alt={u.username}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-1)' }}>{u.username}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{u.followerCount ? `${u.followerCount} followers` : 'Pulse User'}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendDM(u)}
                    disabled={isSent}
                    style={{
                      padding: '6px 14px',
                      backgroundColor: isSent ? 'transparent' : '#0095f6',
                      color: isSent ? 'var(--text-3)' : '#ffffff',
                      border: isSent ? '1px solid var(--border)' : 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      cursor: isSent ? 'default' : 'pointer'
                    }}
                  >
                    {isSent ? "Sent ✓" : "Send"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
