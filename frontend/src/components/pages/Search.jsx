import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthUser from "./utils/authUser.jsx";
import LeftNav from "./LeftNav.jsx";
import MobileHeader from "./MobileHeader.jsx";
import MobileBottomNav from "./MobileBottomNav.jsx";
import ReelsFeedModal from "./posts/ReelsFeedModal.jsx";

const DUMMY_EXPLORE = [
  { _id: "exp1", title: "Modern Dark Architecture & Design", mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80", mediaType: "image", author: { username: "alex_design", profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" }, likes: ["1", "2"] },
  { _id: "exp2", title: "Abstract Light Geometry", mediaUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80", mediaType: "image", author: { username: "art_gallery", profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" }, likes: ["1", "2", "3", "4"] },
  { _id: "exp3", title: "Future Cyber Neon Aesthetics", mediaUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80", mediaType: "image", author: { username: "tech_pulse", profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" }, likes: ["1"] },
  { _id: "exp4", title: "Minimalist Studio Workspace setup", mediaUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80", mediaType: "image", author: { username: "minimal_vibes", profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" }, likes: ["1", "2", "3"] },
  { _id: "exp5", title: "Deep Space Cosmos Visuals", mediaUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80", mediaType: "image", author: { username: "cosmos_hub", profilePic: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80" }, likes: ["1", "2", "3", "4", "5"] },
  { _id: "exp6", title: "Ocean Breeze Sunset Sunset Shore", mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80", mediaType: "image", author: { username: "traveler_joe", profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" }, likes: ["1", "2"] }
];

const CATEGORIES = ["For You", "Trending", "Design", "Tech", "Travel", "Style", "Art"];

function Search() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("For You");
  
  const [posts, setPosts] = useState(DUMMY_EXPLORE);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  const currentUser = useAuthUser();
  const navigate = useNavigate();

  // Fetch explore posts
  const fetchExplorePosts = async () => {
    try {
      const res = await fetch("/posts/fyp", { credentials: "include" });
      const data = await res.json();
      if (res.ok && Array.isArray(data) && data.length > 0) {
        setPosts(data);
      }
    } catch (err) {
      console.log("Failed to fetch explore posts:", err);
    }
  };

  // Fetch suggested users
  const fetchSuggestions = async () => {
    try {
      const res = await fetch("/users/suggestions", { credentials: "include" });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setSuggestions(data);
      }
    } catch (err) {
      console.log("Failed to fetch suggestions:", err);
    }
  };

  useEffect(() => {
    fetchExplorePosts();
    fetchSuggestions();
  }, []);

  // Live real-time user search as query changes
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setError("");
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/users/search?username=${query.trim()}`, {
          credentials: "include"
        });
        const data = await response.json();
        
        if (response.ok && data) {
          setSearchResults(Array.isArray(data) ? data : [data]);
        } else {
          setSearchResults([]);
          setError(data.message || "No matching user found");
        }
      } catch (err) {
        console.log(err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Infinite Scroll Listener for Explore Grid
  useEffect(() => {
    const handleScroll = () => {
      if (selectedPostIndex !== null) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
        setPosts(prev => [...prev, ...prev.map((p, idx) => ({ ...p, _id: `${p._id}_page_${prev.length + idx}` }))]);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedPostIndex]);

  const handleFollowToggle = async (targetUser) => {
    if (!currentUser || !targetUser) return;
    const isFollowing = targetUser.followers?.includes(currentUser._id);
    const method = isFollowing ? "DELETE" : "POST";
    const url = isFollowing ? `/profile/${targetUser._id}/unfollow` : `/profile/${targetUser._id}/follow`;

    try {
      const response = await fetch(url, { method, credentials: "include" });
      if (response.ok) {
        // Update local search results state
        setSearchResults(prev => prev.map(u => {
          if (u._id === targetUser._id) {
            const newFollowers = isFollowing 
              ? u.followers.filter(id => id !== currentUser._id)
              : [...(u.followers || []), currentUser._id];
            return { ...u, followers: newFollowers };
          }
          return u;
        }));
        // Update local suggestions state
        setSuggestions(prev => prev.map(u => {
          if (u._id === targetUser._id) {
            const newFollowers = isFollowing 
              ? u.followers.filter(id => id !== currentUser._id)
              : [...(u.followers || []), currentUser._id];
            return { ...u, followers: newFollowers };
          }
          return u;
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page" style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh', color: 'var(--text-1)' }}>
      <MobileHeader />
      <LeftNav />

      {/* Instagram Reels Style Snap-Scroll Feed Modal */}
      <ReelsFeedModal
        isOpen={selectedPostIndex !== null}
        onClose={() => setSelectedPostIndex(null)}
        posts={posts}
        initialIndex={selectedPostIndex || 0}
        currentUser={currentUser}
        refreshPosts={fetchExplorePosts}
      />

      <main style={{ maxWidth: '935px', width: '100%', margin: '0 auto', padding: '24px 16px 80px 16px', boxSizing: 'border-box' }}>
        
        {/* Full-Width Wide Search Bar */}
        <div style={{ width: '100%', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              type="text" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder="Search users on Pulse by username..."
              style={{
                width: '100%',
                height: '52px',
                padding: '12px 48px 12px 48px',
                borderRadius: '14px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-1)',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
            />
            {/* Search Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0095f6" strokeWidth="2" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>

            {/* Clear button when query exists */}
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setSearchResults([]); }}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-2)',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Live Search Results Dropdown Card */}
          {query.trim() && (
            <div style={{
              marginTop: '12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '16px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Search Results
              </div>

              {loading ? (
                <div style={{ padding: '16px', color: 'var(--text-2)', textAlign: 'center' }}>Searching users...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map(user => (
                  <div key={user._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <Link to={`/profile/${user._id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={user.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} alt={user.username} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0095f6' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.95rem' }}>{user.username}</div>
                        <div style={{ color: 'var(--text-2)', fontSize: '0.82rem' }}>{user.bio || "Pulse User"}</div>
                      </div>
                    </Link>
                    
                    {currentUser && currentUser._id !== user._id && (
                      <button 
                        onClick={() => handleFollowToggle(user)}
                        style={{ 
                          padding: '6px 18px', 
                          borderRadius: '8px',
                          backgroundColor: user.followers?.includes(currentUser._id) ? 'var(--bg-input)' : '#0095f6',
                          color: user.followers?.includes(currentUser._id) ? 'var(--text-1)' : '#ffffff',
                          border: user.followers?.includes(currentUser._id) ? '1px solid var(--border)' : 'none',
                          fontSize: '0.84rem', 
                          fontWeight: 700,
                          cursor: 'pointer' 
                        }}
                      >
                        {user.followers?.includes(currentUser._id) ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: '12px 0', color: 'var(--text-3)', textAlign: 'center', fontSize: '0.9rem' }}>
                  No user found matching "{query}"
                </div>
              )}
            </div>
          )}

          {/* Suggested Accounts Section */}
          {!query.trim() && suggestions.length > 0 && (
            <div className="suggestedAccountsBlock" style={{ marginTop: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Suggested Accounts
              </div>
              <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                {suggestions.map(user => (
                  <div key={user._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '110px', padding: '12px 8px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-input)', textAlign: 'center' }}>
                    <Link to={`/profile/${user._id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <img src={user.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} alt={user.username} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0095f6' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-1)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.username}
                      </span>
                    </Link>
                    <button 
                      onClick={() => handleFollowToggle(user)}
                      style={{ 
                        marginTop: '8px',
                        padding: '4px 12px', 
                        borderRadius: '6px',
                        backgroundColor: user.followers?.includes(currentUser?._id) ? 'transparent' : '#0095f6',
                        color: user.followers?.includes(currentUser?._id) ? 'var(--text-2)' : '#ffffff',
                        border: user.followers?.includes(currentUser?._id) ? '1px solid var(--border)' : 'none',
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        cursor: 'pointer' 
                      }}
                    >
                      {user.followers?.includes(currentUser?._id) ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Pills Header */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '20px', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                border: activeCategory === cat ? 'none' : '1px solid var(--border)',
                backgroundColor: activeCategory === cat ? '#0095f6' : 'var(--bg-card)',
                color: 'var(--text-1)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Instagram 3-Column Explore Photo Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {posts.map((item, idx) => (
            <div 
              key={`${item._id}_grid_${idx}`}
              onClick={() => setSelectedPostIndex(idx)}
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-card)',
                cursor: 'pointer',
                border: '1px solid var(--border)'
              }}
              className="exploreGridItem"
            >
              {item.mediaType === "video" ? (
                <video src={item.mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src={item.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"} alt="Explore" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}

              {/* Hover overlay with likes */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
              >
                <span>❤️ {item.likes?.length || 0}</span>
                <span>💬 Comment</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default Search;
