import { useState, useRef, useEffect } from "react";
import ShareModal from "./ShareModal.jsx";
import AuthModal from "../auth/AuthModal.jsx";

function ReelVideoPlayer({ src, isActive, onDoubleClick }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log("Autoplay prevented:", err);
        });
      }
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      playsInline
      webkit-playsinline="true"
      x5-playsinline="true"
      controlsList="nofullscreen noremoteplayback"
      disablePictureInPicture
      onDoubleClick={onDoubleClick}
      onClick={(e) => {
        e.preventDefault();
        const v = e.currentTarget;
        if (v.paused) {
          v.play();
        } else {
          v.pause();
        }
      }}
      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
    />
  );
}

function ReelsFeedModal({ isOpen, onClose, posts = [], initialIndex = 0, currentUser, refreshPosts }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [likesMap, setLikesMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [activeSharePost, setActiveSharePost] = useState(null);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("interact");

  const containerRef = useRef(null);

  // IntersectionObserver to track visible post index and stop audio from previous videos
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const observerOptions = {
      root: container,
      threshold: 0.6
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          if (!isNaN(index)) {
            setCurrentIndex(index);
          }
        }
      });
    }, observerOptions);

    const children = Array.from(container.children);
    children.forEach(child => observer.observe(child));

    return () => {
      observer.disconnect();
      children.forEach(child => {
        const video = child.querySelector('video');
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
    };
  }, [isOpen, posts.length]);

  const navigateFeed = (direction) => {
    setCurrentIndex(prev => {
      const nextIndex = Math.max(0, Math.min(posts.length - 1, prev + direction));
      if (containerRef.current && containerRef.current.children[nextIndex]) {
        containerRef.current.children[nextIndex].scrollIntoView({ behavior: 'smooth' });
      }
      return nextIndex;
    });
  };

  // Keyboard navigation (ESC key to exit, Arrow keys for scroll)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        if (activeCommentPost) {
          setActiveCommentPost(null);
        } else if (activeSharePost) {
          setActiveSharePost(null);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        navigateFeed(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        navigateFeed(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeCommentPost, activeSharePost, posts.length]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      // Initialize likes map
      const initialLikes = {};
      posts.forEach(p => {
        initialLikes[p._id] = p.likes || [];
      });
      setLikesMap(initialLikes);

      // Scroll to initial index post
      setTimeout(() => {
        if (containerRef.current && containerRef.current.children[initialIndex]) {
          containerRef.current.children[initialIndex].scrollIntoView({ behavior: 'auto' });
        }
      }, 60);
    }
  }, [isOpen, initialIndex, posts]);

  if (!isOpen || !posts || posts.length === 0) return null;

  const handleLike = async (post) => {
    if (!currentUser) {
      setModalAction("like posts");
      setAuthModalOpen(true);
      return;
    }

    const currentUserId = currentUser._id || currentUser;
    const currentLikes = likesMap[post._id] || post.likes || [];
    const isLiked = currentLikes.some(id => (typeof id === 'object' ? id._id : id) === currentUserId);

    // Optimistic UI update
    const updatedLikes = isLiked
      ? currentLikes.filter(id => (typeof id === 'object' ? id._id : id) !== currentUserId)
      : [...currentLikes, currentUserId];

    setLikesMap(prev => ({ ...prev, [post._id]: updatedLikes }));

    try {
      await fetch(`/posts/${post._id}/like`, {
        method: "POST",
        credentials: "include",
      });
      if (refreshPosts) refreshPosts();
    } catch (err) {
      console.log("Error toggling like:", err);
    }
  };

  const handleSave = async (post) => {
    if (!currentUser) {
      setModalAction("save posts");
      setAuthModalOpen(true);
      return;
    }

    const isSaved = savedMap[post._id];
    setSavedMap(prev => ({ ...prev, [post._id]: !isSaved }));

    try {
      await fetch(`/profile/save/${post._id}`, {
        method: isSaved ? "DELETE" : "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("Error saving post:", err);
    }
  };

  const openComments = async (post) => {
    setActiveCommentPost(post);
    try {
      const response = await fetch(`/posts/${post._id}/comments`, { credentials: "include" });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setPostComments(data);
      }
    } catch (err) {
      console.log("Error fetching comments:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !activeCommentPost) return;
    if (!currentUser) {
      setModalAction("comment on posts");
      setAuthModalOpen(true);
      return;
    }

    try {
      const response = await fetch(`/posts/${activeCommentPost._id}/comment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: commentText }),
      });
      const data = await response.json();
      if (response.ok && data.comment) {
        setPostComments(prev => [...prev, data.comment]);
        setCommentText("");
      }
    } catch (err) {
      console.log("Error adding comment:", err);
    }
  };

  const currentUserId = currentUser?._id || currentUser;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        actionName={modalAction} 
      />

      <ShareModal 
        isOpen={!!activeSharePost} 
        onClose={() => setActiveSharePost(null)} 
        post={activeSharePost} 
        currentUser={currentUser} 
      />

      {/* Top Close Button with ESC key hint badge */}
      <button
        onClick={onClose}
        className="reelCloseBtn"
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 10005,
          background: 'var(--bg-card, #0c152e)',
          border: '1px solid var(--border, rgba(56, 189, 248, 0.2))',
          color: 'var(--text-1, #ffffff)',
          padding: '8px 16px',
          borderRadius: '24px',
          fontSize: '0.88rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(16px)',
          boxShadow: 'var(--shadow-md, 0 8px 30px rgba(0,0,0,0.8))'
        }}
        title="Close Reel Feed (Press ESC)"
      >
        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>✕</span>
        <span className="reelEscBadge" style={{ fontSize: '0.72rem', backgroundColor: 'var(--bg-input, #132042)', color: 'var(--text-blue, #38bdf8)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)' }}>ESC</span>
      </button>

      {/* Full-Screen Instagram Reel Vertical Scroll Container */}
      <div
        ref={containerRef}
        onWheel={(e) => {
          if (activeCommentPost || activeSharePost) return;
          if (Math.abs(e.deltaY) > 35) {
            navigateFeed(e.deltaY > 0 ? 1 : -1);
          }
        }}
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          backgroundColor: '#000000'
        }}
      >
        {posts.map((post, idx) => {
          const likesList = likesMap[post._id] || post.likes || [];
          const isLiked = currentUser ? likesList.some(id => (typeof id === 'object' ? id._id : id) === currentUserId) : false;
          const isSaved = savedMap[post._id];

          return (
            <div
              key={`${post._id}_reel_${idx}`}
              data-index={idx}
              style={{
                width: '100%',
                height: '100vh',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000000',
                overflow: 'hidden'
              }}
            >
              {/* Media Player */}
              {post.mediaType === "video" ? (
                <ReelVideoPlayer
                  src={post.mediaUrl}
                  isActive={idx === currentIndex}
                  onDoubleClick={() => handleLike(post)}
                />
              ) : (
                <img
                  src={post.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"}
                  alt="Post"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onDoubleClick={() => handleLike(post)}
                />
              )}

              {/* Bottom Left Author & Caption Overlay */}
              <div 
                className="reelCaptionOverlay"
                style={{
                  position: 'absolute',
                  bottom: '76px',
                  left: '14px',
                  right: '76px',
                  zIndex: 10002,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.9)'
                }}
              >
                {/* Author Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={post.author?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                    alt={post.author?.username}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid #0095f6', objectFit: 'cover' }}
                  />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                    {post.author?.username || "Pulse User"}
                  </span>
                  <button 
                    onClick={async () => {
                      if (post.author?._id && currentUser) {
                        try {
                          await fetch(`/profile/${post.author._id}/follow`, { method: 'POST', credentials: 'include' });
                        } catch(e) {}
                      }
                    }}
                    style={{
                      fontSize: '0.75rem',
                      color: '#ffffff',
                      background: 'rgba(0, 149, 246, 0.85)',
                      border: 'none',
                      padding: '4px 12px',
                      borderRadius: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    Follow
                  </button>
                </div>

                {/* Caption Title */}
                <div style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.4, fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.title}
                </div>
              </div>

              {/* Bottom Right Instagram Action Column */}
              <div
                className="reelActionColumn"
                style={{
                  position: 'absolute',
                  bottom: '76px',
                  right: '16px',
                  zIndex: 10003,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '22px'
                }}
              >
                {/* Like Icon */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => handleLike(post)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: isLiked ? '#ef4444' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill={isLiked ? "#ef4444" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </button>
                  <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600, textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>
                    {likesList.length || 0}
                  </span>
                </div>

                {/* Comment Icon */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => openComments(post)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                    </svg>
                  </button>
                  <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600, textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>
                    {postComments.length || 0}
                  </span>
                </div>

                {/* Share Icon */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => setActiveSharePost(post)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                  <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600, textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>
                    Share
                  </span>
                </div>

                {/* Save / Bookmark Icon */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => handleSave(post)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: isSaved ? '#38bdf8' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill={isSaved ? "#38bdf8" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  </button>
                </div>

                {/* Three Dots Options Icon */}
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>

                {/* Audio Avatar Thumbnail */}
                <img
                  src={post.author?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                  alt="Audio avatar"
                  style={{ width: '28px', height: '28px', borderRadius: '6px', border: '2px solid #ffffff', objectFit: 'cover' }}
                />
              </div>

              {/* Up & Down Scroll Arrows on the Far Right Side (Matching Instagram Reels 1:1) */}
              <div
                className="desktopReelArrows"
                style={{
                  position: 'fixed',
                  right: '24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  zIndex: 10005
                }}
              >
                {/* Up Arrow */}
                <button
                  onClick={() => navigateFeed(-1)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(8px)'
                  }}
                  title="Previous Post"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>

                {/* Down Arrow */}
                <button
                  onClick={() => navigateFeed(1)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(8px)'
                  }}
                  title="Next Post"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-Up Comments Drawer Overlay */}
      {activeCommentPost && (
        <div
          onClick={() => setActiveCommentPost(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 10010,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              height: '60vh',
              backgroundColor: '#0f172a',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.8)',
              overflow: 'hidden',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>Comments ({postComments.length})</span>
              <button onClick={() => setActiveCommentPost(null)} style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Comments List */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {postComments.length === 0 ? (
                <div style={{ color: '#94a3b8', textAlign: 'center', padding: '30px 0', fontSize: '0.9rem' }}>No comments yet. Start the conversation!</div>
              ) : (
                postComments.map(c => (
                  <div key={c._id} style={{ display: 'flex', gap: '10px' }}>
                    <img src={c.author?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem', marginRight: '6px' }}>{c.author?.username || "User"}</span>
                      <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>{c.message}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Add Comment Form */}
            <form onSubmit={handleAddComment} style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px', backgroundColor: '#020617' }}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ flex: 1, background: '#1e293b', border: 'none', borderRadius: '20px', padding: '10px 16px', color: '#ffffff', fontSize: '0.88rem', outline: 'none' }}
              />
              <button type="submit" disabled={!commentText.trim()} style={{ background: 'none', border: 'none', color: commentText.trim() ? '#38bdf8' : '#64748b', fontWeight: 700, fontSize: '0.88rem', cursor: commentText.trim() ? 'pointer' : 'default' }}>Post</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReelsFeedModal;
