import Comment from "./CommentCard.jsx";
import { useEffect, useState } from "react";

function CommentSection() {
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const getComments = async () => {
    try {
      const response = await fetch(`/comments/${id}`, {
        method: "GET",
      });

      const data = await response.json();
      if (response.ok) {
        setComments(data);
        // backend returns an array
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getComments();
    getUser();
  }, []);
  return (
    <div>
      <Comment
        _id={comment._id}
        author={comment.author}
        message={comment.message}
        createdAt={comment.createdAt}
        currentUser={currentUser}
        refreshComments={getComments}
      />
    </div>
  );
}
