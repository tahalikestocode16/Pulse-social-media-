import { useEffect, useState } from "react";
import Post from "./Post.jsx";

function Feed() {
  const [post, setPost] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const getPosts = async () => {
    const response = await fetch("/posts/fyp", {
      method: "GET",
    });
    const data = await response.json();
    if (response.ok) {
      setPost(data);
    }
  };

  const getUser = async () => {
    const response = await fetch("/users/me", {
      method: "GET",
    });
    const data = await response.json();
    if (response.ok) {
      setCurrentUser(data);
    }
  };

  useEffect(() => {
    getPosts();
    getUser();
  }, []);

  return (
    <div>
      {post.map((p) => (
        <Post
          key={p._id}
          {...p}
          // load all data by ...p
          currentUser={currentUser}
          refreshComments={getPosts}
        />
      ))}
    </div>
  );
}

export default Feed;
