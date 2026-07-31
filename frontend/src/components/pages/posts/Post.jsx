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

        {/* Post Options Menu */}
        {isOwner && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={getEdit} className="editBtn" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
              Edit
            </button>
            <button onClick={deletePost} className="deleteBtn" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
              Delete
            </button>
          </div>
        )}
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
    </article>
  );
}

export default Post;
