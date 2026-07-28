import { useState } from "react";

function Message(props) {
    const [isEditing, setIsEditing] = useState(false);
    const isOwner = props.currentUser?._id === props.sender._id;
    const [editedMessage, setEditedMessage] = useState(props.text);
    
    const deleteMessage = async() => {
            try {
                const response = await fetch(`/messages/${props._id}`, {
                    method: "DELETE",
                    credentials: "include",
                    // since the route is protected by islogged and is comment owner we need to send session info
                });
                if(response.ok) {
                    console.log("deleted");
                }
            }
            catch(err) {
                console.log(err)
            }
        }
    const editMessage = async()=> {
        try {
          const response = await fetch(`/messages/${props._id}`, {
            method: "PATCH",
            credentials: "include",
             headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          text: editedMessage
      })
          })
          if(response.ok) {
            setIsEditing(false);
          }
        }
        catch(err) {
            console.log(err)
        }
    }
     const cancelEdit = () => {
        setIsEditing(false);
        setEditedMessage(props.text);
     }
    return(
        <div>
            <h5>{props.sender.username}</h5>
            
          
      {isEditing ? (
        <>
          <textarea
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
          />

          <button onClick={editMessage}>Edit</button>
          <button onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          <p>{props.text}</p>

          {isOwner && (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={deleteMessage}>Delete</button>
            </>
          )}
        </>
      )}   
      <p>{props.createdAt}</p>
            <button></button>


       
        </div>
    );
}

export default Message;