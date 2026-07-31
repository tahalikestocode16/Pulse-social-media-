import { useNavigate } from "react-router-dom";

function AuthModal({ isOpen, onClose, actionName = "interact" }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "380px",
          backgroundColor: "#0c0d12",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          borderRadius: "16px",
          padding: "28px 24px",
          textAlign: "center",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.9)",
          position: "relative",
          animation: "fadeUp 0.2s ease both"
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "14px",
            right: "16px",
            background: "none",
            border: "none",
            color: "#9ca3af",
            fontSize: "1.1rem",
            cursor: "pointer"
          }}
        >
          ✕
        </button>

        <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0095f6", marginBottom: "8px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          pulse
        </div>

        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "6px", color: "#ffffff" }}>
          Log In to Continue
        </h3>

        <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: "20px", lineHeight: 1.45 }}>
          Please log in or create an account to {actionName} on Pulse.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => { onClose(); navigate("/login"); }}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: "10px",
              backgroundColor: "#0095f6",
              color: "#ffffff",
              border: "none",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Log In
          </button>

          <button
            onClick={() => { onClose(); navigate("/register"); }}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: "10px",
              background: "#141722",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              color: "#ffffff",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
