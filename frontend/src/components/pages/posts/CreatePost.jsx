import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftNav from "../LeftNav.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";
import useAuthUser from "../utils/authUser.jsx";
import AuthModal from "../auth/AuthModal.jsx";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [altText, setAltText] = useState("");
  const [showAltTextInput, setShowAltTextInput] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const currentUser = useAuthUser();
  const navigate = useNavigate();

  const handleMediaChange = (file) => {
    if (file) {
      const maxLimit = 20 * 1024 * 1024; // 20MB limit
      if (file.size > maxLimit) {
        setError("File size exceeds 20MB limit. Please select a smaller photo or video.");
        return;
      }
      setMedia(file);
      setPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleMediaChange(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleMediaChange(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async (event) => {
    if (event) event.preventDefault();

    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (!title.trim() && !media) {
      setError("Please write a caption or select a photo/video to share.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title || "Pulse Post");
      if (location) formData.append("location", location);
      if (altText) formData.append("altText", altText);

      if (media) {
        formData.append("media", media);
      }
      if (preview && preview.startsWith("data:")) {
        formData.append("mediaData", preview);
      }

      const response = await fetch("/posts/create", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/";
      } else {
        setError(data.message || "Failed to create post");
      }
    } catch (err) {
      console.error("Post creation error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = (title.trim() || media) && !loading;

  return (
    <div className="page" style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh', color: 'var(--text-1)' }}>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        actionName="create posts"
      />

      <div className="mobileHeaderOnly">
        <MobileHeader />
      </div>

      <LeftNav />

      {/* Main Content Workspace — Centered in grid cols 2-3 */}
      <main className="createPostMain">
        {/* Card container */}
        <div className="createPostCard">
          {/* Top Modal Header Bar */}
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
              onClick={() => navigate('/')}
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
              title="Close"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-1)' }}>
              Create new post
            </span>

            <button
              type="button"
              onClick={onSubmit}
              disabled={!isFormValid}
              style={{
                background: 'none',
                border: 'none',
                color: isFormValid ? '#0095f6' : 'var(--text-3)',
                fontWeight: 700,
                fontSize: '0.98rem',
                cursor: isFormValid ? 'pointer' : 'default',
                padding: '6px 12px',
                transition: 'color 0.2s ease'
              }}
            >
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>

          {/* Dual-Pane Content Body Form */}
          <form onSubmit={onSubmit} encType="multipart/form-data" style={{ margin: 0 }}>
            <div className="createPostDualPane">
              {/* Media Upload / Preview Left Pane */}
              <div
                className="createPostMediaPane"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  backgroundColor: dragActive ? 'var(--bg-input)' : 'var(--bg-surface)',
                  transition: 'background-color 0.2s ease'
                }}
              >
                {preview ? (
                  <div style={{ width: '100%', height: '100%', minHeight: '340px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    {media?.type?.startsWith('video') ? (
                      <video src={preview} controls style={{ width: '100%', maxHeight: '480px', objectFit: 'contain' }} />
                    ) : (
                      <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '480px', objectFit: 'contain' }} />
                    )}

                    {/* Discard Media Button */}
                    <button
                      type="button"
                      onClick={() => { setMedia(null); setPreview(null); }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        width: '34px',
                        height: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Remove media"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px 20px',
                    cursor: 'pointer',
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box'
                  }}>
                    {/* Compact Instagram Media Icon */}
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0095f6" strokeWidth="1.5" style={{ marginBottom: '12px' }}>
                      <rect x="2" y="3" width="20" height="18" rx="4" />
                      <circle cx="8.5" cy="8.5" r="1.8" />
                      <path d="M21 15l-5-5L5 21" strokeWidth="1.5" />
                    </svg>

                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: '12px', textAlign: 'center' }}>
                      Drag photos & videos from device
                    </div>

                    <span style={{
                      backgroundColor: '#0095f6',
                      color: '#ffffff',
                      padding: '8px 18px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      display: 'inline-block',
                      boxShadow: '0 4px 14px rgba(0, 149, 246, 0.3)'
                    }}>
                      Select from device
                    </span>

                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              {/* Caption & Metadata Right Pane */}
              <div className="createPostCaptionPane">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* User Profile Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={currentUser?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                      alt={currentUser?.username || "User"}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-1)' }}>
                        {currentUser?.username || "pulse_user"}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>
                        Public post
                      </div>
                    </div>
                  </div>

                  {/* Caption Input */}
                  <textarea
                    placeholder="Write a caption..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    rows={5}
                    maxLength={450}
                    style={{
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--text-1)',
                      fontSize: '0.98rem',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'inherit',
                      lineHeight: 1.5
                    }}
                  />

                  {/* Character Counter & Limit bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }} title="Add emoji">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0095f6" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
                        <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
                      </svg>
                    </button>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 600 }}>
                      {title.length}/450
                    </span>
                  </div>

                  {/* Location Picker Field */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setShowLocationInput(!showLocationInput)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 0',
                        cursor: 'pointer',
                        fontSize: '0.92rem',
                        fontWeight: 500
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0095f6" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {location || "Add location"}
                      </span>
                      <span style={{ color: 'var(--text-2)' }}>{showLocationInput ? "▲" : "▼"}</span>
                    </button>

                    {showLocationInput && (
                      <input
                        type="text"
                        placeholder="Type location name..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '8px 12px',
                          fontSize: '0.88rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--bg-input)',
                          color: 'var(--text-1)',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    )}
                  </div>

                  {/* Accessibility Alt Text Field */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setShowAltTextInput(!showAltTextInput)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 0',
                        cursor: 'pointer',
                        fontSize: '0.92rem',
                        fontWeight: 500
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M7 15h10M7 11h10M7 7h6" />
                        </svg>
                        {altText ? `Alt Text: ${altText.slice(0, 18)}...` : "Accessibility / Alt Text"}
                      </span>
                      <span style={{ color: 'var(--text-2)' }}>{showAltTextInput ? "▲" : "▼"}</span>
                    </button>

                    {showAltTextInput && (
                      <input
                        type="text"
                        placeholder="Write accessibility alt text for photo..."
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '8px 12px',
                          fontSize: '0.88rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--bg-input)',
                          color: 'var(--text-1)',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Error Banner & Primary Share Button */}
                <div style={{ marginTop: '16px' }}>
                  {error && (
                    <div style={{ color: 'var(--red)', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'center' }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isFormValid}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#0095f6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      cursor: isFormValid ? 'pointer' : 'default',
                      opacity: isFormValid ? 1 : 0.5,
                      boxShadow: isFormValid ? '0 4px 14px rgba(0, 149, 246, 0.4)' : 'none',
                      transition: 'opacity 0.2s ease, backgroundColor 0.2s ease'
                    }}
                  >
                    {loading ? "Sharing..." : "Share Post"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default CreatePost;