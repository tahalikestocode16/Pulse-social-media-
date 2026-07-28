import { useState } from "react";


function SendMessage(props) {
    const [text, setText] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
      if (!text.trim()) return;
    //   dont allow them to send empty messages

    try {
      const response = await fetch(`/messages/${props.conversation._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
        }),
      });
      if(response.ok) {
        setText("");
      }
      
    } catch(err) {
      console.log(err);
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="message"
          id="chatMessage"
          placeholder="Message...."
          value={text}
          onChange={(e)=> setText(e.target.value)}
          required
        />
        <button></button>
      </form>
    </div>
  );
}

export default SendMessage;