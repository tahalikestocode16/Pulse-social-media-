import { useState } from "react";

// Reply quote icon SVG
const ReplyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 17 4 12 9 7" />
    <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
  </svg>
);

function Message({ _id, text, sender, currentUser, isEdited, replyTo, createdAt, onReply }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [editedMessage, setEditedMessage] = useState(text);
  const isOwner = currentUser?._id === sender?._id;

  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const deleteMessage = async () => {
    try {
      await fetch(`/messages/${_id}`, { method: "DELETE", credentials: "include" });
    } catch (err) {
      console.log(err);
    }
  };

  const saveEdit = async () => {
    if (!editedMessage.trim() || editedMessage === text) {
      setIsEditing(false);
      return;
    }
    try {
      const res = await fetch(`/messages/${_id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editedMessage }),
      });
      if (res.ok) setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedMessage(text);
  };

  const isReplyValid = replyTo && typeof replyTo === "object" && typeof replyTo.text === "string";

  return (
    <div
      className={`messageBubbleRow ${isOwner ? "messageBubbleRow--sent" : "messageBubbleRow--received"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar for received messages */}
      {!isOwner && (
        <img
          src={sender?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
          alt={sender?.username || "User"}
          className="messageSenderAvatar"
        />
      )}

      <div className="messageBubbleGroup">
        {/* Reply quote preview */}
        {isReplyValid && (
          <div className={`messageReplyQuote ${isOwner ? "messageReplyQuote--sent" : ""}`}>
            <span className="messageReplyQuoteAuthor">{replyTo.sender?.username || "User"}</span>
            <span className="messageReplyQuoteText">{replyTo.text.slice(0, 80)}{replyTo.text.length > 80 ? '…' : ''}</span>
          </div>
        )}

        <div className={`messageBubble ${isOwner ? "messageBubble--sent" : "messageBubble--received"}`}>
          {isEditing ? (
            <div className="messageEditArea">
              <textarea
                className="messageEditTextarea"
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                  if (e.key === 'Escape') cancelEdit();
                }}
                autoFocus
                rows={2}
              />
              <div className="messageEditActions">
                <button className="messageEditSave" onClick={saveEdit}>Save</button>
                <button className="messageEditCancel" onClick={cancelEdit}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="messageText">{text}</div>
              <div className="messageMeta">
                <span className="messageTime">{formattedTime}</span>
                {isEdited && <span className="messageEdited">· edited</span>}
              </div>
            </>
          )}
        </div>

        {/* Hover action row */}
        {!isEditing && showActions && (
          <div className={`messageActions ${isOwner ? "messageActions--sent" : "messageActions--received"}`}>
            <button
              className="messageActionBtn"
              onClick={() => onReply?.({ _id, text, sender })}
              title="Reply"
            >
              <ReplyIcon />
            </button>
            {isOwner && (
              <>
                <button className="messageActionBtn" onClick={() => setIsEditing(true)} title="Edit">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button className="messageActionBtn messageActionBtn--danger" onClick={deleteMessage} title="Delete">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;