import { io } from "socket.io-client";

// In production, connect Socket.IO directly to Railway backend
const RAILWAY_BACKEND = "https://pulse-social-media-production.up.railway.app";
const SOCKET_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? RAILWAY_BACKEND : "http://localhost:8080");

const socket = io(SOCKET_URL, {
    autoConnect: true,
    withCredentials: true
});

socket.on("connect", () => {
    console.log("connected:", socket.id);
});

export default socket;