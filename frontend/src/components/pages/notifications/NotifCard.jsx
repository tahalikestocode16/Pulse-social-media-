import { useNavigate } from "react-router-dom";

function NotifCard(props) {
  const { notification } = props;
  const navigate = useNavigate();

  const formattedTime = notification?.createdAt
    ? new Date(notification.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
    : '';

  const getActionText = () => {
    switch (notification?.type) {
      case 'like':
        return 'liked your post.';
      case 'comment':
        return 'commented on your post.';
      case 'follow':
        return 'started following you.';
      default:
        return 'interacted with your profile.';
    }
  };

  return (
    <div className="notifCardItem">
      <div 
        className="notifAvatarRing"
        onClick={() => navigate(`/profile/${notification?.sender?._id || ''}`)}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={notification?.sender?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
          alt="avatar"
          className="notifAvatarImg"
        />
      </div>

      <div className="notifTextInfo">
        <span 
          className="notifUsername"
          onClick={() => navigate(`/profile/${notification?.sender?._id || ''}`)}
          style={{ cursor: 'pointer' }}
        >
          {notification?.sender?.username || "Pulse User"}
        </span>
        <span>{getActionText()}</span>
        <span style={{ color: 'var(--text-3)', marginLeft: '8px', fontSize: '0.78rem' }}>
          {formattedTime}
        </span>
      </div>

      {notification?.post?.mediaUrl ? (
        <img
          src={notification.post.mediaUrl}
          alt="post thumbnail"
          style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0, cursor: 'pointer' }}
          onClick={() => navigate(`/posts`)}
        />
      ) : (
        <button
          onClick={() => navigate(`/profile/${notification?.sender?._id || ''}`)}
          style={{
            background: 'var(--grad-main)',
            border: 'none',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.8rem',
            padding: '6px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          View
        </button>
      )}
    </div>
  );
}

export default NotifCard;