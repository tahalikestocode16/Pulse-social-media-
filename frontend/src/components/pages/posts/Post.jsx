import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../auth/AuthModal.jsx";
import ShareModal from "./ShareModal.jsx";

function Post(props) {
  const [likes, setLikes] = useState(props.likes || []);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Spam or misleading");
  const [reportSuccessMsg, setReportSuccessMsg] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [modalAction, setModalAction] = useState("interact");
  const navigate = useNavigate();

  const currentUserId = props.currentUser?._id || props.currentUser;

  const isLiked = props.currentUser ? likes.some(id => {
    const rawId = typeof id === 'object' ? (id._id || id.toString()) : id;
    return rawId === currentUserId;
  }) : false;

  const handleRequireAuth = (action) => {
    setModalAction(action);
    setAuthModalOpen(true);
  };

  const addLike = async () => {
    if (!props.currentUser) {
      handleRequireAuth("like posts");
      return;
    }

    // Optimistic UI update for instant feedback
    const currentlyLiked = isLiked;
    setLikes(prev => {
      if (currentlyLiked) {
        return prev.filter(id => {
          const rawId = typeof id === 'object' ? (id._id || id.toString()) : id;
          return rawId !== currentUserId;
        });
      } else {
        return [...prev, currentUserId];
      }
    });

    try {
      const response = await fetch(`/posts/${props._id}/like`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.likes) {
        setLikes(data.likes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openComment = () => {
    navigate(`/posts/${props._id}/comment`);
  };

  const getEdit = () => {
    navigate(`/posts/${props._id}/edit`);
  };

  const deletePost = async () => {
    try {
      const response = await fetch(`/posts/${props._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        if (props.refreshPosts) {
          props.refreshPosts();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const savePost = async () => {
    if (!props.currentUser) {
      handleRequireAuth("save posts");
      return;
    }
    try {
      const response = await fetch(`/posts/${props._id}/save`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setSaved(!!data.saved);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitReport = async () => {
    if (!props.currentUser) {
      handleRequireAuth("report posts");
      return;
    }

    setReportLoading(true);
    try {
      const response = await fetch("/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetType: "Post",
          targetId: props._id,
          reason: reportReason,
          description: `Reported post ${props._id} for ${reportReason}`
        })
      });

      if (response.ok) {
        setReportSuccessMsg("Thank you! Report submitted for review.");
        setTimeout(() => {
          setReportModalOpen(false);
          setReportSuccessMsg("");
        }, 1600);
      }
    } catch (err) {
      console.log("Report submit error:", err);
    } finally {
      setReportLoading(false);
    }
  };

  const handleInlineCommentSubmit = async (e) => {
    e.preventDefault();
    if (!props.currentUser) {
      handleRequireAuth("comment");
      return;
    }
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`/posts/${props._id}/comment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: commentText }),
      });
      if (response.ok) {
        setCommentText("");
        openComment();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isOwner = props.currentUser && props.author?._id === props.currentUser._id;

  return (
    <article className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        actionName={modalAction} 
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        post={props}
        currentUser={props.currentUser}
      />

      {/* Instagram Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => navigate(`/profile/${props.author?._id || ''}`)}
        >
          <div className="storyRing storyRing--user" style={{ width: '38px', height: '38px' }}>
            <img 
              src={props.author?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} 
              alt={props.author?.username} 
              className="storyAvatar" 
            />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-1)' }}>
              {props.author?.username || "Pulse User"}
            </div>
          </div>
        </div>

        {/* Three Dots (...) Options Button */}
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-1)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '6px 8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Post options"
          title="Options"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Media Block with Double Tap Like */}
      <div onDoubleClick={addLike} style={{ background: '#000', position: 'relative', width: '100%' }}>
        {props.mediaType === "image" && props.mediaUrl && (
          <img src={props.mediaUrl} alt="post" style={{ width: '100%', display: 'block', maxHeight: '580px', objectFit: 'cover' }} />
        )}
        {props.mediaType === "video" && props.mediaUrl && (
          <video
            src={props.mediaUrl}
            controls
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            controlsList="nofullscreen noremoteplayback"
            disablePictureInPicture
            style={{ width: '100%', display: 'block', maxHeight: '580px', objectFit: 'cover' }}
          />
        )}
      </div>

      {/* Instagram Action Icons Row */}
      <div style={{ padding: '12px 16px 8px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Heart / Like Icon */}
            <button 
              onClick={addLike} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: isLiked ? 'var(--red)' : 'var(--text-1)' }}
              aria-label="Like"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? "var(--red)" : "none"} stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>

            {/* Comment Icon */}
            <button 
              onClick={openComment} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-1)' }}
              aria-label="Comment"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </button>

            {/* Share / DM Icon */}
            <button 
              onClick={() => setShareModalOpen(true)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-1)' }}
              aria-label="Share"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>

          {/* Bookmark / Save Icon */}
          <button 
            onClick={savePost} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-1)' }}
            aria-label="Save"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
        </div>

        {/* Likes Count */}
        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-1)', marginBottom: '6px' }}>
          {likes.length} {likes.length === 1 ? 'like' : 'likes'}
        </div>

        {/* Caption */}
        <div style={{ fontSize: '0.88rem', color: 'var(--text-1)', lineHeight: 1.4, marginBottom: '6px' }}>
          <span style={{ fontWeight: 700, marginRight: '8px', cursor: 'pointer' }} onClick={() => navigate(`/profile/${props.author?._id || ''}`)}>
            {props.author?.username}
          </span>
          {props.title}
        </div>

        {/* View Comments Link */}
        <button 
          onClick={openComment} 
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-3)', fontSize: '0.8rem', cursor: 'pointer', marginBottom: '8px' }}
        >
          View all comments
        </button>

        {/* Ultra-compact Instagram Inline Comment Bar */}
        <form 
          onSubmit={handleInlineCommentSubmit} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
            paddingTop: '8px',
            marginTop: '2px',
            height: '32px',
            boxShadow: 'none',
            background: 'transparent'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0095f6" strokeWidth="1.8" style={{ flexShrink: 0, cursor: 'pointer' }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>

          <input 
            type="text" 
            placeholder="Add a comment..." 
            value={commentText} 
            onChange={(e) => setCommentText(e.target.value)}
            style={{ 
              flex: 1, 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-1)', 
              fontSize: '0.82rem', 
              outline: 'none',
              padding: '0'
            }}
          />

          <button 
            type="submit" 
            disabled={!commentText.trim()}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: commentText.trim() ? '#0095f6' : 'var(--text-3)', 
              fontWeight: 700, 
              fontSize: '0.82rem', 
              cursor: commentText.trim() ? 'pointer' : 'default',
              padding: 0,
              opacity: commentText.trim() ? 1 : 0.4,
              transition: 'opacity 0.15s ease'
            }}
          >
            Post
          </button>
        </form>
      </div>

      {/* Three Dots Action Sheet Modal */}
      {menuOpen && (
        <div 
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '380px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <button
              onClick={() => { setMenuOpen(false); setReportModalOpen(true); }}
              style={{
                padding: '16px',
                border: 'none',
                borderBottom: '1px solid var(--border)',
                background: 'none',
                color: 'var(--red)',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Report Post
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => { setMenuOpen(false); getEdit(); }}
                  style={{
                    padding: '16px',
                    border: 'none',
                    borderBottom: '1px solid var(--border)',
                    background: 'none',
                    color: 'var(--text-1)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  Edit Post
                </button>
                <button
                  onClick={() => { setMenuOpen(false); deletePost(); }}
                  style={{
                    padding: '16px',
                    border: 'none',
                    borderBottom: '1px solid var(--border)',
                    background: 'none',
                    color: 'var(--red)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  Delete Post
                </button>
              </>
            )}

            <button
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '16px',
                border: 'none',
                background: 'none',
                color: 'var(--text-2)',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Report Submission Modal */}
      {reportModalOpen && (
        <div 
          onClick={() => setReportModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '420px',
              padding: '24px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-1)' }}>Report Post</h3>
              <button 
                onClick={() => setReportModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {reportSuccessMsg ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--green)', fontWeight: 700, fontSize: '0.95rem' }}>
                {reportSuccessMsg}
              </div>
            ) : (
              <>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                  Why are you reporting this post? Your report is anonymous and helps keep Pulse safe.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    "Spam or misleading",
                    "Inappropriate or explicit media",
                    "Harassment or hate speech",
                    "Violence or dangerous content"
                  ].map((reason) => (
                    <label 
                      key={reason}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: reportReason === reason ? 'rgba(147, 51, 234, 0.12)' : 'var(--bg-input)',
                        border: '1px solid ' + (reportReason === reason ? 'var(--text-blue)' : 'var(--border)'),
                        color: 'var(--text-1)',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="reportReason" 
                        value={reason} 
                        checked={reportReason === reason} 
                        onChange={(e) => setReportReason(e.target.value)} 
                      />
                      {reason}
                    </label>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={() => setReportModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--text-1)',
                      borderRadius: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReport}
                    disabled={reportLoading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: 'var(--red)',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '12px',
                      fontWeight: 700,
                      cursor: reportLoading ? 'default' : 'pointer',
                      opacity: reportLoading ? 0.6 : 1
                    }}
                  >
                    {reportLoading ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default Post;
