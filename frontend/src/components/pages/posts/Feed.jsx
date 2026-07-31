import { useEffect, useState, useRef, useCallback } from "react";
import Post from "./Post.jsx";
import StoriesBar from "./StoriesBar.jsx";
import useAuthUser from "../utils/authUser.jsx";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [feedType, setFeedType] = useState("general");
  const [loadingMore, setLoadingMore] = useState(false);
  const currentUser = useAuthUser();
  const pageRef = useRef(1);

  const sortUserPostsToTop = (postsArray) => {
    if (!currentUser || !Array.isArray(postsArray)) return postsArray;
    const userIdStr = currentUser._id?.toString();
    return [...postsArray].sort((a, b) => {
      const aIsOwn = (a.author?._id || a.author)?.toString() === userIdStr;
      const bIsOwn = (b.author?._id || b.author)?.toString() === userIdStr;
      if (aIsOwn && !bIsOwn) return -1;
      if (!aIsOwn && bIsOwn) return 1;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  };

  const getPosts = async () => {
    try {
      if (currentUser) {
        const followingRes = await fetch("/posts/following", {
          method: "GET",
          credentials: "include",
        });
        const followingData = await followingRes.json();

        if (followingRes.ok && Array.isArray(followingData) && followingData.length > 0) {
          const sorted = sortUserPostsToTop(followingData);
          setPosts(sorted);
          setDisplayedPosts(sorted);
          setFeedType("following");
          return;
        }
      }

      const fypRes = await fetch("/posts/fyp", { method: "GET" });
      const fypData = await fypRes.json();
      if (fypRes.ok && Array.isArray(fypData)) {
        const sorted = sortUserPostsToTop(fypData);
        setPosts(sorted);
        setDisplayedPosts(sorted);
        setFeedType("general");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPosts();
  }, [currentUser]);

  // Infinite Scroll Handler
  const handleScroll = useCallback(() => {
    if (loadingMore || posts.length === 0) return;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 600) {
      setLoadingMore(true);
      setTimeout(() => {
        setDisplayedPosts((prev) => [...prev, ...posts]);
        setLoadingMore(false);
      }, 300);
    }
  }, [loadingMore, posts]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="feed" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Instagram Stories Bar */}
      <StoriesBar />

      {/* Feed Indicator Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-1)' }}>
          {currentUser ? (feedType === "following" ? "Following" : "Suggested For You") : "Explore Feed"}
        </span>
        {currentUser && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
            {feedType === "following" ? "Posts from accounts you follow" : "Discover new posts"}
          </span>
        )}
      </div>

      {/* Feed Posts */}
      {displayedPosts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ marginBottom: '8px' }}>Welcome to Pulse</h3>
          <p>No posts available right now. Follow people or create a post to see content here!</p>
        </div>
      ) : (
        displayedPosts.map((p, index) => (
          <Post
            key={`${p._id}-${index}`}
            {...p}
            currentUser={currentUser}
            refreshPosts={getPosts}
          />
        ))
      )}

      {loadingMore && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-3)', fontSize: '0.85rem' }}>
          Loading more posts...
        </div>
      )}
    </div>
  );
}

export default Feed;
