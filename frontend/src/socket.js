import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
    autoConnect: true,
    withCredentials: true
});

socket.on("connect", () => {
    console.log("connected:", socket.id);
});

export default socket;