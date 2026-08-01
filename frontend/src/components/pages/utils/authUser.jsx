import { useEffect, useState } from "react";

function useAuthUser() {
    const [currentUser, setCurrentUser] = useState(null);
   
    const getUser = async () => {
        try {
            const response = await fetch("/users/me", {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if(response.ok) {
                setCurrentUser(data);
            }
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getUser();

        const handleUpdate = () => getUser();
        window.addEventListener("userUpdated", handleUpdate);
        return () => window.removeEventListener("userUpdated", handleUpdate);
    }, []);

    return currentUser;
}

export default useAuthUser;