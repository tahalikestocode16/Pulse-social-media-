import { useState } from "react";

function SendMessage(props) {
  const [text, setText] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const response = await fetch(`/messages/${props.conversation._id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        setText("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="sendMessageBar"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        maxWidth: '100%',
        padding: '8px 16px',
        backgroundColor: 'var(--bg-input, #132042)',
        border: '1px solid var(--border, rgba(56, 189, 248, 0.2))',
        borderRadius: '24px',
        boxSizing: 'border-box',
        marginTop: 'auto'
      }}
    >
      {/* Emoji Button */}
      <button
        type="button"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-2, #94a3b8)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        title="Choose emoji"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </button>

      {/* Full-width Wide Message Input */}
      <input
        type="text"
        placeholder="Message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="sendMessageInput"
        style={{
          flex: 1,
          width: '100%',
          background: 'none',
          border: 'none',
          color: 'var(--text-1, #ffffff)',
          fontSize: '0.92rem',
          outline: 'none',
          padding: '6px 0',
          boxSizing: 'border-box'
        }}
      />

      {/* Send Button (Heart removed as requested) */}
      {text.trim() && (
        <button
          type="submit"
          className="sendMessageBtn"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-blue, #38bdf8)',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            padding: '4px 8px',
            flexShrink: 0
          }}
        >
          Send
        </button>
      )}
    </form>
  );
}

export default SendMessage;