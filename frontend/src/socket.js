import { io } from "socket.io-client";

// In dev: Vite proxy isn't used for WebSockets, so we connect directly.
// In prod: VITE_API_URL points to the Railway backend.
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const socket = io(SOCKET_URL, {
    autoConnect: true,
    withCredentials: true
});

socket.on("connect", () => {
    console.log("connected:", socket.id);
});

export default socket;