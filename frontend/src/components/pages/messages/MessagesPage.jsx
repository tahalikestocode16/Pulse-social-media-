import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Chat from "./Chat.jsx";
import useAuthUser from "../utils/authUser.jsx";
import LeftNav from "../LeftNav.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";

function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const currentUser = useAuthUser();
  const location = useLocation();
  const targetConvoId = location.state?.selectedConvoId;

  const getConversations = async () => {
    try {
      const response = await fetch("/conversation", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setConversations(data);
        if (targetConvoId) {
          const matched = data.find(c => c._id === targetConvoId);
          if (matched) {
            setActiveConvo(matched);
            return;
          }
        }
        if (data.length > 0 && !activeConvo) {
          setActiveConvo(data[0]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getConversations();
  }, [targetConvoId]);

  return (
    <div className="page">
      <MobileHeader />
      <LeftNav />

      <main className={`messagesPage${activeConvo ? " hasActiveConvoMobile" : ""}`}>
        {/* Conversations Sidebar */}
        <aside className="conversationsSidebar">
          <div className="conversationsHeader">
            <span>{currentUser?.username || "Messages"}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>

          <div className="convoList">
            {conversations.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3)' }}>
                No active conversations yet
              </div>
            ) : (
              conversations.map((convo) => {
                const partner = convo.participants?.find(p => p._id !== currentUser?._id) || convo.participants?.[0];
                const isActive = activeConvo?._id === convo._id;

                return (
                  <div
                    key={convo._id}
                    className={`convoItem ${isActive ? "active" : ""}`}
                    onClick={() => setActiveConvo(convo)}
                  >
                    <div className="convoAvatar">
                      <img
                        src={partner?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                        alt={partner?.username}
                        className="convoAvatarImg"
                      />
                      <span className="convoStatusDot"></span>
                    </div>

                    <div className="convoDetails">
                      <div className="convoUsername">{partner?.username || "Pulse Member"}</div>
                      <div className="convoLastMsg">{convo.lastMessage?.text || "Active message thread"}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Active Chat Main Area */}
        <section className="chatMain">
          {activeConvo ? (
            <Chat conversation={activeConvo} onBack={() => setActiveConvo(null)} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </div>
              <h3>Your Messages</h3>
              <p>Send private photos and messages to a friend or group.</p>
            </div>
          )}
        </section>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default MessagesPage;
