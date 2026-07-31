import Comment from "./CommentCard.jsx";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddComment from "./AddComment.jsx";
import LeftNav from "../LeftNav.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";
import useAuthUser from "../utils/authUser.jsx";

function CommentSection() {
  const currentUser = useAuthUser();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const getPostDetails = async () => {
    try {
      const response = await fetch(`/posts/${id}`, { credentials: "include" });
      const data = await response.json();
      if (response.ok) {
        setPost(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getComments = async () => {
    try {
      let response = await fetch(`/posts/${id}/comments`, { credentials: "include" });
      if (!response.ok) {
        response = await fetch(`/comments/${id}`, { credentials: "include" });
      }
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setComments(data);
      }
    } catch (err) {
      console.log("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    getPostDetails();
    getComments();
  }, [id]);

  return (
    <div className="page">
      <MobileHeader />
      <LeftNav />

      <main style={{ maxWidth: '935px', width: '100%', margin: '20px auto', padding: '0 16px 60px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <button onClick={() => navigate(-1)} className="backBtn">
            Back
          </button>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-1)' }}>Post Thread</h2>
        </div>

        {/* Instagram Post Thread Container (Responsive Stack on Mobile, Split Grid on Desktop) */}
        <div className="postThreadContainer">
          {/* Left: Media Preview */}
          {post?.mediaUrl && (
            <div style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {post.mediaType === "video" ? (
                <video src={post.mediaUrl} controls style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }} />
              ) : (
                <img src={post.mediaUrl} alt="Post media" style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }} />
              )}
            </div>
          )}

          {/* Right: Author Header, Comments Scroll List, & Sticky Bottom AddComment */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-surface)' }}>
            {/* Header */}
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                className="storyRing storyRing--user"
                style={{ width: '38px', height: '38px', cursor: 'pointer' }}
                onClick={() => navigate(`/profile/${post?.author?._id || ''}`)}
              >
                <img 
                  src={post?.author?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                  alt={post?.author?.username}
                  className="storyAvatar"
                />
              </div>
              <div style={{ flex: 1 }}>
                <div 
                  style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)', cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${post?.author?._id || ''}`)}
                >
                  {post?.author?.username || "Pulse User"}
                </div>
                {post?.title && <div style={{ fontSize: '0.82rem', color: 'var(--text-2)', marginTop: '2px' }}>{post.title}</div>}
              </div>
            </div>

            {/* Scrollable Comments Thread */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {comments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: '4px' }}>No comments yet.</div>
                  Start the conversation.
                </div>
              ) : (
                comments.map((comment) => (
                  <Comment
                    key={comment._id}
                    _id={comment._id}
                    author={comment.author}
                    message={comment.message}
                    createdAt={comment.createdAt}
                    currentUser={currentUser}
                    refreshComments={getComments}
                  />
                ))
              )}
            </div>

            {/* Bottom Sticky Add Comment Bar */}
            <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <AddComment postId={id} onCommentAdded={getComments} />
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default CommentSection;
