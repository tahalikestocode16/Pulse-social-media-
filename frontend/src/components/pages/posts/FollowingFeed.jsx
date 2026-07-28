import { useEffect, useState } from "react";
import Post from "./Post.jsx";
import useAuthUser from "../utils/authUser.jsx";

function FollowingFeed() {
  const [post, setPost] = useState([]);
  const currentUser = useAuthUser();
  
  const getPosts = async () => {
    const response = await fetch("/posts/following", {
      method: "GET",
    });
    const data = await response.json();
    if (response.ok) {
      setPost(data);
    }
  };

  

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      {post.map((p) => (
        <Post
          key={p._id}
          {...p}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}

export default FollowingFeed;
