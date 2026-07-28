import { useState, useEffect} from "react";

function Notifications() {
    const [notifs, setNotifs] = useState([]);
    const getNotifications = async ()=> {
      try {
          const response = await fetch("/notifications", {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        if(response.ok) {
            setNotifs(data);
        }
      }
      catch(err) {
        console.log(err);
      }
    }
    useEffect(()=> {
    getNotifications();
}, [])
}
   
 return(
    <div>
        {notifs.map((n)=> (
            
        ))}
    </div>
 );


export default Notifications;

