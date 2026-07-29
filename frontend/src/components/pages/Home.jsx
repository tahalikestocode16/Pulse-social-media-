import Feed from "./posts/Feed.jsx";
import LeftNav from "./LeftNav.jsx";
import RightSidebar from "./RightSidebar.jsx";

function Home() {
  return (
    <main className="page">
      {/* Left 20% — nav: profile, DMs, notifications */}
      <LeftNav />

      {/* Center 40% — Pulse heading + posts feed */}
      <div className="feedCol">
        <section className="hero" />
        <Feed />
      </div>

      {/* Right ~38% — follow suggestions */}
      <RightSidebar />
    </main>
  );
}

export default Home;
