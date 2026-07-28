import { useEffect, useState } from "react";
import Post from "./Post.jsx";
// import useAuthUser from "../utils/authUser.jsx";

function Feed() {
  const [post, setPost] = useState([]);
  // const currentUser = useAuthUser();

  const getPosts = async () => {
    const response = await fetch("/posts/fyp", {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
setPost(data);
    if (response.ok) {
      setPost(data);
    }
  };

  

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="feed">
      {post.length === 0 ? (
        <div className="placeholder">
        </div>
      ) : (
        post.map((p) => (
          <Post
            key={p._id}
            {...p}
            // currentUser={currentUser}
            refreshComments={getPosts}
          />
        ))
      )}
    </div>
  );
}

export default Feed;
