import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LeftNav from "../LeftNav.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";
import useAuthUser from "../utils/authUser.jsx";

function EditPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const currentUser = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/posts/${id}`, { credentials: "include" });
        const data = await response.json();
        if (response.ok && data) {
          setPost(data);
          setContent(data.title || data.content || "");
        } else {
          setError(data.message || "Post not found");
        }
      } catch (err) {
        console.error("Error loading post for edit:", err);
        setError("Failed to load post.");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const onSubmit = async (event) => {
    if (event) event.preventDefault();
    if (!content.trim()) {
      setError("Post caption cannot be empty.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: content,
          content: content,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = "/";
      } else {
        setError(data.message || "Failed to update post.");
      }
    } catch (err) {
      console.error("Edit post error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh', color: 'var(--text-1)' }}>
      <div className="mobileHeaderOnly">
        <MobileHeader />
      </div>

      <LeftNav />

      <main style={{
        maxWidth: '840px',
        width: '100%',
        margin: '24px auto',
        padding: '0 16px 100px 16px',
        boxSizing: 'border-box'
      }}>
        {/* Instagram Styled Edit Post Container */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header Bar */}
          <div style={{
            height: '52px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            backgroundColor: 'var(--bg-card)'
          }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-1)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Cancel"
            >
              ✕
            </button>

            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-1)' }}>
              Edit post
            </span>

            <button
              type="button"
              onClick={onSubmit}
              disabled={loading || !content.trim()}
              style={{
                background: 'none',
                border: 'none',
                color: content.trim() ? '#0095f6' : 'var(--text-3)',
                fontWeight: 700,
                fontSize: '0.98rem',
                cursor: content.trim() ? 'pointer' : 'default',
                padding: '6px 12px'
              }}
            >
              {loading ? "Saving..." : "Done"}
            </button>
          </div>

          {fetching ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-2)' }}>Loading post details...</div>
          ) : (
            <form onSubmit={onSubmit} style={{ margin: 0 }}>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                minHeight: '360px'
              }}>
                {/* Media Display Pane */}
                <div style={{
                  flex: '1 1 360px',
                  minHeight: '300px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRight: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {post?.mediaType === "video" ? (
                    <video src={post.mediaUrl} controls style={{ width: '100%', maxHeight: '420px', objectFit: 'contain' }} />
                  ) : (
                    <img src={post?.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"} alt="Media preview" style={{ width: '100%', maxHeight: '420px', objectFit: 'contain' }} />
                  )}
                </div>

                {/* Caption Right Pane */}
                <div style={{
                  flex: '1 1 320px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-card)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={post?.author?.profilePic || currentUser?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                        alt={post?.author?.username || "User"}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-1)' }}>
                        {post?.author?.username || currentUser?.username}
                      </span>
                    </div>

                    <textarea
                      placeholder="Write a caption..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={6}
                      maxLength={2200}
                      style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--text-1)',
                        fontSize: '1rem',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: 'inherit',
                        lineHeight: 1.5
                      }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>
                        {content.length}/2,200
                      </span>
                    </div>
                  </div>

                  <div>
                    {error && (
                      <div style={{ color: 'var(--red)', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'center' }}>
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !content.trim()}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#0095f6',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: content.trim() ? 'pointer' : 'default',
                        opacity: content.trim() ? 1 : 0.5
                      }}
                    >
                      {loading ? "Saving Changes..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default EditPost;