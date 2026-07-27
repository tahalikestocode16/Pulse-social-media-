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

  const openComment = ()=> {
    navigate(`/posts/${props._id}/comments`);
    // setup comments 
  }

  const getEdit = ()=> {
    navigate(`/posts/${props._id}/edit`);
  }
  
  const deletePost = async () => {
    try {
      const response = await fetch(`/posts/${props._id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if(response.ok) {
        if(props.refreshPosts) {
          props.refreshPosts();
        }
      }
    }
    catch(err) {
      console.log(err);
    }
  }

  
  // agar current user exist karta hai to aur usi id author ki id ke barabar hai to render karo

  return (
    <div>
      <p onClick={openProfile} className="author">
        {props.author}
      </p>
      <p onDoubleClick={addLike} className="content">
        {props.content}
      </p>
       {props.media &&  (
            <img src={props.mediaUrl}/>
        )}
         {props.currentUser && 
          props.author._id === props.currentUser._id && (
          <div>
            <button onClick={getEdit} className="editBtn">edit</button>
            <button onClick={deletePost} className="deleteBtn">delete</button>
            </div>   
        )}
        <ul>
          <button>report</button>
          <button> share</button>
        </ul>
      <button onClick={addLike} className="button">
        {likes.length}
      </button>
      <button onClick={openComment} classname="button">
      </button>
      <button className="save"></button>

    </div>
  );
}

export default Post;
