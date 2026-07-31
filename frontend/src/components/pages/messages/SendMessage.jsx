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
    <form onSubmit={onSubmit} className="sendMessageBar">
      <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: '4px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </button>

      <input
        type="text"
        placeholder="Message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="sendMessageInput"
      />

      {text.trim() ? (
        <button type="submit" className="sendMessageBtn">
          Send
        </button>
      ) : (
        <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: '4px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      )}
    </form>
  );
}

export default SendMessage;