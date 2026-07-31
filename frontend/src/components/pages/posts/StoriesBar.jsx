import { useState, useEffect } from "react";
import useAuthUser from "../utils/authUser.jsx";

const FALLBACK_STORIES = [
  { _id: "1", username: "alex_design", profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", hasStory: true, storyImg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" },
  { _id: "2", username: "sarah_k", profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", hasStory: true, storyImg: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80" },
  { _id: "3", username: "dev_pulse", profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", hasStory: false },
  { _id: "4", username: "tech_insider", profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", hasStory: true, storyImg: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80" },
  { _id: "5", username: "creative_ui", profilePic: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", hasStory: false }
];

function StoriesBar() {
  const user = useAuthUser();
  const [activeStory, setActiveStory] = useState(null);
  const [topUsers, setTopUsers] = useState(FALLBACK_STORIES);

  useEffect(() => {
    const fetchTopFollowedUsers = async () => {
      try {
        const response = await fetch("/users/suggestions", { credentials: "include" });
        const data = await response.json();
        if (response.ok && Array.isArray(data) && data.length > 0) {
          // Flag users as having active stories
          const storiesData = data.map((u, index) => ({
            ...u,
            hasStory: index % 2 === 0 || u.hasStory === true,
            storyImg: u.profilePic || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
          }));
          setTopUsers(storiesData);
        }
      } catch (err) {
        console.log("Failed to load top followed stories:", err);
      }
    };

    fetchTopFollowedUsers();
  }, []);

  return (
    <div className="storiesBar">
      {/* Active Story Modal */}
      {activeStory && (
        <div 
          onClick={() => setActiveStory(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '420px',
              width: '100%',
              backgroundColor: '#0c0d12',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(0,0,0,0.6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={activeStory.profilePic || activeStory.avatar} alt={activeStory.username} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #0095f6' }} />
                <span style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.9rem' }}>{activeStory.username}</span>
              </div>
              <button 
                onClick={() => setActiveStory(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-1)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            {/* Story Image */}
            <img src={activeStory.storyImg || activeStory.profilePic} alt="Story" style={{ width: '100%', maxHeight: '540px', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      )}

      {/* Current User Story Item */}
      <div className="storyItem" onClick={() => setActiveStory({ username: user?.username || "Your story", profilePic: user?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", storyImg: user?.profilePic })}>
        <div style={{
          width: '62px',
          height: '62px',
          borderRadius: '50%',
          padding: '2px',
          background: '#0095f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <img
            src={user?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
            alt="Your story"
            style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2px solid var(--bg-base)', objectFit: 'cover' }}
          />
        </div>
        <span className="storyUsername">Your story</span>
      </div>

      {/* Top Followed Users Stories */}
      {topUsers.map(story => (
        <div 
          key={story._id} 
          className="storyItem"
          onClick={() => story.hasStory && setActiveStory(story)}
        >
          {story.hasStory ? (
            /* Blue Circle Ring if person HAS a story */
            <div style={{
              width: '62px',
              height: '62px',
              borderRadius: '50%',
              padding: '2px',
              background: '#0095f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <img 
                src={story.profilePic || story.avatar} 
                alt={story.username} 
                style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2px solid var(--bg-base)', objectFit: 'cover' }} 
              />
            </div>
          ) : (
            /* Normal Avatar without story ring if NO story */
            <div style={{
              width: '62px',
              height: '62px',
              borderRadius: '50%',
              padding: '2px',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={story.profilePic || story.avatar} 
                alt={story.username} 
                style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1px solid var(--border)', objectFit: 'cover' }} 
              />
            </div>
          )}
          <span className="storyUsername">{story.username}</span>
        </div>
      ))}
    </div>
  );
}

export default StoriesBar;
