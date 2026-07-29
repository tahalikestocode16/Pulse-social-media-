import { useState } from "react";
import { useNavigate } from "react-router-dom";
// this component wont fetch posts its a skeleton to show the posts given to it
function Post(props) {
  const [likes, setLikes] = useState(props.likes || []);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const addLike = async () => {
    //   however many likes prop has or either empty array since likes are an array in our case
    const response = await fetch(`/posts/${props._id}/like`, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
      setLikes(data.likes);
    } else {
      console.log(data.message);
    }
  };

  const openComment = () => {
    navigate(`/posts/${props._id}/comments`);
    // setup comments
  };

  const getEdit = () => {
    navigate(`/posts/${props._id}/edit`);
  };

  const deletePost = async () => {
    try {
      const response = await fetch(`/posts/${props._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        if (props.refreshPosts) {
          props.refreshPosts();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const savePost = async () => {
    try {
      const response = await fetch(`/posts/${props._id}/save`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        if (data.saved) {
          // show filled bookmark function
        } else {
          // show unfilled bookmark
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // agar current user exist karta hai to aur usi id author ki id ke barabar hai to render karo

  return (
    <div className="card">
      <p className="author">{props.author?.username || "Unknown author"}</p>
      <p onDoubleClick={addLike} className="content">
        {props.title}
      </p>

      {/* Media block — enforces aspect ratio */}
      {props.mediaType && props.mediaUrl && (
        <div className="postMedia">
          {props.mediaType === "image" && <img src={props.mediaUrl} alt="post" />}
          {props.mediaType === "video" && <video src={props.mediaUrl} controls />}
        </div>
      )}
      {props.currentUser && props.author._id === props.currentUser._id && (
        <div className="actions">
          <button onClick={getEdit} className="editBtn">
            edit
          </button>
          <button onClick={deletePost} className="deleteBtn">
            delete
          </button>
        </div>
      )}
      <ul className="meta">
        <li>
          <button type="button">report</button>
        </li>
        <li>
          <button type="button">share</button>
        </li>
      </ul>
      <div className="buttons">
        <button type="button" onClick={addLike} className="button">
          {likes.length}
        </button>
        <button type="button" onClick={openComment} className="button">
          comment
        </button>
        <button type="button" onClick={savePost} className="button">
          save
        </button>
      </div>
    </div>
  );
}

export default Post;
