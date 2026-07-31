import { useState } from "react";
import { useParams } from "react-router-dom";
import useAuthUser from "../utils/authUser.jsx";

function AddComment(props) {
  const [comment, setComment] = useState("");
  const { id: paramId } = useParams();
  const postId = props.postId || paramId;
  const user = useAuthUser();

  const addCom = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await fetch(`/posts/${postId}/comment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: comment }),
      });
      const data = await response.json();
      if (response.ok) {
        setComment("");
        if (props.onCommentAdded) {
          props.onCommentAdded();
        }
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={addCom} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
      {/* Small User Avatar */}
      <img
        src={user?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
        alt={user?.username || "Avatar"}
        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />

      {/* Borderless Seamless Input */}
      <input
        type="text"
        value={comment}
        placeholder="Add a comment..."
        onChange={(e) => setComment(e.target.value)}
        required
        style={{
          flex: 1,
          background: 'none',
          border: 'none',
          color: 'var(--text-1)',
          fontSize: '0.88rem',
          outline: 'none',
          padding: '4px 0'
        }}
      />

      {/* Concise Blue Text Post Button */}
      <button
        type="submit"
        disabled={!comment.trim()}
        style={{
          background: 'none',
          border: 'none',
          color: comment.trim() ? 'var(--text-blue)' : 'var(--text-3)',
          fontWeight: 700,
          fontSize: '0.85rem',
          cursor: comment.trim() ? 'pointer' : 'default',
          padding: '0 4px',
          opacity: comment.trim() ? 1 : 0.4,
          transition: 'opacity 0.15s ease'
        }}
      >
        Post
      </button>
    </form>
  );
}

export default AddComment;