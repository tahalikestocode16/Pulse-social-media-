import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Comment(props) {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(props.message);

  const openProfile = () => {
    navigate(`/profiles/${props.author._id}`);
  };

  const saveComment = async () => {
    const response = await fetch(`/comments/${props._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: editedMessage,
      }),
    });

    if (response.ok) {
      setIsEditing(false);

      if (props.refreshComments) {
        props.refreshComments();
      }
    }
  };

  const deleteComment = async () => {
    const response = await fetch(`/comments/${props._id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      if (props.refreshComments) {
        props.refreshComments();
      }
    }
  };

  const isOwner = props.currentUser?._id === props.author._id;

  return (
    <div className="commentCard">
      <h5 onClick={openProfile}>{props.author.username}</h5>

      {isEditing ? (
        <>
          <textarea
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
          />

          <button onClick={saveComment}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
        {/* show comment when isediting is false */}
          <p>{props.message}</p>

          {isOwner && (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={deleteComment}>Delete</button>
            </>
          )}
        </>
      )}

      <p>{props.createdAt}</p>
    </div>
  );
}

export default Comment;