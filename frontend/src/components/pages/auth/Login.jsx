import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   for showing errors on frontend
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async(event)=> {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("/auth/login", {
           method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                username,
                password,
             })
      });
      const data = await response.json();
      if(response.ok) {
        navigate("/profile")
      }
      else {
        setError(data.message)
      };
    }
    catch(err) {
        console.log(err);
    }
  }

  return (
    <div>
      <form className="Login" onSubmit={onSubmit}>
        <h2>Register</h2>
        <input
          name="username"
          placeholder="enter username"
          className="username"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <input
          name="email"
          placeholder="enter email"
          className="email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          name="password"
          placeholder="enter password"
          className="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button className="create">Login</button>
      </form>
    </div>
  );
}

export default Login;
