import { useState } from "react";

function Message(props) {
  const [isEditing, setIsEditing] = useState(false);
  const isOwner = props.currentUser?._id === props.sender?._id;
  const [editedMessage, setEditedMessage] = useState(props.text);

  const deleteMessage = async () => {
    try {
      const response = await fetch(`/messages/${props._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        console.log("deleted");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editMessage = async () => {
    try {
      const response = await fetch(`/messages/${props._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editedMessage }),
      });
      if (response.ok) {
        setIsEditing(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedMessage(props.text);
  };

  const formattedTime = props.createdAt 
    ? new Date(props.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`messageBubbleRow ${isOwner ? "messageBubbleRow--sent" : "messageBubbleRow--received"}`}>
      <div className={`messageBubble ${isOwner ? "messageBubble--sent" : "messageBubble--received"}`}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '0.88rem'
              }}
            />
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
              <button onClick={editMessage} style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Save</button>
              <button onClick={cancelEdit} style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div>{props.text}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', gap: '8px' }}>
              <span className="messageTime">{formattedTime}</span>
              {isOwner && (
                <div style={{ display: 'flex', gap: '8px', opacity: 0.8 }}>
                  <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'inherit', fontSize: '0.72rem', cursor: 'pointer', padding: 0 }}>edit</button>
                  <button onClick={deleteMessage} style={{ background: 'none', border: 'none', color: 'inherit', fontSize: '0.72rem', cursor: 'pointer', padding: 0 }}>delete</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Message;