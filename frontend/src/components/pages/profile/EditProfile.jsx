import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthUser from "../utils/authUser.jsx";
import LeftNav from "../LeftNav.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";

function EditProfile() {
  const currentUser = useAuthUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [previewPic, setPreviewPic] = useState("");
  const [fileObj, setFileObj] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setEmail(currentUser.email || "");
      setBio(currentUser.bio || "");
      setPreviewPic(currentUser.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");
    }
  }, [currentUser]);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ text: "Image size exceeds 10MB limit.", type: "error" });
        return;
      }
      setFileObj(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formData = new FormData();
      if (username && username.trim()) {
        formData.append("username", username.trim());
      }
      if (bio !== undefined && bio !== null) {
        formData.append("bio", bio);
      }
      if (email && email.trim()) {
        formData.append("email", email.trim());
      }
      if (fileObj) {
        formData.append("profilePic", fileObj);
      }
      if (previewPic && previewPic.startsWith("data:")) {
        formData.append("profilePicData", previewPic);
      }

      const response = await fetch("/profile/edit", {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Profile updated successfully! Redirecting...", type: "success" });
        setTimeout(() => {
          navigate("/profile");
        }, 600);
      } else {
        setMessage({ text: data.message || "Failed to update profile", type: "error" });
      }
    } catch (err) {
      console.log("Edit profile error:", err);
      setMessage({ text: "An error occurred while saving profile.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh', color: 'var(--text-1)' }}>
      <MobileHeader />
      <LeftNav />

      <main 
        className="feedCol"
        style={{ 
          maxWidth: '780px', 
          width: '100%', 
          margin: '0 auto', 
          padding: '32px 20px 100px 20px', 
          boxSizing: 'border-box',
          borderLeft: '1px solid var(--border)',
          borderRight: '1px solid var(--border)',
          minHeight: '100vh'
        }}
      >
        {/* Page Title Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, background: 'var(--grad-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Edit Profile
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-2)' }}>
              Customize your profile photo, username, and bio.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: 'var(--text-1)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Cancel
          </button>
        </div>

        {/* Message Banner */}
        {message.text && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontSize: '0.88rem',
              fontWeight: 600,
              backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
              border: message.type === 'error' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(34, 197, 94, 0.4)',
              color: message.type === 'error' ? '#ef4444' : '#22c55e'
            }}
          >
            {message.text}
          </div>
        )}

        {/* Edit Profile Form Box */}
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '26px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {/* Avatar Upload Banner Header */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px', 
              padding: '16px 20px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              flexWrap: 'wrap'
            }}
          >
            <div 
              style={{ 
                position: 'relative', 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                padding: '3px',
                background: 'var(--grad-story)',
                flexShrink: 0 
              }}
            >
              <img
                src={previewPic}
                alt="Profile Avatar"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: 'var(--bg-card)' }}
              />
              <label 
                htmlFor="pfpInput"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  background: '#0095f6',
                  color: '#ffffff',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px solid var(--bg-card)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '160px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-1)' }}>
                {username || "User"}
              </span>
              
              <label
                htmlFor="pfpInput"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#0095f6',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: 'fit-content'
                }}
              >
                Change Profile Photo
              </label>

              <input
                id="pfpInput"
                type="file"
                accept="image/*"
                onChange={handlePicChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Username Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-1)' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-1)',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-1)' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-1)',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Bio Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-1)' }}>
                Bio
              </label>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                {bio.length} / 150
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={150}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a brief bio..."
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-1)',
                fontSize: '0.95rem',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '12px',
              padding: '14px',
              borderRadius: '24px',
              border: 'none',
              background: 'var(--grad-main)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(0, 149, 246, 0.4)',
              transition: 'transform 0.15s ease, opacity 0.15s ease'
            }}
          >
            {loading ? "Saving Changes..." : "Save Profile"}
          </button>
        </form>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default EditProfile;
