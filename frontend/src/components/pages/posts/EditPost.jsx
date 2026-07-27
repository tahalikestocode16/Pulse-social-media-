import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditPost() {
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
     const navigate = useNavigate();
      const { id } = useParams();

    const onSubmit = async(event)=> {
         event.preventDefault();
        setError("");
      try {
       
        const response = await fetch(`/posts/${id}`, {
                method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                content,
                // media,
                // dont send author from frontent since someone can fake it
                // have to confirm media name in backend and we cant stringigy image 
             })
        });
        const data = await response.json();
        if(response.ok) {
            navigate("/posts")
            // will later change to show that created post
        }
        else {
            setError(data.message)
        }
      }
      catch(err) {
        console.log(err);
      }
    };


    return(
        <div>
            <form className="editPost" onSubmit={onSubmit}>
              <textarea className="content" name="content" onChange={(e)=> setContent(e.target.value)} required></textarea>
              <button>Edit post</button>
            </form>
        </div>
    );
}
   export default EditPost;