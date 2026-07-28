import { useEffect, useState } from "react";
import socket from "../../../socket";
import Message from "./Message.jsx";
import SendMessage from "./SendMessage.jsx";
import useAuthUser from "./utils/authUser";

function Chat({ conversation }) {
  const [messages, setMessages] = useState([]);
 const currentUser = useAuthUser();
  useEffect(() => {
    if (!conversation?._id) return;

    socket.emit("joinConversation", conversation._id);

    socket.on("newPulse", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on("messageUpdated", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((message) =>
          message._id === updatedMessage._id ? updatedMessage : message,
        ),
      );
    });
   socket.on("messageDeleted", (deletedMessage) => {
    setMessages((prev) =>
        prev.filter(
            (message) => message._id !== deletedMessage.messageId
            // keeps the message when filtering if its id isnt equal to the deleted messsage and we recive 
            // socket from backend
        )
    );
});


    getMessages();

    return () => {
      socket.off("newPulse");
      socket.off("messageUpdated");
      socket.off("messageDeleted");
    //   end the socket
    };
  }, [conversation]);

  const getMessages = async () => {
    try {
      const response = await fetch(`/messages/${conversation._id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        if (data.length < 1) {
          console.log(data.message);
        } else {
          setMessages(data);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {messages.map((m) => (
        <Message
          key={m._id}
          {...m}
          currentUser={currentUser}

          //    reloadChat={getMessages}
          //    dont think this is needed due to socket
        />
      ))}
      <SendMessage conversation={conversation}></SendMessage>
    </div>
  );
}

export default Chat;
