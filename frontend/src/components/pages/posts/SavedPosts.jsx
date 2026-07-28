import { useState, useEffect} from "react";
import Post from "./Post.jsx";


function SavedPosts() {
    const [savedPosts, setSavedPosts] = useState([]);
    // backend returns an array due to find() method
    const getPosts = async() => {
        const response = await fetch("/posts/saves", {
            method: "GET",
            credentials: "include"
        });
        const data = await response.json();
        if(response.ok) {
            setSavedPosts(data);
        }
    }

    useEffect(()=> {
        getPosts();
    }, []);
    return(
        <div>
            {savedPosts.map((s)=> (
               <Post
                  key={s._id}
                  {...s}
               />
            ))}
        </div>
    );
}

export default SavedPosts;