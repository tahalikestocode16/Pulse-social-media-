import Feed from "./posts/Feed.jsx";
import LeftNav from "./LeftNav.jsx";
import RightSidebar from "./RightSidebar.jsx";
import MobileHeader from "./MobileHeader.jsx";
import MobileBottomNav from "./MobileBottomNav.jsx";

function Home() {
  return (
    <div className="page">
      <MobileHeader />
      <LeftNav />

      {/* Center Feed Column */}
      <div className="feedCol">
        <Feed />
      </div>

      {/* Right Sidebar Suggestions */}
      <RightSidebar />

      <MobileBottomNav />
    </div>
  );
}

export default Home;
