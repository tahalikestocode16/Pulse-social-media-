import { useEffect, useState } from "react";

function useAuthUser() {
    const [currentUser, setCurrentUser] = useState(null);
   
    useEffect(()=> {
          async function getUser() {
           try {
              const response = await fetch("/users/me", {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if(response.ok) {
                setCurrentUser(data);
            }
           }
           catch(err) {
            console.log(err);
           }
          }
        getUser();
    }, []);

    return currentUser;
}

export default useAuthUser;