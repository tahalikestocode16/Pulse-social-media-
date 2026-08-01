import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAuthUser from "../utils/authUser.jsx";
import LeftNav from "../LeftNav.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";
import ReelsFeedModal from "../posts/ReelsFeedModal.jsx";
import Error from "../Error.jsx";

function Profile() {
  const { id } = useParams();
  const currentUser = useAuthUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("grid");
  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  // Followers / Following Modal state
  const [followModalType, setFollowModalType] = useState(null); // 'followers' | 'following' | null
  const [followList, setFollowList] = useState([]);
  const [loadingFollowList, setLoadingFollowList] = useState(false);

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const url = id ? `/profile/${id}` : "/profile/me";
      const response = await fetch(url, { credentials: "include" });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) navigate("/login");
        return;
      }
      
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPosts = async () => {
    if (!profile) return;
    setLoadingSaved(true);
    try {
      const targetId = profile._id;
      const res = await fetch(`/profile/${targetId}/saved`, { credentials: "include" });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setSavedPosts(data);
      }
    } catch (err) {
      console.log("Failed to fetch saved posts:", err);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (activeTab === "saved" && profile) {
      fetchSavedPosts();
    }
  }, [activeTab, profile]);

  const openFollowModal = async (type) => {
    if (!profile) return;
    setFollowModalType(type);
    setLoadingFollowList(true);
    try {
      const res = await fetch(`/profile/${profile._id}/${type}`, { credentials: "include" });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setFollowList(data);
      } else {
        setFollowList([]);
      }
    } catch (err) {
      console.log(`Failed to fetch ${type}:`, err);
      setFollowList([]);
    } finally {
      setLoadingFollowList(false);
    }
  };

  const handleFollow = async () => {
    if (!profile) return;
    const isFollowing = profile.followers?.includes(currentUser?._id);
    const method = isFollowing ? "DELETE" : "POST";
    const url = isFollowing ? `/profile/${profile._id}/unfollow` : `/profile/${profile._id}/follow`;

    try {
      const response = await fetch(url, { method, credentials: "include" });
      if (response.ok) {
        fetchProfile();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleListFollowToggle = async (targetUser) => {
    if (!currentUser || !targetUser) return;
    const isFollowing = targetUser.followers?.includes(currentUser._id);
    const method = isFollowing ? "DELETE" : "POST";
    const url = isFollowing ? `/profile/${targetUser._id}/unfollow` : `/profile/${targetUser._id}/follow`;

    try {
      const response = await fetch(url, { method, credentials: "include" });
      if (response.ok) {
        setFollowList(prev => prev.map(u => {
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

  const handleOpenConversation = async () => {
    if (!profile || !currentUser) return;
    try {
      const response = await fetch("/conversation", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile._id })
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/messages", { state: { selectedConvoId: data._id } });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isOwner = currentUser?._id === profile?._id;
  const isFollowing = profile?.followers?.includes(currentUser?._id);

  return (
    <div className="page" style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh', color: 'var(--text-1)' }}>
      <MobileHeader />
      <LeftNav />

      {/* Profile Reels Snap Scroll Feed Modal Overlay */}
      <ReelsFeedModal
        isOpen={selectedPostIndex !== null}
        onClose={() => setSelectedPostIndex(null)}
        posts={profile?.posts || []}
        initialIndex={selectedPostIndex || 0}
        currentUser={currentUser}
        refreshPosts={fetchProfile}
      />

      <main style={{ maxWidth: '935px', width: '100%', margin: '0 auto', padding: '30px 16px 60px 16px', boxSizing: 'border-box' }}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: 'var(--text-3)' }}>Loading profile...</div>
        ) : !profile ? (
          <Error 
            code="404"
            title="Profile Not Found"
            message="The user profile you are looking for doesn't exist, was removed, or may have changed their username."
          />
        ) : (
          <>
            {/* Instagram Profile Header */}
            <div className="profileHeaderContainer" style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '44px', flexWrap: 'wrap' }}>
              <div style={{ flexShrink: 0 }}>
                <div className="storyRing profileStoryRing" style={{ width: '150px', height: '150px', padding: '3px' }}>
                  <img 
                    src={profile.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} 
                    alt={profile.username} 
                    className="storyAvatar"
                  />
                </div>
              </div>
              
              <div className="profileInfoWrapper" style={{ flex: 1, minWidth: '280px' }}>
                <div className="profileUsernameRow" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <h1 style={{ margin: 0, fontWeight: 300, fontSize: '1.75rem', color: 'var(--text-1)' }}>{profile.username}</h1>
                  {isOwner ? (
                    <button onClick={() => navigate('/profile/edit')} className="sideRegisterBtn" style={{ padding: '7px 18px', fontSize: '0.85rem' }}>
                      Edit profile
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={handleFollow}
                        className={isFollowing ? "sideRegisterBtn" : "sideSignInBtn"}
                        style={{ padding: '7px 24px', fontSize: '0.85rem' }}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                      <button 
                        onClick={handleOpenConversation} 
                        className="sideRegisterBtn" 
                        style={{ padding: '7px 18px', fontSize: '0.85rem' }}
                      >
                        Message
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Interactive Stats Row */}
                <div className="profileStatsRow" style={{ display: 'flex', gap: '40px', marginBottom: '20px', fontSize: '1rem', color: 'var(--text-1)' }}>
                  <span><strong>{profile.posts?.length || 0}</strong> posts</span>
                  <span onClick={() => openFollowModal("followers")} style={{ cursor: 'pointer' }}>
                    <strong>{profile.followers?.length || 0}</strong> followers
                  </span>
                  <span onClick={() => openFollowModal("following")} style={{ cursor: 'pointer' }}>
                    <strong>{profile.following?.length || 0}</strong> following
                  </span>
                </div>
                
                {/* Bio Block */}
                <div style={{ fontSize: '0.92rem', lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-1)' }}>{profile.email}</div>
                  <p style={{ marginTop: '4px', whiteSpace: 'pre-wrap', color: 'var(--text-2)' }}>{profile.bio || "Digital creator & Pulse member."}</p>
                </div>
              </div>
            </div>

            {/* Profile Tab Navigation */}
            <div style={{ borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center', gap: '60px', marginBottom: '20px' }}>
              <button 
                onClick={() => setActiveTab("grid")}
                style={{
                  background: 'none',
                  border: 'none',
                  borderTop: activeTab === "grid" ? '1px solid var(--text-1)' : 'none',
                  color: activeTab === "grid" ? 'var(--text-1)' : 'var(--text-3)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  letterSpacing: '1px',
                  padding: '16px 0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                POSTS
              </button>

              <button 
                onClick={() => setActiveTab("saved")}
                style={{
                  background: 'none',
                  border: 'none',
                  borderTop: activeTab === "saved" ? '1px solid var(--text-1)' : 'none',
                  color: activeTab === "saved" ? 'var(--text-1)' : 'var(--text-3)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  letterSpacing: '1px',
                  padding: '16px 0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                SAVED
              </button>
            </div>

            {/* Posts Grid Tab */}
            {activeTab === "grid" && (
              profile.posts?.length > 0 ? (
                <div className="profileGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {profile.posts.map((post, idx) => (
                    <div 
                      key={post._id || post}
                      onClick={() => setSelectedPostIndex(idx)}
                      style={{
                        position: 'relative',
                        aspectRatio: '1 / 1',
                        background: 'var(--bg-card)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <img 
                        src={post.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80"} 
                        alt="post"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
                  <div style={{ width: '62px', height: '62px', borderRadius: '50%', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="4" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </div>
                  <h3>No Posts Yet</h3>
                  <p>When photos are shared, they will appear on this profile.</p>
                </div>
              )
            )}

            {/* Saved Posts Grid Tab */}
            {activeTab === "saved" && (
              loadingSaved ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>Loading saved posts...</div>
              ) : savedPosts.length > 0 ? (
                <div className="profileGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {savedPosts.map((post) => (
                    <div 
                      key={post._id}
                      onClick={() => navigate('/search')}
                      style={{
                        position: 'relative',
                        aspectRatio: '1 / 1',
                        background: 'var(--bg-card)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <img 
                        src={post.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80"} 
                        alt="saved post"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
                  <div style={{ width: '62px', height: '62px', borderRadius: '50%', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <h3>No Saved Posts</h3>
                  <p>Saved photos and videos will appear here.</p>
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Followers / Following List Modal Dialog */}
      {followModalType && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 20000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setFollowModalType(null)}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', textTransform: 'capitalize', color: 'var(--text-1)' }}>
                {followModalType}
              </span>
              <button 
                onClick={() => setFollowModalType(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-1)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '12px 18px' }}>
              {loadingFollowList ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-2)' }}>Loading list...</div>
              ) : followList.length > 0 ? (
                followList.map(u => (
                  <div key={u._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <Link 
                      to={`/profile/${u._id}`} 
                      onClick={() => setFollowModalType(null)}
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}
                    >
                      <img src={u.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} alt={u.username} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-1)' }}>{u.username}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{u.bio || "Pulse User"}</div>
                      </div>
                    </Link>

                    {currentUser && currentUser._id !== u._id && (
                      <button 
                        onClick={() => handleListFollowToggle(u)}
                        style={{ 
                          padding: '6px 16px', 
                          borderRadius: '8px',
                          backgroundColor: u.followers?.includes(currentUser._id) ? 'var(--bg-input)' : '#0095f6',
                          color: u.followers?.includes(currentUser._id) ? 'var(--text-1)' : '#ffffff',
                          border: u.followers?.includes(currentUser._id) ? '1px solid var(--border)' : 'none',
                          fontSize: '0.82rem', 
                          fontWeight: 700,
                          cursor: 'pointer' 
                        }}
                      >
                        {u.followers?.includes(currentUser._id) ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-3)' }}>
                  No users found in {followModalType}.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}

export default Profile;
