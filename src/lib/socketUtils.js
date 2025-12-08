import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

let socket;

export const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("token");
    socket = io(SOCKET_URL, {
      auth: { token }, 
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
};