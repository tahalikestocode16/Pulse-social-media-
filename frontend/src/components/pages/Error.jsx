import { useNavigate } from "react-router-dom";

function Error() {
    const navigate = useNavigate();
    return(
        <div className="errorPage">
                   <h1>Something went wrong</h1>

            <p>
                The page you are looking for does not exist.
            </p>

            <button onClick={() => navigate("/")}>
                Go Home
            </button>

        </div>
    );
}

export default Error;