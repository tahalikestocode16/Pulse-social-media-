import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
    auth: {
        userId: currentUser._id
    }
});
// passing userid to backend so it can assign it to socket id 

socket.on("connect", () => {
    console.log("connected:", socket.id);
});

export default socket;