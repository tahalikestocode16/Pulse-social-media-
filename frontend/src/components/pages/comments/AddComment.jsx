import { useState, useEffect } from "react";

function EditComment() {
    const [comment, setComment] = useState("");
    const { id } = useParams();
    
    
    const addCom = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/comments/${id}`, {
            method: "POST",
            credentials: "include",
             headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: comment,
              
             })

        });
        const data = await response.json();
        if(response.ok) {
            setComment(data.message);
            navigate(-1);
        }
        }
        catch(err) {
            console.log(err);
        }
    }

   
    return(
        <form onSubmit={addCom}>
            <textarea value={comment} placeholder="enter message" onChange={(e)=> setComment(e.target.value)}></textarea>
            <button>comment</button>
        </form>
    ); 
}