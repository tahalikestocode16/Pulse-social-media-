import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Comment(props) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(props.message);
  const [liked, setLiked] = useState(false);

  const openProfile = () => {
    navigate(`/profile/${props.author?._id || ''}`);
  };

  const saveComment = async () => {
    try {
      const response = await fetch(`/comments/${props._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: editedMessage }),
      });

      if (response.ok) {
        setIsEditing(false);
        if (props.refreshComments) {
          props.refreshComments();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = async () => {
    try {
      const response = await fetch(`/comments/${props._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        if (props.refreshComments) {
          props.refreshComments();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const currentUserId = props.currentUser?._id ? props.currentUser._id.toString() : (props.currentUser ? props.currentUser.toString() : "");
  const authorId = props.author?._id ? props.author._id.toString() : (props.author ? props.author.toString() : "");
  const isOwner = currentUserId && authorId && currentUserId === authorId;
  const timeAgo = props.createdAt
    ? new Date(props.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
    : '';

  return (
    <div className="commentCardItem">
      <img
        src={props.author?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
        alt={props.author?.username}
        className="commentAvatar"
        onClick={openProfile}
        style={{ cursor: 'pointer' }}
      />

      <div className="commentContent">
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-1)',
                fontSize: '0.88rem'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={saveComment} className="sendMessageBtn" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>Save</button>
              <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: '14px', padding: '4px 12px', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <span className="commentAuthor" onClick={openProfile}>
                {props.author?.username || "Pulse User"}
              </span>{" "}
              <span className="commentText">{props.message}</span>
            </div>

            <div className="commentMeta">
              <span>{timeAgo}</span>
              <button className="commentActionBtn">Reply</button>
              {isOwner && (
                <>
                  <button onClick={() => setIsEditing(true)} className="commentActionBtn">Edit</button>
                  <button onClick={deleteComment} className="commentActionBtn">Delete</button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => setLiked(!liked)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: liked ? 'var(--red)' : 'var(--text-3)', alignSelf: 'flex-start', marginTop: '4px' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? "var(--red)" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </button>
    </div>
  );
}

export default Comment;