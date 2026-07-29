import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const [title, setTitle] = useState("");
    const [media, setMedia] = useState(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("media", media);

            const response = await fetch("/posts/create", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/posts");
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <form
                className="createPost"
                onSubmit={onSubmit}
                encType="multipart/form-data"
            >
                <input
                    type="text"
                    placeholder="Title (optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setMedia(e.target.files[0])}
                    required
                />

                <button type="submit">Post</button>

                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default CreatePost;