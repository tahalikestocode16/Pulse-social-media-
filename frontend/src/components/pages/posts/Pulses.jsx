import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReelsFeedModal from "./ReelsFeedModal.jsx";
import useAuthUser from "../utils/authUser.jsx";
import LeftNav from "../LeftNav.jsx";
import MobileHeader from "../MobileHeader.jsx";
import MobileBottomNav from "../MobileBottomNav.jsx";

const DUMMY_PULSES = [
  { _id: "pls1", title: "Cyberpunk City Lights & Neon Visuals", mediaUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80", mediaType: "image", author: { username: "neon_vibe", profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" }, likes: ["1", "2"] },
  { _id: "pls2", title: "Minimal Dark Architecture setup", mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80", mediaType: "image", author: { username: "alex_design", profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" }, likes: ["1", "2", "3"] },
  { _id: "pls3", title: "Deep Space Cosmos Visuals", mediaUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80", mediaType: "image", author: { username: "cosmos_hub", profilePic: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80" }, likes: ["1", "2", "3", "4"] }
];

function Pulses() {
  const [posts, setPosts] = useState(DUMMY_PULSES);
  const currentUser = useAuthUser();
  const navigate = useNavigate();

  const fetchPulses = async () => {
    try {
      const res = await fetch("/posts/fyp", { credentials: "include" });
      const data = await res.json();
      if (res.ok && Array.isArray(data) && data.length > 0) {
        setPosts(data);
      }
    } catch (err) {
      console.log("Failed to fetch pulses:", err);
    }
  };

  useEffect(() => {
    fetchPulses();
  }, []);

  return (
    <div className="page" style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      <MobileHeader />
      <LeftNav />

      {/* Always Open Full Screen Instagram Reels Experience */}
      <ReelsFeedModal
        isOpen={true}
        onClose={() => navigate("/")}
        posts={posts}
        initialIndex={0}
        currentUser={currentUser}
        refreshPosts={fetchPulses}
      />

      <MobileBottomNav />
    </div>
  );
}

export default Pulses;
