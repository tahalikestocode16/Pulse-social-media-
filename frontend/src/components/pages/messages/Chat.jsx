import { useEffect, useState, useRef } from "react";
import socket from "../../../socket";
import Message from "./Message.jsx";
import SendMessage from "./SendMessage.jsx";
import useAuthUser from "../utils/authUser.jsx";

function Chat({ conversation, onBack }) {
  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const currentUser = useAuthUser();
  const messagesEndRef = useRef(null);

  const partner = conversation?.participants?.find(p => p._id !== currentUser?._id)
    || conversation?.participants?.[0];

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minHeight: 0 }}>
      {/* Header — Call buttons removed */}
      <div className="chatHeader">
        <div className="chatRecipient">
          {onBack && (
            <button
              onClick={onBack}
              className="chatBackBtn"
              aria-label="Back to conversations"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          <div className="chatRecipientAvatarWrap">
            <img
              src={partner?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
              alt={partner?.username}
              className="chatRecipientAvatar"
            />
            <span className="chatOnlineDot" />
          </div>
          <div>
            <div className="chatRecipientName">{partner?.username || "Pulse User"}</div>
            <div className="chatRecipientStatus">Active now</div>
          </div>
        </div>

        {/* Info button only — call buttons removed */}
        <button className="chatInfoBtn" aria-label="Conversation info">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="messagesContainer">
        {messages.length === 0 ? (
          <div className="messagesEmpty">
            <div className="messagesEmptyAvatar">
              <img
                src={partner?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                alt={partner?.username}
              />
            </div>
            <div className="messagesEmptyName">{partner?.username || "Pulse User"}</div>
            <p className="messagesEmptyHint">Send a message to start the conversation</p>
          </div>
        ) : (
          messages.map((m) => (
            <Message
              key={m._id}
              {...m}
              currentUser={currentUser}
              onReply={(msg) => setReplyTo(msg)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Message Bar */}
      <SendMessage
        conversation={conversation}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}

export default Chat;
