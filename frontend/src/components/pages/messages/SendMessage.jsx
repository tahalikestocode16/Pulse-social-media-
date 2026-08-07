import { useState } from "react";

function SendMessage({ conversation, replyTo, onCancelReply }) {
  const [text, setText] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const response = await fetch(`/messages/${conversation._id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          replyTo: replyTo?._id || null,
        }),
      });
      if (response.ok) {
        setText("");
        onCancelReply?.();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
    if (e.key === 'Escape' && replyTo) {
      onCancelReply?.();
    }
  };

  const isReplyValid = replyTo && typeof replyTo === "object" && typeof replyTo.text === "string";

  return (
    <div className="sendMessageWrapper">
      {/* Reply preview strip */}
      {isReplyValid && (
        <div className="replyPreviewBar">
          <div className="replyPreviewContent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points="9 17 4 12 9 7" />
              <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
            </svg>
            <div>
              <span className="replyPreviewAuthor">Replying to {replyTo.sender?.username || "User"}</span>
              <span className="replyPreviewText">{replyTo.text.slice(0, 60)}{replyTo.text.length > 60 ? '…' : ''}</span>
            </div>
          </div>
          <button className="replyPreviewClose" onClick={onCancelReply} aria-label="Cancel reply">✕</button>
        </div>
      )}

      <form onSubmit={onSubmit} className="sendMessageBar">
        {/* Emoji icon */}
        <button type="button" className="sendMessageIconBtn" title="Emoji">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>

        {/* Message input */}
        <input
          type="text"
          placeholder={isReplyValid ? `Reply to ${replyTo.sender?.username || "User"}...` : "Message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="sendMessageInput"
        />

        {/* Send button */}
        {text.trim() && (
          <button type="submit" className="sendMessageBtn">
            Send
          </button>
        )}
      </form>
    </div>
  );
}

export default SendMessage;