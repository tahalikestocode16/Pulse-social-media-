import { useEffect, useState } from "react";
import useAuthUser from "./utils/authUser.jsx";

function RightSidebar() {
  const user = useAuthUser();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetch("/users/suggestions", { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then(data => setSuggestions(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  /* ── Not logged in ─────────────────────────────────────────── */
  if (!user && !loading) {
    return (
      <aside className="rightSidebar">
        <div className="sideSignIn">
          <p className="sideSignInText">Sign in to see who to follow.</p>
          <a href="/login"    className="sideSignInBtn">Log in</a>
          <div className="sideOr"><span>or</span></div>
          <a href="/register" className="sideRegisterBtn">Create account</a>
        </div>
        <p className="sideFooter">© 2026 Pulse</p>
      </aside>
    );
  }

  return (
    <aside className="rightSidebar">

      {/* Header */}
      <div className="suggestHeader">
        <span className="suggestTitle">Suggested for you</span>
        <a href="/explore" className="suggestSeeAll">See all</a>
      </div>

      {/* Skeleton */}
      {loading && [1,2,3,4,5].map(i => (
        <div key={i} className="suggestRow">
          <div className="suggestAvatar skeleton" />
          <div className="suggestName skeleton" style={{height:11,width:"55%",borderRadius:4}} />
          <div className="skeleton" style={{height:26,width:54,borderRadius:20,flexShrink:0}} />
        </div>
      ))}

      {/* Empty */}
      {!loading && suggestions.length === 0 && (
        <p className="suggestEmptyText">No suggestions right now.</p>
      )}

      {/* Suggestion rows */}
      {!loading && suggestions.map(s => (
        <div key={s._id} className="suggestRow">
          {/* Avatar */}
          <div className="suggestAvatar">
            <img src={s.profilePic} alt={s.username} className="suggestAvatarImg" />
          </div>

          {/* Name */}
          <p className="suggestName">{s.username}</p>

          {/* Follow only */}
          <button className="suggestFollow">Follow</button>
        </div>
      ))}

      <div className="sideDivider" />
      <p className="sideFooter">© 2026 Pulse</p>
    </aside>
  );
}

export default RightSidebar;
