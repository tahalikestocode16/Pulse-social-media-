import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   for showing errors on frontend
    const [error, setError] = useState("");
    const navigate = useNavigate();

  const onSubmit = async (event)=> {
     event.preventDefault();
     setError("");
    try {
           let response = await fetch("/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                username,
                email,
                password,
                // if its stringigying how iwll i get pfp later 
                // dont need fields like bio and pfp while registering we can have a page after regiser write before home for pfp
     })

  });
  // needs await
  const data = await response.json();
  if(response.ok) {
     navigate("/profile");
    //  will navigate here for pfp later
  }
  else {
    setError(data.message);
  }
    }
    catch(err) {
       console.log(err);
    }
    
}

//   in future add account already exists if it does exist

  return (
    <div className="regisForm">
      <form className="Register" onSubmit={onSubmit}>
         <h2>Register</h2>
         <input name="username" placeholder="enter username" className="username" onChange={(e) => setUsername(e.target.value)}></input>
           <input name="email" placeholder="enter email" className="email" onChange={(e)=> setEmail(e.target.value)}></input>
             <input name="password" placeholder="enter password" className="password" onChange={(e)=> setPassword(e.target.value)}></input>
         <button className="create">Create account</button>
      </form>
    </div>
  );
}

export default Register;