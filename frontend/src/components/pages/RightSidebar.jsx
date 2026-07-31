import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthUser from "./utils/authUser.jsx";

function RightSidebar() {
  const user = useAuthUser();
  const [suggestions, setSuggestions] = useState([]);
  const [followingMap, setFollowingMap] = useState({});
  const navigate = useNavigate();

  const fetchSuggestions = async () => {
    try {
      const response = await fetch("/users/suggestions", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setSuggestions(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSuggestions();
    }
  }, [user]);

  const handleFollow = async (suggestedUser) => {
    if (!user) return;
    const currentUserId = user._id || user;
    const initialIsFollowing = Array.isArray(suggestedUser.followers)
      ? suggestedUser.followers.some(f => (typeof f === 'object' ? f._id : f) === currentUserId)
      : false;

    const isFollowing = typeof followingMap[suggestedUser._id] === 'boolean'
      ? followingMap[suggestedUser._id]
      : initialIsFollowing;

    const method = isFollowing ? "DELETE" : "POST";
    const url = `/profile/${suggestedUser._id}/${isFollowing ? "unfollow" : "follow"}`;

    setFollowingMap(prev => ({ ...prev, [suggestedUser._id]: !isFollowing }));

    try {
      await fetch(url, { method, credentials: "include" });
    } catch (err) {
      console.log("Follow error:", err);
      setFollowingMap(prev => ({ ...prev, [suggestedUser._id]: isFollowing }));
    }
  };

  return (
    <aside className="rightSidebar" style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Current Logged In User Header */}
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div className="storyRing storyRing--user" style={{ width: '44px', height: '44px', padding: '2px' }}>
              <img
                src={user.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                alt={user.username}
                className="storyAvatar"
              />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)' }}>{user.username}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{user.email || "Pulse Member"}</div>
            </div>
          </Link>
          <Link to="/profile" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-blue)', textDecoration: 'none' }}>
            Switch
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>Log in to see suggestions</span>
          <Link to="/login" className="sideSignInBtn" style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '6px' }}>Log In</Link>
        </div>
      )}

      {/* Database Suggestions Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-3)' }}>Suggested for you</span>
        <Link to="/search" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-1)', textDecoration: 'none' }}>See All</Link>
      </div>

      {/* Database Suggested Users List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {suggestions.length === 0 ? (
          <div style={{ fontSize: '0.82rem', color: 'var(--text-3)', padding: '10px 0' }}>
            {user ? "No new user suggestions available" : "Log in to discover users"}
          </div>
        ) : (
          suggestions.map((su) => {
            const currentUserId = user?._id || user;
            const initialIsFollowing = Array.isArray(su.followers)
              ? su.followers.some(f => (typeof f === 'object' ? f._id : f) === currentUserId)
              : false;

            const isFollowing = typeof followingMap[su._id] === 'boolean'
              ? followingMap[su._id]
              : initialIsFollowing;

            return (
              <div key={su._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div 
                  onClick={() => navigate(`/profile/${su._id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                >
                  <img
                    src={su.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                    alt={su.username}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-1)' }}>{su.username}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
                      {su.followerCount ? `${su.followerCount} followers` : "Suggested user"}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleFollow(su)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isFollowing ? 'var(--text-2)' : 'var(--text-blue)',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Links */}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.8, marginTop: '12px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About</Link> ·
          <Link to="/help" style={{ color: 'inherit', textDecoration: 'none' }}>Help</Link> ·
          <Link to="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link> ·
          <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</Link> ·
          <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</Link>
        </div>
        <div style={{ marginTop: '8px' }}>© 2026 PULSE SOCIAL MEDIA</div>
      </div>
    </aside>
  );
}

export default RightSidebar;