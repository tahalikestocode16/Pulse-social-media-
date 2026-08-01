import { useEffect, useState, useRef } from "react";
import socket from "../../../socket";
import Message from "./Message.jsx";
import SendMessage from "./SendMessage.jsx";
import useAuthUser from "../utils/authUser.jsx";

function Chat({ conversation, onBack }) {
  const [messages, setMessages] = useState([]);
  const currentUser = useAuthUser();
  const messagesEndRef = useRef(null);

  const partner = conversation?.participants?.find(p => p._id !== currentUser?._id) || conversation?.participants?.[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!conversation?._id) return;

    socket.emit("joinConversation", conversation._id);

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    };

    const handleUpdatedMessage = (updatedMessage) => {
      setMessages((prev) =>
        prev.map((message) =>
          message._id === updatedMessage._id ? updatedMessage : message
        )
      );
    };

    const handleDeletedMessage = (deletedMessage) => {
      setMessages((prev) =>
        prev.filter((message) => message._id !== deletedMessage.messageId)
      );
    };

    socket.on("newPulse", handleNewMessage);
    socket.on("messageUpdated", handleUpdatedMessage);
    socket.on("messageDeleted", handleDeletedMessage);

    getMessages();

    return () => {
      socket.off("newPulse", handleNewMessage);
      socket.off("messageUpdated", handleUpdatedMessage);
      socket.off("messageDeleted", handleDeletedMessage);
    };
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMessages = async () => {
    try {
      const response = await fetch(`/messages/${conversation._id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Instagram Chat Header */}
      <div className="chatHeader">
        <div className="chatRecipient">
          {onBack && (
            <button 
              onClick={onBack}
              className="chatBackBtn"
              style={{ background: 'none', border: 'none', color: 'var(--text-1)', padding: '0 8px 0 0', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              aria-label="Back to conversations"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          <img
            src={partner?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
            alt={partner?.username}
            className="chatRecipientAvatar"
          />
          <div>
            <div className="chatRecipientName">{partner?.username || "Pulse User"}</div>
            <div className="chatRecipientStatus">Active now</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-1)' }}>
          <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
          </button>
          <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </button>
          <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="messagesContainer">
        {messages.map((m) => (
          <Message
            key={m._id}
            {...m}
            currentUser={currentUser}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Message Input Bar */}
      <SendMessage conversation={conversation} />
    </div>
  );
}

export default Chat;
